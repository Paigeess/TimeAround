'use client';

import { useEffect, useMemo, useState } from 'react';
import { filterTimezones, getSearchLocation } from '@/lib/timezone-data';
import { formatDisplayTime } from '@/lib/timezone';
import type { TimezoneOption } from '@/types/timezone';

interface TimezoneSearchProps {
  isOpen: boolean;
  value?: string;
  onClose: () => void;
  onSelect: (id: string) => void;
  selectedIds?: string[];
}

export default function TimezoneSearch({
  isOpen,
  value,
  onClose,
  onSelect,
  selectedIds = [],
}: TimezoneSearchProps) {
  const [query, setQuery] = useState('');
  const [now, setNow] = useState(() => new Date());

  const options = useMemo(() => filterTimezones(query), [query]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const tick = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(tick);
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-3xl border border-soft bg-white p-4 shadow-soft dark:bg-slate-900">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
              Add timezone
            </p>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-50">
              Search locations
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-soft px-2.5 py-1.5 text-sm text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Close
          </button>
        </div>

        <label className="mb-4 block">
          <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
            Search by city, country, or timezone
          </span>
          <input
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Try Tokyo, Japan, or Africa"
            className="w-full rounded-2xl border border-soft bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none ring-0 transition focus:border-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-50"
          />
        </label>

        <div className="max-h-[22rem] space-y-2 overflow-y-auto pr-1">
          {options.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
              No matching timezones found.
            </div>
          ) : (
            options.map((option: TimezoneOption) => {
              const isSelected = selectedIds.includes(option.id);
              const location = getSearchLocation(option, query);
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => {
                    if (!isSelected) {
                      onSelect(option.id);
                    }
                    onClose();
                  }}
                  className={[
                    'flex w-full items-center justify-between rounded-2xl border px-3 py-3 text-left transition',
                    isSelected
                      ? 'cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-500'
                      : 'border-soft bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800',
                  ].join(' ')}
                  disabled={isSelected}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{option.flag ?? '🕒'}</span>
                    <div>
                      <div className="text-sm font-medium text-slate-900 dark:text-slate-50">
                        {location.city}, {location.country}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">{option.id}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                      {formatDisplayTime(now, option.id, true)}
                    </div>
                    <div className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                      {isSelected ? 'Added' : 'Select'}
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
