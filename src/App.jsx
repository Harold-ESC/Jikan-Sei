import React, { useState, useEffect, useMemo } from 'react';
import { Bell, Moon, Sun } from 'lucide-react';
import { DAYS, DAYS_FULL, getScheduleForDay, findCurrentActivity, calculateTimeRemaining } from './utils';
import { useDarkMode } from './hooks/useDarkMode';
import { ScheduleClock } from './components/ScheduleClock';
import { DaysSelector } from './components/DaysSelector';
import { ActivityCard } from './components/ActivityCard';
import { ActivityList } from './components/ActivityList';
import { ActivityDetailModal } from './components/ActivityDetailModal';

export default function App() {
  const [now, setNow] = useState(new Date());
  const [viewingDayIndex, setViewingDayIndex] = useState(new Date().getDay());
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const { isDarkMode, toggleTheme } = useDarkMode(now);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const currentRealDayIndex = now.getDay();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const isViewingToday = viewingDayIndex === currentRealDayIndex;

  const scheduleToDisplay = getScheduleForDay(viewingDayIndex);
  const realSchedule = getScheduleForDay(currentRealDayIndex);

  const currentActivity = useMemo(() => findCurrentActivity(realSchedule, currentMinutes), [realSchedule, currentMinutes]);

  const timeRemaining = useMemo(() => calculateTimeRemaining(currentActivity, currentMinutes), [currentActivity, currentMinutes]);

  return (
    <div className={`min-h-screen transition-colors duration-500 overflow-hidden relative font-sans ${isDarkMode ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-800'}`}>
      <header className="p-4 pb-2">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight">Jikan Sei</h1>
            <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{now.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setNotificationsEnabled(!notificationsEnabled)} className={`p-2 rounded-full transition-colors ${notificationsEnabled ? 'bg-blue-100 text-blue-600' : 'bg-transparent text-gray-400'}`}><Bell size={18} /></button>
            <button onClick={toggleTheme} className={`p-2 rounded-full transition-colors ${isDarkMode ? 'bg-slate-800 text-yellow-400' : 'bg-white shadow-sm text-slate-600'}`}>{isDarkMode ? <Moon size={18} /> : <Sun size={18} />}</button>
          </div>
        </div>

        <DaysSelector days={DAYS} activeIndex={viewingDayIndex} todayIndex={currentRealDayIndex} isDarkMode={isDarkMode} onDaySelect={setViewingDayIndex} />
      </header>

      <main className="flex flex-col items-center px-4 w-full max-w-md mx-auto relative z-10">
        <ActivityCard activity={currentActivity} dayName={DAYS_FULL[currentRealDayIndex]} isDarkMode={isDarkMode} timeRemaining={timeRemaining} onClick={() => setSelectedActivity(currentActivity)} />

        <div className="w-full max-w-[320px] aspect-square relative mb-6">
          <ScheduleClock schedule={scheduleToDisplay} nowMinutes={currentMinutes} currentActivityId={currentActivity?.id} isViewingToday={isViewingToday} isDarkMode={isDarkMode} onActivitySelect={setSelectedActivity} />
        </div>

        <ActivityList activities={scheduleToDisplay} isDarkMode={isDarkMode} isViewingToday={isViewingToday} currentActivityId={currentActivity?.id} dayName={DAYS_FULL[viewingDayIndex]} onActivitySelect={setSelectedActivity} />
      </main>

      <ActivityDetailModal activity={selectedActivity} isDarkMode={isDarkMode} onClose={() => setSelectedActivity(null)} />
    </div>
  );
}