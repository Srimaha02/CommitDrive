import React, { useState, useEffect } from 'react';
import Navbar from './components/layout/Navbar';
import ShellPreview from './components/layout/ShellPreview';
import Dashboard from './components/dashboard/Dashboard';
import LeaderboardView from './components/leaderboard/LeaderboardView';
import LearningPathView from './components/learning/LearningPathView';
import PracticalPathView from './components/practical/PracticalPathView';
import AuthModal from './components/auth/AuthModal';
import CramSheetModal from './components/common/CramSheetModal';
import VivaModal from './components/viva/VivaModal';
import CursorGlow from './components/common/CursorGlow';
import { BookOpen, Terminal, LayoutDashboard, Shield, LogIn, Zap } from 'lucide-react';
import './App.css';

export default function App() {
  // Navigation View: 'dashboard' | 'learning' | 'practical'
  const [currentView, setCurrentView] = useState(() => {
    try {
      const saved = localStorage.getItem('commitdrive_view');
      return saved || 'dashboard';
    } catch {
      return 'dashboard';
    }
  });

  // User Auth State: unauthenticated visitor by default if not previously logged in
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('commitdrive_user');
      if (savedUser) return JSON.parse(savedUser);
      return null;
    } catch {
      return null;
    }
  });

  // Auth Modal State with Tab Selection ('signin' | 'signup')
  const [authModalConfig, setAuthModalConfig] = useState({ isOpen: false, tab: 'signin' });
  const handleOpenAuth = (tab = 'signin') => setAuthModalConfig({ isOpen: true, tab });
  const handleCloseAuth = () => setAuthModalConfig(prev => ({ ...prev, isOpen: false }));

  // Emergency Cram Sheet Modal State
  const [cramSheetConfig, setCramSheetConfig] = useState({ isOpen: false, subject: null, track: 'all' });
  const handleOpenCramSheet = (subject = null, track = 'all') => setCramSheetConfig({ isOpen: true, subject, track: track || 'all' });
  const handleCloseCramSheet = () => setCramSheetConfig(prev => ({ ...prev, isOpen: false }));

  // Diagnostic Mock Viva Modal State
  const [vivaIsOpen, setVivaIsOpen] = useState(false);
  const handleOpenViva  = () => setVivaIsOpen(true);
  const handleCloseViva = () => setVivaIsOpen(false);

  // Global listener for opening Cram Sheet from any child component or event
  useEffect(() => {
    const handleCramEvent = (e) => {
      const subject = e.detail?.subject !== undefined ? e.detail.subject : null;
      const track = e.detail?.track || 'all';
      handleOpenCramSheet(subject, track);
    };
    window.addEventListener('commitdrive_open_cram_sheet', handleCramEvent);
    return () => window.removeEventListener('commitdrive_open_cram_sheet', handleCramEvent);
  }, []);

  // Quick 1-Click Demo Login for reviewing and testing
  const handleQuickDemoLogin = () => {
    handleLoginSuccess({
      id: 'a0000000-0000-0000-0000-000000000001',
      name: 'Demo Student',
      email: 'demo@commitdrive.dev',
      role: 'SDE Aspirant (Demo)',
      targetYear: '2026',
      streak: 1,
      targetCompanyTier: 'Tier 1 Product Companies',
      isDemo: true
    });
  };

  // Sync data-theme attribute with current view
  // Practical view uses 'practical' (dark Terminal Zone)
  // Dashboard & Learning view use 'learning' (light energetic Study Corner)
  useEffect(() => {
    const theme = currentView === 'practical' ? 'practical' : 'learning';
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('commitdrive_view', currentView);
    } catch {
      // storage unavailable
    }
  }, [currentView]);

  // Handle Login Success
  const handleLoginSuccess = (userData) => {
    setCurrentUser(userData);
    try {
      localStorage.setItem('commitdrive_user', JSON.stringify(userData));
      localStorage.removeItem('commitdrive_completed_topics');
      localStorage.removeItem('commitdrive_completed_missions');
      localStorage.removeItem('commitdrive_mock_attempts');
      localStorage.removeItem('commitdrive_flashcard_reviews');
    } catch {
      // storage unavailable
    }
    setCurrentView('dashboard');
  };

  // Handle Logout
  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('commitdrive_user');
      localStorage.removeItem('commitdrive_completed_topics');
      localStorage.removeItem('commitdrive_completed_missions');
      localStorage.removeItem('commitdrive_mock_attempts');
      localStorage.removeItem('commitdrive_flashcard_reviews');
    } catch {
      // storage unavailable
    }
  };

  return (
    <div className="app-container theme-transition">
      {/* Top Shared Navbar */}
      <Navbar 
        currentView={currentView}
        onNavigate={setCurrentView}
        currentUser={currentUser}
        onOpenAuth={() => handleOpenAuth('signin')}
        onLogout={handleLogout}
        onOpenCramSheet={handleOpenCramSheet}
        onOpenViva={handleOpenViva}
      />

      {/* Main View Router */}
      {currentView === 'dashboard' ? (
        <Dashboard 
          currentUser={currentUser}
          onNavigate={setCurrentView}
          onOpenAuth={handleOpenAuth}
          onDemoLogin={handleQuickDemoLogin}
          onOpenCramSheet={handleOpenCramSheet}
        />
      ) : currentView === 'leaderboard' ? (
        <LeaderboardView 
          currentUser={currentUser}
          onNavigate={setCurrentView}
          onOpenAuth={handleOpenAuth}
          onDemoLogin={handleQuickDemoLogin}
        />
      ) : currentView === 'learning' ? (
        <LearningPathView 
          currentUser={currentUser}
          onNavigate={setCurrentView}
          onOpenAuth={handleOpenAuth}
          onDemoLogin={handleQuickDemoLogin}
          onOpenCramSheet={handleOpenCramSheet}
        />
      ) : (
        <PracticalPathView 
          currentUser={currentUser}
          onNavigate={setCurrentView}
          onOpenAuth={handleOpenAuth}
          onDemoLogin={handleQuickDemoLogin}
          onOpenCramSheet={handleOpenCramSheet}
        />
      )}

      {/* Frontend Auth Modal */}
      <AuthModal 
        isOpen={authModalConfig.isOpen}
        initialTab={authModalConfig.tab}
        onClose={handleCloseAuth}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Emergency Cram Sheet Modal */}
      <CramSheetModal 
        isOpen={cramSheetConfig.isOpen}
        initialSubject={cramSheetConfig.subject}
        initialTrack={cramSheetConfig.track || 'all'}
        onClose={handleCloseCramSheet}
      />

      {/* Diagnostic Interview Viva Modal */}
      <VivaModal
        isOpen={vivaIsOpen}
        onClose={handleCloseViva}
        onOpenCramSheet={handleOpenCramSheet}
      />

      {/* Footer / Shell Status Info */}
      <footer className="shell-footer theme-transition">
        <div className="content-wrapper footer-content">
          <div className="footer-left">
            <p className="footer-brand">
              Commit<strong>Drive</strong> <span className="footer-edition">Placement Engineering Platform</span>
            </p>
            <p className="footer-sub">
              Dual-mood architecture: <em>Study Corner</em> (Light Warm Coral) & <em>Terminal Zone</em> (Deep Terminal Green).
            </p>
          </div>

          <div className="footer-right">
            <div className="quick-switch-hint">
              <span>View Mode: </span>
              <button 
                className="active-mood-badge theme-transition"
                onClick={() => setCurrentView(currentView === 'practical' ? 'learning' : 'practical')}
                title="Click to crossfade visual theme"
              >
                {currentView === 'practical' ? (
                  <>
                    <Terminal size={13} />
                    <span>Terminal Zone (#0d1210)</span>
                  </>
                ) : (
                  <>
                    <BookOpen size={13} />
                    <span>Study Corner (#fdf6ec)</span>
                  </>
                )}
              </button>
            </div>

            {!currentUser && (
              <button 
                className="footer-signin-trigger theme-transition"
                onClick={() => handleOpenAuth('signin')}
              >
                <LogIn size={13} />
                <span>Sign In / Demo</span>
              </button>
            )}
          </div>
        </div>
      </footer>

      {/* Subtle Trailing Cursor Glow */}
      <CursorGlow />
    </div>
  );
}
