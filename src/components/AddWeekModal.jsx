import React, { useState } from 'react';
import { X, BookOpen } from 'lucide-react';

export default function AddWeekModal({ isOpen, onClose, phases = [], onAddWeek }) {
  const [phaseId, setPhaseId] = useState(phases[0]?.id || 1);
  const [title, setTitle] = useState('');
  const [learningGoal, setLearningGoal] = useState('');
  const [actionItem, setActionItem] = useState('');
  const [resTitle1, setResTitle1] = useState('');
  const [resUrl1, setResUrl1] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !learningGoal.trim()) return;

    const resources = [];
    if (resTitle1.trim() && resUrl1.trim()) {
      resources.push({ title: resTitle1.trim(), url: resUrl1.trim() });
    }

    onAddWeek({
      phase_id: Number(phaseId),
      title: title.trim(),
      learning_goal: learningGoal.trim(),
      action_item: actionItem.trim(),
      resources
    });

    setTitle('');
    setLearningGoal('');
    setActionItem('');
    setResTitle1('');
    setResUrl1('');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BookOpen size={18} color="var(--accent-primary)" />
            <h3>Add Custom Curriculum Week</h3>
          </div>
          <button className="btn-icon" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Phase</label>
            <select 
              className="form-select" 
              value={phaseId} 
              onChange={(e) => setPhaseId(e.target.value)}
            >
              {phases.map(p => (
                <option key={p.id} value={p.id}>{p.title}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Week Title *</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="e.g. Distributed Tracing & Observability for TPMs"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Learning Goal *</label>
            <textarea 
              className="form-textarea" 
              placeholder="What core engineering or PM competence does this week unlock?"
              value={learningGoal}
              onChange={(e) => setLearningGoal(e.target.value)}
              rows={2}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Apply It At Work (Action Item)</label>
            <textarea 
              className="form-textarea" 
              placeholder="Practical task to execute on your live delivery project or platform..."
              value={actionItem}
              onChange={(e) => setActionItem(e.target.value)}
              rows={2}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Seed Resource (Optional Title & Link)</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="Resource Title (e.g. Honeycomb Observability Primer)"
              value={resTitle1}
              onChange={(e) => setResTitle1(e.target.value)}
              style={{ marginBottom: '6px' }}
            />
            <input 
              type="url" 
              className="form-input" 
              placeholder="https://..."
              value={resUrl1}
              onChange={(e) => setResUrl1(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '24px' }}>
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              <span>Save Custom Week</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
