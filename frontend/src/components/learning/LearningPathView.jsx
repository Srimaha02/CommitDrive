import React, { useState, useEffect } from 'react';
import { 
  Cpu, 
  Database, 
  Network, 
  Search, 
  CheckCircle2, 
  Circle, 
  Clock, 
  Sparkles, 
  RotateCw, 
  ChevronRight, 
  ChevronDown, 
  ChevronLeft,
  BookOpen, 
  FileQuestion, 
  Code2, 
  Layers, 
  Lightbulb, 
  Briefcase, 
  Copy, 
  Check, 
  HelpCircle,
  Award,
  ArrowRight,
  ArrowLeft,
  FileCheck2,
  AlertCircle,
  X,
  Zap,
  Trophy
} from 'lucide-react';
import { 
  subjects, 
  curriculumData, 
  getSubjectTopics, 
  calculateSubjectProgress 
} from '../../data/learningCurriculum';
import { learningApi } from '../../services/api';
import './LearningPathView.css';

export default function LearningPathView({ onNavigate }) {
  // State: Active Subject ('os' | 'dbms' | 'cn')
  const [activeSubjectId, setActiveSubjectId] = useState(() => {
    try {
      return localStorage.getItem('commitdrive_active_subject') || 'os';
    } catch {
      return 'os';
    }
  });

  // State: Active Topic ID
  const [activeTopicId, setActiveTopicId] = useState(() => {
    try {
      return localStorage.getItem('commitdrive_active_topic') || 'os-1';
    } catch {
      return 'os-1';
    }
  });

  // State: Completed Topics Set
  const [completedTopicIds, setCompletedTopicIds] = useState(() => {
    try {
      const saved = localStorage.getItem('commitdrive_completed_topics');
      if (saved) return JSON.parse(saved);
      return [];
    } catch {
      return [];
    }
  });

  // State: Reader Tab ('concept' | 'qa' | 'flashcards')
  const [activeReaderTab, setActiveReaderTab] = useState('concept');

  // State: Topic Search Query
  const [searchQuery, setSearchQuery] = useState('');

  // State: Expanded Interview Q&As
  const [expandedQAs, setExpandedQAs] = useState({});

  // State: Active Flashcard Index for current topic
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [cardFeedback, setCardFeedback] = useState({}); // { [cardId]: 'gotit' | 'review' }

  // State: Code snippet copied toast
  const [isCopied, setIsCopied] = useState(false);

  // State: Celebration Modal for completed topic
  const [celebrationTopic, setCelebrationTopic] = useState(null);
  const [celebrationExpandedQAs, setCelebrationExpandedQAs] = useState({});

  // Close celebration modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && celebrationTopic) {
        setCelebrationTopic(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [celebrationTopic]);

  // Sync active subject & topic to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('commitdrive_active_subject', activeSubjectId);
      localStorage.setItem('commitdrive_active_topic', activeTopicId);
    } catch {
      // storage unavailable
    }
  }, [activeSubjectId, activeTopicId]);

  // Load topics from backend / fallback on mount
  useEffect(() => {
    let isMounted = true;
    learningApi.getTopics().then(res => {
      if (isMounted && res && res.data && Array.isArray(res.data)) {
        const ids = res.data
          .filter(item => typeof item === 'string' || item.completed)
          .map(item => typeof item === 'string' ? item : item.topicId);
        setCompletedTopicIds(ids);
      }
    }).catch(() => {});
    return () => { isMounted = false; };
  }, []);

  // Sync completed topics to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('commitdrive_completed_topics', JSON.stringify(completedTopicIds));
    } catch {
      // storage unavailable
    }
  }, [completedTopicIds]);

  // Reset flashcard state when changing topic
  useEffect(() => {
    setActiveCardIndex(0);
    setIsCardFlipped(false);
  }, [activeTopicId]);

  // Current Subject and Topics
  const activeSubject = subjects.find(s => s.id === activeSubjectId) || subjects[0];
  const currentTopics = getSubjectTopics(activeSubjectId);

  // Filtered topics based on search
  const filteredTopics = currentTopics.filter(topic => 
    topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    topic.what.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Active Topic
  const activeTopic = currentTopics.find(t => t.id === activeTopicId) || currentTopics[0] || {};

  // Subject icon component helper
  const getSubjectIcon = (id, size = 18) => {
    if (id === 'os') return <Cpu size={size} />;
    if (id === 'dbms') return <Database size={size} />;
    return <Network size={size} />;
  };

  // Toggle topic completion
  const handleToggleCompletion = (topicId) => {
    const isCompleted = !completedTopicIds.includes(topicId);
    setCompletedTopicIds(prev => {
      if (prev.includes(topicId)) {
        return prev.filter(id => id !== topicId);
      } else {
        return [...prev, topicId];
      }
    });
    learningApi.toggleTopic(activeSubjectId, topicId, isCompleted).catch(() => {});

    // When student completes a topic, immediately pop up celebration showing its 5 interview Q&As
    if (isCompleted) {
      const topicObj = currentTopics.find(t => t.id === topicId) || activeTopic;
      if (topicObj) {
        setCelebrationTopic(topicObj);
        // Expand the first interview question by default for immediate preview
        const firstQAId = topicObj.interviewQuestions?.[0]?.id;
        setCelebrationExpandedQAs(firstQAId ? { [firstQAId]: true } : {});
      }
    }
  };

  // Toggle Celebration Q&A Accordion
  const handleToggleCelebrationQA = (qaId) => {
    setCelebrationExpandedQAs(prev => ({
      ...prev,
      [qaId]: !prev[qaId]
    }));
  };

  // Toggle Interview Q&A Accordion
  const handleToggleQA = (qaId) => {
    setExpandedQAs(prev => ({
      ...prev,
      [qaId]: !prev[qaId]
    }));
  };

  // Copy Code Example
  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Handle Flashcard Feedback
  const handleCardFeedback = (cardId, status) => {
    setCardFeedback(prev => ({
      ...prev,
      [cardId]: status
    }));
    learningApi.saveFlashcardReview(activeSubjectId, activeTopicId, cardId, status).catch(() => {});
  };

  // Navigate to Next / Previous Topic
  const currentIndex = currentTopics.findIndex(t => t.id === activeTopicId);
  const prevTopic = currentIndex > 0 ? currentTopics[currentIndex - 1] : null;
  const nextTopic = currentIndex < currentTopics.length - 1 ? currentTopics[currentIndex + 1] : null;

  // Flashcards for active topic
  const flashcards = activeTopic.flashcards || [];
  const currentCard = flashcards[activeCardIndex] || {};

  return (
    <div className="learning-curriculum-page theme-transition">
      <div className="content-wrapper learning-curriculum-container">

        {/* =================================================================
            1. Subject Navigation Bar
            ================================================================= */}
        <header className="subject-nav-header">
          <div className="subject-nav-left">
            <span className="learning-eyebrow">Study Corner • Theory path</span>
            <h1 className="subject-nav-title">Core Computer Science Curriculum</h1>
          </div>

          {/* 3 Subject Selector Tabs */}
          <div className="subject-tabs-track theme-transition" role="tablist">
            {subjects.map(sub => {
              const isActive = activeSubjectId === sub.id;
              const progressPct = calculateSubjectProgress(sub.id, completedTopicIds);
              const completedCount = getSubjectTopics(sub.id).filter(t => completedTopicIds.includes(t.id)).length;

              return (
                <button
                  key={sub.id}
                  role="tab"
                  aria-selected={isActive}
                  className={`subject-tab-btn ${isActive ? 'active' : ''} theme-transition`}
                  onClick={() => {
                    setActiveSubjectId(sub.id);
                    const firstTopicOfSub = getSubjectTopics(sub.id)[0];
                    if (firstTopicOfSub) setActiveTopicId(firstTopicOfSub.id);
                  }}
                >
                  <div className="tab-icon-box theme-transition">
                    {getSubjectIcon(sub.id, 16)}
                  </div>
                  <div className="tab-text-col">
                    <span className="tab-subject-name">{sub.name}</span>
                    <span className="tab-progress-meta">
                      {completedCount}/{sub.totalTopics} mastered ({progressPct}%)
                    </span>
                  </div>
                  {isActive && <div className="tab-active-indicator" />}
                </button>
              );
            })}
          </div>
        </header>

        {/* =================================================================
            2. Main Content Split Layout: Sidebar + Topic Reader
            ================================================================= */}
        <div className="curriculum-split-layout">
          
          {/* -------------------------------------------------------------
              A. Curriculum Sidebar Tree
              ------------------------------------------------------------- */}
          <aside className="curriculum-sidebar theme-transition">
            <div className="sidebar-top-group">
              <div className="sidebar-subject-badge">
                {getSubjectIcon(activeSubject.id, 14)}
                <span>{activeSubject.name} Curriculum</span>
              </div>
              <span className="sidebar-topic-count">10 Topics Ordered Basic to Advanced</span>

              {/* Quick Search */}
              <div className="sidebar-search-box">
                <Search size={14} className="search-icon" />
                <input 
                  type="text" 
                  placeholder="Filter topics or concepts..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="sidebar-search-input"
                />
              </div>
            </div>

            {/* Topic List */}
            <div className="sidebar-topics-list">
              {filteredTopics.map((topic, idx) => {
                const isSelected = activeTopicId === topic.id;
                const isCompleted = completedTopicIds.includes(topic.id);

                return (
                  <button
                    key={topic.id}
                    className={`topic-list-item ${isSelected ? 'selected' : ''} ${isCompleted ? 'completed' : ''} theme-transition`}
                    onClick={() => setActiveTopicId(topic.id)}
                  >
                    <div className="topic-order-badge theme-transition">
                      {isCompleted ? (
                        <CheckCircle2 size={15} className="completed-check-icon" />
                      ) : (
                        <span>{topic.order < 10 ? `0${topic.order}` : topic.order}</span>
                      )}
                    </div>

                    <div className="topic-info-col">
                      <p className="topic-item-title">{topic.title}</p>
                      <div className="topic-meta-row">
                        <span className={`diff-pill ${topic.difficulty.toLowerCase()}`}>
                          {topic.difficulty}
                        </span>
                        <span className="read-time-label">
                          <Clock size={11} />
                          <span>{topic.readTime}</span>
                        </span>
                      </div>
                    </div>

                    <ChevronRight size={14} className="topic-arrow" />
                  </button>
                );
              })}

              {filteredTopics.length === 0 && (
                <div className="no-topics-found">
                  <p>No topics match "{searchQuery}"</p>
                  <button onClick={() => setSearchQuery('')} className="clear-search-btn">
                    Clear search
                  </button>
                </div>
              )}
            </div>

            {/* Sidebar Footer Stats */}
            <div className="sidebar-footer-card theme-transition">
              <div className="sidebar-footer-row">
                <span>{activeSubject.shortName} Mastery</span>
                <strong>{calculateSubjectProgress(activeSubject.id, completedTopicIds)}%</strong>
              </div>
              <div className="sidebar-progress-track">
                <div 
                  className="sidebar-progress-fill" 
                  style={{ width: `${calculateSubjectProgress(activeSubject.id, completedTopicIds)}%` }} 
                />
              </div>
            </div>
          </aside>

          {/* -------------------------------------------------------------
              B. Active Topic Reader Canvas
              ------------------------------------------------------------- */}
          <main className="topic-reader-canvas theme-transition">
            
            {/* Topic Reader Header */}
            <div className="topic-reader-header theme-transition">
              <div className="reader-breadcrumb">
                <span>{activeSubject.name}</span>
                <ChevronRight size={12} />
                <span>Topic {activeTopic.order < 10 ? `0${activeTopic.order}` : activeTopic.order}</span>
              </div>

              <div className="reader-title-row">
                <h2 className="reader-topic-title">{activeTopic.title}</h2>

                {/* Mark as Mastered Toggle Button */}
                <button 
                  className={`mastered-toggle-btn ${completedTopicIds.includes(activeTopic.id) ? 'is-mastered' : ''} theme-transition`}
                  onClick={() => handleToggleCompletion(activeTopic.id)}
                  title="Toggle mastery status"
                >
                  {completedTopicIds.includes(activeTopic.id) ? (
                    <>
                      <CheckCircle2 size={16} />
                      <span>Mastered</span>
                    </>
                  ) : (
                    <>
                      <Circle size={16} />
                      <span>Mark as mastered</span>
                    </>
                  )}
                </button>
              </div>

              {/* Topic Metadata Badges */}
              <div className="reader-meta-row">
                <span className={`diff-pill ${activeTopic.difficulty ? activeTopic.difficulty.toLowerCase() : 'intermediate'}`}>
                  {activeTopic.difficulty}
                </span>
                <span className="read-time-pill">
                  <Clock size={13} />
                  <span>{activeTopic.readTime}</span>
                </span>
                <span className="draft-review-badge" title="Subject to personal review and fact-checking before production release">
                  <AlertCircle size={13} />
                  <span>{activeTopic.draftStatus || 'Draft v1.0 — Review candidate'}</span>
                </span>
              </div>

              {/* Reader Tabs (Concept, Q&A, Flashcards) */}
              <div className="reader-tabs-bar theme-transition">
                <button 
                  className={`reader-tab-btn ${activeReaderTab === 'concept' ? 'active' : ''} theme-transition`}
                  onClick={() => setActiveReaderTab('concept')}
                >
                  <BookOpen size={15} />
                  <span>Concept deep-dive</span>
                </button>

                <button 
                  className={`reader-tab-btn ${activeReaderTab === 'qa' ? 'active' : ''} theme-transition`}
                  onClick={() => setActiveReaderTab('qa')}
                >
                  <FileQuestion size={15} />
                  <span>Interview Q&A vault ({activeTopic.interviewQuestions?.length || 0})</span>
                </button>

                <button 
                  className={`reader-tab-btn ${activeReaderTab === 'flashcards' ? 'active' : ''} theme-transition`}
                  onClick={() => setActiveReaderTab('flashcards')}
                >
                  <RotateCw size={15} />
                  <span>Flashcard deck ({activeTopic.flashcards?.length || 0})</span>
                </button>
              </div>
            </div>

            {/* =============================================================
                Tab 1: Concept Deep-Dive (What, Why, Use Case, Example)
                ============================================================= */}
            {activeReaderTab === 'concept' && (
              <div className="reader-content-body animate-fadeIn">
                
                {/* 1. What */}
                <section className="concept-card theme-transition">
                  <div className="concept-card-header">
                    <div className="concept-icon-pill icon-what">
                      <Sparkles size={15} />
                    </div>
                    <div>
                      <span className="concept-label">01 • Formal definition</span>
                      <h3 className="concept-heading">What is it?</h3>
                    </div>
                  </div>

                  {/* Real-world analogy callout for beginner/intermediate onboarding */}
                  {activeTopic.analogy && (
                    <div className="analogy-callout-box theme-transition">
                      <div className="analogy-callout-header">
                        <Lightbulb size={16} className="analogy-icon" />
                        <span className="analogy-badge-label">Real-world analogy</span>
                      </div>
                      <p className="analogy-body-text">{activeTopic.analogy}</p>
                    </div>
                  )}

                  {/* Multi-paragraph What */}
                  <div className="concept-body-paragraphs">
                    {activeTopic.what?.split('\n\n').map((paragraph, pIdx) => (
                      <p key={pIdx} className="concept-body-text">{paragraph}</p>
                    ))}
                  </div>
                </section>

                {/* 2. Why */}
                <section className="concept-card theme-transition">
                  <div className="concept-card-header">
                    <div className="concept-icon-pill icon-why">
                      <Lightbulb size={15} />
                    </div>
                    <div>
                      <span className="concept-label">02 • Engineering rationale</span>
                      <h3 className="concept-heading">Why was it created?</h3>
                    </div>
                  </div>
                  <div className="concept-body-paragraphs">
                    {activeTopic.why?.split('\n\n').map((paragraph, pIdx) => (
                      <p key={pIdx} className="concept-body-text">{paragraph}</p>
                    ))}
                  </div>
                </section>

                {/* 3. Use Case */}
                <section className="concept-card theme-transition">
                  <div className="concept-card-header">
                    <div className="concept-icon-pill icon-usecase">
                      <Briefcase size={15} />
                    </div>
                    <div>
                      <span className="concept-label">03 • Scale & industry implementation</span>
                      <h3 className="concept-heading">Real-world use case</h3>
                    </div>
                  </div>
                  <div className="concept-body-paragraphs">
                    {activeTopic.useCase?.split('\n\n').map((paragraph, pIdx) => (
                      <p key={pIdx} className="concept-body-text">{paragraph}</p>
                    ))}
                  </div>
                </section>

                {/* 4. Example Code / Architecture Diagram */}
                <section className="concept-card code-concept-card theme-transition">
                  <div className="concept-card-header">
                    <div className="concept-icon-pill icon-example">
                      {activeSubjectId === 'cn' ? <Network size={16} /> : <Code2 size={16} />}
                    </div>
                    <div className="code-header-info">
                      <span className="concept-label">
                        {activeSubjectId === 'cn' ? '04 • Protocol architecture & sequence flow' : '04 • Concrete implementation'}
                      </span>
                      <h3 className="concept-heading">
                        {activeSubjectId === 'cn' ? 'Protocol packet structure & sequence flow' : 'Technical walkthrough & code example'}
                      </h3>
                    </div>
                    <button 
                      className="copy-code-btn theme-transition"
                      onClick={() => handleCopyCode(activeTopic.example)}
                    >
                      {isCopied ? (
                        <>
                          <Check size={13} className="copy-check" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy size={13} />
                          <span>{activeSubjectId === 'cn' ? 'Copy diagram' : 'Copy'}</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="code-block-wrapper">
                    <pre className="code-pre">
                      <code>{activeTopic.example}</code>
                    </pre>
                  </div>

                  {/* Step-by-step ordered plain-language walkthrough */}
                  {activeTopic.exampleExplanation && activeTopic.exampleExplanation.length > 0 && (
                    <div className="example-walkthrough-container theme-transition">
                      <div className="walkthrough-header">
                        <FileCheck2 size={16} className="walkthrough-header-icon" />
                        <h4 className="walkthrough-heading">Step-by-step walkthrough</h4>
                      </div>
                      <ol className="walkthrough-steps-list">
                        {activeTopic.exampleExplanation.map((step, sIdx) => (
                          <li key={sIdx} className="walkthrough-step-item">
                            <span className="walkthrough-step-badge">Step {sIdx + 1}</span>
                            <span className="walkthrough-step-text">{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}
                </section>

              </div>
            )}

            {/* =============================================================
                Tab 2: Interview Q&A Vault
                ============================================================= */}
            {activeReaderTab === 'qa' && (
              <div className="reader-content-body qa-body animate-fadeIn">
                <div className="qa-intro-banner theme-transition">
                  <div className="qa-banner-icon">
                    <FileQuestion size={20} />
                  </div>
                  <div>
                    <h4 className="qa-banner-title">High-Yield Technical Screening Questions</h4>
                    <p className="qa-banner-desc">
                      Curated questions asked in technical interviews at top engineering product companies. Click to inspect the model answer and evaluation traps.
                    </p>
                  </div>
                </div>

                <div className="qa-accordion-list">
                  {activeTopic.interviewQuestions?.map((qa, index) => {
                    const isExpanded = !!expandedQAs[qa.id];

                    return (
                      <div key={qa.id} className={`qa-accordion-item ${isExpanded ? 'expanded' : ''} theme-transition`}>
                        <button 
                          className="qa-question-bar theme-transition"
                          onClick={() => handleToggleQA(qa.id)}
                          aria-expanded={isExpanded}
                        >
                          <div className="qa-q-num">Q{index + 1}</div>
                          <div className="qa-q-title-col">
                            <span className="qa-question-text">{qa.question}</span>
                            <div className="qa-tags-row">
                              {qa.companyTags?.map(tag => (
                                <span key={tag} className="qa-company-tag">{tag}</span>
                              ))}
                              <span className="qa-freq-tag">{qa.frequency} frequency</span>
                            </div>
                          </div>
                          <ChevronDown size={18} className={`qa-chevron ${isExpanded ? 'rotated' : ''}`} />
                        </button>

                        {isExpanded && (
                          <div className="qa-answer-panel theme-transition">
                            <div className="qa-model-answer-badge">Model answer for technical rounds:</div>
                            <div className="qa-answer-text">
                              {qa.answer.split('\n').map((line, lIdx) => (
                                <p key={lIdx}>{line}</p>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* =============================================================
                Tab 3: Interactive 3D Flashcard Deck
                ============================================================= */}
            {activeReaderTab === 'flashcards' && (
              <div className="reader-content-body flashcards-body animate-fadeIn">
                <div className="flashcard-deck-container theme-transition">
                  
                  {/* Deck Header & Progress */}
                  <div className="deck-header-row">
                    <div>
                      <span className="deck-eyebrow">Active recall self-test</span>
                      <h4 className="deck-title">Topic Flashcard Deck</h4>
                    </div>
                    <div className="deck-counter-badge">
                      Card {activeCardIndex + 1} of {flashcards.length}
                    </div>
                  </div>

                  {/* 3D Flip Card */}
                  <div 
                    className={`flashcard-3d-deck-wrapper ${isCardFlipped ? 'flipped' : ''}`}
                    onClick={() => setIsCardFlipped(!isCardFlipped)}
                  >
                    {/* Front: Prompt / Question */}
                    <div className="deck-card-face deck-card-front theme-transition">
                      <div className="deck-face-top">
                        <span className="deck-face-tag prompt-tag">Prompt • Click to flip</span>
                        <RotateCw size={15} className="deck-flip-icon" />
                      </div>
                      <div className="deck-face-content">
                        <p className="deck-question-text">"{currentCard.front}"</p>
                      </div>
                      <div className="deck-face-bottom">
                        <span>💡 Tap card anywhere to reveal model answer</span>
                      </div>
                    </div>

                    {/* Back: Answer & Key Takeaway */}
                    <div className="deck-card-face deck-card-back theme-transition">
                      <div className="deck-face-top">
                        <span className="deck-face-tag answer-tag">Model answer</span>
                        <RotateCw size={15} className="deck-flip-icon" />
                      </div>
                      <div className="deck-face-content">
                        <p className="deck-answer-text">{currentCard.back}</p>
                        {currentCard.keyTakeaway && (
                          <div className="deck-takeaway-box">
                            <strong>Key takeaway:</strong> {currentCard.keyTakeaway}
                          </div>
                        )}
                      </div>
                      <div className="deck-face-bottom deck-self-eval-row" onClick={(e) => e.stopPropagation()}>
                        <span className="self-eval-prompt">How was your recall?</span>
                        <div className="self-eval-buttons">
                          <button 
                            className={`eval-btn review-again ${cardFeedback[currentCard.id] === 'review' ? 'active' : ''}`}
                            onClick={() => handleCardFeedback(currentCard.id, 'review')}
                          >
                            Review again 🔄
                          </button>
                          <button 
                            className={`eval-btn got-it ${cardFeedback[currentCard.id] === 'gotit' ? 'active' : ''}`}
                            onClick={() => handleCardFeedback(currentCard.id, 'gotit')}
                          >
                            Got it! ✓
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Deck Carousel Navigation Controls */}
                  <div className="deck-controls-row">
                    <button 
                      className="deck-nav-btn prev-btn theme-transition"
                      disabled={activeCardIndex === 0}
                      onClick={() => {
                        setIsCardFlipped(false);
                        setActiveCardIndex(prev => Math.max(0, prev - 1));
                      }}
                    >
                      <ChevronLeft size={16} />
                      <span>Previous card</span>
                    </button>

                    {/* Dots indicator */}
                    <div className="deck-dots-indicator">
                      {flashcards.map((_, dotIdx) => (
                        <span 
                          key={dotIdx} 
                          className={`deck-dot ${activeCardIndex === dotIdx ? 'active' : ''}`}
                          onClick={() => {
                            setIsCardFlipped(false);
                            setActiveCardIndex(dotIdx);
                          }}
                        />
                      ))}
                    </div>

                    <button 
                      className="deck-nav-btn next-btn theme-transition"
                      disabled={activeCardIndex === flashcards.length - 1}
                      onClick={() => {
                        setIsCardFlipped(false);
                        setActiveCardIndex(prev => Math.min(flashcards.length - 1, prev + 1));
                      }}
                    >
                      <span>Next card</span>
                      <ChevronRight size={16} />
                    </button>
                  </div>

                </div>
              </div>
            )}

            {/* =============================================================
                Topic Reader Footer (Previous / Next Topic Controls)
                ============================================================= */}
            <footer className="topic-reader-footer theme-transition">
              <div className="footer-nav-col">
                {prevTopic ? (
                  <button 
                    className="topic-nav-link prev-link theme-transition"
                    onClick={() => setActiveTopicId(prevTopic.id)}
                  >
                    <ArrowLeft size={16} />
                    <div>
                      <span className="topic-nav-sub">Previous topic</span>
                      <strong className="topic-nav-title">{prevTopic.title}</strong>
                    </div>
                  </button>
                ) : <div />}
              </div>

              <div className="footer-nav-col next-col">
                {nextTopic ? (
                  <button 
                    className="topic-nav-link next-link theme-transition"
                    onClick={() => setActiveTopicId(nextTopic.id)}
                  >
                    <div>
                      <span className="topic-nav-sub">Next topic</span>
                      <strong className="topic-nav-title">{nextTopic.title}</strong>
                    </div>
                    <ArrowRight size={16} />
                  </button>
                ) : (
                  <div className="subject-complete-notice">
                    <Award size={18} className="complete-award-icon" />
                    <span>You have reached the end of {activeSubject.name}!</span>
                  </div>
                )}
              </div>
            </footer>

          </main>

        </div>

      </div>

      {/* =================================================================
          Celebratory Topic-Mastered Popup with 5 Curated Interview Q&As
          ================================================================= */}
      {celebrationTopic && (
        <div 
          className="celebration-modal-overlay animate-fadeIn" 
          onClick={() => setCelebrationTopic(null)}
          role="presentation"
        >
          <div 
            className="celebration-modal-card animate-scaleUp theme-transition" 
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="celebration-title"
          >
            {/* Modal Header */}
            <div className="celebration-modal-header">
              <div className="celebration-badge-row">
                <span className="celebration-confetti-pill">
                  <Sparkles size={14} className="sparkle-spin" />
                  <span>Topic Mastered! 🎉</span>
                </span>
                <span className="celebration-xp-pill">
                  <Zap size={13} />
                  <span>+100 XP Earned</span>
                </span>
              </div>
              <button 
                className="celebration-close-btn"
                onClick={() => setCelebrationTopic(null)}
                aria-label="Close celebration popup"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Hero Banner */}
            <div className="celebration-hero-banner">
              <h2 id="celebration-title" className="celebration-topic-title">
                {celebrationTopic.title}
              </h2>
              <p className="celebration-topic-desc">
                Great job mastering the concepts! In technical campus placements, interviewers frequently probe this topic using these <strong>5 high-yield screening questions</strong>. Review the model answers below while the concepts are fresh.
              </p>
            </div>

            {/* Curated 5 Interview Q&As Vault */}
            <div className="celebration-qa-vault">
              <div className="celebration-qa-vault-header">
                <FileQuestion size={16} className="qa-vault-icon" />
                <h4>Unlocked Technical Screening Q&As ({celebrationTopic.interviewQuestions?.length || 5} Questions)</h4>
              </div>

              <div className="celebration-qa-list">
                {celebrationTopic.interviewQuestions?.map((qa, index) => {
                  const isExpanded = !!celebrationExpandedQAs[qa.id];
                  return (
                    <div key={qa.id} className={`celebration-qa-item ${isExpanded ? 'expanded' : ''} theme-transition`}>
                      <button 
                        className="celebration-qa-btn theme-transition"
                        onClick={() => handleToggleCelebrationQA(qa.id)}
                        aria-expanded={isExpanded}
                      >
                        <div className="celebration-qa-num">Q{index + 1}</div>
                        <div className="celebration-qa-info">
                          <span className="celebration-qa-question">{qa.question}</span>
                          <div className="celebration-qa-tags">
                            {qa.companyTags?.map(tag => (
                              <span key={tag} className="celebration-company-tag">{tag}</span>
                            ))}
                            <span className="celebration-freq-tag">{qa.frequency} frequency</span>
                          </div>
                        </div>
                        <ChevronDown size={18} className={`celebration-qa-chevron ${isExpanded ? 'rotated' : ''}`} />
                      </button>

                      {isExpanded && (
                        <div className="celebration-qa-answer theme-transition animate-fadeIn">
                          <div className="celebration-answer-label">Recommended Model Answer:</div>
                          <div className="celebration-answer-body">
                            {qa.answer.split('\n').map((line, lIdx) => (
                              <p key={lIdx}>{line}</p>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="celebration-modal-footer">
              <button 
                className="celebration-action-btn secondary-action theme-transition"
                onClick={() => {
                  setCelebrationTopic(null);
                  setActiveReaderTab('flashcards');
                }}
              >
                <RotateCw size={15} />
                <span>Practice Topic Flashcards</span>
              </button>

              <button 
                className="celebration-action-btn primary-action theme-transition"
                onClick={() => setCelebrationTopic(null)}
              >
                <CheckCircle2 size={16} />
                <span>Got It • Keep Learning</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
