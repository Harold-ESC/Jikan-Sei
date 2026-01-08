// Constantes y utilidades compartidas
export const DAYS = ['D', 'L', 'M', 'X', 'J', 'V', 'S'];
export const DAYS_FULL = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

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

export const WEEKLY_SCHEDULE = {
  0: WEEKEND_SCHEDULE,
  1: WORK_SCHEDULE,
  2: WORK_SCHEDULE,
  3: WORK_SCHEDULE,
  4: WORK_SCHEDULE,
  5: WORK_SCHEDULE,
  6: WEEKEND_SCHEDULE,
};

// Utilidades de tiempo y SVG
export const timeToMinutes = (timeStr) => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
};

export const minutesToDegrees = (minutes) => (minutes / 1440) * 360;

export const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
  const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians))
  };
};

export const describeArc = (x, y, radius, startAngle, endAngle, innerRadius) => {
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

export const getScheduleForDay = (dayIndex) => WEEKLY_SCHEDULE[dayIndex] || WORK_SCHEDULE;

export const findCurrentActivity = (schedule, currentMinutes) => {
  return schedule.find(activity => {
    const start = timeToMinutes(activity.start);
    let end = timeToMinutes(activity.end);
    if (end === 0) end = 1440;
    return currentMinutes >= start && currentMinutes < end;
  }) || schedule[0];
};

export const calculateTimeRemaining = (activity, currentMinutes) => {
  if (!activity) return '';
  let end = timeToMinutes(activity.end);
  if (end === 0) end = 1440;
  const diff = end - currentMinutes;
  const h = Math.floor(diff / 60);
  const m = diff % 60;
  return `${h > 0 ? h + 'h ' : ''}${m}min restantes`;
};

export const calculateActivityDuration = (activity) => {
  const start = timeToMinutes(activity.start);
  const end = timeToMinutes(activity.end === '00:00' ? '24:00' : activity.end);
  return (end - start) / 60;
};