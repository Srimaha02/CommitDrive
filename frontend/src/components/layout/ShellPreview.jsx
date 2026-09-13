import React, { useState } from 'react';
import { 
  Cpu, 
  Database, 
  Network, 
  GitBranch, 
  Terminal as TerminalIcon, 
  Server, 
  ArrowRight, 
  CheckCircle, 
  HelpCircle, 
  Sparkles, 
  Clock, 
  Play, 
  RotateCw,
  Code2,
  FileQuestion,
  ChevronRight,
  Layers,
  Award,
  Lightbulb,
  Briefcase,
  BrainCircuit,
  Compass
} from 'lucide-react';
import './ShellPreview.css';

export default function ShellPreview({ activePath, onSwitchPath }) {
  const isLearning = activePath === 'learning';

  // Interactive 5-Step Concept Framework Stepper state
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  // Concept Framework Step Data
  const frameworkSteps = [
    {
      id: 1,
      name: 'What',
      subtitle: 'Definition & Core Mechanics',
      icon: Sparkles,
      tag: 'Step 1: Academic & Industry Definition',
      description: 'Zero fluff, crystal-clear conceptual definition. Understand the formal invariants, components, and mathematical/architectural models expected by senior interviewers.',
      sampleTitle: 'Example in Virtual Memory:',
      sampleBody: 'Virtual Memory is a memory management technique that creates an illusion of a very large uniform storage array by mapping virtual page addresses to physical frames via the MMU (Memory Management Unit).'
    },
    {
      id: 2,
      name: 'Why',
      subtitle: 'Engineering Rationale',
      icon: Lightbulb,
      tag: 'Step 2: Why Engineers Created It',
      description: 'Understand the foundational problems that led to this technology. Eliminates blind memorization by connecting design decisions to hardware limits, isolation needs, and latency tradeoffs.',
      sampleTitle: 'Example in Virtual Memory:',
      sampleBody: 'Without virtual memory, every program could read any physical RAM address (zero isolation), and multi-tasking would be impossible if total application footprints exceeded physical RAM size.'
    },
    {
      id: 3,
      name: 'Use Case',
      subtitle: 'Scale & Industry Implementations',
      icon: Briefcase,
      tag: 'Step 3: Real Production Deployments',
      description: 'How top tech companies (Uber, Netflix, Google) implement these concepts in high-throughput production distributed systems and Linux kernels.',
      sampleTitle: 'Example in Production Systems:',
      sampleBody: 'High-performance databases like PostgreSQL and Redis use `mmap()` (memory-mapped files) built on OS virtual memory to let the operating system manage disk paging automatically.'
    },
    {
      id: 4,
      name: 'Interview Q&A',
      subtitle: 'Placement Question Vault',
      icon: FileQuestion,
      tag: 'Step 4: Top Tech Rounds & Edge Cases',
      description: 'Frequently tested interview questions categorized by company tier. Includes model answers, edge case traps, and optimal trade-off explanations.',
      sampleTitle: 'Top Tier Screening Question:',
      sampleBody: '"What is the difference between Internal and External Fragmentation, and how does Paging prevent external fragmentation at the cost of slight internal fragmentation?"'
    },
    {
      id: 5,
      name: 'Flashcards',
      subtitle: 'Spaced Repetition Self-Test',
      icon: RotateCw,
      tag: 'Step 5: Active Recall & Muscle Memory',
      description: 'Interactive book-flip flashcards with self-assessment tracking ("Got it" vs "Review again"). Flags forgotten concepts for automated repetition.',
      sampleTitle: 'Active Recall Card Preview:',
      sampleBody: 'Front: "Explain the Working Set Model." Back: "Tracks referenced pages in window Δ to guarantee physical frames and prevent catastrophic page thrashing."'
    }
  ];

  // Interactive Flashcard preview state for Learning Path
  const [flashcardFlipped, setFlashcardFlipped] = useState(false);
  const [flashcardStatus, setFlashcardStatus] = useState(null);

  // Interactive Mini Terminal state for Practical Path
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalLogs, setTerminalLogs] = useState([
    { type: 'system', text: 'CommitDrive Practical Lab [Environment Ready]' },
    { type: 'system', text: 'Type "help", "git status", "ls -la", or "sql" to test the engine.' }
  ]);
  const [terminalMissionStatus, setTerminalMissionStatus] = useState('in-progress');

  // Handle simulated terminal execution
  const handleTerminalSubmit = (e) => {
    e.preventDefault();
    const cmd = terminalInput.trim();
    if (!cmd) return;

    const newLogs = [...terminalLogs, { type: 'prompt', text: `$ ${cmd}` }];

    if (cmd === 'clear') {
      setTerminalLogs([]);
      setTerminalInput('');
      return;
    } else if (cmd === 'help') {
      newLogs.push({
        type: 'output',
        text: 'Available test commands:\n  git status     - Check simulated repository state\n  git branch     - View active feature branches\n  ls -la         - Inspect virtual filesystem\n  sql            - Run mock query sandbox\n  clear          - Clear terminal logs'
      });
    } else if (/^git\s+status/i.test(cmd)) {
      newLogs.push({
        type: 'output',
        text: 'On branch main\nYour branch is up to date with \'origin/main\'.\n\nChanges to be committed:\n  (use "git restore --staged <file>..." to unstage)\n\tmodified:   kernel/scheduler.c\n\nUntracked files:\n\tdebug.log'
      });
      setTerminalMissionStatus('success');
    } else if (/^ls(\s+-la|\s+-al|\s+-l|\s+-a)?/i.test(cmd)) {
      newLogs.push({
        type: 'output',
        text: 'drwxr-xr-x  4 student  staff   128 Sep 13 16:45 .\ndrwxr-xr-x  3 student  staff    96 Sep 13 16:40 ..\n-rw-r--r--  1 student  staff  1420 Sep 13 16:42 README.md\n-rwxr-xr-x  1 student  staff   890 Sep 13 16:44 deploy.sh'
      });
    } else if (/^git\s+branch/i.test(cmd)) {
      newLogs.push({
        type: 'output',
        text: '* main\n  feat/virtual-memory\n  fix/deadlock-detection'
      });
    } else if (/^(select|sql)/i.test(cmd)) {
      newLogs.push({
        type: 'output',
        text: '+----+-------------------+------------+\n| id | name              | status     |\n+----+-------------------+------------+\n|  1 | Mikro Student     | Interview-Ready |\n|  2 | CommitDrive Bot   | Online     |\n+----+-------------------+------------+\n(2 rows affected in 0.04 ms)'
      });
      setTerminalMissionStatus('success');
    } else {
      newLogs.push({
        type: 'error',
        text: `bash: ${cmd}: command simulated. Try "git status" or type "help" for valid mission commands.`
      });
      setTerminalMissionStatus('hint');
    }

    setTerminalLogs(newLogs);
    setTerminalInput('');
  };

  const activeStep = frameworkSteps[activeStepIndex];

  return (
    <main className="shell-preview-area theme-transition">
      <div className="content-wrapper preview-container">

        {/* =================================================================
            LEARNING PATH ("STUDY CORNER") PREVIEW
            ================================================================= */}
        {isLearning ? (
          <div className="path-content learning-view animate-fadeIn">
            {/* Header / Hero */}
            <div className="hero-section">
              <div className="hero-pill theme-transition">
                <Sparkles size={14} className="hero-pill-icon" />
                <span>STUDY CORNER • THEORETICAL RIGOR</span>
              </div>
              <h1 className="hero-title">
                Master Core Computer Science for Top Product Companies
              </h1>
              <p className="hero-subtitle">
                Comprehensive 10-topic curricula for <strong>Operating Systems</strong>, <strong>DBMS</strong>, and <strong>Computer Networks</strong>. 
                Structured with our dynamic 5-step methodology and reinforced with spaced-repetition flashcards.
              </p>
            </div>

            {/* 3 Core Subjects Grid */}
            <div className="cards-grid subjects-grid">
              
              {/* Subject 1: OS */}
              <div className="subject-card theme-transition">
                <div className="subject-card-header">
                  <div className="subject-icon-box os-box">
                    <Cpu size={24} />
                  </div>
                  <div className="subject-tag">10 Core Topics</div>
                </div>
                <h2 className="subject-title">Operating Systems</h2>
                <p className="subject-desc">
                  Processes & Threads, CPU Scheduling, Virtual Memory & Paging, 
                  Deadlocks & Concurrency primitives (Semaphores, Mutexes, Spinlocks).
                </p>
                <div className="subject-footer">
                  <div className="progress-bar-track">
                    <div className="progress-bar-fill" style={{ width: '40%' }} />
                  </div>
                  <div className="progress-label-row">
                    <span>4 of 10 Completed</span>
                    <span className="accent-span">Next: Virtual Memory</span>
                  </div>
                </div>
              </div>

              {/* Subject 2: DBMS */}
              <div className="subject-card theme-transition">
                <div className="subject-card-header">
                  <div className="subject-icon-box dbms-box">
                    <Database size={24} />
                  </div>
                  <div className="subject-tag">10 Core Topics</div>
                </div>
                <h2 className="subject-title">Database Management</h2>
                <p className="subject-desc">
                  Relational Algebra, Normalization (1NF to BCNF), ACID Guarantees, 
                  B+ Tree Indexing, Concurrency Control, and Transaction Isolation levels.
                </p>
                <div className="subject-footer">
                  <div className="progress-bar-track">
                    <div className="progress-bar-fill" style={{ width: '60%' }} />
                  </div>
                  <div className="progress-label-row">
                    <span>6 of 10 Completed</span>
                    <span className="accent-span">Next: B+ Trees</span>
                  </div>
                </div>
              </div>

              {/* Subject 3: CN */}
              <div className="subject-card theme-transition">
                <div className="subject-card-header">
                  <div className="subject-icon-box cn-box">
                    <Network size={24} />
                  </div>
                  <div className="subject-tag">10 Core Topics</div>
                </div>
                <h2 className="subject-title">Computer Networks</h2>
                <p className="subject-desc">
                  OSI 7-Layer Architecture, TCP 3-Way Handshake & Flow Control, 
                  DNS Lifecycle, Subnetting & CIDR, HTTP/2/3, and WebSockets.
                </p>
                <div className="subject-footer">
                  <div className="progress-bar-track">
                    <div className="progress-bar-fill" style={{ width: '20%' }} />
                  </div>
                  <div className="progress-label-row">
                    <span>2 of 10 Completed</span>
                    <span className="accent-span">Next: TCP Congestion</span>
                  </div>
                </div>
              </div>

            </div>

            {/* =============================================================
                REDESIGNED DYNAMIC HORIZONTAL STEPPER FOR 5-STEP FRAMEWORK
                ============================================================= */}
            <section className="horizontal-stepper-section theme-transition">
              <div className="stepper-section-header">
                <div>
                  <div className="section-eyebrow">PEDAGOGICAL FRAMEWORK</div>
                  <h3 className="section-card-title">The 5-Step Topic Deep-Dive</h3>
                </div>
                <span className="stepper-click-hint">Click any step to inspect curriculum breakdown</span>
              </div>

              {/* Horizontal Stepper Track */}
              <div className="horizontal-stepper-track-wrapper">
                <div className="stepper-connecting-line" />
                <div className="horizontal-stepper-track">
                  {frameworkSteps.map((step, idx) => {
                    const StepIcon = step.icon;
                    const isActive = activeStepIndex === idx;
                    return (
                      <button
                        key={step.id}
                        type="button"
                        className={`stepper-node-btn ${isActive ? 'active' : ''} theme-transition`}
                        onClick={() => setActiveStepIndex(idx)}
                      >
                        <div className="node-icon-circle theme-transition">
                          <StepIcon size={18} />
                          <span className="node-number">{`0${step.id}`}</span>
                        </div>
                        <div className="node-text-col">
                          <span className="node-name">{step.name}</span>
                          <span className="node-sub">{step.subtitle}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Dynamic Step Detail Card */}
              <div className="active-step-showcase-panel theme-transition">
                <div className="showcase-left">
                  <div className="step-tag-row">
                    <span className="active-step-tag">{activeStep.tag}</span>
                    <span className="active-step-count">Step {activeStepIndex + 1} of 5</span>
                  </div>
                  <h4 className="showcase-heading">{activeStep.name} — {activeStep.subtitle}</h4>
                  <p className="showcase-desc">{activeStep.description}</p>
                  
                  <div className="stepper-nav-controls">
                    <button 
                      className="stepper-prev-btn theme-transition"
                      disabled={activeStepIndex === 0}
                      onClick={() => setActiveStepIndex(prev => Math.max(0, prev - 1))}
                    >
                      ← Previous
                    </button>
                    <button 
                      className="stepper-next-btn theme-transition"
                      disabled={activeStepIndex === frameworkSteps.length - 1}
                      onClick={() => setActiveStepIndex(prev => Math.min(frameworkSteps.length - 1, prev + 1))}
                    >
                      Next: {activeStepIndex < 4 ? frameworkSteps[activeStepIndex + 1].name : 'Finish'} →
                    </button>
                  </div>
                </div>

                <div className="showcase-right-sample theme-transition">
                  <div className="sample-box-badge">Curriculum Preview</div>
                  <h5 className="sample-title">{activeStep.sampleTitle}</h5>
                  <p className="sample-content">{activeStep.sampleBody}</p>
                </div>
              </div>
            </section>

            {/* Interactive Flashcard Demo Section */}
            <div className="flashcard-section-wrapper">
              <div className="flashcard-preview-container theme-transition">
                <div className="flashcard-header">
                  <div className="card-badge">LIVE 3D FLASHCARD DEMO</div>
                  <span className="card-meta">Topic: Virtual Memory • OS</span>
                </div>

                <div 
                  className={`flashcard-3d-wrapper ${flashcardFlipped ? 'flipped' : ''}`}
                  onClick={() => setFlashcardFlipped(!flashcardFlipped)}
                >
                  <div className="flashcard-face flashcard-front theme-transition">
                    <div className="face-header">
                      <span className="face-badge question-badge">QUESTION (Click to flip)</span>
                      <RotateCw size={16} className="flip-icon" />
                    </div>
                    <div className="face-content">
                      <p className="question-text">
                        "What causes Thrashing in an Operating System, and how does the OS Working Set Model prevent it?"
                      </p>
                    </div>
                    <div className="face-footer">
                      <span>💡 Tap card to reveal answer</span>
                    </div>
                  </div>

                  <div className="flashcard-face flashcard-back theme-transition">
                    <div className="face-header">
                      <span className="face-badge answer-badge">MODEL ANSWER</span>
                      <RotateCw size={16} className="flip-icon" />
                    </div>
                    <div className="face-content">
                      <p className="answer-text">
                        <strong>Thrashing</strong> occurs when a system spends more time paging (swapping pages between RAM and disk) than executing actual instructions, usually when total memory demands exceed available physical frames.
                      </p>
                      <p className="answer-subtext">
                        The <em>Working Set Model</em> tracks pages referenced in the most recent time window $\Delta$. If sum of working sets exceeds available frames, the OS suspends a low-priority process to restore balance.
                      </p>
                    </div>
                    <div className="face-footer buttons-footer" onClick={(e) => e.stopPropagation()}>
                      <button 
                        className={`feedback-btn review-btn ${flashcardStatus === 'review' ? 'selected' : ''}`}
                        onClick={() => setFlashcardStatus('review')}
                      >
                        Review Again
                      </button>
                      <button 
                        className={`feedback-btn gotit-btn ${flashcardStatus === 'gotit' ? 'selected' : ''}`}
                        onClick={() => setFlashcardStatus('gotit')}
                      >
                        Got It! ✓
                      </button>
                    </div>
                  </div>
                </div>

                {flashcardStatus && (
                  <div className="flashcard-status-toast">
                    {flashcardStatus === 'gotit' ? '🎉 Marked as Mastered! Scheduled for spaced repetition.' : '🔄 Flagged for review in 10 minutes.'}
                  </div>
                )}
              </div>
            </div>

          </div>
        ) : (
          /* =================================================================
             PRACTICAL PATH ("TERMINAL ZONE") PREVIEW
             ================================================================= */
          <div className="path-content practical-view animate-fadeIn">
            {/* Header / Hero */}
            <div className="hero-section">
              <div className="hero-pill terminal-pill theme-transition">
                <TerminalIcon size={14} className="hero-pill-icon" />
                <span>TERMINAL ZONE • HANDS-ON COMMAND LAB</span>
              </div>
              <h1 className="hero-title">
                Develop True Terminal Fluency for Production Systems
              </h1>
              <p className="hero-subtitle">
                Say goodbye to multiple-choice coding trivia. Solve story-based practical missions 
                directly inside a simulated terminal environment with regex validation, instant hints, 
                and timed mock examinations.
              </p>
            </div>

            {/* 3 Practical Modules Grid */}
            <div className="cards-grid modules-grid">
              
              {/* Module 1: Git */}
              <div className="module-card theme-transition">
                <div className="module-card-header">
                  <div className="module-icon-box git-box">
                    <GitBranch size={24} />
                  </div>
                  <div className="module-badge">6 Missions • 1 Mock</div>
                </div>
                <h2 className="module-title">Git Version Control</h2>
                <p className="module-desc">
                  Interactive staging, resolve merge conflicts, squash commits with rebase -i, 
                  detached HEAD recovery, and clean bisect debugging.
                </p>
                <div className="module-action-row">
                  <span className="mission-status-label">Mission 2: Conflict Resolution</span>
                  <ChevronRight size={16} className="module-arrow" />
                </div>
              </div>

              {/* Module 2: Linux */}
              <div className="module-card theme-transition">
                <div className="module-card-header">
                  <div className="module-icon-box linux-box">
                    <TerminalIcon size={24} />
                  </div>
                  <div className="module-badge">6 Missions • 1 Mock</div>
                </div>
                <h2 className="module-title">Linux CLI & SysAdmin</h2>
                <p className="module-desc">
                  File hierarchy navigation, pipeline composition (`grep`, `awk`, `sed`), 
                  file permissions (`chmod 755`), and process signals (`kill -9`).
                </p>
                <div className="module-action-row">
                  <span className="mission-status-label">Mission 1: Permissions Sandbox</span>
                  <ChevronRight size={16} className="module-arrow" />
                </div>
              </div>

              {/* Module 3: SQL */}
              <div className="module-card theme-transition">
                <div className="module-card-header">
                  <div className="module-icon-box sql-box">
                    <Database size={24} />
                  </div>
                  <div className="module-badge">6 Missions • 1 Mock</div>
                </div>
                <h2 className="module-title">SQL & Query Engine</h2>
                <p className="module-desc">
                  Complex multi-table JOINs, GROUP BY aggregations, window functions 
                  (`ROW_NUMBER`, `RANK`), subqueries, and EXPLAIN query plan analysis.
                </p>
                <div className="module-action-row">
                  <span className="mission-status-label">Mission 3: Analytical Window Funcs</span>
                  <ChevronRight size={16} className="module-arrow" />
                </div>
              </div>

            </div>

            {/* Terminal Sandbox & Dual Mode Showcase */}
            <div className="showcase-split-grid practical-split">
              
              {/* Left: Interactive Simulated Terminal */}
              <div className="terminal-widget-container theme-transition">
                <div className="terminal-widget-header">
                  <div className="terminal-dots">
                    <span className="dot dot-red" />
                    <span className="dot dot-yellow" />
                    <span className="dot dot-green" />
                  </div>
                  <span className="terminal-tab-title">commitdrive-sandbox ~ bash (v5.2)</span>
                  <span className="terminal-status-indicator">
                    {terminalMissionStatus === 'success' ? (
                      <span className="status-badge-amber">Success Flash ⚡</span>
                    ) : (
                      <span className="status-badge-live">Live Emulator</span>
                    )}
                  </span>
                </div>

                <div className="terminal-widget-body">
                  <div className="terminal-log-output">
                    {terminalLogs.map((log, index) => (
                      <div key={index} className={`terminal-log-line ${log.type}`}>
                        <pre>{log.text}</pre>
                      </div>
                    ))}
                  </div>

                  {/* Terminal Input Prompt */}
                  <form onSubmit={handleTerminalSubmit} className="terminal-input-row">
                    <span className="prompt-label">student@commitdrive:~$</span>
                    <input 
                      type="text" 
                      className="terminal-text-input" 
                      value={terminalInput}
                      onChange={(e) => setTerminalInput(e.target.value)}
                      placeholder="Type 'git status', 'ls -la', 'sql', or 'help'..."
                      autoFocus
                    />
                    <span className="cursor-blink" />
                  </form>
                </div>

                <div className="terminal-widget-footer">
                  <span>💡 Try executing <code>git status</code> or <code>help</code> to test regex validation engine</span>
                </div>
              </div>

              {/* Right: Modes Breakdown (Practice Mode vs Mock Test Mode) */}
              <div className="modes-breakdown-card theme-transition">
                <div className="section-eyebrow">PRACTICAL MODES</div>
                <h3 className="section-card-title">Two Training Disciplines</h3>

                <div className="mode-selection-box practice-box theme-transition">
                  <div className="mode-box-header">
                    <div className="mode-icon-wrapper">
                      <Play size={18} />
                    </div>
                    <div>
                      <h4 className="mode-box-title">Practice Mode (Story Missions)</h4>
                      <span className="mode-box-tag">Story-driven • Relaxed learning</span>
                    </div>
                  </div>
                  <p className="mode-box-desc">
                    Embark on real incident missions: "A production outage occurred due to an unmerged hotfix branch. Fix the rebase conflict and push safely." Regex validation checks commands step-by-step with progressive hints on failure.
                  </p>
                </div>

                <div className="mode-selection-box mock-box theme-transition">
                  <div className="mode-box-header">
                    <div className="mode-icon-wrapper mock-icon-wrapper">
                      <Clock size={18} />
                    </div>
                    <div>
                      <h4 className="mode-box-title">Mock Test Mode (Timed Exam)</h4>
                      <span className="mode-box-tag mock-tag">Timed 45 Mins • Zero hints</span>
                    </div>
                  </div>
                  <p className="mode-box-desc">
                    Simulates actual company placement screening assessments. Timed countdown, randomized mixed tasks across Git/Linux/SQL, automatic submission, followed by a personalized <strong>Weak-Area Diagnostic Report</strong>.
                  </p>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </main>
  );
}
