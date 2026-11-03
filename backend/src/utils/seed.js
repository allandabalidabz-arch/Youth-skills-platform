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
  const adminPw = await bcrypt.hash('Allan7034', 12);
  const adminId = uuidv4();

  const insertUser = async (id, name, email, role, bio, location, skills) => {
    await db.run('INSERT INTO users (id, name, email, password, role, bio, location, skills) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [id, name, email, id === adminId ? adminPw : hashedPw, role, bio, location, JSON.stringify(skills)]);
  };

  await insertUser(adminId, 'Admin User', 'admin@youthskills.com', 'admin', 'Platform administrator', 'Lusaka, Zambia', []);

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
      moduleId: sadIds[1],
      question: 'In a Data Flow Diagram, what does an arrow represent?',
      options: ['A process', 'A data store', 'The movement of data', 'An external entity'],
      correct: 2,
      explanation: 'Arrows in a DFD represent data flows — they show data moving between processes, entities, and data stores.'
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
  ]);

  await addAssignment(db, sadIds[2], courses[0].id,
    'System Analysis and Design — Final Assignment',
    'Apply SDLC, DFD, and ERD skills to design a complete information system.',
    `A local hospital wants to replace its paper-based patient management system with a computerised system. Patients currently register manually, doctor appointments are written in books, and medical records are stored in physical files.

PART 1 — SYSTEM ANALYSIS (Module 1 topics):
1. Identify 3 problems with the current paper-based system
2. Write 4 FUNCTIONAL REQUIREMENTS for the new system (format: "The system shall...")
3. Write 3 NON-FUNCTIONAL REQUIREMENTS (performance, security, availability)
4. Name 2 requirements gathering techniques you would use and explain why

PART 2 — DATA FLOW DIAGRAM (Module 2 topics):
5. List all External Entities for the hospital system and their roles
6. List all data flows entering and leaving the system
7. Describe or draw a Context Diagram (Level 0 DFD) for the system
8. Explain the difference between a Context Diagram and a Level 1 DFD

PART 3 — ENTITY RELATIONSHIP DIAGRAM (Module 3 topics):
9. Identify at least 4 entities needed for the hospital system with their key attributes and primary keys
10. Identify the relationships between those entities and their cardinality (1:1, 1:N, M:N)
11. Identify any Many-to-Many relationships and name the junction table that would resolve each
12. Write the SQL table definition (CREATE TABLE) for any ONE entity

Write at least 350 words total. Show clear reasoning for all design decisions.`
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
      moduleId: webIds[1],
      question: 'In CSS, which selector targets elements with a specific class name?',
      options: ['#classname', '.classname', 'classname', '*classname'],
      correct: 1,
      explanation: 'A class selector starts with a dot (.) followed by the class name. For example, .card targets all elements with class="card".'
    },
    {
      moduleId: webIds[2],
      question: 'Which JavaScript keyword declares a variable that cannot be reassigned?',
      options: ['var', 'let', 'const', 'static'],
      correct: 2,
      explanation: 'const declares a constant variable that cannot be reassigned after its initial value is set. Use const by default and let only when the value needs to change.'
    },
  ]);

  await addAssignment(db, webIds[2], courses[1].id,
    'Web Development — Final Project',
    'Build a fully styled and interactive personal profile page using HTML, CSS, and JavaScript.',
    `Build a complete personal profile page that demonstrates all three modules. Your page must include:

PART 1 — HTML STRUCTURE (Module 1):
1. Proper HTML5 document structure (DOCTYPE, html, head, body)
2. Semantic tags: <header>, <nav>, <main>, <section>, <footer>
3. Your name as an <h1>, at least 2 <h2> section headings
4. A navigation <nav> with 3 links
5. An "About Me" section with a paragraph
6. A "My Skills" section with a <ul> of at least 5 skills
7. A "Study Schedule" <table> showing 3 days and 2 subjects per day
8. An <img> tag with a proper alt attribute
9. Your email as a mailto link in the footer

PART 2 — CSS STYLING (Module 2):
10. A background colour and readable font for the body
11. Max-width of 800px centered on the page
12. Styled header with background colour and padding
13. Navigation links with no underline and a hover colour change
14. At least one section using flexbox to arrange content side by side
15. Rounded corners (border-radius) on at least one element
16. One media query: on screens under 600px, flex items stack vertically

PART 3 — JAVASCRIPT INTERACTIVITY (Module 3):
17. A dark/light mode toggle button that changes the page theme
18. A contact form with Name, Email, and Message fields — on submit, show a personalised success message without reloading the page
19. A dynamic greeting that shows "Good morning / afternoon / evening / night" based on the current time

Paste your complete HTML + CSS + JavaScript code below. Make sure all three parts are present and working.`
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
      moduleId: osIds[1],
      question: 'In process scheduling, which algorithm gives each process a fixed time slot before switching to the next?',
      options: ['First Come First Served', 'Shortest Job First', 'Round Robin', 'Priority Scheduling'],
      correct: 2,
      explanation: 'Round Robin gives each process a fixed time quantum (e.g. 5ms), then switches to the next process. It is the most common scheduling algorithm in interactive systems because it ensures fairness.'
    },
    {
      moduleId: osIds[2],
      question: 'Which file system is the default for most modern Windows computers?',
      options: ['FAT32', 'ext4', 'NTFS', 'exFAT'],
      correct: 2,
      explanation: 'NTFS (New Technology File System) is the default file system used by Windows 7, 8, 10, and 11. It supports large files, permissions, encryption, and journaling.'
    },
  ]);

  await addAssignment(db, osIds[2], courses[2].id,
    'Operating Systems — Final Assignment',
    'Demonstrate your understanding of OS concepts, process scheduling, file systems, and security.',
    `This assignment covers all three modules of the Operating Systems course.

PART 1 — OS FUNDAMENTALS (Module 1):
1. List and briefly explain the 5 main functions of an Operating System
2. Compare TWO of the following OS: Windows 11, macOS, Ubuntu Linux
   For each: who makes it, is it free, and what is its best use case?
3. Write two CLI commands for Windows CMD and their Linux/Mac equivalents, and explain what each does

PART 2 — PROCESSES AND MEMORY (Module 2):
4. List the 5 process states and describe what happens in each state
5. You are given 3 processes:
   - P1: Arrival=0ms, Burst=6ms
   - P2: Arrival=2ms, Burst=4ms
   - P3: Arrival=4ms, Burst=2ms
   Simulate Round Robin scheduling with a time quantum of 2ms:
   - Draw a Gantt chart showing the order processes run
   - Calculate the Waiting Time for each process
6. Explain the difference between RAM and Virtual Memory, and when the OS uses virtual memory

PART 3 — FILE SYSTEMS AND SECURITY (Module 3):
7. Name THREE different file systems and state which operating system uses each one
8. Explain what a file path is. Give one example of an absolute path and one relative path (use Windows or Linux format)
9. In Linux, a file has permissions "rw-r--r--". Explain what this means for the Owner, Group, and Others
10. List 4 types of malware and briefly describe how each one works
11. Name 3 OS security features built into modern operating systems and explain what each one protects against

Write at least 350 words total. Show all calculations for the scheduling question.`
  );

  console.log('✅ Seed complete: 1 user, 3 courses, 9 modules, 9 quizzes, 3 assignments');
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
  console.log('\n📋 Accounts:');
  console.log('  Admin:    admin@youthskills.com / Allan7034');
  console.log('  Youth:    Register on the platform');
  process.exit(0);
}

module.exports = { seedData };

if (require.main === module) {
  seed().catch(err => { console.error(err); process.exit(1); });
}
