require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { getDb } = require('../database');

async function addModules(db, courseId, modules) {
  const ids = [];
  for (const m of modules) {
    const mid = uuidv4();
    ids.push(mid);
    await db.run('INSERT INTO modules (id, course_id, title, content, order_index, duration_minutes) VALUES (?, ?, ?, ?, ?, ?)',
      [mid, courseId, m.title, m.content, m.order_index, m.duration_minutes]);
  }
  return ids;
}

async function addAssignment(db, moduleId, courseId, title, description, instructions) {
  await db.run('INSERT INTO assignments (id, module_id, course_id, title, description, instructions, due_days) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [uuidv4(), moduleId, courseId, title, description, instructions, 7]);
}

async function addQuizzes(db, quizzes) {
  for (const q of quizzes) {
    await db.run('INSERT INTO quizzes (id, module_id, question, options, correct_answer, explanation) VALUES (?, ?, ?, ?, ?, ?)',
      [uuidv4(), q.moduleId, q.question, JSON.stringify(q.options), q.correct, q.explanation]);
  }
}

async function seedData(db) {
  const hashedPw = await bcrypt.hash('password123', 12);
  const adminId = uuidv4(), youth1Id = uuidv4(), youth2Id = uuidv4(), employer1Id = uuidv4(), employer2Id = uuidv4();

  const insertUser = async (id, name, email, role, bio, location, skills) => {
    await db.run('INSERT INTO users (id, name, email, password, role, bio, location, skills) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [id, name, email, hashedPw, role, bio, location, JSON.stringify(skills)]);
  };

  await insertUser(adminId, 'Admin User', 'admin@youthskills.com', 'admin', 'Platform administrator', 'Lusaka, Zambia', []);
  await insertUser(youth1Id, 'Amara Osei', 'amara@example.com', 'youth', 'Passionate about technology and systems', 'Lusaka, Zambia', ['System Analysis', 'Web Development']);
  await insertUser(youth2Id, 'Kwame Mensah', 'kwame@example.com', 'youth', 'Aspiring software developer', 'Ndola, Zambia', ['HTML', 'CSS', 'JavaScript']);
  await insertUser(employer1Id, 'TechAfrica Ltd', 'hr@techafrica.com', 'employer', 'Leading tech company in Africa', 'Lusaka, Zambia', []);
  await insertUser(employer2Id, 'Creative Hub', 'jobs@creativehub.com', 'employer', 'Creative agency for digital content', 'Kitwe, Zambia', []);

  const courses = [
    {
      id: uuidv4(),
      title: 'System Analysis and Design',
      category: 'system',
      level: 'beginner',
      description: 'Learn how to analyse, model, and design information systems from scratch. This course covers the full system development life cycle, requirements gathering, data flow diagrams, entity relationship diagrams, and system design principles used in real software projects.',
      duration_hours: 20,
      instructor_name: 'Allan Dabali',
      instructor_bio: 'Digital Skills Trainer & Platform Director, YouthSkills Program',
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400',
      tags: ['Systems', 'Analysis', 'Design', 'SDLC', 'DFD', 'ERD']
    },
    {
      id: uuidv4(),
      title: 'Web Development',
      category: 'coding',
      level: 'beginner',
      description: 'Learn the fundamentals of web development using HTML, CSS, and JavaScript. This course takes you from building your first webpage to creating interactive, responsive websites ready for the modern internet.',
      duration_hours: 25,
      instructor_name: 'Allan Dabali',
      instructor_bio: 'Digital Skills Trainer & Platform Director, YouthSkills Program',
      thumbnail: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400',
      tags: ['HTML', 'CSS', 'JavaScript', 'Web', 'Frontend']
    },
    {
      id: uuidv4(),
      title: 'Operating Systems',
      category: 'system',
      level: 'beginner',
      description: 'Understand how operating systems work, manage hardware resources, and provide services to applications. This course covers processes, memory management, file systems, and the fundamentals of both Windows and Linux operating environments.',
      duration_hours: 18,
      instructor_name: 'Allan Dabali',
      instructor_bio: 'Digital Skills Trainer & Platform Director, YouthSkills Program',
      thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400',
      tags: ['Operating Systems', 'Linux', 'Windows', 'Processes', 'Memory']
    },
  ];

  for (const c of courses) {
    await db.run(
      'INSERT INTO courses (id, title, description, category, level, duration_hours, thumbnail, instructor_name, instructor_bio, tags) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [c.id, c.title, c.description, c.category, c.level, c.duration_hours, c.thumbnail, c.instructor_name, c.instructor_bio, JSON.stringify(c.tags)]
    );
  }

  // ── COURSE 1: System Analysis and Design ──────────────────────────────────
  const sadIds = await addModules(db, courses[0].id, [
    {
      title: 'Introduction to System Analysis',
      order_index: 1,
      duration_minutes: 55,
      content: `INTRODUCTION TO SYSTEM ANALYSIS

System Analysis is the process of studying a current system or situation, identifying its problems, and determining the requirements for a new or improved system.

WHAT IS A SYSTEM?
A system is a set of components that work together to achieve a common goal.
Examples of information systems:
- A hospital patient management system
- A school student records system
- An online banking system
- A supermarket point-of-sale system

THE SYSTEM DEVELOPMENT LIFE CYCLE (SDLC)
The SDLC is the structured process used to develop information systems. It has 6 phases:

1. PLANNING
   - Define the problem or opportunity
   - Determine if the project is feasible
   - Create a project plan with timelines and budget
   - Key question: Should we build this system?

2. SYSTEM ANALYSIS
   - Study the current system in detail
   - Gather requirements from users and stakeholders
   - Identify what the new system must do
   - Key question: What does the system need to do?

3. SYSTEM DESIGN
   - Design the database, user interface, and processes
   - Create diagrams and models of the new system
   - Key question: How will the system work?

4. IMPLEMENTATION
   - Write the actual program code
   - Build the database
   - Key question: Build the system

5. TESTING
   - Test the system thoroughly
   - Find and fix bugs and errors
   - Key question: Does the system work correctly?

6. MAINTENANCE
   - Deploy the system to real users
   - Monitor and fix issues that arise
   - Update the system as needs change

TYPES OF SYSTEM ANALYSTS
- Business Analyst: Focuses on business processes and requirements
- Systems Analyst: Focuses on technical design and architecture
- Data Analyst: Focuses on data flows and database design

REQUIREMENTS GATHERING TECHNIQUES
To understand what a system needs to do, analysts use:

1. INTERVIEWS
   Talk directly to users and managers.
   Best for: Detailed, open-ended information.
   
2. QUESTIONNAIRES
   Written questions sent to many people.
   Best for: Collecting data from large groups.

3. OBSERVATION
   Watch users doing their current work.
   Best for: Understanding real workflows, not just what people say they do.

4. DOCUMENT ANALYSIS
   Study existing forms, reports, and records.
   Best for: Understanding current data and processes.

5. WORKSHOPS
   Group sessions with stakeholders to define requirements together.
   Best for: Getting consensus and resolving conflicts.

FUNCTIONAL vs NON-FUNCTIONAL REQUIREMENTS

Functional Requirements: What the system MUST DO
Examples:
- The system shall allow users to register with an email and password
- The system shall send a confirmation email after registration
- The system shall allow admins to delete user accounts

Non-Functional Requirements: HOW the system should perform
Examples:
- The system shall respond to any request within 2 seconds
- The system shall be available 99.9% of the time
- The system shall support 500 simultaneous users
- All passwords shall be encrypted`
    },
    {
      title: 'Data Flow Diagrams and Use Cases',
      order_index: 2,
      duration_minutes: 65,
      content: `DATA FLOW DIAGRAMS AND USE CASES

DATA FLOW DIAGRAMS (DFD)
A Data Flow Diagram shows how data moves through a system. It is one of the most important tools in system analysis.

DFD SYMBOLS:
1. EXTERNAL ENTITY (Rectangle)
   - A person, organisation, or system outside the system boundary
   - Examples: Customer, Bank, Government Department
   - Provides input to or receives output from the system

2. PROCESS (Circle or Rounded Rectangle)
   - An action that transforms or moves data
   - Always named with a verb (e.g. "Validate Login", "Generate Report")
   - Named with a number for reference (1.0, 2.0, etc.)

3. DATA STORE (Open Rectangle / Two parallel lines)
   - Where data is stored at rest
   - Examples: Student Records, Product Database, Employee File
   - Named as a noun (D1 Student Records)

4. DATA FLOW (Arrow)
   - Shows the movement of data between components
   - Always labelled with what data is flowing
   - Examples: "Login Details", "Student Grade", "Payment Confirmation"

LEVELS OF DFD:

CONTEXT DIAGRAM (Level 0)
The highest level — shows the entire system as ONE process.
Only shows external entities and data flows in/out of the system.
Purpose: Shows the system boundary and who interacts with it.

LEVEL 1 DFD
Breaks the single process in the context diagram into major sub-processes.
Shows the main processes, data stores, and flows between them.

LEVEL 2 DFD
Breaks each Level 1 process into further detail.
Used for complex processes that need more explanation.

DFD RULES:
- Data cannot flow directly between two external entities (must go through a process)
- Data cannot flow directly between two data stores (must go through a process)
- Every process must have at least one input and one output
- Data stores can only be accessed by processes

EXAMPLE — Library System Context Diagram:
External Entities: Member, Librarian, Publisher
System: Library Management System
Flows in: Book Request, Member Registration, Book Supply
Flows out: Book Issued, Membership Card, Overdue Notice

USE CASE DIAGRAMS
A Use Case Diagram shows what a system does from the user's perspective. It is part of UML (Unified Modelling Language).

USE CASE COMPONENTS:
1. ACTOR (Stick figure)
   - Any user or external system that interacts with the system
   - Examples: Student, Teacher, Admin, Payment Gateway

2. USE CASE (Oval)
   - A specific function or feature of the system
   - Named with a verb + noun: "Register Account", "Pay Fee", "View Results"

3. SYSTEM BOUNDARY (Rectangle)
   - A box that encloses all the use cases
   - Actors appear outside the boundary

4. RELATIONSHIPS (Lines)
   - Association: Line connecting actor to use case (actor uses this feature)
   - Include: <<include>> — one use case always includes another
     Example: "Make Payment" always includes "Validate Card"
   - Extend: <<extend>> — one use case sometimes extends another
     Example: "Login" sometimes extends to "Reset Password"

EXAMPLE USE CASES — Student Portal System:
Actors: Student, Lecturer, Admin

Student use cases:
- Register Account
- View Course Results
- Submit Assignment
- Pay Tuition Fee

Lecturer use cases:
- Upload Grades
- View Student List
- Post Course Materials

Admin use cases:
- Manage User Accounts
- Generate Reports
- Configure System`
    },
    {
      title: 'System Design and Entity Relationship Diagrams',
      order_index: 3,
      duration_minutes: 70,
      content: `SYSTEM DESIGN AND ENTITY RELATIONSHIP DIAGRAMS

SYSTEM DESIGN
System design translates the requirements gathered during analysis into a blueprint for the system to be built.

TWO LEVELS OF DESIGN:

1. LOGICAL DESIGN
   - Describes WHAT the system will do without specifying technology
   - Independent of hardware and software choices
   - Includes: Data models, process flows, user interface sketches

2. PHYSICAL DESIGN
   - Describes HOW the system will be implemented
   - Specifies exact hardware, software, database, and programming language
   - Includes: Database schemas, server specifications, network layout

USER INTERFACE DESIGN PRINCIPLES
A good user interface (UI) makes the system easy and efficient to use.

Key principles:
1. CONSISTENCY — Use the same layout, colors, and terminology throughout
2. SIMPLICITY — Show only what the user needs at each step
3. FEEDBACK — Always tell the user what is happening (loading, success, error)
4. ERROR PREVENTION — Validate inputs before processing
5. ACCESSIBILITY — Design for users with disabilities (color contrast, keyboard navigation)

ENTITY RELATIONSHIP DIAGRAMS (ERD)
An ERD shows the data structure of a system — what data is stored and how it is related.

ERD COMPONENTS:

1. ENTITY (Rectangle)
   - A thing about which data is stored
   - Examples: Student, Course, Employee, Product, Order
   - Named as a singular noun

2. ATTRIBUTE (Oval / listed inside entity)
   - A property or characteristic of an entity
   - Examples for Student: StudentID, Name, Email, DateOfBirth
   - Primary Key attribute is underlined

3. RELATIONSHIP (Diamond / Line between entities)
   - Describes how two entities are associated
   - Named with a verb: "ENROLLS IN", "TEACHES", "PLACES", "CONTAINS"

CARDINALITY — How many of each entity participate in a relationship:

ONE-TO-ONE (1:1)
   One entity is associated with exactly one other.
   Example: One Employee has one Employee Profile
   
ONE-TO-MANY (1:N)
   One entity is associated with many of another.
   Example: One Teacher TEACHES many Students
   Example: One Customer PLACES many Orders
   
MANY-TO-MANY (M:N)
   Many of one entity are associated with many of another.
   Example: Many Students ENROLL IN many Courses
   Example: Many Products appear in many Orders
   Note: Many-to-many relationships require a junction/bridge table in the database

EXAMPLE ERD — School System:

Entities: STUDENT, COURSE, LECTURER, ENROLLMENT

STUDENT attributes: StudentID (PK), Name, Email, DateOfBirth, Programme
COURSE attributes: CourseID (PK), CourseName, Credits, Department
LECTURER attributes: LecturerID (PK), Name, Email, Specialisation
ENROLLMENT attributes: EnrollmentID (PK), StudentID (FK), CourseID (FK), EnrollDate, Grade

Relationships:
- STUDENT ENROLLS IN COURSE (Many-to-Many → resolved by ENROLLMENT table)
- LECTURER TEACHES COURSE (One-to-Many)

NORMALIZATION
Normalization is the process of organizing a database to reduce redundancy.

1NF (First Normal Form):
- Each column contains only one value (no lists in a cell)
- Each row is unique

2NF (Second Normal Form):
- Meet 1NF
- Every non-key column depends on the whole primary key

3NF (Third Normal Form):
- Meet 2NF
- No non-key column depends on another non-key column

THE SYSTEM DESIGN DOCUMENT
A formal System Design Document includes:
1. System Overview
2. Architecture Diagram
3. Database Design (ERD + table definitions)
4. User Interface Mockups
5. Process Descriptions
6. Security Design
7. Testing Plan`
    },
  ]);

  await addQuizzes(db, [
    {
      moduleId: sadIds[0],
      question: 'What does SDLC stand for?',
      options: ['Software Development Life Cycle', 'System Development Life Cycle', 'Structured Design and Logic Concept', 'System Design and Layout Concept'],
      correct: 1,
      explanation: 'SDLC stands for System Development Life Cycle — the structured process used to plan, create, test, and deploy an information system.'
    },
    {
      moduleId: sadIds[0],
      question: 'Which requirements gathering technique involves watching users perform their actual work?',
      options: ['Interviews', 'Questionnaires', 'Observation', 'Document Analysis'],
      correct: 2,
      explanation: 'Observation involves watching users doing their real work, which reveals actual workflows that may differ from what people describe in interviews.'
    },
    {
      moduleId: sadIds[1],
      question: 'In a Data Flow Diagram, what does an arrow represent?',
      options: ['A process', 'A data store', 'The movement of data', 'An external entity'],
      correct: 2,
      explanation: 'Arrows in a DFD represent data flows — they show data moving between processes, entities, and data stores.'
    },
    {
      moduleId: sadIds[1],
      question: 'What is a Context Diagram also known as?',
      options: ['Level 1 DFD', 'Level 2 DFD', 'Level 0 DFD', 'Physical DFD'],
      correct: 2,
      explanation: 'A Context Diagram is a Level 0 DFD — it shows the entire system as one process and only depicts external entities and boundary data flows.'
    },
    {
      moduleId: sadIds[2],
      question: 'In an ERD, what does a one-to-many (1:N) relationship mean?',
      options: [
        'One entity relates to exactly one other entity',
        'One entity is associated with many instances of another entity',
        'Many entities relate to many other entities',
        'One entity has no relationship with others'
      ],
      correct: 1,
      explanation: 'A one-to-many relationship means one instance of an entity (e.g. one Teacher) is associated with many instances of another entity (e.g. many Students).'
    },
    {
      moduleId: sadIds[2],
      question: 'What is the purpose of normalization in database design?',
      options: [
        'To make the database run faster',
        'To add more tables to the database',
        'To reduce data redundancy and improve data integrity',
        'To increase the number of relationships'
      ],
      correct: 2,
      explanation: 'Normalization organizes a database to reduce redundancy (repeated data) and ensure data integrity, making the database easier to maintain.'
    },
  ]);

  await addAssignment(db, sadIds[0], courses[0].id,
    'Identify System Requirements',
    'Analyse a real-world scenario and document functional and non-functional requirements.',
    `A local school wants to replace its paper-based student records system with a computerised system. Students currently register manually, results are written in books, and timetables are printed on paper.

Your task:
1. Identify and describe the PROBLEM with the current system (at least 3 problems)
2. Write 6 FUNCTIONAL REQUIREMENTS for the new system (what it must do)
   Format: "The system shall..."
3. Write 4 NON-FUNCTIONAL REQUIREMENTS (performance, security, reliability)
   Format: "The system shall..."
4. Identify 3 STAKEHOLDERS who would be interviewed during requirements gathering and explain what information you would get from each
5. Which requirements gathering technique would you use for this project and why? (Choose 2 techniques and justify)

Write at least 250 words total.`
  );

  await addAssignment(db, sadIds[1], courses[0].id,
    'Draw a Context Diagram',
    'Create a context diagram (Level 0 DFD) for a library management system.',
    `Design a Context Diagram (Level 0 DFD) for a LIBRARY MANAGEMENT SYSTEM.

The system must handle:
- Members borrowing and returning books
- Librarians adding new books and managing members
- Sending overdue notices to members
- Suppliers delivering new book stock

Your submission must include:
1. LIST all External Entities and explain the role of each
2. LIST all Data Flows entering the system (from external entities)
3. LIST all Data Flows leaving the system (to external entities)
4. DESCRIBE the system boundary — what is inside and outside the system
5. DRAW or DESCRIBE your Context Diagram clearly:
   - Name each external entity
   - Label every data flow with what data is moving
   - The system appears as ONE process in the centre
6. Explain why a Context Diagram is drawn before a Level 1 DFD

Note: If you have access to draw.io, Lucidchart, or paper, draw the actual diagram and describe it in words below.`
  );

  await addAssignment(db, sadIds[2], courses[0].id,
    'Design an ERD for a Hospital System',
    'Create an Entity Relationship Diagram for a hospital patient management system.',
    `Design an ERD for a HOSPITAL PATIENT MANAGEMENT SYSTEM.

The system needs to manage:
- Patients who are admitted to the hospital
- Doctors who treat patients
- Wards where patients stay
- Treatments and prescriptions given to patients
- Medical records for each patient visit

Your submission must include:
1. LIST at least 5 ENTITIES with their attributes
   For each entity, underline or mark the Primary Key
2. IDENTIFY all RELATIONSHIPS between entities
   Name each relationship with a verb
3. STATE the CARDINALITY of each relationship (1:1, 1:N, or M:N)
   Explain your reasoning for each
4. IDENTIFY any Many-to-Many relationships and explain what junction table would resolve them
5. DRAW or DESCRIBE your complete ERD
6. Write the database table definition (columns and data types) for any ONE entity

Show clear reasoning for your design choices.`
  );

  // ── COURSE 2: Web Development ──────────────────────────────────────────────
  const webIds = await addModules(db, courses[1].id, [
    {
      title: 'HTML — Building the Structure of Web Pages',
      order_index: 1,
      duration_minutes: 55,
      content: `HTML — BUILDING THE STRUCTURE OF WEB PAGES

HTML (HyperText Markup Language) is the foundation of every web page on the internet. It defines the structure and content of a page.

WHAT HTML DOES:
- Tells the browser what content to display
- Organises content into headings, paragraphs, lists, images, links, and tables
- Does NOT control how things look (that is CSS's job)

YOUR FIRST HTML DOCUMENT:

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My First Web Page</title>
</head>
<body>
  <h1>Hello, World!</h1>
  <p>This is my first web page.</p>
</body>
</html>

UNDERSTANDING THE STRUCTURE:
- <!DOCTYPE html> — Tells the browser this is an HTML5 document
- <html> — The root element that wraps everything
- <head> — Contains information about the page (not visible to users)
- <title> — The text shown on the browser tab
- <body> — Everything visible on the web page goes here

ESSENTIAL HTML TAGS:

HEADINGS (h1 to h6):
<h1>Main Heading</h1>      ← Largest, most important
<h2>Sub Heading</h2>
<h3>Section Heading</h3>
<h6>Smallest Heading</h6>  ← Least important
Rule: Use only ONE h1 per page. It tells search engines the main topic.

PARAGRAPHS AND TEXT:
<p>A paragraph of text.</p>
<strong>Bold text</strong>
<em>Italic text</em>
<br>  ← Line break (no closing tag)
<hr>  ← Horizontal line

LINKS:
<a href="https://google.com">Visit Google</a>
<a href="about.html">About Page</a>         ← Link to another page
<a href="#section1">Jump to Section 1</a>   ← Jump to same page
<a href="mailto:info@example.com">Email Us</a>

IMAGES:
<img src="photo.jpg" alt="Description of image" width="300">
- src: path to the image file
- alt: description for screen readers and if image fails to load
- Always include alt text for accessibility

LISTS:
Unordered list (bullet points):
<ul>
  <li>HTML</li>
  <li>CSS</li>
  <li>JavaScript</li>
</ul>

Ordered list (numbered):
<ol>
  <li>Plan the website</li>
  <li>Build the HTML structure</li>
  <li>Add CSS styling</li>
</ol>

TABLES:
<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Age</th>
      <th>City</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Amara</td>
      <td>22</td>
      <td>Lusaka</td>
    </tr>
  </tbody>
</table>

FORMS:
<form action="/submit" method="POST">
  <label for="name">Full Name:</label>
  <input type="text" id="name" name="name" required>

  <label for="email">Email:</label>
  <input type="email" id="email" name="email" required>

  <label for="message">Message:</label>
  <textarea id="message" name="message" rows="4"></textarea>

  <button type="submit">Send</button>
</form>

SEMANTIC HTML5 ELEMENTS:
Semantic tags describe the purpose of their content:
<header>   — Top section of page (logo, navigation)
<nav>      — Navigation menu
<main>     — Main content of the page
<section>  — A thematic group of content
<article>  — Independent, self-contained content
<aside>    — Side content (sidebar, ads)
<footer>   — Bottom section of page

Why use semantic HTML?
- Helps search engines understand your page structure
- Improves accessibility for screen readers
- Makes your code easier to read and maintain`
    },
    {
      title: 'CSS — Styling and Designing Web Pages',
      order_index: 2,
      duration_minutes: 65,
      content: `CSS — STYLING AND DESIGNING WEB PAGES

CSS (Cascading Style Sheets) controls how HTML elements look — colours, fonts, sizes, spacing, and layout.

HOW CSS WORKS:
selector {
  property: value;
}

Example:
h1 {
  color: blue;
  font-size: 36px;
  text-align: center;
}

THREE WAYS TO ADD CSS:

1. INLINE CSS (directly on element — avoid for large projects):
<p style="color: red; font-size: 18px;">This is red text</p>

2. INTERNAL CSS (inside <style> tag in <head>):
<style>
  p { color: red; }
</style>

3. EXTERNAL CSS (separate .css file — best practice):
<link rel="stylesheet" href="styles.css">

CSS SELECTORS:

Element selector — targets all elements of that type:
p { color: grey; }

Class selector — targets elements with a specific class:
.card { background: white; border-radius: 8px; }
<div class="card">Content</div>

ID selector — targets one specific element:
#header { background: navy; }
<header id="header">...</header>

THE BOX MODEL:
Every HTML element is a rectangular box with:
- Content — the actual text or image
- Padding — space inside the border
- Border — line around the element
- Margin — space outside the border

div {
  width: 300px;
  padding: 20px;
  border: 2px solid black;
  margin: 10px;
}

COLOURS IN CSS:
color: red;                  ← colour name
color: #2563eb;              ← hex code
color: rgb(37, 99, 235);     ← RGB values
color: rgba(37, 99, 235, 0.5); ← RGB with transparency

TYPOGRAPHY:
body {
  font-family: 'Arial', sans-serif;
  font-size: 16px;
  font-weight: 400;        ← 400=normal, 700=bold
  line-height: 1.6;        ← spacing between lines
  letter-spacing: 0.5px;
}

FLEXBOX — Modern Layout:
Flexbox makes it easy to align and distribute elements.

.container {
  display: flex;
  justify-content: center;   ← horizontal alignment
  align-items: center;       ← vertical alignment
  gap: 16px;                 ← space between items
  flex-wrap: wrap;           ← wrap to next line if needed
}

justify-content options:
- flex-start: items at the left
- flex-end: items at the right
- center: items in the center
- space-between: equal space between items
- space-around: equal space around items

CSS GRID — Two-Dimensional Layout:
.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);  ← 3 equal columns
  gap: 20px;
}

RESPONSIVE DESIGN — Media Queries:
Media queries change styles based on screen size.

/* Default: mobile first */
.card {
  width: 100%;
}

/* Tablet and above */
@media (min-width: 768px) {
  .card {
    width: 48%;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .card {
    width: 30%;
  }
}

COMMON CSS PROPERTIES:
background-color: #f0f0f0;
background-image: url('image.jpg');
border: 1px solid #ccc;
border-radius: 8px;          ← rounded corners
box-shadow: 0 2px 4px rgba(0,0,0,0.1);
opacity: 0.8;
cursor: pointer;
text-decoration: none;       ← removes underline from links
list-style: none;            ← removes bullet points
overflow: hidden;            ← hides content outside the box
position: relative;
position: absolute;
z-index: 10;                 ← layer order`
    },
    {
      title: 'JavaScript — Making Web Pages Interactive',
      order_index: 3,
      duration_minutes: 75,
      content: `JAVASCRIPT — MAKING WEB PAGES INTERACTIVE

JavaScript (JS) makes web pages dynamic and interactive. While HTML provides structure and CSS provides styling, JavaScript adds behaviour.

ADDING JAVASCRIPT TO HTML:
<!-- At the bottom of body — best practice -->
<script src="script.js"></script>

<!-- Or inline -->
<script>
  console.log("Hello from JavaScript!");
</script>

VARIABLES:
const name = "Amara";     ← cannot be reassigned
let age = 22;             ← can be reassigned
var city = "Lusaka";      ← old way, avoid using

RULES:
- Use const by default
- Use let when the value will change
- Avoid var

DATA TYPES:
const text = "Hello";          ← String
const number = 42;             ← Number
const price = 19.99;           ← Number (decimal)
const isLoggedIn = true;       ← Boolean
const nothing = null;          ← Null
let notDefined;                ← Undefined
const colours = ["red","blue","green"];  ← Array
const person = { name: "Amara", age: 22 }; ← Object

FUNCTIONS:
// Traditional function
function greet(name) {
  return "Hello, " + name + "!";
}

// Arrow function (modern)
const greet = (name) => "Hello, " + name + "!";

// Calling a function
console.log(greet("Kwame")); // Hello, Kwame!

CONDITIONAL STATEMENTS:
const score = 75;

if (score >= 80) {
  console.log("Distinction");
} else if (score >= 60) {
  console.log("Pass");
} else {
  console.log("Fail");
}

LOOPS:
// For loop
for (let i = 0; i < 5; i++) {
  console.log(i); // 0, 1, 2, 3, 4
}

// Loop through an array
const fruits = ["mango", "banana", "guava"];
fruits.forEach(fruit => {
  console.log(fruit);
});

// While loop
let count = 0;
while (count < 3) {
  console.log(count);
  count++;
}

DOM MANIPULATION:
The DOM (Document Object Model) is the browser's representation of your HTML. JavaScript uses it to read and change the page.

// Select elements
const title = document.querySelector("h1");
const button = document.getElementById("myBtn");
const cards = document.querySelectorAll(".card");

// Change content
title.textContent = "New Title";
title.innerHTML = "<em>New Title</em>";

// Change styles
title.style.color = "red";
title.style.fontSize = "2rem";

// Add/remove CSS classes
button.classList.add("active");
button.classList.remove("hidden");
button.classList.toggle("open");

// Create and add new elements
const newParagraph = document.createElement("p");
newParagraph.textContent = "This was added by JavaScript";
document.body.appendChild(newParagraph);

EVENT LISTENERS:
Events happen when a user does something — click, type, hover, scroll.

// Click event
button.addEventListener("click", function() {
  alert("Button was clicked!");
});

// Input event (fires as user types)
const input = document.getElementById("search");
input.addEventListener("input", function() {
  console.log("User typed:", input.value);
});

// Form submission
const form = document.querySelector("form");
form.addEventListener("submit", function(event) {
  event.preventDefault(); // Stops page from reloading
  const name = document.getElementById("name").value;
  console.log("Form submitted by:", name);
});

FETCH API — Getting Data from the Internet:
async function getUsers() {
  try {
    const response = await fetch("https://api.example.com/users");
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error("Failed to fetch:", error);
  }
}

getUsers();

PRACTICAL EXAMPLE — Toggle Dark Mode:
const toggleBtn = document.getElementById("darkToggle");

toggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");

  if (document.body.classList.contains("dark-mode")) {
    toggleBtn.textContent = "Light Mode";
  } else {
    toggleBtn.textContent = "Dark Mode";
  }
});`
    },
  ]);

  await addQuizzes(db, [
    {
      moduleId: webIds[0],
      question: 'Which HTML tag is used for the most important heading on a page?',
      options: ['<heading>', '<h6>', '<h1>', '<head>'],
      correct: 2,
      explanation: '<h1> is the most important heading tag. Only one <h1> should be used per page as it tells search engines the main topic.'
    },
    {
      moduleId: webIds[0],
      question: 'What is the purpose of the alt attribute in an <img> tag?',
      options: [
        'Sets the image size',
        'Provides a description for screen readers and when images fail to load',
        'Links the image to another page',
        'Sets the image border'
      ],
      correct: 1,
      explanation: 'The alt attribute provides alternative text for the image, used by screen readers for accessibility and displayed when the image cannot load.'
    },
    {
      moduleId: webIds[1],
      question: 'In CSS, which selector targets elements with a specific class name?',
      options: ['#classname', '.classname', 'classname', '*classname'],
      correct: 1,
      explanation: 'A class selector starts with a dot (.) followed by the class name. For example, .card targets all elements with class="card".'
    },
    {
      moduleId: webIds[1],
      question: 'Which CSS property is used to create space inside an element, between its content and border?',
      options: ['margin', 'spacing', 'padding', 'border-space'],
      correct: 2,
      explanation: 'Padding creates space inside the element between the content and the border. Margin creates space outside the element.'
    },
    {
      moduleId: webIds[2],
      question: 'Which JavaScript keyword declares a variable that cannot be reassigned?',
      options: ['var', 'let', 'const', 'static'],
      correct: 2,
      explanation: 'const declares a constant variable that cannot be reassigned after its initial value is set. Use const by default and let only when the value needs to change.'
    },
    {
      moduleId: webIds[2],
      question: 'What does event.preventDefault() do in a form submit event listener?',
      options: [
        'Deletes the form',
        'Submits the form automatically',
        'Stops the page from reloading on form submission',
        'Prevents the user from typing in the form'
      ],
      correct: 2,
      explanation: 'event.preventDefault() prevents the default browser behaviour — for forms, this stops the page from reloading so JavaScript can handle the submission instead.'
    },
  ]);

  await addAssignment(db, webIds[0], courses[1].id,
    'Build Your Personal Profile Page',
    'Create a complete HTML page about yourself using proper semantic structure.',
    `Create an HTML page that serves as your personal profile. Your page must include:

1. Proper HTML5 document structure (DOCTYPE, html, head, body)
2. A descriptive <title> tag
3. Semantic tags: <header>, <main>, <footer>
4. Inside <header>: Your name as an <h1> and a navigation <nav> with at least 3 links
5. Inside <main>:
   - An "About Me" <section> with an <h2> and at least one <p>
   - A "My Skills" <section> with a <ul> listing at least 5 skills
   - A "My Goals" <section> with an <ol> listing 3 career goals
   - A simple <table> showing your weekly study schedule (3 days, 2 subjects each)
6. Inside <footer>: Your email as a mailto link and copyright text
7. At least one <img> tag with a proper alt attribute

Paste your complete HTML code in the submission box. Make sure it is valid HTML5.`
  );

  await addAssignment(db, webIds[1], courses[1].id,
    'Style Your Profile Page with CSS',
    'Add professional CSS styling to the HTML page from the previous module.',
    `Add CSS styling to your profile page from Module 1. Create a separate style section or external stylesheet with:

1. BODY STYLING:
   - A background colour
   - A readable font family
   - A max-width of 800px centered on the page

2. HEADER STYLING:
   - Background colour and text colour that contrast well
   - Padding around the content
   - Style the navigation links (remove underlines, add hover colour)

3. SECTION STYLING:
   - Different background colours for alternating sections
   - Padding and margin for breathing room
   - Rounded corners (border-radius) on section boxes

4. TABLE STYLING:
   - Borders on cells
   - Header row with different background colour
   - Alternating row colours

5. FLEXBOX:
   - Use flexbox in at least ONE section to arrange elements side by side

6. ONE MEDIA QUERY:
   - On screens smaller than 600px, make any flex items stack vertically

Paste your complete HTML + CSS code below.`
  );

  await addAssignment(db, webIds[2], courses[1].id,
    'Add JavaScript Interactivity',
    'Make your profile page interactive with at least 4 JavaScript features.',
    `Add JavaScript to your profile page to make it interactive. Implement ALL of the following:

1. DARK MODE TOGGLE:
   - A button that switches between light and dark mode
   - The button text should change ("Dark Mode" / "Light Mode")

2. SKILL FILTER:
   - An input field where the user can type to filter/search your skills list
   - Skills that do not match should be hidden

3. CONTACT FORM:
   - A form with: Name, Email, and Message fields
   - On submit (without reloading the page), show a success message with the user's name
   - Validate that all fields are filled before submitting

4. DYNAMIC GREETING:
   - On page load, display a greeting based on the time of day:
     - 5am-12pm: "Good morning!"
     - 12pm-5pm: "Good afternoon!"
     - 5pm-9pm: "Good evening!"
     - 9pm-5am: "Good night!"

Paste your complete HTML + CSS + JavaScript code below.`
  );

  // ── COURSE 3: Operating Systems ────────────────────────────────────────────
  const osIds = await addModules(db, courses[2].id, [
    {
      title: 'Introduction to Operating Systems',
      order_index: 1,
      duration_minutes: 50,
      content: `INTRODUCTION TO OPERATING SYSTEMS

WHAT IS AN OPERATING SYSTEM?
An Operating System (OS) is system software that manages computer hardware and software resources and provides common services for computer programs.

Without an OS, you would need to write code to directly control every piece of hardware every time you wanted to do anything. The OS handles this complexity so that application software and users can work at a higher level.

ROLE OF THE OPERATING SYSTEM:
The OS sits between the hardware and the user applications:

USER
  ↓
APPLICATIONS (Chrome, Word, games)
  ↓
OPERATING SYSTEM
  ↓
HARDWARE (CPU, RAM, disk, keyboard, screen)

THE 5 MAIN FUNCTIONS OF AN OS:

1. PROCESS MANAGEMENT
   - Starts, pauses, resumes, and stops programs
   - Decides which program gets the CPU at any moment
   - Handles multiple programs running at the same time (multitasking)

2. MEMORY MANAGEMENT
   - Allocates RAM to programs that need it
   - Frees memory when programs close
   - Protects one program from reading another program's memory
   - Manages virtual memory (using disk space as extra RAM)

3. FILE SYSTEM MANAGEMENT
   - Organises files in folders/directories
   - Controls who can read, write, or execute each file
   - Manages reading and writing to storage devices

4. DEVICE MANAGEMENT
   - Controls all hardware devices through device drivers
   - Manages input (keyboard, mouse) and output (screen, printer)
   - Queues and schedules device access

5. USER INTERFACE
   - Provides a way for users to interact with the computer
   - Two types: Command Line Interface (CLI) and Graphical User Interface (GUI)

TYPES OF OPERATING SYSTEMS:

DESKTOP/LAPTOP OS:
- Windows 10/11 (Microsoft) — Most widely used, commercial
- macOS (Apple) — Only on Apple hardware, known for design
- Linux (Ubuntu, Fedora) — Open source, free, highly customizable

MOBILE OS:
- Android (Google) — Open source, used on most smartphones
- iOS (Apple) — Only on iPhone, known for security

SERVER OS:
- Windows Server — Enterprise environments
- Linux (Red Hat, Debian) — Powers most of the internet's servers

EMBEDDED OS:
- Used in washing machines, cars, ATMs, routers

BATCH OS vs INTERACTIVE OS:
- Batch: Jobs queued and run automatically without user interaction (old mainframes)
- Interactive: User interacts with the system in real time (all modern OS)

COMMAND LINE INTERFACE (CLI):
A text-based interface where you type commands.

Common Windows CMD commands:
dir          ← list files in current folder
cd Documents ← change to Documents folder
cd ..        ← go up one folder
mkdir NewFolder ← create a new folder
del file.txt ← delete a file
cls          ← clear the screen

Common Linux/Mac Terminal commands:
ls           ← list files
cd Documents ← change directory
cd ..        ← go up one level
mkdir NewFolder ← make directory
rm file.txt  ← remove a file
clear        ← clear the screen
pwd          ← print current directory path

WHY LEARN ABOUT OPERATING SYSTEMS?
- Every software developer needs to understand the environment their code runs in
- Helps you troubleshoot computer problems effectively
- Required knowledge for networking, cybersecurity, and system administration careers
- Linux powers over 90% of web servers — essential for backend development`
    },
    {
      title: 'Processes, Memory, and the CPU',
      order_index: 2,
      duration_minutes: 60,
      content: `PROCESSES, MEMORY, AND THE CPU

WHAT IS A PROCESS?
A process is a program in execution. When you double-click an application, the OS creates a process for it.

PROGRAM vs PROCESS:
- Program: A static file on disk (e.g. chrome.exe)
- Process: A running instance of that program in memory

You can open the same program multiple times — each instance is a separate process.

PROCESS STATES:
A process moves through different states during its life:

NEW → The process is being created
READY → Waiting for the CPU to be assigned
RUNNING → Currently executing on the CPU
WAITING → Paused, waiting for input/output to complete
TERMINATED → Has finished executing

PROCESS SCHEDULING:
The CPU can only run ONE process at a time (on a single core). The OS scheduler decides which process runs next.

SCHEDULING ALGORITHMS:

1. FIRST COME FIRST SERVED (FCFS)
   Processes run in the order they arrive.
   Simple but can cause long waiting times if a slow process runs first.

2. SHORTEST JOB FIRST (SJF)
   The process estimated to finish quickest runs first.
   Reduces average waiting time but requires knowing process duration.

3. ROUND ROBIN
   Each process gets a fixed time slot (time quantum), then the next process runs.
   Example: 5ms per process — after 5ms, switch to next regardless of completion.
   Most common in modern interactive systems — ensures fairness.

4. PRIORITY SCHEDULING
   Each process is assigned a priority number.
   Higher priority processes run first.
   Problem: Low priority processes may starve (never get CPU time).

CONTEXT SWITCHING:
When the OS switches from one process to another, it saves the current process state and loads the next process's state.
This is called a context switch.
It happens very fast (milliseconds) giving the illusion that everything runs simultaneously.

THREADS:
A thread is the smallest unit of execution within a process.
One process can have multiple threads running concurrently.
Example: A browser has separate threads for:
- Rendering the page
- Running JavaScript
- Downloading files
- Handling user input

MEMORY MANAGEMENT:
RAM (Random Access Memory) is the working memory — fast but limited.

HOW THE OS MANAGES MEMORY:

1. MEMORY ALLOCATION
   When a program starts, the OS allocates a block of RAM to it.
   When it ends, the memory is freed.

2. MEMORY PROTECTION
   Each process has its own memory space.
   Process A cannot read or write to Process B's memory.
   This prevents crashes and security breaches.

3. VIRTUAL MEMORY
   When RAM is full, the OS uses part of the hard disk as extra memory.
   This disk space is called the SWAP file (Windows) or SWAP partition (Linux).
   
   Virtual Memory = Physical RAM + Swap Space
   
   Downside: Disk is much slower than RAM, so heavy virtual memory use slows the computer.

4. PAGING
   Memory is divided into fixed-size blocks called pages.
   Programs are loaded in pages rather than all at once.
   Allows large programs to run even with limited RAM.

MEMORY HIERARCHY (fastest to slowest):
Registers (inside CPU) → fastest, smallest
CPU Cache (L1, L2, L3) → very fast, small
RAM → fast, medium size
SSD/HDD → slow, large
Cloud Storage → very slow, huge

THE CPU:
The Central Processing Unit is the brain of the computer.

CPU COMPONENTS:
- ALU (Arithmetic Logic Unit): Performs calculations and comparisons
- Control Unit: Fetches and decodes instructions
- Registers: Tiny, ultra-fast storage inside the CPU
- Cache: Small fast memory between CPU and RAM

CPU PERFORMANCE FACTORS:
- Clock Speed: GHz — how many operations per second (3.5 GHz = 3.5 billion cycles/second)
- Cores: Number of independent processing units (4-core, 8-core, 16-core)
- Cache Size: More cache = fewer trips to slow RAM
- Architecture: 32-bit vs 64-bit (64-bit handles more RAM and larger calculations)`
    },
    {
      title: 'File Systems, Storage, and Security',
      order_index: 3,
      duration_minutes: 60,
      content: `FILE SYSTEMS, STORAGE, AND SECURITY

THE FILE SYSTEM
A file system is how the operating system organises and stores data on a storage device.

Without a file system, storage would be one long stream of bytes with no structure.

COMMON FILE SYSTEMS:

NTFS (Windows):
- New Technology File System
- Used by Windows 7, 8, 10, 11
- Supports: Large files, permissions, encryption, journaling
- Maximum file size: 16 TB

FAT32 (Universal):
- File Allocation Table (32-bit)
- Works on Windows, Mac, and Linux
- Used in USB drives and SD cards
- Limitation: Maximum file size of 4 GB

exFAT (External drives):
- Extended FAT
- No 4 GB file size limit
- Designed for flash storage (USB, SD cards)
- Compatible with Windows and Mac

ext4 (Linux):
- Fourth Extended File System
- Default file system for most Linux distributions
- Supports very large files and volumes

FILE SYSTEM CONCEPTS:

DIRECTORY STRUCTURE:
Files are organized in a hierarchical tree structure:

Windows:
C:\
├── Windows\
│   ├── System32\
├── Users\
│   ├── Allan\
│   │   ├── Documents\
│   │   ├── Downloads\
│   │   └── Desktop\
└── Program Files\

Linux:
/
├── home/
│   └── allan/
├── etc/         ← System configuration files
├── bin/         ← Essential commands
├── var/         ← Variable data (logs)
└── tmp/         ← Temporary files

FILE PATHS:
Absolute path: Full path from root
  Windows: C:\Users\Allan\Documents\report.pdf
  Linux: /home/allan/documents/report.pdf

Relative path: Path from current location
  If you are in C:\Users\Allan\
  Relative: Documents\report.pdf

FILE PERMISSIONS:
Operating systems control who can access files.

LINUX FILE PERMISSIONS:
Every file has three permission sets: Owner | Group | Others
Each set has three permissions: Read (r) | Write (w) | Execute (x)

Example: rwxr-xr--
Owner: rwx (read, write, execute)
Group: r-x (read, execute — cannot write)
Others: r-- (read only)

Numeric representation:
r=4, w=2, x=1
rwx = 4+2+1 = 7
rw- = 4+2+0 = 6
r-- = 4+0+0 = 4

chmod 755 file.sh  ← Set permissions: owner=7(rwx), group=5(r-x), others=5(r-x)

WINDOWS PERMISSIONS:
Windows uses ACLs (Access Control Lists).
Permissions: Full Control, Modify, Read & Execute, Read, Write

STORAGE DEVICES:

HDD (Hard Disk Drive):
- Mechanical, uses spinning magnetic platters
- Slower (100-150 MB/s)
- Cheaper per GB
- Good for mass storage

SSD (Solid State Drive):
- No moving parts, uses flash memory
- Fast (500-5000 MB/s)
- More expensive per GB
- Better for OS and applications

USB Flash Drive:
- Portable flash storage
- Useful for file transfer and backup

CLOUD STORAGE:
- Files stored on remote servers
- Accessible from anywhere
- Examples: Google Drive, OneDrive, Dropbox

OS SECURITY:

USER ACCOUNTS AND AUTHENTICATION:
- Administrator/Root account: Full system access
- Standard user: Limited access, cannot install software or change system settings
- Guest account: Minimal access

PASSWORDS AND AUTHENTICATION:
- Strong passwords: At least 12 characters, mix of upper/lower/numbers/symbols
- Multi-factor authentication (MFA): Password + phone code + fingerprint

MALWARE TYPES:
- Virus: Attaches to files and spreads
- Worm: Spreads across network without user action
- Trojan: Disguises as legitimate software
- Ransomware: Encrypts files and demands payment
- Spyware: Secretly monitors user activity

OS SECURITY FEATURES:
- Firewall: Controls network traffic in and out
- Windows Defender / antivirus: Scans for malware
- Automatic updates: Patches security vulnerabilities
- User Account Control (UAC): Prompts for permission before system changes
- BitLocker / FileVault: Full disk encryption

BEST SECURITY PRACTICES:
1. Keep the OS updated
2. Use a standard account for daily use, not administrator
3. Install software only from trusted sources
4. Use strong unique passwords
5. Enable automatic backups
6. Use a firewall`
    },
  ]);

  await addQuizzes(db, [
    {
      moduleId: osIds[0],
      question: 'What is the main role of an Operating System?',
      options: [
        'To browse the internet',
        'To manage hardware and software resources and provide services to programs',
        'To create documents and spreadsheets',
        'To connect to a network'
      ],
      correct: 1,
      explanation: 'An Operating System manages computer hardware resources (CPU, memory, storage) and provides services that allow application software and users to interact with the hardware.'
    },
    {
      moduleId: osIds[0],
      question: 'Which of the following is NOT a function of an Operating System?',
      options: ['Process Management', 'Memory Management', 'Designing websites', 'File System Management'],
      correct: 2,
      explanation: 'Designing websites is done by web developers, not the operating system. The OS functions include process management, memory management, file system management, and device management.'
    },
    {
      moduleId: osIds[1],
      question: 'In process scheduling, which algorithm gives each process a fixed time slot before switching to the next?',
      options: ['First Come First Served', 'Shortest Job First', 'Round Robin', 'Priority Scheduling'],
      correct: 2,
      explanation: 'Round Robin gives each process a fixed time quantum (e.g. 5ms), then switches to the next process. It is the most common scheduling algorithm in interactive systems because it ensures fairness.'
    },
    {
      moduleId: osIds[1],
      question: 'What is virtual memory?',
      options: [
        'Memory inside the CPU',
        'A type of RAM',
        'Disk space used as extra RAM when physical RAM is full',
        'Memory used only by the operating system'
      ],
      correct: 2,
      explanation: 'Virtual memory uses part of the hard disk as an extension of RAM when physical RAM is full. It is slower than RAM but allows the system to run more programs than the physical RAM would normally support.'
    },
    {
      moduleId: osIds[2],
      question: 'Which file system is the default for most modern Windows computers?',
      options: ['FAT32', 'ext4', 'NTFS', 'exFAT'],
      correct: 2,
      explanation: 'NTFS (New Technology File System) is the default file system used by Windows 7, 8, 10, and 11. It supports large files, permissions, encryption, and journaling.'
    },
    {
      moduleId: osIds[2],
      question: 'In Linux file permissions, what does the permission string "rwxr-xr--" mean for the "Others" group?',
      options: [
        'Read, write, and execute',
        'Read and execute only',
        'Read only',
        'No permissions'
      ],
      correct: 2,
      explanation: 'In "rwxr-xr--", the last three characters "r--" represent the Others group permissions: read (r), no write (-), no execute (-). This means others can only read the file.'
    },
  ]);

  await addAssignment(db, osIds[0], courses[2].id,
    'Compare Operating Systems',
    'Research and compare three major operating systems used today.',
    `Compare the three most widely used desktop operating systems: Windows 11, macOS, and Ubuntu Linux.

For each operating system, research and answer:
1. DEVELOPER AND COST: Who makes it? Is it free or paid?
2. MARKET SHARE: Which is most popular and why?
3. USER INTERFACE: Describe the look and feel
4. FILE SYSTEM: What file system does it use by default?
5. SECURITY: What are its main security features?
6. BEST USE CASE: What type of user is it best suited for?

Then answer these comparison questions:
7. Which OS would you recommend for a software developer and why?
8. Which OS would you recommend for a graphic designer and why?
9. Which OS runs most web servers on the internet and why?
10. If you could only use one OS, which would you choose and why?

Write at least 300 words total. Use specific facts and examples.`
  );

  await addAssignment(db, osIds[1], courses[2].id,
    'Process Scheduling Simulation',
    'Manually simulate CPU scheduling algorithms and compare their performance.',
    `You are given 4 processes with the following details:

Process | Arrival Time | Burst Time (CPU needed)
P1      | 0ms          | 8ms
P2      | 1ms          | 4ms
P3      | 2ms          | 9ms
P4      | 3ms          | 5ms

Simulate each scheduling algorithm:

1. FIRST COME FIRST SERVED (FCFS):
   - Draw a Gantt chart showing the order processes run
   - Calculate Completion Time, Turnaround Time, and Waiting Time for each process
   - Calculate Average Turnaround Time and Average Waiting Time

2. SHORTEST JOB FIRST (SJF) — Non-preemptive:
   - At each point when CPU is free, pick the process with shortest burst time that has arrived
   - Draw the Gantt chart
   - Calculate the same metrics as above

3. ROUND ROBIN (Time Quantum = 3ms):
   - Each process gets 3ms, then the next in queue runs
   - Draw the Gantt chart
   - Calculate the same metrics

4. COMPARISON:
   - Which algorithm had the lowest Average Waiting Time?
   - Which algorithm is fairest to all processes?
   - Which algorithm would you use for an interactive system (like a desktop OS) and why?

Show all your calculations clearly.`
  );

  await addAssignment(db, osIds[2], courses[2].id,
    'OS Security Audit',
    'Perform a security audit of your computer and document your findings.',
    `Perform a basic security audit of the computer you use most (home, school, or work).

SECTION 1 — SYSTEM INFORMATION:
1. What operating system and version is installed?
2. When was the last system update installed?
3. How many user accounts exist on the computer?
4. Are any accounts using Administrator/root privileges for daily use?

SECTION 2 — SECURITY ASSESSMENT:
Rate each item: Good / Needs Improvement / Not Done

5. Operating system is up to date
6. Antivirus software is installed and updated
7. Firewall is enabled
8. Strong passwords are used on all accounts
9. Automatic screen lock is enabled (locks after inactivity)
10. Important files are backed up regularly

SECTION 3 — FILE PERMISSIONS:
11. Choose any folder on your computer. Describe what permissions are set on it and who can access it.
12. Why is it important to restrict file permissions on a shared computer?

SECTION 4 — IMPROVEMENT PLAN:
13. List 3 specific security improvements you would make to this computer
14. For each improvement, explain what risk it reduces
15. What is the difference between a virus and ransomware? Give a real-world example of each.

Write at least 250 words total with specific observations about the actual computer you are auditing.`
  );

  console.log('✅ Seed complete: 5 users, 3 courses, 9 modules, 18 quizzes, 9 assignments');
}

async function seed() {
  console.log('🌱 Seeding database...');
  const db = await getDb();
  await db.exec(`
    DELETE FROM certificate_payments;
    DELETE FROM assignment_submissions;
    DELETE FROM assignments;
    DELETE FROM certificates;
    DELETE FROM module_progress;
    DELETE FROM enrollments;
    DELETE FROM quizzes;
    DELETE FROM modules;
    DELETE FROM courses;
    DELETE FROM notifications;
    DELETE FROM password_resets;
    DELETE FROM users;
  `);
  await seedData(db);
  console.log('\n📋 Demo Accounts:');
  console.log('  Admin:    admin@youthskills.com / password123');
  console.log('  Youth:    amara@example.com / password123');
  console.log('  Youth 2:  kwame@example.com / password123');
  console.log('  Employer: hr@techafrica.com / password123');
  process.exit(0);
}

module.exports = { seedData };

if (require.main === module) {
  seed().catch(err => { console.error(err); process.exit(1); });
}
