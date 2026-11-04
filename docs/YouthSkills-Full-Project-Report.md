# EVELYN HONE COLLEGE
## SCHOOL OF BUSINESS STUDIES AND MANAGEMENT
## COMPUTER STUDIES SECTION
## COMPUTER SCIENCE

---

# DESIGN AND IMPLEMENTATION OF A WEB-BASED DIGITAL SKILLS LEARNING PLATFORM FOR YOUTH EMPOWERMENT

**A Final Year Project Report**

---

| | |
|---|---|
| **Student Name:** | Allan Dabali |
| **Student Number:** | [Insert Student Number] |
| **Supervisor:** | [Insert Supervisor Name] |
| **Programme:** | Computer Science |
| **Submission Date:** | November 2026 |

---

**Lusaka, Zambia**

---

## DECLARATION

I, **Allan Dabali**, declare that this project report is my own original work and that all sources used have been duly acknowledged. This project has not been submitted to any other institution for an academic award.

**Student Signature:** ______________________________

**Date:** ______________________________

---

## APPROVAL

This project report has been examined and approved for submission.

**Supervisor Name:** [Insert Supervisor Name]

**Signature:** ______________________________

**Date:** ______________________________

---

## DEDICATION

*This project is dedicated to the youth of Zambia, with the hope that digital skills education will open doors to greater opportunities and a brighter future.*

---

## ACKNOWLEDGEMENTS

I would like to express my sincere gratitude to my supervisor for the guidance and support provided throughout this project. I also thank the staff of Evelyn Hone College, Computer Studies Section, for the knowledge imparted during my studies. Special thanks to my family and friends for their encouragement and patience during the development of this system.

---

## ABSTRACT

The YouthSkills Program is a web-based digital-skills learning platform developed to address the lack of accessible, structured digital education for youth in Zambia. The system was built using React 18 for the frontend, Node.js and Express for the backend API, and SQLite as the database. It provides youth learners with access to three digital-skills courses — System Analysis and Design, Web Development, and Operating Systems — each containing three modules with quizzes and a final assignment.

The platform supports full learner workflows including NRC-validated registration, course enrolment, module study, quiz assessment, assignment submission, progress tracking, and certificate issuance. Administrators manage the platform through a dedicated portal where they can view registered youth, track completions, grade assignments, and approve certificate payment proofs. Email notifications are sent to the administrator when payment proof is submitted.

The system was implemented as a prototype and tested locally. It demonstrates how web technologies can deliver structured learning content, track learner progress, and issue verifiable digital certificates, serving as a foundation for a broader youth digital empowerment initiative.

**Keywords:** digital skills, learning management system, youth empowerment, React, Node.js, SQLite, certificates, Zambia

---

## TABLE OF CONTENTS

- Declaration
- Approval
- Dedication
- Acknowledgements
- Abstract
- List of Figures
- List of Tables
- List of Abbreviations
- Chapter 1 — Introduction
- Chapter 2 — Literature Review
- Chapter 3 — Requirements Specification / Success Criteria
- Chapter 4 — Design Specification
- Chapter 5 — Testing
- Chapter 6 — Implementation
- Chapter 7 — Conclusion and Recommendations
- References
- Appendices
  - Appendix A: Installation Manual
  - Appendix B: User Manual
  - Appendix C: Project Proposal
  - Appendix D: Technical Report (Source Code Summary)

---

## LIST OF FIGURES

1. Figure 3.1 — System Architecture Diagram
2. Figure 3.2 — Use Case Diagram
3. Figure 3.3 — Context Diagram (Level 0 DFD)
4. Figure 3.4 — Entity-Relationship Diagram
5. Figure 3.5 — Authentication Flow Diagram
6. Figure 3.6 — Course Enrolment and Completion Flow
7. Figure 3.7 — Certificate Payment Flow
8. Figure 3.8 — Assignment Submission and Grading Flow

---

## LIST OF TABLES

1. Table 1.1 — Project Budget
2. Table 1.2 — Cost Benefit Analysis
3. Table 1.3 — Gantt Chart (Project Plan)
4. Table 3.1 — Functional Requirements
5. Table 3.2 — Non-Functional Requirements
6. Table 3.3 — User Roles and Responsibilities
7. Table 4.1 — Database Tables and Purpose
8. Table 4.2 — Users Table Data Dictionary
9. Table 4.3 — API Endpoint Summary
10. Table 5.1 — Test Plan
11. Table 5.2 — Test Report

---

## LIST OF ABBREVIATIONS

| Abbreviation | Meaning |
|---|---|
| API | Application Programming Interface |
| CSS | Cascading Style Sheets |
| DFD | Data Flow Diagram |
| ERD | Entity-Relationship Diagram |
| HTML | HyperText Markup Language |
| HTTP | HyperText Transfer Protocol |
| ICT | Information and Communication Technology |
| JSON | JavaScript Object Notation |
| JWT | JSON Web Token |
| LMS | Learning Management System |
| NRC | National Registration Card |
| PDF | Portable Document Format |
| REST | Representational State Transfer |
| SDLC | Systems Development Life Cycle |
| SPA | Single Page Application |
| SQL | Structured Query Language |
| UI | User Interface |
| URL | Uniform Resource Locator |
| UX | User Experience |
| ZMW | Zambian Kwacha |

---

# CHAPTER 1 — INTRODUCTION

## 1a. Introduction

The rapid growth of information and communication technology has transformed the way people learn, work, and communicate. Digital skills have become a fundamental requirement for participation in the modern economy. In Zambia, however, many young people lack access to structured digital education that would equip them with the technical knowledge needed for employment and entrepreneurship.

This project proposes and implements the YouthSkills Program — a web-based digital-skills learning platform designed to deliver structured course content, track learner progress, and issue verifiable certificates of completion to youth learners. The system targets young Zambians who wish to develop practical knowledge in system analysis, web development, and operating systems.

The platform was developed as a final year Computer Science project at Evelyn Hone College, School of Business Studies and Management.

## 1b. Background — Description of the Existing System

Prior to the development of the YouthSkills Program, the Youth Empowerment Program at Evelyn Hone College managed its digital skills training through a combination of paper-based records, manual attendance sheets, and physical certificates. The existing approach had the following characteristics:

