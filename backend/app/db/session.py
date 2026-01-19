"""Database session management."""

from sqlmodel import Session, create_engine
from app.core.config import settings

# Create database engine
engine = create_engine(
    settings.DATABASE_URL,
    echo=True,
    pool_pre_ping=True
)


def get_session():
    """Dependency for getting database sessions."""
    with Session(engine) as session:
        yield session
