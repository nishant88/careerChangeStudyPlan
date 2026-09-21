import express from 'express';
import db from '../db/index.js';
import { jobService } from '../services/jobService.js';

const router = express.Router();

// GET all job listings
router.get('/', (req, res) => {
  try {
    const jobs = db.prepare(`
      SELECT * FROM job_listings 
      ORDER BY fetched_at DESC 
      LIMIT 100
    `).all();
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST to trigger a job fetch manually
router.post('/fetch', async (req, res) => {
  try {
    const count = await jobService.fetchJobsFromAPIs();
    res.json({ success: true, count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT to update a job's status (e.g. 'applied', 'ignored')
router.put('/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  try {
    const result = db.prepare(`
      UPDATE job_listings SET status = ? WHERE id = ?
    `).run(status, id);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Job not found' });
    }
    
    res.json({ success: true, id, status });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
