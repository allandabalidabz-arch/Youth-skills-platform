# YouthSkills Program — System Diagrams

**Version:** 2.0 — reflects the fully implemented system.  
These diagrams are written in Mermaid syntax. Render them in any Mermaid-compatible editor (e.g. mermaid.live) or import into a word processor for the final submission.

---

## Figure 3.1: System Architecture

```mermaid
flowchart LR
    Browser["User Browser\nReact 18 + React Router + Tailwind CSS"]
    Vite["Vite Dev Server\nport 3000 — /api proxy"]
    API["Express REST API\nNode.js — port 5000"]
    Auth["JWT Middleware\nbcryptjs password hashing\nrole-based authorisation"]
    Routes["Route Modules\nauth, users, courses, progress\nassignments, certificates\npayments, notifications, dashboard"]
    DB["SQLite Database\nWAL mode — auto-migration"]
    Email["Nodemailer\nGmail SMTP"]
    PDF["jsPDF\nBrowser-side PDF generation"]

    Browser --> Vite
    Vite -->|"/api proxy"| API
    API --> Auth
    Auth --> Routes
    Routes --> DB
    Routes --> Email
    Browser --> PDF
```

---

## Figure 3.2: User Roles and Use Cases

```mermaid
flowchart LR
    Youth([Youth Learner])
    Admin([Administrator])
    Public([Public Visitor])

    subgraph Platform["YouthSkills Program"]
      Reg["Register with NRC"]
      Login["Sign In"]
      Profile["Manage Profile"]
      Browse["Browse Courses"]
      Enrol["Enrol in Course"]
      Study["Study Module Content"]
      Quiz["Take Quiz"]
      Assign["Submit Assignment"]
      Progress["View Progress"]
      Cert["View / Download Certificate"]
      Pay["Submit Payment Proof"]
      Notify["View Notifications"]
      Verify["Verify Certificate"]

      AdminLogin["Admin Sign In"]
      Overview["View Overview Dashboard"]
      YouthList["Search Registered Youth"]
      Completions["View Course Completions"]
      Modules["Browse Modules"]
      Grade["Grade Assignment"]
      ApprovePay["Approve / Reject Payment"]
    end

    Youth --> Reg
    Youth --> Login
    Youth --> Profile
    Youth --> Browse
    Youth --> Enrol
    Youth --> Study
    Youth --> Quiz
    Youth --> Assign
    Youth --> Progress
    Youth --> Cert
    Youth --> Pay
    Youth --> Notify

    Public --> Verify

    Admin --> AdminLogin
    Admin --> Overview
    Admin --> YouthList
    Admin --> Completions
    Admin --> Modules
    Admin --> Grade
    Admin --> ApprovePay
```

---

## Figure 3.3: Level 0 Data Flow Diagram (Context Diagram)

```mermaid
flowchart LR
    Learner["Youth Learner"]
    AdminActor["Administrator"]
    PublicActor["Public Certificate Verifier"]
    System["YouthSkills Program\nReact Client + Express API"]
    DBStore[("SQLite Database")]
    EmailSvc["Gmail SMTP"]

    Learner -->|"credentials, NRC, profile\nenrolment, quiz answers\nassignment text, payment proof"| System
    System -->|"course content, quiz results\nprogress, notifications\ncertificate status"| Learner

    AdminActor -->|"grades, payment decisions\ncourse/module data"| System
    System -->|"dashboard stats, youth list\ncompletions, submissions\npayment records"| AdminActor

    PublicActor -->|"certificate number"| System
    System -->|"verification result\nholder name, course, date"| PublicActor

    System <-->|"read/write"| DBStore
    System -->|"payment notification email"| EmailSvc
```

---

## Figure 3.4: Entity-Relationship Diagram

