# Design Document: RiseUp Collective MVP

## Overview

RiseUp Collective is a full-stack platform built to facilitate local organizing and real-world action. The architecture follows a clean separation between backend API services (FastAPI + PostgreSQL), web frontend (Next.js), and mobile app (React Native + Expo).

The design emphasizes:
- **Simplicity**: No algorithmic feeds, no social metrics, no gamification
- **Action-oriented**: Every feature drives toward real-world organizing
- **Data integrity**: Strong typing, validation, and database constraints
- **Mobile-first**: Responsive design that works seamlessly on phones
- **Testability**: Property-based testing for core business logic

## Architecture

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                         Clients                             │
│  ┌──────────────────┐              ┌──────────────────┐     │
│  │   Web Frontend   │              │   Mobile App     │     │
│  │   (Next.js)      │              │  (React Native)  │     │
│  └────────┬─────────┘              └────────┬─────────┘     │
│           │                                  │              │
│           └──────────────┬───────────────────┘              │
│                          │                                  │
└──────────────────────────┼──────────────────────────────────┘
                           │ HTTPS/REST
                           │
┌──────────────────────────▼──────────────────────────────────┐
│                    Backend API                              │
│                    (FastAPI)                                │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Auth Layer (JWT)                                      │ │
│  └────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Business Logic Layer                                  │ │
│  │  - User Service                                        │ │
│  │  - Profile Service                                     │ │
│  │  - Event Service                                       │ │
│  │  - Post Service                                        │ │
│  │  - Reaction Service                                    │ │
│  │  - Feed Service                                        │ │
│  └────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Data Access Layer (SQLModel/SQLAlchemy)               │ │
│  └────────────────────────────────────────────────────────┘ │
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────▼───────────────────────────────────┐
│                  Database Layer                              │
│              (PostgreSQL via Supabase)                       │
│  ┌──────┐ ┌─────────┐ ┌───────┐ ┌──────┐ ┌──────────┐        │
│  │Users │ │Profiles │ │Events │ │Posts │ │Reactions │        │
│  └──────┘ └─────────┘ └───────┘ └──────┘ └──────────┘        │
│  ┌────────────┐                                              │
│  │Attendances │                                              │
│  └────────────┘                                              │
└──────────────────────────────────────────────────────────────┘
```

### Technology Stack

**Backend:**
- FastAPI (latest) - Modern async Python web framework
- PostgreSQL via Supabase - Relational database with real-time capabilities
- SQLModel - Type-safe ORM combining SQLAlchemy and Pydantic
- Pydantic - Data validation and serialization
- JWT - Stateless authentication tokens
- Docker - Containerization for consistent deployment

**Web Frontend:**
- Next.js (App Router) - React framework with server components
- TypeScript - Type safety across the frontend
- Tailwind CSS - Utility-first styling
- shadcn/ui - Accessible component primitives
- Framer Motion - Subtle animations and transitions

**Mobile:**
- React Native with Expo - Cross-platform mobile development
- Shared component library with web where possible

## Components and Interfaces

### Backend Services

#### Authentication Service

Handles user registration, login, and JWT token management.

```python
class AuthService:
    def register_user(email: str, password: str) -> User:
        """
        Create a new user account with hashed password.
        Validates email format and password requirements.
        Automatically creates associated profile.
        Note: Supabase Auth may be used for registration/login.
        """
        
    def authenticate_user(email: str, password: str) -> str:
        """
        Verify credentials and return JWT token.
        Returns token with 7-day expiration.
        Note: Supabase Auth may be used for registration/login.
        """
        
    def verify_token(token: str) -> User:
        """
        Validate JWT token and return associated user.
        Raises exception if token is invalid or expired.
        Backend must validate JWTs for protected endpoints.
        """
        
    def hash_password(password: str) -> str:
        """Hash password using bcrypt."""
        
    def verify_password(plain: str, hashed: str) -> bool:
        """Verify password against hash."""
