# YOUTHSKILLS PROGRAM
## TECHNICAL DOCUMENTATION

**Institution:** Evelyn Hone College  
**System type:** Web-based digital-skills learning platform  
**Document version:** 2.0 — reflects the fully implemented and tested system.

> Do not copy real values from `.env` files, expose admin credentials or publish a database containing real user data. Environment values shown below are placeholders only.

---

## 1. Project Overview

YouthSkills Program is a React single-page application backed by a Node.js/Express REST API and a SQLite database. It delivers structured digital-skills training to youth learners through three courses — System Analysis and Design, Web Development, and Operating Systems — each containing three modules, one quiz per module, and one comprehensive final assignment per course.

The platform supports full learner workflows: registration (with NRC validation), authentication, course browsing, enrolment, module study, quiz submission, assignment submission, progress tracking, certificate issuance, certificate payment proof submission, and certificate PDF download. Administrators have a dedicated portal with five management tabs: Overview, Registered Youth, Completions, Modules, Assignments (grading), and Payments (approval). Email notifications are sent to the administrator when a learner submits payment proof.

The system does not provide job listings, recruitment, employer, mentorship or trainer workflows.

---

## 2. Technology Stack

| Component | Technology |
|---|---|
| Frontend | React 18, JSX, Vite 5, React Router v6, Tailwind CSS 3 |
| HTTP client | Axios |
| Icons | Lucide React |
| Notifications | react-hot-toast |
| PDF generation | jsPDF |
| Backend | Node.js, Express 4 |
| Database | SQLite via `sqlite` and `sqlite3` packages |
| Authentication | JWT (`jsonwebtoken`), bcryptjs (cost factor 12) |
| Email | Nodemailer (Gmail SMTP) |
| Other backend | cors, dotenv, uuid |
| Build tools | npm, Vite, PostCSS, Autoprefixer |

---

## 3. Folder Structure

```text
youth-skills-platform/
├── README.md
├── backend/
│   ├── package.json
│   ├── .env                        # Local only — never commit real values
│   ├── database.sqlite             # SQLite database file
│   └── src/
│       ├── server.js               # Express app entry point
│       ├── database.js             # Schema + auto-migration
│       ├── middleware/
│       │   └── auth.js             # JWT verify + role check
│       ├── routes/
│       │   ├── auth.js             # Register, login, password reset
│       │   ├── users.js            # Profile read/update, admin user list
│       │   ├── courses.js          # Course CRUD, enrolment
│       │   ├── progress.js         # Module completion, quiz submission
│       │   ├── assignments.js      # Assignment read, submit, grade
│       │   ├── certificates.js     # Certificate list, public verify
│       │   ├── payments.js         # Payment proof submit, approve, reject
│       │   ├── notifications.js    # Notification list, mark read
│       │   └── dashboard.js        # Youth + admin dashboard stats
│       └── utils/
│           └── seed.js             # Database seed (destructive)
├── frontend/
│   ├── package.json
│   ├── vite.config.js              # Port 3000, /api proxy to 5000
│   ├── index.html
│   └── src/
│       ├── main.jsx
│       ├── App.jsx                 # Route definitions
│       ├── index.css               # Tailwind + component classes
│       ├── context/
│       │   └── AuthContext.jsx     # Auth state, login, register, logout
│       ├── utils/
│       │   └── api.js              # Axios instance, token interceptors
│       ├── components/
│       │   ├── Layout.jsx          # Sidebar, topbar, notifications
│       │   └── Logo.jsx
│       └── pages/
│           ├── LandingPage.jsx
│           ├── LoginPage.jsx
│           ├── RegisterPage.jsx
│           ├── AdminLoginPage.jsx
│           ├── DashboardPage.jsx   # Youth + admin dashboard
│           ├── CoursesPage.jsx
│           ├── CourseDetailPage.jsx
│           ├── CertificatesPage.jsx
│           ├── ProfilePage.jsx
│           ├── VerifyCertPage.jsx
│           ├── ForgotPasswordPage.jsx
│           ├── ResetPasswordPage.jsx
│           └── NotFoundPage.jsx
└── docs/
    ├── YouthSkills-Program-Technical-Documentation.md
    ├── YouthSkills-Program-Academic-Documentation.md
    ├── YouthSkills-Program-User-Manual.md
    └── YouthSkills-Program-Diagrams.md
```

