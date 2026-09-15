import React from 'react';
import { 
  CheckCircle2, 
  Bookmark, 
  Check, 
  X, 
  ExternalLink, 
  Sparkles, 
  Target, 
  Compass, 
  Flame, 
  BookOpen, 
  Award, 
  Briefcase 
} from 'lucide-react';
import FocusTimer from './FocusTimer';

export default function Dashboard({ 
  stats, 
  digest = [], 
  currentWeek, 
  onSaveDigest, 
  onReadDigest, 
  onDismissDigest, 
  onToggleWeekComplete,
  onTriggerCrawl,
  onSessionCompleted 
}) {
  return (
    <div>
      {/* 4-Stat Metric Row */}
      <div className="stats-grid">
        <div className="glass-panel stat-card">
          <div className="stat-icon-wrapper stat-icon-indigo">
            <Target size={24} />
          </div>
          <div>
            <div className="stat-meta-label">Curriculum Progress</div>
            <div className="stat-value">{stats?.percentComplete || 0}%</div>
            <div className="stat-subtext">{stats?.completedWeeks || 0} of {stats?.totalWeeks || 12} weeks done</div>
          </div>
        </div>

        <div className="glass-panel stat-card">
          <div className="stat-icon-wrapper stat-icon-emerald">
            <Compass size={24} />
          </div>
          <div>
            <div className="stat-meta-label">Active Week</div>
            <div className="stat-value">Week {currentWeek?.week_number || 1}</div>
            <div className="stat-subtext" style={{ maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {currentWeek?.title || 'Program Management'}
            </div>
          </div>
        </div>

        <div className="glass-panel stat-card">
          <div className="stat-icon-wrapper stat-icon-amber">
            <Flame size={24} />
          </div>
          <div>
            <div className="stat-meta-label">Daily Streak</div>
            <div className="stat-value">{stats?.currentStreak || 1} Days</div>
            <div className="stat-subtext">Active learning habit</div>
          </div>
        </div>

        <div className="glass-panel stat-card">
          <div className="stat-icon-wrapper stat-icon-violet">
            <BookOpen size={24} />
          </div>
          <div>
            <div className="stat-meta-label">Resources Read</div>
            <div className="stat-value">{stats?.resourcesReadMonth || 0}</div>
            <div className="stat-subtext">{stats?.savedLibraryCount || 0} saved in Library</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Digest on Left, Current Week & Focus Timer on Right */}
      <div className="dashboard-grid">
        {/* Left Column: Daily Topic Crawler Digest */}
        <div>
          <div className="digest-container">
            <div className="section-header">
              <div className="section-title-group">
                <Sparkles size={20} color="var(--accent-primary)" />
                <h2 className="section-title">Today's Topic Digest</h2>
                <span className="section-counter">{digest.length} fresh</span>
              </div>
              <button 
                className="btn-secondary" 
                style={{ fontSize: '0.8rem', padding: '5px 12px' }}
                onClick={onTriggerCrawl}
              >
                Refresh Crawl
              </button>
            </div>

            {digest.length === 0 ? (
              <div className="glass-panel empty-digest">
                <CheckCircle2 className="empty-digest-icon" />
                <h4>All Caught Up with Today's Digest!</h4>
                <p>The daily crawler has scanned your active topics. You've reviewed all recent finds. New discoveries arrive tomorrow morning at 07:00 AM, or you can trigger an instant crawl anytime.</p>
                <button className="btn-primary" onClick={onTriggerCrawl}>
                  <Sparkles size={16} />
                  <span>Crawl Active Topics Now</span>
                </button>
              </div>
            ) : (
              <div className="digest-feed">
                {digest.map(item => (
                  <div key={item.id} className="glass-panel digest-card">
                    <div className="digest-meta">
                      <span className="digest-topic-tag">{item.topic_title}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span className="digest-source-pill">
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-primary)' }} />
                          {item.domain}
                        </span>
                        <span className="digest-read-time">{item.read_time}</span>
                      </div>
                    </div>

                    <h3 className="digest-title">
                      <a href={item.url} target="_blank" rel="noopener noreferrer">
                        {item.title}
                        <ExternalLink size={14} style={{ display: 'inline', marginLeft: '6px', opacity: 0.7 }} />
                      </a>
                    </h3>

                    <p className="digest-summary">{item.summary}</p>

                    <div className="digest-actions">
                      <div className="digest-action-btns">
                        <button 
                          className="btn-action btn-action-save"
                          onClick={() => onSaveDigest(item.id)}
                          title="Move to permanent searchable library"
                        >
                          <Bookmark size={14} />
                          <span>Save for Later</span>
                        </button>

                        <button 
                          className="btn-action btn-action-read"
                          onClick={() => onReadDigest(item.id)}
                          title="Mark as read and advance streak"
                        >
                          <Check size={14} />
                          <span>Mark Read</span>
                        </button>
                      </div>

                      <button 
                        className="btn-action btn-action-dismiss"
                        onClick={() => onDismissDigest(item.id)}
                        title="Dismiss from today's feed"
                      >
                        <X size={14} />
                        <span>Dismiss</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Current Week Spotlight & 45-min Timer */}
        <div>
          {/* Current Active Week Focus */}
          {currentWeek && (
            <div className="glass-panel week-spotlight-card">
              <span className="spotlight-badge">Active Focus • Week {currentWeek.week_number}</span>
              <h3 className="spotlight-title">{currentWeek.title}</h3>
              <p className="spotlight-goal">{currentWeek.learning_goal}</p>

              {/* Action item at work */}
              <div className="action-item-box">
                <div className="action-item-header">
                  <Briefcase size={14} />
                  <span>Apply It At Work</span>
                </div>
                <p className="action-item-text">{currentWeek.action_item}</p>
              </div>

              {/* Seed Resources */}
              {currentWeek.resources && currentWeek.resources.length > 0 && (
                <div style={{ marginBottom: '18px' }}>
                  <div style={{ fontSize: '0.775rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
                    Authoritative Seed Guides
                  </div>
                  <div className="seed-resources-list">
                    {currentWeek.resources.map((res, i) => (
                      <a 
                        key={i} 
                        href={res.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="seed-resource-link"
                      >
                        <span style={{ maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {res.title}
                        </span>
                        <ExternalLink size={13} color="var(--accent-primary)" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Complete Week Button */}
              <button 
                className={currentWeek.completed ? "btn-secondary" : "btn-primary"}
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => onToggleWeekComplete(currentWeek.id, !currentWeek.completed)}
              >
                <CheckCircle2 size={16} />
                <span>{currentWeek.completed ? 'Completed! Mark as Active' : 'Mark Week Done'}</span>
              </button>
            </div>
          )}

          {/* 45-Minute Daily Focus Timer */}
          <FocusTimer onSessionCompleted={onSessionCompleted} />
        </div>
      </div>
    </div>
  );
}
