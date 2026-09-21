import React, { useState, useEffect } from 'react';
import { Briefcase, MapPin, ExternalLink, RefreshCw, CheckCircle, Clock } from 'lucide-react';
import { fetchJobs, triggerJobFetch, updateJobStatus } from '../api';

export default function JobsBoard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedSkillset, setSelectedSkillset] = useState('All');
  const [selectedMonth, setSelectedMonth] = useState('All Time');

  const skillsetsList = [
    'All',
    'Program Management',
    'Technical Architecture',
    'Data & SQL Analytics',
    'Product Strategy',
    'Executive Communication'
  ];

  const availableMonths = ['All Time'];
  jobs.forEach(job => {
    if (job.fetched_at) {
      const dateStr = job.fetched_at.includes('Z') ? job.fetched_at : job.fetched_at + 'Z';
      const date = new Date(dateStr);
      if (!isNaN(date)) {
        const monthStr = date.toLocaleDateString('default', { month: 'long', year: 'numeric' });
        if (!availableMonths.includes(monthStr)) {
          availableMonths.push(monthStr);
        }
      }
    }
  });

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const data = await fetchJobs();
      setJobs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFetchMore = async () => {
    try {
      setFetching(true);
      await triggerJobFetch();
      await loadJobs();
    } catch (err) {
      console.error(err);
    } finally {
      setFetching(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await updateJobStatus(id, status);
      setJobs(jobs.map(j => j.id === id ? { ...j, status } : j));
    } catch (err) {
      console.error(err);
    }
  };

  const filteredJobs = jobs.filter(job => {
    // 1. Filter by status
    let statusMatch = true;
    if (activeFilter === 'new') statusMatch = job.status === 'new';
    if (activeFilter === 'applied') statusMatch = job.status === 'applied';
    if (activeFilter === 'ignored') statusMatch = job.status === 'ignored';

    // 2. Filter by skillset
    let skillsetMatch = true;
    if (selectedSkillset !== 'All') {
      skillsetMatch = job.skillset_match === selectedSkillset;
    }

    // 3. Filter by month
    let monthMatch = true;
    if (selectedMonth !== 'All Time') {
      if (!job.fetched_at) {
        monthMatch = false;
      } else {
        const dateStr = job.fetched_at.includes('Z') ? job.fetched_at : job.fetched_at + 'Z';
        const date = new Date(dateStr);
        if (isNaN(date) || date.toLocaleDateString('default', { month: 'long', year: 'numeric' }) !== selectedMonth) {
          monthMatch = false;
        }
      }
    }

    return statusMatch && skillsetMatch && monthMatch;
  });

  return (
    <div className="dashboard-grid" style={{ gridTemplateColumns: '1fr', maxWidth: '1000px', margin: '0 auto' }}>
      <div className="glass-panel" style={{ padding: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h2 style={{ fontSize: '1.8rem', color: 'var(--text-primary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Briefcase size={24} color="var(--accent-primary)" />
              Career Opportunities
            </h2>
            <p style={{ color: 'var(--text-secondary)' }}>Roles matching your technical program and product skillsets.</p>
          </div>
          <button 
            className="btn-primary" 
            onClick={handleFetchMore} 
            disabled={fetching}
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <RefreshCw size={16} className={fetching ? 'streak-flame' : ''} />
            {fetching ? 'Searching internet...' : 'Discover New Roles'}
          </button>
        </div>

        {/* Skillset Filter Pills & Date Filter */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', flex: 1 }}>
            {skillsetsList.map((skill, sIdx) => (
              <button
                key={sIdx}
                className={`nav-tab-btn ${selectedSkillset === skill ? 'active' : ''}`}
                style={{ fontSize: '0.8rem', padding: '5px 14px' }}
                onClick={() => setSelectedSkillset(skill)}
              >
                {skill}
              </button>
            ))}
          </div>

          <div>
            <select 
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="form-input"
              style={{ padding: '6px 12px', fontSize: '0.85rem', width: 'auto', background: 'var(--bg-secondary)', borderColor: 'var(--border-subtle)' }}
            >
              {availableMonths.map(m => (
                <option key={m} value={m}>{m === 'All Time' ? 'Filter by Date: All Time' : m}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="tabs-container" style={{ marginBottom: '20px' }}>
          <button 
            className={`tab-btn ${activeFilter === 'all' ? 'active' : ''}`}
            onClick={() => setActiveFilter('all')}
          >
            All Roles
          </button>
          <button 
            className={`tab-btn ${activeFilter === 'new' ? 'active' : ''}`}
            onClick={() => setActiveFilter('new')}
          >
            New Matches
          </button>
          <button 
            className={`tab-btn ${activeFilter === 'applied' ? 'active' : ''}`}
            onClick={() => setActiveFilter('applied')}
          >
            Applied
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Loading roles...</div>
        ) : filteredJobs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)' }}>
            <Briefcase size={40} color="var(--text-muted)" style={{ margin: '0 auto 16px auto', display: 'block' }} />
            <h3 style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>No jobs found in this view</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>Click 'Discover New Roles' to search across multiple job boards.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {filteredJobs.map(job => (
              <JobCard 
                key={job.id} 
                job={job} 
                onUpdateStatus={handleStatusUpdate} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function JobCard({ job, onUpdateStatus }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div style={{ 
      background: 'var(--bg-secondary)', 
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden'
    }}>
      <div 
        style={{ padding: '20px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}
        onClick={() => setExpanded(!expanded)}
      >
        <div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '8px' }}>
            <span className="priority-pill" style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--accent-primary)', border: 'none' }}>
              {job.skillset_match}
            </span>
            {job.status === 'applied' && (
              <span className="priority-pill" style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent-emerald)', border: 'none' }}>
                <CheckCircle size={12} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'text-bottom' }}/>
                Applied
              </span>
            )}
            {job.status === 'ignored' && (
              <span className="priority-pill" style={{ background: 'rgba(156, 163, 175, 0.1)', color: 'var(--text-muted)', border: 'none' }}>
                Ignored
              </span>
            )}
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Source: {job.platform} | ID: {job.id.split('-')[1] || job.id}
            </span>
          </div>
          
          <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '4px' }}>{job.title}</h3>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{job.company}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <MapPin size={14} /> {job.location}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Clock size={14} /> {new Date(job.fetched_at + 'Z').toLocaleDateString()}
            </span>
          </div>
        </div>
        
        <div style={{ paddingLeft: '16px' }}>
          <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
            {expanded ? 'Hide Details' : 'View Details'}
          </button>
        </div>
      </div>

      {expanded && (
        <div style={{ padding: '0 20px 20px 20px', borderTop: '1px solid var(--border-subtle)' }}>
          <div 
            className="lesson-content"
            style={{ marginTop: '20px', fontSize: '0.95rem', maxHeight: '400px', overflowY: 'auto', paddingRight: '10px' }}
            dangerouslySetInnerHTML={{ __html: job.description }}
          />
          
          <div style={{ display: 'flex', gap: '12px', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)' }}>
            <a 
              href={job.url} 
              target="_blank" 
              rel="noreferrer"
              className="btn-primary"
              style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              Apply on {job.platform} <ExternalLink size={14} />
            </a>
            
            {job.status !== 'applied' && (
              <button 
                className="btn-secondary"
                style={{ color: 'var(--accent-emerald)', borderColor: 'rgba(16, 185, 129, 0.3)' }}
                onClick={(e) => {
                  e.stopPropagation();
                  onUpdateStatus(job.id, 'applied');
                }}
              >
                Mark as Applied
              </button>
            )}
            
            {job.status !== 'ignored' && (
              <button 
                className="btn-secondary"
                style={{ color: 'var(--text-muted)' }}
                onClick={(e) => {
                  e.stopPropagation();
                  onUpdateStatus(job.id, 'ignored');
                }}
              >
                Ignore
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
