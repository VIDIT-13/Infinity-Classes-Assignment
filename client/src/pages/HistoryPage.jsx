import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/api';
import { useTest } from '../context/TestContext';
import {
  History as HistoryIcon,
  Trophy,
  Calendar,
  Clock,
  ArrowRight,
  Loader2,
  AlertCircle,
  Play,
  RotateCcw,
  CheckCircle2,
  ChevronRight,
  Layers,
  Sparkles,
} from 'lucide-react';

export const HistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState({
    totalAttempts: 0,
    highestScore: 0,
    highestPercentage: 0,
    averageScore: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedAttempt, setSelectedAttempt] = useState(null);
  const [loadingAttempt, setLoadingAttempt] = useState(false);

  const { startNewTest } = useTest();
  const navigate = useNavigate();

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const data = await api.getHistory();
      if (data.success) {
        setHistory(data.history || []);
        setStats({
          totalAttempts: data.totalAttempts || 0,
          highestScore: data.highestScore || 0,
          highestPercentage: data.highestPercentage || 0,
          averageScore: data.averageScore || 0,
        });
      }
    } catch (err) {
      setError(err.message || 'Failed to load test history');
    } finally {
      setLoading(false);
    }
  };

  const handleReviewAttempt = async (attemptId) => {
    setLoadingAttempt(true);
    try {
      const data = await api.getAttempt(attemptId);
      if (data.success && data.attempt) {
        navigate('/result', { state: { result: data.attempt } });
      }
    } catch (err) {
      alert('Could not load attempt details: ' + err.message);
    } finally {
      setLoadingAttempt(false);
    }
  };

  const handleTakeTest = async () => {
    const success = await startNewTest();
    if (success) {
      navigate('/test');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <HistoryIcon className="w-3.5 h-3.5" />
            Performance Records
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            My Test History
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Track your progress, historical test scores, and review detailed question breakdowns.
          </p>
        </div>

        <button
          onClick={handleTakeTest}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-brand-500/25 transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>Take New Test</span>
        </button>
      </div>

      {/* Lifetime Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="glass-panel rounded-2xl p-5 border border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Total Attempts
            </span>
            <div className="text-2xl font-extrabold text-white mt-0.5">
              {loading ? '...' : stats.totalAttempts}
            </div>
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Personal Best
            </span>
            <div className="text-2xl font-extrabold text-white mt-0.5">
              {loading
                ? '...'
                : stats.totalAttempts > 0
                ? `${stats.highestScore}/10 (${stats.highestPercentage}%)`
                : '—'}
            </div>
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Average Score
            </span>
            <div className="text-2xl font-extrabold text-white mt-0.5">
              {loading
                ? '...'
                : stats.totalAttempts > 0
                ? `${stats.averageScore} / 10`
                : '—'}
            </div>
          </div>
        </div>
      </div>

      {/* Attempts List */}
      <div className="glass-panel rounded-3xl p-6 sm:p-7 border border-slate-800 space-y-4">
        <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
          <Calendar className="w-4 h-4 text-brand-400" />
          Past Test Attempts Log
        </h2>

        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
            <p className="text-xs text-slate-400">Loading your test history...</p>
          </div>
        ) : error ? (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        ) : history.length === 0 ? (
          <div className="text-center py-12 px-4">
            <div className="w-14 h-14 rounded-2xl bg-slate-800/80 mx-auto flex items-center justify-center text-slate-500 mb-3">
              <Trophy className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-white">No attempts recorded yet</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              You haven't completed any online assessments. Test your skills today!
            </p>
            <button
              onClick={handleTakeTest}
              className="mt-4 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs uppercase tracking-wider transition-colors inline-flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Start Your First Test
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-800/80">
            {history.map((attempt, idx) => {
              const minutes = Math.floor((attempt.timeSpentSeconds || 0) / 60);
              const seconds = (attempt.timeSpentSeconds || 0) % 60;
              const formattedTime = `${minutes}m ${seconds}s`;

              const dateStr = new Date(attempt.submittedAt).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              });

              const timeStr = new Date(attempt.submittedAt).toLocaleTimeString(undefined, {
                hour: '2-digit',
                minute: '2-digit',
              });

              const isGood = attempt.percentage >= 70;

              return (
                <div
                  key={attempt._id}
                  className="py-4 first:pt-2 last:pb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:bg-slate-900/30 px-3 rounded-2xl transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 border ${
                        isGood
                          ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                          : 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                      }`}
                    >
                      {attempt.percentage}%
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">
                          Attempt #{history.length - idx}
                        </span>
                        <span className="text-xs font-semibold text-slate-400">
                          &bull; {attempt.score} / {attempt.totalQuestions} Questions Correct
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-500" />
                          {dateStr} at {timeStr}
                        </span>
                        <span>&bull;</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-500" />
                          Time: {formattedTime}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Review Button */}
                  <button
                    onClick={() => handleReviewAttempt(attempt._id)}
                    disabled={loadingAttempt}
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-brand-600/20 text-slate-300 hover:text-brand-300 border border-slate-800 hover:border-brand-500/40 text-xs font-semibold transition-all flex items-center gap-2 self-start sm:self-auto"
                  >
                    <span>Review Test</span>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-brand-400 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

