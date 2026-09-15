import React, { useState } from 'react';
import { 
  Check, 
  ExternalLink, 
  ChevronUp, 
  ChevronDown, 
  Plus, 
  Briefcase, 
  BookOpen, 
  Trash2, 
  Edit3,
  Award 
} from 'lucide-react';

export default function StudyPlan({ 
  phases = [], 
  onToggleWeekComplete, 
  onReorderWeeks, 
  onOpenAddWeekModal,
  onUpdateWeekNotes 
}) {
  const [activeNotesWeekId, setActiveNotesWeekId] = useState(null);
  const [tempNotes, setTempNotes] = useState('');

  // Flatten all weeks to manage ordering
  const allWeeks = phases.flatMap(p => p.weeks || []);

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
          <h2 className="section-title">12-Week Executive Study Curriculum</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
            Structured TPM rigor, technical depth, and executive communication phases. Reorder, mark completed, or add custom weeks.
          </p>
        </div>

        <button className="btn-primary" onClick={onOpenAddWeekModal}>
          <Plus size={16} />
          <span>Add Custom Week</span>
        </button>
      </div>

      {phases.map(phase => {
        const phaseWeeks = phase.weeks || [];
        const completedInPhase = phaseWeeks.filter(w => w.completed).length;
        const phaseProgress = phaseWeeks.length > 0 ? Math.round((completedInPhase / phaseWeeks.length) * 100) : 0;

        return (
          <div key={phase.id} className="curriculum-phase-group">
            {/* Phase Header Card */}
            <div className="phase-header-card">
              <div>
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
                    {completedInPhase}/{phaseWeeks.length} Done ({phaseProgress}%)
                  </span>
                </div>
                <p>{phase.description}</p>
              </div>

              {/* Mini Phase Progress Bar */}
              <div style={{ width: '140px', height: '6px', background: 'var(--bg-input)', borderRadius: '999px', overflow: 'hidden' }}>
                <div style={{ width: `${phaseProgress}%`, height: '100%', background: 'var(--gradient-emerald)', transition: 'width 0.4s ease' }} />
              </div>
            </div>

            {/* Weeks in Phase */}
            <div className="curriculum-weeks-list">
              {phaseWeeks.map((week, idx) => {
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
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                        <span style={{ 
                          fontFamily: 'Outfit', 
                          fontWeight: 800, 
                          color: 'var(--accent-primary)',
                          fontSize: '0.85rem'
                        }}>
                          WEEK {week.week_number}
                        </span>
                        <h4 style={{ textDecoration: week.completed ? 'line-through' : 'none' }}>
                          {week.title}
                        </h4>
                      </div>

                      <p>{week.learning_goal}</p>

                      {/* Action item pill */}
                      <div className="week-action-pill">
                        <Briefcase size={12} />
                        <span><strong>Workplace Action:</strong> {week.action_item}</span>
                      </div>

                      {/* Seed Resources */}
                      {week.resources && week.resources.length > 0 && (
                        <div style={{ display: 'flex', gap: '10px', marginTop: '10px', flexWrap: 'wrap' }}>
                          {week.resources.map((res, rIdx) => (
                            <a 
                              key={rIdx} 
                              href={res.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              style={{ 
                                fontSize: '0.775rem', 
                                color: 'var(--text-secondary)', 
                                display: 'inline-flex', 
                                alignItems: 'center', 
                                gap: '4px',
                                background: 'var(--bg-secondary)',
                                padding: '3px 8px',
                                borderRadius: '4px',
                                border: '1px solid var(--border-subtle)'
                              }}
                            >
                              <span>{res.title}</span>
                              <ExternalLink size={11} color="var(--accent-primary)" />
                            </a>
                          ))}
                        </div>
                      )}

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
          </div>
        );
      })}
    </div>
  );
}
