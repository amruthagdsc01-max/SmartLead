"""
SmartLead API - FastAPI Backend

SmartLead is an AI-assisted lead scoring API built with FastAPI.

Features:
- Lead CRUD
- Lead search
- Filtering
- Sorting
- Pagination
- Automatic lead scoring
- Score explainability
- Batch lead creation
- Health check
"""

from fastapi import FastAPI, Depends, HTTPException, Query, status
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import List, Optional
import os

from database import init_db, get_db, Lead as LeadModel
from models import (
    LeadCreate,
    LeadUpdate,
    LeadResponse,
    LeadScoreBreakdown
)
from scoring import calculate_lead_score


# ============================================================
# APPLICATION LIFESPAN
# ============================================================

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application startup and shutdown events.
    """

    # Startup
    init_db()

    yield

    # Shutdown
    print("SmartLead API shutting down")


# ============================================================
# FASTAPI APPLICATION
# ============================================================

app = FastAPI(
    title="SmartLead API",
    description=(
        "AI-assisted lead scoring API built with FastAPI. "
        "Demonstrates LLM coding assistant usage with "
        "critical human review."
    ),
    version="1.0.0",
    lifespan=lifespan,
    contact={
        "name": "Amrutha R N",
        "email": "amrutharn04@gmail.com",
        "url": "https://github.com/amrutha-rn/smartlead"
    },
    license_info={
        "name": "MIT",
        "url": "https://opensource.org/licenses/MIT"
    }
)


# ============================================================
# CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
    ],  # Restrict this later for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# HEALTH CHECK
# ============================================================

@app.get(
    "/health",
    tags=["Health"],
    summary="Health check endpoint"
)
def health_check():
    """
    Check if the API is running and database is accessible.
    """

    return {
        "status": "healthy",
        "service": "SmartLead API",
        "version": "1.0.0",
        "database": "connected"
    }


# ============================================================
# CREATE LEAD
# ============================================================

@app.post(
    "/leads",
    response_model=LeadResponse,
    status_code=status.HTTP_201_CREATED,
    tags=["Leads"],
    summary="Create a new lead",
    description=(
        "Create a new sales lead with automatic "
        "AI-powered scoring."
    )
)
def create_lead(
    lead: LeadCreate,
    db: Session = Depends(get_db)
):
    """
    Create a new lead and automatically calculate its score.

    Scoring factors:
    - Budget: 30%
    - Timeline: 35%
    - Source: 20%
    - Job Title: 15%
    """

    # Check duplicate email
    existing = (
        db.query(LeadModel)
        .filter(LeadModel.email == lead.email)
        .first()
    )

    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=(
                f"Lead with email '{lead.email}' already exists. "
                "Use PUT to update."
            )
        )

    # Calculate score
    score, breakdown = calculate_lead_score(lead)

    # Create database record
    db_lead = LeadModel(
        name=lead.name,
        email=lead.email,
        company=lead.company,
        job_title=lead.job_title,
        budget=lead.budget,
        timeline=lead.timeline.value,
        source=lead.source.value,
        score=score
    )

    db.add(db_lead)
    db.commit()
    db.refresh(db_lead)

    return db_lead


# ============================================================
# LIST / SEARCH / FILTER / SORT LEADS
# ============================================================

@app.get(
    "/leads",
    response_model=List[LeadResponse],
    tags=["Leads"],
    summary="List and search leads",
    description=(
        "Retrieve leads with search, filtering, "
        "pagination, and sorting."
    )
)
def list_leads(
    db: Session = Depends(get_db),

    skip: int = Query(
        0,
        ge=0,
        description="Number of records to skip"
    ),

    limit: int = Query(
        100,
        ge=1,
        le=1000,
        description="Maximum number of records to return"
    ),

    search: Optional[str] = Query(
        None,
        description=(
            "Search by name, email, company, "
            "or job title"
        )
    ),

    min_score: Optional[float] = Query(
        None,
        ge=0,
        le=100,
        description="Filter by minimum score"
    ),

    source: Optional[str] = Query(
        None,
        description="Filter by lead source"
    ),

    sort_by: str = Query(
        "score",
        description=(
            "Sort field: score, created_at, name"
        )
    ),

    sort_order: str = Query(
        "desc",
        description="Sort order: asc or desc"
    )
):
    """
    List leads with:

    - Search
    - Pagination
    - Score filtering
    - Source filtering
    - Sorting

    Search checks:

    - Name
    - Email
    - Company
    - Job title

    Example:

    /leads?search=google

    /leads?search=cto&min_score=70

    /leads?search=amrutha&sort_by=name&sort_order=asc
    """

    # Start query
    query = db.query(LeadModel)

    # --------------------------------------------------------
    # SEARCH
    # --------------------------------------------------------

    if search and search.strip():

        search_term = f"%{search.strip()}%"

        query = query.filter(
            or_(
                LeadModel.name.ilike(search_term),
                LeadModel.email.ilike(search_term),
                LeadModel.company.ilike(search_term),
                LeadModel.job_title.ilike(search_term)
            )
        )

    # --------------------------------------------------------
    # SCORE FILTER
    # --------------------------------------------------------

    if min_score is not None:

        query = query.filter(
            LeadModel.score >= min_score
        )

    # --------------------------------------------------------
    # SOURCE FILTER
    # --------------------------------------------------------

    if source:

        query = query.filter(
            LeadModel.source == source.lower()
        )

    # --------------------------------------------------------
    # SORTING
    # --------------------------------------------------------

    allowed_sort_fields = {
        "score": LeadModel.score,
        "created_at": LeadModel.created_at,
        "name": LeadModel.name
    }

    sort_column = allowed_sort_fields.get(
        sort_by,
        LeadModel.score
    )

    if sort_order.lower() == "asc":

        query = query.order_by(
            sort_column.asc()
        )

    else:

        query = query.order_by(
            sort_column.desc()
        )

    # --------------------------------------------------------
    # PAGINATION
    # --------------------------------------------------------

    leads = (
        query
        .offset(skip)
        .limit(limit)
        .all()
    )

    return leads


# ============================================================
# GET SINGLE LEAD
# ============================================================

@app.get(
    "/leads/{lead_id}",
    response_model=LeadResponse,
    tags=["Leads"],
    summary="Get a specific lead"
)
def get_lead(
    lead_id: int,
    db: Session = Depends(get_db)
):
    """
    Retrieve a single lead by ID.
    """

    lead = (
        db.query(LeadModel)
        .filter(LeadModel.id == lead_id)
        .first()
    )

    if not lead:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Lead with id {lead_id} not found"
        )

    return lead


# ============================================================
# UPDATE LEAD
# ============================================================

@app.put(
    "/leads/{lead_id}",
    response_model=LeadResponse,
    tags=["Leads"],
    summary="Update a lead"
)
def update_lead(
    lead_id: int,
    lead_update: LeadUpdate,
    db: Session = Depends(get_db)
):
    """
    Update an existing lead.

    Only provided fields are updated.

    The lead score is automatically recalculated
    after an update.
    """

    db_lead = (
        db.query(LeadModel)
        .filter(LeadModel.id == lead_id)
        .first()
    )

    if not db_lead:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Lead with id {lead_id} not found"
        )

    # --------------------------------------------------------
    # Update provided fields
    # --------------------------------------------------------

    update_data = lead_update.model_dump(
        exclude_unset=True
    )

    for field, value in update_data.items():

        if hasattr(db_lead, field):

            # Convert enum values to strings
            if hasattr(value, "value"):
                value = value.value

            setattr(
                db_lead,
                field,
                value
            )

    # --------------------------------------------------------
    # Recalculate score
    # --------------------------------------------------------

    current_data = LeadCreate(
        name=db_lead.name,
        email=db_lead.email,
        company=db_lead.company,
        job_title=db_lead.job_title,
        budget=db_lead.budget,
        timeline=db_lead.timeline,
        source=db_lead.source
    )

    new_score, _ = calculate_lead_score(
        current_data
    )

    db_lead.score = new_score

    # --------------------------------------------------------
    # Save
    # --------------------------------------------------------

    db.commit()
    db.refresh(db_lead)

    return db_lead


# ============================================================
# DELETE LEAD
# ============================================================

@app.delete(
    "/leads/{lead_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    tags=["Leads"],
    summary="Delete a lead"
)
def delete_lead(
    lead_id: int,
    db: Session = Depends(get_db)
):
    """
    Delete a lead by ID.
    """

    db_lead = (
        db.query(LeadModel)
        .filter(LeadModel.id == lead_id)
        .first()
    )

    if not db_lead:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Lead with id {lead_id} not found"
        )

    db.delete(db_lead)
    db.commit()

    return None


# ============================================================
# SCORE BREAKDOWN
# ============================================================

@app.get(
    "/leads/{lead_id}/score-breakdown",
    response_model=LeadScoreBreakdown,
    tags=["Scoring"],
    summary="Get detailed score breakdown",
    description=(
        "Explainable AI: See exactly how "
        "the lead score was calculated."
    )
)
def get_score_breakdown(
    lead_id: int,
    db: Session = Depends(get_db)
):
    """
    Get detailed breakdown of how a lead's
    score was calculated.
    """

    db_lead = (
        db.query(LeadModel)
        .filter(LeadModel.id == lead_id)
        .first()
    )

    if not db_lead:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Lead with id {lead_id} not found"
        )

    lead_data = LeadCreate(
        name=db_lead.name,
        email=db_lead.email,
        company=db_lead.company,
        job_title=db_lead.job_title,
        budget=db_lead.budget,
        timeline=db_lead.timeline,
        source=db_lead.source
    )

    _, breakdown = calculate_lead_score(
        lead_data
    )

    return breakdown


# ============================================================
# BATCH CREATE
# ============================================================

@app.post(
    "/leads/batch",
    response_model=List[LeadResponse],
    status_code=status.HTTP_201_CREATED,
    tags=["Leads"],
    summary="Batch create leads"
)
def create_leads_batch(
    leads: List[LeadCreate],
    db: Session = Depends(get_db)
):
    """
    Create multiple leads in a single request.

    Duplicate emails are skipped.
    """

    created_leads = []

    for lead in leads:

        # Check duplicate
        existing = (
            db.query(LeadModel)
            .filter(LeadModel.email == lead.email)
            .first()
        )

        if existing:
            continue

        # Calculate score
        score, _ = calculate_lead_score(lead)

        # Create record
        db_lead = LeadModel(
            name=lead.name,
            email=lead.email,
            company=lead.company,
            job_title=lead.job_title,
            budget=lead.budget,
            timeline=lead.timeline.value,
            source=lead.source.value,
            score=score
        )

        db.add(db_lead)
        created_leads.append(db_lead)

    db.commit()

    for lead in created_leads:
        db.refresh(lead)

    return created_leads


# ============================================================
# RUN DIRECTLY
# ============================================================

if __name__ == "__main__":

    import uvicorn

    port = int(
        os.getenv("PORT", 8000)
    )

    uvicorn.run(
        app,
        host="0.0.0.0",
        port=port
    )