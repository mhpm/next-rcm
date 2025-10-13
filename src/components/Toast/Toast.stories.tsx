'use client';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Toast from './Toast';
import type { Notification } from '@/store/NotificationStore';

const meta: Meta<typeof Toast> = {
  title: 'Components/Toast/Toast',
  component: Toast,
  parameters: {
    layout: 'centered',
  },
  args: {
    onClose: () => {},
  },
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof Toast>;

const baseNotification: Omit<Notification, 'id'> = {
  type: 'info',
  title: 'Título de ejemplo',
  message: 'Este es un mensaje informativo.',
  duration: 5000,
  persistent: false,
};

export const Info: Story = {
  args: {
    notification: {
      id: 'story-info',
      ...baseNotification,
      type: 'info',
      message: 'Mensaje de información',
    },
  },
};

export const Success: Story = {
  args: {
    notification: {
      id: 'story-success',
      ...baseNotification,
      type: 'success',
      title: '¡Éxito!',
      message: 'Operación realizada correctamente',
    },
  },
};

export const Warning: Story = {
  args: {
    notification: {
      id: 'story-warning',
      ...baseNotification,
      type: 'warning',
      title: 'Advertencia',
      message: 'Revisa los datos ingresados',
    },
  },
};

export const Error: Story = {
  args: {
    notification: {
      id: 'story-error',
      ...baseNotification,
      type: 'error',
      title: 'Error',
      message: 'Ocurrió un problema inesperado',
    },
  },
};

export const Persistent: Story = {
  args: {
    notification: {
      id: 'story-persistent',
      ...baseNotification,
      type: 'info',
      title: 'Notificación fija',
      message: 'No se cierra automáticamente',
      persistent: true,
      duration: undefined,
    },
  },
};
