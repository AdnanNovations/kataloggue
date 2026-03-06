import { defineMiddleware } from 'astro:middleware';
import { verifyToken } from './lib/auth';

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;

  // Only protect dashboard and API routes (except auth endpoints)
  const isProtected = pathname.startsWith('/dashboard') || pathname.startsWith('/api/');
  const isAuthRoute = pathname.startsWith('/api/auth/') || pathname === '/api/logout' || pathname.startsWith('/api/reviews/');
  const isUploadServe = pathname.startsWith('/uploads/');
  if (!isProtected || isAuthRoute || isUploadServe) return next();

  const token = context.cookies.get('auth_token')?.value;

  if (!token) {
    return context.redirect('/masuk');
  }

  const user = verifyToken(token);

  if (!user) {
    context.cookies.delete('auth_token', { path: '/' });
    return context.redirect('/masuk');
  }

  context.locals.user = user;

  return next();
});
