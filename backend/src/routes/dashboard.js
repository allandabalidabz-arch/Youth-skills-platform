const express = require('express');
const router = express.Router();
const { getDb } = require('../database');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/youth', authenticate, authorize('youth'), async (req, res) => {
  const db = await getDb();
  const userId = req.user.id;

  const [enrolledCourses, completedCourses, certificates] = await Promise.all([
    db.get('SELECT COUNT(*) as count FROM enrollments WHERE user_id = ?', userId),
    db.get('SELECT COUNT(*) as count FROM enrollments WHERE user_id = ? AND completed_at IS NOT NULL', userId),
    db.get('SELECT COUNT(*) as count FROM certificates WHERE user_id = ?', userId),
  ]);

  const recentCourses = await db.all(`SELECT e.enrolled_at, e.completed_at, c.title, c.category, c.thumbnail, c.id as course_id
    FROM enrollments e JOIN courses c ON e.course_id = c.id WHERE e.user_id = ? ORDER BY e.enrolled_at DESC LIMIT 3`, userId);

  const recentCerts = await db.all(`SELECT cert.certificate_number, cert.issued_at, c.title as course_title, c.category
    FROM certificates cert JOIN courses c ON cert.course_id = c.id WHERE cert.user_id = ? ORDER BY cert.issued_at DESC LIMIT 3`, userId);

  res.json({
    success: true,
    stats: { enrolledCourses: enrolledCourses.count, completedCourses: completedCourses.count, certificates: certificates.count },
    recentCourses,
    recentCertificates: recentCerts,
  });
});

router.get('/employer', authenticate, authorize('employer', 'admin'), async (req, res) => {
  res.json({ success: true, stats: {} });
});

router.get('/admin', authenticate, authorize('admin'), async (req, res) => {
  const db = await getDb();
  const [totalUsers, youthUsers, employers, totalCourses, totalEnrollments, totalCerts] = await Promise.all([
    db.get('SELECT COUNT(*) as count FROM users'),
    db.get("SELECT COUNT(*) as count FROM users WHERE role = 'youth'"),
    db.get("SELECT COUNT(*) as count FROM users WHERE role = 'employer'"),
    db.get('SELECT COUNT(*) as count FROM courses'),
    db.get('SELECT COUNT(*) as count FROM enrollments'),
    db.get('SELECT COUNT(*) as count FROM certificates'),
  ]);

  const categoryStats = await db.all('SELECT category, COUNT(*) as count FROM enrollments e JOIN courses c ON e.course_id = c.id GROUP BY category');

  res.json({
    success: true,
    stats: { totalUsers: totalUsers.count, youthUsers: youthUsers.count, employers: employers.count, totalCourses: totalCourses.count, totalEnrollments: totalEnrollments.count, totalCertificates: totalCerts.count },
    categoryStats
  });
});

module.exports = router;
