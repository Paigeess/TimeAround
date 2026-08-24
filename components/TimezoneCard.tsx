import { getTimezoneOptionById } from "@/lib/timezone-data";

interface TimezoneCardProps {
  id: string;
  localDate: string;
  localTime: string;
  abbreviation: string;
  utcOffset: string;
  relativeLabel: string;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
}

export default function TimezoneCard({
  id,
  localDate,
  localTime,
  abbreviation,
  utcOffset,
  relativeLabel,
  onMoveUp,
  onMoveDown,
  onRemove
}: TimezoneCardProps) {
  const option = getTimezoneOptionById(id);

  return (
    <div className="rounded-3xl border border-soft bg-white/80 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft dark:bg-slate-900/80">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{option.flag ?? "🕒"}</span>
          <div>
            <p className="text-lg font-semibold text-slate-900 dark:text-slate-50">{option.city}</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">{option.country}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onMoveUp}
            className="rounded-full border border-soft px-2 py-1 text-xs text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            aria-label={`Move ${option.city} up`}
          >
            ↑
          </button>
          <button
            type="button"
            onClick={onMoveDown}
            className="rounded-full border border-soft px-2 py-1 text-xs text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            aria-label={`Move ${option.city} down`}
          >
            ↓
          </button>
          <button
            type="button"
            onClick={onRemove}
            className="rounded-full border border-red-200 px-2 py-1 text-xs text-red-600 transition hover:bg-red-50 dark:border-red-900/70 dark:text-red-400 dark:hover:bg-red-950/40"
            aria-label={`Remove ${option.city}`}
          >
            Remove
          </button>
        </div>
      </div>

      <div className="mt-4 flex items-end justify-between gap-6">
        <div>
          <div className="text-4xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">{localTime}</div>
          <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">{localDate}</div>
        </div>

        <div className="text-right text-sm text-slate-600 dark:text-slate-300">
          <div className="font-medium">{abbreviation}</div>
          <div>{utcOffset}</div>
        </div>
      </div>

      {relativeLabel ? (
        <div className="mt-3 inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-200">
          {relativeLabel}
        </div>
      ) : null}
    </div>
  );
}
