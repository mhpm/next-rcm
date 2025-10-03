'use client';

import React, { useEffect } from 'react';

type Props = {
  children: React.ReactNode;
  open?: boolean;
  onClose?: () => void;
  title?: string;
};

export const Modal = ({ children, open = false, onClose, title }: Props) => {
  // Close on ESC
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose?.();
    };
    if (open) window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  return (
    <div
      aria-hidden={!open}
      aria-modal="true"
      role="dialog"
      className={`fixed inset-0 z-50 ${open ? '' : 'pointer-events-none'}`}
    >
      {/* Overlay */}
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity ${
          open ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Modal content */}
      <div
        className={`relative mx-auto max-w-lg w-[90%] sm:w-auto p-6 bg-white dark:bg-neutral-900 rounded-lg shadow-lg transition-all duration-200 ${
          open ? 'opacity-100' : 'opacity-0'
        } top-1/2 -translate-y-1/2`}
      >
        {title && <h3 className="text-lg font-bold mb-3">{title}</h3>}
        <div>{children}</div>
        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-gray-200 text-gray-900 hover:bg-gray-300 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
