"use client";

import { useMemo, useState } from "react";
import { getTimezoneById } from "@/lib/timezone-data";
import { getDisplayTime } from "@/lib/timezone";
import type { TimeFormat } from "@/types/timezone";
import TimezoneSearch from "@/components/TimezoneSearch";

interface SourceTimeSelectorProps {
  timezone: string;
  date: string;
  time: string;
  timeFormat: TimeFormat;
  displayDate: string;
  onTimezoneChange: (timezone: string) => void;
  onDateChange: (date: string) => void;
  onTimeChange: (time: string) => void;
  onTimeFormatChange: (format: TimeFormat) => void;
  onUseMyTimezone: () => void;
  isLive: boolean;
  onLiveToggle: (enabled: boolean) => void;
}

export default function SourceTimeSelector({
  timezone,
  date,
  time,
  timeFormat,
  displayDate,
  onTimezoneChange,
  onDateChange,
  onTimeChange,
  onTimeFormatChange,
  onUseMyTimezone,
  isLive,
  onLiveToggle
}: SourceTimeSelectorProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const timezoneOption = useMemo(() => getTimezoneById(timezone), [timezone]);

  return (
    <div className="rounded-[2rem] border border-soft bg-white/80 p-4 shadow-soft backdrop-blur-sm dark:bg-slate-900/80 sm:p-6">
      <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">Source time</p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">Your Time</h2>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <label className="inline-flex items-center gap-2 rounded-full border border-soft bg-slate-50 px-3 py-2 text-sm dark:bg-slate-800">
            <input
              type="checkbox"
              checked={isLive}
              onChange={(event) => onLiveToggle(event.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-500"
            />
            <span className="font-medium text-slate-700 dark:text-slate-200">Live</span>
          </label>
          <button
            type="button"
            onClick={onUseMyTimezone}
            className="rounded-full border border-soft bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-200"
          >
            Use My Timezone
          </button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr_1fr]">
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Timezone</span>
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="flex w-full items-center justify-between rounded-2xl border border-soft bg-slate-50 px-3 py-3 text-left text-slate-900 transition hover:border-slate-300 dark:bg-slate-800 dark:text-slate-50"
          >
            <span className="flex items-center gap-3">
              <span className="text-xl">{timezoneOption.flag ?? "🕒"}</span>
              <span>
                <span className="block text-sm font-medium">{timezoneOption.city}, {timezoneOption.country}</span>
              </span>
            </span>
            <span className="text-xs font-medium uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">Select</span>
          </button>
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Date</span>
          <input
            type="date"
            value={date}
            onChange={(event) => onDateChange(event.target.value)}
            className="w-full rounded-2xl border border-soft bg-slate-50 px-3 py-3 text-slate-900 outline-none transition focus:border-slate-400 dark:bg-slate-800 dark:text-slate-50"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Time</span>
          <input
            type="time"
            value={time}
            onChange={(event) => onTimeChange(event.target.value)}
            className="w-full rounded-2xl border border-soft bg-slate-50 px-3 py-3 text-slate-900 outline-none transition focus:border-slate-400 dark:bg-slate-800 dark:text-slate-50"
          />
        </label>
      </div>

      <div className="mt-5 flex flex-col gap-4 rounded-2xl border border-soft bg-slate-50 p-4 dark:bg-slate-800/80 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-sm text-slate-500 dark:text-slate-400">{timezoneOption.city}, {timezoneOption.country}</div>
          <div className="mt-1 text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
            {getDisplayTime(time, timeFormat)}
          </div>
          <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">{displayDate}</div>
        </div>

        <div className="flex items-center gap-2 rounded-full border border-soft bg-white p-1 dark:bg-slate-900">
          {["12h", "24h"].map((format) => {
            const active = timeFormat === format;
            return (
              <button
                key={format}
                type="button"
                onClick={() => onTimeFormatChange(format as TimeFormat)}
                className={[
                  "rounded-full px-4 py-2 text-sm font-medium transition",
                  active
                    ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                    : "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
                ].join(" ")}
              >
                {format === "12h" ? "12-hour" : "24-hour"}
              </button>
            );
          })}
        </div>
      </div>

      <TimezoneSearch
        isOpen={searchOpen}
        value={timezone}
        onClose={() => setSearchOpen(false)}
        onSelect={(id) => {
          onTimezoneChange(id);
          setSearchOpen(false);
        }}
        selectedIds={[timezone]}
      />
    </div>
  );
}
