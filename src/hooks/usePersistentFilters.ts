import { useState, useEffect, useCallback } from "react";

/**
 * Hook to persist filters in localStorage.
 * 
 * @param key The localStorage key to use (e.g., 'members-filters')
 * @param initialFilters Default filters (usually empty object)
 * @returns An object containing the filters, a setter, and a clear function.
 */
export function usePersistentFilters<T extends Record<string, any>>(
  key: string,
  initialFilters: T = {} as T
) {
  const [filters, setFilters] = useState<T>(initialFilters);
  // Add a loaded flag if you want to delay rendering until filters are loaded
  // but usually for filters it's fine to start empty and update.

  useEffect(() => {
    // Load from localStorage on mount
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(key);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setFilters(parsed);
        } catch (e) {
          console.error(`Error parsing filters for key ${key}`, e);
          localStorage.removeItem(key);
        }
      }
    }
  }, [key]);

  const setPersistentFilters = useCallback((newFilters: T) => {
    setFilters(newFilters);
    if (typeof window !== "undefined") {
      if (Object.keys(newFilters).length > 0) {
        localStorage.setItem(key, JSON.stringify(newFilters));
      } else {
        localStorage.removeItem(key);
      }
    }
  }, [key]);

  const clearFilters = useCallback(() => {
    setFilters({} as T);
    if (typeof window !== "undefined") {
      localStorage.removeItem(key);
    }
  }, [key]);

  return {
    filters,
    setFilters: setPersistentFilters,
    clearFilters,
  };
}
