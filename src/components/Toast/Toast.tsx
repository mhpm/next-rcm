'use client';

import React, { useEffect, useState } from 'react';
import {
  RiCheckboxCircleLine,
  RiErrorWarningLine,
  RiInformationLine,
  RiAlertLine,
  RiCloseLine,
} from 'react-icons/ri';
import { Notification } from '@/store/NotificationStore';

interface ToastProps {
  notification: Notification;
  onClose: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ notification, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Animación de entrada
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => {
      onClose(notification.id);
    }, 300); // Duración de la animación de salida
  };

  const getToastClasses = () => {
    const baseClasses = `
      transform transition-all duration-300 ease-in-out
      bg-white shadow-xl rounded-lg pointer-events-auto
      ring-1 ring-black ring-opacity-5 overflow-hidden
      border border-gray-200 relative w-[300px] mb-4
    `;

    const visibilityClasses =
      isVisible && !isLeaving
        ? 'translate-x-0 opacity-100 scale-100'
        : 'translate-x-full opacity-0 scale-95';

    return `${baseClasses} ${visibilityClasses}`;
  };

  const getIcon = () => {
    const iconClasses = 'w-6 h-6';

    switch (notification.type) {
      case 'success':
        return (
          <RiCheckboxCircleLine className={`${iconClasses} text-green-400`} />
        );
      case 'error':
        return <RiErrorWarningLine className={`${iconClasses} text-red-400`} />;
      case 'warning':
        return <RiAlertLine className={`${iconClasses} text-yellow-400`} />;
      case 'info':
        return <RiInformationLine className={`${iconClasses} text-blue-400`} />;
      default:
        return null;
    }
  };

  const getProgressBarColor = () => {
    switch (notification.type) {
      case 'success':
        return 'bg-green-400';
      case 'error':
        return 'bg-red-400';
      case 'warning':
        return 'bg-yellow-400';
      case 'info':
        return 'bg-blue-400';
      default:
        return 'bg-gray-400';
    }
  };

  return (
    <div className={getToastClasses()}>
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">{getIcon()}</div>
          <div className="ml-3 w-0 flex-1 pt-0.5">
            {notification.title && (
              <p className="text-sm font-medium text-gray-900">
                {notification.title}
              </p>
            )}
            <p
              className={`text-sm text-gray-500 ${
                notification.title ? 'mt-1' : ''
              }`}
            >
              {notification.message}
            </p>
            {notification.action && (
              <div className="mt-3">
                <button
                  onClick={notification.action.onClick}
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:underline"
                >
                  {notification.action.label}
                </button>
              </div>
            )}
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              onClick={handleClose}
              className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <span className="sr-only">Cerrar</span>
              <RiCloseLine className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Barra de progreso para notificaciones con duración */}
      {!notification.persistent &&
        notification.duration &&
        notification.duration > 0 && (
          <div className="h-1 bg-gray-200">
            <div
              className={`h-full ${getProgressBarColor()} transition-all ease-linear`}
              style={{
                animation: `shrink ${notification.duration}ms linear forwards`,
              }}
            />
          </div>
        )}

      <style jsx>{`
        @keyframes shrink {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
    </div>
  );
};

export default Toast;
