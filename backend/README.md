# TravelAsist Backend API

Node.js/Express backend API with Supabase authentication for the TravelAsist-AI project.

## Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Fill in your Supabase credentials in `.env`:
   ```env
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

### 3. Run Development Server

```bash
npm run dev
```

The server will start on `http://localhost:3001`

## API Endpoints

### Health Check
```
GET /health
```
Returns server status.

### Authentication

#### Register
```
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "username": "johndoe",  // optional
  "fullName": "John Doe"   // optional
}
```

**Response:**
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "username": "johndoe"
    },
    "session": {
      "access_token": "jwt-token",
      "refresh_token": "refresh-token"
    }
  }
}
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "username": "johndoe"
    },
    "session": {
      "access_token": "jwt-token",
      "refresh_token": "refresh-token"
    }
  }
}
```

#### Get Profile (Protected)
```
GET /api/auth/profile
Authorization: Bearer {access_token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "username": "johndoe",
    "fullName": "John Doe",
    "createdAt": "2025-11-13T00:00:00.000Z"
  }
}
```

#### Logout (Protected)
```
POST /api/auth/logout
Authorization: Bearer {access_token}
```

**Response:**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

### Trip Planning

#### Create Trip Request (Protected)
```
POST /api/trips
Authorization: Bearer {access_token}
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

**Response:**
```json
{
  "success": true,
  "message": "Trip request created successfully",
  "data": {
    "trip_request": {
      "id": "uuid",
      "user_id": "uuid",
      "origin": "Turkey",
      "destination": "Thailand",
      "start_date": "2026-01-15",
      "end_date": "2026-01-25",
      "budget": 1500,
      "requested_cities": ["Bangkok", "Phuket", "Chiang Mai"],
      "accommodation_preference": "hostel",
      "travel_style": "slow",
      "status": "pending",
      "created_at": "2025-11-13T..."
    },
    "message": "Your trip is being planned. You will be notified when it's ready."
  }
}
```

#### Get User's Trips (Protected)
```
GET /api/trips
Authorization: Bearer {access_token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "trips": [
      {
        "id": "uuid",
        "origin": "Turkey",
        "destination": "Thailand",
        "start_date": "2026-01-15",
        "end_date": "2026-01-25",
        "budget": 1500,
        "status": "pending",
        "created_at": "2025-11-13T...",
        "generated_plans": []
      }
    ]
  }
}
```

#### Get Trip by ID (Protected)
```
GET /api/trips/:id
Authorization: Bearer {access_token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "trip": {
      "id": "uuid",
      "origin": "Turkey",
      "destination": "Thailand",
      "requested_cities": ["Bangkok", "Phuket"],
      "status": "completed",
      "generated_plans": [
        {
          "id": "uuid",
          "total_estimated_cost": 1450,
          "plan_data": { ... },
          "created_at": "2025-11-13T..."
        }
      ]
    }
  }
}
```

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── supabase.ts          # Supabase client configuration
│   ├── controllers/
│   │   ├── auth.controller.ts   # Auth business logic
│   │   └── trip.controller.ts   # Trip planning business logic
│   ├── middleware/
│   │   └── auth.ts              # JWT authentication middleware
│   ├── routes/
│   │   ├── auth.ts              # Auth route definitions
│   │   └── trips.ts             # Trip route definitions
│   ├── types/
│   │   └── index.ts             # TypeScript type definitions
│   ├── utils/
│   │   └── response.ts          # Standard API response helpers
│   └── index.ts                 # Express app entry point
├── .env                         # Environment variables (gitignored)
├── .env.example                 # Environment variables template
├── tsconfig.json                # TypeScript configuration
├── nodemon.json                 # Nodemon configuration
└── package.json                 # Dependencies and scripts
```

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Run production server (requires build)
- `npm run lint` - Run ESLint

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database & Auth**: Supabase
- **Security**: Helmet, CORS
- **Logging**: Morgan
- **Development**: Nodemon, ts-node
