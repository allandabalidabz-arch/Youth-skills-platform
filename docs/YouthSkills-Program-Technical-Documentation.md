# YOUTHSKILLS PROGRAM
## TECHNICAL DOCUMENTATION

**Institution:** Evelyn Hone College  
**System type:** Web-based digital-skills learning platform  
**Document status:** Prepared from static inspection of the current project source and SQLite schema.

> Do not copy real values from `.env` files, expose demo account credentials or publish a database containing real user data. Environment values shown below are placeholders only.

## 1. Project Overview

YouthSkills Program is a React single-page application backed by a Node.js/Express API and SQLite database. It supports user accounts, digital-skills courses and modules, quizzes, text assignments, enrolments, progress tracking, certificate records and verification, notifications, and selected administration functions. Certificate payment is recorded as manually submitted proof; no payment gateway is integrated. Password reset does not use an email provider in the inspected implementation.

The current codebase does not provide opportunity, job, employer recruitment, mentor or trainer workflows. The employer UI is a placeholder, and employer dashboard statistics are empty.

## 2. Technology Stack

| Component | Technology |
|---|---|
| Frontend | React 18, JSX, Vite, React Router, Tailwind CSS |
| HTTP client | Axios |
| Icons and feedback | Lucide React, react-hot-toast |
| PDF generation | jsPDF |
| Backend | Node.js, Express 4 |
| Database | SQLite through `sqlite` and `sqlite3` |
| Authentication | JWT (`jsonwebtoken`), bcryptjs |
| Other backend packages | cors, dotenv, uuid, multer (listed; no source use found) |
| Build/configuration | npm, Vite, PostCSS, Tailwind |

## 3. Folder Structure

```text
youth-skills-platform/
├── README.md
├── backend/
│   ├── package.json
│   ├── package-lock.json
│   ├── .env                     # Local-only; never publish its values
│   ├── database.sqlite          # Local database; may contain private data
│   └── src/
│       ├── server.js
│       ├── database.js
│       ├── middleware/
│       │   └── auth.js
│       ├── routes/
│       │   ├── assignments.js
│       │   ├── auth.js
│       │   ├── certificates.js
│       │   ├── courses.js
│       │   ├── dashboard.js
│       │   ├── notifications.js
│       │   ├── payments.js
│       │   ├── progress.js
│       │   └── users.js
│       └── utils/
│           └── seed.js
├── frontend/
│   ├── package.json
│   ├── package-lock.json
│   ├── .env.example
│   ├── vite.config.js
│   ├── vercel.json
│   ├── public/
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── index.css
│       ├── components/
│       ├── context/
│       ├── pages/
│       └── utils/
└── docs/
    ├── YouthSkills-Program-Academic-Documentation.md
    ├── YouthSkills-Program-User-Manual.md
    ├── YouthSkills-Program-Technical-Documentation.md
    └── YouthSkills-Program-Diagrams.md
```

The nested `youth-skills-platform/frontend` directory in the inspected workspace contains an image asset and is not the active package root; the active frontend package is the top-level `frontend` folder.

## 4. Application Architecture

1. `frontend/src/main.jsx` mounts React, browser routing and toast presentation.
2. `frontend/src/App.jsx` defines public routes and authentication/role-gated routes.
3. `frontend/src/context/AuthContext.jsx` performs sign-in and registration calls and keeps user state in React.
4. `frontend/src/utils/api.js` sets Axios base URL, attaches the token and clears browser session data after a 401 response.
5. `frontend/vite.config.js` configures port 3000 and proxies `/api` to `http://localhost:5000`.
6. `backend/src/server.js` configures Express, CORS, body parsing, static uploads, route groups, health endpoint and error middleware.
7. Route handlers call `getDb()` from `backend/src/database.js`, perform SQL operations and return JSON.
8. `backend/src/middleware/auth.js` verifies JWTs, reloads user identity from the database and checks permitted role(s).
9. SQLite stores users, learning data, progress, assignments, certificates, payment-proof state, notifications and reset tokens.

