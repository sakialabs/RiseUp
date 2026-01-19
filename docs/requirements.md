# Requirements Document: RiseUp Collective MVP

## Introduction

RiseUp Collective is a platform designed to transform online energy into real-world action by enabling people to organize locally and work together. The platform follows the core principle of "Street → platform → street," emphasizing that digital tools should serve physical community organizing rather than replace it.

The MVP focuses on essential features that enable users to create events, share updates, show solidarity through reactions, visualize local actions on a map, and maintain lightweight profiles. The platform deliberately avoids features that encourage passive consumption, algorithmic manipulation, or social metrics gaming.

## Glossary

- **System**: The RiseUp Collective platform (backend and frontend)
- **User**: An authenticated person using the platform
- **Profile**: A user's public identity (individual or group)
- **Event**: A scheduled local action with date, time, and location
- **Post**: A short text update with optional image in the community feed
- **Reaction**: A solidarity gesture (Care, Solidarity, Respect, Gratitude)
- **Attendance**: A user's commitment to show up to an event
- **Feed**: The chronological stream of events and posts
- **Map**: The geographic visualization of events
- **Guide**: The help system for onboarding and navigation

## Requirements

### Requirement 1: User Authentication

**User Story:** As a person interested in local organizing, I want to create an account and log in securely, so that I can participate in the platform.

#### Acceptance Criteria

1. WHEN a new user provides valid credentials (email and password), THE System SHALL create a new user account
2. WHEN a user provides valid login credentials, THE System SHALL authenticate the user and issue a JWT token
3. WHEN a user logs out, THE System SHALL invalidate the current session
4. WHEN a user provides invalid credentials, THE System SHALL reject the authentication attempt and return a descriptive error
5. THE System SHALL enforce password requirements (minimum 8 characters, at least one letter and one number)

### Requirement 2: Profile Management

**User Story:** As a user, I want to create and maintain a profile, so that others can understand who I am and what I care about.

#### Acceptance Criteria

1. WHEN a user creates an account, THE System SHALL automatically create an associated profile
2. THE Profile SHALL include fields for name, bio, location (optional), and causes/tags
3. WHEN a user updates their profile information, THE System SHALL persist the changes immediately
4. WHEN viewing a profile, THE System SHALL display all events created by that profile
5. THE System SHALL support both individual and group profile types
6. THE System SHALL NOT display follower counts, engagement metrics, or social graph statistics

### Requirement 3: Event Creation and Management

**User Story:** As an organizer, I want to create events for local actions, so that others can discover and join them.

#### Acceptance Criteria

1. WHEN a user creates an event with required fields (title, description, date, time, location), THE System SHALL persist the event
2. THE System SHALL support optional geographic coordinates (latitude/longitude) for events
3. WHEN a user creates an event, THE System SHALL associate it with the creator's profile
4. THE System SHALL support event categorization through tags
5. WHEN an event is created, THE System SHALL make it visible in the feed and on the map
6. THE System SHALL validate that event dates are not in the past

### Requirement 4: Event Attendance

**User Story:** As a user, I want to commit to showing up at events, so that organizers know who will be there.

#### Acceptance Criteria

1. WHEN a user joins an event, THE System SHALL record the attendance commitment
2. WHEN viewing an event, THE System SHALL display the total attendee count
3. WHEN a user has already joined an event, THE System SHALL prevent duplicate attendance records
4. WHEN a user leaves an event, THE System SHALL remove the attendance record and update the count
5. THE System SHALL associate attendance records with both the user and the event

### Requirement 5: Community Feed

**User Story:** As a user, I want to see a chronological feed of events and updates, so that I can stay informed about local actions.

#### Acceptance Criteria

1. THE Feed SHALL display items in reverse chronological order (newest first)
2. THE Feed SHALL include both events and posts
3. THE System SHALL NOT apply algorithmic ranking or filtering to the feed
4. WHEN a new event or post is created, THE System SHALL add it to the feed immediately
5. WHEN viewing the feed, THE System SHALL display basic information for each item (title, creator, timestamp, preview)

### Requirement 6: Posts and Updates

**User Story:** As a user, I want to share short updates with the community, so that I can communicate progress or needs.

#### Acceptance Criteria

1. WHEN a user creates a post with text content, THE System SHALL persist the post
2. THE System SHALL support optional image attachments for posts
3. WHEN a post is created, THE System SHALL associate it with the creator's profile
4. THE System SHALL enforce a reasonable character limit for post text (500 characters)
5. WHEN a post is created, THE System SHALL add it to the community feed

### Requirement 7: Solidarity Reactions

**User Story:** As a user, I want to express support for events and posts, so that I can show solidarity without creating noise.

#### Acceptance Criteria

