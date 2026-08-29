"""
Pydantic Models for SmartLead API
AI-Generated v1 was basic. Improved v2 adds validation, enums, and better structure.
"""
from pydantic import BaseModel, Field, EmailStr, field_validator, ConfigDict
from typing import Optional, Literal
from datetime import datetime
from enum import Enum

# IMPROVEMENT 1: Added enums for constrained fields (AI used plain strings)
class Timeline(str, Enum):
    IMMEDIATE = "immediate"
    THREE_MONTHS = "3_months"
    SIX_MONTHS = "6_months"
    ONE_YEAR = "1_year"
    UNKNOWN = "unknown"

class Source(str, Enum):
    WEBSITE = "website"
    REFERRAL = "referral"
    LINKEDIN = "linkedin"
    EVENT = "event"
    EMAIL = "email"
    OTHER = "other"

# IMPROVEMENT 2: Base model with shared fields (DRY principle)
class LeadBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=100, description="Lead full name")
    email: EmailStr = Field(..., description="Lead email address")
    company: Optional[str] = Field(None, max_length=100, description="Company name")
    job_title: Optional[str] = Field(None, max_length=100, description="Job title")
    budget: Optional[float] = Field(None, ge=0, description="Estimated budget in USD")
    timeline: Timeline = Field(default=Timeline.UNKNOWN, description="Purchase timeline")
    source: Source = Field(default=Source.OTHER, description="Lead source channel")

    # IMPROVEMENT 3: Custom validator for budget (AI didn't add business logic validation)
    @field_validator('budget')
    @classmethod
    def validate_budget(cls, v: Optional[float]) -> Optional[float]:
        if v is not None and v > 10_000_000:
            raise ValueError("Budget seems unrealistically high. Please verify.")
        return v

class LeadCreate(LeadBase):
    """Model for creating a new lead."""
    pass

class LeadUpdate(BaseModel):
    """Model for updating a lead - all fields optional."""
    name: Optional[str] = Field(None, min_length=2, max_length=100)
    email: Optional[EmailStr] = None
    company: Optional[str] = Field(None, max_length=100)
    job_title: Optional[str] = Field(None, max_length=100)
    budget: Optional[float] = Field(None, ge=0)
    timeline: Optional[Timeline] = None
    source: Optional[Source] = None

class LeadResponse(LeadBase):
    """Model for API response - includes computed fields."""

    id: int
    score: float = Field(..., description="Computed lead score (0-100)")
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True,
        json_schema_extra={
            "example": {
                "id": 1,
                "name": "John Doe",
                "email": "john@example.com",
                "company": "Acme Corp",
                "job_title": "CTO",
                "budget": 50000.0,
                "timeline": "3_months",
                "source": "linkedin",
                "score": 78.5,
                "created_at": "2026-08-06T15:30:00",
                "updated_at": "2026-08-06T15:30:00"
            }
        }
    )

class LeadScoreBreakdown(BaseModel):
    """Added detailed score breakdown."""

    total_score: float = Field(..., ge=0, le=100)
    budget_score: float
    timeline_score: float
    source_score: float
    job_title_score: float

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "total_score": 78.5,
                "budget_score": 25.0,
                "timeline_score": 30.0,
                "source_score": 15.0,
                "job_title_score": 8.5
            }
        }
    )