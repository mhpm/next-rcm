"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useTenant } from "@/hooks/useTenant";
import {
  getAllChurches,
  type Church,
} from "@/app/churches/actions/churches.actions";

interface TenantSwitcherProps {
  className?: string;
}

export function TenantSwitcher({ className = "" }: TenantSwitcherProps) {
  const { currentChurch, setChurch, clearChurch, isLoading } = useTenant();
  const [churches, setChurches] = useState<Church[]>([]);
  const [loadingChurches, setLoadingChurches] = useState(true);
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const router = useRouter();

  // Cargar iglesias desde la base de datos
  useEffect(() => {
    const loadChurches = async () => {
      try {
        const churchesData = await getAllChurches();
        setChurches(churchesData);
      } catch (error) {
        console.error("Error loading churches:", error);
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

      // Cerrar el dropdown
      if (detailsRef.current) {
        detailsRef.current.open = false;
      }

      // Forzar recarga de datos en lugar de recargar toda la página
      window.dispatchEvent(
        new CustomEvent("tenantChanged", {
          detail: { church: churchForStore },
        })
      );

      // Refrescar el router para re-renderizar Server Components y Server Actions
      try {
        router.refresh();
      } catch (e) {
        console.warn("router.refresh failed or not available:", e);
      }
    } catch (error) {
      console.error("Error changing tenant:", error);
    }
  };

  const handleClearTenant = async () => {
    try {
      await clearChurch();

      // Cerrar el dropdown
      if (detailsRef.current) {
        detailsRef.current.open = false;
      }

      // Disparar evento de cambio de tenant
      window.dispatchEvent(new CustomEvent("tenantCleared"));

      // Refrescar el router para re-renderizar Server Components y Server Actions
      try {
        router.refresh();
      } catch (e) {
        console.warn("router.refresh failed or not available:", e);
      }
    } catch (error) {
      console.error("Error clearing tenant:", error);
    }
  };

  // No mostrar si no hay iglesias disponibles
  if (churches.length === 0 && !loadingChurches) {
    return null;
  }

  return (
    <details className={`dropdown dropdown-end ${className}`} ref={detailsRef}>
      <summary
        className={`btn btn-sm m-1 flex items-center gap-2 ${
          isLoading || loadingChurches ? "btn-disabled" : ""
        }`}
      >
        <span
          className={`w-2 h-2 rounded-full ${
            currentChurch ? "bg-success" : "bg-base-300"
          }`}
        ></span>
        <span className="font-medium">
          {loadingChurches
            ? "Cargando..."
            : currentChurch?.name || "Seleccionar Iglesia"}
        </span>
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </summary>

      <ul className="menu dropdown-content bg-base-100 rounded-box z-1 w-64 p-2 shadow-lg border border-base-300">
        {/* Header */}
        <li className="menu-title">
          <span className="text-xs font-semibold text-base-content/60 uppercase tracking-wide">
            Seleccionar Iglesia
          </span>
        </li>

        {/* Content */}
        {loadingChurches ? (
          <li>
            <span className="text-sm text-base-content/60 cursor-default">
              Cargando iglesias...
            </span>
          </li>
        ) : churches.length === 0 ? (
          <li>
            <span className="text-sm text-base-content/60 cursor-default">
              No hay iglesias disponibles
            </span>
          </li>
        ) : (
          churches.map((church) => (
            <li key={church.slug}>
              <button
                onClick={() => handleTenantChange(church)}
                className={`flex items-center gap-2 ${
                  currentChurch?.slug === church.slug
                    ? "active text-primary-content"
                    : ""
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    currentChurch?.slug === church.slug
                      ? "bg-success"
                      : "bg-base-300"
                  }`}
                ></span>
                <div className="flex flex-col items-start">
                  <div className="font-medium">{church.name}</div>
                  <div className="text-xs opacity-60">{church.slug}</div>
                </div>
              </button>
            </li>
          ))
        )}

        {/* Divider */}
        <li>
          <hr className="my-1" />
        </li>

        {/* Clear Selection */}
        <li>
          <button
            onClick={handleClearTenant}
            className="text-error hover:bg-error hover:text-error-content"
          >
            <span className="w-2 h-2 bg-error rounded-full"></span>
            <span>Limpiar Selección</span>
          </button>
        </li>

        {/* Footer */}
        <li className="menu-title mt-2">
          <span className="text-xs text-base-content/40">
            Actual:{" "}
            <span className="font-mono">
              {currentChurch?.slug || "ninguno"}
            </span>
          </span>
        </li>
      </ul>
    </details>
  );
}

export default TenantSwitcher;
