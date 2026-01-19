# Implementation Plan: RiseUp Collective MVP

## Overview

This implementation plan follows the build order: Data models → Auth → Events → Feed → Map → Profiles → Guide → Polish. Each major component includes implementation tasks followed by property-based testing tasks to validate correctness properties from the design document.

## Tasks

- [ ] 1. Set up project structure and dependencies
  - Create backend directory structure (app/, tests/, migrations/)
  - Create frontend web directory structure (app/, components/, lib/)
  - Create mobile directory structure (src/, components/)
  - Set up Docker Compose with PostgreSQL and backend service
  - Install backend dependencies: FastAPI, SQLModel, Pydantic, pytest, Hypothesis, bcrypt, python-jose
  - Install web dependencies: Next.js, TypeScript, Tailwind, shadcn/ui, Framer Motion, fast-check, Vitest
  - Install mobile dependencies: React Native, Expo, navigation libraries
  - Configure environment variables for database connection and JWT secret
  - _Requirements: All (foundation)_

- [ ] 2. Implement database models and schema
  - [ ] 2.1 Create SQLModel data models
    - Implement User model with email, hashed_password, timestamps
    - Implement Profile model with user_id FK, name, bio, location, causes, profile_type
    - Implement Event model with creator_id FK, title, description, event_date, location, coordinates, tags
    - Implement Post model with creator_id FK, text, image_url, timestamps
    - Implement Attendance model with user_id FK, event_id FK, unique constraint
    - Implement Reaction model with user_id FK, target_type, target_id, reaction_type, unique constraint
    - Add database constraints (foreign keys, check constraints, unique constraints)
    - _Requirements: 2.2, 3.1, 6.1, 4.5, 7.1, 12.1_
  
  - [ ]* 2.2 Write property test for timestamp auto-generation (OPTIONAL - can use unit tests)
    - **Property 33: Timestamp Auto-Generation**
    - **Validates: Requirements 12.3**
  
  - [ ]* 2.3 Write property test for foreign key integrity (OPTIONAL - can use unit tests)
    - **Property 18: Attendance Foreign Key Integrity**
    - **Validates: Requirements 4.5, 12.1, 12.4**
  
  - [ ] 2.4 Create database migration scripts
    - Set up Alembic for migrations
    - Generate initial migration from models
    - _Requirements: 12.1_

- [ ] 3. Implement authentication system
  - [ ] 3.1 Create authentication service
    - Implement password hashing with bcrypt
    - Implement JWT token generation with 7-day expiration
    - Implement JWT token verification
    - Implement user registration logic
    - Implement user login logic
    - _Requirements: 1.1, 1.2, 1.5, 14.1_
  
  - [ ] 3.2 Create authentication API endpoints
    - POST /auth/register - user registration
    - POST /auth/login - user authentication
    - POST /auth/logout - session invalidation (client-side)
    - Add JWT middleware for protected routes
    - _Requirements: 1.1, 1.2, 1.3, 14.4_
  
  - [ ]* 3.3 Write property test for user registration (MVP-CRITICAL)
    - **Property 1: User Registration Creates Account and Profile**
    - **Validates: Requirements 1.1, 2.1**
    - **Focus: Exactly one user account with exactly one profile**
  
  - [ ]* 3.4 Write property test for authentication round trip (OPTIONAL - can use integration tests)
    - **Property 2: Authentication Round Trip**
    - **Validates: Requirements 1.2, 14.1, 14.4**
  
  - [ ]* 3.5 Write property test for logout invalidation (OPTIONAL - can use integration tests)
    - **Property 3: Logout Invalidates Session**
    - **Validates: Requirements 1.3**
  
  - [ ]* 3.6 Write property test for invalid credentials rejection (OPTIONAL - can use unit tests)
    - **Property 4: Invalid Credentials Rejected**
    - **Validates: Requirements 1.4**
  
  - [ ]* 3.7 Write property test for password validation (OPTIONAL - can use unit tests)
    - **Property 5: Password Validation Enforced**
    - **Validates: Requirements 1.5**
  
  - [ ]* 3.8 Write property test for JWT expiration (OPTIONAL - can use integration tests)
    - **Property 36: JWT Token Expiration Enforced**
    - **Validates: Requirements 14.2, 14.5**

