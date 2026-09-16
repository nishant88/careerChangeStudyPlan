import React, { useState, useMemo } from 'react';
import { 
  X, 
  Bookmark, 
  Check, 
  Copy, 
  CheckCheck, 
  BookOpen, 
  FileText, 
  Lightbulb, 
  Edit3, 
  Clock, 
  Layers,
  FileCheck
} from 'lucide-react';
import { marked } from 'marked';

// Configure marked for GitHub Flavored Markdown (tables, code blocks, lists)
marked.setOptions({
  gfm: true,
  breaks: true
});

export default function LessonReaderModal({ 
  lesson, 
  isOpen, 
  onClose, 
  onSave, 
  onMarkRead, 
  onSaveNotes 
}) {
  const [activeTab, setActiveTab] = useState('lesson'); // 'lesson' | 'template' | 'takeaways' | 'notes'
  const [copied, setCopied] = useState(false);
  const [personalNotes, setPersonalNotes] = useState('');
  const [notesSaved, setNotesSaved] = useState(false);

  // Sync state whenever lesson changes
  useEffect(() => {
    if (lesson) {
      setPersonalNotes(lesson.personal_notes || '');
      setActiveTab('lesson');
      setCopied(false);
      setNotesSaved(false);
    }
  }, [lesson?.id]);

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Compute word count and estimated read time unconditionally
  const stats = useMemo(() => {
    if (!lesson?.content_body) return { words: 0, minutes: 5 };
    const wordCount = lesson.content_body.trim().split(/\s+/).length;
    const minutes = Math.max(3, Math.ceil(wordCount / 200));
    return { words: wordCount, minutes };
  }, [lesson?.content_body]);

  // Render markdown safely using marked unconditionally
  const renderedContentHtml = useMemo(() => {
    if (!lesson?.content_body) return '';
    try {
      return marked.parse(lesson.content_body);
    } catch (e) {
      return lesson.content_body;
    }
  }, [lesson?.content_body]);

  // Parse takeaways safely
  const takeaways = useMemo(() => {
    if (!lesson?.key_takeaways) return [];
    try {
      return Array.isArray(lesson.key_takeaways) 
        ? lesson.key_takeaways 
        : JSON.parse(lesson.key_takeaways);
    } catch (e) {
      return [lesson.key_takeaways];
    }
  }, [lesson?.key_takeaways]);

  // Early return ONLY AFTER all hooks are registered!
  if (!isOpen || !lesson) return null;

  const handleCopyTemplate = () => {
    if (!lesson.actionable_template) return;
    navigator.clipboard.writeText(lesson.actionable_template);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveNotesSubmit = () => {
    if (onSaveNotes) {
      onSaveNotes(lesson.id, personalNotes);
      setNotesSaved(true);
      setTimeout(() => setNotesSaved(false), 2000);
    }
  };

  return (
    <div className="modal-overlay reader-overlay" onClick={onClose}>
      <div className="reader-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Reader Header Bar */}
        <div className="reader-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <span className="skillset-badge">
              <Layers size={13} />
              <span>{lesson.skillset || 'Program Management'}</span>
            </span>

            {lesson.skillset_priority && (
              <span className="priority-pill">
                {lesson.skillset_priority}
              </span>
            )}

            <span className="reader-readtime" title="Comprehensive detailed guide">
              <Clock size={13} />
              <span>{stats.minutes} min read ({stats.words} words)</span>
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {onSave && (
              <button 
                className="btn-secondary" 
                style={{ fontSize: '0.8rem', padding: '6px 12px' }}
                onClick={() => onSave(lesson.id)}
                title="Save this lesson to your library"
              >
                <Bookmark size={14} />
                <span>Save to Library</span>
              </button>
            )}

            {onMarkRead && (
              <button 
                className="btn-primary" 
                style={{ fontSize: '0.8rem', padding: '6px 12px' }}
                onClick={() => onMarkRead(lesson.id)}
                title="Mark this lesson as completed"
              >
                <Check size={14} />
                <span>{lesson.status === 'read' ? 'Completed' : 'Mark as Read'}</span>
              </button>
            )}

            <button className="btn-icon" onClick={onClose} title="Close Reader (Esc)">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Lesson Title & Summary Hero */}
        <div className="reader-hero">
          <h1 className="reader-title">{lesson.title}</h1>
          {lesson.summary && (
            <p className="reader-summary">{lesson.summary}</p>
          )}
        </div>

        {/* Reader Tab Navigation */}
        <div className="reader-nav-tabs">
          <button 
            className={`reader-tab-btn ${activeTab === 'lesson' ? 'active' : ''}`}
            onClick={() => setActiveTab('lesson')}
          >
            <BookOpen size={16} />
            <span>Exhaustive Study Lesson ({stats.words} words)</span>
          </button>

          {lesson.actionable_template && (
            <button 
              className={`reader-tab-btn ${activeTab === 'template' ? 'active' : ''}`}
              onClick={() => setActiveTab('template')}
            >
              <FileText size={16} />
              <span>Workplace Artifact & Template</span>
            </button>
          )}

          {takeaways.length > 0 && (
            <button 
              className={`reader-tab-btn ${activeTab === 'takeaways' ? 'active' : ''}`}
              onClick={() => setActiveTab('takeaways')}
            >
              <Lightbulb size={16} />
              <span>Key Takeaways ({takeaways.length})</span>
            </button>
          )}

          <button 
            className={`reader-tab-btn ${activeTab === 'notes' ? 'active' : ''}`}
            onClick={() => setActiveTab('notes')}
          >
            <Edit3 size={16} />
            <span>My Reflections & Notes</span>
          </button>
        </div>

        {/* Reader Body Content */}
        <div className="reader-body-scroll">
          {/* TAB 1: MAIN DETAILED LESSON */}
          {activeTab === 'lesson' && (
            <div className="reader-content-markdown">
              {lesson.content_body ? (
                <div 
                  className="markdown-body" 
                  dangerouslySetInnerHTML={{ __html: renderedContentHtml }} 
                />
              ) : (
                <p style={{ color: 'var(--text-secondary)' }}>No extended lesson content available for this topic.</p>
              )}

              {takeaways.length > 0 && (
                <div className="takeaways-callout-box">
                  <div className="takeaways-header">
                    <Lightbulb size={18} color="var(--accent-amber)" />
                    <h4>Executive Highlights & Principles</h4>
                  </div>
                  <ul>
                    {takeaways.map((point, idx) => (
                      <li key={idx}>{point}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: ACTIONABLE WORKPLACE TEMPLATE */}
          {activeTab === 'template' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  Copy this production-ready artifact template directly into your PRD, Jira epic, Confluence page, or steering memo.
                </p>
                <button className="btn-primary" style={{ fontSize: '0.8rem', padding: '6px 14px' }} onClick={handleCopyTemplate}>
                  {copied ? <CheckCheck size={14} /> : <Copy size={14} />}
                  <span>{copied ? 'Copied to Clipboard!' : 'Copy Template'}</span>
                </button>
              </div>

              <pre className="template-code-block">
                <code>{lesson.actionable_template}</code>
              </pre>
            </div>
          )}

          {/* TAB 3: KEY TAKEAWAYS */}
          {activeTab === 'takeaways' && (
            <div className="takeaways-grid">
              {takeaways.map((point, idx) => (
                <div key={idx} className="takeaway-card glass-panel">
                  <div className="takeaway-num">0{idx + 1}</div>
                  <p>{point}</p>
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: PERSONAL REFLECTIONS */}
          {activeTab === 'notes' && (
            <div className="reader-notes-section">
              <h4>My Notes & Workplace Application</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '14px' }}>
                Document how you plan to test or implement this concept in your active delivery projects (e.g. dealer-workshop platform).
              </p>
              <textarea 
                className="notes-editor" 
                style={{ minHeight: '180px', fontSize: '0.95rem' }}
                placeholder="Write your takeaways, quotes, or planned action items..."
                value={personalNotes}
                onChange={(e) => setPersonalNotes(e.target.value)}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px', gap: '8px' }}>
                {notesSaved && (
                  <span style={{ color: 'var(--accent-emerald)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Check size={14} /> Notes saved!
                  </span>
                )}
                <button className="btn-primary" onClick={handleSaveNotesSubmit}>
                  Save Reflections
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
