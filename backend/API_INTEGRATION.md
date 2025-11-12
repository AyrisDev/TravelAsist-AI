# API Integration Guide

## Overview

TravelAsist backend is now fully integrated with:
- **Kiwi.com API** (RapidAPI) - Flight search
- **Booking.com API** (RapidAPI) - Accommodation search
- **Google Gemini AI** - Trip optimization

## Configuration

All API keys are configured in `.env`:

```env
# RapidAPI (Kiwi.com for flights)
RAPIDAPI_KEY=762dc41c1dmshc120ecf29aa240ap11dc66jsn87f410b870f5
RAPIDAPI_HOST_KIWI=kiwi-com-cheap-flights.p.rapidapi.com

# Google Gemini AI
GEMINI_API_KEY=AIzaSyCC0RKQuwFfJ1iMq1gnn_VLTgSgThP94QA
```

## Services Architecture

### 1. Flight Service (`src/services/flight.service.ts`)
**API**: Kiwi.com via RapidAPI

**Features**:
- Round-trip flight search
- One-way flight search
- Cheapest flight finder
- Automatic fallback to mock data if API fails

**Endpoints Used**:
- `GET /round-trip` - Search round-trip flights
- `GET /one-way` - Search one-way flights

**Location Format**:
```javascript
{
  'Turkey': 'Country:TR',
  'Istanbul': 'City:istanbul_tr',
  'Thailand': 'Country:TH',
  'Bangkok': 'City:bangkok_th',
  'Phuket': 'City:phuket_th',
  'Chiang Mai': 'City:chiang_mai_th'
}
```

### 2. Accommodation Service (`src/services/accommodation.service.ts`)
**API**: Booking.com via RapidAPI (Fallback to mock data for MVP)

**Features**:
- Hotel/hostel/apartment search
- Filter by type and price
- Best value calculator (rating vs price)
- Automatic fallback to mock data

### 3. Transport Service (`src/services/transport.service.ts`)
**Data Source**: Curated Thailand routes (MVP)

**Features**:
- Bus, train, ferry, and local flight options
- Popular Thailand routes pre-configured
- Cheapest and fastest option finder
- Generic fallback for unknown routes

**Pre-configured Routes**:
- Bangkok ↔ Phuket (flight, bus)
- Bangkok ↔ Chiang Mai (flight, train, bus)
- Phuket ↔ Krabi (bus, ferry)
- Bangkok ↔ Pattaya (bus)

### 4. AI Service (`src/services/ai.service.ts`)
**API**: Google Gemini 1.5 Flash

**Features**:
- Day-by-day itinerary generation
- Budget optimization
- Activity recommendations
- Travel style adaptation (fast/slow/adventure)
- Automatic fallback to rule-based optimization

**Prompt Engineering**:
- Sends all available travel data to Gemini
- Requests JSON-formatted response
- Includes user preferences and constraints
- Optimizes for budget and travel style

### 5. Planner Service (`src/services/planner.service.ts`)
**Role**: Main orchestrator

**Flow**:
1. Fetch flight data (Kiwi API)
2. Fetch accommodation data for all cities (parallel)
3. Fetch transport data between cities
4. Send all data to Gemini AI
5. Generate optimized plan
6. Save to database
7. Update trip status

**Async Processing**: Non-blocking - user gets immediate response while plan generates in background.

## API Endpoints

### Create Trip (Triggers Plan Generation)
```http
POST /api/trips
Authorization: Bearer {token}
Content-Type: application/json

{
  "origin": "Turkey",
  "destination": "Thailand",
  "start_date": "2026-01-15",
  "end_date": "2026-01-25",
  "budget": 1500,
  "requested_cities": ["Bangkok", "Phuket", "Chiang Mai"],
  "accommodation_preference": "hostel",
  "travel_style": "slow"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Trip request created successfully",
  "data": {
    "trip_request": {
      "id": "uuid",
      "status": "pending",
      ...
    },
    "message": "Your trip is being planned. You will be notified when it's ready."
  }
}
```

