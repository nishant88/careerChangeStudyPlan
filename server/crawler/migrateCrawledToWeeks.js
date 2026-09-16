import db from '../db/index.js';

function migrateExistingCrawledToWeeks() {
  console.log('Migrating existing crawled_resources to weeks...');

  // Ensure Phase 4 exists
  let phase4 = db.prepare("SELECT id FROM phases WHERE phase_number = 4").get();
  if (!phase4) {
    db.prepare("INSERT INTO phases (phase_number, title, description) VALUES (4, 'Phase 4: Continuous Topic Exploration', 'Dynamically generated deep-dives from your active backlog crawler.')").run();
    phase4 = db.prepare("SELECT id FROM phases WHERE phase_number = 4").get();
  }

  const existingCrawled = db.prepare('SELECT * FROM crawled_resources').all();
  let count = 0;

  const insertWeek = db.prepare(`
    INSERT INTO weeks (week_number, phase_id, title, learning_goal, action_item, skillset, skillset_priority, content_body, key_takeaways, actionable_template, youtube_videos, display_order)
    VALUES (@week_number, @phase_id, @title, @learning_goal, @action_item, @skillset, @skillset_priority, @content_body, @key_takeaways, @actionable_template, @youtube_videos, @display_order)
  `);

  for (const item of existingCrawled) {
    // Check if this title already exists in weeks
    const existingWeek = db.prepare('SELECT id FROM weeks WHERE title = ?').get(item.title);
    if (!existingWeek) {
      const maxWeek = db.prepare('SELECT MAX(week_number) as maxW, MAX(display_order) as maxOrder FROM weeks').get();
      const nextWeekNum = (maxWeek.maxW || 0) + 1;
      const nextOrder = (maxWeek.maxOrder || 0) + 1;

      insertWeek.run({
        week_number: nextWeekNum,
        phase_id: phase4.id,
        title: item.title,
        learning_goal: item.summary || `Executive in-app study briefing covering ${item.topic_title || 'a topic'}.`,
        action_item: 'Review the actionable template and apply it to your current engineering challenges.',
        skillset: item.skillset || 'Program Management',
        skillset_priority: item.skillset_priority || 'P1 - High-Value Differentiator',
        content_body: item.content_body,
        key_takeaways: item.key_takeaways || '[]',
        actionable_template: item.actionable_template || '',
        youtube_videos: item.youtube_videos || '[]',
        display_order: nextOrder
      });
      count++;
    }
  }

  console.log(`Successfully migrated ${count} existing crawled resources to weeks.`);
}

migrateExistingCrawledToWeeks();
