import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Flame, 
  BookOpen, 
  Terminal, 
  ArrowRight, 
  CheckCircle2, 
  Cpu, 
  GitBranch, 
  Database, 
  Network, 
  AlertTriangle, 
  Play, 
  TrendingUp, 
  Target 
} from 'lucide-react';
import { dashboardApi } from '../../services/api';
import { osTopics } from '../../data/osTopics';
import { dbmsTopics } from '../../data/dbmsTopics';
import { cnTopics } from '../../data/cnTopics';
import { practicalMissions } from '../../data/practicalCurriculum';
import './Dashboard.css';

export default function Dashboard({ currentUser, onNavigate }) {
  const student = currentUser || {
    name: 'Student',
    role: 'SDE Aspirant',
    targetYear: '2026',
    streak: 0
  };

  const [stats, setStats] = useState({
    overallReadinessPct: 0,
    streak: currentUser?.streak ?? 0,
    osMasteredCount: 0,
    dbmsMasteredCount: 0,
    cnMasteredCount: 0,
    gitMissionsPassedCount: 0,
    linuxMissionsPassedCount: 0,
    sqlMissionsPassedCount: 0,
    diagnosticAlerts: []
  });

  useEffect(() => {
    let isMounted = true;
    dashboardApi.getStats().then(res => {
      if (isMounted && res && res.data) {
        setStats({
          overallReadinessPct: res.data.overallReadinessPct ?? 0,
          streak: res.data.streak ?? (currentUser?.streak ?? 0),
          osMasteredCount: res.data.osMasteredCount ?? 0,
          dbmsMasteredCount: res.data.dbmsMasteredCount ?? 0,
          cnMasteredCount: res.data.cnMasteredCount ?? 0,
          gitMissionsPassedCount: res.data.gitMissionsPassedCount ?? 0,
          linuxMissionsPassedCount: res.data.linuxMissionsPassedCount ?? 0,
          sqlMissionsPassedCount: res.data.sqlMissionsPassedCount ?? 0,
          diagnosticAlerts: res.data.diagnosticAlerts || []
        });
      }
    }).catch(() => {});
    return () => { isMounted = false; };
  }, [currentUser]);

  // Dynamic 7-day practice streak bar based on calendar week (Mon - Sun)
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const todayJsDay = new Date().getDay(); // 0 is Sun, 1 is Mon...
  const todayIndex = todayJsDay === 0 ? 6 : todayJsDay - 1; // 0 for Mon, ..., 6 for Sun
  const activeStreak = stats.streak ?? 0;

  const weekDays = dayNames.map((name, idx) => {
    const isToday = idx === todayIndex;
    const isCompleted = activeStreak > 0 && idx <= todayIndex && (todayIndex - idx) < activeStreak;
    let label = '';
    if (isToday) {
      label = activeStreak > 0 ? 'Today (Active)' : 'Today';
    } else if (isCompleted) {
      label = 'Active';
    }
    return {
      day: name,
      completed: isCompleted,
      isToday,
      label
    };
  });

  // Determine Theory continue-learning card
  const osCount = stats.osMasteredCount ?? 0;
  const dbmsCount = stats.dbmsMasteredCount ?? 0;
  const cnCount = stats.cnMasteredCount ?? 0;

  let activeTheorySubject = 'Operating Systems';
  let ActiveTheoryIcon = Cpu;
  let activeTheoryTopicNumber = 1;
  let activeTheoryTitle = 'Process Lifecycle, States & PCB';
  let activeTheoryDesc = 'Understand process memory layout (Text, Data, Heap, Stack), state transitions (Ready, Running, Waiting), and Process Control Block metadata.';
  let activeTheorySubjectCount = osCount;

  if (osCount < 10) {
    activeTheorySubject = 'Operating Systems';
    ActiveTheoryIcon = Cpu;
    activeTheoryTopicNumber = osCount + 1;
    activeTheorySubjectCount = osCount;
    const topic = osTopics[osCount] || osTopics[0];
    if (topic) {
      activeTheoryTitle = topic.title;
      activeTheoryDesc = topic.summary || topic.explanation || activeTheoryDesc;
    }
  } else if (dbmsCount < 10) {
    activeTheorySubject = 'Database Management (DBMS)';
    ActiveTheoryIcon = Database;
    activeTheoryTopicNumber = dbmsCount + 1;
    activeTheorySubjectCount = dbmsCount;
    const topic = dbmsTopics[dbmsCount] || dbmsTopics[0];
    if (topic) {
      activeTheoryTitle = topic.title;
      activeTheoryDesc = topic.summary || topic.explanation || 'Master relational normalization, indexing, and transaction management.';
    }
  } else if (cnCount < 10) {
    activeTheorySubject = 'Computer Networks';
    ActiveTheoryIcon = Network;
    activeTheoryTopicNumber = cnCount + 1;
    activeTheorySubjectCount = cnCount;
    const topic = cnTopics[cnCount] || cnTopics[0];
    if (topic) {
      activeTheoryTitle = topic.title;
      activeTheoryDesc = topic.summary || topic.explanation || 'Master OSI/TCP-IP stacks, routing, and transport-layer congestion control.';
    }
  } else {
    activeTheorySubject = 'Operating Systems';
    ActiveTheoryIcon = Cpu;
    activeTheoryTopicNumber = 10;
    activeTheorySubjectCount = 10;
    const topic = osTopics[9] || osTopics[0];
    activeTheoryTitle = topic.title;
    activeTheoryDesc = 'All 30 core theory curriculum topics mastered across OS, DBMS, and CN!';
  }

  const theoryProgressPct = Math.min(100, Math.round((activeTheorySubjectCount / 10) * 100));

  // Determine Practical continue-learning card
  const gitCount = stats.gitMissionsPassedCount ?? 0;
  const linuxCount = stats.linuxMissionsPassedCount ?? 0;
  const sqlCount = stats.sqlMissionsPassedCount ?? 0;

  let activePracticalModule = 'Git Version Control';
  let activePracticalIconClass = '';
  let ActivePracticalIcon = GitBranch;
  let activePracticalMissionNumber = 1;
  let activePracticalPassedCount = gitCount;
  let activePracticalTitle = 'Mission 1: Initializing a Repository & First Commit';
  let activePracticalDesc = 'Initialize a fresh local repository with git init, stage project files, and write an atomic initial commit message.';

  if (gitCount < 8) {
    activePracticalModule = 'Git Version Control';
    ActivePracticalIcon = GitBranch;
    activePracticalIconClass = '';
    activePracticalMissionNumber = gitCount + 1;
    activePracticalPassedCount = gitCount;
    const mission = (practicalMissions.git && practicalMissions.git[gitCount]) || null;
    if (mission) {
      activePracticalTitle = mission.title;
      activePracticalDesc = mission.storyContext || mission.objective || activePracticalDesc;
    }
  } else if (linuxCount < 8) {
    activePracticalModule = 'Linux Shell & Systems';
    ActivePracticalIcon = Terminal;
    activePracticalIconClass = 'practical-micro';
    activePracticalMissionNumber = linuxCount + 1;
    activePracticalPassedCount = linuxCount;
    const mission = (practicalMissions.linux && practicalMissions.linux[linuxCount]) || null;
    if (mission) {
      activePracticalTitle = mission.title;
      activePracticalDesc = mission.storyContext || mission.objective || 'Master Linux shell pipelines and permissions.';
    }
  } else if (sqlCount < 8) {
    activePracticalModule = 'SQL Query Engineering';
    ActivePracticalIcon = Database;
    activePracticalIconClass = 'practical-micro';
    activePracticalMissionNumber = sqlCount + 1;
    activePracticalPassedCount = sqlCount;
    const mission = (practicalMissions.sql && practicalMissions.sql[sqlCount]) || null;
    if (mission) {
      activePracticalTitle = mission.title;
      activePracticalDesc = mission.storyContext || mission.objective || 'Master SQL aggregation and relational joins.';
    }
  } else {
    activePracticalModule = 'Git Version Control';
    ActivePracticalIcon = GitBranch;
    activePracticalMissionNumber = 8;
    activePracticalPassedCount = 8;
    activePracticalTitle = 'All Practical Missions Passed!';
    activePracticalDesc = 'You have mastered all interactive terminal missions across Git, Linux, and SQL!';
  }

  const practicalProgressPct = Math.min(100, Math.round((activePracticalPassedCount / 8) * 100));

  // Placement Readiness Matrix calculation
  const osPct = Math.min(100, Math.round(((stats.osMasteredCount ?? 0) / 10) * 100));
  const dbmsPct = Math.min(100, Math.round(((stats.dbmsMasteredCount ?? 0) / 10) * 100));
  const cnPct = Math.min(100, Math.round(((stats.cnMasteredCount ?? 0) / 10) * 100));
  const gitPct = Math.min(100, Math.round(((stats.gitMissionsPassedCount ?? 0) / 8) * 100));
  const linuxPct = Math.min(100, Math.round(((stats.linuxMissionsPassedCount ?? 0) / 8) * 100));
  const sqlPct = Math.min(100, Math.round(((stats.sqlMissionsPassedCount ?? 0) / 8) * 100));
  const overallPct = stats.overallReadinessPct ?? 0;

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
              Your placement preparation is <strong className="readiness-percent">{overallPct}% ready</strong> for upcoming campus drives and technical screening rounds.
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
                <Flame size={22} className={activeStreak > 0 ? 'flame-pulse' : ''} />
              </div>
              <div>
                <h3 className="streak-heading">
                  {activeStreak > 0 ? `${activeStreak}-Day Study Streak!` : 'Start Your Study Streak!'}
                </h3>
                <p className="streak-sub">
                  {activeStreak > 0 
                    ? 'Practice today in either Study Corner or Terminal Zone to maintain streak multiplier.' 
                    : 'Complete any theory lesson or terminal mission today to start your streak.'}
                </p>
              </div>
            </div>
            <div className="streak-multiplier-badge">
              <span>{activeStreak > 0 ? '1.5x Knowledge Retention' : 'Streak Booster'}</span>
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
                {item.label && <span className={`day-sub-label ${item.isToday ? 'current-label' : ''}`}>{item.label}</span>}
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
                <span className="topic-num-pill">Topic {activeTheoryTopicNumber} of 10</span>
              </div>

              <div className="continue-card-body">
                <div className="subject-micro-tag">
                  <ActiveTheoryIcon size={14} />
                  <span>{activeTheorySubject}</span>
                </div>
                <h3 className="continue-topic-title">{activeTheoryTitle}</h3>
                <p className="continue-topic-desc">{activeTheoryDesc}</p>

                {/* Progress bar */}
                <div className="card-progress-block">
                  <div className="progress-labels">
                    <span>Topic Progress</span>
                    <strong>{theoryProgressPct}% Completed</strong>
                  </div>
                  <div className="continue-bar-track">
                    <div className="continue-bar-fill learning-fill" style={{ width: `${theoryProgressPct}%` }} />
                  </div>
                </div>
              </div>

              <div className="continue-card-bottom">
                <span className="meta-left">{activeTheorySubjectCount} of 10 Topics Mastered</span>
                <button 
                  className="resume-btn learning-btn theme-transition"
                  onClick={() => onNavigate('learning')}
                >
                  <span>{activeTheorySubjectCount === 0 ? 'Start Lesson' : 'Resume Lesson'}</span>
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
                <span className="topic-num-pill practical-pill">Mission {activePracticalMissionNumber} of 8</span>
              </div>

              <div className="continue-card-body">
                <div className={`subject-micro-tag ${activePracticalIconClass}`}>
                  <ActivePracticalIcon size={14} />
                  <span>{activePracticalModule}</span>
                </div>
                <h3 className="continue-topic-title">{activePracticalTitle}</h3>
                <p className="continue-topic-desc">{activePracticalDesc}</p>

                {/* Progress bar */}
                <div className="card-progress-block">
                  <div className="progress-labels">
                    <span>Module Progress</span>
                    <strong>{activePracticalPassedCount} of 8 Missions Passed</strong>
                  </div>
                  <div className="continue-bar-track">
                    <div className="continue-bar-fill practical-fill" style={{ width: `${practicalProgressPct}%` }} />
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
                  <span>{activePracticalPassedCount === 0 ? 'Start Hands-on Lab' : 'Open Terminal Zone'}</span>
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
              <span>Overall Readiness: <strong>{overallPct}%</strong></span>
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
                {osPct < 40 ? 'Needs Attention (' : ''}{stats.osMasteredCount ?? 0}/10 topics mastered{osPct < 40 ? ')' : ''}
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
                {dbmsPct < 40 ? 'Needs Attention (' : ''}{stats.dbmsMasteredCount ?? 0}/10 topics mastered{dbmsPct < 40 ? ')' : ''}
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
                <div className={`metric-fill ${cnPct < 40 ? 'alert-fill' : ''}`} style={{ width: `${cnPct}%` }} />
              </div>
              <span className={`item-sub ${cnPct < 40 ? 'alert-sub' : ''}`}>
                {cnPct < 40 ? 'Needs Attention (' : ''}{stats.cnMasteredCount ?? 0}/10 topics mastered{cnPct < 40 ? ')' : ''}
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
                <div className={`metric-fill ${gitPct < 40 ? 'alert-fill' : ''}`} style={{ width: `${gitPct}%` }} />
              </div>
              <span className={`item-sub ${gitPct < 40 ? 'alert-sub' : ''}`}>
                {gitPct < 40 ? 'Needs Attention (' : ''}{stats.gitMissionsPassedCount ?? 0}/8 missions passed{gitPct < 40 ? ')' : ''}
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
                <div className={`metric-fill ${linuxPct < 40 ? 'alert-fill' : ''}`} style={{ width: `${linuxPct}%` }} />
              </div>
              <span className={`item-sub ${linuxPct < 40 ? 'alert-sub' : ''}`}>
                {linuxPct < 40 ? 'Needs Attention (' : ''}{stats.linuxMissionsPassedCount ?? 0}/8 missions passed{linuxPct < 40 ? ')' : ''}
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
                <div className={`metric-fill ${sqlPct < 40 ? 'alert-fill' : ''}`} style={{ width: `${sqlPct}%` }} />
              </div>
              <span className={`item-sub ${sqlPct < 40 ? 'alert-sub' : ''}`}>
                {sqlPct < 40 ? 'Needs Attention (' : ''}{stats.sqlMissionsPassedCount ?? 0}/8 missions passed{sqlPct < 40 ? ')' : ''}
              </span>
            </div>

          </div>

          {/* Diagnostic Alert Box */}
          <div className="weak-area-alert-box theme-transition">
            <AlertTriangle size={18} className="alert-icon" />
            <div className="alert-text">
              <strong>Diagnostic Recommendation:</strong>{' '}
              {stats.diagnosticAlerts && stats.diagnosticAlerts.length > 0 ? (
                stats.diagnosticAlerts.join(' • ')
              ) : (
                'Begin your preparation by completing Operating Systems topics in Study Corner or Git missions in Terminal Zone.'
              )}
            </div>
          </div>

        </section>

      </div>
    </main>
  );
}
