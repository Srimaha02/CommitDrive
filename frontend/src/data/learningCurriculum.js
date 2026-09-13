// Master Learning Curriculum Entry Point — CommitDrive
// Aggregates all 30 foundational topics across Operating Systems, DBMS, and Computer Networks.
// Review Candidate: Draft v1.0 — Ready for editorial review against standard references

import { osTopics } from './osTopics.js';
import { dbmsTopics } from './dbmsTopics.js';
import { cnTopics } from './cnTopics.js';

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

// Master topics lookup map
export const allTopics = [...osTopics, ...dbmsTopics, ...cnTopics];

export const curriculumData = {
  os: osTopics,
  dbms: dbmsTopics,
  cn: cnTopics
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
