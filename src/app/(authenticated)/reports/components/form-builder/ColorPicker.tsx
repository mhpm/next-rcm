import React from "react";
import { Label } from "@/components/ui/label";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const COLORS = [
  "#3b82f6", // blue
  "#ef4444", // red
  "#10b981", // green
  "#f59e0b", // orange
  "#8b5cf6", // purple
  "#ec4899", // pink
  "#06b6d4", // cyan
  "#6366f1", // violet
];

export function ColorPicker({
  selected,
  onChange,
}: {
  selected: string;
  onChange: (color: string) => void;
}) {
  return (
    <div className="space-y-3">
      <Label>Color del formulario</Label>
      <div className="flex flex-wrap gap-3 mt-4">
        {COLORS.map((color) => {
          const isSelected = selected === color;
          return (
            <button
              key={color}
              type="button"
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center transition-all focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                isSelected
                  ? "scale-110 shadow-md ring-2 ring-offset-2 ring-primary"
                  : "hover:scale-105 opacity-90 hover:opacity-100 border border-transparent hover:border-border"
              )}
              style={{ backgroundColor: color }}
              onClick={() => onChange(color)}
              aria-label={`Select color ${color}`}
            >
              {isSelected && (
                <Check
                  className="w-5 h-5 text-white drop-shadow-md"
                  strokeWidth={3}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
