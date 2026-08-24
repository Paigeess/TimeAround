import { getTimezoneOptionById } from '@/lib/timezone-data';

interface TimezoneTableProps {
  rows: Array<{
    id: string;
    localDate: string;
    localTime: string;
    abbreviation: string;
    utcOffset: string;
    relativeLabel: string;
  }>;
  onMove: (index: number, direction: -1 | 1) => void;
  onRemove: (timezoneId: string) => void;
}

export default function TimezoneTable({ rows, onMove, onRemove }: TimezoneTableProps) {
  return (
    <div className="overflow-hidden rounded-3xl border border-soft bg-white/80 shadow-sm dark:bg-slate-900/80">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-soft bg-slate-50 dark:bg-slate-800/80">
            <tr>
              <th className="px-4 py-3 font-medium text-slate-600 dark:text-slate-300">Location</th>
              <th className="px-4 py-3 font-medium text-slate-600 dark:text-slate-300">Date</th>
              <th className="px-4 py-3 font-medium text-slate-600 dark:text-slate-300">
                Local Time
              </th>
              <th className="px-4 py-3 font-medium text-slate-600 dark:text-slate-300">
                UTC Offset
              </th>
              <th className="px-4 py-3 font-medium text-slate-600 dark:text-slate-300">Timezone</th>
              <th className="px-4 py-3 text-right font-medium text-slate-600 dark:text-slate-300">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => {
              const option = getTimezoneOptionById(row.id);
              return (
                <tr
                  key={row.id}
                  className="border-b border-soft last:border-b-0 dark:border-slate-800"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{option.flag ?? '🕒'}</span>
                      <div>
                        <div className="font-medium text-slate-900 dark:text-slate-50">
                          {option.city}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          {option.country}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-200">{row.localDate}</td>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-200">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-900 dark:text-slate-50">
                        {row.localTime}
                      </span>
                      {row.relativeLabel ? (
                        <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-medium uppercase tracking-[0.1em] text-slate-700 dark:bg-slate-700 dark:text-slate-200">
                          {row.relativeLabel}
                        </span>
                      ) : null}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-200">{row.utcOffset}</td>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-200">
                    {row.abbreviation}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => onMove(index, -1)}
                        disabled={index === 0}
                        className="rounded-full border border-soft px-2 py-1 text-xs text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 dark:text-slate-300 dark:hover:bg-slate-800"
                        aria-label={`Move ${option.city} up`}
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        onClick={() => onMove(index, 1)}
                        disabled={index === rows.length - 1}
                        className="rounded-full border border-soft px-2 py-1 text-xs text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 dark:text-slate-300 dark:hover:bg-slate-800"
                        aria-label={`Move ${option.city} down`}
                      >
                        ↓
                      </button>
                      <button
                        type="button"
                        onClick={() => onRemove(row.id)}
                        className="rounded-full border border-red-200 px-2 py-1 text-xs text-red-600 transition hover:bg-red-50 dark:border-red-900/70 dark:text-red-400 dark:hover:bg-red-950/40"
                        aria-label={`Remove ${option.city}`}
                      >
                        Remove
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
