-- LevelUp Database Schema (In-App Learning & Lesson Engine)

CREATE TABLE IF NOT EXISTS phases (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  phase_number INTEGER UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT
);

CREATE TABLE IF NOT EXISTS weeks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  week_number INTEGER NOT NULL,
  phase_id INTEGER NOT NULL REFERENCES phases(id),
  title TEXT NOT NULL,
  learning_goal TEXT NOT NULL,
  action_item TEXT NOT NULL,
  skillset TEXT DEFAULT 'Program Management Rigor',
  skillset_priority TEXT DEFAULT 'P0',
  content_body TEXT,
  key_takeaways TEXT,       -- JSON string array of takeaways
  actionable_template TEXT, -- Markdown template for workplace use
  read_time TEXT DEFAULT '8 min read',
  completed INTEGER DEFAULT 0,
  completed_at DATETIME,
  crawled_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  display_order INTEGER NOT NULL,
  notes TEXT
);

CREATE TABLE IF NOT EXISTS seed_resources (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  week_id INTEGER NOT NULL REFERENCES weeks(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  domain TEXT NOT NULL,
  summary TEXT,
  content_body TEXT,
  key_takeaways TEXT,
  actionable_template TEXT,
  read_time TEXT DEFAULT '6 min read',
  type TEXT DEFAULT 'lesson'
);

CREATE TABLE IF NOT EXISTS topics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  skillset TEXT DEFAULT 'Technical Architecture',
  priority TEXT CHECK(priority IN ('high', 'medium', 'low')) DEFAULT 'medium',
  skillset_priority TEXT DEFAULT 'P1',
  status TEXT CHECK(status IN ('now', 'next', 'someday', 'archived')) DEFAULT 'now',
  is_seed_week INTEGER DEFAULT 0,
  week_id INTEGER REFERENCES weeks(id) ON DELETE SET NULL,
  tags TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS crawled_resources (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  topic_id INTEGER REFERENCES topics(id) ON DELETE SET NULL,
  topic_title TEXT NOT NULL,
  title TEXT NOT NULL,
  domain TEXT NOT NULL,
  summary TEXT NOT NULL,
  skillset TEXT DEFAULT 'Technical Architecture',
  skillset_priority TEXT DEFAULT 'P1',
  content_body TEXT NOT NULL,
  key_takeaways TEXT,        -- JSON array of takeaways
  actionable_template TEXT,  -- Ready-to-use template/checklist
  youtube_videos TEXT,       -- JSON array of fetched YouTube videos
  url TEXT UNIQUE,           -- Unique resource key / slug
  url_hash TEXT UNIQUE,
  status TEXT CHECK(status IN ('pending', 'saved', 'read', 'dismissed')) DEFAULT 'pending',
  found_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  read_at DATETIME,
  saved_at DATETIME,
  personal_notes TEXT,
  read_time TEXT DEFAULT '7 min read'
);

CREATE TABLE IF NOT EXISTS daily_stats (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  date TEXT UNIQUE NOT NULL,
  streak_count INTEGER DEFAULT 1,
  study_minutes INTEGER DEFAULT 0,
  resources_read INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS app_settings (
  key TEXT PRIMARY KEY,
  value TEXT
);

CREATE INDEX IF NOT EXISTS idx_crawled_status ON crawled_resources(status);
CREATE INDEX IF NOT EXISTS idx_crawled_skillset ON crawled_resources(skillset);
CREATE INDEX IF NOT EXISTS idx_weeks_skillset ON weeks(skillset);

CREATE TABLE IF NOT EXISTS crawl_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  completed_at DATETIME,
  status TEXT,
  items_crawled INTEGER DEFAULT 0,
  error_message TEXT
);

CREATE TABLE IF NOT EXISTS job_listings (
  id TEXT PRIMARY KEY,
  platform TEXT,
  title TEXT,
  company TEXT,
  location TEXT,
  skillset_match TEXT,
  description TEXT,
  url TEXT,
  status TEXT DEFAULT 'new', 
  fetched_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
