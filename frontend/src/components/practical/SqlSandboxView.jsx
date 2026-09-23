import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  RotateCcw, 
  Download, 
  Copy, 
  Check, 
  Database, 
  Table, 
  ChevronRight, 
  ChevronDown, 
  Sparkles, 
  AlertCircle, 
  Award, 
  CheckCircle2, 
  Layers, 
  Code2, 
  HelpCircle,
  Lightbulb
} from 'lucide-react';
import { 
  executeSqlQuery, 
  resetSqlDatabase, 
  validateCandidateChallenge, 
  SCHEMA_METADATA 
} from '../../data/sqlSandboxEngine';
import { SQL_CHALLENGES } from '../../data/sqlChallengesData';
import './SqlSandboxView.css';

export default function SqlSandboxView({ currentUser }) {
  // Mode: 'playground' (Freeform) | 'challenges' (Placement Tracks)
  const [sandboxMode, setSandboxMode] = useState('playground');

  // Active Challenge (if in challenges mode)
  const [activeChallengeId, setActiveChallengeId] = useState(SQL_CHALLENGES[0]?.id || '');
  const activeChallenge = SQL_CHALLENGES.find(c => c.id === activeChallengeId) || SQL_CHALLENGES[0];

  // Editor State
  const [queryInput, setQueryInput] = useState('SELECT emp_id, first_name, last_name, department, salary FROM employees LIMIT 6;');
  const [isExecuting, setIsExecuting] = useState(false);
  const [queryResult, setQueryResult] = useState(null);

  // Challenge Validation Result
  const [validationResult, setValidationResult] = useState(null);
  const [isValidating, setIsValidating] = useState(false);
  const [showHint, setShowHint] = useState(false);

  // Schema Explorer state: which tables are expanded
  const [expandedTables, setExpandedTables] = useState({ employees: true, departments: false, orders: false });
  const [copiedResult, setCopiedResult] = useState(false);

  const textareaRef = useRef(null);

  // Load starter query when challenge changes
  useEffect(() => {
    if (sandboxMode === 'challenges' && activeChallenge) {
      setQueryInput(activeChallenge.starterQuery);
      setValidationResult(null);
      setShowHint(false);
      setQueryResult(null);
    }
  }, [activeChallengeId, sandboxMode]);

  // Execute query handler
  const handleRunQuery = async () => {
    if (!queryInput.trim()) return;
    setIsExecuting(true);
    setValidationResult(null);

    try {
      const res = await executeSqlQuery(queryInput);
      setQueryResult(res);
    } catch (err) {
      setQueryResult({
        success: false,
        error: String(err),
        columns: [],
        values: [],
        rowCount: 0,
        executionTimeMs: 0
      });
    } finally {
      setIsExecuting(false);
    }
  };

  // Keyboard shortcut Ctrl + Enter to run
  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleRunQuery();
    }
  };

  // Reset database handler
  const handleReset = async () => {
    setIsExecuting(true);
    try {
      await resetSqlDatabase();
      const res = await executeSqlQuery(queryInput);
      setQueryResult({
        ...res,
        message: 'In-memory SQLite database reset to clean placement schema!'
      });
      setValidationResult(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsExecuting(false);
    }
  };

  // Validate Challenge Solution
  const handleValidateChallenge = async () => {
    if (!activeChallenge) return;
    setIsValidating(true);

    try {
      // First run query to show visual result
      const runRes = await executeSqlQuery(queryInput);
      setQueryResult(runRes);

      // Now run LeetCode-style data comparison
      const val = await validateCandidateChallenge(
        queryInput, 
        activeChallenge.expectedQuery, 
        { orderSensitive: activeChallenge.orderSensitive }
      );
      setValidationResult(val);
    } catch (err) {
      setValidationResult({
        passed: false,
        reason: `Evaluation error: ${err.message || String(err)}`
      });
    } finally {
      setIsValidating(false);
    }
  };

  // Insert sample query into editor
  const handleInsertSample = (sql) => {
    setQueryInput(sql);
    textareaRef.current?.focus();
  };

  // Toggle table accordion in Schema Explorer
  const toggleTableAccordion = (tableName) => {
    setExpandedTables(prev => ({ ...prev, [tableName]: !prev[tableName] }));
  };

  // Export results to CSV
  const handleExportCsv = () => {
    if (!queryResult || !queryResult.columns?.length) return;
    const headers = queryResult.columns.join(',');
    const rows = queryResult.values.map(row => 
      row.map(val => (val === null ? '' : `"${String(val).replace(/"/g, '""')}"`)).join(',')
    );
    const csvContent = [headers, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `commitdrive_sql_results_${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Copy results table to clipboard as TSV
  const handleCopyResults = () => {
    if (!queryResult || !queryResult.columns?.length) return;
    const headers = queryResult.columns.join('\t');
    const rows = queryResult.values.map(row => row.join('\t'));
    const tsv = [headers, ...rows].join('\n');
    navigator.clipboard.writeText(tsv);
    setCopiedResult(true);
    setTimeout(() => setCopiedResult(false), 2000);
  };

  return (
    <div className="sql-sandbox-container">
      
      {/* 1. Header Toolbar */}
      <div className="sql-sandbox-toolbar theme-transition">
        <div className="toolbar-left">
          <div className="sql-engine-badge">
            <span className="engine-dot" />
            <span>SQLite 3 (WebAssembly In-Memory)</span>
          </div>

          <div className="sandbox-mode-pills">
            <button
              type="button"
              className={`mode-pill-btn ${sandboxMode === 'playground' ? 'active' : ''}`}
              onClick={() => setSandboxMode('playground')}
            >
              <Code2 size={14} />
              <span>SQL Playground</span>
            </button>
            <button
              type="button"
              className={`mode-pill-btn ${sandboxMode === 'challenges' ? 'active' : ''}`}
              onClick={() => setSandboxMode('challenges')}
            >
              <Award size={14} />
              <span>Placement Challenges ({SQL_CHALLENGES.length})</span>
            </button>
          </div>
        </div>

        <div className="toolbar-right">
          <button 
            type="button" 
            className="tool-btn" 
            onClick={handleReset} 
            title="Reset database to initial clean tables"
            disabled={isExecuting}
          >
            <RotateCcw size={14} />
            <span>Reset DB</span>
          </button>

          {queryResult?.values?.length > 0 && (
            <>
              <button type="button" className="tool-btn" onClick={handleExportCsv} title="Download CSV">
                <Download size={14} />
                <span>Export CSV</span>
              </button>
              <button type="button" className="tool-btn" onClick={handleCopyResults} title="Copy result rows">
                {copiedResult ? <Check size={14} className="text-success" /> : <Copy size={14} />}
                <span>{copiedResult ? 'Copied' : 'Copy'}</span>
              </button>
            </>
          )}

          <button 
            type="button" 
            className="run-query-btn" 
            onClick={handleRunQuery}
            disabled={isExecuting}
          >
            <Play size={15} fill="currentColor" />
            <span>Run Query</span>
            <span className="key-hint">Ctrl+Enter</span>
          </button>
        </div>
      </div>

      {/* 2. Challenge Selector Banner (If in challenges mode) */}
      {sandboxMode === 'challenges' && activeChallenge && (
        <div className="challenge-banner-card theme-transition" style={{ borderLeftColor: activeChallenge.badgeColor }}>
          <div className="challenge-banner-top">
            <div className="challenge-title-group">
              <span className="challenge-level-badge" style={{ background: `${activeChallenge.badgeColor}22`, color: activeChallenge.badgeColor }}>
                {activeChallenge.level}
              </span>
              <h3 className="challenge-title-text">{activeChallenge.title}</h3>
            </div>

            <div className="challenge-companies-row">
              {activeChallenge.companyTags.map((tag, tIdx) => (
                <span key={tIdx} className="company-tag-pill">{tag}</span>
              ))}
            </div>
          </div>

          <p className="challenge-desc-text">{activeChallenge.description}</p>

          <div className="challenge-actions-row">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <select
                className="challenge-nav-dropdown"
                value={activeChallengeId}
                onChange={(e) => setActiveChallengeId(e.target.value)}
              >
                {SQL_CHALLENGES.map((ch, idx) => (
                  <option key={ch.id} value={ch.id}>
                    {idx + 1}. {ch.title} ({ch.tier.split(' ')[0]})
                  </option>
                ))}
              </select>

              <button 
                type="button" 
                className="tool-btn"
                onClick={() => setShowHint(prev => !prev)}
              >
                <Lightbulb size={14} style={{ color: '#eab308' }} />
                <span>{showHint ? 'Hide Hint' : 'Show Hint'}</span>
              </button>
            </div>

            <button
              type="button"
              className="validate-challenge-btn"
              onClick={handleValidateChallenge}
              disabled={isValidating}
            >
              <CheckCircle2 size={15} />
              <span>{isValidating ? 'Validating...' : 'Submit & Validate (LeetCode Check)'}</span>
            </button>
          </div>

          {showHint && (
            <div style={{ marginTop: '12px', padding: '10px 14px', background: 'rgba(234, 179, 8, 0.1)', border: '1px solid rgba(234, 179, 8, 0.3)', borderRadius: '8px', fontSize: '0.84rem', color: '#a16207' }}>
              <strong>💡 Interview Hint:</strong> {activeChallenge.hint}
            </div>
          )}

          {/* Validation Result Box */}
          {validationResult && (
            <div className={`validation-status-box ${validationResult.passed ? 'passed' : 'failed'}`}>
              {validationResult.passed ? (
                <>
                  <Award size={20} style={{ color: '#16a34a', flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong>🎉 Challenge Solved Perfectly!</strong>
                    <div>Your SQL query produced the exact expected output ({validationResult.rowCount} rows verified against standard placement rubric).</div>
                    <div style={{ fontSize: '0.78rem', marginTop: '4px', opacity: 0.85 }}>Tested: {activeChallenge.concept}</div>
                  </div>
                </>
              ) : (
                <>
                  <AlertCircle size={20} style={{ color: '#dc2626', flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong>❌ Output Mismatch</strong>
                    <div>{validationResult.reason}</div>
                    <div style={{ fontSize: '0.78rem', marginTop: '4px', opacity: 0.85 }}>Tip: Check columns, sorting order, or WHERE conditions.</div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      )}

      {/* 3. Main Workspace: Schema Explorer (Left) + Editor & Results (Right) */}
      <div className="sql-workspace-grid">
        
        {/* Schema Explorer Sidebar */}
        <aside className="schema-explorer-card theme-transition">
          <div className="schema-explorer-header">
            <div className="schema-header-title">
              <Database size={15} style={{ color: '#ea580c' }} />
              <span>Placement Schema</span>
            </div>
            <span style={{ fontSize: '0.72rem', color: '#64748b' }}>3 Tables</span>
          </div>

          <div className="schema-tables-list">
            {SCHEMA_METADATA.map((tbl) => {
              const isExpanded = !!expandedTables[tbl.tableName];
              return (
                <div key={tbl.tableName} className="schema-table-item">
                  <div 
                    className="schema-table-head"
                    onClick={() => toggleTableAccordion(tbl.tableName)}
                  >
                    <div className="table-head-left">
                      <Table size={13} style={{ color: '#0284c7' }} />
                      <span className="table-name">{tbl.tableName}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <span className="table-row-count">{tbl.rowCount} rows</span>
                      {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </div>
                  </div>

                  {isExpanded && (
                    <>
                      <table className="table-columns-table">
                        <tbody>
                          {tbl.columns.map((col) => (
                            <tr key={col.name}>
                              <td className="col-name">{col.name}</td>
                              <td className="col-type">{col.type}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <button 
                        type="button" 
                        className="schema-insert-btn"
                        onClick={() => handleInsertSample(tbl.sampleQuery)}
                      >
                        Insert Sample SELECT →
                      </button>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </aside>

        {/* Center/Right Panel: SQL Editor + Query Output */}
        <main className="sql-main-panel">
          
          {/* SQL Editor Card */}
          <div className="sql-editor-card">
            <div className="sql-editor-header">
              <div className="editor-header-left">
                <div className="terminal-dots">
                  <span className="dot dot-red" />
                  <span className="dot dot-yellow" />
                  <span className="dot dot-green" />
                </div>
                <span className="editor-title">mysql_query_editor.sql</span>
              </div>
              <span style={{ fontSize: '0.72rem', color: '#64748b', fontFamily: 'monospace' }}>
                Press Ctrl+Enter to Run
              </span>
            </div>

            <div className="sql-textarea-wrapper">
              <textarea
                ref={textareaRef}
                className="sql-textarea"
                value={queryInput}
                onChange={(e) => setQueryInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Write your SQL query here... e.g. SELECT department, AVG(salary) FROM employees GROUP BY department;"
                spellCheck="false"
              />
            </div>
          </div>

          {/* Results Card */}
          <div className="sql-results-card theme-transition">
            <div className="sql-results-header">
              <div className="results-meta-left">
                <span style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-primary, #0f172a)' }}>
                  Query Execution Results
                </span>

                {queryResult && (
                  <>
                    <span className={`meta-chip ${queryResult.success ? 'chip-success' : 'chip-error'}`}>
                      {queryResult.success ? '✔ Status 200 OK' : '✖ Execution Error'}
                    </span>
                    <span className="meta-chip chip-timing">
                      ⚡ {queryResult.executionTimeMs} ms
                    </span>
                    {queryResult.success && !queryResult.isStatement && (
                      <span className="meta-chip chip-timing">
                        {queryResult.rowCount} {queryResult.rowCount === 1 ? 'row' : 'rows'}
                      </span>
                    )}
                  </>
                )}
              </div>

              {queryResult?.message && (
                <span style={{ fontSize: '0.78rem', color: '#16a34a', fontWeight: 600 }}>
                  {queryResult.message}
                </span>
              )}
            </div>

            {/* Error Banner */}
            {queryResult && !queryResult.success && (
              <div className="error-banner">
                <div style={{ fontWeight: 700, marginBottom: '4px' }}>🚨 SQLite Compiler Error:</div>
                {queryResult.error}
              </div>
            )}

            {/* Statement Success Banner (DDL / DML with 0 projected rows) */}
            {queryResult && queryResult.success && queryResult.isStatement && (
              <div className="statement-success-banner">
                <CheckCircle2 size={28} style={{ color: '#16a34a' }} />
                <span>{queryResult.message || 'Statement executed successfully.'}</span>
              </div>
            )}

            {/* Data Results Table */}
            {queryResult && queryResult.success && !queryResult.isStatement && (
              <div className="results-table-container">
                {queryResult.rowCount === 0 ? (
                  <div className="results-empty-state">
                    <HelpCircle size={28} className="empty-icon" />
                    <span>Query executed successfully, but 0 rows matched the WHERE criteria.</span>
                  </div>
                ) : (
                  <table className="sql-data-table">
                    <thead>
                      <tr>
                        {queryResult.columns.map((colName, cIdx) => (
                          <th key={cIdx}>{colName}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {queryResult.values.map((row, rIdx) => (
                        <tr key={rIdx}>
                          {row.map((cellVal, cIdx) => (
                            <td key={cIdx}>
                              {cellVal === null ? (
                                <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>NULL</span>
                              ) : (
                                String(cellVal)
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {/* Initial Empty State before running first query */}
            {!queryResult && (
              <div className="results-empty-state">
                <Play size={28} className="empty-icon" />
                <span style={{ fontWeight: 600 }}>No query executed yet</span>
                <span style={{ fontSize: '0.8rem' }}>
                  Write a SQL query in the editor above and click <strong>"Run Query"</strong> or press <strong>Ctrl + Enter</strong>.
                </span>
              </div>
            )}

          </div>

        </main>
      </div>

    </div>
  );
}
