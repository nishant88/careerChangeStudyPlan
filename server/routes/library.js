import express from 'express';
import db from '../db/index.js';

const router = express.Router();

// GET all saved lessons in the library with filters
router.get('/', (req, res) => {
  try {
    const { search, topic, domain, status, skillset, priority } = req.query;

    let query = `
      SELECT cr.*, t.tags
      FROM crawled_resources cr
      LEFT JOIN topics t ON cr.topic_id = t.id
      WHERE 1=1
    `;
    const params = [];

    if (status === 'all') {
      // Fetch all items, no status filter needed
    } else if (status === 'saved' || status === 'read') {
      query += ' AND cr.status = ?';
      params.push(status);
    } else {
      // Default to saved and read for the normal library tab
      query += " AND cr.status IN ('saved', 'read')";
    }

    if (skillset) {
      query += ' AND cr.skillset LIKE ?';
      params.push(`%${skillset}%`);
    }

    if (priority) {
      query += ' AND cr.skillset_priority LIKE ?';
      params.push(`%${priority}%`);
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
      query += ' AND (cr.title LIKE ? OR cr.summary LIKE ? OR cr.content_body LIKE ? OR cr.personal_notes LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY COALESCE(cr.saved_at, cr.found_at) DESC';

    const items = db.prepare(query).all(...params);

    let topicFilterQuery = "SELECT DISTINCT topic_title FROM crawled_resources WHERE status IN ('saved', 'read')";
    let skillsetFilterQuery = "SELECT DISTINCT skillset FROM crawled_resources WHERE status IN ('saved', 'read')";
    
    if (status === 'all') {
      topicFilterQuery = "SELECT DISTINCT topic_title FROM crawled_resources";
      skillsetFilterQuery = "SELECT DISTINCT skillset FROM crawled_resources";
    }

    const topics = db.prepare(topicFilterQuery).all().map(r => r.topic_title).filter(Boolean);
    const skillsets = db.prepare(skillsetFilterQuery).all().map(r => r.skillset).filter(Boolean);

    res.json({
      items,
      count: items.length,
      availableTopics: topics,
      availableSkillsets: skillsets
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/library/:id/notes - Update personal takeaways on a saved lesson
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

// DELETE /api/library/:id - Delete lesson from library
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    db.prepare("UPDATE crawled_resources SET status = 'dismissed' WHERE id = ?").run(id);
    res.json({ success: true, message: 'Lesson removed from library' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
