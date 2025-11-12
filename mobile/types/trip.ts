// Trip Planning Types

export type AccommodationType = 'hostel' | 'hotel' | 'apartment' | 'any';
export type TravelStyle = 'fast' | 'slow' | 'adventure';

export interface TripFormData {
  // Step 1: Basic Info
  origin: string;
  destination: string;
  startDate: Date;
  endDate: Date;
  budget: number;

  // Step 2: Cities
  cities: string[];

  // Step 3: Preferences
  accommodationType: AccommodationType;
  travelStyle: TravelStyle;
}

export interface TripRequest {
  origin: string;
  destination: string;
  start_date: string; // ISO date string
  end_date: string; // ISO date string
  budget: number;
  requested_cities: string[];
  accommodation_preference: AccommodationType;
  travel_style: TravelStyle;
}

export interface City {
  id: string;
  name: string;
  country: string;
  popular: boolean;
}

// Thailand cities for MVP
export const THAILAND_CITIES: City[] = [
  { id: 'bangkok', name: 'Bangkok', country: 'Thailand', popular: true },
  { id: 'phuket', name: 'Phuket', country: 'Thailand', popular: true },
  { id: 'pattaya', name: 'Pattaya', country: 'Thailand', popular: true },
  { id: 'chiang-mai', name: 'Chiang Mai', country: 'Thailand', popular: true },
  { id: 'krabi', name: 'Krabi', country: 'Thailand', popular: true },
  { id: 'koh-samui', name: 'Koh Samui', country: 'Thailand', popular: true },
  { id: 'ayutthaya', name: 'Ayutthaya', country: 'Thailand', popular: false },
  { id: 'hua-hin', name: 'Hua Hin', country: 'Thailand', popular: false },
  { id: 'koh-phi-phi', name: 'Koh Phi Phi', country: 'Thailand', popular: false },
  { id: 'koh-tao', name: 'Koh Tao', country: 'Thailand', popular: false },
];

export const ACCOMMODATION_TYPES = [
  { value: 'hostel' as AccommodationType, label: 'Hostel', icon: '🏠' },
  { value: 'hotel' as AccommodationType, label: 'Otel', icon: '🏨' },
  { value: 'apartment' as AccommodationType, label: 'Daire', icon: '🏢' },
  { value: 'any' as AccommodationType, label: 'Farketmez', icon: '🎯' },
];

export const TRAVEL_STYLES = [
  {
    value: 'fast' as TravelStyle,
    label: 'Hızlı',
    icon: '⚡',
    description: 'Çok yer görmek istiyorum'
  },
  {
    value: 'slow' as TravelStyle,
    label: 'Yavaş',
    icon: '🌴',
    description: 'Rahat ve keşfetmek istiyorum'
  },
  {
    value: 'adventure' as TravelStyle,
    label: 'Macera',
    icon: '🏔️',
    description: 'Aktivite ve heyecan istiyorum'
  },
];
