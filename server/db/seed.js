import db from './index.js';
import { phasesData, weeksData, initialBacklogTopics } from './seedData.js';

export function seedDatabase(force = false) {
  const existingWeeks = db.prepare('SELECT count(*) as count FROM weeks').get();
  if (existingWeeks.count > 0 && !force) {
    console.log(`[Database] Seed already populated (${existingWeeks.count} weeks found).`);
    return;
  }

  console.log('[Database] Populating in-app curriculum lessons & skillset topics...');

  const insertPhase = db.prepare(`
    INSERT OR REPLACE INTO phases (phase_number, title, description)
    VALUES (@phase_number, @title, @description)
  `);

  const insertWeek = db.prepare(`
    INSERT INTO weeks (
      week_number, phase_id, title, learning_goal, action_item, 
      skillset, skillset_priority, content_body, key_takeaways, actionable_template, read_time,
      completed, display_order
    ) VALUES (
      @week_number, @phase_id, @title, @learning_goal, @action_item,
      @skillset, @skillset_priority, @content_body, @key_takeaways, @actionable_template, @read_time,
      0, @display_order
    )
  `);

  const insertSeedResource = db.prepare(`
    INSERT INTO seed_resources (
      week_id, title, domain, summary, content_body, key_takeaways, actionable_template, read_time, type
    ) VALUES (
      @week_id, @title, @domain, @summary, @content_body, @key_takeaways, @actionable_template, @read_time, 'lesson'
    )
  `);

  const insertTopic = db.prepare(`
    INSERT INTO topics (title, description, skillset, priority, skillset_priority, status, is_seed_week, week_id, tags)
    VALUES (@title, @description, @skillset, @priority, @skillset_priority, @status, @is_seed_week, @week_id, @tags)
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

    // Insert Weeks with full in-app master lessons
    for (const week of weeksData) {
      const phaseId = phaseMap[week.phase_number];
      const result = insertWeek.run({
        week_number: week.week_number,
        phase_id: phaseId,
        title: week.title,
        learning_goal: week.learning_goal,
        action_item: week.action_item,
        skillset: week.skillset || 'Program Management',
        skillset_priority: week.skillset_priority || 'P0 - Core TPM Discipline',
        content_body: week.content_body,
        key_takeaways: JSON.stringify(week.key_takeaways || []),
        actionable_template: week.actionable_template || '',
        read_time: week.read_time || '8 min read',
        display_order: week.week_number
      });
      const weekId = result.lastInsertRowid;

      // Also create a companion in-app seed lesson resource
      insertSeedResource.run({
        week_id: weekId,
        title: `Mastery Guide: ${week.title}`,
        domain: 'Internal Knowledge Vault',
        summary: week.learning_goal,
        content_body: week.content_body,
        key_takeaways: JSON.stringify(week.key_takeaways || []),
        actionable_template: week.actionable_template || '',
        read_time: week.read_time || '8 min read',
        type: 'lesson'
      });

      // Link to topic
      insertTopic.run({
        title: week.title,
        description: week.learning_goal,
        skillset: week.skillset || 'Program Management',
        priority: 'high',
        skillset_priority: week.skillset_priority || 'P0 - Core TPM Discipline',
        status: week.week_number === 1 ? 'now' : 'next',
        is_seed_week: 1,
        week_id: weekId,
        tags: JSON.stringify([`Phase ${week.phase_number}`, week.skillset])
      });
    }

    // Insert initial backlog topics
    for (const topic of initialBacklogTopics) {
      insertTopic.run({
        title: topic.title,
        description: topic.description,
        skillset: topic.skillset || 'Technical Architecture',
        priority: topic.priority || 'medium',
        skillset_priority: topic.skillset_priority || 'P1 - High-Value Differentiator',
        status: topic.status || 'next',
        is_seed_week: 0,
        week_id: null,
        tags: JSON.stringify(topic.tags || [])
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
  console.log('[Database] Seed completed successfully with in-app lessons!');
}

if (process.argv[1] && process.argv[1].endsWith('seed.js')) {
  const force = process.argv.includes('--force');
  seedDatabase(force);
}
