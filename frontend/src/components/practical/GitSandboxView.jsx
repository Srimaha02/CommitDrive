import React, { useState, useEffect, useRef } from 'react';
import { 
  GitBranch, 
  GitCommit, 
  GitMerge, 
  RotateCcw, 
  CheckCircle2, 
  Sparkles, 
  HelpCircle, 
  Award, 
  Play, 
  ChevronRight, 
  Check, 
  Copy,
  Lightbulb,
  Tag,
  Layers,
  FileCode2,
  FolderGit2
} from 'lucide-react';
import { 
  executeGitCommand, 
  resetGitRepository, 
  getGitStateSnapshot, 
  GIT_CHALLENGES 
} from '../../data/gitVirtualEngine';
import './GitSandboxView.css';

export default function GitSandboxView({ currentUser }) {
  // Mode: 'playground' | 'challenges'
  const [sandboxMode, setSandboxMode] = useState('playground');

  // Input & Command History
  const [inputVal, setInputVal] = useState('');
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyPointer, setHistoryPointer] = useState(-1);

  // Live Git State
  const [gitSnapshot, setGitSnapshot] = useState(() => getGitStateSnapshot());

  // Terminal Logs
  const [terminalLogs, setTerminalLogs] = useState([
    { type: 'system', text: 'CommitDrive In-Memory Git Virtual Playground (DAG & Multi-Branch Engine)' },
    { type: 'system', text: 'Type arbitrary Git commands: git status, git add, git commit -m, git branch, git checkout -b, git merge, git log --graph.' },
    { type: 'output', text: 'On branch main\nChanges not staged for commit:\n\tmodified:   README.md\nUntracked files:\n\tsrc/payment.js' }
  ]);

  // Challenges State
  const [activeChallengeId, setActiveChallengeId] = useState(GIT_CHALLENGES[0]?.id || '');
  const activeChallenge = GIT_CHALLENGES.find(c => c.id === activeChallengeId) || GIT_CHALLENGES[0];
  const [validationResult, setValidationResult] = useState(null);
  const [showHint, setShowHint] = useState(false);

  const logsEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto scroll
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalLogs]);

  // Focus
  useEffect(() => {
    inputRef.current?.focus();
  }, [sandboxMode]);

  const refreshState = () => {
    setGitSnapshot(getGitStateSnapshot());
  };

  const handleRunCommand = (cmdToRun) => {
    const command = (cmdToRun !== undefined ? cmdToRun : inputVal).trim();
    if (!command) return;

    const currentBranch = gitSnapshot.currentBranch;
    const promptDisplay = `repo (${currentBranch})$ ${command}`;
    const newLogs = [...terminalLogs, { type: 'input', text: promptDisplay }];

    const res = executeGitCommand(command);

    if (res.stdout === '\x1Bc') {
      setTerminalLogs([]);
    } else {
      if (res.stdout) {
        newLogs.push({ type: 'output', text: res.stdout });
      }
      if (res.stderr) {
        newLogs.push({ type: 'error', text: res.stderr });
      }
      setTerminalLogs(newLogs);
    }

    refreshState();
    setCommandHistory(prev => [...prev, command]);
    setHistoryPointer(-1);
    setInputVal('');

    // Check challenge verification if in drills mode
    if (sandboxMode === 'challenges' && activeChallenge) {
      if (activeChallenge.verify) {
        const passed = activeChallenge.verify();
        setValidationResult({
          passed,
          message: passed 
            ? 'Challenge Solved! Git DAG and branch state matches the requirement.' 
            : 'Goal not completed yet. Check git status / branch and retry.'
        });
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleRunCommand();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length === 0) return;
      const nextIdx = historyPointer === -1 ? commandHistory.length - 1 : Math.max(0, historyPointer - 1);
      setHistoryPointer(nextIdx);
      setInputVal(commandHistory[nextIdx] || '');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyPointer === -1) return;
      const nextIdx = historyPointer + 1;
      if (nextIdx >= commandHistory.length) {
        setHistoryPointer(-1);
        setInputVal('');
      } else {
        setHistoryPointer(nextIdx);
        setInputVal(commandHistory[nextIdx] || '');
      }
    }
  };

  const handleResetRepo = () => {
    resetGitRepository();
    refreshState();
    setTerminalLogs([
      { type: 'system', text: 'Git repository reset to initial master commit state.' },
      { type: 'output', text: 'On branch main\nNothing staged for commit.' }
    ]);
    setValidationResult(null);
  };

  return (
    <div className="git-sandbox-container">
      {/* Top Header */}
      <div className="sandbox-header-bar">
        <div className="sandbox-title-group">
          <FolderGit2 size={20} className="git-header-icon" />
          <div>
            <h2 className="sandbox-main-title">Git Virtual Sandbox (DAG & Multi-Branch)</h2>
            <p className="sandbox-subtitle">
              Interactive in-memory repository with real staging index, commit trees, branch merging, and visual graph.
            </p>
          </div>
        </div>

        <div className="sandbox-actions-group">
          {/* Mode Switcher */}
          <div className="sandbox-tab-toggle">
            <button
              className={`sandbox-tab-btn ${sandboxMode === 'playground' ? 'active' : ''}`}
              onClick={() => {
                setSandboxMode('playground');
                setValidationResult(null);
              }}
            >
              <GitBranch size={14} />
              <span>Git Playground</span>
            </button>
            <button
              className={`sandbox-tab-btn ${sandboxMode === 'challenges' ? 'active' : ''}`}
              onClick={() => {
                setSandboxMode('challenges');
                setValidationResult(null);
                if (activeChallenge) {
                  setInputVal(activeChallenge.starterCommand);
                }
              }}
            >
              <Award size={14} />
              <span>Placement Drills</span>
            </button>
          </div>

          <button 
            className="action-btn-secondary"
            onClick={handleResetRepo}
            title="Reset repository back to clean initial commits"
          >
            <RotateCcw size={14} />
            <span>Reset Repo</span>
          </button>
        </div>
      </div>

      {/* Main Split Layout */}
      <div className="sandbox-split-layout">
        
        {/* Left: Terminal Pane */}
        <div className="terminal-main-pane">
          {/* Challenge Banner if in drills mode */}
          {sandboxMode === 'challenges' && activeChallenge && (
            <div className="challenge-drill-card">
              <div className="challenge-drill-header">
                <div className="challenge-drill-meta">
                  <span className="challenge-badge">{activeChallenge.badge}</span>
                  <span className="challenge-diff">{activeChallenge.difficulty}</span>
                </div>
                <select 
                  className="challenge-selector-dropdown"
                  value={activeChallengeId}
                  onChange={(e) => {
                    setActiveChallengeId(e.target.value);
                    const ch = GIT_CHALLENGES.find(c => c.id === e.target.value);
                    if (ch) setInputVal(ch.starterCommand);
                    setValidationResult(null);
                    setShowHint(false);
                  }}
                >
                  {GIT_CHALLENGES.map((ch, idx) => (
                    <option key={ch.id} value={ch.id}>
                      Task {idx + 1}: {ch.title}
                    </option>
                  ))}
                </select>
              </div>

              <p className="challenge-desc-text">{activeChallenge.description}</p>

              <div className="challenge-hint-row">
                <button 
                  className="hint-toggle-btn"
                  onClick={() => setShowHint(!showHint)}
                >
                  <Lightbulb size={13} />
                  <span>{showHint ? 'Hide Hint' : 'View Interview Hint'}</span>
                </button>

                {validationResult && (
                  <div className={`validation-badge ${validationResult.passed ? 'success' : 'failed'}`}>
                    {validationResult.passed ? <CheckCircle2 size={14} /> : <HelpCircle size={14} />}
                    <span>{validationResult.message}</span>
                  </div>
                )}
              </div>

              {showHint && (
                <div className="challenge-hint-box">
                  <code>{activeChallenge.hint}</code>
                  <p className="challenge-why-text">💡 <strong>Why interviewers ask this:</strong> {activeChallenge.explanation}</p>
                </div>
              )}
            </div>
          )}

          {/* Quick Presets */}
          <div className="terminal-presets-row">
            <span className="presets-label">Quick Commands:</span>
            {[
              'git status',
              'git log --oneline',
              'git branch -a',
              'git add .',
              'git commit -m "feat: updates"',
              'git diff',
              'clear'
            ].map(cmd => (
              <button 
                key={cmd}
                className="preset-chip"
                onClick={() => {
                  setInputVal(cmd);
                  handleRunCommand(cmd);
                }}
              >
                {cmd}
              </button>
            ))}
          </div>

          {/* Git Terminal Window */}
          <div className="git-terminal-screen" onClick={() => inputRef.current?.focus()}>
            <div className="terminal-screen-top">
              <span className="term-dot red" />
              <span className="term-dot yellow" />
              <span className="term-dot green" />
              <span className="term-title">git-cli — [{gitSnapshot.currentBranch}]</span>
            </div>

            <div className="terminal-screen-body">
              {terminalLogs.map((log, idx) => (
                <div key={idx} className={`term-line ${log.type}`}>
                  {log.text}
                </div>
              ))}
              <div ref={logsEndRef} />
            </div>

            {/* Input Row */}
            <div className="terminal-input-row">
              <span className="term-prompt">
                <span className="term-user">repo</span>:(<span className="term-branch">{gitSnapshot.currentBranch}</span>)$
              </span>
              <input
                ref={inputRef}
                type="text"
                className="term-cli-input"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="git command (e.g. git status, git checkout -b feature)..."
                autoFocus
                spellCheck={false}
              />
              <button 
                className="term-send-btn"
                onClick={() => handleRunCommand()}
                title="Execute command (Enter)"
              >
                <Play size={13} fill="currentColor" />
              </button>
            </div>
          </div>
        </div>

        {/* Right: Live Visual Git DAG & State Inspector */}
        <div className="git-visualizer-pane">
          
          {/* Working Tree & Staging Index Cards */}
          <div className="git-status-overview-card">
            <div className="status-overview-header">
              <Layers size={15} />
              <span className="status-overview-title">Git File Status</span>
            </div>

            <div className="status-grid">
              {/* Staged Files */}
              <div className="status-column staged">
                <div className="col-header">
                  <span className="col-indicator green" />
                  <span className="col-title">Staged ({gitSnapshot.stagedCount})</span>
                </div>
                {gitSnapshot.stagedFiles.length > 0 ? (
                  <div className="file-pill-list">
                    {gitSnapshot.stagedFiles.map(f => (
                      <span key={f} className="file-pill green">+{f}</span>
                    ))}
                  </div>
                ) : (
                  <span className="empty-hint">None</span>
                )}
              </div>

              {/* Working Tree Files */}
              <div className="status-column working">
                <div className="col-header">
                  <span className="col-indicator orange" />
                  <span className="col-title">Unstaged ({gitSnapshot.untrackedFiles.length + gitSnapshot.modifiedFiles.length})</span>
                </div>
                {gitSnapshot.untrackedFiles.length > 0 || gitSnapshot.modifiedFiles.length > 0 ? (
                  <div className="file-pill-list">
                    {gitSnapshot.modifiedFiles.map(f => (
                      <span key={f} className="file-pill orange">M {f}</span>
                    ))}
                    {gitSnapshot.untrackedFiles.map(f => (
                      <span key={f} className="file-pill red">? {f}</span>
                    ))}
                  </div>
                ) : (
                  <span className="empty-hint">Clean</span>
                )}
              </div>
            </div>
          </div>

          {/* Live Commit Tree (DAG) */}
          <div className="git-dag-card">
            <div className="dag-card-header">
              <GitCommit size={15} />
              <span className="dag-card-title">Commit Graph (DAG)</span>
            </div>

            <div className="dag-commit-timeline">
              {gitSnapshot.commits.slice().reverse().map((commit, idx) => {
                const isHead = gitSnapshot.currentCommitHash === commit.hash;
                const pointingBranches = Object.entries(gitSnapshot.branches)
                  .filter(([_, h]) => h === commit.hash)
                  .map(([b]) => b);
                const pointingTags = Object.entries(gitSnapshot.tags)
                  .filter(([_, h]) => h === commit.hash)
                  .map(([t]) => t);

                return (
                  <div key={commit.hash} className={`dag-commit-node ${isHead ? 'is-head' : ''}`}>
                    <div className="dag-node-left">
                      <div className={`commit-dot ${isHead ? 'active' : ''}`} />
                      {idx < gitSnapshot.commits.length - 1 && <div className="commit-line" />}
                    </div>

                    <div className="dag-node-content">
                      <div className="commit-meta-row">
                        <span className="commit-hash">{commit.hash}</span>
                        
                        {pointingBranches.map(b => (
                          <span key={b} className={`branch-badge ${b === gitSnapshot.currentBranch ? 'current' : ''}`}>
                            <GitBranch size={10} />
                            <span>{b}</span>
                          </span>
                        ))}

                        {pointingTags.map(t => (
                          <span key={t} className="tag-badge">
                            <Tag size={10} />
                            <span>{t}</span>
                          </span>
                        ))}
                      </div>

                      <div className="commit-msg">{commit.message}</div>
                      <div className="commit-author-time">{commit.timestamp}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
