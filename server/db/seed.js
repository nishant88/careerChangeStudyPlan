import db from './index.js';
import { phasesData, weeksData, initialBacklogTopics } from './seedData.js';

export function seedDatabase(force = false) {
  const existingWeeks = db.prepare('SELECT count(*) as count FROM weeks').get();
  if (existingWeeks.count > 0 && !force) {
    console.log(`[Database] Seed already populated (${existingWeeks.count} weeks found). Skipping seed.`);
    return;
  }

  console.log('[Database] Seeding LevelUp curriculum & initial topics...');

  const insertPhase = db.prepare(`
    INSERT OR REPLACE INTO phases (phase_number, title, description)
    VALUES (@phase_number, @title, @description)
  `);

  const insertWeek = db.prepare(`
    INSERT INTO weeks (week_number, phase_id, title, learning_goal, action_item, completed, display_order)
    VALUES (@week_number, @phase_id, @title, @learning_goal, @action_item, 0, @display_order)
  `);

  const insertResource = db.prepare(`
    INSERT INTO seed_resources (week_id, title, url, domain, type)
    VALUES (@week_id, @title, @url, @domain, @type)
  `);

  const insertTopic = db.prepare(`
    INSERT INTO topics (title, description, status, priority, is_seed_week, week_id, tags)
    VALUES (@title, @description, @status, @priority, @is_seed_week, @week_id, @tags)
  `);

  const transaction = db.transaction(() => {
    if (force) {
      db.prepare('DELETE FROM crawled_resources').run();
      db.prepare('DELETE FROM seed_resources').run();
      db.prepare('DELETE FROM topics').run();
      db.prepare('DELETE FROM weeks').run();
      db.prepare('DELETE FROM phases').run();
    }

    // Insert Phases
    const phaseMap = {};
    for (const phase of phasesData) {
      insertPhase.run(phase);
      const row = db.prepare('SELECT id FROM phases WHERE phase_number = ?').get(phase.phase_number);
      phaseMap[phase.phase_number] = row.id;
    }

    // Insert Weeks & Seed Resources & Link to Topics
    for (const week of weeksData) {
      const phaseId = phaseMap[week.phase_number];
      const result = insertWeek.run({
        week_number: week.week_number,
        phase_id: phaseId,
        title: week.title,
        learning_goal: week.learning_goal,
        action_item: week.action_item,
        display_order: week.week_number
      });
      const weekId = result.lastInsertRowid;

      // Seed resources
      for (const res of week.resources) {
        insertResource.run({
          week_id: weekId,
          title: res.title,
          url: res.url,
          domain: res.domain,
          type: 'article'
        });
      }

      // Also create a linked topic in the study plan
      insertTopic.run({
        title: week.title,
        description: week.learning_goal,
        status: week.week_number === 1 ? 'now' : 'next',
        priority: 'high',
        is_seed_week: 1,
        week_id: weekId,
        tags: JSON.stringify([`Phase ${week.phase_number}`, 'Curriculum'])
      });
    }

    // Insert custom backlog topics
    for (const topic of initialBacklogTopics) {
      insertTopic.run({
        title: topic.title,
        description: topic.description,
        status: topic.status,
        priority: topic.priority,
        is_seed_week: 0,
        week_id: null,
        tags: JSON.stringify(topic.tags)
      });
    }

    // Initialize daily stats for today
    const today = new Date().toISOString().split('T')[0];
    db.prepare(`
      INSERT OR IGNORE INTO daily_stats (date, streak_count, study_minutes, resources_read)
      VALUES (?, 1, 0, 0)
    `).run(today);

    // Default settings
    db.prepare(`
      INSERT OR IGNORE INTO app_settings (key, value)
      VALUES ('crawler_cron', '0 7 * * *'),
             ('crawler_last_run', NULL),
             ('crawler_status', 'idle'),
             ('active_week_number', '1')
    `).run();
  });

  transaction();
  console.log('[Database] Seed completed successfully!');
}

// Allow direct execution: node server/db/seed.js [--force]
if (process.argv[1] && process.argv[1].endsWith('seed.js')) {
  const force = process.argv.includes('--force');
  seedDatabase(force);
}
