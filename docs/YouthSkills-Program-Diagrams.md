# YouthSkills Program — Editable System Diagrams

**Diagram status:** These Mermaid diagrams describe the current inspected implementation. They intentionally omit employment, opportunity, trainer and mentorship components because those features are not present in the current application. They can be rendered in Mermaid-compatible editors or documentation systems and redrawn for a final Word submission.

## Figure 3.1: Implemented high-level system architecture

```mermaid
flowchart LR
    Browser["User browser<br/>React 18 + React Router + Tailwind"]
    Vite["Vite development server<br/>port 3000; /api proxy"]
    API["Express API<br/>Node.js; port 5000"]
    Auth["JWT authentication<br/>bcryptjs password hashing<br/>role middleware"]
    Routes["API route modules<br/>auth, users, courses, progress,<br/>assignments, certificates, payments,<br/>notifications, dashboards"]
    DB["SQLite database<br/>schema initialised at startup"]
    Seed["Seed utility<br/>sample learning content"]
    PDF["Browser PDF generation<br/>jsPDF"]

    Browser --> Vite
    Vite --> API
    Browser -->|"REST/JSON requests"| API
    API --> Auth
    Auth --> Routes
    Routes --> DB
    API --> Seed
    Browser --> PDF
```

## Figure 3.2: Implemented use-case overview

```mermaid
flowchart LR
    Youth([Youth learner])
    Admin([Administrator])
    Visitor([Public visitor])

    subgraph System["YouthSkills Program"]
      Register["Register / sign in"]
      Profile["Manage profile"]
      Courses["Browse courses and modules"]
      Enrol["Enrol in a course"]
      Quiz["Submit quiz answers"]
      Assignment["Submit assignment"]
      Progress["View course progress"]
      Certificate["View / download certificate"]
      Notify["View notifications"]
      Verify["Verify certificate number"]
      AdminDash["View admin dashboard"]
      UserList["Search youth accounts"]
      ModuleList["View courses and modules"]
      AdminAPI["Use protected admin APIs<br/>course creation, grading,<br/>payment decisions"]
    end

    Youth --> Register
    Youth --> Profile
    Youth --> Courses
    Youth --> Enrol
    Youth --> Quiz
    Youth --> Assignment
    Youth --> Progress
    Youth --> Certificate
    Youth --> Notify
    Visitor --> Verify
    Admin --> Register
    Admin --> Profile
    Admin --> AdminDash
    Admin --> UserList
    Admin --> ModuleList
    Admin --> AdminAPI
```

> The administrator use case includes API capabilities that are not all accessible through the current dashboard UI. The `employer` role is omitted because its UI is a placeholder and it has no active course or employment workflow.

## Figure 3.3: Level 0 data-flow diagram

```mermaid
flowchart LR
    Learner["External entity:<br/>Youth learner"]
    Admin["External entity:<br/>Administrator"]
    Public["External entity:<br/>Certificate verifier"]
    App["Process 0:<br/>YouthSkills Program<br/>React client + Express API"]
    DB[("D1: SQLite database")]

    Learner -->|"credentials, profile, enrolment,<br/>quiz answers, assignment text,<br/>payment proof"| App
    App -->|"course content, progress,<br/>scores, notifications,<br/>certificate status"| Learner
    Admin -->|"course/module/quiz data,<br/>grades, payment decisions"| App
    App -->|"dashboard summaries, youth/course data,<br/>submission/payment lists"| Admin
    Public -->|"certificate number"| App
    App -->|"verification status and selected<br/>certificate/holder details"| Public
    App <--> DB
```

## Figure 3.4: Entity-relationship overview based on actual tables

```mermaid
erDiagram
    USERS {
        TEXT id PK
        TEXT name
        TEXT email UK
        TEXT password
        TEXT role
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
    }
    QUIZZES {
        TEXT id PK
        TEXT module_id FK
        TEXT question
        TEXT options
        INTEGER correct_answer
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
    }
    ASSIGNMENT_SUBMISSIONS {
        TEXT id PK
        TEXT assignment_id FK
        TEXT user_id FK
        TEXT submission_text
        INTEGER grade
        TEXT feedback
    }
    CERTIFICATES {
        TEXT id PK
        TEXT user_id FK
        TEXT course_id FK
        TEXT certificate_number UK
    }
    CERTIFICATE_PAYMENTS {
        TEXT id PK
        TEXT user_id FK
        TEXT certificate_id FK
        INTEGER amount
        TEXT currency
        TEXT status
    }
    NOTIFICATIONS {
        TEXT id PK
        TEXT user_id FK
        TEXT title
        INTEGER is_read
    }
    PASSWORD_RESETS {
        TEXT id PK
        TEXT user_id FK
        TEXT token
        DATETIME expires_at
        INTEGER used
    }

    COURSES ||--o{ MODULES : contains
    MODULES ||--o{ QUIZZES : has
    USERS ||--o{ ENROLLMENTS : makes
    COURSES ||--o{ ENROLLMENTS : receives
    USERS ||--o{ MODULE_PROGRESS : records
    MODULES ||--o{ MODULE_PROGRESS : tracks
    COURSES ||--o{ ASSIGNMENTS : includes
    MODULES ||--o{ ASSIGNMENTS : includes
    ASSIGNMENTS ||--o{ ASSIGNMENT_SUBMISSIONS : receives
    USERS ||--o{ ASSIGNMENT_SUBMISSIONS : submits
    USERS ||--o{ CERTIFICATES : earns
    COURSES ||--o{ CERTIFICATES : certifies
    USERS ||--o{ CERTIFICATE_PAYMENTS : submits
    CERTIFICATES ||--o{ CERTIFICATE_PAYMENTS : has_proof
    USERS ||--o{ NOTIFICATIONS : receives
    USERS ||--o{ PASSWORD_RESETS : requests
```

