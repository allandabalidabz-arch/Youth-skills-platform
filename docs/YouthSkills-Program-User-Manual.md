# YOUTHSKILLS PROGRAM
## USER AND ADMINISTRATOR MANUAL

**Institution:** Evelyn Hone College  
**System:** YouthSkills Program  
**Version:** 2.0

---

## 1. Introduction

The YouthSkills Program is a web-based digital-skills learning platform developed for Evelyn Hone College. It allows youth learners to register, enrol in digital-skills courses, study module content, complete quizzes and assignments, earn certificates, and download verified PDF certificates after payment approval.

Administrators manage the platform through a dedicated portal where they can view registered youth, track course completions, grade assignment submissions, and approve or reject certificate payment proofs.

The system does not provide job listings, recruitment, mentorship or employer features.

---

## 2. System Requirements

- A modern web browser: Chrome, Firefox, or Edge (latest version recommended)
- Internet or local network access to the running server
- For local installation: Node.js (LTS), npm, and a code editor

---

## 3. Starting the System (Local Development)

Both the backend and frontend must be running at the same time.

**Terminal 1 — Backend API:**
```powershell
cd "youth-skills-platform\backend"
npm install
npm run dev
```
Wait for: `🚀 Server running on http://localhost:5000`

**Terminal 2 — Frontend:**
```powershell
cd "youth-skills-platform\frontend"
npm install
npm run dev
```
Wait for: `Local: http://localhost:3000/`

Open `http://localhost:3000` in your browser. Both terminals must stay open while using the system.

**Verify the API is running:** Open `http://localhost:5000/api/health` — it should return a JSON status message.

---

## 4. Demo Accounts

| Role | Email | Password |
|---|---|---|
| Admin | admin@youthskills.com | Allan7034 |

Youth accounts are created by registering on the platform.

---

## 5. Youth Learner Guide

### 5.1 Creating an Account

1. Open the application landing page at `http://localhost:3000`
2. Click **Get Started Free** or **Create Account**
3. Fill in all required fields:
   - **Full Name** — letters only
   - **NRC Number** — required; Zambian format `123456/78/9`
   - **Email Address** — required; must be a valid email
   - **Location** — optional
   - **Phone** — optional; format `+260...`
   - **Password** — minimum 6 characters
   - **Confirm Password**
4. Click **Create Account**
5. You will be taken directly to your dashboard

### 5.2 Signing In

1. Go to `http://localhost:3000/login`
2. Enter your registered email and password
3. Tick **Remember me** to stay logged in after closing the browser
4. Click **Sign In**

> Admin accounts must sign in at `http://localhost:3000/admin/login`

### 5.3 Dashboard

Your dashboard shows:
- Number of enrolled and completed courses
- Number of certificates earned
- Your overall completion rate
- Recent courses with a progress bar showing modules completed
- Recent certificates earned

If you have not enrolled in any courses yet, a **Browse Courses** button guides you to the course library.

### 5.4 Browsing and Enrolling in Courses

1. Click **Courses** in the left sidebar
2. Use the search bar, category filter (Systems / Coding), or level filter to find a course
3. Click on a course card to open its detail page
4. Click **Enroll Now — Free** to enrol
5. Once enrolled, the modules unlock and your progress bar appears

### 5.5 Studying a Module

1. Open a course you are enrolled in
2. Click on a module to expand it
3. Read the module content carefully
4. When ready, click **Take Quiz** if the module has quiz questions

### 5.6 Taking a Quiz

1. Read each question and select one answer per question
2. Click **Submit Quiz** when all questions are answered
3. Your score is shown immediately
4. You need at least **60%** to pass and complete the module
5. If you score below 60%, click **Retry Quiz** and try again
6. On passing, the module is marked complete automatically

### 5.7 Submitting an Assignment

Each course has one final assignment covering all three modules.

1. Open any module in the course to find the assignment section at the bottom
2. Read the assignment title, description, and full instructions carefully
3. Type your response in the text box (minimum 20 characters)
4. Click **Submit Assignment**
5. The status changes to **⏳ Awaiting Grading**
6. Once graded by the admin, you will receive a notification with your score and feedback

### 5.8 Completing a Course and Earning a Certificate

After passing all three module quizzes:
- You receive a **🏆 Certificate Earned!** notification
- The system automatically redirects you to the **Certificates** page
- A certificate record is created with a unique certificate number

### 5.9 Downloading Your Certificate

Certificates require a payment of **2,000 ZMW** before the PDF can be downloaded.

1. Go to **Certificates** in the sidebar
2. Click the **2,000 ZMW** button on your certificate card
3. A payment panel opens showing the mobile money number:
   - **Send 2,000 ZMW to: 0970 342 178 (Allan Dabali — YouthSkills Program)**
