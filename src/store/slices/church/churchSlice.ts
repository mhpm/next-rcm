import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Churches } from '@/generated/prisma/browser';

// Tipo Church para el estado de Redux con fechas serializables
export type Church = Omit<Churches, 'createdAt' | 'updatedAt'> & {
  createdAt: string;
  updatedAt: string;
};

export interface ChurchState {
  currentChurch: Church | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ChurchState = {
  currentChurch: null,
  isLoading: false,
  error: null,
};

const churchSlice = createSlice({
  name: 'church',
  initialState,
  reducers: {
    setCurrentChurch: (state, action: PayloadAction<Church | Churches>) => {
      const church = action.payload;
      // Convertir fechas a strings si son objetos Date
      state.currentChurch = {
        ...church,
        createdAt:
          typeof church.createdAt === 'string'
            ? church.createdAt
            : church.createdAt.toISOString(),
        updatedAt:
          typeof church.updatedAt === 'string'
            ? church.updatedAt
            : church.updatedAt.toISOString(),
      };
      state.error = null;
    },
    clearCurrentChurch: (state) => {
      state.currentChurch = null;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    clearError: (state) => {
      state.error = null;
    },
    // Acción para inicializar desde headers/cookies
    initializeChurch: (
      state,
      action: PayloadAction<{ churchSlug?: string }>
    ) => {
      const { churchSlug } = action.payload;
      if (churchSlug) {
        // En un caso real, aquí harías una llamada a la API para obtener los datos completos
        // Por ahora, creamos un objeto básico
        const now = new Date().toISOString();
        state.currentChurch = {
          id: churchSlug,
          name: churchSlug.charAt(0).toUpperCase() + churchSlug.slice(1),
          slug: churchSlug,
          createdAt: now,
          updatedAt: now,
        };
      }
    },
  },
});

export const {
  setCurrentChurch,
  clearCurrentChurch,
  setLoading,
  setError,
  clearError,
  initializeChurch,
} = churchSlice.actions;

export default churchSlice.reducer;
