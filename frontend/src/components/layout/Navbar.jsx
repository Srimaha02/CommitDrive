import React, { useState, useRef, useEffect } from 'react';
import { 
  BookOpen, 
  Terminal, 
  Flame, 
  CheckCircle2, 
  User, 
  Sparkles, 
  ChevronDown, 
  Settings, 
  LogOut, 
  LogIn,
  ExternalLink,
  ShieldCheck,
  LayoutDashboard,
  Trophy,
  Zap,
  Target
} from 'lucide-react';
import { dashboardApi } from '../../services/api';
import './Navbar.css';

export default function Navbar({ 
  currentView, 
  onNavigate, 
  currentUser, 
  onOpenAuth, 
  onLogout,
  onOpenCramSheet,
  onOpenViva
}) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [readinessPct, setReadinessPct] = useState(0);
  const menuRef = useRef(null);

  // Fetch real-time readiness for Navbar
  const fetchReadiness = () => {
    dashboardApi.getStats().then(res => {
      if (res && res.data) {
        setReadinessPct(res.data.overallReadinessPct ?? 0);
      }
    }).catch(() => {});
  };

  useEffect(() => {
    fetchReadiness();

    const handleProgressUpdate = () => {
      fetchReadiness();
    };

    window.addEventListener('commitdrive_progress_updated', handleProgressUpdate);
    window.addEventListener('focus', handleProgressUpdate);

    return () => {
      window.removeEventListener('commitdrive_progress_updated', handleProgressUpdate);
      window.removeEventListener('focus', handleProgressUpdate);
    };
  }, [currentUser]);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isLearningTheme = currentView !== 'practical';

  return (
    <header className="shared-navbar theme-transition">
      <div className="content-wrapper nav-container">
        
        {/* Left: Brand Identity */}
        <div className="brand-group" onClick={() => onNavigate('dashboard')}>
          <div className="brand-logo-container theme-transition">
            <svg 
              className="brand-logo-svg" 
              viewBox="0 0 32 32" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              aria-label="CommitDrive Logo"
            >
              <rect width="32" height="32" rx="8" className="logo-bg theme-transition" />
              <circle cx="16" cy="16" r="10" stroke="currentColor" strokeWidth="2.2" strokeDasharray="3 3" opacity="0.6" />
              <circle cx="16" cy="10" r="2.8" fill="currentColor" />
              <circle cx="16" cy="22" r="2.8" fill="currentColor" />
              <circle cx="22" cy="16" r="2.8" fill="currentColor" />
              <path d="M16 12.8V19.2M16 16H19.2" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
            </svg>
            <div className="logo-glow-effect theme-transition" />
          </div>

          <div className="brand-titles">
            <div className="brand-title-row">
              <span className="brand-name">Commit<span className="brand-accent">Drive</span></span>
              <span className="brand-version-badge theme-transition">v1.0</span>
            </div>
            <span className="brand-tagline">
              {currentView === 'dashboard' 
                ? 'Student Dashboard • Class of 2026' 
                : currentView === 'leaderboard'
                  ? 'Leaderboard • Campus Standings'
                  : currentView === 'learning' 
                    ? 'Study Corner • Core CS Theory' 
                    : 'Terminal Zone • Hands-on Lab'}
            </span>
          </div>
        </div>

        {/* Center: Navigation Pill Switcher */}
        <nav className="nav-center-switcher">
          <div className="path-switcher-track theme-transition" role="tablist">
            
            {/* Dashboard Tab */}
            <button
              id="nav-tab-dashboard"
              role="tab"
              aria-selected={currentView === 'dashboard'}
              className={`switcher-btn ${currentView === 'dashboard' ? 'active' : ''} theme-transition`}
              onClick={() => onNavigate('dashboard')}
            >
              <LayoutDashboard size={15} className="switcher-icon" />
              <span className="switcher-text">Dashboard</span>
            </button>

            {/* Leaderboard Tab */}
            <button
              id="nav-tab-leaderboard"
              role="tab"
              aria-selected={currentView === 'leaderboard'}
              className={`switcher-btn ${currentView === 'leaderboard' ? 'active' : ''} theme-transition`}
              onClick={() => onNavigate('leaderboard')}
            >
              <Trophy size={15} className="switcher-icon" />
              <span className="switcher-text">Leaderboard</span>
            </button>

            {/* Learning Path Tab */}
            <button
              id="nav-tab-learning"
              role="tab"
              aria-selected={currentView === 'learning'}
              className={`switcher-btn ${currentView === 'learning' ? 'active' : ''} theme-transition`}
              onClick={() => onNavigate('learning')}
            >
              <BookOpen size={15} className="switcher-icon" />
              <span className="switcher-text">Learning Path</span>
              <span className="switcher-badge learning-pill">Theory</span>
            </button>

            {/* Practical Path Tab */}
            <button
              id="nav-tab-practical"
              role="tab"
              aria-selected={currentView === 'practical'}
              className={`switcher-btn ${currentView === 'practical' ? 'active' : ''} theme-transition`}
              onClick={() => onNavigate('practical')}
            >
              <Terminal size={15} className="switcher-icon" />
              <span className="switcher-text">Practical Path</span>
              <span className="switcher-badge practical-pill">Terminal</span>
            </button>

          </div>
        </nav>

        {/* Right: Quick Stats & User Profile */}
        <div className="nav-right-group">
          
          {/* Daily Streak Indicator */}
          {currentUser && (
            <div className="streak-pill theme-transition" title="Daily Practice Streak">
              <Flame size={16} className="streak-icon" />
              <span className="streak-count">{currentUser.streak || 3}</span>
              <span className="streak-label">Days</span>
            </div>
          )}

          {/* Night-Before Cram Sheet Quick Action */}
          <button 
            type="button" 
            className="nav-cram-btn theme-transition"
            onClick={() => {
              if (onOpenCramSheet) {
                onOpenCramSheet(null);
              } else {
                window.dispatchEvent(new CustomEvent('commitdrive_open_cram_sheet', { detail: { subject: null } }));
              }
            }}
            title="Open Night-Before Interview Emergency Cram Sheet (Choose Subject)"
          >
            <Zap size={13} className="nav-cram-icon" />
            <span className="nav-cram-text">Cram Sheet</span>
          </button>

          {/* Mock Viva Quick Action */}
          <button
            type="button"
            className="nav-viva-btn theme-transition"
            onClick={() => onOpenViva && onOpenViva()}
            title="Open Diagnostic Interview Viva — Company-track aware self-assessment"
          >
            <Target size={13} className="nav-viva-icon" />
            <span className="nav-viva-text">Mock Viva</span>
          </button>

          {/* Quick Progress Metric */}
          <div className="metric-pill theme-transition" title="Placement Readiness">
            <CheckCircle2 size={16} className="metric-icon" />
            <span className="metric-count">{readinessPct}% Ready</span>
          </div>

          {/* User Profile Avatar / Sign In */}
          {currentUser ? (
            <div className="profile-wrapper" ref={menuRef}>
              <button 
                id="user-profile-btn"
                className={`profile-avatar-btn ${showProfileMenu ? 'menu-open' : ''} theme-transition`}
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                aria-label="User profile menu"
                aria-expanded={showProfileMenu}
              >
                <div className="avatar-frame theme-transition">
                  <span className="avatar-initials">
                    {currentUser.name ? currentUser.name.split(' ').map(n => n[0]).join('').substring(0, 2) : 'MS'}
                  </span>
                  <span className="online-beacon" />
                </div>
                {currentUser.isDemo && (
                  <span className="nav-demo-badge">Demo</span>
                )}
                <ChevronDown size={14} className={`chevron-indicator ${showProfileMenu ? 'rotated' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {showProfileMenu && (
                <div className="profile-dropdown theme-transition" role="menu">
                  <div className="dropdown-user-header">
                    <div className="dropdown-avatar">
                      {currentUser.name ? currentUser.name.split(' ').map(n => n[0]).join('').substring(0, 2) : 'MS'}
                    </div>
                    <div className="dropdown-user-info">
                      <p className="dropdown-name">{currentUser.name}</p>
                      <p className="dropdown-email">{currentUser.email}</p>
                      <div className="dropdown-tier-badge theme-transition">
                        <ShieldCheck size={12} />
                        <span>{currentUser.role || 'SDE Aspirant 2026'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="dropdown-divider" />

                  <div className="dropdown-section">
                    <div className="dropdown-row-stat">
                      <span>Target Batch</span>
                      <span className="stat-highlight">Class of {currentUser.targetYear || '2026'}</span>
                    </div>
                    <div className="dropdown-row-stat">
                      <span>Target Placement</span>
                      <span className="stat-highlight">Tier 1 Product Co.</span>
                    </div>
                  </div>

                  <div className="dropdown-divider" />

                  <button 
                    className="dropdown-item theme-transition" 
                    role="menuitem"
                    onClick={() => { setShowProfileMenu(false); onNavigate('dashboard'); }}
                  >
                    <LayoutDashboard size={15} />
                    <span>Dashboard Home</span>
                  </button>
                  <button 
                    className="dropdown-item theme-transition" 
                    role="menuitem"
                    onClick={() => { setShowProfileMenu(false); onNavigate('leaderboard'); }}
                  >
                    <Trophy size={15} />
                    <span>Placement Leaderboard</span>
                  </button>
                  <button 
                    className="dropdown-item theme-transition" 
                    role="menuitem"
                    onClick={() => { setShowProfileMenu(false); onNavigate('learning'); }}
                  >
                    <BookOpen size={15} />
                    <span>Study Corner (Theory)</span>
                  </button>
                  <button 
                    className="dropdown-item theme-transition" 
                    role="menuitem"
                    onClick={() => { setShowProfileMenu(false); onNavigate('practical'); }}
                  >
                    <Terminal size={15} />
                    <span>Terminal Zone (Labs)</span>
                  </button>

                  <div className="dropdown-divider" />

                  {currentUser.isDemo && (
                    <>
                      <button 
                        className="dropdown-item signup-upgrade-item theme-transition" 
                        role="menuitem"
                        onClick={() => {
                          setShowProfileMenu(false);
                          if (onOpenAuth) onOpenAuth('signup');
                        }}
                      >
                        <Sparkles size={15} className="upgrade-sparkle-icon" />
                        <span>Sign Up for Full Access</span>
                      </button>
                      <div className="dropdown-divider" />
                    </>
                  )}

                  <button 
                    className="dropdown-item logout-item theme-transition" 
                    role="menuitem"
                    onClick={() => {
                      setShowProfileMenu(false);
                      onLogout();
                    }}
                  >
                    <LogOut size={15} />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button 
              className="nav-signin-btn theme-transition"
              onClick={onOpenAuth}
            >
              <LogIn size={15} />
              <span>Sign In</span>
            </button>
          )}

        </div>

      </div>
    </header>
  );
}
