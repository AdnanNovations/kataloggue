import pg from 'pg';

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://kataloggue:kataloggue@localhost:5432/kataloggue',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

export async function query<T extends pg.QueryResultRow = any>(
  text: string,
  params?: any[],
): Promise<pg.QueryResult<T>> {
  return pool.query<T>(text, params);
}

// Types
export interface Store {
  id: string;
  user_id: string;
  name: string;
  slug: string;
  description: string | null;
  logo_url: string | null;
  wa_number: string;
  address: string | null;
  theme: string;
  catalog_style: string | null;
  created_at: string;
}

export interface VariantOption {
  name: string;
  priceAdjust: number;
}

export interface VariantGroup {
  label: string;
  options: VariantOption[];
}

export interface Product {
  id: string;
  store_id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  image_url: string | null;
  images: string | null;
  variants: string | null;
  category: string | null;
  is_available: boolean;
  sort_order: number;
  created_at: string;
}

export interface StoreReview {
  id: string;
  store_id: string;
  reviewer_name: string;
  rating: number;
  comment: string | null;
  created_at: string;
}

export interface ProductReview {
  id: string;
  product_id: string;
  store_id: string;
  reviewer_name: string;
  rating: number;
  comment: string | null;
  created_at: string;
}

export interface PageView {
  id: string;
  store_id: string;
  product_id: string | null;
  visitor_hash: string;
  page_type: 'store' | 'product';
  created_at: string;
}
