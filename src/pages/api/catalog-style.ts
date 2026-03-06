import type { APIRoute } from 'astro';
import { query } from '../../lib/db';
import { DEFAULT_CATALOG_STYLE } from '../../lib/catalog-style';
import type { CatalogStyle } from '../../lib/catalog-style';

export const prerender = false;

const HEX_RE = /^#[0-9a-fA-F]{6}$/;
const VALID_RADIUS = ['none', 'sm', 'md', 'lg', 'xl'];
const VALID_SHADOW = ['none', 'sm', 'md', 'lg'];

function validateColor(val: unknown, fallback: string): string {
  return typeof val === 'string' && HEX_RE.test(val) ? val : fallback;
}

export const POST: APIRoute = async ({ locals, request }) => {
  try {
    const { user } = locals;
    const body = await request.json();

    // Check user has a store
    const { rows: stores } = await query('SELECT id FROM stores WHERE user_id = $1', [user.id]);
    if (stores.length === 0) {
      return new Response(JSON.stringify({ error: 'Toko belum dibuat' }), { status: 404 });
    }

    const d = DEFAULT_CATALOG_STYLE;
    const style: CatalogStyle = {
      pageBg: validateColor(body.pageBg, d.pageBg),
      pageBgImage: typeof body.pageBgImage === 'string' ? body.pageBgImage.slice(0, 500) : '',
      pageBgOverlay: typeof body.pageBgOverlay === 'number' ? Math.max(0, Math.min(100, Math.round(body.pageBgOverlay))) : 0,

      headerBg: validateColor(body.headerBg, d.headerBg),
      headerBorder: validateColor(body.headerBorder, d.headerBorder),
      headerText: validateColor(body.headerText, d.headerText),
      headerSubtext: validateColor(body.headerSubtext, d.headerSubtext),

      accentColor: validateColor(body.accentColor, d.accentColor),
      accentDark: validateColor(body.accentDark, d.accentDark),
      accentLight: validateColor(body.accentLight, d.accentLight),

      cardBg: validateColor(body.cardBg, d.cardBg),
      cardRadius: VALID_RADIUS.includes(body.cardRadius) ? body.cardRadius : d.cardRadius,
      cardShadow: VALID_SHADOW.includes(body.cardShadow) ? body.cardShadow : d.cardShadow,
      cardBorder: typeof body.cardBorder === 'string' && (HEX_RE.test(body.cardBorder) || body.cardBorder === 'transparent')
        ? body.cardBorder : d.cardBorder,
      productNameColor: validateColor(body.productNameColor, d.productNameColor),
      categoryLabelColor: validateColor(body.categoryLabelColor, d.categoryLabelColor),
      priceColor: validateColor(body.priceColor, d.priceColor),

      pillActiveBg: validateColor(body.pillActiveBg, d.pillActiveBg),
      pillActiveText: validateColor(body.pillActiveText, d.pillActiveText),
      pillBg: validateColor(body.pillBg, d.pillBg),
      pillText: validateColor(body.pillText, d.pillText),

      footerBg: validateColor(body.footerBg, d.footerBg),
      footerText: validateColor(body.footerText, d.footerText),
      footerBorder: validateColor(body.footerBorder, d.footerBorder),
    };

    await query(
      'UPDATE stores SET catalog_style = $1 WHERE id = $2',
      [JSON.stringify(style), stores[0].id],
    );

    return new Response(JSON.stringify({ success: true }));
  } catch {
    return new Response(JSON.stringify({ error: 'Terjadi kesalahan server' }), { status: 500 });
  }
};
