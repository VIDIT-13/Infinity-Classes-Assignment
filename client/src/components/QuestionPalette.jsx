import React from 'react';
import { Bookmark, CheckCircle2, CircleDot, HelpCircle } from 'lucide-react';

export const QuestionPalette = ({
  questions,
  currentIndex,
  answers,
  markedForReview,
  onSelectQuestion,
}) => {
  const answeredCount = Object.keys(answers).length;
  const markedCount = markedForReview.size;
  const unansweredCount = questions.length - answeredCount;

  return (
    <div className="glass-panel rounded-2xl p-4 sm:p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-2">
          <CircleDot className="w-4 h-4 text-brand-400" />
          Question Palette
        </h3>
        <span className="text-xs text-slate-400 font-medium">
          {questions.length} Total
        </span>
      </div>

      {/* Grid of 10 Questions */}
      <div className="grid grid-cols-5 gap-2.5">
        {questions.map((q, idx) => {
          const isCurrent = idx === currentIndex;
          const isAnswered = answers[q._id] !== undefined;
          const isMarked = markedForReview.has(q._id);

          let btnClasses =
            'relative h-11 w-full rounded-xl font-bold text-sm flex items-center justify-center transition-all duration-200 ';

          if (isCurrent) {
            btnClasses += 'ring-2 ring-brand-400 ring-offset-2 ring-offset-slate-950 scale-105 z-10 ';
          }

          if (isAnswered) {
            btnClasses +=
              'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 hover:bg-emerald-500/30';
          } else if (isMarked) {
            btnClasses +=
              'bg-amber-500/20 text-amber-300 border border-amber-500/50 hover:bg-amber-500/30';
          } else {
            btnClasses +=
              'bg-slate-800/60 text-slate-400 border border-slate-700/60 hover:bg-slate-800 hover:text-slate-200';
          }

          return (
            <button
              key={q._id}
              onClick={() => onSelectQuestion(idx)}
              className={btnClasses}
              title={`Go to Question ${idx + 1}`}
            >
              <span>{idx + 1}</span>
              {isMarked && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full ring-2 ring-slate-900" />
              )}
            </button>
          );
        })}
      </div>

      {/* Legend & Summary Counters */}
      <div className="border-t border-slate-800/80 pt-3 flex flex-col gap-2 text-xs">
        <div className="flex items-center justify-between text-slate-300">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500/40 border border-emerald-500/60" />
            <span>Answered</span>
          </div>
          <span className="font-semibold text-emerald-400">{answeredCount}</span>
        </div>

        <div className="flex items-center justify-between text-slate-300">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-500/40 border border-amber-500/60" />
            <span>Marked for Review</span>
          </div>
          <span className="font-semibold text-amber-400">{markedCount}</span>
        </div>

        <div className="flex items-center justify-between text-slate-300">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-slate-800 border border-slate-700" />
            <span>Unanswered</span>
          </div>
          <span className="font-semibold text-slate-400">{unansweredCount}</span>
        </div>
      </div>
    </div>
  );
};

