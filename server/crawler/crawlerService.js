import crypto from 'crypto';
import db from '../db/index.js';
import { IN_APP_LESSONS_VAULT, synthesizeInAppLesson } from './sources.js';

function createHash(str) {
  return crypto.createHash('sha256').update(str.toLowerCase().trim()).digest('hex');
}

const PRIORITY_LIMITS = {
  high: 3,
  medium: 2,
  low: 1
};

export class CrawlerService {
  /**
   * Run the crawl engine for all currently active topics.
   * Generates self-contained, in-app executive lessons without external links.
   */
  async runDailyCrawl() {
    console.log('[CrawlerService] Synthesizing daily in-app study lessons for active topics...');
    const startTime = Date.now();

    db.prepare(`
      INSERT OR REPLACE INTO app_settings (key, value)
      VALUES ('crawler_status', 'running')
    `).run();

    try {
      const activeTopics = db.prepare(`
        SELECT t.*, w.week_number 
        FROM topics t
        LEFT JOIN weeks w ON t.week_id = w.id
        WHERE t.status = 'now'
        ORDER BY 
          CASE t.priority
            WHEN 'high' THEN 1
            WHEN 'medium' THEN 2
            WHEN 'low' THEN 3
            ELSE 4
          END ASC
      `).all();

      if (activeTopics.length === 0) {
        console.log('[CrawlerService] No topics marked as "Now".');
        this.updateCrawlerStatus('idle', 0);
        return { success: true, count: 0, message: 'No active "Now" topics to crawl.' };
      }

      const checkUrlExists = db.prepare('SELECT id FROM crawled_resources WHERE url_hash = ? OR title = ?');
      const insertResource = db.prepare(`
        INSERT INTO crawled_resources (
          topic_id, topic_title, title, domain, summary, skillset, skillset_priority,
          content_body, key_takeaways, actionable_template, url, url_hash, status, found_at, read_time
        ) VALUES (
          @topic_id, @topic_title, @title, @domain, @summary, @skillset, @skillset_priority,
          @content_body, @key_takeaways, @actionable_template, @url, @url_hash, 'pending', CURRENT_TIMESTAMP, @read_time
        )
      `);

      let totalNewFound = 0;
      const topicSummaries = [];

      for (const topic of activeTopics) {
        const targetCount = PRIORITY_LIMITS[topic.priority] || 2;
        let topicNewCount = 0;
        const candidates = [];

        // Match against in-app lesson vault
        const queryTerms = topic.title.toLowerCase().split(/\s+/).filter(w => w.length > 2);
        const vaultMatches = IN_APP_LESSONS_VAULT.filter(item => {
          const matchKeyword = item.keywords && item.keywords.some(k => 
            topic.title.toLowerCase().includes(k) || 
            (topic.description && topic.description.toLowerCase().includes(k))
          );
          const matchTerm = queryTerms.some(term => 
            item.title.toLowerCase().includes(term) || 
            item.summary.toLowerCase().includes(term)
          );
          return matchKeyword || matchTerm;
        });

        candidates.push(...vaultMatches);

        // If candidates are fewer than targetCount, synthesize in-app deep dive module
        if (candidates.length < targetCount) {
          const synthesized = synthesizeInAppLesson(
            topic.title, 
            topic.description, 
            topic.priority, 
            topic.skillset || 'Technical Architecture'
          );
          candidates.push(synthesized);
        }

        // Deduplicate and insert
        for (const candidate of candidates) {
          if (topicNewCount >= targetCount) break;

          const internalSlug = `lesson-${createHash(candidate.title).substring(0, 12)}`;
          const hash = createHash(candidate.title);

          const existing = checkUrlExists.get(hash, candidate.title);
          if (!existing) {
            try {
              insertResource.run({
                topic_id: topic.id,
                topic_title: topic.title,
                title: candidate.title,
                domain: candidate.domain || 'Internal Master Lesson',
                summary: candidate.summary || `Executive in-app study briefing covering ${topic.title}.`,
                skillset: candidate.skillset || topic.skillset || 'Program Management',
                skillset_priority: candidate.skillset_priority || (topic.priority === 'high' ? 'P0 - Core TPM Discipline' : 'P1 - High-Value Differentiator'),
                content_body: candidate.content_body,
                key_takeaways: Array.isArray(candidate.key_takeaways) ? JSON.stringify(candidate.key_takeaways) : (candidate.key_takeaways || '[]'),
                actionable_template: candidate.actionable_template || '',
                url: internalSlug,
                url_hash: hash,
                read_time: candidate.readTime || candidate.read_time || '7 min read'
              });
              topicNewCount++;
              totalNewFound++;
            } catch (err) {
              // Ignore uniqueness collisions
            }
          }
        }

        topicSummaries.push({
          topic: topic.title,
          priority: topic.priority,
          found: topicNewCount,
          target: targetCount
        });
      }

      const duration = Date.now() - startTime;
      this.updateCrawlerStatus('idle', totalNewFound);

      console.log(`[CrawlerService] In-app lesson synthesis completed in ${duration}ms. ${totalNewFound} lessons generated.`);
      return {
        success: true,
        count: totalNewFound,
        durationMs: duration,
        topicSummaries
      };
    } catch (err) {
      console.error('[CrawlerService] Error during lesson synthesis:', err);
      this.updateCrawlerStatus('error', 0);
      throw err;
    }
  }

  updateCrawlerStatus(status, count) {
    const now = new Date().toISOString();
    const update = db.transaction(() => {
      db.prepare(`
        INSERT OR REPLACE INTO app_settings (key, value)
        VALUES ('crawler_status', ?)
      `).run(status);

      db.prepare(`
        INSERT OR REPLACE INTO app_settings (key, value)
        VALUES ('crawler_last_run', ?)
      `).run(now);

      db.prepare(`
        INSERT OR REPLACE INTO app_settings (key, value)
        VALUES ('crawler_last_found_count', ?)
      `).run(count.toString());
    });
    update();
  }

  getStatus() {
    const statusRow = db.prepare("SELECT value FROM app_settings WHERE key = 'crawler_status'").get();
    const lastRunRow = db.prepare("SELECT value FROM app_settings WHERE key = 'crawler_last_run'").get();
    const lastCountRow = db.prepare("SELECT value FROM app_settings WHERE key = 'crawler_last_found_count'").get();
    const cronRow = db.prepare("SELECT value FROM app_settings WHERE key = 'crawler_cron'").get();

    return {
      status: statusRow ? statusRow.value : 'idle',
      lastRun: lastRunRow ? lastRunRow.value : null,
      lastFoundCount: lastCountRow ? parseInt(lastCountRow.value, 10) : 0,
      cronExpression: cronRow ? cronRow.value : '0 7 * * *'
    };
  }
}

export const crawlerService = new CrawlerService();
