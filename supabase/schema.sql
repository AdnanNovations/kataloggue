-- KatalogKu Database Schema

-- Stores table
create table stores (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  slug text unique not null,
  description text,
  logo_url text,
  wa_number text not null,
  address text,
  theme text default 'default',
  created_at timestamptz default now()
);

-- Products table
create table products (
  id uuid primary key default gen_random_uuid(),
  store_id uuid references stores(id) on delete cascade not null,
  name text not null,
  slug text not null,
  description text,
  price bigint not null,
  image_url text,
  category text,
  is_available boolean default true,
  sort_order int default 0,
  created_at timestamptz default now(),
  unique(store_id, slug)
);

-- Indexes
create index idx_stores_slug on stores(slug);
create index idx_stores_user_id on stores(user_id);
create index idx_products_store_id on products(store_id);
create index idx_products_category on products(category);

-- Enable Row Level Security
alter table stores enable row level security;
alter table products enable row level security;

-- Public read access for catalog pages
create policy "Public can view stores"
  on stores for select
  using (true);

create policy "Public can view available products"
  on products for select
  using (true);

-- Owner write access
create policy "Users can insert own store"
  on stores for insert
  with check (auth.uid() = user_id);

create policy "Users can update own store"
  on stores for update
  using (auth.uid() = user_id);

create policy "Users can delete own store"
  on stores for delete
  using (auth.uid() = user_id);

create policy "Store owners can insert products"
  on products for insert
  with check (
    store_id in (select id from stores where user_id = auth.uid())
  );

create policy "Store owners can update products"
  on products for update
  using (
    store_id in (select id from stores where user_id = auth.uid())
  );

create policy "Store owners can delete products"
  on products for delete
  using (
    store_id in (select id from stores where user_id = auth.uid())
  );

-- Storage bucket for product images
insert into storage.buckets (id, name, public) values ('images', 'images', true);

create policy "Anyone can view images"
  on storage.objects for select
  using (bucket_id = 'images');

create policy "Authenticated users can upload images"
  on storage.objects for insert
  with check (bucket_id = 'images' and auth.role() = 'authenticated');

create policy "Users can delete own images"
  on storage.objects for delete
  using (bucket_id = 'images' and auth.uid()::text = (storage.foldername(name))[1]);
