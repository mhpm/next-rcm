'use client';

import { create } from 'zustand';
import { generateUUID } from '@/lib/uuid';

export interface NotificationAction {
  label: string;
  onClick: () => void;
}

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  title?: string;
  duration?: number;
  persistent?: boolean;
  action?: NotificationAction;
}

interface NotificationState {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id'>) => string;
  removeNotification: (id: string) => void;
  clearAllNotifications: () => void;
  showSuccess: (message: string, title?: string, options?: Partial<Notification>) => string;
  showError: (message: string, title?: string, options?: Partial<Notification>) => string;
  showWarning: (message: string, title?: string, options?: Partial<Notification>) => string;
  showInfo: (message: string, title?: string, options?: Partial<Notification>) => string;
}

const generateId = () => {
  return `notification-${generateUUID()}`;
};

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],

  addNotification: (notification) => {
    const id = generateId();
    const newNotification: Notification = {
      id,
      duration: 5000, // 5 segundos por defecto
      ...notification,
    };

    set((state) => ({
      notifications: [newNotification, ...state.notifications.slice(0, 4)], // Máximo 5 notificaciones
    }));

    // Auto-remover la notificación después del tiempo especificado
    if (!newNotification.persistent && newNotification.duration && newNotification.duration > 0) {
      setTimeout(() => {
        get().removeNotification(id);
      }, newNotification.duration);
    }

    return id;
  },

  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter((notification) => notification.id !== id),
    }));
  },

  clearAllNotifications: () => {
    set({ notifications: [] });
  },

  showSuccess: (message, title = '¡Éxito!', options = {}) => {
    return get().addNotification({
      type: 'success',
      title,
      message,
      ...options,
    });
  },

  showError: (message, title = 'Error', options = {}) => {
    return get().addNotification({
      type: 'error',
      title,
      message,
      duration: 8000, // Errores duran más tiempo
      ...options,
    });
  },

  showWarning: (message, title = 'Advertencia', options = {}) => {
    return get().addNotification({
      type: 'warning',
      title,
      message,
      duration: 6000,
      ...options,
    });
  },

  showInfo: (message, title = 'Información', options = {}) => {
    return get().addNotification({
      type: 'info',
      title,
      message,
      ...options,
    });
  },
}));
