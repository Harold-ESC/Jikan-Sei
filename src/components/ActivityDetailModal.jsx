/**
 * ActivityDetailModal Component
 * 
 * Modal que muestra información detallada de una actividad específica.
 * Se abre cuando el usuario selecciona una actividad desde el reloj o la lista.
 * Incluye información como descripción, duración, tipo y horario.
 * 
 */

import React from 'react';
import { X, Info, ChevronRight } from 'lucide-react';
import { calculateActivityDuration } from '../utils';

export function ActivityDetailModal({ activity, isDarkMode, onClose }) {

// VALIDACIÓN Y CÁLCULOS INICIALES
  if (!activity) return null; // Protección contra valores nulos
  const duration = calculateActivityDuration(activity); // Función utilitaria para calcular duración en horas

// RENDERIZADO
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Overlay de fondo con efecto de desenfoque, se cierra el modal al hacer clic en esta área */}
      <div 
        className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
        role="presentation"
      />
      
      {/* Contenedor principal del modal, responsivo: en móviles aparece desde abajo, en desktop centrado */}
      <div 
        className={`relative w-full max-w-sm rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl transform transition-all ${isDarkMode ? 'bg-slate-800 text-white' : 'bg-white text-slate-800'}`}
      >
        {/*Indicador de arrastre (solo en móvil), pequeña barra en la parte superior para indicar que se puede deslizar */}
        <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-6 opacity-50 sm:hidden" 
             aria-hidden="true"
        />

        {/* Botón de cierre, posicionado en la esquina superior derecha */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 opacity-50 hover:opacity-100"
          aria-label="Cerrar modal de detalles"
        >
          <X size={24} />
        </button>

        {/* Encabezado del modal: Icono y título de la actividad */}
        <div className="flex items-center gap-4 mb-6">
          {/* Círculo con inicial de la actividad, el color de fondo viene de la propiedad activity.color */}
          <div 
            className="w-16 h-16 rounded-2xl shadow-lg flex items-center justify-center text-white text-2xl font-bold"
            style={{ backgroundColor: activity.color }}
            aria-hidden="true"
          >
            {activity.label.charAt(0)}
          </div>

          {/* Información de título y horario */}
          <div>
            <h2 className="text-2xl font-bold leading-tight">
              {activity.label}
            </h2>
            <div 
              className="flex items-center gap-2 mt-1 opacity-70 font-mono text-sm"
              aria-label={`Horario: de ${activity.start} a ${activity.end}`}
            >
              <span>{activity.start}</span>
              <ChevronRight size={14} />
              <span>{activity.end}</span>
            </div>
          </div>
        </div>

        {/* Cuerpo del modal: Información detallada */}
        <div className="space-y-4">
          {/* Sección de descripción*/}
          <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-700/50' : 'bg-slate-50'}`}>
            <h3 className="text-xs uppercase font-bold tracking-wider opacity-50 mb-2 flex items-center gap-2">
              <Info size={14} />
              Descripción
            </h3>
            <p className="text-sm leading-relaxed opacity-90">
              {activity.description}
            </p>
          </div>

          {/* Sección de métricas: Duración y tipo, diseño en dos columnas para métricas clave  */}
          <div className="grid grid-cols-2 gap-3">
            {/* Card de duración */}
            <div className={`p-3 rounded-xl text-center ${isDarkMode ? 'bg-slate-700/50' : 'bg-slate-50'}`}>
              <span className="block text-xs uppercase opacity-50 mb-1">
                Duración
              </span>
              <span className="font-bold">
                {duration} h
              </span>
            </div>

            {/* Card de tipo de actividad */}
            <div className={`p-3 rounded-xl text-center ${isDarkMode ? 'bg-slate-700/50' : 'bg-slate-50'}`}>
              <span className="block text-xs uppercase opacity-50 mb-1">
                Tipo
              </span>
              <span className="font-bold capitalize">
                {activity.type}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}