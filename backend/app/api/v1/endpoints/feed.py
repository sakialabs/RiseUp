"""Feed endpoints."""

from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from app.db.session import get_session
from app.api.deps import get_current_user
from app.schemas import FeedItem, ProfileResponse
from app.models import Event, Post, Profile, User, Reaction, Attendance

router = APIRouter()


@router.get("", response_model=list[FeedItem])
async def get_feed(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
    limit: int = 50
):
    """
    Get the community feed (events and posts in reverse chronological order).
    
    Returns a unified feed of both events and posts, newest first.
    """
    # Get events
    event_statement = select(Event).order_by(Event.created_at.desc()).limit(limit)
    events = session.exec(event_statement).all()
    
    # Get posts
    post_statement = select(Post).order_by(Post.created_at.desc()).limit(limit)
    posts = session.exec(post_statement).all()
    
    # Combine and sort by created_at
    feed_items = []
    
    for event in events:
        creator_profile = session.get(Profile, event.creator_id)
        creator_user = session.get(User, creator_profile.user_id)
        
        # Create ProfileResponse with email from User
        creator_data = creator_profile.model_dump()
        creator_data['email'] = creator_user.email
        
        # Get reactions for this event
        reaction_statement = select(Reaction).where(
            Reaction.target_type == "EVENT",
            Reaction.target_id == event.id
        )
        reactions = session.exec(reaction_statement).all()
        
        # Group reactions by type
        reaction_summary = {}
        for reaction in reactions:
            if reaction.reaction_type not in reaction_summary:
                reaction_summary[reaction.reaction_type] = {
                    "reaction_type": reaction.reaction_type,
                    "count": 0,
                    "user_reacted": False
                }
            reaction_summary[reaction.reaction_type]["count"] += 1
            if reaction.user_id == current_user.id:
                reaction_summary[reaction.reaction_type]["user_reacted"] = True
        
        # Check if user is attending
        attendance_statement = select(Attendance).where(
            Attendance.event_id == event.id,
            Attendance.user_id == current_user.id
        )
        user_attending = session.exec(attendance_statement).first() is not None
        
        feed_items.append(FeedItem(
            type="event",
            id=event.id,
            creator=ProfileResponse(**creator_data),
            created_at=event.created_at,
            title=event.title,
            description=event.description,
            event_type=event.tags[0] if event.tags else None,  # Use first tag as event_type
            start_time=event.event_date,  # Map event_date to start_time
            end_time=None,  # No end_time in current model
            location=event.location,
            latitude=event.latitude,
            longitude=event.longitude,
            attendance_count=len(event.attendances),
            user_attending=user_attending,
            reactions=list(reaction_summary.values())
        ))
    
    for post in posts:
        creator_profile = session.get(Profile, post.creator_id)
        creator_user = session.get(User, creator_profile.user_id)
        
        # Create ProfileResponse with email from User
        creator_data = creator_profile.model_dump()
        creator_data['email'] = creator_user.email
        
        # Get reactions for this post
        reaction_statement = select(Reaction).where(
            Reaction.target_type == "POST",
            Reaction.target_id == post.id
        )
        reactions = session.exec(reaction_statement).all()
        
        # Group reactions by type
        reaction_summary = {}
        for reaction in reactions:
            if reaction.reaction_type not in reaction_summary:
                reaction_summary[reaction.reaction_type] = {
                    "reaction_type": reaction.reaction_type,
                    "count": 0,
                    "user_reacted": False
                }
            reaction_summary[reaction.reaction_type]["count"] += 1
            if reaction.user_id == current_user.id:
                reaction_summary[reaction.reaction_type]["user_reacted"] = True
        
        feed_items.append(FeedItem(
            type="post",
            id=post.id,
            creator=ProfileResponse(**creator_data),
            created_at=post.created_at,
            text=post.text,
            image_url=post.image_url,
            reactions=list(reaction_summary.values())
        ))
    
    # Sort by created_at (newest first) and limit
    feed_items.sort(key=lambda x: x.created_at, reverse=True)
    
    return feed_items[:limit]
