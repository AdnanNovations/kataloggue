import type { APIRoute } from 'astro';
import { query } from '../../lib/db';

export const prerender = false;

export const POST: APIRoute = async ({ locals, request }) => {
  try {
    const { user } = locals;
    const body = await request.json();

    if (!body.name?.trim() || !body.slug?.trim() || body.price == null) {
      return new Response(JSON.stringify({ error: 'Nama, slug, dan harga wajib diisi' }), { status: 400 });
    }

    const { rows: stores } = await query('SELECT id FROM stores WHERE user_id = $1', [user.id]);
    if (stores.length === 0) return new Response(JSON.stringify({ error: 'Toko tidak ditemukan' }), { status: 404 });

    const storeId = stores[0].id;
    const { rows } = await query(
      `INSERT INTO products (store_id, name, slug, description, price, image_url, category, is_available, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [storeId, body.name.trim(), body.slug.trim(), body.description || null, body.price, body.image_url || null, body.category || null, body.is_available ?? true, body.sort_order ?? 0],
    );

    return new Response(JSON.stringify(rows[0]), { status: 201 });
  } catch (err: any) {
    if (err?.code === '23505') {
      return new Response(JSON.stringify({ error: 'Slug produk sudah digunakan di toko ini' }), { status: 409 });
    }
    return new Response(JSON.stringify({ error: 'Terjadi kesalahan server' }), { status: 500 });
  }
};

export const PUT: APIRoute = async ({ locals, request }) => {
  try {
    const { user } = locals;
    const body = await request.json();

    if (!body.id) return new Response(JSON.stringify({ error: 'ID produk diperlukan' }), { status: 400 });

    const { rows: stores } = await query('SELECT id FROM stores WHERE user_id = $1', [user.id]);
    if (stores.length === 0) return new Response(JSON.stringify({ error: 'Toko tidak ditemukan' }), { status: 404 });

    const storeId = stores[0].id;
    const { rows } = await query(
      `UPDATE products SET name = $1, slug = $2, description = $3, price = $4, image_url = $5, category = $6, is_available = $7, sort_order = $8
       WHERE id = $9 AND store_id = $10 RETURNING *`,
      [body.name, body.slug, body.description || null, body.price, body.image_url || null, body.category || null, body.is_available, body.sort_order, body.id, storeId],
    );

    if (rows.length === 0) return new Response(JSON.stringify({ error: 'Produk tidak ditemukan' }), { status: 404 });
    return new Response(JSON.stringify(rows[0]));
  } catch (err: any) {
    if (err?.code === '23505') {
      return new Response(JSON.stringify({ error: 'Slug produk sudah digunakan di toko ini' }), { status: 409 });
    }
    return new Response(JSON.stringify({ error: 'Terjadi kesalahan server' }), { status: 500 });
  }
};

export const DELETE: APIRoute = async ({ locals, request }) => {
  try {
    const { user } = locals;
    const { id } = await request.json();

    if (!id) return new Response(JSON.stringify({ error: 'ID produk diperlukan' }), { status: 400 });

    const { rows: stores } = await query('SELECT id FROM stores WHERE user_id = $1', [user.id]);
    if (stores.length === 0) return new Response(JSON.stringify({ error: 'Toko tidak ditemukan' }), { status: 404 });

    await query('DELETE FROM products WHERE id = $1 AND store_id = $2', [id, stores[0].id]);
    return new Response(JSON.stringify({ success: true }));
  } catch {
    return new Response(JSON.stringify({ error: 'Terjadi kesalahan server' }), { status: 500 });
  }
};
