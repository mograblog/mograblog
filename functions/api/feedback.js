// Cloudflare Pages Function: /api/feedback

export async function onRequestPost({ request, env }) {
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

    const quickFeedbackStr = Array.isArray(quickFeedback) ? quickFeedback.join(', ') : String(quickFeedback);

    await env.DB.prepare(
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

    return new Response(JSON.stringify({
      success: true,
      message: 'Feedback received with thanks!',
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
