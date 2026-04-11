/**
 * Image upload endpoint — stores images in Vercel Blob Storage.
 *
 * Replaces Supabase Storage for tour images. Vercel Blob is served via
 * Vercel's edge CDN (100 GB free egress vs Supabase's 5 GB), with
 * automatic cache headers and global distribution.
 *
 * Required env var:
 *   BLOB_READ_WRITE_TOKEN — from Vercel Dashboard > Storage > Blob > Tokens
 *
 * Usage from the admin:
 *   POST /api/upload-image
 *   Content-Type: multipart/form-data
 *   Body: file (image), path (string — e.g. "tours/1/123-edit.jpg")
 *
 * Returns: { url: "https://xyz.public.blob.vercel-storage.com/tours/1/..." }
 */
import { put } from '@vercel/blob';
import type { IncomingMessage, ServerResponse } from 'http';

export const config = { api: { bodyParser: false } };

// Parse multipart form data manually (Vercel serverless doesn't have multer)
async function parseMultipart(req: IncomingMessage): Promise<{ file: Buffer; contentType: string; path: string }> {
    return new Promise((resolve, reject) => {
        const chunks: Buffer[] = [];
        req.on('data', (chunk: Buffer) => chunks.push(chunk));
        req.on('error', reject);
        req.on('end', () => {
            const body = Buffer.concat(chunks);
            const contentTypeHeader = req.headers['content-type'] || '';

            // If content-type is application/json, parse as JSON (base64 upload)
            if (contentTypeHeader.includes('application/json')) {
                try {
                    const json = JSON.parse(body.toString('utf-8'));
                    const fileBuffer = Buffer.from(json.file, 'base64');
                    resolve({
                        file: fileBuffer,
                        contentType: json.contentType || 'image/jpeg',
                        path: json.path || `uploads/${Date.now()}.jpg`,
                    });
                } catch (e) {
                    reject(new Error('Invalid JSON body: ' + (e as Error).message));
                }
                return;
            }

            reject(new Error('Unsupported content type. Send JSON with base64 file.'));
        });
    });
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
    if (req.method !== 'POST') {
        res.writeHead(405).end(JSON.stringify({ error: 'Method not allowed' }));
        return;
    }

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
        res.writeHead(500).end(JSON.stringify({ error: 'Blob storage not configured (BLOB_READ_WRITE_TOKEN missing)' }));
        return;
    }

    try {
        const { file, contentType, path } = await parseMultipart(req);

        if (file.length === 0) {
            res.writeHead(400).end(JSON.stringify({ error: 'Empty file' }));
            return;
        }

        if (file.length > 10 * 1024 * 1024) {
            res.writeHead(400).end(JSON.stringify({ error: 'File too large (max 10 MB)' }));
            return;
        }

        // path includes: "tours/1/123456-edit.jpg" or "stops/1/stop-0-123.jpg"
        const safePath = path.replace(/\.\./g, '').replace(/^\/+/, '');

        const blob = await put(safePath, file, {
            access: 'public',
            contentType,
            addRandomSuffix: false, // keep our filename as-is
        });

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ url: blob.url }));
    } catch (err) {
        console.error('Upload error:', err);
        res.writeHead(500).end(JSON.stringify({ error: 'Upload failed' }));
    }
}
