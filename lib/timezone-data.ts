import timezoneData from 'countries-and-timezones';
import type { TimezoneOption } from '@/types/timezone';

function toFlag(countryCode: string): string {
  if (!/^[A-Z]{2}$/.test(countryCode)) {
    return 'ðŸ•’';
  }

  return String.fromCodePoint(
    ...countryCode.split('').map((character) => 127397 + character.charCodeAt(0)),
  );
}

function getCityName(timezoneId: string): string {
  if (timezoneId === 'UTC' || timezoneId === 'Etc/UTC') {
    return 'UTC';
  }

  const city = timezoneId.split('/').pop() ?? timezoneId;
  return city.replace(/_/g, ' ');
}

function normalize(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

const CITIES_BY_COUNTRY: Record<string, string> = {
  BI: 'Gitega',
  BW: 'Gaborone',
  CD: 'Kinshasa',
  MW: 'Lilongwe',
  MZ: 'Maputo',
  RW: 'Kigali',
  ZM: 'Lusaka',
  ZW: 'Harare',
  AE: 'Abu Dhabi',
  AG: "St. John's",
  AI: 'The Valley',
  AO: 'Luanda',
  AR: 'Buenos Aires',
  AS: 'Pago Pago',
  AW: 'Oranjestad',
  BA: 'Sarajevo',
  BB: 'Bridgetown',
  BE: 'Brussels',
  BH: 'Manama',
  BJ: 'Porto-Novo',
  BL: 'Gustavia',
  BN: 'Bandar Seri Begawan',
  BQ: 'Kralendijk',
  BS: 'Nassau',
  CA: 'Ottawa',
  CC: 'West Island',
  CF: 'Bangui',
  CG: 'Brazzaville',
  CH: 'Bern',
  CI: 'Yamoussoukro',
  CM: 'Yaounde',
  CW: 'Willemstad',
  CZ: 'Prague',
  DE: 'Berlin',
  DJ: 'Djibouti',
  DM: 'Roseau',
  ER: 'Asmara',
  ET: 'Addis Ababa',
  FI: 'Helsinki',
  FM: 'Palikir',
  FR: 'Paris',
  GA: 'Libreville',
  GD: "St. George's",
  GG: 'Saint Peter Port',
  GH: 'Accra',
  GM: 'Banjul',
  GN: 'Conakry',
  GP: 'Basse-Terre',
  GQ: 'Malabo',
  HR: 'Zagreb',
  IM: 'Douglas',
  IS: 'Reykjavik',
  IT: 'Rome',
  JE: 'Saint Helier',
  JP: 'Tokyo',
  KE: 'Nairobi',
  KH: 'Phnom Penh',
  KM: 'Moroni',
  KN: 'Basseterre',
  KW: 'Kuwait City',
  KY: 'George Town',
  LA: 'Vientiane',
  LC: 'Castries',
  LI: 'Vaduz',
  LS: 'Maseru',
  LU: 'Luxembourg',
  MC: 'Monaco',
  MD: 'Chisinau',
  MF: 'Marigot',
  MG: 'Antananarivo',
  MH: 'Majuro',
  MK: 'Skopje',
  ML: 'Bamako',
  MN: 'Ulaanbaatar',
  MO: 'Macau',
  MP: 'Saipan',
  MS: 'Brades',
  MT: 'Valletta',
  NE: 'Niamey',
  NG: 'Abuja',
  NL: 'Amsterdam',
  NO: 'Oslo',
  NP: 'Kathmandu',
  NZ: 'Wellington',
  OM: 'Muscat',
  PA: 'Panama City',
  PG: 'Port Moresby',
  PR: 'San Juan',
  QA: 'Doha',
  RE: 'Saint-Denis',
  SA: 'Riyadh',
  SB: 'Honiara',
  SC: 'Victoria',
  SE: 'Stockholm',
  SG: 'Singapore',
  SH: 'Jamestown',
  SI: 'Ljubljana',
  SJ: 'Longyearbyen',
  SK: 'Bratislava',
  SL: 'Freetown',
  SM: 'San Marino',
  SN: 'Dakar',
  SO: 'Mogadishu',
  SX: 'Philipsburg',
  SZ: 'Mbabane',
  TG: 'Lome',
  TH: 'Bangkok',
  TJ: 'Dushanbe',
  TL: 'Dili',
  TM: 'Ashgabat',
  TN: 'Tunis',
  TR: 'Ankara',
  TT: 'Port of Spain',
  TV: 'Funafuti',
  TZ: 'Dodoma',
  UA: 'Kyiv',
  UG: 'Kampala',
  UM: 'Washington, D.C.',
  US: 'Washington, D.C.',
  VA: 'Vatican City',
  VC: 'Kingstown',
  VG: 'Road Town',
  VI: 'Charlotte Amalie',
  VN: 'Hanoi',
  WF: 'Mata-Utu',
  YE: "Sana'a",
};

function createTimezoneOptions(): TimezoneOption[] {
  const options = Object.values(timezoneData.getAllTimezones())
    .filter((timezone) => !timezone.deprecated)
    .map((timezone) => {
      const countries = timezone.countries
        .map((countryCode) => timezoneData.getCountry(countryCode))
        .filter((country): country is NonNullable<typeof country> => Boolean(country));
      const country = countries[0];

      return {
        id: timezone.name,
        city: getCityName(timezone.name),
        country: country?.name ?? 'Coordinated Universal Time',
        countryCode: (country?.id ?? 'UTC') as string,
        countries: countries.map((countryEntry) => countryEntry.name),
        citiesByCountry: Object.fromEntries(
          countries
            .map((countryEntry) => [countryEntry.name, CITIES_BY_COUNTRY[countryEntry.id]])
            .filter((entry): entry is [string, string] => Boolean(entry[1])),
        ),
        searchTerms: countries.map((countryEntry) => countryEntry.name),
        flag: toFlag(country?.id ?? ''),
      };
    });

  options.push({
    id: 'UTC',
    city: 'UTC',
    country: 'Coordinated Universal Time',
    countryCode: 'UTC',
    countries: ['Coordinated Universal Time'],
    citiesByCountry: {},
    searchTerms: [],
    flag: 'ðŸ•’',
  });

  return options.sort((a, b) => a.city.localeCompare(b.city));
}

export const TIMEZONE_OPTIONS: TimezoneOption[] = createTimezoneOptions();

export const DEFAULT_TIMEZONES = [
  'Africa/Accra',
  'Europe/London',
  'America/New_York',
  'Asia/Tokyo',
];

export const TIMEZONE_MAP = new Map(TIMEZONE_OPTIONS.map((zone) => [zone.id, zone]));

export function getTimezoneById(timezoneId: string): TimezoneOption {
  return (
    TIMEZONE_MAP.get(timezoneId) ??
    TIMEZONE_OPTIONS.find((zone) => zone.city === timezoneId) ??
    TIMEZONE_OPTIONS[0]
  );
}

export const getTimezoneOptionById = getTimezoneById;

export function filterTimezones(query: string): TimezoneOption[] {
  const normalized = normalize(query.trim());

  if (!normalized) {
    return TIMEZONE_OPTIONS;
  }

  const matches = TIMEZONE_OPTIONS.filter((zone) => {
    const haystack = [
      zone.city,
      zone.country,
      zone.id,
      ...(zone.searchTerms ?? []),
      ...Object.values(zone.citiesByCountry ?? {}),
    ]
      .map(normalize)
      .join(' ');
    return haystack.includes(normalized);
  });

  const exactCityMatches = matches.filter((zone) => normalize(zone.city) === normalized);
  return exactCityMatches.length > 0 ? exactCityMatches : matches;
}
export function getSearchCountryLabel(zone: TimezoneOption, query: string): string {
  const normalized = normalize(query.trim());

  if (!normalized) {
    return zone.country;
  }

  return zone.countries?.find((country) => normalize(country).includes(normalized)) ?? zone.country;
}

export function getSearchLocation(
  zone: TimezoneOption,
  query: string,
): { city: string; country: string } {
  const normalized = normalize(query.trim());
  const cityMatch = Object.entries(zone.citiesByCountry ?? {}).find(([_, city]) =>
    normalize(city).includes(normalized),
  );

  if (cityMatch) {
    return { city: cityMatch[1], country: cityMatch[0] };
  }

  const countryIndex =
    zone.countries?.findIndex((country) => normalize(country).includes(normalized)) ?? -1;

  if (countryIndex >= 0) {
    const country = zone.countries?.[countryIndex] ?? zone.country;
    return {
      city: zone.citiesByCountry?.[country] ?? zone.city,
      country,
    };
  }

  return { city: zone.city, country: zone.country };
}