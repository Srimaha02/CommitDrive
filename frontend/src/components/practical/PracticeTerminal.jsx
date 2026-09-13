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
  FolderTree
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
        onCompleteMission(activeMission.id);
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
      const failureHint = activeMission.hints[hintIndex] || activeMission.hints[0];
      setTerminalLogs(prev => [
        ...prev,
        userLog,
        { 
          type: 'error', 
          text: `command not recognized or syntax incomplete: "${rawInput}"` 
        },
        { 
          type: 'warning', 
          text: `💡 Hint: ${failureHint}` 
        }
      ]);
      // Advance hint index for next retry
      setHintIndex(prev => (prev + 1) % activeMission.hints.length);
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
