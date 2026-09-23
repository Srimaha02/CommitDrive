// Master Learning Curriculum Entry Point — CommitDrive
// Aggregates all 30 foundational topics across Operating Systems, DBMS, and Computer Networks.
// Enriched with 3-Tier Placement Calibrations, 60s Elevator Pitches, and Trap Question Vaults.

import { osTopics } from './osTopics.js';
import { dbmsTopics } from './dbmsTopics.js';
import { cnTopics } from './cnTopics.js';
import { topicInterviewData } from './interviewEnrichment.js';

export const CURRICULUM_TIERS = [
  { id: 'all', label: 'All Tiers', shortLabel: 'All', badge: 'All Levels' },
  { id: 'L100', label: 'L100: Foundations', shortLabel: 'L100 Foundations', badge: 'ELI5 & Basics' },
  { id: 'L200', label: 'L200: Placement Core', shortLabel: 'L200 Placement Core', badge: 'SDE-1 Standard' },
  { id: 'L300', label: 'L300: FAANG & Systems', shortLabel: 'L300 FAANG Systems', badge: 'High Scale' }
];

export const subjects = [
  {
    id: 'os',
    name: 'Operating Systems',
    shortName: 'OS',
    tagline: 'Kernel architecture, concurrency, virtual memory & scheduling',
    totalTopics: 10,
    accentColor: '#e8604a',
    iconName: 'Cpu',
    description: 'Master core systems concepts: Process scheduling, synchronization primitives, deadlocks, paging, TLBs, and file systems tested in systems engineering and SDE rounds.'
  },
  {
    id: 'dbms',
    name: 'Database Management',
    shortName: 'DBMS',
    tagline: 'Relational algebra, SQL, normalization, ACID & B+ trees',
    totalTopics: 10,
    accentColor: '#2f5233',
    iconName: 'Database',
    description: 'Understand how enterprise database engines operate under the hood: SQL optimization, functional dependencies up to BCNF, 2PL serializability, and Write-Ahead Logging.'
  },
  {
    id: 'cn',
    name: 'Computer Networks',
    shortName: 'Networks',
    tagline: 'OSI/TCP-IP stacks, routing, sliding windows & HTTP/3',
    totalTopics: 10,
    accentColor: '#c97064',
    iconName: 'Network',
    description: 'Deconstruct end-to-end packet transmission: Subnetting calculations, TCP 3-way handshakes, congestion control curves (AIMD/Cubic), and modern web protocols.'
  }
];

// Helper: Attach calibrated interview tier, 60s elevator pitch, and trap questions
function enrichTopicWithInterviewData(topic) {
  const interview = topicInterviewData[topic.id];
  let tier = 'L200';
  let tierName = 'Placement Core';
  if (topic.difficulty === 'Beginner') {
    tier = 'L100';
    tierName = 'Foundations (ELI5)';
  } else if (topic.difficulty === 'Advanced') {
    tier = 'L300';
    tierName = 'FAANG Systems';
  }

  if (interview?.tier) {
    tier = interview.tier;
    tierName = interview.tierName || tierName;
  }

  return {
    ...topic,
    tier,
    tierName,
    frequency: interview?.frequency || 'Standard SDE-1 placement question',
    interviewScript60s: interview ? {
      duration: '60s',
      targetPrompt: interview.targetPrompt,
      script: interview.script,
      keywords: interview.keywords || []
    } : null,
    trapQuestions: interview?.trapQuestions || []
  };
}

const enrichedOsTopics = osTopics.map(enrichTopicWithInterviewData);
const enrichedDbmsTopics = dbmsTopics.map(enrichTopicWithInterviewData);
const enrichedCnTopics = cnTopics.map(enrichTopicWithInterviewData);

// Master topics lookup map
export const allTopics = [...enrichedOsTopics, ...enrichedDbmsTopics, ...enrichedCnTopics];

export const curriculumData = {
  os: enrichedOsTopics,
  dbms: enrichedDbmsTopics,
  cn: enrichedCnTopics
};

// Helper: Get all subjects
export function getAllSubjects() {
  return subjects;
}

// Helper: Get subject by ID
export function getSubjectById(subjectId) {
  return subjects.find(s => s.id === subjectId) || subjects[0];
}

// Helper: Get topics for a subject
export function getSubjectTopics(subjectId) {
  return curriculumData[subjectId] || [];
}

// Helper: Get single topic by ID
export function getTopicById(topicId) {
  return allTopics.find(t => t.id === topicId) || allTopics[0];
}

// Helper: Calculate progress percentage
export function calculateSubjectProgress(subjectId, completedTopicIds = []) {
  const topics = getSubjectTopics(subjectId);
  if (!topics.length) return 0;
  const completedCount = topics.filter(t => completedTopicIds.includes(t.id)).length;
  return Math.round((completedCount / topics.length) * 100);
}
