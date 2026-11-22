import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTest } from '../context/TestContext';
import { api } from '../api/api';
import {
  Trophy,
  Target,
  Clock,
  Sparkles,
  ArrowRight,
  Flame,
  CheckCircle,
  HelpCircle,
  Play,
  RotateCcw,
  Calendar,
  AlertCircle,
  Layers,
} from 'lucide-react';

export const DashboardPage = () => {
  const { user } = useAuth();
  const { startNewTest, loadingQuestions } = useTest();
  const navigate = useNavigate();

  const [historyStats, setHistoryStats] = useState({
    totalAttempts: 0,
    highestScore: 0,
    highestPercentage: 0,
    averageScore: 0,
    recentAttempts: [],
  });
  const [loadingStats, setLoadingStats] = useState(true);
  const [startError, setStartError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await api.getHistory();
        if (data.success) {
          setHistoryStats({
            totalAttempts: data.totalAttempts,
            highestScore: data.highestScore,
            highestPercentage: data.highestPercentage,
            averageScore: data.averageScore,
            recentAttempts: (data.history || []).slice(0, 3),
          });
        }
      } catch (err) {
        console.warn('Could not fetch test statistics:', err.message);
      } finally {
        setLoadingStats(false);
      }
    };

    fetchStats();
  }, []);

  const handleStartTest = async () => {
    setStartError('');
    const success = await startNewTest();
    if (success) {
      navigate('/test');
    } else {
      setStartError('Could not start test. Please verify the question bank is populated.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl glass-panel border border-slate-800 p-6 sm:p-8">
        <div className="absolute top-0 right-0 w-80 h-80 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-950/90 border border-slate-800 p-2 shrink-0 shadow-xl shadow-brand-500/15 hidden xs:flex items-center justify-center">
              <img
                src="/logo.png"
                alt="Infinity Classes"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/15 border border-brand-500/30 text-brand-300 text-xs font-semibold uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                Infinity Classes &bull; CBSE Class 10
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Hello, <span className="text-amber-400">{user?.name}</span> 👋
              </h1>
              <p className="text-sm text-slate-400 mt-1 max-w-xl">
                Ready for your Class 10 CBSE Board Science assessment? Test your conceptual clarity and exam readiness across Physics, Chemistry, and Biology.
              </p>
            </div>
          </div>

          <button
            onClick={handleStartTest}
            disabled={loadingQuestions}
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 hover:from-brand-500 hover:to-purple-500 text-white font-bold text-sm shadow-xl shadow-brand-500/30 hover:shadow-brand-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 shrink-0 disabled:opacity-50"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>{loadingQuestions ? 'Preparing Questions...' : 'Start Class 10 Science Test'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {startError && (
          <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{startError}</span>
          </div>
        )}
      </div>

      {/* Performance Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Total Tests */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Tests Completed
            </span>
            <div className="text-2xl font-extrabold text-white mt-0.5">
              {loadingStats ? '...' : historyStats.totalAttempts}
            </div>
          </div>
        </div>

        {/* Highest Score */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Best Score
            </span>
            <div className="text-2xl font-extrabold text-white mt-0.5">
              {loadingStats
                ? '...'
                : historyStats.totalAttempts > 0
                ? `${historyStats.highestScore}/10 (${historyStats.highestPercentage}%)`
                : '—'}
            </div>
          </div>
        </div>

        {/* Average Score */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Average Score
            </span>
            <div className="text-2xl font-extrabold text-white mt-0.5">
              {loadingStats
                ? '...'
                : historyStats.totalAttempts > 0
                ? `${historyStats.averageScore} / 10`
                : '—'}
            </div>
          </div>
        </div>
      </div>

      {/* Test Guidelines & Instructions Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-panel rounded-3xl p-6 sm:p-7 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2.5">
            <HelpCircle className="w-5 h-5 text-brand-400" />
            <h2 className="text-lg font-bold text-white tracking-tight">
              Class 10 CBSE Board Exam Guidelines
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 flex items-start gap-3">
              <div className="p-2 rounded-xl bg-brand-500/15 text-brand-400 shrink-0">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-200">
                  10 Board Questions
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  Covers Class 10 NCERT Science: Chemical Reactions, Acids & Bases, Light, Electricity, Life Processes, and Heredity.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 flex items-start gap-3">
              <div className="p-2 rounded-xl bg-amber-500/15 text-amber-400 shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-200">
                  10-Minute Countdown
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  Timed practice builds speed and exam temperament. When the timer reaches 00:00, your test auto-submits automatically.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 flex items-start gap-3">
              <div className="p-2 rounded-xl bg-purple-500/15 text-purple-400 shrink-0">
                <Target className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-200">
                  Exam Palette & Review
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  Jump to any question with the interactive palette. Flag numericals or tricky questions with "Mark for Review" to double check.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 flex items-start gap-3">
              <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400 shrink-0">
                <CheckCircle className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-200">
                  Step-by-Step Solutions
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  Instant score evaluation with side-by-side correct options and detailed conceptual explanations based on CBSE marking schemes.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Attempts Widget */}
        <div className="glass-panel rounded-3xl p-6 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Calendar className="w-4 h-4 text-brand-400" />
                Recent Attempts
              </h3>
              <button
                onClick={() => navigate('/history')}
                className="text-xs text-brand-400 hover:text-brand-300 font-medium"
              >
                View All
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {loadingStats ? (
                <p className="text-xs text-slate-500 text-center py-6">
                  Loading records...
                </p>
              ) : historyStats.recentAttempts.length > 0 ? (
                historyStats.recentAttempts.map((attempt) => (
                  <div
                    key={attempt._id}
                    className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 flex items-center justify-between"
                  >
                    <div>
                      <div className="text-xs font-semibold text-slate-200">
                        Score: {attempt.score} / {attempt.totalQuestions}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {new Date(attempt.submittedAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        attempt.percentage >= 70
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      }`}
                    >
                      {attempt.percentage}%
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <div className="w-10 h-10 rounded-xl bg-slate-800/80 mx-auto flex items-center justify-center text-slate-500 mb-2">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <p className="text-xs text-slate-400">No attempts yet.</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Click "Start 10-Min Test" to take your first quiz!
                  </p>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={handleStartTest}
            className="w-full mt-4 py-2.5 px-3 rounded-xl bg-brand-600/20 hover:bg-brand-600/30 text-brand-300 border border-brand-500/30 text-xs font-bold transition-colors flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Launch Test Now
          </button>
        </div>
      </div>
    </div>
  );
};

