import timezoneData from 'countries-and-timezones';
import cityTimezones from 'city-timezones';
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
  const timezoneOptions: TimezoneOption[] = Object.values(timezoneData.getAllTimezones())
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

  const cityOptions: TimezoneOption[] = cityTimezones.cityMapping
    .filter((city) => city.timezone && city.city && city.country)
    .map((city) => ({
      id: city.timezone,
      city: city.city,
      country: city.country,
      countryCode: city.iso2,
      countries: [city.country],
      citiesByCountry: { [city.country]: city.city },
      province: city.province,
      searchTerms: [city.city_ascii, city.province, city.state_ansi, city.country].filter(Boolean),
      locationKey: `${city.timezone}:${city.iso2}:${city.city}:${city.province}`,
      flag: toFlag(city.iso2),
    }));

  timezoneOptions.push(...cityOptions);
  const usStateOptions: TimezoneOption[] = [
    ['Alabama', 'AL', 'Montgomery', 'America/Chicago'],
    ['Alaska', 'AK', 'Anchorage', 'America/Anchorage'],
    ['Arizona', 'AZ', 'Phoenix', 'America/Phoenix'],
    ['Arkansas', 'AR', 'Little Rock', 'America/Chicago'],
    ['California', 'CA', 'Los Angeles', 'America/Los_Angeles'],
    ['Colorado', 'CO', 'Denver', 'America/Denver'],
    ['Connecticut', 'CT', 'Hartford', 'America/New_York'],
    ['Delaware', 'DE', 'Dover', 'America/New_York'],
    ['Florida', 'FL', 'Tallahassee', 'America/New_York'],
    ['Georgia', 'GA', 'Atlanta', 'America/New_York'],
    ['Hawaii', 'HI', 'Honolulu', 'Pacific/Honolulu'],
    ['Idaho', 'ID', 'Boise', 'America/Boise'],
    ['Illinois', 'IL', 'Springfield', 'America/Chicago'],
    ['Indiana', 'IN', 'Indianapolis', 'America/Indiana/Indianapolis'],
    ['Iowa', 'IA', 'Des Moines', 'America/Chicago'],
    ['Kansas', 'KS', 'Topeka', 'America/Chicago'],
    ['Kentucky', 'KY', 'Frankfort', 'America/New_York'],
    ['Louisiana', 'LA', 'Baton Rouge', 'America/Chicago'],
    ['Maine', 'ME', 'Augusta', 'America/New_York'],
    ['Maryland', 'MD', 'Annapolis', 'America/New_York'],
    ['Massachusetts', 'MA', 'Boston', 'America/New_York'],
    ['Michigan', 'MI', 'Lansing', 'America/Detroit'],
    ['Minnesota', 'MN', 'Saint Paul', 'America/Chicago'],
    ['Mississippi', 'MS', 'Jackson', 'America/Chicago'],
    ['Missouri', 'MO', 'Jefferson City', 'America/Chicago'],
    ['Montana', 'MT', 'Helena', 'America/Denver'],
    ['Nebraska', 'NE', 'Lincoln', 'America/Chicago'],
    ['Nevada', 'NV', 'Carson City', 'America/Los_Angeles'],
    ['New Hampshire', 'NH', 'Concord', 'America/New_York'],
    ['New Jersey', 'NJ', 'Trenton', 'America/New_York'],
    ['New Mexico', 'NM', 'Santa Fe', 'America/Denver'],
    ['New York', 'NY', 'Albany', 'America/New_York'],
    ['North Carolina', 'NC', 'Raleigh', 'America/New_York'],
    ['North Dakota', 'ND', 'Bismarck', 'America/Chicago'],
    ['Ohio', 'OH', 'Columbus', 'America/New_York'],
    ['Oklahoma', 'OK', 'Oklahoma City', 'America/Chicago'],
    ['Oregon', 'OR', 'Salem', 'America/Los_Angeles'],
    ['Pennsylvania', 'PA', 'Harrisburg', 'America/New_York'],
    ['Rhode Island', 'RI', 'Providence', 'America/New_York'],
    ['South Carolina', 'SC', 'Columbia', 'America/New_York'],
    ['South Dakota', 'SD', 'Pierre', 'America/Chicago'],
    ['Tennessee', 'TN', 'Nashville', 'America/Chicago'],
    ['Texas', 'TX', 'Austin', 'America/Chicago'],
    ['Utah', 'UT', 'Salt Lake City', 'America/Denver'],
    ['Vermont', 'VT', 'Montpelier', 'America/New_York'],
    ['Virginia', 'VA', 'Richmond', 'America/New_York'],
    ['Washington', 'WA', 'Olympia', 'America/Los_Angeles'],
    ['West Virginia', 'WV', 'Charleston', 'America/New_York'],
    ['Wisconsin', 'WI', 'Madison', 'America/Chicago'],
    ['Wyoming', 'WY', 'Cheyenne', 'America/Denver'],
  ].map(([state, abbreviation, city, timezone]) => ({
    id: timezone,
    city,
    country: 'United States of America',
    countryCode: 'US',
    countries: ['United States of America'],
    citiesByCountry: { 'United States of America': city },
    province: state,
    searchTerms: [state, abbreviation, city],
    locationKey: `US:${abbreviation}`,
    flag: toFlag('US'),
  }));

  timezoneOptions.push(...usStateOptions);
  timezoneOptions.push({
    id: 'UTC',
    city: 'UTC',
    country: 'Coordinated Universal Time',
    countryCode: 'UTC',
    countries: ['Coordinated Universal Time'],
    citiesByCountry: {},
    searchTerms: [],
    flag: 'ðŸ•’',
  });

  return timezoneOptions.sort((a, b) => a.city.localeCompare(b.city));
}
export const TIMEZONE_OPTIONS: TimezoneOption[] = createTimezoneOptions();

