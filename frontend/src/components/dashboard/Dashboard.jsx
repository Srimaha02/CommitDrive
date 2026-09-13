import React, { useState, useEffect } from 'react';
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
import { dashboardApi } from '../../services/api';
import './Dashboard.css';

export default function Dashboard({ currentUser, onNavigate }) {
  const student = currentUser || {
    name: 'Mikro Student',
    role: 'SDE Aspirant 2026',
    targetYear: '2026',
    streak: 3
  };

  const [stats, setStats] = useState({
    overallReadinessPct: 68,
    streak: student.streak || 3,
    osMasteredCount: 4,
    dbmsMasteredCount: 6,
    cnMasteredCount: 2,
    gitMissionsPassedCount: 2,
    linuxMissionsPassedCount: 1,
    sqlMissionsPassedCount: 4,
    diagnosticAlerts: [
      'Prioritize Computer Networks (TCP 3-Way Handshake & Congestion Control)',
      'Review Linux Pipeline Commands (grep | wc) before your screening test'
    ]
  });

  useEffect(() => {
    let isMounted = true;
    dashboardApi.getStats().then(res => {
      if (isMounted && res && res.data) {
        setStats(prev => ({ ...prev, ...res.data }));
      }
    }).catch(() => {});
    return () => { isMounted = false; };
  }, []);

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
              Your placement preparation is <strong className="readiness-percent">{stats.overallReadinessPct || 68}% ready</strong> for upcoming campus drives and technical screening rounds.
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
                <h3 className="streak-heading">{stats.streak || student.streak || 3}-Day Study Streak!</h3>
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
        {(() => {
          const osPct = Math.min(100, Math.round(((stats.osMasteredCount ?? 4) / 10) * 100));
          const dbmsPct = Math.min(100, Math.round(((stats.dbmsMasteredCount ?? 6) / 10) * 100));
          const cnPct = Math.min(100, Math.round(((stats.cnMasteredCount ?? 2) / 10) * 100));
          const gitPct = Math.min(100, Math.round(((stats.gitMissionsPassedCount ?? 2) / 8) * 100));
          const linuxPct = Math.min(100, Math.round(((stats.linuxMissionsPassedCount ?? 1) / 8) * 100));
          const sqlPct = Math.min(100, Math.round(((stats.sqlMissionsPassedCount ?? 4) / 8) * 100));

          return (
            <section className="readiness-matrix-section theme-transition">
              <div className="readiness-header">
                <div>
                  <div className="readiness-eyebrow">Comprehensive syllabus audit</div>
                  <h2 className="readiness-heading">Placement Readiness Matrix</h2>
                </div>
                <div className="overall-score-badge">
                  <TrendingUp size={18} />
                  <span>Overall Readiness: <strong>{stats.overallReadinessPct || 68}%</strong></span>
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
                    <span className={`item-percentage ${osPct < 40 ? 'alert-percentage' : ''}`}>{osPct}%</span>
                  </div>
                  <div className="metric-track">
                    <div className={`metric-fill ${osPct < 40 ? 'alert-fill' : ''}`} style={{ width: `${osPct}%` }} />
                  </div>
                  <span className={`item-sub ${osPct < 40 ? 'alert-sub' : ''}`}>
                    {osPct < 40 ? 'Needs Attention (' : ''}{stats.osMasteredCount ?? 4}/10 topics mastered{osPct < 40 ? ')' : ''}
                  </span>
                </div>

                {/* DBMS */}
                <div className="readiness-item theme-transition">
                  <div className="readiness-item-header">
                    <div className="item-name-group">
                      <Database size={16} className="item-icon" />
                      <span className="item-name">Database Management (DBMS)</span>
                    </div>
                    <span className={`item-percentage ${dbmsPct < 40 ? 'alert-percentage' : ''}`}>{dbmsPct}%</span>
                  </div>
                  <div className="metric-track">
                    <div className={`metric-fill ${dbmsPct < 40 ? 'alert-fill' : ''}`} style={{ width: `${dbmsPct}%` }} />
                  </div>
                  <span className={`item-sub ${dbmsPct < 40 ? 'alert-sub' : ''}`}>
                    {dbmsPct < 40 ? 'Needs Attention (' : ''}{stats.dbmsMasteredCount ?? 6}/10 topics mastered{dbmsPct < 40 ? ')' : ''}
                  </span>
                </div>

                {/* Computer Networks */}
                <div className="readiness-item theme-transition">
                  <div className="readiness-item-header">
                    <div className="item-name-group">
                      <Network size={16} className="item-icon" />
                      <span className="item-name">Computer Networks</span>
                    </div>
                    <span className={`item-percentage ${cnPct < 40 ? 'alert-percentage' : ''}`}>{cnPct}%</span>
                  </div>
                  <div className="metric-track">
                    <div className={`metric-fill alert-fill`} style={{ width: `${cnPct}%` }} />
                  </div>
                  <span className={`item-sub ${cnPct < 40 ? 'alert-sub' : ''}`}>
                    {cnPct < 40 ? 'Needs Attention (' : ''}{stats.cnMasteredCount ?? 2}/10 topics mastered{cnPct < 40 ? ')' : ''}
                  </span>
                </div>

                {/* Git */}
                <div className="readiness-item theme-transition">
                  <div className="readiness-item-header">
                    <div className="item-name-group">
                      <GitBranch size={16} className="item-icon" />
                      <span className="item-name">Git Lab & Collaboration</span>
                    </div>
                    <span className={`item-percentage ${gitPct < 40 ? 'alert-percentage' : ''}`}>{gitPct}%</span>
                  </div>
                  <div className="metric-track">
                    <div className={`metric-fill alert-fill`} style={{ width: `${gitPct}%` }} />
                  </div>
                  <span className={`item-sub ${gitPct < 40 ? 'alert-sub' : ''}`}>
                    {gitPct < 40 ? 'Needs Attention (' : ''}{stats.gitMissionsPassedCount ?? 2}/8 missions passed{gitPct < 40 ? ')' : ''}
                  </span>
                </div>

                {/* Linux */}
                <div className="readiness-item theme-transition">
                  <div className="readiness-item-header">
                    <div className="item-name-group">
                      <Terminal size={16} className="item-icon" />
                      <span className="item-name">Linux CLI & SysAdmin</span>
                    </div>
                    <span className={`item-percentage ${linuxPct < 40 ? 'alert-percentage' : ''}`}>{linuxPct}%</span>
                  </div>
                  <div className="metric-track">
                    <div className={`metric-fill alert-fill`} style={{ width: `${linuxPct}%` }} />
                  </div>
                  <span className={`item-sub ${linuxPct < 40 ? 'alert-sub' : ''}`}>
                    {linuxPct < 40 ? 'Needs Attention (' : ''}{stats.linuxMissionsPassedCount ?? 1}/8 missions passed{linuxPct < 40 ? ')' : ''}
                  </span>
                </div>

                {/* SQL */}
                <div className="readiness-item theme-transition">
                  <div className="readiness-item-header">
                    <div className="item-name-group">
                      <Database size={16} className="item-icon" />
                      <span className="item-name">SQL Query Optimization</span>
                    </div>
                    <span className={`item-percentage ${sqlPct < 40 ? 'alert-percentage' : ''}`}>{sqlPct}%</span>
                  </div>
                  <div className="metric-track">
                    <div className={`metric-fill`} style={{ width: `${sqlPct}%` }} />
                  </div>
                  <span className={`item-sub ${sqlPct < 40 ? 'alert-sub' : ''}`}>
                    {sqlPct < 40 ? 'Needs Attention (' : ''}{stats.sqlMissionsPassedCount ?? 4}/8 missions passed{sqlPct < 40 ? ')' : ''}
                  </span>
                </div>

              </div>

              {/* Weak Area Diagnostic Notice */}
              <div className="weak-area-alert-box theme-transition">
                <AlertTriangle size={18} className="alert-icon" />
                <div className="alert-text">
                  <strong>Diagnostic Recommendation:</strong>{' '}
                  {stats.diagnosticAlerts && stats.diagnosticAlerts.length > 0 ? (
                    stats.diagnosticAlerts.join(' • ')
                  ) : (
                    'Prioritize Computer Networks (TCP 3-Way Handshake & Congestion Control) and Linux Pipeline Commands (`grep | awk | sed`) before scheduling your first timed Mock Test.'
                  )}
                </div>
              </div>

            </section>
          );
        })()}

      </div>
    </main>
  );
}
