'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface ColumnVisibilityState {
  visibleColumns: Set<string>
  setVisibleColumns: (columns: Set<string>) => void
  toggleColumn: (columnKey: string) => void
  showAllColumns: (allColumnKeys: string[]) => void
  hideAllColumns: (allColumnKeys: string[]) => void
  initializeColumns: (defaultColumns: string[]) => void
}

// Helper function to convert Set to Array for JSON serialization
const setToArray = (set: Set<string>): string[] => Array.from(set)
const arrayToSet = (array: string[]): Set<string> => new Set(array)

// Safe storage for SSR to avoid localStorage access when window is undefined
const createSafeStorage = () => {
  if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
    return localStorage
  }
  const memory: Record<string, string> = {}
  return {
    getItem: (name: string) => (name in memory ? memory[name] : null),
    setItem: (name: string, value: string) => {
      memory[name] = value
    },
    removeItem: (name: string) => {
      delete memory[name]
    },
  } as Storage
}

export const useColumnVisibilityStore = create<ColumnVisibilityState>()(
  persist(
    (set, get) => ({
      visibleColumns: new Set<string>(),
      
      setVisibleColumns: (columns: Set<string>) => {
        set({ visibleColumns: new Set(columns) })
      },
      
      toggleColumn: (columnKey: string) => {
        set((state) => {
          const newVisibleColumns = new Set(state.visibleColumns)
          if (newVisibleColumns.has(columnKey)) {
            newVisibleColumns.delete(columnKey)
          } else {
            newVisibleColumns.add(columnKey)
          }
          return { visibleColumns: newVisibleColumns }
        })
      },
      
      showAllColumns: (allColumnKeys: string[]) => {
        set({ visibleColumns: new Set(allColumnKeys) })
      },
      
      hideAllColumns: (allColumnKeys: string[]) => {
        // Keep at least one column visible (first one)
        const firstColumn = allColumnKeys[0]
        set({ visibleColumns: new Set(firstColumn ? [firstColumn] : []) })
      },
      
      initializeColumns: (defaultColumns: string[]) => {
        const currentState = get()
        // Only initialize if no columns are set yet
        if (currentState.visibleColumns.size === 0) {
          set({ visibleColumns: new Set(defaultColumns) })
        }
      }
    }),
    {
      name: 'column-visibility-storage',
      storage: createJSONStorage(createSafeStorage),
      partialize: (state) => ({
        visibleColumns: setToArray(state.visibleColumns)
      }),
      onRehydrateStorage: () => (state) => {
        if (state && Array.isArray(state.visibleColumns)) {
          state.visibleColumns = arrayToSet(state.visibleColumns as unknown as string[])
        }
      }
    }
  )
)