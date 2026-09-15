import React, { useState, useEffect } from 'react';
import { X, Settings, RefreshCw, Check, Info } from 'lucide-react';
import { fetchSettings, updateSettings, fetchCrawlerStatus } from '../api';

export default function SettingsModal({ isOpen, onClose, onTriggerCrawl, isCrawling }) {
  const [cronExpr, setCronExpr] = useState('0 7 * * *');
  const [crawlerStatus, setCrawlerStatus] = useState(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchSettings().then(data => {
        if (data.crawler_cron) setCronExpr(data.crawler_cron);
      }).catch(console.error);

      fetchCrawlerStatus().then(data => {
        setCrawlerStatus(data);
      }).catch(console.error);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await updateSettings({ crawler_cron: cronExpr });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Settings size={18} color="var(--accent-primary)" />
            <h3>Crawler & App Preferences</h3>
          </div>
          <button className="btn-icon" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        {/* Live Crawler Status */}
        <div style={{ 
          background: 'var(--bg-secondary)', 
          border: '1px solid var(--border-subtle)', 
          borderRadius: 'var(--radius-md)', 
          padding: '14px', 
          marginBottom: '20px' 
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Crawler Engine Status
            </span>
            <span style={{ 
              fontSize: '0.75rem', 
              fontWeight: 700, 
              color: crawlerStatus?.status === 'running' ? 'var(--accent-amber)' : 'var(--accent-emerald)',
              textTransform: 'uppercase'
            }}>
              ● {crawlerStatus?.status || 'idle'}
            </span>
          </div>

          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            <strong>Last Run:</strong> {crawlerStatus?.lastRun ? new Date(crawlerStatus.lastRun).toLocaleString() : 'Never'}
          </div>

          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            <strong>Last Fresh Finds:</strong> {crawlerStatus?.lastFoundCount || 0} resources
          </div>

          <div style={{ marginTop: '12px' }}>
            <button 
              className="btn-secondary" 
              style={{ width: '100%', justifyContent: 'center', fontSize: '0.85rem' }}
              onClick={onTriggerCrawl}
              disabled={isCrawling}
            >
              <RefreshCw size={14} className={isCrawling ? 'streak-flame' : ''} />
              <span>{isCrawling ? 'Crawl in progress...' : 'Execute Crawl Now'}</span>
            </button>
          </div>
        </div>

        {/* Settings Form */}
        <form onSubmit={handleSave}>
          <div className="form-group">
            <label className="form-label">Daily Crawl Schedule (Cron Expression)</label>
            <input 
              type="text" 
              className="form-input mono" 
              value={cronExpr}
              onChange={(e) => setCronExpr(e.target.value)}
              placeholder="0 7 * * *"
            />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Default: <code>0 7 * * *</code> (Runs every morning at 07:00 AM)
            </span>
          </div>

          <div style={{ 
            background: 'rgba(99, 102, 241, 0.08)', 
            border: '1px solid rgba(99, 102, 241, 0.2)', 
            borderRadius: 'var(--radius-sm)', 
            padding: '12px', 
            display: 'flex', 
            gap: '10px', 
            marginTop: '16px',
            marginBottom: '20px'
          }}>
            <Info size={16} color="var(--accent-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
              The crawler automatically targets all topics in your <strong>Now</strong> backlog and current week, deduplicating against everything you have seen previously.
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
            {savedSuccess ? (
              <span style={{ fontSize: '0.85rem', color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Check size={16} /> Saved!
              </span>
            ) : <div />}

            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="button" className="btn-secondary" onClick={onClose}>
                Close
              </button>
              <button type="submit" className="btn-primary">
                Save Preferences
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
