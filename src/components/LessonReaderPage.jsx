import React, { useState, useEffect, useMemo } from 'react';
import { 
  ArrowLeft, 
  Bookmark, 
  Check, 
  Copy, 
  CheckCheck, 
  BookOpen, 
  FileText, 
  Lightbulb, 
  Edit3, 
  Clock, 
  Calendar,
  Layers,
  Moon,
  Sun,
  Video,
  Play,
  Square
} from 'lucide-react';
import { marked } from 'marked';

// Configure marked for GitHub Flavored Markdown (tables, code blocks, lists)
marked.setOptions({
  gfm: true,
  breaks: true
});

export default function LessonReaderPage({ 
  lesson, 
  onBack, 
  onSave, 
  onMarkRead, 
  onSaveNotes,
  theme,
  toggleTheme
}) {
  const [activeTab, setActiveTab] = useState('lesson'); // 'lesson' | 'template' | 'takeaways' | 'notes'
  const [copied, setCopied] = useState(false);
  const [personalNotes, setPersonalNotes] = useState('');
  const [notesSaved, setNotesSaved] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  // Sync state whenever lesson changes
  useEffect(() => {
    if (lesson) {
      setPersonalNotes(lesson.personal_notes || '');
      setActiveTab('lesson');
      setCopied(false);
      setNotesSaved(false);
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
    
    // Auto switch to paperwhite theme if coming from another theme
    if (theme !== 'paperwhite' && theme !== 'dark') {
      // It's a nice touch to default to paperwhite for reading, but we'll respect user choice
    }
  }, [lesson?.id]);

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onBack();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onBack]);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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

  // Parse youtube videos safely
  const youtubeVideos = useMemo(() => {
    if (!lesson?.youtube_videos) return [];
    try {
      return Array.isArray(lesson.youtube_videos) 
        ? lesson.youtube_videos 
        : JSON.parse(lesson.youtube_videos);
    } catch (e) {
      return [];
    }
  }, [lesson?.youtube_videos]);

  if (!lesson) return null;

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

  const handleToggleSpeech = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      const text = `${lesson.title}. ${lesson.summary || ''}. ${lesson.content_body ? lesson.content_body.replace(/[#*_>]/g, '') : ''}`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  return (
    <div className="reader-page-wrapper">
      <header className="reader-page-header">
        <button 
          className="btn-secondary" 
          onClick={onBack}
          style={{ padding: '8px 16px', borderRadius: 'var(--radius-full)' }}
        >
          <ArrowLeft size={16} />
          <span>Back to App</span>
        </button>

        <div className="reader-header-actions">
          <button 
            className="btn-icon" 
            onClick={toggleTheme} 
            title="Toggle Reader Theme"
            style={{ borderRadius: 'var(--radius-full)' }}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          
          {onSave && (
            <button 
              className="btn-secondary" 
              onClick={() => onSave(lesson.id)}
              title="Save this lesson to your library"
              style={{ borderRadius: 'var(--radius-full)' }}
            >
              <Bookmark size={14} />
              <span>Save</span>
            </button>
          )}

          {onMarkRead && (
            <button 
              className="btn-primary" 
              onClick={() => onMarkRead(lesson.id)}
              title="Mark this lesson as completed"
              style={{ borderRadius: 'var(--radius-full)' }}
            >
              <Check size={14} />
              <span>{lesson.status === 'read' ? 'Completed' : 'Complete Lesson'}</span>
            </button>
          )}
        </div>
      </header>

      <main className="reader-content-layout">
        <div className="reader-title-section">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '16px' }}>
            <span className="skillset-badge">
              <Layers size={13} />
              <span>{lesson.skillset || 'Program Management'}</span>
            </span>

            {lesson.skillset_priority && (
              <span className="priority-pill">
                {lesson.skillset_priority}
              </span>
            )}
          </div>
          
          <h1 className="reader-title">{lesson.title}</h1>
          
          {lesson.summary && (
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', marginBottom: '24px', lineHeight: '1.6' }}>
              {lesson.summary}
            </p>
          )}

          <div className="reader-meta-bar">
            {lesson.found_at && (() => {
              const dateStr = lesson.found_at.includes('Z') ? lesson.found_at : lesson.found_at + 'Z';
              const date = new Date(dateStr);
              if (isNaN(date)) return null;
              return (
                <>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    <Calendar size={14} />
                    <span>Crawled on {date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })} at {date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}</span>
                  </span>
                  <span style={{ color: 'var(--border-subtle)' }}>|</span>
                </>
              );
            })()}
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              <Clock size={14} />
              <span>{stats.minutes} min read</span>
            </span>
            <span style={{ color: 'var(--border-subtle)' }}>|</span>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              {stats.words} words
            </span>
            <span style={{ color: 'var(--border-subtle)' }}>|</span>
            <button 
              onClick={handleToggleSpeech} 
              title={isSpeaking ? "Stop listening" : "Listen to article"}
              style={{ 
                background: 'none', 
                border: 'none', 
                cursor: 'pointer', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '6px', 
                color: isSpeaking ? 'var(--accent-primary)' : 'var(--text-muted)', 
                fontSize: '0.9rem',
                fontFamily: 'inherit'
              }}
            >
              {isSpeaking ? <Square size={14} /> : <Play size={14} />}
              <span>{isSpeaking ? "Stop Audio" : "Play Audio"}</span>
            </button>
          </div>
        </div>

        <div className="reader-nav-tabs" style={{ marginBottom: '32px' }}>
          <button 
            className={`reader-tab-btn ${activeTab === 'lesson' ? 'active' : ''}`}
            onClick={() => setActiveTab('lesson')}
          >
            <BookOpen size={16} />
            <span>Read Lesson</span>
          </button>

          {lesson.actionable_template && (
            <button 
              className={`reader-tab-btn ${activeTab === 'template' ? 'active' : ''}`}
              onClick={() => setActiveTab('template')}
            >
              <FileText size={16} />
              <span>Template</span>
            </button>
          )}

          {takeaways.length > 0 && (
            <button 
              className={`reader-tab-btn ${activeTab === 'takeaways' ? 'active' : ''}`}
              onClick={() => setActiveTab('takeaways')}
            >
              <Lightbulb size={16} />
              <span>Takeaways ({takeaways.length})</span>
            </button>
          )}

          <button 
            className={`reader-tab-btn ${activeTab === 'notes' ? 'active' : ''}`}
            onClick={() => setActiveTab('notes')}
          >
            <Edit3 size={16} />
            <span>My Notes</span>
          </button>

          {youtubeVideos.length > 0 && (
            <button 
              className={`reader-tab-btn ${activeTab === 'videos' ? 'active' : ''}`}
              onClick={() => setActiveTab('videos')}
            >
              <Video size={16} />
              <span>Related Videos ({youtubeVideos.length})</span>
            </button>
          )}
        </div>

        {/* TAB CONTENT */}
        <div>
          {/* TAB 1: MAIN DETAILED LESSON */}
          {activeTab === 'lesson' && (
            <div className="reader-body-content">
              {lesson.content_body ? (
                <div 
                  dangerouslySetInnerHTML={{ __html: renderedContentHtml }} 
                />
              ) : (
                <p style={{ color: 'var(--text-secondary)' }}>No extended lesson content available for this topic.</p>
              )}
            </div>
          )}

          {/* TAB 2: ACTIONABLE WORKPLACE TEMPLATE */}
          {activeTab === 'template' && (
            <div className="reader-body-content">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <p style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>
                  Copy this production-ready artifact template directly into your PRD, Jira epic, Confluence page, or steering memo.
                </p>
                <button className="btn-primary" style={{ fontSize: '0.8rem', padding: '6px 14px' }} onClick={handleCopyTemplate}>
                  {copied ? <CheckCheck size={14} /> : <Copy size={14} />}
                  <span>{copied ? 'Copied!' : 'Copy Template'}</span>
                </button>
              </div>

              <pre>
                <code>{lesson.actionable_template}</code>
              </pre>
            </div>
          )}

          {/* TAB 3: KEY TAKEAWAYS */}
          {activeTab === 'takeaways' && (
            <div className="reader-body-content takeaways-grid">
              {takeaways.map((point, idx) => (
                <div key={idx} className="takeaway-card glass-panel" style={{ padding: '24px' }}>
                  <div className="takeaway-num">0{idx + 1}</div>
                  <p style={{ fontSize: '1.1rem' }}>{point}</p>
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: PERSONAL REFLECTIONS */}
          {activeTab === 'notes' && (
            <div className="reader-notes-section">
              <h2 style={{ fontFamily: 'Inter, sans-serif', fontSize: '1.5rem', marginBottom: '16px' }}>My Reflections & Action Items</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: '24px' }}>
                Document how you plan to test or implement this concept in your active delivery projects (e.g. dealer-workshop platform).
              </p>
              <textarea 
                className="reader-notes-textarea" 
                placeholder="Write your takeaways, quotes, or planned action items..."
                value={personalNotes}
                onChange={(e) => setPersonalNotes(e.target.value)}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px', gap: '12px' }}>
                {notesSaved && (
                  <span style={{ color: 'var(--accent-emerald)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Check size={16} /> Notes saved!
                  </span>
                )}
                <button className="btn-primary" onClick={handleSaveNotesSubmit}>
                  Save Reflections
                </button>
              </div>
            </div>
          )}

          {/* TAB 5: RELATED VIDEOS */}
          {activeTab === 'videos' && (
            <div className="reader-body-content">
              <h2 style={{ fontFamily: 'Inter, sans-serif', fontSize: '1.5rem', marginBottom: '16px' }}>Recommended Deep Dive Videos</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: '32px' }}>
                Solidify your understanding by watching these full-length masterclasses specifically curated for this topic.
              </p>
              
              {youtubeVideos.map((video, idx) => (
                <div key={idx} style={{ marginBottom: '48px' }}>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '12px' }}>{video.title} (Duration: {video.duration})</h3>
                  <div style={{ borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
                    <iframe 
                      width="100%" 
                      height="450" 
                      src={video.embedUrl} 
                      frameBorder="0" 
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
