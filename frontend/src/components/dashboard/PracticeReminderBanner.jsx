import React, { useState, useEffect } from 'react';
import { Flame, Bell, BellRing, Clock, ArrowRight, X, Sparkles, CheckCircle2 } from 'lucide-react';
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

  const [notificationStatus, setNotificationStatus] = useState(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      return Notification.permission; // 'default', 'granted', 'denied'
    }
    return 'unsupported';
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

  const handleRequestNotification = async () => {
    if (!('Notification' in window)) {
      alert('Browser notifications are not supported in this browser.');
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      setNotificationStatus(permission);

      if (permission === 'granted') {
        new Notification('CommitDrive: Daily Practice Reminder Set!', {
          body: `Keep your ${streak > 0 ? `${streak}-day ` : ''}placement streak alive! 15 minutes of daily practice unlocks Tier-1 product roles.`,
          icon: '/favicon.ico'
        });
      }
    } catch (err) {
      console.error('Error requesting notification permission:', err);
    }
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
        {notificationStatus !== 'unsupported' && (
          <button 
            type="button" 
            className={`reminder-btn-notify theme-transition ${notificationStatus === 'granted' ? 'active' : ''}`}
            onClick={handleRequestNotification}
            title={notificationStatus === 'granted' ? 'Daily reminders enabled' : 'Enable browser practice reminder notification'}
          >
            {notificationStatus === 'granted' ? (
              <>
                <CheckCircle2 size={13} />
                <span>Reminders On</span>
              </>
            ) : (
              <>
                <Bell size={13} />
                <span>Remind Me</span>
              </>
            )}
          </button>
        )}

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
