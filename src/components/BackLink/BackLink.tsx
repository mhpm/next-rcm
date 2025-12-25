"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { RiArrowLeftLine } from "react-icons/ri";

type BackLinkProps = {
  text?: string; // Texto a mostrar junto a la flecha
  className?: string; // Estilos adicionales
  fallbackHref?: string; // Ruta a usar si no hay historial
  showIcon?: boolean; // Mostrar/ocultar ícono
  onClick?: () => void; // Callback opcional
};

/**
 * Componente reusable para volver a la página anterior.
 * - Si existe historial, usa router.back().
 * - Si no hay historial, navega al fallbackHref (por defecto '/').
 */
export default function BackLink({
  text = "Volver atrás",
  className = "",
  fallbackHref = "/",
  showIcon = true,
  onClick,
}: BackLinkProps) {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      onClick?.();
    } finally {
      if (typeof window !== "undefined" && window.history.length > 1) {
        router.back();
      } else {
        router.push(fallbackHref);
      }
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Volver"
      className={
        "inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline" +
        className
      }
    >
      {showIcon && <RiArrowLeftLine className="h-5 w-5" aria-hidden="true" />}
      <span>{text}</span>
    </button>
  );
}
