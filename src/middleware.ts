import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async (context, next) => {
  const url = new URL(context.request.url);

  // Strictly protect all /drafts routes at the edge
  if (url.pathname.startsWith('/drafts')) {
    // 1. Check if session cookie exists
    const sessionCookie = context.cookies.get('__session')?.value;
    if (!sessionCookie) {
      return context.redirect('/', 302);
    }

    // 2. Check Clerk locals auth (if populated by @clerk/astro)
    try {
      const auth = (context.locals as any).auth?.();
      if (auth) {
        const { userId, sessionClaims } = auth;
        if (!userId) {
          return context.redirect('/', 302);
        }

        const adminEmail = (
          (context.locals as any).runtime?.env?.ADMIN_EMAIL ||
          import.meta.env.ADMIN_EMAIL ||
          import.meta.env.PUBLIC_ADMIN_EMAIL ||
          ''
        ).toLowerCase();

        const userEmail = (
          sessionClaims?.email ||
          sessionClaims?.primary_email_address ||
          ''
        ).toLowerCase();

        const isAdmin = Boolean(
          sessionClaims?.public_metadata?.isAdmin ||
          sessionClaims?.metadata?.isAdmin ||
          (adminEmail && userEmail === adminEmail)
        );

        if (!isAdmin && (adminEmail || sessionClaims?.public_metadata)) {
          return context.redirect('/', 302);
        }
      }
    } catch (e) {
      // If auth check fails, redirect to homepage
      return context.redirect('/', 302);
    }
  }

  return next();
});
