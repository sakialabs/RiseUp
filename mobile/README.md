# RiseUp Mobile App 📱

React Native mobile application for RiseUp Collective - built with Expo.

## Features

✅ **Authentication**

- Secure login and registration
- JWT token storage with Expo SecureStore
- Auto-redirect for logged-in users

✅ **Community Feed**

- View events and posts in chronological order
- React to posts (Care 💚, Solidarity ✊, Respect 🙏, Gratitude 🌟)
- Pull-to-refresh for latest updates

✅ **Events**

- Browse all community events
- View event details with date, time, and location
- Join/leave events
- See attendance count
- Map view integration

✅ **Map**

- Interactive map showing events with coordinates
- Tap markers to view event details
- Navigate to event detail page

✅ **Profile**

- View user/organization profile
- Display causes and bio
- List of organized events
- Logout functionality

✅ **Bottom Navigation**

- Quick access to Feed, Events, Map, and Profile
- Active state highlighting

## Tech Stack

- **React Native** 0.73
- **Expo** ~50.0
- **TypeScript** 5.3
- **React Navigation** via Expo Router
- **Axios** for API calls
- **react-native-maps** for map integration
- **date-fns** for date formatting
- **expo-secure-store** for secure token storage

## Getting Started

### Prerequisites

- Node.js 16+
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (Mac) or Android Emulator

### Installation

1. Install dependencies:
\`\`\`bash
cd mobile
npm install
\`\`\`

2. Start the development server:
\`\`\`bash
npm start
\`\`\`

3. Run on a platform:

- Press `i` for iOS simulator
- Press `a` for Android emulator
- Scan QR code with Expo Go app on your phone

### Environment Configuration

Create a `.env` file in the mobile directory:

\`\`\`
EXPO_PUBLIC_API_URL=<http://your-backend-url:8000/api/v1>
\`\`\`

For local development:

- iOS Simulator: `http://localhost:8000/api/v1`
- Android Emulator: `http://10.0.2.2:8000/api/v1`
- Physical Device: `http://YOUR_COMPUTER_IP:8000/api/v1`

## Project Structure

\`\`\`
mobile/
├── app/                      # App screens (Expo Router)
│   ├── auth/                # Authentication screens
│   │   ├── login.tsx       # Login screen
│   │   └── register.tsx    # Registration screen
│   ├── events/             # Event screens
│   │   └── [id].tsx        # Event detail screen
│   ├── feed.tsx            # Community feed
│   ├── events.tsx          # Events list
│   ├── map.tsx             # Map view
│   ├── profile.tsx         # User profile
│   ├── index.tsx           # Landing page
│   └── _layout.tsx         # Root layout with auth provider
├── components/             # Reusable UI components
│   ├── Badge.tsx          # Badge component
│   ├── BottomNav.tsx      # Bottom navigation
│   ├── Button.tsx         # Button component
│   ├── EventCard.tsx      # Event card for lists
│   └── PostCard.tsx       # Post card with reactions
├── lib/                   # Utilities
│   ├── api.ts            # API client with axios
│   └── auth.tsx          # Auth context and hooks
├── package.json
└── tsconfig.json
\`\`\`

## Design System

**Colors:**

- Charcoal: `#1C1C1C` - Primary text and UI elements
- Paper: `#FAF9F6` - Background
- Solidarity Red: `#B11226` - Primary actions, branding
- Earth Green: `#2F5D3A` - Secondary actions, success states
- Sun Yellow: `#E0B400` - Highlights, active states

**Typography:**

- Headings: Bold, 18-32px
- Body: Regular, 14-16px
- Labels: Medium 12-14px, uppercase with letter spacing

## Demo Accounts

All demo accounts use password: `password123`

- `maya@riseup.local` - Individual organizer
- `jamal@riseup.local` - Individual organizer  
- `rosa@riseup.local` - Individual organizer
- `collective@riseup.local` - Organization
- `solidarity@riseup.local` - Organization

## Key Screens

### Authentication Flow

- **Landing Page**: Welcome screen with values and CTA buttons
- **Login**: Email/password form with demo credentials
- **Register**: Multi-step form with profile type and causes selection

### Main App Flow

- **Feed**: Chronological feed of events and posts with reactions
- **Events**: List/Map toggle, event cards with details
- **Event Detail**: Full event info with join/leave button
- **Map**: Interactive map with event markers
- **Profile**: User info, causes, organized events, logout

## API Integration

All API calls go through `/lib/api.ts`:

- **Auth**: `authAPI.login()`, `authAPI.register()`
- **Events**: `eventAPI.list()`, `eventAPI.get()`, `eventAPI.join()`, `eventAPI.leave()`
- **Feed**: `feedAPI.get()`
- **Posts**: `postAPI.create()`, `postAPI.get()`
- **Reactions**: `reactionAPI.add()`, `reactionAPI.remove()`
- **Profiles**: `profileAPI.getMyProfile()`, `profileAPI.getProfileEvents()`

## Development Notes

- Uses Expo Router for file-based navigation
- Bottom navigation appears on main screens (feed, events, map, profile)
- Auth state managed via React Context
- Tokens stored securely with Expo SecureStore
- Pull-to-refresh implemented on feed
- Map markers link to event detail pages

## Known Limitations

- Map integration requires react-native-maps configuration
- Push notifications not yet implemented
- Offline support not yet implemented
- Image upload for profiles not yet implemented

## Next Steps

- [ ] Add post creation form
- [ ] Add event creation form
- [ ] Implement search and filters
- [ ] Add push notifications
- [ ] Add offline support
- [ ] Add image upload
- [ ] Add deep linking
- [ ] Add share functionality

## License

Part of the RiseUp Collective platform - see main README for details.
