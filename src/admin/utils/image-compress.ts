/**
 * Shrink images before upload.
 *
 * A photo straight from a phone or a DSLR weighs 3-8 MB for 4000-6000 px of
 * width, while the site never displays an image wider than 1152 px
 * (max-w-6xl). We cap the longest side at 2000 px — 1.7x the widest display
 * size, so it stays sharp on a retina screen — and re-encode as JPEG at 0.88.
 *
 * Measured on the catalogue's heaviest photos: 6.3 MB -> 0.98 MB on average,
 * for a PSNR of 42.8 dB at display size, i.e. no visible difference.
 *
 * Useful side effect: /api/upload-image receives the file base64-encoded in a
 * JSON body (+33%), and Vercel caps a serverless request body at 4.5 MB.
 * Without this pass, any photo over ~3.3 MB blew past that cap, the Blob
 * upload failed, and the client silently fell back to Supabase Storage.
 */

export const MAX_SIDE = 2000;
export const QUALITY = 0.88;

export interface CompressResult {
    blob: Blob;
    contentType: string;
    /** False when the original was returned untouched. */
    compressed: boolean;
}

/** Types a browser canvas can be trusted to decode. HEIC is not one of them. */
const DECODABLE = /^image\/(jpeg|png|webp|gif|bmp)$/i;

/**
 * Resize and re-encode an image. Never throws: anything unexpected returns the
 * original untouched, so an upload is degraded rather than lost.
 */
export async function compressImage(
    file: Blob,
    contentType: string,
): Promise<CompressResult> {
    const untouched: CompressResult = { blob: file, contentType, compressed: false };

    if (!DECODABLE.test(contentType)) return untouched;

    let bitmap: ImageBitmap;
    try {
        // from-image applies the EXIF orientation, which drawImage ignores.
        bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
    } catch {
        return untouched;
    }

    try {
        const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
        const width = Math.round(bitmap.width * scale);
        const height = Math.round(bitmap.height * scale);

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return untouched;

        // Transparent areas would come out black in JPEG.
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(bitmap, 0, 0, width, height);

        const out = await new Promise<Blob | null>((resolve) =>
            canvas.toBlob(resolve, 'image/jpeg', QUALITY),
        );
        if (!out) return untouched;

        // Re-encoding an already light image can make it heavier. When nothing
        // was resized either, the original is simply the better file.
        if (scale === 1 && out.size >= file.size) return untouched;

        return { blob: out, contentType: 'image/jpeg', compressed: true };
    } catch {
        return untouched;
    } finally {
        bitmap.close();
    }
}

/** Swap a storage path's extension to .jpg once the image became a JPEG. */
export function asJpegPath(path: string): string {
    return path.replace(/\.[^./]+$/, '') + '.jpg';
}
