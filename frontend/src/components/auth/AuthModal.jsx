import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  Lock, 
  Mail, 
  User, 
  GraduationCap, 
  Briefcase, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck,
  Zap
} from 'lucide-react';
import './AuthModal.css';

import { authApi } from '../../services/api';

export default function AuthModal({ isOpen, onClose, onLoginSuccess }) {
  const [activeTab, setActiveTab] = useState('signin'); // 'signin' | 'signup'
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Sign In Form State
  const [signInEmail, setSignInEmail] = useState('cs.placement@prep.edu');
  const [signInPassword, setSignInPassword] = useState('student123');
  
  // Sign Up Form State
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [targetYear, setTargetYear] = useState('2026');
  const [targetRole, setTargetRole] = useState('SDE 1 (Product)');

  // Close on ESC key
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') onClose();
    }
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      setErrorMessage('');
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Demo Login Handler
  const handleDemoLogin = async () => {
    setIsSubmitting(true);
    try {
      const res = await authApi.getDemoUser();
      const user = res.data?.user || res.data || {
        id: 'a0000000-0000-0000-0000-000000000001',
        name: 'Mikro Student',
        email: 'cs.placement@prep.edu',
        role: 'SDE Aspirant 2026',
        targetYear: '2026',
        streak: 3
      };
      onLoginSuccess({
        id: user.id,
        name: user.fullName || user.name || 'Mikro Student',
        email: user.email,
        role: user.role || 'SDE Aspirant 2026',
        targetYear: user.targetYear || '2026',
        streak: user.streak || 3,
        targetCompanyTier: 'Tier 1 Product Companies'
      });
      onClose();
    } catch {
      onLoginSuccess({
        id: 'a0000000-0000-0000-0000-000000000001',
        name: 'Mikro Student',
        email: 'cs.placement@prep.edu',
        role: 'SDE Aspirant 2026',
        targetYear: '2026',
        streak: 3,
        targetCompanyTier: 'Tier 1 Product Companies'
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    try {
      if (activeTab === 'signin') {
        const res = await authApi.login(signInEmail, signInPassword);
        if (res.success) {
          const user = res.data?.user || res.data;
          onLoginSuccess({
            id: user.id,
            name: user.fullName || user.name || signInEmail.split('@')[0],
            email: user.email || signInEmail,
            role: user.role || 'SDE Aspirant 2026',
            targetYear: user.targetYear || '2026',
            streak: user.streak || 3,
            targetCompanyTier: 'Tier 1 Product Companies'
          });
          onClose();
        } else {
          setErrorMessage(res.error || 'Login failed. Please check credentials.');
        }
      } else {
        const res = await authApi.register({
          email: signUpEmail,
          password: signUpPassword,
          fullName: signUpName,
          role: targetRole,
          targetYear
        });
        if (res.success) {
          const user = res.data?.user || res.data;
          onLoginSuccess({
            id: user.id,
            name: user.fullName || signUpName,
            email: user.email || signUpEmail,
            role: user.role || targetRole,
            targetYear: user.targetYear || targetYear,
            streak: user.streak || 1,
            targetCompanyTier: 'Tier 1 Product Companies'
          });
          onClose();
        } else {
          setErrorMessage(res.error || 'Registration failed.');
        }
      }
    } catch (err) {
      setErrorMessage(err.message || 'An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-modal-backdrop" onClick={onClose}>
      <div className="auth-modal-card theme-transition" onClick={(e) => e.stopPropagation()}>
        
        {/* Close Button */}
        <button className="modal-close-btn theme-transition" onClick={onClose} aria-label="Close modal">
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div className="auth-header">
          <div className="auth-brand-badge theme-transition">
            <Sparkles size={14} className="badge-sparkle" />
            <span>CommitDrive Scholar Access</span>
          </div>
          <h2 className="auth-title">
            {activeTab === 'signin' ? 'Welcome Back, Engineer' : 'Accelerate Your Placement Prep'}
          </h2>
          <p className="auth-subtitle">
            {activeTab === 'signin' 
              ? 'Access your personalized CS curriculum, terminal progress, and mock scores.' 
              : 'Join thousands of students mastering OS, DBMS, Networks, and hands-on tooling.'}
          </p>
        </div>

        {/* Instant Demo Student Login Banner */}
        <div className="demo-login-box theme-transition">
          <div className="demo-info">
            <span className="demo-tag">Recommended for review</span>
            <p className="demo-title">Explore with preloaded progress & 3-day streak</p>
          </div>
          <button 
            type="button" 
            className="demo-action-btn theme-transition"
            onClick={handleDemoLogin}
          >
            <Zap size={16} />
            <span>Instant Demo Login (Mikro)</span>
          </button>
        </div>

        {/* Auth Tab Switcher */}
        <div className="auth-tabs-track theme-transition">
          <button 
            type="button"
            className={`auth-tab-btn ${activeTab === 'signin' ? 'active' : ''} theme-transition`}
            onClick={() => setActiveTab('signin')}
          >
            Sign In
          </button>
          <button 
            type="button"
            className={`auth-tab-btn ${activeTab === 'signup' ? 'active' : ''} theme-transition`}
            onClick={() => setActiveTab('signup')}
          >
            Create Account
          </button>
        </div>

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="auth-form">
          {activeTab === 'signup' && (
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div className="input-wrapper">
                <User size={16} className="input-icon" />
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. Aditi Sharma" 
                  value={signUpName}
                  onChange={(e) => setSignUpName(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">University / Work Email</label>
            <div className="input-wrapper">
              <Mail size={16} className="input-icon" />
              <input 
                type="email" 
                className="form-input" 
                placeholder="you@college.edu" 
                value={activeTab === 'signin' ? signInEmail : signUpEmail}
                onChange={(e) => activeTab === 'signin' ? setSignInEmail(e.target.value) : setSignUpEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <div className="label-row">
              <label className="form-label">Password</label>
              {activeTab === 'signin' && (
                <span className="forgot-link">Forgot password?</span>
              )}
            </div>
            <div className="input-wrapper">
              <Lock size={16} className="input-icon" />
              <input 
                type="password" 
                className="form-input" 
                placeholder="••••••••••••" 
                value={activeTab === 'signin' ? signInPassword : signUpPassword}
                onChange={(e) => activeTab === 'signin' ? setSignInPassword(e.target.value) : setSignUpPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {activeTab === 'signup' && (
            <div className="form-row-dual">
              <div className="form-group">
                <label className="form-label">Graduation Year</label>
                <div className="input-wrapper">
                  <GraduationCap size={16} className="input-icon" />
                  <select 
                    className="form-input form-select"
                    value={targetYear}
                    onChange={(e) => setTargetYear(e.target.value)}
                  >
                    <option value="2025">2025 (Immediate Placements)</option>
                    <option value="2026">2026 (Upcoming Season)</option>
                    <option value="2027">2027 (Pre-final Year)</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Target Role</label>
                <div className="input-wrapper">
                  <Briefcase size={16} className="input-icon" />
                  <select 
                    className="form-input form-select"
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                  >
                    <option value="SDE 1 (Product)">SDE 1 (Product)</option>
                    <option value="Backend Engineer">Backend Engineer</option>
                    <option value="Systems / OS Engineer">Systems / OS Engineer</option>
                    <option value="Cloud / DevOps Engineer">Cloud / DevOps Engineer</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Primary Submit Button */}
          <button type="submit" className="auth-submit-btn theme-transition">
            <span>{activeTab === 'signin' ? 'Sign In to CommitDrive' : 'Complete Registration'}</span>
            <ArrowRight size={16} />
          </button>
        </form>

        {/* Social Login Placeholders (Visual Only) */}
        <div className="social-divider">
          <span>or continue with (placeholders)</span>
        </div>

        <div className="social-buttons-row">
          <button 
            type="button" 
            className="social-btn theme-transition" 
            title="OAuth integration coming in Step 4"
            onClick={() => alert('Social OAuth is planned for Step 4 with Spring Boot backend.')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            <span>GitHub</span>
          </button>

          <button 
            type="button" 
            className="social-btn theme-transition"
            title="OAuth integration coming in Step 4"
            onClick={() => alert('Social OAuth is planned for Step 4 with Spring Boot backend.')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
              <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.97 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
            </svg>
            <span>Google</span>
          </button>
        </div>

        {/* Trust Footer */}
        <div className="auth-footer-trust">
          <ShieldCheck size={14} className="trust-icon" />
          <span>Curriculum aligned with tier-1 CS placement evaluation benchmarks</span>
        </div>

      </div>
    </div>
  );
}
