# YouthSkills Platform

A web-based system empowering youth through digital skills training, progress tracking, and certificate issuance.

## Features

- **User Registration & Auth** — Youth registration with JWT authentication
- **Course Modules** — System Analysis & Design, Web Development, Operating Systems
- **Progress Tracking** — Module-by-module progress with visual progress bars
- **Quizzes** — Interactive quizzes with instant scoring and feedback (60% pass mark)
- **Assignments** — Submit and receive graded feedback on assignments
- **Certificates** — Auto-issued digital certificates on course completion with public verification
- **Notifications** — Real-time in-app notifications for key events
- **Dark Mode** — Full light/dark mode toggle with localStorage persistence
- **Admin Portal** — Separate admin login, user management, and module overview

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS, React Router v6 |
| Backend | Node.js, Express.js |
| Database | SQLite (via sqlite + sqlite3) |
| Auth | JWT + bcryptjs |
| Icons | Lucide React |
| PDF | jsPDF |

## Quick Start

### 1. Install Backend Dependencies
```bash
cd youth-skills-platform/backend
npm install
```

### 2. Start the Backend
```bash
npm run dev
# API runs on http://localhost:5000
# Database auto-seeds on first run
```

### 3. Install Frontend Dependencies (new terminal)
```bash
cd youth-skills-platform/frontend
npm install
```

### 4. Start the Frontend
```bash
npm run dev
# App runs on http://localhost:3000
```

## Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@youthskills.com | Allan7034 |
| Employer | dabzyouthskillsacademy@gmail.com | password123 |

> Youth accounts are created by registering on the platform.

## Admin Portal

Access the admin portal at:
```
http://localhost:3000/admin/login
```

## Courses

| Course | Category |
|--------|----------|
| System Analysis and Design | Systems |
| Web Development | Coding |
| Operating Systems | Systems |

Each course has 3 modules, quizzes (60% pass mark), and assignments.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user (youth only) |
| POST | /api/auth/login | Login |
| GET | /api/auth/me | Get current user |
| POST | /api/auth/forgot-password | Request password reset |
| POST | /api/auth/reset-password | Reset password with token |
| GET | /api/courses | List courses |
| GET | /api/courses/:id | Course details + modules |
| POST | /api/courses/:id/enroll | Enroll in course |
| POST | /api/progress/module/:id/complete | Mark module complete |
| POST | /api/progress/quiz/:id/submit | Submit quiz answers |
| GET | /api/certificates/my | My certificates |
| GET | /api/certificates/verify/:number | Verify certificate (public) |
| GET | /api/dashboard/youth | Youth dashboard stats |
| GET | /api/dashboard/admin | Admin dashboard stats |

## Certificate Verification

Certificates can be publicly verified at:
```
http://localhost:3000/verify/{CERTIFICATE_NUMBER}
```
