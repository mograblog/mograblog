CREATE TABLE IF NOT EXISTS comments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  disqus_id TEXT UNIQUE,
  post_slug TEXT NOT NULL,
  author_name TEXT NOT NULL,
  author_avatar TEXT,
  author_id TEXT,
  content TEXT NOT NULL,
  parent_id INTEGER,
  target_paragraph TEXT,
  target_text TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_comments_slug ON comments(post_slug);
CREATE INDEX IF NOT EXISTS idx_comments_parent ON comments(parent_id);

CREATE TABLE IF NOT EXISTS page_views (
  post_slug TEXT PRIMARY KEY,
  views_count INTEGER DEFAULT 1,
  last_read_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS live_reads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  post_slug TEXT NOT NULL,
  post_title TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_live_reads_created ON live_reads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_live_reads_slug ON live_reads(post_slug);

CREATE TABLE IF NOT EXISTS feedback (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  post_slug TEXT NOT NULL,
  post_title TEXT,
  quick_feedback TEXT,
  custom_message TEXT,
  name TEXT,
  email TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_feedback_created ON feedback(created_at DESC);

CREATE TABLE IF NOT EXISTS post_claps (
  post_slug TEXT PRIMARY KEY,
  claps_count INTEGER DEFAULT 0,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

