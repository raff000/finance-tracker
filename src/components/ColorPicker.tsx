import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import { Check } from "lucide-react";

const COLORS = [
  // Row 1 - Reds & Oranges
  { name: "Red", value: "#ef4444" },
  { name: "Rose", value: "#f43f5e" },
  { name: "Orange", value: "#f97316" },
  { name: "Amber", value: "#f59e0b" },
  // Row 2 - Yellows & Greens
  { name: "Yellow", value: "#eab308" },
  { name: "Lime", value: "#84cc16" },
  { name: "Green", value: "#22c55e" },
  { name: "Emerald", value: "#10b981" },
  // Row 3 - Teals & Blues
  { name: "Teal", value: "#14b8a6" },
  { name: "Cyan", value: "#06b6d4" },
  { name: "Sky", value: "#0ea5e9" },
  { name: "Blue", value: "#3b82f6" },
  // Row 4 - Indigos & Purples
  { name: "Indigo", value: "#6366f1" },
  { name: "Violet", value: "#8b5cf6" },
  { name: "Purple", value: "#a855f7" },
  { name: "Fuchsia", value: "#d946ef" },
  // Row 5 - Pinks & Neutrals
  { name: "Pink", value: "#ec4899" },
  { name: "Slate", value: "#64748b" },
  { name: "Stone", value: "#78716c" },
  { name: "Zinc", value: "#71717a" },
  // Row 6 - Darks
  { name: "Red Dark", value: "#b91c1c" },
  { name: "Orange Dark", value: "#c2410c" },
  { name: "Green Dark", value: "#15803d" },
  { name: "Blue Dark", value: "#1d4ed8" },
  // Row 7 - More Darks & Browns
  { name: "Indigo Dark", value: "#4338ca" },
  { name: "Purple Dark", value: "#7e22ce" },
  { name: "Brown", value: "#92400e" },
  { name: "Gray", value: "#4b5563" },
  // Row 8 - Additional Colors
  { name: "Coral", value: "#ff6b6b" },
  { name: "Mint", value: "#38d9a9" },
  { name: "Navy", value: "#1e3a5f" },
  { name: "Maroon", value: "#800020" },
];

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
}

export const ColorPicker = ({ value, onChange }: ColorPickerProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10 shrink-0"
          type="button"
        >
          <div
            className="h-5 w-5 rounded-full border border-border"
            style={{ backgroundColor: value }}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-2" align="start">
        <div className="grid grid-cols-4 gap-2">
          {COLORS.map(({ name, value: colorValue }) => (
            <button
              key={name}
              type="button"
              className="h-8 w-8 rounded-full border border-border flex items-center justify-center hover:scale-110 transition-transform"
              style={{ backgroundColor: colorValue }}
              onClick={() => {
                onChange(colorValue);
                setOpen(false);
              }}
              title={name}
            >
              {value === colorValue && (
                <Check className="h-4 w-4 text-white drop-shadow-md" />
              )}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};
