import React from 'react';
import { 
  Plus, 
  Trash2, 
  Sparkles, 
  Radio, 
  Clock, 
  Layers,
  Video
} from 'lucide-react';

export default function TopicBacklog({ 
  groupedTopics = { now: [], next: [], someday: [] },
  digest = [],
  libraryItems = [],
  onMoveTopic, 
  onDeleteTopic, 
  onOpenAddModal,
  onOpenReader
}) {
  const [selectedMonth, setSelectedMonth] = React.useState('All Time');

  const allTopics = [
    ...(groupedTopics.now || []),
    ...(groupedTopics.next || []),
    ...(groupedTopics.someday || [])
  ];

  const availableMonths = ['All Time'];
  allTopics.forEach(topic => {
    if (topic.created_at) {
      const dateStr = topic.created_at.includes('Z') ? topic.created_at : topic.created_at + 'Z';
      const date = new Date(dateStr);
      if (!isNaN(date)) {
        const monthStr = date.toLocaleDateString('default', { month: 'long', year: 'numeric' });
        if (!availableMonths.includes(monthStr)) {
          availableMonths.push(monthStr);
        }
      }
    }
  });

  const columns = [
    {
      id: 'now',
      title: 'Now (Active Crawl)',
      icon: Radio,
      badgeClass: 'kanban-badge-now',
      desc: 'Actively crawled daily. Synthesizes full in-app study lessons.'
    },
    {
      id: 'next',
      title: 'Next (Queued)',
      icon: Clock,
      badgeClass: 'kanban-badge-next',
      desc: 'Queued for upcoming sprints. Move to Now to begin crawling.'
    },
    {
      id: 'someday',
      title: 'Someday (Backlog)',
      icon: Sparkles,
      badgeClass: 'kanban-badge-someday',
      desc: 'Ideas & emerging engineering trends to study in future.'
    }
  ];

  return (
    <div>
      <div className="section-header">
        <div>
          <h2 className="section-title">Topic Backlog & Skillset Management</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
            Topics in the <strong>Now</strong> column are actively synthesized by the daily crawler into in-app study lessons. Prioritize by target TPM skillset.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
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

          <button className="btn-primary" onClick={onOpenAddModal}>
            <Plus size={16} />
            <span>Add New Topic</span>
          </button>
        </div>
      </div>

      <div className="kanban-grid">
        {columns.map(col => {
          let topics = groupedTopics[col.id] || [];
          if (selectedMonth !== 'All Time') {
            topics = topics.filter(topic => {
              if (!topic.created_at) return false;
              const dateStr = topic.created_at.includes('Z') ? topic.created_at : topic.created_at + 'Z';
              const date = new Date(dateStr);
              if (isNaN(date)) return false;
              return date.toLocaleDateString('default', { month: 'long', year: 'numeric' }) === selectedMonth;
            });
          }
          return (
            <div key={col.id} className="kanban-column">
              <div className="kanban-col-header">
                <div>
                  <div className="kanban-col-title">
                    <col.icon size={18} className={col.badgeClass} />
                    <span>{col.title}</span>
                    <span className="section-counter">{topics.length}</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    {col.desc}
                  </div>
                </div>
              </div>

              <div className="kanban-cards-stack">
                {topics.length === 0 ? (
                  <div style={{ 
                    padding: '32px 16px', 
                    textAlign: 'center', 
                    color: 'var(--text-muted)', 
                    fontSize: '0.85rem',
                    border: '1px dashed var(--border-subtle)',
                    borderRadius: 'var(--radius-md)'
                  }}>
                    No topics in {col.title}.
                  </div>
                ) : (
                  topics.map(topic => {
                    let tags = [];
                    try {
                      tags = topic.tags ? JSON.parse(topic.tags) : [];
                    } catch (e) {
                      tags = topic.tags ? [topic.tags] : [];
                    }

                    return (
                      <div key={topic.id} className="kanban-card">
                        <div className="kanban-card-top">
                          <span className="skillset-badge" style={{ fontSize: '0.675rem', padding: '2px 7px' }}>
                            <Layers size={10} />
                            <span>{topic.skillset || 'Technical Architecture'}</span>
                          </span>

                          {(() => {
                            const match = (libraryItems || []).find(r => r.topic_id === topic.id || r.topic_title === topic.title) ||
                                          (digest || []).find(d => d.topic_id === topic.id || d.topic_title === topic.title);
                            let videoCount = 0;
                            if (match && match.youtube_videos) {
                              try {
                                const parsed = Array.isArray(match.youtube_videos) ? match.youtube_videos : JSON.parse(match.youtube_videos);
                                videoCount = parsed.length;
                              } catch(e) {}
                            }
                            if (videoCount > 0) {
                              return (
                                <span className="skillset-badge" style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--accent-primary)', borderColor: 'var(--accent-primary)', fontSize: '0.675rem', padding: '2px 7px' }}>
                                  <Video size={10} />
                                  <span>{videoCount} Video{videoCount > 1 ? 's' : ''} Included</span>
                                </span>
                              );
                            }
                            return null;
                          })()}

                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span className={`priority-badge priority-${topic.priority}`}>
                              {topic.priority}
                            </span>
                            <button 
                              className="btn-icon" 
                              style={{ width: '24px', height: '24px' }}
                              onClick={() => onDeleteTopic(topic.id)}
                              title="Archive topic (stops future crawls)"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>

                        <h4 
                          className={`kanban-card-title ${onOpenReader ? 'clickable-title' : ''}`}
                          onClick={() => onOpenReader && onOpenReader(topic)}
                          title={onOpenReader ? "Click to open in-app study lesson" : undefined}
                          style={{ cursor: onOpenReader ? 'pointer' : 'default' }}
                        >
                          {topic.title}
                        </h4>

                        {topic.description && (
                          <p className="kanban-card-desc">{topic.description}</p>
                        )}

                        {tags.length > 0 && (
                          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '10px' }}>
                            {tags.map((tag, tIdx) => (
                              <span key={tIdx} style={{ 
                                fontSize: '0.675rem', 
                                background: 'var(--bg-secondary)', 
                                color: 'var(--text-muted)', 
                                padding: '1px 6px', 
                                borderRadius: '4px' 
                              }}>
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="kanban-card-footer">
                          <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                            {col.id === 'now' ? '● Active in Crawler' : '○ Paused'}
                          </span>

                          <div className="kanban-move-btns">
                            {col.id !== 'now' && (
                              <button 
                                className="btn-secondary" 
                                style={{ fontSize: '0.725rem', padding: '3px 8px' }}
                                onClick={() => onMoveTopic(topic.id, 'now')}
                                title="Promote to Now (starts daily in-app crawling)"
                              >
                                {col.id === 'someday' ? '→ Now' : '← Now'}
                              </button>
                            )}

                            {col.id !== 'next' && (
                              <button 
                                className="btn-secondary" 
                                style={{ fontSize: '0.725rem', padding: '3px 8px' }}
                                onClick={() => onMoveTopic(topic.id, 'next')}
                                title="Move to Next"
                              >
                                {col.id === 'now' ? 'Next →' : '← Next'}
                              </button>
                            )}

                            {col.id !== 'someday' && (
                              <button 
                                className="btn-secondary" 
                                style={{ fontSize: '0.725rem', padding: '3px 8px' }}
                                onClick={() => onMoveTopic(topic.id, 'someday')}
                                title="Move to Someday"
                              >
                                Someday →
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
