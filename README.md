# YouthSkills Platform

A web-based system empowering youth through digital skills training, progress tracking, and employer connections.

## Features

- **User Registration & Auth** — Youth, Employer, and Admin roles with JWT authentication
- **Course Modules** — Coding, Graphic Design, Entrepreneurship, Marketing, Data Analysis
- **Progress Tracking** — Module-by-module progress with visual progress bars
- **Quizzes** — Interactive quizzes with instant scoring and feedback
- **Certificates** — Auto-issued digital certificates on course completion with public verification
- **Notifications** — Real-time in-app notifications for key events

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS, React Router v6 |
| Backend | Node.js, Express.js |
| Database | SQLite (via better-sqlite3) |
| Auth | JWT + bcryptjs |
| Icons | Lucide React |

## Quick Start

### 1. Install Backend Dependencies
```bash
cd youth-skills-platform/backend
npm install
```

### 2. Seed the Database
```bash
npm run seed
```

### 3. Start the Backend
```bash
npm run dev
# API runs on http://localhost:5000
```

### 4. Install Frontend Dependencies (new terminal)
```bash
cd youth-skills-platform/frontend
npm install
```

### 5. Start the Frontend
```bash
npm run dev
# App runs on http://localhost:3000
```

## Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Youth | amara@example.com | password123 |
| Youth | kwame@example.com | password123 |
| Employer | hr@techafrica.com | password123 |
| Employer | jobs@creativehub.com | password123 |
| Admin | admin@youthskills.com | password123 |

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login |
| GET | /api/auth/me | Get current user |
| GET | /api/courses | List courses |
| GET | /api/courses/:id | Course details + modules |
| POST | /api/courses/:id/enroll | Enroll in course |
| POST | /api/progress/module/:id/complete | Mark module complete |
| POST | /api/progress/quiz/:id/submit | Submit quiz answers |
| GET | /api/certificates/my | My certificates |
| GET | /api/certificates/verify/:number | Verify certificate (public) |
| GET | /api/dashboard/youth | Youth dashboard stats |
| GET | /api/dashboard/employer | Employer dashboard stats |

## Certificate Verification

Certificates can be publicly verified at:
```
http://localhost:3000/verify/{CERTIFICATE_NUMBER}
```
