import express from 'express';
import { crawlerService } from '../crawler/crawlerService.js';

const router = express.Router();

// GET crawler status and history
router.get('/status', (req, res) => {
  try {
    const status = crawlerService.getStatus();
    res.json(status);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST trigger immediate crawl on active topics
router.post('/run', async (req, res) => {
  try {
    const result = await crawlerService.runDailyCrawl();
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
