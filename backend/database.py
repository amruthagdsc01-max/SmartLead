"""
SmartLead Database Configuration

Supports:
- PostgreSQL for development/production
- SQLite for testing if needed
"""

from sqlalchemy import (
    create_engine,
    Column,
    Integer,
    String,
    Float,
    DateTime,
    UniqueConstraint,
    Index,
)
from sqlalchemy.orm import sessionmaker, Session, declarative_base

from datetime import datetime, timezone
from typing import Generator
import os

from dotenv import load_dotenv

load_dotenv()

# Load database URL from .env
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "sqlite:///./leads.db"
)

# SQLite requires check_same_thread=False.
# PostgreSQL does not.
if DATABASE_URL.startswith("sqlite"):
    engine = create_engine(
        DATABASE_URL,
        connect_args={"check_same_thread": False},
        pool_pre_ping=True,
        echo=False,
    )
else:
    engine = create_engine(
        DATABASE_URL,
        pool_pre_ping=True,
        echo=False,
    )


SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()


class Lead(Base):
    __tablename__ = "leads"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(
        String(100),
        nullable=False
    )

    email = Column(
        String(120),
        nullable=False,
        index=True
    )

    company = Column(
        String(100),
        nullable=True
    )

    job_title = Column(
        String(100),
        nullable=True
    )

    budget = Column(
        Float,
        nullable=True
    )

    timeline = Column(
        String(50),
        nullable=True
    )

    source = Column(
        String(50),
        nullable=True
    )

    score = Column(
        Float,
        default=0.0,
        nullable=False
    )

    created_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        nullable=False
    )

    updated_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False
    )

    __table_args__ = (
        UniqueConstraint(
            "email",
            name="uq_lead_email"
        ),
        Index(
            "idx_score_created",
            "score",
            "created_at"
        ),
    )


def init_db() -> None:
    """Initialize database tables."""
    Base.metadata.create_all(bind=engine)


def get_db() -> Generator[Session, None, None]:
    """Yield a database session and ensure proper cleanup."""

    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()