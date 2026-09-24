'use client';

import { useEffect, useMemo, useState } from 'react';
import Header from '@/components/Header';
import SourceTimeSelector from '@/components/SourceTimeSelector';
import TimezoneSearch from '@/components/TimezoneSearch';
import TimezoneTable from '@/components/TimezoneTable';
import { DEFAULT_TIMEZONES, getTimezoneById, getTimezoneIdBySelection } from '@/lib/timezone-data';
import { readStorage, writeStorage } from '@/lib/storage';
import {
  formatDateKeyInTimeZone,
  formatDisplayDate,
  formatDisplayTime,
  formatTimeKeyInTimeZone,
  getBrowserTimeZone,
  getDisplayTime,
  getRelativeDayLabel,
  getTimeZoneAbbreviation,
  getUtcOffsetLabel,
  zonedDateTimeToUtc,
} from '@/lib/timezone';
import type { ThemeMode, TimeFormat } from '@/types/timezone';

export default function TimezoneConverter() {
  const [sourceTimezone, setSourceTimezone] = useState<string>(() =>
    readStorage('source-timezone', getBrowserTimeZone()),
  );
  const [sourceDate, setSourceDate] = useState<string>(() =>
    readStorage('source-date', formatDateKeyInTimeZone(new Date(), getBrowserTimeZone())),
  );
  const [sourceTime, setSourceTime] = useState<string>(() =>
    readStorage('source-time', formatTimeKeyInTimeZone(new Date(), getBrowserTimeZone())),
  );
  const [selectedTimezones, setSelectedTimezones] = useState<string[]>(() =>
    readStorage('selected-timezones', DEFAULT_TIMEZONES),
  );
  const [timeFormat, setTimeFormat] = useState<TimeFormat>(() => readStorage('time-format', '12h'));
  const [theme, setTheme] = useState<ThemeMode>(() => readStorage('theme', 'system'));
  const [isLive, setIsLive] = useState<boolean>(() => readStorage('live-enabled', false));
  const [addTimezoneOpen, setAddTimezoneOpen] = useState(false);
  const [copyMessage, setCopyMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    writeStorage('source-timezone', sourceTimezone);
    writeStorage('source-date', sourceDate);
    writeStorage('source-time', sourceTime);
    writeStorage('selected-timezones', selectedTimezones);
    writeStorage('time-format', timeFormat);
    writeStorage('theme', theme);
    writeStorage('live-enabled', isLive);
  }, [sourceTimezone, sourceDate, sourceTime, selectedTimezones, timeFormat, theme, isLive]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const from = params.get('from');
    const date = params.get('date');
    const time = params.get('time');
    const zones = params.get('zones');

    if (from) setSourceTimezone(from);
    if (date) setSourceDate(date);
    if (time) setSourceTime(time);
    if (zones) {
      const values = zones
        .split(',')
        .map((entry) => entry.trim())
        .filter(Boolean);
      if (values.length > 0) {
        setSelectedTimezones(values);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    url.searchParams.set('from', sourceTimezone);
    url.searchParams.set('date', sourceDate);
    url.searchParams.set('time', sourceTime);
    url.searchParams.set('zones', selectedTimezones.join(','));
    window.history.replaceState({}, '', url.toString());
  }, [sourceTimezone, sourceDate, sourceTime, selectedTimezones]);

  useEffect(() => {
    if (!isLive) return;

    const tick = window.setInterval(() => {
      const now = new Date();
      setSourceDate(formatDateKeyInTimeZone(now, sourceTimezone));
      setSourceTime(formatTimeKeyInTimeZone(now, sourceTimezone));
    }, 1000);

    return () => window.clearInterval(tick);
  }, [isLive, sourceTimezone]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const applyTheme = () => {
      const darkMode = theme === 'dark' || (theme === 'system' && mediaQuery.matches);
      document.documentElement.classList.toggle('dark', darkMode);
      document.documentElement.style.colorScheme = darkMode ? 'dark' : 'light';
    };

    applyTheme();
    mediaQuery.addEventListener('change', applyTheme);
    return () => mediaQuery.removeEventListener('change', applyTheme);
  }, [theme]);

  const sourceInstant = useMemo(() => {
    try {
      return zonedDateTimeToUtc(sourceDate, sourceTime, sourceTimezone);
    } catch {
      return new Date();
    }
  }, [sourceDate, sourceTime, sourceTimezone]);

  useEffect(() => {
    if (!sourceDate || !sourceTime) {
      setErrorMessage('Please choose a valid date and time.');
      return;
    }

    const invalid = Number.isNaN(sourceInstant.getTime());
    setErrorMessage(invalid ? 'Please choose a valid date and time.' : '');
  }, [sourceDate, sourceTime, sourceInstant]);

  const sourceTimezoneOption = useMemo(
    () => getTimezoneById(sourceTimezone) ?? getTimezoneById('UTC'),
    [sourceTimezone],
  );

  const timezoneRows = useMemo(
    () =>
      selectedTimezones.map((selection) => {
        const zoneId = getTimezoneIdBySelection(selection);
        const localDate = formatDisplayDate(sourceInstant, zoneId);
        const localTime = formatDisplayTime(sourceInstant, zoneId, timeFormat === '12h');
        const relativeLabel = getRelativeDayLabel(sourceTimezone, zoneId, sourceInstant);

        return {
          id: selection,
          localDate,
          localTime,
          abbreviation: getTimeZoneAbbreviation(sourceInstant, zoneId),
          utcOffset: getUtcOffsetLabel(sourceInstant, zoneId),
          relativeLabel,
        };
      }),
    [selectedTimezones, sourceInstant, sourceTimezone, timeFormat],
  );

  const handleAddTimezone = (timezoneId: string) => {
    if (selectedTimezones.includes(timezoneId)) {
      setErrorMessage('That timezone is already selected.');
      return;
    }

    setSelectedTimezones((current) => [...current, timezoneId]);
    setErrorMessage('');
  };

  const handleMoveTimezone = (index: number, direction: -1 | 1) => {
    setSelectedTimezones((current) => {
      const next = [...current];
      const targetIndex = index + direction;
      if (targetIndex < 0 || targetIndex >= next.length) return current;
      [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
      return next;
    });
  };

  const handleRemoveTimezone = (timezoneId: string) => {
    setSelectedTimezones((current) => current.filter((zone) => zone !== timezoneId));
  };

  const handleUseMyTimezone = () => {
    const detected = getBrowserTimeZone();
    setSourceTimezone(detected);
    setErrorMessage('');
  };

  const handleCopyShareLink = async () => {
    const shareUrl = new URL(window.location.href);
    shareUrl.searchParams.set('from', sourceTimezone);
    shareUrl.searchParams.set('date', sourceDate);
    shareUrl.searchParams.set('time', sourceTime);
    shareUrl.searchParams.set('zones', selectedTimezones.join(','));

    try {
      await navigator.clipboard.writeText(shareUrl.toString());
      setCopyMessage('Link copied!');
      window.setTimeout(() => setCopyMessage(''), 1500);
    } catch {
      setErrorMessage('Unable to copy the share link in this browser.');
    }
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.10),_transparent_30%)] text-slate-900 dark:text-slate-50">
      <Header theme={theme} onThemeChange={setTheme} />

      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
              Tell me what time it is where you are,
            </p>
            <h2 className="mt-1 text-3xl font-semibold tracking-tight">
              and I&apos;ll show you what time that is everywhere else.
            </h2>
          </div>
          <button
            type="button"
            onClick={handleCopyShareLink}
            className="rounded-full border border-soft bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Copy Share Link
          </button>
        </div>

        {copyMessage ? (
          <div className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900/70 dark:bg-emerald-950/30 dark:text-emerald-300">
            {copyMessage}
          </div>
        ) : null}

        {errorMessage ? (
          <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/70 dark:bg-red-950/20 dark:text-red-300">
            {errorMessage}
          </div>
        ) : null}

        <div className="space-y-5">
          <SourceTimeSelector
            timezone={sourceTimezone}
            date={sourceDate}
            time={sourceTime}
            timeFormat={timeFormat}
            displayDate={formatDisplayDate(sourceInstant, sourceTimezone)}
            onTimezoneChange={setSourceTimezone}
            onDateChange={setSourceDate}
            onTimeChange={setSourceTime}
            onTimeFormatChange={setTimeFormat}
            onUseMyTimezone={handleUseMyTimezone}
            isLive={isLive}
            onLiveToggle={setIsLive}
          />

          <section className="rounded-[2rem] border border-soft bg-white/80 p-4 shadow-soft dark:bg-slate-900/80 sm:p-6">
            <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                  Selected locations
                </p>
                <h3 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                  Your Timezones
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setAddTimezoneOpen(true)}
                className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
              >
                + Add Timezone
              </button>
            </div>

            <div className="mb-5 grid gap-3 sm:grid-cols-3 xl:grid-cols-4">
              <div className="rounded-2xl border border-soft bg-slate-50 p-3 dark:bg-slate-800/80">
                <div className="text-xs uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                  Source
                </div>
                <div className="mt-2 text-lg font-semibold">
                  {sourceTimezoneOption.city}, {sourceTimezoneOption.country}
                </div>
              </div>
              <div className="rounded-2xl border border-soft bg-slate-50 p-3 dark:bg-slate-800/80">
                <div className="text-xs uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                  Date
                </div>
                <div className="mt-2 text-lg font-semibold">
                  {formatDisplayDate(sourceInstant, sourceTimezone)}
                </div>
              </div>
              <div className="rounded-2xl border border-soft bg-slate-50 p-3 dark:bg-slate-800/80">
                <div className="text-xs uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                  Time
                </div>
                <div className="mt-2 text-lg font-semibold">
                  {getDisplayTime(sourceTime, timeFormat)}
                </div>
              </div>
              <div className="rounded-2xl border border-soft bg-slate-50 p-3 dark:bg-slate-800/80">
                <div className="text-xs uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                  Timezone
                </div>
                <div className="mt-2 text-lg font-semibold">
                  {getTimeZoneAbbreviation(sourceInstant, sourceTimezone)}
                </div>
              </div>
            </div>

            <TimezoneTable
              rows={timezoneRows}
              onMove={handleMoveTimezone}
              onRemove={handleRemoveTimezone}
            />
          </section>
        </div>
      </div>

      <TimezoneSearch
        isOpen={addTimezoneOpen}
        onClose={() => setAddTimezoneOpen(false)}
        onSelect={(timezoneId) => {
          handleAddTimezone(timezoneId);
          setAddTimezoneOpen(false);
        }}
        selectedIds={selectedTimezones}
      />
    </main>
  );
}