const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { getDb } = require('../database');
const { authenticate, authorize } = require('../middleware/auth');

router.post('/module/:moduleId/complete', authenticate, authorize('youth'), async (req, res) => {
  const { quiz_score } = req.body;
  const db = await getDb();
  const module = await db.get('SELECT * FROM modules WHERE id = ?', req.params.moduleId);
  if (!module) return res.status(404).json({ success: false, message: 'Module not found.' });

  const enrollment = await db.get('SELECT id FROM enrollments WHERE user_id = ? AND course_id = ?', [req.user.id, module.course_id]);
  if (!enrollment) return res.status(403).json({ success: false, message: 'Not enrolled in this course.' });

  const existing = await db.get('SELECT id FROM module_progress WHERE user_id = ? AND module_id = ?', [req.user.id, req.params.moduleId]);
  if (existing) {
    await db.run('UPDATE module_progress SET completed = 1, quiz_score = ?, completed_at = CURRENT_TIMESTAMP WHERE user_id = ? AND module_id = ?',
      [quiz_score || null, req.user.id, req.params.moduleId]);
  } else {
    await db.run('INSERT INTO module_progress (id, user_id, module_id, course_id, completed, quiz_score, completed_at) VALUES (?, ?, ?, ?, 1, ?, CURRENT_TIMESTAMP)',
      [uuidv4(), req.user.id, req.params.moduleId, module.course_id, quiz_score || null]);
  }

  const totalModules = await db.get('SELECT COUNT(*) as count FROM modules WHERE course_id = ?', module.course_id);
  const completedModules = await db.get('SELECT COUNT(*) as count FROM module_progress WHERE user_id = ? AND course_id = ? AND completed = 1', [req.user.id, module.course_id]);

  let certificateIssued = false;
  if (totalModules.count > 0 && completedModules.count >= totalModules.count) {
    await db.run('UPDATE enrollments SET completed_at = CURRENT_TIMESTAMP WHERE user_id = ? AND course_id = ?', [req.user.id, module.course_id]);
    const existingCert = await db.get('SELECT id FROM certificates WHERE user_id = ? AND course_id = ?', [req.user.id, module.course_id]);
    if (!existingCert) {
      const certNumber = `YSP-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
      await db.run('INSERT INTO certificates (id, user_id, course_id, certificate_number) VALUES (?, ?, ?, ?)',
        [uuidv4(), req.user.id, module.course_id, certNumber]);
      const course = await db.get('SELECT title FROM courses WHERE id = ?', module.course_id);
      await db.run('INSERT INTO notifications (id, user_id, title, message, type) VALUES (?, ?, ?, ?, ?)',
        [uuidv4(), req.user.id, '🏆 Certificate Earned!', `Congratulations! You've completed "${course.title}" and earned your certificate. Certificate #${certNumber}`, 'achievement']);
      certificateIssued = true;
    }
  }

  const progress = Math.round((completedModules.count / totalModules.count) * 100);
  res.json({ success: true, message: 'Module marked as complete.', progress, certificateIssued, completedModules: completedModules.count, totalModules: totalModules.count });
});

router.get('/course/:courseId', authenticate, async (req, res) => {
  const db = await getDb();
  const modules = await db.all('SELECT id FROM modules WHERE course_id = ?', req.params.courseId);
  const completed = await db.all('SELECT module_id, quiz_score, completed_at FROM module_progress WHERE user_id = ? AND course_id = ? AND completed = 1', [req.user.id, req.params.courseId]);
  const progress = modules.length > 0 ? Math.round((completed.length / modules.length) * 100) : 0;
  res.json({ success: true, progress, completedModules: completed.length, totalModules: modules.length, completedDetails: completed });
});

router.get('/my-courses', authenticate, async (req, res) => {
  const db = await getDb();
  const enrollments = await db.all(`SELECT e.*, c.title, c.category, c.level, c.thumbnail, c.instructor_name, c.duration_hours
    FROM enrollments e JOIN courses c ON e.course_id = c.id WHERE e.user_id = ? ORDER BY e.enrolled_at DESC`, req.user.id);

  const result = await Promise.all(enrollments.map(async e => {
    const totalModules = await db.get('SELECT COUNT(*) as count FROM modules WHERE course_id = ?', e.course_id);
    const completedModules = await db.get('SELECT COUNT(*) as count FROM module_progress WHERE user_id = ? AND course_id = ? AND completed = 1', [req.user.id, e.course_id]);
    const progress = totalModules.count > 0 ? Math.round((completedModules.count / totalModules.count) * 100) : 0;
    return { ...e, progress, completedModules: completedModules.count, totalModules: totalModules.count };
  }));

  res.json({ success: true, enrollments: result });
});

router.post('/quiz/:moduleId/submit', authenticate, authorize('youth'), async (req, res) => {
  const { answers } = req.body;
  const db = await getDb();
  const quizzes = await db.all('SELECT * FROM quizzes WHERE module_id = ?', req.params.moduleId);
  if (!quizzes.length) return res.status(404).json({ success: false, message: 'No quiz found.' });

  let correct = 0;
  const results = quizzes.map((q, i) => {
    const isCorrect = answers[i] === q.correct_answer;
    if (isCorrect) correct++;
    return { questionId: q.id, correct: isCorrect, correctAnswer: q.correct_answer, explanation: q.explanation };
  });

  const score = Math.round((correct / quizzes.length) * 100);
  res.json({ success: true, score, correct, total: quizzes.length, results });
});

module.exports = router;
