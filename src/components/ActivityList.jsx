/**
 * ActivityList Component
 * 
 * Componente que muestra una lista detallada de actividades programadas para un día.
 * Permite visualizar todas las actividades, resaltar la actividad actual y seleccionar
 * cualquier actividad para ver detalles.
 * 
 */

export function ActivityList({
  activities,
  isDarkMode,
  isViewingToday,
  currentActivityId,
  dayName,
  onActivitySelect
}) {

// VALIDACIONES Y PREPROCESAMIENTO
  const isCurrentActivity = (activity) => {
    return isViewingToday && currentActivityId === activity.id;
  }; // Verifica si la actividad es la actual

// RENDERIZADO
  return (
    <section className="w-full" aria-label="Lista de actividades del día">
      {/* Encabezado de la sección */}
      <header>
        <h3 
          className={`text-sm font-semibold uppercase tracking-wider mb-3 flex justify-between ${
            isDarkMode ? 'text-slate-500' : 'text-slate-400'
          }`}
        >
          <span>Plan para {dayName}</span>
          
          {/* Badge de vista previa (solo para días no actuales) */}
          {!isViewingToday && (
            <span 
              className="text-xs bg-slate-200 dark:bg-slate-700 px-2 rounded text-slate-500"
              aria-label="Vista previa - No es el día actual"
            >
              Vista Previa
            </span>
          )}
        </h3>
      </header>

      {/* Lista de actividades */}
      <div className="space-y-3 pb-10" role="list">
        {activities.map(activity => (
          <article
            key={activity.id}
            onClick={() => onActivitySelect(activity)}
            role="listitem"
            aria-label={`Actividad: ${activity.label} de ${activity.start} a ${activity.end}`}
            className={`
              flex items-center p-3 rounded-2xl border cursor-pointer 
              hover:scale-[1.01] transition-transform duration-200
              ${isDarkMode 
                ? 'border-slate-800 bg-slate-800/50 hover:bg-slate-800/70' 
                : 'border-slate-100 bg-white hover:bg-slate-50'
              }
              ${isCurrentActivity(activity) 
                ? 'ring-2 ring-offset-2 ring-blue-500 shadow-md' 
                : ''
              }
            `}
            tabIndex={0}
            onKeyDown={(e) => {
              // Permite seleccionar con teclado (accesibilidad)
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onActivitySelect(activity);
              }
            }}
          >
            {/* Indicador de color de la actividad */}
            <div 
              className="w-3 h-10 rounded-full mr-4 flex-shrink-0"
              style={{ backgroundColor: activity.color }}
              aria-hidden="true"
            />
            
            {/* Contenido de la actividad */}
            <div className="flex-1 min-w-0">
              {/* Cabecera: Título y horario */}
              <div className="flex justify-between mb-1">
                <h4 className="font-semibold text-sm truncate">
                  {activity.label}
                </h4>
                <time 
                  className="text-xs font-mono opacity-60 flex-shrink-0 ml-2"
                  dateTime={`${activity.start}/${activity.end}`}
                >
                  {activity.start} - {activity.end}
                </time>
              </div>
              
              {/* Descripción */}
              <p 
                className="text-xs opacity-60 line-clamp-1"
                title={activity.description}
              >
                {activity.description}
              </p>
            </div>

            {/* Indicador visual de actividad actual (solo para screen readers) */}
            {isCurrentActivity(activity) && (
              <span className="sr-only">Actividad actual en curso</span>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}