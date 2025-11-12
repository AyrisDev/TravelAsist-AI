import { supabase } from '../config/supabase';
import flightService from './flight.service';
import accommodationService from './accommodation.service';
import transportService from './transport.service';
import aiService from './ai.service';

interface TripRequest {
  id: string;
  user_id: string;
  origin: string;
  destination: string;
  start_date: string;
  end_date: string;
  budget: number;
  requested_cities: string[];
  accommodation_preference: 'hostel' | 'hotel' | 'apartment' | 'any';
  travel_style: 'fast' | 'slow' | 'adventure';
}

export class PlannerService {
  /**
   * Main orchestrator - generates complete travel plan
   */
  async generateTravelPlan(tripRequest: TripRequest): Promise<void> {
    try {
      console.log(`Starting plan generation for trip ${tripRequest.id}`);

      // Step 1: Update status to processing
      await this.updateTripStatus(tripRequest.id, 'processing');

      // Step 2: Fetch all data in parallel
      const [flightData, accommodationData, transportData] = await Promise.all([
        this.fetchFlightData(tripRequest),
        this.fetchAccommodationData(tripRequest),
        this.fetchTransportData(tripRequest),
      ]);

      console.log('All travel data fetched successfully');

      // Step 3: Generate optimized plan using AI
      const optimizedPlan = await aiService.generateOptimizedPlan(
        {
          origin: tripRequest.origin,
          destination: tripRequest.destination,
          startDate: tripRequest.start_date,
          endDate: tripRequest.end_date,
          budget: tripRequest.budget,
          requestedCities: tripRequest.requested_cities,
          accommodationPreference: tripRequest.accommodation_preference,
          travelStyle: tripRequest.travel_style,
        },
        flightData,
        accommodationData,
        transportData
      );

      console.log('AI plan generated successfully');

      // Step 4: Build complete plan data structure
      const planData = this.buildPlanData(
        tripRequest,
        flightData,
        optimizedPlan
      );

      // Step 5: Save to database
      const { data: generatedPlan, error: planError } = await supabase
        .from('generated_plans')
        .insert([
          {
            trip_request_id: tripRequest.id,
            total_estimated_cost: optimizedPlan.totalEstimatedCost,
            plan_data: planData,
            status: 'completed',
          },
        ])
        .select()
        .single();

      if (planError) {
        throw planError;
      }

      // Step 6: Update trip request status
      await this.updateTripStatus(tripRequest.id, 'completed');

      console.log(`Plan generation completed for trip ${tripRequest.id}`);
    } catch (error: any) {
      console.error(`Plan generation failed for trip ${tripRequest.id}:`, error.message);

      // Mark as failed
      await this.updateTripStatus(tripRequest.id, 'failed');

      throw error;
    }
  }

  /**
   * Fetch flight data (outbound and return)
   */
  private async fetchFlightData(tripRequest: TripRequest) {
    console.log('Fetching flight data...');

    // Use Kiwi's round-trip search for better deals
    const roundTrip = await flightService.searchRoundTripFlights({
      origin: tripRequest.origin,
      destination: tripRequest.destination,
      departureDate: tripRequest.start_date,
      returnDate: tripRequest.end_date,
      adults: 1,
      currency: 'USD',
    });

    return {
      outbound: roundTrip.outbound,
      return: roundTrip.return
    };
  }

  /**
   * Fetch accommodation data for all cities
   */
  private async fetchAccommodationData(tripRequest: TripRequest) {
    console.log('Fetching accommodation data...');

    const startDate = new Date(tripRequest.start_date);
    const endDate = new Date(tripRequest.end_date);
    const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const daysPerCity = Math.floor(totalDays / tripRequest.requested_cities.length);

    const accommodationData: { [city: string]: any[] } = {};

    // Fetch accommodations for each city in parallel
    await Promise.all(
      tripRequest.requested_cities.map(async (city, index) => {
        const cityCheckIn = new Date(startDate);
        cityCheckIn.setDate(cityCheckIn.getDate() + index * daysPerCity);

        const cityCheckOut = new Date(cityCheckIn);
        cityCheckOut.setDate(cityCheckOut.getDate() + daysPerCity);

        const options = await accommodationService.searchAccommodations({
          city,
          checkIn: cityCheckIn.toISOString().split('T')[0],
          checkOut: cityCheckOut.toISOString().split('T')[0],
          adults: 1,
          type: tripRequest.accommodation_preference,
          maxPrice: Math.floor(tripRequest.budget / totalDays / 2), // Rough estimate
        });

        accommodationData[city] = options;
      })
    );

    return accommodationData;
  }

  /**
   * Fetch transport data between cities
   */
  private async fetchTransportData(tripRequest: TripRequest) {
    console.log('Fetching transport data...');

    const transportData: { [route: string]: any[] } = {};
    const cities = tripRequest.requested_cities;

    // Fetch transport options between consecutive cities
    for (let i = 0; i < cities.length - 1; i++) {
      const from = cities[i];
      const to = cities[i + 1];
      const route = `${from.toLowerCase()}-${to.toLowerCase()}`;

      const options = await transportService.searchTransport({
        from,
        to,
        date: tripRequest.start_date,
        type: tripRequest.travel_style === 'fast' ? 'flight' : 'any',
      });

      transportData[route] = options;
    }

    return transportData;
  }

  /**
   * Build complete plan data structure
   */
  private buildPlanData(
    tripRequest: TripRequest,
    flightData: any,
    optimizedPlan: any
  ) {
    const startDate = new Date(tripRequest.start_date);
    const endDate = new Date(tripRequest.end_date);
    const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

    return {
      id: tripRequest.id,
      requestId: tripRequest.id,
      userId: tripRequest.user_id,
      origin: tripRequest.origin,
      destination: tripRequest.destination,
      startDate: tripRequest.start_date,
      endDate: tripRequest.end_date,
      totalDays,
      userBudget: tripRequest.budget,
      totalEstimatedCost: optimizedPlan.totalEstimatedCost,
      budgetDifference: tripRequest.budget - optimizedPlan.totalEstimatedCost,
      status: 'completed',
      breakdown: optimizedPlan.breakdown,
      internationalFlight: {
        outbound: flightData.outbound,
        return: flightData.return,
      },
      dailyItinerary: optimizedPlan.dailyItinerary,
      createdAt: new Date().toISOString(),
    };
  }

  /**
   * Update trip request status
   */
  private async updateTripStatus(tripId: string, status: string) {
    const { error } = await supabase
      .from('trip_requests')
      .update({ status })
      .eq('id', tripId);

    if (error) {
      console.error('Failed to update trip status:', error);
    }
  }
}

export default new PlannerService();