> The diagram shows declared foreign-key relationships. Some columns that logically refer to another table do not have declared foreign keys in the schema; see the technical documentation. Mermaid cardinalities do not replace the exact unique constraints documented in the schema.

## Figure 3.5: Authentication process

```mermaid
flowchart TD
    Start([User opens sign-in page])
    Credentials["Enter email and password"]
    Submit["POST /api/auth/login"]
    Lookup["Backend looks up email"]
    Compare["bcryptjs compares password"]
    Valid{"Credentials valid?"}
    Sign["Sign JWT using environment secret"]
    Store["Frontend stores token and user<br/>in localStorage or sessionStorage"]
    Request["Protected request sends Bearer token"]
    Verify["Middleware verifies JWT and reloads user"]
    Role{"Route requires role?"}
    Allow["Continue to route"]
    Deny["Return 403"]
    Fail["Return 401"]
    End([Authenticated session])

    Start --> Credentials --> Submit --> Lookup --> Compare --> Valid
    Valid -- No --> Fail
    Valid -- Yes --> Sign --> Store --> Request --> Verify --> Role
    Role -- No --> Allow --> End
    Role -- Yes, permitted --> Allow
    Role -- Yes, not permitted --> Deny
```

## Figure 3.6: Course enrolment and course-access workflow

```mermaid
flowchart TD
    Open["Authenticated learner opens course catalogue"]
    List["GET /api/courses"]
    Select["Select a published course"]
    Detail["GET /api/courses/:id"]
    Enrolled{"Enrolment exists?"}
    Show["Frontend shows course and modules"]
    Enrol["Learner selects Enroll Now"]
    Post["POST /api/courses/:id/enroll"]
    Duplicate{"Already enrolled?"}
    Save["Create enrolment and notification"]
    Done([Course enrolled])
    Error["Return conflict or course-not-found response"]

    Open --> List --> Select --> Detail --> Enrolled
    Enrolled -- Yes --> Show
    Enrolled -- No --> Show --> Enrol --> Post --> Duplicate
    Duplicate -- No --> Save --> Done
    Duplicate -- Yes --> Error
```

> Access-control limitation: the frontend visually locks module interactions for a youth who is not enrolled, but the authenticated course-detail API returns module/quiz content without requiring an enrolment. This workflow diagram describes user-facing behaviour, not a guaranteed server-side content restriction.

## Figure 3.7: Assessment workflow as implemented

```mermaid
flowchart TD
    Start([Enrolled learner opens module])
    Read["Read module content"]
    HasQuiz{"Module has quiz?"}
    Mark["Learner selects Mark Complete"]
    Answer["Select answers"]
    Submit["POST quiz answers"]
    Score["Server calculates score"]
    Return["Response includes score,<br/>correct answers and explanations"]
    Pass{"Score at least 60%?"}
    Complete["Client sends quiz_score<br/>to module completion route"]
    Check["Server checks enrolment and<br/>client-supplied score"]
    Save["Progress record saved"]
    Retry["Learner may retry quiz"]
    End([Module completion recorded])

    Start --> Read --> HasQuiz
    HasQuiz -- No --> Mark --> Check
    HasQuiz -- Yes --> Answer --> Submit --> Score --> Return --> Pass
    Pass -- Yes --> Complete --> Check --> Save --> End
    Pass -- No --> Retry --> Answer
```

> Security limitation: the quiz response reveals correct answers, and the module-completion request accepts the client's score. The diagram documents this behaviour; it is not a recommended assessment design.

## Figure 3.8: Certificate generation and payment-proof workflow

```mermaid
flowchart TD
    Progress["Learner completes modules"]
    All{"All course modules recorded complete?"}
    No["Continue course"]
    Issue["Backend creates certificate record<br/>and certificate number"]
    Notify["Backend creates notification"]
    Page["Certificate appears in learner page"]
    Proof["Learner submits payment-reference text"]
    Pending["Payment proof stored as pending"]
    Admin["Admin reviews via protected API"]
    Decision{"Admin decision"}
    Approve["Mark approved and notify learner"]
    Reject["Mark rejected and notify learner"]
    Download{"Payment status approved?"}
    PDF["Browser creates PDF using jsPDF"]
    Verify["Public endpoint verifies certificate number"]

    Progress --> All
    All -- No --> No --> Progress
    All -- Yes --> Issue --> Notify --> Page
    Page --> Proof --> Pending --> Admin --> Decision
    Decision -- Approve --> Approve --> Download
    Decision -- Reject --> Reject --> Page
    Page --> Download
    Download -- Yes --> PDF
    Download -- No --> Proof
    Page --> Verify
```

> No electronic payment provider is integrated. Approval represents a manual status change. The inspected administrator interface does not include a payment-review screen; the decision is exposed as an admin API operation.
