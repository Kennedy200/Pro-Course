# ProCourse — Adaptive Learning Management System

An intelligent, full-stack Learning Management System that adapts content difficulty to each student's performance using machine learning.

Built with **Next.js**, **FastAPI**, and a **Random Forest ML model** that predicts student learning states in real time.

---

## Screenshots

> Student Dashboard · Module Viewer · Lecturer Analytics · Admin Panel

---

## Features

### 🎓 Student Experience
- Enroll in courses and progress through sequential modules
- Adaptive 3-tier content (Foundational → Intermediate → Advanced) based on quiz performance
- Take quizzes with real-time AI-powered feedback and answer review
- Track progress, scores, and learning states across all courses
- Personal dashboard with AI learning recommendations

### 📊 Lecturer Dashboard
- Live student analytics — no seed data, only real registered students
- Per-student progress tracking with learning state classification
- Per-course module performance breakdown
- At-risk student identification based on score and learning state

### 🛡️ Admin Panel
- System-wide overview of all students, courses, and performance
- User management with search and filter
- Platform health monitoring

### 🤖 AI/ML Engine
- Random Forest classifier trained on engagement features
- Predicts one of three learning states: **Proficient**, **Needs Practice**, **Struggling**
- Features: time spent, access count, quiz score, engagement score, avg time per access
- Automatically serves appropriate content tier based on prediction

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, TypeScript, Tailwind-free custom CSS |
| Backend | FastAPI, Python, SQLAlchemy |
| Database | SQLite (via Turso-compatible Drizzle-style ORM) |
| ML Model | scikit-learn Random Forest Classifier |
| Auth | JWT (JSON Web Tokens) with role-based access |
| Deployment | Vercel (frontend), Uvicorn (backend) |

---

## Project Structure
procourse-lms/
├── backend/
│   ├── routers/          # API route handlers
│   │   ├── auth.py
│   │   ├── courses.py
│   │   ├── modules.py
│   │   ├── quizzes.py
│   │   ├── progress.py
│   │   ├── analytics.py
│   │   └── ai.py
│   ├── seed/             # Database seeding scripts
│   │   ├── seed.py
│   │   ├── patch_os_se.py
│   │   ├── seed_questions.py
│   │   └── seed_content.py
│   ├── ml/               # Machine learning model
│   │   ├── train.py
│   │   └── training_data.json
│   ├── models.py         # SQLAlchemy models
│   ├── database.py       # DB connection
│   ├── schemas.py        # Pydantic schemas
│   └── main.py           # FastAPI app entry point
└── frontend/
└── src/
├── app/
│   ├── (student)/student/
│   │   ├── dashboard/
│   │   ├── courses/
│   │   ├── modules/
│   │   ├── progress/
│   │   └── achievements/
│   ├── (lecturer)/lecturer/
│   │   ├── dashboard/
│   │   ├── courses/
│   │   └── students/
│   └── (admin)/admin/
│       └── dashboard/
├── context/
│   └── AuthContext.tsx
└── lib/
├── api.ts
└── auth.ts

---

## Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+
- npm or yarn

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/procourse-lms.git
cd procourse-lms
```

### 2. Backend Setup

```bash
cd backend

# Create and activate virtual environment
python -m venv venv
source venv/Scripts/activate      # Windows
# source venv/bin/activate        # Mac/Linux

# Install dependencies
pip install -r requirements.txt

# Seed the database
python seed/seed.py
python seed/patch_os_se.py
python seed/seed_questions.py
python seed/seed_content.py

# Train the ML model
python ml/train.py

# Start the backend server
uvicorn main:app --reload --port 8000
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

### 4. Access the App

| URL | Description |
|-----|-------------|
| `http://localhost:3000` | Frontend |
| `http://localhost:8000` | Backend API |
| `http://localhost:8000/docs` | API Documentation (Swagger) |

---

## Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@demo.com | demo1234 |
| Lecturer | lecturer@demo.com | demo1234 |
| Student | Register via `/register` | — |

> Students are created by registering through the frontend. The lecturer dashboard shows only real registered students — no fake seed data.

---

## How the Adaptive System Works
Student takes quiz
↓
Backend grades answers → calculates percentage
↓
ML model receives features:
• time_spent
• access_count
• quiz_score
• engagement_score
• avg_time_per_access
↓
Random Forest predicts learning state:
• Proficient     → serve Advanced content
• Needs Practice → serve Intermediate content
• Struggling     → serve Foundational content
↓
Next module content adapts automatically

---

## Course Content

| Course | Code | Modules | Questions |
|--------|------|---------|-----------|
| Data Structures & Algorithms | CSC 301 | 8 | 40 |
| Computer Networks | CSC 312 | 7 | 35 |
| Operating Systems | CSC 320 | 9 | 45 |
| Software Engineering | CSC 340 | 6 | 30 |
| **Total** | | **30** | **150** |

Each module has **3 content tiers** × **5 quiz questions** = **90 content sections** total.

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login and get JWT |
| GET | `/api/courses/enrolled` | Get enrolled courses |
| GET | `/api/modules/{id}` | Get module content |
| POST | `/api/quizzes/{id}/submit` | Submit quiz answers |
| GET | `/api/progress/student` | Get student progress |
| GET | `/api/analytics/overview` | Lecturer analytics |
| POST | `/api/ai/predict` | ML learning state prediction |

Full API documentation available at `http://localhost:8000/docs`

---

## Built By

**Benjamin Effiong (Forkhive)**
CEO & Developer — ForkHive Limited

---

## License

MIT License — feel free to use this project for learning and inspiration.# Pro-Course
