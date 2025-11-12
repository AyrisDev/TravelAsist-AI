# TravelAsist Mobile App

React Native mobile application built with Expo for the TravelAsist-AI project.

## Features

- ✅ **Authentication**: Email/password login and registration with Supabase
- ✅ **Auto-redirects**: Automatic navigation based on auth state
- ✅ **Dark Mode**: Full light/dark theme support
- ✅ **Cross-platform**: iOS, Android, and Web support

## Tech Stack

- **Framework**: React Native with Expo (~54.0.22)
- **Routing**: expo-router (~6.0.14) - File-based routing
- **Navigation**: @react-navigation (bottom-tabs, native-stack)
- **Auth & Database**: Supabase
- **Language**: TypeScript (strict mode)
- **Styling**: Custom theme system with light/dark mode

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI (installed automatically)
- iOS Simulator (Mac only) or Android Emulator
- Supabase account with project credentials

## Setup

### 1. Install Dependencies

```bash
cd mobile
npm install
```

### 2. Configure Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Fill in your Supabase credentials in `.env`:
   ```env
   EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   EXPO_PUBLIC_API_URL=http://localhost:3001
   ```

### 3. Start Development Server

```bash
npm start
```

This will start the Expo development server. You can then:
- Press `i` to open iOS Simulator
- Press `a` to open Android Emulator
- Press `w` to open in web browser
- Scan QR code with Expo Go app on your phone

### Platform-Specific Commands

```bash
npm run ios      # Start on iOS simulator
npm run android  # Start on Android emulator
npm run web      # Start web version
```

## Project Structure

```
mobile/
├── app/
│   ├── (auth)/              # Authentication screens
│   │   ├── _layout.tsx      # Auth layout
│   │   ├── login.tsx        # Login screen
│   │   └── register.tsx     # Register screen
│   ├── (tabs)/              # Main app tabs
│   │   ├── _layout.tsx      # Tab layout
│   │   ├── index.tsx        # Home tab
│   │   └── explore.tsx      # Explore tab
│   ├── _layout.tsx          # Root layout with providers
│   └── index.tsx            # Entry point with auth redirect
├── components/              # Reusable components
│   ├── themed-text.tsx
│   ├── themed-view.tsx
│   └── ui/
├── contexts/
│   └── auth-context.tsx     # Auth state management
├── lib/
│   └── supabase.ts          # Supabase client config
├── hooks/                   # Custom React hooks
├── constants/
│   └── theme.ts             # Theme colors and fonts
└── assets/                  # Images, fonts, etc.
```

## Authentication Flow

1. **Entry Point** (`app/index.tsx`):
   - Checks authentication state
   - Redirects to login if not authenticated
   - Redirects to home if authenticated

2. **Login/Register** (`app/(auth)/`):
   - Email/password authentication
   - Username and full name (optional)
   - Validation and error handling

3. **Protected Routes** (`app/(tabs)/`):
   - Only accessible when authenticated
   - User info displayed on home screen
   - Logout functionality

## Available Scripts

- `npm start` - Start Expo development server
- `npm run ios` - Start on iOS simulator
- `npm run android` - Start on Android emulator
- `npm run web` - Start web version
- `npm run lint` - Run ESLint
- `npm run reset-project` - Reset to clean project state

## Theme System

Located in `constants/theme.ts`:
- Dual theme support (light/dark)
- Platform-specific fonts
- Color scheme: `Colors.light` and `Colors.dark`
- Custom hook: `useColorScheme()`

## Key Packages

- `@supabase/supabase-js` - Supabase client
- `@react-native-async-storage/async-storage` - Async storage for auth session
- `@react-native-community/datetimepicker` - Native date picker component
- `expo-router` - File-based routing
- `react-native-url-polyfill` - URL polyfill for Supabase

## Development Tips

### Authentication Testing

1. Register a new account via the app
2. Check Supabase Dashboard → Authentication → Users
3. Test login with registered credentials
4. Test logout functionality

### Hot Reload

The app supports hot reload. Any changes you make will automatically refresh:
- Shake device (physical) or Cmd+D (iOS Simulator) or Cmd+M (Android Emulator) to open dev menu
- Enable "Fast Refresh" in dev menu

### Debugging

- Use React Native Debugger or Expo Dev Tools
- Check console logs in terminal where `npm start` is running
- Use `console.log()` for debugging
- Check Supabase Dashboard for auth and database issues

## Next Steps (Per PRD)

### Trip Planning Flow (US-2, 3, 4)
- Create trip planning form screens
- Date picker for start/end dates
- Budget input
- City multi-select
- Preferences (accommodation, travel style)

### Plan Display (US-6, 7, 8, 9)
- Timeline view for day-by-day itinerary
- Flight details display
- Hotel recommendations
- Transportation between cities
- Budget breakdown

### Integration
- Connect to backend API endpoints
- Fetch and display generated trip plans
- Handle loading states
- Error handling and retry logic

## Troubleshooting

### App won't start
- Clear cache: `rm -rf node_modules && npm install`
- Clear Expo cache: `npx expo start -c`

### Supabase errors
- Check `.env` file has correct credentials
- Verify Supabase project is active
- Check network connection

### Build errors
- Update dependencies: `npm update`
- Check TypeScript errors: `npx tsc --noEmit`

## Resources

- [Expo Documentation](https://docs.expo.dev)
- [React Native Documentation](https://reactnative.dev)
- [Expo Router Documentation](https://docs.expo.dev/router/introduction/)
- [Supabase Documentation](https://supabase.com/docs)
