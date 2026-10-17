export const prerender = false;

import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const body = await request.json();
    const {
      slug,
      title,
      quickFeedback = [],
      customMessage = '',
      name = '',
      email = '',
    } = body;

    if (!slug) {
      return new Response(JSON.stringify({ error: 'Slug is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const env = (locals as any).runtime?.env || (globalThis as any).__env__ || {};
    const db = env.DB;

    const quickFeedbackStr = Array.isArray(quickFeedback) ? quickFeedback.join(', ') : String(quickFeedback);

    if (db) {
      await db.prepare(
        `INSERT INTO feedback (post_slug, post_title, quick_feedback, custom_message, name, email, created_at)
         VALUES (?, ?, ?, ?, ?, ?, datetime('now'))`
      ).bind(
        slug,
        title || slug,
        quickFeedbackStr || null,
        customMessage.trim() || null,
        name.trim() || null,
        email.trim() || null
      ).run();
    }

    // Send email notification to admin asynchronously (non-blocking)
    const { sendFeedbackNotification } = await import('../../lib/notify');
    sendFeedbackNotification(env, {
      slug,
      title: title || slug,
      quickFeedback: quickFeedbackStr || null,
      customMessage: customMessage.trim() || null,
      name: name.trim() || null,
      email: email.trim() || null,
    }).catch((err) => console.warn('Feedback notification error:', err));

    return new Response(JSON.stringify({
      success: true,
      message: 'Feedback received with thanks!',
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
