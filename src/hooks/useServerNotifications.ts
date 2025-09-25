'use client';

import { useNotifications } from '@/contexts/NotificationContext';
import { useCallback } from 'react';

export interface ServerActionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
    details?: unknown;
  };
}

export const useServerNotifications = () => {
  const { showSuccess, showError, showWarning, showInfo } = useNotifications();

  const handleServerAction = useCallback(async <T>(
    action: () => Promise<T>,
    options?: {
      successMessage?: string;
      errorMessage?: string;
      loadingMessage?: string;
      showSuccessNotification?: boolean;
      showErrorNotification?: boolean;
    }
  ): Promise<ServerActionResult<T>> => {
    const {
      successMessage = '¡Operación completada exitosamente!',
      errorMessage = 'Ocurrió un error inesperado',
      showSuccessNotification = true,
      showErrorNotification = true,
    } = options || {};

    try {
      const result = await action();
      
      if (showSuccessNotification) {
        showSuccess(successMessage);
      }

      return {
        success: true,
        data: result,
      };
    } catch (error: unknown) {
      console.error('Server action error:', error);
      
      let errorMsg = errorMessage;
      let errorCode = 'UNKNOWN_ERROR';
      let errorDetails = null;

      // Extraer información del error
      if (error instanceof Error) {
        errorMsg = error.message || errorMessage;
        
        // Si el error tiene propiedades adicionales (como nuestros errores personalizados)
        if ('code' in error) {
          errorCode = error.code as string;
        }
        if ('details' in error) {
          errorDetails = error.details;
        }
      } else if (typeof error === 'string') {
        errorMsg = error;
      }

      if (showErrorNotification) {
        showError(errorMsg, 'Error');
      }

      return {
        success: false,
        error: {
          message: errorMsg,
          code: errorCode,
          details: errorDetails,
        },
      };
    }
  }, [showSuccess, showError]);

  const notifySuccess = useCallback((message: string, title?: string) => {
    showSuccess(message, title);
  }, [showSuccess]);

  const notifyError = useCallback((message: string, title?: string) => {
    showError(message, title);
  }, [showError]);

  const notifyWarning = useCallback((message: string, title?: string) => {
    showWarning(message, title);
  }, [showWarning]);

  const notifyInfo = useCallback((message: string, title?: string) => {
    showInfo(message, title);
  }, [showInfo]);

  return {
    handleServerAction,
    notifySuccess,
    notifyError,
    notifyWarning,
    notifyInfo,
  };
};