import React, { useState, useEffect, useMemo } from 'react';
import { 
  X, 
  User, 
  Mail, 
  Trophy, 
  Flame, 
  Target, 
  Sparkles, 
  GraduationCap, 
  Briefcase, 
  Zap, 
  LogOut, 
  ArrowRight, 
  Quote,
  CheckCircle2
} from 'lucide-react';
import { dashboardApi } from '../../services/api';
import './ProfileModal.css';

const MOTIVATIONAL_QUOTES = [
  {
    quote: "Consistency beats intensity. One core CS concept and one terminal mission every day unlocks top Tier-1 placement offers.",
    author: "CommitDrive Placement Focus"
  },
  {
    quote: "Every technical bug you solve and system call you master today gives you the winning edge in tomorrow's interview room.",
    author: "SDE Technical Interview Blueprint"
  },
  {
    quote: "Frameworks come and go, but strong fundamentals in OS, DBMS, Networks, and clean code remain timeless.",
    author: "Core CS Engineering Wisdom"
  },
  {
    quote: "Great engineers aren't built on shortcuts; they are forged in terminal sessions, deep understanding, and daily discipline.",
    author: "Placement Mentorship"
  }
];

export default function ProfileModal({ isOpen, onClose, currentUser, onLogout, onOpenAuth, onNavigate }) {
  const [stats, setStats] = useState(null);
  const [userRank, setUserRank] = useState(1);

  // Daily or pseudo-random motivational quote
  const dailyQuote = useMemo(() => {
    const day = new Date().getDate();
    return MOTIVATIONAL_QUOTES[day % MOTIVATIONAL_QUOTES.length] || MOTIVATIONAL_QUOTES[0];
  }, []);

  const user = currentUser || {
    id: 'a0000000-0000-0000-0000-000000000001',
    name: 'Demo Student',
    email: 'demo@commitdrive.dev',
    role: 'SDE Aspirant 2026',
    targetYear: '2026',
    streak: 2,
    targetCompanyTier: 'Tier 1 Product Companies',
    isDemo: true
  };

  const initials = (user?.name && typeof user.name === 'string')
    ? user.name.split(' ').filter(Boolean).map(n => n[0]).join('').substring(0, 2).toUpperCase()
    : 'DS';

  useEffect(() => {
    if (!isOpen) return;

    // Fetch dashboard stats (readiness & XP)
    dashboardApi.getStats().then(res => {
      if (res && res.data) {
        setStats(res.data);
      }
    }).catch(() => {});

    // Fetch leaderboard to calculate actual user campus rank
    dashboardApi.getLeaderboard().then(res => {
      const list = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
      if (list.length > 0) {
        const sorted = [...list].sort((a, b) => {
          const rCmp = (b.overallReadinessPct || 0) - (a.overallReadinessPct || 0);
          if (rCmp !== 0) return rCmp;
          return (b.totalXp || 0) - (a.totalXp || 0);
        });
        const idx = sorted.findIndex(c => 
          (currentUser && (c.userId === currentUser.id || c.email === currentUser.email))
        );
        setUserRank(idx !== -1 ? idx + 1 : 1);
      }
    }).catch(() => {});
  }, [isOpen, currentUser]);

  if (!isOpen) return null;

  const readinessPct = stats?.overallReadinessPct ?? (currentUser ? 0 : 0);
  const totalXp = stats?.totalXp ?? (user.streak ? user.streak * 120 : 240);

  return (
    <div className="profile-modal-backdrop" onClick={onClose}>
      <div 
        className="profile-modal-card" 
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-title"
      >
        {/* Header */}
        <div className="profile-modal-header">
          <div className="profile-header-title-group">
            <User size={20} className="profile-header-icon" />
            <h2 id="profile-title" className="profile-modal-title">Student Profile</h2>
          </div>
          <button 
            type="button" 
            className="profile-modal-close-btn" 
            onClick={onClose}
            aria-label="Close profile"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="profile-modal-body">
          
          {/* User Details & Identity Header */}
          <div className="profile-identity-card">
            <div className="profile-avatar-large">
              <span>{initials}</span>
              <span className="online-dot" />
            </div>
            <div className="profile-identity-info">
              <div className="profile-identity-top">
                <h3 className="profile-user-name">{user.name || 'Student Candidate'}</h3>
                {user.isDemo ? (
                  <span className="profile-demo-tag">Demo Mode</span>
                ) : (
                  <span className="profile-verified-tag">
                    <CheckCircle2 size={11} /> Verified Student
                  </span>
                )}
              </div>

              {/* Email */}
              <div className="profile-user-email">
                <Mail size={13} className="email-icon" />
                <span>{user.email || 'student@commitdrive.dev'}</span>
              </div>

              {/* Meta details */}
              <div className="profile-identity-meta">
                <span className="identity-meta-pill">
                  <Briefcase size={12} />
                  <span>{user.role || 'SDE Aspirant'}</span>
                </span>
                <span className="identity-meta-pill">
                  <GraduationCap size={12} />
                  <span>Class of {user.targetYear || '2026'}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Motivational Quote Banner */}
          <div className="profile-quote-card">
            <div className="quote-header">
              <div className="quote-badge">
                <Sparkles size={13} className="sparkle-icon" />
                <span>Placement Quote of the Day</span>
              </div>
            </div>
            <div className="quote-body">
              <Quote size={20} className="quote-marks-icon" />
              <p className="quote-text">{dailyQuote?.quote || "Consistency beats intensity. One core CS concept and one terminal mission every day unlocks top Tier-1 placement offers."}</p>
            </div>
          </div>

          {/* Key Placement Stats & Leaderboard Rank */}
          <div className="profile-stats-grid">
            
            {/* Leaderboard Rank Card */}
            <div className="stat-card rank-stat-card">
              <div className="stat-icon-wrapper rank-icon-wrapper">
                <Trophy size={18} />
              </div>
              <div className="stat-details">
                <span className="stat-label">Campus Rank</span>
                <span className="stat-value rank-highlight">#{userRank}</span>
                <span className="stat-subtext">in 2026 Cohort</span>
              </div>
            </div>

            {/* Daily Streak */}
            <div className="stat-card streak-stat-card">
              <div className="stat-icon-wrapper streak-icon-wrapper">
                <Flame size={18} />
              </div>
              <div className="stat-details">
                <span className="stat-label">Daily Streak</span>
                <span className="stat-value">{user.streak || 2} Days</span>
                <span className="stat-subtext">Active Practice 🔥</span>
              </div>
            </div>

            {/* Placement Readiness */}
            <div className="stat-card readiness-stat-card">
              <div className="stat-icon-wrapper readiness-icon-wrapper">
                <Target size={18} />
              </div>
              <div className="stat-details">
                <span className="stat-label">Drive Readiness</span>
                <span className="stat-value">{readinessPct}%</span>
                <span className="stat-subtext">Overall Score</span>
              </div>
            </div>

            {/* XP Points */}
            <div className="stat-card xp-stat-card">
              <div className="stat-icon-wrapper xp-icon-wrapper">
                <Zap size={18} />
              </div>
              <div className="stat-details">
                <span className="stat-label">Earned XP</span>
                <span className="stat-value">{totalXp} XP</span>
                <span className="stat-subtext">Theory + Terminal</span>
              </div>
            </div>

          </div>

        </div>

        {/* Footer Actions */}
        <div className="profile-modal-footer">
          <div className="footer-left-actions">
            {onNavigate && (
              <button 
                type="button" 
                className="profile-leaderboard-link-btn"
                onClick={() => {
                  onClose();
                  onNavigate('leaderboard');
                }}
              >
                <Trophy size={14} />
                <span>View Full Leaderboard</span>
                <ArrowRight size={13} />
              </button>
            )}
          </div>

          <div className="footer-right-actions">
            {onLogout ? (
              <button 
                type="button" 
                className="profile-signout-btn"
                onClick={() => {
                  onClose();
                  onLogout();
                }}
              >
                <LogOut size={14} />
                <span>Sign Out</span>
              </button>
            ) : null}

            <button 
              type="button" 
              className="profile-done-btn"
              onClick={onClose}
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
