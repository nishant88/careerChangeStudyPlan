-- LevelUp Database Schema

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
  completed INTEGER DEFAULT 0,
  completed_at DATETIME,
  display_order INTEGER NOT NULL,
  notes TEXT
);

CREATE TABLE IF NOT EXISTS seed_resources (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  week_id INTEGER NOT NULL REFERENCES weeks(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  domain TEXT NOT NULL,
  type TEXT DEFAULT 'article'
);

CREATE TABLE IF NOT EXISTS topics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT CHECK(status IN ('now', 'next', 'someday', 'archived')) DEFAULT 'now',
  priority TEXT CHECK(priority IN ('high', 'medium', 'low')) DEFAULT 'medium',
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
  url TEXT NOT NULL UNIQUE,
  url_hash TEXT UNIQUE,
  domain TEXT NOT NULL,
  summary TEXT NOT NULL,
  status TEXT CHECK(status IN ('pending', 'saved', 'read', 'dismissed')) DEFAULT 'pending',
  found_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  read_at DATETIME,
  saved_at DATETIME,
  personal_notes TEXT,
  read_time TEXT DEFAULT '5 min read'
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
CREATE INDEX IF NOT EXISTS idx_crawled_url ON crawled_resources(url);
CREATE INDEX IF NOT EXISTS idx_topics_status ON topics(status);