An editable architecture diagram is supplied in `docs/YouthSkills-Program-Diagrams.md`.

## 5. Installation and Development Setup

Use PowerShell from the project root:

```powershell
Set-Location .\backend
npm install
npm run dev
```

Open a second PowerShell terminal:

```powershell
Set-Location .\frontend
npm install
npm run dev
```

Open `http://localhost:3000`. The API health endpoint is `http://localhost:5000/api/health`.

For a production frontend build:

```powershell
Set-Location .\frontend
npm run build
npm run preview
```

The inspected production build completed successfully. It emitted a Browserslist data age warning and a large-chunk warning. This is build evidence only, not an API or user-flow test.

### Environment variables

Backend variable names read or referenced in the project:

```dotenv
PORT=5000
JWT_SECRET=<generate-a-long-random-secret>
JWT_EXPIRES_IN=<for-example-1d>
DB_PATH=<currently-not-used-by-database.js>
NODE_ENV=<development-or-production>
FRONTEND_URL=<trusted-frontend-origin>
```

Frontend deployment example:

```dotenv
VITE_API_URL=https://<your-api-host>/api
```

`frontend/.env.example` provides a placeholder deployment URL. The actual backend `.env` is local configuration and must not be copied to public documentation, source control or screenshots. `JWT_SECRET` must be unique and private. Do not reuse any demo or example credential.

### Database behaviour

At backend startup, `getDb()` opens the SQLite database at a path computed from `__dirname`, enables WAL and foreign keys, and creates missing tables. The `DB_PATH` environment variable is present in local configuration but is not read by the inspected database module. This discrepancy should be fixed or documented before deployment.

When no users exist, the server attempts to seed the database. The seed routine also contains `DELETE FROM` statements. **Treat `npm run seed` as destructive.** Back up a database and verify the backup before using seed on anything other than a disposable development database.

## 6. Database Schema and Relationships

The schema is created in `backend/src/database.js`; no separate SQL import file was identified.

### 6.1 Tables

| Table | Key fields and purpose |
|---|---|
| `users` | `id TEXT PRIMARY KEY`; `name`, unique `email`, hashed `password`, `role`, `avatar`, `bio`, `location`, `phone`, JSON text `skills`, timestamps |
| `courses` | `id TEXT PRIMARY KEY`; title, description, category, level, duration, thumbnail, instructor display fields, JSON text tags, publication flag, creation time |
| `modules` | `id`; `course_id` FK to courses; title, description, content, video URL, ordering, duration, creation time |
| `quizzes` | `id`; `module_id` FK to modules; question, JSON text options, correct option index, explanation |
| `enrollments` | `id`; `user_id` FK; `course_id` FK; enrolment/completion dates; unique user/course pair |
| `module_progress` | `id`; `user_id` FK; `module_id` FK; `course_id`; completion flag, score, completion time; unique user/module pair |
| `certificates` | `id`; `user_id` FK; `course_id` FK; issue time, unique certificate number; unique user/course pair |
| `notifications` | `id`; `user_id` FK; title, message, type, read flag, creation time |
| `assignments` | `id`; `module_id` FK; `course_id` FK; title, description, instructions, due days, creation time |
| `assignment_submissions` | `id`; assignment and user FKs; module/course IDs, submission text, file URL, status, grade, feedback and timestamps; unique user/assignment pair |
| `certificate_payments` | `id`; user and certificate FKs; amount default 2000, currency default ZMW, proof, status, submission/approval metadata; unique user/certificate pair |
| `password_resets` | `id`; user FK; token, expiry, used flag and creation time |

### 6.2 Foreign-key relationships and constraints

