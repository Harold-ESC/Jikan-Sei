import React from 'react';
import { minutesToDegrees, polarToCartesian, describeArc, timeToMinutes } from '../utils';

export function ScheduleClock({ schedule, nowMinutes, currentActivityId, isViewingToday, isDarkMode, onActivitySelect }) {
  const cx = 150, cy = 150, radius = 120, innerRadius = 70;

  return (
    <svg viewBox="0 0 300 300" className="w-full h-full drop-shadow-xl">
      <circle cx={cx} cy={cy} r={radius} fill={isDarkMode ? "#1e293b" : "#f1f5f9"} />
      {schedule.map(activity => {
        let startMins = timeToMinutes(activity.start);
        let endMins = timeToMinutes(activity.end);
        if (endMins === 0) endMins = 1440;
        const startAng = minutesToDegrees(startMins);
        const endAng = minutesToDegrees(endMins);
        const isCurrent = isViewingToday && currentActivityId === activity.id;
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
          />
        );
      })}
      {[0,3,6,9,12,15,18,21].map(h => {
        const angle = (h / 24) * 360;
        const pos = polarToCartesian(cx, cy, innerRadius - 15, angle);
        return <text key={h} x={pos.x} y={pos.y} textAnchor="middle" dominantBaseline="middle" className={`text-[10px] font-bold ${isDarkMode ? 'fill-gray-400' : 'fill-gray-500'}`}>{h}h</text>;
      })}
      {isViewingToday && (
        <g transform={`rotate(${minutesToDegrees(nowMinutes)}, ${cx}, ${cy})`}>
          <line x1={cx} y1={cy - innerRadius} x2={cx} y2={cy - radius - 10} stroke={isDarkMode ? "#ffffff" : "#334155"} strokeWidth="2" strokeLinecap="round" />
          <circle cx={cx} cy={cy - radius - 10} r="4" fill={isDarkMode ? "#ffffff" : "#334155"} />
        </g>
      )}
      <text x={cx} y={cy - 10} textAnchor="middle" className={`text-sm font-medium ${isDarkMode ? 'fill-gray-400' : 'fill-gray-500'}`}>{isViewingToday ? 'Ahora' : 'Viendo'}</text>
    </svg>
  );
}