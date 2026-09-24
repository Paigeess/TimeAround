export type TimeFormat = '12h' | '24h';
export type ThemeMode = 'light' | 'dark' | 'system';

export interface TimezoneOption {
  id: string;
  city: string;
  country: string;
  countryCode: string;
  countries?: string[];
  citiesByCountry?: Record<string, string>;
  searchTerms?: string[];
  province?: string;
  locationKey?: string;
  flag?: string;
}

export interface TimezoneCardData {
  id: string;
  city: string;
  country: string;
  flag?: string;
  localDate: string;
  localTime: string;
  abbreviation: string;
  utcOffset: string;
  relativeLabel: string;
}