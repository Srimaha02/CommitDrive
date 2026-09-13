// CommitDrive — Frontend API Service Client
// Integrates React frontend with Spring Boot Backend & Supabase PostgreSQL
// Features graceful offline fallback to localStorage when backend is offline

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// Helper to retrieve auth user token / user ID header
const getAuthHeaders = () => {
  const headers = { 'Content-Type': 'application/json' };
  try {
    const savedUser = localStorage.getItem('commitdrive_user');
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      if (parsed.id) {
        headers['X-User-Id'] = parsed.id;
      }
    }
  } catch {
    // ignore
  }
  return headers;
};

// Generic fetch wrapper with offline fallback
async function requestWithFallback(endpoint, options = {}, fallbackFn = () => null) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500); // 2.5s quick timeout

    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...getAuthHeaders(),
        ...(options.headers || {})
      },
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      return { success: true, data, isOffline: false };
    }
    // If backend responded with 4xx / 5xx error
    const errData = await res.json().catch(() => ({}));
    return { success: false, error: errData.message || 'Request failed', isOffline: false };
  } catch (err) {
    // Network failure / connection refused / timeout -> graceful local fallback
    const fallbackData = fallbackFn();
    return { success: true, data: fallbackData, isOffline: true };
  }
}

// =============================================================================
// 1. AUTHENTICATION & PROFILE API
// =============================================================================
export const authApi = {
  // Login with email and password
  async login(email, password) {
    return requestWithFallback(
      '/auth/login',
      {
        method: 'POST',
        body: JSON.stringify({ email, password })
      },
      () => {
        // Fallback for demo student offline login
        const demoUser = {
          id: 'a0000000-0000-0000-0000-000000000001',
          email: email || 'cs.placement@prep.edu',
          fullName: 'Mikro Student',
          role: 'SDE Aspirant 2026',
          targetYear: '2026',
          streak: 3
        };
        return { token: demoUser.id, user: demoUser, message: 'Offline session loaded' };
      }
    );
  },

  // Register a new student account
  async register(userData) {
    return requestWithFallback(
      '/auth/register',
      {
        method: 'POST',
        body: JSON.stringify(userData)
      },
      () => {
        const newUser = {
          id: 'usr-' + Date.now(),
          email: userData.email,
          fullName: userData.fullName || 'Student',
          role: userData.role || 'SDE Aspirant 2026',
          targetYear: userData.targetYear || '2026',
          streak: 1
        };
        return { token: newUser.id, user: newUser, message: 'Registered locally' };
      }
    );
  },

  // Get Demo Student Profile
  async getDemoUser() {
    return requestWithFallback(
      '/auth/demo',
      { method: 'GET' },
      () => ({
        id: 'a0000000-0000-0000-0000-000000000001',
        email: 'cs.placement@prep.edu',
        fullName: 'Mikro Student',
        role: 'SDE Aspirant 2026',
        targetYear: '2026',
        streak: 3
      })
    );
  }
};

// =============================================================================
// 2. LEARNING PATH API (OS, DBMS, CN Topics & Spaced Flashcards)
// =============================================================================
export const learningApi = {
  // Get topic completion records
  async getTopics(subject) {
    const query = subject ? `?subject=${subject}` : '';
    return requestWithFallback(
      `/learning/topics${query}`,
      { method: 'GET' },
      () => {
        try {
          const saved = localStorage.getItem('commitdrive_completed_topics');
          return saved ? JSON.parse(saved) : [];
        } catch {
          return [];
        }
      }
    );
  },

  // Toggle topic completion state
  async toggleTopic(subject, topicId, completed, notes = '') {
    return requestWithFallback(
      '/learning/topic/toggle',
      {
        method: 'POST',
        body: JSON.stringify({ subject, topicId, completed, notes })
      },
      () => {
        // Fallback to updating localStorage
        try {
          const key = 'commitdrive_completed_topics';
          const saved = JSON.parse(localStorage.getItem(key) || '[]');
          let updated;
          if (completed) {
            updated = saved.includes(topicId) ? saved : [...saved, topicId];
          } else {
            updated = saved.filter(id => id !== topicId);
          }
          localStorage.setItem(key, JSON.stringify(updated));
          return { subject, topicId, completed };
        } catch {
          return { subject, topicId, completed };
        }
      }
    );
  },

  // Save flashcard review state (Mastered / Review Needed)
  async saveFlashcardReview(subject, topicId, cardId, status) {
    return requestWithFallback(
      '/learning/flashcard/review',
      {
        method: 'POST',
        body: JSON.stringify({ subject, topicId, cardId, status })
      },
      () => {
        try {
          const key = 'commitdrive_flashcard_reviews';
          const reviews = JSON.parse(localStorage.getItem(key) || '{}');
          reviews[`${subject}_${topicId}_${cardId}`] = { status, timestamp: Date.now() };
          localStorage.setItem(key, JSON.stringify(reviews));
          return { subject, topicId, cardId, status };
        } catch {
          return { subject, topicId, cardId, status };
        }
      }
    );
  }
};

