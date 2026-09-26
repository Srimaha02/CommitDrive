import React, { useState, useEffect, useMemo } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  Search, 
  Cpu, 
  Database, 
  Network, 
  Terminal, 
  Zap, 
  ArrowLeft,
  ArrowRight,
  Sparkles,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Layers,
  HelpCircle,
  Award,
  BookOpen,
  ExternalLink,
  BookMarked,
  Download,
  Briefcase,
  Building2,
  CheckCircle2
} from 'lucide-react';
import { topicWiseCramData } from '../../data/cramSheetsData';
import { osTopics } from '../../data/osTopics';
import { dbmsTopics } from '../../data/dbmsTopics';
import { cnTopics } from '../../data/cnTopics';
import { 
  COMPANY_TRACKS, 
  getCompanyTrack, 
  filterQuestionsByTrack, 
  getQuestionTrackRubric 
} from '../../data/companyTracksData';
import './CramSheetModal.css';

export default function CramSheetModal({ isOpen, onClose, initialSubject = null, initialTrack = 'all', initialTopic = 'all', currentUser }) {
  // If initialSubject is provided, start directly on that subject; otherwise start on Subject Picker
  const [selectedSubject, setSelectedSubject] = useState(initialSubject);
  const [selectedTrack, setSelectedTrack] = useState(initialTrack || 'all');
  const [levelFilter, setLevelFilter] = useState('all'); // 'all' | 'basic' | 'intermediate' | 'advanced'
  const [activeTopicFilter, setActiveTopicFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedQuestionId, setCopiedQuestionId] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  
  // Track collapsed questions (all questions are OPEN/EXPANDED by default so answers are immediately visible)
  const [collapsedMap, setCollapsedMap] = useState({});

  // Sync initialSubject, initialTrack & initialTopic when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedSubject(initialSubject);
      setSelectedTrack(initialTrack || 'all');
      setLevelFilter('all');

      // Auto-focus on specific topic if provided
      if (initialTopic && initialTopic !== 'all' && initialSubject && topicWiseCramData[initialSubject]) {
        const topicsList = topicWiseCramData[initialSubject].topics || [];
        const cleanInitial = String(initialTopic).toLowerCase().trim();
        const matched = topicsList.find(t => {
          const ct = t.toLowerCase().trim();
          return ct === cleanInitial || cleanInitial.includes(ct) || ct.includes(cleanInitial);
        });
        setActiveTopicFilter(matched || 'all');
      } else {
        setActiveTopicFilter('all');
      }

      setSearchQuery('');
      setCollapsedMap({});
      setIsDownloading(false);
    }
  }, [isOpen, initialSubject, initialTrack, initialTopic]);

  // Filter questions for active subject: combine flagship cram questions with placement interview questions
  // NOTE: Must run unconditionally BEFORE 'if (!isOpen) return null' to strictly adhere to React's Rules of Hooks!
  const allSubjectQuestions = useMemo(() => {
    if (!selectedSubject || !topicWiseCramData[selectedSubject]) return [];
    const flagshipQuestions = topicWiseCramData[selectedSubject].questions || [];
    const topicList = selectedSubject === 'os' ? osTopics : selectedSubject === 'dbms' ? dbmsTopics : selectedSubject === 'cn' ? cnTopics : [];
    const existingTitles = new Set(flagshipQuestions.map(q => q.question.toLowerCase().trim()));
    
    const extraQuestions = [];
    topicList.forEach((topicObj, tIdx) => {
      const cramTopicName = topicWiseCramData[selectedSubject].topics[tIdx] || topicObj.title;
      (topicObj.interviewQuestions || []).forEach((iq, iqIdx) => {
        const titleKey = iq.question.toLowerCase().trim();
        if (existingTitles.has(titleKey)) return;
        
        extraQuestions.push({
          id: `${selectedSubject}-extra-${topicObj.id}-${iqIdx}`,
          topic: cramTopicName,
          level: iqIdx === 0 ? 'basic' : iqIdx === 1 ? 'intermediate' : 'advanced',
          levelLabel: iqIdx === 0 ? 'Basic (Freshers / L100)' : iqIdx === 1 ? 'Intermediate (Core / L200)' : 'Advanced (FAANG / L300)',
          question: iq.question,
          frequency: iq.frequency ? `${iq.frequency} Frequency in Technical Rounds` : 'Frequently tested in SDE-1 interviews',
          companyTags: iq.companyTags || ['Product Companies', 'Tier-1'],
          reference: {
            source: `CommitDrive ${selectedSubject ? selectedSubject.toUpperCase() : ''} Verified Bank`,
            citation: 'Standard Placement Technical Evaluation Rubric',
            linkText: 'Curated Solution'
          },
          tackleStrategy: {
            interviewerIntent: 'Testing foundational conceptual clarity, step-by-step logic, and edge cases under interview pressure.',
            verbalBlueprint: [
              '1. State a concise, direct definition in 15 seconds.',
              '2. Walk through the architectural mechanism or hardware/system execution flow.',
              '3. Discuss a real-world software trade-off or failure scenario.'
            ]
          },
          modelAnswer: {
            summary: iq.answer
          }
        });
      });
    });

    return [...flagshipQuestions, ...extraQuestions];
  }, [selectedSubject]);

  if (!isOpen) return null;

  const currentSubjectData = selectedSubject ? topicWiseCramData[selectedSubject] : null;

  // Shared, robust printable HTML generator (A4 styled, verified badges, models, tables & traps)
  const generatePrintableHtml = (subject, questionsToPrint, trackId = 'all') => {
    const trackObj = getCompanyTrack(trackId);

    const formatCode = (text) => {
      if (!text) return '';
      return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/`([^`]+)`/g, '<code style="background:#f1f5f9;padding:1px 5px;border-radius:3px;font-family:Consolas,monospace;font-size:0.9em;color:#0f172a;border:1px solid #e2e8f0;">$1</code>')
        .replace(/\n/g, '<br/>');
    };

    const questionsHtml = questionsToPrint.map((q, idx) => {
      const qNum = idx + 1 < 10 ? `0${idx + 1}` : `${idx + 1}`;
      
      const levelColors = {
        basic: { bg: '#dcfce7', text: '#15803d', border: '#bbf7d0', borderLeft: '#16a34a' },
        intermediate: { bg: '#ffedd5', text: '#c2410c', border: '#fed7aa', borderLeft: '#ea580c' },
        advanced: { bg: '#f3e8ff', text: '#7e22ce', border: '#e9d5ff', borderLeft: '#9333ea' }
      };
      const lc = levelColors[q.level] || levelColors.basic;

      // Company hiring rubric
      const rubric = getQuestionTrackRubric(q, trackId);
      let rubricHtml = '';
      if (rubric) {
        const rItems = rubric.checklist.map(c => `<li style="margin-bottom:3px;">${formatCode(c)}</li>`).join('');
        rubricHtml = `
          <div style="background:#f8fafc;border:1px solid #cbd5e1;border-left:4px solid ${rubric.color};border-radius:5px;padding:8px 10px;margin-bottom:10px;">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:4px;">
              <span style="font-weight:700;color:#0f172a;font-size:8.5pt;">📋 ${formatCode(rubric.title)}:</span>
              <span style="font-size:7pt;font-weight:700;background:#f1f5f9;color:${rubric.color};padding:1px 6px;border-radius:3px;text-transform:uppercase;">${formatCode(rubric.badge)}</span>
            </div>
            <ul style="margin:2px 0 4px 18px;padding:0;font-size:8.5pt;color:#334155;">${rItems}</ul>
            <div style="font-size:8pt;color:#b45309;margin-top:3px;"><strong>⚠️ Interviewer Watchout:</strong> ${formatCode(rubric.interviewerWatchout)}</div>
          </div>
        `;
      }

      // Model answer table
      let tableHtml = '';
      if (q.modelAnswer?.table) {
        const t = q.modelAnswer.table;
        const ths = t.headers.map(h => `<th style="background:#f1f5f9;border:1px solid #cbd5e1;padding:6px 8px;text-align:left;font-weight:700;color:#0f172a;">${formatCode(h)}</th>`).join('');
        const rows = t.rows.map((row, rIdx) => {
          const tds = row.map(cell => `<td style="border:1px solid #e2e8f0;padding:5px 8px;color:#334155;background:${rIdx % 2 === 1 ? '#f8fafc' : '#ffffff'};">${formatCode(cell)}</td>`).join('');
          return `<tr>${tds}</tr>`;
        }).join('');
        tableHtml = `
          <div style="margin:8px 0;">
            <div style="font-weight:700;font-size:9pt;color:#0f172a;margin-bottom:4px;">📊 ${formatCode(t.title)}:</div>
            <table style="width:100%;border-collapse:collapse;margin:4px 0 8px 0;font-size:8.5pt;">
              <thead><tr>${ths}</tr></thead>
              <tbody>${rows}</tbody>
            </table>
          </div>
        `;
      }

      // Details bullet points
      let detailsHtml = '';
      if (q.modelAnswer?.details?.length) {
        const lis = q.modelAnswer.details.map(d => `<li style="margin-bottom:4px;">${formatCode(d)}</li>`).join('');
        detailsHtml = `<ul style="margin:6px 0;padding-left:18px;font-size:9pt;color:#334155;">${lis}</ul>`;
      }

      // Verbal answering blueprint
      let blueprintHtml = '';
      if (q.tackleStrategy?.verbalBlueprint?.length) {
        const steps = q.tackleStrategy.verbalBlueprint.map(s => `<li style="margin-bottom:3px;">${formatCode(s)}</li>`).join('');
        blueprintHtml = `
          <div style="margin-top:6px;">
            <span style="font-weight:700;font-size:8.5pt;color:#0369a1;display:block;margin-bottom:3px;">Verbal Answering Blueprint (60–90 Seconds):</span>
            <ul style="margin:0;padding-left:18px;font-size:8.5pt;color:#0c4a6e;">${steps}</ul>
          </div>
        `;
      }

      // Company badges
      const companyChips = (q.companyTags || []).map(c => `
        <span style="background:#e0f2fe;color:#0369a1;border:1px solid #bae6fd;padding:1px 6px;border-radius:4px;font-size:7.5pt;font-weight:600;margin-right:4px;">${formatCode(c)}</span>
      `).join('');

      // Reference chip
      const refChip = q.reference ? `
        <span style="background:#faf5ff;color:#7e22ce;border:1px solid #e9d5ff;padding:1px 6px;border-radius:4px;font-size:7.5pt;font-weight:600;margin-right:4px;">
          📚 ${formatCode(q.reference.source)} (${formatCode(q.reference.citation)})
        </span>
      ` : '';

      // Dealbreaker trap warning
      let trapHtml = '';
      if (q.trapWarning) {
        trapHtml = `
          <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:6px;padding:8px 10px;margin-top:10px;">
            <div style="font-weight:700;color:#b91c1c;font-size:8.5pt;margin-bottom:4px;">🚨 Dealbreaker Interview Trap:</div>
            <div style="font-size:8.5pt;color:#991b1b;margin-bottom:3px;"><strong>Common Mistake:</strong> ${formatCode(q.trapWarning.rookieMistake)}</div>
            <div style="font-size:8.5pt;color:#15803d;"><strong>Winning Answer:</strong> ${formatCode(q.trapWarning.winningAnswer)}</div>
          </div>
        `;
      }

      // Must-mention keywords
      let kwHtml = '';
      if (q.mustMentionKeywords?.length) {
        const kws = q.mustMentionKeywords.map(k => `
          <span style="background:#f1f5f9;color:#334155;border:1px solid #cbd5e1;padding:1px 5px;border-radius:3px;font-family:Consolas,monospace;font-size:7.5pt;margin-right:3px;">${formatCode(k)}</span>
        `).join('');
        kwHtml = `
          <div style="margin-top:8px;font-size:8pt;color:#475569;">
            <strong style="color:#0f172a;">Must-Mention Keywords:</strong> ${kws}
          </div>
        `;
      }

      return `
        <div class="faq-card" style="page-break-inside:avoid;break-inside:avoid;border:1px solid #cbd5e1;border-left:5px solid ${lc.borderLeft};border-radius:6px;margin-bottom:16px;background:#ffffff;box-shadow:none;">
          <!-- Card Header -->
          <div style="background:#f8fafc;padding:10px 14px;border-bottom:1px solid #e2e8f0;">
            <div style="display:flex;flex-wrap:wrap;align-items:center;gap:6px;margin-bottom:6px;">
              <span style="background:#0f172a;color:#ffffff;font-weight:700;font-size:8pt;padding:2px 6px;border-radius:3px;">Q${qNum}</span>
              <span style="background:${lc.bg};color:${lc.text};border:1px solid ${lc.border};font-size:8pt;font-weight:700;padding:2px 6px;border-radius:3px;">${formatCode(q.levelLabel)}</span>
              <span style="background:#f1f5f9;color:#334155;border:1px solid #cbd5e1;font-size:8pt;padding:2px 6px;border-radius:3px;font-weight:600;">${formatCode(q.topic)}</span>
              ${companyChips}
              ${refChip}
            </div>
            <h3 style="font-size:11.5pt;font-weight:700;color:#0f172a;margin:4px 0 2px 0;line-height:1.4;">${formatCode(q.question)}</h3>
            ${q.frequency ? `<div style="font-size:8pt;color:#d97706;font-weight:600;margin-top:2px;">⚡ Frequency: ${formatCode(q.frequency)}</div>` : ''}
          </div>

          <!-- Card Body -->
          <div style="padding:12px 14px;">
            <!-- Target Company Rubric -->
            ${rubricHtml}

            <!-- Tackle Blueprint -->
            ${q.tackleStrategy ? `
              <div style="background:#f0f9ff;border:1px solid #bae6fd;border-radius:5px;padding:8px 10px;margin-bottom:10px;">
                <div style="font-weight:700;color:#0284c7;font-size:8.5pt;margin-bottom:3px;">🎯 How to Answer in Interview:</div>
                <div style="font-size:8.5pt;color:#0369a1;margin-bottom:4px;"><strong>Interviewer Intent:</strong> ${formatCode(q.tackleStrategy.interviewerIntent)}</div>
                ${blueprintHtml}
              </div>
            ` : ''}

            <!-- Model Answer -->
            <div style="margin-bottom:8px;">
              <div style="font-weight:700;color:#0f172a;font-size:9.5pt;margin-bottom:4px;">💡 Verified Technical Solution:</div>
              <p style="font-size:9pt;color:#334155;margin:0 0 6px 0;line-height:1.5;">${formatCode(q.modelAnswer?.summary)}</p>
              ${tableHtml}
              ${detailsHtml}
            </div>

            <!-- Trap Box -->
            ${trapHtml}

            <!-- Keywords -->
            ${kwHtml}
          </div>
        </div>
      `;
    }).join('');

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${formatCode(subject.name)} - ${formatCode(trackObj.shortLabel)} - CommitDrive</title>
        <style>
          @page {
            size: A4 portrait;
            margin: 12mm 14mm 12mm 14mm;
          }
          * {
            box-sizing: border-box;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            margin: 0;
            padding: 20px;
            color: #111827;
            background: #ffffff;
            font-size: 10pt;
            line-height: 1.5;
            max-width: 900px;
            margin: 0 auto;
          }
          .doc-header {
            border-bottom: 2px solid #0f172a;
            padding-bottom: 12px;
            margin-bottom: 18px;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
          }
          .doc-header-left h1 {
            font-size: 17pt;
            font-weight: 800;
            color: #0f172a;
            margin: 0 0 4px 0;
            line-height: 1.2;
          }
          .doc-header-left p {
            font-size: 8.5pt;
            color: #475569;
            margin: 2px 0;
          }
          .doc-header-right {
            text-align: right;
            font-size: 7.5pt;
            color: #64748b;
          }
          .doc-brand {
            font-size: 11pt;
            font-weight: 800;
            color: #ea580c;
            margin-bottom: 2px;
          }
          @media print {
            body {
              padding: 0;
              max-width: none;
            }
            .faq-card {
              page-break-inside: avoid !important;
              break-inside: avoid !important;
            }
            .no-print {
              display: none !important;
            }
          }
        </style>
      </head>
      <body>
        <div style="margin-bottom:16px;padding:12px 18px;background:${trackObj.id === 'all' ? '#f0fdf4' : trackObj.bg};border:1px solid ${trackObj.id === 'all' ? '#bbf7d0' : trackObj.border};border-radius:8px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;">
          <div>
            <strong style="color:#0f172a;font-size:11pt;display:block;">⚡ ${formatCode(subject.name)} — ${formatCode(trackObj.label)} Offline Guide</strong>
            <span style="font-size:8.5pt;color:#475569;">Targeting: ${formatCode(trackObj.companies.join(', '))} • Strategy: ${formatCode(trackObj.keyExpectation)}</span>
          </div>
          <span style="font-size:8pt;font-weight:700;color:#0f172a;background:#ffffff;padding:4px 10px;border-radius:4px;border:1px solid #cbd5e1;">${formatCode(trackObj.badge)}</span>
        </div>

        <div class="doc-header">
          <div class="doc-header-left">
            <h1>${formatCode(subject.name)} — ${formatCode(trackObj.shortLabel)} Solutions</h1>
            <p><strong>Curriculum:</strong> ${formatCode(subject.tagline)}</p>
            <p><strong>Target Companies:</strong> ${formatCode(trackObj.companies.join(', '))}</p>
            <p><strong>Scope:</strong> ${questionsToPrint.length} Questions with Hiring Rubrics, Verbal Blueprints & Dealbreaker Traps</p>
          </div>
          <div class="doc-header-right">
            <div class="doc-brand">Commit<strong>Drive</strong></div>
            <div>Company Hiring Suite</div>
            <div>Generated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</div>
          </div>
        </div>

        <div class="cards-list">
          ${questionsHtml}
        </div>
      </body>
      </html>
    `;
  };

  // Direct offline HTML study guide download (Zero reliance on print spooler, 100% reliable instant file)
  const handleDownloadOffline = () => {
    if (!currentSubjectData) return;
    setIsDownloading(true);
    const questionsToPrint = displayedQuestions.length > 0 ? displayedQuestions : currentSubjectData.questions;
    const fullDoc = generatePrintableHtml(currentSubjectData, questionsToPrint, selectedTrack);

    try {
      const blob = new Blob([fullDoc], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const safeName = currentSubjectData.name.replace(/[^a-zA-Z0-9_-]/g, '_');
      const trackPrefix = selectedTrack !== 'all' ? `_${selectedTrack.toUpperCase()}` : '';
      a.download = `CommitDrive_${safeName}${trackPrefix}_Interview_Guide.html`;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        try { a.remove(); } catch (_) {}
        URL.revokeObjectURL(url);
        setIsDownloading(false);
      }, 1000);
    } catch (e) {
      console.error('Download offline error:', e);
      setIsDownloading(false);
    }
  };

  const toggleCard = (qId) => {
    setCollapsedMap(prev => ({
      ...prev,
      [qId]: !prev[qId]
    }));
  };

  const isCardOpen = (qId) => {
    return !collapsedMap[qId]; // Open by default
  };

  const expandAll = () => {
    setCollapsedMap({});
  };

  const collapseAll = () => {
    const newMap = {};
    currentSubjectData?.questions?.forEach(q => {
      newMap[q.id] = true;
    });
    setCollapsedMap(newMap);
  };

  const allCollapsed = currentSubjectData?.questions?.every(q => collapsedMap[q.id]);

  const handleCopyQuestion = (q) => {
    let text = `Q: ${q.question} [${q.levelLabel}]\n\n`;
    
    if (q.reference) {
      text += `📚 Official Reference: ${q.reference.source} — ${q.reference.citation}\n\n`;
    }

    text += `🎯 How to Tackle It:\n`;
    text += `Interviewer Intent: ${q.tackleStrategy?.interviewerIntent || ''}\n`;
    q.tackleStrategy?.verbalBlueprint?.forEach(b => {
      text += `  • ${b}\n`;
    });
    text += `\n💡 Verified Model Answer:\n${q.modelAnswer?.summary || ''}\n\n`;
    
    if (q.modelAnswer?.table) {
      text += `${q.modelAnswer.table.title}:\n`;
      text += q.modelAnswer.table.headers.join(' | ') + '\n';
      q.modelAnswer.table.rows.forEach(r => {
        text += r.join(' | ') + '\n';
      });
      text += '\n';
    }
    
    if (q.modelAnswer?.details?.length) {
      q.modelAnswer.details.forEach(d => {
        text += `• ${d}\n`;
      });
      text += '\n';
    }
    
    if (q.trapWarning) {
      text += `🚨 Dealbreaker Trap:\n`;
      text += `Common Mistake: ${q.trapWarning.rookieMistake}\n`;
      text += `Winning Answer: ${q.trapWarning.winningAnswer}\n\n`;
    }
    
    if (q.mustMentionKeywords?.length) {
      text += `Must-Mention Keywords: ${q.mustMentionKeywords.join(', ')}\n`;
    }

    navigator.clipboard.writeText(text);
    setCopiedQuestionId(q.id);
    setTimeout(() => setCopiedQuestionId(null), 2000);
  };

  const getSubjectIcon = (iconName, size = 20) => {
    if (iconName === 'Cpu') return <Cpu size={size} />;
    if (iconName === 'Database') return <Database size={size} />;
    if (iconName === 'Network') return <Network size={size} />;
    return <Terminal size={size} />;
  };

  // 1. Filter by Company Track first
  const trackFilteredQuestions = filterQuestionsByTrack(allSubjectQuestions, selectedTrack);

  const displayedQuestions = trackFilteredQuestions.filter(q => {
    // Level filter
    if (levelFilter !== 'all' && q.level !== levelFilter) return false;
    // Topic filter
    if (activeTopicFilter !== 'all' && q.topic !== activeTopicFilter) return false;
    // Search query
    if (!searchQuery.trim()) return true;
    const term = searchQuery.toLowerCase();
    const qMatch = q.question.toLowerCase().includes(term);
    const topicMatch = q.topic.toLowerCase().includes(term);
    const companyMatch = q.companyTags?.some(c => c.toLowerCase().includes(term));
    const keywordMatch = q.mustMentionKeywords?.some(k => k.toLowerCase().includes(term));
    const summaryMatch = q.modelAnswer?.summary?.toLowerCase().includes(term);
    const trapMatch = q.trapWarning?.rookieMistake?.toLowerCase().includes(term) || q.trapWarning?.winningAnswer?.toLowerCase().includes(term);
    const refMatch = q.reference?.source?.toLowerCase().includes(term) || q.reference?.citation?.toLowerCase().includes(term);
    return qMatch || topicMatch || companyMatch || keywordMatch || summaryMatch || trapMatch || refMatch;
  });

  // Calculate difficulty counts for the current subject (calibrated to active track)
  const basicCount = trackFilteredQuestions.filter(q => q.level === 'basic').length;
  const intermediateCount = trackFilteredQuestions.filter(q => q.level === 'intermediate').length;
  const advancedCount = trackFilteredQuestions.filter(q => q.level === 'advanced').length;
  const activeTrackObj = getCompanyTrack(selectedTrack);

  // Guard: Must be open AND user must be authenticated
  if (!isOpen || !currentUser) return null;

  return (
    <div className="cram-modal-overlay animate-fadeIn" onClick={onClose} role="dialog" aria-modal="true">
      <div className="cram-modal-container theme-override-dark" onClick={e => e.stopPropagation()}>
        
        {/* ===================================================================
            VIEW 1: Subject Picker Screen ("Sub ethu nu kekanum")
            =================================================================== */}
        {!selectedSubject ? (
          <div className="cram-picker-view">
            {/* Header */}
            <div className="cram-picker-header">
              <div className="cram-picker-badge">
                <Zap size={15} />
                <span>Verified Interview Question Bank & Solutions</span>
              </div>
              <h2 className="cram-picker-title">Which subject do you want to revise?</h2>
              <p className="cram-picker-sub">
                Select a subject below to view verified <strong>Questions, Official References, Step-by-Step Answers & Interview Traps</strong> (sourced from GFG Top 50, Glassdoor, and Tier-1 recruitment drives).
              </p>
              <button 
                type="button" 
                className="cram-modal-close-corner" 
                onClick={onClose}
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            {/* Target Company Gate Track Selector Bar */}
            <div className="cram-track-selector-bar">
              <div className="track-bar-label">
                <Briefcase size={14} />
                <span>Target Company Gate:</span>
              </div>
              <div className="track-pills-container">
                {COMPANY_TRACKS.map(track => (
                  <button
                    key={track.id}
                    type="button"
                    className={`cram-track-pill ${selectedTrack === track.id ? 'active' : ''}`}
                    style={{
                      borderColor: selectedTrack === track.id ? track.color : undefined,
                      backgroundColor: selectedTrack === track.id ? track.bg : undefined
                    }}
                    onClick={() => setSelectedTrack(track.id)}
                  >
                    <span className="track-pill-name">{track.shortLabel}</span>
                    <span className="track-pill-badge" style={{ color: track.color }}>{track.badge}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* If a company track is active, show the track focus banner */}
            {selectedTrack !== 'all' && (
              <div className="cram-track-focus-banner" style={{ borderLeftColor: activeTrackObj.color, background: activeTrackObj.bg }}>
                <div className="track-focus-top">
                  <span className="track-focus-badge" style={{ background: activeTrackObj.color }}>{activeTrackObj.badge}</span>
                  <span className="track-focus-companies">Targeting: {activeTrackObj.companies.join(', ')}</span>
                </div>
                <div className="track-focus-desc">{activeTrackObj.tagline}</div>
                <div className="track-focus-expectation">
                  <strong>Winning Strategy:</strong> {activeTrackObj.keyExpectation}
                </div>
              </div>
            )}

            {/* 4 Subject Selection Cards Grid */}
            <div className="cram-subjects-grid">
              {Object.values(topicWiseCramData).map(subj => {
                const trackSubjQuestions = filterQuestionsByTrack(subj.questions, selectedTrack);
                const bCount = trackSubjQuestions.filter(q => q.level === 'basic').length;
                const iCount = trackSubjQuestions.filter(q => q.level === 'intermediate').length;
                const aCount = trackSubjQuestions.filter(q => q.level === 'advanced').length;

                return (
                  <div 
                    key={subj.id}
                    className="cram-subject-choice-card"
                    onClick={() => {
                      setSelectedSubject(subj.id);
                      setLevelFilter('all');
                      setActiveTopicFilter('all');
                      setSearchQuery('');
                      setCollapsedMap({});
                    }}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="choice-card-top">
                      <div className="choice-icon-box" style={{ background: subj.accentColor }}>
                        {getSubjectIcon(subj.iconName, 24)}
                      </div>
                      <span className="choice-topic-count">{trackSubjQuestions.length} Solutions ({activeTrackObj.shortLabel})</span>
                    </div>

                    <h3 className="choice-subject-name">{subj.name}</h3>
                    <p className="choice-subject-tagline">{subj.tagline}</p>

                    {/* Level Breakdown Chips */}
                    <div className="choice-level-breakdown">
                      <span className="level-chip chip-basic">🟢 {bCount} Basic (L100)</span>
                      <span className="level-chip chip-intermediate">🟡 {iCount} Core (L200)</span>
                      <span className="level-chip chip-advanced">🔴 {aCount} FAANG (L300)</span>
                    </div>

                    {/* Topic preview pills */}
                    <div className="choice-topics-preview-pills">
                      {subj.topics.slice(0, 3).map((t, idx) => (
                        <span key={idx} className="preview-pill">
                          {t}
                        </span>
                      ))}
                      {subj.topics.length > 3 && (
                        <span className="preview-pill more-pill">+{subj.topics.length - 3} more areas</span>
                      )}
                    </div>

                    <div className="choice-card-footer">
                      <span>Open Verified Questions & Answers →</span>
                      <ArrowRight size={15} className="choice-arrow" />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="cram-picker-footer">
              <span>💡 Zero hallucination: Real interview questions with model answers and verified official references.</span>
              <button type="button" className="cram-dismiss-btn" onClick={onClose}>
                Close
              </button>
            </div>
          </div>
        ) : (

          /* ===================================================================
              VIEW 2: Subject FAQs, Answering Guide & References View
              =================================================================== */
          <div className="cram-topics-view">
            
            {/* Top Navigation Bar */}
            <header className="cram-top-navbar">
              <div className="navbar-left-group">
                <button 
                  type="button" 
                  className="cram-back-btn" 
                  onClick={() => setSelectedSubject(null)}
                  title="Choose another subject"
                >
                  <ArrowLeft size={15} />
                  <span>← All Subjects</span>
                </button>

                <div className="active-subject-header-badge">
                  <div className="subject-mini-icon" style={{ background: currentSubjectData.accentColor }}>
                    {getSubjectIcon(currentSubjectData.iconName, 16)}
                  </div>
                  <h3 className="active-subject-title">{currentSubjectData.name}</h3>
                  <span className="active-sheet-label">Verified Interview Guide & Answers</span>
                </div>
              </div>

              <div className="navbar-right-group">
                <button 
                  type="button"
                  className="cram-toggle-all-btn"
                  onClick={allCollapsed ? expandAll : collapseAll}
                  title="Expand or Collapse All Answers"
                >
                  <span>{allCollapsed ? 'Expand All Answers' : 'Collapse All'}</span>
                </button>

                <button 
                  type="button" 
                  className="cram-download-offline-btn" 
                  onClick={handleDownloadOffline}
                  disabled={isDownloading}
                  title="Download Offline HTML Study Guide (Works 100% offline without internet)"
                >
                  <Download size={15} />
                  <span>{isDownloading ? 'Downloading Guide...' : 'Download Offline Guide'}</span>
                </button>

                <button 
                  type="button" 
                  className="cram-modal-close-corner" 
                  onClick={onClose}
                  aria-label="Close"
                >
                  <X size={20} />
                </button>
              </div>
            </header>

            {/* Filter & Controls Bar (Sleek & Compact to Maximize Content Reading Area) */}
            <div className="cram-filter-bar">
              
              {/* Target Company Track Selector Bar inside View 2 (Compact) */}
              <div className="cram-track-selector-bar">
                <div className="track-bar-label">
                  <Briefcase size={13} />
                  <span>Target Company Gate:</span>
                </div>
                <div className="track-pills-container">
                  {COMPANY_TRACKS.map(track => (
                    <button
                      key={track.id}
                      type="button"
                      className={`cram-track-pill ${selectedTrack === track.id ? 'active' : ''}`}
                      style={{
                        borderColor: selectedTrack === track.id ? track.color : undefined,
                        backgroundColor: selectedTrack === track.id ? track.bg : undefined
                      }}
                      onClick={() => {
                        setSelectedTrack(track.id);
                        setLevelFilter('all');
                      }}
                    >
                      <span className="track-pill-name">{track.shortLabel}</span>
                      <span className="track-pill-badge" style={{ color: track.color }}>{track.badge}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Company Track Focus Banner if active (Compact) */}
              {selectedTrack !== 'all' && (
                <div className="cram-track-focus-banner" style={{ borderLeftColor: activeTrackObj.color, background: activeTrackObj.bg }}>
                  <span className="track-focus-badge" style={{ background: activeTrackObj.color }}>{activeTrackObj.badge}</span>
                  <span className="track-focus-companies">Targeting: {activeTrackObj.companies.join(', ')}</span>
                  <span className="track-focus-divider">•</span>
                  <span className="track-focus-expectation">
                    <strong>Strategy:</strong> {activeTrackObj.keyExpectation}
                  </span>
                </div>
              )}

              {/* Search Box & Level Filter Tabs (Combined in single row to save vertical space!) */}
              <div className="cram-search-and-levels-row">
                <div className="cram-search-wrapper">
                  <Search size={14} className="cram-search-icon" />
                  <input 
                    type="text" 
                    placeholder={`Search ${currentSubjectData.name} questions, answers, companies (Amazon, TCS), references...`}
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="cram-topic-search-input"
                  />
                  {searchQuery && (
                    <button type="button" className="cram-search-clear-btn" onClick={() => setSearchQuery('')}>
                      <X size={13} />
                    </button>
                  )}
                </div>

                <div className="cram-level-tabs-row">
                  <button
                    type="button"
                    className={`level-tab-btn ${levelFilter === 'all' ? 'active' : ''}`}
                    onClick={() => setLevelFilter('all')}
                  >
                    <span>All ({trackFilteredQuestions.length})</span>
                  </button>
                  <button
                    type="button"
                    className={`level-tab-btn tab-basic ${levelFilter === 'basic' ? 'active' : ''}`}
                    onClick={() => setLevelFilter('basic')}
                  >
                    <span>🟢 Basic ({basicCount})</span>
                  </button>
                  <button
                    type="button"
                    className={`level-tab-btn tab-intermediate ${levelFilter === 'intermediate' ? 'active' : ''}`}
                    onClick={() => setLevelFilter('intermediate')}
                  >
                    <span>🟡 Core ({intermediateCount})</span>
                  </button>
                  <button
                    type="button"
                    className={`level-tab-btn tab-advanced ${levelFilter === 'advanced' ? 'active' : ''}`}
                    onClick={() => setLevelFilter('advanced')}
                  >
                    <span>🔴 FAANG ({advancedCount})</span>
                  </button>
                </div>
              </div>

              {/* Topic Sub-filter Pills (Horizontal scrolling row) */}
              <div className="cram-topic-pills-row no-scrollbar">
                <button
                  type="button"
                  className={`cram-topic-pill-btn ${activeTopicFilter === 'all' ? 'active' : ''}`}
                  onClick={() => setActiveTopicFilter('all')}
                >
                  <span>All Topics ({allSubjectQuestions.length})</span>
                </button>
                {currentSubjectData.topics.map((t, idx) => {
                  const topicQuestionsCount = trackFilteredQuestions.filter(q => q.topic === t).length;
                  return (
                    <button
                      key={idx}
                      type="button"
                      className={`cram-topic-pill-btn ${activeTopicFilter === t ? 'active' : ''}`}
                      onClick={() => setActiveTopicFilter(t)}
                      title={t}
                    >
                      <span>{t}</span>
                      {topicQuestionsCount > 0 && (
                        <span className="topic-pill-count">({topicQuestionsCount})</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Questions List Body (Takes majority of modal height!) */}
            <div className="cram-cards-body print-area">
              {/* Active Topic Banner when a specific topic is selected */}
              {activeTopicFilter !== 'all' && (
                <div className="cram-active-topic-banner animate-fadeIn">
                  <div className="active-topic-banner-left">
                    <Zap size={15} className="active-topic-bolt" />
                    <span>Topic Cram Sheet: <strong>{activeTopicFilter}</strong></span>
                    <span className="active-topic-badge">{displayedQuestions.length} Placement Questions</span>
                  </div>
                  <button 
                    type="button" 
                    className="topic-banner-reset-btn"
                    onClick={() => setActiveTopicFilter('all')}
                  >
                    ← View All Topics in {currentSubjectData.name}
                  </button>
                </div>
              )}

              <div className="cram-printable-top">
                <h1>{currentSubjectData.name} — Verified Interview Questions, Answers & Tackling Guide</h1>
                <p>{currentSubjectData.tagline} • Sourced from GFG Top 50, Glassdoor & Striver SDE Sheet • CommitDrive</p>
              </div>

              {displayedQuestions.length === 0 ? (
                <div className="cram-no-results">
                  <HelpCircle size={32} className="no-res-icon" />
                  <p>No interview questions match your current search and filters.</p>
                  <button 
                    type="button" 
                    className="cram-reset-filter-btn"
                    onClick={() => { setSearchQuery(''); setLevelFilter('all'); setActiveTopicFilter('all'); }}
                  >
                    Reset Filters & Show All
                  </button>
                </div>
              ) : (
                displayedQuestions.map((q, qIndex) => {
                  const isOpen = isCardOpen(q.id);

                  return (
                    <div key={q.id} className={`faq-cram-card level-border-${q.level}`}>
                      
                      {/* Question Card Header */}
                      <div 
                        className="faq-card-header"
                        onClick={() => toggleCard(q.id)}
                        role="button"
                        tabIndex={0}
                      >
                        {/* Meta row 1: Index, Level, Topic, Companies, Reference & Actions */}
                        <div className="faq-header-top-meta">
                          <div className="faq-badges-left">
                            <span className="faq-index-tag">Q{qIndex + 1 < 10 ? `0${qIndex + 1}` : qIndex + 1}</span>
                            <span className={`faq-level-badge level-${q.level}`}>
                              {q.levelLabel}
                            </span>
                            <span className="faq-topic-tag">{q.topic}</span>
                          </div>

                          <div className="faq-badges-right">
                            {q.companyTags?.slice(0, 3).map((comp, cIdx) => (
                              <span key={cIdx} className="faq-company-chip">{comp}</span>
                            ))}
                            
                            {q.reference && (
                              <span className="faq-reference-chip" title={q.reference.citation || ''}>
                                <BookMarked size={11} />
                                <span>{(q.reference.source || 'Verified Source').split('&')[0].trim()}</span>
                              </span>
                            )}

                            <button
                              type="button"
                              className="faq-copy-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopyQuestion(q);
                              }}
                              title="Copy Question, Reference & Complete Answer"
                            >
                              {copiedQuestionId === q.id ? (
                                <>
                                  <Check size={13} className="text-success" />
                                  <span>Copied!</span>
                                </>
                              ) : (
                                <>
                                  <Copy size={13} />
                                  <span>Copy</span>
                                </>
                              )}
                            </button>
                            
                            <span className="faq-expand-chevron" title={isOpen ? "Collapse details" : "Expand answer"}>
                              {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                            </span>
                          </div>
                        </div>

                        {/* Question Title (Full Width, Crisp Typography, Zero Clipping) */}
                        <h4 className="faq-question-title">{q.question}</h4>
                        
                        {/* Frequency note & quick guide teaser */}
                        <div className="faq-header-bottom-row">
                          {q.frequency && (
                            <div className="faq-frequency-note">
                              <Sparkles size={12} className="freq-icon" />
                              <span>{q.frequency}</span>
                            </div>
                          )}
                          <span className="faq-toggle-hint">
                            {isOpen ? 'Click to collapse' : 'Click to read full solution & tackling guide →'}
                          </span>
                        </div>
                      </div>

                      {/* Expandable / Open Answer Body */}
                      {isOpen && (
                        <div className="faq-card-expanded-body animate-fadeIn">
                          
                          {/* 0. TARGET COMPANY HIRING RUBRIC CHECKLIST */}
                          {(() => {
                            const rubric = getQuestionTrackRubric(q, selectedTrack);
                            if (!rubric) return null;
                            return (
                              <div className="faq-rubric-card" style={{ borderLeftColor: rubric.color }}>
                                <div className="faq-rubric-header">
                                  <div className="rubric-header-left">
                                    <Award size={15} style={{ color: rubric.color }} />
                                    <span className="rubric-title">{rubric.title}</span>
                                    <span className="rubric-badge" style={{ background: `${rubric.color}22`, color: rubric.color }}>{rubric.badge}</span>
                                  </div>
                                </div>
                                <ul className="rubric-checklist">
                                  {rubric.checklist.map((item, cIdx) => (
                                    <li key={cIdx} className="rubric-item">
                                      <CheckCircle2 size={13} style={{ color: rubric.color, marginTop: '2px', flexShrink: 0 }} />
                                      <span>{item}</span>
                                    </li>
                                  ))}
                                </ul>
                                <div className="rubric-watchout">
                                  <strong>⚠️ Interviewer Watchout:</strong> {rubric.interviewerWatchout}
                                </div>
                              </div>
                            );
                          })()}

                          {/* 1. HOW TO ANSWER IN INTERVIEW (Step-by-Step Blueprint) */}
                          {q.tackleStrategy && (
                            <div className="faq-tackle-strategy-box">
                              <div className="tackle-header">
                                <Award size={16} className="tackle-icon" />
                                <strong>🎯 How to Answer It in the Interview:</strong>
                              </div>
                              <p className="tackle-intent">
                                <strong>What Interviewer Looks For:</strong> {q.tackleStrategy.interviewerIntent}
                              </p>
                              <div className="tackle-steps-list">
                                <span className="tackle-steps-label">Verbal Answering Blueprint (60–90 Seconds):</span>
                                <ul>
                                  {q.tackleStrategy.verbalBlueprint?.map((step, sIdx) => (
                                    <li key={sIdx}>{step}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          )}

                          {/* 2. VERIFIED MODEL TECHNICAL ANSWER */}
                          {q.modelAnswer && (
                            <div className="faq-model-answer-box">
                              <div className="answer-header">
                                <BookOpen size={16} className="answer-icon" />
                                <strong>💡 Verified Technical Answer & Explanation:</strong>
                              </div>
                              <p className="answer-summary">{q.modelAnswer.summary}</p>

                              {/* Matrix / Table if present */}
                              {q.modelAnswer.table && (
                                <div className="answer-table-wrapper">
                                  <span className="table-caption">📋 {q.modelAnswer.table.title}</span>
                                  <div className="table-scroll">
                                    <table className="cram-data-table">
                                      <thead>
                                        <tr>
                                          {q.modelAnswer.table.headers.map((h, hIdx) => (
                                            <th key={hIdx}>{h}</th>
                                          ))}
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {q.modelAnswer.table.rows.map((row, rIdx) => (
                                          <tr key={rIdx}>
                                            {row.map((cell, cIdx) => (
                                              <td key={cIdx} className={cIdx === 0 ? 'highlight-col' : ''}>
                                                {cell}
                                              </td>
                                            ))}
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              )}

                              {/* Technical Details Bullets */}
                              {q.modelAnswer.details?.length > 0 && (
                                <div className="answer-bullets-wrap">
                                  <span className="answer-bullets-label">Key Architectural Points:</span>
                                  <ul className="answer-details-bullets">
                                    {q.modelAnswer.details.map((item, dIdx) => (
                                      <li key={dIdx}>{item}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          )}

                          {/* 3. DEALBREAKER TRAP WARNING */}
                          {q.trapWarning && (
                            <div className="faq-trap-alert-box">
                              <div className="trap-alert-header">
                                <AlertCircle size={16} className="trap-alert-icon" />
                                <strong>🚨 Dealbreaker Trap & Common Rookie Mistake:</strong>
                              </div>
                              <div className="trap-comparison-grid">
                                <div className="trap-mistake-side">
                                  <span className="mistake-label">❌ Common Rookie Mistake (Red Flag):</span>
                                  <p>{q.trapWarning.rookieMistake}</p>
                                </div>
                                <div className="trap-winning-side">
                                  <span className="winning-label">✅ Winning Counter-Distinction:</span>
                                  <p>{q.trapWarning.winningAnswer}</p>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* 4. MUST-MENTION KEYWORDS */}
                          {q.mustMentionKeywords?.length > 0 && (
                            <div className="faq-keywords-row">
                              <span className="kw-title">🏷️ Must-Mention Keywords:</span>
                              <div className="kw-chips">
                                {q.mustMentionKeywords.map((kw, kwIdx) => (
                                  <span key={kwIdx} className="cram-kw-chip">
                                    <Check size={11} className="kw-check" />
                                    <span>{kw}</span>
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* 5. OFFICIAL REFERENCE & CITATION */}
                          {q.reference && (
                            <div className="faq-official-reference-box">
                              <div className="reference-header">
                                <BookMarked size={14} className="ref-icon" />
                                <span className="ref-title">Verified Official Reference:</span>
                              </div>
                              <div className="reference-content">
                                <strong className="ref-source-name">{q.reference.source}</strong>
                                <span className="ref-citation-desc">— {q.reference.citation}</span>
                              </div>
                            </div>
                          )}

                        </div>
                      )}

                    </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <footer className="cram-sheet-footer">
              <div className="footer-left-info">
                <span>Showing <strong>{displayedQuestions.length}</strong> of {trackFilteredQuestions.length} verified {currentSubjectData.name} FAQs ({activeTrackObj.shortLabel})</span>
              </div>
              <div className="footer-right-buttons">
                <button type="button" className="footer-switch-btn" onClick={() => setSelectedSubject(null)}>
                  Switch Subject
                </button>
                <button type="button" className="footer-close-btn" onClick={onClose}>
                  Done Revising
                </button>
              </div>
            </footer>

          </div>
        )}

      </div>
    </div>
  );
}
