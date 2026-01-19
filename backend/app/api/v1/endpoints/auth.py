"""Authentication endpoints."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from app.db.session import get_session
from app.schemas import UserRegister, UserLogin, Token, UserResponse, ProfileResponse
from app.models import User, Profile, ProfileType
from app.core.security import verify_password, get_password_hash, create_access_token

router = APIRouter()


@router.post("/register", response_model=dict, status_code=status.HTTP_201_CREATED)
async def register(
    user_data: UserRegister,
    session: Session = Depends(get_session)
):
    """
    Register a new user account.
    
    Creates both User and Profile records.
    Returns access token for immediate login.
    """
    # Check if email already exists
    statement = select(User).where(User.email == user_data.email)
    existing_user = session.exec(statement).first()
    
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create user
    hashed_password = get_password_hash(user_data.password)
    user = User(
        email=user_data.email,
        hashed_password=hashed_password
    )
    session.add(user)
    session.commit()
    session.refresh(user)
    
    # Create associated profile
    profile = Profile(
        user_id=user.id,
        name=user_data.name,
        profile_type=user_data.profile_type,
        bio=user_data.bio,
        location=user_data.location,
        causes=user_data.causes or []
    )
    session.add(profile)
    session.commit()
    session.refresh(profile)
    
    # Create access token
    access_token = create_access_token(data={"sub": str(user.id)})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "created_at": user.created_at
        },
        "profile": {
            "id": profile.id,
            "name": profile.name,
            "profile_type": profile.profile_type
        }
    }


@router.post("/login", response_model=Token)
async def login(
    credentials: UserLogin,
    session: Session = Depends(get_session)
):
    """
    Authenticate user and return JWT token.
    
    Validates credentials and issues a 7-day access token.
    """
    # Find user by email
    statement = select(User).where(User.email == credentials.email)
    user = session.exec(statement).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Verify password
    if not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Create access token
    access_token = create_access_token(data={"sub": str(user.id)})
    
    return Token(access_token=access_token)


@router.post("/logout")
async def logout():
    """
    Logout endpoint (client-side token invalidation).
    
    Since we use stateless JWT tokens, logout is handled client-side
    by removing the token from storage.
    """
    return {"message": "Successfully logged out. Please remove the token from client storage."}