- `modules.course_id` → `courses.id` (`ON DELETE CASCADE`).
- `quizzes.module_id` → `modules.id` (`ON DELETE CASCADE`).
- `enrollments.user_id` → `users.id`; `enrollments.course_id` → `courses.id` (cascade deletes).
- `module_progress.user_id` → `users.id`; `module_progress.module_id` → `modules.id` (cascade deletes).
- `certificates.user_id` → `users.id`; `certificates.course_id` → `courses.id` (cascade deletes).
- `notifications.user_id` → `users.id` (cascade delete).
- `assignments.module_id` → `modules.id`; `assignments.course_id` → `courses.id` (cascade deletes).
- `assignment_submissions.assignment_id` → `assignments.id`; `assignment_submissions.user_id` → `users.id` (cascade deletes).
- `certificate_payments.user_id` → `users.id`; `certificate_payments.certificate_id` → `certificates.id` (cascade deletes).
- `password_resets.user_id` → `users.id` (cascade delete).
- `module_progress.course_id`, `assignment_submissions.module_id`, `assignment_submissions.course_id` and `certificate_payments.approved_by` do not have declared foreign keys in the inspected schema.

### 6.3 Data dictionary: user and course records

| Field | Type / default | Meaning |
|---|---|---|
| `users.id` | TEXT, primary key | User UUID assigned by application |
| `users.name` | TEXT, required | Account display name |
| `users.email` | TEXT, unique, required | Sign-in identifier |
| `users.password` | TEXT, required | bcryptjs password hash; never return to client |
| `users.role` | TEXT, default `youth` | Role string used by authorisation middleware |
| `users.avatar`, `bio`, `location`, `phone` | TEXT, nullable | Profile data |
| `users.skills` | TEXT, default `[]` | JSON-encoded list of skills |
| `users.created_at`, `updated_at` | DATETIME | Account timestamps |
| `courses.id` | TEXT, primary key | Course UUID |
| `courses.title`, `description`, `category` | TEXT, required | Course identity and catalogue text |
| `courses.level` | TEXT, default `beginner` | Course level label |
| `courses.duration_hours` | INTEGER, default `0` | Displayed planned duration |
| `courses.thumbnail` | TEXT, nullable | Image URL |
| `courses.instructor_name` | TEXT, required | Display text; not a trainer account |
| `courses.instructor_bio` | TEXT, nullable | Instructor display biography |
| `courses.tags` | TEXT, default `[]` | JSON-encoded tags |
| `courses.is_published` | INTEGER, default `1` | Published filter flag |
| `courses.created_at` | DATETIME | Creation timestamp |

### 6.4 Data dictionary: learning and results

| Table/field | Type / default | Meaning |
|---|---|---|
| `modules.id` | TEXT, primary key | Module UUID |
| `modules.course_id` | TEXT, required, FK | Parent course |
| `modules.title`, `content` | TEXT, required | Module heading and learning material |
| `modules.description`, `video_url` | TEXT, nullable | Optional description or video URL |
| `modules.order_index` | INTEGER, required | Course sequence |
| `modules.duration_minutes` | INTEGER, default `0` | Estimated module time |
| `quizzes.id` | TEXT, primary key | Quiz-question UUID |
| `quizzes.module_id` | TEXT, required, FK | Parent module |
| `quizzes.question` | TEXT, required | Question text |
| `quizzes.options` | TEXT, required | JSON-encoded options |
| `quizzes.correct_answer` | INTEGER, required | Correct option index |
| `quizzes.explanation` | TEXT, nullable | Explanation returned with quiz result |
| `enrollments.id` | TEXT, primary key | Enrolment UUID |
| `enrollments.user_id`, `course_id` | TEXT, required, FK | Learner and course |
| `enrollments.enrolled_at` | DATETIME | Enrolment date |
| `enrollments.completed_at` | DATETIME, nullable | Course completion date |
| `module_progress.id` | TEXT, primary key | Progress UUID |
| `module_progress.user_id`, `module_id`, `course_id` | TEXT, required | User, module and stored course identifiers |
| `module_progress.completed` | INTEGER, default `0` | Completion flag |
| `module_progress.quiz_score` | INTEGER, nullable | Reported percentage score |
| `module_progress.completed_at` | DATETIME, nullable | Completion timestamp |
| `assignments.id` | TEXT, primary key | Assignment UUID |
| `assignments.module_id`, `course_id` | TEXT, required | Associated learning unit |
| `assignments.title`, `description`, `instructions` | TEXT, required | Assignment content |
| `assignments.due_days` | INTEGER, default `7` | Configured due-day value |
| `assignment_submissions.id` | TEXT, primary key | Submission UUID |
| `assignment_submissions.assignment_id`, `user_id` | TEXT, required, FK | Assignment and submitting user |
| `assignment_submissions.submission_text` | TEXT, required | Learner response |
| `assignment_submissions.file_url` | TEXT, nullable | Schema field; upload workflow not identified |
| `assignment_submissions.status` | TEXT, default `submitted` | Submission state |
| `assignment_submissions.grade` | INTEGER, nullable | Admin-entered grade |
| `assignment_submissions.feedback` | TEXT, nullable | Admin feedback |
| `assignment_submissions.submitted_at`, `graded_at` | DATETIME | Submission and grading times |

