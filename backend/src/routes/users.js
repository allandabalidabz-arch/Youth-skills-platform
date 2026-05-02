const express = require('express');
const router = express.Router();
const { getDb } = require('../database');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/profile', authenticate, async (req, res) => {
  const db = await getDb();
  const user = await db.get('SELECT id, name, email, role, avatar, bio, location, phone, skills, created_at FROM users WHERE id = ?', req.user.id);
  if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
  res.json({ success: true, user: { ...user, skills: JSON.parse(user.skills || '[]') } });
});

router.put('/profile', authenticate, async (req, res) => {
  const { name, bio, location, phone, skills, avatar } = req.body;
  const db = await getDb();
  await db.run(`UPDATE users SET
    name = COALESCE(?, name), bio = COALESCE(?, bio), location = COALESCE(?, location),
    phone = COALESCE(?, phone), skills = COALESCE(?, skills), avatar = COALESCE(?, avatar),
    updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
    [name, bio, location, phone, skills ? JSON.stringify(skills) : null, avatar, req.user.id]);
  const updated = await db.get('SELECT id, name, email, role, avatar, bio, location, phone, skills FROM users WHERE id = ?', req.user.id);
  res.json({ success: true, message: 'Profile updated.', user: { ...updated, skills: JSON.parse(updated.skills || '[]') } });
});

router.get('/:id/public', authenticate, async (req, res) => {
  const db = await getDb();
  const user = await db.get('SELECT id, name, role, avatar, bio, location, skills, created_at FROM users WHERE id = ?', req.params.id);
  if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
  const certs = await db.all(`SELECT c.id, c.certificate_number, c.issued_at, co.title as course_title, co.category
    FROM certificates c JOIN courses co ON c.course_id = co.id WHERE c.user_id = ?`, req.params.id);
  res.json({ success: true, user: { ...user, skills: JSON.parse(user.skills || '[]') }, certificates: certs });
});

router.get('/', authenticate, authorize('admin'), async (req, res) => {
  const { role, search, page = 1, limit = 20 } = req.query;
  const offset = (page - 1) * limit;
  const db = await getDb();
  let query = 'SELECT id, name, email, role, avatar, location, created_at FROM users WHERE 1=1';
  const params = [];
  if (role) { query += ' AND role = ?'; params.push(role); }
  if (search) { query += ' AND (name LIKE ? OR email LIKE ?)'; params.push(`%${search}%`, `%${search}%`); }
  const countRow = await db.get(query.replace('SELECT id, name, email, role, avatar, location, created_at', 'SELECT COUNT(*) as total'), params);
  query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
  const users = await db.all(query, [...params, parseInt(limit), parseInt(offset)]);
  res.json({ success: true, users, total: countRow.total, page: parseInt(page), limit: parseInt(limit) });
});

module.exports = router;
