const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { getDb } = require('../database');
const { authenticate, authorize } = require('../middleware/auth');

// GET /api/assignments/module/:moduleId — get assignment for a module
router.get('/module/:moduleId', authenticate, async (req, res) => {
  const db = await getDb();
  const assignment = await db.get('SELECT * FROM assignments WHERE module_id = ?', req.params.moduleId);
  if (!assignment) return res.json({ success: true, assignment: null });

  let submission = null;
  if (req.user.role === 'youth') {
    submission = await db.get('SELECT * FROM assignment_submissions WHERE assignment_id = ? AND user_id = ?',
      [assignment.id, req.user.id]);
  }

  res.json({ success: true, assignment, submission });
});

// GET /api/assignments/my — all submissions by current user
router.get('/my', authenticate, authorize('youth'), async (req, res) => {
  const db = await getDb();
  const submissions = await db.all(`
    SELECT s.*, a.title as assignment_title, a.description, c.title as course_title, m.title as module_title
    FROM assignment_submissions s
    JOIN assignments a ON s.assignment_id = a.id
    JOIN courses c ON s.course_id = c.id
    JOIN modules m ON s.module_id = m.id
    WHERE s.user_id = ? ORDER BY s.submitted_at DESC
  `, req.user.id);
  res.json({ success: true, submissions });
});

// POST /api/assignments/:id/submit — submit assignment
router.post('/:id/submit', authenticate, authorize('youth'), async (req, res) => {
  const { submission_text } = req.body;
  if (!submission_text || submission_text.trim().length < 20) {
    return res.status(400).json({ success: false, message: 'Submission must be at least 20 characters.' });
  }

  const db = await getDb();
  const assignment = await db.get('SELECT * FROM assignments WHERE id = ?', req.params.id);
  if (!assignment) return res.status(404).json({ success: false, message: 'Assignment not found.' });

  // Check enrollment
  const enrollment = await db.get('SELECT id FROM enrollments WHERE user_id = ? AND course_id = ?',
    [req.user.id, assignment.course_id]);
  if (!enrollment) return res.status(403).json({ success: false, message: 'Not enrolled in this course.' });

  const existing = await db.get('SELECT id FROM assignment_submissions WHERE assignment_id = ? AND user_id = ?',
    [req.params.id, req.user.id]);
  if (existing) {
    // Allow resubmission if not yet graded
    await db.run('UPDATE assignment_submissions SET submission_text = ?, status = ?, submitted_at = CURRENT_TIMESTAMP WHERE id = ?',
      [submission_text, 'submitted', existing.id]);
    return res.json({ success: true, message: 'Assignment resubmitted successfully.' });
  }

  const id = uuidv4();
  await db.run('INSERT INTO assignment_submissions (id, assignment_id, user_id, module_id, course_id, submission_text) VALUES (?, ?, ?, ?, ?, ?)',
    [id, req.params.id, req.user.id, assignment.module_id, assignment.course_id, submission_text]);

  await db.run('INSERT INTO notifications (id, user_id, title, message, type) VALUES (?, ?, ?, ?, ?)',
    [uuidv4(), req.user.id, 'Assignment Submitted! 📝',
    `Your assignment for "${assignment.title}" has been submitted successfully.`, 'success']);

  res.json({ success: true, message: 'Assignment submitted successfully!', submissionId: id });
});

// GET /api/assignments/course/:courseId/submissions — admin/instructor view all submissions
router.get('/course/:courseId/submissions', authenticate, authorize('admin'), async (req, res) => {
  const db = await getDb();
  const submissions = await db.all(`
    SELECT s.*, u.name as student_name, u.email as student_email,
           a.title as assignment_title, m.title as module_title
    FROM assignment_submissions s
    JOIN users u ON s.user_id = u.id
    JOIN assignments a ON s.assignment_id = a.id
    JOIN modules m ON s.module_id = m.id
    WHERE s.course_id = ? ORDER BY s.submitted_at DESC
  `, req.params.courseId);
  res.json({ success: true, submissions });
});

// PUT /api/assignments/submission/:id/grade — grade a submission (admin)
router.put('/submission/:id/grade', authenticate, authorize('admin'), async (req, res) => {
  const { grade, feedback } = req.body;
  if (grade === undefined || grade < 0 || grade > 100) {
    return res.status(400).json({ success: false, message: 'Grade must be between 0 and 100.' });
  }

  const db = await getDb();
  const sub = await db.get('SELECT * FROM assignment_submissions WHERE id = ?', req.params.id);
  if (!sub) return res.status(404).json({ success: false, message: 'Submission not found.' });

  await db.run('UPDATE assignment_submissions SET grade = ?, feedback = ?, status = ?, graded_at = CURRENT_TIMESTAMP WHERE id = ?',
    [grade, feedback, 'graded', req.params.id]);

  const assignment = await db.get('SELECT title FROM assignments WHERE id = ?', sub.assignment_id);
  await db.run('INSERT INTO notifications (id, user_id, title, message, type) VALUES (?, ?, ?, ?, ?)',
    [uuidv4(), sub.user_id, 'Assignment Graded! 🎯',
    `Your assignment "${assignment.title}" has been graded. Score: ${grade}/100. ${feedback ? 'Feedback: ' + feedback : ''}`,
    grade >= 60 ? 'success' : 'info']);

  res.json({ success: true, message: 'Assignment graded.' });
});

module.exports = router;
