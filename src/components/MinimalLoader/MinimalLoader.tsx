import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

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
   * Color del spinner (Ignorado si se usa className para color)
   * @default "green"
   */
  color?: "green" | "blue" | "gray" | "red";
  className?: string;
}

const MinimalLoader: React.FC<MinimalLoaderProps> = ({
  text = "Cargando...",
  minHeight = "60vh",
  size = "md",
  color = "green",
  className,
}) => {
  // Configuración de tamaños
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  // Configuración de colores
  const colorClasses = {
    green: "text-green-600",
    blue: "text-blue-600",
    gray: "text-gray-600",
    red: "text-red-600",
  };

  return (
    <div
      className={cn("flex flex-col items-center justify-center", className)}
      style={{ minHeight }}
    >
      <Loader2
        className={cn(
          "animate-spin",
          sizeClasses[size],
          colorClasses[color]
        )}
      />

      {/* Texto opcional */}
      {text && (
        <p className="mt-4 text-sm text-muted-foreground animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
};

export default MinimalLoader;
