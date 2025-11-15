import React from "react";

interface MinimalLoaderProps {
  /**
   * Texto a mostrar debajo del spinner
   * @default "Cargando..."
   */
  text?: string;
  /**
   * Altura mínima del contenedor
   * @default "60vh"
   */
  minHeight?: string;
  /**
   * Tamaño del spinner
   * @default "md"
   */
  size?: "sm" | "md" | "lg";
  /**
   * Color del spinner
   * @default "green"
   */
  color?: "green" | "blue" | "gray" | "red";
}

const MinimalLoader: React.FC<MinimalLoaderProps> = ({
  text = "Cargando...",
  minHeight = "60vh",
  size = "md",
  color = "green",
}) => {
  // Configuración de tamaños
  const sizeClasses = {
    sm: "w-6 h-6 border-2",
    md: "w-8 h-8 border-2",
    lg: "w-12 h-12 border-[3px]",
  };

  // Configuración de colores
  const colorClasses = {
    green: "border-gray-200 border-t-green-600",
    blue: "border-gray-200 border-t-blue-600",
    gray: "border-gray-200 border-t-gray-600",
    red: "border-gray-200 border-t-red-600",
  };

  return (
    <div
      className="flex flex-col items-center justify-center"
      style={{ minHeight }}
    >
      {/* Spinner minimalista */}
      <div className="relative">
        <div
          className={`
            ${sizeClasses[size]} 
            ${colorClasses[color]} 
            loading
            loading-spinner
          `}
        />
      </div>

      {/* Texto opcional */}
      {text && (
        <p className="mt-4 text-sm text-base-content/70 animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
};

export default MinimalLoader;
