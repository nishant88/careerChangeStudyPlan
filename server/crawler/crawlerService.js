import crypto from 'crypto';
import db from '../db/index.js';
import { IN_APP_LESSONS_VAULT, synthesizeInAppLesson } from './sources.js';
import ytSearch from 'yt-search';

function createHash(str) {
  return crypto.createHash('sha256').update(str.toLowerCase().trim()).digest('hex');
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

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
          content_body, key_takeaways, actionable_template, youtube_videos, url, url_hash, status, found_at, read_time
        ) VALUES (
          @topic_id, @topic_title, @title, @domain, @summary, @skillset, @skillset_priority,
          @content_body, @key_takeaways, @actionable_template, @youtube_videos, @url, @url_hash, 'pending', CURRENT_TIMESTAMP, @read_time
        )
      `);

      // Ensure Phase 4 exists for Continuous Topic Exploration
      let phase4 = db.prepare("SELECT id FROM phases WHERE phase_number = 4").get();
      if (!phase4) {
        db.prepare("INSERT INTO phases (phase_number, title, description) VALUES (4, 'Phase 4: Continuous Topic Exploration', 'Dynamically generated deep-dives from your active backlog crawler.')").run();
        phase4 = db.prepare("SELECT id FROM phases WHERE phase_number = 4").get();
      }

      const insertWeek = db.prepare(`
        INSERT INTO weeks (week_number, phase_id, title, learning_goal, action_item, skillset, skillset_priority, content_body, key_takeaways, actionable_template, youtube_videos, display_order)
        VALUES (@week_number, @phase_id, @title, @learning_goal, @action_item, @skillset, @skillset_priority, @content_body, @key_takeaways, @actionable_template, @youtube_videos, @display_order)
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
          const synthesized = await synthesizeInAppLesson(
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
            
            // --- ALWAYS FETCH VIDEOS IF NOT PRESENT ---
            if (!candidate.youtube_videos || candidate.youtube_videos.length === 0) {
              candidate.youtube_videos = [];
              try {
                const queryMasterclass = `${candidate.title} ${topic.skillset || ''} masterclass full course`;
                const queryGeneral = `${candidate.title} ${topic.skillset || ''} detailed explanation`;
                
                await sleep(1500); // Prevent rate limiting
                const r1 = await ytSearch(queryMasterclass);
                await sleep(1500);
                const r2 = await ytSearch(queryGeneral);
                
                // Combine and filter for videos >= 30 minutes (1800 seconds)
                const allVideos = [...r1.videos, ...r2.videos]
                  .filter(v => v.seconds >= 1800)
                  .sort((a, b) => b.seconds - a.seconds); // Longest first
                  
                // Deduplicate by URL
                const uniqueVideos = [];
                const seenUrls = new Set();
                for (const v of allVideos) {
                  if (!seenUrls.has(v.url)) {
                    seenUrls.add(v.url);
                    uniqueVideos.push(v);
                  }
                }
                
                const topVideos = uniqueVideos.slice(0, 4); // Keep up to 4 informative videos
                
                topVideos.forEach(v => {
                  candidate.youtube_videos.push({
                    title: v.title,
                    url: v.url,
                    embedUrl: v.url.replace('watch?v=', 'embed/'),
                    duration: v.timestamp
                  });
                });
              } catch (err) {
                console.error('[CrawlerService] Error fetching missing YouTube videos:', err);
              }
            }

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
                youtube_videos: candidate.youtube_videos ? JSON.stringify(candidate.youtube_videos) : '[]',
                url: internalSlug,
                url_hash: hash,
                read_time: candidate.readTime || candidate.read_time || '7 min read'
              });

              // Add to 12-Week Curriculum as a new Week
              const maxWeek = db.prepare('SELECT MAX(week_number) as maxW, MAX(display_order) as maxOrder FROM weeks').get();
              const nextWeekNum = (maxWeek.maxW || 0) + 1;
              const nextOrder = (maxWeek.maxOrder || 0) + 1;

              insertWeek.run({
                week_number: nextWeekNum,
                phase_id: phase4.id,
                title: candidate.title,
                learning_goal: candidate.summary || `Executive in-app study briefing covering ${topic.title}.`,
                action_item: 'Review the actionable template and apply it to your current engineering challenges.',
                skillset: candidate.skillset || topic.skillset || 'Program Management',
                skillset_priority: candidate.skillset_priority || (topic.priority === 'high' ? 'P0 - Core TPM Discipline' : 'P1 - High-Value Differentiator'),
                content_body: candidate.content_body,
                key_takeaways: Array.isArray(candidate.key_takeaways) ? JSON.stringify(candidate.key_takeaways) : (candidate.key_takeaways || '[]'),
                actionable_template: candidate.actionable_template || '',
                youtube_videos: candidate.youtube_videos ? JSON.stringify(candidate.youtube_videos) : '[]',
                display_order: nextOrder
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
