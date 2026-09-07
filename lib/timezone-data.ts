import timezoneData from "countries-and-timezones";
import type { TimezoneOption } from "@/types/timezone";

function toFlag(countryCode: string): string {
  if (!/^[A-Z]{2}$/.test(countryCode)) {
    return "🕒";
  }

  return String.fromCodePoint(
    ...countryCode.split("").map((character) => 127397 + character.charCodeAt(0))
  );
}

function getCityName(timezoneId: string): string {
  if (timezoneId === "UTC" || timezoneId === "Etc/UTC") {
    return "UTC";
  }

  const city = timezoneId.split("/").pop() ?? timezoneId;
  return city.replace(/_/g, " ");
}

function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function createTimezoneOptions(): TimezoneOption[] {
  const options = Object.values(timezoneData.getAllTimezones())
    .filter((timezone) => !timezone.deprecated)
    .map((timezone) => {
      const country = timezone.countries
        .map((countryCode) => timezoneData.getCountry(countryCode))
        .find(Boolean);

      return {
        id: timezone.name,
        city: getCityName(timezone.name),
        country: country?.name ?? "Coordinated Universal Time",
        countryCode: country?.id ?? "UTC",
        flag: toFlag(country?.id ?? "")
      };
    });

  options.push({
    id: "UTC",
    city: "UTC",
    country: "Coordinated Universal Time",
    countryCode: "UTC",
    flag: "🕒"
  });

  return options.sort((a, b) => a.city.localeCompare(b.city));
}

export const TIMEZONE_OPTIONS: TimezoneOption[] = createTimezoneOptions();

export const DEFAULT_TIMEZONES = ["Africa/Accra", "Europe/London", "America/New_York", "Asia/Tokyo"];

export const TIMEZONE_MAP = new Map(TIMEZONE_OPTIONS.map((zone) => [zone.id, zone]));

export function getTimezoneById(timezoneId: string): TimezoneOption {
  return TIMEZONE_MAP.get(timezoneId) ?? TIMEZONE_OPTIONS.find((zone) => zone.city === timezoneId) ?? TIMEZONE_OPTIONS[0];
}

export const getTimezoneOptionById = getTimezoneById;

export function filterTimezones(query: string): TimezoneOption[] {
  const normalized = normalize(query.trim());

  if (!normalized) {
    return TIMEZONE_OPTIONS;
  }

  return TIMEZONE_OPTIONS.filter((zone) => {
    const haystack = [zone.city, zone.country, zone.id].map(normalize).join(" ");
    return haystack.includes(normalized);
  });
}
