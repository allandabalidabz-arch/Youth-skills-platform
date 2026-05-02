const express = require('express');
const router = express.Router();
const { getDb } = require('../database');
const { authenticate } = require('../middleware/auth');

router.get('/my', authenticate, async (req, res) => {
  const db = await getDb();
  const certs = await db.all(`SELECT c.*, co.title as course_title, co.category, co.level, co.instructor_name, co.thumbnail
    FROM certificates c JOIN courses co ON c.course_id = co.id WHERE c.user_id = ? ORDER BY c.issued_at DESC`, req.user.id);
  res.json({ success: true, certificates: certs });
});

router.get('/verify/:certNumber', async (req, res) => {
  const db = await getDb();
  const cert = await db.get(`SELECT c.*, u.name as holder_name, co.title as course_title, co.category, co.level, co.instructor_name
    FROM certificates c JOIN users u ON c.user_id = u.id JOIN courses co ON c.course_id = co.id
    WHERE c.certificate_number = ?`, req.params.certNumber);

  if (!cert) return res.status(404).json({ success: false, message: 'Certificate not found.' });

  res.json({ success: true, valid: true, certificate: {
    certificate_number: cert.certificate_number, holder_name: cert.holder_name,
    course_title: cert.course_title, category: cert.category, level: cert.level,
    instructor_name: cert.instructor_name, issued_at: cert.issued_at
  }});
});

module.exports = router;
