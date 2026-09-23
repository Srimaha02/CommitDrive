import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Flame, 
  BookOpen, 
  Terminal, 
  ArrowRight, 
  CheckCircle2, 
  Cpu, 
  GitBranch, 
  Database, 
  Network, 
  AlertTriangle, 
  Play, 
  TrendingUp, 
  Target,
  Zap,
  Award,
  Building,
  Trophy,
  ShieldCheck,
  ChevronRight,
  Info,
  X
} from 'lucide-react';
import { dashboardApi } from '../../services/api';
import { osTopics } from '../../data/osTopics';
import { dbmsTopics } from '../../data/dbmsTopics';
import { cnTopics } from '../../data/cnTopics';
import { practicalMissions } from '../../data/practicalCurriculum';
import GatedContentPreview from '../layout/GatedContentPreview';
import PracticeReminderBanner from './PracticeReminderBanner';
import './Dashboard.css';

// Researched public interview patterns for companies with well-documented recruitment data
const documentedCompanyPatterns = {
  // --- Tier 1: IT Services & Core Drives ---
  tcs: {
    fullName: 'Tata Consultancy Services (TCS Digital / Prime)',
    roundsOverview: 'Online Assessment (Cognitive + Advanced Coding) → Technical & Managerial Round → HR',
    practicalPatterns: [
      {
        area: 'SQL & Relational Queries',
        description: 'Multi-table INNER and LEFT JOINs, aggregate grouping (GROUP BY with HAVING), second-highest salary queries (DENSE_RANK() or LIMIT 1 OFFSET 1), and handling NULL values with COALESCE.'
      },
      {
        area: 'Linux Shell & Permissions',
        description: 'File permission adjustments (chmod 755 / octal notation), process inspection (ps aux, top), terminating hanging jobs (kill -9), and text filtering with grep/head/tail.'
      },
      {
        area: 'Git Fundamentals',
        description: 'Local repository initialization (git init), atomic staging (git add), writing clean commit messages (git commit -m), and checking branch status with git status.'
      },
      {
        area: 'Core Systems Foundations',
        description: 'Process vs thread memory spaces (shared heap vs thread-local stack), DBMS ACID transaction principles, and virtual memory / paging basics.'
      }
    ],
    practiceTarget: { view: 'practical', module: 'sql', label: 'Practice SQL & Linux Lab' }
  },
  infosys: {
    fullName: 'Infosys (Specialist Programmer / DSE)',
    roundsOverview: 'Hands-on Coding Assessment (DSA / Problem Solving) → Technical Interview → HR',
    practicalPatterns: [
      {
        area: 'SQL Relational Queries',
        description: 'Correlated subqueries, self-joins (employee-manager hierarchies), string pattern matching with LIKE, and aggregate functions (COUNT, MAX, AVG).'
      },
      {
        area: 'OOP Architecture & Principles',
        description: 'Core object-oriented pillars: inheritance, polymorphism, method overloading vs overriding, encapsulation, interfaces, and abstract classes.'
      },
      {
        area: 'Database Normalization',
        description: 'Decomposing unnormalized tables into 1NF, 2NF, and 3NF; identifying functional dependencies, composite keys, and foreign keys.'
      },
      {
        area: 'OS Scheduling & Version Control',
        description: 'CPU scheduling algorithms (FCFS, Round Robin), Git branching basics (git branch, git checkout -b), and Linux directory traversal.'
      }
    ],
    practiceTarget: { view: 'learning', subject: 'dbms', label: 'Practice DBMS Normalization' }
  },
  cognizant: {
    fullName: 'Cognizant (GenC / GenC Next / Elevate)',
    roundsOverview: 'Aptitude & Technical MCQ Assessment → Coding Evaluation → Technical Interview',
    practicalPatterns: [
      {
        area: 'SQL Deduplication & Analytics',
        description: 'Identifying duplicate records with GROUP BY and HAVING COUNT(*) > 1, joining tables, and multi-condition filtering with AND/OR/IN.'
      },
      {
        area: 'Operating Systems & Memory',
        description: 'Paging mechanism, page faults, virtual memory allocation, and differences between preemptive and non-preemptive scheduling.'
      },
      {
        area: 'Computer Networks Transport',
        description: 'OSI 7-layer model functions, TCP 3-way handshake vs UDP connectionless delivery, and common port numbers (HTTP 80, HTTPS 443, DNS 53).'
      },
      {
        area: 'Terminal Commands & Git',
        description: 'Piping command sequences (cat file | grep | wc -l), checking repository status (git status, git diff), and inspecting atomic commit history.'
      }
    ],
    practiceTarget: { view: 'learning', subject: 'os', label: 'Practice OS & Systems Topics' }
  },
  wipro: {
    fullName: 'Wipro (Turbo / Elite NLTH)',
    roundsOverview: 'Online Assessment (Aptitude + Basic Coding + Written English) → Technical Interview → HR',
    practicalPatterns: [
      {
        area: 'SQL CRUD & Constraints',
        description: 'Table creation with constraints (NOT NULL, UNIQUE, CHECK), filtering with WHERE vs HAVING, and simple multi-table joins.'
      },
      {
        area: 'Concurrency & Deadlocks',
        description: 'The four Coffman conditions for deadlock (Mutual Exclusion, Hold and Wait, No Preemption, Circular Wait) and deadlock prevention strategies.'
      },
      {
        area: 'Relational Schema Keys',
        description: 'Primary key vs Unique key distinctions, candidate keys, foreign key constraints with ON DELETE CASCADE, and basic relational integrity.'
      },
      {
        area: 'Linux & Command Utilities',
        description: 'Navigating directories, file creation and manipulation (touch, cp, mv, rm), text inspection using cat/more/less, and basic grep filtering.'
      }
    ],
    practiceTarget: { view: 'practical', module: 'git', label: 'Practice Git Lab & Terminal' }
  },

  // --- Tier 2: Researched Growth Product Companies ---
  razorpay: {
    fullName: 'Razorpay',
    roundsOverview: 'OA (HackerEarth/HackerRank, 2-3 DSA problems, medium-hard) → Machine Coding/LLD round (build a working system live) → System Design (HLD) → Hiring Manager round (resume deep-dive + payments domain awareness: UPI, idempotency, reconciliation) → HR',
    practicalPatterns: [
      {
        area: 'Machine Coding / Low-Level Design (LLD)',
        description: 'Live hands-on round (typically 90-120 mins) building a functional, modular system from scratch (e.g. Splitwise, Rate Limiter, In-Memory Queue, or Parking Lot). Heavily evaluated on clean code, SOLID principles, design patterns (Strategy, Factory), testability, and edge-case handling.'
      },
      {
        area: 'Data Structures & Algorithms',
        description: 'Medium to hard algorithmic challenges testing Dynamic Programming, Arrays, HashMaps, Binary Trees, and Sliding Window/Two-Pointer techniques with optimal space/time complexity.'
      },
      {
        area: 'Backend Systems & Payments Domain',
        description: 'Deep dive on transactional consistency (ACID), idempotency keys to prevent duplicate charge processing, distributed locks, database indexing/isolation levels, and payment flows (UPI, webhooks, reconciliation).'
      },
      {
        area: 'High-Level Design (HLD) & Architecture',
        description: 'Designing scalable distributed services, message queues for asynchronous decoupling (Kafka/RabbitMQ), cache management (Redis), and resilient API gateway design.'
      }
    ],
    practiceTarget: { view: 'practical', module: 'sql', label: 'Practice SQL & Concurrency Lab' }
  },
  swiggy: {
    fullName: 'Swiggy',
    roundsOverview: 'OA (aptitude + DSA) → Machine Coding round → DSA round → System Design (senior roles) → Managerial/Fitment round',
    practicalPatterns: [
      {
        area: 'Machine Coding & Object-Oriented Design',
        description: 'Writing functional, production-grade code for practical engineering scenarios (e.g. food delivery order assignment, delivery partner matching, coupon system) within 90 mins. Evaluated on modularity, extensibility, design patterns, and clean abstractions.'
      },
      {
        area: 'Core Data Structures & Algorithms',
        description: 'Medium-hard problems focusing on Graphs (BFS/DFS, Dijkstra for shortest path routing), Heaps/PriorityQueues, Binary Search, and Tree traversals.'
      },
      {
        area: 'OS Concurrency & Java Multithreading',
        description: 'Process synchronization, multithreading in Java/Go, thread pools, race conditions, synchronized blocks, atomic variables, and memory models.'
      },
      {
        area: 'Database Architecture & Caching',
        description: 'Relational query optimization, index design, database locking semantics, and Redis caching/invalidation strategies for high-frequency location, catalog, and cart operations.'
      }
    ],
    practiceTarget: { view: 'learning', subject: 'os', label: 'Practice OS Concurrency & Threads' }
  },

  // --- Tier 4: Researched Big Tech / Product Companies ---
  amazon: {
    fullName: 'Amazon',
    roundsOverview: 'OA (HackerRank, 2 DSA problems often DP/Graph, + Work Style Assessment) → 2-3 DSA rounds (one problem each) → System Design/HLD round → mandatory Leadership Principles round (heavily weighted — candidates often under-prepare for this)',
    practicalPatterns: [
      {
        area: 'Amazon Leadership Principles (LPs)',
        description: 'Customer Obsession, Ownership, Bias for Action, Dive Deep, Earn Trust, Deliver Results. Every interviewer allocates 15-20 minutes to behavioral questions evaluated strictly using the STAR format (Situation, Task, Action, Result). LPs carry decisive weight across the entire loop.'
      },
      {
        area: 'DSA Rounds (2-3 Coding Rounds)',
        description: 'One in-depth algorithmic problem per round. Frequent focus areas include Dynamic Programming (memoization & tabulation), Graphs (BFS/DFS, topological sort), Trees, Sliding Window, and Tries/PriorityQueues.'
      },
      {
        area: 'System Design / High-Level Architecture',
        description: 'Architecting scalable, fault-tolerant distributed systems: load balancers, database partitioning & replication, caching layers, asynchronous message queues (SQS/SNS/Kafka), and microservices trade-offs.'
      },
      {
        area: 'Core Systems & Concurrency',
        description: 'Thread safety, memory leaks, process communication, CPU scheduling, and network protocols (TCP vs UDP, REST, RPC).'
      }
    ],
    practiceTarget: { view: 'learning', subject: 'os', label: 'Practice OS Internals & Systems' }
  },
  google: {
    fullName: 'Google',
    roundsOverview: 'Online Challenge / Technical Phone Screen (DSA) → 3-4 Technical Rounds (DSA & Problem Solving) → Googleyness & Leadership (Behavioral Fit) → Hiring Committee Review',
    practicalPatterns: [
      {
        area: 'Data Structures & Algorithms (Core Focus)',
        description: 'Medium to hard algorithmic problem solving. Heavy emphasis on Graph algorithms (BFS/DFS, Dijkstra, DAGs), Dynamic Programming, Binary Search on Answer, Tree manipulations, and Disjoint Set Union (DSU).'
      },
      {
        area: 'Complexity & Boundary Analysis',
        description: 'Rigorous derivation of Big-O time and space complexity, identifying edge cases before writing code, and systematically proving algorithmic correctness.'
      },
      {
        area: 'Code Quality & Collaborative Communication',
        description: 'Writing clean, idiomatic, modular code without an IDE. Strong emphasis on thinking out loud, discussing trade-offs, and collaborating on ambiguous problem statements.'
      },
      {
        area: 'Googleyness, Leadership & System Design',
        description: 'Navigating ambiguous requirements, intellectual humility, doing the right thing for the user, collaboration, and high-throughput distributed system design for senior roles.'
      }
    ],
    practiceTarget: { view: 'practical', module: 'linux', label: 'Practice Linux & Systems Lab' }
  }
};

