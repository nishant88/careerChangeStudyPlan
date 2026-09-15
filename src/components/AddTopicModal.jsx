import React, { useState } from 'react';
import { X, Sparkles } from 'lucide-react';

export default function AddTopicModal({ isOpen, onClose, onAddTopic }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('high');
  const [status, setStatus] = useState('now');
  const [tagInput, setTagInput] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const tags = tagInput.split(',').map(t => t.trim()).filter(Boolean);

    onAddTopic({
      title: title.trim(),
      description: description.trim(),
      priority,
      status,
      tags
    });

    setTitle('');
    setDescription('');
    setPriority('high');
    setStatus('now');
    setTagInput('');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={18} color="var(--accent-primary)" />
            <h3>Add New Study Topic</h3>
          </div>
          <button className="btn-icon" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Topic Title *</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="e.g. Distributed Caching & Redis Invalidation Patterns"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label">Why I Want to Learn This (Context / Intent)</label>
            <textarea 
              className="form-textarea" 
              placeholder="e.g. Need deeper technical fluency to review caching architecture with dealer platform backend architects..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label">Crawler Priority</label>
              <select className="form-select" value={priority} onChange={(e) => setPriority(e.target.value)}>
                <option value="high">High (3–4 fresh finds/day)</option>
                <option value="medium">Medium (2 fresh finds/day)</option>
                <option value="low">Low (1 fresh find/day)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Initial Column</label>
              <select className="form-select" value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="now">Now (Crawl starts today)</option>
                <option value="next">Next (Queue for later)</option>
                <option value="someday">Someday (Idea backlog)</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Tags (comma-separated)</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="e.g. Architecture, Caching, Backend"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '24px' }}>
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              <span>Add Topic & Enable Crawl</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
