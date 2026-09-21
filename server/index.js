import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

import { seedDatabase } from './db/seed.js';
import { initCrawlerScheduler } from './crawler/cron.js';

import planRoutes from './routes/plan.js';
import topicsRoutes from './routes/topics.js';
import digestRoutes from './routes/digest.js';
import libraryRoutes from './routes/library.js';
import statsRoutes from './routes/stats.js';
import crawlerRoutes from './routes/crawler.js';
import settingsRoutes from './routes/settings.js';
import jobsRoutes from './routes/jobs.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize DB Seed if empty
seedDatabase(false);

// Initialize Daily Crawler Cron Job
initCrawlerScheduler();

// API Routes
app.use('/api/plan', planRoutes);
app.use('/api/topics', topicsRoutes);
app.use('/api/digest', digestRoutes);
app.use('/api/library', libraryRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/crawler', crawlerRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/jobs', jobsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'LevelUp TPM API', timestamp: new Date().toISOString() });
});

// Production static file serving (Vite build output)
const distPath = path.join(__dirname, '../dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// Start Server
app.listen(PORT, () => {
  console.log(`[LevelUp Server] Running on http://localhost:${PORT}`);
  console.log(`[LevelUp Server] Environment: ${process.env.NODE_ENV || 'development'}`);
});