```mermaid
erDiagram
    USERS {
        TEXT id PK
        TEXT name
        TEXT email UK
        TEXT password
        TEXT role
        TEXT nrc UK
        TEXT location
        TEXT phone
        TEXT skills
    }
    COURSES {
        TEXT id PK
        TEXT title
        TEXT category
        TEXT level
        TEXT instructor_name
    }
    MODULES {
        TEXT id PK
        TEXT course_id FK
        TEXT title
        TEXT content
        INTEGER order_index
        INTEGER duration_minutes
    }
    QUIZZES {
        TEXT id PK
        TEXT module_id FK
        TEXT question
        TEXT options
        INTEGER correct_answer
        TEXT explanation
    }
    ENROLLMENTS {
        TEXT id PK
        TEXT user_id FK
        TEXT course_id FK
        DATETIME enrolled_at
        DATETIME completed_at
    }
    MODULE_PROGRESS {
        TEXT id PK
        TEXT user_id FK
        TEXT module_id FK
        TEXT course_id
        INTEGER completed
        INTEGER quiz_score
    }
    ASSIGNMENTS {
        TEXT id PK
        TEXT module_id FK
        TEXT course_id FK
        TEXT title
        TEXT instructions
    }
    ASSIGNMENT_SUBMISSIONS {
        TEXT id PK
        TEXT assignment_id FK
        TEXT user_id FK
        TEXT submission_text
        INTEGER grade
        TEXT feedback
        TEXT status
    }
    CERTIFICATES {
        TEXT id PK
        TEXT user_id FK
        TEXT course_id FK
        TEXT certificate_number UK
        DATETIME issued_at
    }
    CERTIFICATE_PAYMENTS {
        TEXT id PK
        TEXT user_id FK
        TEXT certificate_id FK
        INTEGER amount
        TEXT currency
        TEXT proof_text
        TEXT status
    }
    NOTIFICATIONS {
        TEXT id PK
        TEXT user_id FK
        TEXT title
        TEXT message
        TEXT type
        INTEGER is_read
    }
    PASSWORD_RESETS {
        TEXT id PK
        TEXT user_id FK
        TEXT token
        DATETIME expires_at
        INTEGER used
    }

    COURSES ||--o{ MODULES : "contains"
    MODULES ||--o{ QUIZZES : "has"
    USERS ||--o{ ENROLLMENTS : "makes"
    COURSES ||--o{ ENROLLMENTS : "receives"
    USERS ||--o{ MODULE_PROGRESS : "records"
    MODULES ||--o{ MODULE_PROGRESS : "tracked in"
    COURSES ||--o{ ASSIGNMENTS : "includes"
    MODULES ||--o{ ASSIGNMENTS : "linked to"
    ASSIGNMENTS ||--o{ ASSIGNMENT_SUBMISSIONS : "receives"
    USERS ||--o{ ASSIGNMENT_SUBMISSIONS : "submits"
    USERS ||--o{ CERTIFICATES : "earns"
    COURSES ||--o{ CERTIFICATES : "certifies"
    USERS ||--o{ CERTIFICATE_PAYMENTS : "submits"
    CERTIFICATES ||--o{ CERTIFICATE_PAYMENTS : "has proof"
    USERS ||--o{ NOTIFICATIONS : "receives"
    USERS ||--o{ PASSWORD_RESETS : "requests"
```

---

## Figure 3.5: Authentication Flow

```mermaid
flowchart TD
    Start([User opens login page])
    Enter["Enter email and password"]
    Submit["POST /api/auth/login"]
    Lookup["Backend looks up email in database"]
    Compare["bcryptjs compares password hash"]
    Valid{"Credentials valid?"}
    Sign["Sign JWT with JWT_SECRET"]
    Store["Frontend stores token\nlocalStorage or sessionStorage"]
    Request["Protected request with Bearer token"]
    Verify["Middleware verifies JWT\nreloads user from database"]
    Role{"Route requires role?"}
    Allow["Continue to route handler"]
    Deny403["Return 403 Forbidden"]
    Fail401["Return 401 Unauthorised"]
    End([Authenticated session active])

    Start --> Enter --> Submit --> Lookup --> Compare --> Valid
    Valid -- No --> Fail401
    Valid -- Yes --> Sign --> Store --> Request --> Verify --> Role
    Role -- No --> Allow --> End
    Role -- Yes, permitted --> Allow
    Role -- Yes, not permitted --> Deny403
```

---

## Figure 3.6: Course Enrolment and Completion Flow

