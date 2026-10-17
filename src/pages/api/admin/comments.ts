export const prerender = false;

import type { APIRoute } from 'astro';

function decodeBase64Url(str: string): string {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  return atob(base64);
}

async function isAuthorized(request: Request, env: any): Promise<boolean> {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader) return false;

  const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7).trim() : authHeader.trim();
  if (!token) return false;

  const clerkKey = env?.CLERK_SECRET_KEY || process?.env?.CLERK_SECRET_KEY;
  if (!clerkKey) {
    console.warn('CLERK_SECRET_KEY is not configured in environment');
    return false;
  }

  try {
    const parts = token.split('.');
    if (parts.length === 3) {
      const payloadJson = decodeBase64Url(parts[1]);
      const payload = JSON.parse(payloadJson);
      const userId = payload.sub;

      if (userId) {
        const res = await fetch(`https://api.clerk.com/v1/users/${userId}`, {
          headers: { Authorization: `Bearer ${clerkKey}` },
        });

        if (res.ok) {
          const userData = await res.json();
          const emails = (userData.email_addresses || []).map((e: any) => (e.email_address || '').toLowerCase());
          const adminEmail = (env?.ADMIN_EMAIL || process?.env?.ADMIN_EMAIL || '').toLowerCase();
          if (adminEmail && emails.includes(adminEmail)) {
            return true;
          }
        } else {
          console.warn('Clerk user lookup returned status:', res.status);
        }
      }
    }
  } catch (err) {
    console.warn('Clerk auth verification error:', err);
  }

  return false;
}

export const GET: APIRoute = async ({ request, locals }) => {
  try {
    const env = (locals as any).runtime?.env || (globalThis as any).__env__ || {};
    
    if (!(await isAuthorized(request, env))) {
      return new Response(JSON.stringify({ error: 'Unauthorized: Access restricted to authorized admin' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const db = env.DB;
    if (!db) {
      return new Response(JSON.stringify({ success: true, comments: [] }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { results } = await db.prepare(
      `SELECT id, disqus_id, post_slug, author_name, author_avatar, author_id, content, parent_id, target_paragraph, target_text, created_at 
       FROM comments 
       ORDER BY created_at DESC 
       LIMIT 300`
    ).all();

    let feedbacks: any[] = [];
    try {
      const fbRes = await db.prepare(
        `SELECT id, post_slug, post_title, quick_feedback, custom_message, name, email, created_at
         FROM feedback
         ORDER BY created_at DESC
         LIMIT 100`
      ).all();
      feedbacks = fbRes.results || [];
    } catch (e) {
      // Table may be empty
    }

    return new Response(JSON.stringify({ success: true, comments: results || [], feedbacks }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const DELETE: APIRoute = async ({ request, locals }) => {
  try {
    const env = (locals as any).runtime?.env || (globalThis as any).__env__ || {};
    
    if (!(await isAuthorized(request, env))) {
      return new Response(JSON.stringify({ error: 'Unauthorized: Access restricted to authorized admin' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const body = await request.json();
    const { id } = body;

    if (!id) {
      return new Response(JSON.stringify({ error: 'Comment ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const db = env.DB;
    if (db) {
      // Also delete any child replies
      await db.prepare(`DELETE FROM comments WHERE id = ? OR parent_id = ?`).bind(id, id).run();
    }

    return new Response(JSON.stringify({ success: true, deletedId: id }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
