// Plan Display Types

export interface Flight {
  airline: string;
  flightNumber: string;
  departure: {
    airport: string;
    city: string;
    time: string;
    date: string;
  };
  arrival: {
    airport: string;
    city: string;
    time: string;
    date: string;
  };
  duration: string;
  price: number;
  bookingUrl?: string;
}

export interface Accommodation {
  name: string;
  type: 'hostel' | 'hotel' | 'apartment';
  rating: number;
  address: string;
  city: string;
  pricePerNight: number;
  totalNights: number;
  totalPrice: number;
  amenities: string[];
  imageUrl?: string;
  bookingUrl?: string;
}

export interface Transportation {
  type: 'bus' | 'train' | 'ferry' | 'flight' | 'taxi';
  from: string;
  to: string;
  departure: string;
  arrival: string;
  duration: string;
  price: number;
  company?: string;
}

export interface DailyActivity {
  time?: string;
  title: string;
  description: string;
  location?: string;
  estimatedCost?: number;
}

export interface DailyItinerary {
  day: number;
  date: string;
  city: string;
  accommodation: Accommodation;
  activities: DailyActivity[];
  transportation?: Transportation; // Transport to next city
  totalCost: number;
}

export interface GeneratedPlan {
  id: string;
  requestId: string;
  status: 'pending' | 'completed' | 'failed';

  // Trip info
  origin: string;
  destination: string;
  startDate: string;
  endDate: string;
  totalDays: number;

  // Financial
  totalEstimatedCost: number;
  userBudget: number;
  budgetDifference: number;

  // Breakdown
  breakdown: {
    flights: number;
    accommodation: number;
    transportation: number;
    activities: number;
  };

  // Details
  internationalFlight: {
    outbound: Flight;
    return: Flight;
  };

  dailyItinerary: DailyItinerary[];

  // Metadata
  createdAt: string;
  updatedAt: string;
}