export const DEFAULT_TIMEZONES = ['Africa/Accra', 'Europe/London', 'America/New_York', 'Asia/Tokyo'];

export const TIMEZONE_MAP = new Map<string, TimezoneOption>();

for (const zone of TIMEZONE_OPTIONS) {
  if (!TIMEZONE_MAP.has(zone.id)) {
    TIMEZONE_MAP.set(zone.id, zone);
  }

  if (zone.locationKey) {
    TIMEZONE_MAP.set(zone.locationKey, zone);
  }
}
export function getTimezoneById(timezoneId: string): TimezoneOption {
  return (
    TIMEZONE_MAP.get(timezoneId) ??
    TIMEZONE_OPTIONS.find((zone) => zone.city === timezoneId) ??
    TIMEZONE_OPTIONS[0]
  );
}

export function getTimezoneIdBySelection(selection: string): string {
  return getTimezoneById(selection).id;
}
export const getTimezoneOptionById = getTimezoneById;

export function filterTimezones(query: string): TimezoneOption[] {
  const normalized = normalize(query.trim());

  if (!normalized) {
    return TIMEZONE_OPTIONS;
  }

  const terms = normalized.split(/\s+/).filter(Boolean);

  return TIMEZONE_OPTIONS
    .map((zone) => {
      const searchableFields = [
        zone.city,
        zone.country,
        zone.id,
        zone.province,
        ...(zone.searchTerms ?? []),
        ...Object.values(zone.citiesByCountry ?? {}),
      ]
        .filter((value): value is string => Boolean(value))
        .map(normalize);
      const haystack = searchableFields.join(' ');

      if (!terms.every((term) => haystack.includes(term))) {
        return null;
      }

      const exactMatch = searchableFields.some((field) => field === normalized);
      const startsWithMatch = searchableFields.some((field) => field.startsWith(normalized));
      const score = (exactMatch ? 100 : 0) + (startsWithMatch ? 50 : 0);
      return { zone, score };
    })
    .filter((result): result is { zone: TimezoneOption; score: number } => Boolean(result))
    .sort((a, b) => b.score - a.score || a.zone.city.localeCompare(b.zone.city))
    .map(({ zone }) => zone);
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

  if (zone.province && normalize(zone.province).includes(normalized)) {
    return { city: zone.city, country: `${zone.province}, ${zone.country}` };
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