import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Flame, 
  CheckCircle2, 
  Zap, 
  Search, 
  ArrowUpDown, 
  Medal, 
  Crown, 
  ArrowRight, 
  Users, 
  Sparkles,
  BookOpen,
  Terminal,
  ShieldCheck,
  Award
} from 'lucide-react';
import { dashboardApi } from '../../services/api';
import GatedContentPreview from '../layout/GatedContentPreview';
import './LeaderboardView.css';

export default function LeaderboardView({ currentUser, onNavigate, onOpenAuth, onDemoLogin }) {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('readiness'); // 'readiness' | 'xp'
  const [searchQuery, setSearchQuery] = useState('');

  const fetchLeaderboard = () => {
    dashboardApi.getLeaderboard().then(res => {
      if (res && Array.isArray(res.data)) {
        setCandidates(res.data);
      } else if (res && Array.isArray(res)) {
        setCandidates(res);
      }
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchLeaderboard();

    const handleProgressUpdate = () => {
      fetchLeaderboard();
    };

    window.addEventListener('commitdrive_progress_updated', handleProgressUpdate);
    window.addEventListener('focus', handleProgressUpdate);

    return () => {
      window.removeEventListener('commitdrive_progress_updated', handleProgressUpdate);
      window.removeEventListener('focus', handleProgressUpdate);
    };
  }, [currentUser]);

  // Sort candidates
  const sortedCandidates = [...candidates].sort((a, b) => {
    if (sortBy === 'readiness') {
      const cmp = (b.overallReadinessPct || 0) - (a.overallReadinessPct || 0);
      if (cmp !== 0) return cmp;
      return (b.totalXp || 0) - (a.totalXp || 0);
    } else {
      const cmp = (b.totalXp || 0) - (a.totalXp || 0);
      if (cmp !== 0) return cmp;
      return (b.overallReadinessPct || 0) - (a.overallReadinessPct || 0);
    }
  });

  // Filter candidates by search
  const filteredCandidates = sortedCandidates.filter(c => {
    const q = searchQuery.toLowerCase();
    const name = (c.fullName || '').toLowerCase();
    const email = (c.email || '').toLowerCase();
    const role = (c.role || '').toLowerCase();
    return name.includes(q) || email.includes(q) || role.includes(q);
  });

  // User rank in full sorted list
  const userRankIndex = sortedCandidates.findIndex(c => 
    (currentUser && c.userId === currentUser.id) || 
    (currentUser && c.email === currentUser.email)
  );
  const userRank = userRankIndex !== -1 ? userRankIndex + 1 : 1;
  const userStats = sortedCandidates[userRankIndex] || null;

  // Podium (Top 3 or available)
  const podiumCandidates = sortedCandidates.slice(0, Math.min(3, sortedCandidates.length));

  return (
    <div className="leaderboard-view theme-transition">
      <div className="content-wrapper leaderboard-container">

        <GatedContentPreview
          isGated={!currentUser}
          badgeText="Placement Cohort Leaderboard"
          title="Sign up to view full batch rankings"
          subtitle="Join the verified 2026 placement cohort. Track peer standings, verified CS theory mastery, hands-on lab XP, and readiness percentiles."
          features={[
            'Full real-time rankings for all 50+ batch candidate profiles',
            'Search & filter candidates by role, cohort year, and readiness',
            'Synchronized XP tracking from theory topics & practical labs',
            'Benchmark your readiness against candidates interviewing at FAANG & Tier 1'
          ]}
          ctaText="Sign up to view full rankings"
          onSignUp={() => onOpenAuth && onOpenAuth('signup')}
          onSignIn={() => onOpenAuth && onOpenAuth('signin')}
          onDemoLogin={onDemoLogin}
          previewContent={
            <>
              {/* Header Hero */}
              <header className="leaderboard-header theme-transition">
                <div className="leaderboard-header-content">
                  <div className="leaderboard-badge">
                    <Trophy size={15} className="trophy-icon" />
                    <span>Campus Batch Rankings • Real-Time Standings</span>
                  </div>
                  <h1 className="leaderboard-title">Placement Readiness Leaderboard</h1>
                  <p className="leaderboard-desc">
                    Verified ranking of registered candidates based on completed core CS theory topics, hands-on terminal missions, and daily discipline.
                  </p>
                </div>

                {/* Quick Stat Summary Cards */}
                <div className="leaderboard-summary-row">
                  <div className="summary-stat-card theme-transition">
                    <span className="summary-stat-label">
                      <Users size={14} />
                      <span>Registered Candidates</span>
                    </span>
                    <strong className="summary-stat-value">{candidates.length}</strong>
                    <span className="summary-stat-sub">Verified Placement Cohort</span>
                  </div>

                  <div className="summary-stat-card theme-transition highlight-user-stat">
                    <span className="summary-stat-label">
                      <Award size={14} />
                      <span>Your Standing</span>
                    </span>
                    <strong className="summary-stat-value">Rank #{userRank}</strong>
                    <span className="summary-stat-sub">
                      {userStats ? `${userStats.overallReadinessPct || 0}% Ready • ${userStats.totalXp || 0} XP` : 'Active'}
                    </span>
                  </div>
                </div>
              </header>

              {/* Podium Display for Top Ranked Candidates */}
              {podiumCandidates.length > 0 && (
                <section className="leaderboard-podium-section" aria-label="Top Ranked Candidates">
                  <div className={`podium-grid podium-count-${podiumCandidates.length}`}>
                    {podiumCandidates.map((candidate, idx) => {
                      const rankNum = idx + 1;
                      const isCurrentUser = (currentUser && candidate.userId === currentUser.id) || 
                                           (currentUser && candidate.email === currentUser.email);
                      
                      let rankClass = 'podium-rank-1';
                      if (rankNum === 2) { rankClass = 'podium-rank-2'; }
                      if (rankNum === 3) { rankClass = 'podium-rank-3'; }

                      return (
                        <div 
                          key={candidate.userId || idx} 
                          className={`podium-card ${rankClass} ${isCurrentUser ? 'is-self' : ''} theme-transition`}
                        >
                          <div className="podium-crown">
                            {rankNum === 1 && <Crown size={24} className="crown-icon gold" />}
                            {rankNum === 2 && <Medal size={22} className="crown-icon silver" />}
                            {rankNum === 3 && <Medal size={20} className="crown-icon bronze" />}
                          </div>

                          <div className="podium-avatar-wrapper">
                            <div className="podium-avatar">
                              {(candidate.fullName || 'User').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                            </div>
                            <span className="podium-rank-badge">#{rankNum}</span>
                          </div>

                          <div className="podium-info">
                            <div className="podium-name-row">
                              <h3 className="podium-name">{candidate.fullName || 'Candidate'}</h3>
                              {isCurrentUser && <span className="self-tag">You</span>}
                            </div>
                            <p className="podium-role">{candidate.role || 'SDE Aspirant'} • {candidate.targetYear || '2026'}</p>
                          </div>

                          <div className="podium-stats-row">
                            <div className="podium-stat">
                              <span className="stat-label">Readiness</span>
                              <strong className="stat-val readiness-val">{candidate.overallReadinessPct || 0}%</strong>
                            </div>
                            <div className="podium-stat-divider" />
                            <div className="podium-stat">
                              <span className="stat-label">Total XP</span>
                              <strong className="stat-val xp-val">⚡ {candidate.totalXp || 0}</strong>
                            </div>
                          </div>

                          <div className="podium-bar-wrapper">
                            <div 
                              className="podium-bar-fill" 
                              style={{ width: `${Math.max(5, candidate.overallReadinessPct || 0)}%` }} 
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}
            </>
          }
        >
          {/* Controls & Search Bar */}
          <div className="leaderboard-controls-bar theme-transition">
            {/* Search Input */}
            <div className="leaderboard-search-box">
              <Search size={16} className="search-icon" />
              <input 
                type="text" 
                placeholder="Search candidate by name or role..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              {searchQuery && (
                <button 
                  className="clear-search-btn"
                  onClick={() => setSearchQuery('')}
                >
                  Clear
                </button>
              )}
            </div>

            {/* Metric Sort Switcher */}
            <div className="sort-toggle-group">
              <span className="sort-label">Rank by:</span>
              <div className="sort-pills" role="tablist">
                <button 
                  role="tab"
                  aria-selected={sortBy === 'readiness'}
                  className={`sort-pill ${sortBy === 'readiness' ? 'active' : ''} theme-transition`}
                  onClick={() => setSortBy('readiness')}
                >
                  <CheckCircle2 size={14} />
                  <span>Readiness %</span>
                </button>
                <button 
                  role="tab"
                  aria-selected={sortBy === 'xp'}
                  className={`sort-pill ${sortBy === 'xp' ? 'active' : ''} theme-transition`}
                  onClick={() => setSortBy('xp')}
                >
                  <Zap size={14} />
                  <span>Total XP</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Ranking Table / List */}
          <section className="leaderboard-table-card theme-transition">
            <div className="table-header-row">
              <div className="col-rank">Rank</div>
              <div className="col-candidate">Candidate</div>
              <div className="col-mastery">Curriculum Progress</div>
              <div className="col-streak">Streak</div>
              <div className="col-readiness">Readiness %</div>
              <div className="col-xp">Total XP</div>
            </div>

            {loading ? (
              <div className="table-loading-state">
                <div className="loading-spinner" />
                <p>Loading verified cohort standings...</p>
              </div>
            ) : filteredCandidates.length === 0 ? (
              <div className="table-empty-state">
                <p>No candidates match "{searchQuery}"</p>
                <button onClick={() => setSearchQuery('')} className="reset-search-btn">
                  Reset Search
                </button>
              </div>
            ) : (
              <div className="table-body">
                {filteredCandidates.map((candidate) => {
                  const rank = sortedCandidates.findIndex(c => c.userId === candidate.userId) + 1;
                  const isCurrentUser = (currentUser && candidate.userId === currentUser.id) || 
                                       (currentUser && candidate.email === currentUser.email);

                  return (
                    <div 
                      key={candidate.userId || rank} 
                      className={`table-row ${isCurrentUser ? 'is-self' : ''} theme-transition`}
                    >
                      {/* Rank */}
                      <div className="col-rank">
                        {rank === 1 ? (
                          <span className="rank-medal gold" title="Rank 1">🥇</span>
                        ) : rank === 2 ? (
                          <span className="rank-medal silver" title="Rank 2">🥈</span>
                        ) : rank === 3 ? (
                          <span className="rank-medal bronze" title="Rank 3">🥉</span>
                        ) : (
                          <span className="rank-number">#{rank}</span>
                        )}
                      </div>

                      {/* Candidate Identity */}
                      <div className="col-candidate">
                        <div className="candidate-avatar">
                          {(candidate.fullName || 'User').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                        </div>
                        <div className="candidate-details">
                          <div className="candidate-name-row">
                            <span className="candidate-name">{candidate.fullName || 'Candidate'}</span>
                            {isCurrentUser && <span className="self-pill">You</span>}
                          </div>
                          <span className="candidate-sub">
                            {candidate.role || 'SDE Aspirant'} • Class of {candidate.targetYear || '2026'}
                          </span>
                        </div>
                      </div>

                      {/* Curriculum Progress Breakdown */}
                      <div className="col-mastery">
                        <div className="mastery-badges">
                          <span className="mastery-pill theory" title="Core CS Theory Topics Mastered">
                            <BookOpen size={12} />
                            <span>{candidate.totalTopicsMastered || 0}/30 Topics</span>
                          </span>
                          <span className="mastery-pill practical" title="Practical Missions Passed">
                            <Terminal size={12} />
                            <span>{candidate.totalMissionsPassed || 0}/24 Labs</span>
                          </span>
                        </div>
                      </div>

                      {/* Daily Streak */}
                      <div className="col-streak">
                        {(candidate.streak || 0) > 0 ? (
                          <span className="streak-indicator active" title="Active Practice Streak">
                            <Flame size={14} />
                            <span>{candidate.streak}d</span>
                          </span>
                        ) : (
                          <span className="streak-indicator inactive">—</span>
                        )}
                      </div>

                      {/* Readiness Percentage */}
                      <div className="col-readiness">
                        <div className="readiness-cell-wrapper">
                          <div className="readiness-progress-bar">
                            <div 
                              className="readiness-fill" 
                              style={{ width: `${candidate.overallReadinessPct || 0}%` }}
                            />
                          </div>
                          <span className="readiness-pct-text">{candidate.overallReadinessPct || 0}%</span>
                        </div>
                      </div>

                      {/* Total XP */}
                      <div className="col-xp">
                        <span className="xp-badge">
                          <Zap size={13} className="xp-icon" />
                          <span>{candidate.totalXp || 0} XP</span>
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Table Footer Real Data Note */}
            <footer className="table-footer-notice">
              <ShieldCheck size={14} className="notice-icon" />
              <span>
                Real registered database candidates only. Ranking reflects actual verified topic mastery, lab missions, and practice streaks.
              </span>
            </footer>
          </section>

          {/* Motivational Call-to-Action Bar */}
          <section className="leaderboard-cta-bar theme-transition">
            <div className="cta-text-group">
              <h3 className="cta-heading">Want to climb the placement rankings?</h3>
              <p className="cta-sub">
                Master core CS theory topics (+100 XP each) or complete practical Linux, Git & SQL missions (+125 XP each).
              </p>
            </div>
            <div className="cta-actions">
              <button 
                className="cta-btn primary-cta theme-transition"
                onClick={() => onNavigate('learning')}
              >
                <BookOpen size={16} />
                <span>Study Core Theory</span>
                <ArrowRight size={15} />
              </button>
              <button 
                className="cta-btn secondary-cta theme-transition"
                onClick={() => onNavigate('practical')}
              >
                <Terminal size={16} />
                <span>Practice Terminal Labs</span>
              </button>
            </div>
          </section>
        </GatedContentPreview>
      </div>
    </div>
  );
}