- Course materials were distributed as printed handouts or shared informally via messaging applications.
- Learner progress was tracked manually by trainers using paper registers.
- Assessments were conducted on paper and marked by hand.
- Certificates were printed and signed manually, with no mechanism for public verification.
- There was no centralised record of who had completed which course.
- Administrative tasks such as reviewing submissions and approving certificates were time-consuming and prone to human error.
- No digital evidence of learning outcomes was available for learners to share with potential employers.

These limitations made it difficult to scale the programme, verify certificates reliably, and provide learners with timely feedback on their progress.

## 1c. Objectives

The objectives of the YouthSkills Program are:

1. To develop a web-based platform that allows youth learners to register using their NRC number and access structured digital-skills courses.
2. To implement a module-based learning system with multiple-choice quizzes and a minimum pass mark of 60%.
3. To provide a text-based assignment submission system with administrator grading and feedback.
4. To automatically issue digital certificates upon successful completion of all course modules.
5. To implement a certificate payment verification workflow where learners submit mobile money proof and administrators approve or reject it.
6. To provide an administrator portal for managing youth accounts, viewing completions, grading assignments, and approving payments.
7. To send email notifications to the administrator when payment proof is submitted.
8. To enable public verification of issued certificates by certificate number.

## 1d. Problem Statement

The Youth Empowerment Program at Evelyn Hone College currently lacks a digital system for managing course delivery, tracking learner progress, and issuing verifiable certificates. The manual processes in place are inefficient, difficult to scale, and do not provide learners with a digital record of their achievements. As a result, youth who complete training have no portable, verifiable proof of their skills that can be shared with employers or institutions. A web-based learning platform is needed to address these gaps and improve the quality and reach of youth digital skills training.

## 1e. Proposed System

The proposed YouthSkills Program is a browser-based learning platform with the following capabilities:

- **Youth Registration** — Learners register with their full name, NRC number, email address, and password. The NRC number is validated for format and uniqueness, ensuring only registered Zambian citizens can enrol.
- **Course Library** — Three courses are available: System Analysis and Design, Web Development, and Operating Systems. Each course has three modules, one quiz per module, and one final assignment.
- **Learning and Assessment** — Learners study module content, take multiple-choice quizzes (requiring 60% to pass), and submit a final text assignment for each course.
- **Progress Tracking** — A dashboard shows enrolled courses, completed modules, progress percentages, and earned certificates.
- **Certificate Issuance** — A digital certificate with a unique number is automatically issued when all modules are completed. The certificate includes the learner's name, NRC, course, date, and a public verification link.
- **Payment and Download** — Learners submit mobile money payment proof (2,000 ZMW to 0970342178). The administrator reviews the proof and approves or rejects it. On approval, the learner downloads the PDF certificate.
- **Admin Portal** — Administrators access a dedicated portal with tabs for Overview, Registered Youth, Completions, Modules, Assignments (grading), and Payments (approval). Email notifications are sent when payment proof is submitted.

## 1f. Budget

**Table 1.1 — Project Budget**

| Item | Estimated Cost (ZMW) |
|---|---|
| Internet data (research and development) | 500.00 |
| Laptop use / electricity | 300.00 |
| Printing and binding of project report | 400.00 |
| Domain name (future deployment) | 600.00 |
| Cloud hosting (future deployment, 1 year) | 1,200.00 |
| Contingency (10%) | 300.00 |
| **Total** | **3,300.00** |

*Note: Software development tools used (VS Code, Node.js, React, SQLite) are open source and free of charge.*

## 1g. Cost Benefit Analysis

**Table 1.2 — Cost Benefit Analysis**

| Cost | Amount (ZMW) | Benefit | Value |
|---|---|---|---|
| Development and running costs | 3,300.00 | Elimination of manual record-keeping | High |
| Administrator time (reduced) | — | Faster certificate processing | High |
| Printing costs (reduced) | ~1,000/year saved | Digital certificates at no print cost | Medium |
| — | — | Scalable to more courses and learners | High |
| — | — | Verifiable certificates for employment | High |
| — | — | 24/7 learner access to content | High |

The system delivers significant benefits relative to its low development cost. The primary return on investment is the ability to reach more youth learners, reduce administrative overhead, and provide verifiable digital credentials that improve learner employability.

## 1h. Project Plan — Gantt Chart

**Table 1.3 — Gantt Chart**

| Task | Week 1 | Week 2 | Week 3 | Week 4 | Week 5 | Week 6 | Week 7 | Week 8 |
|---|---|---|---|---|---|---|---|---|
| Requirements gathering | ✓ | ✓ | | | | | | |
| System design (ERD, DFD, UI) | | ✓ | ✓ | | | | | |
| Backend development | | | ✓ | ✓ | ✓ | | | |
| Frontend development | | | | ✓ | ✓ | ✓ | | |
| Integration and testing | | | | | | ✓ | ✓ | |
| Documentation | | | | | | | ✓ | ✓ |
| Final review and submission | | | | | | | | ✓ |

## 1i. Conclusion

This chapter introduced the YouthSkills Program, described the limitations of the existing manual training system, outlined the objectives of the proposed solution, and provided a budget and project plan. The proposed system addresses the identified problem by providing a web-based platform for digital skills training, progress tracking, and certificate management. The following chapters describe the literature review, requirements, design, testing, and implementation of the system.

---

# CHAPTER 2 — LITERATURE REVIEW

## 2.1 Introduction

This chapter reviews two existing systems similar to the YouthSkills Program. The purpose of the review is to understand how comparable systems have addressed the challenge of digital learning management, identify their strengths and weaknesses, and justify the design decisions made in the YouthSkills Program.

## 2.2 System 1 — Moodle (Learning Management System)

**Overview**

Moodle is a free, open-source Learning Management System first released in 2002 by Martin Dougiamas. It is used by universities, colleges, and schools worldwide, including institutions in Zambia such as the University of Zambia (UNZA). Moodle provides a web-based environment for creating courses, managing enrolments, delivering assessments, tracking progress, and issuing completion records (Moodle, n.d.).

**Key Features**

