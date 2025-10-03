import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import React, { useState } from 'react';
import { fn } from 'storybook/test';
import { Modal } from './Modal';

const meta = {
  title: 'UI/Modal',
  component: Modal,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {},
  args: { onClose: fn() },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    children: 'Contenido del modal',
    title: 'Hola!',
  },
  render: (args) => {
    const [open, setOpen] = useState(false);

    return (
      <div>
        <button
          className="px-4 py-2 rounded-md bg-gray-200 text-gray-900 hover:bg-gray-300 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700"
          onClick={() => setOpen(true)}
        >
          Abrir Modal
        </button>
        <Modal
          {...args}
          open={open}
          onClose={() => {
            setOpen(false);
            args.onClose?.();
          }}
        >
          {args.children}
        </Modal>
      </div>
    );
  },
};