- [ ] 4. Checkpoint - Ensure authentication tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 5. Implement event system
  - [ ] 5.1 Create event service
    - Implement event creation with validation (date not in past)
    - Implement event retrieval by ID
    - Implement event query for map (events with coordinates)
    - Implement event query for feed (all events)
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.6_
  
  - [ ] 5.2 Create event API endpoints
    - POST /events - create event (authenticated)
    - GET /events/:id - get event detail
    - GET /events - list events for feed
    - GET /events/map - list events with coordinates for map
    - _Requirements: 3.1, 3.5, 8.1, 9.1_
  
  - [ ]* 5.3 Write property test for event creation and persistence (MVP-CRITICAL)
    - **Property 10: Event Creation Persists with Creator Association**
    - **Validates: Requirements 3.1, 3.3**
    - **Focus: Event persists with correct creator association**
  
  - [ ]* 5.4 Write property test for optional coordinates (OPTIONAL - can use unit tests)
    - **Property 11: Events Support Optional Coordinates**
    - **Validates: Requirements 3.2**
  
  - [ ]* 5.5 Write property test for event tags persistence (OPTIONAL - can use unit tests)
    - **Property 12: Event Tags Persist**
    - **Validates: Requirements 3.4**
  
  - [ ]* 5.6 Write property test for events in feed and map (OPTIONAL - can use integration tests)
    - **Property 13: Events Appear in Feed and Map**
    - **Validates: Requirements 3.5**
  
  - [ ]* 5.7 Write property test for past date rejection (OPTIONAL - can use unit tests)
    - **Property 14: Past Event Dates Rejected**
    - **Validates: Requirements 3.6**
  
  - [ ]* 5.8 Write property test for event detail fields (OPTIONAL - can use integration tests)
    - **Property 32: Event Detail Contains All Fields**
    - **Validates: Requirements 9.1, 9.3**

- [ ] 6. Implement attendance system
  - [ ] 6.1 Create attendance service
    - Implement join event logic with duplicate prevention
    - Implement leave event logic
    - Implement attendance check (is user attending?)
    - Implement attendee count calculation
    - Implement attendee list retrieval
    - _Requirements: 4.1, 4.2, 4.3, 4.4_
  
  - [ ] 6.2 Create attendance API endpoints
    - POST /events/:id/join - join event (authenticated)
    - DELETE /events/:id/leave - leave event (authenticated)
    - GET /events/:id/attendees - get attendee count and list
    - _Requirements: 4.1, 4.4, 9.4_
  
  - [ ]* 6.3 Write property test for attendance recording (OPTIONAL - can use unit tests)
    - **Property 15: Attendance Recording and Counting**
    - **Validates: Requirements 4.1, 4.2, 9.2**
  
  - [ ]* 6.4 Write property test for attendance idempotence (MVP-CRITICAL)
    - **Property 16: Attendance Idempotence**
    - **Validates: Requirements 4.3**
    - **Focus: Joining same event multiple times results in exactly one record**
  
  - [ ]* 6.5 Write property test for attendance round trip (OPTIONAL - can use integration tests)
    - **Property 17: Attendance Round Trip**
    - **Validates: Requirements 4.4**

- [ ] 7. Checkpoint - Ensure event and attendance tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 8. Implement post system
  - [ ] 8.1 Create post service
    - Implement post creation with text length validation (max 500 chars)
    - Implement post retrieval by ID
    - Implement post query for feed
    - _Requirements: 6.1, 6.3, 6.4_
  
  - [ ] 8.2 Create post API endpoints
    - POST /posts - create post (authenticated)
    - GET /posts/:id - get post detail
    - _Requirements: 6.1, 6.5_
  
  - [ ]* 8.3 Write property test for post creation (OPTIONAL - can use unit tests)
    - **Property 23: Post Creation Persists with Creator Association**
    - **Validates: Requirements 6.1, 6.3**
  
  - [ ]* 8.4 Write property test for optional images (OPTIONAL - can use unit tests)
    - **Property 24: Posts Support Optional Images**
    - **Validates: Requirements 6.2**
  
  - [ ]* 8.5 Write property test for text length validation (OPTIONAL - can use unit tests)
    - **Property 25: Post Text Length Validation**
    - **Validates: Requirements 6.4**
  
  - [ ]* 8.6 Write property test for posts in feed (OPTIONAL - can use integration tests)
    - **Property 26: Posts Appear in Feed**
    - **Validates: Requirements 6.5**

