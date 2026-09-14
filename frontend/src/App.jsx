import React, { useState, useEffect } from 'react';
import Navbar from './components/layout/Navbar';
import ShellPreview from './components/layout/ShellPreview';
import Dashboard from './components/dashboard/Dashboard';
import LeaderboardView from './components/leaderboard/LeaderboardView';
import LearningPathView from './components/learning/LearningPathView';
import PracticalPathView from './components/practical/PracticalPathView';
import AuthModal from './components/auth/AuthModal';
import { BookOpen, Terminal, LayoutDashboard, Shield, LogIn } from 'lucide-react';
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

  // User Auth State
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('commitdrive_user');
      if (savedUser) return JSON.parse(savedUser);
      // Default to demo student so reviewer lands right on Dashboard
      return {
        name: 'Mikro Student',
        email: 'cs.placement@prep.edu',
        role: 'SDE Aspirant 2026',
        targetYear: '2026',
        streak: 3
      };
    } catch {
      return null;
    }
  });

  // Auth Modal State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

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
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main View Router */}
      {currentView === 'dashboard' ? (
        <Dashboard 
          currentUser={currentUser}
          onNavigate={setCurrentView}
        />
      ) : currentView === 'leaderboard' ? (
        <LeaderboardView 
          currentUser={currentUser}
          onNavigate={setCurrentView}
        />
      ) : currentView === 'learning' ? (
        <LearningPathView 
          onNavigate={setCurrentView}
        />
      ) : (
        <PracticalPathView 
          onNavigate={setCurrentView}
        />
      )}

      {/* Frontend Auth Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
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
                onClick={() => setIsAuthModalOpen(true)}
              >
                <LogIn size={13} />
                <span>Sign In / Demo</span>
              </button>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}
