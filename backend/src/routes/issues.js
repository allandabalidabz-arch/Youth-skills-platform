const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { getDb } = require('../database');
const { authenticate, authorize } = require('../middleware/auth');

// POST /api/issues — youth submits an issue report
router.post('/', authenticate, authorize('youth'), async (req, res) => {
  const { subject, description, category = 'general' } = req.body;
  if (!subject || subject.trim().length < 3)
    return res.status(400).json({ success: false, message: 'Subject is required.' });
  if (!description || description.trim().length < 10)
    return res.status(400).json({ success: false, message: 'Description must be at least 10 characters.' });

  const db = await getDb();
  const id = uuidv4();
  await db.run(
    'INSERT INTO issue_reports (id, user_id, subject, description, category) VALUES (?, ?, ?, ?, ?)',
    [id, req.user.id, subject.trim(), description.trim(), category]
  );

  // In-app notification for admin
  const admin = await db.get("SELECT id FROM users WHERE role = 'admin' LIMIT 1");
  if (admin) {
    await db.run(
      'INSERT INTO notifications (id, user_id, title, message, type) VALUES (?, ?, ?, ?, ?)',
      [uuidv4(), admin.id, '🚨 New Issue Reported',
        `${req.user.name} reported an issue: "${subject.trim()}". Please review it in the Issues tab.`, 'warning']
    );
  }

  // Confirmation notification for the learner
  await db.run(
    'INSERT INTO notifications (id, user_id, title, message, type) VALUES (?, ?, ?, ?, ?)',
    [uuidv4(), req.user.id, 'Issue Submitted ✅',
      `Your issue "${subject.trim()}" has been submitted. The admin will review it shortly.`, 'info']
  );

  res.status(201).json({ success: true, message: 'Issue reported successfully. The admin has been notified.' });
});

// GET /api/issues — admin views all issues
router.get('/', authenticate, authorize('admin'), async (req, res) => {
  const db = await getDb();
  const issues = await db.all(`
    SELECT ir.*, u.name as reporter_name, u.email as reporter_email
    FROM issue_reports ir
    JOIN users u ON ir.user_id = u.id
    ORDER BY ir.created_at DESC
  `);
  res.json({ success: true, issues });
});

// GET /api/issues/my — youth views their own issues
router.get('/my', authenticate, authorize('youth'), async (req, res) => {
  const db = await getDb();
  const issues = await db.all(
    'SELECT * FROM issue_reports WHERE user_id = ? ORDER BY created_at DESC',
    req.user.id
  );
  res.json({ success: true, issues });
});

// PUT /api/issues/:id/resolve — admin resolves an issue with optional response
router.put('/:id/resolve', authenticate, authorize('admin'), async (req, res) => {
  const { admin_response } = req.body;
  const db = await getDb();
  const issue = await db.get('SELECT * FROM issue_reports WHERE id = ?', req.params.id);
  if (!issue) return res.status(404).json({ success: false, message: 'Issue not found.' });

  await db.run(
    'UPDATE issue_reports SET status = ?, admin_response = ?, resolved_at = CURRENT_TIMESTAMP WHERE id = ?',
    ['resolved', admin_response || null, req.params.id]
  );

  // Notify the learner
  await db.run(
    'INSERT INTO notifications (id, user_id, title, message, type) VALUES (?, ?, ?, ?, ?)',
    [uuidv4(), issue.user_id, '✅ Issue Resolved',
      `Your issue "${issue.subject}" has been resolved.${admin_response ? ' Response: ' + admin_response : ''}`, 'success']
  );

  res.json({ success: true, message: 'Issue resolved.' });
});

module.exports = router;