---

## 4. Application Architecture

1. `frontend/src/main.jsx` mounts React with `BrowserRouter` and the toast provider.
2. `App.jsx` defines public, protected, and admin-only routes with role-gated wrappers.
3. `AuthContext.jsx` manages sign-in, registration, token storage (localStorage for Remember Me, sessionStorage otherwise), and token validation on load.
4. `api.js` sets the Axios base URL to `/api` (proxied to port 5000 in development), attaches the Bearer token, and redirects to `/login` on 401.
5. `server.js` configures Express with CORS, JSON parsing (10 MB limit), static uploads, all route groups, a health endpoint, and a final error handler.
6. Route handlers call `getDb()`, validate inputs, apply middleware, and return JSON.
7. `database.js` opens the SQLite file, enables WAL journal mode and foreign keys, creates all tables via `CREATE TABLE IF NOT EXISTS`, and runs auto-migrations (e.g. adding the `nrc` column to existing databases).

---

## 5. Database Schema

The schema is initialised in `backend/src/database.js`. Auto-migration adds columns to existing tables without requiring a fresh seed.

### Tables

| Table | Purpose |
|---|---|
| `users` | Accounts with role, NRC, profile fields, hashed password |
| `courses` | Course metadata and instructor display fields |
| `modules` | Learning units belonging to a course |
| `quizzes` | Multiple-choice quiz questions per module |
| `enrollments` | User/course membership and completion timestamp |
| `module_progress` | Per-module completion flag, quiz score, timestamp |
| `assignments` | Text-based task per course (one per course, linked to last module) |
| `assignment_submissions` | Learner text response, grade, feedback, status |
| `certificates` | Issued on full course completion; unique certificate number |
| `certificate_payments` | Manual payment proof; status pending/approved/rejected |
| `notifications` | Per-user in-app messages |
| `password_resets` | Token-based reset records with expiry |

### Key fields — users table

| Field | Type | Notes |
|---|---|---|
| `id` | TEXT PK | UUID |
| `name` | TEXT | Required; letters only |
| `email` | TEXT UNIQUE | Required; lowercase stored |
| `password` | TEXT | bcryptjs hash; never returned to client |
| `role` | TEXT | `youth` or `admin` |
| `nrc` | TEXT | Zambian NRC; format `123456/78/9`; required for youth; unique |
| `location`, `phone`, `bio`, `avatar` | TEXT | Optional profile fields |
| `skills` | TEXT | JSON array |

### Foreign-key relationships

- `modules.course_id` → `courses.id` (CASCADE DELETE)
- `quizzes.module_id` → `modules.id` (CASCADE DELETE)
- `enrollments.user_id` → `users.id`, `enrollments.course_id` → `courses.id`
- `module_progress.user_id` → `users.id`, `module_progress.module_id` → `modules.id`
- `certificates.user_id` → `users.id`, `certificates.course_id` → `courses.id`
- `assignment_submissions.assignment_id` → `assignments.id`, `.user_id` → `users.id`
- `certificate_payments.user_id` → `users.id`, `.certificate_id` → `certificates.id`
- `notifications.user_id` → `users.id`
- `password_resets.user_id` → `users.id`

---

## 6. API Endpoints

Base URL (local development): `http://localhost:5000`. The Vite proxy forwards `/api` to this base during frontend development.

### Authentication

