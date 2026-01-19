"""Reaction endpoints."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select, func
from app.db.session import get_session
from app.schemas import ReactionCreate, ReactionResponse, ReactionCounts
from app.models import User, Reaction, ReactionType, TargetType, Event, Post
from app.api.deps import get_current_user

router = APIRouter()


@router.post("", response_model=ReactionResponse, status_code=status.HTTP_201_CREATED)
async def add_or_update_reaction(
    reaction_data: ReactionCreate,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Add or update a reaction.
    
    If user has already reacted to this target, updates the reaction type.
    Otherwise, creates a new reaction.
    """
    # Verify target exists
    if reaction_data.target_type == TargetType.EVENT:
        target = session.get(Event, reaction_data.target_id)
    else:  # POST
        target = session.get(Post, reaction_data.target_id)
    
    if not target:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"{reaction_data.target_type.value.capitalize()} not found"
        )
    
    # Check if reaction already exists
    statement = select(Reaction).where(
        Reaction.user_id == current_user.id,
        Reaction.target_type == reaction_data.target_type,
        Reaction.target_id == reaction_data.target_id
    )
    existing = session.exec(statement).first()
    
    if existing:
        # Update existing reaction
        existing.reaction_type = reaction_data.reaction_type
        session.add(existing)
        session.commit()
        session.refresh(existing)
        return existing
    
    # Create new reaction
    reaction = Reaction(
        user_id=current_user.id,
        **reaction_data.model_dump()
    )
    session.add(reaction)
    session.commit()
    session.refresh(reaction)
    
    return reaction


@router.delete("", response_model=dict)
async def remove_reaction(
    target_type: TargetType,
    target_id: int,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Remove a reaction from a target."""
    # Find reaction
    statement = select(Reaction).where(
        Reaction.user_id == current_user.id,
        Reaction.target_type == target_type,
        Reaction.target_id == target_id
    )
    reaction = session.exec(statement).first()
    
    if not reaction:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Reaction not found"
        )
    
    session.delete(reaction)
    session.commit()
    
    return {"message": "Reaction removed successfully"}


@router.get("/events/{event_id}", response_model=ReactionCounts)
async def get_event_reactions(
    event_id: int,
    session: Session = Depends(get_session)
):
    """Get reaction counts for an event."""
    # Verify event exists
    event = session.get(Event, event_id)
    if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found"
        )
    
    # Count reactions by type
    statement = select(
        Reaction.reaction_type,
        func.count(Reaction.id).label("count")
    ).where(
        Reaction.target_type == TargetType.EVENT,
        Reaction.target_id == event_id
    ).group_by(Reaction.reaction_type)
    
    results = session.exec(statement).all()
    
    # Build response with counts
    counts = ReactionCounts()
    for reaction_type, count in results:
        setattr(counts, reaction_type.value, count)
    
    return counts


@router.get("/posts/{post_id}", response_model=ReactionCounts)
async def get_post_reactions(
    post_id: int,
    session: Session = Depends(get_session)
):
    """Get reaction counts for a post."""
    # Verify post exists
    post = session.get(Post, post_id)
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )
    
    # Count reactions by type
    statement = select(
        Reaction.reaction_type,
        func.count(Reaction.id).label("count")
    ).where(
        Reaction.target_type == TargetType.POST,
        Reaction.target_id == post_id
    ).group_by(Reaction.reaction_type)
    
    results = session.exec(statement).all()
    
    # Build response with counts
    counts = ReactionCounts()
    for reaction_type, count in results:
        setattr(counts, reaction_type.value, count)
    
    return counts
