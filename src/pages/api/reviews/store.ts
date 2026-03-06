import type { APIRoute } from 'astro';
import { query } from '../../../lib/db';

export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
  const storeId = url.searchParams.get('store_id');
  if (!storeId) {
    return new Response(JSON.stringify({ error: 'store_id wajib diisi' }), { status: 400 });
  }

  const page = Math.max(1, parseInt(url.searchParams.get('page') || '1'));
  const limit = Math.min(50, Math.max(1, parseInt(url.searchParams.get('limit') || '10')));
  const offset = (page - 1) * limit;

  const [{ rows: reviews }, { rows: countRows }] = await Promise.all([
    query(
      'SELECT * FROM store_reviews WHERE store_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3',
      [storeId, limit, offset],
    ),
    query(
      'SELECT COUNT(*)::int AS total, COALESCE(AVG(rating), 0)::numeric(2,1) AS avg_rating FROM store_reviews WHERE store_id = $1',
      [storeId],
    ),
  ]);

  return new Response(JSON.stringify({
    reviews,
    total: countRows[0].total,
    avg_rating: parseFloat(countRows[0].avg_rating),
    page,
    limit,
  }));
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { store_id, reviewer_name, rating, comment } = body;

    if (!store_id || !reviewer_name?.trim()) {
      return new Response(JSON.stringify({ error: 'store_id dan nama wajib diisi' }), { status: 400 });
    }

    const ratingNum = parseInt(rating);
    if (!ratingNum || ratingNum < 1 || ratingNum > 5) {
      return new Response(JSON.stringify({ error: 'Rating harus antara 1-5' }), { status: 400 });
    }

    if (comment && comment.length > 1000) {
      return new Response(JSON.stringify({ error: 'Komentar maksimal 1000 karakter' }), { status: 400 });
    }

    // Verify store exists
    const { rows: stores } = await query('SELECT id FROM stores WHERE id = $1', [store_id]);
    if (stores.length === 0) {
      return new Response(JSON.stringify({ error: 'Toko tidak ditemukan' }), { status: 404 });
    }

    const { rows } = await query(
      'INSERT INTO store_reviews (store_id, reviewer_name, rating, comment) VALUES ($1, $2, $3, $4) RETURNING *',
      [store_id, reviewer_name.trim(), ratingNum, comment?.trim() || null],
    );

    return new Response(JSON.stringify(rows[0]), { status: 201 });
  } catch {
    return new Response(JSON.stringify({ error: 'Terjadi kesalahan server' }), { status: 500 });
  }
};
