/** Format price to Indonesian Rupiah */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

/** Generate slug from text */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export interface VariantSelection {
  label: string;
  option: string;
}

/** Build WhatsApp URL with pre-filled message */
export function waOrderUrl(phone: string, storeName: string, productName?: string, price?: number, variants?: VariantSelection[]): string {
  const cleanPhone = phone.replace(/\D/g, '').replace(/^0/, '62');
  let message = `Halo ${storeName}, saya tertarik `;
  if (productName) {
    message += `dengan produk *${productName}*`;
    if (price) message += ` (${formatPrice(price)})`;
    message += '.';
    if (variants && variants.length > 0) {
      message += '\nVarian: ' + variants.map(v => `${v.label}: ${v.option}`).join(', ');
    }
    message += '\nApakah masih tersedia?';
  } else {
    message += 'dengan produk di katalog Anda.';
  }
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

/** Parse product images JSON, falling back to image_url */
export function parseProductImages(product: { images?: string | null; image_url?: string | null }): string[] {
  if (product.images) {
    try {
      const parsed = JSON.parse(product.images);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch {}
  }
  if (product.image_url) return [product.image_url];
  return [];
}

/** Parse product variants JSON */
export function parseProductVariants(variants: string | null | undefined): import('./db').VariantGroup[] {
  if (!variants) return [];
  try {
    const parsed = JSON.parse(variants);
    if (Array.isArray(parsed)) return parsed;
  } catch {}
  return [];
}

/** Get image URL - local path or placeholder */
export function imageUrl(path: string | null, fallback = '/og-default.png'): string {
  if (!path) return fallback;
  if (path.startsWith('http')) return path;
  if (path.startsWith('/')) return path;
  return `/${path}`;
}
