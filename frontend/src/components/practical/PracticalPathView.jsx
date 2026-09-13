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
  ChevronRight 
} from 'lucide-react';
import { practicalModules, calculateModuleProgress } from '../../data/practicalCurriculum';
import PracticeTerminal from './PracticeTerminal';
import MockTestView from './MockTestView';
import './PracticalPathView.css';

export default function PracticalPathView({ onNavigate }) {
  // Active Module State: 'git' | 'linux' | 'sql'
  const [activeModuleId, setActiveModuleId] = useState(() => {
    try {
      return localStorage.getItem('commitdrive_practical_module') || 'git';
    } catch {
      return 'git';
    }
  });

  // Active Mode State: 'practice' | 'mock-test'
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
      return saved ? JSON.parse(saved) : ['git-1', 'linux-1', 'sql-1'];
    } catch {
      return ['git-1', 'linux-1', 'sql-1'];
    }
  });

  // Sync active module & mode to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('commitdrive_practical_module', activeModuleId);
      localStorage.setItem('commitdrive_practical_mode', activeMode);
    } catch {
      // storage unavailable
    }
  }, [activeModuleId, activeMode]);

  // Sync completed missions to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('commitdrive_completed_missions', JSON.stringify(completedMissions));
    } catch {
      // storage unavailable
    }
  }, [completedMissions]);

  // Handle mission completion
  const handleCompleteMission = (missionId) => {
    setCompletedMissions(prev => {
      if (prev.includes(missionId)) return prev;
      return [...prev, missionId];
    });
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
                  onClick={() => setActiveModuleId(mod.id)}
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
            2. Mode Switcher Bar (Practice Terminal vs Mock Test)
            =================================================================== */}
        <div className="mode-switcher-bar theme-transition">
          <div className="mode-buttons-group">
            <button
              className={`mode-toggle-btn ${activeMode === 'practice' ? 'active' : ''} theme-transition`}
              onClick={() => setActiveMode('practice')}
            >
              <Terminal size={15} />
              <span>Practice Mode (Simulated Terminal)</span>
            </button>

            <button
              className={`mode-toggle-btn ${activeMode === 'mock-test' ? 'active' : ''} theme-transition`}
              onClick={() => setActiveMode('mock-test')}
            >
              <FileCheck2 size={15} />
              <span>Mock Test Mode (Timed Test)</span>
            </button>
          </div>

          <div className="mode-context-hint">
            {activeMode === 'practice' ? (
              <span>🛠 Story-based terminal missions with regex validation & under-the-hood explanations</span>
            ) : (
              <span>⏱ 15-minute timed test with automated diagnostic report</span>
            )}
          </div>
        </div>

        {/* ===================================================================
            3. Dynamic Mode Canvas
            =================================================================== */}
        <div className="practical-canvas-wrapper">
          {activeMode === 'practice' ? (
            <PracticeTerminal 
              moduleId={activeModuleId}
              completedMissions={completedMissions}
              onCompleteMission={handleCompleteMission}
            />
          ) : (
            <MockTestView 
              moduleId={activeModuleId}
              onSwitchToPractice={() => setActiveMode('practice')}
            />
          )}
        </div>

      </div>
    </div>
  );
}
