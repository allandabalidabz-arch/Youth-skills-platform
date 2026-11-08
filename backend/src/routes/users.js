const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const { getDb } = require('../database');
const { authenticate, authorize } = require('../middleware/auth');

// ── Multer config — store avatar in uploads/avatars/ ──────────────────────
const avatarDir = path.join(__dirname, '..', '..', 'uploads', 'avatars');
if (!fs.existsSync(avatarDir)) fs.mkdirSync(avatarDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, avatarDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
    cb(null, `avatar-${req.user.id}-${Date.now()}${ext}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 3 * 1024 * 1024 }, // 3 MB
  fileFilter: (req, file, cb) => {
    if (['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.mimetype)) cb(null, true);
    else cb(new Error('Only image files (JPG, PNG, WEBP, GIF) are allowed.'));
  },
});

// ── Validators ────────────────────────────────────────────────────────────
const isValidPhone    = (phone)    => /^\+?[0-9]{7,15}$/.test(phone.trim());
const isValidUrl      = (url)      => /^https?:\/\/.+\..+/.test(url);
const isValidLocation = (location) => /[a-zA-Z]/.test(location);
const isValidNRC      = (nrc)      => /^[0-9]{6}\/[0-9]{2}\/[0-9]$/.test(nrc.trim());

// ── POST /api/users/avatar — upload a profile picture ────────────────────
router.post('/avatar', authenticate, upload.single('avatar'), async (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'No image file uploaded.' });

  const avatarUrl = `/uploads/avatars/${req.file.filename}`;
  const db = await getDb();

  // Delete old avatar file if it was a local upload
  const existing = await db.get('SELECT avatar FROM users WHERE id = ?', req.user.id);
  if (existing?.avatar?.startsWith('/uploads/avatars/')) {
    const oldPath = path.join(__dirname, '..', '..', existing.avatar);
    if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
  }

  await db.run('UPDATE users SET avatar = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [avatarUrl, req.user.id]);
  const updated = await db.get('SELECT id, name, email, role, avatar, bio, location, phone, nrc, skills FROM users WHERE id = ?', req.user.id);
  res.json({ success: true, message: 'Profile picture updated.', avatarUrl, user: { ...updated, skills: JSON.parse(updated.skills || '[]') } });
});

router.get('/profile', authenticate, async (req, res) => {
  const db = await getDb();
  const user = await db.get('SELECT id, name, email, role, avatar, bio, location, phone, nrc, skills, created_at FROM users WHERE id = ?', req.user.id);
  if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
  res.json({ success: true, user: { ...user, skills: JSON.parse(user.skills || '[]') } });
});

router.put('/profile', authenticate, async (req, res) => {
  const { name, bio, location, phone, nrc, skills, avatar } = req.body;
  if (phone && !isValidPhone(phone)) {
    return res.status(400).json({ success: false, message: 'Invalid phone number format.' });
  }
  if (avatar && !isValidUrl(avatar) && !avatar.startsWith('/uploads/')) {
    return res.status(400).json({ success: false, message: 'Invalid avatar URL. Must start with http:// or https://' });
  }
  if (location && !isValidLocation(location)) {
    return res.status(400).json({ success: false, message: 'Enter a valid location.' });
  }
  if (nrc && !isValidNRC(nrc)) {
    return res.status(400).json({ success: false, message: 'Invalid NRC format. Use format: 123456/78/9' });
  }
  const db = await getDb();
  await db.run(`UPDATE users SET
    name = COALESCE(?, name), bio = COALESCE(?, bio), location = COALESCE(?, location),
    phone = COALESCE(?, phone), nrc = COALESCE(?, nrc), skills = COALESCE(?, skills),
    avatar = COALESCE(?, avatar), updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
    [name, bio, location, phone, nrc, skills ? JSON.stringify(skills) : null, avatar, req.user.id]);
  const updated = await db.get('SELECT id, name, email, role, avatar, bio, location, phone, nrc, skills FROM users WHERE id = ?', req.user.id);
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
  let query = 'SELECT id, name, email, role, avatar, location, nrc, created_at FROM users WHERE 1=1';
  const params = [];
  if (role) { query += ' AND role = ?'; params.push(role); }
  if (search) { query += ' AND (name LIKE ? OR email LIKE ?)'; params.push(`%${search}%`, `%${search}%`); }
  const countRow = await db.get(query.replace('SELECT id, name, email, role, avatar, location, created_at', 'SELECT COUNT(*) as total'), params);
  query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
  const users = await db.all(query, [...params, parseInt(limit), parseInt(offset)]);
  res.json({ success: true, users, total: countRow.total, page: parseInt(page), limit: parseInt(limit) });
});

module.exports = router;
