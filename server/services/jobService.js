import db from '../db/index.js';

export class JobService {
  async fetchJobsFromAPIs() {
    console.log('[JobService] Fetching jobs matching user skillsets...');
    
    // The specific skillsets the user wants to search for, exactly as in the UI
    const targetSkillsets = [
      'Program Management',
      'Technical Architecture',
      'Data & SQL Analytics',
      'Product Strategy',
      'Executive Communication'
    ];

    const insertJob = db.prepare(`
      INSERT OR IGNORE INTO job_listings (
        id, platform, title, company, location, skillset_match, description, url, status
      ) VALUES (
        @id, @platform, @title, @company, @location, @skillset_match, @description, @url, 'new'
      )
    `);

    let totalFetched = 0;

    for (const skill of targetSkillsets) {
      try {
        const searchTerm = encodeURIComponent(skill);
        const remotiveUrl = `https://remotive.com/api/remote-jobs?search=${searchTerm}&limit=15`;
        
        const remRes = await fetch(remotiveUrl);
        if (remRes.ok) {
          const remData = await remRes.json();
          const jobs = remData.jobs || [];
          
          for (const job of jobs) {
            try {
              insertJob.run({
                id: `remotive-${job.id}`,
                platform: 'Remotive',
                title: job.title,
                company: job.company_name,
                location: job.candidate_required_location || 'Remote',
                skillset_match: skill,
                description: job.description,
                url: job.url
              });
              totalFetched++;
            } catch (e) {
              // ignore duplicate
            }
          }
        }
      } catch (err) {
        console.error(`[JobService] Error fetching Remotive for ${skill}:`, err);
      }
    }
    
    console.log(`[JobService] Finished fetching jobs. ${totalFetched} new potential matches found.`);
    return totalFetched;
  }
}

export const jobService = new JobService();