- [ ] 9. Implement reaction system
  - [ ] 9.1 Create reaction service
    - Implement add/update reaction logic (upsert behavior - exactly one active reaction per user per target)
    - Updating a reaction replaces the previous one (no reaction history tracking)
    - Implement remove reaction logic
    - Implement reaction count calculation by type (aggregate via queries)
    - Validate reaction types (care, solidarity, respect, gratitude)
    - Avoid complex polymorphic ORM relationships
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_
  
  - [ ] 9.2 Create reaction API endpoints
    - POST /reactions - add or update reaction (authenticated)
    - DELETE /reactions - remove reaction (authenticated)
    - GET /events/:id/reactions - get reaction counts for event
    - GET /posts/:id/reactions - get reaction counts for post
    - _Requirements: 7.2, 7.3, 7.5_
  
  - [ ]* 9.3 Write property test for valid reaction types (OPTIONAL - can use unit tests)
    - **Property 27: Only Valid Reaction Types Accepted**
    - **Validates: Requirements 7.1**
  
  - [ ]* 9.4 Write property test for reaction recording (OPTIONAL - can use unit tests)
    - **Property 28: Reaction Recording and Counting**
    - **Validates: Requirements 7.2, 7.3, 9.5**
  
  - [ ]* 9.5 Write property test for reaction update (MVP-CRITICAL)
    - **Property 29: Reaction Update (Not Duplicate)**
    - **Validates: Requirements 7.4**
    - **Focus: Exactly one active reaction per user per target, updates replace previous**
  
  - [ ]* 9.6 Write property test for reaction round trip (OPTIONAL - can use integration tests)
    - **Property 30: Reaction Round Trip**
    - **Validates: Requirements 7.5**

- [ ] 10. Implement feed system
  - [ ] 10.1 Create feed service
    - Implement feed query combining events and posts (simple UNION query)
    - Sort by created_at descending (chronological, no algorithm)
    - Implement pagination with limit/offset
    - Include creator profile information in feed items
    - No caching layer required for MVP
    - No ranking, scoring, or weighting logic
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_
  
  - [ ] 10.2 Create feed API endpoint
    - GET /feed - get chronological feed with pagination
    - _Requirements: 5.1, 5.2, 5.3_
  
  - [ ]* 10.3 Write property test for feed chronological ordering (MVP-CRITICAL)
    - **Property 19: Feed Chronological Ordering**
    - **Validates: Requirements 5.1, 5.3, 15.1, 15.2**
    - **Focus: Feed returns items in descending chronological order, no algorithmic reordering**
  
  - [ ]* 10.4 Write property test for feed contains both types (OPTIONAL - can use integration tests)
    - **Property 20: Feed Contains Both Events and Posts**
    - **Validates: Requirements 5.2**
  
  - [ ]* 10.5 Write property test for new items in feed (OPTIONAL - can use integration tests)
    - **Property 21: New Items Appear in Feed Immediately**
    - **Validates: Requirements 5.4**
  
  - [ ]* 10.6 Write property test for feed item fields (OPTIONAL - can use integration tests)
    - **Property 22: Feed Items Contain Required Fields**
    - **Validates: Requirements 5.5**
  
  - [ ]* 10.7 Write property test for feed pagination order (OPTIONAL - can use integration tests)
    - **Property 37: Feed Pagination Preserves Order**
    - **Validates: Requirements 15.4**

