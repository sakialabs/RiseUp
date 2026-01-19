"""SQLModel database models for RiseUp Collective."""

from datetime import datetime
from typing import Optional, List
from enum import Enum
from sqlmodel import Field, SQLModel, Relationship, Column
from sqlalchemy import JSON


# Enums
class ProfileType(str, Enum):
    """Profile type enumeration."""
    INDIVIDUAL = "individual"
    GROUP = "group"


class ReactionType(str, Enum):
    """Reaction type enumeration - the four solidarity gestures."""
    CARE = "care"
    SOLIDARITY = "solidarity"
    RESPECT = "respect"
    GRATITUDE = "gratitude"


class TargetType(str, Enum):
    """Target type for reactions (polymorphic)."""
    EVENT = "event"
    POST = "post"


class EmploymentType(str, Enum):
    """Employment type enumeration."""
    FULL_TIME = "full-time"
    PART_TIME = "part-time"
    CONTRACT = "contract"
    GIG = "gig"


class UnionStatus(str, Enum):
    """Union status enumeration."""
    UNIONIZED = "unionized"
    UNION_FRIENDLY = "union-friendly"
    NOT_LISTED = "not-listed"


# Models
class User(SQLModel, table=True):
    """User account model."""
    __tablename__ = "users"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(unique=True, index=True, max_length=255)
    hashed_password: str = Field(max_length=255)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Relationships
    profile: Optional["Profile"] = Relationship(back_populates="user")
    attendances: List["Attendance"] = Relationship(back_populates="user")
    reactions: List["Reaction"] = Relationship(back_populates="user")


class Profile(SQLModel, table=True):
    """User profile model (individual or group)."""
    __tablename__ = "profiles"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.id", unique=True, index=True)
    name: str = Field(max_length=255)
    bio: Optional[str] = Field(default=None, max_length=1000)
    location: Optional[str] = Field(default=None, max_length=255)
    avatar_url: Optional[str] = Field(default=None, max_length=500)
    causes: List[str] = Field(default_factory=list, sa_column=Column(JSON))
    profile_type: ProfileType = Field(default=ProfileType.INDIVIDUAL)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Relationships
    user: Optional[User] = Relationship(back_populates="profile")
    events: List["Event"] = Relationship(back_populates="creator")
    posts: List["Post"] = Relationship(back_populates="creator")


class Event(SQLModel, table=True):
    """Event model for local actions."""
    __tablename__ = "events"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    creator_id: int = Field(foreign_key="profiles.id", index=True)
    title: str = Field(max_length=255)
    description: str = Field(max_length=2000)
    event_date: datetime
    location: str = Field(max_length=500)
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    tags: List[str] = Field(default_factory=list, sa_column=Column(JSON))
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Relationships
    creator: Optional[Profile] = Relationship(back_populates="events")
    attendances: List["Attendance"] = Relationship(back_populates="event")


class Post(SQLModel, table=True):
    """Post model for community updates."""
    __tablename__ = "posts"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    creator_id: int = Field(foreign_key="profiles.id", index=True)
    text: str = Field(max_length=500)
    image_url: Optional[str] = Field(default=None, max_length=500)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Relationships
    creator: Optional[Profile] = Relationship(back_populates="posts")


class Attendance(SQLModel, table=True):
    """Attendance model for event participation."""
    __tablename__ = "attendances"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.id", index=True)
    event_id: int = Field(foreign_key="events.id", index=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Relationships
    user: Optional[User] = Relationship(back_populates="attendances")
    event: Optional[Event] = Relationship(back_populates="attendances")
    
    class Config:
        # Unique constraint on user_id and event_id combination
        schema_extra = {
            "unique_together": [["user_id", "event_id"]]
        }


class Reaction(SQLModel, table=True):
    """Reaction model for solidarity gestures on events and posts."""
    __tablename__ = "reactions"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.id", index=True)
    target_type: TargetType
    target_id: int  # ID of the event or post
    reaction_type: ReactionType
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Relationships
    user: Optional[User] = Relationship(back_populates="reactions")
    
    class Config:
        # Unique constraint: one reaction per user per target
        schema_extra = {
            "unique_together": [["user_id", "target_type", "target_id"]]
        }


class FairWorkPosting(SQLModel, table=True):
    """Fair work posting model for Unionized section."""
    __tablename__ = "fair_work_postings"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str = Field(max_length=255)
    organization: str = Field(max_length=255)
    location: str = Field(max_length=255)
    wage_min: Optional[float] = None
    wage_max: Optional[float] = None
    wage_text: str = Field(max_length=255)  # Required wage transparency
    employment_type: EmploymentType
    union_status: UnionStatus
    description: str = Field(max_length=2000)
    worker_notes: Optional[str] = Field(default=None, max_length=1000)
    application_url: Optional[str] = Field(default=None, max_length=500)
    posted_date: datetime = Field(default_factory=datetime.utcnow)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
