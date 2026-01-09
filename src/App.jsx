/**
 * Jikan Sei - Aplicación Principal
 * 
 * Aplicación de gestión de horarios que visualiza actividades diarias en un
 * formato de reloj circular interactivo. Permite navegar entre días, ver
 * actividades actuales y consultar detalles específicos.
 * 
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Bell, Moon, Sun } from 'lucide-react';

// Componentes
import { ScheduleClock } from './components/ScheduleClock';
import { DaysSelector } from './components/DaysSelector';
import { ActivityCard } from './components/ActivityCard';
import { ActivityList } from './components/ActivityList';
import { ActivityDetailModal } from './components/ActivityDetailModal';

// Utilidades y hooks
import { DAYS, DAYS_FULL, getScheduleForDay, findCurrentActivity, calculateTimeRemaining } from './utils';
import { useDarkMode } from './hooks/useDarkMode';

export default function App() {
// ESTADOS PRINCIPALES
  const [now, setNow] = useState(new Date()); // Estado para la hora actual
  const [viewingDayIndex, setViewingDayIndex] = useState(new Date().getDay()); // Día que se está visualizando
  const [selectedActivity, setSelectedActivity] = useState(null); // Actividad seleccionada para ver detalles
  const [notificationsEnabled, setNotificationsEnabled] = useState(false); // Estado de notificaciones
  const { isDarkMode, toggleTheme } = useDarkMode(now); // Tema oscuro/claro automático

// EFECTOS Y TIMERS
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000); // Actualiza cada minuto
    return () => clearInterval(timer);
  }, []);


// CÁLCULOS Y DERIVADOS
  const currentRealDayIndex = now.getDay(); // Indice del día actual (0-6)
  const currentMinutes = now.getHours() * 60 + now.getMinutes(); // Minutos desde medianoche
  const isViewingToday = viewingDayIndex === currentRealDayIndex; // Verifica si se está viendo el día actual
  const scheduleToDisplay = getScheduleForDay(viewingDayIndex); //  Horario del día seleccionado
  const realSchedule = getScheduleForDay(currentRealDayIndex); // Horario del día actual
  const currentActivity = useMemo(
    () => findCurrentActivity(realSchedule, currentMinutes),
    [realSchedule, currentMinutes]
  ); // Actividad actual basada en el horario real
  const timeRemaining = useMemo(
    () => calculateTimeRemaining(currentActivity, currentMinutes),
    [currentActivity, currentMinutes]
  ); // Tiempo restante para la actividad actual


// RENDERIZADO
  return (
    <div className={`min-h-screen transition-colors duration-500 overflow-hidden relative font-sans ${isDarkMode ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-800'}`}>
      {/* HEADER: Controles y selector de días */}
      <header className="p-4 pb-2">
        <div className="flex justify-between items-center mb-4">
          {/* Título y fecha */}
          <div>
            <h1 className="text-xl font-bold tracking-tight">Jikan Sei</h1>
            <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              {now.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}
            </p>
          </div>

          {/* Controles: Notificaciones y tema */}
          <div className="flex gap-2">
            {/* Botón de notificaciones */}
            <button
              onClick={() => setNotificationsEnabled(!notificationsEnabled)}
              className={`p-2 rounded-full transition-colors ${notificationsEnabled ? 'bg-blue-100 text-blue-600' : 'bg-transparent text-gray-400'}`}
              aria-label={notificationsEnabled ? 'Notificaciones activadas' : 'Notificaciones desactivadas'}
            >
              <Bell size={18} />
            </button>

            {/* Botón de cambio de tema */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full transition-colors ${isDarkMode ? 'bg-slate-800 text-yellow-400' : 'bg-white shadow-sm text-slate-600'}`}
              aria-label={isDarkMode ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
            >
              {isDarkMode ? <Moon size={18} /> : <Sun size={18} />}
            </button>
          </div>
        </div>

        {/* Selector de días de la semana */}
        <DaysSelector
          days={DAYS}
          activeIndex={viewingDayIndex}
          todayIndex={currentRealDayIndex}
          isDarkMode={isDarkMode}
          onDaySelect={setViewingDayIndex}
        />
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex flex-col items-center px-4 w-full max-w-md mx-auto relative z-10">
        {/* Tarjeta de actividad actual */}
        <ActivityCard
          activity={currentActivity}
          dayName={DAYS_FULL[currentRealDayIndex]}
          isDarkMode={isDarkMode}
          timeRemaining={timeRemaining}
          onClick={() => setSelectedActivity(currentActivity)}
        />

        {/* Reloj circular con horario */}
        <div className="w-full max-w-[320px] aspect-square relative mb-6">
          <ScheduleClock
            schedule={scheduleToDisplay}
            nowMinutes={currentMinutes}
            currentActivityId={currentActivity?.id}
            isViewingToday={isViewingToday}
            isDarkMode={isDarkMode}
            onActivitySelect={setSelectedActivity}
          />
        </div>

        {/* Lista detallada de actividades del día */}
        <ActivityList
          activities={scheduleToDisplay}
          isDarkMode={isDarkMode}
          isViewingToday={isViewingToday}
          currentActivityId={currentActivity?.id}
          dayName={DAYS_FULL[viewingDayIndex]}
          onActivitySelect={setSelectedActivity}
        />
      </main>

      {/* MODAL DE DETALLE DE ACTIVIDAD */}
      <ActivityDetailModal
        activity={selectedActivity}
        isDarkMode={isDarkMode}
        onClose={() => setSelectedActivity(null)}
      />
    </div>
  );
}