import React, { useState, useEffect, useRef } from 'react';
import { 
  Terminal as TerminalIcon, 
  FolderTree, 
  FileText, 
  Folder, 
  FolderOpen, 
  RotateCcw, 
  CheckCircle2, 
  Sparkles, 
  HelpCircle, 
  Award, 
  Play, 
  ChevronRight, 
  ChevronDown, 
  Check, 
  Copy,
  Lightbulb,
  ShieldCheck,
  Cpu
} from 'lucide-react';
import { 
  executeLinuxCommand, 
  resetLinuxFileSystem, 
  getFileTreeSnapshot, 
  LINUX_CHALLENGES 
} from '../../data/linuxVirtualEngine';
import './LinuxSandboxView.css';

export default function LinuxSandboxView({ currentUser }) {
  // Mode: 'playground' (Freeform shell) | 'challenges' (Placement tracks)
  const [sandboxMode, setSandboxMode] = useState('playground');

  // Terminal state
  const [inputVal, setInputVal] = useState('');
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyPointer, setHistoryPointer] = useState(-1);
  const [cwd, setCwd] = useState('/home/developer');
  const [fileTree, setFileTree] = useState(() => getFileTreeSnapshot('/'));
  const [expandedFolders, setExpandedFolders] = useState({ '/': true, '/home': true, '/home/developer': true, '/var': true, '/var/log': true });

  // Terminal logs
  const [terminalLogs, setTerminalLogs] = useState([
    { type: 'system', text: 'CommitDrive In-Memory Linux Virtual Terminal (Ubuntu 24.04 LTS)' },
    { type: 'system', text: 'Type arbitrary commands: ls -la, cat, grep, mkdir -p, chmod, ps aux, or pipes (|). Type "help" for syntax.' },
    { type: 'output', text: 'developer@commitdrive:~$ pwd\n/home/developer' }
  ]);

  // Selected file preview modal/card
  const [inspectedFile, setInspectedFile] = useState(null);

  // Challenges state
  const [activeChallengeId, setActiveChallengeId] = useState(LINUX_CHALLENGES[0]?.id || '');
  const activeChallenge = LINUX_CHALLENGES.find(c => c.id === activeChallengeId) || LINUX_CHALLENGES[0];
  const [validationResult, setValidationResult] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [copiedHint, setCopiedHint] = useState(false);

  const logsEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto scroll logs
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalLogs]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, [sandboxMode]);

  // Refresh file tree whenever command runs
  const refreshTree = () => {
    setFileTree(getFileTreeSnapshot('/'));
  };

  // Run command handler
  const handleRunCommand = (cmdToRun) => {
    const command = (cmdToRun !== undefined ? cmdToRun : inputVal).trim();
    if (!command) return;

    // Add command to terminal log
    const promptDisplay = `developer@commitdrive:${cwd === '/home/developer' ? '~' : cwd}$ ${command}`;
    const newLogs = [...terminalLogs, { type: 'input', text: promptDisplay }];

    // Execute command
    const res = executeLinuxCommand(command);

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

    setCwd(res.cwd);
    refreshTree();
    setCommandHistory(prev => [...prev, command]);
    setHistoryPointer(-1);
    setInputVal('');

    // Check challenge verification if in challenges mode
    if (sandboxMode === 'challenges' && activeChallenge) {
      if (activeChallenge.verify) {
        const passed = activeChallenge.verify();
        setValidationResult({
          passed,
          message: passed 
            ? 'Challenge Solved! Virtual file system state matches expected criteria.' 
            : 'Condition not met yet. Check permissions/paths and retry.'
        });
      } else if (activeChallenge.expectedOutputPattern) {
        const passed = res.stdout && res.stdout.trim() === activeChallenge.expectedOutputPattern;
        setValidationResult({
          passed,
          message: passed
            ? `Challenge Solved! Output exactly matched "${activeChallenge.expectedOutputPattern}".`
            : `Output received "${res.stdout?.trim() || 'none'}", expected "${activeChallenge.expectedOutputPattern}".`
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

  const handleResetSystem = () => {
    resetLinuxFileSystem();
    setCwd('/home/developer');
    refreshTree();
    setTerminalLogs([
      { type: 'system', text: 'Virtual Linux file system reset back to clean installation state.' },
      { type: 'output', text: 'developer@commitdrive:~$ pwd\n/home/developer' }
    ]);
    setValidationResult(null);
  };

  const toggleFolder = (path) => {
    setExpandedFolders(prev => ({ ...prev, [path]: !prev[path] }));
  };

  const renderTreeNode = (node, depth = 0) => {
    if (!node) return null;
    const isDir = node.type === 'dir';
    const isExpanded = !!expandedFolders[node.path];

    return (
      <div key={node.path} className="tree-node-wrapper" style={{ paddingLeft: `${depth * 12}px` }}>
        <div 
          className={`tree-node-row ${isDir ? 'is-dir' : 'is-file'}`}
          onClick={() => {
            if (isDir) {
              toggleFolder(node.path);
            } else {
              setInspectedFile(node);
            }
          }}
        >
          {isDir ? (
            <>
              <span className="tree-expand-icon">
                {isExpanded ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
              </span>
              {isExpanded ? <FolderOpen size={14} className="folder-icon open" /> : <Folder size={14} className="folder-icon" />}
              <span className="node-name dir">{node.name}</span>
              <span className="node-perm">{node.permissions}</span>
            </>
          ) : (
            <>
              <span className="tree-expand-spacer" />
              <FileText size={13} className="file-icon" />
              <span className="node-name file">{node.name}</span>
              <span className="node-meta">{node.permissions} | {node.size}B</span>
            </>
          )}
        </div>

        {isDir && isExpanded && node.children && (
          <div className="tree-children">
            {node.children.map(child => renderTreeNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="linux-sandbox-container">
      {/* Top Header & Mode Navigation */}
      <div className="sandbox-header-bar">
        <div className="sandbox-title-group">
          <TerminalIcon size={20} className="terminal-header-icon" />
          <div>
            <h2 className="sandbox-main-title">Linux Virtual Shell (VFS & Pipelines)</h2>
            <p className="sandbox-subtitle">
              Arbitrary in-memory Unix shell with real filesystem tree, redirection (&gt;, &gt;&gt;), pipes (|), and permissions.
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
              <Cpu size={14} />
              <span>Shell Playground</span>
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
            onClick={handleResetSystem}
            title="Reset Virtual File System back to fresh state"
          >
            <RotateCcw size={14} />
            <span>Reset VFS</span>
          </button>
        </div>
      </div>

      {/* Main Sandbox Body: Split Pane */}
      <div className="sandbox-split-layout">
        
        {/* Left / Center: Interactive Terminal */}
        <div className="terminal-main-pane">
          {/* Challenge Banner if in Drills mode */}
          {sandboxMode === 'challenges' && activeChallenge && (
            <div className="challenge-drill-card">
              <div className="challenge-drill-header">
                <div className="challenge-drill-meta">
                  <span className="challenge-badge">{activeChallenge.badge}</span>
                  <span className="challenge-diff">{activeChallenge.difficulty}</span>
                </div>
                {/* Challenge Selector */}
                <select 
                  className="challenge-selector-dropdown"
                  value={activeChallengeId}
                  onChange={(e) => {
                    setActiveChallengeId(e.target.value);
                    const ch = LINUX_CHALLENGES.find(c => c.id === e.target.value);
                    if (ch) setInputVal(ch.starterCommand);
                    setValidationResult(null);
                    setShowHint(false);
                  }}
                >
                  {LINUX_CHALLENGES.map((ch, idx) => (
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

          {/* Quick Presets Bar */}
          <div className="terminal-presets-row">
            <span className="presets-label">Quick Commands:</span>
            {[
              'ls -la',
              'cat /var/log/app.log | grep ERROR | wc -l',
              'cat /etc/os-release',
              'chmod 600 config.env',
              'ps aux',
              'whoami',
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

          {/* Interactive Shell Window */}
          <div className="linux-terminal-screen" onClick={() => inputRef.current?.focus()}>
            <div className="terminal-screen-top">
              <span className="term-dot red" />
              <span className="term-dot yellow" />
              <span className="term-dot green" />
              <span className="term-title">bash — developer@commitdrive:{cwd === '/home/developer' ? '~' : cwd}</span>
            </div>

            <div className="terminal-screen-body">
              {terminalLogs.map((log, idx) => (
                <div key={idx} className={`term-line ${log.type}`}>
                  {log.text}
                </div>
              ))}
              <div ref={logsEndRef} />
            </div>

            {/* Input Prompt */}
            <div className="terminal-input-row">
              <span className="term-prompt">
                <span className="term-user">developer@commitdrive</span>:<span className="term-path">{cwd === '/home/developer' ? '~' : cwd}</span>$
              </span>
              <input
                ref={inputRef}
                type="text"
                className="term-cli-input"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="type linux command..."
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

        {/* Right Pane: Live Visual File Tree Explorer */}
        <div className="filetree-sidebar-pane">
          <div className="sidebar-header">
            <FolderTree size={16} className="sidebar-header-icon" />
            <span className="sidebar-title">Virtual File Tree</span>
          </div>

          <div className="filetree-content">
            {fileTree ? renderTreeNode(fileTree) : <p className="empty-tree">File tree empty.</p>}
          </div>

          {/* Quick File Inspector Preview */}
          {inspectedFile && (
            <div className="file-preview-card">
              <div className="file-preview-header">
                <div className="file-preview-meta">
                  <FileText size={14} />
                  <span className="preview-filename">{inspectedFile.path}</span>
                </div>
                <button 
                  className="preview-close-btn"
                  onClick={() => setInspectedFile(null)}
                >
                  ✕
                </button>
              </div>
              <pre className="file-preview-content">
                {fileTree && (
                  (() => {
                    const p = inspectedFile.path;
                    const res = executeLinuxCommand(`cat ${p}`);
                    return res.stdout || '(Empty File)';
                  })()
                )}
              </pre>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
