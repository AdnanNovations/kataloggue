import type { APIRoute } from 'astro';
import { query } from '../../lib/db';
import { createHash } from 'node:crypto';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { store_id, product_id, page_type } = body;

    if (!store_id || !page_type || !['store', 'product'].includes(page_type)) {
      return new Response(null, { status: 400 });
    }

    // Compute privacy-safe visitor hash from IP + User-Agent
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      || request.headers.get('x-real-ip')
      || 'unknown';
    const ua = request.headers.get('user-agent') || 'unknown';
    const visitorHash = createHash('sha256').update(`${ip}|${ua}`).digest('hex');

    // Dedup: skip if same visitor+page within last 24h
    const dedupQuery = product_id
      ? `SELECT 1 FROM page_views WHERE visitor_hash = $1 AND store_id = $2 AND product_id = $3 AND created_at > now() - interval '24 hours' LIMIT 1`
      : `SELECT 1 FROM page_views WHERE visitor_hash = $1 AND store_id = $2 AND product_id IS NULL AND created_at > now() - interval '24 hours' LIMIT 1`;

    const dedupParams = product_id
      ? [visitorHash, store_id, product_id]
      : [visitorHash, store_id];

    const { rows: existing } = await query(dedupQuery, dedupParams);

    if (existing.length === 0) {
      await query(
        'INSERT INTO page_views (store_id, product_id, visitor_hash, page_type) VALUES ($1, $2, $3, $4)',
        [store_id, product_id || null, visitorHash, page_type],
      );
    }

    return new Response(null, { status: 204 });
  } catch {
    return new Response(null, { status: 204 });
  }
};
