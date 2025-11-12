import { GoogleGenerativeAI } from '@google/generative-ai';

interface TripContext {
  origin: string;
  destination: string;
  startDate: string;
  endDate: string;
  budget: number;
  requestedCities: string[];
  accommodationPreference: string;
  travelStyle: string;
}

interface FlightData {
  outbound: any;
  return: any;
}

interface AccommodationData {
  [city: string]: any[];
}

interface TransportData {
  [route: string]: any[];
}

interface OptimizedPlan {
  dailyItinerary: any[];
  totalEstimatedCost: number;
  budgetDifference: number;
  breakdown: {
    flights: number;
    accommodation: number;
    transportation: number;
    activities: number;
  };
}

export class AIService {
  private genAI: GoogleGenerativeAI | null = null;
  private model: any = null;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      this.genAI = new GoogleGenerativeAI(apiKey);
      this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    } else {
      console.warn('Gemini API key not configured. AI optimization will use fallback logic.');
    }
  }

  /**
   * Generate optimized travel plan using AI
   */
  async generateOptimizedPlan(
    tripContext: TripContext,
    flightData: FlightData,
    accommodationData: AccommodationData,
    transportData: TransportData
  ): Promise<OptimizedPlan> {
    try {
      if (!this.model) {
        console.warn('AI model not initialized, using fallback optimization');
        return this.fallbackOptimization(tripContext, flightData, accommodationData, transportData);
      }

      const prompt = this.buildPrompt(tripContext, flightData, accommodationData, transportData);

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Parse AI response (should be JSON)
      const aiPlan = this.parseAIResponse(text);

      return aiPlan;
    } catch (error: any) {
      console.error('AI generation error:', error.message);
      return this.fallbackOptimization(tripContext, flightData, accommodationData, transportData);
    }
  }

  /**
   * Build prompt for Gemini AI
   */
  private buildPrompt(
    tripContext: TripContext,
    flightData: FlightData,
    accommodationData: AccommodationData,
    transportData: TransportData
  ): string {
    return `You are a travel planning AI assistant. Create an optimized day-by-day travel itinerary.

**Trip Context:**
- Origin: ${tripContext.origin}
- Destination: ${tripContext.destination}
- Dates: ${tripContext.startDate} to ${tripContext.endDate}
- Budget: $${tripContext.budget}
- Cities to visit: ${tripContext.requestedCities.join(', ')}
- Accommodation preference: ${tripContext.accommodationPreference}
- Travel style: ${tripContext.travelStyle}

**Available Flights:**
Outbound: ${JSON.stringify(flightData.outbound, null, 2)}
Return: ${JSON.stringify(flightData.return, null, 2)}

**Available Accommodations by City:**
${JSON.stringify(accommodationData, null, 2)}

**Available Inter-city Transportation:**
${JSON.stringify(transportData, null, 2)}

**Task:**
Create a detailed day-by-day itinerary that:
1. Stays within or close to the budget ($${tripContext.budget})
2. Includes all requested cities
3. Optimizes for ${tripContext.travelStyle} travel (fast = more flights, slow = more ground transport, adventure = diverse experiences)
4. Suggests 2-3 activities per day appropriate for each city
5. Balances cost and quality based on user preferences

**Output Format (JSON ONLY):**
{
  "dailyItinerary": [
    {
      "day": 1,
      "date": "YYYY-MM-DD",
      "city": "City Name",
      "accommodation": {
        "name": "Hotel/Hostel Name",
        "type": "hostel|hotel|apartment",
        "rating": 4.2,
        "pricePerNight": 25
      },
      "activities": [
        {
          "time": "09:00",
          "title": "Activity Name",
          "description": "Brief description",
          "estimatedCost": 10,
          "duration": "2h"
        }
      ],
      "transportation": {
        "type": "bus|train|flight|ferry",
        "departure": "HH:MM",
        "arrival": "HH:MM",
        "price": 20
      },
      "totalCost": 100
    }
  ],
  "breakdown": {
    "flights": 500,
    "accommodation": 300,
    "transportation": 100,
    "activities": 200
  }
}

Respond with ONLY valid JSON, no markdown formatting or additional text.`;
  }

  /**
   * Parse AI response to extract JSON
   */
  private parseAIResponse(text: string): OptimizedPlan {
    try {
      // Remove markdown code blocks if present
      let jsonText = text.trim();
      if (jsonText.startsWith('```json')) {
        jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      } else if (jsonText.startsWith('```')) {
        jsonText = jsonText.replace(/```\n?/g, '');
      }

      const parsed = JSON.parse(jsonText);

      // Calculate totals
      const totalCost = parsed.breakdown.flights +
        parsed.breakdown.accommodation +
        parsed.breakdown.transportation +
        parsed.breakdown.activities;

      return {
        dailyItinerary: parsed.dailyItinerary || [],
        totalEstimatedCost: totalCost,
        budgetDifference: 0, // Will be calculated in planner service
        breakdown: parsed.breakdown,
      };
    } catch (error) {
      console.error('Failed to parse AI response:', error);
      throw new Error('Invalid AI response format');
    }
  }

  /**
   * Fallback optimization when AI is not available
   */
  private fallbackOptimization(
    tripContext: TripContext,
    flightData: FlightData,
    accommodationData: AccommodationData,
    transportData: TransportData
  ): OptimizedPlan {
    const startDate = new Date(tripContext.startDate);
    const endDate = new Date(tripContext.endDate);
    const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const daysPerCity = Math.floor(totalDays / tripContext.requestedCities.length);

    const dailyItinerary: any[] = [];
    let currentDate = new Date(startDate);
    let currentCityIndex = 0;
    let dayInCity = 0;

    for (let day = 1; day <= totalDays; day++) {
      const city = tripContext.requestedCities[currentCityIndex];
      const accommodations = accommodationData[city] || [];
      const selectedAccommodation = accommodations[0] || {
        name: `${city} Accommodation`,
        type: tripContext.accommodationPreference === 'any' ? 'hostel' : tripContext.accommodationPreference,
        rating: 4.0,
        pricePerNight: 30,
      };

      const activities = this.generateActivities(city, day);

      // Add transportation if moving to next city
      let transportation = undefined;
      if (dayInCity === daysPerCity - 1 && currentCityIndex < tripContext.requestedCities.length - 1) {
        const nextCity = tripContext.requestedCities[currentCityIndex + 1];
        const route = `${city.toLowerCase()}-${nextCity.toLowerCase()}`;
        const transports = transportData[route] || [];
        transportation = transports[0] || {
          type: 'bus',
          departure: '08:00',
          arrival: '14:00',
          price: 25,
        };
      }

      const dayCost = selectedAccommodation.pricePerNight +
        activities.reduce((sum: number, act: any) => sum + (act.estimatedCost || 0), 0) +
        (transportation?.price || 0);

      dailyItinerary.push({
        day,
        date: currentDate.toISOString().split('T')[0],
        city,
        accommodation: selectedAccommodation,
        activities,
        transportation,
        totalCost: dayCost,
      });

      dayInCity++;
      if (dayInCity >= daysPerCity && currentCityIndex < tripContext.requestedCities.length - 1) {
        currentCityIndex++;
        dayInCity = 0;
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Calculate breakdown
    const flightsCost = (flightData.outbound?.price || 0) + (flightData.return?.price || 0);
    const accommodationCost = dailyItinerary.reduce((sum, day) => sum + day.accommodation.pricePerNight, 0);
    const transportationCost = dailyItinerary.reduce((sum, day) => sum + (day.transportation?.price || 0), 0);
    const activitiesCost = dailyItinerary.reduce((sum, day) =>
      sum + day.activities.reduce((s: number, a: any) => s + (a.estimatedCost || 0), 0), 0
    );

    const totalCost = flightsCost + accommodationCost + transportationCost + activitiesCost;

    return {
      dailyItinerary,
      totalEstimatedCost: totalCost,
      budgetDifference: tripContext.budget - totalCost,
      breakdown: {
        flights: flightsCost,
        accommodation: accommodationCost,
        transportation: transportationCost,
        activities: activitiesCost,
      },
    };
  }

  /**
   * Generate sample activities for a city
   */
  private generateActivities(city: string, day: number): any[] {
    const cityActivities: { [key: string]: any[] } = {
      Bangkok: [
        { time: '09:00', title: 'Grand Palace Visit', description: 'Explore the iconic Grand Palace and Wat Phra Kaew', estimatedCost: 15, duration: '3h' },
        { time: '14:00', title: 'Floating Market Tour', description: 'Experience traditional Thai floating markets', estimatedCost: 20, duration: '2h' },
        { time: '19:00', title: 'Street Food Tour', description: 'Sample delicious Thai street food', estimatedCost: 10, duration: '2h' },
      ],
      Phuket: [
        { time: '10:00', title: 'Beach Relaxation', description: 'Enjoy Patong or Kata Beach', estimatedCost: 0, duration: '3h' },
        { time: '14:00', title: 'Island Hopping', description: 'Visit Phi Phi Islands', estimatedCost: 35, duration: '4h' },
        { time: '19:00', title: 'Old Town Walk', description: 'Explore Phuket Old Town', estimatedCost: 5, duration: '2h' },
      ],
      'Chiang Mai': [
        { time: '08:00', title: 'Temple Tour', description: 'Visit Doi Suthep and other temples', estimatedCost: 10, duration: '3h' },
        { time: '13:00', title: 'Elephant Sanctuary', description: 'Ethical elephant experience', estimatedCost: 50, duration: '4h' },
        { time: '18:00', title: 'Night Bazaar', description: 'Shop at the famous night market', estimatedCost: 15, duration: '2h' },
      ],
    };

    const activities = cityActivities[city] || [
      { time: '10:00', title: 'City Exploration', description: `Explore ${city}`, estimatedCost: 10, duration: '3h' },
      { time: '15:00', title: 'Local Market Visit', description: 'Visit local markets', estimatedCost: 5, duration: '2h' },
    ];

    // Return 2-3 activities per day
    return activities.slice(0, Math.min(3, activities.length));
  }
}

export default new AIService();
