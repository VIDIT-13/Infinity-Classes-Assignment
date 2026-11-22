import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTest } from '../context/TestContext';
import { Timer } from '../components/Timer';
import { QuestionPalette } from '../components/QuestionPalette';
import { ConfirmModal } from '../components/ConfirmModal';
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  CheckCircle2,
  Send,
  RotateCcw,
  Code,
  Tag,
  AlertTriangle,
  Loader2,
} from 'lucide-react';

export const TestPage = () => {
  const {
    questions,
    currentQuestion,
    currentIndex,
    totalQuestions,
    answers,
    markedForReview,
    timeRemaining,
    isTestActive,
    isSubmitting,
    lastResult,
    selectOption,
    clearOption,
    toggleMarkForReview,
    goToQuestion,
    nextQuestion,
    prevQuestion,
    submitTest,
    startNewTest,
    loadingQuestions,
  } = useTest();

  const navigate = useNavigate();
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // If test is not active, prompt to start or redirect to dashboard
  useEffect(() => {
    if (!isTestActive && !loadingQuestions && questions.length === 0) {
      startNewTest();
    }
  }, [isTestActive, loadingQuestions, questions.length]);

  // If submission succeeded, navigate to result
  useEffect(() => {
    if (lastResult) {
      navigate('/result', { state: { result: lastResult } });
    }
  }, [lastResult, navigate]);

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore keystrokes inside input or textarea
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

      if (!currentQuestion) return;

      // Option 1-4 or A-D
      if (['1', '2', '3', '4'].includes(e.key)) {
        selectOption(currentQuestion._id, Number(e.key) - 1);
      } else if (['a', 'b', 'c', 'd'].includes(e.key.toLowerCase())) {
        const charMap = { a: 0, b: 1, c: 2, d: 3 };
        selectOption(currentQuestion._id, charMap[e.key.toLowerCase()]);
      } else if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'n') {
        nextQuestion();
      } else if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'p') {
        prevQuestion();
      } else if (e.key.toLowerCase() === 'm') {
        toggleMarkForReview(currentQuestion._id);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentQuestion, selectOption, nextQuestion, prevQuestion, toggleMarkForReview]);

  if (loadingQuestions) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-9 h-9 text-brand-500 animate-spin" />
        <p className="text-sm text-slate-300 font-medium">
          Loading randomized question bank...
        </p>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4 text-center px-4">
        <div className="w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
          <AlertTriangle className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-white">No Active Test Session</h2>
        <p className="text-sm text-slate-400 max-w-sm">
          Please click below to generate a new 10-question assessment.
        </p>
        <button
          onClick={startNewTest}
          className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-sm transition-colors flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Start New Test
        </button>
      </div>
    );
  }

  const selectedAnswer = answers[currentQuestion._id];
  const isMarked = markedForReview.has(currentQuestion._id);
  const answeredCount = Object.keys(answers).length;

  const handleConfirmSubmit = async () => {
    setShowConfirmModal(false);
    const result = await submitTest();
    if (result) {
      navigate('/result', { state: { result } });
    }
  };

  const optionLabels = ['A', 'B', 'C', 'D'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Floating Control Bar */}
      <div className="glass-panel rounded-2xl p-4 border border-slate-800 flex flex-wrap items-center justify-between gap-4 sticky top-20 z-30 shadow-xl">
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30 text-xs font-bold uppercase tracking-wider">
            Question {currentIndex + 1} of {totalQuestions}
          </span>
          {currentQuestion.category && (
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 text-slate-300 border border-slate-700/80 text-xs font-medium">
              <Tag className="w-3.5 h-3.5 text-brand-400" />
              {currentQuestion.category}
            </span>
          )}
          {currentQuestion.difficulty && (
            <span
              className={`hidden sm:inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider border ${
                currentQuestion.difficulty === 'easy'
                  ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                  : currentQuestion.difficulty === 'hard'
                  ? 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                  : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
              }`}
            >
              {currentQuestion.difficulty}
            </span>
          )}
        </div>

        {/* 10-Minute Countdown Timer */}
        <div className="flex items-center gap-3">
          <Timer timeRemaining={timeRemaining} totalSeconds={600} />

          <button
            onClick={() => setShowConfirmModal(true)}
            disabled={isSubmitting}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-brand-500/20 transition-all flex items-center gap-1.5 shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Submit</span>
          </button>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left 3 Cols: Question Details & Options */}
        <div className="lg:col-span-3 space-y-6">
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl relative">
            {/* Question Text */}
            <h2 className="text-lg sm:text-xl font-bold text-white leading-relaxed">
              {currentQuestion.questionText}
            </h2>

            {/* Optional Chemical / Physics / Math Equation or Diagram */}
            {currentQuestion.codeSnippet && (
              <div className="mt-4 rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden text-xs">
                <div className="px-4 py-1.5 bg-slate-900 border-b border-slate-800 flex items-center gap-2 text-slate-400">
                  <Code className="w-3.5 h-3.5 text-brand-400" />
                  <span className="font-mono text-[11px]">Equation / Formula Context</span>
                </div>
                <pre className="p-4 overflow-x-auto text-emerald-300 font-mono leading-relaxed">
                  <code>{currentQuestion.codeSnippet}</code>
                </pre>
              </div>
            )}

            {/* 4 Interactive Options */}
            <div className="mt-6 space-y-3">
              {currentQuestion.options.map((optionText, optIdx) => {
                const isSelected = selectedAnswer === optIdx;

                return (
                  <button
                    key={optIdx}
                    onClick={() => selectOption(currentQuestion._id, optIdx)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 flex items-center justify-between group ${
                      isSelected
                        ? 'bg-brand-600/20 border-brand-500/80 shadow-lg shadow-brand-500/10 text-white ring-1 ring-brand-500'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3.5 pr-2">
                      <span
                        className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                          isSelected
                            ? 'bg-brand-500 text-white'
                            : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700 group-hover:text-slate-200'
                        }`}
                      >
                        {optionLabels[optIdx]}
                      </span>
                      <span className="text-sm font-medium leading-snug">
                        {optionText}
                      </span>
                    </div>

                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                        isSelected
                          ? 'border-brand-400 bg-brand-500'
                          : 'border-slate-700 bg-slate-950 group-hover:border-slate-600'
                      }`}
                    >
                      {isSelected && (
                        <div className="w-2 h-2 rounded-full bg-white" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Bottom Actions Toolbar */}
            <div className="mt-8 pt-6 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleMarkForReview(currentQuestion._id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                    isMarked
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                  title="Bookmark to review before submitting (Key: M)"
                >
                  <Bookmark className={`w-4 h-4 ${isMarked ? 'fill-current' : ''}`} />
                  <span>{isMarked ? 'Marked for Review' : 'Mark for Review'}</span>
                </button>

                {selectedAnswer !== undefined && (
                  <button
                    onClick={() => clearOption(currentQuestion._id)}
                    className="px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  >
                    Clear Answer
                  </button>
                )}
              </div>

              {/* Prev / Next Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={prevQuestion}
                  disabled={currentIndex === 0}
                  className="px-4 py-2 rounded-xl border border-slate-800 text-slate-300 hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  title="Previous Question (Key: P or Left Arrow)"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Previous</span>
                </button>

                {currentIndex < totalQuestions - 1 ? (
                  <button
                    onClick={nextQuestion}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    title="Next Question (Key: N or Right Arrow)"
                  >
                    <span>Next</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={() => setShowConfirmModal(true)}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-brand-500/20"
                  >
                    <span>Finish</span>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Keyboard Shortcuts Hint */}
            <div className="mt-4 flex items-center justify-center gap-4 text-[11px] text-slate-500">
              <span>⌨️ Shortcuts: <strong>1-4</strong> or <strong>A-D</strong> (Select)</span>
              <span>&bull;</span>
              <span><strong>N</strong> (Next)</span>
              <span>&bull;</span>
              <span><strong>P</strong> (Prev)</span>
              <span>&bull;</span>
              <span><strong>M</strong> (Mark)</span>
            </div>
          </div>
        </div>

        {/* Right Col: Interactive Question Palette */}
        <div className="lg:col-span-1">
          <QuestionPalette
            questions={questions}
            currentIndex={currentIndex}
            answers={answers}
            markedForReview={markedForReview}
            onSelectQuestion={goToQuestion}
          />
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmSubmit}
        totalQuestions={totalQuestions}
        answeredCount={answeredCount}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

