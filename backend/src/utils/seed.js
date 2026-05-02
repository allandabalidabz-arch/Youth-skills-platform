require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { getDb } = require('../database');

async function seedData(db) {
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

  const courses = [
    { id: uuidv4(), title: 'Introduction to Web Development', category: 'coding', level: 'beginner', description: 'Learn the fundamentals of HTML, CSS, and JavaScript to build your first website.', duration_hours: 20, instructor_name: 'Dr. Kofi Acheampong', instructor_bio: 'Senior Software Engineer with 10+ years experience', thumbnail: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400', tags: ['HTML', 'CSS', 'JavaScript', 'Web'] },
    { id: uuidv4(), title: 'Graphic Design Fundamentals', category: 'design', level: 'beginner', description: 'Master the principles of graphic design including color theory, typography, layout, and branding.', duration_hours: 15, instructor_name: 'Aisha Diallo', instructor_bio: 'Award-winning graphic designer', thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400', tags: ['Design', 'Figma', 'Branding', 'Typography'] },
    { id: uuidv4(), title: 'Entrepreneurship & Business Basics', category: 'entrepreneurship', level: 'beginner', description: 'Discover how to turn your ideas into a successful business.', duration_hours: 12, instructor_name: 'Emmanuel Nkrumah', instructor_bio: 'Serial entrepreneur and startup mentor', thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', tags: ['Business', 'Startup', 'Finance', 'Marketing'] },
    { id: uuidv4(), title: 'Python Programming for Beginners', category: 'coding', level: 'beginner', description: 'Start your programming journey with Python.', duration_hours: 25, instructor_name: 'Dr. Fatima Al-Hassan', instructor_bio: 'Data scientist and Python educator', thumbnail: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400', tags: ['Python', 'Programming', 'Data', 'Automation'] },
    { id: uuidv4(), title: 'Digital Marketing Essentials', category: 'marketing', level: 'beginner', description: 'Learn how to grow businesses online through social media marketing and SEO.', duration_hours: 10, instructor_name: 'Zara Okonkwo', instructor_bio: 'Digital marketing strategist', thumbnail: 'https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=400', tags: ['Marketing', 'Social Media', 'SEO', 'Content'] },
    { id: uuidv4(), title: 'Data Analysis with Excel & Google Sheets', category: 'data', level: 'beginner', description: 'Unlock the power of data analysis using spreadsheet tools.', duration_hours: 8, instructor_name: 'Samuel Boateng', instructor_bio: 'Business analyst and data visualization expert', thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400', tags: ['Data', 'Excel', 'Analytics', 'Visualization'] },
  ];

  for (const c of courses) {
    await db.run('INSERT INTO courses (id, title, description, category, level, duration_hours, thumbnail, instructor_name, instructor_bio, tags) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [c.id, c.title, c.description, c.category, c.level, c.duration_hours, c.thumbnail, c.instructor_name, c.instructor_bio, JSON.stringify(c.tags)]);
  }

  const webCourseId = courses[0].id;
  const moduleData = [
    { title: 'HTML Basics', content: '# HTML Basics\n\nHTML (HyperText Markup Language) is the foundation of every web page.\n\n## What you will learn:\n- HTML document structure\n- Common HTML tags\n- Forms and input elements\n- Semantic HTML5 elements\n\n## Your First HTML Page\n\n```html\n<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <title>My First Page</title>\n</head>\n<body>\n  <h1>Hello, World!</h1>\n  <p>Welcome to web development!</p>\n</body>\n</html>\n```', order_index: 1, duration_minutes: 45 },
    { title: 'CSS Styling', content: '# CSS Styling\n\nCSS makes your HTML look beautiful.\n\n## Core Concepts:\n- Selectors and properties\n- Box model\n- Colors and typography\n- Flexbox layout\n\n## Example:\n\n```css\nbody { font-family: Arial, sans-serif; }\nh1 { color: #2563eb; }\n.card { background: white; border-radius: 8px; padding: 20px; }\n```', order_index: 2, duration_minutes: 60 },
    { title: 'JavaScript Fundamentals', content: '# JavaScript Fundamentals\n\nJavaScript brings interactivity to your web pages.\n\n## Topics:\n- Variables (let, const)\n- Functions\n- DOM manipulation\n- Events\n\n## Example:\n\n```javascript\nconst button = document.querySelector("#btn");\nbutton.addEventListener("click", () => {\n  alert("Clicked!");\n});\n```', order_index: 3, duration_minutes: 90 },
  ];

  const moduleIds = [];
  for (const m of moduleData) {
    const mid = uuidv4();
    moduleIds.push(mid);
    await db.run('INSERT INTO modules (id, course_id, title, content, order_index, duration_minutes) VALUES (?, ?, ?, ?, ?, ?)',
      [mid, webCourseId, m.title, m.content, m.order_index, m.duration_minutes]);
  }

  const quizData = [
    { moduleId: moduleIds[0], question: 'What does HTML stand for?', options: ['HyperText Markup Language', 'High Tech Modern Language', 'HyperText Modern Links', 'Home Tool Markup Language'], correct: 0, explanation: 'HTML stands for HyperText Markup Language.' },
    { moduleId: moduleIds[0], question: 'Which tag is used for the largest heading?', options: ['<h6>', '<heading>', '<h1>', '<head>'], correct: 2, explanation: '<h1> is the largest heading tag.' },
    { moduleId: moduleIds[1], question: 'Which CSS property changes text color?', options: ['font-color', 'text-color', 'color', 'foreground'], correct: 2, explanation: 'The "color" property sets text color.' },
    { moduleId: moduleIds[2], question: 'Which keyword declares a constant in JavaScript?', options: ['var', 'let', 'const', 'define'], correct: 2, explanation: '"const" declares a constant variable.' },
  ];

  for (const q of quizData) {
    await db.run('INSERT INTO quizzes (id, module_id, question, options, correct_answer, explanation) VALUES (?, ?, ?, ?, ?, ?)',
      [uuidv4(), q.moduleId, q.question, JSON.stringify(q.options), q.correct, q.explanation]);
  }

  const oppData = [
    { employer: employer1Id, title: 'Junior Web Developer', company: 'TechAfrica Ltd', desc: 'Join our team building web applications for African businesses.', type: 'job', location: 'Nairobi, Kenya', remote: 0, salary: '$500-$800/month', skills: ['HTML', 'CSS', 'JavaScript'], courses: [webCourseId], deadline: '2026-06-30' },
    { employer: employer1Id, title: 'Python Developer Intern', company: 'TechAfrica Ltd', desc: 'Join our data team building pipelines and automation scripts.', type: 'internship', location: 'Nairobi, Kenya', remote: 1, salary: 'Stipend: $200/month', skills: ['Python', 'Data Analysis'], courses: [courses[3].id], deadline: '2026-05-31' },
    { employer: employer2Id, title: 'Graphic Design Intern', company: 'Creative Hub', desc: 'Support our creative team on branding and social media content.', type: 'internship', location: 'Accra, Ghana', remote: 0, salary: 'Stipend: $150/month', skills: ['Figma', 'Design', 'Branding'], courses: [courses[1].id], deadline: '2026-05-15' },
    { employer: employer2Id, title: 'Social Media Manager', company: 'Creative Hub', desc: 'Manage clients online presence and content calendars.', type: 'job', location: 'Accra, Ghana', remote: 1, salary: '$400-$600/month', skills: ['Social Media', 'Content', 'Marketing'], courses: [courses[4].id], deadline: '2026-07-01' },
    { employer: employer1Id, title: 'Business Development Volunteer', company: 'TechAfrica Ltd', desc: 'Help expand our reach across Africa through market research.', type: 'volunteer', location: 'Remote', remote: 1, salary: 'Unpaid (Certificate provided)', skills: ['Business Planning', 'Research'], courses: [courses[2].id], deadline: '2026-08-01' },
  ];

  for (const o of oppData) {
    await db.run('INSERT INTO opportunities (id, employer_id, title, company, description, type, location, is_remote, salary_range, required_skills, required_courses, deadline) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [uuidv4(), o.employer, o.title, o.company, o.desc, o.type, o.location, o.remote, o.salary, JSON.stringify(o.skills), JSON.stringify(o.courses), o.deadline]);
  }

  console.log('✅ Seed data inserted — 5 users, 6 courses, 3 modules, 4 quizzes, 5 opportunities');
}

// Run directly
async function seed() {
  console.log('🌱 Seeding database...');
  const db = await getDb();
  await db.exec(`DELETE FROM applications; DELETE FROM certificates; DELETE FROM module_progress; DELETE FROM enrollments; DELETE FROM quizzes; DELETE FROM modules; DELETE FROM opportunities; DELETE FROM courses; DELETE FROM notifications; DELETE FROM users;`);
  await seedData(db);
  console.log('\n📋 Test Accounts:');
  console.log('  Admin:    admin@youthskills.com / password123');
  console.log('  Youth:    amara@example.com / password123');
  console.log('  Employer: hr@techafrica.com / password123');
  process.exit(0);
}

module.exports = { seedData };

if (require.main === module) {
  seed().catch(err => { console.error(err); process.exit(1); });
}
