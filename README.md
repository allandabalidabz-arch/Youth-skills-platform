# YouthSkills Program

A web-based digital-skills learning platform developed for Evelyn Hone College. It enables youth learners to access structured courses, complete quizzes and assignments, track progress, earn verifiable certificates, and download PDF certificates after payment approval.

---

## Features

- **Registration with NRC** — Youth accounts require a valid Zambian NRC number (`123456/78/9`)
- **Course Library** — System Analysis & Design, Web Development, Operating Systems
- **Module Learning** — Structured content with quizzes (60% pass mark) and one final assignment per course
- **Progress Tracking** — Module-by-module progress bars on dashboard and course pages
- **Certificates** — Auto-issued on full course completion with public verification
- **Certificate Payment** — Learner submits mobile money proof; admin approves to unlock PDF download
- **Email Notifications** — Admin receives email when a learner submits payment proof
- **Admin Dashboard** — Overview, Registered Youth, Completions, Modules, Assignments grading, Payments approval
- **Dark Mode** — Full light/dark mode toggle
- **Notifications** — In-app bell notifications for key events

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS, React Router v6 |
| Backend | Node.js, Express 4 |
| Database | SQLite (sqlite + sqlite3) |
| Auth | JWT + bcryptjs |
| Email | Nodemailer (Gmail SMTP) |
| PDF | jsPDF |
| Icons | Lucide React |

---

## Quick Start

### 1. Backend
```powershell
cd youth-skills-platform\backend
npm install
npm run dev
```
API runs on `http://localhost:5000`

### 2. Frontend (new terminal)
```powershell
cd youth-skills-platform\frontend
npm install
npm run dev
```
App runs on `http://localhost:3000`

---

## Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@youthskills.com | Allan7034 |

> Youth accounts are created by registering on the platform. NRC is required.

---

## Admin Portal

```
http://localhost:3000/admin/login
```

---

## Payment Number

Learners send **2,000 ZMW** to mobile money number **0970 342 178** (Allan Dabali — YouthSkills Program), then submit the transaction reference for admin approval.

---

## Email Notifications Setup

To receive email alerts when a learner submits payment proof, add these to `backend/.env`:

```dotenv
GMAIL_USER=allandabalidabz@gmail.com
GMAIL_APP_PASSWORD=<your-16-char-gmail-app-password>
ADMIN_EMAIL=allandabalidabz@gmail.com
```

Generate a Gmail App Password: Google Account → Security → 2-Step Verification → App passwords.

---

## Courses

| Course | Category | Modules |
|--------|----------|---------|
| System Analysis and Design | Systems | 3 |
| Web Development | Coding | 3 |
| Operating Systems | Systems | 3 |

Each course has 1 quiz per module (60% pass mark) and 1 final assignment covering all modules.

---

## Certificate Verification

```
http://localhost:3000/verify/{CERTIFICATE_NUMBER}
```

---

## Documentation

Full documentation is in the `docs/` folder:

| File | Contents |
|------|---------|
| `YouthSkills-Program-Technical-Documentation.md` | Architecture, schema, API reference, deployment |
| `YouthSkills-Program-User-Manual.md` | Step-by-step guide for learners and admins |
| `YouthSkills-Program-Diagrams.md` | Mermaid system diagrams (architecture, ERD, flows) |
| `YouthSkills-Program-Academic-Documentation.md` | Full academic project report |
