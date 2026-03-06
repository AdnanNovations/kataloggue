import type { APIRoute } from 'astro';
import crypto from 'node:crypto';
import { query } from '../../../lib/db';
import { isValidEmail } from '../../../lib/auth';
import { sendPasswordResetEmail } from '../../../lib/email';

export const prerender = false;

const SITE_URL = process.env.SITE_URL || 'https://kataloggue.my.id';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { email } = await request.json();

    if (!email || !isValidEmail(email)) {
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const { rows } = await query('SELECT id FROM users WHERE email = $1', [normalizedEmail]);

    if (rows.length > 0) {
      const userId = rows[0].id;
      const token = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      await query(
        'INSERT INTO password_resets (user_id, token, expires_at) VALUES ($1, $2, $3)',
        [userId, token, expiresAt],
      );

      const resetUrl = `${SITE_URL}/reset-password?token=${token}`;
      await sendPasswordResetEmail(normalizedEmail, resetUrl);
    }

    // Always return success to prevent email enumeration
    return new Response(JSON.stringify({ success: true }));
  } catch (err) {
    console.error('[forgot-password]', err);
    return new Response(JSON.stringify({ success: true }));
  }
};
