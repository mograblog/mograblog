import { getAuthenticatedUser } from '../api/_clerkAuth.js';

export async function onRequest(context) {
  const { request, env, next } = context;

  try {
    const user = await getAuthenticatedUser(request, env);
    if (user && user.isAdmin) {
      // Authorized admin: allow viewing draft
      return next();
    }
  } catch (err) {
    console.error('Drafts edge gatekeeper auth error:', err);
  }

  // Not authorized, not logged in, or not admin:
  // Immediately redirect to homepage with no draft data returned!
  return Response.redirect(new URL('/', request.url), 302);
}
