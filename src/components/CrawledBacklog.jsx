import React, { useState } from 'react';
import { 
  Search, 
  Bookmark, 
  Check, 
  Trash2, 
  Edit2, 
  BookOpen,
  Layers,
  Award,
  Video
} from 'lucide-react';

export default function CrawledBacklog({ 
  items = [], 
  availableTopics = [], 
  availableSkillsets = [], 
  onFilterChange, 
  onUpdateNotes, 
  onToggleRead, 
  onRemoveItem,
  onOpenReader 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedSkillset, setSelectedSkillset] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState('All Time');
  const [activeNotesId, setActiveNotesId] = useState(null);
  const [notesBuffer, setNotesBuffer] = useState('');

  const handleSearch = (e) => {
    const val = e.target.value;
    setSearchTerm(val);
    onFilterChange({ search: val, topic: selectedTopic, skillset: selectedSkillset, status: selectedStatus });
  };

  const handleTopicChange = (e) => {
    const val = e.target.value;
    setSelectedTopic(val);
    onFilterChange({ search: searchTerm, topic: val, skillset: selectedSkillset, status: selectedStatus });
  };

  const handleSkillsetChange = (e) => {
    const val = e.target.value;
    setSelectedSkillset(val);
    onFilterChange({ search: searchTerm, topic: selectedTopic, skillset: val, status: selectedStatus });
  };

  const handleStatusChange = (status) => {
    setSelectedStatus(status);
    onFilterChange({ search: searchTerm, topic: selectedTopic, skillset: selectedSkillset, status });
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

  const availableMonths = ['All Time'];
  items.forEach(item => {
    if (item.found_at) {
      const dateStr = item.found_at.includes('Z') ? item.found_at : item.found_at + 'Z';
      const date = new Date(dateStr);
      if (!isNaN(date)) {
        const monthStr = date.toLocaleDateString('default', { month: 'long', year: 'numeric' });
        if (!availableMonths.includes(monthStr)) {
          availableMonths.push(monthStr);
        }
      }
    }
  });

  const filteredItems = items.filter(item => {
    if (selectedMonth !== 'All Time') {
      if (!item.found_at) return false;
      const dateStr = item.found_at.includes('Z') ? item.found_at : item.found_at + 'Z';
      const date = new Date(dateStr);
      if (isNaN(date) || date.toLocaleDateString('default', { month: 'long', year: 'numeric' }) !== selectedMonth) {
        return false;
      }
    }
    return true;
  });

  return (
    <div>
      <div className="section-header">
        <div>
          <h2 className="section-title">Crawled Items Backlog</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
            The permanent, complete historical archive of all synthesized topics and video masterclasses. Never deleted.
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
            placeholder="Search in-app lessons, topics, concepts, or your notes..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>

        {/* Dropdown Filters */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <select 
            className="form-select" 
            style={{ padding: '8px 12px', fontSize: '0.85rem' }}
            value={selectedSkillset}
            onChange={handleSkillsetChange}
          >
            <option value="">All Skillsets</option>
            {availableSkillsets.map((skill, i) => (
              <option key={i} value={skill}>{skill}</option>
            ))}
          </select>

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
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            {availableMonths.map(m => (
              <option key={m} value={m}>{m === 'All Time' ? 'All Time (Date)' : m}</option>
            ))}
          </select>

        </div>
      </div>

      {/* Library Grid */}
      {filteredItems.length === 0 ? (
        <div className="glass-panel empty-digest" style={{ padding: '48px 24px' }}>
          <Bookmark className="empty-digest-icon" style={{ color: 'var(--text-muted)' }} />
          <h4>No Crawled Items Yet</h4>
          <p>When the engine synthesizes topics from your backlog, they will appear here permanently.</p>
        </div>
      ) : (
        <div className="library-grid">
          {filteredItems.map(item => (
            <div key={item.id} className="glass-panel library-card">
              <div>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '10px' }}>
                  <h3 
                    style={{ fontSize: '1.05rem', fontWeight: 700, lineHeight: 1.35, cursor: 'pointer', margin: 0 }}
                    onClick={() => onOpenReader(item)}
                    title="Open full in-app lesson"
                  >
                    {item.title}
                  </h3>

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

                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '14px' }}>
                  {item.summary}
                </p>

                {/* Personal Notes / Takeaways */}
                {activeNotesId === item.id ? (
                  <div style={{ marginBottom: '14px' }}>
                    <textarea 
                      className="notes-editor"
                      placeholder="Add key takeaways, quotes, or application ideas from this lesson..."
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
                    className="btn-primary" 
                    style={{ fontSize: '0.8rem', padding: '5px 12px' }}
                    onClick={() => onOpenReader(item)}
                  >
                    <BookOpen size={13} />
                    <span>Open Lesson</span>
                  </button>

                  <button 
                    className="btn-action btn-action-read" 
                    onClick={() => onToggleRead(item.id)}
                    title={item.status === 'read' ? 'Mark as Unread' : 'Mark as Read'}
                  >
                    <Check size={13} />
                    <span>{item.status === 'read' ? 'Completed' : 'Mark Read'}</span>
                  </button>

                  <button 
                    className="btn-action btn-secondary" 
                    style={{ fontSize: '0.8rem', padding: '5px 10px' }}
                    onClick={() => handleOpenNotes(item)}
                    title="Add or edit personal notes"
                  >
                    <Edit2 size={13} />
                    <span>{item.personal_notes ? 'Notes' : '+ Notes'}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
