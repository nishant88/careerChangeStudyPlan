import db from '../db/index.js';
import ytSearch from 'yt-search';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchWeeksVideos() {
  const weeks = db.prepare(`SELECT id, title, skillset FROM weeks WHERE youtube_videos IS NULL OR youtube_videos = '[]'`).all();
  
  if (weeks.length === 0) {
    console.log('All weeks already have videos.');
    return;
  }

  for (const week of weeks) {
    console.log(`Fetching videos for week ${week.id}: ${week.title}`);
    const candidate = { youtube_videos: [] };
    try {
      const queryMasterclass = `${week.title} ${week.skillset || ''} masterclass full course`;
      const queryGeneral = `${week.title} ${week.skillset || ''} detailed explanation`;
      
      await sleep(1500); // Prevent rate limiting
      const r1 = await ytSearch(queryMasterclass);
      await sleep(1500);
      const r2 = await ytSearch(queryGeneral);
      
      const allVideos = [...r1.videos, ...r2.videos]
        .filter(v => v.seconds >= 1800)
        .sort((a, b) => b.seconds - a.seconds);
        
      const uniqueVideos = [];
      const seenUrls = new Set();
      for (const v of allVideos) {
        if (!seenUrls.has(v.url)) {
          seenUrls.add(v.url);
          uniqueVideos.push(v);
        }
      }
      
      const topVideos = uniqueVideos.slice(0, 4);
      topVideos.forEach(v => {
        candidate.youtube_videos.push({
          title: v.title,
          url: v.url,
          embedUrl: v.url.replace('watch?v=', 'embed/'),
          duration: v.timestamp
        });
      });
      
      db.prepare(`UPDATE weeks SET youtube_videos = ? WHERE id = ?`).run(
        JSON.stringify(candidate.youtube_videos),
        week.id
      );
      console.log(`Saved ${candidate.youtube_videos.length} videos for week ${week.id}`);
    } catch (err) {
      console.error(`Error fetching videos for week ${week.id}:`, err);
    }
  }
  console.log('Finished fetching videos for all weeks.');
}

fetchWeeksVideos().catch(console.error);
