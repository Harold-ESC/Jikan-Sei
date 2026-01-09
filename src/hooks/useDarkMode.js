/**
 * Hook personalizado: useDarkMode
 * 
 * Maneja la lógica del tema oscuro/claro con detección automática basada en
 * la hora del día y proporciona funciones para control manual.
 * 
 */

import { useState, useEffect } from 'react';

export function useDarkMode(now) {

  // ESTADO DEL TEMA
  const [isDarkMode, setIsDarkMode] = useState(false); // Tema claro por defecto

  // Efecto que actualiza el tema según la hora del día
  useEffect(() => {
    const hours = now.getHours();
    const shouldBeDark = hours >= 19 || hours < 6; // Tema oscuro durante la noche (7 PM a 6 AM)
    setIsDarkMode(shouldBeDark);
  }, [now]);


  // CONTROLADORES DEL TEMA
  const toggleTheme = () => setIsDarkMode(prev => !prev); // Alternador simple

  // RETORNO DEL HOOK
  
  return { 

    isDarkMode, // Estado actual del tema
    setIsDarkMode, // Setter para el estado del tema
    toggleTheme // Función para alternar el tema
  };
}