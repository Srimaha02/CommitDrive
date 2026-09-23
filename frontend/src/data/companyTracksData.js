// Master Company-Specific Hiring Tracks & Evaluation Rubrics — CommitDrive
// Defines target company expectations, scoring criteria, and focus tiers for CS fundamentals.

export const COMPANY_TRACKS = [
  {
    id: 'all',
    label: 'All Tracks',
    shortLabel: 'All Tracks',
    badge: 'Complete Question Pool',
    color: '#38bdf8',
    bg: 'rgba(56, 189, 248, 0.12)',
    border: 'rgba(56, 189, 248, 0.3)',
    companies: ['All Campus & Off-Campus Drives'],
    tagline: 'Comprehensive question set from freshers to FAANG systems rounds.',
    interviewerMindset: 'Comprehensive evaluation covering breadth of core CS principles and practical troubleshooting.',
    keyExpectation: 'Balance crisp textbook definitions with practical engineering understanding.'
  },
  {
    id: 'service',
    label: 'Service / Mass Hiring Gate',
    shortLabel: 'TCS / Infosys / Mass',
    badge: 'Definitions & Differences',
    color: '#4ade80',
    bg: 'rgba(74, 222, 128, 0.12)',
    border: 'rgba(74, 222, 128, 0.3)',
    companies: ['TCS (NQT / Digital)', 'Infosys (DSE / SP)', 'Wipro', 'Cognizant', 'Accenture', 'Capgemini'],
    tagline: 'Direct questions on fundamentals, clear definitions, and exact differences.',
    interviewerMindset: 'Screens for strong fundamental clarity. Penalizes hesitation, vague definitions, and confused terminology.',
    keyExpectation: 'Deliver the formal definition in the first 10 seconds, then present 3 crisp differences with concrete examples.'
  },
  {
    id: 'fintech',
    label: 'Product & FinTech Gate',
    shortLabel: 'Razorpay / FinTech',
    badge: 'Production Resilience',
    color: '#f59e0b',
    bg: 'rgba(245, 158, 11, 0.12)',
    border: 'rgba(245, 158, 11, 0.3)',
    companies: ['Razorpay', 'Swiggy', 'Zerodha', 'CRED', 'PhonePe', 'Groww', 'Postman'],
    tagline: 'Production edge cases, database locks, ACID anomalies, connection pools & idempotency.',
    interviewerMindset: 'Simulates production failure modes. Looks for how systems handle concurrency, money transactions, network timeouts, and data corruption.',
    keyExpectation: 'Mention real production hazards: race conditions, deadlock cycles, isolation levels, connection pool exhaustion, and idempotency keys.'
  },
  {
    id: 'faang',
    label: 'Tier-1 & FAANG Systems',
    shortLabel: 'Amazon / FAANG',
    badge: 'OS & Scale Internals',
    color: '#c084fc',
    bg: 'rgba(192, 132, 252, 0.12)',
    border: 'rgba(192, 132, 252, 0.3)',
    companies: ['Amazon', 'Google', 'Microsoft', 'Uber', 'Atlassian', 'Salesforce'],
    tagline: 'Kernel internals, zero-copy, memory hierarchy, page tables, epoll & distributed tradeoffs.',
    interviewerMindset: 'Probes deep into the OS kernel, hardware architecture, and distributed system trade-offs. Wants to know *why* abstractions behave the way they do.',
    keyExpectation: 'Trace down to the kernel/hardware boundary: syscall overhead, context switch costs, page fault cascades, and network buffer dynamics.'
  }
];

export function getCompanyTrack(trackId) {
  return COMPANY_TRACKS.find(t => t.id === trackId) || COMPANY_TRACKS[0];
}

// Helper to filter questions according to company track
export function filterQuestionsByTrack(questions = [], trackId = 'all') {
  if (!questions || !Array.isArray(questions)) return [];
  if (trackId === 'all') return questions;

  return questions.filter(q => {
    // If explicit companyTiers array exists on question
    if (q.companyTiers && Array.isArray(q.companyTiers)) {
      return q.companyTiers.includes(trackId);
    }
    // Fallback based on question level
    if (trackId === 'service') {
      return q.level === 'basic' || (q.companyTags && q.companyTags.some(t => /TCS|Infosys|Wipro|Cognizant|GFG/i.test(t)));
    }
    if (trackId === 'fintech') {
      return q.level === 'intermediate' || q.level === 'basic' || (q.companyTags && q.companyTags.some(t => /Razorpay|Zerodha|CRED|Swiggy|Stripe|Paytm|FinTech/i.test(t)));
    }
    if (trackId === 'faang') {
      return q.level === 'advanced' || q.level === 'intermediate' || (q.companyTags && q.companyTags.some(t => /Amazon|Google|Microsoft|Uber|Meta/i.test(t)));
    }
    return true;
  });
}

// Helper to get company-specific hiring rubric and evaluation checklist for a question
export function getQuestionTrackRubric(question, trackId = 'all') {
  if (!question) return null;
  
  if (trackId === 'service') {
    return {
      title: 'TCS & Service Gate Rubric',
      tier: 'Service / Mass Hiring',
      color: '#4ade80',
      badge: 'Definitional Accuracy',
      checklist: [
        'State the direct textbook definition in the opening 10 seconds without filler words.',
        'List 3 clean tabular differences (e.g. Memory isolation, Speed, Resource footprint).',
        'Stick strictly to proven standard terminology (do not improvise unfamiliar terms).'
      ],
      interviewerWatchout: 'Interviewers look for instant recall and clarity. Hesitation on standard differences leads to rejection.'
    };
  }
  
  if (trackId === 'fintech') {
    return {
      title: 'Razorpay & FinTech Gate Rubric',
      tier: 'Product & Payments High-Growth',
      color: '#f59e0b',
      badge: 'Production Resilience',
      checklist: [
        'Explain how this concept prevents data corruption during simultaneous user transactions.',
        'Address failure modes: What happens if the server crashes mid-flight or network timeouts occur?',
        'Highlight locking, connection pooling, idempotency, or rollback recovery.'
      ],
      interviewerWatchout: 'Purely theoretical answers without concurrency or failure handling get flagged as non-production-ready.'
    };
  }
  
  if (trackId === 'faang') {
    return {
      title: 'Amazon & FAANG Systems Rubric',
      tier: 'Tier-1 Systems Architecture',
      color: '#c084fc',
      badge: 'Kernel & Scale Internals',
      checklist: [
        'Trace the system path down to the OS kernel, hardware CPU caches, and page tables.',
        'Contrast algorithmic and physical trade-offs (e.g. memory bus saturation vs CPU cycles).',
        'Address scale boundaries: What degrades when concurrent requests surge from 1K to 100K/sec?'
      ],
      interviewerWatchout: 'Superficial answers that stop at library/framework abstractions are probed relentlessly with deep kernel follow-ups.'
    };
  }

  return {
    title: 'Standard SDE Placement Rubric',
    tier: 'General Placement Core',
    color: '#38bdf8',
    badge: '3-Step Blueprint',
    checklist: [
      'State definition and core objective.',
      'Provide concrete architecture or lifecycle differences.',
      'Highlight real-world performance implications.'
    ],
    interviewerWatchout: 'Deliver answers structured in 3 clear steps rather than a continuous unstructured monologue.'
  };
}
