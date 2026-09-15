import cron from 'node-cron';
import { crawlerService } from './crawlerService.js';
import db from '../db/index.js';

let cronTask = null;

export function initCrawlerScheduler() {
  const cronSetting = db.prepare("SELECT value FROM app_settings WHERE key = 'crawler_cron'").get();
  const cronExpr = process.env.CRAWLER_CRON || (cronSetting ? cronSetting.value : '0 7 * * *');

  if (cronTask) {
    cronTask.stop();
  }

  if (cron.validate(cronExpr)) {
    console.log(`[CrawlerCron] Initializing daily crawl schedule: "${cronExpr}"`);
    cronTask = cron.schedule(cronExpr, async () => {
      console.log('[CrawlerCron] Triggering scheduled daily crawl...');
      try {
        await crawlerService.runDailyCrawl();
      } catch (err) {
        console.error('[CrawlerCron] Scheduled crawl failed:', err);
      }
    });
  } else {
    console.error(`[CrawlerCron] Invalid cron expression: "${cronExpr}". Defaulting to "0 7 * * *"`);
    cronTask = cron.schedule('0 7 * * *', async () => {
      await crawlerService.runDailyCrawl();
    });
  }
}