| Method | Path | Access | Purpose |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Create youth account; requires name, email, NRC, password |
| POST | `/api/auth/login` | Public | Verify credentials; return JWT |
| GET | `/api/auth/me` | Authenticated | Return current user |
| PUT | `/api/auth/change-password` | Authenticated | Verify current password and set new one |
| POST | `/api/auth/forgot-password` | Public | Create reset token; log link to console |
| POST | `/api/auth/reset-password` | Public with token | Set new password; mark token used |

### Users

| Method | Path | Access | Purpose |
|---|---|---|---|
| GET | `/api/users/profile` | Authenticated | Read own full profile including NRC |
| PUT | `/api/users/profile` | Authenticated | Update profile fields including NRC |
| GET | `/api/users/:id/public` | Authenticated | Read public profile and certificates |
| GET | `/api/users` | Admin | List/search/paginate accounts |

### Courses and Learning

| Method | Path | Access | Purpose |
|---|---|---|---|
| GET | `/api/courses` | Authenticated | List published courses with filters |
| GET | `/api/courses/:id` | Authenticated | Course detail, modules, quizzes, enrolment |
| POST | `/api/courses/:id/enroll` | Youth | Enrol in course |
| POST | `/api/courses` | Admin | Create course |
| POST | `/api/courses/:id/modules` | Admin | Add module |
| POST | `/api/courses/modules/:moduleId/quiz` | Admin | Add quiz question |
| POST | `/api/progress/module/:moduleId/complete` | Youth | Mark module complete; issue certificate if all done |
| POST | `/api/progress/quiz/:moduleId/submit` | Youth | Submit quiz answers; receive score |
| GET | `/api/progress/course/:courseId` | Authenticated | Progress for current user in a course |
| GET | `/api/progress/my-courses` | Authenticated | All enrolments with progress |

### Assignments

| Method | Path | Access | Purpose |
|---|---|---|---|
| GET | `/api/assignments/module/:moduleId` | Authenticated | Read assignment; youth gets own submission |
| GET | `/api/assignments/my` | Youth | All own submissions |
| POST | `/api/assignments/:id/submit` | Youth | Submit or resubmit text response |
| GET | `/api/assignments/course/:courseId/submissions` | Admin | All submissions for a course |
| PUT | `/api/assignments/submission/:id/grade` | Admin | Grade and give feedback; notify learner |

### Certificates and Payments

| Method | Path | Access | Purpose |
|---|---|---|---|
| GET | `/api/certificates/my` | Authenticated | Own certificates |
| GET | `/api/certificates/verify/:certNumber` | Public | Verify certificate by number |
| POST | `/api/payments/certificate/:certId/submit` | Youth | Submit payment proof; notify admin in-app and by email |
| GET | `/api/payments/certificate/:certId/status` | Authenticated | Own payment status |
| GET | `/api/payments/pending` | Admin | Pending payment proofs |
| GET | `/api/payments/all` | Admin | All payment records |
| PUT | `/api/payments/:paymentId/approve` | Admin | Approve; unlock PDF download; notify learner |
| PUT | `/api/payments/:paymentId/reject` | Admin | Reject with optional reason; notify learner |

### Notifications and Dashboards

| Method | Path | Access | Purpose |
|---|---|---|---|
| GET | `/api/notifications` | Authenticated | Latest notifications and unread count |
| PUT | `/api/notifications/read-all` | Authenticated | Mark all read |
| PUT | `/api/notifications/:id/read` | Authenticated | Mark one read |
| GET | `/api/dashboard/youth` | Youth/Admin | Learner stats, recent courses with progress, recent certificates |
| GET | `/api/dashboard/admin` | Admin | Aggregate stats, pending counts, recent completions |
| GET | `/api/health` | Public | API health check |

---

## 7. Authentication and Authorisation

- Backend expects `Authorization: Bearer <token>` on protected routes.
- `authenticate` middleware verifies the JWT using `JWT_SECRET`, reloads the user from SQLite, and attaches to `req.user`.
- `authorize(...roles)` checks the loaded role. Some routes use an inline role check instead.
- The standard login page blocks admin accounts and redirects to `/admin/login`.
- Tokens are stored in localStorage (Remember Me) or sessionStorage (session only).
- The Axios interceptor clears both stores on 401 and navigates to `/login`.

