// Cloudflare Pages Functions - Stateless Clerk JWT Verification via Public JWKS

let cachedJwks = null;
let jwksCachedAt = 0;
const JWKS_TTL_MS = 60 * 60 * 1000; // 1 hour in-memory cache

function base64UrlToUint8Array(str) {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) base64 += '=';
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function decodeBase64UrlJson(str) {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) base64 += '=';
  return JSON.parse(atob(base64));
}

function getClerkDomain(env) {
  if (env?.CLERK_FRONTEND_API) return env.CLERK_FRONTEND_API;
  const pk = env?.PUBLIC_CLERK_PUBLISHABLE_KEY || '';
  if (pk) {
    try {
      const b64 = pk.replace(/^pk_(test|live)_/, '').replace(/\$$/, '');
      const decoded = atob(b64);
      if (decoded) return decoded.replace(/\$$/, '');
    } catch (_) {}
  }
  return 'clerk.mograblog.com';
}

async function getJwks(env) {
  const now = Date.now();
  if (cachedJwks && (now - jwksCachedAt < JWKS_TTL_MS)) {
    return cachedJwks;
  }
  const domain = getClerkDomain(env);
  const jwksUrl = `https://${domain}/.well-known/jwks.json`;
  const res = await fetch(jwksUrl);
  if (!res.ok) {
    throw new Error(`Failed to fetch JWKS from ${jwksUrl}: HTTP ${res.status}`);
  }
  const data = await res.json();
  cachedJwks = data;
  jwksCachedAt = now;
  return cachedJwks;
}

export async function verifyClerkJwt(token, env) {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;

  try {
    const header = decodeBase64UrlJson(parts[0]);
    const payload = decodeBase64UrlJson(parts[1]);
    const signature = base64UrlToUint8Array(parts[2]);

    if (header.alg !== 'RS256') return null;

    // Check expiration (exp) and not-before (nbf) with 5-second clock skew tolerance
    const nowSec = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < (nowSec - 5)) return null;
    if (payload.nbf && payload.nbf > (nowSec + 5)) return null;

    const jwks = await getJwks(env);
    const keyMatch = (jwks.keys || []).find((k) => k.kid === header.kid);
    if (!keyMatch) return null;

    const cryptoKey = await crypto.subtle.importKey(
      'jwk',
      keyMatch,
      { name: 'RSASSA-PKCS1-v1_5', hash: { name: 'SHA-256' } },
      false,
      ['verify']
    );

    const signedData = new TextEncoder().encode(`${parts[0]}.${parts[1]}`);
    const isValid = await crypto.subtle.verify(
      'RSASSA-PKCS1-v1_5',
      cryptoKey,
      signature,
      signedData
    );

    if (!isValid) return null;
    return payload;
  } catch (err) {
    console.warn('Clerk JWKS verification failed:', err);
    return null;
  }
}

export async function getAuthenticatedUser(request, env) {
  const authHeader = request.headers.get('Authorization') || '';
  let token = authHeader.startsWith('Bearer ') ? authHeader.substring(7).trim() : authHeader.trim();

  // If no Bearer token, check __session cookie from Clerk
  if (!token) {
    const cookieHeader = request.headers.get('Cookie') || '';
    const cookies = Object.fromEntries(
      cookieHeader.split(';').map((c) => {
        const [k, ...v] = c.trim().split('=');
        return [k, v.join('=')];
      })
    );
    token = cookies['__session'] || '';
  }

  if (!token) return null;

  // 1. Verify via public JWKS key
  const verifiedPayload = await verifyClerkJwt(token, env);
  if (!verifiedPayload) return null;

  const userId = verifiedPayload.sub;
  if (!userId) return null;

  // Check admin privileges safely without hardcoded emails
  const adminEmail = (env?.ADMIN_EMAIL || '').toLowerCase();
  const adminUserId = env?.ADMIN_USER_ID || '';
  const tokenEmail = (verifiedPayload.email || '').toLowerCase();

  let isAdmin = false;
  if (adminUserId && userId === adminUserId) {
    isAdmin = true;
  } else if (adminEmail && tokenEmail === adminEmail) {
    isAdmin = true;
  } else if (verifiedPayload.public_metadata?.isAdmin || verifiedPayload.metadata?.isAdmin) {
    isAdmin = true;
  }

  // Optional: If CLERK_SECRET_KEY is present and full profile is not in token, enrich metadata
  let name = verifiedPayload.first_name || verifiedPayload.name || 'User';
  let avatar = verifiedPayload.image_url || null;
  let email = tokenEmail;

  if (env?.CLERK_SECRET_KEY && (!email || name === 'User')) {
    try {
      const res = await fetch(`https://api.clerk.com/v1/users/${userId}`, {
        headers: { Authorization: `Bearer ${env.CLERK_SECRET_KEY}` },
      });
      if (res.ok) {
        const userData = await res.json();
        email = (userData.email_addresses?.[0]?.email_address || '').toLowerCase();
        name = userData.first_name || userData.username || email.split('@')[0] || name;
        avatar = userData.image_url || avatar;
        const allEmails = (userData.email_addresses || []).map(e => (e.email_address || '').toLowerCase());
        if (adminEmail && allEmails.includes(adminEmail)) {
          isAdmin = true;
        }
      }
    } catch (_) {}
  }

  return {
    userId,
    name,
    email,
    avatar,
    isAdmin,
  };
}
