"use client";

import { createContext, useContext, useEffect, useState } from "react";

interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Load theme from localStorage on initialization
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("isdark");
      if (stored !== null) {
        const darkMode = JSON.parse(stored);
        setIsDark(darkMode);
        // Apply theme immediately
        document.documentElement.setAttribute(
          "data-theme",
          darkMode ? "darkness" : "shine"
        );
      }
    }
  }, []);

  useEffect(() => {
    // Save to localStorage and apply theme when it changes
    if (typeof window !== "undefined") {
      localStorage.setItem("isdark", JSON.stringify(isDark));
      document.documentElement.setAttribute(
        "data-theme",
        isDark ? "darkness" : "shine"
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
