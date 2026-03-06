import type { APIRoute } from 'astro';
import { query } from '../../../lib/db';
import { hashPassword, createToken, setAuthCookie, isValidEmail } from '../../../lib/auth';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return new Response(JSON.stringify({ error: 'Email dan password diperlukan' }), { status: 400 });
    }

    if (!isValidEmail(email)) {
      return new Response(JSON.stringify({ error: 'Format email tidak valid' }), { status: 400 });
    }

    if (password.length < 6) {
      return new Response(JSON.stringify({ error: 'Password minimal 6 karakter' }), { status: 400 });
    }

    if (password.length > 72) {
      return new Response(JSON.stringify({ error: 'Password maksimal 72 karakter' }), { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check if email already exists
    const { rows: existing } = await query('SELECT id FROM users WHERE email = $1', [normalizedEmail]);
    if (existing.length > 0) {
      return new Response(JSON.stringify({ error: 'Email sudah terdaftar' }), { status: 409 });
    }

    const password_hash = await hashPassword(password);
    const { rows } = await query(
      'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email',
      [normalizedEmail, password_hash],
    );

    const user = rows[0];
    const token = createToken(user.id, user.email);
    setAuthCookie(cookies, token);

    return new Response(JSON.stringify({ success: true }), { status: 201 });
  } catch {
    return new Response(JSON.stringify({ error: 'Terjadi kesalahan server' }), { status: 500 });
  }
};
