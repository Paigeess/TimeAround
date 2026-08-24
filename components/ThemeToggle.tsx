"use client";

import type { ThemeMode } from "@/types/timezone";

interface ThemeToggleProps {
  value: ThemeMode;
  onChange: (mode: ThemeMode) => void;
}

const options: ThemeMode[] = ["light", "dark", "system"];

export default function ThemeToggle({ value, onChange }: ThemeToggleProps) {
  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-soft bg-white/40 p-1 backdrop-blur-sm dark:bg-slate-900/50">
      {options.map((option) => {
        const active = value === option;
        return (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            aria-label={`Set theme to ${option}`}
            className={[
              "rounded-full px-3 py-1.5 text-sm font-medium transition",
              active
                ? "bg-slate-900 text-white shadow-sm dark:bg-white dark:text-slate-900"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
            ].join(" ")}
          >
            {option === "system" ? "System" : option === "dark" ? "Dark" : "Light"}
          </button>
        );
      })}
    </div>
  );
}
