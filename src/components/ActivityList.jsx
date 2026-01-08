import React from 'react';

export function ActivityList({ activities, isDarkMode, isViewingToday, currentActivityId, dayName, onActivitySelect }) {
  return (
    <section className="w-full">
      <h3 className={`text-sm font-semibold uppercase tracking-wider mb-3 flex justify-between ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
        <span>Plan para {dayName}</span>
        {!isViewingToday && <span className="text-xs bg-slate-200 dark:bg-slate-700 px-2 rounded text-slate-500">Vista Previa</span>}
      </h3>
      <div className="space-y-3 pb-10">
        {activities.map(activity => (
          <div
            key={activity.id}
            onClick={() => onActivitySelect(activity)}
            className={`flex items-center p-3 rounded-2xl border cursor-pointer hover:scale-[1.01] transition-transform ${isDarkMode ? 'border-slate-800 bg-slate-800/50' : 'border-slate-100 bg-white'} ${isViewingToday && currentActivityId === activity.id ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`}
          >
            <div className="w-3 h-10 rounded-full mr-4" style={{ backgroundColor: activity.color }} />
            <div className="flex-1">
              <div className="flex justify-between mb-1">
                <h4 className="font-semibold text-sm">{activity.label}</h4>
                <span className="text-xs font-mono opacity-60">{activity.start} - {activity.end}</span>
              </div>
              <p className="text-xs opacity-60 line-clamp-1">{activity.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}