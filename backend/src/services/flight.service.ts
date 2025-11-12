import axios from 'axios';

interface FlightSearchParams {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  adults?: number;
  currency?: string;
}

interface FlightResult {
  airline: string;
  flightNumber: string;
  departure: {
    airport: string;
    time: string;
    date: string;
  };
  arrival: {
    airport: string;
    time: string;
    date: string;
  };
  duration: string;
  price: number;
  stops: number;
}

export class FlightService {
  private apiKey: string;
  private apiHost: string;

  constructor() {
    this.apiKey = process.env.RAPIDAPI_KEY || '';
    this.apiHost = process.env.RAPIDAPI_HOST_KIWI || 'kiwi-com-cheap-flights.p.rapidapi.com';
  }

  /**
   * Search for round-trip flights using Kiwi.com API
   */
  async searchRoundTripFlights(params: FlightSearchParams): Promise<{ outbound: FlightResult | null, return: FlightResult | null }> {
    try {
      if (!this.apiKey) {
        console.warn('RapidAPI key not configured, returning mock data');
        const mockFlights = this.getMockFlights(params);
        return {
          outbound: mockFlights[0] || null,
          return: mockFlights[1] || null,
        };
      }

      // Format dates for Kiwi API (YYYY-MM-DD)
      const departDate = params.departureDate;
      const returnDateParam = params.returnDate || this.addDays(params.departureDate, 7);

      // Kiwi.com API expects source and destination in specific format
      const source = this.formatLocation(params.origin);
      const destination = this.formatLocation(params.destination);

      console.log(`Searching flights: ${source} → ${destination} (${departDate} - ${returnDateParam})`);

      const response = await axios.get(`https://${this.apiHost}/round-trip`, {
        headers: {
          'x-rapidapi-key': this.apiKey,
          'x-rapidapi-host': this.apiHost,
        },
        params: {
          source,
          destination,
          outboundDate: departDate,
          returnDate: returnDateParam,
          currency: params.currency || 'USD',
          locale: 'en',
          adults: params.adults || 1,
          children: 0,
          infants: 0,
          cabinClass: 'ECONOMY',
          sortBy: 'QUALITY',
          limit: 10,
        },
        timeout: 15000,
      });

      if (response.data && response.data.data && response.data.data.length > 0) {
        return this.parseKiwiRoundTrip(response.data.data[0]);
      }

      console.warn('No flights found in API response, using mock data');
      const mockFlights = this.getMockFlights(params);
      return {
        outbound: mockFlights[0] || null,
        return: mockFlights[1] || null,
      };
    } catch (error: any) {
      console.error('Kiwi Flight API error:', error.message);
      // Fallback to mock data if API fails
      const mockFlights = this.getMockFlights(params);
      return {
        outbound: mockFlights[0] || null,
        return: mockFlights[1] || null,
      };
    }
  }

  /**
   * Search for one-way flights
   */
  async searchFlights(params: FlightSearchParams): Promise<FlightResult[]> {
    try {
      if (!this.apiKey) {
        console.warn('RapidAPI key not configured, returning mock data');
        return this.getMockFlights(params);
      }

      const source = this.formatLocation(params.origin);
      const destination = this.formatLocation(params.destination);

      const response = await axios.get(`https://${this.apiHost}/one-way`, {
        headers: {
          'x-rapidapi-key': this.apiKey,
          'x-rapidapi-host': this.apiHost,
        },
        params: {
          source,
          destination,
          outboundDate: params.departureDate,
          currency: params.currency || 'USD',
          locale: 'en',
          adults: params.adults || 1,
          children: 0,
          infants: 0,
          cabinClass: 'ECONOMY',
          sortBy: 'QUALITY',
          limit: 10,
        },
        timeout: 15000,
      });

      if (response.data && response.data.data) {
        return this.parseKiwiFlights(response.data.data);
      }

      return this.getMockFlights(params);
    } catch (error: any) {
      console.error('Kiwi Flight API error:', error.message);
      return this.getMockFlights(params);
    }
  }

  /**
   * Get cheapest flight option
   */
  async getCheapestFlight(params: FlightSearchParams): Promise<FlightResult | null> {
    const flights = await this.searchFlights(params);

    if (flights.length === 0) {
      return null;
    }

    // Sort by price and return cheapest
    return flights.sort((a, b) => a.price - b.price)[0];
  }

