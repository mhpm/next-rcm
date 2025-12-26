'use client';

import { useNavigationLoader } from '@/hooks/useNavigationLoader';

const NavigationLoader = () => {
  const { isLoading } = useNavigationLoader();

  if (!isLoading) return null;

  return (
    <>
      {/* Barra de progreso superior */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-base-200">
        <div 
          className="h-full bg-gradient-to-r from-primary via-secondary to-accent"
          style={{
            animation: 'loading-progress 1.5s ease-in-out infinite'
          }}
        />
      </div>

      {/* Indicador flotante opcional */}
      {/* <div className="fixed top-4 right-4 z-50">
        <div className="flex items-center space-x-2 bg-base-100 shadow-lg rounded-lg px-4 py-2 border border-base-300">
          <div className="loading loading-spinner loading-sm text-primary"></div>
          <span className="text-sm font-medium text-base-content">
            Navegando...
          </span>
        </div>
      </div> */}

      <style jsx>{`
        @keyframes loading-progress {
          0% {
            transform: translateX(-100%);
            opacity: 0.6;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translateX(100%);
            opacity: 0.6;
          }
        }
      `}</style>
    </>
  );
};

export default NavigationLoader;