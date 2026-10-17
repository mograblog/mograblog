import fs from 'fs';

const env = Object.fromEntries(
  fs.readFileSync('.env', 'utf8')
    .split('\n')
    .filter((l) => l.includes('='))
    .map((l) => {
      const idx = l.indexOf('=');
      return [l.substring(0, idx).trim(), l.substring(idx + 1).trim()];
    })
);

const token = env.CLOUDFLARE_API_TOKEN;
const accountId = env.CLOUDFLARE_ACCOUNT_ID;
const dbId = 'ba9fa664-92b8-49f1-8455-209965ca77e9';

export async function importPageviews(pageviewsData) {
  const statements = [];

  for (const [key, views] of Object.entries(pageviewsData)) {
    if (typeof views !== 'number' && typeof views !== 'string') continue;
    const count = parseInt(String(views), 10);
    if (isNaN(count)) continue;

    // Convert slug key (e.g. 2017-05-organize-nodejs-code or 2017/05/organize-nodejs-code)
    let slug = key.replace(/^-+|-+$/g, '');
    
    // Support keys with dashes formatted as date slugs
    const match = slug.match(/^(\d{4})-(\d{2})-(.*)$/);
    if (match) {
      slug = `${match[1]}/${match[2]}/${match[3]}`;
    }

    statements.push({
      slug,
      views: count,
    });
  }

  console.log(`Preparing to import ${statements.length} historical post view counts into D1...`);

  // Build batch SQL
  const sql = statements.map((s) => 
    `INSERT INTO page_views (post_slug, views_count) VALUES ('${s.slug.replace(/'/g, "''")}', ${s.views}) ON CONFLICT(post_slug) DO UPDATE SET views_count = ${s.views};`
  ).join('\n');

  fs.writeFileSync('db/seed_pageviews.sql', sql);
  console.log('Saved to db/seed_pageviews.sql');

  // Push to remote Cloudflare D1
  if (token && accountId && dbId) {
    console.log('Executing on remote Cloudflare D1...');
    const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${dbId}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sql }),
    });
    const result = await res.json();
    console.log('Remote D1 update status:', result.success);
  }
}

// Check if pageviews.json exists in workspace
if (fs.existsSync('pageviews.json')) {
  const data = JSON.parse(fs.readFileSync('pageviews.json', 'utf8'));
  importPageviews(data.pageviews || data);
}
