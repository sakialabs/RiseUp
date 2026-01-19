# Changelog

All notable changes to RiseUp Collective will be documented here.

## [Unreleased]

### Added - 2026-01-19

#### SPRK Ecosystem & Unionized (Consolidated in Vision)

- ✅ **Comprehensive Vision Document** (`docs/vision.md`):
  - SPRK ecosystem purpose and principles
  - Core principles: People over platforms, Action over metrics, Calm over urgency, Dignity over growth, Systems over hype
  - Shared standards: No algorithms, no metrics, no growth hacks, accessibility, clear language
  - RiseUp Collective overview (community organizing + action)
  - Unionized overview (worker dignity + fair work)
  - Contributor guidelines and decision framework
  - User expectations and promises
- ✅ **Minimal UI Presence**:
  - Footer component with ecosystem mention
  - Added to feed and unionized pages
  - No navigation items, no dedicated pages
- ✅ **Unionized Implementation**:
  - Backend: FairWorkPosting model, API endpoints, database migration, seed data
  - Web: Landing page, detail pages, filters, navigation updates
  - Mobile: Main screen, detail screen, bottom nav updates
  - Philosophy: Wage transparency, worker-first, no corporate jargon

#### Backend API & Infrastructure

- ✅ Complete backend API (FastAPI + PostgreSQL + SQLModel)
- ✅ Docker Compose setup with PostgreSQL and API
- ✅ Database models: User, Profile, Event, Post, Attendance, Reaction
- ✅ API endpoints: Auth, Profiles, Events, Posts, Reactions, Feed (23 total)
- ✅ JWT authentication with bcrypt password hashing
- ✅ Database migrations with Alembic
- ✅ API documentation at /docs endpoint
- ✅ **Database Seeding Script** (`scripts/seed.py`):
  - 5 test users with realistic profiles
  - 6 sample events with coordinates
  - 7 community posts
  - Event attendances and post reactions
  - Grounded, action-oriented content
- ✅ **Comprehensive Error Handling System** (Task 14):
  - Global exception handlers for all error types (400, 401, 403, 404, 409, 500)
  - Custom exception classes (`RiseUpException`, `ValidationException`, `AuthenticationException`, etc.)
  - Standardized error response format matching design spec
  - Descriptive error messages with field-level details
  - Proper logging with severity levels
  - Database integrity error handling