1. THE System SHALL support exactly four reaction types: Care, Solidarity, Respect, Gratitude
2. WHEN a user reacts to an event or post, THE System SHALL record the reaction
3. WHEN viewing an event or post, THE System SHALL display reaction counts by type
4. WHEN a user has already reacted to an item, THE System SHALL allow changing the reaction type
5. WHEN a user removes a reaction, THE System SHALL delete the reaction record and update counts
6. THE System SHALL NOT support comments, threads, or direct messages

### Requirement 8: Solidarity Map

**User Story:** As a user, I want to see events on a map, so that I can discover actions happening near me.

#### Acceptance Criteria

1. THE Map SHALL display events as geographic pins
2. WHEN an event has geographic coordinates, THE System SHALL place it on the map
3. WHEN a user clicks a map pin, THE System SHALL display event summary information
4. THE Map SHALL provide a link from the pin popup to the full event detail page
5. WHEN no events exist, THE Map SHALL display a clean empty state message
6. THE System SHALL NOT display posts on the map (only events)

### Requirement 9: Event Detail Pages

**User Story:** As a user, I want to view complete event information, so that I can decide whether to attend.

#### Acceptance Criteria

1. WHEN viewing an event detail page, THE System SHALL display all event fields (title, description, date, time, location, tags)
2. THE Event_Detail_Page SHALL display the current attendee count
3. THE Event_Detail_Page SHALL display the event creator's profile information
4. THE Event_Detail_Page SHALL provide a button to join or leave the event
5. THE Event_Detail_Page SHALL display all reactions with counts

### Requirement 10: Guide (Help Flow)

**User Story:** As a new user, I want help understanding the platform, so that I can get started quickly.

#### Acceptance Criteria

1. THE Guide SHALL provide a help flow accessible from the main navigation
2. THE Guide SHALL explain the core purpose of RiseUp Collective
3. THE Guide SHALL help users find existing actions in their area
4. THE Guide SHALL guide users through creating their first event
5. THE Guide SHALL use simple, human language consistent with platform tone
6. THE Guide SHALL NOT use AI or bot language in the UI

### Requirement 11: Mobile Responsiveness

**User Story:** As a user on a mobile device, I want the platform to work well on my phone, so that I can organize on the go.

#### Acceptance Criteria

1. THE System SHALL render all pages in a mobile-friendly layout on screens smaller than 768px
2. WHEN viewing the map on mobile, THE System SHALL provide touch-friendly controls
3. WHEN creating events or posts on mobile, THE System SHALL provide appropriately sized input fields
4. THE System SHALL maintain functionality across all core flows on mobile devices
5. THE System SHALL use responsive design patterns that adapt to different screen sizes

### Requirement 12: Data Integrity and Validation

**User Story:** As a system administrator, I want data to be validated and consistent, so that the platform remains reliable.

#### Acceptance Criteria

1. THE System SHALL enforce database constraints for all relationships (user-profile, event-creator, attendance-user-event)
2. THE System SHALL validate all user inputs before persisting to the database
3. WHEN creating or updating records, THE System SHALL automatically set timestamp fields
4. THE System SHALL prevent orphaned records through proper foreign key constraints
5. THE System SHALL return descriptive validation errors when input is invalid

### Requirement 13: Profile Event Display

**User Story:** As a user viewing a profile, I want to see events created by that person or group, so that I can understand their organizing work.

#### Acceptance Criteria

1. WHEN viewing a profile page, THE System SHALL display all events created by that profile
2. THE Profile_Event_List SHALL be ordered by event date (upcoming first)
3. WHEN a profile has no events, THE System SHALL display an appropriate empty state
4. THE Profile_Event_List SHALL display basic event information (title, date, attendee count)
5. THE Profile_Event_List SHALL provide links to full event detail pages

### Requirement 14: Session Management

**User Story:** As a user, I want my login session to persist appropriately, so that I don't have to log in constantly but remain secure.

#### Acceptance Criteria

1. WHEN a user logs in, THE System SHALL issue a JWT token with a reasonable expiration time (7 days)
2. WHEN a JWT token expires, THE System SHALL require re-authentication
3. WHEN a user logs out, THE System SHALL clear the client-side token
4. THE System SHALL validate JWT tokens on all authenticated endpoints
5. WHEN an invalid or expired token is provided, THE System SHALL return an authentication error

### Requirement 15: Content Chronology

**User Story:** As a user, I want to see content in the order it was created, so that I can follow the natural flow of organizing activity.

#### Acceptance Criteria

1. THE Feed SHALL order items by creation timestamp in descending order
2. THE System SHALL NOT reorder content based on engagement, popularity, or user behavior
3. WHEN viewing a profile's events, THE System SHALL order by event date (not creation date)
4. THE System SHALL preserve chronological ordering across pagination
5. THE System SHALL display timestamps in a human-readable format (relative or absolute)