```

#### Profile Service

Manages user profiles (individual and group).

```python
class ProfileService:
    def create_profile(user_id: int, name: str, profile_type: str) -> Profile:
        """
        Create profile associated with user.
        Profile type must be 'individual' or 'group'.
        """
        
    def update_profile(
        profile_id: int,
        name: str | None,
        bio: str | None,
        location: str | None,
        causes: list[str] | None
    ) -> Profile:
        """Update profile fields. Only provided fields are updated."""
        
    def get_profile(profile_id: int) -> Profile:
        """Retrieve profile by ID."""
        
    def get_profile_events(profile_id: int) -> list[Event]:
        """Get all events created by this profile, ordered by event date."""
```

#### Event Service

Handles event creation, updates, and queries.

```python
class EventService:
    def create_event(
        creator_id: int,
        title: str,
        description: str,
        event_date: datetime,
        location: str,
        latitude: float | None,
        longitude: float | None,
        tags: list[str]
    ) -> Event:
        """
        Create new event.
        Validates that event_date is not in the past.
        Associates event with creator profile.
        """
        
    def get_event(event_id: int) -> Event:
        """Retrieve event with full details."""
        
    def get_events_for_map() -> list[Event]:
        """Get all events with geographic coordinates."""
        
    def get_attendee_count(event_id: int) -> int:
        """Count users who have joined this event."""
```

#### Attendance Service

Manages user commitments to attend events.

```python
class AttendanceService:
    def join_event(user_id: int, event_id: int) -> Attendance:
        """
        Record user's commitment to attend event.
        Prevents duplicate attendance records.
        """
        
    def leave_event(user_id: int, event_id: int) -> None:
        """Remove attendance record."""
        
    def is_attending(user_id: int, event_id: int) -> bool:
        """Check if user is attending event."""
        
    def get_event_attendees(event_id: int) -> list[User]:
        """Get all users attending an event."""
```

#### Post Service

Handles creation and retrieval of community updates.

```python
class PostService:
    def create_post(
        creator_id: int,
        text: str,
        image_url: str | None
    ) -> Post:
        """
        Create new post.
        Validates text length (max 500 characters).
        Associates post with creator profile.
        """
        
    def get_post(post_id: int) -> Post:
        """Retrieve post by ID."""
```

#### Reaction Service

Manages solidarity reactions on events and posts.

```python
class ReactionService:
    def add_reaction(
        user_id: int,
        target_type: str,  # 'event' or 'post'
        target_id: int,
        reaction_type: str  # 'care', 'solidarity', 'respect', 'gratitude'
    ) -> Reaction:
        """
        Add or update user's reaction.
        Exactly one active reaction per user per target.
        If user already reacted, updates reaction type (replaces previous).
        No reaction history tracking.
        """
        
    def remove_reaction(
        user_id: int,
        target_type: str,
        target_id: int
    ) -> None:
        """Remove user's reaction."""
        
    def get_reaction_counts(
        target_type: str,
        target_id: int
    ) -> dict[str, int]:
        """
        Get counts for each reaction type on a target.
        Aggregate via queries, avoid complex polymorphic ORM relationships.
        """
```

#### Feed Service

Generates chronological feed of events and posts.

```python
class FeedService:
    def get_feed(limit: int = 50, offset: int = 0) -> list[FeedItem]:
        """
        Get feed items in reverse chronological order.
        Returns mixed list of events and posts.
        No algorithmic filtering or ranking.
        Implementation: Simple UNION query, no caching layer for MVP.
        """
        
    def get_feed_item(item_type: str, item_id: int) -> FeedItem:
        """Get single feed item (event or post) with metadata."""