const getCompanyData = (companyName, tierItem) => {
  const normalized = companyName.toLowerCase();
  let key = null;
  if (normalized.includes('tcs')) key = 'tcs';
  else if (normalized.includes('infosys')) key = 'infosys';
  else if (normalized.includes('cognizant')) key = 'cognizant';
  else if (normalized.includes('wipro')) key = 'wipro';
  else if (normalized.includes('razorpay')) key = 'razorpay';
  else if (normalized.includes('swiggy')) key = 'swiggy';
  else if (normalized.includes('amazon')) key = 'amazon';
  else if (normalized.includes('google')) key = 'google';

  if (key && documentedCompanyPatterns[key]) {
    const data = documentedCompanyPatterns[key];
    return {
      isDocumented: true,
      companyName: data.fullName,
      shortName: companyName,
      tier: tierItem.tier,
      tierTitle: tierItem.title,
      ctcRange: tierItem.ctcRange,
      roundsOverview: data.roundsOverview,
      practicalPatterns: data.practicalPatterns,
      practiceTarget: data.practiceTarget || tierItem.practiceTarget,
      disclaimerNote: 'Based on publicly documented interview patterns — not official/leaked material.'
    };
  }

  // Generic open-ended technical interview framing for companies without specific documented patterns (Zomato, PhonePe, BrowserStack, Microsoft, Uber, Atlassian, Tier 3 FinTech)
  return {
    isDocumented: false,
    companyName,
    shortName: companyName,
    tier: tierItem.tier,
    tierTitle: tierItem.title,
    ctcRange: tierItem.ctcRange,
    focusArea: tierItem.focusArea,
    practiceTarget: tierItem.practiceTarget,
    openEndedNote: 'This company uses open-ended technical interviews — focus on strong fundamentals in the areas above.'
  };
};

