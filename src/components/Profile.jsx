import React from 'react';
import { Target, TrendingUp, Award } from 'lucide-react';

export default function Profile({ profileStats, onOpenReader }) {
  if (!profileStats) {
    return <div style={{ padding: '24px', color: 'var(--text-secondary)' }}>Loading profile...</div>;
  }

  const { skillsets = [], recentCompletions = [] } = profileStats;

  return (
    <div className="fade-in">
      <div className="section-header">
        <div className="section-title-group">
          <TrendingUp style={{ color: 'var(--accent-primary)' }} size={24} />
          <h2 className="section-title">My Growth Profile</h2>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="main-content">
          <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Target size={18} style={{ color: 'var(--accent-primary)' }} />
              Skillset Mastery
            </h3>
            
            {skillsets.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)' }}>No skillsets tracked yet. Read articles to build your profile.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {skillsets.map((skill, idx) => (
                  <div key={idx}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontWeight: '600', fontSize: '0.95rem' }}>{skill.name}</span>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                        {skill.read} / {skill.total} articles
                      </span>
                    </div>
                    <div style={{ width: '100%', height: '8px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                      <div 
                        style={{ 
                          height: '100%', 
                          width: `${skill.percentage}%`, 
                          background: 'var(--gradient-primary)',
                          borderRadius: 'var(--radius-full)',
                          transition: 'width 1s ease-in-out'
                        }} 
                      />
                    </div>
                    <div style={{ textAlign: 'right', marginTop: '4px', fontSize: '0.8rem', color: 'var(--accent-emerald)', fontWeight: 'bold' }}>
                      {skill.percentage}% Mastery
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="sidebar">
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Award size={18} style={{ color: 'var(--accent-amber)' }} />
              Recent Completions
            </h3>

            {recentCompletions.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>No articles completed yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {recentCompletions.map((item, idx) => (
                  <div 
                    key={idx} 
                    className="seed-resource-link" 
                    onClick={() => onOpenReader(item)}
                    style={{ cursor: 'pointer', flexDirection: 'column', alignItems: 'flex-start', gap: '6px', padding: '14px' }}
                  >
                    <span style={{ fontWeight: '600', fontSize: '0.9rem', lineHeight: '1.4' }}>{item.title}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', background: 'var(--bg-primary)', padding: '2px 8px', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}>
                      {item.skillset}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