```

### Frontend Components

#### Web Components (Next.js)

**Page Components:**
- `app/page.tsx` - Home page with feed
- `app/events/[id]/page.tsx` - Event detail page
- `app/profiles/[id]/page.tsx` - Profile page
- `app/map/page.tsx` - Solidarity map
- `app/auth/login/page.tsx` - Login page
- `app/auth/register/page.tsx` - Registration page

**Shared Components:**
- `FeedItem` - Displays event or post in feed
- `EventCard` - Event summary card
- `EventDetail` - Full event information
- `PostCard` - Post display with reactions
- `ReactionButton` - Reaction selector (Care, Solidarity, Respect, Gratitude - labeled as "Support reactions")
- `ProfileHeader` - Profile information display
- `MapView` - Interactive map with event pins (Leaflet preferred for MVP)
- `Guide` - Help flow interface (not "bot", no AI language)
- `AuthForm` - Login/registration form

#### Mobile Components (React Native)

Similar component structure adapted for mobile:
- Stack navigation for pages
- Touch-optimized controls
- Native map component (react-native-maps)
- Responsive layouts for various screen sizes
- Mobile is parity-light, not parity-perfect (core features only, not full visual/animation parity)

## Data Models

### User

```python
class User(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    email: str = Field(unique=True, index=True)
    hashed_password: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Relationships
    profile: Profile = Relationship(back_populates="user")
    attendances: list[Attendance] = Relationship(back_populates="user")
    reactions: list[Reaction] = Relationship(back_populates="user")
```

### Profile

```python
class Profile(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id", unique=True)
    name: str
    bio: str | None = None
    location: str | None = None
    causes: list[str] = Field(default_factory=list, sa_column=Column(JSON))
    profile_type: str  # 'individual' or 'group'
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Relationships
    user: User = Relationship(back_populates="profile")
    events: list[Event] = Relationship(back_populates="creator")
    posts: list[Post] = Relationship(back_populates="creator")
```

### Event

```python
class Event(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    creator_id: int = Field(foreign_key="profile.id")
    title: str
    description: str
    event_date: datetime
    location: str
    latitude: float | None = None
    longitude: float | None = None
    tags: list[str] = Field(default_factory=list, sa_column=Column(JSON))
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Relationships
    creator: Profile = Relationship(back_populates="events")
    attendances: list[Attendance] = Relationship(back_populates="event")
    reactions: list[Reaction] = Relationship(
        back_populates="event",
        sa_relationship_kwargs={"foreign_keys": "Reaction.target_id"}
    )
```

### Post

```python
class Post(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    creator_id: int = Field(foreign_key="profile.id")
    text: str = Field(max_length=500)
    image_url: str | None = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Relationships
    creator: Profile = Relationship(back_populates="posts")
    reactions: list[Reaction] = Relationship(
        back_populates="post",
        sa_relationship_kwargs={"foreign_keys": "Reaction.target_id"}
    )
```

### Attendance

```python
class Attendance(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    event_id: int = Field(foreign_key="event.id")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Relationships
    user: User = Relationship(back_populates="attendances")
    event: Event = Relationship(back_populates="attendances")
    
    # Constraints
    __table_args__ = (
        UniqueConstraint('user_id', 'event_id', name='unique_user_event'),
    )
```

### Reaction

```python
class Reaction(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    target_type: str  # 'event' or 'post'
    target_id: int
    reaction_type: str  # 'care', 'solidarity', 'respect', 'gratitude'
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Relationships
    user: User = Relationship(back_populates="reactions")
    
    # Constraints
    __table_args__ = (
        UniqueConstraint('user_id', 'target_type', 'target_id', 
                        name='unique_user_target_reaction'),
        CheckConstraint("target_type IN ('event', 'post')", 
                       name='valid_target_type'),
        CheckConstraint(
            "reaction_type IN ('care', 'solidarity', 'respect', 'gratitude')",
            name='valid_reaction_type'
        ),
    )
```

### Database Schema Diagram

```
┌──────────────┐
│    User      │
│──────────────│
│ id (PK)      │
│ email        │◄──────┐
│ hashed_pwd   │       │
│ created_at   │       │
│ updated_at   │       │
└──────────────┘       │
                       │ 1:1
                       │
┌──────────────┐       │
│   Profile    │       │
│──────────────│       │
│ id (PK)      │       │
│ user_id (FK) ├───────┘
│ name         │
│ bio          │
│ location     │
│ causes       │
│ profile_type │
│ created_at   │
│ updated_at   │
└──────┬───────┘
       │ 1:N
       │
       ├──────────────────┐
       │                  │
       ▼                  ▼
┌──────────────┐   ┌──────────────┐
│    Event     │   │     Post     │
│──────────────│   │──────────────│
│ id (PK)      │   │ id (PK)      │
│ creator_id   │   │ creator_id   │
│ title        │   │ text         │
│ description  │   │ image_url    │
│ event_date   │   │ created_at   │
│ location     │   │ updated_at   │
│ latitude     │   └──────────────┘
│ longitude    │
│ tags         │
│ created_at   │
│ updated_at   │
└──────┬───────┘
       │ N:M
       │
       ▼
┌──────────────┐
│  Attendance  │
│──────────────│
│ id (PK)      │
│ user_id (FK) │
│ event_id (FK)│
│ created_at   │
└──────────────┘

┌──────────────┐
│   Reaction   │
│──────────────│
│ id (PK)      │
│ user_id (FK) │
│ target_type  │
│ target_id    │
│ reaction_type│
│ created_at   │
│ updated_at   │
└──────────────┘
```


## Error Handling

### Error Categories

**Validation Errors (400 Bad Request):**
- Invalid email format
- Password too short or missing required characters
- Post text exceeds 500 characters
- Event date in the past
- Missing required fields
- Invalid reaction type
- Invalid target type

**Authentication Errors (401 Unauthorized):**
- Invalid credentials
- Expired JWT token
- Missing JWT token
- Malformed JWT token

**Authorization Errors (403 Forbidden):**
- User attempting to modify another user's content
- User attempting to access protected resources

**Not Found Errors (404 Not Found):**
- Event ID does not exist
- Post ID does not exist
- Profile ID does not exist
- User ID does not exist

**Conflict Errors (409 Conflict):**
- Email already registered
- Duplicate attendance record (handled gracefully)
- Duplicate reaction (handled by update)

**Server Errors (500 Internal Server Error):**
- Database connection failures
- Unexpected exceptions
- Data integrity violations

### Error Response Format

All errors return consistent JSON structure:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Event date cannot be in the past",
    "field": "event_date",
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

### Error Handling Strategy

**Backend:**
- Use FastAPI exception handlers for consistent error responses
- Log all errors with appropriate severity levels
- Validate inputs at API boundary using Pydantic models
- Use database constraints as last line of defense
- Return descriptive error messages without exposing internal details

**Frontend:**
- Display user-friendly error messages
- Provide actionable guidance for fixing errors
- Use toast notifications for transient errors
- Show inline validation errors on forms
- Gracefully handle network failures with retry options

## Testing Strategy

### Overview

The testing strategy employs a dual approach combining unit tests for specific examples and edge cases with property-based tests for universal correctness properties. This ensures both concrete bug detection and general correctness verification.

### Property-Based Testing

Property-based testing validates universal properties across randomly generated inputs. Each correctness property from the design will be implemented as a property-based test.

**Library Selection:**
- **Backend (Python)**: Hypothesis - mature property-based testing library
- **Frontend (TypeScript)**: fast-check - property-based testing for JavaScript/TypeScript

**Configuration:**
- Minimum 100 iterations per property test (due to randomization)
- Each test tagged with: `Feature: riseup-collective-mvp, Property {number}: {property_text}`
- Tests run as part of CI/CD pipeline
- Failures include counterexamples for debugging

**MVP-Critical Properties Only:**
- User registration creates exactly one profile
- Event creation persists and associates correctly
- Attendance idempotence
- Reaction uniqueness per user per item
- Feed chronological ordering

**All other properties may be:**
- Unit tested
- Integration tested
- Or deferred to Phase 2

**Property Test Scope:**
- Data model invariants
- Business logic correctness
- API contract validation
- Serialization/deserialization round trips
- State transitions

### Unit Testing

Unit tests focus on specific examples, edge cases, and integration points.

**Backend Unit Tests:**
- Service layer methods
- Authentication and authorization logic
- Database queries and relationships
- Input validation
- Error handling paths

**Frontend Unit Tests:**
- Component rendering
- User interactions
- Form validation
- State management
- API integration

**Frontend Testing Scope for MVP:**
- Core user flows
- Form validation
- Navigation between primary screens

**Explicitly NOT required for MVP:**
- Exhaustive component snapshot tests
- Animation testing
- Visual regression testing

**Test Organization:**
- Tests colocated with source code
- Clear naming: `test_<function>_<scenario>`
- Arrange-Act-Assert pattern
- Mock external dependencies

### Integration Testing

**API Integration Tests:**
- End-to-end API flows
- Authentication flows
- Multi-step operations (create event → join event → verify attendance)
- Database transaction handling

**Frontend Integration Tests:**
- User flows across multiple pages
- Form submission and validation
- Navigation and routing
- API communication

### Test Coverage Goals

- Backend: 80%+ code coverage
- Frontend: 70%+ code coverage (focus on core flows, not exhaustive snapshots)
- 100% coverage of critical paths (auth, event creation, attendance)
- MVP-critical properties implemented as property tests (user registration, event creation, attendance idempotence, reaction uniqueness, feed ordering)
- All other properties may be unit/integration tested or deferred to Phase 2

### Testing Tools

**Backend:**
- pytest - test framework
- Hypothesis - property-based testing (MVP-critical properties only)
- pytest-asyncio - async test support
- httpx - API client for testing
- SQLAlchemy test fixtures

**Frontend:**
- Vitest - fast unit test runner
- React Testing Library - component testing
- fast-check - property-based testing (MVP-critical properties only)
- MSW (Mock Service Worker) - API mocking
- Playwright - end-to-end testing (optional for MVP)


## Correctness Properties

A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.

### Property 1: User Registration Creates Account and Profile

*For any* valid email and password combination, when a user registers, the system should create exactly one user account with exactly one associated profile.

**Validates: Requirements 1.1, 2.1**

### Property 2: Authentication Round Trip

*For any* registered user, authenticating with correct credentials should return a valid JWT token that can be used to access authenticated endpoints.

**Validates: Requirements 1.2, 14.1, 14.4**

### Property 3: Logout Invalidates Session

*For any* authenticated user, after logging out, the previous JWT token should no longer grant access to authenticated endpoints.

**Validates: Requirements 1.3**

### Property 4: Invalid Credentials Rejected

*For any* invalid credential combination (wrong password, non-existent email, or malformed input), authentication attempts should be rejected with descriptive errors.

**Validates: Requirements 1.4**

### Property 5: Password Validation Enforced

*For any* password that does not meet requirements (less than 8 characters, or missing letters, or missing numbers), user registration should be rejected.

**Validates: Requirements 1.5**

### Property 6: Profile Updates Persist

*For any* profile and any valid update to its fields (name, bio, location, causes), the changes should be immediately retrievable in subsequent queries.

**Validates: Requirements 2.3**

### Property 7: Profile Contains Required Fields

*For any* profile retrieved from the system, it should contain all required fields: name, bio (nullable), location (nullable), causes (list), and profile_type.

**Validates: Requirements 2.2**

### Property 8: Profile Events Query Correctness

*For any* profile, querying its events should return exactly the events where that profile is the creator, ordered by event_date (upcoming first), and no other events.

**Validates: Requirements 2.4, 13.1, 13.2, 15.3**

### Property 9: No Social Metrics in Profile Responses

*For any* profile response from the API, it should not contain fields for follower_count, following_count, engagement_score, or any similar social graph metrics.

**Validates: Requirements 2.6**

### Property 10: Event Creation Persists with Creator Association

*For any* valid event data (title, description, future date, location) and creator profile, creating an event should persist it with correct association to the creator.

**Validates: Requirements 3.1, 3.3**

### Property 11: Events Support Optional Coordinates

*For any* event, it should be successfully created and retrieved whether or not it includes geographic coordinates (latitude/longitude).

**Validates: Requirements 3.2**

### Property 12: Event Tags Persist

*For any* event created with a list of tags, retrieving that event should return the same tags in the same order.

**Validates: Requirements 3.4**

### Property 13: Events Appear in Feed and Map

*For any* event created with geographic coordinates, it should appear in both feed queries and map queries immediately after creation.

**Validates: Requirements 3.5**

### Property 14: Past Event Dates Rejected

*For any* event with a date in the past, the system should reject the creation attempt with a validation error.

**Validates: Requirements 3.6**

### Property 15: Attendance Recording and Counting

*For any* user and event, when the user joins the event, an attendance record should be created and the event's attendee count should increase by exactly one.

**Validates: Requirements 4.1, 4.2, 9.2**

### Property 16: Attendance Idempotence

*For any* user and event, joining the same event multiple times should result in exactly one attendance record (idempotent operation).

**Validates: Requirements 4.3**

### Property 17: Attendance Round Trip

*For any* user and event, if the user joins then leaves the event, the attendee count should return to its original value and no attendance record should exist.

**Validates: Requirements 4.4**

### Property 18: Attendance Foreign Key Integrity

*For any* attendance record in the database, it must have valid foreign keys to both an existing user and an existing event.

**Validates: Requirements 4.5, 12.1, 12.4**

### Property 19: Feed Chronological Ordering

*For any* set of events and posts, the feed should return them ordered by creation timestamp in descending order (newest first), with no algorithmic reordering.

**Validates: Requirements 5.1, 5.3, 15.1, 15.2**

### Property 20: Feed Contains Both Events and Posts

*For any* feed query, if both events and posts exist in the system, the feed should include items of both types.

**Validates: Requirements 5.2**

### Property 21: New Items Appear in Feed Immediately

*For any* newly created event or post, it should appear in the feed query results immediately without delay.

**Validates: Requirements 5.4**

### Property 22: Feed Items Contain Required Fields

*For any* feed item (event or post), it should include creator information, timestamp, and content preview/title.

**Validates: Requirements 5.5**

### Property 23: Post Creation Persists with Creator Association

*For any* valid post text (1-500 characters) and optional image URL, creating a post should persist it with correct association to the creator profile.

**Validates: Requirements 6.1, 6.3**

### Property 24: Posts Support Optional Images

*For any* post, it should be successfully created and retrieved whether or not it includes an image URL.

**Validates: Requirements 6.2**

### Property 25: Post Text Length Validation

*For any* text exceeding 500 characters, post creation should be rejected with a validation error.

**Validates: Requirements 6.4**

### Property 26: Posts Appear in Feed

*For any* newly created post, it should appear in feed queries immediately after creation.

**Validates: Requirements 6.5**

### Property 27: Only Valid Reaction Types Accepted

*For any* reaction attempt, the system should accept exactly the four valid types (care, solidarity, respect, gratitude) and reject all other reaction type values.

**Validates: Requirements 7.1**

### Property 28: Reaction Recording and Counting

*For any* user reacting to an event or post, the reaction should be recorded and the reaction count for that type should increase by exactly one.

**Validates: Requirements 7.2, 7.3, 9.5**

### Property 29: Reaction Update (Not Duplicate)

*For any* user who has already reacted to an item, reacting again with a different type should update the existing reaction (not create a duplicate), resulting in exactly one reaction from that user.

**Validates: Requirements 7.4**

### Property 30: Reaction Round Trip

*For any* user and item, if the user adds a reaction then removes it, the reaction count should return to its original value and no reaction record should exist for that user.

**Validates: Requirements 7.5**

### Property 31: Map Contains Only Events with Coordinates

*For any* map query, it should return only events that have geographic coordinates (latitude and longitude), and should never return posts.

**Validates: Requirements 8.1, 8.2, 8.6**

### Property 32: Event Detail Contains All Fields

*For any* event detail query, the response should include all event fields: title, description, event_date, location, latitude (nullable), longitude (nullable), tags, creator profile information, attendee count, and reaction counts.

**Validates: Requirements 9.1, 9.3**

### Property 33: Timestamp Auto-Generation

*For any* newly created record (user, profile, event, post, attendance, reaction), it should have created_at and updated_at timestamps automatically set to valid datetime values.

**Validates: Requirements 12.3**

### Property 34: Validation Errors Are Descriptive

*For any* invalid input that fails validation, the error response should include a descriptive message indicating what was invalid and how to fix it.

**Validates: Requirements 12.5**

### Property 35: Profile Event List Contains Required Fields

*For any* event in a profile's event list, it should include title, event_date, and attendee_count at minimum.

**Validates: Requirements 13.4**

### Property 36: JWT Token Expiration Enforced

*For any* JWT token that has exceeded its expiration time (7 days), authenticated endpoints should reject it with an authentication error.

**Validates: Requirements 14.2, 14.5**

### Property 37: Feed Pagination Preserves Order

*For any* paginated feed query, the chronological order should be preserved across all pages (no items should appear out of order or be skipped).

**Validates: Requirements 15.4**
