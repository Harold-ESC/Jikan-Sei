/**
 * Constantes y Utilidades del Sistema
 * 
 * Este módulo contiene todas las constantes, datos de horarios y funciones
 * utilitarias para la gestión de tiempo y visualización de actividades.
 * 
 */

// CONSTANTES DE TIEMPO Y DÍAS

export const DAYS = ['D', 'L', 'M', 'X', 'J', 'V', 'S'];
export const DAYS_FULL = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

// HORARIOS PRE-DEFINIDOS

// Horario estándar para días laborables (Lunes a Viernes)
export const WORK_SCHEDULE = [
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

//Horario para fines de semana (Sábado y Domingo)

export const WEEKEND_SCHEDULE = [
  { id: 'sleep_w', label: 'Dormir', start: '00:00', end: '09:00', color: '#6366f1', description: 'Dormir hasta tarde.', type: 'rest' },
  { id: 'brunch', label: 'Brunch', start: '09:00', end: '11:00', color: '#f472b6', description: 'Desayuno largo y relajado.', type: 'personal' },
  { id: 'outdoors', label: 'Aire Libre', start: '11:00', end: '14:00', color: '#34d399', description: 'Paseo, parque o deporte suave.', type: 'health' },
  { id: 'lunch_w', label: 'Comida Familiar', start: '14:00', end: '16:00', color: '#fbbf24', description: 'Comida con amigos o familia.', type: 'social' },
  { id: 'siesta', label: 'Siesta / Relax', start: '16:00', end: '17:30', color: '#818cf8', description: 'Descanso.', type: 'rest' },
  { id: 'hobbies', label: 'Hobbies', start: '17:30', end: '20:00', color: '#f87171', description: 'Pintar, juegos o proyectos.', type: 'personal' },
  { id: 'dinner_w', label: 'Cena / Salida', start: '20:00', end: '23:00', color: '#a78bfa', description: 'Cena fuera o cine.', type: 'social' },
  { id: 'sleep_w2', label: 'Dormir', start: '23:00', end: '00:00', color: '#6366f1', description: 'Descanso.', type: 'rest' },
];

// Mapeo completo de horarios semanales
export const WEEKLY_SCHEDULE = {
  0: WEEKEND_SCHEDULE,   // Domingo
  1: WORK_SCHEDULE,      // Lunes
  2: WORK_SCHEDULE,      // Martes
  3: WORK_SCHEDULE,      // Miércoles
  4: WORK_SCHEDULE,      // Jueves
  5: WORK_SCHEDULE,      // Viernes
  6: WEEKEND_SCHEDULE,   // Sábado
};

// FUNCIONES UTILITARIAS DE TIEMPO

// Convierte una hora en formato HH:mm a minutos totales del día
export const timeToMinutes = (timeStr) => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
};

// Convierte minutos del día a grados para representación circular
export const minutesToDegrees = (minutes) => (minutes / 1440) * 360;

// Obtiene el horario correspondiente a un día específico
export const getScheduleForDay = (dayIndex) => WEEKLY_SCHEDULE[dayIndex] || WORK_SCHEDULE;

// Encuentra la actividad actual basada en los minutos del día
export const findCurrentActivity = (schedule, currentMinutes) => {
  return schedule.find(activity => {
    const start = timeToMinutes(activity.start);
    let end = timeToMinutes(activity.end);
    // Maneja el caso de actividad que termina a medianoche (00:00)
    if (end === 0) end = 1440;
    return currentMinutes >= start && currentMinutes < end;
  }) || schedule[0];
};

// Calcula el tiempo restante para una actividad específica

export const calculateTimeRemaining = (activity, currentMinutes) => {
  if (!activity) return '';
  let end = timeToMinutes(activity.end);
  if (end === 0) end = 1440;
  const diff = end - currentMinutes;
  const h = Math.floor(diff / 60);
  const m = diff % 60;
  return `${h > 0 ? h + 'h ' : ''}${m}min restantes`;
};

// Calcula la duración total de una actividad en horas
 
export const calculateActivityDuration = (activity) => {
  const start = timeToMinutes(activity.start);
  const end = timeToMinutes(activity.end === '00:00' ? '24:00' : activity.end);
  return (end - start) / 60;
};


// FUNCIONES DE GEOMETRÍA PARA SVG

// Convierte coordenadas polares a cartesianas para gráficos circulares
export const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
  const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians))
  };
};

// Genera el comando SVG para dibujar un arco (sector circular)

export const describeArc = (x, y, radius, startAngle, endAngle, innerRadius) => {
  // Calcular puntos exteriores
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);
  
  // Calcular puntos interiores
  const startInner = polarToCartesian(x, y, innerRadius, endAngle);
  const endInner = polarToCartesian(x, y, innerRadius, startAngle);
  
  // Determinar si es un arco mayor (más de 180 grados)
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  
  // Construir comando SVG path
  return [
    "M", start.x, start.y,                    // Mover al punto exterior inicial
    "A", radius, radius, 0, largeArcFlag, 0,  // Dibujar arco exterior
    end.x, end.y,
    "L", endInner.x, endInner.y,              // Línea al punto interior
    "A", innerRadius, innerRadius, 0, largeArcFlag, 1, // Arco interior
    startInner.x, startInner.y,
    "Z"                                        // Cerrar el path
  ].join(" ");
};