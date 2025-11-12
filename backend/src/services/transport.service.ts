import axios from 'axios';

interface TransportSearchParams {
  from: string;
  to: string;
  date: string;
  type?: 'bus' | 'train' | 'flight' | 'ferry' | 'any';
}

interface TransportResult {
  type: 'bus' | 'train' | 'flight' | 'ferry';
  operator: string;
  departure: string;
  arrival: string;
  duration: string;
  price: number;
  distance?: string;
}

/**
 * Transport Service for inter-city transportation
 * Note: This uses mock data as RapidAPI doesn't have a comprehensive transport API
 * In production, consider using: Rome2rio API, 12Go Asia API, or Omio API
 */
export class TransportService {
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.RAPIDAPI_KEY || '';
  }

  /**
   * Search for transportation between cities
   */
  async searchTransport(params: TransportSearchParams): Promise<TransportResult[]> {
    try {
      // For MVP, we'll use curated data based on common routes in Thailand
      // In production, integrate with actual transport APIs
      return this.getTransportOptions(params);
    } catch (error: any) {
      console.error('Transport API error:', error.message);
      return this.getTransportOptions(params);
    }
  }

  /**
   * Get cheapest transport option
   */
  async getCheapestTransport(params: TransportSearchParams): Promise<TransportResult | null> {
    const options = await this.searchTransport(params);

    if (options.length === 0) {
      return null;
    }

    return options.sort((a, b) => a.price - b.price)[0];
  }

  /**
   * Get fastest transport option
   */
  async getFastestTransport(params: TransportSearchParams): Promise<TransportResult | null> {
    const options = await this.searchTransport(params);

    if (options.length === 0) {
      return null;
    }

    return options.sort((a, b) => this.durationToMinutes(a.duration) - this.durationToMinutes(b.duration))[0];
  }

  /**
   * Get transport options based on route (Thailand-focused for MVP)
   */
  private getTransportOptions(params: TransportSearchParams): TransportResult[] {
    const route = `${params.from.toLowerCase()}-${params.to.toLowerCase()}`;
    const routes = this.getThailandRoutes();

    const routeData = routes[route];

    if (!routeData) {
      // Generate generic options if route not found
      return this.generateGenericOptions(params);
    }

    // Filter by type preference if specified
    if (params.type && params.type !== 'any') {
      return routeData.filter(opt => opt.type === params.type);
    }

    return routeData;
  }

  /**
   * Thailand common routes data
   */
  private getThailandRoutes(): { [key: string]: TransportResult[] } {
    return {
      'bangkok-phuket': [
        {
          type: 'flight',
          operator: 'AirAsia',
          departure: '08:00',
          arrival: '09:30',
          duration: '1h 30m',
          price: 45,
          distance: '680 km',
        },
        {
          type: 'bus',
          operator: 'Sombat Tour',
          departure: '18:00',
          arrival: '06:00',
          duration: '12h',
          price: 18,
          distance: '840 km',
        },
      ],
      'phuket-bangkok': [
        {
          type: 'flight',
          operator: 'Thai Lion Air',
          departure: '14:00',
          arrival: '15:30',
          duration: '1h 30m',
          price: 50,
          distance: '680 km',
        },
        {
          type: 'bus',
          operator: 'Phuket Central Tour',
          departure: '17:00',
          arrival: '05:00',
          duration: '12h',
          price: 20,
          distance: '840 km',
        },
      ],
      'bangkok-chiang-mai': [
        {
          type: 'flight',
          operator: 'Bangkok Airways',
          departure: '10:00',
          arrival: '11:30',
          duration: '1h 30m',
          price: 55,
          distance: '580 km',
        },
        {
          type: 'train',
          operator: 'State Railway of Thailand',
          departure: '18:00',
          arrival: '06:30',
          duration: '12h 30m',
          price: 15,
          distance: '685 km',
        },
        {
          type: 'bus',
          operator: 'Nakhonchai Air',
          departure: '20:00',
          arrival: '07:00',
          duration: '11h',
          price: 22,
          distance: '685 km',
        },
      ],
      'chiang-mai-bangkok': [
        {
          type: 'flight',
          operator: 'Nok Air',
          departure: '16:00',
          arrival: '17:30',
          duration: '1h 30m',
          price: 60,
          distance: '580 km',
        },
        {
          type: 'train',
          operator: 'State Railway of Thailand',
          departure: '17:00',
          arrival: '06:00',
          duration: '13h',
          price: 15,
          distance: '685 km',
        },
        {
          type: 'bus',
          operator: 'Nakhonchai Air',
          departure: '19:00',
          arrival: '06:00',
          duration: '11h',
          price: 22,
          distance: '685 km',
        },
      ],
      'phuket-krabi': [
        {
          type: 'bus',
          operator: 'Phi Phi Cruiser',
          departure: '09:00',
          arrival: '12:00',
          duration: '3h',
          price: 8,
          distance: '165 km',
        },
        {
          type: 'ferry',
          operator: 'Andaman Wave Master',
          departure: '13:00',
          arrival: '15:30',
          duration: '2h 30m',
          price: 12,
          distance: '42 km',
        },
      ],
      'krabi-phuket': [
        {
          type: 'bus',
          operator: 'Phi Phi Cruiser',
          departure: '14:00',
          arrival: '17:00',
          duration: '3h',
          price: 8,
          distance: '165 km',
        },
        {
          type: 'ferry',
          operator: 'Andaman Wave Master',
          departure: '10:00',
          arrival: '12:30',
          duration: '2h 30m',
          price: 12,
          distance: '42 km',
        },
      ],
      'bangkok-pattaya': [
        {
          type: 'bus',
          operator: 'Bell Travel',
          departure: '08:00',
          arrival: '10:30',
          duration: '2h 30m',
          price: 7,
          distance: '147 km',
        },
      ],
      'pattaya-bangkok': [
        {
          type: 'bus',
          operator: 'Bell Travel',
          departure: '15:00',
          arrival: '17:30',
          duration: '2h 30m',
          price: 7,
          distance: '147 km',
        },
      ],
    };
  }

  /**
   * Generate generic transport options for unknown routes
   */
  private generateGenericOptions(params: TransportSearchParams): TransportResult[] {
    const basePrice = 20 + Math.floor(Math.random() * 30);

    return [
      {
        type: 'bus',
        operator: 'Local Bus Service',
        departure: '09:00',
        arrival: '15:00',
        duration: '6h',
        price: basePrice,
        distance: 'N/A',
      },
      {
        type: 'train',
        operator: 'Railway Service',
        departure: '10:30',
        arrival: '17:00',
        duration: '6h 30m',
        price: basePrice - 5,
        distance: 'N/A',
      },
    ];
  }

  /**
   * Convert duration string to minutes
   */
  private durationToMinutes(duration: string): number {
    const hours = duration.match(/(\d+)h/);
    const minutes = duration.match(/(\d+)m/);

    const h = hours ? parseInt(hours[1]) : 0;
    const m = minutes ? parseInt(minutes[1]) : 0;

    return h * 60 + m;
  }
}

export default new TransportService();
