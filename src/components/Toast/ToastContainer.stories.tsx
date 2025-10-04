'use client';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ToastContainer } from './index';
import { useNotificationStore } from '@/store/NotificationStore';
import { useEffect } from 'react';
import type { FC } from 'react';

const meta: Meta<typeof ToastContainer> = {
  title: 'Components/Toast/ToastContainer',
  component: ToastContainer,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    position: {
      control: 'select',
      options: [
        'top-right',
        'top-left',
        'bottom-right',
        'bottom-left',
        'top-center',
        'bottom-center',
      ],
    },
  },
  args: {
    position: 'top-right',
    usePortal: false,
  },
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof ToastContainer>;

const DebugPanel = () => {
  const { notifications, addNotification } = useNotificationStore();
  return (
    <div className="mt-4 text-sm text-gray-400">
      <div>Debug: count = {notifications.length}</div>
      <button
        className="btn btn-neutral mt-2"
        onClick={() =>
          addNotification({
            type: 'info',
            message: 'Debug add',
            title: 'Debug',
            persistent: true,
          })
        }
      >
        Debug addNotification
      </button>
    </div>
  );
};

const DemoButtons: FC = () => {
  const {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    clearAllNotifications,
  } = useNotificationStore();

  useEffect(() => {
    // Notificación de ejemplo al montar la story
    showInfo(
      'Storybook listo. Haz clic en los botones para mostrar toasts.',
      'Info'
    );
  }, [showInfo]);

  return (
    <div className="fixed inset-0 p-6">
      <div className="space-x-2">
        <button
          className="btn btn-success"
          onClick={() => showSuccess('Operación exitosa', '¡Éxito!')}
        >
          Success
        </button>
        <button
          className="btn btn-error"
          onClick={() => showError('Algo salió mal', 'Error')}
        >
          Error
        </button>
        <button
          className="btn btn-warning"
          onClick={() => showWarning('Revisa esto', 'Advertencia')}
        >
          Warning
        </button>
        <button
          className="btn btn-info"
          onClick={() => showInfo('Información útil', 'Info')}
        >
          Info
        </button>
        <button className="btn" onClick={() => clearAllNotifications()}>
          Clear All
        </button>
      </div>
      <DebugPanel />
    </div>
  );
};

export const Playground: Story = {
  render: (args) => (
    <>
      <DemoButtons />
      <ToastContainer {...args} />
    </>
  ),
};
