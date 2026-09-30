import { useState } from "react";
import { MOODS } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
export function MoodSelector({ value, onChange, size = "md" }) {
  const [internal, setInternal] = useState(value);
  const selected = value ?? internal;
  const emojiSize = size === "lg" ? "text-4xl" : size === "sm" ? "text-2xl" : "text-3xl";
  return (
    <div className="flex justify-between items-center gap-2">
      {MOODS.map((m) => {
        const active = selected === m.id;
        return (
          <button
            key={m.id}
            type="button"
            onClick={() => {
              setInternal(m.id);
              onChange?.(m.id);
            }}
            className={cn(
              "flex flex-col items-center gap-1.5 group flex-1 py-2 rounded-2xl transition-all",
              active && "bg-muted",
            )}
          >
            <span
              className={cn(
                emojiSize,
                "transition-all duration-300",
                active
                  ? "scale-110"
                  : "grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100",
              )}
            >
              {m.emoji}
            </span>
            <span className={cn("text-[10px] font-semibold uppercase tracking-wider", m.color)}>
              {m.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
