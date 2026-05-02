const express = require('express');
const router = express.Router();
const { getDb } = require('../database');
const { authenticate } = require('../middleware/auth');

router.get('/', authenticate, async (req, res) => {
  const db = await getDb();
  const notifications = await db.all('SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 50', req.user.id);
  const unreadRow = await db.get('SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = 0', req.user.id);
  res.json({ success: true, notifications, unreadCount: unreadRow.count });
});

router.put('/read-all', authenticate, async (req, res) => {
  const db = await getDb();
  await db.run('UPDATE notifications SET is_read = 1 WHERE user_id = ?', req.user.id);
  res.json({ success: true, message: 'All notifications marked as read.' });
});

router.put('/:id/read', authenticate, async (req, res) => {
  const db = await getDb();
  await db.run('UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
  res.json({ success: true });
});

module.exports = router;