  /**
   * Parse Kiwi round-trip response
   */
  private parseKiwiRoundTrip(trip: any): { outbound: FlightResult | null, return: FlightResult | null } {
    try {
      const routes = trip.routes || [];

      if (routes.length < 2) {
        return { outbound: null, return: null };
      }

      const outboundRoute = routes[0];
      const returnRoute = routes[1];

      return {
        outbound: this.parseKiwiRoute(outboundRoute),
        return: this.parseKiwiRoute(returnRoute),
      };
    } catch (error) {
      console.error('Error parsing Kiwi round-trip:', error);
      return { outbound: null, return: null };
    }
  }

  /**
   * Parse single Kiwi route to FlightResult
   */
  private parseKiwiRoute(route: any): FlightResult | null {
    try {
      const firstFlight = route.flights?.[0];
      const lastFlight = route.flights?.[route.flights.length - 1];

      if (!firstFlight || !lastFlight) {
        return null;
      }

      return {
        airline: firstFlight.airline?.name || 'Unknown Airline',
        flightNumber: firstFlight.flightNumber || 'N/A',
        departure: {
          airport: firstFlight.departure?.airport?.code || 'Unknown',
          time: this.formatTime(firstFlight.departure?.time),
          date: this.formatDate(firstFlight.departure?.time),
        },
        arrival: {
          airport: lastFlight.arrival?.airport?.code || 'Unknown',
          time: this.formatTime(lastFlight.arrival?.time),
          date: this.formatDate(lastFlight.arrival?.time),
        },
        duration: this.formatDuration(route.durationMinutes || 0),
        price: Math.round(route.price?.amount || 0),
        stops: route.flights.length - 1,
      };
    } catch (error) {
      console.error('Error parsing Kiwi route:', error);
      return null;
    }
  }

  /**
   * Parse Kiwi flights array
   */
  private parseKiwiFlights(flights: any[]): FlightResult[] {
    return flights
      .map(flight => this.parseKiwiRoute(flight.routes?.[0]))
      .filter(f => f !== null) as FlightResult[];
  }

  /**
   * Format location for Kiwi API (City:code or Country:code)
   */
  private formatLocation(location: string): string {
    const locationMap: { [key: string]: string } = {
      'Turkey': 'Country:TR',
      'Istanbul': 'City:istanbul_tr',
      'Thailand': 'Country:TH',
      'Bangkok': 'City:bangkok_th',
      'Phuket': 'City:phuket_th',
      'Chiang Mai': 'City:chiang_mai_th',
      'Krabi': 'City:krabi_th',
    };

    return locationMap[location] || `City:${location.toLowerCase().replace(' ', '_')}`;
  }

  /**
   * Format duration from minutes to human readable
   */
  private formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  }

  /**
   * Format ISO timestamp to time (HH:MM)
   */
  private formatTime(timestamp: string): string {
    if (!timestamp) return 'N/A';

    try {
      const date = new Date(timestamp);
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
    } catch {
      return 'N/A';
    }
  }

  /**
   * Format ISO timestamp to date (YYYY-MM-DD)
   */
  private formatDate(timestamp: string): string {
    if (!timestamp) return 'N/A';

    try {
      const date = new Date(timestamp);
      return date.toISOString().split('T')[0];
    } catch {
      return 'N/A';
    }
  }

  /**
   * Add days to date string
   */
  private addDays(dateStr: string, days: number): string {
    const date = new Date(dateStr);
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
  }

  /**
   * Mock flight data for development/fallback
   */
  private getMockFlights(params: FlightSearchParams): FlightResult[] {
    const basePrice = 300 + Math.floor(Math.random() * 500);
    const returnDate = params.returnDate || this.addDays(params.departureDate, 7);

    return [
      {
        airline: 'Turkish Airlines',
        flightNumber: 'TK750',
        departure: {
          airport: 'IST',
          time: '10:30',
          date: params.departureDate,
        },
        arrival: {
          airport: 'BKK',
          time: '02:15',
          date: params.departureDate,
        },
        duration: '10h 45m',
        price: basePrice,
        stops: 0,
      },
      {
        airline: 'Turkish Airlines',
        flightNumber: 'TK751',
        departure: {
          airport: 'BKK',
          time: '17:30',
          date: returnDate,
        },
        arrival: {
          airport: 'IST',
          time: '00:15',
          date: returnDate,
        },
        duration: '11h 45m',
        price: basePrice + 50,
        stops: 0,
      },
      {
        airline: 'Emirates',
        flightNumber: 'EK123',
        departure: {
          airport: 'IST',
          time: '14:00',
          date: params.departureDate,
        },
        arrival: {
          airport: 'BKK',
          time: '06:30',
          date: params.departureDate,
        },
        duration: '11h 30m',
        price: basePrice + 100,
        stops: 1,
      },
    ];
  }
}

export default new FlightService();
