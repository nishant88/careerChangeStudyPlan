import express from 'express';
import db from '../db/index.js';

const router = express.Router();

// GET all phases and weeks
router.get('/', (req, res) => {
  try {
    const phases = db.prepare('SELECT * FROM phases ORDER BY phase_number ASC').all();
    const weeks = db.prepare(`
      SELECT w.*, p.phase_number, p.title as phase_title 
      FROM weeks w 
      JOIN phases p ON w.phase_id = p.id 
      ORDER BY w.display_order ASC
    `).all();

    const resources = db.prepare('SELECT * FROM seed_resources').all();

    // Map resources to weeks
    const weeksWithResources = weeks.map(week => ({
      ...week,
      completed: Boolean(week.completed),
      resources: resources.filter(r => r.week_id === week.id)
    }));

    // Nest weeks into phases
    const result = phases.map(phase => ({
      ...phase,
      weeks: weeksWithResources.filter(w => w.phase_id === phase.id)
    }));

    res.json({ phases: result, totalWeeks: weeks.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update a week (e.g. toggle completed, edit notes/action items)
router.put('/weeks/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { completed, notes, title, learning_goal, action_item } = req.body;

    const current = db.prepare('SELECT * FROM weeks WHERE id = ?').get(id);
    if (!current) {
      return res.status(404).json({ error: 'Week not found' });
    }

    const newCompleted = completed !== undefined ? (completed ? 1 : 0) : current.completed;
    const completedAt = newCompleted && !current.completed ? new Date().toISOString() : (newCompleted ? current.completed_at : null);

    db.prepare(`
      UPDATE weeks 
      SET completed = ?,
          completed_at = ?,
          notes = COALESCE(?, notes),
          title = COALESCE(?, title),
          learning_goal = COALESCE(?, learning_goal),
          action_item = COALESCE(?, action_item)
      WHERE id = ?
    `).run(
      newCompleted,
      completedAt,
      notes !== undefined ? notes : current.notes,
      title || current.title,
      learning_goal || current.learning_goal,
      action_item || current.action_item,
      id
    );

    const updated = db.prepare('SELECT * FROM weeks WHERE id = ?').get(id);
    res.json({ ...updated, completed: Boolean(updated.completed) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST add a new custom week
router.post('/weeks', (req, res) => {
  try {
    const { phase_id, title, learning_goal, action_item, resources } = req.body;

    if (!title || !learning_goal) {
      return res.status(400).json({ error: 'Title and learning goal are required' });
    }

    const maxWeek = db.prepare('SELECT MAX(week_number) as maxW, MAX(display_order) as maxOrder FROM weeks').get();
    const nextWeekNum = (maxWeek.maxW || 0) + 1;
    const nextOrder = (maxWeek.maxOrder || 0) + 1;

    let targetPhaseId = phase_id;
    if (!targetPhaseId) {
      const firstPhase = db.prepare('SELECT id FROM phases ORDER BY phase_number ASC LIMIT 1').get();
      targetPhaseId = firstPhase.id;
    }

    const insert = db.transaction(() => {
      const result = db.prepare(`
        INSERT INTO weeks (week_number, phase_id, title, learning_goal, action_item, completed, display_order)
        VALUES (?, ?, ?, ?, ?, 0, ?)
      `).run(nextWeekNum, targetPhaseId, title, learning_goal, action_item || '', nextOrder);

      const weekId = result.lastInsertRowid;

      if (Array.isArray(resources)) {
        const insertRes = db.prepare(`
          INSERT INTO seed_resources (week_id, title, url, domain)
          VALUES (?, ?, ?, ?)
        `);
        for (const r of resources) {
          if (r.title && r.url) {
            let domain = 'web';
            try {
              domain = new URL(r.url).hostname.replace('www.', '');
            } catch (e) {}
            insertRes.run(weekId, r.title, r.url, domain);
          }
        }
      }

      // Automatically add as a topic too
      db.prepare(`
        INSERT INTO topics (title, description, status, priority, is_seed_week, week_id, tags)
        VALUES (?, ?, 'next', 'high', 1, ?, ?)
      `).run(title, learning_goal, weekId, JSON.stringify(['Custom Week']));

      return weekId;
    });

    const newWeekId = insert();
    const created = db.prepare('SELECT * FROM weeks WHERE id = ?').get(newWeekId);
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT reorder weeks
router.put('/reorder', (req, res) => {
  try {
    const { orderedIds } = req.body; // Array of week IDs in order
    if (!Array.isArray(orderedIds)) {
      return res.status(400).json({ error: 'orderedIds array required' });
    }

    const updateOrder = db.prepare('UPDATE weeks SET display_order = ? WHERE id = ?');
    const transaction = db.transaction(() => {
      orderedIds.forEach((id, index) => {
        updateOrder.run(index + 1, id);
      });
    });
    transaction();

    res.json({ success: true, message: 'Weeks reordered' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE a custom week
router.delete('/weeks/:id', (req, res) => {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM seed_resources WHERE week_id = ?').run(id);
    db.prepare('DELETE FROM topics WHERE week_id = ?').run(id);
    db.prepare('DELETE FROM weeks WHERE id = ?').run(id);
    res.json({ success: true, message: 'Week deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
