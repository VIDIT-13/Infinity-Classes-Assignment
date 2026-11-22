import React from 'react';
import { AlertCircle, CheckCircle2, Loader2, X } from 'lucide-react';

export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  totalQuestions,
  answeredCount,
  isSubmitting,
}) => {
  if (!isOpen) return null;

  const unansweredCount = totalQuestions - answeredCount;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="glass-panel-glow max-w-md w-full rounded-2xl p-6 sm:p-7 shadow-2xl relative border border-slate-700/80">
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isSubmitting}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3.5 mb-4">
          <div className="w-11 h-11 rounded-xl bg-brand-500/15 border border-brand-500/30 flex items-center justify-center text-brand-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">
              Ready to Submit Your Test?
            </h3>
            <p className="text-xs text-slate-400">
              Review your progress before final evaluation.
            </p>
          </div>
        </div>

        {/* Progress Breakdown */}
        <div className="bg-slate-900/90 rounded-xl p-4 border border-slate-800 my-4 flex items-center justify-around text-center">
          <div>
            <span className="block text-2xl font-extrabold text-emerald-400">
              {answeredCount}
            </span>
            <span className="text-xs text-slate-400">Answered</span>
          </div>

          <div className="h-8 w-px bg-slate-800" />

          <div>
            <span className="block text-2xl font-extrabold text-slate-300">
              {totalQuestions}
            </span>
            <span className="text-xs text-slate-400">Total Questions</span>
          </div>

          <div className="h-8 w-px bg-slate-800" />

          <div>
            <span
              className={`block text-2xl font-extrabold ${
                unansweredCount > 0 ? 'text-amber-400' : 'text-slate-500'
              }`}
            >
              {unansweredCount}
            </span>
            <span className="text-xs text-slate-400">Unanswered</span>
          </div>
        </div>

        {unansweredCount > 0 && (
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs mb-5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>
              You still have <strong>{unansweredCount}</strong> unanswered questions.
              You will receive 0 points for questions left blank.
            </span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 py-2.5 px-4 rounded-xl border border-slate-700 hover:bg-slate-800/80 text-slate-300 text-sm font-semibold transition-colors"
          >
            Return to Test
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isSubmitting}
            className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white text-sm font-semibold shadow-lg shadow-brand-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Evaluating...
              </>
            ) : (
              'Submit Test'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
