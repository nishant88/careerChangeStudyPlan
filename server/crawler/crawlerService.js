import crypto from 'crypto';
import db from '../db/index.js';
import { CURATED_KNOWLEDGE_VAULT, searchHackerNews } from './sources.js';

/**
 * Hash a string (URL or normalized title) for deduplication.
 */
function createHash(str) {
  return crypto.createHash('sha256').update(str.toLowerCase().trim()).digest('hex');
}

/**
 * Clean and normalize URLs to prevent subtle duplicates (e.g. tracking params, trailing slashes).
 */
function normalizeUrl(rawUrl) {
  try {
    const parsed = new URL(rawUrl);
    parsed.search = '';
    parsed.hash = '';
    return parsed.toString().replace(/\/$/, '');
  } catch (e) {
    return rawUrl.trim().replace(/\/$/, '');
  }
}

/**
 * Priority limits: determines how many items to discover per topic based on priority.
 */
const PRIORITY_LIMITS = {
  high: 4,
  medium: 2,
  low: 1
};

export class CrawlerService {
  /**
   * Run the crawl engine for all currently active topics.
   * Returns a detailed summary of discoveries and deduplications.
   */
  async runDailyCrawl() {
    console.log('[CrawlerService] Starting daily topic crawl...');
    const startTime = Date.now();

    // Mark status as running
    db.prepare(`
      INSERT OR REPLACE INTO app_settings (key, value)
      VALUES ('crawler_status', 'running')
    `).run();

    try {
      // 1. Fetch active topics: status = 'now' OR linked to an uncompleted active week
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
        console.log('[CrawlerService] No topics currently marked as "Now".');
        this.updateCrawlerStatus('idle', 0);
        return { success: true, count: 0, message: 'No active "Now" topics to crawl.' };
      }

      console.log(`[CrawlerService] Found ${activeTopics.length} active topics to crawl.`);

      const checkUrlExists = db.prepare('SELECT id FROM crawled_resources WHERE url_hash = ? OR url = ?');
      const insertResource = db.prepare(`
        INSERT INTO crawled_resources (
          topic_id, topic_title, title, url, url_hash, domain, summary, status, found_at, read_time
        ) VALUES (
          @topic_id, @topic_title, @title, @url, @url_hash, @domain, @summary, 'pending', CURRENT_TIMESTAMP, @read_time
        )
      `);

      let totalNewFound = 0;
      const topicSummaries = [];

      for (const topic of activeTopics) {
        const targetCount = PRIORITY_LIMITS[topic.priority] || 2;
        let topicNewCount = 0;
        const candidates = [];

        // Step A: Search Hacker News / Technical feeds live
        try {
          const liveHits = await searchHackerNews(topic.title);
          candidates.push(...liveHits);
        } catch (e) {
          console.warn(`[CrawlerService] Live search failed for ${topic.title}: ${e.message}`);
        }

        // Step B: Match against curated engineering vault
        const queryTerms = topic.title.toLowerCase().split(/\s+/).filter(w => w.length > 2);
        const vaultMatches = CURATED_KNOWLEDGE_VAULT.filter(item => {
          const matchKeyword = item.keywords.some(k => 
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

        // Step C: Deduplicate candidates against database
        for (const candidate of candidates) {
          if (topicNewCount >= targetCount) break;

          const normUrl = normalizeUrl(candidate.url);
          const hash = createHash(normUrl);

          const existing = checkUrlExists.get(hash, normUrl);
          if (!existing) {
            try {
              insertResource.run({
                topic_id: topic.id,
                topic_title: topic.title,
                title: candidate.title,
                url: normUrl,
                url_hash: hash,
                domain: candidate.domain,
                summary: candidate.summary || `Authoritative resource covering ${topic.title}.`,
                read_time: candidate.readTime || '6 min read'
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

      console.log(`[CrawlerService] Daily crawl completed in ${duration}ms. ${totalNewFound} fresh resources added.`);
      return {
        success: true,
        count: totalNewFound,
        durationMs: duration,
        topicSummaries
      };
    } catch (err) {
      console.error('[CrawlerService] Error during crawl:', err);
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

  /**
   * Get current crawler configuration and run status.
   */
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