- Course creation with text, video, and file resources
- Multiple assessment types including quizzes, assignments, and forums
- Learner progress tracking and grade book
- Roles: student, teacher, administrator, and manager
- Certificate plugins for completion records
- Email notifications for key events
- Multi-language support

**Comparison with YouthSkills Program**

| Feature | Moodle | YouthSkills Program |
|---|---|---|
| Course delivery | Yes — highly configurable | Yes — structured, fixed curriculum |
| Quizzes | Yes — multiple types | Yes — multiple choice, 60% pass mark |
| Assignment submission | Yes — text and file | Yes — text only |
| Certificates | Via plugin | Built in, with payment workflow |
| NRC requirement | No | Yes — Zambian identity validation |
| Mobile money payment | No | Yes — 2,000 ZMW via mobile money |
| Deployment complexity | High — requires server, PHP, MySQL | Low — Node.js, SQLite, single machine |
| Cost | Free but requires hosting | Free, locally deployable |

**Assessment**

Moodle is a mature and feature-rich system well suited to large institutions. However, its complexity makes it difficult to deploy and customise for a small community programme. It does not include NRC validation or a mobile money payment workflow, both of which are specific to the Zambian context. YouthSkills Program is a lightweight alternative tailored to the specific needs of the Youth Empowerment Programme.

*Source: Moodle (n.d.). About Moodle. Retrieved from https://moodle.org/about/*

## 2.3 System 2 — Google Classroom

**Overview**

Google Classroom is a free web service developed by Google as part of Google Workspace for Education. It was launched in 2014 and is widely used in secondary schools and colleges to distribute assignments, collect submissions, and communicate with learners (Google, n.d.). Several schools in Lusaka use Google Classroom for remote learning activities.

**Key Features**

- Assignment creation and submission
- Grading and feedback through a built-in grade book
- Announcements and class-level communication
- Integration with Google Drive, Docs, and Meet
- Learner progress overview for teachers
- Mobile app available

**Comparison with YouthSkills Program**

| Feature | Google Classroom | YouthSkills Program |
|---|---|---|
| Course structure | Streams and topics | Module-based courses |
| Quizzes | Via Google Forms | Built-in with automatic scoring |
| Certificates | Not available | Built-in with PDF download |
| Progress tracking | Basic | Module and course-level progress bars |
| NRC identity | No | Yes |
| Payment workflow | No | Yes — mobile money proof and approval |
| Internet dependency | Full — requires Google account | Local deployment possible |
| Admin portal | Basic teacher view | Full admin dashboard with 6 tabs |

**Assessment**

Google Classroom is easy to use but requires a Google account and constant internet access. It does not provide a built-in quiz assessment engine, certificate issuance, or payment workflow. It is a collaboration and assignment tool rather than a self-contained learning platform. YouthSkills Program offers a more complete end-to-end learning experience without dependency on third-party services.

*Source: Google (n.d.). Google Classroom. Retrieved from https://classroom.google.com*

## 2.4 Summary

Both Moodle and Google Classroom demonstrate that web-based learning platforms can improve the delivery of educational content and reduce manual administrative work. However, neither system addresses the specific requirements of the YouthSkills Programme — namely NRC-based identity verification, mobile money payment proof submission, and a lightweight locally deployable architecture appropriate for the Zambian institutional context. The YouthSkills Program fills this gap by combining the core features of an LMS with a payment workflow and identity validation specific to Zambia.

---

# CHAPTER 3 — REQUIREMENTS SPECIFICATION / SUCCESS CRITERIA

## 3.1 Introduction

This chapter describes the functional and non-functional requirements of the YouthSkills Program, the user roles, and the fact-finding methods used to gather information during the analysis phase.

## 3.2 Fact-Finding Methods

The following methods were used to gather requirements for the system:

**a) Interviews**
Informal interviews were conducted with prospective youth learners and a programme coordinator to understand what features would be most useful, what difficulties they experienced with the current manual system, and what information they expected the system to capture.

**b) Observation**
The current manual process of recording learner attendance, distributing materials, and issuing certificates was observed. This revealed inefficiencies in record retrieval, the absence of a progress tracking mechanism, and the time taken to produce and verify paper certificates.

**c) Document Analysis**
Existing programme materials including course outlines, attendance registers, and sample certificates were reviewed. This informed the design of the course and module structure and the certificate template.

## 3.3 Functional Requirements

**Table 3.1 — Functional Requirements**

| ID | Requirement | Status |
|---|---|---|
| FR-01 | The system shall allow a youth to register with name, NRC number, email, and password | Implemented |
| FR-02 | The system shall validate the NRC format (123456/78/9) and reject duplicate NRCs | Implemented |
| FR-03 | The system shall allow registered users to sign in and access protected pages | Implemented |
| FR-04 | The system shall allow an authenticated user to view and update their profile | Implemented |
| FR-05 | The system shall display published courses with category, level, and search filters | Implemented |
| FR-06 | The system shall allow a youth to enrol once in a published course | Implemented |
| FR-07 | The system shall display module content to enrolled learners | Implemented |
| FR-08 | The system shall allow a youth to submit quiz answers and receive an immediate score | Implemented |
| FR-09 | The system shall require a minimum quiz score of 60% to complete a module | Implemented |
| FR-10 | The system shall record module completion and calculate course progress | Implemented |
| FR-11 | The system shall allow a youth to submit a text assignment for each course | Implemented |
| FR-12 | The system shall allow an administrator to grade assignments and provide feedback | Implemented |
| FR-13 | The system shall automatically issue a certificate when all modules are completed | Implemented |
| FR-14 | The system shall allow a youth to submit mobile money payment proof | Implemented |
| FR-15 | The system shall allow an administrator to approve or reject payment proof | Implemented |
| FR-16 | The system shall unlock the certificate PDF download after payment approval | Implemented |
| FR-17 | The system shall send an email notification to the admin when payment proof is submitted | Implemented |
| FR-18 | The system shall provide a public endpoint to verify a certificate by certificate number | Implemented |
| FR-19 | The system shall provide an admin dashboard with youth list, completions, assignments, and payments | Implemented |
| FR-20 | The system shall support password change and token-based password reset | Implemented |

## 3.4 Non-Functional Requirements

**Table 3.2 — Non-Functional Requirements**