export default function Dashboard({ 
  currentUser, 
  onNavigate, 
  onOpenAuth, 
  onDemoLogin,
  onOpenCramSheet
}) {
  const student = currentUser || {
    name: 'SDE Aspirant',
    role: 'SDE Aspirant 2026',
    targetYear: '2026',
    streak: 0
  };

  const [stats, setStats] = useState({
    overallReadinessPct: 0,
    streak: currentUser?.streak ?? 0,
    osMasteredCount: 0,
    dbmsMasteredCount: 0,
    cnMasteredCount: 0,
    gitMissionsPassedCount: 0,
    linuxMissionsPassedCount: 0,
    sqlMissionsPassedCount: 0,
    diagnosticAlerts: []
  });

  const [selectedCompany, setSelectedCompany] = useState(null);

  // Close popup modal on ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setSelectedCompany(null);
    };
    if (selectedCompany) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedCompany]);

  // Fetch real-time stats from backend (or fallback)
  const fetchStats = () => {
    dashboardApi.getStats().then(res => {
      if (res && res.data) {
        setStats({
          overallReadinessPct: res.data.overallReadinessPct ?? 0,
          streak: res.data.streak ?? (currentUser?.streak ?? 0),
          osMasteredCount: res.data.osMasteredCount ?? 0,
          dbmsMasteredCount: res.data.dbmsMasteredCount ?? 0,
          cnMasteredCount: res.data.cnMasteredCount ?? 0,
          gitMissionsPassedCount: res.data.gitMissionsPassedCount ?? 0,
          linuxMissionsPassedCount: res.data.linuxMissionsPassedCount ?? 0,
          sqlMissionsPassedCount: res.data.sqlMissionsPassedCount ?? 0,
          diagnosticAlerts: res.data.diagnosticAlerts || []
        });
      }
    }).catch(() => {});
  };

  // Listen for progress update events across the app in real time (no reload required)
  useEffect(() => {
    fetchStats();

    const handleProgressUpdate = () => {
      fetchStats();
    };

    const handleFocus = () => {
      fetchStats();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchStats();
      }
    };

    window.addEventListener('commitdrive_progress_updated', handleProgressUpdate);
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('commitdrive_progress_updated', handleProgressUpdate);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [currentUser]);

  // Dynamic 7-day practice streak bar based on calendar week (Mon - Sun)
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const todayJsDay = new Date().getDay(); // 0 is Sun, 1 is Mon...
  const todayIndex = todayJsDay === 0 ? 6 : todayJsDay - 1; // 0 for Mon, ..., 6 for Sun
  const activeStreak = stats.streak ?? 0;

  const weekDays = dayNames.map((name, idx) => {
    const isToday = idx === todayIndex;
    const isCompleted = activeStreak > 0 && idx <= todayIndex && (todayIndex - idx) < activeStreak;
    let label = '';
    if (isToday) {
      label = activeStreak > 0 ? 'Today (Active)' : 'Today';
    } else if (isCompleted) {
      label = 'Active';
    }
    return {
      day: name,
      completed: isCompleted,
      isToday,
      label
    };
  });

  // Determine Theory continue-learning card
  const osCount = stats.osMasteredCount ?? 0;
  const dbmsCount = stats.dbmsMasteredCount ?? 0;
  const cnCount = stats.cnMasteredCount ?? 0;

  let activeTheorySubject = 'Operating Systems';
  let ActiveTheoryIcon = Cpu;
  let activeTheoryTopicNumber = 1;
  let activeTheoryTitle = 'Process Lifecycle, States & PCB';
  let activeTheoryDesc = 'Understand process memory layout (Text, Data, Heap, Stack), state transitions (Ready, Running, Waiting), and Process Control Block metadata.';
  let activeTheorySubjectCount = osCount;

  if (osCount < 10) {
    activeTheorySubject = 'Operating Systems';
    ActiveTheoryIcon = Cpu;
    activeTheoryTopicNumber = osCount + 1;
    activeTheorySubjectCount = osCount;
    const topic = osTopics[osCount] || osTopics[0];
    if (topic) {
      activeTheoryTitle = topic.title;
      activeTheoryDesc = topic.summary || topic.explanation || activeTheoryDesc;
    }
  } else if (dbmsCount < 10) {
    activeTheorySubject = 'Database Management (DBMS)';
    ActiveTheoryIcon = Database;
    activeTheoryTopicNumber = dbmsCount + 1;
    activeTheorySubjectCount = dbmsCount;
    const topic = dbmsTopics[dbmsCount] || dbmsTopics[0];
    if (topic) {
      activeTheoryTitle = topic.title;
      activeTheoryDesc = topic.summary || topic.explanation || 'Master relational normalization, indexing, and transaction management.';
    }
  } else if (cnCount < 10) {
    activeTheorySubject = 'Computer Networks';
    ActiveTheoryIcon = Network;
    activeTheoryTopicNumber = cnCount + 1;
    activeTheorySubjectCount = cnCount;
    const topic = cnTopics[cnCount] || cnTopics[0];
    if (topic) {
      activeTheoryTitle = topic.title;
      activeTheoryDesc = topic.summary || topic.explanation || 'Master OSI/TCP-IP stacks, routing, and transport-layer congestion control.';
    }
  } else {
    activeTheorySubject = 'Operating Systems';
    ActiveTheoryIcon = Cpu;
    activeTheoryTopicNumber = 10;
    activeTheorySubjectCount = 10;
    const topic = osTopics[9] || osTopics[0];
    activeTheoryTitle = topic.title;
    activeTheoryDesc = 'All 30 core theory curriculum topics mastered across OS, DBMS, and CN!';
  }

  const theoryProgressPct = Math.min(100, Math.round((activeTheorySubjectCount / 10) * 100));

  // Determine Practical continue-learning card
  const gitCount = stats.gitMissionsPassedCount ?? 0;
  const linuxCount = stats.linuxMissionsPassedCount ?? 0;
  const sqlCount = stats.sqlMissionsPassedCount ?? 0;

  let activePracticalModule = 'Git Version Control';
  let activePracticalIconClass = '';
  let ActivePracticalIcon = GitBranch;
  let activePracticalMissionNumber = 1;
  let activePracticalPassedCount = gitCount;
  let activePracticalTitle = 'Mission 1: Initializing a Repository & First Commit';
  let activePracticalDesc = 'Initialize a fresh local repository with git init, stage project files, and write an atomic initial commit message.';

  if (gitCount < 8) {
    activePracticalModule = 'Git Version Control';
    ActivePracticalIcon = GitBranch;
    activePracticalIconClass = '';
    activePracticalMissionNumber = gitCount + 1;
    activePracticalPassedCount = gitCount;
    const mission = (practicalMissions.git && practicalMissions.git[gitCount]) || null;
    if (mission) {
      activePracticalTitle = mission.title;
      activePracticalDesc = mission.storyContext || mission.objective || activePracticalDesc;
    }
  } else if (linuxCount < 8) {
    activePracticalModule = 'Linux Shell & Systems';
    ActivePracticalIcon = Terminal;
    activePracticalIconClass = 'practical-micro';
    activePracticalMissionNumber = linuxCount + 1;
    activePracticalPassedCount = linuxCount;
    const mission = (practicalMissions.linux && practicalMissions.linux[linuxCount]) || null;
    if (mission) {
      activePracticalTitle = mission.title;
      activePracticalDesc = mission.storyContext || mission.objective || 'Master Linux shell pipelines and permissions.';
    }
  } else if (sqlCount < 8) {
    activePracticalModule = 'SQL Query Engineering';
    ActivePracticalIcon = Database;
    activePracticalIconClass = 'practical-micro';
    activePracticalMissionNumber = sqlCount + 1;
    activePracticalPassedCount = sqlCount;
    const mission = (practicalMissions.sql && practicalMissions.sql[sqlCount]) || null;
    if (mission) {
      activePracticalTitle = mission.title;
      activePracticalDesc = mission.storyContext || mission.objective || 'Master SQL aggregation and relational joins.';
    }
  } else {
    activePracticalModule = 'Git Version Control';
    ActivePracticalIcon = GitBranch;
    activePracticalMissionNumber = 8;
    activePracticalPassedCount = 8;
    activePracticalTitle = 'All Practical Missions Passed!';
    activePracticalDesc = 'You have mastered all interactive terminal missions across Git, Linux, and SQL!';
  }

  const practicalProgressPct = Math.min(100, Math.round((activePracticalPassedCount / 8) * 100));

  // Placement Readiness Matrix calculation (Strict 6-Category Mathematical Average)
  const osPct = Math.min(100, Math.round(((stats.osMasteredCount ?? 0) / 10) * 100));
  const dbmsPct = Math.min(100, Math.round(((stats.dbmsMasteredCount ?? 0) / 10) * 100));
  const cnPct = Math.min(100, Math.round(((stats.cnMasteredCount ?? 0) / 10) * 100));
  const gitPct = Math.min(100, Math.round(((stats.gitMissionsPassedCount ?? 0) / 8) * 100));
  const linuxPct = Math.min(100, Math.round(((stats.linuxMissionsPassedCount ?? 0) / 8) * 100));
  const sqlPct = Math.min(100, Math.round(((stats.sqlMissionsPassedCount ?? 0) / 8) * 100));
  
  // Exact average across all 6 core categories
  const overallPct = Math.round((osPct + dbmsPct + cnPct + gitPct + linuxPct + sqlPct) / 6);

  // Gamified XP & Engineering Rank Progression
  const totalMasteredTopics = osCount + dbmsCount + cnCount;
  const totalPassedMissions = gitCount + linuxCount + sqlCount;
  const totalXP = (totalMasteredTopics * 100) + (totalPassedMissions * 150);

  const getRankInfo = (pct) => {
    if (pct >= 80) return { level: 5, title: 'Tier-1 Scholar', badge: 'FAANG & Dream Offer Ready', nextTarget: 'Top 1% Percentile', nextPct: 100, minPct: 80 };
    if (pct >= 60) return { level: 4, title: 'Placement Contender', badge: 'Super-Dream Unicorn Track', nextTarget: 'Tier-1 Scholar (80%)', nextPct: 80, minPct: 60 };
    if (pct >= 40) return { level: 3, title: 'Backend Specialist', badge: 'Systems & Relational Core', nextTarget: 'Placement Contender (60%)', nextPct: 60, minPct: 40 };
    if (pct >= 20) return { level: 2, title: 'Systems Apprentice', badge: 'Practical Labs Unlocked', nextTarget: 'Backend Specialist (40%)', nextPct: 40, minPct: 20 };
    return { level: 1, title: 'Code Cadet', badge: 'Foundations & Initiation', nextTarget: 'Systems Apprentice (20%)', nextPct: 20, minPct: 0 };
  };
  const currentRank = getRankInfo(overallPct);
  const tierSpan = currentRank.nextPct - currentRank.minPct;
  const progressInTier = tierSpan > 0 ? Math.min(100, Math.max(0, Math.round(((overallPct - currentRank.minPct) / tierSpan) * 100))) : 100;

  // Adaptive Focus Quest: Identify lowest completion category for highest ROI
  const syllabusTracks = [
    {
      id: 'os',
      name: 'Operating Systems',
      category: 'theory',
      pct: osPct,
      count: osCount,
      total: 10,
      icon: Cpu,
      nextUnit: osCount < 10 ? `Topic ${osCount + 1}: ${osTopics[osCount]?.title || 'Process Scheduling'}` : 'All Topics Mastered',
      gainPct: 1.7
    },
    {
      id: 'dbms',
      name: 'DBMS & Relational',
      category: 'theory',
      pct: dbmsPct,
      count: dbmsCount,
      total: 10,
      icon: Database,
      nextUnit: dbmsCount < 10 ? `Topic ${dbmsCount + 1}: ${dbmsTopics[dbmsCount]?.title || 'Relational Schema'}` : 'All Topics Mastered',
      gainPct: 1.7
    },
    {
      id: 'cn',
      name: 'Computer Networks',
      category: 'theory',
      pct: cnPct,
      count: cnCount,
      total: 10,
      icon: Network,
      nextUnit: cnCount < 10 ? `Topic ${cnCount + 1}: ${cnTopics[cnCount]?.title || 'OSI / TCP-IP Stack'}` : 'All Topics Mastered',
      gainPct: 1.7
    },
    {
      id: 'git',
      name: 'Git Version Control',
      category: 'practical',
      pct: gitPct,
      count: gitCount,
      total: 8,
      icon: GitBranch,
      nextUnit: gitCount < 8 ? `Mission ${gitCount + 1}: ${(practicalMissions.git && practicalMissions.git[gitCount]?.title) || 'Branching & Merge'}` : 'All Missions Passed',
      gainPct: 2.1
    },
    {
      id: 'linux',
      name: 'Linux Systems Lab',
      category: 'practical',
      pct: linuxPct,
      count: linuxCount,
      total: 8,
      icon: Terminal,
      nextUnit: linuxCount < 8 ? `Mission ${linuxCount + 1}: ${(practicalMissions.linux && practicalMissions.linux[linuxCount]?.title) || 'Pipes & Redirection'}` : 'All Missions Passed',
      gainPct: 2.1
    },
    {
      id: 'sql',
      name: 'SQL Optimization Lab',
      category: 'practical',
      pct: sqlPct,
      count: sqlCount,
      total: 8,
      icon: Database,
      nextUnit: sqlCount < 8 ? `Mission ${sqlCount + 1}: ${(practicalMissions.sql && practicalMissions.sql[sqlCount]?.title) || 'Aggregations & Joins'}` : 'All Missions Passed',
      gainPct: 2.1
    }
  ];

  const focusTrack = [...syllabusTracks].sort((a, b) => a.pct - b.pct)[0];

  // General Industry Awareness & Recruitment Tiers (Public Industry Context)
  const industryTiers = [
    {
      tier: 'Tier 1',
      title: 'IT Services & Core Drives',
      ctcRange: '₹3.5 - 9 LPA',
      focusArea: 'Basic coding, programming fundamentals & general aptitude',
      companies: ['TCS Digital', 'Infosys SP', 'Cognizant GenC', 'Wipro Turbo'],
      practiceTarget: { view: 'learning', subject: 'os', label: 'Practice Core Theory & Git' }
    },
    {
      tier: 'Tier 2',
      title: 'Growth Tech & Product Scale-Ups',
      ctcRange: '₹8 - 25 LPA',
      focusArea: 'Data structures, algorithms, OOP, web fundamentals & SQL',
      companies: ['Swiggy', 'Razorpay', 'Zomato', 'PhonePe', 'BrowserStack'],
      practiceTarget: { view: 'practical', module: 'sql', label: 'Practice SQL Query Engineering' }
    },
    {
      tier: 'Tier 3',
      title: 'FinTech & High-Scale Systems',
      ctcRange: '₹15 - 26 LPA',
      focusArea: 'Advanced DSA, multithreading, databases & system concepts',
      companies: ['Morgan Stanley', 'Goldman Sachs', 'JPMorgan', 'Oracle', 'Cisco'],
      practiceTarget: { view: 'learning', subject: 'cn', label: 'Practice Concurrency & Networks' }
    },
    {
      tier: 'Tier 4',
      title: 'Tier-1 FAANG & Global Big Tech',
      ctcRange: '₹38 - 52 LPA',
      focusArea: 'Advanced DSA, low-level & high-level system design',
      companies: ['Google', 'Microsoft', 'Amazon', 'Uber', 'Atlassian'],
      practiceTarget: { view: 'practical', module: 'linux', label: 'Practice Linux & OS Internals' }
    }
  ];

  // Action handler to practice topics matching a tier's evaluation focus
  const handlePracticeTier = (target) => {
    if (!target) return;
    if (target.view === 'learning') {
      try {
        localStorage.setItem('commitdrive_active_subject', target.subject || 'os');
      } catch {}
      onNavigate('learning');
    } else {
      try {
        localStorage.setItem('commitdrive_practical_module', target.module || 'git');
      } catch {}
      onNavigate('practical');
    }
  };

  return (
    <main className="dashboard-page theme-transition">
      <div className="content-wrapper dashboard-container">

        <GatedContentPreview
          isGated={!currentUser}
          badgeText="Placement Engineering Suite"
          title="Sign up to unlock full dashboard access"
          subtitle="Join thousands of 2026 campus placement candidates accessing personalized readiness audits, interactive terminal labs, and company hiring gates."
          features={[
            'Personalized readiness matrix across 6 core CS subjects',
            'Curated hiring patterns & interview questions for TCS, Razorpay, FAANG & FinTech',
            'Synchronized progress tracking across Study Corner & Terminal Zone',
            '7-day retention streak booster & placement milestone leaderboard'
          ]}
          ctaText="Sign up to unlock full access"
          onSignUp={() => onOpenAuth && onOpenAuth('signup')}
          onSignIn={() => onOpenAuth && onOpenAuth('signin')}
          onDemoLogin={onDemoLogin}
          previewContent={
            <>
              {/* Daily Practice & Streak Reminder Banner */}
              <PracticeReminderBanner 
                streak={activeStreak}
                onStartPractice={() => onNavigate && onNavigate('learning')}
                recommendedTitle={activeTheoryTitle}
              />

              {/* =================================================================
                  1. Welcome Header & Daily Tip (Fully Visible Preview)
                  ================================================================= */}
              <section className="dash-hero-section">
              <div className="dash-hero-left">
                <div className="dash-cohort-tag theme-transition">
                  <Target size={14} className="tag-icon" />
                  <span>Target: SDE 1 • Class of {student.targetYear || '2026'}</span>
                </div>
                <h1 className="dash-greeting">
                  Welcome back, <span className="highlight-name">{student.name}</span> 👋
                </h1>
                <p className="dash-sub">
                  Your placement preparation is <strong className="readiness-percent">{overallPct}% ready</strong> for upcoming campus drives and technical screening rounds.
                </p>
              </div>

              {/* Daily Placement Tip Card */}
              <div className="daily-tip-card theme-transition">
                <div className="tip-header">
                  <span className="tip-badge">
                    <Sparkles size={13} />
                    <span>Placement Insight of the Day</span>
                  </span>
                  <span className="tip-source">Amazon & Uber SDE Interviews</span>
                </div>
                <p className="tip-content">
                  "78% of OS screening rounds test whether you can clearly explain how the <strong>Working Set Model</strong> and <strong>TLB (Translation Lookaside Buffer)</strong> mitigate page faults during memory thrashing."
                </p>
              </div>

              {/* Emergency Cram Sheet Banner Card */}
              <div 
                className="dash-cram-card theme-transition"
                onClick={() => {
                  if (onOpenCramSheet) onOpenCramSheet(null);
                  else window.dispatchEvent(new CustomEvent('commitdrive_open_cram_sheet', { detail: { subject: null } }));
                }}
                role="button"
                tabIndex={0}
              >
                <div className="cram-card-left">
                  <div className="cram-badge-icon">
                    <Zap size={16} />
                  </div>
                  <div>
                    <div className="cram-tag-row">
                      <span className="cram-tag">Night-Before Rapid Revision</span>
                      <span className="cram-pill">OS • DBMS • Networks • Practical</span>
                    </div>
                    <h4 className="cram-card-title">Placement Emergency Cram Sheet</h4>
                    <p className="cram-card-desc">High-frequency formulas, CPU scheduling, ACID anomaly matrix, and top 20 trap questions ready to print or scan.</p>
                  </div>
                </div>
                <button type="button" className="cram-open-btn theme-transition">
                  <span>Open Sheet</span>
                  <ArrowRight size={13} />
                </button>
              </div>

              {/* Demo Mode Scope Status Banner */}
              {currentUser?.isDemo && (
                <div className="dash-demo-banner theme-transition animate-fadeIn">
                  <div className="demo-banner-left">
                    <span className="demo-banner-pill">
                      <Zap size={13} />
                      <span>Demo Mode Active</span>
                    </span>
                    <p className="demo-banner-text">
                      You're exploring CommitDrive in <strong>Scoped Demo Mode</strong> (1 sample topic & mission unlocked per subject). Sign up to save permanent progress, unlock all 30 theory topics, 24 terminal labs, and diagnostic mock tests.
                    </p>
                  </div>
                  <button 
                    type="button"
                    className="demo-banner-cta theme-transition"
                    onClick={() => onOpenAuth && onOpenAuth('signup')}
                  >
                    <span>Sign up for full access</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              )}
            </section>
            </>
          }
        >

          {/* =================================================================
              2. Distinctive Element: Placement Engineering Rank & Adaptive Focus Quest
              ================================================================= */}
          <section className="rank-quest-section theme-transition">
          <div className="rank-quest-grid">
            
            {/* Engineering Rank & XP Card */}
            <div className="rank-status-card theme-transition">
              <div className="rank-card-header">
                <div className="rank-badge-icon-box">
                  <Award size={22} className="rank-award-icon" />
                </div>
                <div className="rank-meta-col">
                  <div className="rank-level-tag">Rank Level {currentRank.level}</div>
                  <h3 className="rank-title">{currentRank.title}</h3>
                </div>
                <div className="rank-xp-pill">
                  <Zap size={14} className="xp-zap" />
                  <span>{totalXP.toLocaleString()} XP</span>
                </div>
              </div>

              <p className="rank-status-desc">{currentRank.badge}</p>

              <div className="rank-tier-progress-box">
                <div className="rank-tier-labels">
                  <span>Milestone: {currentRank.nextTarget}</span>
                  <strong>{progressInTier}% Tier Progress</strong>
                </div>
                <div className="rank-bar-track">
                  <div className="rank-bar-fill" style={{ width: `${progressInTier}%` }} />
                </div>
              </div>

              <div className="rank-leaderboard-cta">
                <button 
                  className="rank-leaderboard-btn theme-transition"
                  onClick={() => onNavigate('leaderboard')}
                  title="View Placement Standings"
                >
                  <Trophy size={14} />
                  <span>Check Placement Leaderboard</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>

            {/* Adaptive Focus Quest Card */}
            <div className="focus-quest-card theme-transition">
              <div className="quest-header">
                <div className="quest-tag">
                  <Zap size={14} className="quest-icon" />
                  <span>Adaptive Focus Quest</span>
                </div>
                <span className="quest-duration">~15 mins • High Yield</span>
              </div>

              <div className="quest-body">
                <h4 className="quest-title">
                  Bridge the {focusTrack.name} Gap
                </h4>
                <p className="quest-desc">
                  Your {focusTrack.name} readiness is currently at <strong>{focusTrack.pct}%</strong> ({focusTrack.count}/{focusTrack.total} completed). 
                  Clear <em>{focusTrack.nextUnit}</em> to earn <strong>+{focusTrack.category === 'theory' ? '100' : '150'} XP</strong> and boost overall placement readiness by <strong>+{focusTrack.gainPct}%</strong>.
                </p>
              </div>

              <div className="quest-actions">
                <button 
                  className="quest-launch-btn theme-transition"
                  onClick={() => onNavigate(focusTrack.category === 'theory' ? 'learning' : 'practical')}
                >
                  <Play size={14} />
                  <span>Launch Quest in {focusTrack.category === 'theory' ? 'Study Corner' : 'Terminal Zone'}</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>

          </div>
        </section>

        {/* =================================================================
            3. Interactive 7-Day Practice Streak Bar
            ================================================================= */}
        <section className="streak-section theme-transition">
          <div className="streak-header-row">
            <div className="streak-title-group">
              <div className="streak-flame-box">
                <Flame size={22} className={activeStreak > 0 ? 'flame-pulse' : ''} />
              </div>
              <div>
                <h3 className="streak-heading">
                  {activeStreak > 0 ? `${activeStreak}-Day Study Streak!` : 'Start Your Study Streak!'}
                </h3>
                <p className="streak-sub">
                  {activeStreak > 0 
                    ? 'Practice today in either Study Corner or Terminal Zone to maintain streak multiplier.' 
                    : 'Complete any theory lesson or terminal mission today to start your streak.'}
                </p>
              </div>
            </div>
            <div className="streak-multiplier-badge">
              <span>{activeStreak > 0 ? '1.5x Knowledge Retention' : 'Streak Booster'}</span>
            </div>
          </div>

          {/* 7-Day Track */}
          <div className="days-track-grid">
            {weekDays.map((item, index) => (
              <div 
                key={index} 
                className={`day-col ${item.completed ? 'completed' : ''} ${item.isToday ? 'today' : ''} theme-transition`}
              >
                <div className="day-bubble">
                  {item.completed ? (
                    <CheckCircle2 size={16} className="day-check" />
                  ) : item.isToday ? (
                    <Flame size={16} className="today-flame" />
                  ) : (
                    <span className="day-dot" />
                  )}
                </div>
                <span className="day-name">{item.day}</span>
                {item.label && <span className={`day-sub-label ${item.isToday ? 'current-label' : ''}`}>{item.label}</span>}
              </div>
            ))}
          </div>
        </section>

        {/* =================================================================
            4. Dual "Continue Learning" Action Cards
            ================================================================= */}
        <section className="continue-learning-section theme-transition">
          <div className="section-title-row">
            <div>
              <div className="continue-eyebrow">Active Study Tracks</div>
              <h2 className="section-main-heading">Continue Your Learning Tracks</h2>
            </div>
            <span className="section-sub-tag">Pick up right where you left off</span>
          </div>

          <div className="continue-cards-grid">
            
            {/* Track 1: Learning Path Theory Card */}
            <div className="continue-card learning-continue-card theme-transition">
              <div className="continue-card-top">
                <div className="track-indicator learning-indicator">
                  <BookOpen size={14} />
                  <span>Theory track • Study Corner</span>
                </div>
                <span className="topic-num-pill">Topic {activeTheoryTopicNumber} of 10</span>
              </div>

              <div className="continue-card-body">
                <div className="subject-micro-tag">
                  <ActiveTheoryIcon size={14} />
                  <span>{activeTheorySubject}</span>
                </div>
                <h3 className="continue-topic-title">{activeTheoryTitle}</h3>
                <p className="continue-topic-desc">{activeTheoryDesc}</p>

                {/* Progress bar */}
                <div className="card-progress-block">
                  <div className="progress-labels">
                    <span>Topic Progress</span>
                    <strong>{theoryProgressPct}% Completed</strong>
                  </div>
                  <div className="continue-bar-track">
                    <div className="continue-bar-fill learning-fill" style={{ width: `${theoryProgressPct}%` }} />
                  </div>
                </div>
              </div>

              <div className="continue-card-bottom">
                <span className="meta-left">{activeTheorySubjectCount} of 10 Topics Mastered</span>
                <button 
                  className="resume-btn learning-btn theme-transition"
                  onClick={() => onNavigate('learning')}
                >
                  <span>{activeTheorySubjectCount === 0 ? 'Start Lesson' : 'Resume Lesson'}</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>

            {/* Track 2: Practical Path Terminal Card */}
            <div className="continue-card practical-continue-card theme-transition">
              <div className="continue-card-top">
                <div className="track-indicator practical-indicator">
                  <Terminal size={14} />
                  <span>Hands-on lab • Terminal Zone</span>
                </div>
                <span className="topic-num-pill practical-pill">Mission {activePracticalMissionNumber} of 8</span>
              </div>

              <div className="continue-card-body">
                <div className={`subject-micro-tag ${activePracticalIconClass}`}>
                  <ActivePracticalIcon size={14} />
                  <span>{activePracticalModule}</span>
                </div>
                <h3 className="continue-topic-title">{activePracticalTitle}</h3>
                <p className="continue-topic-desc">{activePracticalDesc}</p>

                {/* Progress bar */}
                <div className="card-progress-block">
                  <div className="progress-labels">
                    <span>Module Progress</span>
                    <strong>{activePracticalPassedCount} of 8 Missions Passed</strong>
                  </div>
                  <div className="continue-bar-track">
                    <div className="continue-bar-fill practical-fill" style={{ width: `${practicalProgressPct}%` }} />
                  </div>
                </div>
              </div>

              <div className="continue-card-bottom">
                <span className="meta-left">Virtual Terminal Ready</span>
                <button 
                  className="resume-btn practical-btn theme-transition"
                  onClick={() => onNavigate('practical')}
                >
                  <Play size={14} />
                  <span>{activePracticalPassedCount === 0 ? 'Start Hands-on Lab' : 'Open Terminal Zone'}</span>
                </button>
              </div>
            </div>

          </div>
        </section>

        {/* =================================================================
            5. Overall Placement Readiness Matrix
            ================================================================= */}
        <section className="readiness-matrix-section theme-transition">
          <div className="readiness-header">
            <div>
              <div className="readiness-eyebrow">Comprehensive syllabus audit</div>
              <h2 className="readiness-heading">Placement Readiness Matrix</h2>
            </div>
            <div className="overall-score-badge">
              <TrendingUp size={18} />
              <span>Overall Readiness: <strong>{overallPct}%</strong></span>
            </div>
          </div>

          <div className="readiness-grid">
            
            {/* OS */}
            <div className="readiness-item theme-transition">
              <div className="readiness-item-header">
                <div className="item-name-group">
                  <Cpu size={16} className="item-icon" />
                  <span className="item-name">Operating Systems</span>
                </div>
                <span className={`item-percentage ${osPct < 40 ? 'alert-percentage' : ''}`}>{osPct}%</span>
              </div>
              <div className="metric-track">
                <div className={`metric-fill ${osPct < 40 ? 'alert-fill' : ''}`} style={{ width: `${osPct}%` }} />
              </div>
              <span className={`item-sub ${osPct < 40 ? 'alert-sub' : ''}`}>
                {osPct < 40 ? 'Needs Attention (' : ''}{stats.osMasteredCount ?? 0}/10 topics mastered{osPct < 40 ? ')' : ''}
              </span>
            </div>

            {/* DBMS */}
            <div className="readiness-item theme-transition">
              <div className="readiness-item-header">
                <div className="item-name-group">
                  <Database size={16} className="item-icon" />
                  <span className="item-name">Database Management (DBMS)</span>
                </div>
                <span className={`item-percentage ${dbmsPct < 40 ? 'alert-percentage' : ''}`}>{dbmsPct}%</span>
              </div>
              <div className="metric-track">
                <div className={`metric-fill ${dbmsPct < 40 ? 'alert-fill' : ''}`} style={{ width: `${dbmsPct}%` }} />
              </div>
              <span className={`item-sub ${dbmsPct < 40 ? 'alert-sub' : ''}`}>
                {dbmsPct < 40 ? 'Needs Attention (' : ''}{stats.dbmsMasteredCount ?? 0}/10 topics mastered{dbmsPct < 40 ? ')' : ''}
              </span>
            </div>

            {/* Computer Networks */}
            <div className="readiness-item theme-transition">
              <div className="readiness-item-header">
                <div className="item-name-group">
                  <Network size={16} className="item-icon" />
                  <span className="item-name">Computer Networks</span>
                </div>
                <span className={`item-percentage ${cnPct < 40 ? 'alert-percentage' : ''}`}>{cnPct}%</span>
              </div>
              <div className="metric-track">
                <div className={`metric-fill ${cnPct < 40 ? 'alert-fill' : ''}`} style={{ width: `${cnPct}%` }} />
              </div>
              <span className={`item-sub ${cnPct < 40 ? 'alert-sub' : ''}`}>
                {cnPct < 40 ? 'Needs Attention (' : ''}{stats.cnMasteredCount ?? 0}/10 topics mastered{cnPct < 40 ? ')' : ''}
              </span>
            </div>

            {/* Git */}
            <div className="readiness-item theme-transition">
              <div className="readiness-item-header">
                <div className="item-name-group">
                  <GitBranch size={16} className="item-icon" />
                  <span className="item-name">Git Lab & Collaboration</span>
                </div>
                <span className={`item-percentage ${gitPct < 40 ? 'alert-percentage' : ''}`}>{gitPct}%</span>
              </div>
              <div className="metric-track">
                <div className={`metric-fill ${gitPct < 40 ? 'alert-fill' : ''}`} style={{ width: `${gitPct}%` }} />
              </div>
              <span className={`item-sub ${gitPct < 40 ? 'alert-sub' : ''}`}>
                {gitPct < 40 ? 'Needs Attention (' : ''}{stats.gitMissionsPassedCount ?? 0}/8 missions passed{gitPct < 40 ? ')' : ''}
              </span>
            </div>

            {/* Linux */}
            <div className="readiness-item theme-transition">
              <div className="readiness-item-header">
                <div className="item-name-group">
                  <Terminal size={16} className="item-icon" />
                  <span className="item-name">Linux CLI & SysAdmin</span>
                </div>
                <span className={`item-percentage ${linuxPct < 40 ? 'alert-percentage' : ''}`}>{linuxPct}%</span>
              </div>
              <div className="metric-track">
                <div className={`metric-fill ${linuxPct < 40 ? 'alert-fill' : ''}`} style={{ width: `${linuxPct}%` }} />
              </div>
              <span className={`item-sub ${linuxPct < 40 ? 'alert-sub' : ''}`}>
                {linuxPct < 40 ? 'Needs Attention (' : ''}{stats.linuxMissionsPassedCount ?? 0}/8 missions passed{linuxPct < 40 ? ')' : ''}
              </span>
            </div>

            {/* SQL */}
            <div className="readiness-item theme-transition">
              <div className="readiness-item-header">
                <div className="item-name-group">
                  <Database size={16} className="item-icon" />
                  <span className="item-name">SQL Query Optimization</span>
                </div>
                <span className={`item-percentage ${sqlPct < 40 ? 'alert-percentage' : ''}`}>{sqlPct}%</span>
              </div>
              <div className="metric-track">
                <div className={`metric-fill ${sqlPct < 40 ? 'alert-fill' : ''}`} style={{ width: `${sqlPct}%` }} />
              </div>
              <span className={`item-sub ${sqlPct < 40 ? 'alert-sub' : ''}`}>
                {sqlPct < 40 ? 'Needs Attention (' : ''}{stats.sqlMissionsPassedCount ?? 0}/8 missions passed{sqlPct < 40 ? ')' : ''}
              </span>
            </div>

          </div>

          {/* Diagnostic Alert Box */}
          <div className="weak-area-alert-box theme-transition">
            <AlertTriangle size={18} className="alert-icon" />
            <div className="alert-text">
              <strong>Diagnostic Recommendation:</strong>{' '}
              {stats.diagnosticAlerts && stats.diagnosticAlerts.length > 0 ? (
                stats.diagnosticAlerts.join(' • ')
              ) : (
                'Focus on zero-progress categories above to rapidly unlock higher company tiers.'
              )}
            </div>
          </div>

        </section>

        {/* =================================================================
            6. General Industry Placement Awareness & Hiring Tiers
            ================================================================= */}
        <section className="company-runway-section theme-transition">
          <div className="runway-header">
            <div>
              <div className="runway-eyebrow">Industry Landscape • Placement Awareness</div>
              <h2 className="runway-title">Campus Hiring Tiers & Industry Expectations</h2>
            </div>
            <div className="runway-status-indicator">
              <Building size={15} />
              <span>General Industry Context</span>
            </div>
          </div>

          <div className="company-gates-grid">
            {industryTiers.map((tierItem, idx) => (
              <div key={idx} className="gate-card theme-transition">
                <div className="gate-card-top">
                  <div className="gate-tier-info">
                    <span className="gate-tier-badge">{tierItem.tier}</span>
                    <span className="gate-ctc-pill">{tierItem.ctcRange}</span>
                  </div>
                </div>

                <h3 className="gate-title">{tierItem.title}</h3>

                <div className="gate-focus-area">
                  <span className="focus-area-label">Evaluation Focus</span>
                  <p className="focus-area-text">{tierItem.focusArea}</p>
                </div>

                <div className="gate-companies-wrap">
                  <span className="companies-label">Common Recruiters (Click to inspect):</span>
                  <div className="companies-tags">
                    {tierItem.companies.map((co, cIdx) => (
                      <button 
                        key={cIdx} 
                        type="button"
                        className="company-chip-btn theme-transition"
                        onClick={() => setSelectedCompany(getCompanyData(co, tierItem))}
                        title={`View ${co} interview details`}
                      >
                        <span>{co}</span>
                        <ChevronRight size={11} className="chip-arrow" />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="gate-card-action">
                  <button
                    type="button"
                    className="tier-practice-btn theme-transition"
                    onClick={() => handlePracticeTier(tierItem.practiceTarget)}
                  >
                    <span>Practice these topics</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Illustrative Disclaimer */}
          <div className="runway-disclaimer theme-transition">
            <Info size={14} className="disclaimer-icon" />
            <span>Ranges are approximate 2026 estimates and vary significantly by college, location, and individual performance — always verify current figures on official company career pages before making decisions.</span>
          </div>
        </section>
      </GatedContentPreview>

    </div>

      {/* =================================================================
          7. Company-Specific Interview Pattern Popup Modal
          ================================================================= */}
      {selectedCompany && (
        <div 
          className="company-modal-backdrop"
          onClick={() => setSelectedCompany(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="company-modal-title"
        >
          <div 
            className="company-modal-card theme-transition"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="company-modal-header">
              <div className="modal-header-titles">
                <div className="modal-tier-row">
                  <span className="modal-tier-badge">{selectedCompany.tier}</span>
                  <span className="modal-tier-title">{selectedCompany.tierTitle}</span>
                  <span className="modal-ctc-pill">{selectedCompany.ctcRange}</span>
                </div>
                <h3 id="company-modal-title" className="modal-company-title">
                  {selectedCompany.companyName}
                </h3>
              </div>
              <button 
                type="button"
                className="modal-close-btn theme-transition"
                onClick={() => setSelectedCompany(null)}
                aria-label="Close dialog"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="company-modal-body">
              {selectedCompany.isDocumented ? (
                <>
                  {/* Hiring Process */}
                  <div className="modal-section-block">
                    <span className="modal-section-label">Hiring Assessment Process</span>
                    <p className="modal-rounds-text">{selectedCompany.roundsOverview}</p>
                  </div>

                  {/* Documented Patterns */}
                  <div className="modal-section-block">
                    <span className="modal-section-label">Documented Practical / Technical Round Patterns</span>
                    <div className="modal-patterns-list">
                      {selectedCompany.practicalPatterns.map((pat, pIdx) => (
                        <div key={pIdx} className="modal-pattern-item">
                          <strong className="pattern-area-title">{pat.area}</strong>
                          <p className="pattern-desc">{pat.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Disclaimer Note */}
                  <div className="modal-disclaimer-note">
                    <Info size={14} className="note-icon" />
                    <span>{selectedCompany.disclaimerNote}</span>
                  </div>
                </>
              ) : (
                <>
                  {/* Unresearched Companies: Honest General Focus Area */}
                  <div className="modal-section-block">
                    <span className="modal-section-label">General Industry Evaluation Focus</span>
                    <p className="modal-focus-text">{selectedCompany.focusArea}</p>
                  </div>

                  {/* Open-Ended Interview Note */}
                  <div className="modal-openended-note">
                    <Info size={14} className="note-icon" />
                    <span>{selectedCompany.openEndedNote}</span>
                  </div>
                </>
              )}
            </div>

            {/* Modal Footer */}
            <div className="company-modal-footer">
              <button
                type="button"
                className="modal-practice-btn theme-transition"
                onClick={() => {
                  handlePracticeTier(selectedCompany.practiceTarget);
                  setSelectedCompany(null);
                }}
              >
                <span>{selectedCompany.isDocumented && selectedCompany.practiceTarget?.label ? selectedCompany.practiceTarget.label : 'Practice Relevant Topics'}</span>
                <ArrowRight size={14} />
              </button>
              <button
                type="button"
                className="modal-dismiss-btn theme-transition"
                onClick={() => setSelectedCompany(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}
