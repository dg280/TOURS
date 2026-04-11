/**
 * Upload an image to Vercel Blob Storage via /api/upload-image.
 *
 * Replaces supabase.storage.from("tour_images").upload() for all admin
 * image uploads. Images are served from Vercel's edge CDN (100 GB free
 * egress, global distribution, automatic caching).
 *
 * Falls back to Supabase Storage if /api/upload-image is not available
 * (e.g. local dev without BLOB_READ_WRITE_TOKEN).
 */

import { supabase } from "@/lib/supabase";

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
        console.warn('Vercel Blob upload failed, falling back to Supabase:', errorBody);
    } catch (err) {
        console.warn('Vercel Blob unavailable, falling back to Supabase:', err);
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
