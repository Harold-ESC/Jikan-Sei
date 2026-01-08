import React from 'react';
import { Clock } from 'lucide-react';

export function ActivityCard({ activity, dayName, isDarkMode, timeRemaining, onClick }) {
  return (
    <div
      className={`w-full mb-6 p-5 rounded-3xl shadow-lg transition-all cursor-pointer transform hover:scale-[1.02] border-l-8 relative overflow-hidden group`}
      style={{ backgroundColor: isDarkMode ? '#1e293b' : 'white', borderLeftColor: activity.color }}
      onClick={onClick}
    >
      <div className="flex justify-between items-start z-10 relative">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider opacity-60 flex items-center gap-1 mb-1">
            <Clock size={12} /> Actual ({dayName})
          </span>
          <h2 className="text-2xl font-bold mb-1">{activity.label}</h2>
          <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} line-clamp-1`}>{activity.description}</p>
        </div>
        <div className="text-right">
          <span className="text-xs font-bold px-2 py-1 rounded-full bg-opacity-20" style={{ backgroundColor: activity.color, color: activity.color }}>{activity.end}</span>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <div className="h-1.5 flex-1 bg-gray-200 rounded-full overflow-hidden dark:bg-slate-700">
          <div className="h-full rounded-full animate-pulse" style={{ width: '60%', backgroundColor: activity.color }} />
        </div>
        <span className="text-xs font-mono font-medium opacity-80 whitespace-nowrap">{timeRemaining}</span>
      </div>
    </div>
  );
}