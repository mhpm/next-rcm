import { useAppSelector, useAppDispatch } from '@/store';
import {
  selectCurrentChurch,
  selectChurchId,
  selectChurchSlug,
  selectTenantLoading,
  selectTenantError,
  selectHasTenant,
  setCurrentChurch,
  clearCurrentChurch,
  setLoading,
  setError,
  clearError,
  initializeTenant,
  Church,
} from '@/store/tenantSlice';
import { useCallback } from 'react';

export const useTenant = () => {
  const dispatch = useAppDispatch();
  const currentChurch = useAppSelector(selectCurrentChurch);
  const churchId = useAppSelector(selectChurchId);
  const isLoading = useAppSelector(selectTenantLoading);
  const error = useAppSelector(selectTenantError);
  const hasTenant = useAppSelector(selectHasTenant);
  const hasChurch = hasTenant; // Alias para compatibilidad

  const setChurch = useCallback((church: Church) => {
    dispatch(setCurrentChurch(church));
    // Guardar en localStorage para persistencia
    if (typeof window !== 'undefined') {
      localStorage.setItem('church-slug', church.slug);
      // También establecer cookie para el servidor
      document.cookie = `church-slug=${church.slug}; path=/; max-age=31536000`; // 1 año
    }
  }, [dispatch]);

  const clearChurch = useCallback(() => {
    dispatch(clearCurrentChurch());
    if (typeof window !== 'undefined') {
      localStorage.removeItem('church-slug');
      document.cookie = 'church-slug=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    }
  }, [dispatch]);

  const initialize = useCallback((churchSlug?: string) => {
    dispatch(initializeTenant({ churchSlug }));
  }, [dispatch]);

  const setLoadingState = useCallback((loading: boolean) => {
    dispatch(setLoading(loading));
  }, [dispatch]);

  const setErrorState = useCallback((errorMessage: string) => {
    dispatch(setError(errorMessage));
  }, [dispatch]);

  const clearErrorState = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    currentChurch,
    churchId,
    isLoading,
    error,
    hasTenant,
    hasChurch,
    setChurch,
    clearChurch,
    initialize,
    setLoading: setLoadingState,
    setError: setErrorState,
    clearError: clearErrorState,
  };
};

export const useChurchId = () => {
  return useAppSelector(selectChurchId);
};

export const useChurchSlug = () => {
  return useAppSelector(selectChurchSlug);
};

export const useHasTenant = () => {
  return useAppSelector(selectHasTenant);
};

export const useRequiredChurchId = () => {
  const churchId = useAppSelector(selectChurchId);
  
  if (!churchId) {
    throw new Error('Church ID is required but not available. Make sure tenant is properly initialized.');
  }
  
  return churchId;
};