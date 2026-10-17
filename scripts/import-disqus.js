const fs = require('fs');
const zlib = require('zlib');
const path = require('path');

const xmlPath = path.resolve(process.env.HOME, 'Downloads/mograblog-2026-09-06T19_36_54.699382-all.xml.gz');
if (!fs.existsSync(xmlPath)) {
  console.error(`Export file not found at: ${xmlPath}`);
  process.exit(1);
}

const gz = fs.readFileSync(xmlPath);
const xml = zlib.gunzipSync(gz).toString('utf-8');

// Parse threads: thread id -> link
const threads = {};
const threadRegex = /<thread dsq:id="(\d+)">([\s\S]*?)<\/thread>/g;
let match;
while ((match = threadRegex.exec(xml)) !== null) {
  const id = match[1];
  const block = match[2];
  const linkMatch = block.match(/<link>(.*?)<\/link>/);
  if (linkMatch) {
    threads[id] = linkMatch[1];
  }
}

// Parse posts
const comments = [];
const postRegex = /<post dsq:id="(\d+)">([\s\S]*?)<\/post>/g;
while ((match = postRegex.exec(xml)) !== null) {
  const postId = match[1];
  const block = match[2];

  const isDeleted = block.includes('<isDeleted>true</isDeleted>');
  const isSpam = block.includes('<isSpam>true</isSpam>');
  if (isDeleted || isSpam) continue;

  const msgMatch = block.match(/<message><!\[CDATA\[([\s\S]*?)\]\]><\/message>/) || block.match(/<message>([\s\S]*?)<\/message>/);
  const dateMatch = block.match(/<createdAt>(.*?)<\/createdAt>/);
  const authorMatch = block.match(/<author>[\s\S]*?<name>(.*?)<\/name>/);
  const threadMatch = block.match(/<thread dsq:id="(\d+)"/);
  const parentMatch = block.match(/<parent dsq:id="(\d+)"/);

  const threadId = threadMatch ? threadMatch[1] : null;
  const rawUrl = threadId ? threads[threadId] : null;

  let slug = '';
  if (rawUrl) {
    try {
      const parsed = new URL(rawUrl);
      slug = parsed.pathname
        .replace(/^\/posts\//, '')
        .replace(/^\//, '')
        .replace(/\.html$/, '')
        .replace(/\/$/, '');
    } catch (e) {
      slug = rawUrl;
    }
  }

  if (slug.includes('angular-improve-website-performance')) {
    slug = '2015/10/angular-improve-website-performance';
  } else if (slug.includes('grunt-aws-cert-untrusted-quick-fix') || slug.includes('grunt-aws-certuntrusted-quick-fix')) {
    slug = '2014/12/grunt-aws-certuntrusted-quick-fix';
  } else if (slug.includes('json-parse-is-insane')) {
    slug = '2014/10/json-parse-is-insane';
  } else if (slug.includes('easily-contribute-code-in-java-with-java') || slug.includes('easily-contribute-code-in-java-with-jitpack')) {
    slug = '2016/07/easily-contribute-code-in-java-with-jitpack';
  }

  const cleanMessage = msgMatch ? msgMatch[1].replace(/<p>/g, '').replace(/<\/p>/g, '\n').trim() : '';

  if (slug && cleanMessage) {
    comments.push({
      disqusId: postId,
      slug,
      author: (authorMatch ? authorMatch[1] : 'Anonymous').replace(/'/g, "''"),
      message: cleanMessage.replace(/'/g, "''"),
      createdAt: dateMatch ? dateMatch[1] : new Date().toISOString(),
      parentId: parentMatch ? `'${parentMatch[1]}'` : 'NULL',
    });
  }
}

// Generate SQL inserts
let sql = '-- Seed Disqus Comments\n';
comments.forEach((c) => {
  sql += `INSERT OR IGNORE INTO comments (disqus_id, post_slug, author_name, content, created_at) VALUES ('${c.disqusId}', '${c.slug}', '${c.author}', '${c.message}', '${c.createdAt}');\n`;
});

fs.writeFileSync('db/seed_disqus.sql', sql);
console.log(`Generated db/seed_disqus.sql with ${comments.length} comments.`);
