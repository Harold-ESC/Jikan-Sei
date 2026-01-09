/**
 * ActivityCard Component
 * 
 * Tarjeta visual que muestra la actividad actual en curso, incluyendo detalles,
 * progreso temporal y acciones de interacción. Diseñada con efectos visuales
 * y transiciones para destacar la actividad activa.
 * 
 */

import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

export function ActivityCard({ activity, dayName, isDarkMode, timeRemaining, onClick }) {
  const [currentTime, setCurrentTime] = useState('');

  // Actualizar la hora cada minuto
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
    };

    // Actualizar inmediatamente
    updateTime();
    
    // Actualizar cada minuto
    const intervalId = setInterval(updateTime, 60000);
    
    // Limpiar intervalo al desmontar
    return () => clearInterval(intervalId);
  }, []);

  if (!activity) return null;

  // ESTILOS DINÁMICOS
  const cardStyle = {
    backgroundColor: isDarkMode ? '#1e293b' : 'white',
    borderLeftColor: activity.color
  };

  const timeBadgeStyle = {
    backgroundColor: `${activity.color}33`,
    color: activity.color
  };

  const progressBarStyle = {
    width: '60%',
    backgroundColor: activity.color
  };

  return (
    <div
      className={`
        w-full mb-6 p-5 rounded-3xl shadow-lg 
        transition-all cursor-pointer 
        transform hover:scale-[1.02] 
        border-l-8 relative overflow-hidden 
        group
      `}
      style={cardStyle}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={`Ver detalles de ${activity.label}`}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
    >
      {/* CONTENIDO PRINCIPAL */}
      <div className="flex justify-between items-start z-10 relative">
        
        {/* INFORMACIÓN DE LA ACTIVIDAD */}
        <div className="flex-1">
          {/* Encabezado con día y hora */}
          <span className="text-xs font-bold uppercase tracking-wider opacity-60 flex items-center gap-1 mb-1">
            <Clock size={12} aria-hidden="true" /> 
            Actual ({dayName})
          </span>
          
          {/* Título principal */}
          <h2 className="text-2xl font-bold mb-1">
            {activity.label}
          </h2>
          
          {/* Descripción */}
          <p className={`
            text-sm 
            ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} 
            line-clamp-1
          `}>
            {activity.description}
          </p>
        </div>

        {/* HORA ACTUAL DEL SISTEMA */}
        <div className="text-right ml-4">
          <span 
            className="text-xs font-bold px-2 py-1 rounded-full bg-opacity-20"
            style={timeBadgeStyle}
            aria-label={`Hora actual: ${currentTime}`}
          >
            {currentTime}
          </span>
        </div>
      </div>

      {/* BARRA DE PROGRESO TEMPORAL */}
      <div className="mt-4 flex items-center gap-2">
        {/* Contenedor de la barra */}
        <div 
          className="h-1.5 flex-1 bg-gray-200 rounded-full overflow-hidden dark:bg-slate-700"
          role="progressbar"
          aria-valuenow={60}
          aria-valuemin="0"
          aria-valuemax="100"
          aria-label="Progreso de la actividad"
        >
          {/* Barra de progreso animada */}
          <div 
            className="h-full rounded-full animate-pulse"
            style={progressBarStyle}
          />
        </div>
        
        {/* Tiempo restante */}
        <span 
          className="text-xs font-mono font-medium opacity-80 whitespace-nowrap"
          aria-label={`Tiempo restante: ${timeRemaining}`}
        >
          {timeRemaining}
        </span>
      </div>
    </div>
  );
}