// Mock data for development
export const MOCK_PLAN: GeneratedPlan = {
  id: '1',
  requestId: 'req-1',
  status: 'completed',

  origin: 'Turkey',
  destination: 'Thailand',
  startDate: '2026-01-15',
  endDate: '2026-01-25',
  totalDays: 10,

  totalEstimatedCost: 1450,
  userBudget: 1500,
  budgetDifference: 50,

  breakdown: {
    flights: 600,
    accommodation: 400,
    transportation: 150,
    activities: 300,
  },

  internationalFlight: {
    outbound: {
      airline: 'Turkish Airlines',
      flightNumber: 'TK652',
      departure: {
        airport: 'IST',
        city: 'Istanbul',
        time: '23:45',
        date: '2026-01-15',
      },
      arrival: {
        airport: 'BKK',
        city: 'Bangkok',
        time: '14:30',
        date: '2026-01-16',
      },
      duration: '9h 45m',
      price: 350,
    },
    return: {
      airline: 'Turkish Airlines',
      flightNumber: 'TK653',
      departure: {
        airport: 'BKK',
        city: 'Bangkok',
        time: '16:30',
        date: '2026-01-25',
      },
      arrival: {
        airport: 'IST',
        city: 'Istanbul',
        time: '22:15',
        date: '2026-01-25',
      },
      duration: '10h 45m',
      price: 250,
    },
  },

  dailyItinerary: [
    {
      day: 1,
      date: '2026-01-16',
      city: 'Bangkok',
      accommodation: {
        name: 'NapPark Hostel',
        type: 'hostel',
        rating: 4.5,
        address: '154 Soi Rambuttri, Khao San',
        city: 'Bangkok',
        pricePerNight: 15,
        totalNights: 3,
        totalPrice: 45,
        amenities: ['Free WiFi', 'Breakfast', 'AC', 'Locker'],
      },
      activities: [
        {
          time: '15:00',
          title: 'Check-in & Rest',
          description: 'Arrive at hostel, freshen up after long flight',
        },
        {
          time: '18:00',
          title: 'Explore Khao San Road',
          description: 'Famous backpacker street, street food, night market',
          location: 'Khao San Road',
        },
      ],
      totalCost: 15,
    },
    {
      day: 2,
      date: '2026-01-17',
      city: 'Bangkok',
      accommodation: {
        name: 'NapPark Hostel',
        type: 'hostel',
        rating: 4.5,
        address: '154 Soi Rambuttri, Khao San',
        city: 'Bangkok',
        pricePerNight: 15,
        totalNights: 3,
        totalPrice: 45,
        amenities: ['Free WiFi', 'Breakfast', 'AC', 'Locker'],
      },
      activities: [
        {
          time: '08:00',
          title: 'Grand Palace',
          description: 'Visit the iconic royal palace and Wat Phra Kaew',
          location: 'Grand Palace',
          estimatedCost: 20,
        },
        {
          time: '13:00',
          title: 'Lunch at Local Restaurant',
          description: 'Try authentic Pad Thai and Tom Yum',
          estimatedCost: 10,
        },
        {
          time: '15:00',
          title: 'Wat Arun (Temple of Dawn)',
          description: 'Beautiful riverside temple',
          location: 'Wat Arun',
          estimatedCost: 5,
        },
        {
          time: '18:00',
          title: 'Chao Phraya River Cruise',
          description: 'Sunset cruise on the river',
          estimatedCost: 15,
        },
      ],
      totalCost: 65,
    },
    {
      day: 3,
      date: '2026-01-18',
      city: 'Bangkok',
      accommodation: {
        name: 'NapPark Hostel',
        type: 'hostel',
        rating: 4.5,
        address: '154 Soi Rambuttri, Khao San',
        city: 'Bangkok',
        pricePerNight: 15,
        totalNights: 3,
        totalPrice: 45,
        amenities: ['Free WiFi', 'Breakfast', 'AC', 'Locker'],
      },
      activities: [
        {
          time: '06:00',
          title: 'Chatuchak Weekend Market',
          description: 'Huge market with everything - clothes, souvenirs, food',
          location: 'Chatuchak Market',
          estimatedCost: 20,
        },
        {
          time: '14:00',
          title: 'MBK Shopping Center',
          description: 'Modern mall with great food court',
          estimatedCost: 15,
        },
      ],
      transportation: {
        type: 'bus',
        from: 'Bangkok',
        to: 'Phuket',
        departure: '20:00',
        arrival: '08:00',
        duration: '12h',
        price: 25,
        company: 'Sombat Tour',
      },
      totalCost: 55,
    },
    {
      day: 4,
      date: '2026-01-19',
      city: 'Phuket',
      accommodation: {
        name: 'Lub d Phuket Patong',
        type: 'hostel',
        rating: 4.3,
        address: 'Patong Beach',
        city: 'Phuket',
        pricePerNight: 20,
        totalNights: 3,
        totalPrice: 60,
        amenities: ['Pool', 'Free WiFi', 'Breakfast', 'Beach Access'],
      },
      activities: [
        {
          time: '09:00',
          title: 'Arrive & Check-in',
          description: 'Rest after overnight bus',
        },
        {
          time: '14:00',
          title: 'Patong Beach',
          description: 'Relax at the famous beach',
          location: 'Patong Beach',
        },
        {
          time: '18:00',
          title: 'Bangla Road Night Market',
          description: 'Street food and nightlife',
          estimatedCost: 20,
        },
      ],
      totalCost: 40,
    },
    {
      day: 5,
      date: '2026-01-20',
      city: 'Phuket',
      accommodation: {
        name: 'Lub d Phuket Patong',
        type: 'hostel',
        rating: 4.3,
        address: 'Patong Beach',
        city: 'Phuket',
        pricePerNight: 20,
        totalNights: 3,
        totalPrice: 60,
        amenities: ['Pool', 'Free WiFi', 'Breakfast', 'Beach Access'],
      },
      activities: [
        {
          time: '08:00',
          title: 'Phi Phi Island Day Trip',
          description: 'Boat tour to beautiful Phi Phi Islands, snorkeling',
          location: 'Phi Phi Islands',
          estimatedCost: 50,
        },
        {
          time: '18:00',
          title: 'Seafood Dinner',
          description: 'Fresh seafood at local restaurant',
          estimatedCost: 25,
        },
      ],
      totalCost: 95,
    },
  ],

  createdAt: '2026-01-10T10:00:00Z',
  updatedAt: '2026-01-10T10:05:00Z',
};
