/**
 * Technical Viva Answer Evaluator — CommitDrive
 * 
 * Provides automated, rule-based evaluations for typed technical viva answers:
 * - Deterministic keyword & concept coverage analysis
 * - Rookie trap detection (identifies common placement misconceptions)
 * - Calibrated scoring against company hiring tracks (Service vs FinTech vs FAANG)
 * - Senior model answer comparison and actionable improvement suggestions
 */

/**
 * Normalizes text for fuzzy token matching
 */
const cleanText = (str = '') => {
  return str.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
};

/**
 * Checks if a target keyword or phrase is present in candidate answer
 */
const matchesKeyword = (candidateText, keyword) => {
  const c = cleanText(candidateText);
  const kw = cleanText(keyword);
  
  if (c.includes(kw)) return true;

  // Split multi-word keyword and check if major words exist close together
  const kwWords = kw.split(' ').filter(w => w.length > 2);
  if (kwWords.length > 1) {
    const matchedCount = kwWords.filter(w => c.includes(w)).length;
    return matchedCount >= Math.ceil(kwWords.length * 0.7);
  }

  return false;
};

/**
 * Main evaluation function
 * 
 * @param {string} candidateAnswer - Transcript or typed answer from student
 * @param {object} question - Question object with modelAnswer, mustMentionKeywords, trapWarning
 * @param {string} trackId - Company track gate ('all' | 'service' | 'fintech' | 'faang')
 * @returns {object} Detailed AI evaluation report
 */
export const evaluateCandidateAnswer = (candidateAnswer, question, trackId = 'all') => {
  if (!candidateAnswer || candidateAnswer.trim().length === 0) {
    return {
      score: 0,
      verdict: 'No Answer Provided',
      verdictClass: 'missed',
      summary: 'No verbal or written answer was detected. Recruiters will mark this as a missed question.',
      coveredKeywords: [],
      missingKeywords: question.mustMentionKeywords || [],
      trapTriggered: false,
      trapFeedback: null,
      seniorModelAnswer: question.modelAnswer?.summary || 'Review the model answer below.',
      deliveryRating: 'Unscored',
      actionableTips: ['Always attempt an answer using the 3-step blueprint: Define ➔ Internal Mechanics ➔ Trade-off.']
    };
  }

  const rawText = candidateAnswer.trim();
  const wordCount = rawText.split(/\s+/).length;
  const keywords = question.mustMentionKeywords || [];

  // 1. Analyze Keyword Coverage
  const coveredKeywords = [];
  const missingKeywords = [];

  keywords.forEach(kw => {
    if (matchesKeyword(rawText, kw)) {
      coveredKeywords.push(kw);
    } else {
      missingKeywords.push(kw);
    }
  });

  const keywordCoveragePct = keywords.length > 0 
    ? (coveredKeywords.length / keywords.length) 
    : 0.5;

  // 2. Trap Warning Audit
  let trapTriggered = false;
  let trapFeedback = null;

  if (question.trapWarning?.rookieMistake) {
    const rookieWords = cleanText(question.trapWarning.rookieMistake)
      .split(' ')
      .filter(w => w.length > 4);
    
    const overlap = rookieWords.filter(w => cleanText(rawText).includes(w)).length;
    if (overlap >= 2 && keywordCoveragePct < 0.6) {
      trapTriggered = true;
      trapFeedback = question.trapWarning.rookieMistake;
    }
  }

  // 3. Length & Depth Analysis
  let lengthFactor = 1.0;
  if (wordCount < 15) {
    lengthFactor = 0.5; // Too brief / superficial definition
  } else if (wordCount >= 25 && wordCount <= 120) {
    lengthFactor = 1.0; // Sweet spot for a 60-second verbal pitch
  } else if (wordCount > 120) {
    lengthFactor = 0.9; // Slightly rambling, needs tighter conciseness
  }

  // 4. Calculate Final Score (0 - 100)
  let rawScore = (keywordCoveragePct * 70) + (lengthFactor * 25);
  if (trapTriggered) rawScore -= 20;
  if (wordCount > 30 && keywordCoveragePct > 0.6) rawScore += 5;

  const score = Math.max(10, Math.min(98, Math.round(rawScore)));

  // 5. Track-Calibrated Recruiter Verdict
  let verdict = '';
  let verdictClass = 'partial'; // 'nailed' | 'partial' | 'missed'

  if (trackId === 'faang' || trackId === 'fintech') {
    // Stricter bar for Tier-1 / FinTech
    if (score >= 82) {
      verdict = 'Strong Hire (L200/L300 Depth Cleared)';
      verdictClass = 'nailed';
    } else if (score >= 58) {
      verdict = 'Lean Hire (Core Mechanics Present, Missing Architectural Edge)';
      verdictClass = 'partial';
    } else {
      verdict = 'No Hire (Too High-Level / Missing Critical Under-the-Hood Detail)';
      verdictClass = 'missed';
    }
  } else {
    // Service / General Placement Track
    if (score >= 70) {
      verdict = 'Selected (Clean Verbal Pitch & Key Terms Present)';
      verdictClass = 'nailed';
    } else if (score >= 45) {
      verdict = 'Borderline (Acceptable Concept, Needs Sharper Technical Terminology)';
      verdictClass = 'partial';
    } else {
      verdict = 'Not Cleared (Lacks Essential Mechanics)';
      verdictClass = 'missed';
    }
  }

  // 6. Actionable Recruiter Tips
  const actionableTips = [];
  if (missingKeywords.length > 0) {
    actionableTips.push(`Integrate "${missingKeywords.slice(0, 2).join('" & "')}" directly into your opening 20 seconds.`);
  }
  if (wordCount < 20) {
    actionableTips.push('Elaborate beyond the surface textbook definition by explaining the internal data structure or OS kernel behavior.');
  }
  if (trapTriggered) {
    actionableTips.push(`Avoid the rookie trap: ${question.trapWarning?.rookieMistake}`);
  }
  if (actionableTips.length === 0) {
    actionableTips.push('Crisp delivery! Confident tone with verified placement terminology.');
  }

  return {
    score,
    verdict,
    verdictClass,
    wordCount,
    coveredKeywords,
    missingKeywords,
    trapTriggered,
    trapFeedback,
    seniorModelAnswer: question.trapWarning?.winningAnswer || question.modelAnswer?.summary || '',
    actionableTips
  };
};
