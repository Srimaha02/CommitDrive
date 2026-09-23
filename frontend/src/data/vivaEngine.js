// Diagnostic Mock Viva Engine — CommitDrive
// Handles question selection, session building, scoring, and verdict generation.
// Powers the VivaModal interview simulator.

import { topicWiseCramData } from './cramSheetsData';
import { filterQuestionsByTrack } from './companyTracksData';

// Subjects available for viva selection
export const VIVA_SUBJECTS = [
  { id: 'os',        label: 'Operating Systems',      shortLabel: 'OS',    iconName: 'Cpu',      color: '#e8604a', bg: 'rgba(232, 96, 74, 0.12)',  border: 'rgba(232, 96, 74, 0.3)' },
  { id: 'dbms',      label: 'Database Management',    shortLabel: 'DBMS',  iconName: 'Database', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.12)', border: 'rgba(59, 130, 246, 0.3)' },
  { id: 'cn',        label: 'Computer Networks',      shortLabel: 'CN',    iconName: 'Network',  color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.12)', border: 'rgba(139, 92, 246, 0.3)' },
  { id: 'practical', label: 'Practical Skills',       shortLabel: 'Labs',  iconName: 'Terminal', color: '#10b981', bg: 'rgba(16, 185, 129, 0.12)', border: 'rgba(16, 185, 129, 0.3)' },
];

// Available question count options
export const VIVA_COUNTS = [5, 10, 15];

// Timer presets (seconds). 0 = untimed
export const VIVA_TIMERS = [
  { value: 0,      label: 'Untimed',  shortLabel: '∞' },
  { value: 5  * 60, label: '5 min',   shortLabel: '5m' },
  { value: 10 * 60, label: '10 min',  shortLabel: '10m' },
  { value: 15 * 60, label: '15 min',  shortLabel: '15m' },
];

// Self-rating options for each question
export const VIVA_RATINGS = [
  { id: 'nailed',  label: 'Nailed It',    emoji: '✅', color: '#4ade80', bg: 'rgba(74, 222, 128, 0.15)',  border: 'rgba(74, 222, 128, 0.4)',  weight: 1.0 },
  { id: 'partial', label: 'Partial',       emoji: '🟡', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)',  border: 'rgba(245, 158, 11, 0.4)',  weight: 0.5 },
  { id: 'missed',  label: 'Missed It',     emoji: '❌', color: '#f87171', bg: 'rgba(248, 113, 113, 0.15)', border: 'rgba(248, 113, 113, 0.4)', weight: 0.0 },
];

/**
 * Build a viva session by selecting questions from the chosen subjects,
 * filtered by company track, then shuffled and trimmed to `count`.
 *
 * @param {string} trackId — Company track id ('all' | 'service' | 'fintech' | 'faang')
 * @param {string[]} selectedSubjectIds — Array of subject ids to pull from
 * @param {number} count — Number of questions for the session
 * @returns {object[]} Array of question objects enriched with subjectId & subjectName
 */
export function buildVivaSession(trackId, selectedSubjectIds, count) {
  let allQuestions = [];

  selectedSubjectIds.forEach(subjectId => {
    const subjectData = topicWiseCramData[subjectId];
    if (!subjectData || !Array.isArray(subjectData.questions)) return;

    const filtered = filterQuestionsByTrack(subjectData.questions, trackId);
    filtered.forEach(q => {
      allQuestions.push({
        ...q,
        subjectId,
        subjectName: subjectData.shortName || subjectData.name || subjectId.toUpperCase(),
        subjectColor: VIVA_SUBJECTS.find(s => s.id === subjectId)?.color || '#38bdf8',
      });
    });
  });

  // Fisher-Yates shuffle
  for (let i = allQuestions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allQuestions[i], allQuestions[j]] = [allQuestions[j], allQuestions[i]];
  }

  return allQuestions.slice(0, Math.min(count, allQuestions.length));
}

/**
 * Build a retry session from only the weak questions (missed / partial)
 * of a previous viva result.
 *
 * @param {object[]} questionResults — From a previous calculateVivaResult call
 * @param {string} trackId
 * @returns {object[]} Shuffled subset of weak questions
 */
export function buildRetrySession(questionResults, trackId) {
  const weak = questionResults.filter(q => q.rating === 'missed' || q.rating === 'partial');
  for (let i = weak.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [weak[i], weak[j]] = [weak[j], weak[i]];
  }
  return weak;
}

/**
 * Calculate viva session results from the user's self-ratings.
 *
 * @param {object[]} questions — Array of question objects from buildVivaSession
 * @param {object} ratings — Map of { [questionId]: 'nailed' | 'partial' | 'missed' }
 * @returns {object} Full result object with score, verdict, weak topics, per-question breakdown
 */
export function calculateVivaResult(questions, ratings) {
  let nailed = 0, partial = 0, missed = 0;

  questions.forEach(q => {
    const r = ratings[q.id] || 'missed';
    if (r === 'nailed') nailed++;
    else if (r === 'partial') partial++;
    else missed++;
  });

  const total = questions.length;
  const rawScore = total > 0 ? (nailed * 1.0 + partial * 0.5) / total : 0;
  const score = Math.round(rawScore * 100);

  let verdict, verdictEmoji, verdictColor, verdictBg, verdictBorder, verdictDesc, verdictTip;

  if (score >= 80) {
    verdict      = 'Hire-Ready';
    verdictEmoji = '🏆';
    verdictColor = '#4ade80';
    verdictBg    = 'rgba(74, 222, 128, 0.10)';
    verdictBorder= 'rgba(74, 222, 128, 0.35)';
    verdictDesc  = 'Strong performance. You demonstrate solid command of the selected topics at this company tier.';
    verdictTip   = 'Keep sharpening the partial/missed questions and do 1 full mock session per day before your interview.';
  } else if (score >= 50) {
    verdict      = 'Borderline';
    verdictEmoji = '⚡';
    verdictColor = '#f59e0b';
    verdictBg    = 'rgba(245, 158, 11, 0.10)';
    verdictBorder= 'rgba(245, 158, 11, 0.35)';
    verdictDesc  = 'Good foundation, but needs polish. Focus on the missed and partial questions before your interview.';
    verdictTip   = 'Do the Retry Weak Questions session until all are "Nailed It". Review the model answer keywords carefully.';
  } else {
    verdict      = 'More Prep Needed';
    verdictEmoji = '📚';
    verdictColor = '#f87171';
    verdictBg    = 'rgba(248, 113, 113, 0.10)';
    verdictBorder= 'rgba(248, 113, 113, 0.35)';
    verdictDesc  = 'These topics need significant reinforcement. Use the Cram Sheet and concept deep-dives to build your answers.';
    verdictTip   = 'Study the Concept deep-dive for each weak topic, then come back for another Viva round.';
  }

  // Unique weak topics (missed or partial)
  const weakTopics = [
    ...new Set(
      questions
        .filter(q => (ratings[q.id] || 'missed') !== 'nailed')
        .map(q => q.topic)
    )
  ];

  // Per-question enriched result rows
  const questionResults = questions.map(q => ({
    ...q,
    rating: ratings[q.id] || 'missed',
  }));

  return {
    score,
    nailed,
    partial,
    missed,
    total,
    verdict,
    verdictEmoji,
    verdictColor,
    verdictBg,
    verdictBorder,
    verdictDesc,
    verdictTip,
    weakTopics,
    questionResults,
  };
}

/**
 * Format seconds into MM:SS string.
 * @param {number} totalSeconds
 * @returns {string}
 */
export function formatVivaTime(totalSeconds) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
}