### 6.5 Data dictionary: certificates, messaging and security

| Table/field | Type / default | Meaning |
|---|---|---|
| `certificates.id` | TEXT, primary key | Certificate UUID |
| `certificates.user_id`, `course_id` | TEXT, required, FK | Recipient and completed course |
| `certificates.issued_at` | DATETIME | Issue timestamp |
| `certificates.certificate_number` | TEXT, unique, required | Public verification identifier |
| `certificate_payments.id` | TEXT, primary key | Payment-proof record UUID |
| `certificate_payments.user_id`, `certificate_id` | TEXT, required, FK | Submitting user and certificate |
| `certificate_payments.amount` | INTEGER, default `2000` | Amount recorded by schema |
| `certificate_payments.currency` | TEXT, default `ZMW` | Currency code |
| `certificate_payments.proof_text` | TEXT, nullable | User-entered reference/proof |
| `certificate_payments.status` | TEXT, default `pending` | Manual decision status |
| `certificate_payments.submitted_at`, `approved_at` | DATETIME | Submission/approval times |
| `certificate_payments.approved_by` | TEXT, nullable | Admin identifier; no declared FK |
| `notifications.id` | TEXT, primary key | Notification UUID |
| `notifications.user_id` | TEXT, required, FK | Recipient |
| `notifications.title`, `message` | TEXT, required | Notification contents |
| `notifications.type` | TEXT, default `info` | UI category |
| `notifications.is_read` | INTEGER, default `0` | Read indicator |
| `notifications.created_at` | DATETIME | Creation timestamp |
| `password_resets.id` | TEXT, primary key | Reset record UUID |
| `password_resets.user_id` | TEXT, required, FK | Account requesting reset |
| `password_resets.token` | TEXT, required | Reset token |
| `password_resets.expires_at` | DATETIME, required | Token expiry |
| `password_resets.used` | INTEGER, default `0` | Used marker |
| `password_resets.created_at` | DATETIME | Request time |

## 7. API Endpoints

Base URL in local development: `http://localhost:5000`. Frontend development normally calls `/api` through Vite's proxy.

### Authentication and profile

| Method | Path | Access | Purpose |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Create account; backend permits `youth` or `employer` role |
| POST | `/api/auth/login` | Public | Verify password and issue JWT |
| GET | `/api/auth/me` | Authenticated | Return current user |
| PUT | `/api/auth/change-password` | Authenticated | Verify current password and change it |
| POST | `/api/auth/forgot-password` | Public | Create reset token; development link is logged |
| POST | `/api/auth/reset-password` | Reset token | Validate token and set new password |
| GET | `/api/users/profile` | Authenticated | Read own profile |
| PUT | `/api/users/profile` | Authenticated | Update own profile |
| GET | `/api/users/:id/public` | Authenticated | Read selected public user fields and certificates |
| GET | `/api/users` | Admin | List/search/paginate accounts |

