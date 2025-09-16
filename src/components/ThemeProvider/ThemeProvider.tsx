'use client';

import { createContext, useContext, useEffect, useState } from 'react';

interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Cargar el tema desde localStorage al inicializar
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('isdark');
      if (stored !== null) {
        const darkMode = JSON.parse(stored);
        setIsDark(darkMode);
        // Aplicar el tema inmediatamente
        document.documentElement.setAttribute(
          'data-theme',
          darkMode ? 'business' : 'cmyk'
        );
      }
    }
  }, []);

  useEffect(() => {
    // Guardar en localStorage y aplicar el tema cuando cambie
    if (typeof window !== 'undefined') {
      localStorage.setItem('isdark', JSON.stringify(isDark));
      document.documentElement.setAttribute(
        'data-theme',
        isDark ? 'business' : 'cmyk'
      );
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
