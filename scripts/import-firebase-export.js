import fs from 'fs';
import path from 'path';

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

function getPostFiles(dir) {
  let files = [];
  for (const item of fs.readdirSync(dir)) {
    const full = path.join(dir, item);
    if (fs.statSync(full).isDirectory()) files = files.concat(getPostFiles(full));
    else if (item.endsWith('.md')) files.push(full);
  }
  return files;
}

async function main() {
  const postFiles = getPostFiles('src/posts');
  const postSlugs = postFiles.map((f) => f.replace('src/posts/', '').replace('.md', ''));
  console.log(`Found ${postSlugs.length} posts in workspace.`);

  const exportData = JSON.parse(fs.readFileSync('data/firebase-export.json', 'utf8'));
  const pageviews = exportData.pageviews || {};
  const currentlyReading = exportData.currentlyReading || [];

  const matchedViews = [];

  for (const [key, countVal] of Object.entries(pageviews)) {
    const count = parseInt(String(countVal), 10);
    if (isNaN(count)) continue;

    const year = key.substring(0, 4);
    const month = key.substring(4, 6);
    let rest = key.substring(6).replace(/html$/, '');

    let matchedSlug = postSlugs.find((s) => s === `${year}/${month}/${rest}`);

    if (!matchedSlug) {
      const restClean = rest.replace(/[^a-z0-9]/g, '');
      matchedSlug = postSlugs.find((s) => {
        const parts = s.split('/');
        if (parts[0] === year && parts[1] === month) {
          return parts[2].replace(/[^a-z0-9]/g, '') === restClean;
        }
        return false;
      });
    }

    if (!matchedSlug && key.includes('angularjs-cookies-example')) {
      matchedSlug = '2013/05/angularjs-cookies-example';
    }

    if (matchedSlug) {
      matchedViews.push({ slug: matchedSlug, count });
    }
  }

  console.log(`Matched ${matchedViews.length} post view counts.`);

  // Generate SQL for pageviews
  const sqlStatements = [];

  matchedViews.forEach((item) => {
    sqlStatements.push(
      `INSERT INTO page_views (post_slug, views_count, last_read_at) VALUES ('${item.slug}', ${item.count}, datetime('now')) ON CONFLICT(post_slug) DO UPDATE SET views_count = ${item.count};`
    );
  });

  // Generate SQL for live_reads (currentlyReading)
  currentlyReading.forEach((item) => {
    if (!item.title || !item.url) return;
    let cleanSlug = item.url.replace(/^\//, '').replace(/\.html$/, '');
    const dateStr = item.timestamp ? new Date(item.timestamp).toISOString() : new Date().toISOString();
    const titleEscaped = item.title.replace(/'/g, "''");
    
    sqlStatements.push(
      `INSERT INTO live_reads (post_slug, post_title, created_at) VALUES ('${cleanSlug}', '${titleEscaped}', '${dateStr}');`
    );
  });

  const fullSql = sqlStatements.join('\n');
  fs.writeFileSync('db/seed_firebase.sql', fullSql);
  console.log(`Wrote ${sqlStatements.length} SQL statements to db/seed_firebase.sql`);

  // Execute on local D1
  console.log('Populating local D1 SQLite database...');
  const { execSync } = await import('child_process');
  execSync('npx wrangler d1 execute DB --local --file=db/seed_firebase.sql', { stdio: 'inherit' });

  // Execute on remote Cloudflare D1
  if (token && accountId && dbId) {
    console.log('Populating remote Cloudflare D1 SQL database...');
    execSync('npx wrangler d1 execute DB --remote --file=db/seed_firebase.sql', { stdio: 'inherit' });
    console.log('Remote D1 update complete!');
  }
}

main().catch(console.error);
