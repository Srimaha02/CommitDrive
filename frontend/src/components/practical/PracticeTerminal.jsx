import React, { useState, useEffect, useRef } from 'react';
import { 
  Terminal as TerminalIcon, 
  CheckCircle2, 
  Lock, 
  Play, 
  HelpCircle, 
  RotateCw, 
  ChevronRight, 
  Sparkles, 
  AlertCircle,
  Lightbulb,
  ArrowRight,
  ShieldAlert,
  Code2,
  FolderTree,
  Unlock,
  KeyRound,
  Copy,
  Check
} from 'lucide-react';
import { getModuleMissions, getPracticalModule } from '../../data/practicalCurriculum';

export default function PracticeTerminal({ moduleId, completedMissions, onCompleteMission }) {
  const currentModule = getPracticalModule(moduleId);
  const missions = getModuleMissions(moduleId);

  // Active mission state (defaults to first incomplete mission, or first mission)
  const [activeMissionId, setActiveMissionId] = useState(() => {
    const firstIncomplete = missions.find(m => !completedMissions.includes(m.id));
    return firstIncomplete ? firstIncomplete.id : missions[0]?.id || 'git-1';
  });

  const activeMission = missions.find(m => m.id === activeMissionId) || missions[0];

  // Terminal input & logs state
  const [terminalInput, setTerminalInput] = useState('');
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyPointer, setHistoryPointer] = useState(-1);
  const [terminalLogs, setTerminalLogs] = useState([]);
  const [showHint, setShowHint] = useState(false);
  const [hintIndex, setHintIndex] = useState(0);

  // Failed attempts & solution unlock state (fallback after 3 failed attempts)
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isAnswerUnlocked, setIsAnswerUnlocked] = useState(false);
  const [copiedSolution, setCopiedSolution] = useState(false);

  // Reference for auto-scrolling terminal to bottom
  const logsEndRef = useRef(null);
  const inputRef = useRef(null);

  // Load initial logs whenever active mission changes
  useEffect(() => {
    if (activeMission) {
      setTerminalLogs([
        ...(activeMission.initialLogs || []),
        { 
          type: 'system', 
          text: `Type the target command below to complete: ${activeMission.title}` 
        }
      ]);
      setShowHint(false);
      setHintIndex(0);
      setTerminalInput('');
      setFailedAttempts(0);
      setIsAnswerUnlocked(false);
      setCopiedSolution(false);
    }
  }, [activeMissionId, moduleId]);

  // Auto-scroll terminal on new log entry
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalLogs]);

  // Auto-focus terminal input on mission switch
  useEffect(() => {
    inputRef.current?.focus();
  }, [activeMissionId]);

  // Format the prompt text based on module
  const getPromptPrefix = () => {
    if (moduleId === 'sql') {
      return 'mysql> ';
    }
    if (moduleId === 'git') {
      const branchName = activeMission.order >= 4 ? 'feature-login' : 'main';
      return `student@commitdrive:~/codebase (${branchName})$ `;
    }
    return 'student@commitdrive-prod:/var/www$ ';
  };

  // Helper to insert command into terminal and focus
  const insertCommandIntoTerminal = (cmd) => {
    setTerminalInput(cmd);
    inputRef.current?.focus();
  };

  // Handle Command Submission
  const handleCommandSubmit = (e) => {
    e.preventDefault();
    const rawInput = terminalInput.trim();
    if (!rawInput) return;

    // Add to command history
    setCommandHistory(prev => [rawInput, ...prev]);
    setHistoryPointer(-1);

    // Record user command in log
    const userLog = {
      type: 'input',
      prompt: getPromptPrefix(),
      text: rawInput
    };

    // Handle Built-in Utility Commands
    if (rawInput.toLowerCase() === 'clear') {
      setTerminalLogs([]);
      setTerminalInput('');
      return;
    }

    if (rawInput.toLowerCase() === 'help') {
      setTerminalLogs(prev => [
        ...prev,
        userLog,
        { type: 'info', text: 'CommitDrive Simulated Terminal Utilities:' },
        { type: 'output', text: '  clear       - Clear the terminal screen' },
        { type: 'output', text: '  hint        - Display a contextual mission hint' },
        { type: 'output', text: '  solution    - Unlock full answer and explanation (after 3 attempts)' },
        { type: 'output', text: '  reset       - Reset the current mission logs' },
        { type: 'output', text: '  status      - Display current mission objective' }
      ]);
      setTerminalInput('');
      return;
    }

    if (rawInput.toLowerCase() === 'hint') {
      setShowHint(true);
      setTerminalLogs(prev => [
        ...prev,
        userLog,
        { type: 'warning', text: `💡 ${activeMission.hints[hintIndex] || activeMission.hints[0]}` }
      ]);
      setTerminalInput('');
      return;
    }

    if (rawInput.toLowerCase() === 'solution' || rawInput.toLowerCase() === 'answer') {
      if (failedAttempts >= 3 || isAnswerUnlocked) {
        setIsAnswerUnlocked(true);
        setTerminalLogs(prev => [
          ...prev,
          userLog,
          {
            type: 'solution-unlock',
            title: 'Full Solution Unlocked',
            targetCommand: activeMission.targetCommand,
            explanation: activeMission.explanationOnSuccess,
            text: `🔓 Full Solution: ${activeMission.targetCommand}\n\nWhy this works:\n${activeMission.explanationOnSuccess}`
          }
        ]);
      } else {
        setTerminalLogs(prev => [
          ...prev,
          userLog,
          { 
            type: 'warning', 
            text: `🔒 Full solution unlocks automatically after 3 failed attempts (Current: ${failedAttempts}/3). Try your best with hints first!` 
          }
        ]);
      }
      setTerminalInput('');
      return;
    }

    if (rawInput.toLowerCase() === 'reset') {
      setTerminalLogs([
        ...(activeMission.initialLogs || []),
        { type: 'system', text: 'Terminal reset. Ready for input.' }
      ]);
      setTerminalInput('');
      return;
    }

    // Validate command against mission expected regex patterns
    const isMatch = activeMission.expectedRegexes.some(regex => regex.test(rawInput));

    if (isMatch) {
      // SUCCESS: Command Validated
      const isAlreadyCompleted = completedMissions.includes(activeMission.id);
      if (!isAlreadyCompleted) {
        onCompleteMission(activeMission.id, failedAttempts + 1, isAnswerUnlocked);
      }

      const successLogs = [
        userLog,
        ...(activeMission.successOutput?.map(text => ({ type: 'output', text })) || []),
        { 
          type: 'success', 
          text: `✔ MISSION COMPLETED: ${activeMission.title}!` 
        },
        { 
          type: 'explanation', 
          text: `✨ What just happened under the hood:\n${activeMission.explanationOnSuccess}` 
        }
      ];

      // Find next mission if available
      const currentIndex = missions.findIndex(m => m.id === activeMission.id);
      if (currentIndex < missions.length - 1) {
        const nextMission = missions[currentIndex + 1];
        successLogs.push({
          type: 'info',
          text: `👉 Next Mission Unlocked: "${nextMission.title}". Click below or choose it in the sidebar to advance.`
        });
      }

      setTerminalLogs(prev => [...prev, ...successLogs]);
      setTerminalInput('');
    } else {
      // FAILURE: Command did not match expected regex
      const newAttempts = failedAttempts + 1;
      setFailedAttempts(newAttempts);

      if (newAttempts >= 3) {
        // Unlock full answer fallback after 3 failed attempts!
        setIsAnswerUnlocked(true);
        const solutionLogs = [
          userLog,
          { 
            type: 'error', 
            text: `command not recognized: "${rawInput}" (Attempt ${newAttempts} failed)` 
          },
          {
            type: 'solution-unlock',
            title: '🔓 Full Solution Unlocked (After 3 Failed Attempts)',
            targetCommand: activeMission.targetCommand,
            explanation: activeMission.explanationOnSuccess,
            text: `Target Command: ${activeMission.targetCommand}\nWhy this works: ${activeMission.explanationOnSuccess}`
          }
        ];
        setTerminalLogs(prev => [...prev, ...solutionLogs]);
      } else {
        const failureHint = activeMission.hints[hintIndex] || activeMission.hints[0];
        setTerminalLogs(prev => [
          ...prev,
          userLog,
          { 
            type: 'error', 
            text: `command not recognized or syntax incomplete: "${rawInput}" (Attempt ${newAttempts} of 3)` 
          },
          { 
            type: 'warning', 
            text: `💡 Hint: ${failureHint}${newAttempts === 2 ? ' (⚠️ 1 more failed attempt unlocks the full answer & explanation)' : ''}` 
          }
        ]);
        // Advance hint index for next retry
        setHintIndex(prev => (prev + 1) % activeMission.hints.length);
      }
      setTerminalInput('');
    }
  };

  // Handle Command History via Up/Down Arrows
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0 && historyPointer < commandHistory.length - 1) {
        const nextPointer = historyPointer + 1;
        setHistoryPointer(nextPointer);
        setTerminalInput(commandHistory[nextPointer]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyPointer > 0) {
        const nextPointer = historyPointer - 1;
        setHistoryPointer(nextPointer);
        setTerminalInput(commandHistory[nextPointer]);
      } else if (historyPointer === 0) {
        setHistoryPointer(-1);
        setTerminalInput('');
      }
    }
  };

  // Find next mission in sequence
  const currentMissionIndex = missions.findIndex(m => m.id === activeMission.id);
  const nextMission = currentMissionIndex < missions.length - 1 ? missions[currentMissionIndex + 1] : null;

  return (
    <div className="practice-terminal-layout theme-transition">
      
      {/* =====================================================================
          1. Mission Tracker Sidebar
          ===================================================================== */}
      <aside className="mission-sidebar theme-transition">
        <div className="mission-sidebar-header">
          <div className="mission-sidebar-badge">
            <FolderTree size={14} />
            <span>Story Mission Sequence</span>
          </div>
          <span className="mission-count-label">8 Progressive Hands-On Labs</span>
        </div>

        <div className="mission-list-items">
          {missions.map((mission, idx) => {
            const isCompleted = completedMissions.includes(mission.id);
            const isSelected = activeMissionId === mission.id;
            // A mission is locked if the previous mission is not completed (except Mission 1)
            const isLocked = idx > 0 && !completedMissions.includes(missions[idx - 1].id) && !isCompleted;

            return (
              <button
                key={mission.id}
                disabled={isLocked}
                className={`mission-item-btn ${isSelected ? 'selected' : ''} ${isCompleted ? 'completed' : ''} ${isLocked ? 'locked' : ''} theme-transition`}
                onClick={() => setActiveMissionId(mission.id)}
              >
                <div className="mission-status-icon">
                  {isCompleted ? (
                    <CheckCircle2 size={15} className="status-completed-icon" />
                  ) : isLocked ? (
                    <Lock size={13} className="status-locked-icon" />
                  ) : (
                    <span className="mission-num-badge">{idx + 1}</span>
                  )}
                </div>

                <div className="mission-item-text">
                  <span className="mission-item-title">{mission.title}</span>
                  <span className={`mission-diff-tag ${mission.difficulty.toLowerCase()}`}>
                    {mission.difficulty}
                  </span>
                </div>

                {isSelected && <ChevronRight size={14} className="mission-selected-arrow" />}
              </button>
            );
          })}
        </div>

        {/* Sidebar Footer Progress */}
        <div className="mission-sidebar-footer">
          <div className="mission-footer-stats">
            <span>{currentModule.shortName} Mastery</span>
            <strong>
              {missions.filter(m => completedMissions.includes(m.id)).length} / {missions.length} Done
            </strong>
          </div>
          <div className="mission-footer-progress-track">
            <div 
              className="mission-footer-progress-fill" 
              style={{ width: `${(missions.filter(m => completedMissions.includes(m.id)).length / missions.length) * 100}%` }}
            />
          </div>
        </div>
      </aside>

      {/* =====================================================================
          2. Main Mission Briefing & Interactive Terminal Canvas
          ===================================================================== */}
      <main className="terminal-main-canvas theme-transition">
        
        {/* Mission Briefing Card */}
        <div className="mission-briefing-card theme-transition">
          <div className="briefing-header-row">
            <div>
              <span className="briefing-eyebrow">Mission 0{activeMission.order} • Story Context</span>
              <h2 className="briefing-title">{activeMission.title}</h2>
            </div>
            
            <div className="briefing-action-buttons">
              {failedAttempts > 0 && (
                <div className={`briefing-attempt-indicator ${failedAttempts >= 3 ? 'unlocked' : ''}`}>
                  {failedAttempts >= 3 ? (
                    <>
                      <Unlock size={12} />
                      <span>Solution Unlocked</span>
                    </>
                  ) : (
                    <span>Failed Attempts: {failedAttempts}/3</span>
                  )}
                </div>
              )}

              {(isAnswerUnlocked || failedAttempts >= 3) && (
                <button 
                  className={`briefing-btn solution-trigger-btn ${isAnswerUnlocked ? 'active' : ''} theme-transition`}
                  onClick={() => setIsAnswerUnlocked(!isAnswerUnlocked)}
                  title="Toggle full unlocked solution"
                >
                  <KeyRound size={13} />
                  <span>{isAnswerUnlocked ? 'Hide Solution' : 'View Solution'}</span>
                </button>
              )}

              <button 
                className={`briefing-btn hint-btn ${showHint ? 'active' : ''} theme-transition`}
                onClick={() => setShowHint(!showHint)}
                title="View pedagogical hint"
              >
                <Lightbulb size={14} />
                <span>{showHint ? 'Hide hint' : 'Need a hint?'}</span>
              </button>
              
              <button 
                className="briefing-btn reset-btn theme-transition"
                onClick={() => {
                  setTerminalLogs([
                    ...(activeMission.initialLogs || []),
                    { type: 'system', text: 'Terminal reset. Ready for input.' }
                  ]);
                  inputRef.current?.focus();
                }}
                title="Reset terminal output"
              >
                <RotateCw size={13} />
                <span>Reset</span>
              </button>
            </div>
          </div>

          <p className="briefing-story-text">{activeMission.storyContext}</p>

          <div className="briefing-objective-box">
            <strong className="objective-label">Objective:</strong>
            <span className="objective-text">{activeMission.objective}</span>
          </div>

          {/* Expandable Hint Callout */}
          {showHint && (
            <div className="mission-hint-callout animate-fadeIn">
              <Lightbulb size={16} className="hint-icon" />
              <div className="hint-content">
                <strong>Pedagogical Hint:</strong>
                <p>{activeMission.hints[hintIndex] || activeMission.hints[0]}</p>
                {failedAttempts < 3 && (
                  <span className="hint-sub-attempt">
                    {3 - failedAttempts} more failed {3 - failedAttempts === 1 ? 'attempt' : 'attempts'} will unlock the full solution & explanation.
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Fallback Unlocked Solution Callout (After 3 Failed Attempts) */}
          {(isAnswerUnlocked || failedAttempts >= 3) && (
            <div className="mission-solution-callout animate-fadeIn theme-transition">
              <div className="solution-callout-top">
                <div className="solution-badge-title">
                  <Unlock size={16} className="solution-unlock-icon" />
                  <strong>Full Answer Unlocked (3 Attempts Fallback)</strong>
                </div>
                <div className="solution-callout-actions">
                  <button 
                    className="sol-action-btn copy-btn theme-transition"
                    onClick={() => {
                      navigator.clipboard?.writeText(activeMission.targetCommand);
                      setCopiedSolution(true);
                      setTimeout(() => setCopiedSolution(false), 2000);
                    }}
                  >
                    {copiedSolution ? <Check size={13} /> : <Copy size={13} />}
                    <span>{copiedSolution ? 'Copied!' : 'Copy'}</span>
                  </button>

                  <button 
                    className="sol-action-btn insert-btn theme-transition"
                    onClick={() => insertCommandIntoTerminal(activeMission.targetCommand)}
                  >
                    <Code2 size={13} />
                    <span>Insert into Terminal</span>
                  </button>
                </div>
              </div>

              <div className="solution-code-container">
                <span className="code-label">Target Command:</span>
                <code className="solution-cmd-text">{activeMission.targetCommand}</code>
              </div>

              <div className="solution-pedagogical-box">
                <strong className="pedagogical-label">Why This Command Works Under The Hood:</strong>
                <p className="pedagogical-desc">{activeMission.explanationOnSuccess}</p>
              </div>
            </div>
          )}
        </div>

        {/* ===================================================================
            Simulated Terminal Box
            =================================================================== */}
        <div className="terminal-shell-box theme-transition" onClick={() => inputRef.current?.focus()}>
          
          {/* Terminal Window Chrome Titlebar */}
          <div className="terminal-titlebar">
            <div className="terminal-window-controls">
              <span className="control-dot dot-red" />
              <span className="control-dot dot-yellow" />
              <span className="control-dot dot-green" />
            </div>

            <div className="terminal-title-center">
              <TerminalIcon size={13} />
              <span>{currentModule.name} — Interactive Terminal Emulator</span>
            </div>

            <span className="terminal-shell-tag">bash / v2.4</span>
          </div>

          {/* Terminal Log Output Body */}
          <div className="terminal-logs-window">
            {terminalLogs.map((log, lIdx) => (
              <div key={lIdx} className={`terminal-log-entry entry-${log.type}`}>
                {log.type === 'input' ? (
                  <div className="log-input-line">
                    <span className="log-prompt">{log.prompt}</span>
                    <span className="log-command-text">{log.text}</span>
                  </div>
                ) : log.type === 'explanation' ? (
                  <div className="log-explanation-card">
                    <pre className="explanation-pre">{log.text}</pre>
                  </div>
                ) : log.type === 'solution-unlock' ? (
                  <div className="log-solution-entry animate-fadeIn">
                    <div className="log-sol-header">
                      <Unlock size={14} className="sol-icon-gold" />
                      <strong>{log.title}</strong>
                    </div>
                    <div className="log-sol-body">
                      <div className="log-sol-cmd-line">
                        <span className="cmd-tag">Target:</span>
                        <code className="cmd-code">{log.targetCommand}</code>
                        <button 
                          type="button" 
                          className="log-insert-btn theme-transition"
                          onClick={(e) => {
                            e.stopPropagation();
                            insertCommandIntoTerminal(log.targetCommand);
                          }}
                        >
                          Insert into Terminal
                        </button>
                      </div>
                      <p className="log-sol-explanation">{log.explanation}</p>
                    </div>
                  </div>
                ) : (
                  <pre className="log-output-pre">{log.text}</pre>
                )}
              </div>
            ))}
            <div ref={logsEndRef} />
          </div>

          {/* Terminal Interactive Command Input Line */}
          <form onSubmit={handleCommandSubmit} className="terminal-input-bar">
            <label htmlFor="terminal-cmd-input" className="terminal-active-prompt">
              {getPromptPrefix()}
            </label>
            <input
              id="terminal-cmd-input"
              ref={inputRef}
              type="text"
              value={terminalInput}
              onChange={(e) => setTerminalInput(e.target.value)}
              onKeyDown={handleKeyDown}
              autoComplete="off"
              spellCheck="false"
              autoFocus
              className="terminal-command-input"
              placeholder="type command here..."
            />
          </form>

        </div>

        {/* Mission Completion Action Footer */}
        {completedMissions.includes(activeMission.id) && nextMission && (
          <div className="mission-completed-footer animate-fadeIn">
            <div className="footer-success-banner">
              <CheckCircle2 size={18} className="success-icon" />
              <div>
                <strong>Mission 0{activeMission.order} Mastered!</strong>
                <p>Advance to Mission 0{nextMission.order}: "{nextMission.title}"</p>
              </div>
            </div>
            <button 
              className="advance-mission-btn theme-transition"
              onClick={() => setActiveMissionId(nextMission.id)}
            >
              <span>Next mission</span>
              <ArrowRight size={15} />
            </button>
          </div>
        )}

      </main>

    </div>
  );
}
