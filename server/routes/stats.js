import express from 'express';
import db from '../db/index.js';

const router = express.Router();

// GET aggregated stats for dashboard
router.get('/', (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    // Weeks completed
    const totalWeeksRow = db.prepare('SELECT count(*) as total, SUM(completed) as completed FROM weeks').get();
    const totalWeeks = totalWeeksRow.total || 0;
    const completedWeeks = totalWeeksRow.completed || 0;
    const percentComplete = totalWeeks > 0 ? Math.round((completedWeeks / totalWeeks) * 100) : 0;

    // Current active week
    const currentWeek = db.prepare(`
      SELECT w.*, p.title as phase_title 
      FROM weeks w 
      JOIN phases p ON w.phase_id = p.id 
      WHERE w.completed = 0 
      ORDER BY w.display_order ASC 
      LIMIT 1
    `).get() || db.prepare('SELECT * FROM weeks ORDER BY display_order DESC LIMIT 1').get();

    // Resources read this month
    const startOfMonth = today.substring(0, 7) + '-01';
    const monthStats = db.prepare('SELECT SUM(resources_read) as read_count, SUM(study_minutes) as minutes FROM daily_stats WHERE date >= ?').get(startOfMonth);
    const resourcesReadMonth = monthStats.read_count || 0;
    const studyMinutesMonth = monthStats.minutes || 0;

    // Current streak calculation
    const streakRow = db.prepare('SELECT streak_count FROM daily_stats WHERE date = ?').get(today);
    let currentStreak = streakRow ? streakRow.streak_count : 1;

    // Daily digest pending count
    const pendingDigest = db.prepare("SELECT count(*) as pending FROM crawled_resources WHERE status = 'pending'").get();

    // Total saved in library
    const libraryCount = db.prepare("SELECT count(*) as count FROM crawled_resources WHERE status IN ('saved', 'read')").get();

    res.json({
      totalWeeks,
      completedWeeks,
      percentComplete,
      currentWeek,
      resourcesReadMonth,
      studyMinutesMonth,
      currentStreak,
      pendingDigestCount: pendingDigest.pending || 0,
      savedLibraryCount: libraryCount.count || 0
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/stats/study-session - Record completed focus session (e.g. 45 min)
router.post('/study-session', (req, res) => {
  try {
    const { minutes = 45 } = req.body;
    const today = new Date().toISOString().split('T')[0];

    db.prepare(`
      INSERT INTO daily_stats (date, streak_count, study_minutes, resources_read)
      VALUES (?, 1, ?, 0)
      ON CONFLICT(date) DO UPDATE SET study_minutes = study_minutes + ?
    `).run(today, minutes, minutes);

    res.json({ success: true, recordedMinutes: minutes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/stats/profile - Get skillset growth data
router.get('/profile', (req, res) => {
  try {
    // 1. Fetch from weeks (curriculum)
    const weeksData = db.prepare(`
      SELECT skillset, count(*) as total, sum(completed) as read
      FROM weeks
      GROUP BY skillset
    `).all();

    // 2. Fetch from crawled_resources (library/backlog)
    const crawledData = db.prepare(`
      SELECT skillset, 
             count(*) as total, 
             sum(CASE WHEN status = 'read' THEN 1 ELSE 0 END) as read
      FROM crawled_resources
      GROUP BY skillset
    `).all();

    // Aggregate both
    const skillsetMap = {};

    const processRow = (row) => {
      const name = row.skillset || 'Uncategorized';
      if (!skillsetMap[name]) {
        skillsetMap[name] = { name, total: 0, read: 0, percentage: 0 };
      }
      skillsetMap[name].total += row.total || 0;
      skillsetMap[name].read += row.read || 0;
    };

    weeksData.forEach(processRow);
    crawledData.forEach(processRow);

    const skillsets = Object.values(skillsetMap).map(skill => {
      skill.percentage = skill.total > 0 ? Math.round((skill.read / skill.total) * 100) : 0;
      return skill;
    });

    // Sort by most progress
    skillsets.sort((a, b) => b.percentage - a.percentage);

    // Get recently completed articles across both
    const recentWeeks = db.prepare(`
      SELECT id, title, skillset, 'curriculum' as source, completed_at as date
      FROM weeks
      WHERE completed = 1
      ORDER BY completed_at DESC
      LIMIT 10
    `).all();

    const recentCrawled = db.prepare(`
      SELECT id, title, skillset, 'library' as source, read_at as date
      FROM crawled_resources
      WHERE status = 'read'
      ORDER BY read_at DESC
      LIMIT 10
    `).all();

    let recentCompletions = [...recentWeeks, ...recentCrawled]
      .filter(item => item.date)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 10);

    res.json({
      skillsets,
      recentCompletions
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