- [ ] 11. Checkpoint - Ensure feed tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 12. Implement profile system
  - [ ] 12.1 Create profile service
    - Implement profile update logic
    - Implement profile retrieval by ID
    - Implement profile events query (ordered by event_date)
    - Ensure no social metrics in responses
    - _Requirements: 2.3, 2.4, 2.6, 13.1, 13.2_
  
  - [ ] 12.2 Create profile API endpoints
    - GET /profiles/:id - get profile detail
    - PUT /profiles/:id - update profile (authenticated, own profile only)
    - GET /profiles/:id/events - get events created by profile
    - _Requirements: 2.3, 2.4, 13.1_
  
  - [ ]* 12.3 Write property test for profile updates (OPTIONAL - can use unit tests)
    - **Property 6: Profile Updates Persist**
    - **Validates: Requirements 2.3**
  
  - [ ]* 12.4 Write property test for profile required fields (OPTIONAL - can use unit tests)
    - **Property 7: Profile Contains Required Fields**
    - **Validates: Requirements 2.2**
  
  - [ ]* 12.5 Write property test for profile events query (OPTIONAL - can use integration tests)
    - **Property 8: Profile Events Query Correctness**
    - **Validates: Requirements 2.4, 13.1, 13.2, 15.3**
  
  - [ ]* 12.6 Write property test for no social metrics (OPTIONAL - can use unit tests)
    - **Property 9: No Social Metrics in Profile Responses**
    - **Validates: Requirements 2.6**
  
  - [ ]* 12.7 Write property test for profile event list fields (OPTIONAL - can use integration tests)
    - **Property 35: Profile Event List Contains Required Fields**
    - **Validates: Requirements 13.4**

- [ ] 13. Implement map functionality
  - [ ] 13.1 Update event service for map queries
    - Ensure map endpoint returns only events with coordinates
    - Events without coordinates still exist and appear elsewhere (feed, profiles)
    - Exclude posts from map results (posts never appear on map)
    - _Requirements: 8.1, 8.2, 8.6_
  
  - [ ]* 13.2 Write property test for map events only (OPTIONAL - can use integration tests)
    - **Property 31: Map Contains Only Events with Coordinates**
    - **Validates: Requirements 8.1, 8.2, 8.6**

- [ ] 14. Implement error handling and validation
  - [ ] 14.1 Add global exception handlers
    - Handle validation errors (400)
    - Handle authentication errors (401)
    - Handle not found errors (404)
    - Handle conflict errors (409)
    - Handle server errors (500)
    - Return consistent error response format
    - _Requirements: 1.4, 12.5_
  
  - [ ]* 14.2 Write property test for validation errors (OPTIONAL - can use unit tests)
    - **Property 34: Validation Errors Are Descriptive**
    - **Validates: Requirements 12.5**

- [ ] 15. Checkpoint - Ensure all backend tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 16. Implement web frontend authentication
  - [ ] 16.1 Create auth components and pages
    - Create login page with form validation
    - Create registration page with form validation
    - Implement JWT token storage (prefer httpOnly cookies for web)
    - Supabase Auth may be used for registration/login
    - Backend must validate JWTs for protected endpoints
    - Create auth context for managing user state
    - Implement protected route wrapper
    - _Requirements: 1.1, 1.2, 1.3_
  
  - [ ] 16.2 Create auth API client functions
    - Implement register API call
    - Implement login API call
    - Implement logout (clear token)
    - Add auth token to API request headers
    - _Requirements: 1.1, 1.2, 1.3_

- [ ] 17. Implement web frontend event features
  - [ ] 17.1 Create event components
    - Create EventCard component for feed/list display
    - Create EventDetail component for full event page
    - Create CreateEventForm component with validation
    - Create JoinEventButton component (text: "Join" or "I will show up", not RSVP)
    - _Requirements: 3.1, 9.1, 9.4_
  
  - [ ] 17.2 Create event pages
    - Create /events/[id] page for event detail
    - Create /events/new page for event creation
    - Integrate with backend API
    - _Requirements: 3.1, 9.1_
  
  - [ ] 17.3 Implement event creation flow
    - Form with title, description, date/time picker, location, tags
    - Optional coordinate input or map picker
    - Validation and error display
    - Use "Join" or "I will show up" button text (not RSVP)
    - Redirect to event detail on success
    - _Requirements: 3.1, 3.2, 3.4, 3.6_

- [ ] 18. Implement web frontend feed
  - [ ] 18.1 Create feed components
    - Create FeedItem component (handles both events and posts)
    - Create Feed component with infinite scroll or pagination
    - Display creator info, timestamp, content preview
    - _Requirements: 5.1, 5.2, 5.5_
  
  - [ ] 18.2 Create home page with feed
    - Create / page displaying chronological feed
    - Integrate with backend feed API
    - Show loading states and empty states
    - _Requirements: 5.1, 5.2, 5.3_

- [ ] 19. Implement web frontend posts
  - [ ] 19.1 Create post components
    - Create PostCard component for feed display
    - Create CreatePostForm component with character counter
    - Optional image upload/URL input
    - _Requirements: 6.1, 6.2, 6.4_
  
  - [ ] 19.2 Integrate post creation
    - Add post creation to home page or modal
    - Validation for 500 character limit
    - Refresh feed after post creation
    - _Requirements: 6.1, 6.4_

