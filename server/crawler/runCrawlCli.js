import { crawlerService } from './crawlerService.js';
import { seedDatabase } from '../db/seed.js';

async function main() {
  console.log('--- LevelUp Standalone Daily Crawler CLI ---');
  seedDatabase(false);
  const result = await crawlerService.runDailyCrawl();
  console.log('Result:', JSON.stringify(result, null, 2));
  process.exit(0);
}

main().catch(err => {
  console.error('CLI Crawl failed:', err);
  process.exit(1);
});
