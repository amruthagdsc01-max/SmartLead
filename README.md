# 🎯 SmartLead AI

### AI-Powered Lead Management & Explainable Lead Scoring Platform

SmartLead is a full-stack AI-assisted lead management platform designed to help businesses organize, evaluate, and prioritize sales leads.

The platform combines a **React frontend**, **FastAPI backend**, **SQLAlchemy ORM**, and **PostgreSQL database** with an explainable lead-scoring engine.

Instead of simply assigning a score to a lead, SmartLead shows **why the lead received that score** through a transparent score breakdown.

---

## 🚀 Project Overview

SmartLead provides a complete lead management workflow through a modern web dashboard.

Users can:

- Create leads
- View leads
- Edit leads
- Delete leads
- Automatically calculate lead scores
- View explainable score breakdowns
- Identify qualified leads
- Track lead status
- Track lead value
- Track lead sources
- Search leads
- Filter leads
- Sort leads
- View dashboard analytics
- View score distribution
- Analyze lead timelines
- Analyze lead sources
- Identify top-performing leads
- Manage leads through a responsive interface

The application is designed as a complete full-stack project rather than only a REST API.

---

# ✨ Key Features

## 👤 Lead Management

SmartLead provides complete CRUD functionality for sales leads.

### Create Lead

Users can create a new lead by entering:

- Name
- Email
- Company
- Job title
- Budget
- Timeline
- Lead source

After creation:

1. The backend validates the submitted data.
2. The scoring engine calculates the lead score.
3. The lead is stored in PostgreSQL.
4. The frontend updates the lead list.
5. A success message is displayed to the user.

---

### 📋 View Leads

The **All Leads** page displays leads using a clean card-based interface.

Each lead card provides important information such as:

- Lead name
- Email
- Company
- Job title
- Lead score
- Qualification/status
- Budget
- Timeline
- Lead source
- Lead value

---

### ✏️ Edit Lead

Users can edit existing leads through an edit modal.

Editable fields include:

- Name
- Email
- Company
- Job title
- Budget
- Timeline
- Source

When lead information changes, the backend recalculates the lead score automatically.

---

### 🗑️ Delete Lead

Users can delete leads directly from the lead card.

The frontend communicates with the FastAPI backend and updates the interface after successful deletion.

---

# 🧠 Explainable AI Lead Scoring

One of SmartLead's core features is its **explainable lead scoring system**.

Every lead receives a score between:

```text
0 - 100