import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  Lock, 
  Mail, 
  User, 
  GraduationCap, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck,
  Zap,
  Eye,
  EyeOff
} from 'lucide-react';
import './AuthModal.css';

import { authApi } from '../../services/api';

export default function AuthModal({ isOpen, onClose, onLoginSuccess, initialTab = 'signin' }) {
  const [activeTab, setActiveTab] = useState(initialTab); // 'signin' | 'signup'
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Sign In Form State
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  
  // Sign Up Form State
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [targetYear, setTargetYear] = useState('2026');

  // Close on ESC key & sync initialTab when opened
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') onClose();
    }
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      setActiveTab(initialTab);
      setErrorMessage('');
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, initialTab, onClose]);

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
      const token = res.data?.token;
      onLoginSuccess({
        id: user.id,
        token: token,
        name: user.fullName || user.name || 'Demo Student',
        email: user.email || 'demo@commitdrive.dev',
        role: user.role || 'SDE Aspirant (Demo)',
        targetYear: user.targetYear || '2026',
        streak: user.streak || 1,
        targetCompanyTier: 'Tier 1 Product Companies',
        isDemo: true
      });
      onClose();
    } catch {
      onLoginSuccess({
        id: 'a0000000-0000-0000-0000-000000000001',
        name: 'Demo Student',
        email: 'demo@commitdrive.dev',
        role: 'SDE Aspirant (Demo)',
        targetYear: '2026',
        streak: 1,
        targetCompanyTier: 'Tier 1 Product Companies',
        isDemo: true
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
          const token = res.data?.token;
          onLoginSuccess({
            id: user.id,
            token: token,
            name: user.fullName || user.name || signInEmail.split('@')[0],
            email: user.email || signInEmail,
            role: user.role || 'SDE Aspirant 2026',
            targetYear: user.targetYear || '2026',
            streak: user.streak || 3,
            targetCompanyTier: 'Tier 1 Product Companies',
            isDemo: false
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
          role: 'SDE Aspirant 2026',
          targetYear
        });
        if (res.success) {
          const user = res.data?.user || res.data;
          const token = res.data?.token;
          onLoginSuccess({
            id: user.id,
            token: token,
            name: user.fullName || signUpName,
            email: user.email || signUpEmail,
            role: user.role || 'SDE Aspirant 2026',
            targetYear: user.targetYear || targetYear,
            streak: user.streak || 1,
            targetCompanyTier: 'Tier 1 Product Companies',
            isDemo: false
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
            <label className="form-label">Personal Email</label>
            <div className="input-wrapper">
              <Mail size={16} className="input-icon" />
              <input 
                type="email" 
                className="form-input" 
                placeholder="you@gmail.com" 
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
                type={showPassword ? 'text' : 'password'} 
                className="form-input password-input" 
                placeholder="••••••••••••" 
                value={activeTab === 'signin' ? signInPassword : signUpPassword}
                onChange={(e) => activeTab === 'signin' ? setSignInPassword(e.target.value) : setSignUpPassword(e.target.value)}
                required
              />
              <button 
                type="button" 
                className="password-toggle-btn theme-transition" 
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {activeTab === 'signup' && (
            <div className="form-group">
              <label className="form-label">Graduation Year</label>
              <div className="input-wrapper">
                <GraduationCap size={16} className="input-icon" />
                <select 
                  className="form-input form-select"
                  value={targetYear}
                  onChange={(e) => setTargetYear(e.target.value)}
                >
                  <option value="2025">2025</option>
                  <option value="2026">2026</option>
                  <option value="2027">2027</option>
                  <option value="2028">2028</option>
                  <option value="2029">2029</option>
                </select>
              </div>
            </div>
          )}

          {/* Primary Submit Button */}
          <button type="submit" className="auth-submit-btn theme-transition">
            <span>{activeTab === 'signin' ? 'Sign In to CommitDrive' : 'Complete Registration'}</span>
            <ArrowRight size={16} />
          </button>
        </form>

        {/* Trust Footer */}
        <div className="auth-footer-trust">
          <ShieldCheck size={14} className="trust-icon" />
          <span>Curriculum aligned with tier-1 CS placement evaluation benchmarks</span>
        </div>

      </div>
    </div>
  );
}
