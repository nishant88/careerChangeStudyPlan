import express from 'express';
import db from '../db/index.js';

const router = express.Router();

// GET all topics
router.get('/', (req, res) => {
  try {
    const topics = db.prepare(`
      SELECT t.*, w.week_number 
      FROM topics t
      LEFT JOIN weeks w ON t.week_id = w.id
      ORDER BY 
        CASE t.priority
          WHEN 'high' THEN 1
          WHEN 'medium' THEN 2
          WHEN 'low' THEN 3
          ELSE 4
        END ASC,
        t.created_at DESC
    `).all();

    // Group into now, next, someday, archived
    const grouped = {
      now: topics.filter(t => t.status === 'now'),
      next: topics.filter(t => t.status === 'next'),
      someday: topics.filter(t => t.status === 'someday'),
      archived: topics.filter(t => t.status === 'archived')
    };

    res.json({ topics, grouped });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create a new topic
router.post('/', (req, res) => {
  try {
    const { title, description, priority = 'medium', status = 'now', tags = [] } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Topic title is required' });
    }

    const tagsJson = JSON.stringify(Array.isArray(tags) ? tags : [tags]);

    const result = db.prepare(`
      INSERT INTO topics (title, description, status, priority, is_seed_week, week_id, tags)
      VALUES (?, ?, ?, ?, 0, NULL, ?)
    `).run(title.trim(), description ? description.trim() : '', status, priority, tagsJson);

    const created = db.prepare('SELECT * FROM topics WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update a topic (status, priority, description, etc.)
router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status, priority, tags } = req.body;

    const current = db.prepare('SELECT * FROM topics WHERE id = ?').get(id);
    if (!current) {
      return res.status(404).json({ error: 'Topic not found' });
    }

    const tagsJson = tags !== undefined ? JSON.stringify(Array.isArray(tags) ? tags : [tags]) : current.tags;

    db.prepare(`
      UPDATE topics
      SET title = COALESCE(?, title),
          description = COALESCE(?, description),
          status = COALESCE(?, status),
          priority = COALESCE(?, priority),
          tags = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      title ? title.trim() : null,
      description !== undefined ? description.trim() : null,
      status || null,
      priority || null,
      tagsJson,
      id
    );

    const updated = db.prepare('SELECT * FROM topics WHERE id = ?').get(id);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE a topic (or archive)
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { hardDelete = false } = req.query;

    if (hardDelete === 'true') {
      db.prepare('DELETE FROM topics WHERE id = ?').run(id);
      return res.json({ success: true, message: 'Topic permanently deleted' });
    }

    // Default soft delete: mark status = 'archived' which immediately stops future crawler hits
    db.prepare("UPDATE topics SET status = 'archived', updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(id);
    res.json({ success: true, message: 'Topic archived and excluded from crawls' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
