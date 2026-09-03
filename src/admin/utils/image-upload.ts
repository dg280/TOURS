/**
 * Upload an image to Vercel Blob Storage via /api/upload-image.
 *
 * Replaces supabase.storage.from("tour_images").upload() for all admin
 * image uploads. Images are served from Vercel's edge CDN (100 GB free
 * egress, global distribution, automatic caching).
 *
 * Images are shrunk before upload (see ./image-compress): the site never
 * shows more than 1152 px, so sending a 6000 px original wastes bytes nobody
 * sees and overflows Vercel's 4.5 MB request body cap.
 *
 * Falls back to Supabase Storage if /api/upload-image is not available
 * (e.g. local dev without BLOB_READ_WRITE_TOKEN). That fallback is a last
 * resort, not a normal path: it is logged loudly and reported through
 * `source` so callers can warn the operator.
 */

import { supabase } from "@/lib/supabase";
import { asJpegPath, compressImage } from "./image-compress";

/**
 * Hard ceiling on what we send, after compression.
 *
 * /api/upload-image receives the file base64-encoded inside a JSON body,
 * which inflates it by a third, and Vercel rejects a serverless request body
 * over 4.5 MB. 3.3 MB is what survives that trip. Compression brings real
 * photos to about 1 MB, so this should never fire — if it does, something
 * genuinely odd is being uploaded.
 */
const MAX_UPLOAD_BYTES = Math.floor(3.3 * 1024 * 1024);

interface UploadResult {
    url: string;
    source: 'vercel-blob' | 'supabase';
}

/**
 * Convert a File or Blob to a base64 string.
 */
function toBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const result = reader.result as string;
            // Strip "data:image/jpeg;base64," prefix
            const base64 = result.split(',')[1];
            resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}

/**
 * Upload an image. Tries Vercel Blob first, falls back to Supabase Storage.
 *
 * @param path — Storage path (e.g. "tours/1/123456-edit.jpg")
 * @param file — The image File or Blob
 * @param contentType — MIME type (e.g. "image/jpeg")
 */
export async function uploadImage(
    path: string,
    file: File | Blob,
    contentType: string = 'image/jpeg',
): Promise<UploadResult> {
    const shrunk = await compressImage(file, contentType);
    if (shrunk.compressed) {
        file = shrunk.blob;
        contentType = shrunk.contentType;
        path = asJpegPath(path);
    }

    if (file.size > MAX_UPLOAD_BYTES) {
        throw new Error(
            `Image trop lourde : ${(file.size / 1048576).toFixed(1)} Mo après ` +
            `compression, maximum ${(MAX_UPLOAD_BYTES / 1048576).toFixed(1)} Mo.`,
        );
    }

    // Try Vercel Blob first
    try {
        const base64 = await toBase64(file);
        const res = await fetch('/api/upload-image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ file: base64, path, contentType }),
        });

        if (res.ok) {
            const data = await res.json();
            return { url: data.url, source: 'vercel-blob' };
        }

        // If the endpoint returns 500 with "not configured", fall through to Supabase
        const errorBody = await res.json().catch(() => ({}));
        console.error(
            `Vercel Blob upload failed (HTTP ${res.status}), falling back to Supabase Storage. ` +
            `This is not normal in production — check BLOB_READ_WRITE_TOKEN.`,
            errorBody,
        );
    } catch (err) {
        console.error(
            'Vercel Blob unreachable, falling back to Supabase Storage. ' +
            'This is not normal in production — check BLOB_READ_WRITE_TOKEN.',
            err,
        );
    }

    // Fallback: Supabase Storage
    if (!supabase) {
        throw new Error('No storage backend available (Vercel Blob failed, Supabase not configured)');
    }

    const { error: uploadError } = await supabase.storage
        .from('tour_images')
        .upload(path, file, { contentType, cacheControl: '31536000', upsert: true });

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
        .from('tour_images')
        .getPublicUrl(path);

    return { url: publicUrl, source: 'supabase' };
}
