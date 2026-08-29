"""
Test Suite for SmartLead API
AI-Generated v1 had no tests. This is a comprehensive test suite.
"""
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from main import app
from database import Base, get_db
from models import LeadCreate, Timeline, Source

# IMPROVEMENT 1: Use in-memory SQLite for tests (AI used file-based)
# Use an in-memory SQLite database for tests.
# This keeps tests completely separate from the PostgreSQL development database.
TEST_DATABASE_URL = "sqlite://"

engine = create_engine(
    TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)

TestingSessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)

def override_get_db():
    """Override database dependency for testing."""
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

@pytest.fixture(scope="function")
def client():
    """Create test client with fresh database for each test."""
    Base.metadata.create_all(bind=engine)
    with TestClient(app) as c:
        yield c
    Base.metadata.drop_all(bind=engine)

# IMPROVEMENT 2: Health check test (AI didn't include)
def test_health_check(client):
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["service"] == "SmartLead API"

# IMPROVEMENT 3: Create lead tests with edge cases (AI only tested happy path)
def test_create_lead_success(client):
    lead_data = {
        "name": "John Doe",
        "email": "john@example.com",
        "company": "Acme Corp",
        "job_title": "CTO",
        "budget": 50000.0,
        "timeline": "3_months",
        "source": "referral"
    }
    response = client.post("/leads", json=lead_data)
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "John Doe"
    assert data["email"] == "john@example.com"
    assert 0 <= data["score"] <= 100
    assert "id" in data

def test_create_lead_duplicate_email(client):
    """Test that duplicate emails are rejected."""
    lead_data = {
        "name": "John Doe",
        "email": "john@example.com",
        "timeline": "immediate",
        "source": "website"
    }
    # First create
    response1 = client.post("/leads", json=lead_data)
    assert response1.status_code == 201

    # Second create should fail
    response2 = client.post("/leads", json=lead_data)
    assert response2.status_code == 409
    assert "already exists" in response2.json()["detail"]

def test_create_lead_minimal_data(client):
    """Test creating lead with only required fields."""
    lead_data = {
        "name": "Jane Smith",
        "email": "jane@example.com"
    }
    response = client.post("/leads", json=lead_data)
    assert response.status_code == 201
    data = response.json()
    assert data["score"] >= 0  # Should still calculate a score

def test_create_lead_invalid_budget(client):
    """Test budget validation - too high."""
    lead_data = {
        "name": "Rich Guy",
        "email": "rich@example.com",
        "budget": 999999999.0
    }
    response = client.post("/leads", json=lead_data)
    # Should either reject or cap the score
    assert response.status_code in [201, 422]

# IMPROVEMENT 4: List leads with filters (AI didn't test filtering)
def test_list_leads_with_filters(client):
    # Create multiple leads
    leads = [
        {"name": "Lead A", "email": "a@example.com", "budget": 100000, "timeline": "immediate", "source": "referral"},
        {"name": "Lead B", "email": "b@example.com", "budget": 5000, "timeline": "1_year", "source": "website"},
        {"name": "Lead C", "email": "c@example.com", "budget": 20000, "timeline": "3_months", "source": "linkedin"}
    ]
    for lead in leads:
        client.post("/leads", json=lead)

    # Test filter by min_score
    response = client.get("/leads?min_score=50")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1  # At least the high-budget referral should qualify

    # Test filter by source
    response = client.get("/leads?source=referral")
    assert response.status_code == 200
    data = response.json()
    assert all(l["source"] == "referral" for l in data)

    # Test sorting
    response = client.get("/leads?sort_by=score&sort_order=desc")
    assert response.status_code == 200
    data = response.json()
    if len(data) > 1:
        assert data[0]["score"] >= data[1]["score"]

# IMPROVEMENT 5: Score breakdown test (AI didn't test explainability)
def test_score_breakdown(client):
    lead_data = {
        "name": "Test Lead",
        "email": "test@example.com",
        "budget": 100000.0,
        "timeline": "immediate",
        "source": "referral",
        "job_title": "CEO"
    }
    create_response = client.post("/leads", json=lead_data)
    lead_id = create_response.json()["id"]

    response = client.get(f"/leads/{lead_id}/score-breakdown")
    assert response.status_code == 200
    data = response.json()
    assert "total_score" in data
    assert "budget_score" in data
    assert "timeline_score" in data
    assert "source_score" in data
    assert "job_title_score" in data
    assert data["total_score"] == pytest.approx(
        data["budget_score"] * 0.30 +
        data["timeline_score"] * 0.35 +
        data["source_score"] * 0.20 +
        data["job_title_score"] * 0.15,
        abs=0.1
    )

# IMPROVEMENT 6: Update lead test (AI didn't test updates)
def test_update_lead(client):
    # Create lead
    lead_data = {"name": "Original", "email": "update@example.com", "budget": 10000}
    create_response = client.post("/leads", json=lead_data)
    lead_id = create_response.json()["id"]
    original_score = create_response.json()["score"]

    # Update budget
    update_data = {"budget": 100000}
    response = client.put(f"/leads/{lead_id}", json=update_data)
    assert response.status_code == 200
    data = response.json()
    assert data["budget"] == 100000
    assert data["score"] > original_score  # Score should increase with higher budget

# IMPROVEMENT 7: Batch create test (AI didn't test batch operations)
def test_batch_create(client):
    leads = [
        {"name": "Batch 1", "email": "batch1@example.com"},
        {"name": "Batch 2", "email": "batch2@example.com"},
        {"name": "Batch 3", "email": "batch3@example.com"}
    ]
    response = client.post("/leads/batch", json=leads)
    assert response.status_code == 201
    data = response.json()
    assert len(data) == 3

    # Test duplicate handling in batch
    response2 = client.post("/leads/batch", json=leads)
    assert response2.status_code == 201
    data2 = response2.json()
    assert len(data2) == 0  # All duplicates should be skipped

def test_delete_lead(client):
    lead_data = {"name": "To Delete", "email": "delete@example.com"}
    create_response = client.post("/leads", json=lead_data)
    lead_id = create_response.json()["id"]

    response = client.delete(f"/leads/{lead_id}")
    assert response.status_code == 204

    # Verify deletion
    get_response = client.get(f"/leads/{lead_id}")
    assert get_response.status_code == 404
