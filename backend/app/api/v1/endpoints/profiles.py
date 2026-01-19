"""Profile endpoints."""

from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from app.db.session import get_session
from app.schemas import ProfileResponse, ProfileUpdate, EventResponse
from app.models import User, Profile, Event, Attendance
from app.api.deps import get_current_user

router = APIRouter()


@router.get("/me", response_model=ProfileResponse)
async def get_my_profile(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Get current user's profile."""
    statement = select(Profile).where(Profile.user_id == current_user.id)
    profile = session.exec(statement).first()
    
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found"
        )
    
    # Return profile with email from user
    return {
        **profile.dict(),
        "email": current_user.email
    }


@router.patch("/me", response_model=ProfileResponse)
async def update_my_profile(
    profile_data: ProfileUpdate,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Update current user's profile."""
    statement = select(Profile).where(Profile.user_id == current_user.id)
    profile = session.exec(statement).first()
    
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found"
        )
    
    # Update only provided fields
    update_data = profile_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(profile, key, value)
    
    profile.updated_at = datetime.utcnow()
    session.add(profile)
    session.commit()
    session.refresh(profile)
    
    # Return profile with email from user
    return {
        **profile.dict(),
        "email": current_user.email
    }


@router.get("/{profile_id}", response_model=ProfileResponse)
async def get_profile(
    profile_id: int,
    session: Session = Depends(get_session)
):
    """Get a profile by ID."""
    profile = session.get(Profile, profile_id)
    
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found"
        )
    
    return profile


@router.get("/{profile_id}/events", response_model=list[EventResponse])
async def get_profile_events(
    profile_id: int,
    session: Session = Depends(get_session)
):
    """Get all events created by a profile, ordered by event date."""
    # Verify profile exists
    profile = session.get(Profile, profile_id)
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found"
        )
    
    # Get events ordered by event_date
    statement = (
        select(Event)
        .where(Event.creator_id == profile_id)
        .order_by(Event.event_date)
    )
    events = session.exec(statement).all()
    
    # Add attendee count to each event
    result = []
    for event in events:
        event_dict = event.model_dump()
        event_dict["attendee_count"] = len(event.attendances)
        result.append(EventResponse(**event_dict))
    
    return result


@router.get("/me/attending", response_model=list[EventResponse])
async def get_my_attending_events(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Get all events the current user is attending, ordered by event date."""
    # Get all attendances for the user
    statement = (
        select(Event)
        .join(Attendance, Attendance.event_id == Event.id)
        .where(Attendance.user_id == current_user.id)
        .order_by(Event.event_date)
    )
    events = session.exec(statement).all()
    
    # Add attendee count to each event
    result = []
    for event in events:
        event_dict = event.model_dump()
        event_dict["attendee_count"] = len(event.attendances)
        result.append(EventResponse(**event_dict))
    
    return result