- ✅ **Validation Utilities** (`app/core/validators.py`):
  - Email format validation
  - Password strength validation (min 8 chars, letters + numbers)
  - Text length validation (posts max 500 chars)
  - Future date validation (events can't be in past)
  - Geographic coordinates validation
  - Enum validation (reaction types, profile types, target types)
- ✅ **Profile Endpoints**:
  - GET /profiles/me - Get current user profile
  - PATCH /profiles/me - Update profile (name, bio, location, avatar, causes)
  - GET /profiles/{id} - Get any profile by ID
  - GET /profiles/{id}/events - Get events created by profile
  - GET /profiles/me/attending - Get events user is attending

#### Web Frontend (Next.js)

- ✅ Web frontend foundation (Next.js 15.1.6 + TypeScript + Tailwind CSS)
- ✅ Complete authentication system (login/register with JWT)
- ✅ Event management (create, browse, join events)
- ✅ Community feed (events + posts with reactions)
- ✅ Post creation modal with real-time updates
- ✅ **Interactive Map** with Leaflet (event locations) - Task 13:
  - Dynamic SSR-safe component loading
  - Events with coordinates displayed on map
  - Custom markers with event details in popups
  - Empty state handling and loading animations
  - List/Map view toggle on events page
- ✅ Profile page with causes and quick actions
- ✅ **Profile Editing** (`/profile/edit` page + modal):
  - Avatar selector with 20 avatar options
  - Bio editor (500 char limit with counter)
  - Location and cause selection
  - Real-time validation and error handling
- ✅ **Guide/Help Flow**: 7-step onboarding for new users with progress indicator
- ✅ **Framer Motion Animations**: Subtle, purposeful animations throughout
  - FadeIn, SlideIn, ScaleIn, StaggerContainer animation components
  - Hover effects and transitions on all interactive elements
  - Loading components (LoadingSkeleton, LoadingSpinner, LoadingDots)
- ✅ **Responsive Design**: Mobile-first approach with Tailwind breakpoints
  - All pages optimized for screens < 768px
  - Touch-friendly controls and navigation
  - Responsive headers with flex-wrap navigation
  - Mobile hamburger menu with slide-in panel
- ✅ **Polish & Empty States**:
  - Loading skeletons on feed, events, and profile pages
  - Enhanced empty states with emojis, helpful copy, and clear CTAs
  - Refined copy throughout ("Support reactions", "Join Event", "Guide")
  - Maintained RiseUp tone (no bot language, action-oriented)
- ✅ **Reusable Components**:
  - Logo component with hover animation
  - MobileNav with slide-in drawer
  - SearchBar with dropdown (UI ready, search pending)
  - ErrorBoundary for graceful error handling

#### Mobile App (React Native + Expo)

- ✅ Mobile app foundation (React Native 0.73 + Expo 50)
- ✅ Complete mobile authentication (login/register)
- ✅ Mobile feed with events and posts
- ✅ Mobile event browsing and joining
- ✅ **Event Detail Screen** (`/events/[id]`):
  - Full event information display
  - Join/leave event functionality
  - Attendance count and organizer info
  - Date/time formatting with date-fns
- ✅ Mobile map with react-native-maps
- ✅ Mobile profile management
- ✅ Bottom tab navigation
- ✅ Secure token storage with expo-secure-store
- ✅ **Design System** (`lib/design-tokens.ts`):
  - Complete color palette (Charcoal, Paper, Solidarity Red, Earth Green, Sun Yellow)
  - Typography system with Inter font family
  - Spacing, border radius, and shadow tokens
  - Reaction types and event types with proper labeling
  - Copy guidelines (no "RSVP", "likes", or "bot" language)
- ✅ **Enhanced Components** (Tasks 30, 33):
  - `ReactionButtons` - Four solidarity reactions (Care, Solidarity, Respect, Gratitude)
  - `CreatePostModal` - 500 char limit with validation
  - `Button` - Primary, secondary, and outline variants
  - `EventCard` and `PostCard` components
- ✅ **Event Creation Screen** (`app/events/new.tsx`) - Task 28:
  - Full event creation form with validation
  - Date/time picker for scheduling
  - Optional coordinates for map display
  - Event type selection (Rally, March, Workshop, etc.)
  - Cause tagging system
  - Future date validation
- ✅ **Guide/Help Screen** (`app/guide.tsx`) - Task 33:
  - 7-step onboarding flow
  - Progress indicator
  - Simple, grounded language (no "bot" terminology)
  - Action-oriented guidance
  - Links to key features
- ✅ **Dual-Mode Theme System** (Web & Mobile):
  - Complete light and dark mode palettes per `docs/styles.md`
  - Light Mode: Paper White `#FAF9F6` background, Charcoal Black `#1C1C1C` text
  - Dark Mode: Charcoal Dark `#121212` background, Paper Off-White `#EDEBE7` text
  - Shared accent colors (Solidarity Red, Earth Green, Sun Yellow)
  - Web: ThemeProvider with localStorage persistence
  - Web: CSS custom properties for smooth transitions
  - Web: ThemeToggle component (full + compact variants)
  - Mobile: ThemeProvider with AsyncStorage persistence
  - Mobile: System preference detection
  - Mobile: ThemeToggle component with emoji icons
  - Accessibility: 4.5:1 contrast ratio maintained in both modes
  - **Focus states**: Changed from Solidarity Red to Earth Green for subtle appearance
- ✅ **Theme-Aware Views** (All Pages Updated):
  - Home page: Fully theme-aware with proper color separation
  - Login page: Theme-aware with ThemeToggle, proper input styling
  - Register page: Theme-aware with interactive cause selection
  - Hero section uses `surface` color for visual separation
  - Footer uses `surface` color with subtle border
  - Sign In button now visible in both themes (outline style)
  - All hardcoded colors replaced with CSS custom properties
  - Smooth transitions between theme changes (0.2s ease)

### Development Environment - Fully Dockerized ✅

- **Docker Containers:**
  - `db` - PostgreSQL 15 (port 5432)
  - `api` - FastAPI backend (port 8000)
- **API Documentation:** <http://localhost:8000/docs>
- **Root Endpoint:** <http://localhost:8000/>
- **Database:** PostgreSQL with all tables migrated
- **Auto-reload:** Enabled for development

### Features Implemented

- User registration and login (web + mobile)
- Profile management (individual/group)
- Profile editing with avatar selector (20 avatars), bio, location, and causes
- Profile displays events user is attending
- Event creation, listing, and joining
- Event detail view (mobile) with full info and join/leave actions
- Post creation and viewing
- Reaction system (care, solidarity, respect, gratitude)
- Community feed (events + posts, chronological)
- Interactive map (Leaflet web, react-native-maps mobile)
- Attendance tracking
- Guided onboarding for new users
- Responsive design across all screen sizes
- Loading states and empty states with helpful CTAs

### Technical Improvements

- Fixed mobile auth import paths (auth.tsx location)
- Fixed mobile Button.tsx TypeScript style errors
- Updated mobile tsconfig.json (moduleResolution: bundler)
- Removed deprecated expo/tsconfig.base extends
- Fixed web feed page StaggerContainer closing tags
- Improved animation performance with 200ms transitions

### Changed

### Fixed

### Removed

---

**Format:** Short, action-focused entries organized by type.