// =============================================================================
// 3. PRACTICAL PATH API (Git, Linux, SQL Missions & Timed Mock Tests)
// =============================================================================
export const practicalApi = {
  // Get completed missions
  async getMissions(moduleId) {
    const query = moduleId ? `?moduleId=${moduleId}` : '';
    return requestWithFallback(
      `/practical/missions${query}`,
      { method: 'GET' },
      () => {
        try {
          const saved = localStorage.getItem('commitdrive_completed_missions');
          return saved ? JSON.parse(saved) : ['git-1', 'linux-1'];
        } catch {
          return ['git-1', 'linux-1'];
        }
      }
    );
  },

  // Record completed mission with attempt count
  async completeMission(moduleId, missionId, attemptsCount = 1, unlockedSolutionUsed = false) {
    return requestWithFallback(
      '/practical/mission/complete',
      {
        method: 'POST',
        body: JSON.stringify({ moduleId, missionId, attemptsCount, unlockedSolutionUsed })
      },
      () => {
        try {
          const key = 'commitdrive_completed_missions';
          const saved = JSON.parse(localStorage.getItem(key) || '[]');
          if (!saved.includes(missionId)) {
            saved.push(missionId);
            localStorage.setItem(key, JSON.stringify(saved));
          }
          return { moduleId, missionId, completed: true, attemptsCount };
        } catch {
          return { moduleId, missionId, completed: true, attemptsCount };
        }
      }
    );
  },

  // Submit Mock Test attempt & diagnostic breakdown
  async submitMockTest(testData) {
    return requestWithFallback(
      '/practical/mock-test/submit',
      {
        method: 'POST',
        body: JSON.stringify(testData)
      },
      () => {
        try {
          const key = 'commitdrive_mock_attempts';
          const history = JSON.parse(localStorage.getItem(key) || '[]');
          const attempt = {
            id: 'mock-' + Date.now(),
            ...testData,
            createdAt: new Date().toISOString()
          };
          history.unshift(attempt);
          localStorage.setItem(key, JSON.stringify(history));
          return attempt;
        } catch {
          return { id: 'mock-' + Date.now(), ...testData };
        }
      }
    );
  },

  // Get historical mock test attempts
  async getMockTestHistory(moduleId) {
    const query = moduleId ? `?moduleId=${moduleId}` : '';
    return requestWithFallback(
      `/practical/mock-test/history${query}`,
      { method: 'GET' },
      () => {
        try {
          const key = 'commitdrive_mock_attempts';
          const history = JSON.parse(localStorage.getItem(key) || '[]');
          return moduleId ? history.filter(h => h.moduleId === moduleId) : history;
        } catch {
          return [];
        }
      }
    );
  }
};

// =============================================================================
// 4. DASHBOARD & READINESS STATS API
// =============================================================================
export const dashboardApi = {
  // Get placement readiness matrix and dynamic dashboard stats
  async getStats() {
    return requestWithFallback(
      '/dashboard/stats',
      { method: 'GET' },
      () => ({
        overallReadinessPct: 68,
        streak: 3,
        osMasteredCount: 4,
        dbmsMasteredCount: 6,
        cnMasteredCount: 2,
        gitMissionsPassedCount: 2,
        linuxMissionsPassedCount: 1,
        sqlMissionsPassedCount: 4,
        diagnosticAlerts: [
          'Prioritize Computer Networks (TCP 3-Way Handshake & Congestion Control)',
          'Review Linux Pipeline Commands (grep | wc) before your screening test'
        ]
      })
    );
  }
};

// =============================================================================
// 5. BACKEND HEALTH CHECK
// =============================================================================
export const checkBackendHealth = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/health`, { method: 'GET' });
    if (res.ok) {
      const data = await res.json();
      return { online: true, details: data };
    }
    return { online: false };
  } catch {
    return { online: false };
  }
};

const api = {
  auth: authApi,
  learning: learningApi,
  practical: practicalApi,
  dashboard: dashboardApi,
  health: checkBackendHealth
};

export default api;
