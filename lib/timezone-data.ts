import type { TimezoneOption } from "@/types/timezone";

export const TIMEZONE_OPTIONS: TimezoneOption[] = [
  { id: "Africa/Accra", city: "Accra", country: "Ghana", countryCode: "GH", flag: "🇬🇭" },
  { id: "Africa/Cairo", city: "Cairo", country: "Egypt", countryCode: "EG", flag: "🇪🇬" },
  { id: "Africa/Johannesburg", city: "Johannesburg", country: "South Africa", countryCode: "ZA", flag: "🇿🇦" },
  { id: "Africa/Lagos", city: "Lagos", country: "Nigeria", countryCode: "NG", flag: "🇳🇬" },
  { id: "America/Los_Angeles", city: "Los Angeles", country: "United States", countryCode: "US", flag: "🇺🇸" },
  { id: "America/New_York", city: "New York", country: "United States", countryCode: "US", flag: "🇺🇸" },
  { id: "America/Sao_Paulo", city: "São Paulo", country: "Brazil", countryCode: "BR", flag: "🇧🇷" },
  { id: "America/Toronto", city: "Toronto", country: "Canada", countryCode: "CA", flag: "🇨🇦" },
  { id: "Asia/Dubai", city: "Dubai", country: "United Arab Emirates", countryCode: "AE", flag: "🇦🇪" },
  { id: "Asia/Kolkata", city: "Mumbai", country: "India", countryCode: "IN", flag: "🇮🇳" },
  { id: "Asia/Singapore", city: "Singapore", country: "Singapore", countryCode: "SG", flag: "🇸🇬" },
  { id: "Asia/Tokyo", city: "Tokyo", country: "Japan", countryCode: "JP", flag: "🇯🇵" },
  { id: "Asia/Seoul", city: "Seoul", country: "South Korea", countryCode: "KR", flag: "🇰🇷" },
  { id: "Australia/Sydney", city: "Sydney", country: "Australia", countryCode: "AU", flag: "🇦🇺" },
  { id: "Europe/Berlin", city: "Berlin", country: "Germany", countryCode: "DE", flag: "🇩🇪" },
  { id: "Europe/London", city: "London", country: "United Kingdom", countryCode: "GB", flag: "🇬🇧" },
  { id: "Europe/Paris", city: "Paris", country: "France", countryCode: "FR", flag: "🇫🇷" },
  { id: "Pacific/Auckland", city: "Auckland", country: "New Zealand", countryCode: "NZ", flag: "🇳🇿" },
  { id: "UTC", city: "UTC", country: "Coordinated Universal Time", countryCode: "UTC", flag: "🕒" },
  { id: "Etc/UTC", city: "UTC", country: "Coordinated Universal Time", countryCode: "UTC", flag: "🕒" }
];

export const DEFAULT_TIMEZONES = ["Africa/Accra", "Europe/London", "America/New_York", "Asia/Tokyo"];

export const TIMEZONE_MAP = new Map(TIMEZONE_OPTIONS.map((zone) => [zone.id, zone]));

export function getTimezoneById(timezoneId: string): TimezoneOption {
  return TIMEZONE_MAP.get(timezoneId) ?? TIMEZONE_OPTIONS.find((zone) => zone.city === timezoneId) ?? TIMEZONE_OPTIONS[0];
}

export const getTimezoneOptionById = getTimezoneById;

export function filterTimezones(query: string): TimezoneOption[] {
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    return TIMEZONE_OPTIONS.slice(0, 18);
  }

  return TIMEZONE_OPTIONS.filter((zone) => {
    const haystack = [zone.city, zone.country, zone.id].join(" ").toLowerCase();
    return haystack.includes(normalized);
  });
}