| ID | Requirement | Status |
|---|---|---|
| NFR-01 | The system shall hash all passwords using bcryptjs before storing them | Implemented |
| NFR-02 | The system shall use JWT tokens to authenticate API requests | Implemented |
| NFR-03 | The system shall respond to page loads within 3 seconds on a local network | Met |
| NFR-04 | The system shall be accessible from any modern browser without plugins | Met |
| NFR-05 | The system UI shall support both light and dark display modes | Implemented |
| NFR-06 | The system shall validate all form inputs on both the frontend and backend | Implemented |
| NFR-07 | The system shall use parameterised SQL queries to prevent SQL injection | Implemented |
| NFR-08 | The system shall restrict admin functions to accounts with the admin role | Implemented |
| NFR-09 | The system shall produce a responsive layout that works on tablet and desktop browsers | Implemented |
| NFR-10 | The system source code shall be version-controlled using Git | Implemented |

## 3.5 User Roles and Responsibilities

**Table 3.3 — User Roles and Responsibilities**

| Role | Responsibilities |
|---|---|
| Youth Learner | Register, sign in, manage profile, browse courses, enrol, study modules, take quizzes, submit assignments, view progress, submit payment proof, download certificate |
| Administrator | Sign in via admin portal, view overview stats, search registered youth, view completions, browse modules, grade assignments, approve/reject payments |
| Public Visitor | View landing page, verify a certificate by certificate number (no account required) |

## 3.6 Success Criteria

The system will be considered successful if:

1. A youth can register, enrol in a course, complete all modules, and earn a certificate without administrator intervention.
2. The administrator can view all submissions, grade them, and approve payments from the dashboard.
3. Certificates can be publicly verified using only the certificate number.
4. The administrator receives an email notification when payment proof is submitted.
5. All form validation prevents invalid data from being saved.
6. The system runs correctly on a local machine using two terminal windows.

---

# CHAPTER 4 — DESIGN SPECIFICATION

## 4.1 Introduction

This chapter describes the data design, application design, user interface design, and security design of the YouthSkills Program. All diagrams are described in Mermaid format in the companion diagrams file (`YouthSkills-Program-Diagrams.md`).

## 4.2 Data Design

### 4.2.1 Entity-Relationship Diagram

The database consists of twelve tables. The ERD (Figure 3.4) shows all entities, attributes, and relationships with their cardinalities.

**Primary Entities:**

- **USERS** — stores youth and admin accounts including NRC, hashed password, profile fields, and skills
- **COURSES** — stores course metadata and instructor display information
- **MODULES** — stores learning units belonging to a course, ordered by `order_index`
- **QUIZZES** — stores multiple-choice questions linked to modules
- **ENROLLMENTS** — records the association between a user and a course
- **MODULE_PROGRESS** — records per-module completion, quiz score, and timestamp
- **ASSIGNMENTS** — stores the final assignment task per course
- **ASSIGNMENT_SUBMISSIONS** — stores learner text responses, grades, and feedback
- **CERTIFICATES** — stores issued certificates with unique certificate numbers
- **CERTIFICATE_PAYMENTS** — stores payment proof submissions and approval status
- **NOTIFICATIONS** — stores in-app messages for users
- **PASSWORD_RESETS** — stores token-based reset requests

### 4.2.2 Database Tables

**Table 4.1 — Database Tables and Purpose**

| Table | Primary Key | Purpose |
|---|---|---|
| users | id (UUID) | Learner and admin accounts |
| courses | id (UUID) | Course catalogue |
| modules | id (UUID) | Course learning units |
| quizzes | id (UUID) | Module quiz questions |
| enrollments | id (UUID) | User-course membership |
| module_progress | id (UUID) | Per-module completion records |
| assignments | id (UUID) | Final course assignments |
| assignment_submissions | id (UUID) | Learner assignment responses |
| certificates | id (UUID) | Issued completion certificates |
| certificate_payments | id (UUID) | Payment proof records |
| notifications | id (UUID) | In-app user notifications |
| password_resets | id (UUID) | Password reset tokens |

### 4.2.3 Data Dictionary — Users Table

**Table 4.2 — Users Table Data Dictionary**

| Field | Type | Constraints | Description |
|---|---|---|---|
| id | TEXT | PRIMARY KEY | UUID assigned at registration |
| name | TEXT | NOT NULL | Full name; letters only |
| email | TEXT | UNIQUE, NOT NULL | Sign-in identifier; stored lowercase |
| password | TEXT | NOT NULL | bcryptjs hash; never returned to client |
| role | TEXT | DEFAULT 'youth' | Either 'youth' or 'admin' |
| nrc | TEXT | UNIQUE | Zambian NRC; format 123456/78/9 |
| avatar | TEXT | NULL | Profile image URL |
| bio | TEXT | NULL | Personal biography |
| location | TEXT | NULL | City and country |
| phone | TEXT | NULL | Mobile number |
| skills | TEXT | DEFAULT '[]' | JSON array of skill strings |
| created_at | DATETIME | DEFAULT NOW | Account creation timestamp |
| updated_at | DATETIME | DEFAULT NOW | Last update timestamp |

### 4.2.4 Relationships and Cardinalities

- One COURSE has many MODULES (1:N)
- One MODULE has many QUIZZES (1:N)
- One USER makes many ENROLLMENTS; one COURSE receives many ENROLLMENTS (M:N resolved by ENROLLMENTS table)
- One USER has many MODULE_PROGRESS records; one MODULE is tracked in many MODULE_PROGRESS records (M:N resolved)
- One COURSE includes one ASSIGNMENT; one MODULE is linked to one ASSIGNMENT (1:1 in current seed)
- One ASSIGNMENT receives many ASSIGNMENT_SUBMISSIONS; one USER submits many ASSIGNMENT_SUBMISSIONS (M:N resolved)
- One USER earns many CERTIFICATES; one COURSE certifies many USERS (M:N resolved)
- One CERTIFICATE has one CERTIFICATE_PAYMENT proof record (1:1)
- One USER receives many NOTIFICATIONS (1:N)
- One USER requests many PASSWORD_RESETS (1:N)

## 4.3 Application Design

### 4.3.1 System Architecture

The system follows a three-tier client/server architecture:

1. **Presentation Tier** — React 18 single-page application served by Vite on port 3000. Handles routing, UI rendering, and user interaction.
2. **Application Tier** — Node.js and Express REST API on port 5000. Handles business logic, authentication, and data access.
3. **Data Tier** — SQLite database stored as a local file. Accessed exclusively by the API layer.

During development, Vite proxies all `/api` requests to port 5000, so the frontend and backend are treated as a single origin.

*(See Figure 3.1 — System Architecture Diagram)*

### 4.3.2 Application Flow

**Registration and Login**
A new user visits the landing page, clicks Get Started, completes the registration form (including NRC), and is issued a JWT token stored in browser storage. Subsequent requests attach the token as a Bearer header.

**Learning Flow**
After login, the learner browses courses, enrolls, studies module content, submits quiz answers (receiving an immediate score), and progresses to the next module. On completing all modules the system automatically issues a certificate and redirects the learner to the Certificates page.

**Certificate Download Flow**
The learner submits mobile money payment proof. The admin receives an in-app and email notification. After verifying the reference and approving, the learner's PDF download button unlocks.

*(See Figures 3.6 and 3.7)*

### 4.3.3 API Design

The API follows REST conventions. All endpoints return JSON. Authentication uses `Authorization: Bearer <token>` headers.

**Table 4.3 — API Endpoint Summary (key routes)**

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| POST | /api/auth/register | Public | Create youth account |
| POST | /api/auth/login | Public | Authenticate and return JWT |
| GET | /api/courses | Authenticated | List published courses |
| POST | /api/courses/:id/enroll | Youth | Enrol in course |
| POST | /api/progress/quiz/:moduleId/submit | Youth | Submit quiz answers |
| POST | /api/progress/module/:moduleId/complete | Youth | Mark module complete |
| POST | /api/assignments/:id/submit | Youth | Submit assignment text |
| GET | /api/certificates/my | Authenticated | View own certificates |
| GET | /api/certificates/verify/:certNumber | Public | Verify certificate |
| POST | /api/payments/certificate/:certId/submit | Youth | Submit payment proof |
| PUT | /api/payments/:paymentId/approve | Admin | Approve payment |
| PUT | /api/assignments/submission/:id/grade | Admin | Grade assignment |
| GET | /api/dashboard/admin | Admin | Admin stats and completions |

## 4.4 User Interface Design

### 4.4.1 Design Principles

The user interface was designed following these principles:

1. **Consistency** — the same layout, colour scheme, typography, and component styles are used throughout the application.
2. **Simplicity** — only the controls relevant to the current action are shown on each page.
3. **Feedback** — toast notifications confirm all user actions (enrollment, quiz submission, assignment submission, payment submission).
4. **Accessibility** — semantic HTML elements, labelled form inputs, and sufficient colour contrast are used throughout.
5. **Responsiveness** — Tailwind CSS utility classes ensure the layout adapts to tablet and desktop screen sizes.

### 4.4.2 Colour Scheme and Typography

