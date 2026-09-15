import express from 'express';
import db from '../db/index.js';
import { initCrawlerScheduler } from '../crawler/cron.js';

const router = express.Router();

// GET all settings
router.get('/', (req, res) => {
  try {
    const rows = db.prepare('SELECT key, value FROM app_settings').all();
    const settings = {};
    rows.forEach(r => { settings[r.key] = r.value; });
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update settings
router.put('/', (req, res) => {
  try {
    const updates = req.body;
    const upsert = db.prepare('INSERT OR REPLACE INTO app_settings (key, value) VALUES (?, ?)');

    const transaction = db.transaction(() => {
      for (const [key, val] of Object.entries(updates)) {
        upsert.run(key, String(val));
      }
    });
    transaction();

    // If cron expression was updated, refresh scheduler
    if (updates.crawler_cron) {
      initCrawlerScheduler();
    }

    const rows = db.prepare('SELECT key, value FROM app_settings').all();
    const settings = {};
    rows.forEach(r => { settings[r.key] = r.value; });

    res.json({ success: true, settings });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
