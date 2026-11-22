import React, { useState, useEffect } from 'react';
import { api } from '../api/api';
import {
  ShieldCheck,
  PlusCircle,
  Trash2,
  BookOpen,
  Code,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  Layers,
  Eye,
} from 'lucide-react';

export const AdminPage = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Form states
  const [questionText, setQuestionText] = useState('');
  const [codeSnippet, setCodeSnippet] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctOptionIndex, setCorrectOptionIndex] = useState(0);
  const [explanation, setExplanation] = useState('');
  const [category, setCategory] = useState('Full-Stack Web Development');
  const [difficulty, setDifficulty] = useState('medium');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const data = await api.getAllQuestions();
      if (data.success) {
        setQuestions(data.questions || []);
      }
    } catch (err) {
      setError(err.message || 'Failed to load questions from database');
    } finally {
      setLoading(false);
    }
  };

  const handleOptionChange = (index, value) => {
    const updated = [...options];
    updated[index] = value;
    setOptions(updated);
  };

  const handleAddQuestion = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    // Validation
    if (!questionText.trim()) {
      setError('Please provide the question prompt');
      return;
    }

    if (options.some((opt) => !opt.trim())) {
      setError('All 4 options must be filled out');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        questionText: questionText.trim(),
        codeSnippet: codeSnippet.trim(),
        options: options.map((o) => o.trim()),
        correctOptionIndex: Number(correctOptionIndex),
        explanation: explanation.trim(),
        category: category.trim(),
        difficulty,
      };

      const res = await api.createQuestion(payload);
      if (res.success) {
        setSuccessMessage('New question added to database successfully!');
        // Reset form
        setQuestionText('');
        setCodeSnippet('');
        setOptions(['', '', '', '']);
        setCorrectOptionIndex(0);
        setExplanation('');
        // Refresh question list
        fetchQuestions();
      }
    } catch (err) {
      setError(err.message || 'Failed to create question');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteQuestion = async (id) => {
    if (!window.confirm('Are you sure you want to delete this question?')) return;

    try {
      const res = await api.deleteQuestion(id);
      if (res.success) {
        setQuestions((prev) => prev.filter((q) => q._id !== id));
      }
    } catch (err) {
      alert('Delete failed: ' + err.message);
    }
  };

  const optionLetters = ['A', 'B', 'C', 'D'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            Admin Control Center
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Question Bank Manager
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Author and manage multiple-choice questions for the student examination pool.
          </p>
        </div>

        <div className="glass-panel px-4 py-2 rounded-2xl border border-slate-800 flex items-center gap-3">
          <Layers className="w-5 h-5 text-purple-400" />
          <span className="text-xs text-slate-300 font-medium">
            Total Questions: <strong className="text-white">{questions.length}</strong>
          </span>
        </div>
      </div>

      {/* Main Grid: Form on Left, Question Bank on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Question Creator Form (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel rounded-3xl p-6 border border-slate-800 shadow-xl">
            <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2 mb-4">
              <PlusCircle className="w-4 h-4 text-brand-400" />
              Add New Question
            </h2>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            {successMessage && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>{successMessage}</span>
              </div>
            )}

            <form onSubmit={handleAddQuestion} className="space-y-4 text-xs">
              {/* Question Text */}
              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Question Prompt *
                </label>
                <textarea
                  rows="3"
                  required
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  placeholder="e.g. Which hook is used for side-effects in React?"
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              {/* Code Snippet (Optional) */}
              <div>
                <label className="block text-slate-300 font-medium mb-1 flex items-center gap-1.5">
                  <Code className="w-3.5 h-3.5 text-brand-400" />
                  Code Snippet (Optional)
                </label>
                <textarea
                  rows="2"
                  value={codeSnippet}
                  onChange={(e) => setCodeSnippet(e.target.value)}
                  placeholder="e.g. useEffect(() => { ... }, []);"
                  className="w-full font-mono bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-emerald-300 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              {/* 4 Options */}
              <div className="space-y-2">
                <label className="block text-slate-300 font-medium">
                  Options & Correct Answer (Select the radio of the correct choice) *
                </label>
                {options.map((opt, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="correctOption"
                      checked={correctOptionIndex === idx}
                      onChange={() => setCorrectOptionIndex(idx)}
                      className="w-4 h-4 text-brand-500 focus:ring-brand-500 bg-slate-900 border-slate-700"
                      title={`Mark Option ${optionLetters[idx]} as correct`}
                    />
                    <span className="w-5 font-bold text-slate-400 text-center">
                      {optionLetters[idx]}
                    </span>
                    <input
                      type="text"
                      required
                      value={opt}
                      onChange={(e) => handleOptionChange(idx, e.target.value)}
                      placeholder={`Option ${optionLetters[idx]}`}
                      className="flex-1 bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                    />
                  </div>
                ))}
              </div>

              {/* Category & Difficulty */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="e.g. React & Frontend"
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-white placeholder-slate-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Difficulty
                  </label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>

              {/* Explanation */}
              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Answer Explanation
                </label>
                <textarea
                  rows="2"
                  value={explanation}
                  onChange={(e) => setExplanation(e.target.value)}
                  placeholder="Explain why the selected option is correct..."
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-brand-600 hover:from-purple-500 hover:to-brand-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-purple-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving Question...
                  </>
                ) : (
                  <>
                    <PlusCircle className="w-4 h-4" />
                    Add Question to Bank
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Existing Question Bank (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-brand-400" />
                Current Questions in Database
              </h2>
              <span className="text-xs text-slate-400">
                {questions.length} Total
              </span>
            </div>

            {loading ? (
              <div className="py-12 flex flex-col items-center justify-center gap-3">
                <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
                <p className="text-xs text-slate-400">Loading question records...</p>
              </div>
            ) : questions.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-xs text-slate-400">No questions found.</p>
                <p className="text-[11px] text-slate-500 mt-1">
                  Add questions using the form on the left or run the database seeder.
                </p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[750px] overflow-y-auto pr-1">
                {questions.map((q, idx) => (
                  <div
                    key={q._id}
                    className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700/80 transition-colors space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-md bg-purple-500/20 text-purple-300 font-bold text-xs flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <span className="text-xs text-slate-400 font-medium">
                          {q.category}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] uppercase font-semibold bg-slate-800 text-slate-300">
                          {q.difficulty}
                        </span>
                      </div>

                      <button
                        onClick={() => handleDeleteQuestion(q._id)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        title="Delete question"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-sm font-semibold text-slate-200">
                      {q.questionText}
                    </p>

                    {q.codeSnippet && (
                      <div className="rounded-lg bg-slate-950 p-2 font-mono text-[11px] text-emerald-300 overflow-x-auto">
                        <code>{q.codeSnippet}</code>
                      </div>
                    )}

                    {/* Options list */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {q.options.map((opt, optIdx) => {
                        const isCorrect = q.correctOptionIndex === optIdx;
                        return (
                          <div
                            key={optIdx}
                            className={`p-2 rounded-xl border flex items-center gap-2 ${
                              isCorrect
                                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 font-semibold'
                                : 'bg-slate-950/40 border-slate-800/80 text-slate-400'
                            }`}
                          >
                            <span className="font-bold">{optionLetters[optIdx]}.</span>
                            <span className="truncate">{opt}</span>
                            {isCorrect && (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 ml-auto shrink-0" />
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {q.explanation && (
                      <p className="text-[11px] text-slate-400 italic bg-slate-950/40 p-2 rounded-lg">
                        <strong>Explanation:</strong> {q.explanation}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
