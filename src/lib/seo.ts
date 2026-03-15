import type { Store, Product } from './db';
import { formatPrice, imageUrl, parseProductImages } from './utils';

const SITE_URL = 'https://kataloggue.my.id';
const SITE_NAME = 'KatalogGue';

export function storeUrl(slug: string) {
  return `${SITE_URL}/${slug}`;
}

export function productUrl(storeSlug: string, productSlug: string) {
  return `${SITE_URL}/${storeSlug}/${productSlug}`;
}

/** JSON-LD for a store (LocalBusiness schema) */
export function storeJsonLd(store: Store) {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: store.name,
    description: store.description || `Katalog produk ${store.name}`,
    url: storeUrl(store.slug),
    image: imageUrl(store.logo_url),
    address: store.address
      ? { '@type': 'PostalAddress', streetAddress: store.address }
      : undefined,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: store.wa_number,
      contactType: 'sales',
    },
  });
}

/** JSON-LD for a product (Product schema) */
export function productJsonLd(product: Product, store: Store) {
  const images = parseProductImages(product);
  const imageList = images.length > 0 ? images.map(i => imageUrl(i)) : [imageUrl(product.image_url)];
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description || product.name,
    image: imageList.length === 1 ? imageList[0] : imageList,
    url: productUrl(store.slug, product.slug),
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'IDR',
      availability: product.is_available
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: store.name,
      },
    },
  });
}

/** Generate meta tags object */
export function metaTags(opts: {
  title: string;
  description: string;
  url: string;
  image?: string;
}) {
  const title = `${opts.title} | ${SITE_NAME}`;
  const image = opts.image || `${SITE_URL}/og-default.png`;
  return { title, description: opts.description, url: opts.url, image, siteName: SITE_NAME };
}
