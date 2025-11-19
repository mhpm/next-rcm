import { useAppSelector, useAppDispatch } from "@/store";
import {
  selectCurrentChurch,
  selectChurchId,
  selectChurchSlug,
  selectChurchLoading,
  selectChurchError,
  selectHasChurch,
} from "@/store/slices/church/churchSelector";
import {
  setCurrentChurch,
  clearCurrentChurch,
  setLoading,
  setError,
  clearError,
  initializeChurch,
  Church,
} from "@/store/slices/church/churchSlice";
import { useCallback } from "react";

export const useChurch = () => {
  const dispatch = useAppDispatch();
  const currentChurch = useAppSelector(selectCurrentChurch);
  const churchId = useAppSelector(selectChurchId);
  const isLoading = useAppSelector(selectChurchLoading);
  const error = useAppSelector(selectChurchError);
  const hasChurch = useAppSelector(selectHasChurch);

  const setChurch = useCallback(
    (church: Church) => {
      dispatch(setCurrentChurch(church));
      // Guardar en localStorage para persistencia
      if (typeof window !== "undefined") {
        localStorage.setItem("church-slug", church.slug);
        // También establecer cookie para el servidor
        document.cookie = `church-slug=${church.slug}; path=/; max-age=31536000`; // 1 año
      }
    },
    [dispatch]
  );

  const clearChurch = useCallback(() => {
    dispatch(clearCurrentChurch());
    if (typeof window !== "undefined") {
      localStorage.removeItem("church-slug");
      document.cookie =
        "church-slug=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
  }, [dispatch]);

  const initialize = useCallback(
    (churchSlug?: string) => {
      dispatch(initializeChurch({ churchSlug }));
    },
    [dispatch]
  );

  const setLoadingState = useCallback(
    (loading: boolean) => {
      dispatch(setLoading(loading));
    },
    [dispatch]
  );

  const setErrorState = useCallback(
    (errorMessage: string) => {
      dispatch(setError(errorMessage));
    },
    [dispatch]
  );

  const clearErrorState = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    currentChurch,
    churchId,
    isLoading,
    error,

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

export const useHasChurch = () => {
  return useAppSelector(selectHasChurch);
};

export const useRequiredChurchId = () => {
  const churchId = useAppSelector(selectChurchId);

  if (!churchId) {
    throw new Error(
      "Church ID is required but not available. Make sure church is properly initialized."
    );
  }

  return churchId;
};
