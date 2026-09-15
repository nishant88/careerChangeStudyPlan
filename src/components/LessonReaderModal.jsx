import React, { useState } from 'react';
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
  Award,
  Layers
} from 'lucide-react';

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
  const [personalNotes, setPersonalNotes] = useState(lesson?.personal_notes || '');
  const [notesSaved, setNotesSaved] = useState(false);

  if (!isOpen || !lesson) return null;

  let takeaways = [];
  try {
    takeaways = Array.isArray(lesson.key_takeaways) 
      ? lesson.key_takeaways 
      : (lesson.key_takeaways ? JSON.parse(lesson.key_takeaways) : []);
  } catch (e) {
    takeaways = lesson.key_takeaways ? [lesson.key_takeaways] : [];
  }

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

            <span className="reader-readtime">
              <Clock size={13} />
              <span>{lesson.read_time || '8 min read'}</span>
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
            <span>Study Lesson & Deep Dive</span>
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
          {/* TAB 1: MAIN LESSON */}
          {activeTab === 'lesson' && (
            <div className="reader-content-markdown">
              {lesson.content_body ? (
                <div dangerouslySetInnerHTML={{ 
                  __html: formatMarkdownToHtml(lesson.content_body) 
                }} />
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

// Simple Markdown to HTML formatter for rich in-app rendering
function formatMarkdownToHtml(md) {
  if (!md) return '';
  return md
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/gim, '<em>$1</em>')
    .replace(/```([\s\S]*?)```/gim, '<pre><code>$1</code></pre>')
    .replace(/`([^`]+)`/gim, '<code>$1</code>')
    .replace(/^- (.*$)/gim, '<li>$1</li>')
    .replace(/\n\n/gim, '<p></p>')
    .replace(/\n/gim, '<br />');
}