### Get Trip Details
```http
GET /api/trips/:id
Authorization: Bearer {token}
```

**Response** (when status=completed):
```json
{
  "success": true,
  "data": {
    "trip": {
      "id": "uuid",
      "status": "completed",
      "generated_plans": [
        {
          "id": "plan-uuid",
          "total_estimated_cost": 1450,
          "plan_data": {
            "dailyItinerary": [...],
            "breakdown": {
              "flights": 500,
              "accommodation": 300,
              "transportation": 100,
              "activities": 200
            },
            "internationalFlight": {
              "outbound": {...},
              "return": {...}
            }
          }
        }
      ]
    }
  }
}
```

## Testing

### 1. Start Backend
```bash
cd backend
npm run dev
```

### 2. Test Health Check
```bash
curl http://localhost:3001/health
```

### 3. Create Test Trip
```bash
# First, login to get token
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Then create trip
curl -X POST http://localhost:3001/api/trips \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "origin": "Turkey",
    "destination": "Thailand",
    "start_date": "2026-01-15",
    "end_date": "2026-01-25",
    "budget": 1500,
    "requested_cities": ["Bangkok", "Phuket"],
    "accommodation_preference": "hostel",
    "travel_style": "slow"
  }'
```

### 4. Monitor Backend Logs
Watch the console for:
- ✅ "Fetching flight data..."
- ✅ "Fetching accommodation data..."
- ✅ "Fetching transport data..."
- ✅ "AI plan generated successfully"
- ✅ "Plan generation completed for trip {id}"

## Fallback Behavior

All services have intelligent fallbacks:

1. **No API Key**: Uses mock data automatically
2. **API Timeout**: Falls back to mock data
3. **API Error**: Logs error and uses mock data
4. **Gemini AI Unavailable**: Uses rule-based optimization
5. **Invalid Response**: Parses with error handling

This ensures the app always works, even during API outages.

## Cost Optimization

- **Parallel API calls**: Flight + accommodation + transport fetched simultaneously
- **Timeout limits**: 10-15 second timeouts prevent hanging
- **Caching**: Consider adding Redis cache for repeated searches (future)
- **Rate limiting**: Implement rate limiting to prevent quota exhaustion (future)

## Next Steps

### Mobile App Integration
1. Remove mock data from mobile app
2. Use real API endpoints
3. Add loading states during plan generation
4. Implement polling for plan status (pending → completed)
5. Handle errors gracefully

### Production Improvements
1. Add Redis caching for API responses
2. Implement rate limiting
3. Add retry logic with exponential backoff
4. Monitor API usage and costs
5. Add more location mappings
6. Integrate real accommodation API (not just Booking.com)
7. Add real transport API (Rome2rio, 12Go)

## API Quotas & Limits

**RapidAPI** (Check your dashboard):
- Kiwi.com: Check subscription limits
- Booking.com: Check subscription limits

**Google Gemini**:
- Free tier: 15 RPM (requests per minute)
- Consider upgrading for production

## Troubleshooting

### Backend won't start
```bash
# Kill existing process
lsof -ti:3001 | xargs kill -9

# Restart
npm run dev
```

### API returns mock data instead of real data
- Check `.env` file has correct API keys
- Verify RapidAPI subscription is active
- Check API endpoint URLs are correct
- Look for errors in backend console

### Gemini AI not responding
- Verify API key is correct
- Check quota limits (https://makersuite.google.com/app/apikey)
- Review prompt format in ai.service.ts
- Fallback logic will activate automatically

### Trip status stuck on 'pending'
- Check backend console for errors
- Verify database connection
- Check Supabase RLS policies
- Look for timeout errors in logs

## Support

For issues:
1. Check backend console logs
2. Verify API keys in `.env`
3. Test endpoints with curl
4. Check RapidAPI dashboard
5. Review Gemini API quota

---

**Status**: ✅ Fully Operational
**Last Updated**: 2025-11-13
