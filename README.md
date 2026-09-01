# 🎯 SmartLead AI

### AI-Assisted Lead Management & Explainable Lead Scoring Platform

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react\&logoColor=black)](https://react.dev/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.111.0-009688?logo=fastapi\&logoColor=white)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3.12-3776AB?logo=python\&logoColor=white)](https://www.python.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-18-4169E1?logo=postgresql\&logoColor=white)](https://www.postgresql.org/)
[![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy-2.0-D71F00)](https://www.sqlalchemy.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite\&logoColor=white)](https://vite.dev/)
[![pytest](https://img.shields.io/badge/pytest-8.3-0A9EDC?logo=pytest\&logoColor=white)](https://pytest.org/)

SmartLead is a full-stack lead management platform that helps businesses **organize, evaluate, and prioritize sales leads**.

The application combines a **React frontend**, **FastAPI backend**, **SQLAlchemy ORM**, and **PostgreSQL database** with an explainable lead-scoring engine.

Instead of simply assigning a score to a lead, SmartLead provides a detailed breakdown explaining **why a lead received its score**.

---

## 📌 Table of Contents

* [Project Overview](#-project-overview)
* [Key Features](#-key-features)
* [How Lead Scoring Works](#-how-lead-scoring-works)
* [System Architecture](#-system-architecture)
* [Tech Stack](#-tech-stack)
* [Project Structure](#-project-structure)
* [Application Screenshots](#-application-screenshots)
* [API Endpoints](#-api-endpoints)
* [API Documentation](#-api-documentation)
* [Database Design](#-database-design)
* [Getting Started](#-getting-started)
* [Environment Variables](#-environment-variables)
* [Running the Application](#-running-the-application)
* [Testing](#-testing)
* [AI-Assisted Development](#-ai-assisted-development)
* [Engineering Improvements](#-engineering-improvements)
* [Deployment](#-deployment)
* [Future Improvements](#-future-improvements)
* [What I Learned](#-what-i-learned)
* [Author](#-author)

---

# 🚀 Project Overview

SmartLead provides a complete workflow for managing and prioritizing sales leads.

Users can:

* Create leads
* View individual leads
* View all leads
* Edit leads
* Delete leads
* Search leads
* Filter leads
* Sort leads
* Paginate lead results
* Automatically calculate lead scores
* View detailed score breakdowns
* Create multiple leads using batch operations
* Track lead sources
* Track budgets
* Track purchase timelines
* Track lead status through score-based prioritization
* View dashboard analytics
* Analyze score distribution
* Analyze lead sources
* Analyze lead timelines
* Identify high-performing leads

The application is designed as a complete **full-stack project**, rather than only a REST API.

---
## 📸 Application Screenshots

### 📊 Dashboard

The SmartLead dashboard provides an overview of the lead pipeline, including total leads, qualified leads, hot leads, lead value, and analytics.

![SmartLead Dashboard](screenshots/dashboard.png)

---

### 👥 All Leads

The All Leads page provides a card-based view of leads with search, filtering, sorting, scores, qualification status, source, timeline, and lead value.

![SmartLead All Leads](screenshots/leads.png)

---

### ➕ Create Lead

Users can create a new lead by entering key information such as name, email, company, job title, budget, timeline, and source.

![SmartLead Create Lead](screenshots/create-lead.png)

---

### 🧠 Explainable Score Breakdown

SmartLead provides a transparent breakdown showing how each factor contributes to the final lead score.

![SmartLead Score Breakdown](screenshots/score-breakdown.png)

---
# ✨ Key Features

## 👤 Lead Management

SmartLead provides complete CRUD functionality for sales leads.

### Create Lead

A lead can be created using information such as:

* Name
* Email
* Company
* Job title
* Budget
* Purchase timeline
* Lead source

When a lead is created:

1. FastAPI validates the request.
2. The scoring engine calculates the lead score.
3. The lead is stored in PostgreSQL.
4. The API returns the created lead.
5. The React frontend updates the interface.

---

## 📋 View Leads

The **All Leads** page displays leads in a card-based interface.

Each lead can display:

* Name
* Email
* Company
* Job title
* Lead score
* Qualification/status
* Budget
* Timeline
* Source
* Lead value

---

## 🔎 Search

The backend supports searching across:

* Name
* Email
* Company
* Job title

Example:

```text
GET /leads?search=google
```

Another example:

```text
GET /leads?search=cto&min_score=70
```

---

## 🎯 Filtering

Leads can be filtered by minimum score.

Example:

```text
GET /leads?min_score=70
```

Leads can also be filtered by source.

Example:

```text
GET /leads?source=referral
```

---

## ↕️ Sorting

Lead results can be sorted by:

* Score
* Created date
* Name

Ascending and descending ordering are supported.

Example:

```text
GET /leads?sort_by=score&sort_order=desc
```

---

## 📄 Pagination

The API supports pagination using:

* `skip`
* `limit`

Example:

```text
GET /leads?skip=0&limit=20
```

The maximum supported limit is 1000 records.

---

## ✏️ Edit Lead

Existing leads can be updated through the frontend edit interface.

Supported fields include:

* Name
* Email
* Company
* Job title
* Budget
* Timeline
* Source

After an update, the lead score is recalculated automatically.

---

## 🗑️ Delete Lead

Leads can be deleted directly from the application.

The backend returns:

```text
204 No Content
```

after successful deletion.

---

## 📦 Batch Lead Creation

SmartLead supports creating multiple leads in a single API request.

Endpoint:

```text
POST /leads/batch
```

Duplicate email addresses are skipped during batch creation.

---

# 🧠 How Lead Scoring Works

SmartLead uses a deterministic, explainable scoring engine.

Every lead receives a score between:

```text
0 - 100
```

The final score is calculated using four weighted factors:

| Factor    | Weight |
| --------- | -----: |
| Budget    |    30% |
| Timeline  |    35% |
| Source    |    20% |
| Job Title |    15% |

The weighted score is calculated as:

```text
Total Score =
    Budget Score × 0.30
  + Timeline Score × 0.35
  + Source Score × 0.20
  + Job Title Score × 0.15
```

The final score is rounded to two decimal places and constrained between 0 and 100.

---

## 💰 Budget Scoring

Budget scoring uses a logarithmic formula rather than a simple linear increase.

```text
score = 20 × log10(budget)
```

The result is capped between 0 and 100.

This provides diminishing returns for very large budgets.

For example, increasing a budget from $10,000 to $50,000 has a more meaningful effect than increasing an already large budget by the same absolute amount.

---

## ⏱️ Timeline Scoring

Purchase urgency is represented using predefined mappings:

| Timeline  | Score |
| --------- | ----: |
| Immediate |   100 |
| 3 Months  |    80 |
| 6 Months  |    50 |
| 1 Year    |    25 |
| Unknown   |    10 |

Earlier purchase timelines receive higher scores.

---

## 🌐 Source Scoring

Lead sources are assigned different quality levels:

| Source   | Score |
| -------- | ----: |
| Referral |   100 |
| LinkedIn |    85 |
| Event    |    75 |
| Website  |    60 |
| Email    |    50 |
| Other    |    30 |

This allows warmer acquisition channels to contribute more strongly to the final score.

---

## 💼 Job Title Scoring

Job titles are evaluated using keyword-based seniority matching.

Examples of high-seniority titles include:

* CEO
* CTO
* Founder
* Co-Founder
* VP
* Director
* Head

The scoring engine also recognizes seniority keywords such as:

* Senior
* Principal
* Staff
* Architect

Junior and entry-level keywords receive lower scores.

---

# 🔍 Explainable Score Breakdown

One of SmartLead's main features is score explainability.

The API provides the individual components contributing to the final score:

```json
{
  "total_score": 78.5,
  "budget_score": 93.98,
  "timeline_score": 80.0,
  "source_score": 85.0,
  "job_title_score": 100.0
}
```

This makes the scoring process transparent instead of treating the score as a black box.

Endpoint:

```text
GET /leads/{lead_id}/score-breakdown
```

---

# 🏗️ System Architecture

```text
┌────────────────────────────────────────────┐
│               React Frontend               │
│                                            │
│  Dashboard                                 │
│  Lead Management                            │
│  Lead Forms                                 │
│  Lead Cards                                 │
│  Score Breakdown                            │
│  Analytics & Charts                         │
└─────────────────────┬──────────────────────┘
                      │
                      │ REST API
                      ▼
┌────────────────────────────────────────────┐
│              FastAPI Backend               │
│                                            │
│  Request Validation                         │
│  Lead CRUD                                  │
│  Search                                     │
│  Filtering                                  │
│  Sorting                                    │
│  Pagination                                 │
│  Batch Operations                           │
│  Lead Scoring Engine                        │
│  Score Breakdown                            │
│  Health Check                               │
└─────────────────────┬──────────────────────┘
                      │
                      │ SQLAlchemy ORM
                      ▼
┌────────────────────────────────────────────┐
│                PostgreSQL                  │
│                                            │
│  Leads                                     │
│  Scores                                     │
│  Lead Attributes                            │
│  Timestamps                                 │
└────────────────────────────────────────────┘
```

---

# 🛠️ Tech Stack

| Technology        | Purpose                                 |
| ----------------- | --------------------------------------- |
| **React 18**      | Frontend UI                             |
| **JavaScript**    | Frontend application logic              |
| **Vite**          | Frontend development and build tool     |
| **React Router**  | Frontend routing                        |
| **Lucide React**  | UI icons                                |
| **Recharts**      | Dashboard charts                        |
| **FastAPI**       | Backend REST API                        |
| **Python 3.12**   | Backend programming language            |
| **Pydantic 2**    | Request validation and response schemas |
| **SQLAlchemy 2**  | ORM and database interaction            |
| **PostgreSQL**    | Production relational database          |
| **psycopg2**      | PostgreSQL database driver              |
| **pytest**        | Automated backend testing               |
| **httpx**         | API testing support                     |
| **python-dotenv** | Environment variable management         |
| **Git**           | Version control                         |
| **GitHub**        | Source code hosting                     |

---

# 📁 Project Structure

```text
SmartLead/
│
├── backend/
│   ├── main.py
│   ├── models.py
│   ├── database.py
│   ├── scoring.py
│   ├── requirements.txt
│   ├── pytest.ini
│   ├── .env
│   ├── .gitignore
│   │
│   └── tests/
│       ├── __init__.py
│       └── test_api.py
│
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── vite.config.js
│   │
│   └── src/
│       ├── App.jsx
│       ├── main.jsx
│       ├── index.css
│       │
│       ├── services/
│       │   └── api.js
│       │
│       └── components/
│           ├── Dashboard.jsx
│           ├── EditLead.jsx
│           ├── Header.jsx
│           ├── LeadCard.jsx
│           ├── LeadDetails.jsx
│           ├── LeadForm.jsx
│           ├── LeadList.jsx
│           └── ScoreBreakdown.jsx
│
├── screenshots/
│   ├── dashboard.png
│   ├── leads.png
│   ├── create-lead.png
│   └── score-breakdown.png
│
├── AI_CODE_REVIEW.md
├── BUILD_GUIDE.md
├── .gitignore
└── README.md
```

> The local virtual environment should not be committed to GitHub. The repository already includes ignore rules for `venv/` and `node_modules/`.

---

# 📸 Application Screenshots

## 📊 Dashboard

The dashboard provides an overview of the lead pipeline and analytics.

![SmartLead Dashboard](screenshots/dashboard.png)

---

## 👥 All Leads

The All Leads page provides lead cards with search, filtering, sorting, scores, qualification information, source, timeline, and budget/value information.

![SmartLead All Leads](screenshots/leads.png)

---

## ➕ Create Lead

Users can create a new lead by providing the required lead information.

![SmartLead Create Lead](screenshots/create-lead.png)

---

## 🧠 Explainable Score Breakdown

The score breakdown shows the individual factors contributing to the final score.

![SmartLead Score Breakdown](screenshots/score-breakdown.png)

---

# 🔌 API Endpoints

## Health

### Check API health

```http
GET /health
```

Example response:

```json
{
  "status": "healthy",
  "service": "SmartLead API",
  "version": "1.0.0",
  "database": "connected"
}
```

---

# Leads API

## Create Lead

```http
POST /leads
```

Example request:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "company": "Acme Corp",
  "job_title": "CTO",
  "budget": 50000,
  "timeline": "3_months",
  "source": "linkedin"
}
```

Returns:

```text
201 Created
```

---

## List Leads

```http
GET /leads
```

Optional parameters:

```text
skip
limit
search
min_score
source
sort_by
sort_order
```

Example:

```http
GET /leads?search=cto&min_score=70&sort_by=score&sort_order=desc
```

---

## Get Single Lead

```http
GET /leads/{lead_id}
```

---

## Update Lead

```http
PUT /leads/{lead_id}
```

Example:

```json
{
  "budget": 100000,
  "timeline": "immediate"
}
```

The score is recalculated after the update.

---

## Delete Lead

```http
DELETE /leads/{lead_id}
```

Successful deletion:

```text
204 No Content
```

---

## Get Score Breakdown

```http
GET /leads/{lead_id}/score-breakdown
```

---

## Batch Create Leads

```http
POST /leads/batch
```

Example:

```json
[
  {
    "name": "John Doe",
    "email": "john@example.com"
  },
  {
    "name": "Jane Smith",
    "email": "jane@example.com"
  }
]
```

Duplicate emails are skipped.

---

# 📚 API Documentation

FastAPI automatically provides interactive API documentation.

After starting the backend, open:

```text
http://localhost:8000/docs
```

Alternative documentation:

```text
http://localhost:8000/redoc
```

The Swagger UI can be used to test the API endpoints directly from the browser.

---

# 🗄️ Database Design

SmartLead uses PostgreSQL through SQLAlchemy.

The primary database table is:

```text
leads
```

Main fields include:

| Field        | Type     | Description           |
| ------------ | -------- | --------------------- |
| `id`         | Integer  | Primary key           |
| `name`       | String   | Lead name             |
| `email`      | String   | Unique lead email     |
| `company`    | String   | Company name          |
| `job_title`  | String   | Lead job title        |
| `budget`     | Float    | Estimated budget      |
| `timeline`   | String   | Purchase timeline     |
| `source`     | String   | Lead source           |
| `score`      | Float    | Calculated score      |
| `created_at` | DateTime | Creation timestamp    |
| `updated_at` | DateTime | Last update timestamp |

The database includes:

* Unique constraint on email
* Indexing on email
* Indexing on score/created timestamp
* Automatic timestamps
* SQLAlchemy connection pooling support

---

# 🔐 Data Validation

Pydantic models validate incoming API requests.

Validation includes:

* Name length
* Email format
* Budget must not be negative
* Budget business-rule validation
* Timeline enum validation
* Source enum validation
* Optional field handling

The API also prevents duplicate lead emails.

Duplicate creation returns:

```text
409 Conflict
```

---

# ⚙️ Getting Started

## Prerequisites

Install the following:

* Python 3.12+
* Node.js 20+
* PostgreSQL
* Git
* npm

---

## 1. Clone the Repository

```bash
git clone https://github.com/amruthagdsc01-max/SmartLead.git
cd SmartLead
```

---

# 🐍 Backend Setup

Navigate to the backend:

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate it on Windows CMD:

```cmd
venv\Scripts\activate.bat
```

Or on PowerShell:

```powershell
.\venv\Scripts\Activate.ps1
```

Install dependencies:

```bash
pip install -r requirements.txt
```

---

# 🗄️ PostgreSQL Setup

Create a PostgreSQL database:

```sql
CREATE DATABASE smartlead;
```

Then configure the database connection using an environment variable.

---

# 🔐 Environment Variables

Create:

```text
backend/.env
```

Example:

```env
DATABASE_URL=postgresql://USERNAME:PASSWORD@localhost:5432/smartlead
APP_ENV=development
```

Replace:

```text
USERNAME
PASSWORD
```

with your local PostgreSQL credentials.

### Important

Never commit `.env` to GitHub.

The project already includes `.env` in `.gitignore`.

For deployment, configure these variables through the hosting provider's environment-variable settings instead of uploading the `.env` file.

---

# ▶️ Running the Backend

From the `backend` directory:

```bash
uvicorn main:app --reload
```

The backend will be available at:

```text
http://127.0.0.1:8000
```

API documentation:

```text
http://127.0.0.1:8000/docs
```

Health check:

```text
http://127.0.0.1:8000/health
```

---

# ⚛️ Frontend Setup

Open another terminal.

Navigate to:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend runs on:

```text
http://localhost:5173
```

---

# 🔗 Frontend ↔ Backend Communication

During development, Vite proxies frontend API requests.

The frontend uses:

```text
/api
```

as its API base path.

For example:

```text
/api/leads
```

is proxied to:

```text
http://localhost:8000/leads
```

This configuration is defined in:

```text
frontend/vite.config.js
```

The frontend API service is located at:

```text
frontend/src/services/api.js
```

---

# 🧪 Testing

SmartLead includes a backend test suite using pytest.

Tests use an isolated in-memory SQLite database so that testing does not modify the PostgreSQL development database.

From the backend directory:

```bash
pytest
```

The test suite covers:

* Health check
* Lead creation
* Minimal lead creation
* Duplicate email handling
* Budget validation
* Lead filtering
* Lead searching
* Sorting
* Score breakdown
* Lead updates
* Score recalculation
* Batch lead creation
* Duplicate batch handling
* Lead deletion
* Not-found behavior

Run with verbose output:

```bash
pytest -v
```

---

# 🤖 AI-Assisted Development

SmartLead was developed using AI coding assistants as development tools, while maintaining human review and validation of the generated code.

Tools used during development include:

* GitHub Copilot
* Cursor IDE
* Claude Code

AI assistance was used for activities such as:

* Generating initial code
* Refactoring
* Exploring implementation approaches
* Generating test cases
* Improving validation
* Reviewing potential issues
* Improving documentation

However, generated code was **critically reviewed, tested, modified, and improved** rather than being accepted blindly.

---

# 🧠 Engineering Improvements

The project evolved from a basic AI-generated implementation into a more structured application through human review and iterative improvement.

Important improvements include:

### Database

* PostgreSQL support
* SQLAlchemy ORM
* Connection pooling
* Health-oriented database configuration
* Unique email constraint
* Database indexes
* Automatic timestamps

### API

* Structured FastAPI routes
* Pydantic validation
* HTTP status codes
* Duplicate handling
* Search
* Filtering
* Sorting
* Pagination
* Batch operations
* Health check
* Score breakdown endpoint

### Scoring

* Configurable scoring weights
* Logarithmic budget scoring
* Source quality mapping
* Timeline urgency mapping
* Job-title seniority detection
* Explainable scoring
* Batch scoring support

### Testing

* Isolated test database
* API integration tests
* Edge-case testing
* CRUD testing
* Scoring tests
* Duplicate handling tests
* Batch operation tests

---

# 🚀 Deployment

SmartLead is structured as a separate frontend and backend application.

A typical production architecture is:

```text
                    ┌─────────────────┐
                    │   React/Vite    │
                    │    Frontend     │
                    └────────┬────────┘
                             │
                             │ HTTPS / API
                             ▼
                    ┌─────────────────┐
                    │    FastAPI      │
                    │     Backend     │
                    └────────┬────────┘
                             │
                             │ SQLAlchemy
                             ▼
                    ┌─────────────────┐
                    │   PostgreSQL    │
                    │    Database     │
                    └─────────────────┘
```

## Production Environment Variables

The backend requires:

```env
DATABASE_URL=<production-postgresql-url>
APP_ENV=production
PORT=8000
```

The actual production database URL should be supplied by the deployment platform.

---

## Production CORS

The current development configuration allows:

```text
http://localhost:5173
```

Before production deployment, update the FastAPI CORS configuration so that it allows the deployed frontend domain.

For example:

```python
allow_origins=[
    "https://your-frontend-domain.com"
]
```

Do not leave production CORS restricted to localhost.

---

## Backend Deployment Requirements

The backend can be started using:

```bash
uvicorn main:app --host 0.0.0.0 --port $PORT
```

The application also reads the `PORT` environment variable when executed directly.

The deployment platform should provide:

* Python runtime
* Environment variables
* PostgreSQL database
* HTTPS
* Public backend URL

---

## Frontend Deployment Requirements

Build the React application:

```bash
npm run build
```

This generates the production build in:

```text
dist/
```

The generated frontend can then be deployed to a static hosting platform.

The production frontend must communicate with the deployed FastAPI backend rather than:

```text
localhost:8000
```

The Vite development proxy is intended for local development and is not a production backend.

---

# 🔒 Security Considerations

Before production deployment:

* Never commit `.env`
* Never expose database credentials
* Configure production CORS
* Use HTTPS
* Store secrets using deployment-platform environment variables
* Use a managed PostgreSQL database where appropriate
* Avoid committing local databases or backups
* Keep development-only configuration out of production

---

# 🔮 Future Improvements

Potential future improvements include:

* JWT authentication
* User accounts
* Role-based access control
* Multi-tenant organizations
* Advanced analytics
* Configurable scoring rules from the UI
* Lead activity history
* Follow-up reminders
* CRM integrations
* Email integrations
* AI-generated lead recommendations
* Machine-learning-based scoring
* Export to CSV
* Bulk editing
* Advanced dashboard filters
* Production logging and monitoring
* Database migrations with Alembic
* CI/CD pipeline

---

# 📚 What I Learned

Building SmartLead provided hands-on experience with:

### Backend Development

* Building REST APIs with FastAPI
* Dependency injection
* Pydantic validation
* HTTP status codes
* Error handling
* API documentation
* CRUD implementation

### Databases

* PostgreSQL
* SQLAlchemy ORM
* Database constraints
* Database indexes
* Connection management
* Environment-based database configuration

### Frontend Development

* React components
* React Router
* API integration
* State management
* Responsive UI design
* Dashboard development
* Data visualization with Recharts

### Testing

* pytest
* FastAPI TestClient
* Test database isolation
* Edge-case testing
* API integration testing

### Software Engineering

* Refactoring AI-generated code
* Reviewing generated implementations
* Identifying potential bugs
* Improving validation
* Designing maintainable code
* Separating development and production configuration
* Using Git and GitHub
* Preparing applications for deployment

---

# 🎯 Project Goals

SmartLead was built to demonstrate that AI coding assistants can accelerate software development while still requiring:

* Human reasoning
* Code review
* Testing
* Debugging
* Architecture decisions
* Security awareness
* Performance considerations
* Production-readiness checks

The project focuses not only on **building functionality**, but also on understanding and improving the generated implementation.

---

# 👩‍💻 Author

**Amrutha R N**

Final Year B.E. Student
Full Stack Developer

GitHub:

https://github.com/amruthagdsc01-max

---

# 📄 License

This project is licensed under the MIT License.
