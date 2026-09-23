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
  Trophy,
  BookMarked,
  ExternalLink,
  Video,
  FileText,
  Lock,
  Mic,
  Target as TargetIcon
} from 'lucide-react';
import { 
  subjects, 
  curriculumData, 
  getSubjectTopics, 
  calculateSubjectProgress,
  CURRICULUM_TIERS
} from '../../data/learningCurriculum';
import { learningApi } from '../../services/api';
import { getTopicInterviewData } from '../../data/interviewEnrichment';
import { getFurtherReadingForTopic } from '../../data/furtherReadingData';
import GatedContentPreview from '../layout/GatedContentPreview';
import './LearningPathView.css';

export default function LearningPathView({ 
  currentUser, 
  onNavigate, 
  onOpenAuth, 
  onDemoLogin,
  onOpenCramSheet
}) {
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

  // State: Placement Tier Filter ('all' | 'L100' | 'L200' | 'L300')
  const [selectedTierFilter, setSelectedTierFilter] = useState('all');

  // State: 60-Second Interview Pitch Active Drill Mode
  const [isPitchHidden, setIsPitchHidden] = useState(false);
  const [pitchTimerSeconds, setPitchTimerSeconds] = useState(60);
  const [isPitchTimerRunning, setIsPitchTimerRunning] = useState(false);
  const [isPitchCopied, setIsPitchCopied] = useState(false);

  // State: Expanded Traps in Q&A Vault
  const [expandedTraps, setExpandedTraps] = useState({});

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

  // Reset flashcard & pitch drill state when changing topic
  useEffect(() => {
    setActiveCardIndex(0);
    setIsCardFlipped(false);
    setIsPitchHidden(false);
    setIsPitchTimerRunning(false);
    setPitchTimerSeconds(60);
    setIsPitchCopied(false);
  }, [activeTopicId]);

  // 60-Second Interview Pitch Countdown Timer
  useEffect(() => {
    let interval = null;
    if (isPitchTimerRunning && pitchTimerSeconds > 0) {
      interval = setInterval(() => {
        setPitchTimerSeconds(prev => prev - 1);
      }, 1000);
    } else if (pitchTimerSeconds === 0 && isPitchTimerRunning) {
      setIsPitchTimerRunning(false);
      setIsPitchHidden(false); // Auto-reveal script when time is up
    }
    return () => clearInterval(interval);
  }, [isPitchTimerRunning, pitchTimerSeconds]);

  // Current Subject and Topics
  const activeSubject = subjects.find(s => s.id === activeSubjectId) || subjects[0];
  const currentTopics = getSubjectTopics(activeSubjectId);

  // Filtered topics based on search query AND placement tier
  const filteredTopics = currentTopics.filter(topic => {
    const matchesSearch = !searchQuery.trim() || 
      topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.what?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTier = selectedTierFilter === 'all' || topic.tier === selectedTierFilter;
    return matchesSearch && matchesTier;
  });

  // Active Topic
  const activeTopic = currentTopics.find(t => t.id === activeTopicId) || currentTopics[0] || {};

  // Pitch Drill Actions
  const handleCopyPitch = () => {
    if (activeTopic.interviewScript60s?.script) {
      navigator.clipboard.writeText(activeTopic.interviewScript60s.script);
      setIsPitchCopied(true);
      setTimeout(() => setIsPitchCopied(false), 2000);
    }
  };

  const handleStartPitchDrill = () => {
    setIsPitchHidden(true);
    setPitchTimerSeconds(60);
    setIsPitchTimerRunning(true);
  };

  const handleRevealPitch = () => {
    setIsPitchHidden(false);
    setIsPitchTimerRunning(false);
  };

  const handleToggleTrap = (trapId) => {
    setExpandedTraps(prev => ({
      ...prev,
      [trapId]: !prev[trapId]
    }));
  };

  // Subject icon component helper
  const getSubjectIcon = (id, size = 18) => {
    if (id === 'os') return <Cpu size={size} />;
    if (id === 'dbms') return <Database size={size} />;
    return <Network size={size} />;
  };

  // Toggle topic completion
  const handleToggleCompletion = (topicId) => {
    if (!currentUser) {
      if (onOpenAuth) onOpenAuth('signup');
      return;
    }
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

  // Render Further Reading & Reference Links Section
  const renderFurtherReadingSection = () => {
    const curatedData = getFurtherReadingForTopic(activeTopic.id);
    const furtherReading = curatedData || activeTopic.furtherReading || {};
    const article = furtherReading.article || null;
    const video = furtherReading.video || null;
    const docs = furtherReading.docs || null;
    const isCurated = Boolean(article?.url || video?.url || docs?.url);

    return (
      <section className="further-reading-section theme-transition" aria-labelledby="further-reading-heading">
        <div className="further-reading-header">
          <div className="further-reading-title-group">
            <div className="further-reading-icon-box">
              <BookMarked size={18} />
            </div>
            <div>
              <h3 id="further-reading-heading" className="further-reading-heading">
                Further Reading & Verification Resources
              </h3>
              <p className="further-reading-sub">
                Curated articles and video lectures relevant to <em>{activeTopic.title}</em> to reinforce concepts for campus screening rounds.
              </p>
            </div>
          </div>
          <span className={`further-reading-status-badge ${isCurated ? 'verified' : ''}`}>
            {isCurated ? <CheckCircle2 size={13} /> : <AlertCircle size={13} />}
            <span>{isCurated ? 'Curated References' : 'Fact-Check In Progress'}</span>
          </span>
        </div>

        <div className="further-reading-grid">
          {/* Link 1: GeeksforGeeks / GATE Overflow Article */}
          <div className="further-reading-card theme-transition">
            <div className="resource-card-top">
              <div className="resource-type-tag article-tag">
                <FileText size={13} />
                <span>GeeksforGeeks / GATE Overflow</span>
              </div>
              {article?.url ? (
                <a 
                  href={article.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="resource-external-link"
                  title="Open reference article in new tab"
                >
                  <span>Read Article</span>
                  <ExternalLink size={13} />
                </a>
              ) : (
                <span className="resource-placeholder-pill" title="URL being vetted during editorial fact-checking">
                  <Clock size={12} />
                  <span>Links coming soon</span>
                </span>
              )}
            </div>

            <h4 className="resource-title">
              {article?.title || `${activeTopic.title}: GeeksforGeeks & GATE Overflow Reference`}
            </h4>
            <p className="resource-desc">
              {article?.desc || 'Comprehensive written explanation covering standard textbook proofs, memory diagrams, edge cases, and previous GATE/campus screening questions.'}
            </p>

            <div className="resource-meta-footer">
              <span className="resource-source-label">Source: {article?.source || 'GeeksforGeeks / GATE Overflow'}</span>
              {!article?.url && (
                <span className="resource-pending-note">Editorial review candidate</span>
              )}
            </div>
          </div>

          {/* Link 2: YouTube Video Walkthrough */}
          <div className="further-reading-card theme-transition">
            <div className="resource-card-top">
              <div className="resource-type-tag video-tag">
                <Video size={13} />
                <span>YouTube Video Walkthrough</span>
              </div>
              {video?.url ? (
                <a 
                  href={video.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="resource-external-link"
                  title="Watch video on YouTube"
                >
                  <span>Watch Video</span>
                  <ExternalLink size={13} />
                </a>
              ) : (
                <span className="resource-placeholder-pill" title="URL being vetted during editorial fact-checking">
                  <Clock size={12} />
                  <span>Links coming soon</span>
                </span>
              )}
            </div>

            <h4 className="resource-title">
              {video?.title || `${activeTopic.title}: Visual Animated Walkthrough`}
            </h4>
            <p className="resource-desc">
              {video?.desc || 'Step-by-step visual animation, memory layout traces, and architectural breakdown to solidify mental models.'}
            </p>

            <div className="resource-meta-footer">
              <span className="resource-source-label">Source: {video?.source || 'YouTube Lecture'}</span>
              {!video?.url && (
                <span className="resource-pending-note">Editorial review candidate</span>
              )}
            </div>
          </div>

          {/* Link 3: Standard Specifications & Reference Docs */}
          <div className="further-reading-card theme-transition">
            <div className="resource-card-top">
              <div className="resource-type-tag docs-tag">
                <BookOpen size={13} />
                <span>Documentation & Standard Specs</span>
              </div>
              {docs?.url ? (
                <a 
                  href={docs.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="resource-external-link"
                  title="View standard reference documentation"
                >
                  <span>View Specs</span>
                  <ExternalLink size={13} />
                </a>
              ) : (
                <span className="resource-placeholder-pill" title="URL being vetted during editorial fact-checking">
                  <Clock size={12} />
                  <span>Links coming soon</span>
                </span>
              )}
            </div>

            <h4 className="resource-title">
              {docs?.title || `${activeTopic.title}: Specifications & Manual`}
            </h4>
            <p className="resource-desc">
              {docs?.desc || 'Authoritative system specifications, POSIX/Linux manual pages, or database engine internal architectural documentation.'}
            </p>

            <div className="resource-meta-footer">
              <span className="resource-source-label">Source: {docs?.source || 'Official Manual / RFC'}</span>
              {!docs?.url && (
                <span className="resource-pending-note">Editorial review candidate</span>
              )}
            </div>
          </div>
        </div>
      </section>
    );
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

              {/* Placement Tier Selector Filter */}
              <div className="sidebar-tier-selector">
                <span className="sidebar-tier-label">Placement Tier:</span>
                <div className="tier-pills-row">
                  {CURRICULUM_TIERS.map(tier => (
                    <button
                      key={tier.id}
                      type="button"
                      className={`tier-pill-btn ${selectedTierFilter === tier.id ? 'active' : ''} theme-transition`}
                      onClick={() => setSelectedTierFilter(tier.id)}
                      title={tier.badge || tier.label}
                    >
                      <span>{tier.shortLabel}</span>
                    </button>
                  ))}
                </div>
              </div>

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
                const isDemoLocked = currentUser?.isDemo && topic.order > 1;

                return (
                  <button
                    key={topic.id}
                    className={`topic-list-item ${isSelected ? 'selected' : ''} ${isCompleted ? 'completed' : ''} ${isDemoLocked ? 'demo-locked' : ''} theme-transition`}
                    onClick={() => setActiveTopicId(topic.id)}
                  >
                    <div className="topic-order-badge theme-transition">
                      {isCompleted ? (
                        <CheckCircle2 size={15} className="completed-check-icon" />
                      ) : isDemoLocked ? (
                        <Lock size={12} className="completed-check-icon" />
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
                        <span className={`tier-badge-micro tier-${topic.tier ? topic.tier.toLowerCase() : 'l200'}`}>
                          {topic.tier || 'L200'}
                        </span>
                        <span className="read-time-label">
                          <Clock size={11} />
                          <span>{topic.readTime}</span>
                        </span>
                        {isDemoLocked && (
                          <span className="demo-scope-lock-pill">Demo Lock</span>
                        )}
                      </div>
                    </div>

                    <ChevronRight size={14} className="topic-arrow" />
                  </button>
                );
              })}

              {filteredTopics.length === 0 && (
                <div className="no-topics-found">
                  <p>No topics match criteria</p>
                  <button onClick={() => { setSearchQuery(''); setSelectedTierFilter('all'); }} className="clear-search-btn">
                    Reset filters
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

                <div className="reader-actions-group">
                  {/* Quick Cram Sheet Button */}
                  <button 
                    type="button"
                    className="reader-cram-quick-btn theme-transition"
                    onClick={() => {
                      if (onOpenCramSheet) onOpenCramSheet(activeSubjectId, 'all', activeTopic.title);
                      else window.dispatchEvent(new CustomEvent('commitdrive_open_cram_sheet', { detail: { subject: activeSubjectId, topic: activeTopic.title } }));
                    }}
                    title="Open Night-Before Cram Sheet for this subject"
                  >
                    <Zap size={14} className="reader-cram-icon" />
                    <span>⚡ Quick Cram Sheet</span>
                  </button>

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
              </div>

              {/* Topic Metadata Badges */}
              <div className="reader-meta-row">
                <span className={`tier-badge-pill tier-${activeTopic.tier ? activeTopic.tier.toLowerCase() : 'l200'}`}>
                  {activeTopic.tier || 'L200'} • {activeTopic.tierName || 'Placement Core'}
                </span>
                <span className={`diff-pill ${activeTopic.difficulty ? activeTopic.difficulty.toLowerCase() : 'intermediate'}`}>
                  {activeTopic.difficulty}
                </span>
                <span className="read-time-pill">
                  <Clock size={13} />
                  <span>{activeTopic.readTime}</span>
                </span>
                {activeTopic.frequency && (
                  <span className="reader-freq-pill" title="Placement Interview Frequency">
                    <Sparkles size={12} />
                    <span>{activeTopic.frequency}</span>
                  </span>
                )}
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
                  onClick={() => {
                    if (!currentUser) {
                      if (onOpenAuth) onOpenAuth('signup');
                      return;
                    }
                    setActiveReaderTab('qa');
                  }}
                >
                  <FileQuestion size={15} />
                  <span>Interview Q&A vault ({activeTopic.interviewQuestions?.length || 0})</span>
                </button>

                <button 
                  className={`reader-tab-btn ${activeReaderTab === 'flashcards' ? 'active' : ''} theme-transition`}
                  onClick={() => {
                    if (!currentUser) {
                      if (onOpenAuth) onOpenAuth('signup');
                      return;
                    }
                    setActiveReaderTab('flashcards');
                  }}
                >
                  <RotateCw size={15} />
                  <span>Flashcard deck ({activeTopic.flashcards?.length || 0})</span>
                </button>

                <button 
                  className={`reader-tab-btn ${activeReaderTab === 'reading' ? 'active' : ''} theme-transition`}
                  onClick={() => {
                    if (!currentUser) {
                      if (onOpenAuth) onOpenAuth('signup');
                      return;
                    }
                    setActiveReaderTab('reading');
                  }}
                >
                  <BookMarked size={15} />
                  <span>Further reading</span>
                </button>

                <button 
                  className={`reader-tab-btn interview-mode-tab ${activeReaderTab === 'interview' ? 'active' : ''} theme-transition`}
                  onClick={() => {
                    if (!currentUser) {
                      if (onOpenAuth) onOpenAuth('signup');
                      return;
                    }
                    setActiveReaderTab('interview');
                  }}
                >
                  <Mic size={15} />
                  <span>Interview Mode</span>
                  <span className="tab-interview-badge">New</span>
                </button>
              </div>
            </div>

            {currentUser?.isDemo && activeTopic.order > 1 ? (
              <div className="demo-topic-lock-card theme-transition animate-fadeIn">
                <div className="demo-topic-lock-badge">
                  <Lock size={18} className="demo-lock-icon" />
                  <span>Demo Mode Scope Limit</span>
                </div>
                <h2 className="demo-topic-lock-title">Topic {activeTopic.order < 10 ? `0${activeTopic.order}` : activeTopic.order}: "{activeTopic.title}" is Gated</h2>
                <p className="demo-topic-lock-desc">
                  In Demo Mode, you have full interactive access to <strong>Topic 01 ({currentTopics[0]?.title})</strong> with complete engineering rationales, Q&A vaults, and flashcards.
                </p>
                <p className="demo-topic-lock-sub">
                  To unlock all 10 topics in {activeSubject.name} and the complete 30-topic core computer science curriculum, sign up for your free account.
                </p>
                <div className="demo-topic-lock-actions">
                  <button 
                    type="button"
                    className="demo-topic-signup-btn theme-transition"
                    onClick={() => onOpenAuth && onOpenAuth('signup')}
                  >
                    <span>Sign up to unlock all {activeSubject.name} topics</span>
                    <ArrowRight size={15} />
                  </button>
                  <button 
                    type="button"
                    className="demo-topic-back-btn theme-transition"
                    onClick={() => {
                      const firstTopic = getSubjectTopics(activeSubjectId)[0];
                      if (firstTopic) setActiveTopicId(firstTopic.id);
                    }}
                  >
                    <span>← Back to Topic 01</span>
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* =============================================================
                    Tab 1: Concept Deep-Dive (What, Why, Use Case, Example)
                    ============================================================= */}
                {activeReaderTab === 'concept' && (
                  <div className="reader-content-body animate-fadeIn">
                
                {/* 00. 60-Second Interview Elevator Pitch Card */}
                {activeTopic.interviewScript60s && (
                  <section className="interview-pitch-card theme-transition animate-fadeIn">
                    <div className="pitch-card-header">
                      <div className="pitch-header-left">
                        <div className="pitch-badge-icon">
                          <Zap size={16} />
                        </div>
                        <div>
                          <div className="pitch-eyebrow-row">
                            <span className="pitch-eyebrow">60-Second Interview Elevator Pitch</span>
                            <span className="pitch-duration-pill">45–60 sec spoken script</span>
                          </div>
                          <h3 className="pitch-target-prompt">
                            {activeTopic.interviewScript60s.targetPrompt || `When asked: "Explain ${activeTopic.title}"`}
                          </h3>
                        </div>
                      </div>

                      <div className="pitch-header-actions">
                        <button
                          type="button"
                          className={`pitch-drill-btn ${isPitchTimerRunning ? 'active' : ''} theme-transition`}
                          onClick={isPitchHidden ? handleRevealPitch : handleStartPitchDrill}
                          title="Hide script and start 60s speaking practice"
                        >
                          {isPitchHidden ? (
                            <>
                              <Sparkles size={13} />
                              <span>Reveal Script</span>
                            </>
                          ) : (
                            <>
                              <Clock size={13} />
                              <span>{isPitchTimerRunning ? `Drill: ${pitchTimerSeconds}s` : 'Test My Pitch (60s Drill)'}</span>
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          className="pitch-copy-btn theme-transition"
                          onClick={handleCopyPitch}
                          title="Copy spoken script to clipboard"
                        >
                          {isPitchCopied ? (
                            <>
                              <Check size={13} className="text-success" />
                              <span>Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy size={13} />
                              <span>Copy Pitch</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Spoken Script Container */}
                    <div className={`pitch-script-box ${isPitchHidden ? 'pitch-is-hidden' : ''} theme-transition`}>
                      {isPitchHidden ? (
                        <div className="pitch-hidden-cover">
                          <div className="pitch-countdown-circle">
                            <span className="countdown-number">{pitchTimerSeconds}s</span>
                            <span className="countdown-label">Speak now out loud!</span>
                          </div>
                          <p className="pitch-hidden-hint">
                            Deliver your 60-second answer without reading. Hit the mandatory keywords below!
                          </p>
                          <button 
                            type="button" 
                            className="pitch-reveal-btn" 
                            onClick={handleRevealPitch}
                          >
                            Done Speaking • Check Model Script
                          </button>
                        </div>
                      ) : (
                        <blockquote className="pitch-spoken-quote">
                          "{activeTopic.interviewScript60s.script}"
                        </blockquote>
                      )}
                    </div>

                    {/* Non-negotiable Keywords */}
                    {activeTopic.interviewScript60s.keywords?.length > 0 && (
                      <div className="pitch-keywords-row">
                        <span className="keywords-label">Must-Mention Keywords:</span>
                        <div className="keywords-pills-list">
                          {activeTopic.interviewScript60s.keywords.map((kw, kwIdx) => (
                            <span key={kwIdx} className="keyword-chip">
                              <Check size={11} className="kw-check-icon" />
                              <span>{kw}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </section>
                )}

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

                <GatedContentPreview
                  isGated={!currentUser}
                  badgeText="Core CS Theory Path"
                  title="Sign up to unlock full access"
                  subtitle="Unlock complete engineering rationales, real-world scale architectures, code examples, technical interview Q&A vaults, and active recall flashcards."
                  features={[
                    'Engineering rationales & system scale architectures for all 30 CS topics',
                    'Curated technical interview question vaults with model answers',
                    'Interactive 3D active-recall flashcard decks with spaced repetition',
                    'Full curriculum progress tracking and mastery certificates'
                  ]}
                  ctaText="Sign up to unlock full access"
                  onSignUp={() => onOpenAuth && onOpenAuth('signup')}
                  onSignIn={() => onOpenAuth && onOpenAuth('signin')}
                  onDemoLogin={onDemoLogin}
                >
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
                </GatedContentPreview>

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

                {/* Interviewer Trap Questions & Dealbreakers */}
                {activeTopic.trapQuestions && activeTopic.trapQuestions.length > 0 && (
                  <div className="trap-questions-section theme-transition">
                    <div className="trap-section-banner">
                      <div className="trap-banner-badge">
                        <AlertCircle size={15} />
                        <span>Dealbreaker Traps</span>
                      </div>
                      <h4 className="trap-section-title">Interviewer Trap Questions & Red Flags</h4>
                      <p className="trap-section-desc">
                        Deceptive questions interviewers use to catch candidates who memorized answers without understanding the underlying architecture.
                      </p>
                    </div>

                    <div className="trap-cards-grid">
                      {activeTopic.trapQuestions.map((trap, tIdx) => {
                        const isExpanded = expandedTraps[trap.id || tIdx] !== false; // default expanded
                        return (
                          <div key={trap.id || tIdx} className={`trap-card ${isExpanded ? 'expanded' : ''} theme-transition`}>
                            <button
                              type="button"
                              className="trap-card-header theme-transition"
                              onClick={() => handleToggleTrap(trap.id || tIdx)}
                              aria-expanded={isExpanded}
                            >
                              <div className="trap-header-top">
                                <span className="trap-num-pill">Trap #{tIdx + 1}</span>
                                <div className="trap-company-tags">
                                  {trap.companyTags?.map(ct => (
                                    <span key={ct} className="trap-company-tag">{ct}</span>
                                  ))}
                                </div>
                              </div>
                              <h5 className="trap-question-text">"{trap.question}"</h5>
                              <ChevronDown size={16} className={`trap-chevron ${isExpanded ? 'rotated' : ''}`} />
                            </button>

                            {isExpanded && (
                              <div className="trap-card-body theme-transition animate-fadeIn">
                                <div className="trap-comparison-col mistake-col">
                                  <div className="comparison-header mistake-header">
                                    <X size={14} />
                                    <span>❌ Common Amateur Mistake (Red Flag)</span>
                                  </div>
                                  <p className="comparison-text">{trap.commonMistake}</p>
                                </div>

                                <div className="trap-comparison-col winning-col">
                                  <div className="comparison-header winning-header">
                                    <Check size={14} />
                                    <span>✅ Winning Answer (Architectural Distinction)</span>
                                  </div>
                                  <p className="comparison-text">{trap.winningAnswer}</p>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

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
                Tab 4: Further Reading Vault (Standalone View)
                ============================================================= */}
            {activeReaderTab === 'reading' && (
              <div className="reader-content-body reading-body animate-fadeIn">
                {renderFurtherReadingSection()}
              </div>
            )}

            {/* =============================================================
                Tab 5: Interview Mode — 60s Pitch + Keywords + Trap Qs
                ============================================================= */}
            {activeReaderTab === 'interview' && (() => {
              const iData = getTopicInterviewData(activeTopicId);
              return (
                <div className="reader-content-body interview-mode-body animate-fadeIn">
                  {iData ? (
                    <>
                      {/* -- Readiness header -- */}
                      <div className="im-readiness-header theme-transition">
                        <div className="im-readiness-badge-row">
                          <span className="im-tier-badge">{iData.tierName}</span>
                          <span className="im-frequency-badge">
                            <Zap size={11} />
                            {iData.frequency}
                          </span>
                        </div>
                        <div className="im-target-prompt">
                          <TargetIcon size={14} className="im-target-icon" />
                          {iData.targetPrompt}
                        </div>
                      </div>

                      {/* -- 60-Second Pitch Drill -- */}
                      <section className="im-pitch-section theme-transition">
                        <div className="im-section-header">
                          <div className="im-section-icon-box pitch-icon">
                            <Mic size={15} />
                          </div>
                          <div>
                            <h4 className="im-section-title">60-Second Elevator Pitch</h4>
                            <p className="im-section-sub">Practice speaking this aloud. Hide the script and use the timer to simulate a real answer.</p>
                          </div>
                          <div className="im-pitch-actions">
                            <button
                              className="im-action-btn theme-transition"
                              onClick={() => setIsPitchHidden(prev => !prev)}
                              title={isPitchHidden ? 'Show script' : 'Hide script (practice mode)'}
                            >
                              {isPitchHidden ? <>
                                <Check size={13} /><span>Reveal</span>
                              </> : <>
                                <X size={13} /><span>Hide</span>
                              </>}
                            </button>
                            <button
                              className="im-action-btn timer-btn theme-transition"
                              onClick={() => {
                                if (isPitchTimerRunning) {
                                  setIsPitchTimerRunning(false);
                                  setPitchTimerSeconds(60);
                                } else {
                                  setPitchTimerSeconds(60);
                                  setIsPitchTimerRunning(true);
                                }
                              }}
                            >
                              <Clock size={13} />
                              <span className={`im-timer-display ${isPitchTimerRunning && pitchTimerSeconds <= 10 ? 'warning' : ''}`}>
                                {isPitchTimerRunning ? `${pitchTimerSeconds}s` : '60s'}
                              </span>
                            </button>
                            <button
                              className="im-action-btn theme-transition"
                              onClick={() => {
                                navigator.clipboard.writeText(iData.script);
                                setIsPitchCopied(true);
                                setTimeout(() => setIsPitchCopied(false), 2000);
                              }}
                            >
                              {isPitchCopied ? <Check size={13} /> : <Copy size={13} />}
                            </button>
                          </div>
                        </div>
                        <div className={`im-pitch-script theme-transition ${isPitchHidden ? 'blurred' : ''}`}>
                          {iData.script}
                        </div>
                      </section>

                      {/* -- Must-mention keywords -- */}
                      <section className="im-keywords-section theme-transition">
                        <div className="im-section-header">
                          <div className="im-section-icon-box keywords-icon">
                            <Zap size={15} />
                          </div>
                          <div>
                            <h4 className="im-section-title">Must-Mention Keywords</h4>
                            <p className="im-section-sub">These terms signal technical depth. An interviewer will mentally tick these off as you speak.</p>
                          </div>
                        </div>
                        <div className="im-keywords-grid">
                          {iData.keywords.map((kw, i) => (
                            <span key={i} className="im-keyword-chip theme-transition">
                              <Check size={11} />
                              {kw}
                            </span>
                          ))}
                        </div>
                      </section>

                      {/* -- Topic Core Placement Interview Questions Bank (Comprehensive Coverage) -- */}
                      {activeTopic.interviewQuestions && activeTopic.interviewQuestions.length > 0 && (
                        <section className="im-core-questions-section theme-transition">
                          <div className="im-section-header">
                            <div className="im-section-icon-box core-icon">
                              <HelpCircle size={15} />
                            </div>
                            <div className="im-section-title-wrap">
                              <div className="im-title-row-flex">
                                <h4 className="im-section-title">Topic Interview Q&A Bank ({activeTopic.interviewQuestions.length} Placement Questions)</h4>
                                <span className="im-comprehensive-pill">High Yield</span>
                              </div>
                              <p className="im-section-sub">Top frequently asked technical round questions for this topic with winning answers and company tags.</p>
                            </div>
                          </div>

                          <div className="im-core-questions-list">
                            {activeTopic.interviewQuestions.map((qa, qIdx) => {
                              const qId = qa.id || `qa-${qIdx}`;
                              const isExp = expandedTraps[qId] !== false;
                              return (
                                <div key={qId} className="im-core-q-card theme-transition">
                                  <div 
                                    className="im-core-q-header"
                                    onClick={() => setExpandedTraps(prev => ({ ...prev, [qId]: !isExp }))}
                                  >
                                    <div className="im-core-q-left">
                                      <span className="im-q-num-badge">Q{qIdx + 1}</span>
                                      <span className="im-core-q-text">{qa.question}</span>
                                    </div>
                                    <div className="im-core-q-meta">
                                      {qa.companyTags?.map((ct, ci) => (
                                        <span key={ci} className="im-trap-company-tag">{ct}</span>
                                      ))}
                                      {qa.frequency && (
                                        <span className="im-freq-chip">{qa.frequency}</span>
                                      )}
                                      <ChevronDown size={14} className={`im-trap-chevron ${isExp ? 'open' : ''}`} />
                                    </div>
                                  </div>

                                  {isExp && (
                                    <div className="im-core-q-body animate-fadeIn">
                                      <div className="im-core-answer-box">
                                        <div className="im-core-answer-header">
                                          <Check size={13} className="text-success" />
                                          <span>Winning Model Answer:</span>
                                        </div>
                                        <div className="im-core-answer-content">
                                          {qa.answer.split('\n').map((line, lIdx) => (
                                            <p key={lIdx}>{line}</p>
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </section>
                      )}

                      {/* -- Trap questions -- */}
                      {iData.trapQuestions && iData.trapQuestions.length > 0 && (
                        <section className="im-traps-section theme-transition">
                          <div className="im-section-header">
                            <div className="im-section-icon-box traps-icon">
                              <AlertCircle size={15} />
                            </div>
                            <div>
                              <h4 className="im-section-title">Interviewer Trap Questions ({iData.trapQuestions.length} Traps)</h4>
                              <p className="im-section-sub">Deceptive follow-ups designed to catch candidates who memorised without understanding.</p>
                            </div>
                          </div>

                          <div className="im-traps-list">
                            {iData.trapQuestions.map((trap) => (
                              <div key={trap.id} className="im-trap-item theme-transition">
                                <button
                                  className="im-trap-toggle"
                                  onClick={() => setExpandedTraps(prev => ({ ...prev, [trap.id]: !prev[trap.id] }))}
                                >
                                  <div className="im-trap-q">
                                    <AlertCircle size={13} className="im-trap-icon" />
                                    <span>{trap.question}</span>
                                  </div>
                                  <div className="im-trap-meta">
                                    {trap.companyTags?.map((c, ci) => (
                                      <span key={ci} className="im-trap-company-tag">{c}</span>
                                    ))}
                                    <ChevronDown
                                      size={14}
                                      className={`im-trap-chevron ${expandedTraps[trap.id] ? 'open' : ''}`}
                                    />
                                  </div>
                                </button>

                                {expandedTraps[trap.id] && (
                                  <div className="im-trap-body animate-fadeIn">
                                    <div className="im-trap-mistake">
                                      <div className="im-trap-mistake-label">
                                        <X size={11} /> Common Mistake
                                      </div>
                                      <div className="im-trap-mistake-text">{trap.commonMistake}</div>
                                    </div>
                                    <div className="im-trap-winning">
                                      <div className="im-trap-winning-label">
                                        <Check size={11} /> Winning Answer
                                      </div>
                                      <div className="im-trap-winning-text">{trap.winningAnswer}</div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </section>
                      )}

                      {/* -- Cram Sheet shortcut (Linked directly to this Topic) -- */}
                      <div className="im-cram-shortcut theme-transition">
                        <Zap size={14} className="im-cram-icon" />
                        <span>Want the complete revision guide for <strong>{activeTopic.title}</strong>?</span>
                        <button
                          className="im-cram-btn theme-transition"
                          onClick={() => {
                            if (onOpenCramSheet) onOpenCramSheet(activeTopic.subjectId || activeSubjectId, 'all', activeTopic.title);
                            else window.dispatchEvent(new CustomEvent('commitdrive_open_cram_sheet', { detail: { subject: activeTopic.subjectId || activeSubjectId, topic: activeTopic.title } }));
                          }}
                        >
                          Open Topic Cram Sheet →
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="im-no-data theme-transition">
                      <Mic size={28} className="im-no-data-icon" />
                      <h4>Interview Mode Coming Soon</h4>
                      <p>Interview pitch scripts and trap questions for this topic are being prepared. Check back soon!</p>
                    </div>
                  )}
                </div>
              );
            })()}

            {/* =============================================================
                Bottom of Topic Page: Further Reading Section
                ============================================================= */}
            {activeReaderTab !== 'reading' && activeReaderTab !== 'interview' && renderFurtherReadingSection()}

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
              </>
            )}

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
