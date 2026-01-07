import React, { useState, useEffect, useMemo } from 'react';
import { Moon, Sun, Clock, Bell, Calendar, ChevronRight, X, Info, ChevronLeft } from 'lucide-react';

// --- Constantes de Días ---
const DAYS = ['D', 'L', 'M', 'X', 'J', 'V', 'S'];
const DAYS_FULL = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

// --- Horarios Base ---

const WORK_SCHEDULE = [
  { id: 'sleep', label: 'Dormir', start: '00:00', end: '06:30', color: '#6366f1', description: 'Descanso profundo.', type: 'rest' },
  { id: 'morning', label: 'Rutina Mañana', start: '06:30', end: '07:30', color: '#f472b6', description: 'Ducha y desayuno.', type: 'personal' },
  { id: 'commute1', label: 'Transporte', start: '07:30', end: '08:30', color: '#94a3b8', description: 'Camino al trabajo.', type: 'commute' },
  { id: 'work1', label: 'Trabajo Bloque 1', start: '08:30', end: '13:00', color: '#38bdf8', description: 'Tareas prioritarias.', type: 'work' },
  { id: 'lunch', label: 'Almuerzo', start: '13:00', end: '14:00', color: '#34d399', description: 'Comida nutritiva.', type: 'health' },
  { id: 'work2', label: 'Trabajo Bloque 2', start: '14:00', end: '17:30', color: '#60a5fa', description: 'Reuniones y admin.', type: 'work' },
  { id: 'commute2', label: 'Regreso', start: '17:30', end: '18:30', color: '#94a3b8', description: 'Vuelta a casa.', type: 'commute' },
  { id: 'gym', label: 'Deporte', start: '18:30', end: '20:00', color: '#f87171', description: 'Entrenamiento.', type: 'health' },
  { id: 'dinner', label: 'Cena', start: '20:00', end: '21:30', color: '#fbbf24', description: 'Cena y familia.', type: 'rest' },
  { id: 'free', label: 'Tiempo Libre', start: '21:30', end: '23:00', color: '#a78bfa', description: 'Series o lectura.', type: 'personal' },
  { id: 'sleep2', label: 'Dormir', start: '23:00', end: '00:00', color: '#6366f1', description: 'A la cama.', type: 'rest' },
];

const WEEKEND_SCHEDULE = [
  { id: 'sleep_w', label: 'Dormir', start: '00:00', end: '09:00', color: '#6366f1', description: 'Dormir hasta tarde.', type: 'rest' },
  { id: 'brunch', label: 'Brunch', start: '09:00', end: '11:00', color: '#f472b6', description: 'Desayuno largo y relajado.', type: 'personal' },
  { id: 'outdoors', label: 'Aire Libre', start: '11:00', end: '14:00', color: '#34d399', description: 'Paseo, parque o deporte suave.', type: 'health' },
  { id: 'lunch_w', label: 'Comida Familiar', start: '14:00', end: '16:00', color: '#fbbf24', description: 'Comida con amigos o familia.', type: 'social' },
  { id: 'siesta', label: 'Siesta / Relax', start: '16:00', end: '17:30', color: '#818cf8', description: 'Descanso.', type: 'rest' },
  { id: 'hobbies', label: 'Hobbies', start: '17:30', end: '20:00', color: '#f87171', description: 'Pintar, juegos o proyectos.', type: 'personal' },
  { id: 'dinner_w', label: 'Cena / Salida', start: '20:00', end: '23:00', color: '#a78bfa', description: 'Cena fuera o cine.', type: 'social' },
  { id: 'sleep_w2', label: 'Dormir', start: '23:00', end: '00:00', color: '#6366f1', description: 'Descanso.', type: 'rest' },
];

// Configuración semanal: 0=Domingo, 1=Lunes, ... 6=Sábado
const WEEKLY_SCHEDULE = {
  0: WEEKEND_SCHEDULE, // Domingo
  1: WORK_SCHEDULE,    // Lunes
  2: WORK_SCHEDULE,    // Martes
  3: WORK_SCHEDULE,    // Miércoles
  4: WORK_SCHEDULE,    // Jueves
  5: WORK_SCHEDULE,    // Viernes
  6: WEEKEND_SCHEDULE, // Sábado
};

// --- Utilidades Matemáticas ---
const timeToMinutes = (timeStr) => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
};

