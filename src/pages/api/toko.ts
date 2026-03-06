import type { APIRoute } from 'astro';
import { query } from '../../lib/db';
import { isValidTheme } from '../../lib/theme';

export const prerender = false;

const SLUG_RE = /^[a-z0-9][a-z0-9-]*[a-z0-9]$/;

export const POST: APIRoute = async ({ locals, request }) => {
  try {
    const { user } = locals;
    const body = await request.json();

    if (!body.name?.trim() || !body.slug?.trim() || !body.wa_number?.trim()) {
      return new Response(JSON.stringify({ error: 'Nama, slug, dan nomor WhatsApp wajib diisi' }), { status: 400 });
    }

    if (!SLUG_RE.test(body.slug) || body.slug.length > 60) {
      return new Response(JSON.stringify({ error: 'Slug hanya boleh huruf kecil, angka, dan strip' }), { status: 400 });
    }

    // Check if user already has a store
    const { rows: existing } = await query('SELECT id FROM stores WHERE user_id = $1', [user.id]);

    const theme = body.theme && isValidTheme(body.theme) ? body.theme : 'default';

    if (existing.length > 0) {
      const { rows, rowCount } = await query(
        `UPDATE stores SET name = $1, slug = $2, description = $3, wa_number = $4, address = $5, logo_url = $6, theme = $7
         WHERE id = $8 RETURNING *`,
        [body.name.trim(), body.slug.trim(), body.description || null, body.wa_number.trim(), body.address || null, body.logo_url || null, theme, existing[0].id],
      );

      if (rowCount === 0) return new Response(JSON.stringify({ error: 'Gagal update toko' }), { status: 400 });
      return new Response(JSON.stringify(rows[0]));
    }

    const { rows, rowCount } = await query(
      `INSERT INTO stores (user_id, name, slug, description, wa_number, address, logo_url, theme)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [user.id, body.name.trim(), body.slug.trim(), body.description || null, body.wa_number.trim(), body.address || null, body.logo_url || null, theme],
    );

    if (rowCount === 0) return new Response(JSON.stringify({ error: 'Gagal membuat toko' }), { status: 400 });
    return new Response(JSON.stringify(rows[0]), { status: 201 });
  } catch (err: any) {
    if (err?.code === '23505') {
      return new Response(JSON.stringify({ error: 'Slug sudah digunakan toko lain' }), { status: 409 });
    }
    return new Response(JSON.stringify({ error: 'Terjadi kesalahan server' }), { status: 500 });
  }
};