### Courses and learning

| Method | Path | Access | Purpose |
|---|---|---|---|
| GET | `/api/courses` | Authenticated | List published courses; supports category, level, search, page, limit |
| GET | `/api/courses/:id` | Authenticated | Return published course, modules, quizzes and current user's enrolment |
| POST | `/api/courses/:id/enroll` | Youth | Create enrolment if not already enrolled |
| POST | `/api/courses` | Admin | Create course |
| POST | `/api/courses/:id/modules` | Admin | Create module for course |
| POST | `/api/courses/modules/:moduleId/quiz` | Admin | Add quiz question |
| POST | `/api/progress/module/:moduleId/complete` | Youth | Mark module complete and possibly issue certificate |
| GET | `/api/progress/course/:courseId` | Authenticated | Read progress for current user |
| GET | `/api/progress/my-courses` | Authenticated | List current user's enrolments and progress |
| POST | `/api/progress/quiz/:moduleId/submit` | Youth | Submit quiz answers and receive score/result |

### Assignments

| Method | Path | Access | Purpose |
|---|---|---|---|
| GET | `/api/assignments/module/:moduleId` | Authenticated | Read assignment; youth receives own submission |
| GET | `/api/assignments/my` | Youth | List own submissions |
| POST | `/api/assignments/:id/submit` | Youth | Create or resubmit text response; requires enrolment |
| GET | `/api/assignments/course/:courseId/submissions` | Admin | List submissions for a course |
| PUT | `/api/assignments/submission/:id/grade` | Admin | Store grade and feedback; notify learner |

### Certificates and payments

| Method | Path | Access | Purpose |
|---|---|---|---|
| GET | `/api/certificates/my` | Authenticated | List current user's certificates |
| GET | `/api/certificates/verify/:certNumber` | Public | Verify certificate and return selected holder/course details |
| POST | `/api/payments/certificate/:certId/submit` | Youth | Submit payment-proof text |
| GET | `/api/payments/certificate/:certId/status` | Authenticated | Read current user's status for certificate |
| GET | `/api/payments/pending` | Admin | List pending proof records |
| GET | `/api/payments/all` | Admin | List all proof records |
| PUT | `/api/payments/:paymentId/approve` | Admin | Approve proof record and notify learner |
| PUT | `/api/payments/:paymentId/reject` | Admin | Reject proof record and notify learner |

### Notifications and dashboards

| Method | Path | Access | Purpose |
|---|---|---|---|
| GET | `/api/notifications` | Authenticated | Return user's latest notifications and unread count |
| PUT | `/api/notifications/read-all` | Authenticated | Mark all user's notifications read |
| PUT | `/api/notifications/:id/read` | Authenticated | Mark own notification read |
| GET | `/api/dashboard/youth` | Youth | Return course and certificate summary |
| GET | `/api/dashboard/admin` | Admin | Return aggregate users, courses, enrolments and certificates |
| GET | `/api/dashboard/employer` | Employer/admin | Currently returns empty statistics |
| GET | `/api/health` | Public | Return API health message and timestamp |

No employment/opportunity endpoint is part of the current application.

## 8. Authentication and Authorisation

The backend expects an `Authorization: Bearer <token>` header. Middleware verifies the JWT using `JWT_SECRET`, retrieves the user by the token's ID, attaches the user to `req.user`, then proceeds. `authorize(...roles)` checks the database role against the route's permitted roles.

The client stores tokens in local storage when “Remember me” is selected, and in session storage otherwise. The Axios response interceptor clears both storage areas when a 401 is returned and navigates to `/login`. Browser storage exposes tokens to scripts running in the same origin; a production design should assess an HTTP-only cookie/session approach and implement appropriate CSRF protections if adopted.

