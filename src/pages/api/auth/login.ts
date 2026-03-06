import type { APIRoute } from 'astro';
import { query } from '../../../lib/db';
import { verifyPassword, createToken, setAuthCookie, isValidEmail } from '../../../lib/auth';

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

    const normalizedEmail = email.trim().toLowerCase();
    const { rows } = await query('SELECT id, email, password_hash FROM users WHERE email = $1', [normalizedEmail]);

    if (rows.length === 0) {
      return new Response(JSON.stringify({ error: 'Email atau password salah' }), { status: 401 });
    }

    const user = rows[0];
    const valid = await verifyPassword(password, user.password_hash);

    if (!valid) {
      return new Response(JSON.stringify({ error: 'Email atau password salah' }), { status: 401 });
    }

    const token = createToken(user.id, user.email);
    setAuthCookie(cookies, token);

    return new Response(JSON.stringify({ success: true }));
  } catch {
    return new Response(JSON.stringify({ error: 'Terjadi kesalahan server' }), { status: 500 });
  }
};
