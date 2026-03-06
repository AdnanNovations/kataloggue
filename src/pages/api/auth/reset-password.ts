import type { APIRoute } from 'astro';
import { query } from '../../../lib/db';
import { hashPassword } from '../../../lib/auth';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return new Response(JSON.stringify({ error: 'Token dan password diperlukan' }), { status: 400 });
    }

    if (password.length < 6) {
      return new Response(JSON.stringify({ error: 'Password minimal 6 karakter' }), { status: 400 });
    }

    const { rows } = await query(
      `SELECT pr.id, pr.user_id FROM password_resets pr
       WHERE pr.token = $1 AND pr.used = false AND pr.expires_at > now()`,
      [token],
    );

    if (rows.length === 0) {
      return new Response(JSON.stringify({ error: 'Link reset tidak valid atau sudah kedaluwarsa' }), { status: 400 });
    }

    const { id: resetId, user_id: userId } = rows[0];
    const passwordHash = await hashPassword(password);

    await query('UPDATE users SET password_hash = $1 WHERE id = $2', [passwordHash, userId]);
    await query('UPDATE password_resets SET used = true WHERE id = $1', [resetId]);

    return new Response(JSON.stringify({ success: true }));
  } catch (err) {
    console.error('[reset-password]', err);
    return new Response(JSON.stringify({ error: 'Terjadi kesalahan server' }), { status: 500 });
  }
};
