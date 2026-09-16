import React, { useState } from 'react';
import { 
  Compass, 
  BookOpen, 
  Kanban,
  History,
  Bookmark, 
  Flame, 
  RefreshCw, 
  Plus, 
  Settings, 
  Sun, 
  Moon 
} from 'lucide-react';

export default function Header({ 
  currentTab, 
  setCurrentTab, 
  streakCount = 1, 
  onQuickAddTopic, 
  onTriggerCrawl, 
  isCrawling = false, 
  onOpenSettings,
  theme,
  toggleTheme,
  digestCount = 0
}) {
  const [quickTitle, setQuickTitle] = useState('');

  const handleQuickSubmit = (e) => {
    e.preventDefault();
    if (!quickTitle.trim()) return;
    onQuickAddTopic(quickTitle.trim());
    setQuickTitle('');
  };

  return (
    <>
      <header className="app-header">
        <div className="header-inner">
        {/* Brand */}
        <div className="brand-section" onClick={() => setCurrentTab('dashboard')}>
          <div className="brand-logo-icon">
            <Compass size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="brand-title">LevelUp</span>
              <span className="brand-badge">TPM Engine</span>
            </div>
          </div>
        </div>

        {/* Header Right Actions */}
        <div className="header-actions">
          {/* Quick-Add Topic */}
          <form onSubmit={handleQuickSubmit} className="quick-add-container">
            <input 
              type="text"
              className="quick-add-input"
              placeholder="+ Quick-add active topic..."
              value={quickTitle}
              onChange={(e) => setQuickTitle(e.target.value)}
            />
            <button 
              type="submit" 
              style={{ background: 'transparent', color: 'var(--accent-primary)', cursor: 'pointer' }}
              title="Add Topic"
            >
              <Plus size={16} />
            </button>
          </form>

          {/* Daily Streak Flame */}
          <div className="streak-badge" title="Consecutive days of active learning">
            <Flame size={16} className="streak-flame" />
            <span>{streakCount} {streakCount === 1 ? 'Day' : 'Days'}</span>
          </div>

          {/* Trigger Daily Crawl Now */}
          <button 
            className="btn-secondary" 
            onClick={onTriggerCrawl} 
            disabled={isCrawling}
            title="Scan the web for fresh resources on active topics"
            id="btn-trigger-crawl"
          >
            <RefreshCw size={15} className={isCrawling ? 'streak-flame' : ''} />
            <span>{isCrawling ? 'Crawling...' : 'Crawl Now'}</span>
          </button>

          {/* Theme Toggle */}
          <button 
            className="btn-icon" 
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          {/* Settings */}
          <button 
            className="btn-icon" 
            onClick={onOpenSettings}
            title="Crawler & App Settings"
          >
            <Settings size={17} />
          </button>
        </div>
      </div>
    </header>

      {/* Secondary Navigation */}
      <div className="secondary-nav-container">
        <nav className="nav-tabs">
          <button 
            className={`nav-tab-btn ${currentTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setCurrentTab('dashboard')}
            id="tab-dashboard"
          >
            <Compass size={16} />
            <span>Dashboard</span>
            {digestCount > 0 && (
              <span style={{
                background: 'var(--accent-amber)',
                color: '#000',
                fontSize: '0.65rem',
                fontWeight: 800,
                padding: '1px 6px',
                borderRadius: '9999px',
                marginLeft: '4px'
              }}>
                {digestCount}
              </span>
            )}
          </button>

          <button 
            className={`nav-tab-btn ${currentTab === 'plan' ? 'active' : ''}`}
            onClick={() => setCurrentTab('plan')}
            id="tab-plan"
          >
            <BookOpen size={16} />
            <span>Skillset Curriculum</span>
          </button>

          <button 
            className={`nav-tab-btn ${currentTab === 'backlog' ? 'active' : ''}`}
            onClick={() => setCurrentTab('backlog')}
            id="tab-backlog"
          >
            <Kanban size={16} />
            <span>Topic Backlog</span>
          </button>

          <button 
            className={`nav-tab-btn ${currentTab === 'crawled_backlog' ? 'active' : ''}`}
            onClick={() => setCurrentTab('crawled_backlog')}
            id="tab-crawled-backlog"
          >
            <History size={16} />
            <span>Crawled Items Backlog</span>
          </button>

          <button 
            className={`nav-tab-btn ${currentTab === 'backlog' ? 'active' : ''}`}
            onClick={() => setCurrentTab('backlog')}
            id="tab-backlog"
          >
            <Kanban size={16} />
            <span>Topic Backlog</span>
          </button>

          <button 
            className={`nav-tab-btn ${currentTab === 'library' ? 'active' : ''}`}
            onClick={() => setCurrentTab('library')}
            id="tab-library"
          >
            <Bookmark size={16} />
            <span>Saved Library</span>
          </button>
        </nav>
      </div>
    </>
  );
}
