const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');
const { getDb } = require('../database');
const { authenticate } = require('../middleware/auth');

// Format validators
const isValidEmail    = (email)    => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isValidPhone    = (phone)    => /^\+?[0-9]{7,15}$/.test(phone.trim());
const isValidUrl      = (url)      => /^https?:\/\/.+\..+/.test(url);
const isValidLocation = (location) => /[a-zA-Z]/.test(location);

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role = 'youth', location, phone } = req.body;
    if (!name || !email || !password) return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
    if (!isValidEmail(email)) return res.status(400).json({ success: false, message: 'Invalid email format.' });
    if (password.length < 6) return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });
    if (phone && !isValidPhone(phone)) return res.status(400).json({ success: false, message: 'Invalid phone number format.' });
    if (location && !isValidLocation(location)) return res.status(400).json({ success: false, message: 'Enter a valid location.' });
    if (!['youth', 'employer'].includes(role)) return res.status(400).json({ success: false, message: 'Invalid role.' });

    const db = await getDb();
    const existing = await db.get('SELECT id FROM users WHERE email = ?', email.toLowerCase());
    if (existing) return res.status(409).json({ success: false, message: 'Email already registered.' });

    const hashedPassword = await bcrypt.hash(password, 12);
    const id = uuidv4();
    await db.run('INSERT INTO users (id, name, email, password, role, location, phone) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [id, name, email.toLowerCase(), hashedPassword, role, location || null, phone || null]);

    await db.run('INSERT INTO notifications (id, user_id, title, message, type) VALUES (?, ?, ?, ?, ?)',
      [uuidv4(), id, 'Welcome to YouthSkills! 🎉', `Hi ${name}! Your account is ready. Start exploring courses and connect with employers.`, 'success']);

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

// --- Password reset routes ---
// POST /api/auth/forgot-password
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: 'Email is required.' });
    if (!isValidEmail(email)) return res.status(400).json({ success: false, message: 'Invalid email format.' });
    const db = await getDb();
    const user = await db.get('SELECT id, name, email FROM users WHERE email = ?', email.toLowerCase());
    if (!user) return res.status(200).json({ success: true, message: 'If that email exists, a reset link was sent.' });

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour
    const id = uuidv4();
    await db.run('INSERT INTO password_resets (id, user_id, token, expires_at) VALUES (?, ?, ?, ?)', [id, user.id, token, expiresAt]);

    // Notify user and log link for development. Integrate email provider here.
    const frontend = process.env.FRONTEND_URL || 'http://localhost:5173';
    const resetLink = `${frontend}/reset-password?token=${token}`;
    await db.run('INSERT INTO notifications (id, user_id, title, message, type) VALUES (?, ?, ?, ?, ?)',
      [uuidv4(), user.id, 'Password Reset Requested', `A password reset was requested for your account. Use this link to reset your password: ${resetLink}`, 'info']);

    // Log the link to console for development convenience
    console.log(`Password reset link for ${user.email}: ${resetLink}`);

    const response = { success: true, message: 'If that email exists, a reset link was sent.' };
    if (process.env.NODE_ENV !== 'production') response.resetLink = resetLink;
    res.json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to process forgot password.' });
  }
});

// POST /api/auth/reset-password
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) return res.status(400).json({ success: false, message: 'Token and newPassword are required.' });
    if (newPassword.length < 6) return res.status(400).json({ success: false, message: 'New password must be at least 6 characters.' });

    const db = await getDb();
    const reset = await db.get('SELECT * FROM password_resets WHERE token = ?', token);
    if (!reset) return res.status(400).json({ success: false, message: 'Invalid or expired token.' });
    if (reset.used) return res.status(400).json({ success: false, message: 'Token already used.' });
    if (new Date(reset.expires_at) < new Date()) return res.status(400).json({ success: false, message: 'Token has expired.' });

    const user = await db.get('SELECT id FROM users WHERE id = ?', reset.user_id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

    const hashed = await bcrypt.hash(newPassword, 12);
    await db.run('UPDATE users SET password = ? WHERE id = ?', [hashed, user.id]);

    // Mark all reset tokens for this user as used
    await db.run('UPDATE password_resets SET used = 1 WHERE user_id = ?', user.id);

    await db.run('INSERT INTO notifications (id, user_id, title, message, type) VALUES (?, ?, ?, ?, ?)',
      [uuidv4(), user.id, 'Password Changed', 'Your account password was changed successfully. If this was not you, contact support immediately.', 'success']);

    res.json({ success: true, message: 'Password has been reset successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to reset password.' });
  }
});
