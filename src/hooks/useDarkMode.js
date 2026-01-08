import { useState, useEffect } from 'react';

export function useDarkMode(now) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const hours = now.getHours();
    setIsDarkMode(hours >= 19 || hours < 6);
  }, [now]);

  const toggleTheme = () => setIsDarkMode(prev => !prev);

  return { isDarkMode, setIsDarkMode, toggleTheme };
}