- [ ] 20. Implement web frontend reactions
  - [ ] 20.1 Create reaction components
    - Create ReactionButton component with four reaction types (Care, Solidarity, Respect, Gratitude)
    - Label as "Support reactions" (not likes)
    - Display reaction counts by type
    - Handle add/update/remove reactions
    - Visual feedback for user's current reaction
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_
  
  - [ ] 20.2 Integrate reactions into events and posts
    - Add reaction buttons to EventCard and EventDetail
    - Add reaction buttons to PostCard
    - Update counts optimistically with API sync
    - _Requirements: 7.2, 7.3_

- [ ] 21. Checkpoint - Ensure core web features work
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 22. Implement web frontend map
  - [ ] 22.1 Create map components
    - Create MapView component using Leaflet (preferred for MVP)
    - Create EventPin component for map markers
    - Create EventPopup component for pin click
    - Only events with coordinates appear on map
    - Events without coordinates still exist and appear elsewhere (feed, profiles)
    - Posts never appear on map
    - _Requirements: 8.1, 8.3, 8.4_
  
  - [ ] 22.2 Create map page
    - Create /map page with full-screen map
    - Load events with coordinates from API
    - Display pins on map
    - Show event summary popup on pin click with link to detail
    - Handle empty state (no events with coordinates)
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

- [ ] 23. Implement web frontend profiles
  - [ ] 23.1 Create profile components
    - Create ProfileHeader component with name, bio, location, causes
    - Create ProfileEventList component
    - Create EditProfileForm component
    - _Requirements: 2.2, 2.3, 2.4, 13.1_
  
  - [ ] 23.2 Create profile pages
    - Create /profiles/[id] page for viewing profiles
    - Create /profiles/edit page for editing own profile
    - Display events created by profile
    - Handle empty state (no events)
    - _Requirements: 2.3, 2.4, 13.1, 13.2, 13.3_

- [ ] 24. Implement web frontend guide (help flow)
  - [ ] 24.1 Create guide components
    - Create Guide component with step-by-step flow
    - Create guide content explaining RiseUp purpose
    - Create guide flow for finding actions
    - Create guide flow for creating first event
    - Use simple, human language consistent with platform tone
    - Do NOT use "bot" or AI language in UI copy
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_
  
  - [ ] 24.2 Integrate guide
    - Add guide access from main navigation (label: "Guide" or "Need help?")
    - Make guide accessible to new users
    - _Requirements: 10.1_

- [ ] 25. Implement web responsive design
  - [ ] 25.1 Make all pages mobile-friendly
    - Apply mobile-first responsive design with Tailwind
    - Test all pages on screens < 768px
    - Ensure touch-friendly controls (buttons, forms, map)
    - Adjust layouts for mobile (stack instead of side-by-side)
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_
  
  - [ ] 25.2 Add subtle animations
    - Use Framer Motion for page transitions
    - Add micro-interactions for button clicks, form submissions
    - Keep animations subtle and purposeful (not distracting)
    - _Requirements: Platform tone_

- [ ] 26. Checkpoint - Ensure web frontend is complete
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 27. Implement mobile app authentication
  - [ ] 27.1 Create mobile auth screens
    - Create LoginScreen with form
    - Create RegisterScreen with form
    - Implement secure token storage (SecureStore preferred)
    - Supabase Auth may be used for registration/login
    - Backend must validate JWTs for protected endpoints
    - Create auth context for managing user state
    - _Requirements: 1.1, 1.2, 1.3_
  
  - [ ] 27.2 Set up navigation
    - Configure React Navigation with auth flow
    - Create stack navigator for authenticated screens
    - Create stack navigator for unauthenticated screens
    - _Requirements: Navigation_

- [ ] 28. Implement mobile app event features
  - [ ] 28.1 Create mobile event components
    - Create EventCard component
    - Create EventDetailScreen
    - Create CreateEventScreen with form
    - Create JoinEventButton (text: "Join" or "I will show up", not RSVP)
    - Mobile is parity-light, not parity-perfect (core features only)
    - _Requirements: 3.1, 9.1, 9.4_
  
  - [ ] 28.2 Integrate with backend API
    - Create API client functions for events
    - Handle loading and error states
    - _Requirements: 3.1, 9.1_

