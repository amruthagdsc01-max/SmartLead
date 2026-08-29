# 🚀 Step-by-Step Build Guide

> **Follow this guide to build SmartLead from scratch using AI coding assistants**

---

## Step 0: Prerequisites (5 minutes)

1. **Install Python 3.10+**
   ```bash
   python --version  # Should show 3.10 or higher
   ```

2. **Install VS Code** (if not already installed)
   - Download from: https://code.visualstudio.com/

3. **Claim GitHub Student Pack** (FREE)
   - Go to: https://github.com/education
   - Verify your student status with your college email
   - Activate **GitHub Copilot** from the pack

4. **Install Cursor IDE** (FREE tier)
   - Download from: https://cursor.com
   - Sign in with GitHub

---

## Step 1: Project Setup (10 minutes)

```bash
# Create project folder
mkdir smartlead
cd smartlead

# Create virtual environment
python -m venv venv

# Activate it
# On Mac/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Create requirements.txt
cat > requirements.txt << 'EOF'
fastapi==0.111.0
uvicorn==0.30.0
sqlalchemy==2.0.31
pydantic==2.8.2
pytest==8.3.2
httpx==0.27.0
EOF

# Install dependencies
pip install -r requirements.txt

# Create folder structure
mkdir tests
touch tests/__init__.py
```

---

## Step 2: Generate database.py with Cursor (10 minutes)

**Open Cursor IDE.** Create a new file `database.py`.

**Prompt in Cursor Chat (Ctrl+L):**
```
Create a SQLAlchemy database setup for a FastAPI lead scoring app.
Requirements:
- SQLite database
- Lead table with: id, name, email, company, job_title, budget, timeline, source, score, created_at
- Use declarative_base
- Include sessionmaker
```

**Cursor will generate code. Copy it, then REVIEW it against these checks:**
- [ ] Does it have `pool_pre_ping=True`? (If not, add it)
- [ ] Are critical fields marked `nullable=False`? (If not, add them)
- [ ] Is there a unique constraint on email? (If not, add it)
- [ ] Is there an index on score? (If not, add it)
- [ ] Does it use a context manager for sessions? (If not, add `get_db()`)

**Apply the improvements from AI_CODE_REVIEW.md Section 1.**

---

## Step 3: Generate models.py with Copilot (10 minutes)

**Open `models.py` in VS Code with Copilot enabled.**

**Type this comment and let Copilot suggest the rest:**
```python
# Create Pydantic v2 models for lead CRUD operations
# LeadCreate, LeadUpdate, LeadResponse with validation
```

**Press Tab to accept suggestions, then REVIEW:**
- [ ] Are string fields using `Field(..., max_length=100)`? (If not, add constraints)
- [ ] Is email using `EmailStr`? (If not, import and use it)
- [ ] Are timeline and source using Enums? (If not, create them)
- [ ] Is there a custom validator for budget? (If not, add one)
- [ ] Does LeadResponse include score breakdown? (If not, add it)

**Apply the improvements from AI_CODE_REVIEW.md Section 2.**

---

## Step 4: Generate scoring.py with Cursor (15 minutes)

**Create `scoring.py` in Cursor.**

**Prompt:**
```
Write a lead scoring algorithm in Python.
Factors:
- Budget (30% weight): higher is better, but use diminishing returns
- Timeline (35% weight): immediate=best, 1_year=worst
- Source (20% weight): referral=best, cold email=worst
- Job Title (15% weight): C-level=best, junior=worst
Return both total score and breakdown.
```

**Cursor generates code. REVIEW:**
- [ ] Are weights configurable (dictionary)? (If hardcoded, refactor)
- [ ] Is budget using logarithmic scaling? (If linear, change it)
- [ ] Does it handle fuzzy job title matching? (If exact only, improve)
- [ ] Does it return a breakdown object? (If not, add it)
- [ ] Are there type hints and docstrings? (If not, add them)

**Apply the improvements from AI_CODE_REVIEW.md Section 3.**

---

## Step 5: Generate main.py with Copilot + Cursor (20 minutes)

**This is the biggest file. Use both tools:**

**In Cursor, prompt:**
```
Create a FastAPI app with these endpoints:
- POST /leads (create lead, auto-calculate score)
- GET /leads (list all with pagination)
- GET /leads/{id} (get one lead)
- PUT /leads/{id} (update lead)
- DELETE /leads/{id} (delete lead)
Use the database.py and models.py I already have.
```

