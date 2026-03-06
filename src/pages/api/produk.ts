import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ locals, request }) => {
  const { supabase, user } = locals;
  const body = await request.json();

  // Verify store ownership
  const { data: store } = await supabase
    .from('stores')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (!store) return new Response(JSON.stringify({ error: 'Toko tidak ditemukan' }), { status: 404 });

  const { data, error } = await supabase
    .from('products')
    .insert({
      store_id: store.id,
      name: body.name,
      slug: body.slug,
      description: body.description,
      price: body.price,
      image_url: body.image_url,
      category: body.category,
      is_available: body.is_available ?? true,
      sort_order: body.sort_order ?? 0,
    })
    .select()
    .single();

  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  return new Response(JSON.stringify(data), { status: 201 });
};

export const PUT: APIRoute = async ({ locals, request }) => {
  const { supabase, user } = locals;
  const body = await request.json();

  if (!body.id) return new Response(JSON.stringify({ error: 'ID produk diperlukan' }), { status: 400 });

  // Verify ownership via store
  const { data: store } = await supabase
    .from('stores')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (!store) return new Response(JSON.stringify({ error: 'Toko tidak ditemukan' }), { status: 404 });

  const { data, error } = await supabase
    .from('products')
    .update({
      name: body.name,
      slug: body.slug,
      description: body.description,
      price: body.price,
      image_url: body.image_url,
      category: body.category,
      is_available: body.is_available,
      sort_order: body.sort_order,
    })
    .eq('id', body.id)
    .eq('store_id', store.id)
    .select()
    .single();

  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  return new Response(JSON.stringify(data));
};

export const DELETE: APIRoute = async ({ locals, request }) => {
  const { supabase, user } = locals;
  const { id } = await request.json();

  if (!id) return new Response(JSON.stringify({ error: 'ID produk diperlukan' }), { status: 400 });

  const { data: store } = await supabase
    .from('stores')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (!store) return new Response(JSON.stringify({ error: 'Toko tidak ditemukan' }), { status: 404 });

  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id)
    .eq('store_id', store.id);

  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  return new Response(JSON.stringify({ success: true }));
};
