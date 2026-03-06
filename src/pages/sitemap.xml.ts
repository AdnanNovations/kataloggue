import type { APIRoute } from 'astro';
import { supabase } from '../lib/supabase';

export const prerender = false;

export const GET: APIRoute = async () => {
  const siteUrl = 'https://kataloggue.my.id';

  // Get all stores
  const { data: stores } = await supabase.from('stores').select('slug, created_at');

  // Get all products with store slugs
  const { data: products } = await supabase
    .from('products')
    .select('slug, created_at, store_id, stores(slug)')
    .eq('is_available', true);

  const urls: { loc: string; lastmod: string; priority: string }[] = [
    { loc: siteUrl, lastmod: new Date().toISOString().split('T')[0], priority: '1.0' },
  ];

  stores?.forEach(store => {
    urls.push({
      loc: `${siteUrl}/${store.slug}`,
      lastmod: store.created_at?.split('T')[0] || new Date().toISOString().split('T')[0],
      priority: '0.8',
    });
  });

  products?.forEach(product => {
    const storeSlug = (product as any).stores?.slug;
    if (storeSlug) {
      urls.push({
        loc: `${siteUrl}/${storeSlug}/${product.slug}`,
        lastmod: product.created_at?.split('T')[0] || new Date().toISOString().split('T')[0],
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