**Cursor generates ~70% of the code. Now REVIEW and fix:**
- [ ] Is there a `/health` endpoint? (If not, add it)
- [ ] Is CORS middleware configured? (If not, add it)
- [ ] Does POST check for duplicate emails? (If not, add 409 error)
- [ ] Are proper HTTP status codes used (201, 204, 404, 409)? (If not, fix)
- [ ] Does PUT recalculate the score? (If not, add it)
- [ ] Is there a `/score-breakdown` endpoint? (If not, add it)
- [ ] Is there a batch create endpoint? (If not, add it)

**Apply the improvements from AI_CODE_REVIEW.md Section 4.**

---

## Step 6: Generate Tests with Claude Code (15 minutes)

**Open terminal in project folder.**

**Run Claude Code:**
```bash
claude
```

**Prompt:**
```
Write comprehensive pytest tests for a FastAPI lead scoring API.
The app has endpoints: POST /leads, GET /leads, GET /leads/{id}, PUT /leads/{id}, DELETE /leads/{id}, GET /leads/{id}/score-breakdown, POST /leads/batch
Use TestClient and an in-memory SQLite database.
Include tests for: happy path, duplicates, filters, sorting, edge cases.
```

**Claude generates tests. REVIEW:**
- [ ] Does it use a fresh DB per test? (If not, add fixture)
- [ ] Are there 10+ test cases? (If fewer, add more)
- [ ] Does it test the score breakdown endpoint? (If not, add it)
- [ ] Does it test batch operations? (If not, add it)
- [ ] Does it test duplicate handling? (If not, add it)

**Apply the improvements from AI_CODE_REVIEW.md Section 5.**

---

## Step 7: Run & Verify (10 minutes)

```bash
# Run the app
uvicorn main:app --reload

# Open browser to:
# http://localhost:8000/docs  (Interactive API docs)
# http://localhost:8000/redoc (Alternative docs)

# Test with curl
curl -X POST "http://localhost:8000/leads" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Lead",
    "email": "test@example.com",
    "company": "TestCorp",
    "job_title": "CTO",
    "budget": 75000,
    "timeline": "3_months",
    "source": "referral"
  }'

# Run tests
pytest tests/ -v
```

**Expected output:** All 12 tests should pass ✅

---

## Step 8: Write AI_CODE_REVIEW.md (20 minutes)

**This is THE MOST IMPORTANT STEP for your Salesforce application.**

1. Open `AI_CODE_REVIEW.md`
2. Document EVERY improvement you made to AI-generated code
3. Use the template from the provided file
4. Include:
   - Which AI tools you used
   - What prompts you gave
   - What the AI generated (v1)
   - What was wrong with it
   - How you fixed it (v2)
   - Metrics (lines of code, test cases, issues fixed)

**This document proves you can "critically review code generated by LLM coding assistants."**

---

## Step 9: Push to GitHub (5 minutes)

```bash
# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "feat: SmartLead API with AI-assisted development and human review"

# Create repo on GitHub (via web or gh CLI)
# Push
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/smartlead.git
git push -u origin main
```

---

## 🎉 Done!

You now have:
- ✅ A production-ready FastAPI project
- ✅ 12 passing tests
- ✅ AI-assisted development proven
- ✅ Critical review skills documented
- ✅ A GitHub repo to showcase

**Time invested:** ~2 hours  
**Value for Salesforce application:** **IMMENSE** — this directly addresses their #1 new requirement.

---

## 📝 Tips for Using AI Tools Effectively

### GitHub Copilot Tips
- **Write comments first**, then let Copilot fill the code
- **Accept suggestions with Tab**, but always read before committing
- **Use `Ctrl+Enter`** to see multiple alternative suggestions
- **Copilot Chat** (sidebar) is better for explaining code than generating it

### Cursor Tips
- **Use `Ctrl+K`** for inline code generation (best for small functions)
- **Use `Ctrl+L`** for chat-based generation (best for full files)
- **Always review the diff** before accepting changes
- **Use `@` mentions** to reference other files in your project

### Claude Code Tips
- **Be specific in prompts** — mention frameworks, patterns, constraints
- **Ask for explanations** — "Why did you choose this approach?"
- **Request alternatives** — "Show me 2 other ways to do this"
- **Use it for refactoring** — it's better at improving existing code than generating from scratch

### General Rule
> **Never accept AI code blindly. Always ask: "Is this secure? Is this scalable? Is this fair? Is this tested?"**
