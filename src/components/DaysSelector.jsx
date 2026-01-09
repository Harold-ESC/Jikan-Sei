/**
 * DaysSelector Component
 * 
 * Componente selector de días de la semana que permite navegar entre diferentes días
 * mostrando indicadores visuales para el día actual y el día seleccionado.
 * 
 */

export function DaysSelector({ days, activeIndex, todayIndex, isDarkMode, onDaySelect }) {

  const handleDayClick = (index) => {
    onDaySelect(index);
  }; // Maneja el clic en un botón de día

  return (
    <div className="flex justify-between items-center bg-black/5 dark:bg-white/5 rounded-2xl p-1 mb-2">
      {days.map((day, index) => {

        // Determinar estados visuales del botón
        const isActive = activeIndex === index;
        const isToday = todayIndex === index;

        const buttonClasses = `
          relative w-9 h-9 rounded-xl text-xs font-bold transition-all
          ${isActive 
            ? (isDarkMode 
                ? 'bg-white text-black shadow-lg' 
                : 'bg-white text-black shadow-md'
              ) 
            : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
          }
        `; // Clases dinámicas según el estado del botón

        return (
          <button
            key={index}
            onClick={() => handleDayClick(index)}
            className={buttonClasses.trim()}
            aria-label={`Seleccionar ${day}`}
            aria-current={isActive ? 'true' : 'false'}
            title={`${day}${isToday ? ' (hoy)' : ''}`}
          >
            {/* Abreviatura del día */}
            {day}
            
            {/* Indicador visual para el día actual (cuando no está activo) */}
            {isToday && !isActive && (
              <span 
                className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full"
                aria-hidden="true"
              />
            )}
          </button>
        );
      })}
    </div>
  );
}