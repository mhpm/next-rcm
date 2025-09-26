'use client';

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from 'react';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  title?: string;
  message: string;
  duration?: number;
  persistent?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id'>) => string;
  removeNotification: (id: string) => void;
  clearAllNotifications: () => void;
  // Métodos de conveniencia
  showSuccess: (
    message: string,
    title?: string,
    options?: Partial<Notification>
  ) => string;
  showError: (
    message: string,
    title?: string,
    options?: Partial<Notification>
  ) => string;
  showWarning: (
    message: string,
    title?: string,
    options?: Partial<Notification>
  ) => string;
  showInfo: (
    message: string,
    title?: string,
    options?: Partial<Notification>
  ) => string;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

interface NotificationProviderProps {
  children: ReactNode;
  maxNotifications?: number;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
  maxNotifications = 5,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const generateId = useCallback(() => {
    return `notification-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  }, []);

  const addNotification = useCallback(
    (notification: Omit<Notification, 'id'>) => {
      const id = generateId();
      const newNotification: Notification = {
        id,
        duration: 5000, // 5 segundos por defecto
        ...notification,
      };

      setNotifications((prev) => {
        const updated = [newNotification, ...prev];
        // Limitar el número máximo de notificaciones
        return updated.slice(0, maxNotifications);
      });

      // Auto-remover la notificación después del tiempo especificado
      if (
        !newNotification.persistent &&
        newNotification.duration &&
        newNotification.duration > 0
      ) {
        setTimeout(() => {
          removeNotification(id);
        }, newNotification.duration);
      }

      return id;
    },
    [generateId, maxNotifications, removeNotification]
  );

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Métodos de conveniencia
  const showSuccess = useCallback(
    (message: string, title?: string, options?: Partial<Notification>) => {
      return addNotification({
        type: 'success',
        title: title || '¡Éxito!',
        message,
        ...options,
      });
    },
    [addNotification]
  );

  const showError = useCallback(
    (message: string, title?: string, options?: Partial<Notification>) => {
      return addNotification({
        type: 'error',
        title: title || 'Error',
        message,
        duration: 8000, // Errores duran más tiempo
        ...options,
      });
    },
    [addNotification]
  );

  const showWarning = useCallback(
    (message: string, title?: string, options?: Partial<Notification>) => {
      return addNotification({
        type: 'warning',
        title: title || 'Advertencia',
        message,
        duration: 6000,
        ...options,
      });
    },
    [addNotification]
  );

  const showInfo = useCallback(
    (message: string, title?: string, options?: Partial<Notification>) => {
      return addNotification({
        type: 'info',
        title: title || 'Información',
        message,
        ...options,
      });
    },
    [addNotification]
  );

  const value: NotificationContextType = {
    notifications,
    addNotification,
    removeNotification,
    clearAllNotifications,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      'useNotifications must be used within a NotificationProvider'
    );
  }
  return context;
};
