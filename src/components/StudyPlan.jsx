import React, { useState } from 'react';
import { 
  Check, 
  ChevronUp, 
  ChevronDown, 
  Plus, 
  Briefcase, 
  BookOpen, 
  Layers,
  Edit3,
  Award,
  Video,
  PlayCircle
} from 'lucide-react';

export default function StudyPlan({ 
  phases = [], 
  onToggleWeekComplete, 
  onReorderWeeks, 
  onOpenAddWeekModal,
  onUpdateWeekNotes,
  onOpenReader 
}) {
  const [activeNotesWeekId, setActiveNotesWeekId] = useState(null);
  const [tempNotes, setTempNotes] = useState('');
  const [selectedSkillset, setSelectedSkillset] = useState('All');
  const [selectedMonth, setSelectedMonth] = useState('All Time');
  const [expandedPhases, setExpandedPhases] = useState({});

  React.useEffect(() => {
    if (phases.length > 0 && Object.keys(expandedPhases).length === 0) {
      setExpandedPhases({ [phases[0].id]: true });
    }
  }, [phases]);

  const togglePhase = (phaseId) => {
    setExpandedPhases(prev => ({ ...prev, [phaseId]: !prev[phaseId] }));
  };

  const allWeeks = phases.flatMap(p => p.weeks || []);

  const skillsetsList = [
    'All',
    'Program Management',
    'Technical Architecture',
    'Data & SQL Analytics',
    'Product Strategy',
    'Executive Communication'
  ];

  // Extract unique months for filtering
  const availableMonths = ['All Time'];
  allWeeks.forEach(w => {
    if (w.crawled_at) {
      // Ensure we parse the DB datetime string properly
      const dateStr = w.crawled_at.includes('Z') ? w.crawled_at : w.crawled_at + 'Z';
      const date = new Date(dateStr);
      if (!isNaN(date)) {
        const monthStr = date.toLocaleDateString('default', { month: 'long', year: 'numeric' });
        if (!availableMonths.includes(monthStr)) {
          availableMonths.push(monthStr);
        }
      }
    }
  });

  const moveWeek = (weekId, direction) => {
    const currentIndex = allWeeks.findIndex(w => w.id === weekId);
    if (currentIndex < 0) return;

    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= allWeeks.length) return;

    const reordered = [...allWeeks];
    const [moved] = reordered.splice(currentIndex, 1);
    reordered.splice(targetIndex, 0, moved);

    const orderedIds = reordered.map(w => w.id);
    onReorderWeeks(orderedIds);
  };

  const handleOpenNotes = (week) => {
    if (activeNotesWeekId === week.id) {
      setActiveNotesWeekId(null);
    } else {
      setActiveNotesWeekId(week.id);
      setTempNotes(week.notes || '');
    }
  };

  const handleSaveNotes = (weekId) => {
    onUpdateWeekNotes(weekId, tempNotes);
    setActiveNotesWeekId(null);
  };

  return (
    <div>
      <div className="section-header">
        <div>
          <h2 className="section-title">Skillset Curriculum</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
            Structured across developmental phases. Each topic features a comprehensive in-app master lesson, architectural blueprint, and ready-to-copy workplace template.
          </p>
        </div>

        <button className="btn-primary" onClick={onOpenAddWeekModal}>
          <Plus size={16} />
          <span>Add Custom Week</span>
        </button>
      </div>

      {/* Skillset Filter Pills & Date Filter */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px', alignItems: 'center' }}>
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

      {phases.map(phase => {
        let phaseWeeks = phase.weeks || [];
        if (selectedSkillset !== 'All') {
          phaseWeeks = phaseWeeks.filter(w => (w.skillset || '').toLowerCase().includes(selectedSkillset.toLowerCase()));
        }

        if (selectedMonth !== 'All Time') {
          phaseWeeks = phaseWeeks.filter(w => {
            if (!w.crawled_at) return false;
            const dateStr = w.crawled_at.includes('Z') ? w.crawled_at : w.crawled_at + 'Z';
            const date = new Date(dateStr);
            if (isNaN(date)) return false;
            return date.toLocaleDateString('default', { month: 'long', year: 'numeric' }) === selectedMonth;
          });
        }

        if (phaseWeeks.length === 0 && (selectedSkillset !== 'All' || selectedMonth !== 'All Time')) return null;

        const completedInPhase = (phase.weeks || []).filter(w => w.completed).length;
        const phaseProgress = (phase.weeks || []).length > 0 ? Math.round((completedInPhase / (phase.weeks || []).length) * 100) : 0;

        const isExpanded = expandedPhases[phase.id];

        return (
          <div key={phase.id} className="curriculum-phase-group">
            {/* Phase Header Card */}
            <div 
              className="phase-header-card" 
              onClick={() => togglePhase(phase.id)} 
              style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h3>{phase.title}</h3>
                  <span style={{ 
                    fontSize: '0.75rem', 
                    fontWeight: 700, 
                    color: 'var(--accent-emerald)', 
                    background: 'var(--accent-emerald-subtle)',
                    padding: '2px 8px',
                    borderRadius: '999px'
                  }}>
                    {completedInPhase}/{(phase.weeks || []).length} Done ({phaseProgress}%)
                  </span>
                </div>
                <p>{phase.description}</p>
              </div>

              {/* Mini Phase Progress Bar & Chevron */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                <div style={{ width: '140px', height: '6px', background: 'var(--bg-input)', borderRadius: '999px', overflow: 'hidden' }}>
                  <div style={{ width: `${phaseProgress}%`, height: '100%', background: 'var(--gradient-emerald)', transition: 'width 0.4s ease' }} />
                </div>
                <div style={{ color: 'var(--text-muted)' }}>
                  {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
              </div>
            </div>

            {/* Weeks in Phase (Collapsible) */}
            {isExpanded && (
              <div className="curriculum-weeks-list">
              {phaseWeeks.map((week) => {
                const globalIndex = allWeeks.findIndex(w => w.id === week.id);
                const canMoveUp = globalIndex > 0;
                const canMoveDown = globalIndex < allWeeks.length - 1;

                return (
                  <div key={week.id} className={`glass-panel week-row-card ${week.completed ? 'completed' : ''}`}>
                    {/* Checkbox */}
                    <button 
                      className={`week-checkbox-btn ${week.completed ? 'checked' : ''}`}
                      onClick={() => onToggleWeekComplete(week.id, !week.completed)}
                      title={week.completed ? "Mark as in progress" : "Mark as completed"}
                    >
                      {week.completed && <Check size={18} strokeWidth={3} />}
                    </button>

                    {/* Main Content */}
                    <div className="week-main-info">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px', flexWrap: 'wrap' }}>


                        <h4 
                          style={{ 
                            textDecoration: week.completed ? 'line-through' : 'none',
                            cursor: 'pointer' 
                          }}
                          onClick={() => onOpenReader(week)}
                          title="Open Master Lesson"
                        >
                          {week.title}
                        </h4>

                        <span className="skillset-badge" style={{ fontSize: '0.7rem' }}>
                          <Layers size={10} />
                          <span>{week.skillset || 'Program Management'}</span>
                        </span>

                        <span className="priority-pill" style={{ fontSize: '0.65rem' }}>
                          {week.skillset_priority || 'P0'}
                        </span>

                        {week.crawled_at && (
                          <span className="priority-pill" style={{ fontSize: '0.65rem', background: 'rgba(255, 255, 255, 0.05)', color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)' }}>
                            Crawled: {new Date(week.crawled_at.includes('Z') ? week.crawled_at : week.crawled_at + 'Z').toLocaleDateString()}
                          </span>
                        )}

                        {(() => {
                          let videoCount = 0;
                          let parsedVideos = [];
                          if (week.youtube_videos) {
                            try {
                              parsedVideos = Array.isArray(week.youtube_videos) ? week.youtube_videos : JSON.parse(week.youtube_videos);
                              videoCount = parsedVideos.length;
                            } catch(e) {}
                          }
                          if (videoCount > 0) {
                            return (
                              <span className="skillset-badge" style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--accent-primary)', borderColor: 'var(--accent-primary)', fontSize: '0.65rem' }}>
                                <Video size={11} />
                                <span>{videoCount} Video{videoCount > 1 ? 's' : ''} Included</span>
                              </span>
                            );
                          }
                          return null;
                        })()}
                      </div>

                      <p>{week.learning_goal}</p>

                      {/* Action item pill */}
                      <div className="week-action-pill">
                        <Briefcase size={12} />
                        <span><strong>Workplace Action:</strong> {week.action_item}</span>
                      </div>



                      {/* In-App Master Lesson Button */}
                      <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
                        <button 
                          className="btn-primary"
                          style={{ fontSize: '0.775rem', padding: '4px 12px' }}
                          onClick={() => onOpenReader(week)}
                        >
                          <BookOpen size={13} />
                          <span>Read Full Master Lesson & Templates</span>
                        </button>
                      </div>

                      {/* Expandable Notes Editor */}
                      {activeNotesWeekId === week.id ? (
                        <div style={{ marginTop: '14px' }}>
                          <textarea 
                            className="notes-editor"
                            placeholder="Write your personal reflections, takeaways, or links for this week..."
                            value={tempNotes}
                            onChange={(e) => setTempNotes(e.target.value)}
                          />
                          <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                            <button className="btn-primary" style={{ fontSize: '0.8rem', padding: '4px 12px' }} onClick={() => handleSaveNotes(week.id)}>
                              Save Notes
                            </button>
                            <button className="btn-secondary" style={{ fontSize: '0.8rem', padding: '4px 12px' }} onClick={() => setActiveNotesWeekId(null)}>
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        week.notes && (
                          <div style={{ marginTop: '10px', fontSize: '0.825rem', color: 'var(--text-muted)', fontStyle: 'italic', background: 'rgba(255,255,255,0.02)', padding: '6px 10px', borderRadius: '4px' }}>
                            "{week.notes}"
                          </div>
                        )
                      )}
                    </div>

                    {/* Reorder and Action Controls */}
                    <div className="week-controls">
                      <button 
                        className="btn-icon" 
                        onClick={() => handleOpenNotes(week)}
                        title="Edit study reflections & notes"
                      >
                        <Edit3 size={15} />
                      </button>

                      <button 
                        className="btn-icon" 
                        disabled={!canMoveUp}
                        onClick={() => moveWeek(week.id, 'up')}
                        title="Move week earlier"
                        style={{ opacity: canMoveUp ? 1 : 0.3 }}
                      >
                        <ChevronUp size={16} />
                      </button>

                      <button 
                        className="btn-icon" 
                        disabled={!canMoveDown}
                        onClick={() => moveWeek(week.id, 'down')}
                        title="Move week later"
                        style={{ opacity: canMoveDown ? 1 : 0.3 }}
                      >
                        <ChevronDown size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
