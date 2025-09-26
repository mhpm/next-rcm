'use client';

import React from 'react';
import { useNotificationStore } from '@/store/NotificationStore';

export default function TestToastPage() {
  const { showSuccess, showError, showWarning, showInfo, notifications } =
    useNotificationStore();

  const handleTestSuccess = () => {
    showSuccess('¡Esta es una notificación de éxito!', '¡Éxito!');
  };

  const handleTestError = () => {
    showError('Esta es una notificación de error', 'Error');
  };

  const handleTestWarning = () => {
    showWarning('Esta es una notificación de advertencia', 'Advertencia');
  };

  const handleTestInfo = () => {
    showInfo('Esta es una notificación informativa', 'Información');
  };

  const handleTestPersistent = () => {
    showSuccess(
      'Esta notificación no se cierra automáticamente',
      'Persistente',
      {
        persistent: true,
      }
    );
  };

  const handleTestWithAction = () => {
    showInfo('Notificación con acción', 'Con Acción', {
      action: {
        label: 'Hacer algo',
        onClick: () => alert('¡Acción ejecutada!'),
      },
    });
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Test de Notificaciones Toast</h1>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <button
          onClick={handleTestSuccess}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
        >
          Test Success
        </button>

        <button
          onClick={handleTestError}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
        >
          Test Error
        </button>

        <button
          onClick={handleTestWarning}
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded"
        >
          Test Warning
        </button>

        <button
          onClick={handleTestInfo}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          Test Info
        </button>

        <button
          onClick={handleTestPersistent}
          className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded"
        >
          Test Persistente
        </button>

        <button
          onClick={handleTestWithAction}
          className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded"
        >
          Test Con Acción
        </button>
      </div>

      <div className="bg-gray-100 p-4 rounded">
        <h2 className="text-xl font-semibold mb-4">
          Estado de Notificaciones:
        </h2>
        <p className="mb-2">
          Número de notificaciones activas: {notifications.length}
        </p>

        {notifications.length > 0 && (
          <div>
            <h3 className="font-medium mb-2">Notificaciones actuales:</h3>
            <ul className="list-disc list-inside">
              {notifications.map((notification) => (
                <li key={notification.id} className="text-sm">
                  [{notification.type}] {notification.title}:{' '}
                  {notification.message}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