```mermaid
flowchart TD
    Open["Learner opens Courses page"]
    List["GET /api/courses"]
    Select["Select a course"]
    Detail["GET /api/courses/:id"]
    Enrolled{"Already enrolled?"}
    ShowLocked["Show locked modules\nEnroll Now button visible"]
    Enrol["POST /api/courses/:id/enroll"]
    ShowModules["Modules unlock\nProgress bar appears"]
    StudyModule["Learner studies module content"]
    HasQuiz{"Module has quiz?"}
    MarkComplete["Click Mark Complete"]
    TakeQuiz["Take Quiz"]
    Score{"Score ≥ 60%?"}
    Retry["Retry Quiz"]
    ModuleComplete["Module marked complete\nPOST /progress/module/:id/complete"]
    AllDone{"All 3 modules complete?"}
    Certificate["Certificate issued\nNotification sent\nRedirect to Certificates page"]
    NextModule["Continue to next module"]

    Open --> List --> Select --> Detail --> Enrolled
    Enrolled -- No --> ShowLocked --> Enrol --> ShowModules
    Enrolled -- Yes --> ShowModules
    ShowModules --> StudyModule --> HasQuiz
    HasQuiz -- No --> MarkComplete --> ModuleComplete
    HasQuiz -- Yes --> TakeQuiz --> Score
    Score -- No --> Retry --> TakeQuiz
    Score -- Yes --> ModuleComplete
    ModuleComplete --> AllDone
    AllDone -- No --> NextModule --> StudyModule
    AllDone -- Yes --> Certificate
```

---

## Figure 3.7: Certificate Payment Flow

```mermaid
flowchart TD
    CertPage["Learner opens Certificates page"]
    NotPaid{"Payment approved?"}
    ShowLock["Show 2,000 ZMW button"]
    ShowPDF["PDF download button enabled"]
    OpenForm["Learner clicks 2,000 ZMW\nPayment panel opens"]
    ShowNumber["Display mobile money number\n0970 342 178 — Allan Dabali"]
    Send["Learner sends 2,000 ZMW\nvia mobile money"]
    EnterRef["Enter transaction reference number"]
    Submit["POST /api/payments/certificate/:id/submit"]
    InAppNotif["In-app notification created for admin"]
    EmailNotif["Email sent to allandabalidabz@gmail.com"]
    AdminReview["Admin opens Payments tab\nReviews proof reference"]
    Decision{"Admin decision"}
    Approve["PUT /api/payments/:id/approve\nStatus = approved"]
    Reject["PUT /api/payments/:id/reject\nStatus = rejected"]
    NotifyApprove["Learner notified: Certificate Unlocked"]
    NotifyReject["Learner notified: Payment Not Verified"]
    Download["PDF download button unlocks\nLearner downloads certificate"]

    CertPage --> NotPaid
    NotPaid -- No --> ShowLock --> OpenForm --> ShowNumber --> Send --> EnterRef --> Submit
    Submit --> InAppNotif
    Submit --> EmailNotif
    InAppNotif --> AdminReview
    AdminReview --> Decision
    Decision -- Approve --> Approve --> NotifyApprove --> Download
    Decision -- Reject --> Reject --> NotifyReject --> OpenForm
    NotPaid -- Yes --> ShowPDF --> Download
```

---

## Figure 3.8: Assignment Submission and Grading Flow

```mermaid
flowchart TD
    Open["Learner opens enrolled course module"]
    AssignSection["Assignment section visible at bottom of module"]
    Read["Read assignment instructions"]
    Write["Type response in text area\nminimum 20 characters"]
    Submit["POST /api/assignments/:id/submit"]
    Status["Status: Awaiting Grading\nText area hidden"]
    AdminTab["Admin opens Assignments tab"]
    Expand["Click Grade button\nRead full submission"]
    EnterGrade["Enter grade 0–100\nWrite optional feedback"]
    Grade["PUT /api/assignments/submission/:id/grade"]
    Notify["Learner notified with score and feedback"]
    ViewFeedback["Learner sees grade badge and feedback\nin course module"]

    Open --> AssignSection --> Read --> Write --> Submit --> Status
    Status --> AdminTab --> Expand --> EnterGrade --> Grade --> Notify --> ViewFeedback
```
