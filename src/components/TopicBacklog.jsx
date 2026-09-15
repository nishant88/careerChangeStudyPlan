import React from 'react';
import { 
  Plus, 
  ArrowRight, 
  ArrowLeft, 
  Trash2, 
  Sparkles, 
  Radio, 
  Clock, 
  CheckCircle,
  Archive 
} from 'lucide-react';

export default function TopicBacklog({ 
  groupedTopics = { now: [], next: [], someday: [] }, 
  onMoveTopic, 
  onDeleteTopic, 
  onOpenAddModal 
}) {
  const columns = [
    {
      id: 'now',
      title: 'Now (Active Crawl)',
      icon: Radio,
      badgeClass: 'kanban-badge-now',
      desc: 'Crawled daily at 07:00 AM based on topic priority weighting.'
    },
    {
      id: 'next',
      title: 'Next (Queued)',
      icon: Clock,
      badgeClass: 'kanban-badge-next',
      desc: 'Queued for upcoming weeks. Move to "Now" to start crawling.'
    },
    {
      id: 'someday',
      title: 'Someday (Backlog)',
      icon: Sparkles,
      badgeClass: 'kanban-badge-someday',
      desc: 'Ideas and emerging tech to explore in the future.'
    }
  ];

  return (
    <div>
      <div className="section-header">
        <div>
          <h2 className="section-title">Topic Backlog & Crawler Controls</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
            Topics in the <strong>Now</strong> column are actively searched by the daily crawler. Prioritize high, medium, or low to adjust volume.
          </p>
        </div>

        <button className="btn-primary" onClick={onOpenAddModal}>
          <Plus size={16} />
          <span>Add New Topic</span>
        </button>
      </div>

      <div className="kanban-grid">
        {columns.map(col => {
          const topics = groupedTopics[col.id] || [];
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
                          <span className={`priority-badge priority-${topic.priority}`}>
                            {topic.priority} ({topic.priority === 'high' ? '4/day' : topic.priority === 'medium' ? '2/day' : '1/day'})
                          </span>

                          <button 
                            className="btn-icon" 
                            style={{ width: '26px', height: '26px' }}
                            onClick={() => onDeleteTopic(topic.id)}
                            title="Archive topic (stops future crawls)"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>

                        <h4 className="kanban-card-title">{topic.title}</h4>

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
                            {col.id === 'now' ? 'Active in Crawler' : 'Crawling paused'}
                          </span>

                          <div className="kanban-move-btns">
                            {col.id !== 'now' && (
                              <button 
                                className="btn-secondary" 
                                style={{ fontSize: '0.725rem', padding: '3px 8px' }}
                                onClick={() => onMoveTopic(topic.id, 'now')}
                                title="Promote to Now (starts daily crawling)"
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
