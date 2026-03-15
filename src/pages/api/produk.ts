import type { APIRoute } from 'astro';
import { query } from '../../lib/db';
import type { VariantGroup } from '../../lib/db';

export const prerender = false;

function validateImages(images: any): string | null {
  if (!images) return null;
  if (!Array.isArray(images) || images.length > 5) return null;
  const valid = images.filter((u: any) => typeof u === 'string' && u.startsWith('/uploads/'));
  return valid.length > 0 ? JSON.stringify(valid) : null;
}

function validateVariants(variants: any): string | null {
  if (!variants || !Array.isArray(variants) || variants.length === 0) return null;
  const valid: VariantGroup[] = variants.slice(0, 10).map((g: any) => ({
    label: String(g.label || '').trim(),
    options: (Array.isArray(g.options) ? g.options : []).slice(0, 20).map((o: any) => ({
      name: String(o.name || '').trim(),
      priceAdjust: Number(o.priceAdjust) || 0,
    })).filter((o: any) => o.name),
  })).filter((g: any) => g.label && g.options.length > 0);
  return valid.length > 0 ? JSON.stringify(valid) : null;
}

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
    const imagesJson = validateImages(body.images);
    const variantsJson = validateVariants(body.variants);
    const imageUrl = body.images?.length > 0 ? body.images[0] : (body.image_url || null);

    const { rows } = await query(
      `INSERT INTO products (store_id, name, slug, description, price, image_url, images, variants, category, is_available, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
      [storeId, body.name.trim(), body.slug.trim(), body.description || null, body.price, imageUrl, imagesJson, variantsJson, body.category || null, body.is_available ?? true, body.sort_order ?? 0],
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
    const imagesJson = validateImages(body.images);
    const variantsJson = validateVariants(body.variants);
    const imageUrl = body.images?.length > 0 ? body.images[0] : (body.image_url || null);

    const { rows } = await query(
      `UPDATE products SET name = $1, slug = $2, description = $3, price = $4, image_url = $5, images = $6, variants = $7, category = $8, is_available = $9, sort_order = $10
       WHERE id = $11 AND store_id = $12 RETURNING *`,
      [body.name, body.slug, body.description || null, body.price, imageUrl, imagesJson, variantsJson, body.category || null, body.is_available, body.sort_order, body.id, storeId],
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
