# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Gezgin Asistan (Travel Assistant)** is an AI-powered travel planning application that helps users create optimized multi-city trip itineraries. The app takes user inputs (dates, budget, destinations) and generates day-by-day travel plans including flights, accommodations, and inter-city transportation.

**Target Users**: Budget-conscious travelers (18-35), backpackers, students, and young professionals who want simplified travel planning.

## Repository Structure

This is a monorepo containing three main applications:

- **`mobile/`**: React Native mobile app (Expo + expo-router) - Primary user interface
- **`frontend/`**: Next.js web application (Currently minimal setup)
- **`backend/`**: Node.js/Express API server (Currently minimal setup)
- **`docs/`**: Contains PRD.md (Product Requirements Document in Turkish)

## Technology Stack

### Mobile App (Primary Application)
- **Framework**: React Native with Expo (~54.0.22)
- **Routing**: expo-router (~6.0.14) - File-based routing
- **Navigation**: @react-navigation (bottom-tabs, native-stack)
- **Language**: TypeScript (strict mode)
- **Styling**: Custom theme system with light/dark mode support
- **New Architecture**: Enabled (`newArchEnabled: true`)
- **React Compiler**: Enabled (experimental)

### Frontend (Web)
- **Framework**: Next.js 16.0.1 with App Router
- **Styling**: Tailwind CSS v4
- **Language**: TypeScript

### Backend (Planned)
- **Runtime**: Node.js with Express.js
- **Database**: Supabase (PostgreSQL + Auth)
- **AI Integration**: LLM API (Gemini or OpenAI)
- **Third-party APIs**: Flight, accommodation, and transportation services

## Development Commands

### Mobile App (Primary Development)
```bash
cd mobile

# Install dependencies
npm install

# Start development server
npm start
# or
npx expo start

# Platform-specific
npm run android      # Start on Android emulator
npm run ios          # Start on iOS simulator
npm run web          # Start web version

# Code quality
npm run lint         # Run ESLint

# Reset to clean project
npm run reset-project
```

### Frontend (Web)
```bash
cd frontend

# Development
npm run dev          # Start Next.js dev server (default: http://localhost:3000)

# Production
npm run build        # Create production build
npm start           # Start production server

# Code quality
npm run lint        # Run ESLint
```

### Backend (Not Yet Implemented)
```bash
cd backend
npm install
# Note: Backend implementation pending - see PRD.md for planned architecture
```

## Mobile App Architecture

### Routing Structure (expo-router)
The mobile app uses file-based routing:

```
app/
├── _layout.tsx           # Root layout with theme provider and Stack navigator
├── modal.tsx             # Modal screen example
└── (tabs)/               # Tab navigator group
    ├── _layout.tsx       # Tab layout with bottom tabs (Home, Explore)
    ├── index.tsx         # Home tab screen
    └── explore.tsx       # Explore tab screen
```

**Key Routing Concepts**:
- `(tabs)` is a route group - the parentheses make it a layout-only route
- The anchor is set to `(tabs)` via `unstable_settings` in root `_layout.tsx`
- Navigation uses Stack for modals and Tabs for main app navigation

### Theme System
Located in `constants/theme.ts`:
- Dual theme support (light/dark) with automatic switching
- Color scheme: `Colors.light` and `Colors.dark`
- Platform-specific fonts: `Fonts` object with iOS, web, and default variants
- Custom hooks: `useColorScheme()` for theme detection

### Component Organization
```
components/
├── themed-text.tsx       # Themed text component
├── themed-view.tsx       # Themed view component
├── parallax-scroll-view.tsx
├── haptic-tab.tsx        # Tab with haptic feedback
├── hello-wave.tsx
├── external-link.tsx
└── ui/
    ├── icon-symbol.tsx   # Cross-platform icon component
    ├── icon-symbol.ios.tsx  # iOS-specific SF Symbols
    └── collapsible.tsx
```

