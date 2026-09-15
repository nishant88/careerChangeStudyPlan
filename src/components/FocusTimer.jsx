import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Clock, Sparkles } from 'lucide-react';
import { recordStudySession } from '../api';

export default function FocusTimer({ onSessionCompleted }) {
  const DEFAULT_SECONDS = 45 * 60; // 45 minutes
  const [timeLeft, setTimeLeft] = useState(DEFAULT_SECONDS);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      playCompletionChime();
      recordStudySession(45)
        .then(() => {
          if (onSessionCompleted) onSessionCompleted(45);
        })
        .catch(console.error);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  // Gentle audio chime using browser Web Audio API
  const playCompletionChime = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.3); // A5
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.2);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 1.2);
    } catch (e) {}
  };

  const toggleTimer = () => setIsRunning(!isRunning);

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(DEFAULT_SECONDS);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercent = Math.round(((DEFAULT_SECONDS - timeLeft) / DEFAULT_SECONDS) * 100);

  return (
    <div className="glass-panel timer-widget">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'var(--accent-primary)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        <Clock size={16} />
        <span>Weekday Focus Session</span>
      </div>

      <div className="timer-display">
        {formatTime(timeLeft)}
      </div>

      {/* Progress line */}
      <div style={{ width: '100%', height: '4px', background: 'var(--bg-input)', borderRadius: '999px', overflow: 'hidden', marginBottom: '18px' }}>
        <div style={{ 
          width: `${progressPercent}%`, 
          height: '100%', 
          background: 'var(--gradient-primary)',
          transition: 'width 1s linear'
        }} />
      </div>

      <div className="timer-controls">
        <button 
          className="btn-timer-primary" 
          onClick={toggleTimer}
          id="btn-focus-timer"
        >
          {isRunning ? <Pause size={16} /> : <Play size={16} />}
          <span>{isRunning ? 'Pause' : 'Start 45m Session'}</span>
        </button>

        <button 
          className="btn-icon" 
          onClick={resetTimer} 
          title="Reset Timer"
        >
          <RotateCcw size={15} />
        </button>
      </div>

      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
        <Sparkles size={12} color="var(--accent-amber)" />
        <span>Structured 45–60 min weekday study cadence</span>
      </div>
    </div>
  );
}
