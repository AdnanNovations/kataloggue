import type { APIRoute } from 'astro';
import { readFile, stat } from 'node:fs/promises';
import { join, extname } from 'node:path';

export const prerender = false;

const UPLOAD_DIR = process.env.UPLOAD_DIR || join(process.cwd(), 'uploads');

const MIME_TYPES: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
};

export const GET: APIRoute = async ({ params }) => {
  const filePath = params.path;
  if (!filePath) {
    return new Response('Not found', { status: 404 });
  }

  // Prevent directory traversal
  if (filePath.includes('..')) {
    return new Response('Forbidden', { status: 403 });
  }

  const fullPath = join(UPLOAD_DIR, filePath);

  try {
    await stat(fullPath);
    const buffer = await readFile(fullPath);
    const ext = extname(fullPath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    return new Response(buffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch {
    return new Response('Not found', { status: 404 });
  }
};
