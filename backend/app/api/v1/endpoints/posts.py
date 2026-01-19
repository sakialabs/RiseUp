"""Post endpoints."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from app.db.session import get_session
from app.schemas import PostCreate, PostResponse, PostWithCreator
from app.models import User, Profile, Post
from app.api.deps import get_current_user

router = APIRouter()


@router.post("", response_model=PostResponse, status_code=status.HTTP_201_CREATED)
async def create_post(
    post_data: PostCreate,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Create a new post."""
    # Get user's profile
    statement = select(Profile).where(Profile.user_id == current_user.id)
    profile = session.exec(statement).first()
    
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found"
        )
    
    # Create post
    post = Post(
        creator_id=profile.id,
        **post_data.model_dump()
    )
    session.add(post)
    session.commit()
    session.refresh(post)
    
    return post


@router.get("/{post_id}", response_model=PostWithCreator)
async def get_post(
    post_id: int,
    session: Session = Depends(get_session)
):
    """Get post detail by ID."""
    post = session.get(Post, post_id)
    
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )
    
    # Load creator relationship
    creator = session.get(Profile, post.creator_id)
    
    # Build response
    post_dict = post.model_dump()
    post_dict["creator"] = creator
    
    return PostWithCreator(**post_dict)
