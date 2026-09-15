import express from 'express';
import db from '../db/index.js';

const router = express.Router();

// GET daily digest (unreviewed pending items)
router.get('/', (req, res) => {
  try {
    const items = db.prepare(`
      SELECT cr.*, t.priority, t.tags
      FROM crawled_resources cr
      LEFT JOIN topics t ON cr.topic_id = t.id
      WHERE cr.status = 'pending'
      ORDER BY 
        CASE t.priority
          WHEN 'high' THEN 1
          WHEN 'medium' THEN 2
          WHEN 'low' THEN 3
          ELSE 4
        END ASC,
        cr.found_at DESC
    `).all();

    res.json({ digest: items, count: items.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Helper to record activity and maintain daily streak
function recordReadActivity() {
  const today = new Date().toISOString().split('T')[0];
  const yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterday = yesterdayDate.toISOString().split('T')[0];

  const todayStats = db.prepare('SELECT * FROM daily_stats WHERE date = ?').get(today);
  const yesterdayStats = db.prepare('SELECT * FROM daily_stats WHERE date = ?').get(yesterday);

  let currentStreak = 1;
  if (todayStats) {
    currentStreak = todayStats.streak_count;
  } else if (yesterdayStats) {
    currentStreak = yesterdayStats.streak_count + 1;
  }

  db.prepare(`
    INSERT INTO daily_stats (date, streak_count, resources_read, study_minutes)
    VALUES (?, ?, 1, 0)
    ON CONFLICT(date) DO UPDATE SET
      resources_read = resources_read + 1,
      streak_count = ?
  `).run(today, currentStreak, currentStreak);
}

// PUT /api/digest/:id/save - Save item to permanent library
router.put('/:id/save', (req, res) => {
  try {
    const { id } = req.params;
    const now = new Date().toISOString();

    db.prepare(`
      UPDATE crawled_resources
      SET status = 'saved', saved_at = ?
      WHERE id = ?
    `).run(now, id);

    const updated = db.prepare('SELECT * FROM crawled_resources WHERE id = ?').get(id);
    res.json({ success: true, item: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/digest/:id/read - Mark as read directly from digest
router.put('/:id/read', (req, res) => {
  try {
    const { id } = req.params;
    const now = new Date().toISOString();

    db.prepare(`
      UPDATE crawled_resources
      SET status = 'read', read_at = ?
      WHERE id = ?
    `).run(now, id);

    recordReadActivity();

    const updated = db.prepare('SELECT * FROM crawled_resources WHERE id = ?').get(id);
    res.json({ success: true, item: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/digest/:id/dismiss - Dismiss from daily feed
router.put('/:id/dismiss', (req, res) => {
  try {
    const { id } = req.params;

    db.prepare(`
      UPDATE crawled_resources
      SET status = 'dismissed'
      WHERE id = ?
    `).run(id);

    res.json({ success: true, message: 'Item dismissed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
