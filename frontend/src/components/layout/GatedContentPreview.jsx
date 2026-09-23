import React from 'react';
import { Lock, Sparkles, ArrowRight, CheckCircle2, Zap, LogIn } from 'lucide-react';
import './GatedContentPreview.css';

/**
 * GatedContentPreview component
 * Provides a clean preview for non-logged-in visitors:
 * - Top portion is visible and crisp (previewContent)
 * - Lower portion (children) is smoothly blurred with a frosted glass effect
 * - A high-converting, professional CTA card is anchored over the blurred content
 */
export default function GatedContentPreview({
  isGated = true,
  previewContent,
  children,
  badgeText = 'Placement Engineering Platform',
  title = 'Sign up to unlock full access',
  subtitle = 'Join thousands of 2026 SDE aspirants mastering core CS theory, live terminal labs, and company hiring gates.',
  features = [
    '30 In-depth Computer Science topics with real-world analogies',
    'Interactive simulated terminal missions with live regex grading',
    'Researched interview patterns & rubrics for top hiring tiers',
    'Personalized placement readiness diagnostic matrix'
  ],
  ctaText = 'Sign up to unlock full access',
  onSignUp,
  onSignIn,
  onDemoLogin,
  className = ''
}) {
  if (!isGated) {
    return (
      <div className={`gated-preview-wrapper unlocked ${className}`}>
        {previewContent}
        {children}
      </div>
    );
  }

  return (
    <div className={`gated-preview-wrapper is-gated ${className}`}>
      {/* 1. Crisp, fully visible top preview */}
      <div className="gated-preview-header">
        {previewContent}
      </div>

      {/* 2. Blurred lower content with frosted overlay */}
      <div className="gated-blur-container">
        {/* Blurred underlying layout */}
        <div className="gated-blurred-content" aria-hidden="true" tabIndex={-1}>
          {children}
        </div>

        {/* Gradient backdrop fade & frosted overlay */}
        <div className="gated-overlay-curtain">
          <div className="gated-cta-card theme-transition">
            
            {/* Card Badge */}
            <div className="gated-card-badge">
              <span className="gated-badge-pill">
                <Lock size={12} className="gated-lock-icon" />
                <span>{badgeText}</span>
              </span>
            </div>

            {/* Title & Subtitle */}
            <h3 className="gated-card-title">{title}</h3>
            <p className="gated-card-subtitle">{subtitle}</p>

            {/* Feature Highlights */}
            {features && features.length > 0 && (
              <ul className="gated-features-list">
                {features.map((feat, idx) => (
                  <li key={idx} className="gated-feature-item">
                    <CheckCircle2 size={15} className="feature-check-icon" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            )}

            {/* CTA Action Buttons */}
            <div className="gated-actions-row">
              <button
                type="button"
                className="gated-primary-btn theme-transition"
                onClick={onSignUp}
              >
                <span>{ctaText}</span>
                <ArrowRight size={15} />
              </button>

              {onDemoLogin && (
                <button
                  type="button"
                  className="gated-demo-btn theme-transition"
                  onClick={onDemoLogin}
                  title="Instant access as demo student"
                >
                  <Zap size={14} />
                  <span>Instant 1-Click Demo</span>
                </button>
              )}
            </div>

            {/* Existing user sign in link */}
            {onSignIn && (
              <div className="gated-login-hint">
                <span>Already have an account? </span>
                <button 
                  type="button" 
                  className="gated-signin-link"
                  onClick={onSignIn}
                >
                  Sign In
                </button>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