Registration and password-change functions hash passwords using bcryptjs. The project enforces a six-character minimum in the reviewed code; consider adopting a stronger policy suitable for deployment. JWT expiry and signing key values depend on environment configuration.

## 9. Important Implementation Notes and Known Issues

1. Quiz endpoint returns correct answer indexes and explanations. Do not expose answer keys before the learner's attempt is scored.
2. Module completion trusts a score submitted by the client. Calculate and persist assessment attempts server-side.
3. Course-detail API returns quiz and module content to any authenticated user; the frontend's pre-enrolment lock is not server-side authorisation.
4. Reset links are logged for development. No mail-sending package or provider integration was identified.
5. Certificate payment is proof-text collection and manual approval, not a payment gateway.
6. Admin dashboard does not expose all admin APIs, including grading and payment review.
7. Public certificate verification reveals the certificate holder's name and course metadata; review the privacy implications.
8. The app returns quiz correctness data and uses browser token storage; threat-model these before any public deployment.
9. No automated tests, test script, formal accessibility report or user-acceptance report was found.
10. `DB_PATH` is defined locally but unused by the database module.
11. `multer` and `html2canvas` are package dependencies but no use was found in reviewed application source.
12. `backend/src/utils/seed.js` deletes data before reseeding.

## 10. Error Handling and Validation

The server enables JSON parsing with a 10 MB body limit and URL-encoded parsing. CORS restricts browser origins to local URLs plus the configured frontend URL. A final Express error handler logs the error stack and returns JSON. Routes apply selected validation and generally use parameterised SQL statements in reviewed queries. Validation is not uniform across all fields/routes; verify it with tests before deployment.

## 11. Testing Instructions

No test runner is configured in the package manifests. The frontend build command is:

```powershell
Set-Location .\frontend
npm run build
```

The build was executed successfully during the documentation review. To add automated tests, select a runner compatible with the installed versions, configure an isolated test database, and create tests for authentication/roles, SQL constraints, quiz scoring, enrolment, progress, assignment grading, certificates, payment states and notification ownership. Never run destructive seed logic against live data.

For manual verification, see Chapter Five of `docs/YouthSkills-Program-Academic-Documentation.md`. Proposed unexecuted checks are explicitly **Not Tested**.

## 12. Deployment Requirements

- Maintain a supported Node.js runtime and pinned npm dependency lockfiles.
- Set a unique strong `JWT_SECRET`, expiry and trusted frontend origin.
- Serve the frontend and API over HTTPS.
- Use a production database strategy appropriate to expected concurrent use.
- Use a writable, backed-up persistent database location if SQLite remains in use.
- Confirm CORS origins and frontend API base URL.
- Avoid public exposure of uploads or database files.
- Establish logging, monitoring, backup, retention and incident-response procedures.
- Review privacy, access controls, quiz integrity, public certificate disclosure and payment policy.
- Remove development reset-link disclosure and demo secrets from production.

The frontend has a Vercel SPA rewrite configuration and a placeholder remote API URL example. This does not by itself configure, validate or secure a backend deployment.

## 13. Backup and Recovery

The database runs in WAL mode and may have associated `-wal` and `-shm` files while active. For consistent backups, use SQLite's online backup mechanism or stop the backend cleanly and follow SQLite backup guidance. Do not copy only the main database file while it is being written without understanding WAL state. Store backups securely, restrict access and test restore using a copy. This is particularly important because the seed script deletes records.

## 14. Maintenance Recommendations

- Add schema migrations rather than relying only on `CREATE TABLE IF NOT EXISTS` when changing existing structures.
- Add automated unit, integration and regression tests.
- Reconcile or remove unused dependencies.
- Use environment configuration consistently, including `DB_PATH` if supported.
- Add admin UI for the protected operations intended for administrators.
- Keep course content and assets current and properly attributed.
- Review npm dependency updates and build warnings.
- Document releases, schema changes, backups and recovery tests.
- Do not expose real user data in screenshots, seed files or project documentation.

