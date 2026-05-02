require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { getDb } = require('../database');

async function seed() {
  console.log('🌱 Seeding database...');
  const db = await getDb();

  // Clear existing data
  await db.exec(`
    DELETE FROM applications; DELETE FROM certificates; DELETE FROM module_progress;
    DELETE FROM enrollments; DELETE FROM quizzes; DELETE FROM modules;
    DELETE FROM opportunities; DELETE FROM courses; DELETE FROM notifications; DELETE FROM users;
  `);

  const hashedPw = await bcrypt.hash('password123', 12);

  const adminId = uuidv4(), youth1Id = uuidv4(), youth2Id = uuidv4(), employer1Id = uuidv4(), employer2Id = uuidv4();

  const insertUser = async (id, name, email, role, bio, location, skills) => {
    await db.run('INSERT INTO users (id, name, email, password, role, bio, location, skills) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [id, name, email, hashedPw, role, bio, location, JSON.stringify(skills)]);
  };

  await insertUser(adminId, 'Admin User', 'admin@youthskills.com', 'admin', 'Platform administrator', 'Nairobi, Kenya', []);
  await insertUser(youth1Id, 'Amara Osei', 'amara@example.com', 'youth', 'Passionate about technology and design', 'Accra, Ghana', ['HTML', 'CSS', 'Figma']);
  await insertUser(youth2Id, 'Kwame Mensah', 'kwame@example.com', 'youth', 'Aspiring entrepreneur and developer', 'Lagos, Nigeria', ['JavaScript', 'Business Planning']);
  await insertUser(employer1Id, 'TechAfrica Ltd', 'hr@techafrica.com', 'employer', 'Leading tech company in Africa', 'Nairobi, Kenya', []);
  await insertUser(employer2Id, 'Creative Hub', 'jobs@creativehub.com', 'employer', 'Creative agency for digital content', 'Accra, Ghana', []);

  // Courses
  const courses = [
    { id: uuidv4(), title: 'Introduction to Web Development', category: 'coding', level: 'beginner', description: 'Learn the fundamentals of HTML, CSS, and JavaScript to build your first website. This course covers everything from basic structure to interactive web pages.', duration_hours: 20, instructor_name: 'Dr. Kofi Acheampong', instructor_bio: 'Senior Software Engineer with 10+ years experience', thumbnail: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400', tags: ['HTML', 'CSS', 'JavaScript', 'Web'] },
    { id: uuidv4(), title: 'Graphic Design Fundamentals', category: 'design', level: 'beginner', description: 'Master the principles of graphic design including color theory, typography, layout, and branding. Create stunning visuals using industry-standard tools.', duration_hours: 15, instructor_name: 'Aisha Diallo', instructor_bio: 'Award-winning graphic designer and creative director', thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400', tags: ['Design', 'Figma', 'Branding', 'Typography'] },
    { id: uuidv4(), title: 'Entrepreneurship & Business Basics', category: 'entrepreneurship', level: 'beginner', description: 'Discover how to turn your ideas into a successful business. Learn business planning, market research, financial basics, and pitching to investors.', duration_hours: 12, instructor_name: 'Emmanuel Nkrumah', instructor_bio: 'Serial entrepreneur and startup mentor', thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', tags: ['Business', 'Startup', 'Finance', 'Marketing'] },
    { id: uuidv4(), title: 'Python Programming for Beginners', category: 'coding', level: 'beginner', description: 'Start your programming journey with Python. Learn variables, loops, functions, and build real projects including a simple web scraper and data analyzer.', duration_hours: 25, instructor_name: 'Dr. Fatima Al-Hassan', instructor_bio: 'Data scientist and Python educator', thumbnail: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400', tags: ['Python', 'Programming', 'Data', 'Automation'] },
    { id: uuidv4(), title: 'Digital Marketing Essentials', category: 'marketing', level: 'beginner', description: 'Learn how to grow businesses online through social media marketing, SEO, email campaigns, and content strategy. Build a complete digital marketing plan.', duration_hours: 10, instructor_name: 'Zara Okonkwo', instructor_bio: 'Digital marketing strategist with 8 years experience', thumbnail: 'https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=400', tags: ['Marketing', 'Social Media', 'SEO', 'Content'] },
    { id: uuidv4(), title: 'Data Analysis with Excel & Google Sheets', category: 'data', level: 'beginner', description: 'Unlock the power of data analysis using spreadsheet tools. Learn formulas, pivot tables, charts, and how to present data insights effectively.', duration_hours: 8, instructor_name: 'Samuel Boateng', instructor_bio: 'Business analyst and data visualization expert', thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400', tags: ['Data', 'Excel', 'Analytics', 'Visualization'] },
  ];

  for (const c of courses) {
    await db.run('INSERT INTO courses (id, title, description, category, level, duration_hours, thumbnail, instructor_name, instructor_bio, tags) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [c.id, c.title, c.description, c.category, c.level, c.duration_hours, c.thumbnail, c.instructor_name, c.instructor_bio, JSON.stringify(c.tags)]);
  }

  // Modules for Web Dev course
  const webCourseId = courses[0].id;
  const moduleData = [
    { title: 'HTML Basics', content: '# HTML Basics\n\nHTML (HyperText Markup Language) is the foundation of every web page.\n\n## What you will learn:\n- HTML document structure\n- Common HTML tags (headings, paragraphs, links, images)\n- Forms and input elements\n- Semantic HTML5 elements\n\n## Your First HTML Page\n\n```html\n<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <title>My First Page</title>\n</head>\n<body>\n  <h1>Hello, World!</h1>\n  <p>Welcome to web development!</p>\n</body>\n</html>\n```\n\nHTML tags come in pairs: an opening tag and a closing tag. The content goes between them.', order_index: 1, duration_minutes: 45 },
    { title: 'CSS Styling', content: '# CSS Styling\n\nCSS (Cascading Style Sheets) makes your HTML look beautiful.\n\n## Core Concepts:\n- Selectors and properties\n- Box model (margin, padding, border)\n- Colors and typography\n- Flexbox layout\n- Responsive design with media queries\n\n## Example:\n\n```css\nbody {\n  font-family: Arial, sans-serif;\n  background-color: #f0f0f0;\n}\n\nh1 {\n  color: #2563eb;\n  font-size: 2rem;\n}\n\n.card {\n  background: white;\n  border-radius: 8px;\n  padding: 20px;\n  box-shadow: 0 2px 4px rgba(0,0,0,0.1);\n}\n```', order_index: 2, duration_minutes: 60 },
    { title: 'JavaScript Fundamentals', content: '# JavaScript Fundamentals\n\nJavaScript brings interactivity to your web pages.\n\n## Topics Covered:\n- Variables (let, const, var)\n- Data types and operators\n- Functions and arrow functions\n- DOM manipulation\n- Events and event listeners\n\n## Example:\n\n```javascript\nconst button = document.querySelector("#myButton");\n\nbutton.addEventListener("click", () => {\n  alert("Button clicked!");\n  button.textContent = "Clicked!";\n  button.style.backgroundColor = "green";\n});\n\nasync function getData() {\n  const response = await fetch("https://api.example.com/data");\n  const data = await response.json();\n  console.log(data);\n}\n```', order_index: 3, duration_minutes: 90 },
  ];

  const moduleIds = [];
  for (const m of moduleData) {
    const mid = uuidv4();
    moduleIds.push(mid);
    await db.run('INSERT INTO modules (id, course_id, title, content, order_index, duration_minutes) VALUES (?, ?, ?, ?, ?, ?)',
      [mid, webCourseId, m.title, m.content, m.order_index, m.duration_minutes]);
  }

  // Quizzes
  const quizData = [
    { moduleId: moduleIds[0], question: 'What does HTML stand for?', options: ['HyperText Markup Language', 'High Tech Modern Language', 'HyperText Modern Links', 'Home Tool Markup Language'], correct: 0, explanation: 'HTML stands for HyperText Markup Language.' },
    { moduleId: moduleIds[0], question: 'Which tag is used for the largest heading in HTML?', options: ['<h6>', '<heading>', '<h1>', '<head>'], correct: 2, explanation: '<h1> is the largest heading tag.' },
    { moduleId: moduleIds[1], question: 'Which CSS property changes text color?', options: ['font-color', 'text-color', 'color', 'foreground'], correct: 2, explanation: 'The "color" property sets text color.' },
    { moduleId: moduleIds[2], question: 'Which keyword declares a constant in JavaScript?', options: ['var', 'let', 'const', 'define'], correct: 2, explanation: '"const" declares a constant variable.' },
  ];

  for (const q of quizData) {
    await db.run('INSERT INTO quizzes (id, module_id, question, options, correct_answer, explanation) VALUES (?, ?, ?, ?, ?, ?)',
      [uuidv4(), q.moduleId, q.question, JSON.stringify(q.options), q.correct, q.explanation]);
  }

  // Opportunities
  const oppData = [
    { employer: employer1Id, title: 'Junior Web Developer', company: 'TechAfrica Ltd', desc: 'We are looking for a passionate junior web developer to join our growing team. You will work on exciting projects building web applications for African businesses.', type: 'job', location: 'Nairobi, Kenya', remote: 0, salary: '$500-$800/month', skills: ['HTML', 'CSS', 'JavaScript'], courses: [webCourseId], deadline: '2026-06-30' },
    { employer: employer1Id, title: 'Python Developer Intern', company: 'TechAfrica Ltd', desc: 'Join our data team as a Python intern. You will assist in building data pipelines and automation scripts.', type: 'internship', location: 'Nairobi, Kenya', remote: 1, salary: 'Stipend: $200/month', skills: ['Python', 'Data Analysis'], courses: [courses[3].id], deadline: '2026-05-31' },
    { employer: employer2Id, title: 'Graphic Design Intern', company: 'Creative Hub', desc: 'Creative Hub is seeking a talented graphic design intern to support our creative team on branding projects and social media content.', type: 'internship', location: 'Accra, Ghana', remote: 0, salary: 'Stipend: $150/month', skills: ['Figma', 'Design', 'Branding'], courses: [courses[1].id], deadline: '2026-05-15' },
    { employer: employer2Id, title: 'Social Media Manager', company: 'Creative Hub', desc: 'We need a creative social media manager to handle our clients online presence, create content calendars, and analyze performance metrics.', type: 'job', location: 'Accra, Ghana', remote: 1, salary: '$400-$600/month', skills: ['Social Media', 'Content', 'Marketing'], courses: [courses[4].id], deadline: '2026-07-01' },
    { employer: employer1Id, title: 'Business Development Volunteer', company: 'TechAfrica Ltd', desc: 'Help us expand our reach across Africa. Research new markets, assist with proposals, and support our growth strategy.', type: 'volunteer', location: 'Remote', remote: 1, salary: 'Unpaid (Certificate provided)', skills: ['Business Planning', 'Research'], courses: [courses[2].id], deadline: '2026-08-01' },
  ];

  for (const o of oppData) {
    await db.run('INSERT INTO opportunities (id, employer_id, title, company, description, type, location, is_remote, salary_range, required_skills, required_courses, deadline) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [uuidv4(), o.employer, o.title, o.company, o.desc, o.type, o.location, o.remote, o.salary, JSON.stringify(o.skills), JSON.stringify(o.courses), o.deadline]);
  }

  console.log('\n✅ Database seeded successfully!');
  console.log('\n📋 Test Accounts:');
  console.log('  Admin:    admin@youthskills.com / password123');
  console.log('  Youth 1:  amara@example.com / password123');
  console.log('  Youth 2:  kwame@example.com / password123');
  console.log('  Employer: hr@techafrica.com / password123');
  console.log('  Employer: jobs@creativehub.com / password123');

  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
