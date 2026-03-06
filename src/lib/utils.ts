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

/** Build WhatsApp URL with pre-filled message */
export function waOrderUrl(phone: string, storeName: string, productName?: string, price?: number): string {
  const cleanPhone = phone.replace(/\D/g, '').replace(/^0/, '62');
  let message = `Halo ${storeName}, saya tertarik `;
  if (productName) {
    message += `dengan produk *${productName}*`;
    if (price) message += ` (${formatPrice(price)})`;
    message += '. Apakah masih tersedia?';
  } else {
    message += 'dengan produk di katalog Anda.';
  }
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

/** Get image URL - local path or placeholder */
export function imageUrl(path: string | null, fallback = '/og-default.png'): string {
  if (!path) return fallback;
  if (path.startsWith('http')) return path;
  if (path.startsWith('/')) return path;
  return `/${path}`;
}
