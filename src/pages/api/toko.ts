import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ locals, request }) => {
  const { user, supabase } = locals;
  const body = await request.json();

  // Check if user already has a store
  const { data: existing } = await supabase
    .from('stores')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (existing) {
    // Update existing store
    const { data, error } = await supabase
      .from('stores')
      .update({
        name: body.name,
        slug: body.slug,
        description: body.description,
        wa_number: body.wa_number,
        address: body.address,
        logo_url: body.logo_url,
      })
      .eq('id', existing.id)
      .select()
      .single();

    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 400 });
    return new Response(JSON.stringify(data));
  }

  // Create new store
  const { data, error } = await supabase
    .from('stores')
    .insert({
      user_id: user.id,
      name: body.name,
      slug: body.slug,
      description: body.description,
      wa_number: body.wa_number,
      address: body.address,
      logo_url: body.logo_url,
    })
    .select()
    .single();

  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  return new Response(JSON.stringify(data), { status: 201 });
};
