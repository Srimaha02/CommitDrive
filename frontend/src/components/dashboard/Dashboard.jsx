import React from 'react';
import { 
  Sparkles, 
  Flame, 
  BookOpen, 
  Terminal, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Cpu, 
  GitBranch, 
  Database, 
  Network, 
  AlertTriangle, 
  Award,
  Play,
  TrendingUp,
  Target
} from 'lucide-react';
import './Dashboard.css';

export default function Dashboard({ currentUser, onNavigate }) {
  const student = currentUser || {
    name: 'Mikro Student',
    role: 'SDE Aspirant 2026',
    targetYear: '2026',
    streak: 3
  };

  // Streak days: Mon - Sun
  const weekDays = [
    { day: 'Mon', completed: true, label: 'OS Threading' },
    { day: 'Tue', completed: true, label: 'Git Rebase' },
    { day: 'Wed', completed: true, label: 'DBMS 3NF' },
    { day: 'Thu', completed: false, isToday: true, label: 'Today (Active)' },
    { day: 'Fri', completed: false, label: '' },
    { day: 'Sat', completed: false, label: '' },
    { day: 'Sun', completed: false, label: '' },
  ];

  return (
    <main className="dashboard-page theme-transition">
      <div className="content-wrapper dashboard-container">

        {/* =================================================================
            1. Welcome Header & Daily Tip
            ================================================================= */}
        <section className="dash-hero-section">
          <div className="dash-hero-left">
            <div className="dash-cohort-tag theme-transition">
              <Target size={14} className="tag-icon" />
              <span>Target: SDE 1 • Class of {student.targetYear || '2026'}</span>
            </div>
            <h1 className="dash-greeting">
              Welcome back, <span className="highlight-name">{student.name}</span> 👋
            </h1>
            <p className="dash-sub">
              Your placement preparation is <strong className="readiness-percent">68% ready</strong> for upcoming campus drives and technical screening rounds.
            </p>
          </div>

          {/* Daily Placement Tip Card */}
          <div className="daily-tip-card theme-transition">
            <div className="tip-header">
              <span className="tip-badge">
                <Sparkles size={13} />
                <span>Placement Insight of the Day</span>
              </span>
              <span className="tip-source">Amazon & Uber SDE Interviews</span>
            </div>
            <p className="tip-content">
              "78% of OS screening rounds test whether you can clearly explain how the <strong>Working Set Model</strong> and <strong>TLB (Translation Lookaside Buffer)</strong> mitigate page faults during memory thrashing."
            </p>
          </div>
        </section>

        {/* =================================================================
            2. Interactive 7-Day Practice Streak Bar
            ================================================================= */}
        <section className="streak-section theme-transition">
          <div className="streak-header-row">
            <div className="streak-title-group">
              <div className="streak-flame-box">
                <Flame size={22} className="flame-pulse" />
              </div>
              <div>
                <h3 className="streak-heading">{student.streak || 3}-Day Study Streak!</h3>
                <p className="streak-sub">Practice today in either Study Corner or Terminal Zone to maintain streak multiplier.</p>
              </div>
            </div>
            <div className="streak-multiplier-badge">
              <span>1.5x Knowledge Retention</span>
            </div>
          </div>

          {/* 7-Day Track */}
          <div className="days-track-grid">
            {weekDays.map((item, index) => (
              <div 
                key={index} 
                className={`day-col ${item.completed ? 'completed' : ''} ${item.isToday ? 'today' : ''} theme-transition`}
              >
                <div className="day-bubble">
                  {item.completed ? (
                    <CheckCircle2 size={16} className="day-check" />
                  ) : item.isToday ? (
                    <Flame size={16} className="today-flame" />
                  ) : (
                    <span className="day-dot" />
                  )}
                </div>
                <span className="day-name">{item.day}</span>
                {item.completed && <span className="day-sub-label">{item.label}</span>}
                {item.isToday && <span className="day-sub-label current-label">Today</span>}
              </div>
            ))}
          </div>
        </section>

        {/* =================================================================
            3. Dual "Continue Learning" Action Cards
            ================================================================= */}
        <section className="continue-learning-section">
          <div className="section-title-row">
            <h2 className="section-main-heading">Continue Your Learning Tracks</h2>
            <span className="section-sub-tag">Pick up right where you left off</span>
          </div>

          <div className="continue-cards-grid">
            
            {/* Track 1: Learning Path Theory Card */}
            <div className="continue-card learning-continue-card theme-transition">
              <div className="continue-card-top">
                <div className="track-indicator learning-indicator">
                  <BookOpen size={14} />
                  <span>Theory track • Study Corner</span>
                </div>
                <span className="topic-num-pill">Topic 4 of 10</span>
              </div>

              <div className="continue-card-body">
                <div className="subject-micro-tag">
                  <Cpu size={14} />
                  <span>Operating Systems</span>
                </div>
                <h3 className="continue-topic-title">Virtual Memory, Paging & Thrashing</h3>
                <p className="continue-topic-desc">
                  Learn how the MMU translates virtual pages to physical frames, page replacement heuristics (LRU, FIFO), and working sets.
                </p>

                {/* Progress bar */}
                <div className="card-progress-block">
                  <div className="progress-labels">
                    <span>Topic Progress</span>
                    <strong>40% Completed</strong>
                  </div>
                  <div className="continue-bar-track">
                    <div className="continue-bar-fill learning-fill" style={{ width: '40%' }} />
                  </div>
                </div>
              </div>

              <div className="continue-card-bottom">
                <span className="meta-left">5 Flashcards Pending Self-Test</span>
                <button 
                  className="resume-btn learning-btn theme-transition"
                  onClick={() => onNavigate('learning')}
                >
                  <span>Resume Lesson</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>

            {/* Track 2: Practical Path Terminal Card */}
            <div className="continue-card practical-continue-card theme-transition">
              <div className="continue-card-top">
                <div className="track-indicator practical-indicator">
                  <Terminal size={14} />
                  <span>Hands-on lab • Terminal Zone</span>
                </div>
                <span className="topic-num-pill practical-pill">Mission 2 of 8</span>
              </div>

              <div className="continue-card-body">
                <div className="subject-micro-tag practical-micro">
                  <GitBranch size={14} />
                  <span>Git Version Control</span>
                </div>
                <h3 className="continue-topic-title">Resolving Hotfix Merge Conflicts</h3>
                <p className="continue-topic-desc">
                  Simulated production incident: A release candidate branch has merge conflicts in <code>deploy.sh</code>. Inspect conflict markers and commit cleanly.
                </p>

                {/* Progress bar */}
                <div className="card-progress-block">
                  <div className="progress-labels">
                    <span>Module Progress</span>
                    <strong>1 of 8 Missions Passed</strong>
                  </div>
                  <div className="continue-bar-track">
                    <div className="continue-bar-fill practical-fill" style={{ width: '12.5%' }} />
                  </div>
                </div>
              </div>

              <div className="continue-card-bottom">
                <span className="meta-left">Virtual Terminal Ready</span>
                <button 
                  className="resume-btn practical-btn theme-transition"
                  onClick={() => onNavigate('practical')}
                >
                  <Play size={14} />
                  <span>Open Terminal Zone</span>
                </button>
              </div>
            </div>

          </div>
        </section>

        {/* =================================================================
            4. Overall Placement Readiness Matrix
            ================================================================= */}
        <section className="readiness-matrix-section theme-transition">
          <div className="readiness-header">
            <div>
              <div className="readiness-eyebrow">Comprehensive syllabus audit</div>
              <h2 className="readiness-heading">Placement Readiness Matrix</h2>
            </div>
            <div className="overall-score-badge">
              <TrendingUp size={18} />
              <span>Overall Readiness: <strong>68%</strong></span>
            </div>
          </div>

          <div className="readiness-grid">
            
            {/* OS */}
            <div className="readiness-item theme-transition">
              <div className="readiness-item-header">
                <div className="item-name-group">
                  <Cpu size={16} className="item-icon" />
                  <span className="item-name">Operating Systems</span>
                </div>
                <span className="item-percentage">40%</span>
              </div>
              <div className="metric-track">
                <div className="metric-fill" style={{ width: '40%' }} />
              </div>
              <span className="item-sub">4/10 topics mastered</span>
            </div>

            {/* DBMS */}
            <div className="readiness-item theme-transition">
              <div className="readiness-item-header">
                <div className="item-name-group">
                  <Database size={16} className="item-icon" />
                  <span className="item-name">Database Management (DBMS)</span>
                </div>
                <span className="item-percentage">60%</span>
              </div>
              <div className="metric-track">
                <div className="metric-fill" style={{ width: '60%' }} />
              </div>
              <span className="item-sub">6/10 topics mastered</span>
            </div>

            {/* Computer Networks */}
            <div className="readiness-item theme-transition">
              <div className="readiness-item-header">
                <div className="item-name-group">
                  <Network size={16} className="item-icon" />
                  <span className="item-name">Computer Networks</span>
                </div>
                <span className="item-percentage alert-percentage">20%</span>
              </div>
              <div className="metric-track">
                <div className="metric-fill alert-fill" style={{ width: '20%' }} />
              </div>
              <span className="item-sub alert-sub">Needs Attention (2/10 topics)</span>
            </div>

            {/* Git */}
            <div className="readiness-item theme-transition">
              <div className="readiness-item-header">
                <div className="item-name-group">
                  <GitBranch size={16} className="item-icon" />
                  <span className="item-name">Git Lab & Collaboration</span>
                </div>
                <span className="item-percentage alert-percentage">25%</span>
              </div>
              <div className="metric-track">
                <div className="metric-fill alert-fill" style={{ width: '25%' }} />
              </div>
              <span className="item-sub alert-sub">Needs Attention (2/8 missions)</span>
            </div>

            {/* Linux */}
            <div className="readiness-item theme-transition">
              <div className="readiness-item-header">
                <div className="item-name-group">
                  <Terminal size={16} className="item-icon" />
                  <span className="item-name">Linux CLI & SysAdmin</span>
                </div>
                <span className="item-percentage alert-percentage">13%</span>
              </div>
              <div className="metric-track">
                <div className="metric-fill alert-fill" style={{ width: '13%' }} />
              </div>
              <span className="item-sub alert-sub">Needs Attention (1/8 missions)</span>
            </div>

            {/* SQL */}
            <div className="readiness-item theme-transition">
              <div className="readiness-item-header">
                <div className="item-name-group">
                  <Database size={16} className="item-icon" />
                  <span className="item-name">SQL Query Optimization</span>
                </div>
                <span className="item-percentage">50%</span>
              </div>
              <div className="metric-track">
                <div className="metric-fill" style={{ width: '50%' }} />
              </div>
              <span className="item-sub">4/8 missions passed</span>
            </div>

          </div>

          {/* Weak Area Diagnostic Notice */}
          <div className="weak-area-alert-box theme-transition">
            <AlertTriangle size={18} className="alert-icon" />
            <div className="alert-text">
              <strong>Diagnostic Recommendation:</strong> Prioritize <em>Computer Networks (TCP 3-Way Handshake & Congestion Control)</em> and <em>Linux Pipeline Commands (`grep | awk | sed`)</em> before scheduling your first timed Mock Test.
            </div>
          </div>

        </section>

      </div>
    </main>
  );
}
