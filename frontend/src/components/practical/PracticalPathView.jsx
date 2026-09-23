import React, { useState, useEffect } from 'react';
import { 
  GitBranch, 
  Terminal, 
  Database, 
  Play, 
  FileCheck2, 
  Award, 
  Sparkles, 
  Shield, 
  ChevronRight,
  Code2
} from 'lucide-react';
import { practicalModules, calculateModuleProgress } from '../../data/practicalCurriculum';
import { practicalApi } from '../../services/api';
import PracticeTerminal from './PracticeTerminal';
import MockTestView from './MockTestView';
import SqlSandboxView from './SqlSandboxView';
import GatedContentPreview from '../layout/GatedContentPreview';
import './PracticalPathView.css';

export default function PracticalPathView({ currentUser, onNavigate, onOpenAuth, onDemoLogin }) {
  // Active Module State: 'git' | 'linux' | 'sql'
  const [activeModuleId, setActiveModuleId] = useState(() => {
    try {
      return localStorage.getItem('commitdrive_practical_module') || 'git';
    } catch {
      return 'git';
    }
  });

  // Active Mode State: 'practice' | 'mock-test' | 'sandbox'
  const [activeMode, setActiveMode] = useState(() => {
    try {
      return localStorage.getItem('commitdrive_practical_mode') || 'practice';
    } catch {
      return 'practice';
    }
  });

  // Completed Missions Set: { [missionId]: true }
  const [completedMissions, setCompletedMissions] = useState(() => {
    try {
      const saved = localStorage.getItem('commitdrive_completed_missions');
      if (saved) return JSON.parse(saved);
      return [];
    } catch {
      return [];
    }
  });

  // Handle module switch with mode safety
  const handleSelectModule = (modId) => {
    setActiveModuleId(modId);
    if (activeMode === 'sandbox' && modId !== 'sql') {
      setActiveMode('practice');
    }
  };

  // Sync active module & mode to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('commitdrive_practical_module', activeModuleId);
      localStorage.setItem('commitdrive_practical_mode', activeMode);
    } catch {
      // storage unavailable
    }
  }, [activeModuleId, activeMode]);

  // Load missions from backend / fallback on mount
  useEffect(() => {
    let isMounted = true;
    practicalApi.getMissions().then(res => {
      if (isMounted && res && res.data && Array.isArray(res.data)) {
        const ids = res.data
          .filter(item => typeof item === 'string' || item.completed)
          .map(item => typeof item === 'string' ? item : item.missionId);
        setCompletedMissions(ids);
      }
    }).catch(() => {});
    return () => { isMounted = false; };
  }, []);

  // Sync completed missions to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('commitdrive_completed_missions', JSON.stringify(completedMissions));
    } catch {
      // storage unavailable
    }
  }, [completedMissions]);

  // Handle mission completion
  const handleCompleteMission = (missionId, attemptsCount = 1, unlockedSolutionUsed = false) => {
    setCompletedMissions(prev => {
      if (prev.includes(missionId)) return prev;
      return [...prev, missionId];
    });
    practicalApi.completeMission(activeModuleId, missionId, attemptsCount, unlockedSolutionUsed).catch(() => {});
  };

  // Module Icon Component Helper
  const getModuleIcon = (id, size = 16) => {
    if (id === 'git') return <GitBranch size={size} />;
    if (id === 'linux') return <Terminal size={size} />;
    return <Database size={size} />;
  };

  const activeModule = practicalModules.find(m => m.id === activeModuleId) || practicalModules[0];

  return (
    <div className="practical-path-page theme-transition">
      <div className="content-wrapper practical-container">

        <GatedContentPreview
          isGated={!currentUser}
          badgeText="Terminal Systems & Shell Lab"
          title="Sign up to run interactive terminal labs"
          subtitle="Experience real Git, Linux & SQL workflows. Execute commands in our simulated browser shell with automated regex grading, step-by-step hints, and diagnostic mock tests."
          features={[
            '24 interactive hands-on lab missions across Git, Linux & MySQL',
            'Real in-browser WebAssembly SQLite Sandbox with placement datasets',
            'Automated grading engine with real-world failure hints & solution walk-throughs',
            '15-minute timed diagnostic mock assessments with performance analytics'
          ]}
          ctaText="Sign up to unlock full access"
          onSignUp={() => onOpenAuth && onOpenAuth('signup')}
          onSignIn={() => onOpenAuth && onOpenAuth('signin')}
          onDemoLogin={onDemoLogin}
          previewContent={
            <>
              {/* ===================================================================
                  1. Practical Path Top Navigation Header
                  =================================================================== */}
              <header className="practical-nav-header">
                <div className="practical-nav-left">
                  <span className="practical-eyebrow">Terminal Zone • Hands-on lab</span>
                  <h1 className="practical-nav-title">Practical Engineering & Systems Lab</h1>
                </div>

                {/* Module Selector Tabs (Git / Linux / SQL) */}
                <div className="module-tabs-track theme-transition" role="tablist">
                  {practicalModules.map((mod) => {
                    const isActive = activeModuleId === mod.id;
                    const progressPct = calculateModuleProgress(mod.id, completedMissions);

                    return (
                      <button
                        key={mod.id}
                        role="tab"
                        aria-selected={isActive}
                        className={`module-tab-btn ${isActive ? 'active' : ''} theme-transition`}
                        onClick={() => handleSelectModule(mod.id)}
                      >
                        <div className="tab-icon-box theme-transition">
                          {getModuleIcon(mod.id, 16)}
                        </div>
                        <div className="tab-text-col">
                          <span className="tab-mod-name">{mod.name}</span>
                          <span className="tab-progress-meta">
                            {progressPct}% mastered
                          </span>
                        </div>
                        {isActive && <div className="tab-active-indicator" />}
                      </button>
                    );
                  })}
                </div>
              </header>

              {/* ===================================================================
                  2. Mode Switcher Bar (Practice Terminal vs Mock Test vs Real SQL Sandbox)
                  =================================================================== */}
              <div className="mode-switcher-bar theme-transition">
                <div className="mode-buttons-group">
                  <button
                    className={`mode-toggle-btn ${activeMode === 'practice' ? 'active' : ''} theme-transition`}
                    onClick={() => setActiveMode('practice')}
                  >
                    <Terminal size={15} />
                    <span>Practice Mode (Missions)</span>
                  </button>

                  {/* Real WebAssembly SQLite Sandbox Tab (Available for SQL) */}
                  {activeModuleId === 'sql' && (
                    <button
                      className={`mode-toggle-btn ${activeMode === 'sandbox' ? 'active' : ''} theme-transition`}
                      onClick={() => setActiveMode('sandbox')}
                      style={{
                        borderColor: activeMode === 'sandbox' ? '#ea580c' : undefined,
                        background: activeMode === 'sandbox' ? 'rgba(234, 88, 12, 0.08)' : undefined
                      }}
                    >
                      <Database size={15} style={{ color: '#ea580c' }} />
                      <span style={{ fontWeight: 700 }}>SQL Sandbox (WASM)</span>
                      <span style={{ fontSize: '0.68rem', padding: '1px 5px', background: '#ea580c', color: '#fff', borderRadius: '4px', fontWeight: 'bold' }}>REAL DB</span>
                    </button>
                  )}

                  <button
                    className={`mode-toggle-btn ${activeMode === 'mock-test' ? 'active' : ''} theme-transition`}
                    onClick={() => setActiveMode('mock-test')}
                  >
                    <FileCheck2 size={15} />
                    <span>Mock Test Mode (Timed Test)</span>
                  </button>
                </div>

                <div className="mode-context-hint">
                  {activeMode === 'sandbox' ? (
                    <span>⚡ Real SQLite in WebAssembly: Execute live queries against placement datasets & test LeetCode challenges</span>
                  ) : activeMode === 'practice' ? (
                    <span>🛠 Story-based terminal missions with regex validation & under-the-hood explanations</span>
                  ) : (
                    <span>⏱ 15-minute timed test with automated diagnostic report</span>
                  )}
                </div>
              </div>
            </>
          }
        >
          {/* ===================================================================
              3. Dynamic Mode Canvas
              =================================================================== */}
          <div className="practical-canvas-wrapper">
            {activeMode === 'sandbox' && activeModuleId === 'sql' ? (
              <SqlSandboxView currentUser={currentUser} />
            ) : activeMode === 'practice' ? (
              <PracticeTerminal 
                moduleId={activeModuleId}
                completedMissions={completedMissions}
                onCompleteMission={handleCompleteMission}
                currentUser={currentUser}
                isDemo={currentUser?.isDemo}
                onOpenAuth={onOpenAuth}
              />
            ) : (
              <MockTestView 
                moduleId={activeModuleId}
                onSwitchToPractice={() => setActiveMode('practice')}
                currentUser={currentUser}
                isDemo={currentUser?.isDemo}
                onOpenAuth={onOpenAuth}
                onDemoLogin={onDemoLogin}
              />
            )}
          </div>
        </GatedContentPreview>

      </div>
    </div>
  );
}
