import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const SITE_URL = process.env.SITE_URL || 'https://kataloggue.my.id';
const FROM = process.env.SMTP_FROM || process.env.SMTP_USER || '';

function emailLayout(content: string): string {
  return `<!DOCTYPE html>
<html lang="id">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="color-scheme" content="light"><meta name="supported-color-schemes" content="light"></head>
<body style="margin:0;padding:0;background-color:#f3f4f6;font-family:'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;-webkit-font-smoothing:antialiased;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f3f4f6;padding:32px 16px;">
<tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08);">

<!-- Header -->
<tr><td style="background-color:#16a34a;padding:24px 32px;text-align:center;">
  <img src="${SITE_URL}/logo-kataloggue.webp" alt="KatalogGue" height="40" style="height:40px;width:auto;display:inline-block;">
</td></tr>

<!-- Body -->
<tr><td style="padding:32px;">
${content}
</td></tr>

<!-- Footer -->
<tr><td style="padding:0 32px 28px;text-align:center;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td style="border-top:1px solid #e5e7eb;padding-top:20px;">
    <p style="margin:0 0 4px;font-size:12px;color:#9ca3af;">KatalogGue &mdash; Katalog online gratis untuk UMKM Indonesia</p>
    <p style="margin:0;font-size:12px;color:#9ca3af;">
      <a href="${SITE_URL}" style="color:#9ca3af;text-decoration:underline;">kataloggue.my.id</a>
    </p>
  </td></tr></table>
</td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}

export async function sendPasswordResetEmail(to: string, resetUrl: string): Promise<boolean> {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
    console.error('[email] SMTP not configured, skipping password reset email');
    return false;
  }

  const html = emailLayout(`
  <h2 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#111827;">Reset Password</h2>
  <p style="margin:0 0 20px;font-size:15px;color:#6b7280;line-height:1.5;">Seseorang meminta reset password untuk akun KatalogGue Anda. Jika ini bukan Anda, abaikan email ini.</p>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 20px;">
    <tr><td align="center">
      <a href="${resetUrl}" style="display:inline-block;background-color:#16a34a;color:#ffffff;font-size:15px;font-weight:600;padding:14px 32px;border-radius:8px;text-decoration:none;letter-spacing:0.2px;">
        Atur Password Baru
      </a>
    </td></tr>
  </table>

  <p style="margin:0 0 6px;font-size:13px;color:#9ca3af;line-height:1.5;">Link berlaku selama <strong style="color:#6b7280;">1 jam</strong> dan hanya bisa digunakan sekali.</p>
  <p style="margin:0;font-size:13px;color:#9ca3af;line-height:1.5;">Jika tombol tidak berfungsi, salin link berikut ke browser:</p>
  <p style="margin:8px 0 0;font-size:12px;color:#16a34a;word-break:break-all;line-height:1.4;">${resetUrl}</p>
  `);

  const text = `Reset Password - KatalogGue

Seseorang meminta reset password untuk akun KatalogGue Anda.

Klik link berikut untuk mengatur password baru:
${resetUrl}

Link berlaku selama 1 jam dan hanya bisa digunakan sekali.

Jika Anda tidak meminta reset password, abaikan email ini.

---
KatalogGue - Katalog online gratis untuk UMKM Indonesia
${SITE_URL}`;

  try {
    await transporter.sendMail({
      from: FROM,
      to,
      subject: 'Reset Password Anda - KatalogGue',
      html,
      text,
      headers: {
        'X-Entity-Ref-ID': `reset-${Date.now()}`,
      },
    });
    return true;
  } catch (err) {
    console.error('[email] Failed to send password reset email:', err);
    return false;
  }
}

export async function sendWelcomeEmail(to: string): Promise<boolean> {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
    console.error('[email] SMTP not configured, skipping welcome email');
    return false;
  }

  const dashboardUrl = `${SITE_URL}/dashboard`;

  const html = emailLayout(`
  <h2 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#111827;">Selamat Datang! 🎉</h2>
  <p style="margin:0 0 20px;font-size:15px;color:#6b7280;line-height:1.5;">Akun KatalogGue Anda sudah siap. Sekarang Anda bisa membuat katalog produk online dan mulai terima pesanan via WhatsApp.</p>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;background-color:#f0fdf4;border-radius:8px;padding:0;">
    <tr><td style="padding:20px 24px;">
      <p style="margin:0 0 12px;font-size:14px;font-weight:600;color:#15803d;">Mulai dalam 3 langkah:</p>
      <table role="presentation" cellpadding="0" cellspacing="0">
        <tr><td style="padding:0 0 8px;font-size:14px;color:#374151;line-height:1.5;">
          <span style="display:inline-block;width:22px;height:22px;background:#16a34a;color:#fff;border-radius:50%;text-align:center;line-height:22px;font-size:12px;font-weight:700;margin-right:8px;vertical-align:middle;">1</span>
          Buat toko &amp; isi info dasar
        </td></tr>
        <tr><td style="padding:0 0 8px;font-size:14px;color:#374151;line-height:1.5;">
          <span style="display:inline-block;width:22px;height:22px;background:#16a34a;color:#fff;border-radius:50%;text-align:center;line-height:22px;font-size:12px;font-weight:700;margin-right:8px;vertical-align:middle;">2</span>
          Tambahkan produk dengan foto &amp; harga
        </td></tr>
        <tr><td style="padding:0;font-size:14px;color:#374151;line-height:1.5;">
          <span style="display:inline-block;width:22px;height:22px;background:#16a34a;color:#fff;border-radius:50%;text-align:center;line-height:22px;font-size:12px;font-weight:700;margin-right:8px;vertical-align:middle;">3</span>
          Bagikan link katalog ke pelanggan
        </td></tr>
      </table>
    </td></tr>
  </table>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 20px;">
    <tr><td align="center">
      <a href="${dashboardUrl}" style="display:inline-block;background-color:#16a34a;color:#ffffff;font-size:15px;font-weight:600;padding:14px 32px;border-radius:8px;text-decoration:none;letter-spacing:0.2px;">
        Buka Dashboard
      </a>
    </td></tr>
  </table>

  <p style="margin:0;font-size:13px;color:#9ca3af;line-height:1.5;text-align:center;">Ada pertanyaan? Balas email ini, kami senang membantu.</p>
  `);

  const text = `Selamat Datang di KatalogGue!

Akun Anda sudah siap. Sekarang Anda bisa membuat katalog produk online dan mulai terima pesanan via WhatsApp.

Mulai dalam 3 langkah:
1. Buat toko & isi info dasar
2. Tambahkan produk dengan foto & harga
3. Bagikan link katalog ke pelanggan

Buka Dashboard: ${dashboardUrl}

Ada pertanyaan? Balas email ini, kami senang membantu.

---
KatalogGue - Katalog online gratis untuk UMKM Indonesia
${SITE_URL}`;

  try {
    await transporter.sendMail({
      from: FROM,
      to,
      subject: 'Selamat datang di KatalogGue! Katalog Anda siap dibuat',
      html,
      text,
      headers: {
        'X-Entity-Ref-ID': `welcome-${Date.now()}`,
      },
    });
    return true;
  } catch (err) {
    console.error('[email] Failed to send welcome email:', err);
    return false;
  }
}
