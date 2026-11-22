import React from 'react';
import { Clock, AlertTriangle } from 'lucide-react';

export const Timer = ({ timeRemaining, totalSeconds = 600 }) => {
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const percentage = Math.max(0, Math.min(100, (timeRemaining / totalSeconds) * 100));

  const isUrgent = timeRemaining <= 60;
  const isWarning = timeRemaining > 60 && timeRemaining <= 180;

  // Colors based on state
  let badgeColor = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
  let barColor = 'bg-emerald-500';

  if (isUrgent) {
    badgeColor = 'bg-rose-500/20 text-rose-300 border-rose-500/50 timer-urgent';
    barColor = 'bg-rose-500';
  } else if (isWarning) {
    badgeColor = 'bg-amber-500/15 text-amber-300 border-amber-500/40';
    barColor = 'bg-amber-500';
  }

  return (
    <div className="flex flex-col gap-1.5 min-w-[140px]">
      <div
        className={`flex items-center justify-between px-3.5 py-1.5 rounded-xl border font-mono font-bold text-sm tracking-wide shadow-sm transition-all duration-300 ${badgeColor}`}
      >
        <div className="flex items-center gap-1.5">
          {isUrgent ? (
            <AlertTriangle className="w-4 h-4 animate-bounce text-rose-400" />
          ) : (
            <Clock className="w-4 h-4" />
          )}
          <span className="text-xs uppercase tracking-wider font-semibold font-sans">
            {isUrgent ? 'Hurry!' : 'Time Left'}
          </span>
        </div>
        <span className="text-base">{formattedTime}</span>
      </div>

      {/* Mini Progress Bar */}
      <div className="w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden">
        <div
          className={`h-full transition-all duration-1000 ease-linear rounded-full ${barColor}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