**Component Patterns**:
- Use `@/` path alias for imports (e.g., `@/components`, `@/hooks`, `@/constants`)
- Platform-specific files use `.ios.tsx`, `.android.tsx`, `.web.tsx` extensions
- Themed components accept `lightColor` and `darkColor` props

### Hooks
```
hooks/
├── use-color-scheme.ts      # Main color scheme hook
├── use-color-scheme.web.ts  # Web-specific implementation
└── use-theme-color.ts       # Hook for accessing theme colors
```

## Backend Architecture (Planned - See PRD.md)

The backend will implement:

### API Routes
- **`/auth`**: User registration and login (Supabase Auth)
  - `POST /auth/register`
  - `POST /auth/login`

- **`/trips`**: Trip planning CRUD operations
  - `POST /trips` - Create new trip plan (triggers AI planning)
  - `GET /trips/:id` - Get trip details
  - `GET /trips/user/:userId` - Get user's trip history

- **`/planner-service`**: AI-powered trip planning (async)
  - Fetches data from flight/hotel/transport APIs in parallel
  - Sends data + user preferences to LLM
  - Returns optimized day-by-day itinerary in JSON format

### Database Schema (Supabase/PostgreSQL)
- **`users`**: Managed by Supabase Auth
- **`profiles`**: User profile information
- **`trip_requests`**: User input data (origin, destination, dates, budget, cities, preferences)
- **`generated_plans`**: AI-generated itineraries (stored as JSONB)

### Third-party API Integrations
- **Flights**: Skyscanner (RapidAPI) or Kiwi (Tequila API)
- **Accommodation**: Booking.com (RapidAPI) or Hostelworld API
- **Transportation**: Rome2rio API or 12Go Asia API

## MVP Scope

**Included in MVP**:
- Email/password authentication (Supabase)
- Single-country trip planning (initially Thailand only)
- Day-by-day itinerary generation with AI
- Read-only plan display with cost breakdown
- Integration with 3 core APIs (flights, hotels, transport)

**Excluded from MVP** (planned for v2.0):
- In-app booking/reservations
- Drag-and-drop plan editing
- Activity/tour recommendations
- Multi-country itineraries
- Social login (Google/Apple)

## Key Technical Details

### TypeScript Configuration
- Strict mode enabled in mobile app (`"strict": true`)
- Path aliases configured: `@/*` maps to project root
- Expo types included automatically via `.expo/types/**/*.ts`

### Mobile App Features
- **Haptic feedback**: Uses `expo-haptics` for tab interactions
- **SF Symbols**: iOS-only symbol support via `expo-symbols`
- **Safe areas**: Handled via `react-native-safe-area-context`
- **Gestures**: `react-native-gesture-handler` + `react-native-reanimated`
- **Web support**: Via `react-native-web` for cross-platform deployment

### ESLint Configuration
- Mobile uses `eslint-config-expo` (v10.0.0)
- Frontend uses `eslint-config-next` (16.0.1)

## Project Status

**Current State**: Early MVP development
- Mobile app has boilerplate Expo setup with routing and theming
- Backend and frontend are minimal scaffolds
- Core trip planning features are not yet implemented

**Next Steps** (per PRD):
1. Implement Supabase authentication in mobile app
2. Build backend API endpoints (`/auth`, `/trips`, `/planner-service`)
3. Integrate third-party APIs for flights, hotels, transport
4. Develop AI prompt engineering for trip optimization
5. Create trip planning UI flow in mobile app
6. Implement plan display/visualization screens

## Important Notes

- The PRD document (`docs/PRD.md`) is in Turkish and contains detailed user stories and technical specifications
- The mobile app is the primary interface - web frontend is secondary
- Backend implementation should prioritize async processing for AI-powered planning
- Cost optimization is critical (budget-conscious target users + API/LLM costs)
- Initial focus is Thailand as the test market for trip planning
