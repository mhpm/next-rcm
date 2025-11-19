'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useEffect, useState } from 'react';

interface QueryProviderProps {
  children: React.ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            gcTime: 10 * 60 * 1000, // 10 minutes
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  // Avoid SSR/client markup differences from Devtools by rendering after mount
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Escuchar cambios de church y limpiar/invalidate caché para forzar recarga
  useEffect(() => {
    const handleChurchChange = () => {
      // Limpiamos el caché para asegurar que todas las queries se refetch con el nuevo church
      // Esto es más seguro que invalidar selectivamente en apps multi-tenant
      queryClient.clear();
    };

    const handleChurchCleared = () => {
      queryClient.clear();
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('churchChanged', handleChurchChange);
      window.addEventListener('churchCleared', handleChurchCleared);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('churchChanged', handleChurchChange);
        window.removeEventListener('churchCleared', handleChurchCleared);
      }
    };
  }, [queryClient]);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {mounted && process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}