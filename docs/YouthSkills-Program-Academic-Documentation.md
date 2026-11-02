# EVELYN HONE COLLEGE
## SCHOOL OF INFORMATION AND COMMUNICATION TECHNOLOGY

<br>

# YOUTHSKILLS PROGRAM
## DESIGN AND IMPLEMENTATION OF A WEB-BASED DIGITAL SKILLS LEARNING PLATFORM

**A Final-Year ICT Project**

**Student name:** [Insert full name]  
**Student number:** [Insert student number]  
**Supervisor:** [Insert supervisor's name]  
**Programme:** [Insert programme name]  
**Submission date:** [Insert submission date]

**Lusaka, Zambia**

---

> **Document status:** Academic project documentation draft based on static inspection of the available source code, configuration, README and local SQLite database. Personal details and institutional approval are intentionally left blank. No employment or recruitment features are included. This Markdown document is editable and may be imported into a word processor for institutional formatting.

# DECLARATION

I, **[Insert full name]**, declare that this project documentation is my own work and that all sources used have been acknowledged. This work has not been submitted to another institution for an academic award, except where permitted and explicitly stated.

**Student signature:** ______________________________  
**Date:** ______________________________

# APPROVAL

This project documentation is submitted for examination with the approval of the undersigned supervisor.

**Supervisor name:** [Insert supervisor's name]  
**Signature:** ______________________________  
**Date:** ______________________________

# DEDICATION

*[Optional: Insert a personal dedication, or remove this page if not required.]*

# ACKNOWLEDGEMENTS

*[Complete this section with acknowledgements of people or organisations that provided genuine assistance. Do not name contributors without their consent.]*

# ABSTRACT

YouthSkills Program is a web-based digital-skills learning application developed with a React frontend, an Express and Node.js backend, and an SQLite database. This documentation describes the project as implemented in the inspected source code and local database. The application supports youth registration and sign-in, user profiles, a catalogue of digital-skills courses, course modules, multiple-choice quizzes, text-based assignments, learning-progress records, in-app notifications and certificates of course completion. A certificate verification endpoint is publicly accessible. The application also records learner-submitted proof of certificate payment and provides administrator-only API endpoints to approve or reject that proof. No payment gateway or electronic funds transfer integration was identified.

The backend applies JWT-based authentication and role checks, and hashes account passwords using bcryptjs. The database schema comprises user, course, module, quiz, enrolment, module-progress, assignment, assignment-submission, certificate, certificate-payment, notification and password-reset tables. The project has user-facing learner workflows and selected administrator dashboard views; some administrative operations are exposed as API endpoints without corresponding dashboard screens. Employer and opportunity functionality is absent from the current application and is outside this documentation's scope.

The documentation is based on a static review of the project source, configuration, README and a read-only inspection of the local SQLite database. The frontend production build completed successfully during review. No automated test suite or executed user-acceptance evaluation was found. Consequently, unexecuted functional tests are reported as not tested, and no user-study outcomes or employment-related outcomes are claimed. The project demonstrates a feasible learning-platform prototype while identifying implementation limitations and recommendations for further development.

**Keywords:** online learning, digital skills, learning management system, React, Express, SQLite, learner progress, certificate verification

# TABLE OF CONTENTS

> Page numbers depend on final word-processor formatting. Update the automatic table of contents after importing this file into Word or LibreOffice.

- Preliminary pages
- Chapter One: Introduction
- Chapter Two: Literature Review
- Chapter Three: System Analysis and Design
- Chapter Four: System Development and Implementation
- Chapter Five: System Testing and Evaluation
- Chapter Six: Project Management
- Chapter Seven: Conclusion and Recommendations
- References
- Appendices

# LIST OF FIGURES

1. Figure 3.1: Implemented high-level system architecture
2. Figure 3.2: Implemented user use-case overview
3. Figure 3.3: Level 0 data-flow view of implemented functions
4. Figure 3.4: Implemented entity-relationship overview
5. Figure 3.5: Authentication and learner course-completion workflow

Editable Mermaid source for these figures is provided in `YouthSkills-Program-Diagrams.md`. Render and number the figures after importing the document into the selected word processor.

# LIST OF TABLES

1. Table 2.1: Comparison of selected learning-system categories
2. Table 3.1: Functional requirements derived from implementation
3. Table 3.2: Non-functional requirements and review status
4. Table 3.3: User roles and responsibilities
5. Table 3.4: Core use-case descriptions
6. Table 3.5: Actual SQLite database tables and relationships
7. Table 3.6: Data dictionary summary
8. Table 4.1: API endpoint summary
9. Table 5.1: Test cases and evidence status
10. Table 6.1: Indicative project work plan
11. Table 6.2: Indicative project budget
12. Table 6.3: Project risk register

# LIST OF ABBREVIATIONS AND ACRONYMS

| Acronym | Meaning |
|---|---|
| API | Application Programming Interface |
| CSS | Cascading Style Sheets |
| DBMS | Database Management System |
| ERD | Entity-Relationship Diagram |
| HTML | HyperText Markup Language |
| ICT | Information and Communication Technology |
| JSON | JavaScript Object Notation |
| JWT | JSON Web Token |
| LMS | Learning Management System |
| REST | Representational State Transfer |
| SDLC | Systems Development Life Cycle |
| SQL | Structured Query Language |
| UI | User Interface |
| UX | User Experience |

# CHAPTER ONE: INTRODUCTION

## 1.1 Background of the Study

Digital technologies have created additional ways to distribute educational content, organise learning activities and provide learners with records of their participation. An online learning system can make structured content available through a browser and can support interactions such as enrolment, formative assessment and progress review. The educational value of such a system depends not only on the software but also on the relevance of its content, instructional design, access to devices and connectivity, and the support available to learners (Anderson, 2008; Bates, 2019).

Digital skills education is relevant to learners who need opportunities to develop practical knowledge in areas such as web development and computing systems. A web-based platform can present course materials and activities in an organised format and provide a consistent interface for reviewing progress. It can complement classroom, laboratory or community-based instruction; it does not automatically replace teaching, guarantee learner competence or confer an externally accredited qualification.

The **YouthSkills Program** is a browser-based learning application developed for digital-skills training. The inspected seed data provides three courses: System Analysis and Design, Web Development and Operating Systems. The application allows youth users to enrol in courses, access modules, submit quizzes and text assignments, view progress and receive course-completion certificates. It also provides profile management, in-app notifications and selected administration functions. The aim of this documentation is to describe these implemented functions and their technical basis without attributing unimplemented employment or recruitment capabilities to the project.

## 1.2 Problem Statement

Learners using a digital training programme need a coherent way to discover available courses, access learning materials, complete activities and review their progress. When these functions are handled separately or without a shared learner record, learners may have difficulty knowing which course they have joined, what learning activities remain and whether course completion has been recorded.

YouthSkills Program addresses this defined system problem by bringing a course catalogue, modules, quizzes, text-based assignments, enrolments, progress records and certificates into one web application. The source code demonstrates these workflows, but the materials reviewed do not provide a prior field study, a measured baseline of learner outcomes or evidence that all target learners experienced the stated problem. Therefore, this problem statement describes the functional need the system addresses, not a claim that a formal needs assessment has already established its prevalence.

The project also has limitations relevant to the problem: its course catalogue is small and seeded with sample content; its assessment integrity needs improvement; some administrative functions are API-only; and no automated or user-acceptance test results were found. These gaps mean that the application should be characterised as a learning-platform prototype, not as a proven large-scale educational service.

## 1.3 Aim of the Project

To develop and document a web-based digital-skills learning platform that enables youth users to access structured courses and learning activities, track course progress and obtain verifiable course-completion records, with supporting administration functions.

## 1.4 Specific Objectives

The project objectives, evaluated against the inspected implementation, are:

1. To implement youth account registration, authentication and profile-management functions.
2. To provide an authenticated course catalogue, course detail pages, course modules and course enrolment.
3. To support module-based learning through multiple-choice quizzes, assignment submissions and stored learner progress.
4. To issue a certificate record following completion of all modules in a course and provide a public certificate-verification endpoint.
5. To provide an administrator dashboard and protected API functions for selected user, course, assignment and certificate-payment management.
6. To build and package a usable frontend and document the system's current functions, constraints and unverified test areas.

Objectives 1–5 refer to code paths present in the inspected project; their end-to-end reliability has not been established by a formal test suite.

## 1.5 Research Questions

1. How can a web application organise digital-skills courses, modules and learning activities for youth learners?
2. How does the YouthSkills Program record course enrolment and module completion?
3. What authentication, role and database mechanisms are implemented to support learner and administrator functions?
4. Which functional, security, usability and testing limitations should be addressed before wider deployment?

## 1.6 Significance of the Project

**Learners:** The application provides one interface for browsing the available courses, enrolling, studying module content, taking quizzes, submitting text assignments and reviewing course progress. Certificates can be viewed, downloaded after the configured payment approval and checked through a verification page.

**Administrators:** The dashboard provides summary statistics and views for registered youth and course modules. Protected API functions also allow account listing, course/module/quiz creation, assignment grading and certificate-payment decisions. Some of those functions are not exposed through a corresponding dashboard interface.

**Educational institutions and trainers:** The project demonstrates how web technologies and a relational database can support structured course delivery. It may serve as a learning and discussion prototype. It should not be represented as an institutional learning service or accredited programme unless the relevant institution has separately approved it.

**Future developers:** The separation of a React client, Express routes and SQLite persistence provides a basis for continued implementation. This documentation identifies actual tables, routes and known gaps to support maintenance and further testing.

No claim is made that the system has been shown to improve academic achievement, guarantee access for all learners or produce measured employment outcomes.

## 1.7 Scope of the Project

### Included

- Youth registration and authentication.
- User profile fields, including name, biography, location, phone, avatar URL and skills.
- Course browsing, category/level/search filtering, course details and enrolment.
- Course modules, seeded learning content and multiple-choice quizzes.
- Text-based assignment submissions, resubmission before grading and administrator grading API.
- Module progress, course-completion status and certificate records.
- Certificate listing, browser-generated PDF download subject to payment approval, sharing link and public verification.
- In-app notifications and notification read status.
- Administrator dashboard overview, youth listing/search and course/module browsing.
- Manual certificate-payment proof submission and administrator API review.
- Password change and password-reset workflow.

### Excluded

- Job or internship listings, recruitment, employment matching, applications to jobs or employer-to-youth hiring.
- Mentorship matching or mentor accounts.
- Trainer accounts and instructor-specific administrative roles.
- Integrated card, bank or mobile-money payment processing.
- Email delivery of password-reset links.
- Native mobile applications, live video, real-time chat and enterprise-scale learning analytics.
- Evidence of formal accreditation, nationally representative user adoption or measured learning impact.

## 1.8 Limitations of the Project

1. **Limited course catalogue:** The seed data contains three courses and nine modules. This does not establish broad curriculum coverage.
2. **No formal testing suite identified:** No project test files or test script were found. A frontend build is not equivalent to functional or user-acceptance testing.
3. **Assessment integrity:** Quiz answers are returned by the quiz endpoint, and module completion accepts a score supplied by the client. A user can potentially manipulate the submitted score.
4. **Partial administrative interface:** User views and course/module browsing are visible in the dashboard, but assignment grading and payment approval are API-only in the inspected interface.
5. **Manual certificate payment:** The system stores submitted proof and a status; no payment gateway was identified. The configured price is presented in the frontend and payment record defaults; it requires institutional/business confirmation before being treated as an approved policy.
6. **Password-reset delivery:** Reset links are logged for development and stored as notifications; the reviewed implementation does not send email.
7. **Database deployment:** SQLite is suitable for a small prototype but may not be appropriate for a high-concurrency production deployment without further evaluation.
8. **Access and device constraints:** The application requires a browser and network access to the server. Low-bandwidth operation and accessibility have not been formally evaluated.
9. **Data snapshot limitations:** The inspected local database is only a development snapshot and may not represent deployment data.
10. **No user-study evidence:** No completed user-acceptance exercise or user feedback evidence was found.

## 1.9 Definition of Key Terms

**Course:** A defined learning offering in the database with a title, description, category, level, instructor details and related modules.

**Enrolment:** A database record associating a user with a course.

**Module:** A learning unit belonging to a course and containing textual learning content and potentially quiz questions or an assignment.

**Module progress:** A record of a learner's module completion, optional quiz score and completion date.

**Quiz:** A set of stored multiple-choice questions for a module; the learner submits selected option indexes for scoring.

**Assignment:** A text-based learning task associated with a module and course.

**Certificate:** A database record created when the progress route determines that all modules in a course have been completed; the frontend can generate a PDF representation.

**Certificate verification:** A public API lookup by certificate number that returns selected certificate and holder details when a record is found.

**JWT:** A signed token used by the backend authentication middleware to identify a user making a protected request.

**Administrator:** A user whose database role is `admin` and who is permitted to use routes protected by administrator role checks.

# CHAPTER TWO: LITERATURE REVIEW

## 2.1 Introduction

This chapter introduces concepts relevant to online learning applications and relates them to observed YouthSkills Program features. Published literature is used for general concepts; observations of the project are based on source-code and database inspection. No original educational research or user study is claimed.

## 2.2 Overview of Online Learning Systems

Online learning systems use digital networks and software to distribute learning resources and support learning activities. They may provide asynchronous access to material, assessment tools, communication and records of learner activity. Anderson (2008) describes online learning as a field involving interactions among learners, teachers and content, rather than merely delivering documents through a website. Bates (2019) similarly emphasises that technology choice should be considered alongside teaching context, access, course design and support.

YouthSkills Program is an asynchronous, browser-based learning prototype: course content and quizzes are retrieved from the application when requested, and learners submit activity through API calls. The inspected source does not show live instruction, a discussion forum or synchronous communication. Thus, the platform supports a limited subset of online-learning functions.

## 2.3 Digital Skills Development Platforms

Digital skills encompass knowledge and practical abilities for using, understanding or developing digital technologies. Online platforms can organise introductory content and activities, but practical competence also depends on opportunities to practise, feedback, access to suitable equipment and the quality of instruction. The project contains course content in System Analysis and Design, Web Development and Operating Systems, but the existence of these modules alone does not prove that learners achieve a specified level of competence.

## 2.4 Learning Management Systems

A Learning Management System (LMS) commonly supports course organisation, enrolment, content delivery, assessment and progress records. System functionality varies, and platforms should be evaluated against defined learner, instructor and administrative requirements rather than a product label alone (Watson and Watson, 2007). YouthSkills Program implements course listing, course/module display, enrolment, quizzes, assignments, progress records and certificates. It has a limited administrative interface and no trainer role in the account model. It is therefore more accurate to describe it as a small learning-platform prototype with LMS-like functions than to imply that it provides a full institutional LMS.

## 2.5 User Authentication and Access Control

Authentication establishes who is making a request, while authorisation determines what that user may do. OWASP identifies access-control failures and authentication weaknesses as important web application risks (OWASP Foundation, 2021). The backend uses JWT verification to identify a user and a role-checking middleware for selected routes. Passwords are hashed with bcryptjs in registration and password-change flows.

Role protection is not a complete security guarantee. The documentation records the implemented controls without claiming a security audit. Further testing should verify token configuration, permission boundaries, input validation, session invalidation and sensitive responses. In particular, quiz correct answers are returned to the client and scores are trusted from the client during module completion.

## 2.6 Course and Learning-Content Management

Course management involves organising course descriptions, modules and supporting content so learners can identify and access relevant material. YouthSkills Program stores course records, modules and quizzes in relational tables. The seed script supplies three courses and module content. The API includes administrator-protected operations to create a course, add modules and add quiz questions. I did not identify corresponding interface controls for general course authoring in the administrator dashboard; creation is an API-level capability in the inspected code.

## 2.7 Assessment and Learner Progress Tracking

Assessment can provide evidence of learner understanding when tasks, scoring and feedback are appropriately designed. Progress records can help learners and administrators understand completion status, although a completion percentage is not necessarily proof of mastery. YouthSkills Program records module completion and optional quiz scores, calculates course progress from completed modules, and supports text assignment submission and grading endpoints.

The current quiz design has an integrity limitation: the quiz submission route calculates the score but also returns the correct option indexes; the module-completion route accepts a client-supplied score. This should be addressed before the assessment is used for consequential decisions. Assignments are text-only in the learner interface; while a `file_url` field exists in the database, no upload workflow was identified.

## 2.8 Electronic Certificates and Verification

An electronic certificate can provide a digital record that a specified completion event occurred. Its meaning depends on the issuer, assessment standard, identity assurance and verification process. YouthSkills Program creates a unique certificate number after all course modules are recorded complete. A public endpoint looks up the number and returns selected certificate and learner details. The frontend creates a PDF using jsPDF. These are implemented software functions; they do not establish external accreditation or independent validation of learning outcomes.

## 2.9 Payment Systems for Digital Learning Services

Digital payment integration ordinarily involves interaction with a payment provider or regulated payment service, transaction confirmation and appropriate reconciliation. The reviewed project does not integrate such a provider. It records a learner-entered payment reference or proof text and allows an administrator-protected endpoint to mark the record approved or rejected. Accordingly, documentation should describe **manual certificate-payment proof management**, not online payment processing.

The certificate download screen displays a fee of 2,000 ZMW. That value appears in frontend copy and database defaults; the materials reviewed do not establish an approved institutional fee policy. The project owner should verify the policy before publication.

## 2.10 Review of Related Systems

Moodle is an open-source LMS with a broader ecosystem of course delivery, activities, roles and plugins than the functions evident in this project (Moodle, n.d.). Canvas LMS also provides course-management and teaching functions intended for institutional use (Instructure, n.d.). These systems are relevant comparators at a category level; this chapter does not assert a feature-by-feature evaluation of a particular live deployment.

## 2.11 Comparison of Existing Systems with YouthSkills Program

| Capability | General LMS platforms | YouthSkills Program, as inspected |
|---|---|---|
| Course catalogue and modules | Commonly available, implementation varies | Present; seeded with three courses and nine modules |
| Enrolment | Commonly available | Present for youth role |
| Quizzes and assessment | Commonly available, often configurable | Multiple-choice quiz submission and scoring present; server-side integrity is limited |
| Assignments | Commonly available | Text submission and admin grading API present; file upload not identified |
| Progress reporting | Commonly available | Module completion and course percentage present |
| Roles | Often learner, instructor and administrator roles | `youth` and `admin` roles only; no trainer or employer role |
| Certificates | Often supported through core or extensions | Certificate record, browser-generated PDF and public verification present |
| Payments | May be available through plugins/integrations | Manual proof recording and admin status API only; no payment provider integration |
| Administration | Often extensive | Summary dashboard, youth list and module view; several operations are API-only |

## 2.12 Identified Research or System Gap

The relevant system gap addressed by this project is the need for a single lightweight web application that combines the particular learner workflow implemented here: course discovery, module access, enrolment, quizzes, assignments, progress and certificate records. The project demonstrates these components in one prototype. The evidence inspected does not establish that the platform is unique, educationally effective or more accessible than existing services. Its current gaps include limited content, incomplete administrative screens, insufficient assessment integrity and lack of automated test evidence.

## 2.13 Chapter Summary

Online learning platforms can combine content, activities and learner records, but their value depends on instructional design, access, assessment quality and support. YouthSkills Program implements a limited course and learning workflow. It includes progress tracking and certificate functions, but has technical limitations that should be reflected in evaluation and future work.

# CHAPTER THREE: SYSTEM ANALYSIS AND DESIGN

## 3.1 Introduction

This chapter describes the actual user roles, requirements, architecture, API and database found in the inspected implementation. Diagrams in the companion Mermaid file represent implemented components only, except where a diagram is explicitly labelled as a limitation or proposed improvement.

## 3.2 Analysis of the Existing Situation

The system stores course, module, quiz, enrolment and progress information in SQLite and serves it through an Express API. The React client provides the learner pages and selected administrator views. The seed routine populates the database with sample accounts and course content when it is empty. The README describes a learning platform and gives local startup instructions.

The reviewed source does not contain a separate SQL import file, a trainer account workflow or job-related data model. Opportunities and applications are explicitly absent from the current schema and server. The administrator dashboard provides an overview, registered-youth listing and course/module viewer, while other protected management functions are accessible through endpoints.

## 3.3 Identified Problems and Proposed Solution

The system is designed to address the need to organise course content, learner enrolments and activity records in one application. Its solution comprises a browser UI, authenticated API routes and SQLite persistence. It allows learners to access the seeded course catalogue and learning activities, while administrators can inspect selected platform records and use protected API operations. The solution does not establish that existing education services have been surveyed or that this platform has been adopted by an institution.

## 3.4 Functional Requirements

The following requirements are derived from present source behaviour, not from a completed stakeholder study.

| ID | Functional requirement | Implementation status |
|---|---|---|
| FR-01 | The system shall allow a user to register with name, email and password. | Implemented for youth-facing registration only. |
| FR-02 | The system shall allow registered users to sign in and access protected routes. | Implemented using JWT middleware. |
| FR-03 | The system shall allow an authenticated user to view and update supported profile fields. | Implemented. |
| FR-04 | The system shall display published courses and support category, level and text search. | Implemented. |
| FR-05 | The system shall display course details, modules and quiz questions to an authenticated user. | Implemented; module content is returned without server-side enrolment gating. |
| FR-06 | The system shall allow a youth to enrol once in a published course. | Implemented; duplicate enrolment is rejected. |
| FR-07 | The system shall allow a youth to submit quiz answers and receive a score. | Implemented; integrity limitation noted in Chapter Four. |
| FR-08 | The system shall record module completion and calculate course progress. | Implemented, subject to quiz score limitation. |
| FR-09 | The system shall allow a youth to submit text assignment work and review its status. | Implemented. |
| FR-10 | The system shall provide administrator endpoints to view and grade assignment submissions. | API implemented; matching dashboard workflow not identified. |
| FR-11 | The system shall issue one certificate per user and course after course completion. | Implemented by progress route. |
| FR-12 | The system shall provide a public certificate lookup by certificate number. | Implemented. |
| FR-13 | The system shall allow a youth to submit certificate-payment proof and an administrator to approve or reject it. | API and learner submission UI implemented; no admin review UI identified; no gateway. |
| FR-14 | The system shall list notifications for the authenticated user and allow them to be marked read. | Implemented. |
| FR-15 | The system shall provide youth and administrator summary dashboards. | Implemented. |
| FR-16 | The system shall support password change and token-based password reset. | Implemented; reset delivery is development-oriented and not email-based. |

## 3.5 Non-Functional Requirements

The table distinguishes observable design choices from qualities not proven by test evidence.

| Area | Observed implementation / requirement | Verification status |
|---|---|---|
| Security | Password hashing, JWT authentication and selected role checks | Implemented in source; no security assessment performed |
| Data integrity | SQLite primary/foreign keys and uniqueness constraints | Schema present; no comprehensive integrity test run |
| Usability | Responsive React/Tailwind pages and toast feedback | UI present; no usability study found |
| Performance | Pagination parameters on course and user listings | No load test found |
| Availability | Express API and database initialisation | No uptime/SLA or recovery test found |
| Compatibility | Browser-based frontend | Production build succeeds; browser matrix not tested |
| Maintainability | Route modules, shared auth middleware and separate frontend/backend packages | Structure present; no maintainability assessment |
| Accessibility | Semantic controls and labels appear in some pages | No formal accessibility audit found |
| Scalability | SQLite prototype database | National or high-concurrency scaling not established |

## 3.6 User Roles and Responsibilities

| Role | Actual responsibilities or access |
|---|---|
| Youth | Register, authenticate, manage profile, view courses/modules, enrol, submit quizzes and assignments, view progress and certificates, submit certificate-payment proof, and read notifications. |
| Administrator | Protected access to aggregate dashboard, youth listing, course/module/quiz creation endpoints, assignment submission and grading endpoints, user listing, and payment review endpoints. Some operations lack UI screens. |
| Trainer/instructor | No trainer account role was found. Course records contain instructor name and biography fields; these are course metadata, not evidence of trainer accounts. |
| Public visitor | Can view the landing page and use the public certificate-verification API/page. Protected course API routes require authentication. |

## 3.7 System Architecture

The application follows a three-part client/API/data arrangement:

1. **Client:** React single-page application using React Router and Axios.
2. **API:** Express routes apply input checks, authentication and selected role authorisation.
3. **Database:** SQLite persists application data. The connection enables WAL journal mode and foreign-key enforcement.

The Vite development server proxies API requests to Express. In a deployment, the frontend's `VITE_API_URL` can point to an API base URL. Backend configuration is loaded through dotenv; actual secret values must remain private.

## 3.8 Use Case Diagram

See Figure 3.2 in `docs/YouthSkills-Program-Diagrams.md`. It includes youth, administrator and public certificate verification use cases that are visible in the implementation. Employer is not a role in the system and is therefore not shown as a functional actor.

## 3.9 Use Case Descriptions

| Use case | Actor | Preconditions | Main result |
|---|---|---|---|
| Register account | Youth | Registration page available; email not already registered | User record and initial token/notification created |
| Sign in | Youth / administrator | Account exists | JWT returned; client stores session according to login choice |
| Update profile | Authenticated user | Valid token | Supported profile fields are persisted |
| Browse courses | Authenticated user | API available | Published courses returned with filters and enrolment status |
| Enrol in course | Youth | Course is published; not already enrolled | Enrolment and notification records created |
| Complete module | Youth | Enrolled in course | Module progress saved; course completion and certificate may be recorded |
| Submit assignment | Youth | Assignment exists; enrolled in course; submission text meets minimum length | Submission created or updated |
| Grade assignment | Administrator | Authenticated admin; submission exists; grade within allowed range | Grade, feedback and notification stored |
| Download certificate | Youth | Certificate exists and payment status is approved | Browser creates a PDF file |
| Verify certificate | Public visitor | Certificate number available | Public endpoint returns selected certificate details or not-found response |
| Review payment | Administrator | Authenticated admin; payment record exists | Payment status updated; learner notification recorded |

## 3.10 Data Flow Diagrams

The Level 0 diagram in Figure 3.3 is supplied in the diagram companion. It shows the implemented client/API/database exchange without asserting an unimplemented email service or payment provider.

## 3.11 Entity-Relationship Diagram

Figure 3.4 in the diagram companion represents tables and foreign keys in the actual schema. It does not include opportunities, applications, trainer entities or employer listing entities because those are absent.

## 3.12 Database Design

The database is created at backend startup through `CREATE TABLE IF NOT EXISTS` statements in `backend/src/database.js`. SQLite foreign keys are enabled in the opened connection. IDs are text primary keys; the application commonly assigns UUID values. JSON-encoded text is used for fields such as course tags, user skills and quiz options. The actual database file inspected contained three courses, nine modules, eighteen quizzes and nine assignments; the other tables were empty except one seeded user. This is a local development snapshot, not a production data claim.

### Table 3.5: Actual tables and relationships

| Table | Purpose | Important relationships and constraints |
|---|---|---|
| `users` | Accounts, roles, profile fields and password hash | Unique email; primary key `id` |
| `courses` | Course metadata and instructor display fields | Primary key `id` |
| `modules` | Course learning units and content | `course_id` references `courses.id`, cascade delete |
| `quizzes` | Multiple-choice quiz questions | `module_id` references `modules.id`, cascade delete |
| `enrollments` | User/course membership and completion date | `user_id` → users; `course_id` → courses; unique `(user_id, course_id)` |
| `module_progress` | User module completion and score | `user_id` → users; `module_id` → modules; unique `(user_id, module_id)`; also stores course ID |
| `certificates` | Completion certificate number and issue time | User and course references; unique certificate number and `(user_id, course_id)` |
| `notifications` | User-specific notification messages and read state | `user_id` → users |
| `assignments` | Text task instructions associated with module/course | `module_id` → modules; `course_id` → courses |
| `assignment_submissions` | Text response, grade, feedback and status | `assignment_id` → assignments; `user_id` → users; unique `(user_id, assignment_id)` |
| `certificate_payments` | Submitted proof, amount, status and approval metadata | `user_id` → users; `certificate_id` → certificates; unique `(user_id, certificate_id)` |
| `password_resets` | Reset token, expiry and used flag | `user_id` → users |

Notable schema details: `module_progress.course_id` is stored but no course foreign key is declared for that column; `assignment_submissions.module_id` and `course_id` are stored but the inspected schema only declares foreign keys for assignment and user; `certificate_payments.approved_by` has no declared foreign key. A `file_url` field exists in assignment submissions, but no upload flow was identified.

## 3.13 Data Dictionary

The following is a compact data dictionary of the current schema. A full field-level version is included in the technical documentation.

| Table | Principal fields |
|---|---|
| `users` | `id`, `name`, `email`, `password`, `role`, `avatar`, `bio`, `location`, `phone`, `skills`, `created_at`, `updated_at` |
| `courses` | `id`, `title`, `description`, `category`, `level`, `duration_hours`, `thumbnail`, `instructor_name`, `instructor_bio`, `tags`, `is_published`, `created_at` |
| `modules` | `id`, `course_id`, `title`, `description`, `content`, `video_url`, `order_index`, `duration_minutes`, `created_at` |
| `quizzes` | `id`, `module_id`, `question`, `options`, `correct_answer`, `explanation` |
| `enrollments` | `id`, `user_id`, `course_id`, `enrolled_at`, `completed_at` |
| `module_progress` | `id`, `user_id`, `module_id`, `course_id`, `completed`, `quiz_score`, `completed_at` |
| `assignments` | `id`, `module_id`, `course_id`, `title`, `description`, `instructions`, `due_days`, `created_at` |
| `assignment_submissions` | `id`, `assignment_id`, `user_id`, `module_id`, `course_id`, `submission_text`, `file_url`, `status`, `grade`, `feedback`, `submitted_at`, `graded_at` |
| `certificates` | `id`, `user_id`, `course_id`, `issued_at`, `certificate_number` |
| `certificate_payments` | `id`, `user_id`, `certificate_id`, `amount`, `currency`, `proof_text`, `status`, `submitted_at`, `approved_at`, `approved_by` |
| `notifications` | `id`, `user_id`, `title`, `message`, `type`, `is_read`, `created_at` |
| `password_resets` | `id`, `user_id`, `token`, `expires_at`, `used`, `created_at` |

## 3.14 Input Design

Inputs include account registration fields; profile fields; course search and filters; quiz selections; assignment text; password reset/change fields; and certificate payment-reference text. The frontend performs basic checks on several forms and the backend repeats selected validation. API requests use JSON, with the Express JSON body limit configured to 10 MB. Database queries observed in core routes use SQLite parameter binding.

## 3.15 Output Design

Outputs include course cards and details, module content, quiz score and feedback, progress percentages, assignment status and grade, notification messages, dashboard summaries, certificate information and a client-generated PDF. Public verification returns the certificate number, learner name and selected course metadata.

## 3.16 User Interface Design

The frontend uses React components, React Router, Tailwind utility classes and Lucide icons. Main learner navigation includes Dashboard, Courses, Certificates and Profile; administrators see Dashboard and Profile. The shell includes a sidebar, notification panel, dark-mode toggle and sign-out control. The application uses toast messages for some success and failure states. The static review does not establish formal usability or accessibility conformance.

## 3.17 System Security Design

Observed controls include bcryptjs password hashing, JWT verification, role middleware, foreign keys, prepared/parameterised queries in reviewed data access and a CORS allowlist. Protected client requests attach a bearer token. Password-reset tokens are generated using Node's cryptographic random bytes and have an expiry.

These measures do not constitute a security audit. Specific limitations requiring attention include quiz answer disclosure and client-trusted scores, JWT secret/configuration validation, rate limiting and brute-force protections not identified, no demonstrated email reset delivery, and use of browser storage for bearer tokens. Documentation and deployment must not expose actual `.env` values or demo credentials.

## 3.18 Chapter Summary

The chapter defined the implemented roles, functions, architecture and SQLite data model. It deliberately excluded absent trainer, mentorship and employment data structures. It also documented the distinction between backend endpoints and user-facing screens, and the need for further verification of assessment security and other quality attributes.

# CHAPTER FOUR: SYSTEM DEVELOPMENT AND IMPLEMENTATION

## 4.1 Introduction

This chapter explains the principal implementation using the files reviewed. It reports observable code structure and does not infer undocumented development history.

## 4.2 Development Methodology

The source tree and package files do not provide evidence of a formal methodology, sprint schedule or completed Agile process. Therefore, the project documentation does not claim that a particular methodology was followed. For academic presentation, the student should describe only the development process supported by personal project records. A future maintenance cycle could use short iterative increments with documented requirements, reviews and tests, but that would be a recommendation rather than a confirmed historical fact.

## 4.3 Programming Languages Used

The frontend and backend application logic is written primarily in JavaScript. JSX is used for React components. CSS is generated and organised using Tailwind CSS and PostCSS configuration. SQL statements are embedded in JavaScript for SQLite schema creation and data access. JSON is used for API messages and project configuration.

## 4.4 Frontend Technologies

`frontend/src/main.jsx` mounts the React application within `BrowserRouter` and installs the toast provider. `frontend/src/App.jsx` defines public and protected routes. `frontend/src/context/AuthContext.jsx` manages login, registration, user state and browser storage. `frontend/src/utils/api.js` configures Axios, attaches a bearer token and handles 401 responses. Page components implement registration, login, dashboards, courses, course details, certificates, profile and password-reset screens.

The learner course page requests course data and provides search/category/level filters. The course detail page loads module content and assignments, submits quiz responses, marks modules complete, and refreshes course data. The certificate page uses jsPDF to create a landscape A4 PDF in the browser. It also retrieves certificate payment status and submits reference text.

## 4.5 Backend Technologies

`backend/src/server.js` configures Express, CORS, JSON and URL-encoded parsing, static `/uploads` access, route mounting, health response and a final error middleware. Route implementations are separated into files under `backend/src/routes`. The shared middleware in `backend/src/middleware/auth.js` verifies JWTs, reloads the user from SQLite and checks role permissions where requested.

## 4.6 Database Implementation

`backend/src/database.js` opens the SQLite file, enables WAL mode and foreign keys, then creates missing tables. `backend/src/utils/seed.js` creates sample content and accounts. The backend `.env` file names include `PORT`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `DB_PATH`, `NODE_ENV` and `FRONTEND_URL`; secret values are not reproduced here. The inspected connection path is computed from the source location and does not use the `DB_PATH` variable.

The seed routine includes deletion statements for existing rows before seeding. It must not be run casually against a database containing data that should be retained. Use only a disposable or backed-up development database.

## 4.7 System Architecture and Component Interaction

The client calls API paths using Axios. During Vite development, `/api` requests are proxied to the backend. Express route handlers obtain a database connection, validate relevant inputs, apply authentication/role middleware and return JSON responses. The frontend updates component state and presents the resulting information or toast.

## 4.8 User Authentication Implementation

Registration checks required values, email format, name format, minimum six-character password, optional phone/location and permitted roles. The backend hashes passwords with bcryptjs using a cost factor of 12, stores a user and creates a welcome notification. Login looks up the lowercased email, compares the password hash and signs a JWT. The middleware verifies the bearer token and retrieves user identity and role from the database.

The standard login page blocks administrator accounts after receiving a successful login and directs them to the admin portal. The admin login page requires the returned role to be `admin`. This is a user-interface separation; the actual API's role middleware remains the authority for protected operations.

Password change checks the current password and requires a new password of at least six characters. Password reset creates a random token with an expiry, logs the link for development and stores a notification; no mail provider was identified.

## 4.9 Course Management Implementation

`backend/src/routes/courses.js` returns published courses with optional category, level and search filters, pagination and counts. A course-detail route returns the course, modules, quizzes and the current user's enrolment record. A youth can enrol once; the handler creates an enrolment and notification. Administrator-protected routes create courses, modules and quiz questions. In the reviewed frontend, the admin dashboard displays course/module information but does not provide a complete content-authoring interface.

Although the frontend locks module interaction for a youth who is not enrolled, the course-detail API returns module content and quiz records to any authenticated requester. This is an implementation fact and a recommended access-control test; the UI lock should not be treated as server-side content protection.

## 4.10 Learning Activities and Assessments

Quiz questions and options are stored in `quizzes`; the quiz route compares submitted option indexes and calculates a percentage. The response includes correct-answer indexes and explanations. The module-completion route checks that a course enrolment exists and requires a reported passing score when a module has quiz questions.

This flow is not tamper-resistant because answers are disclosed and the completion endpoint accepts the reported score from the client. A recommended improvement is to keep answer keys server-side, calculate results on the server from validated submitted answers and persist a quiz attempt before allowing completion.

Assignment submissions are text records with a minimum 20-character requirement and require course enrolment. A youth can resubmit while the submission has not been graded. An administrator can list submissions by course and grade them through API endpoints. The frontend displays assignment text, status and returned feedback. A file URL column exists, but I found no file-upload interaction; `multer` is a dependency but is not used in the reviewed source.

## 4.11 Progress Tracking

The progress route inserts or updates a `module_progress` record. Course progress is computed as completed modules divided by total modules. Completion of all modules updates the enrolment completion timestamp and attempts to create one certificate record for the user/course pair. The frontend displays module status and a course progress bar.

## 4.12 Certificate Functionality

The backend creates a certificate identifier and number on course completion. `/api/certificates/my` returns a user's certificates with course metadata. `/api/certificates/verify/:certNumber` is public and returns selected certificate and holder fields if found. The frontend constructs the PDF using jsPDF and provides sharing/verification links.

The public endpoint returns the certificate holder's name and course metadata. Any privacy review should consider whether that disclosure is acceptable and whether consent or a limited verification response is more appropriate.

## 4.13 Payment Functionality

The learner can submit text proof of a certificate payment, and the backend stores it with an amount, currency and status. Administrators can list pending or all payments and approve or reject an entry. Approval triggers a learner notification; certificate PDF download is enabled by the frontend only when the payment status is approved.

No payment gateway, transaction validation service or actual money transfer code was identified. Payment approval is manual, and the reviewed admin interface does not show a payment-review screen. The frontend displays 2,000 ZMW. This value should be confirmed by the project owner; no official pricing decision can be inferred from code.

## 4.14 Administrator Functionality

The dashboard requests aggregate user, course, enrolment and certificate statistics. It can list and search youth accounts and load course modules. The database route layer additionally exposes course/module/quiz creation, assignment grading and payment decision endpoints. The dashboard does not expose all these endpoints as UI operations.

## 4.15 API Implementation

### Table 4.1: API endpoint summary

| Method | Endpoint | Access | Function |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register user |
| POST | `/api/auth/login` | Public | Authenticate user |
| GET | `/api/auth/me` | Authenticated | Return current user |
| PUT | `/api/auth/change-password` | Authenticated | Change password |
| POST | `/api/auth/forgot-password` | Public | Create reset request |
| POST | `/api/auth/reset-password` | Public with token | Set new password |
| GET/PUT | `/api/users/profile` | Authenticated | Read/update own profile |
| GET | `/api/users` | Admin | Search/list users |
| GET | `/api/courses` | Authenticated | List/filter published courses |
| GET | `/api/courses/:id` | Authenticated | Read course, modules and quizzes |
| POST | `/api/courses/:id/enroll` | Youth | Enrol |
| POST | `/api/courses` | Admin | Create course |
| POST | `/api/courses/:id/modules` | Admin | Add module |
| POST | `/api/courses/modules/:moduleId/quiz` | Admin | Add quiz question |
| POST | `/api/progress/module/:moduleId/complete` | Youth | Record completion |
| POST | `/api/progress/quiz/:moduleId/submit` | Youth | Submit quiz answers |
| GET | `/api/progress/course/:courseId` | Authenticated | Read course progress |
| GET | `/api/progress/my-courses` | Authenticated | List enrolments and progress |
| GET/POST | `/api/assignments/module/:moduleId`, `/api/assignments/:id/submit` | Authenticated / Youth | Read assignment and submit work |
| GET | `/api/assignments/my` | Youth | List own submissions |
| GET | `/api/assignments/course/:courseId/submissions` | Admin | List course submissions |
| PUT | `/api/assignments/submission/:id/grade` | Admin | Grade submission |
| GET | `/api/certificates/my` | Authenticated | List own certificates |
| GET | `/api/certificates/verify/:certNumber` | Public | Verify by certificate number |
| POST/GET | `/api/payments/certificate/:certId/submit`, `/status` | Youth/authenticated | Submit proof and view own payment status |
| GET | `/api/payments/pending`, `/all` | Admin | List payment records |
| PUT | `/api/payments/:paymentId/approve`, `/reject` | Admin | Decide payment status |
| GET/PUT | `/api/notifications`, `/read-all`, `/:id/read` | Authenticated | Read and mark notifications |
| GET | `/api/dashboard/youth` | Youth | Learner summary |
| GET | `/api/dashboard/admin` | Admin | Administrator summary |
| GET | `/api/health` | Public | Health check |

## 4.16 Security Measures

Implemented measures and limitations are listed in Section 3.17. Further details: CORS is configured for local origins and `FRONTEND_URL`; JWT values are taken from environment configuration; passwords are hashed; and route-level role checks are used. No rate limiter, production secrets management integration, comprehensive audit trail, or automated security test suite was identified. Avoid presenting the implementation as production-certified.

## 4.17 Input Validation and Error Handling

Registration validates required fields and selected formats. Profile, assignment, quiz and payment endpoints apply selected checks. SQLite queries in the reviewed routes use parameter placeholders. Express has a final error handler that logs stack information to the server and returns a JSON response. Several handlers catch exceptions locally and return generic messages; validation is not uniform across all routes. Production error logging and disclosure behaviour require further review.

## 4.18 Challenges Encountered During Development

The source code and project files do not document the developer's actual challenges or decisions. Therefore, no historical challenge is claimed here. The static review identifies technical issues that may be discussed if they match the developer's own records: quiz answer disclosure and client-supplied score; absent email delivery; missing admin screens for grading/payment review; and the need to test role boundaries.

## 4.19 Chapter Summary

The system is implemented as a React/Vite client, Express REST API and SQLite database. Core learner functions are present. Some administrative capabilities exist only at the API layer. The payment workflow is manual, password-reset email is absent, and quiz integrity requires improvement.

# CHAPTER FIVE: SYSTEM TESTING AND EVALUATION

## 5.1 Introduction

This chapter separates actual verification evidence from proposed tests. The frontend production build completed successfully during code review. No automated test files, test script or user-acceptance results were found in the inspected project. Functional cases below are consequently marked **Not Tested**, unless identified as build evidence.

## 5.2 Testing Objectives

- Confirm that critical user and administrator workflows behave as specified.
- Verify route authentication and role restrictions.
- Check that database constraints preserve key relationships and uniqueness.
- Identify validation, error-handling and assessment-integrity weaknesses.
- Record a reproducible build and test status for the project report.

## 5.3 Testing Methodology

Testing should combine automated API/unit tests, integration tests using a disposable database, browser-based system tests and, if approved and performed, user-acceptance tasks. Every test should record build/version, setup, input, expected result, actual result, evidence and status. Test with synthetic accounts and data. The destructive seed routine should not be executed against valuable data.

## 5.4 Unit Testing

No unit-test files or test runner script were identified. Recommended unit tests include input validators, role middleware, password reset expiry logic, quiz score calculation and course progress calculation.

## 5.5 Integration Testing

No executed integration-test evidence was found. Recommended integration coverage includes registration-to-login, login-to-protected-route, enrolment-to-progress, course completion-to-certificate, assignment submit-to-grade, and payment proof-to-admin decision-to-download eligibility.

## 5.6 System Testing

The frontend build is a system packaging check only. It does not exercise backend routes, persistent state, or user behaviour. A complete system test should use a separate test database and controlled service configuration.

## 5.7 User Acceptance Testing

No user-acceptance test plan, participant consent record, completed task results or questionnaire responses were found. User acceptance is therefore **not established**.

## 5.8 Test Environment

The inspected environment used a Windows development workspace with Node.js available and project dependencies installed. The frontend build was run from `frontend` using npm and Vite. The inspected SQLite database was opened read-only to review schema and record counts. No running backend or live browser acceptance session was used for this documentation.

## 5.9 Test Cases

All functional cases below are proposed and were not executed during the analysis.

### Table 5.1: Test cases and evidence status

| ID | Feature | Test description | Preconditions | Test input | Expected result | Actual result | Status |
|---|---|---|---|---|---|---|---|
| T-01 | Registration | Register with valid unique details | API/database available | Valid name, email and password | User created; token returned; password stored as a hash | Not executed | Not Tested |
| T-02 | Registration validation | Reject malformed email or short password | API available | Invalid email / password under minimum | 400 response with validation message | Not executed | Not Tested |
| T-03 | Duplicate email | Attempt registration with existing email | Existing account | Same email | 409 duplicate response | Not executed | Not Tested |
| T-04 | Login | Sign in with correct credentials | Seed/test user exists | Valid credentials | Token and user returned | Not executed | Not Tested |
| T-05 | Authentication | Access protected route without token | API available | No bearer token | 401 response | Not executed | Not Tested |
| T-06 | Role authorisation | Youth calls admin-only endpoint | Youth token | GET `/api/users` | 403 response | Not executed | Not Tested |
| T-07 | Profile | Update own skills/profile | Authenticated user | Valid profile data | Updated profile returned and persisted | Not executed | Not Tested |
| T-08 | Course browse | Search/filter published courses | Authenticated user; seeded courses | Category/level/search query | Matching published courses returned | Not executed | Not Tested |
| T-09 | Enrolment | Enrol in published course | Youth not enrolled | Course ID | Enrolment and notification created | Not executed | Not Tested |
| T-10 | Duplicate enrolment | Repeat enrolment | Youth already enrolled | Same course ID | Conflict response; one enrolment remains | Not executed | Not Tested |
| T-11 | Quiz scoring | Submit known answers | Quiz exists | Correct and incorrect indexes | Score and result returned | Not executed | Not Tested |
| T-12 | Quiz integrity | Inspect response for answer key | Quiz exists | Quiz submit request | Correct answers should not be exposed before assessment policy allows; current implementation returns them | Not executed | Not Tested |
| T-13 | Module completion | Complete quiz module with passing client score | Youth enrolled | `quiz_score` 60 or higher | Completion recorded; progress updated | Not executed | Not Tested |
| T-14 | Module completion security | Alter client score without passing quiz | Youth enrolled | Forged high `quiz_score` | Server should reject unearned completion; current design may accept it | Not executed | Not Tested |
| T-15 | Assignment submission | Submit sufficiently long text | Youth enrolled; assignment exists | Text ≥20 characters | Submission stored | Not executed | Not Tested |
| T-16 | Assignment access | Submit for course without enrolment | Assignment exists | Valid-length text | 403 response | Not executed | Not Tested |
| T-17 | Assignment grading | Admin grades existing submission | Admin token; submission exists | Grade 0–100 and feedback | Grade/status stored; learner notified | Not executed | Not Tested |
| T-18 | Certificate issuance | Complete final course module | All other modules recorded complete | Final module completion | One certificate created and notification recorded | Not executed | Not Tested |
| T-19 | Certificate verification | Verify known/unknown number | Certificate exists or does not exist | Certificate number | Valid details / 404 | Not executed | Not Tested |
| T-20 | Payment proof | Submit proof for own certificate | Youth owns certificate | Reference text | Pending payment record returned | Not executed | Not Tested |
| T-21 | Payment authorisation | Youth attempts to approve payment | Youth token | PUT approval endpoint | 403 response | Not executed | Not Tested |
| T-22 | Notification ownership | User requests another user's notification | Authenticated user | Other notification ID | No other user's record changed | Not executed | Not Tested |
| T-23 | Password reset | Reset with expired, used and valid tokens | Reset records configured | Each token class | Expired/used rejected; valid unused token accepted | Not executed | Not Tested |
| T-24 | Frontend production build | Run Vite production build | Dependencies installed | `npm run build` in frontend | Build completes | Build completed successfully during analysis; warnings noted | Passed (build only) |

## 5.10 Test Results

The frontend build completed successfully using Vite. Output included a warning about the outdated Browserslist dataset and a main JavaScript bundle larger than 500 kB. No backend tests, automated frontend tests, integration tests, performance tests, security tests or user-acceptance tests were executed. Functional test status remains **Not Tested**.

## 5.11 Identified Errors and Corrective Actions

No runtime defect log or test failure record was present. Static inspection identified issues for corrective work:

- Keep quiz answer keys server-side and calculate scores from validated submitted answers.
- Require server-side evidence of a passed quiz before marking a quiz-bearing module complete.
- Provide administrator UI for payment decisions and assignment grading, or document the API-only workflow for the prototype.
- Implement and verify a real email reset service before describing password reset as email delivery.
- Add validation and access-control tests for every protected route.
- Review the appropriate disclosure of holder information in public certificate verification.
- Review bundle size and dependency loading for the frontend.

## 5.12 Evaluation Against Project Objectives

| Objective | Source-code evidence | Evaluation status |
|---|---|---|
| Account registration, authentication and profiles | Auth routes, middleware, registration/login/profile pages | Functionality present; end-to-end test not performed |
| Course catalogue, modules and enrolment | Course API, course pages, seed content and enrolment table | Functionality present; end-to-end test not performed |
| Quizzes, assignments and progress | Progress and assignment routes, course detail UI, related tables | Functionality present with quiz-integrity limitation; untested |
| Completion certificates and verification | Certificate insertion, list/PDF and public verify route | Functionality present; untested |
| Administrator functions | Dashboard and admin-protected APIs | Partially surfaced in UI; several operations API-only; untested |
| Build and documentation | Successful Vite build and this code-based documentation | Build verified; documentation drafted; broader tests absent |

## 5.13 System Limitations

Testing limitations include the absence of automated tests and user-acceptance evidence. Implementation limitations are discussed in Chapter One and Chapters Three and Four. No pass rate or participant satisfaction measure can be reported.

## 5.14 Chapter Summary

The frontend production build succeeded. Functional, integration, security, performance and user-acceptance tests were not executed. Proposed test cases remain explicitly marked **Not Tested** and should be completed before making reliability claims.

# CHAPTER SIX: PROJECT MANAGEMENT

## 6.1 Introduction

This chapter provides a practical project-management view for academic completion. The repository does not contain verified historical schedules, invoices or a project expenditure ledger. The schedule and budget below are therefore **indicative planning estimates**, not claims of completed activity or actual spending.

## 6.2 Project Planning

The remaining work should prioritise documentation verification, automated tests for existing workflows, resolution of quiz integrity, completion of administrative workflows if required by the assessed scope, and final user evaluation only if it is approved and genuinely conducted. Personal information, supervisor details and institutional submission requirements must be confirmed by the student.

## 6.3 Project Schedule

The schedule is a proposed eight-week completion plan and should be adjusted to the institution's actual deadline.

### Table 6.1: Indicative work plan

| Week | Proposed activity | Deliverable |
|---|---|---|
| 1 | Confirm scope, assess supervisor requirements, freeze a copy of the working database and review code findings | Agreed scope and safe development snapshot |
| 2 | Prepare detailed requirements, diagrams and data dictionary from source | Reviewed analysis and design |
| 3 | Add tests for authentication, role access, enrolment and progress in a disposable database | Test suite and recorded results |
| 4 | Address quiz-answer exposure and client-trusted completion score | Corrected assessment flow and regression evidence |
| 5 | Decide whether to implement admin grading/payment screens or document these as API-only limitations | Agreed UI scope and verified workflows |
| 6 | Perform integration, accessibility and browser checks; conduct approved user evaluation if planned | Test report and evaluation evidence |
| 7 | Complete academic report, user manual and technical documentation | Draft documents |
| 8 | Supervisor review, corrections, final build and presentation | Final submission package |

## 6.4 Development Activities

Recommended activities include scope confirmation; data protection and ethical review where applicable; requirements and diagram preparation; test design; implementation of agreed fixes; integration testing; user-document review; supervisor review; and final packaging. Only activities supported by dated records should be reported as completed.

## 6.5 Required Hardware and Software

- Computer capable of running Node.js, npm, a current browser and a code editor.
- Internet access for package installation, research and any hosted demonstration.
- Node.js/npm, Git, Visual Studio Code or equivalent, and a modern browser.
- Word processor for final institutional formatting.
- Diagram renderer or editor capable of rendering Mermaid.
- A separate test database and backup storage.

The listed software is either already represented by the project or commonly available without a new proprietary licence; exact versions should be recorded from the final development environment.

## 6.6 Estimated Project Budget

The following is a planning estimate in Zambian kwacha. It is not an expenditure report.

### Table 6.2: Indicative budget

| Item | Estimate (ZMW) | Basis |
|---|---:|---|
| Internet/data | 1,200–2,400 | Estimated over 2–4 months; confirm current provider charges |
| Local transport for supervisor/stakeholder meetings | 400–1,000 | Depends on number and distance of trips |
| Printing and binding | 300–700 | Depends on required copies and page count |
| Optional domain/hosting | 0–700 | Local demonstration or an appropriate free tier may suffice |
| Contingency | 300–500 | Minor project costs |
| **Estimated total** | **2,200–5,300** | Excludes an already available computer and institutional facilities |

Actual prices and actual student expenditure must be supplied from receipts or confirmed quotations if the final report requires them.

## 6.7 Risk Analysis and Mitigation

### Table 6.3: Project risk register

| Risk | Likelihood / impact | Mitigation |
|---|---|---|
| Development database is overwritten by seed script | Medium / High | Back up first; use a disposable database; warn users that seed code deletes rows |
| Quiz results can be manipulated | High / High | Calculate scores server-side; do not return answer keys; add tests before relying on results |
| Secrets are exposed in source or documentation | Medium / High | Exclude `.env`; use placeholders; rotate any secret found in a shared environment |
| Project scope expands beyond available time | Medium / Medium | Freeze scope; prioritise current learning workflow and academic requirements |
| Admin work cannot be completed through the UI | High / Medium | Decide whether to implement screens or document API-only capability as a limitation |
| No test participants or approval for evaluation | Medium / Medium | Report evaluation as not performed; do not invent results; use code-based tests |
| Data loss or SQLite file corruption | Low/Medium / High | Create dated backups and verify restoration on a copy |
| Hosting or internet unavailable for demonstration | Medium / Medium | Prepare a local offline code demonstration; explain service dependency |
| Payment amount or process is not authorised | Medium / High | Confirm policy with project owner/institution or label it as unverified prototype configuration |

## 6.8 Project Constraints

Constraints include academic deadlines, student-level resources, network availability, the limited SQLite deployment model, incomplete automated tests, dependency on accurate course content and lack of confirmed institutional policy regarding certificate fees. The student should not collect real learner data or conduct participant evaluation without appropriate approval and consent.

## 6.9 Chapter Summary

This chapter provides an indicative schedule, resource list, budget and risk plan. None of the proposed estimates is represented as actual expenditure or completed work.

# CHAPTER SEVEN: CONCLUSION AND RECOMMENDATIONS

## 7.1 Introduction

This chapter summarises the implemented system and evaluates it conservatively against the objectives.

## 7.2 Summary of the Project

YouthSkills Program is a web application for digital-skills learning. The inspected implementation combines user accounts, a course catalogue, modules, quizzes, text assignments, enrolments, progress records, certificate records, public certificate verification, notifications and selected administrator functions. It uses React/Vite, Express/Node.js, SQLite, JWT and bcryptjs.

## 7.3 Achievement of Objectives

Source code exists for registration, profile management, course access and enrolment, learning activities, progress, certificates and selected administration. These objectives are **implemented in code**, but most have not been functionally tested as part of this documentation review. Administrator functions are only partially represented in the interface. The frontend build was verified; no user study, complete end-to-end testing or measured educational outcome is claimed.

## 7.4 Conclusion

The project provides a practical prototype for delivering introductory digital-skills course content and recording learner activity. Its architecture and schema support a clear learner workflow from registration through course completion and certificate verification. The current implementation is not a full institutional LMS, does not provide trainer accounts, and must not be described as an employment service. Before wider use, the project requires stronger assessment integrity, fuller administrative workflows, systematic testing, operational review of certificate payments and privacy/security checks.

## 7.5 Recommendations

1. Add automated backend tests for authentication, role restrictions, enrolment, progress, assignment handling, certificate issuance and payment decisions.
2. Rework quiz scoring so answer keys remain server-side and module completion is based on a validated server-side quiz attempt.
3. Provide administrator UI for assignment grading and payment review, or clearly limit and document those operations as API-only.
4. Confirm whether the certificate fee and manual proof process are authorised and suitable; remove or revise the fee if it is not an approved requirement.
5. Implement a secure email provider for password-reset delivery before describing reset links as emailed.
6. Review data minimisation, token storage, certificate verification disclosures, CORS and production secret management.
7. Add database backup/restore instructions and avoid running the destructive seed script on non-disposable data.
8. Review accessibility, mobile behaviour, error states, browser compatibility and bundle size.
9. Expand course content only with permission, accurate attribution and a clear content-maintenance process.

## 7.6 Future Improvements

Future work within the learning-platform scope could include trainer accounts and course-authoring screens, additional learning-resource types, assignment file uploads with safe validation, server-recorded quiz attempts, learner data export/removal, email notifications, richer completion reports and migration to a managed relational database if user volume justifies it. These are recommendations, not current capabilities.

# REFERENCES

Anderson, T. (ed.) (2008) *The Theory and Practice of Online Learning*. 2nd edn. Edmonton: Athabasca University Press. Available at: https://www.aupress.ca/books/120146-the-theory-and-practice-of-online-learning/ (Accessed: 11 October 2026).

Bates, A.W. (2019) *Teaching in a Digital Age: Guidelines for Designing Teaching and Learning*. 2nd edn. Vancouver: Tony Bates Associates Ltd. Available at: https://pressbooks.bccampus.ca/teachinginadigitalagev2/ (Accessed: 11 October 2026).

Elmasri, R. and Navathe, S.B. (2016) *Fundamentals of Database Systems*. 7th edn. Boston: Pearson.

Express.js (n.d.) *Express - Node.js web application framework*. Available at: https://expressjs.com/ (Accessed: 11 October 2026).

Instructure (n.d.) *Canvas LMS*. Available at: https://www.instructure.com/canvas (Accessed: 11 October 2026).

Moodle (n.d.) *Moodle LMS*. Available at: https://moodle.org/ (Accessed: 11 October 2026).

OWASP Foundation (2021) *OWASP Top 10:2021*. Available at: https://owasp.org/Top10/ (Accessed: 11 October 2026).

React (n.d.) *React documentation*. Available at: https://react.dev/ (Accessed: 11 October 2026).

SQLite (n.d.) *SQLite Documentation*. Available at: https://www.sqlite.org/docs.html (Accessed: 11 October 2026).

Watson, W.R. and Watson, S.L. (2007) ‘An argument for clarity: what are learning management systems, what are they not, and what should they become?’, *TechTrends*, 51, pp. 28–34. doi: 10.1007/s11528-007-0023-y.

# APPENDICES

## Appendix A: Selected Source Files

The main implementation files identified during analysis are:

- `backend/src/server.js`
- `backend/src/database.js`
- `backend/src/middleware/auth.js`
- `backend/src/routes/auth.js`
- `backend/src/routes/users.js`
- `backend/src/routes/courses.js`
- `backend/src/routes/progress.js`
- `backend/src/routes/assignments.js`
- `backend/src/routes/certificates.js`
- `backend/src/routes/payments.js`
- `backend/src/routes/notifications.js`
- `backend/src/routes/dashboard.js`
- `backend/src/utils/seed.js`
- `frontend/src/App.jsx`
- `frontend/src/context/AuthContext.jsx`
- `frontend/src/utils/api.js`
- `frontend/src/pages/CoursesPage.jsx`
- `frontend/src/pages/CourseDetailPage.jsx`
- `frontend/src/pages/CertificatesPage.jsx`
- `frontend/src/pages/DashboardPage.jsx`

Full source code is maintained in the project repository and is not reproduced here.

## Appendix B: Database Schema

The actual schema is implemented in `backend/src/database.js` and summarised in Chapter Three and the technical manual. Do not include credentials or copy the live database file into a public submission.

## Appendix C: Installation and Configuration Guide

See `YouthSkills-Program-Technical-Documentation.md`. The seed script deletes records and must only be run against a disposable or backed-up database.

## Appendix D: User Manual

See `YouthSkills-Program-User-Manual.md`.

## Appendix E: Administrator Manual

See the administrator section of `YouthSkills-Program-User-Manual.md` and the API details in `YouthSkills-Program-Technical-Documentation.md`. Some operations are API-only in the current frontend.

## Appendix F: Test Cases and Test Evidence

Proposed cases are in Chapter Five. Except for the frontend build, cases remain **Not Tested** and need execution evidence before submission as completed test results.

## Appendix G: System Diagrams

Editable Mermaid diagrams are supplied in `YouthSkills-Program-Diagrams.md`.

## Appendix H: Screenshots

No screenshots were captured for this documentation. Insert only screenshots taken from the actual running project, with test or personal information removed or replaced by synthetic data.
