import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  RotateCw, 
  ArrowRight, 
  ArrowLeft, 
  Flag, 
  Award, 
  FileCheck2, 
  ChevronRight, 
  ChevronDown,
  Terminal,
  HelpCircle,
  BarChart3,
  Sparkles,
  Filter,
  Check,
  X,
  Layers
} from 'lucide-react';
import { getModuleQuestions, getPracticalModule, evaluateMockTest } from '../../data/practicalCurriculum';
import { practicalApi } from '../../services/api';

export default function MockTestView({ moduleId, onSwitchToPractice }) {
  const currentModule = getPracticalModule(moduleId);
  const questions = getModuleQuestions(moduleId);

  // Test Lifecycle State: 'in-progress' | 'submitted'
  const [testState, setTestState] = useState('in-progress');

  // Active question index (0 to 9)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // User selected answers: { [questionId]: selectedOptionIndex }
  const [userAnswers, setUserAnswers] = useState({});

  // Flagged questions for review: { [questionId]: boolean }
  const [flaggedQuestions, setFlaggedQuestions] = useState({});

  // Timer countdown: 15 minutes (900 seconds)
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(15 * 60);

  // Evaluation results cache
  const [evaluationResult, setEvaluationResult] = useState(null);

  // Expanded question review IDs
  const [expandedReviews, setExpandedReviews] = useState({});

  // Countdown timer effect
  useEffect(() => {
    if (testState !== 'in-progress') return;

    if (timeLeftSeconds <= 0) {
      // Time expired: auto-submit test!
      handleAutoSubmit();
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeftSeconds(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeftSeconds, testState]);

  // Format seconds to MM:SS string
  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Handle Option Selection
  const handleSelectOption = (questionId, optionIndex) => {
    if (testState !== 'in-progress') return;
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  // Toggle Flag for Review
  const handleToggleFlag = (questionId) => {
    setFlaggedQuestions(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  // Active review filter: 'all' | 'incorrect' | 'correct'
  const [reviewFilter, setReviewFilter] = useState('all');

  // Auto-Submit on Timeout
  const handleAutoSubmit = () => {
    const result = evaluateMockTest(moduleId, userAnswers);
    setEvaluationResult(result);
    // Expand ALL reviews by default so user immediately sees answers & explanations!
    const allExpanded = {};
    result.questionReviews.forEach(r => {
      allExpanded[r.id] = true;
    });
    setExpandedReviews(allExpanded);
    setTestState('submitted');

    // Persist mock test attempt to backend / local history
    const autoPayload = {
      moduleId,
      score: result.score,
      totalQuestions: result.totalQuestions,
      percentage: result.percentage,
      passed: result.passed ?? (result.percentage >= 70),
      timeSpentSeconds: (15 * 60) - Math.max(0, timeLeftSeconds),
      timeTakenSeconds: (15 * 60) - Math.max(0, timeLeftSeconds),
      categoryBreakdownJson: JSON.stringify(result.categoryStats || result.breakdown || {}),
      answersJson: JSON.stringify(userAnswers || {})
    };
    practicalApi.submitMockTest(autoPayload).catch((err) => {
      console.error('Failed to submit mock test:', err);
    });
  };

  // Manual Submit Test
  const handleManualSubmit = () => {
    const answeredCount = Object.keys(userAnswers).length;
    if (answeredCount < questions.length) {
      const confirmSubmit = window.confirm(
        `You have answered ${answeredCount} of ${questions.length} questions. Are you sure you want to submit?`
      );
      if (!confirmSubmit) return;
    }
    const result = evaluateMockTest(moduleId, userAnswers);
    setEvaluationResult(result);
    // Expand ALL reviews by default so user immediately sees answers & explanations!
    const allExpanded = {};
    result.questionReviews.forEach(r => {
      allExpanded[r.id] = true;
    });
    setExpandedReviews(allExpanded);
    setTestState('submitted');

    // Persist mock test attempt to backend / local history
    const manualPayload = {
      moduleId,
      score: result.score,
      totalQuestions: result.totalQuestions,
      percentage: result.percentage,
      passed: result.passed ?? (result.percentage >= 70),
      timeSpentSeconds: (15 * 60) - Math.max(0, timeLeftSeconds),
      timeTakenSeconds: (15 * 60) - Math.max(0, timeLeftSeconds),
      categoryBreakdownJson: JSON.stringify(result.categoryStats || result.breakdown || {}),
      answersJson: JSON.stringify(userAnswers || {})
    };
    practicalApi.submitMockTest(manualPayload).catch((err) => {
      console.error('Failed to submit mock test:', err);
    });
  };

  // Retake Mock Test
  const handleRetakeTest = () => {
    setUserAnswers({});
    setFlaggedQuestions({});
    setCurrentQuestionIndex(0);
    setTimeLeftSeconds(15 * 60);
    setEvaluationResult(null);
    setExpandedReviews({});
    setReviewFilter('all');
    setTestState('in-progress');
  };

  const currentQ = questions[currentQuestionIndex] || questions[0];
  const isTimeCritical = timeLeftSeconds < 120; // under 2 minutes
  const answeredCount = Object.keys(userAnswers).length;

  return (
    <div className="mock-test-layout theme-transition">
      
      {/* =====================================================================
          SCENARIO A: ACTIVE TEST IN PROGRESS
          ===================================================================== */}
      {testState === 'in-progress' && (
        <div className="test-active-container">
          
          {/* 1. Test Control Bar: Timer, Progress & Submit */}
          <header className="test-control-bar theme-transition">
            <div className="test-info-group">
              <span className="test-module-badge">{currentModule.name} Mock Test</span>
              <span className="test-answered-meta">
                {answeredCount} of {questions.length} Answered
              </span>
            </div>

            {/* Countdown Timer */}
            <div className={`test-timer-badge ${isTimeCritical ? 'time-critical animate-pulse' : ''}`}>
              <Clock size={16} />
              <span className="timer-digits">{formatTime(timeLeftSeconds)}</span>
              {isTimeCritical && <span className="time-warning-label">Ending soon!</span>}
            </div>

            {/* Submit Button */}
            <button 
              className="test-submit-btn theme-transition"
              onClick={handleManualSubmit}
            >
              <span>Submit Test</span>
              <FileCheck2 size={15} />
            </button>
          </header>

          {/* 2. Main Question Split Layout: Palette + Active Question */}
          <div className="test-split-body">
            
            {/* Question Palette Sidebar */}
            <aside className="question-palette-panel theme-transition">
              <h3 className="palette-title">Question Palette</h3>
              <p className="palette-desc">Click any number to jump directly to that question:</p>

              <div className="palette-grid">
                {questions.map((q, qIdx) => {
                  const isAnswered = userAnswers[q.id] !== undefined;
                  const isCurrent = currentQuestionIndex === qIdx;
                  const isFlagged = !!flaggedQuestions[q.id];

                  let statusClass = '';
                  if (isCurrent) statusClass = 'current';
                  else if (isFlagged) statusClass = 'flagged';
                  else if (isAnswered) statusClass = 'answered';

                  return (
                    <button
                      key={q.id}
                      className={`palette-num-btn ${statusClass} theme-transition`}
                      onClick={() => setCurrentQuestionIndex(qIdx)}
                      title={`Question ${qIdx + 1}${isFlagged ? ' (Marked for review)' : ''}`}
                    >
                      <span>{qIdx + 1}</span>
                      {isFlagged && <Flag size={9} className="palette-flag-icon" />}
                    </button>
                  );
                })}
              </div>

              {/* Palette Legend */}
              <div className="palette-legend">
                <div className="legend-item">
                  <span className="legend-box answered" />
                  <span>Answered ({answeredCount})</span>
                </div>
                <div className="legend-item">
                  <span className="legend-box current" />
                  <span>Current</span>
                </div>
                <div className="legend-item">
                  <span className="legend-box flagged" />
                  <span>Flagged ({Object.values(flaggedQuestions).filter(Boolean).length})</span>
                </div>
                <div className="legend-item">
                  <span className="legend-box unanswered" />
                  <span>Unanswered ({questions.length - answeredCount})</span>
                </div>
              </div>
            </aside>

            {/* Active Question Canvas */}
            <main className="active-question-canvas theme-transition">
              
              {/* Question Header */}
              <div className="question-canvas-header">
                <div className="question-meta-group">
                  <span className="question-category-tag">{currentQ.category}</span>
                  <span className="question-num-indicator">
                    Question {currentQuestionIndex + 1} of {questions.length}
                  </span>
                </div>

                <button 
                  className={`flag-question-btn ${flaggedQuestions[currentQ.id] ? 'is-flagged' : ''} theme-transition`}
                  onClick={() => handleToggleFlag(currentQ.id)}
                  title="Flag question to review before submitting"
                >
                  <Flag size={14} />
                  <span>{flaggedQuestions[currentQ.id] ? 'Flagged for review' : 'Mark for review'}</span>
                </button>
              </div>

              {/* Question Prompt */}
              <div className="question-prompt-box">
                <h2 className="question-prompt-text">{currentQ.question}</h2>
              </div>

              {/* Multiple Choice Options */}
              <div className="question-options-list">
                {currentQ.options.map((optionText, optIdx) => {
                  const isSelected = userAnswers[currentQ.id] === optIdx;
                  const optionLetters = ['A', 'B', 'C', 'D'];

                  return (
                    <button
                      key={optIdx}
                      className={`question-option-item ${isSelected ? 'selected' : ''} theme-transition`}
                      onClick={() => handleSelectOption(currentQ.id, optIdx)}
                    >
                      <div className="option-letter-badge theme-transition">
                        {optionLetters[optIdx]}
                      </div>
                      <span className="option-text-label">{optionText}</span>
                    </button>
                  );
                })}
              </div>

              {/* Question Navigation Controls */}
              <div className="question-nav-footer">
                <button 
                  disabled={currentQuestionIndex === 0}
                  className="question-nav-btn prev-btn theme-transition"
                  onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                >
                  <ArrowLeft size={15} />
                  <span>Previous</span>
                </button>

                {currentQuestionIndex < questions.length - 1 ? (
                  <button 
                    className="question-nav-btn next-btn theme-transition"
                    onClick={() => setCurrentQuestionIndex(prev => Math.min(questions.length - 1, prev + 1))}
                  >
                    <span>Next Question</span>
                    <ArrowRight size={15} />
                  </button>
                ) : (
                  <button 
                    className="question-nav-btn submit-trigger-btn theme-transition"
                    onClick={handleManualSubmit}
                  >
                    <span>Finish & Submit Test</span>
                    <CheckCircle2 size={15} />
                  </button>
                )}
              </div>

            </main>

          </div>

        </div>
      )}

      {/* =====================================================================
          SCENARIO B: SUBMITTED TEST — SCORE & WEAK-AREA DIAGNOSTIC REPORT
          ===================================================================== */}
      {testState === 'submitted' && evaluationResult && (
        <div className="test-results-container animate-fadeIn">
          
          {/* 1. Score Summary Hero Card */}
          <div className="score-hero-card theme-transition">
            <div className="score-badge-circle">
              <Award size={36} className="score-award-icon" />
              <div className="score-pct-value">{evaluationResult.percentage}%</div>
            </div>

            <div className="score-text-col">
              <div className="score-status-row">
                <span className={`pass-badge ${evaluationResult.passed ? 'passed' : 'failed'}`}>
                  {evaluationResult.passed ? 'PASS • Benchmark Exceeded' : 'NEEDS PRACTICE • Below 70%'}
                </span>
                <span className="score-module-title">{currentModule.name} Assessment</span>
              </div>

              <h2 className="score-headline">
                {evaluationResult.passed 
                  ? `Outstanding! You scored ${evaluationResult.score} out of ${evaluationResult.totalQuestions} questions.`
                  : `Good effort! You answered ${evaluationResult.score} of ${evaluationResult.totalQuestions} correctly.`}
              </h2>
              <p className="score-subtext">
                Review your personalized diagnostic report below. We analyzed your responses by topic to pinpoint your strongest areas and identify targeted practice missions.
              </p>

              <div className="score-actions-row">
                <button 
                  className="score-action-btn retake-btn theme-transition"
                  onClick={handleRetakeTest}
                >
                  <RotateCw size={14} />
                  <span>Retake Mock Test</span>
                </button>

                <button 
                  className="score-action-btn practice-btn theme-transition"
                  onClick={onSwitchToPractice}
                >
                  <Terminal size={14} />
                  <span>Practice in Terminal</span>
                </button>
              </div>
            </div>
          </div>

          {/* 2. Weak-Area Diagnostic Analysis Card */}
          <section className="diagnostic-analysis-section theme-transition">
            <div className="diagnostic-header-row">
              <BarChart3 size={20} className="diagnostic-icon" />
              <div>
                <h3 className="diagnostic-heading">Sub-Topic Performance & Weak-Area Diagnostic</h3>
                <p className="diagnostic-subheading">
                  Automated category analysis to guide your revision before SDE screening rounds.
                </p>
              </div>
            </div>

            <div className="diagnostic-categories-grid">
              {Object.entries(evaluationResult.categoryStats).map(([category, stat]) => {
                const pct = Math.round((stat.correct / stat.total) * 100);
                const isWeak = pct < 70;

                return (
                  <div key={category} className={`category-stat-card ${isWeak ? 'is-weak' : 'is-strong'} theme-transition`}>
                    <div className="cat-top-row">
                      <span className="cat-title">{category}</span>
                      <span className={`cat-status-pill ${isWeak ? 'weak' : 'mastered'}`}>
                        {isWeak ? 'Needs Review' : 'Mastered'}
                      </span>
                    </div>

                    <div className="cat-metric-row">
                      <strong>{stat.correct}/{stat.total} Correct</strong>
                      <span>{pct}%</span>
                    </div>

                    <div className="cat-progress-track">
                      <div 
                        className={`cat-progress-fill ${isWeak ? 'fill-amber' : 'fill-green'}`} 
                        style={{ width: `${pct}%` }} 
                      />
                    </div>

                    {isWeak && (
                      <div className="cat-advice-box">
                        <AlertTriangle size={12} className="advice-warn-icon" />
                        <span>Recommended: Replay related practice terminal missions to build command muscle memory.</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* 3. Detailed Question-by-Question Review Vault */}
          <section className="question-review-section theme-transition">
            <div className="review-section-header-bar">
              <div>
                <h3 className="review-section-heading">Detailed Question Review & Model Solutions</h3>
                <p className="review-section-desc">
                  Every question includes the model solution, your selection, and the engineering rationale explaining why the answer is correct:
                </p>
              </div>

              {/* Review Filter Tabs & Expand All Controls */}
              <div className="review-controls-row">
                <div className="review-filter-tabs">
                  <button 
                    className={`filter-tab-btn ${reviewFilter === 'all' ? 'active' : ''} theme-transition`}
                    onClick={() => setReviewFilter('all')}
                  >
                    <span>All ({evaluationResult.questionReviews.length})</span>
                  </button>

                  <button 
                    className={`filter-tab-btn filter-incorrect ${reviewFilter === 'incorrect' ? 'active' : ''} theme-transition`}
                    onClick={() => setReviewFilter('incorrect')}
                  >
                    <span>Incorrect ({evaluationResult.questionReviews.filter(r => !r.isCorrect).length})</span>
                  </button>

                  <button 
                    className={`filter-tab-btn filter-correct ${reviewFilter === 'correct' ? 'active' : ''} theme-transition`}
                    onClick={() => setReviewFilter('correct')}
                  >
                    <span>Correct ({evaluationResult.score})</span>
                  </button>
                </div>

                <button 
                  className="toggle-expand-all-btn theme-transition"
                  onClick={() => {
                    const isAnyCollapsed = evaluationResult.questionReviews.some(r => !expandedReviews[r.id]);
                    const nextState = {};
                    evaluationResult.questionReviews.forEach(r => {
                      nextState[r.id] = isAnyCollapsed;
                    });
                    setExpandedReviews(nextState);
                  }}
                  title="Expand or collapse all question explanations"
                >
                  <Layers size={13} />
                  <span>
                    {evaluationResult.questionReviews.some(r => !expandedReviews[r.id]) 
                      ? 'Expand All' 
                      : 'Collapse All'}
                  </span>
                </button>
              </div>
            </div>

            <div className="question-reviews-list">
              {evaluationResult.questionReviews
                .filter(review => {
                  if (reviewFilter === 'incorrect') return !review.isCorrect;
                  if (reviewFilter === 'correct') return review.isCorrect;
                  return true;
                })
                .map((review) => {
                  const isExpanded = !!expandedReviews[review.id];
                  const isUnanswered = review.selectedOption === undefined || review.selectedOption === null;

                  return (
                    <div key={review.id} className={`review-accordion-item ${review.isCorrect ? 'correct' : 'incorrect'} theme-transition`}>
                      <button 
                        className="review-header-bar theme-transition"
                        onClick={() => setExpandedReviews(prev => ({ ...prev, [review.id]: !prev[review.id] }))}
                      >
                        <div className="review-status-indicator">
                          {review.isCorrect ? (
                            <CheckCircle2 size={20} className="review-icon-correct" />
                          ) : (
                            <XCircle size={20} className="review-icon-wrong" />
                          )}
                          <span className="review-q-number">Q0{review.questionNumber}</span>
                        </div>

                        <div className="review-q-title-col">
                          <span className="review-q-text">{review.question}</span>
                          <div className="review-meta-row">
                            <span className="review-category-badge">{review.category}</span>
                            <span className={`review-result-badge ${review.isCorrect ? 'correct' : 'incorrect'}`}>
                              {review.isCorrect ? '✔ Correct (+1)' : isUnanswered ? '⚠ Unanswered (0/1)' : '✘ Incorrect (0/1)'}
                            </span>
                          </div>
                        </div>

                        <ChevronDown size={18} className={`review-chevron ${isExpanded ? 'rotated' : ''}`} />
                      </button>

                      {isExpanded && (
                        <div className="review-expanded-panel theme-transition animate-fadeIn">
                          
                          {/* Options Breakdown with Clear Visual Indicators */}
                          <div className="review-options-comparison">
                            {review.options.map((opt, oIdx) => {
                              const isUserSelected = review.selectedOption === oIdx;
                              const isCorrectOpt = review.correctIndex === oIdx;

                              let optClass = '';
                              if (isCorrectOpt) optClass = 'opt-correct-answer';
                              if (isUserSelected && !isCorrectOpt) optClass = 'opt-user-wrong';

                              return (
                                <div key={oIdx} className={`review-option-pill ${optClass} theme-transition`}>
                                  <span className="review-option-letter">
                                    {['A', 'B', 'C', 'D'][oIdx]}:
                                  </span>
                                  <span className="review-option-desc">{opt}</span>
                                  
                                  {isCorrectOpt && !isUserSelected && (
                                    <span className="answer-tag-pill">
                                      <Check size={11} /> Correct Solution
                                    </span>
                                  )}

                                  {isCorrectOpt && isUserSelected && (
                                    <span className="answer-tag-pill user-correct-pill">
                                      <Check size={11} /> Your Choice (Correct!)
                                    </span>
                                  )}

                                  {isUserSelected && !isCorrectOpt && (
                                    <span className="user-tag-pill">
                                      <X size={11} /> Your Choice (Incorrect)
                                    </span>
                                  )}
                                </div>
                              );
                            })}
                          </div>

                          {/* Dedicated Model Solution & Pedagogical Explanation Card */}
                          <div className="review-explanation-box theme-transition">
                            <div className="explanation-header-row">
                              <Sparkles size={15} className="explanation-sparkle" />
                              <strong className="explanation-title">
                                Model Answer: Option {['A', 'B', 'C', 'D'][review.correctIndex]} — "{review.options[review.correctIndex]}"
                              </strong>
                            </div>
                            <div className="explanation-body-wrapper">
                              <span className="explanation-label">Engineering Explanation & Rationale:</span>
                              <p className="explanation-body">{review.explanation}</p>
                            </div>
                          </div>

                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          </section>

        </div>
      )}

    </div>
  );
}
