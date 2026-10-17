import fs from 'fs';
import path from 'path';

const postsDir = path.resolve('src/posts');

function getLatestPost() {
  const allFiles = [];
  function scan(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) scan(fullPath);
      else if (entry.name.endsWith('.md')) allFiles.push(fullPath);
    }
  }
  scan(postsDir);

  const query = process.argv[2]?.toLowerCase();
  if (query) {
    const match = allFiles.find((f) => f.toLowerCase().includes(query));
    if (match) {
      const content = fs.readFileSync(match, 'utf8');
      const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
      const yaml = frontmatterMatch ? frontmatterMatch[1] : '';
      const titleMatch = yaml.match(/^title:\s*["']?(.*?)["']?$/m);
      const descMatch = yaml.match(/^description:\s*["']?(.*?)["']?$/m);
      const relSlug = path.relative(postsDir, match).replace(/\.md$/, '');
      return {
        title: titleMatch ? titleMatch[1] : path.basename(match, '.md'),
        description: descMatch ? descMatch[1] : '',
        slug: relSlug,
        url: `https://www.mograblog.com/${relSlug}/`,
      };
    }
  }

  let latestPost = null;
  let latestDate = 0;

  for (const file of allFiles) {
    const content = fs.readFileSync(file, 'utf8');
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
    if (!frontmatterMatch) continue;
    const yaml = frontmatterMatch[1];
    const titleMatch = yaml.match(/^title:\s*["']?(.*?)["']?$/m);
    const dateMatch = yaml.match(/^published:\s*(.*?)$/m);
    const descMatch = yaml.match(/^description:\s*["']?(.*?)["']?$/m);

    const title = titleMatch ? titleMatch[1] : path.basename(file, '.md');
    const pubDate = dateMatch ? new Date(dateMatch[1]).getTime() : 0;
    const description = descMatch ? descMatch[1] : '';

    if (pubDate > latestDate) {
      latestDate = pubDate;
      const relSlug = path.relative(postsDir, file).replace(/\.md$/, '');
      latestPost = {
        title,
        description,
        slug: relSlug,
        url: `https://www.mograblog.com/${relSlug}/`,
      };
    }
  }
  return latestPost;
}

const post = getLatestPost();
if (!post) {
  console.error('No posts found.');
  process.exit(1);
}

const hnUrl = `https://news.ycombinator.com/submitlink?u=${encodeURIComponent(post.url)}&t=${encodeURIComponent(post.title)}`;
const redditUrl = `https://www.reddit.com/submit?url=${encodeURIComponent(post.url)}&title=${encodeURIComponent(post.title)}`;
const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(post.url)}&text=${encodeURIComponent(post.title)}`;
const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(post.url)}`;

console.log('\n======================================================');
console.log('🚀 1-Click Submission Links for Article:');
console.log(`📌 Title: "${post.title}"`);
console.log(`🔗 URL:   ${post.url}`);
console.log('======================================================\n');
console.log('1. Hacker News (Pre-filled):');
console.log(`   👉 ${hnUrl}`);
console.log('   💡 Tip: Title + URL only, leave body blank.\n');
console.log('2. Daily.dev:');
console.log('   👉 https://app.daily.dev');
console.log('   💡 Tip: Click "New Post" -> switch dropdown from "Free form" to "Link".\n');
console.log('3. Reddit (Pre-filled):');
console.log(`   👉 ${redditUrl}`);
console.log('   💡 Tip: Select flair "I Built A Thing" or "Tutorial | Guide".\n');
console.log('4. Twitter / X (Pre-filled):');
console.log(`   👉 ${twitterUrl}\n`);
console.log('5. LinkedIn (Pre-filled):');
console.log(`   👉 ${linkedinUrl}\n`);
console.log('======================================================\n');
