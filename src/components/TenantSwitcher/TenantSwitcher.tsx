"use client";

import { useState, useEffect } from 'react';
import { useTenant } from '@/hooks/useTenant';
import { getAllChurches, type Church } from '@/app/churches/actions/churches.actions';

interface TenantSwitcherProps {
  className?: string;
}

export function TenantSwitcher({ className = '' }: TenantSwitcherProps) {
  const { currentChurch, setChurch, clearChurch, isLoading } = useTenant();
  const [isOpen, setIsOpen] = useState(false);
  const [churches, setChurches] = useState<Church[]>([]);
  const [loadingChurches, setLoadingChurches] = useState(true);

  // Cargar iglesias desde la base de datos
  useEffect(() => {
    const loadChurches = async () => {
      try {
        const churchesData = await getAllChurches();
        setChurches(churchesData);
      } catch (error) {
        console.error('Error loading churches:', error);
        setChurches([]);
      } finally {
        setLoadingChurches(false);
      }
    };

    loadChurches();
  }, []);

  const handleTenantChange = async (church: Church) => {
    try {
      // Convertir fechas Date a string para compatibilidad con el store
      const churchForStore = {
        ...church,
        createdAt: church.createdAt.toISOString(),
        updatedAt: church.updatedAt.toISOString(),
      };
      
      await setChurch(churchForStore);
      setIsOpen(false);
      
      // Forzar recarga de datos en lugar de recargar toda la página
      window.dispatchEvent(new CustomEvent('tenantChanged', { 
        detail: { church: churchForStore } 
      }));
    } catch (error) {
      console.error('Error changing tenant:', error);
    }
  };

  const handleClearTenant = async () => {
    try {
      await clearChurch();
      setIsOpen(false);
      
      // Disparar evento de cambio de tenant
      window.dispatchEvent(new CustomEvent('tenantCleared'));
    } catch (error) {
      console.error('Error clearing tenant:', error);
    }
  };

  // No mostrar si no hay iglesias disponibles
  if (churches.length === 0 && !loadingChurches) {
    return null;
  }

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoading || loadingChurches}
        className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md border transition-colors disabled:opacity-50"
      >
        <span className={`w-2 h-2 rounded-full ${currentChurch ? 'bg-green-500' : 'bg-gray-400'}`}></span>
        <span className="font-medium">
          {loadingChurches ? 'Cargando...' : (currentChurch?.name || 'Seleccionar Iglesia')}
        </span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute top-full left-0 mt-1 w-64 bg-white border rounded-md shadow-lg z-20">
            <div className="p-2 border-b bg-gray-50">
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                Seleccionar Iglesia
              </p>
            </div>
            
            <div className="py-1">
              {loadingChurches ? (
                <div className="px-4 py-2 text-sm text-gray-500">
                  Cargando iglesias...
                </div>
              ) : churches.length === 0 ? (
                <div className="px-4 py-2 text-sm text-gray-500">
                  No hay iglesias disponibles
                </div>
              ) : (
                churches.map((church) => (
                  <button
                    key={church.slug}
                    onClick={() => handleTenantChange(church)}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${
                      currentChurch?.slug === church.slug
                        ? 'bg-blue-50 text-blue-700 font-medium'
                        : 'text-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${
                        currentChurch?.slug === church.slug ? 'bg-blue-500' : 'bg-gray-300'
                      }`}></span>
                      <div>
                        <div className="font-medium">{church.name}</div>
                        <div className="text-xs text-gray-500">{church.slug}</div>
                      </div>
                    </div>
                  </button>
                ))
              )}
              
              <hr className="my-1" />
              
              <button
                onClick={handleClearTenant}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  <span>Limpiar Selección</span>
                </div>
              </button>
            </div>
            
            <div className="p-2 border-t bg-gray-50">
              <p className="text-xs text-gray-500">
                Actual: <span className="font-mono">{currentChurch?.slug || 'ninguno'}</span>
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default TenantSwitcher;