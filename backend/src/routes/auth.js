const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { getDb } = require('../database');
const { authenticate } = require('../middleware/auth');

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role = 'youth', location, phone } = req.body;
    if (!name || !email || !password) return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
    if (password.length < 6) return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });
    if (!['youth', 'employer', 'admin'].includes(role)) return res.status(400).json({ success: false, message: 'Invalid role.' });

    const db = await getDb();
    const existing = await db.get('SELECT id FROM users WHERE email = ?', email.toLowerCase());
    if (existing) return res.status(409).json({ success: false, message: 'Email already registered.' });

    const hashedPassword = await bcrypt.hash(password, 12);
    const id = uuidv4();
    await db.run('INSERT INTO users (id, name, email, password, role, location, phone) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [id, name, email.toLowerCase(), hashedPassword, role, location || null, phone || null]);

    await db.run('INSERT INTO notifications (id, user_id, title, message, type) VALUES (?, ?, ?, ?, ?)',
      [uuidv4(), id, 'Welcome to YouthSkills! 🎉', `Hi ${name}! Your account is ready. Start exploring courses and opportunities.`, 'success']);

    const token = jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
    res.status(201).json({ success: true, message: 'Account created successfully.', token, user: { id, name, email: email.toLowerCase(), role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Registration failed.' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, message: 'Email and password are required.' });

    const db = await getDb();
    const user = await db.get('SELECT * FROM users WHERE email = ?', email.toLowerCase());
    if (!user) return res.status(401).json({ success: false, message: 'Invalid email or password.' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid email or password.' });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
    res.json({ success: true, message: 'Login successful.', token, user: { id: user.id, name: user.name, email: user.email, role: user.role, avatar: user.avatar } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Login failed.' });
  }
});

router.get('/me', authenticate, async (req, res) => {
  const db = await getDb();
  const user = await db.get('SELECT id, name, email, role, avatar, bio, location, phone, skills, created_at FROM users WHERE id = ?', req.user.id);
  res.json({ success: true, user: { ...user, skills: JSON.parse(user.skills || '[]') } });
});

router.put('/change-password', authenticate, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const db = await getDb();
    const user = await db.get('SELECT * FROM users WHERE id = ?', req.user.id);
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ success: false, message: 'Current password is incorrect.' });
    if (newPassword.length < 6) return res.status(400).json({ success: false, message: 'New password must be at least 6 characters.' });
    const hashed = await bcrypt.hash(newPassword, 12);
    await db.run('UPDATE users SET password = ? WHERE id = ?', [hashed, req.user.id]);
    res.json({ success: true, message: 'Password changed successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to change password.' });
  }
});

module.exports = router;
