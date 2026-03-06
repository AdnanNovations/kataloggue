import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ locals, request }) => {
  const { supabase, user } = locals;

  const formData = await request.formData();
  const file = formData.get('file') as File;

  if (!file) {
    return new Response(JSON.stringify({ error: 'File diperlukan' }), { status: 400 });
  }

  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    return new Response(JSON.stringify({ error: 'Format file tidak didukung. Gunakan JPG, PNG, atau WebP.' }), { status: 400 });
  }

  // Max 2MB
  if (file.size > 2 * 1024 * 1024) {
    return new Response(JSON.stringify({ error: 'Ukuran file maksimal 2MB' }), { status: 400 });
  }

  const ext = file.name.split('.').pop();
  const fileName = `${user.id}/${Date.now()}.${ext}`;

  const { error } = await supabase.storage
    .from('images')
    .upload(fileName, file, { contentType: file.type });

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }

  const { data: urlData } = supabase.storage.from('images').getPublicUrl(fileName);

  return new Response(JSON.stringify({ url: urlData.publicUrl }), { status: 201 });
};
