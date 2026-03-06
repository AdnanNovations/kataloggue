import type { APIRoute } from 'astro';
import { writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';

export const prerender = false;

const UPLOAD_DIR = process.env.UPLOAD_DIR || join(process.cwd(), 'uploads');
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

const ALLOWED_TYPES: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
};

export const POST: APIRoute = async ({ locals, request }) => {
  try {
    const { user } = locals;

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return new Response(JSON.stringify({ error: 'File diperlukan' }), { status: 400 });
    }

    // Validate file type via MIME
    const ext = ALLOWED_TYPES[file.type];
    if (!ext) {
      return new Response(JSON.stringify({ error: 'Format file tidak didukung. Gunakan JPG, PNG, atau WebP.' }), { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return new Response(JSON.stringify({ error: 'Ukuran file maksimal 2MB' }), { status: 400 });
    }

    // Use a random UUID to prevent filename guessing/collision
    const fileName = `${randomUUID()}${ext}`;

    await mkdir(UPLOAD_DIR, { recursive: true });

    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(join(UPLOAD_DIR, fileName), buffer);

    return new Response(JSON.stringify({ url: `/uploads/${fileName}` }), { status: 201 });
  } catch {
    return new Response(JSON.stringify({ error: 'Gagal mengupload file' }), { status: 500 });
  }
};
