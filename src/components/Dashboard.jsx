import React from 'react';
import { 
  CheckCircle2, 
  Bookmark, 
  Check, 
  X, 
  Sparkles, 
  Target, 
  Compass, 
  Flame, 
  BookOpen, 
  Briefcase,
  Layers,
  ArrowRight,
  Video
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
  onSessionCompleted,
  onOpenReader 
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
            <div className="stat-meta-label">Active Focus Week</div>
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
            <div className="stat-subtext">Active study habit</div>
          </div>
        </div>

        <div className="glass-panel stat-card">
          <div className="stat-icon-wrapper stat-icon-violet">
            <BookOpen size={24} />
          </div>
          <div>
            <div className="stat-meta-label">Lessons Completed</div>
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
                <h2 className="section-title">Today's In-App Topic Digest</h2>
                <span className="section-counter">{digest.length} fresh lessons</span>
              </div>
              <button 
                className="btn-secondary" 
                style={{ fontSize: '0.8rem', padding: '5px 12px' }}
                onClick={onTriggerCrawl}
              >
                Synthesize Fresh Lessons
              </button>
            </div>

            {digest.length === 0 ? (
              <div className="glass-panel empty-digest">
                <CheckCircle2 className="empty-digest-icon" />
                <h4>All Caught Up with Today's Lessons!</h4>
                <p>You've reviewed all generated topic briefs. Fresh executive lessons will arrive tomorrow morning at 07:00 AM, or you can trigger an on-demand crawl synthesis right now.</p>
                <button className="btn-primary" onClick={onTriggerCrawl}>
                  <Sparkles size={16} />
                  <span>Synthesize Fresh In-App Lessons</span>
                </button>
              </div>
            ) : (
              <div className="digest-feed">
                {digest.map(item => (
                  <div key={item.id} className="glass-panel digest-card">
                    <div className="digest-meta">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <span className="skillset-badge">
                          <Layers size={11} />
                          <span>{item.skillset || 'Program Management'}</span>
                        </span>
                        {item.skillset_priority && (
                          <span className="priority-pill" style={{ fontSize: '0.65rem' }}>
                            {item.skillset_priority}
                          </span>
                        )}
                        {(() => {
                          let videoCount = 0;
                          if (item.youtube_videos) {
                            try {
                              const parsed = Array.isArray(item.youtube_videos) ? item.youtube_videos : JSON.parse(item.youtube_videos);
                              videoCount = parsed.length;
                            } catch(e) {}
                          }
                          if (videoCount > 0) {
                            return (
                              <span className="skillset-badge" style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--accent-primary)', borderColor: 'var(--accent-primary)' }}>
                                <Video size={11} />
                                <span>{videoCount} Video{videoCount > 1 ? 's' : ''} Included</span>
                              </span>
                            );
                          }
                          return null;
                        })()}
                      </div>
                      <span className="digest-read-time">{item.read_time || '7 min read'}</span>
                    </div>

                    {/* Lesson Title - Click opens in-app reader modal, NO target=_blank! */}
                    <h3 
                      className="digest-title clickable-title" 
                      onClick={() => onOpenReader(item)}
                      title="Open full in-app lesson & templates"
                    >
                      <span>{item.title}</span>
                      <ArrowRight size={14} className="title-arrow" />
                    </h3>

                    <p className="digest-summary">{item.summary}</p>

                    <div className="digest-actions">
                      <div className="digest-action-btns">
                        <button 
                          className="btn-primary" 
                          style={{ fontSize: '0.8rem', padding: '6px 14px' }}
                          onClick={() => onOpenReader(item)}
                        >
                          <BookOpen size={14} />
                          <span>Read In-App Lesson</span>
                        </button>

                        <button 
                          className="btn-action btn-action-save"
                          onClick={() => onSaveDigest(item.id)}
                          title="Save to permanent knowledge library"
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
              <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
                <span className="spotlight-badge" style={{ marginBottom: 0, whiteSpace: 'nowrap' }}>Curriculum Focus • Week {currentWeek.week_number}</span>
                <span className="priority-pill" style={{ whiteSpace: 'nowrap' }}>{currentWeek.skillset_priority || 'P0 - Core'}</span>
              </div>

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

              {/* Button to open full in-app master lesson */}
              <div style={{ marginBottom: '18px' }}>
                <button 
                  className="btn-primary" 
                  style={{ width: '100%', justifyContent: 'center', marginBottom: '10px' }}
                  onClick={() => onOpenReader(currentWeek)}
                >
                  <BookOpen size={16} />
                  <span>Open Week {currentWeek.week_number} Master Lesson</span>
                </button>
              </div>

              {/* Complete Week Button */}
              <button 
                className={currentWeek.completed ? "btn-secondary" : "btn-secondary"}
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => onToggleWeekComplete(currentWeek.id, !currentWeek.completed)}
              >
                <CheckCircle2 size={16} color={currentWeek.completed ? "var(--accent-emerald)" : "var(--text-muted)"} />
                <span>{currentWeek.completed ? 'Week Completed! (Click to re-open)' : 'Mark Week as Done'}</span>
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
