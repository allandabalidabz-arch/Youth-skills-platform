const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { getDb } = require('../database');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/', authenticate, async (req, res) => {
  const { category, level, search, page = 1, limit = 12 } = req.query;
  const offset = (page - 1) * limit;
  const db = await getDb();

  let query = 'SELECT * FROM courses WHERE is_published = 1';
  const params = [];
  if (category) { query += ' AND category = ?'; params.push(category); }
  if (level) { query += ' AND level = ?'; params.push(level); }
  if (search) { query += ' AND (title LIKE ? OR description LIKE ?)'; params.push(`%${search}%`, `%${search}%`); }

  const countRow = await db.get(query.replace('SELECT *', 'SELECT COUNT(*) as total'), params);
  query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
  const courses = await db.all(query, [...params, parseInt(limit), parseInt(offset)]);

  const enriched = await Promise.all(courses.map(async course => {
    const enrollCount = await db.get('SELECT COUNT(*) as count FROM enrollments WHERE course_id = ?', course.id);
    const moduleCount = await db.get('SELECT COUNT(*) as count FROM modules WHERE course_id = ?', course.id);
    const userEnrolled = await db.get('SELECT id FROM enrollments WHERE user_id = ? AND course_id = ?', [req.user.id, course.id]);
    return { ...course, tags: JSON.parse(course.tags || '[]'), enrolled_count: enrollCount.count, module_count: moduleCount.count, is_enrolled: !!userEnrolled };
  }));

  res.json({ success: true, courses: enriched, total: countRow.total, page: parseInt(page), limit: parseInt(limit) });
});

router.get('/:id', authenticate, async (req, res) => {
  const db = await getDb();
  const course = await db.get('SELECT * FROM courses WHERE id = ? AND is_published = 1', req.params.id);
  if (!course) return res.status(404).json({ success: false, message: 'Course not found.' });

  const modules = await db.all('SELECT * FROM modules WHERE course_id = ? ORDER BY order_index', req.params.id);
  const enrollment = await db.get('SELECT * FROM enrollments WHERE user_id = ? AND course_id = ?', [req.user.id, req.params.id]);

  const modulesWithProgress = await Promise.all(modules.map(async m => {
    const progress = await db.get('SELECT * FROM module_progress WHERE user_id = ? AND module_id = ?', [req.user.id, m.id]);
    const quizzes = await db.all('SELECT id, question, options, explanation FROM quizzes WHERE module_id = ?', m.id);
    return { ...m, progress: progress || null, quizzes: quizzes.map(q => ({ ...q, options: JSON.parse(q.options) })) };
  }));

  const enrollCount = await db.get('SELECT COUNT(*) as count FROM enrollments WHERE course_id = ?', req.params.id);

  res.json({
    success: true,
    course: { ...course, tags: JSON.parse(course.tags || '[]'), enrolled_count: enrollCount.count },
    modules: modulesWithProgress,
    enrollment: enrollment || null
  });
});

router.post('/:id/enroll', authenticate, authorize('youth'), async (req, res) => {
  const db = await getDb();
  const course = await db.get('SELECT id, title FROM courses WHERE id = ? AND is_published = 1', req.params.id);
  if (!course) return res.status(404).json({ success: false, message: 'Course not found.' });

  const existing = await db.get('SELECT id FROM enrollments WHERE user_id = ? AND course_id = ?', [req.user.id, req.params.id]);
  if (existing) return res.status(409).json({ success: false, message: 'Already enrolled.' });

  await db.run('INSERT INTO enrollments (id, user_id, course_id) VALUES (?, ?, ?)', [uuidv4(), req.user.id, req.params.id]);
  await db.run('INSERT INTO notifications (id, user_id, title, message, type) VALUES (?, ?, ?, ?, ?)',
    [uuidv4(), req.user.id, 'Enrolled Successfully! 📚', `You are now enrolled in "${course.title}". Start learning today!`, 'success']);

  res.json({ success: true, message: `Successfully enrolled in ${course.title}` });
});

router.post('/', authenticate, authorize('admin'), async (req, res) => {
  const { title, description, category, level, duration_hours, thumbnail, instructor_name, instructor_bio, tags } = req.body;
  if (!title || !description || !category || !instructor_name) return res.status(400).json({ success: false, message: 'Required fields missing.' });

  const db = await getDb();
  const id = uuidv4();
  await db.run('INSERT INTO courses (id, title, description, category, level, duration_hours, thumbnail, instructor_name, instructor_bio, tags) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [id, title, description, category, level || 'beginner', duration_hours || 0, thumbnail, instructor_name, instructor_bio, JSON.stringify(tags || [])]);
  res.status(201).json({ success: true, message: 'Course created.', courseId: id });
});

router.post('/:id/modules', authenticate, authorize('admin'), async (req, res) => {
  const { title, description, content, video_url, order_index, duration_minutes } = req.body;
  if (!title || !content) return res.status(400).json({ success: false, message: 'Title and content are required.' });

  const db = await getDb();
  const course = await db.get('SELECT id FROM courses WHERE id = ?', req.params.id);
  if (!course) return res.status(404).json({ success: false, message: 'Course not found.' });

  const id = uuidv4();
  await db.run('INSERT INTO modules (id, course_id, title, description, content, video_url, order_index, duration_minutes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [id, req.params.id, title, description, content, video_url, order_index || 1, duration_minutes || 0]);
  res.status(201).json({ success: true, message: 'Module added.', moduleId: id });
});

router.post('/modules/:moduleId/quiz', authenticate, authorize('admin'), async (req, res) => {
  const { question, options, correct_answer, explanation } = req.body;
  if (!question || !options || correct_answer === undefined) return res.status(400).json({ success: false, message: 'Required fields missing.' });

  const db = await getDb();
  const id = uuidv4();
  await db.run('INSERT INTO quizzes (id, module_id, question, options, correct_answer, explanation) VALUES (?, ?, ?, ?, ?, ?)',
    [id, req.params.moduleId, question, JSON.stringify(options), correct_answer, explanation]);
  res.status(201).json({ success: true, message: 'Quiz question added.', quizId: id });
});

module.exports = router;
