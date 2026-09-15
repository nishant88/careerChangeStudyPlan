import React, { useState } from 'react';
import { X, Sparkles, Layers } from 'lucide-react';

export default function AddTopicModal({ isOpen, onClose, onAddTopic }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [skillset, setSkillset] = useState('Technical Architecture');
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
      skillset,
      priority,
      status,
      tags
    });

    setTitle('');
    setDescription('');
    setSkillset('Technical Architecture');
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
            <h3>Add New In-App Study Topic</h3>
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
              placeholder="e.g. Distributed Tracing & OpenTelemetry in Automotive Microservices"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label">Target Skillset</label>
            <select className="form-select" value={skillset} onChange={(e) => setSkillset(e.target.value)}>
              <option value="Program Management">Program Management & Delivery Rigor</option>
              <option value="Technical Architecture">Technical Architecture & APIs</option>
              <option value="Data & SQL Analytics">Data Analytics & SQL Telemetry</option>
              <option value="Product Strategy">Product Strategy & Prioritization</option>
              <option value="Executive Communication">Executive & Consulting Communication</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Why I Want to Learn This (Context / Intent)</label>
            <textarea 
              className="form-textarea" 
              placeholder="e.g. Need deeper system observability knowledge to diagnose P95 latency spikes during workshop morning intake rush..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label">Lesson Synthesis Priority</label>
              <select className="form-select" value={priority} onChange={(e) => setPriority(e.target.value)}>
                <option value="high">High (P0 - 3 lessons/day)</option>
                <option value="medium">Medium (P1 - 2 lessons/day)</option>
                <option value="low">Low (P2 - 1 lesson/day)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Initial Backlog Column</label>
              <select className="form-select" value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="now">Now (Crawl & synthesize today)</option>
                <option value="next">Next (Queue for future)</option>
                <option value="someday">Someday (Idea backlog)</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Tags (comma-separated)</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="e.g. Architecture, Telemetry, Automotive"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '24px' }}>
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              <span>Add Topic & Generate Lessons</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
