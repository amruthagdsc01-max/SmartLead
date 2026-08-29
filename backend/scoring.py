"""
Lead Scoring Engine for SmartLead
AI-Generated v1 used simple if-else with hardcoded weights.
Improved v2 uses configurable weights, better heuristics, and explainability.
"""
from typing import Dict, Tuple
from models import LeadCreate, LeadScoreBreakdown, Timeline, Source

# IMPROVEMENT 1: Configurable weights (AI hardcoded them)
# These can be loaded from config file or environment variables
SCORING_WEIGHTS = {
    "budget": 0.30,      # 30% - higher budget = higher score
    "timeline": 0.35,    # 35% - sooner timeline = higher score
    "source": 0.20,      # 20% - better source = higher score
    "job_title": 0.15,   # 15% - senior title = higher score
}

# IMPROVEMENT 2: Source quality mapping (AI used simple string matching)
SOURCE_QUALITY = {
    Source.REFERRAL: 1.0,      # Best: warm introduction
    Source.LINKEDIN: 0.85,     # Good: professional network
    Source.EVENT: 0.75,        # Good: met in person
    Source.WEBSITE: 0.60,      # Okay: organic interest
    Source.EMAIL: 0.50,        # Okay: outbound
    Source.OTHER: 0.30,        # Weak: unknown
}

# IMPROVEMENT 3: Timeline urgency mapping (AI didn't weight urgency properly)
TIMELINE_URGENCY = {
    Timeline.IMMEDIATE: 1.0,      # Hot lead
    Timeline.THREE_MONTHS: 0.80,  # Warm lead
    Timeline.SIX_MONTHS: 0.50,    # Cool lead
    Timeline.ONE_YEAR: 0.25,      # Cold lead
    Timeline.UNKNOWN: 0.10,       # No timeline = low score
}

# IMPROVEMENT 4: Job title seniority mapping (AI ignored this)
TITLE_SENIORITY = {
    "cto": 1.0, "ceo": 1.0, "founder": 1.0, "co-founder": 1.0,
    "vp": 0.90, "vice president": 0.90,
    "director": 0.80, "head": 0.80,
    "manager": 0.60, "lead": 0.60,
    "engineer": 0.40, "developer": 0.40, "analyst": 0.30,
}

def _score_budget(budget: float) -> float:
    """
    IMPROVEMENT 5: Logarithmic scoring instead of linear (AI used linear).
    Budget scoring uses diminishing returns - $10k to $50k is big, $500k to $550k is less significant.
    """
    if budget is None or budget <= 0:
        return 0.0

    # Log scale: score = min(100, 20 * log10(budget))
    import math
    score = 20 * math.log10(budget)
    return min(100.0, max(0.0, score))

def _score_timeline(timeline: Timeline) -> float:
    """Score based on purchase timeline urgency."""
    return TIMELINE_URGENCY.get(timeline, 0.1) * 100

def _score_source(source: Source) -> float:
    """Score based on lead source quality."""
    return SOURCE_QUALITY.get(source, 0.3) * 100

def _score_job_title(job_title: str) -> float:
    """
    IMPROVEMENT 6: Fuzzy matching for job titles (AI used exact match).
    Uses keyword extraction from title string.
    """
    if not job_title:
        return 30.0  # Default for unknown titles

    title_lower = job_title.lower()

    # Check for exact matches first
    for key, value in TITLE_SENIORITY.items():
        if key in title_lower:
            return value * 100

    # Fallback: check for seniority keywords
    if any(word in title_lower for word in ["senior", "sr.", "principal", "staff", "architect"]):
        return 70.0
    if any(word in title_lower for word in ["junior", "jr.", "intern", "associate", "entry"]):
        return 25.0

    return 40.0  # Default mid-level

def calculate_lead_score(lead: LeadCreate) -> Tuple[float, LeadScoreBreakdown]:
    """
    Calculate overall lead score and return detailed breakdown.

    Returns:
        total_score: Float between 0-100
        breakdown: LeadScoreBreakdown with component scores
    """
    # Calculate individual component scores
    budget_score = _score_budget(lead.budget)
    timeline_score = _score_timeline(lead.timeline)
    source_score = _score_source(lead.source)
    job_title_score = _score_job_title(lead.job_title)

    # Weighted total
    total_score = (
        budget_score * SCORING_WEIGHTS["budget"] +
        timeline_score * SCORING_WEIGHTS["timeline"] +
        source_score * SCORING_WEIGHTS["source"] +
        job_title_score * SCORING_WEIGHTS["job_title"]
    )

    # Round to 2 decimal places
    total_score = round(min(100.0, max(0.0, total_score)), 2)

    breakdown = LeadScoreBreakdown(
        total_score=total_score,
        budget_score=round(budget_score, 2),
        timeline_score=round(timeline_score, 2),
        source_score=round(source_score, 2),
        job_title_score=round(job_title_score, 2)
    )

    return total_score, breakdown

# IMPROVEMENT 7: Batch scoring for performance (AI only did single lead)
def batch_calculate_scores(leads: list) -> list:
    """Calculate scores for multiple leads efficiently."""
    return [calculate_lead_score(lead) for lead in leads]