- [ ] 29. Implement mobile app feed
  - [ ] 29.1 Create mobile feed components
    - Create FeedScreen with FlatList
    - Create FeedItem component (events and posts)
    - Implement pull-to-refresh
    - _Requirements: 5.1, 5.2, 5.5_

- [ ] 30. Implement mobile app posts and reactions
  - [ ] 30.1 Create mobile post components
    - Create PostCard component
    - Create CreatePostScreen with character counter
    - _Requirements: 6.1, 6.4_
  
  - [ ] 30.2 Create mobile reaction components
    - Create ReactionButton component (Care, Solidarity, Respect, Gratitude)
    - Label as "Support reactions" (not likes)
    - Integrate into EventCard and PostCard
    - _Requirements: 7.1, 7.2, 7.3_

- [ ] 31. Implement mobile app map
  - [ ] 31.1 Create mobile map screen
    - Create MapScreen using react-native-maps
    - Display event pins (only events with coordinates)
    - Events without coordinates still exist and appear elsewhere
    - Posts never appear on map
    - Handle pin press to show event summary
    - Link to EventDetailScreen
    - _Requirements: 8.1, 8.2, 8.3, 8.4_

- [ ] 32. Implement mobile app profiles
  - [ ] 32.1 Create mobile profile screens
    - Create ProfileScreen with header and event list
    - Create EditProfileScreen
    - _Requirements: 2.2, 2.3, 2.4_

- [ ] 33. Implement mobile app guide (help flow)
  - [ ] 33.1 Create mobile guide screens
    - Create GuideScreen with step-by-step flow
    - Add guide access from navigation (label: "Guide" or "Need help?")
    - Do NOT use "bot" or AI language in UI copy
    - _Requirements: 10.1, 10.2, 10.3, 10.4_

- [ ] 34. Polish and empty states
  - [ ] 34.1 Add empty states across all views
    - Empty feed state with call-to-action
    - Empty map state with helpful message
    - Empty profile events state
    - Empty search results
    - _Requirements: 8.5, 13.3_
  
  - [ ] 34.2 Add loading states
    - Skeleton loaders for feed items
    - Loading spinners for API calls
    - Optimistic UI updates where appropriate
    - _Requirements: User experience_
  
  - [ ] 34.3 Refine UI copy and tone
    - Review all UI text for consistency with platform tone
    - Ensure simple, human, grounded language
    - Use required terms: "Join" or "I will show up" (not RSVP), "Guide" (not bot), "Support reactions" (not likes)
    - Remove any startup jargon, NGO speak, or AI language
    - UI copy must feel natural when read out loud at a community meeting
    - _Requirements: Platform tone_

- [ ] 35. Final checkpoint - End-to-end testing
  - Test complete user flows: register → create event → join event → react
  - Test on multiple devices and screen sizes
  - Verify all core acceptance criteria are met
  - Ensure no crashes in core flows
  - _Requirements: All_

## Notes

- Tasks marked with `*` are optional property-based tests that can be skipped for faster MVP
- **MVP-critical property tests only**: Focus on user registration, event creation, attendance idempotence, reaction uniqueness, and feed ordering
- All other properties may be covered by unit/integration tests or deferred to Phase 2
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation throughout development
- Backend uses Python/FastAPI with Hypothesis for property testing (MVP-critical properties only)
- Frontend uses TypeScript with fast-check for property testing (MVP-critical properties only)
- Frontend testing focuses on core user flows, form validation, and navigation (not exhaustive snapshots or visual regression)
- Mobile app is parity-light, not parity-perfect (core features only, not full visual/animation parity)
- Authentication: Supabase Auth may be used for registration/login; backend validates JWTs
- Token storage: Web uses httpOnly cookies (preferred), mobile uses SecureStore
- Feed: Simple UNION queries, chronological order only, no caching or ranking
- Reactions: One active reaction per user per target, updates replace previous
- Map: Leaflet preferred for web MVP, only events with coordinates appear
- Language: Use "Join" or "I will show up" (not RSVP), "Guide" (not bot), "Support reactions" (not likes)
- Phase discipline: If not in MVP requirements or marked optional, leave a TODO instead of implementing
