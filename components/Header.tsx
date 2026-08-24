import ThemeToggle from "@/components/ThemeToggle";
import type { ThemeMode } from "@/types/timezone";

interface HeaderProps {
  theme: ThemeMode;
  onThemeChange: (mode: ThemeMode) => void;
}

export default function Header({ theme, onThemeChange }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-soft bg-white/70 backdrop-blur-xl dark:bg-slate-950/70">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-sm font-bold text-white shadow-sm dark:bg-white dark:text-slate-900">
            TZ
          </div>
          <div>
            <p className="text-[0.7rem] font-medium uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
              Timezone converter
            </p>
            <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-50">Timezone Converter</h1>
          </div>
        </div>

        <nav className="hidden items-center gap-5 text-sm text-slate-600 md:flex dark:text-slate-300">
          <button type="button" className="transition hover:text-slate-900 dark:hover:text-white">
            Meeting Planner
          </button>
        </nav>

        <ThemeToggle value={theme} onChange={onThemeChange} />
      </div>
    </header>
  );
}
