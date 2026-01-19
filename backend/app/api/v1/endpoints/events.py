"""Event endpoints."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from app.db.session import get_session
from app.schemas import EventCreate, EventResponse, EventWithCreator, AttendeeListResponse
from app.models import User, Profile, Event, Attendance
from app.api.deps import get_current_user

router = APIRouter()


@router.post("", response_model=EventResponse, status_code=status.HTTP_201_CREATED)
async def create_event(
    event_data: EventCreate,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Create a new event."""
    # Get user's profile
    statement = select(Profile).where(Profile.user_id == current_user.id)
    profile = session.exec(statement).first()
    
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found"
        )
    
    # Create event
    event = Event(
        creator_id=profile.id,
        **event_data.model_dump()
    )
    session.add(event)
    session.commit()
    session.refresh(event)
    
    # Return with attendee_count
    result = event.model_dump()
    result["attendee_count"] = 0
    return EventResponse(**result)


@router.get("", response_model=list[EventResponse])
async def list_events(
    session: Session = Depends(get_session)
):
    """List all events for the feed."""
    statement = select(Event).order_by(Event.created_at.desc())
    events = session.exec(statement).all()
    
    # Add attendee count to each event
    result = []
    for event in events:
        event_dict = event.model_dump()
        event_dict["attendee_count"] = len(event.attendances)
        result.append(EventResponse(**event_dict))
    
    return result


@router.get("/map", response_model=list[EventResponse])
async def list_map_events(
    session: Session = Depends(get_session)
):
    """List all events with coordinates for the map."""
    statement = (
        select(Event)
        .where(Event.latitude.isnot(None))
        .where(Event.longitude.isnot(None))
    )
    events = session.exec(statement).all()
    
    # Add attendee count to each event
    result = []
    for event in events:
        event_dict = event.model_dump()
        event_dict["attendee_count"] = len(event.attendances)
        result.append(EventResponse(**event_dict))
    
    return result


@router.get("/{event_id}", response_model=EventWithCreator)
async def get_event(
    event_id: int,
    session: Session = Depends(get_session)
):
    """Get event detail by ID."""
    event = session.get(Event, event_id)
    
    if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found"
        )
    
    # Load creator relationship
    creator = session.get(Profile, event.creator_id)
    
    # Build response with attendee count
    event_dict = event.model_dump()
    event_dict["attendee_count"] = len(event.attendances)
    event_dict["creator"] = creator
    
    return EventWithCreator(**event_dict)


@router.post("/{event_id}/join", response_model=dict)
async def join_event(
    event_id: int,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Join an event (record attendance)."""
    # Verify event exists
    event = session.get(Event, event_id)
    if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found"
        )
    
    # Check if already attending
    statement = select(Attendance).where(
        Attendance.user_id == current_user.id,
        Attendance.event_id == event_id
    )
    existing = session.exec(statement).first()
    
    if existing:
        return {
            "message": "Already attending this event",
            "attendance_id": existing.id
        }
    
    # Create attendance record
    attendance = Attendance(
        user_id=current_user.id,
        event_id=event_id
    )
    session.add(attendance)
    session.commit()
    session.refresh(attendance)
    
    return {
        "message": "Successfully joined event",
        "attendance_id": attendance.id
    }


@router.delete("/{event_id}/leave", response_model=dict)
async def leave_event(
    event_id: int,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Leave an event (remove attendance)."""
    # Find attendance record
    statement = select(Attendance).where(
        Attendance.user_id == current_user.id,
        Attendance.event_id == event_id
    )
    attendance = session.exec(statement).first()
    
    if not attendance:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Not attending this event"
        )
    
    session.delete(attendance)
    session.commit()
    
    return {"message": "Successfully left event"}


@router.get("/{event_id}/attendees", response_model=AttendeeListResponse)
async def get_event_attendees(
    event_id: int,
    session: Session = Depends(get_session)
):
    """Get attendee count and list for an event."""
    # Verify event exists
    event = session.get(Event, event_id)
    if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found"
        )
    
    # Get all attendances
    statement = select(Attendance).where(Attendance.event_id == event_id)
    attendances = session.exec(statement).all()
    
    return AttendeeListResponse(
        total_count=len(attendances),
        attendees=[a.user_id for a in attendances]
    )
