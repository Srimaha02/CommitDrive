import React, { useState, useEffect, useCallback } from 'react';
import {
  X,
  Target,
  ArrowLeft,
  ArrowRight,
  Clock,
  Cpu,
  Database,
  Network,
  Terminal,
  ChevronRight,
  Check,
  Zap,
  BookOpen,
  AlertTriangle,
  RotateCw,
  Trophy,
  Sparkles,
  Flag,
  SkipForward,
  Eye,
  Tag
} from 'lucide-react';
import {
  VIVA_SUBJECTS,
  VIVA_COUNTS,
  VIVA_TIMERS,
  VIVA_RATINGS,
  buildVivaSession,
  buildRetrySession,
  calculateVivaResult,
  formatVivaTime,
} from '../../data/vivaEngine';
import { COMPANY_TRACKS } from '../../data/companyTracksData';
import './VivaModal.css';

// Icon resolver for subjects
function SubjectIcon({ iconName, size = 16 }) {
  const icons = { Cpu, Database, Network, Terminal };
  const Icon = icons[iconName] || Cpu;
  return <Icon size={size} />;
}

export default function VivaModal({ isOpen, onClose, onOpenCramSheet }) {
  // -- Screen flow: 'track-select' | 'configure' | 'in-progress' | 'results'
  const [screen, setScreen]                 = useState('track-select');

  // -- Setup state
  const [selectedTrack, setSelectedTrack]   = useState('all');
  const [selectedSubjects, setSelectedSubjects] = useState(['os', 'dbms', 'cn', 'practical']);
  const [questionCount, setQuestionCount]   = useState(10);
  const [timerPreset, setTimerPreset]       = useState(0); // seconds, 0 = untimed

  // -- In-progress state
  const [vivaQuestions, setVivaQuestions]   = useState([]);
  const [currentIndex, setCurrentIndex]     = useState(0);
  const [isRevealed, setIsRevealed]         = useState(false);
  const [ratings, setRatings]               = useState({});
  const [timeLeft, setTimeLeft]             = useState(0);
  const [timedOut, setTimedOut]             = useState(false);

  // -- Results state
  const [result, setResult]                 = useState(null);

  // -- ESC key handler
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  // -- Reset on open
  useEffect(() => {
    if (isOpen) {
      setScreen('track-select');
      setSelectedTrack('all');
      setSelectedSubjects(['os', 'dbms', 'cn', 'practical']);
      setQuestionCount(10);
      setTimerPreset(0);
      setVivaQuestions([]);
      setCurrentIndex(0);
      setIsRevealed(false);
      setRatings({});
      setTimeLeft(0);
      setTimedOut(false);
      setResult(null);
    }
  }, [isOpen]);

  // -- Timer countdown
  useEffect(() => {
    if (screen !== 'in-progress' || timerPreset === 0 || timedOut) return;
    if (timeLeft <= 0) {
      handleTimeUp();
      return;
    }
    const id = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearTimeout(id);
  }, [screen, timeLeft, timerPreset, timedOut]);

  const handleTimeUp = useCallback(() => {
    setTimedOut(true);
    const finalRatings = { ...ratings };
    // Mark unanswered questions as missed
    vivaQuestions.forEach(q => {
      if (!finalRatings[q.id]) finalRatings[q.id] = 'missed';
    });
    const res = calculateVivaResult(vivaQuestions, finalRatings);
    setResult(res);
    setScreen('results');
  }, [ratings, vivaQuestions]);

  // -- Start viva session
  const handleStartViva = () => {
    if (selectedSubjects.length === 0) return;
    const questions = buildVivaSession(selectedTrack, selectedSubjects, questionCount);
    if (questions.length === 0) return;
    setVivaQuestions(questions);
    setCurrentIndex(0);
    setIsRevealed(false);
    setRatings({});
    setTimeLeft(timerPreset);
    setTimedOut(false);
    setScreen('in-progress');
  };

  // -- Handle self-rate selection → advance
  const handleRate = (ratingId) => {
    const currentQ = vivaQuestions[currentIndex];
    if (!currentQ) return;

    const newRatings = { ...ratings, [currentQ.id]: ratingId };
    setRatings(newRatings);

    // Small delay before advancing for visual feedback
    setTimeout(() => {
      if (currentIndex + 1 < vivaQuestions.length) {
        setCurrentIndex(prev => prev + 1);
        setIsRevealed(false);
      } else {
        // Finished all questions
        const res = calculateVivaResult(vivaQuestions, newRatings);
        setResult(res);
        setScreen('results');
      }
    }, 320);
  };

  // -- Skip (mark as missed, advance)
  const handleSkip = () => handleRate('missed');

  // -- Retry weak questions
  const handleRetry = () => {
    if (!result) return;
    const retryQs = buildRetrySession(result.questionResults, selectedTrack);
    if (retryQs.length === 0) return;
    setVivaQuestions(retryQs);
    setCurrentIndex(0);
    setIsRevealed(false);
    setRatings({});
    setTimeLeft(timerPreset);
    setTimedOut(false);
    setResult(null);
    setScreen('in-progress');
  };

  if (!isOpen) return null;

  const activeTrackData    = COMPANY_TRACKS.find(t => t.id === selectedTrack) || COMPANY_TRACKS[0];
  const currentQ           = vivaQuestions[currentIndex];
  const progressPct        = vivaQuestions.length > 0 ? Math.round((currentIndex / vivaQuestions.length) * 100) : 0;
  const isTimerWarning     = timerPreset > 0 && timeLeft <= 60 && timeLeft > 0;

  const getRatingData      = (id) => VIVA_RATINGS.find(r => r.id === id);

  // =====================================================================
  // RENDER HELPERS
  // =====================================================================

  const renderTrackSelect = () => (
    <>
      <div className="viva-screen-header">
        <span className="viva-screen-header-icon">🎯</span>
        <h2 className="viva-screen-title">Diagnostic Interview Viva</h2>
        <p className="viva-screen-sub">
          Simulate a real technical interview. Select your target company gate to calibrate
          question difficulty and scoring criteria to your specific hiring bar.
        </p>
      </div>

      <div className="viva-track-grid">
        {COMPANY_TRACKS.map(track => (
          <button
            key={track.id}
            className="viva-track-card"
            style={{
              '--track-color':  track.color,
              '--track-bg':     track.bg,
              '--track-border': track.border,
            }}
            onClick={() => { setSelectedTrack(track.id); setScreen('configure'); }}
          >
            <div className="viva-track-card-badge">
              <Zap size={10} />
              {track.badge}
            </div>
            <div className="viva-track-card-title">{track.label}</div>
            <div className="viva-track-card-companies">
              {track.companies.slice(0, 3).join(' · ')}
              {track.companies.length > 3 && ` +${track.companies.length - 3} more`}
            </div>
            <div className="viva-track-card-desc">{track.tagline}</div>
            <ChevronRight size={16} className="viva-track-card-arrow" />
          </button>
        ))}
      </div>
    </>
  );

  const renderConfigure = () => (
    <div className="viva-configure-screen">
      <button className="viva-back-btn" onClick={() => setScreen('track-select')}>
        <ArrowLeft size={13} /> Back to track selection
      </button>

      {/* Active track summary */}
      <div className="viva-active-track-bar">
        <div className="viva-active-track-dot" style={{ background: activeTrackData.color }} />
        <div className="viva-active-track-info">
          <div className="viva-active-track-name">{activeTrackData.label}</div>
          <div className="viva-active-track-hint">{activeTrackData.keyExpectation}</div>
        </div>
        <button className="viva-active-track-change" onClick={() => setScreen('track-select')}>
          Change
        </button>
      </div>

      {/* Subject multi-select */}
      <div className="viva-config-section">
        <div className="viva-config-label">
          <BookOpen size={12} /> Select subjects
        </div>
        <div className="viva-subject-grid">
          {VIVA_SUBJECTS.map(s => {
            const isSel = selectedSubjects.includes(s.id);
            return (
              <button
                key={s.id}
                className={`viva-subject-btn ${isSel ? 'selected' : ''}`}
                style={{
                  '--subj-color':  s.color,
                  '--subj-bg':     s.bg,
                  '--subj-border': s.border,
                }}
                onClick={() => {
                  setSelectedSubjects(prev =>
                    isSel
                      ? prev.filter(id => id !== s.id)
                      : [...prev, s.id]
                  );
                }}
              >
                <div className="viva-subject-check">
                  {isSel && <Check size={10} color="#fff" />}
                </div>
                <div className="viva-subject-icon">
                  <SubjectIcon iconName={s.iconName} size={17} />
                </div>
                <div className="viva-subject-label">{s.shortLabel}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Question count */}
      <div className="viva-config-section">
        <div className="viva-config-label">
          <Flag size={12} /> Number of questions
        </div>
        <div className="viva-option-row">
          {VIVA_COUNTS.map(c => (
            <button
              key={c}
              className={`viva-option-btn ${questionCount === c ? 'selected' : ''}`}
              onClick={() => setQuestionCount(c)}
            >
              {c} questions
              <span className="viva-option-sub">
                {c === 5 ? 'Quick drill' : c === 10 ? 'Standard' : 'Deep session'}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Timer */}
      <div className="viva-config-section">
        <div className="viva-config-label">
          <Clock size={12} /> Timer
        </div>
        <div className="viva-option-row">
          {VIVA_TIMERS.map(t => (
            <button
              key={t.value}
              className={`viva-option-btn ${timerPreset === t.value ? 'selected' : ''}`}
              onClick={() => setTimerPreset(t.value)}
            >
              {t.label}
              <span className="viva-option-sub">
                {t.value === 0 ? 'No pressure' : t.value <= 300 ? 'Fast pace' : t.value <= 600 ? 'Moderate' : 'Full mock'}
              </span>
            </button>
          ))}
        </div>
      </div>

      <button
        className="viva-start-btn"
        onClick={handleStartViva}
        disabled={selectedSubjects.length === 0}
      >
        <Target size={17} />
        Start Viva — {questionCount} Questions
        {timerPreset > 0 && ` · ${formatVivaTime(timerPreset)}`}
        <ArrowRight size={15} />
      </button>
    </div>
  );

  const renderInProgress = () => {
    if (!currentQ) return null;
    const levelClass = currentQ.level || 'basic';
    const subjectMeta = VIVA_SUBJECTS.find(s => s.id === currentQ.subjectId) || VIVA_SUBJECTS[0];

    return (
      <div className="viva-progress-view">
        {/* Header strip */}
        <div className="viva-progress-header">
          <div
            className="viva-progress-track-badge"
            style={{
              color: activeTrackData.color,
              background: activeTrackData.bg,
              borderColor: activeTrackData.border,
            }}
          >
            <Target size={11} />
            {activeTrackData.shortLabel || activeTrackData.label}
          </div>

          {timerPreset > 0 && (
            <div className={`viva-timer-display ${isTimerWarning ? 'warning' : ''}`}>
              <Clock size={13} />
              {formatVivaTime(timeLeft)}
            </div>
          )}

          <div className="viva-progress-counter">
            <strong>{currentIndex + 1}</strong> / {vivaQuestions.length}
          </div>
        </div>

        {/* Progress bar */}
        <div className="viva-progress-bar-track">
          <div
            className="viva-progress-bar-fill"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        {/* Question card */}
        <div className="viva-question-card">
          <div className="viva-question-meta">
            <div
              className="viva-question-subject-badge"
              style={{
                color: subjectMeta.color,
                background: subjectMeta.bg,
                borderColor: subjectMeta.border,
              }}
            >
              <SubjectIcon iconName={subjectMeta.iconName} size={11} />
              {currentQ.subjectName}
            </div>

            {currentQ.topic && (
              <div className="viva-question-topic-tag">{currentQ.topic}</div>
            )}

            <div className={`viva-question-level-pill ${levelClass}`}>
              {currentQ.levelLabel || levelClass}
            </div>

            {currentQ.frequency && (
              <div className="viva-frequency-pill">
                <Zap size={10} />
                High Frequency
              </div>
            )}
          </div>

          <div className="viva-question-text">{currentQ.question}</div>
        </div>

        {/* Reveal / Answer zone */}
        {!isRevealed ? (
          <div className="viva-reveal-zone">
            <p className="viva-reveal-hint">
              Think through your answer, then reveal the model response to self-assess.
            </p>
            <button className="viva-reveal-btn" onClick={() => setIsRevealed(true)}>
              <Eye size={15} />
              Reveal Model Answer
            </button>
          </div>
        ) : (
          <div className="viva-answer-panel">
            {/* Summary */}
            <div className="viva-answer-section-label">
              <BookOpen size={12} />
              Model Answer
            </div>
            <div className="viva-answer-summary">
              {currentQ.modelAnswer?.summary || 'No model answer available.'}
            </div>

            {/* Keywords */}
            {currentQ.mustMentionKeywords?.length > 0 && (
              <>
                <div className="viva-answer-divider" />
                <div className="viva-answer-section-label">
                  <Tag size={12} />
                  Must-mention keywords
                </div>
                <div className="viva-keywords-row">
                  {currentQ.mustMentionKeywords.map((kw, i) => (
                    <span key={i} className="viva-keyword-chip">
                      <Check size={10} />
                      {kw}
                    </span>
                  ))}
                </div>
              </>
            )}

            {/* Trap warning */}
            {currentQ.trapWarning && (
              <>
                <div className="viva-answer-divider" />
                <div className="viva-trap-warning">
                  <div className="viva-trap-warning-title">
                    <AlertTriangle size={12} />
                    Rookie Mistake to Avoid
                  </div>
                  <div className="viva-trap-warning-text">
                    {currentQ.trapWarning.rookieMistake}
                  </div>
                  <div className="viva-trap-winning">
                    <div className="viva-trap-winning-title">
                      <Check size={12} />
                      Winning Answer
                    </div>
                    <div className="viva-trap-winning-text">
                      {currentQ.trapWarning.winningAnswer}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Self-rate row — only shown after reveal */}
        {isRevealed && (
          <>
            <p className="viva-rate-label">How well did you answer this question?</p>
            <div className="viva-rate-row">
              {VIVA_RATINGS.map(r => (
                <button
                  key={r.id}
                  className={`viva-rate-btn ${ratings[currentQ.id] === r.id ? 'selected' : ''}`}
                  style={{
                    '--rate-color':  r.color,
                    '--rate-bg':     r.bg,
                    '--rate-border': r.border,
                  }}
                  onClick={() => handleRate(r.id)}
                >
                  <span className="viva-rate-emoji">{r.emoji}</span>
                  <span className="viva-rate-label-text">{r.label}</span>
                </button>
              ))}
            </div>
          </>
        )}

        {/* Skip (always available) */}
        {!isRevealed && (
          <button className="viva-skip-btn" onClick={handleSkip}>
            <SkipForward size={13} />
            Skip this question (mark as missed)
          </button>
        )}
      </div>
    );
  };

  const renderResults = () => {
    if (!result) return null;
    return (
      <div className="viva-results-screen">
        {timedOut && (
          <div className="viva-timeout-notice">
            <Clock size={15} />
            Time expired — unanswered questions marked as missed.
          </div>
        )}

        {/* Verdict banner */}
        <div
          className="viva-verdict-banner"
          style={{
            background: result.verdictBg,
            borderColor: result.verdictBorder,
          }}
        >
          <div className="viva-verdict-emoji">{result.verdictEmoji}</div>
          <div className="viva-verdict-text-col">
            <div
              className="viva-verdict-title"
              style={{ color: result.verdictColor }}
            >
              {result.verdict}
            </div>
            <div className="viva-verdict-desc">{result.verdictDesc}</div>
            <div className="viva-verdict-tip">💡 {result.verdictTip}</div>
          </div>
          <div
            className="viva-verdict-score"
            style={{ borderColor: result.verdictColor, color: result.verdictColor }}
          >
            <span className="viva-verdict-score-num">{result.score}</span>
            <span className="viva-verdict-score-pct">%</span>
          </div>
        </div>

        {/* Stat row */}
        <div className="viva-stats-row">
          <div
            className="viva-stat-card"
            style={{
              background: 'rgba(74,222,128,0.07)',
              borderColor: 'rgba(74,222,128,0.2)',
            }}
          >
            <span className="viva-stat-emoji">✅</span>
            <span className="viva-stat-count" style={{ color: '#4ade80' }}>{result.nailed}</span>
            <span className="viva-stat-label" style={{ color: '#4ade80' }}>Nailed It</span>
          </div>
          <div
            className="viva-stat-card"
            style={{
              background: 'rgba(245,158,11,0.07)',
              borderColor: 'rgba(245,158,11,0.2)',
            }}
          >
            <span className="viva-stat-emoji">🟡</span>
            <span className="viva-stat-count" style={{ color: '#f59e0b' }}>{result.partial}</span>
            <span className="viva-stat-label" style={{ color: '#f59e0b' }}>Partial</span>
          </div>
          <div
            className="viva-stat-card"
            style={{
              background: 'rgba(248,113,113,0.07)',
              borderColor: 'rgba(248,113,113,0.2)',
            }}
          >
            <span className="viva-stat-emoji">❌</span>
            <span className="viva-stat-count" style={{ color: '#f87171' }}>{result.missed}</span>
            <span className="viva-stat-label" style={{ color: '#f87171' }}>Missed It</span>
          </div>
        </div>

        {/* Weak topics */}
        {result.weakTopics.length > 0 ? (
          <div className="viva-weak-section">
            <div className="viva-section-heading">
              <AlertTriangle size={12} />
              Weak topics to review
            </div>
            <div className="viva-weak-chips">
              {result.weakTopics.map((topic, i) => (
                <span key={i} className="viva-weak-chip">
                  <AlertTriangle size={11} />
                  {topic}
                </span>
              ))}
            </div>
          </div>
        ) : (
          <div className="viva-all-nailed">
            🎉 No weak topics — you nailed everything!
          </div>
        )}

        {/* Per-question review list */}
        <div className="viva-section-heading">
          <Flag size={12} />
          Question-by-question breakdown
        </div>
        <div className="viva-review-list">
          {result.questionResults.map((q, idx) => {
            const ratingData = getRatingData(q.rating);
            const subMeta    = VIVA_SUBJECTS.find(s => s.id === q.subjectId) || VIVA_SUBJECTS[0];
            return (
              <div key={q.id} className={`viva-review-item ${q.rating}`}>
                <div className="viva-review-emoji">{ratingData?.emoji || '❌'}</div>
                <div className="viva-review-content">
                  <div className="viva-review-q-num">Q{idx + 1} · {q.topic || q.subjectName}</div>
                  <div className="viva-review-q-text">{q.question}</div>
                </div>
                <div
                  className="viva-review-subject-tag"
                  style={{ color: subMeta.color, borderColor: subMeta.border, background: subMeta.bg }}
                >
                  {q.subjectName}
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA buttons */}
        <div className="viva-results-ctas">
          {result.weakTopics.length > 0 && (
            <button className="viva-cta-btn primary" onClick={handleRetry}>
              <RotateCw size={15} />
              Retry Weak Questions ({result.missed + result.partial})
            </button>
          )}
          <button
            className={`viva-cta-btn secondary ${result.weakTopics.length === 0 ? 'viva-cta-full' : ''}`}
            onClick={() => {
              onClose();
              if (onOpenCramSheet) {
                setTimeout(() => onOpenCramSheet(null, selectedTrack), 100);
              }
            }}
          >
            <BookOpen size={15} />
            Open Cram Sheet
          </button>
          <button className="viva-cta-btn secondary viva-cta-full" onClick={() => setScreen('configure')}>
            <RotateCw size={15} />
            Start a New Viva Session
          </button>
        </div>
      </div>
    );
  };

  // =====================================================================
  // MAIN RENDER
  // =====================================================================
  return (
    <div
      className="viva-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Diagnostic Interview Viva"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="viva-modal">
        {/* Topbar */}
        <div className="viva-modal-topbar">
          <div className="viva-modal-brand">
            <div className="viva-brand-icon">🎯</div>
            <div className="viva-brand-text">
              <div className="viva-brand-title">Diagnostic Interview Viva</div>
              <div className="viva-brand-sub">
                {screen === 'track-select' && 'Select your company target gate'}
                {screen === 'configure'    && `${activeTrackData.label} — Configure session`}
                {screen === 'in-progress' && `Q${currentIndex + 1} of ${vivaQuestions.length} · ${activeTrackData.shortLabel || activeTrackData.label}`}
                {screen === 'results'      && `Session complete · ${result?.verdict}`}
              </div>
            </div>
          </div>
          <button className="viva-close-btn" onClick={onClose} aria-label="Close Viva">
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="viva-body">
          {screen === 'track-select'  && renderTrackSelect()}
          {screen === 'configure'     && renderConfigure()}
          {screen === 'in-progress'   && renderInProgress()}
          {screen === 'results'       && renderResults()}
        </div>
      </div>
    </div>
  );
}
