# YOUTHSKILLS PROGRAM
## USER AND ADMINISTRATOR MANUAL

**Institution:** Evelyn Hone College  
**System:** YouthSkills Program  
**Document status:** Prepared from inspection of the current application. It describes the current learner screens and identifies administrator actions that have API support but no corresponding screen.

---

## 1. Introduction

This manual explains how to install and use the YouthSkills Program digital-skills learning application. The system provides course browsing, module content, quizzes, text assignments, learner progress, certificates and notifications. The current application does **not** provide job listings, recruitment, mentorship or opportunity applications.

## 2. System Requirements

### For learners and administrators

- A current web browser such as Chrome, Firefox or Edge.
- Access to the deployed application and internet connection, or a local network connection to a running development server.
- An email address for account registration.

### For local installation

- Windows, macOS or Linux computer.
- Node.js and npm installed.
- The project source code and its package manifests.
- A current browser and a code editor such as Visual Studio Code.

The project does not specify a tested minimum Node.js version. Use a maintained Node.js LTS release compatible with the packages in the supplied lockfiles, then record the exact version used for the final submission.

## 3. Installation and Setup

1. Open a terminal in the project folder.
2. In a first terminal, install backend dependencies and start the API:

   ```powershell
   Set-Location .\backend
   npm install
   npm run dev
   ```

   The backend is configured to listen on port `5000` by default.

3. In a second terminal, install frontend dependencies and start the web app:

   ```powershell
   Set-Location .\frontend
   npm install
   npm run dev
   ```

4. Open `http://localhost:3000` in a browser.
5. Confirm that the API health endpoint responds at `http://localhost:5000/api/health`.

The frontend Vite development configuration proxies `/api` requests to `http://localhost:5000`.

### Database setup

The API initialises its SQLite schema when it starts. The database connection path is defined in `backend/src/database.js`. When the database contains no users, the server attempts to seed demonstration content. The sample content includes three courses and related modules, quizzes and assignments.

> **Important:** `backend/src/utils/seed.js` contains commands that delete existing rows before seeding. Do not run `npm run seed` on a database containing learner records you need. Use a disposable development database or make and verify a backup first.

### Environment configuration

The backend reads environment variables using dotenv. The variable names found in the local configuration are `PORT`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `DB_PATH`, `NODE_ENV` and `FRONTEND_URL`. Do not copy or share actual secret values. The database implementation inspected does not use the configured `DB_PATH` value; it constructs a fixed path relative to the backend source.

The frontend `.env.example` contains `VITE_API_URL` as a placeholder for a deployed API. For local Vite development, the proxy is configured in `frontend/vite.config.js`.

## 4. Starting and Stopping the Application

Start the backend and frontend in separate terminals using the commands above. Keep both processes running while using the local application. To stop a process, focus its terminal and press `Ctrl+C`.

## 5. Learner Instructions

### 5.1 Register an account

1. Open the application landing page.
2. Select **Get Started** or **Create Account**.
3. Enter your name, email address and password. Location and phone are optional.
4. Confirm the password if requested.
5. Submit the form and wait for the success message and dashboard.

The registration page is designed for youth/learner registration. Although the backend accepts the `employer` role in the registration endpoint, no role selection is offered in the learner registration page. Employer features are unavailable in the current application.

### 5.2 Sign in

1. Select **Sign In**.
2. Enter the email address and password used during registration.
3. Select **Remember me** if you want the browser to retain the session in persistent storage. If you leave it unchecked, the session is stored in session storage.
4. Select **Sign In**.

Administrator accounts should use the separate **Admin Portal** sign-in page. The learner login page redirects admin users to that portal.

### 5.3 Navigate the learner dashboard

The learner navigation includes:

- **Dashboard:** Summary of enrolments, completed courses and certificates, with recent course and certificate records.
- **Courses:** Course catalogue with search, category and level filters.
- **Certificates:** Issued certificate records, payment state, download, share and verification actions.
- **Profile:** Personal profile, skills and password-security tabs.

The header includes a notification control and dark-mode toggle. Notifications are refreshed periodically while the page is open; they are not guaranteed to arrive as push messages.

### 5.4 Browse and enrol in a course

1. Select **Courses** in the navigation.
2. Use the search box or category and level filters.
3. Open a course card to view the course description, modules, instructor label and enrolment count.
4. Select **Enroll Now — Free** if you are eligible to enrol and are not already enrolled.
5. Return to the course details. Your progress is displayed once enrolled.

The user interface restricts a learner from opening a module before enrolment. However, the course-detail API returns course modules and quiz content to authenticated users regardless of enrolment. This is a known backend access-control limitation; do not treat the interface restriction as server-side content protection.

### 5.5 Study modules and complete learning activities

1. Open an enrolled course.
2. Select a module to expand its content.
3. Read the displayed module material.
4. If the module has quiz questions, select an answer for each question and choose **Submit Quiz**.
5. A score of 60% or higher is treated by the current completion workflow as a pass.
6. If a module has no quiz, select **Mark Complete**.
7. Check the module status and course progress bar.

The current quiz implementation has an assessment-integrity weakness: the API returns correct answers and trusts a score submitted by the browser when marking a module complete. Quiz scores and completion records should therefore be treated as demonstration data, not secure examination results.

### 5.6 Submit an assignment

