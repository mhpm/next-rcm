'use client';

import { useRef, useEffect } from 'react';
import { Provider } from 'react-redux';
import { makeStore, AppStore } from '@/store';
import { initializeTenant } from '@/store/tenantSlice';

interface StoreProviderProps {
  children: React.ReactNode;
}

export default function StoreProvider({ children }: StoreProviderProps) {
  const storeRef = useRef<AppStore | undefined>(undefined);
  
  if (!storeRef.current) {
    // Crear el store
    storeRef.current = makeStore();
  }

  useEffect(() => {
    if (typeof window !== 'undefined' && storeRef.current) {
      // En el cliente, intentar obtener desde localStorage o cookies
      const savedChurchSlug = localStorage.getItem('church-slug');
      if (savedChurchSlug) {
        storeRef.current.dispatch(initializeTenant({ churchSlug: savedChurchSlug }));
      } else {
        // Intentar obtener desde cookies
        const cookieChurchSlug = document.cookie
          .split('; ')
          .find(row => row.startsWith('church-slug='))
          ?.split('=')[1];
        
        if (cookieChurchSlug) {
          storeRef.current.dispatch(initializeTenant({ churchSlug: cookieChurchSlug }));
        } else {
          // Valor por defecto para desarrollo
          storeRef.current.dispatch(initializeTenant({ churchSlug: 'demo' }));
        }
      }
    }
  }, []);

  return <Provider store={storeRef.current}>{children}</Provider>;
}