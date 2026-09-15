import React, { useState } from 'react';
import { 
  Search, 
  Bookmark, 
  ExternalLink, 
  Check, 
  Trash2, 
  Filter, 
  Edit2, 
  FileText 
} from 'lucide-react';

export default function ResourceLibrary({ 
  items = [], 
  availableTopics = [], 
  availableDomains = [], 
  onFilterChange, 
  onUpdateNotes, 
  onToggleRead, 
  onRemoveItem 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [activeNotesId, setActiveNotesId] = useState(null);
  const [notesBuffer, setNotesBuffer] = useState('');

  const handleSearch = (e) => {
    const val = e.target.value;
    setSearchTerm(val);
    onFilterChange({ search: val, topic: selectedTopic, domain: selectedDomain, status: selectedStatus });
  };

  const handleTopicChange = (e) => {
    const val = e.target.value;
    setSelectedTopic(val);
    onFilterChange({ search: searchTerm, topic: val, domain: selectedDomain, status: selectedStatus });
  };

  const handleDomainChange = (e) => {
    const val = e.target.value;
    setSelectedDomain(val);
    onFilterChange({ search: searchTerm, topic: selectedTopic, domain: val, status: selectedStatus });
  };

  const handleStatusChange = (status) => {
    setSelectedStatus(status);
    onFilterChange({ search: searchTerm, topic: selectedTopic, domain: selectedDomain, status });
  };

  const handleOpenNotes = (item) => {
    if (activeNotesId === item.id) {
      setActiveNotesId(null);
    } else {
      setActiveNotesId(item.id);
      setNotesBuffer(item.personal_notes || '');
    }
  };

  const handleSaveNotes = (id) => {
    onUpdateNotes(id, notesBuffer);
    setActiveNotesId(null);
  };

  return (
    <div>
      <div className="section-header">
        <div>
          <h2 className="section-title">Saved Resource Library</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
            High-signal articles, papers, and guides saved from your daily crawl feeds. Add personal takeaways and filter by topic or publisher.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="library-filter-bar">
        {/* Search Input */}
        <div className="search-input-group">
          <Search size={16} color="var(--text-muted)" />
          <input 
            type="text" 
            placeholder="Search saved resources, topics, or your personal notes..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>

        {/* Dropdown Filters */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <select 
            className="form-select" 
            style={{ padding: '8px 12px', fontSize: '0.85rem' }}
            value={selectedTopic}
            onChange={handleTopicChange}
          >
            <option value="">All Topics</option>
            {availableTopics.map((topic, i) => (
              <option key={i} value={topic}>{topic}</option>
            ))}
          </select>

          <select 
            className="form-select" 
            style={{ padding: '8px 12px', fontSize: '0.85rem' }}
            value={selectedDomain}
            onChange={handleDomainChange}
          >
            <option value="">All Publishers</option>
            {availableDomains.map((dom, i) => (
              <option key={i} value={dom}>{dom}</option>
            ))}
          </select>

          {/* Status Tabs */}
          <div className="nav-tabs" style={{ padding: '2px' }}>
            <button 
              className={`nav-tab-btn ${selectedStatus === 'all' ? 'active' : ''}`}
              style={{ padding: '5px 12px', fontSize: '0.8rem' }}
              onClick={() => handleStatusChange('all')}
            >
              All
            </button>
            <button 
              className={`nav-tab-btn ${selectedStatus === 'saved' ? 'active' : ''}`}
              style={{ padding: '5px 12px', fontSize: '0.8rem' }}
              onClick={() => handleStatusChange('saved')}
            >
              Unread
            </button>
            <button 
              className={`nav-tab-btn ${selectedStatus === 'read' ? 'active' : ''}`}
              style={{ padding: '5px 12px', fontSize: '0.8rem' }}
              onClick={() => handleStatusChange('read')}
            >
              Read
            </button>
          </div>
        </div>
      </div>

      {/* Library Grid */}
      {items.length === 0 ? (
        <div className="glass-panel empty-digest" style={{ padding: '48px 24px' }}>
          <Bookmark className="empty-digest-icon" style={{ color: 'var(--text-muted)' }} />
          <h4>No Saved Resources Found</h4>
          <p>When you click "Save for Later" on daily digest articles, they appear here in your permanent searchable knowledge library.</p>
        </div>
      ) : (
        <div className="library-grid">
          {items.map(item => (
            <div key={item.id} className="glass-panel library-card">
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span className="digest-topic-tag">{item.topic_title}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="digest-source-pill">
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-primary)' }} />
                      {item.domain}
                    </span>
                    {item.status === 'read' && (
                      <span style={{ 
                        fontSize: '0.7rem', 
                        fontWeight: 700, 
                        color: 'var(--accent-emerald)', 
                        background: 'var(--accent-emerald-subtle)',
                        padding: '1px 6px',
                        borderRadius: '4px'
                      }}>
                        Read
                      </span>
                    )}
                  </div>
                </div>

                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '8px', lineHeight: 1.35 }}>
                  <a href={item.url} target="_blank" rel="noopener noreferrer">
                    {item.title}
                    <ExternalLink size={13} style={{ display: 'inline', marginLeft: '6px', opacity: 0.7 }} />
                  </a>
                </h3>

                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '14px' }}>
                  {item.summary}
                </p>

                {/* Personal Notes / Takeaways */}
                {activeNotesId === item.id ? (
                  <div style={{ marginBottom: '14px' }}>
                    <textarea 
                      className="notes-editor"
                      placeholder="Add key takeaways, quotes, or application ideas from this article..."
                      value={notesBuffer}
                      onChange={(e) => setNotesBuffer(e.target.value)}
                    />
                    <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
                      <button className="btn-primary" style={{ fontSize: '0.775rem', padding: '3px 10px' }} onClick={() => handleSaveNotes(item.id)}>
                        Save Notes
                      </button>
                      <button className="btn-secondary" style={{ fontSize: '0.775rem', padding: '3px 10px' }} onClick={() => setActiveNotesId(null)}>
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  item.personal_notes && (
                    <div style={{ 
                      background: 'var(--bg-secondary)', 
                      borderLeft: '3px solid var(--accent-amber)', 
                      padding: '8px 12px', 
                      borderRadius: '4px', 
                      fontSize: '0.825rem', 
                      color: 'var(--text-primary)',
                      marginBottom: '14px'
                    }}>
                      <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--accent-amber)', marginBottom: '2px' }}>
                        My Takeaways:
                      </div>
                      {item.personal_notes}
                    </div>
                  )
                )}
              </div>

              {/* Card Bottom Actions */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    className="btn-action btn-action-read" 
                    onClick={() => onToggleRead(item.id)}
                    title={item.status === 'read' ? 'Mark as Unread' : 'Mark as Read'}
                  >
                    <Check size={13} />
                    <span>{item.status === 'read' ? 'Read' : 'Mark Read'}</span>
                  </button>

                  <button 
                    className="btn-action btn-secondary" 
                    style={{ fontSize: '0.8rem', padding: '6px 10px' }}
                    onClick={() => handleOpenNotes(item)}
                    title="Add or edit personal notes"
                  >
                    <Edit2 size={13} />
                    <span>{item.personal_notes ? 'Edit Notes' : '+ Notes'}</span>
                  </button>
                </div>

                <button 
                  className="btn-action btn-action-dismiss" 
                  onClick={() => onRemoveItem(item.id)}
                  title="Remove from library"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
