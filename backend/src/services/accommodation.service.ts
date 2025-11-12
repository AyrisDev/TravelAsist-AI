import axios from 'axios';

interface AccommodationSearchParams {
  city: string;
  checkIn: string;
  checkOut: string;
  adults?: number;
  type?: 'hostel' | 'hotel' | 'apartment' | 'any';
  maxPrice?: number;
}

interface AccommodationResult {
  name: string;
  type: 'hostel' | 'hotel' | 'apartment';
  rating: number;
  pricePerNight: number;
  totalPrice: number;
  address?: string;
  amenities?: string[];
  distance?: string;
}

export class AccommodationService {
  private apiKey: string;
  private bookingHost: string;
  private pricelineHost: string;

  constructor() {
    this.apiKey = process.env.RAPIDAPI_KEY || '';
    this.bookingHost = process.env.RAPIDAPI_HOST_BOOKING || 'booking-com.p.rapidapi.com';
    this.pricelineHost = process.env.RAPIDAPI_HOST_PRICELINE || 'priceline-com-provider.p.rapidapi.com';
  }

  /**
   * Search for accommodations in a city
   */
  async searchAccommodations(params: AccommodationSearchParams): Promise<AccommodationResult[]> {
    try {
      if (!this.apiKey) {
        console.warn('RapidAPI key not configured, returning mock data');
        return this.getMockAccommodations(params);
      }

      const checkInDate = new Date(params.checkIn);
      const checkOutDate = new Date(params.checkOut);
      const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));

      // Use Booking.com API
      const response = await axios.get(`https://${this.bookingHost}/v1/hotels/search`, {
        headers: {
          'X-RapidAPI-Key': this.apiKey,
          'X-RapidAPI-Host': this.bookingHost,
        },
        params: {
          dest_type: 'city',
          dest_id: params.city,
          search_type: 'CITY',
          arrival_date: params.checkIn,
          departure_date: params.checkOut,
          adults: params.adults || 1,
          room_qty: 1,
          units: 'metric',
          temperature_unit: 'c',
          languagecode: 'en-us',
          currency_code: 'USD',
        },
        timeout: 10000,
      });

      if (response.data && response.data.result) {
        return this.parseAccommodationResults(response.data.result, nights, params.type, params.maxPrice);
      }

      return this.getMockAccommodations(params);
    } catch (error: any) {
      console.error('Accommodation API error:', error.message);
      return this.getMockAccommodations(params);
    }
  }

  /**
   * Get cheapest accommodation option
   */
  async getCheapestAccommodation(params: AccommodationSearchParams): Promise<AccommodationResult | null> {
    const accommodations = await this.searchAccommodations(params);

    if (accommodations.length === 0) {
      return null;
    }

    // Sort by total price and return cheapest
    return accommodations.sort((a, b) => a.totalPrice - b.totalPrice)[0];
  }

  /**
   * Get best value accommodation (balance of price and rating)
   */
  async getBestValueAccommodation(params: AccommodationSearchParams): Promise<AccommodationResult | null> {
    const accommodations = await this.searchAccommodations(params);

    if (accommodations.length === 0) {
      return null;
    }

    // Calculate value score (higher rating, lower price = better value)
    const scored = accommodations.map(acc => ({
      ...acc,
      valueScore: (acc.rating / 5) * 100 - (acc.pricePerNight / 10),
    }));

    return scored.sort((a, b) => b.valueScore - a.valueScore)[0];
  }

  /**
   * Parse API response to AccommodationResult format
   */
  private parseAccommodationResults(
    results: any[],
    nights: number,
    preferredType?: string,
    maxPrice?: number
  ): AccommodationResult[] {
    let accommodations = results.slice(0, 10).map((item: any) => {
      const pricePerNight = item.min_total_price ? Math.round(item.min_total_price / nights) : 50;
      const totalPrice = pricePerNight * nights;

      return {
        name: item.hotel_name || 'Unknown Hotel',
        type: this.determineType(item.accommodation_type_name || '', preferredType),
        rating: item.review_score ? parseFloat(item.review_score) / 2 : 3.5, // Convert 10-point to 5-point
        pricePerNight,
        totalPrice,
        address: item.address || undefined,
        amenities: item.amenities || [],
        distance: item.distance ? `${item.distance} km from center` : undefined,
      };
    });

    // Filter by type preference
    if (preferredType && preferredType !== 'any') {
      accommodations = accommodations.filter(acc => acc.type === preferredType);
    }

    // Filter by max price
    if (maxPrice) {
      accommodations = accommodations.filter(acc => acc.pricePerNight <= maxPrice);
    }

    return accommodations;
  }

  /**
   * Determine accommodation type from API response
   */
  private determineType(apiType: string, preferred?: string): 'hostel' | 'hotel' | 'apartment' {
    const lowerType = apiType.toLowerCase();

    if (preferred === 'hostel' || lowerType.includes('hostel') || lowerType.includes('dorm')) {
      return 'hostel';
    }

    if (preferred === 'apartment' || lowerType.includes('apartment') || lowerType.includes('condo')) {
      return 'apartment';
    }

    return 'hotel';
  }

  /**
   * Mock accommodation data for development/fallback
   */
  private getMockAccommodations(params: AccommodationSearchParams): AccommodationResult[] {
    const checkInDate = new Date(params.checkIn);
    const checkOutDate = new Date(params.checkOut);
    const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));

    const basePrice = params.type === 'hostel' ? 15 : params.type === 'hotel' ? 50 : 40;
    const priceVariance = Math.floor(Math.random() * 20);

    const type = params.type && params.type !== 'any' ? params.type : 'hostel';

    return [
      {
        name: `${params.city} Central ${type === 'hostel' ? 'Backpackers' : type === 'apartment' ? 'Apartments' : 'Hotel'}`,
        type,
        rating: 4.2,
        pricePerNight: basePrice + priceVariance,
        totalPrice: (basePrice + priceVariance) * nights,
        address: `${params.city} City Center`,
        amenities: ['WiFi', 'Air Conditioning', 'Breakfast'],
        distance: '0.5 km from center',
      },
      {
        name: `Cozy ${type === 'hostel' ? 'Hostel' : type === 'apartment' ? 'Studio' : 'Inn'} ${params.city}`,
        type,
        rating: 3.8,
        pricePerNight: basePrice + priceVariance - 5,
        totalPrice: (basePrice + priceVariance - 5) * nights,
        address: `${params.city}`,
        amenities: ['WiFi', 'Shared Kitchen'],
        distance: '1.2 km from center',
      },
      {
        name: `${params.city} Budget Stay`,
        type,
        rating: 3.5,
        pricePerNight: basePrice + priceVariance - 10,
        totalPrice: (basePrice + priceVariance - 10) * nights,
        address: `${params.city}`,
        amenities: ['WiFi'],
        distance: '2.0 km from center',
      },
    ];
  }
}

export default new AccommodationService();