- **Primary colour:** Blue (#2563eb) — used for buttons, active navigation items, and accents
- **Certificate colour:** Light green (#16a34a) — used exclusively on the certificate PDF
- **Background:** Slate-50 (light mode), Slate-900 (dark mode)
- **Font:** Inter (Google Fonts), system-ui fallback
- **Dark mode:** Toggled by the user; preference stored in localStorage

### 4.4.3 Key Screens

- **Landing Page** — hero section, statistics bar, features grid, how-it-works steps, call-to-action
- **Register Page** — full registration form with NRC field, inline validation on all fields
- **Dashboard (Youth)** — stat cards, course progress bars, recent certificates panel
- **Dashboard (Admin)** — 6-tab portal: Overview, Registered Youth, Completions, Modules, Assignments, Payments
- **Course Detail Page** — course header, progress bar, expandable module accordions with content, quiz, and assignment sections
- **Certificates Page** — certificate cards with payment panel showing mobile money number and reference input
- **Profile Page** — editable personal information including NRC; password change tab

### 4.4.4 Navigation

- **Sidebar** — fixed left navigation visible on desktop; accessible via hamburger menu on mobile
- **Youth navigation:** Dashboard, Courses, Certificates, Profile
- **Admin navigation:** Dashboard, Profile
- **Top bar** — dark mode toggle, notification bell with unread badge, welcome message

## 4.5 Security Design

### 4.5.1 Authentication

- All passwords are hashed using bcryptjs with a cost factor of 12 before storage. Plaintext passwords are never stored or returned.
- JWT tokens are signed using a secret key defined in the backend environment configuration. Tokens expire after 7 days.
- The `authenticate` middleware verifies the token, reloads the user from the database, and attaches the user object to the request.

### 4.5.2 Authorisation

- The `authorize(...roles)` middleware checks the loaded user's role against the permitted roles for each route.
- Admin-only routes (grading, payment approval, user listing) return 403 Forbidden if accessed by non-admin accounts.
- The regular login page blocks admin accounts and redirects them to the dedicated admin login URL.

### 4.5.3 Input Validation

- All form inputs are validated on the frontend (format checks, required fields, inline error messages) and again on the backend (same rules applied server-side before any database write).
- NRC format is validated with a regular expression (`/^[0-9]{6}\/[0-9]{2}\/[0-9]$/`).
- SQL queries use parameterised statements (via the `sqlite` package) to prevent SQL injection.

### 4.5.4 Data Protection

- The backend `.env` file containing the JWT secret, Gmail credentials, and other configuration values is excluded from version control via `.gitignore`.
- The database file is a local SQLite file and is not exposed through the API.
- The CORS policy restricts browser requests to the configured frontend origin only.

---

# CHAPTER 5 — TESTING

## 5.1 Introduction

This chapter presents the test data, test plan, and test results for the YouthSkills Program. Testing was conducted manually by the developer on a local development machine running Windows 11. The frontend was accessed through Google Chrome. Both the backend and frontend servers were running simultaneously during all tests.

## 5.2 Test Environment

- **Operating System:** Windows 11
- **Browser:** Google Chrome (latest)
- **Backend URL:** http://localhost:5000
- **Frontend URL:** http://localhost:3000
- **Database:** SQLite (local file — database.sqlite)
- **Test accounts:** Admin (admin@youthskills.com), Youth (registered during testing)

## 5.3 Test Data

The following test data was used:

- **Admin account:** admin@youthskills.com / Allan7034
- **Youth test account:** testuser@gmail.com / Test1234 / NRC: 123456/78/1
- **Invalid NRC:** 99999 (should be rejected)
- **Invalid email:** notanemail (should be rejected)
- **Quiz answers:** Correct and incorrect combinations submitted to verify scoring
- **Assignment text:** A minimum 20-character submission used to test the submit flow
- **Payment reference:** TXN-TEST-001 used as a mock transaction reference

## 5.4 Test Plan

**Table 5.1 — Test Plan**

| Test ID | Module | Test Description | Input | Expected Result |
|---|---|---|---|---|
| T-01 | Registration | Register with valid data including NRC | Valid name, email, NRC, password | Account created; redirected to dashboard |
| T-02 | Registration | Register with invalid NRC format | NRC: 99999 | Error: "Invalid NRC format" |
| T-03 | Registration | Register with duplicate email | Existing email | Error: "Email already registered" |
| T-04 | Registration | Register with duplicate NRC | Existing NRC | Error: "NRC already registered" |
| T-05 | Login | Login with correct credentials | Valid email and password | JWT issued; dashboard loaded |
| T-06 | Login | Login with wrong password | Valid email, wrong password | Error: "Invalid email or password" |
| T-07 | Login | Admin login via regular login page | Admin credentials | Redirected to admin login page |
| T-08 | Courses | Browse courses | Authenticated youth | Course list displayed with filters |
| T-09 | Enrolment | Enrol in a course | Click Enrol Now | Enrolment created; modules unlock |
| T-10 | Quiz | Submit quiz with score ≥ 60% | Correct answers | Module marked complete; progress updated |
| T-11 | Quiz | Submit quiz with score < 60% | Incorrect answers | Fail message; retry button shown |
| T-12 | Assignment | Submit assignment text | 50-character text | Status: Awaiting Grading |
| T-13 | Assignment | Submit assignment with < 20 characters | 10-character text | Error: "Submission must be at least 20 characters" |
| T-14 | Certificate | Complete all 3 modules | Pass all 3 quizzes | Certificate issued; redirected to Certificates page |
| T-15 | Payment | Submit payment proof | Valid reference text | Status: Pending; admin notified |
| T-16 | Payment | Admin approves payment | Click Approve | Certificate PDF download unlocked |
| T-17 | Payment | Admin rejects payment | Click Reject with reason | Learner notified; resubmit enabled |
| T-18 | Certificate | Download PDF | Click PDF button (approved) | PDF generated and downloaded |
| T-19 | Verification | Verify certificate publicly | Valid certificate number | Certificate details displayed |
| T-20 | Verification | Verify invalid certificate | Random string | "Certificate not found" message |
| T-21 | Admin | Grade assignment | Enter grade and feedback | Grade saved; learner notified |
| T-22 | Admin | View completions tab | Click Completions tab | Table of completed students shown |
| T-23 | Profile | Update profile with NRC | Valid NRC | Profile saved |
| T-24 | Dark mode | Toggle dark mode | Click moon/sun icon | Theme switches; preference saved |
| T-25 | Password reset | Request password reset | Valid email | Reset link logged to console |

## 5.5 Test Report

**Table 5.2 — Test Report**

| Test ID | Result | Notes |
|---|---|---|
| T-01 | PASS | Account created successfully |
| T-02 | PASS | Inline error shown and form blocked |
| T-03 | PASS | Backend returned 409 conflict |
| T-04 | PASS | Backend returned 409 conflict |
| T-05 | PASS | JWT stored; dashboard loaded |
| T-06 | PASS | Error toast displayed |
| T-07 | PASS | Redirected to /admin/login |
| T-08 | PASS | Courses displayed with working filters |
| T-09 | PASS | Modules unlocked after enrolment |
| T-10 | PASS | Module marked complete; progress bar updated |
| T-11 | PASS | Retry quiz button shown |
| T-12 | PASS | Awaiting Grading status displayed |
| T-13 | PASS | Error toast shown; submission blocked |
| T-14 | PASS | Certificate issued; auto-redirect to Certificates page |
| T-15 | PASS | Pending status shown; admin notification created |
| T-16 | PASS | PDF download button unlocked |
| T-17 | PASS | Learner notified; payment form reopened |
| T-18 | PASS | PDF downloaded with correct name, NRC, course, and green design |
| T-19 | PASS | Certificate details displayed on public verify page |
| T-20 | PASS | Not found message displayed |
| T-21 | PASS | Grade and feedback saved; learner notification sent |
| T-22 | PASS | Completions table displayed with student names and courses |
| T-23 | PASS | Profile updated with new NRC |
| T-24 | PASS | Dark mode toggled; preference persisted on refresh |
| T-25 | PASS | Reset link printed to backend console |

All 25 test cases passed. No critical failures were identified during testing.

---

# CHAPTER 6 — IMPLEMENTATION

## 6.1 Introduction

This chapter describes how the YouthSkills Program was implemented, the tools and technologies used, the challenges encountered, and suggestions for future deployment.

## 6.2 How the System Was Implemented

The YouthSkills Program was implemented as a local prototype running on a single development machine. The implementation followed these steps:

**Step 1 — Environment Setup**
Node.js (LTS) and npm were installed on a Windows 11 laptop. Visual Studio Code was used as the development environment. Git was used for version control, with the repository hosted on GitHub at `https://github.com/allandabalidabz-arch/Youth-skills-platform`.

**Step 2 — Database Design and Backend**
The SQLite database schema was designed first, covering all twelve tables. The Express backend was built with separate route files for each functional area. JWT authentication middleware was implemented to protect all non-public endpoints. Bcryptjs was used to hash passwords at registration and verify them at login.

**Step 3 — Seed Data**
A seed script was written to populate the database with one admin account, three courses, nine modules, nine quizzes, and three assignments on first run. The seed script runs automatically when the backend detects an empty database.

**Step 4 — Frontend Development**
The React frontend was built using Vite as the build tool and Tailwind CSS for styling. React Router v6 was used for client-side navigation. Axios was configured with request and response interceptors for token attachment and 401 handling. All pages were built as functional components using React hooks.

**Step 5 — Integration**
The Vite development server was configured to proxy `/api` requests to the Express backend on port 5000. This allowed the frontend and backend to be developed and tested together without CORS issues in development.

**Step 6 — Testing and Refinement**
The system was tested manually using the test plan in Chapter 5. Issues identified during testing were corrected, including fixing a blank dashboard caused by a stale JWT token, correcting assignment status display logic, and adding the NRC field to the registration and profile flows.

**Step 7 — Documentation**
All documentation was written in Markdown and committed to the repository in the `docs/` folder.

## 6.3 Implementation Status

The following features were fully implemented and tested:

- Youth registration with NRC validation
- JWT authentication and role-based access control
- Three complete courses with modules, quizzes, and assignments
- Module completion, quiz scoring, and course progress tracking
- Automatic certificate issuance on course completion
- Certificate PDF generation (green design, single logo, NRC on certificate)
- Mobile money payment proof submission and admin approval workflow
- Email notification to admin on payment submission (requires Gmail App Password configuration)
- Admin dashboard with six management tabs
- Public certificate verification
- Dark mode, notifications, and profile management

## 6.4 Suggestions for Future Implementation

The following improvements are recommended for a production deployment:

1. **Email delivery for password resets** — integrate an email provider (e.g. SendGrid or Gmail SMTP) to send password reset links, replacing the current console-log approach.
2. **Server-side quiz scoring** — move quiz answer keys to the server only, calculate the score entirely server-side, and reject client-submitted scores to prevent manipulation.
3. **Database migration to PostgreSQL** — replace SQLite with PostgreSQL for concurrent multi-user production use.
4. **Cloud deployment** — deploy the backend to a cloud server (e.g. Railway, Render, or a VPS) and the frontend to Vercel or Netlify.
5. **File upload for assignments** — implement file attachment support for assignment submissions using multer (already installed as a dependency).
6. **Course authoring interface** — build an admin screen for creating and editing courses, modules, and quizzes without requiring developer access.
7. **Mobile application** — develop a React Native or Progressive Web App version for mobile learners with limited desktop access.
8. **Integration with TEVETA** — explore integration with the Technical Education, Vocational and Entrepreneurship Training Authority for nationally recognised certificate records.

---

# CHAPTER 7 — CONCLUSION AND RECOMMENDATIONS

## 7.1 Conclusion

The YouthSkills Program has been successfully designed, implemented, and tested as a web-based digital-skills learning platform for youth empowerment. The system addresses the limitations of the existing manual training approach by providing a centralised, digital environment for course delivery, progress tracking, and certificate management.

All twenty functional requirements were implemented and all twenty-five test cases passed. The platform supports the complete learner journey from registration through course completion, certificate issuance, payment proof submission, and PDF download. The administrator portal provides full visibility over registered youth, course completions, assignment submissions, and payment records.

The system demonstrates that modern web technologies — React, Node.js, Express, and SQLite — can be used to build a functional, secure, and visually polished learning management system at low cost and with a small development team. The use of NRC validation and mobile money payment proof submission makes the platform specifically relevant to the Zambian context.

The project met its stated objectives and success criteria. It is suitable for demonstration and pilot use within the Youth Empowerment Programme at Evelyn Hone College.

## 7.2 Recommendations

1. **Conduct a user acceptance test** with a group of real youth learners and an administrator to gather feedback before any formal launch.
2. **Add automated testing** using a test framework such as Jest and React Testing Library to ensure system reliability across future changes.
3. **Implement email delivery for password resets** to make the password recovery process fully functional without developer intervention.
4. **Deploy to a cloud server** to make the system accessible beyond the local development machine, enabling learners to access it from home or community centres.
5. **Add more courses** as the programme grows, using the existing course structure as a template.
6. **Implement server-side assessment scoring** to improve quiz integrity before the system is used for any consequential certification.
7. **Explore integration with the Zambia Qualifications Authority (ZQA)** or TEVETA to give the YouthSkills certificates greater formal recognition.

---

# REFERENCES

Anderson, T. (2008). *The theory and practice of online learning* (2nd ed.). Athabasca University Press.

Bates, A. W. (2019). *Teaching in a digital age: Guidelines for designing teaching and learning* (2nd ed.). Tony Bates Associates Ltd. Retrieved from https://opentextbc.ca/teachinginadigitalage/

Google. (n.d.). *Google Classroom*. Retrieved from https://classroom.google.com

Moodle. (n.d.). *About Moodle*. Retrieved from https://moodle.org/about/

Mozilla Developer Network. (2024). *HTTP — MDN Web Docs*. Retrieved from https://developer.mozilla.org/en-US/docs/Web/HTTP

OWASP Foundation. (2021). *OWASP Top Ten*. Retrieved from https://owasp.org/www-project-top-ten/

React. (2024). *React documentation*. Retrieved from https://react.dev

SQLite. (2024). *About SQLite*. Retrieved from https://www.sqlite.org/about.html

Watson, W. R., & Watson, S. L. (2007). An argument for clarity: What are learning management systems, what are they not, and what should they become? *TechTrends, 51*(2), 28–34.

---

# APPENDICES

---

## APPENDIX A — INSTALLATION MANUAL

### A.1 Prerequisites

Before installing the YouthSkills Program, ensure the following are installed on your computer:

1. **Node.js** (LTS version) — download from https://nodejs.org
2. **npm** — included with Node.js
3. **Git** — download from https://git-scm.com (optional, for cloning)
4. A modern web browser (Chrome, Firefox, or Edge)

### A.2 Getting the Source Code

**Option 1 — Clone from GitHub:**
```
git clone https://github.com/allandabalidabz-arch/Youth-skills-platform.git
```

**Option 2 — Download ZIP:**
1. Go to https://github.com/allandabalidabz-arch/Youth-skills-platform
2. Click the green **Code** button
3. Click **Download ZIP**
4. Extract to your desired location

### A.3 Backend Setup

Open a terminal (PowerShell or Command Prompt) and run:

```
cd youth-skills-platform\backend
npm install
```

Create a `.env` file in the `backend` folder with the following content:

```
PORT=5000
JWT_SECRET=your_long_random_secret_here
JWT_EXPIRES_IN=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
GMAIL_USER=your_gmail@gmail.com
GMAIL_APP_PASSWORD=your_gmail_app_password
ADMIN_EMAIL=your_gmail@gmail.com
PAYMENT_NUMBER=0970342178
```

Start the backend:
```
npm run dev
```

You should see: `🚀 Server running on http://localhost:5000`

The database is created and seeded automatically on first run.

### A.4 Frontend Setup

Open a second terminal and run:

```
cd youth-skills-platform\frontend
npm install
npm run dev
```

You should see: `Local: http://localhost:3000/`

### A.5 Accessing the Application

Open your browser and go to: **http://localhost:3000**

Both terminals must stay open while using the application.

### A.6 Admin Login

Go to: **http://localhost:3000/admin/login**

- Email: admin@youthskills.com
- Password: Allan7034

### A.7 Resetting the Database

To wipe all data and re-seed:
```
cd youth-skills-platform\backend
npm run seed
```

**Warning:** This permanently deletes all existing data.

---

## APPENDIX B — USER MANUAL

### B.1 Youth Learner — Getting Started

**Registering:**
1. Go to http://localhost:3000
2. Click **Get Started Free**
3. Fill in: Full Name, NRC Number (format: 123456/78/9), Email, Location (optional), Phone (optional), Password, Confirm Password
4. Click **Create Account**

**Signing In:**
1. Go to http://localhost:3000/login
2. Enter your email and password
3. Click **Sign In**

**Browsing Courses:**
1. Click **Courses** in the sidebar
2. Browse or search for a course
3. Click on a course card to view details
4. Click **Enroll Now — Free** to enrol

**Completing a Module:**
1. Open an enrolled course
2. Click on a module to expand it
3. Read the content
4. Click **Take Quiz**
5. Answer all questions and click **Submit Quiz**
6. Score at least 60% to complete the module

**Submitting an Assignment:**
1. Scroll to the Assignment section in any module of the course
2. Read the instructions
3. Type your response (minimum 20 characters)
4. Click **Submit Assignment**

**Getting Your Certificate:**
1. Complete all 3 modules in a course
2. You will be automatically redirected to the Certificates page
3. Click the **2,000 ZMW** button on your certificate
4. Send 2,000 ZMW to **0970 342 178 (Allan Dabali)**
5. Enter your transaction reference number
6. Click **Submit Payment Proof**
7. Wait for admin approval
8. Click **PDF** to download your certificate

### B.2 Administrator Guide

**Signing In:**
1. Go to http://localhost:3000/admin/login
2. Email: admin@youthskills.com / Password: Allan7034

**Grading Assignments:**
1. Click **Assignments** tab
2. Find the submission to grade
3. Click **Grade**
4. Read the submission, enter a grade (0–100), write feedback
5. Click **Submit Grade**

**Approving Payments:**
1. Click **Payments** tab
2. Find the pending payment
3. Verify the reference number against your mobile money records
4. Click **Approve** to unlock the PDF, or enter a reason and click **Reject**

---

## APPENDIX C — PROJECT PROPOSAL

*(The original project proposal submitted at the beginning of the academic year is attached here as submitted to the supervisor.)*

[Insert original signed project proposal document]

---

## APPENDIX D — TECHNICAL REPORT (SOURCE CODE SUMMARY)

### D.1 Backend Source Files

| File | Purpose |
|---|---|
| `backend/src/server.js` | Express app configuration, middleware, route mounting |
| `backend/src/database.js` | SQLite schema creation, WAL mode, auto-migration |
| `backend/src/middleware/auth.js` | JWT verification, role authorisation middleware |
| `backend/src/routes/auth.js` | Registration, login, password reset endpoints |
| `backend/src/routes/users.js` | Profile read/update, admin user list |
| `backend/src/routes/courses.js` | Course listing, detail, enrolment, admin course creation |
| `backend/src/routes/progress.js` | Module completion, quiz submission, progress queries |
| `backend/src/routes/assignments.js` | Assignment read, submit, admin grading |
| `backend/src/routes/certificates.js` | Certificate list, public verification |
| `backend/src/routes/payments.js` | Payment proof submission, admin approve/reject, email notification |
| `backend/src/routes/notifications.js` | Notification list, mark read |
| `backend/src/routes/dashboard.js` | Youth and admin dashboard statistics |
| `backend/src/utils/seed.js` | Database seed with courses, modules, quizzes, assignments |

### D.2 Frontend Source Files

| File | Purpose |
|---|---|
| `frontend/src/main.jsx` | React app mount, BrowserRouter, toast provider |
| `frontend/src/App.jsx` | Route definitions, protected/admin route wrappers |
| `frontend/src/context/AuthContext.jsx` | Auth state, login, register, logout, token storage |
| `frontend/src/utils/api.js` | Axios instance, token interceptor, 401 handler |
| `frontend/src/components/Layout.jsx` | Sidebar, topbar, notifications, dark mode |
| `frontend/src/pages/LandingPage.jsx` | Public landing page |
| `frontend/src/pages/RegisterPage.jsx` | Registration form with NRC validation |
| `frontend/src/pages/LoginPage.jsx` | Login form |
| `frontend/src/pages/AdminLoginPage.jsx` | Admin-specific login |
| `frontend/src/pages/DashboardPage.jsx` | Youth dashboard and full admin portal |
| `frontend/src/pages/CoursesPage.jsx` | Course catalogue with search and filters |
| `frontend/src/pages/CourseDetailPage.jsx` | Module content, quizzes, assignments, progress |
| `frontend/src/pages/CertificatesPage.jsx` | Certificate display, payment form, PDF generation |
| `frontend/src/pages/ProfilePage.jsx` | Profile editing, NRC field, password change |
| `frontend/src/pages/VerifyCertPage.jsx` | Public certificate verification page |

### D.3 Repository

Full source code is available at:
**https://github.com/allandabalidabz-arch/Youth-skills-platform**

---

*End of Document*

*YouthSkills Program — Evelyn Hone College, School of Business Studies and Management, Computer Studies Section*

*© 2026 Allan Dabali*
