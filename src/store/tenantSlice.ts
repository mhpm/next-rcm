import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Churches } from '@prisma/client';

// Tipo Church para el estado de Redux con fechas serializables
export type Church = Omit<Churches, 'createdAt' | 'updatedAt'> & {
  createdAt: string;
  updatedAt: string;
};

interface TenantState {
  currentChurch: Church | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: TenantState = {
  currentChurch: null,
  isLoading: false,
  error: null,
};

const tenantSlice = createSlice({
  name: 'tenant',
  initialState,
  reducers: {
    setCurrentChurch: (state, action: PayloadAction<Church | Churches>) => {
      const church = action.payload;
      // Convertir fechas a strings si son objetos Date
      state.currentChurch = {
        ...church,
        createdAt: typeof church.createdAt === 'string' ? church.createdAt : church.createdAt.toISOString(),
        updatedAt: typeof church.updatedAt === 'string' ? church.updatedAt : church.updatedAt.toISOString(),
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
    initializeTenant: (state, action: PayloadAction<{ churchSlug?: string }>) => {
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
  initializeTenant,
} = tenantSlice.actions;

export default tenantSlice.reducer;

// Selectores
export const selectCurrentChurch = (state: { tenant: TenantState }) => state.tenant.currentChurch;
export const selectChurchId = (state: { tenant: TenantState }) => state.tenant.currentChurch?.id;
export const selectChurchSlug = (state: { tenant: TenantState }) => state.tenant.currentChurch?.slug;
export const selectTenantLoading = (state: { tenant: TenantState }) => state.tenant.isLoading;
export const selectTenantError = (state: { tenant: TenantState }) => state.tenant.error;
export const selectHasTenant = (state: { tenant: TenantState }) => !!state.tenant.currentChurch;