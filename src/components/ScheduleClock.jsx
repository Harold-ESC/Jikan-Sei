/**
 * ScheduleClock Component
 * 
 * Componente de reloj circular que visualiza el horario diario como segmentos
 * de color en un disco. Cada segmento representa una actividad con su duración
 * y permite interactuar con ellas.
 * 
 */

import { minutesToDegrees, polarToCartesian, describeArc, timeToMinutes } from '../utils';

export function ScheduleClock({ 
  schedule, 
  nowMinutes, 
  currentActivityId, 
  isViewingToday, 
  isDarkMode, 
  onActivitySelect 
}) {

// CONSTANTES GEOMÉTRICAS
  // Centro del reloj
  const cx = 150; 
  const cy = 150;
  
// Radio exterior e interior del reloj
  const radius = 120;
  const innerRadius = 70; 

  return (
    <svg 
      viewBox="0 0 300 300" 
      className="w-full h-full drop-shadow-xl"
      aria-label="Reloj circular de horario diario"
    >
      {/* FONDO DEL RELOJ */}
      <circle 
        cx={cx} 
        cy={cy} 
        r={radius} 
        fill={isDarkMode ? "#1e293b" : "#f1f5f9"} 
        aria-hidden="true"
      />

      {/* SEGMENTOS DE ACTIVIDADES */}
      {schedule.map(activity => {
        // Calcula los minutos de inicio y fin de la actividad
        let startMins = timeToMinutes(activity.start);
        let endMins = timeToMinutes(activity.end);
        
        if (endMins === 0) endMins = 1440; // Ajuste para medianoche

        // Calcula los ángulos de inicio y fin en grados
        const startAng = minutesToDegrees(startMins);
        const endAng = minutesToDegrees(endMins);

        const isCurrent = isViewingToday && currentActivityId === activity.id; // Indicador de actividad actual

        // Dibuja el segmento de la actividad
        return (
          <path
            key={activity.id}
            d={describeArc(cx, cy, radius, startAng, endAng, innerRadius)}
            fill={activity.color}
            opacity={isCurrent ? 1 : 0.5}
            className="cursor-pointer transition-all duration-300 hover:opacity-100 hover:scale-105 origin-center"
            onClick={() => onActivitySelect(activity)}
            stroke={isDarkMode ? "#0f172a" : "#ffffff"}
            strokeWidth="2"
            aria-label={`${activity.name} de ${activity.start} a ${activity.end}`}
            role="button"
            tabIndex="0"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                onActivitySelect(activity);
              }
            }}
          />
        );
      })}

      {/* MARCAS DE HORAS */}
      {[0, 3, 6, 9, 12, 15, 18, 21].map(h => {

        const angle = (h / 24) * 360; 
        const pos = polarToCartesian(cx, cy, innerRadius - 15, angle); // Posición cartesiana para el texto de la hora

        return (
          <text 
            key={h}
            x={pos.x} 
            y={pos.y} 
            textAnchor="middle" 
            dominantBaseline="middle"
            className={`text-[10px] font-bold ${isDarkMode ? 'fill-gray-400' : 'fill-gray-500'}`}
            aria-hidden="true"
          >
            {h}h
          </text>
        );
      })}

      {/* INDICADOR DE HORA ACTUAL (Solo visible cuando se ve el día actual) */}
      {isViewingToday && (
        <g transform={`rotate(${minutesToDegrees(nowMinutes)}, ${cx}, ${cy})`}>
          {/* Línea del indicador */}
          <line 
            x1={cx} 
            y1={cy - innerRadius} 
            x2={cx} 
            y2={cy - radius - 10} 
            stroke={isDarkMode ? "#ffffff" : "#334155"} 
            strokeWidth="2" 
            strokeLinecap="round"
            aria-hidden="true"
          />
          
          {/* Punta del indicador */}
          <circle 
            cx={cx} 
            cy={cy - radius - 10} 
            r="4" 
            fill={isDarkMode ? "#ffffff" : "#334155"}
            aria-hidden="true"
          />
        </g>
      )}

      {/* TEXTO CENTRAL */}
      <text 
        x={cx} 
        y={cy - 10} 
        textAnchor="middle"
        className={`text-sm font-medium ${isDarkMode ? 'fill-gray-400' : 'fill-gray-500'}`}
        aria-hidden="true"
      >
        {isViewingToday ? 'Ahora' : 'Viendo'}
      </text>
    </svg>
  );
}