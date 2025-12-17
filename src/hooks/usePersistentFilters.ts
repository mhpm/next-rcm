import { useState, useEffect } from "react";

export function usePersistentFilters<T>(key: string, initialFilters: T) {
  const [filters, setFilters] = useState<T>(() => {
    if (typeof window === "undefined") return initialFilters;
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : initialFilters;
    } catch (error) {
      console.error("Error reading filters from localStorage:", error);
      return initialFilters;
    }
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(key, JSON.stringify(filters));
    }
  }, [key, filters]);

  const clearFilters = () => {
    setFilters(initialFilters);
    if (typeof window !== "undefined") {
      localStorage.removeItem(key);
    }
  };

  return { filters, setFilters, clearFilters };
}