1. Open the relevant course and module.
2. Find the assignment and read its description and instructions.
3. Enter a text response of at least 20 characters.
4. Select **Submit Assignment**.
5. Review the displayed submission status. If it has not been graded, the interface allows resubmission.
6. If an administrator grades the submission, review the score and feedback shown in the assignment area.

The learner interface supports text submissions. A database field for file URLs exists, but the reviewed application does not provide a file-upload workflow.

### 5.7 Track progress

Course progress is based on the proportion of course modules recorded complete. Open a course to see its progress bar and completed-module count. The dashboard also reports course enrolments and completed courses. These values reflect records in the system; they are not independent measures of acquired skill.

### 5.8 View, download and verify certificates

1. Complete all modules in a course according to the application's progress workflow.
2. Open **Certificates** or review the dashboard.
3. Select **Share** to copy the certificate verification link or **Verify** to open its public verification page.
4. To download a PDF, the displayed payment record must have status `approved`.
5. The PDF is created in the browser and saved to the device.

The interface displays a 2,000 ZMW payment amount and asks for a payment reference. The application records a text proof and administrator status; it does not make or verify a mobile-money, bank or card payment. Confirm the fee and payment instructions with the responsible project owner before making any payment. Do not submit actual financial credentials or sensitive payment information through a demonstration system.

### 5.9 Manage profile and password

1. Open **Profile**.
2. In **Profile**, update supported personal information, skills and avatar URL, then save.
3. In **Security**, enter the current password and a new password to change it.

The registration and password reset screens enforce a minimum password length of six characters. This is the implemented rule, not a recommendation for a production account-security policy.

### 5.10 Forgot password

1. Select **Forgot password?** on the login page.
2. Enter the registered email address and submit.
3. In the inspected development workflow, a reset link is logged by the backend and may be returned in non-production mode. No email provider is integrated.
4. Open the development reset link, enter a new password and submit it.

Do not expect a real email to be sent by the current code. Reset-link handling should only be performed in a controlled development environment.

## 6. Administrator Instructions

### 6.1 Administrator sign-in

1. Open `/admin/login` on the application.
2. Enter administrator credentials supplied securely by the project owner.
3. Successful sign-in opens the dashboard.

This manual intentionally does not reproduce seeded demo passwords or values from local environment files.

### 6.2 Administrator dashboard screens

The current visible dashboard provides:

- **Overview:** Summary of users, youth users, courses, enrolments and certificates.
- **Registered Youth:** A searchable list of youth accounts with profile and registration fields.
- **Modules:** A course list that can be expanded to inspect its modules.

The administrator can use **Profile** to view or update supported profile fields and change their password.

### 6.3 Administrator API-only capabilities

Protected backend endpoints allow administrators to create courses, add modules and quizzes, view course assignment submissions, grade submissions, list certificate-payment records, and approve or reject submitted payment proofs. The inspected dashboard does not provide corresponding screens for all of these functions. Operating these endpoints requires an authorised API client and must follow the API specification in the technical documentation. Do not claim that these operations are available through the current dashboard UI.

### 6.4 Content and records

Only add course content that has been approved by the responsible content owner. Avoid using real learner or payment data in demonstrations. Take a backup before changing or reseeding a database.

## 7. Notifications

Select the bell icon to open the notification panel. The panel shows recent notifications and unread count. Select **Mark all read** to clear unread status. The reviewed UI does not show a per-notification read action, although a per-notification API route exists.

## 8. Logging Out Safely

Select **Sign Out** in the navigation. This removes the application token and saved user record from local and session storage and returns the browser to the landing page. On a shared device, close the browser after signing out.

## 9. Troubleshooting

| Problem | Suggested action |
|---|---|
| Page cannot connect to the API | Check that the backend is running on port 5000, then refresh the page. Check `/api/health`. |
| API requests fail after changing deployment | Verify the frontend API base URL and backend CORS `FRONTEND_URL` configuration. Never share secret values. |
| Sign-in returns an error | Confirm the email/password and ensure the database contains the account. Use the admin portal for an administrator account. |
| User is repeatedly returned to login | The API may have rejected an expired/invalid token. Sign in again. |
| Course list is empty | Confirm the database was initialised and course seed content exists. Seed only an empty or disposable database. |
| Quiz completion behaves unexpectedly | The quiz implementation has known integrity limitations. Do not use it for a formal examination. |
| Certificate cannot be downloaded | The UI requires an approved payment record. The application does not process actual payments; contact the project owner rather than submitting sensitive details. |
| Forgot-password link is not received | Email delivery is not implemented. In local development, the reset link is logged by the backend. |
| Dashboard has no employer tools | Employer functions are unavailable in the current version. |
| Missing or incorrect profile information | Update the profile and save. If an API error occurs, sign in again and report the issue to the administrator. |

## 10. Known Limitations

- No employment, mentoring or recruitment functionality.
- No trainer role in the account model.
- No email delivery for password resets.
- Manual certificate-payment proof workflow; no integrated payment provider.
- Some administrator actions are API-only.
- Quiz answer disclosure and client-submitted scores weaken assessment integrity.
- No formal user-acceptance or accessibility evaluation is documented.

---

**For developer setup, API endpoint details, schema and backup guidance, see `docs/YouthSkills-Program-Technical-Documentation.md`.**
