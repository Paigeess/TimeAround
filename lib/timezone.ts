import { TIMEZONE_OPTIONS } from "@/lib/timezone-data";
import type { TimeFormat } from "@/types/timezone";

export function getBrowserTimeZone(): string {
  if (typeof Intl === "undefined" || typeof Intl.DateTimeFormat === "undefined") {
    return "UTC";
  }

  try {
    const resolved = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return resolved || "UTC";
  } catch {
    return "UTC";
  }
}

function getPartsInTimeZone(date: Date, timeZone: string) {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  });

  const parts = formatter.formatToParts(date);
  const map = Object.fromEntries(
    parts.filter((part) => part.type !== "literal").map((part) => [part.type, part.value])
  );

  return {
    year: Number(map.year),
    month: Number(map.month),
    day: Number(map.day),
    hour: Number(map.hour),
    minute: Number(map.minute),
    second: Number(map.second)
  };
}

export function formatDateKeyInTimeZone(date: Date, timeZone: string): string {
  const { year, month, day } = getPartsInTimeZone(date, timeZone);
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export function formatTimeKeyInTimeZone(date: Date, timeZone: string): string {
  const { hour, minute } = getPartsInTimeZone(date, timeZone);
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

export function formatDisplayDate(date: Date, timeZone: string): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone,
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(date);
}

export function formatDisplayTime(date: Date, timeZone: string, hour12: boolean): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour: "numeric",
    minute: "2-digit",
    hour12
  }).format(date);
}

export function getTimeZoneAbbreviation(date: Date, timeZone: string): string {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    timeZoneName: "short"
  });

  const parts = formatter.formatToParts(date);
  const zoneName = parts.find((part) => part.type === "timeZoneName")?.value ?? "GMT";
  return zoneName;
}

export function getUtcOffsetLabel(date: Date, timeZone: string): string {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    timeZoneName: "shortOffset"
  });

  const parts = formatter.formatToParts(date);
  const zoneName = parts.find((part) => part.type === "timeZoneName")?.value ?? "GMT";

  if (!zoneName || zoneName === "GMT") {
    return "UTC+0";
  }

  return zoneName.replace("GMT", "UTC");
}

export function getTimeZoneOffsetMinutes(date: Date, timeZone: string): number {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  });

  const parts = formatter.formatToParts(date);
  const map = Object.fromEntries(
    parts.filter((part) => part.type !== "literal").map((part) => [part.type, part.value])
  );

  const asUtc = Date.UTC(
    Number(map.year),
    Number(map.month) - 1,
    Number(map.day),
    Number(map.hour),
    Number(map.minute),
    Number(map.second)
  );

  return (asUtc - date.getTime()) / 60000;
}

export function zonedDateTimeToUtc(dateValue: string, timeValue: string, timeZone: string): Date {
  const [year, month, day] = dateValue.split("-").map(Number);
  const [hour, minute] = timeValue.split(":").map(Number);

  const wallClock = new Date(Date.UTC(year, month - 1, day, hour, minute));
  const offsetMinutes = getTimeZoneOffsetMinutes(wallClock, timeZone);

  return new Date(wallClock.getTime() - offsetMinutes * 60_000);
}

export function getRelativeDayLabel(sourceTimeZone: string, targetTimeZone: string, instant: Date): string {
  const sourceDate = formatDateKeyInTimeZone(instant, sourceTimeZone);
  const targetDate = formatDateKeyInTimeZone(instant, targetTimeZone);

  const sourceUtc = Date.UTC(
    Number(sourceDate.slice(0, 4)),
    Number(sourceDate.slice(5, 7)) - 1,
    Number(sourceDate.slice(8, 10))
  );

  const targetUtc = Date.UTC(
    Number(targetDate.slice(0, 4)),
    Number(targetDate.slice(5, 7)) - 1,
    Number(targetDate.slice(8, 10))
  );

  const dayDiff = Math.round((targetUtc - sourceUtc) / 86_400_000);

  if (dayDiff === 1) {
    return "Tomorrow";
  }

  if (dayDiff === -1) {
    return "Yesterday";
  }

  return "";
}

export function getDisplayTime(value: string, format: TimeFormat): string {
  if (!value) {
    return "--:--";
  }

  const [hours, minutes] = value.split(":").map(Number);

  if (format === "12h") {
    const suffix = hours >= 12 ? "PM" : "AM";
    const displayHour = hours % 12 || 12;
    return `${displayHour}:${String(minutes).padStart(2, "0")} ${suffix}`;
  }

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

export function getTimezoneOptionById(id: string) {
  return TIMEZONE_OPTIONS.find((zone) => zone.id === id) ?? TIMEZONE_OPTIONS[0];
}

export function getShareLinkUrl(params: { from: string; date: string; time: string; zones: string[] }): string {
  if (typeof window === "undefined") {
    return "";
  }

  const url = new URL(window.location.href);
  url.searchParams.set("from", params.from);
  url.searchParams.set("date", params.date);
  url.searchParams.set("time", params.time);
  url.searchParams.set("zones", params.zones.join(","));
  return url.toString();
}
