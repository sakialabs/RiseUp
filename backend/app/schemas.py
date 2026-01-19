"""Pydantic schemas for API request/response models."""

from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, EmailStr, Field, field_validator
from app.models import ProfileType, ReactionType, TargetType, EmploymentType, UnionStatus


# Auth Schemas
class UserRegister(BaseModel):
    """Schema for user registration."""
    email: EmailStr
    password: str = Field(min_length=8)
    name: str = Field(min_length=1, max_length=255)
    profile_type: ProfileType = ProfileType.INDIVIDUAL
    bio: Optional[str] = Field(None, max_length=1000)
    location: Optional[str] = Field(None, max_length=255)
    causes: Optional[List[str]] = Field(default_factory=list)
    
    @field_validator('password')
    @classmethod
    def validate_password(cls, v: str) -> str:
        """Validate password has at least one letter and one number."""
        if not any(c.isalpha() for c in v):
            raise ValueError('Password must contain at least one letter')
        if not any(c.isdigit() for c in v):
            raise ValueError('Password must contain at least one number')
        return v


class UserLogin(BaseModel):
    """Schema for user login."""
    email: EmailStr
    password: str


class Token(BaseModel):
    """Schema for JWT token response."""
    access_token: str
    token_type: str = "bearer"


class UserResponse(BaseModel):
    """Schema for user data in responses."""
    id: int
    email: str
    created_at: datetime


# Profile Schemas
class ProfileUpdate(BaseModel):
    """Schema for updating profile."""
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    bio: Optional[str] = Field(None, max_length=1000)
    location: Optional[str] = Field(None, max_length=255)
    avatar_url: Optional[str] = Field(None, max_length=500)
    causes: Optional[List[str]] = None


class ProfileResponse(BaseModel):
    """Schema for profile data in responses."""
    id: int
    user_id: int
    name: str
    email: str  # User's email
    bio: Optional[str]
    location: Optional[str]
    avatar_url: Optional[str] = None  # Profile picture
    causes: List[str]
    profile_type: ProfileType
    created_at: datetime
    updated_at: datetime


# Event Schemas
class EventCreate(BaseModel):
    """Schema for creating an event."""
    title: str = Field(min_length=1, max_length=255)
    description: str = Field(min_length=1, max_length=2000)
    event_date: datetime
    location: str = Field(min_length=1, max_length=500)
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    tags: List[str] = Field(default_factory=list)
    
    @field_validator('event_date')
    @classmethod
    def validate_event_date(cls, v: datetime) -> datetime:
        """Validate event date is not in the past."""
        if v < datetime.utcnow():
            raise ValueError('Event date cannot be in the past')
        return v


class EventResponse(BaseModel):
    """Schema for event data in responses."""
    id: int
    creator_id: int
    title: str
    description: str
    event_date: datetime
    location: str
    latitude: Optional[float]
    longitude: Optional[float]
    tags: List[str]
    attendee_count: int = 0
    created_at: datetime
    updated_at: datetime


class EventWithCreator(EventResponse):
    """Schema for event with creator information."""
    creator: ProfileResponse


# Post Schemas
class PostCreate(BaseModel):
    """Schema for creating a post."""
    text: str = Field(min_length=1, max_length=500)
    image_url: Optional[str] = Field(None, max_length=500)


class PostResponse(BaseModel):
    """Schema for post data in responses."""
    id: int
    creator_id: int
    text: str
    image_url: Optional[str]
    created_at: datetime
    updated_at: datetime


class PostWithCreator(PostResponse):
    """Schema for post with creator information."""
    creator: ProfileResponse


# Reaction Schemas
class ReactionCreate(BaseModel):
    """Schema for creating or updating a reaction."""
    target_type: TargetType
    target_id: int
    reaction_type: ReactionType


class ReactionResponse(BaseModel):
    """Schema for reaction data in responses."""
    id: int
    user_id: int
    target_type: TargetType
    target_id: int
    reaction_type: ReactionType
    created_at: datetime
    updated_at: datetime


class ReactionCounts(BaseModel):
    """Schema for aggregated reaction counts."""
    care: int = 0
    solidarity: int = 0
    respect: int = 0
    gratitude: int = 0


# Feed Schemas
class FeedItem(BaseModel):
    """Schema for feed item (event or post)."""
    type: str  # "event" or "post"
    id: int
    creator: ProfileResponse
    created_at: datetime
    # Event-specific fields
    title: Optional[str] = None
    description: Optional[str] = None
    event_type: Optional[str] = None
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    location: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    attendance_count: Optional[int] = None
    user_attending: Optional[bool] = None
    reactions: Optional[List[dict]] = None
    # Post-specific fields
    text: Optional[str] = None
    image_url: Optional[str] = None


# Attendance Schemas
class AttendanceResponse(BaseModel):
    """Schema for attendance data."""
    user_id: int
    event_id: int
    created_at: datetime


class AttendeeListResponse(BaseModel):
    """Schema for list of event attendees."""
    total_count: int
    attendees: List[int]  # List of user IDs


# Unionized Schemas
class FairWorkPostingCreate(BaseModel):
    """Schema for creating a fair work posting."""
    title: str = Field(min_length=1, max_length=255)
    organization: str = Field(min_length=1, max_length=255)
    location: str = Field(min_length=1, max_length=255)
    wage_min: Optional[float] = None
    wage_max: Optional[float] = None
    wage_text: str = Field(min_length=1, max_length=255)
    employment_type: EmploymentType
    union_status: UnionStatus
    description: str = Field(min_length=1, max_length=2000)
    worker_notes: Optional[str] = Field(None, max_length=1000)
    application_url: Optional[str] = Field(None, max_length=500)


class FairWorkPostingResponse(BaseModel):
    """Schema for fair work posting data in responses."""
    id: int
    title: str
    organization: str
    location: str
    wage_min: Optional[float]
    wage_max: Optional[float]
    wage_text: str
    employment_type: EmploymentType
    union_status: UnionStatus
    description: str
    worker_notes: Optional[str]
    application_url: Optional[str]
    posted_date: datetime
    created_at: datetime
    updated_at: datetime
