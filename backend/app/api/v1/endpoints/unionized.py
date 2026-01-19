"""API endpoints for Unionized fair work postings."""

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session, select
from app.db.session import get_session
from app.models import FairWorkPosting, EmploymentType, UnionStatus
from app.schemas import FairWorkPostingCreate, FairWorkPostingResponse

router = APIRouter()


@router.get("/", response_model=List[FairWorkPostingResponse])
def get_fair_work_postings(
    *,
    db: Session = Depends(get_session),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    location: Optional[str] = None,
    employment_type: Optional[EmploymentType] = None,
    union_status: Optional[UnionStatus] = None,
) -> List[FairWorkPosting]:
    """
    Get fair work postings with optional filters.
    Returns chronological list (newest first).
    """
    query = select(FairWorkPosting)
    
    # Apply filters
    if location:
        query = query.where(FairWorkPosting.location.ilike(f"%{location}%"))
    if employment_type:
        query = query.where(FairWorkPosting.employment_type == employment_type)
    if union_status:
        query = query.where(FairWorkPosting.union_status == union_status)
    
    # Order by posted_date descending (newest first)
    query = query.order_by(FairWorkPosting.posted_date.desc())
    query = query.offset(skip).limit(limit)
    
    postings = db.exec(query).all()
    return postings


@router.get("/{posting_id}", response_model=FairWorkPostingResponse)
def get_fair_work_posting(
    *,
    db: Session = Depends(get_session),
    posting_id: int,
) -> FairWorkPosting:
    """Get a specific fair work posting by ID."""
    posting = db.get(FairWorkPosting, posting_id)
    if not posting:
        raise HTTPException(status_code=404, detail="Fair work posting not found")
    return posting


@router.post("/", response_model=FairWorkPostingResponse, status_code=201)
def create_fair_work_posting(
    *,
    db: Session = Depends(get_session),
    posting_in: FairWorkPostingCreate,
) -> FairWorkPosting:
    """
    Create a new fair work posting.
    Note: In production, this would require admin authentication.
    """
    posting = FairWorkPosting(**posting_in.model_dump())
    db.add(posting)
    db.commit()
    db.refresh(posting)
    return posting