const minutesToDegrees = (minutes) => {
  return (minutes / 1440) * 360;
};

const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
  const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians))
  };
};

const describeArc = (x, y, radius, startAngle, endAngle, innerRadius) => {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);
  const startInner = polarToCartesian(x, y, innerRadius, endAngle);
  const endInner = polarToCartesian(x, y, innerRadius, startAngle);

  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  return [
    "M", start.x, start.y,
    "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
    "L", endInner.x, endInner.y,
    "A", innerRadius, innerRadius, 0, largeArcFlag, 1, startInner.x, startInner.y,
    "Z"
  ].join(" ");
};

// --- Componente Principal ---

export default function App() {
  const [now, setNow] = useState(new Date());
  // Estado para el día que estamos "viendo" (puede ser diferente al día real)
  const [viewingDayIndex, setViewingDayIndex] = useState(new Date().getDay()); 
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  // Auto-actualizar hora
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Auto-tema
  useEffect(() => {
    const hours = now.getHours();
    setIsDarkMode(hours >= 19 || hours < 6);
  }, []);

  // --- Datos Derivados ---
  const currentRealDayIndex = now.getDay();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const isViewingToday = viewingDayIndex === currentRealDayIndex;

  // Horario a mostrar en el círculo (del día seleccionado)
  const displayedSchedule = WEEKLY_SCHEDULE[viewingDayIndex] || WORK_SCHEDULE;

  // Actividad REAL actual (siempre basada en el día y hora REAL)
  const currentRealSchedule = WEEKLY_SCHEDULE[currentRealDayIndex] || WORK_SCHEDULE;
  const currentActivity = useMemo(() => {
    return currentRealSchedule.find(activity => {
      const start = timeToMinutes(activity.start);
      let end = timeToMinutes(activity.end);
      if (end === 0) end = 1440;
      return currentMinutes >= start && currentMinutes < end;
    }) || currentRealSchedule[0];
  }, [currentMinutes, currentRealSchedule]);

  // Tiempo restante de la actividad REAL
  const timeRemaining = useMemo(() => {
    if (!currentActivity) return "";
    let end = timeToMinutes(currentActivity.end);
    if (end === 0) end = 1440;
    const diff = end - currentMinutes;
    const h = Math.floor(diff / 60);
    const m = diff % 60;
    return `${h > 0 ? h + 'h ' : ''}${m}min restantes`;
  }, [currentActivity, currentMinutes]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  // --- Renderizado del Reloj ---
  const renderClock = () => {
    const cx = 150;
    const cy = 150;
    const radius = 120;
    const innerRadius = 70;

    return (
      <svg viewBox="0 0 300 300" className="w-full h-full drop-shadow-xl transform transition-transform duration-700 ease-out">
        <circle cx={cx} cy={cy} r={radius} fill={isDarkMode ? "#1e293b" : "#f1f5f9"} />
        
        {displayedSchedule.map((activity) => {
          const startMins = timeToMinutes(activity.start);
          let endMins = timeToMinutes(activity.end);
          if (endMins === 0) endMins = 1440;
          
          const startAng = minutesToDegrees(startMins);
          const endAng = minutesToDegrees(endMins);
          
          // Resaltar si es la actividad actual Y estamos viendo el día de hoy
          const isCurrent = isViewingToday && (currentActivity?.id === activity.id);
          
          return (
            <path
              key={activity.id}
              d={describeArc(cx, cy, radius, startAng, endAng, innerRadius)}
              fill={activity.color}
              opacity={isCurrent ? 1 : 0.5} // Menos opacidad si no es la actual
              className="cursor-pointer transition-all duration-300 hover:opacity-100 hover:scale-105 origin-center"
              onClick={() => setSelectedActivity(activity)}
              stroke={isDarkMode ? "#0f172a" : "#ffffff"}
              strokeWidth="2"
            />
          );
        })}

        {/* Marcadores de hora */}
        {[0, 3, 6, 9, 12, 15, 18, 21].map(h => {
           const angle = (h / 24) * 360;
           const pos = polarToCartesian(cx, cy, innerRadius - 15, angle);
           return (
             <text
               key={h}
               x={pos.x} y={pos.y}
               textAnchor="middle" dominantBaseline="middle"
               className={`text-[10px] font-bold ${isDarkMode ? 'fill-gray-400' : 'fill-gray-500'}`}
             >
               {h}h
             </text>
           )
        })}

        {/* Aguja de Tiempo (Solo visible si vemos el día de HOY) */}
        {isViewingToday && (
          <g transform={`rotate(${minutesToDegrees(currentMinutes)}, ${cx}, ${cy})`}>
            <line 
              x1={cx} y1={cy - innerRadius} 
              x2={cx} y2={cy - radius - 10} 
              stroke={isDarkMode ? "#ffffff" : "#334155"} 
              strokeWidth="2" strokeLinecap="round"
            />
            <circle cx={cx} cy={cy - radius - 10} r="4" fill={isDarkMode ? "#ffffff" : "#334155"} />
          </g>
        )}
        
        {/* Texto central */}
        <text x={cx} y={cy - 10} textAnchor="middle" className={`text-sm font-medium ${isDarkMode ? 'fill-gray-400' : 'fill-gray-500'}`}>
            {isViewingToday ? 'Ahora' : 'Viendo'}
        </text>
        <text x={cx} y={cy + 15} textAnchor="middle" className={`text-xl font-bold ${isDarkMode ? 'fill-white' : 'fill-slate-800'}`}>
            {isViewingToday 
                ? now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                : DAYS_FULL[viewingDayIndex]
            }
        </text>
      </svg>
    );
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 overflow-hidden relative font-sans ${isDarkMode ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-800'}`}>
      
      {/* --- Header --- */}
      <header className="p-4 pb-2">
        <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-xl font-bold tracking-tight">Mi Horario</h1>
              <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                {now.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}
              </p>
            </div>
            <div className="flex gap-2">
                <button 
                    onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                    className={`p-2 rounded-full transition-colors ${notificationsEnabled ? 'bg-blue-100 text-blue-600' : 'bg-transparent text-gray-400'}`}
                >
                    <Bell size={18} />
                </button>
                <button 
                    onClick={toggleTheme}
                    className={`p-2 rounded-full transition-colors ${isDarkMode ? 'bg-slate-800 text-yellow-400' : 'bg-white shadow-sm text-slate-600'}`}
                >
                    {isDarkMode ? <Moon size={18} /> : <Sun size={18} />}
                </button>
            </div>
        </div>

        {/* --- Selector de Días --- */}
        <div className="flex justify-between items-center bg-black/5 dark:bg-white/5 rounded-2xl p-1 mb-2">
            {DAYS.map((day, index) => {
                const isActive = viewingDayIndex === index;
                const isToday = currentRealDayIndex === index;
                return (
                    <button
                        key={index}
                        onClick={() => setViewingDayIndex(index)}
                        className={`
                            relative w-9 h-9 rounded-xl text-xs font-bold transition-all
                            ${isActive 
                                ? (isDarkMode ? 'bg-white text-black shadow-lg' : 'bg-white text-black shadow-md') 
                                : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
                            }
                        `}
                    >
                        {day}
                        {isToday && !isActive && (
                            <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full"></span>
                        )}
                    </button>
                )
            })}
        </div>
      </header>

      <main className="flex flex-col items-center px-4 w-full max-w-md mx-auto relative z-10">
        
        {/* --- Tarjeta de Actividad Actual (Siempre visible) --- */}
        <div 
            className={`w-full mb-6 p-5 rounded-3xl shadow-lg transition-all cursor-pointer transform hover:scale-[1.02] border-l-8 relative overflow-hidden group`}
            style={{ 
                backgroundColor: isDarkMode ? '#1e293b' : 'white',
                borderLeftColor: currentActivity?.color 
            }}
            onClick={() => setSelectedActivity(currentActivity)}
        >
            <div className="flex justify-between items-start z-10 relative">
                <div>
                    <span className="text-xs font-bold uppercase tracking-wider opacity-60 flex items-center gap-1 mb-1">
                        <Clock size={12} /> Actual ({DAYS_FULL[currentRealDayIndex]})
                    </span>
                    <h2 className="text-2xl font-bold mb-1">{currentActivity?.label}</h2>
                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} line-clamp-1`}>
                        {currentActivity?.description}
                    </p>
                </div>
                <div className="text-right">
                    <span className={`text-xs font-bold px-2 py-1 rounded-full bg-opacity-20`} style={{ backgroundColor: currentActivity?.color, color: currentActivity?.color }}>
                        {currentActivity?.end}
                    </span>
                </div>
            </div>
            
            <div className="mt-4 flex items-center gap-2">
                <div className="h-1.5 flex-1 bg-gray-200 rounded-full overflow-hidden dark:bg-slate-700">
                     <div className="h-full rounded-full animate-pulse" style={{ width: '60%', backgroundColor: currentActivity?.color }} />
                </div>
                <span className="text-xs font-mono font-medium opacity-80 whitespace-nowrap">
                    {timeRemaining}
                </span>
            </div>
        </div>

        {/* --- Rueda de Horario --- */}
        <div className="w-full max-w-[320px] aspect-square relative mb-6">
             {renderClock()}
        </div>

        {/* --- Lista de Actividades (Del día seleccionado) --- */}
        <div className="w-full">
            <h3 className={`text-sm font-semibold uppercase tracking-wider mb-3 flex justify-between ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                <span>Plan para {DAYS_FULL[viewingDayIndex]}</span>
                {!isViewingToday && <span className="text-xs bg-slate-200 dark:bg-slate-700 px-2 rounded text-slate-500">Vista Previa</span>}
            </h3>
            
            <div className="space-y-3 pb-10">
                {displayedSchedule.map((activity) => (
                    <div 
                        key={activity.id}
                        onClick={() => setSelectedActivity(activity)}
                        className={`flex items-center p-3 rounded-2xl border cursor-pointer hover:scale-[1.01] transition-transform
                            ${isDarkMode ? 'border-slate-800 bg-slate-800/50' : 'border-slate-100 bg-white'}
                            ${isViewingToday && currentActivity.id === activity.id ? 'ring-2 ring-offset-2 ring-blue-500' : ''}
                        `}
                    >
                         <div className="w-3 h-10 rounded-full mr-4" style={{ backgroundColor: activity.color }}></div>
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
        </div>

      </main>

      {/* --- Modal / Vista Detallada --- */}
      {selectedActivity && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div 
            className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity"
            onClick={() => setSelectedActivity(null)}
          ></div>

          <div className={`
            relative w-full max-w-sm rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl transform transition-all animate-in slide-in-from-bottom-10
            ${isDarkMode ? 'bg-slate-800 text-white' : 'bg-white text-slate-800'}
          `}>
             <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-6 opacity-50 sm:hidden"></div>
             
             <button 
                onClick={() => setSelectedActivity(null)}
                className="absolute top-4 right-4 p-2 opacity-50 hover:opacity-100"
             >
                 <X size={24} />
             </button>

             <div className="flex items-center gap-4 mb-6">
                 <div 
                    className="w-16 h-16 rounded-2xl shadow-lg flex items-center justify-center text-white text-2xl font-bold"
                    style={{ backgroundColor: selectedActivity.color }}
                 >
                     {selectedActivity.label.charAt(0)}
                 </div>
                 <div>
                     <h2 className="text-2xl font-bold leading-tight">{selectedActivity.label}</h2>
                     <div className="flex items-center gap-2 mt-1 opacity-70 font-mono text-sm">
                         <span>{selectedActivity.start}</span>
                         <ChevronRight size={14} />
                         <span>{selectedActivity.end}</span>
                     </div>
                 </div>
             </div>

             <div className="space-y-4">
                 <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-700/50' : 'bg-slate-50'}`}>
                     <h3 className="text-xs uppercase font-bold tracking-wider opacity-50 mb-2 flex items-center gap-2">
                        <Info size={14} /> Descripción
                     </h3>
                     <p className="text-sm leading-relaxed opacity-90">
                         {selectedActivity.description}
                     </p>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-3">
                     <div className={`p-3 rounded-xl text-center ${isDarkMode ? 'bg-slate-700/50' : 'bg-slate-50'}`}>
                         <span className="block text-xs uppercase opacity-50 mb-1">Duración</span>
                         <span className="font-bold">
                             {(timeToMinutes(selectedActivity.end === '00:00' ? '24:00' : selectedActivity.end) - timeToMinutes(selectedActivity.start)) / 60} h
                         </span>
                     </div>
                     <div className={`p-3 rounded-xl text-center ${isDarkMode ? 'bg-slate-700/50' : 'bg-slate-50'}`}>
                         <span className="block text-xs uppercase opacity-50 mb-1">Tipo</span>
                         <span className="font-bold capitalize">{selectedActivity.type}</span>
                     </div>
                 </div>
             </div>
          </div>
        </div>
      )}

    </div>
  );
}