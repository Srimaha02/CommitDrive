import React, { useState, useEffect } from 'react';
import { Flame, Clock, ArrowRight, X } from 'lucide-react';
import './PracticeReminderBanner.css';

export default function PracticeReminderBanner({ 
  streak = 0, 
  onStartPractice, 
  recommendedTitle = 'Process Scheduling Algorithms' 
}) {
  const [dismissed, setDismissed] = useState(() => {
    try {
      const todayStr = new Date().toISOString().split('T')[0];
      const saved = localStorage.getItem('commitdrive_reminder_dismissed');
      return saved === todayStr;
    } catch {
      return false;
    }
  });

  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0 });

  // Compute countdown to midnight
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);
      const diffMs = midnight - now;

      if (diffMs > 0) {
        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        setTimeLeft({ hours, minutes });
      } else {
        setTimeLeft({ hours: 0, minutes: 0 });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    try {
      const todayStr = new Date().toISOString().split('T')[0];
      localStorage.setItem('commitdrive_reminder_dismissed', todayStr);
    } catch {}
  };

  if (dismissed) return null;

  return (
    <aside className="practice-reminder-banner theme-transition" aria-label="Daily placement practice reminder">
      <div className="reminder-accent-line" />

      <div className="reminder-content-left">
        <div className="reminder-icon-badge">
          <Flame size={20} />
        </div>

        <div className="reminder-text-group">
          <div className="reminder-title-row">
            <span className="reminder-headline">
              {streak > 0 ? (
                <>Keep Your {streak}-Day Placement Streak Alive!</>
              ) : (
                <>Ignite Your Placement Preparation Streak!</>
              )}
            </span>
            <span className="reminder-countdown-chip" title="Time remaining before daily streak deadline">
              <Clock size={11} />
              <span>{timeLeft.hours}h {timeLeft.minutes}m left today</span>
            </span>
          </div>

          <p className="reminder-subtext">
            Recommended focus: <strong>{recommendedTitle}</strong>. Spend 10 mins reading or solving a terminal mission to lock in today's progress.
          </p>
        </div>
      </div>

      <div className="reminder-actions-right">
        <button 
          type="button" 
          className="reminder-btn-practice theme-transition"
          onClick={onStartPractice}
        >
          <span>Practice Now</span>
          <ArrowRight size={13} />
        </button>

        <button 
          type="button" 
          className="reminder-btn-dismiss theme-transition"
          onClick={handleDismiss}
          title="Dismiss reminder for today"
          aria-label="Dismiss banner"
        >
          <X size={15} />
        </button>
      </div>
    </aside>
  );
}
