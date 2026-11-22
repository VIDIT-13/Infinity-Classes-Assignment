import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  Trophy,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock,
  RotateCcw,
  History,
  Home,
  Check,
  X,
  Code,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import { useTest } from '../context/TestContext';

export const ResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { startNewTest } = useTest();

  const result = location.state?.result;
  const [filter, setFilter] = useState('all'); // 'all' | 'correct' | 'incorrect'

  // Confetti effect on high score
  useEffect(() => {
    if (result && result.percentage >= 70) {
      const duration = 2.5 * 1000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#8b5cf6', '#10b981', '#3b82f6', '#f59e0b'],
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#8b5cf6', '#10b981', '#3b82f6', '#f59e0b'],
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    }
  }, [result]);

  if (!result) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4 text-center px-4">
        <HelpCircle className="w-12 h-12 text-slate-500" />
        <h2 className="text-xl font-bold text-white">No Result Data Found</h2>
        <p className="text-sm text-slate-400 max-w-sm">
          Please complete a test session to view your score breakdown.
        </p>
        <Link
          to="/"
          className="px-5 py-2.5 rounded-xl bg-brand-600 text-white font-semibold text-sm hover:bg-brand-500 transition-colors"
        >
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const {
    score = 0,
    totalQuestions = 10,
    percentage = 0,
    timeSpentSeconds = 0,
    answers = [],
  } = result;

  const correctCount = answers.filter((a) => a.isCorrect).length;
  const unansweredCount = answers.filter((a) => a.selectedOptionIndex === -1).length;
  const incorrectCount = totalQuestions - correctCount - unansweredCount;

  const minutesSpent = Math.floor(timeSpentSeconds / 60);
  const secondsSpent = timeSpentSeconds % 60;
  const timeFormatted = `${minutesSpent}m ${secondsSpent}s`;

  // Filtered list
  const filteredAnswers = answers.filter((a) => {
    if (filter === 'correct') return a.isCorrect;
    if (filter === 'incorrect') return !a.isCorrect;
    return true;
  });

  const handleRetakeTest = async () => {
    const success = await startNewTest();
    if (success) {
      navigate('/test');
    }
  };

  const optionLabels = ['A', 'B', 'C', 'D'];

  // Performance badge details
  let badgeTitle = 'Needs Practice';
  let badgeColor = 'text-amber-400 bg-amber-500/10 border-amber-500/30';
  let badgeIcon = '💡';

  if (percentage >= 90) {
    badgeTitle = 'Perfectionist Mastery';
    badgeColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    badgeIcon = '🏆';
  } else if (percentage >= 70) {
    badgeTitle = 'Proficient Scholar';
    badgeColor = 'text-brand-300 bg-brand-500/10 border-brand-500/30';
    badgeIcon = '⭐';
  } else if (percentage >= 50) {
    badgeTitle = 'Good Effort';
    badgeColor = 'text-blue-400 bg-blue-500/10 border-blue-500/30';
    badgeIcon = '👍';
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Top Hero Score Banner */}
      <div className="glass-panel-glow rounded-3xl p-6 sm:p-8 border border-slate-700 relative overflow-hidden text-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-xl mx-auto">
          {/* Badge */}
          <div
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wider mb-4 ${badgeColor}`}
          >
            <span>{badgeIcon}</span>
            <span>{badgeTitle}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Test Results
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Review your answers, verify correct choices, and read comprehensive explanations below.
          </p>

          {/* Big Score Gauge */}
          <div className="my-6 inline-flex flex-col items-center justify-center">
            <div className="relative w-36 h-36 flex items-center justify-center">
              {/* Circular SVG */}
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  className="stroke-slate-800"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  className="stroke-brand-500 transition-all duration-1000 ease-out"
                  strokeWidth="8"
                  strokeDasharray="264"
                  strokeDashoffset={264 - (264 * percentage) / 100}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-white">{percentage}%</span>
                <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
                  {score} / {totalQuestions} pts
                </span>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={handleRetakeTest}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-brand-500/25 transition-all flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Retake Test
            </button>

            <Link
              to="/history"
              className="px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-300 font-semibold text-xs uppercase tracking-wider transition-colors flex items-center gap-2"
            >
              <History className="w-4 h-4" />
              Past Attempts
            </Link>

            <Link
              to="/"
              className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <Home className="w-4 h-4" />
              Dashboard
            </Link>
          </div>
        </div>
      </div>

      {/* Summary Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-panel rounded-2xl p-4 border border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Correct
            </span>
            <div className="text-xl font-bold text-white mt-0.5">{correctCount}</div>
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-4 border border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-500/15 text-rose-400 flex items-center justify-center shrink-0">
            <XCircle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Incorrect
            </span>
            <div className="text-xl font-bold text-white mt-0.5">{incorrectCount}</div>
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-4 border border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-800 text-slate-400 flex items-center justify-center shrink-0">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Unanswered
            </span>
            <div className="text-xl font-bold text-white mt-0.5">{unansweredCount}</div>
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-4 border border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/15 text-indigo-400 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Time Taken
            </span>
            <div className="text-xl font-bold text-white mt-0.5">{timeFormatted}</div>
          </div>
        </div>
      </div>

      {/* Question By Question Detailed Review */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-brand-400" />
            <h3 className="text-base font-bold text-white tracking-tight">
              Detailed Question Analysis
            </h3>
          </div>

          {/* Filter Pills */}
          <div className="flex rounded-xl bg-slate-900 p-1 border border-slate-800 self-start sm:self-auto text-xs font-semibold">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                filter === 'all'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All ({answers.length})
            </button>
            <button
              onClick={() => setFilter('correct')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                filter === 'correct'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Correct ({correctCount})
            </button>
            <button
              onClick={() => setFilter('incorrect')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                filter === 'incorrect'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Mistakes ({incorrectCount + unansweredCount})
            </button>
          </div>
        </div>

        {/* List of Questions */}
        <div className="space-y-4">
          {filteredAnswers.map((item, idx) => {
            const isUserCorrect = item.isCorrect;
            const isUnanswered = item.selectedOptionIndex === -1;

            return (
              <div
                key={idx}
                className={`glass-panel rounded-2xl p-5 sm:p-6 border transition-all ${
                  isUserCorrect
                    ? 'border-emerald-500/30 bg-emerald-950/10'
                    : isUnanswered
                    ? 'border-slate-800 bg-slate-900/40'
                    : 'border-rose-500/30 bg-rose-950/10'
                }`}
              >
                {/* Header row */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center font-bold text-xs text-slate-300">
                      {idx + 1}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1.5 ${
                        isUserCorrect
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : isUnanswered
                          ? 'bg-slate-800 text-slate-400 border border-slate-700'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      }`}
                    >
                      {isUserCorrect ? (
                        <>
                          <Check className="w-3.5 h-3.5" /> Correct
                        </>
                      ) : isUnanswered ? (
                        <>
                          <HelpCircle className="w-3.5 h-3.5" /> Unanswered
                        </>
                      ) : (
                        <>
                          <X className="w-3.5 h-3.5" /> Incorrect
                        </>
                      )}
                    </span>
                  </div>
                </div>

                {/* Question Text */}
                <h4 className="text-sm sm:text-base font-semibold text-white leading-relaxed">
                  {item.questionText}
                </h4>

                {/* Optional Code Snippet */}
                {item.codeSnippet && (
                  <div className="mt-3 rounded-xl bg-slate-950 border border-slate-800 p-3 text-xs font-mono text-emerald-300 overflow-x-auto">
                    <code>{item.codeSnippet}</code>
                  </div>
                )}

                {/* Options List */}
                <div className="mt-4 space-y-2">
                  {item.options.map((opt, optIdx) => {
                    const isUserPick = item.selectedOptionIndex === optIdx;
                    const isRealCorrect = item.correctOptionIndex === optIdx;

                    let rowStyle = 'bg-slate-900/60 border-slate-800 text-slate-300';
                    let tag = null;

                    if (isRealCorrect) {
                      rowStyle =
                        'bg-emerald-500/15 border-emerald-500/50 text-emerald-200 font-medium ring-1 ring-emerald-500/40';
                      tag = (
                        <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider bg-emerald-500/20 px-2 py-0.5 rounded-md border border-emerald-500/30">
                          Correct Answer
                        </span>
                      );
                    } else if (isUserPick && !isRealCorrect) {
                      rowStyle =
                        'bg-rose-500/15 border-rose-500/50 text-rose-200 font-medium ring-1 ring-rose-500/40';
                      tag = (
                        <span className="text-[10px] font-bold text-rose-300 uppercase tracking-wider bg-rose-500/20 px-2 py-0.5 rounded-md border border-rose-500/30">
                          Your Answer
                        </span>
                      );
                    }

                    return (
                      <div
                        key={optIdx}
                        className={`p-3 rounded-xl border flex items-center justify-between text-xs transition-colors ${rowStyle}`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="w-6 h-6 rounded-lg bg-slate-800/80 font-bold flex items-center justify-center shrink-0">
                            {optionLabels[optIdx]}
                          </span>
                          <span>{opt}</span>
                        </div>
                        {tag}
                      </div>
                    );
                  })}
                </div>

                {/* Explanation Box */}
                {item.explanation && (
                  <div className="mt-4 p-3.5 rounded-xl bg-brand-500/10 border border-brand-500/25 text-xs text-brand-200 flex items-start gap-2.5">
                    <Sparkles className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block mb-0.5">Explanation:</strong>
                      <span>{item.explanation}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
