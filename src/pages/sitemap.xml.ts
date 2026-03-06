import type { APIRoute } from 'astro';
import { query } from '../lib/db';

export const prerender = false;

function toDateStr(d: any): string {
  if (!d) return new Date().toISOString().split('T')[0];
  if (d instanceof Date) return d.toISOString().split('T')[0];
  return String(d).split('T')[0];
}

export const GET: APIRoute = async () => {
  const siteUrl = 'https://kataloggue.my.id';

  // Get all stores
  const { rows: stores } = await query('SELECT slug, created_at FROM stores');

  // Get all available products with store slugs
  const { rows: products } = await query(
    `SELECT p.slug, p.created_at, s.slug AS store_slug
     FROM products p JOIN stores s ON p.store_id = s.id
     WHERE p.is_available = true`,
  );

  const urls: { loc: string; lastmod: string; priority: string }[] = [
    { loc: siteUrl, lastmod: toDateStr(new Date()), priority: '1.0' },
  ];

  stores.forEach(store => {
    urls.push({
      loc: `${siteUrl}/${store.slug}`,
      lastmod: toDateStr(store.created_at),
      priority: '0.8',
    });
  });

  products.forEach(product => {
    if (product.store_slug) {
      urls.push({
        loc: `${siteUrl}/${product.store_slug}/${product.slug}`,
        lastmod: toDateStr(product.created_at),
        priority: '0.6',
      });
    }
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=3600',
    },
  });
};