---

## 8. Email Notifications (Nodemailer)

When a learner submits certificate payment proof, `payments.js` sends an HTML email to the admin address configured in `.env`. The email includes student name, email, course title, certificate number, amount, and the submitted payment reference. If `GMAIL_APP_PASSWORD` is not configured, the email step is skipped silently without affecting the submission.

### Required `.env` variables for email

```dotenv
GMAIL_USER=allandabalidabz@gmail.com
GMAIL_APP_PASSWORD=<16-character Gmail App Password>
ADMIN_EMAIL=allandabalidabz@gmail.com
PAYMENT_NUMBER=0970342178
```

To generate a Gmail App Password: Google Account → Security → 2-Step Verification → App passwords.

---

## 9. Certificate PDF

The certificate PDF is generated client-side using jsPDF. It is a landscape A4 document with:

- Light green (`#16a34a`) accent bars, borders, and text
- Organisation name in the top bar
- Decorative line below the heading
- Single YouthSkills logo centered below the line
- Student name (large, underlined) with NRC number below
- Course title, category and level badges
- Three-column footer: instructor name, date issued, certificate number
- Verification URL in the bottom bar

PDF download is only enabled when the learner's payment proof has been approved by the admin.

---

## 10. Environment Variables

### Backend `.env`

```dotenv
PORT=5000
JWT_SECRET=<long-random-secret>
JWT_EXPIRES_IN=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
GMAIL_USER=allandabalidabz@gmail.com
GMAIL_APP_PASSWORD=<gmail-app-password>
ADMIN_EMAIL=allandabalidabz@gmail.com
PAYMENT_NUMBER=0970342178
```

### Frontend `.env` (production only)

```dotenv
VITE_API_URL=https://<your-api-host>/api
```

---

## 11. Installation and Development

Open two PowerShell terminals from the project root:

**Terminal 1 — Backend:**
```powershell
Set-Location .\backend
npm install
npm run dev
```

**Terminal 2 — Frontend:**
```powershell
Set-Location .\frontend
npm install
npm run dev
```

Open `http://localhost:3000`. API health: `http://localhost:5000/api/health`.

### Seeding the database

```powershell
Set-Location .\backend
npm run seed
```

**Warning:** The seed script deletes all existing data before inserting fresh content. Only run it on a disposable or empty development database.

After seeding:
- Admin: `admin@youthskills.com` / `Allan7034`
- Youth accounts: register on the platform

### Production build

```powershell
Set-Location .\frontend
npm run build
```

---

## 12. Known Limitations

1. **Quiz integrity** — quiz answers are returned in the API response; module completion accepts a client-supplied score. Not suitable for high-stakes assessment without server-side scoring.
2. **Pre-enrolment content access** — the course-detail API returns module content to any authenticated user; the UI lock is frontend-only.
3. **Password reset** — reset links are logged to the backend console only; no email is sent for password reset (only for payment notifications).
4. **No automated tests** — no test runner is configured.
5. **SQLite concurrency** — SQLite in WAL mode is suitable for a low-concurrency deployment. A high-concurrency production environment would require a different database.
6. **`DB_PATH` env var** — defined in `.env` but not used; path is computed from `__dirname` in `database.js`.

---

## 13. Deployment Checklist

- [ ] Set a strong unique `JWT_SECRET`
- [ ] Set `NODE_ENV=production`
- [ ] Configure `FRONTEND_URL` to the exact deployed frontend origin
- [ ] Configure `GMAIL_USER`, `GMAIL_APP_PASSWORD`, `ADMIN_EMAIL`
- [ ] Serve both frontend and API over HTTPS
- [ ] Use a writable, backed-up persistent path for the SQLite database
- [ ] Remove or disable the `resetLink` field in the forgot-password response (currently only sent in development)
- [ ] Back up the database before running seed on any non-empty database
