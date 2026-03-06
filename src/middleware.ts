import { defineMiddleware } from 'astro:middleware';
import { createClient } from '@supabase/supabase-js';

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;

  // Only protect dashboard and API routes (except login-related)
  const isProtected = pathname.startsWith('/dashboard') || pathname.startsWith('/api/');
  if (!isProtected) return next();

  // Get auth token from cookie
  const accessToken = context.cookies.get('sb-access-token')?.value;
  const refreshToken = context.cookies.get('sb-refresh-token')?.value;

  if (!accessToken) {
    return context.redirect('/masuk');
  }

  const supabase = createClient(
    import.meta.env.PUBLIC_SUPABASE_URL,
    import.meta.env.PUBLIC_SUPABASE_ANON_KEY
  );

  const { data, error } = await supabase.auth.setSession({
    access_token: accessToken,
    refresh_token: refreshToken || '',
  });

  if (error || !data.user) {
    context.cookies.delete('sb-access-token', { path: '/' });
    context.cookies.delete('sb-refresh-token', { path: '/' });
    return context.redirect('/masuk');
  }

  // Refresh cookies if tokens were refreshed
  if (data.session) {
    context.cookies.set('sb-access-token', data.session.access_token, {
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
    context.cookies.set('sb-refresh-token', data.session.refresh_token, {
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
    });
  }

  // Attach user to locals for downstream use
  context.locals.user = data.user;
  context.locals.supabase = supabase;

  return next();
});
