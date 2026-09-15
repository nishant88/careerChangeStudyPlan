import express from 'express';
import db from '../db/index.js';

const router = express.Router();

// GET all saved resources in the library with filters
router.get('/', (req, res) => {
  try {
    const { search, topic, domain, status } = req.query;

    let query = `
      SELECT cr.*, t.priority, t.tags
      FROM crawled_resources cr
      LEFT JOIN topics t ON cr.topic_id = t.id
      WHERE cr.status IN ('saved', 'read')
    `;
    const params = [];

    if (status === 'saved' || status === 'read') {
      query += ' AND cr.status = ?';
      params.push(status);
    }

    if (topic) {
      query += ' AND cr.topic_title LIKE ?';
      params.push(`%${topic}%`);
    }

    if (domain) {
      query += ' AND cr.domain LIKE ?';
      params.push(`%${domain}%`);
    }

    if (search) {
      query += ' AND (cr.title LIKE ? OR cr.summary LIKE ? OR cr.personal_notes LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY COALESCE(cr.saved_at, cr.found_at) DESC';

    const items = db.prepare(query).all(...params);

    // Get list of distinct topics and domains for filtering UI
    const topics = db.prepare("SELECT DISTINCT topic_title FROM crawled_resources WHERE status IN ('saved', 'read')").all().map(r => r.topic_title);
    const domains = db.prepare("SELECT DISTINCT domain FROM crawled_resources WHERE status IN ('saved', 'read')").all().map(r => r.domain);

    res.json({
      items,
      count: items.length,
      availableTopics: topics,
      availableDomains: domains
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/library/:id/notes - Update personal notes on a saved resource
router.put('/:id/notes', (req, res) => {
  try {
    const { id } = req.params;
    const { personal_notes } = req.body;

    db.prepare('UPDATE crawled_resources SET personal_notes = ? WHERE id = ?').run(personal_notes, id);
    const updated = db.prepare('SELECT * FROM crawled_resources WHERE id = ?').get(id);

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/library/:id/toggle-read - Toggle read status in library
router.put('/:id/toggle-read', (req, res) => {
  try {
    const { id } = req.params;
    const item = db.prepare('SELECT * FROM crawled_resources WHERE id = ?').get(id);
    if (!item) return res.status(404).json({ error: 'Item not found' });

    const newStatus = item.status === 'read' ? 'saved' : 'read';
    const readAt = newStatus === 'read' ? new Date().toISOString() : null;

    db.prepare('UPDATE crawled_resources SET status = ?, read_at = ? WHERE id = ?').run(newStatus, readAt, id);

    if (newStatus === 'read') {
      const today = new Date().toISOString().split('T')[0];
      db.prepare(`
        INSERT INTO daily_stats (date, resources_read, streak_count, study_minutes)
        VALUES (?, 1, 1, 0)
        ON CONFLICT(date) DO UPDATE SET resources_read = resources_read + 1
      `).run(today);
    }

    const updated = db.prepare('SELECT * FROM crawled_resources WHERE id = ?').get(id);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/library/:id - Delete item from library
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    db.prepare("UPDATE crawled_resources SET status = 'dismissed' WHERE id = ?").run(id);
    res.json({ success: true, message: 'Item removed from library' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