4. After sending, enter your **transaction reference number** in the input field
5. Click **Submit Payment Proof**
6. The status changes to **⏳ Pending**
7. Once the admin approves, you receive a notification
8. The **PDF** download button unlocks — click it to download your certificate

The certificate PDF includes your name, NRC number, course, date, certificate number, and a verification link.

### 5.10 Sharing and Verifying Your Certificate

- Click **Share** to copy a public verification link
- Anyone can visit `http://localhost:3000/verify/{CERTIFICATE_NUMBER}` to confirm the certificate is genuine

### 5.11 Managing Your Profile

1. Click **Profile** in the sidebar
2. Update your name, bio, location, phone, NRC, or avatar URL
3. Add or remove skills using the Skills section
4. Click **Save Changes**
5. Use the **Security** tab to change your password

### 5.12 Notifications

- The bell icon in the top bar shows a red badge when you have unread notifications
- Click the bell to see messages about certificate earnings, assignment grades, and payment approvals
- Click **Mark all read** to clear the badge

### 5.13 Forgot Password

1. Go to the login page and click **Forgot password?**
2. Enter your registered email
3. The reset link is logged to the backend console (development mode)
4. Open the link, enter a new password, and submit

---

## 6. Administrator Guide

### 6.1 Signing In as Admin

1. Go to `http://localhost:3000/admin/login`
2. Enter: `admin@youthskills.com` / `Allan7034`
3. You will be taken to the Admin Dashboard

### 6.2 Admin Dashboard Overview

The Overview tab shows five clickable cards:

| Card | What it shows |
|---|---|
| Total Users | All registered accounts; click to see youth list |
| Courses | Total courses and enrollments; click to see modules |
| Certificates Issued | Total certificates; click to see completions list |
| Pending Assignments | Submissions awaiting grading; click to grade |
| Pending Payments | Payment proofs awaiting approval; click to review |

### 6.3 Registered Youth Tab

- View a searchable, paginated table of all registered youth
- Columns: Name, Email, NRC, Location, Registration Date
- Use the search box to find a specific learner by name or email

### 6.4 Completions Tab

- View a table of all course completions across the platform
- Columns: Student Name, Email, Course, Certificate Number, Date Completed
- Shows the 10 most recent completions

### 6.5 Modules Tab

- Browse all courses and expand each one to see its modules
- Useful for verifying course content during demonstrations

### 6.6 Assignments Tab — Grading

1. Click the **Assignments** tab
2. All submissions appear, sorted by most recent first
3. Each card shows the student name, assignment title, module, submission time, and status (Pending / Graded with score)
4. Click **Grade** to expand a submission
5. Read the full student submission text
6. Enter a **grade** from 0 to 100
7. Optionally write **feedback** for the student
8. Click **Submit Grade**
9. The student receives an in-app notification with their score and feedback

### 6.7 Payments Tab — Approving Certificates

When a learner submits payment proof you receive:
- An **in-app notification** in the bell icon
- An **email** to `allandabalidabz@gmail.com` with full details

To review:
1. Click the **Payments** tab
2. Each payment card shows student name, course, certificate number, amount (2,000 ZMW), and the submitted payment reference
3. Verify the reference number matches your mobile money records
4. Click **Approve** to unlock the certificate PDF for the learner
5. Or type an optional reject reason and click **Reject**
6. The learner receives an in-app notification either way

### 6.8 Profile

Admins can update their own name, bio, location, and password from the **Profile** page.

---

## 7. Certificate Verification (Public)

Anyone — including employers and institutions — can verify a certificate without logging in:

1. Go to `http://localhost:3000/verify/{CERTIFICATE_NUMBER}`
2. The page shows whether the certificate is valid and displays the holder's name, course, and issue date

---

## 8. Troubleshooting

| Problem | Solution |
|---|---|
| Dashboard shows an error or "Try Again" button | The backend is not running. Start it with `npm run dev` in the backend folder, then click Try Again |
| Login says "Invalid email or password" | Check credentials. Admin must use `/admin/login`, not the regular login |
| Registration fails with "NRC already registered" | That NRC number is already linked to another account |
| Course list is empty | The database needs seeding. Run `npm run seed` in the backend (warning: this deletes all data) |
| Certificate download is locked | Payment proof has not been approved yet. Check the Payments tab in the admin dashboard |
| Forgot-password link not received by email | Email delivery is only configured for payment notifications. The reset link is logged to the backend console in development mode |
| Quiz score not saving | Ensure you score at least 60% and click Submit Quiz. The module completes automatically on passing |

---

## 9. Known Limitations

- No email delivery for password resets (link is console-logged only)
- No employment, mentorship or recruitment features
- No trainer/instructor role — course content is seeded by the developer
- Assignment file upload is not implemented — text submissions only
- SQLite is suitable for small deployments; high-concurrency production use requires a different database
