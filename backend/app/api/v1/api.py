"""API v1 router configuration."""

from fastapi import APIRouter
from app.api.v1.endpoints import auth, events, posts, profiles, reactions, feed, unionized

api_router = APIRouter()

# Include endpoint routers
api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])
api_router.include_router(profiles.router, prefix="/profiles", tags=["profiles"])
api_router.include_router(events.router, prefix="/events", tags=["events"])
api_router.include_router(posts.router, prefix="/posts", tags=["posts"])
api_router.include_router(reactions.router, prefix="/reactions", tags=["reactions"])
api_router.include_router(feed.router, prefix="/feed", tags=["feed"])
api_router.include_router(unionized.router, prefix="/unionized", tags=["unionized"])
