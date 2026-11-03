const express = require('express');
const router = express.Router();
const { getDb } = require('../database');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/youth', authenticate, async (req, res) => {
  if (!['youth', 'admin'].includes(req.user.role)) {
    return res.status(403).json({ success: false, message: 'Access forbidden.' });
  }
  const db = await getDb();
  const userId = req.user.id;

  const [enrolledCourses, completedCourses, certificates] = await Promise.all([
    db.get('SELECT COUNT(*) as count FROM enrollments WHERE user_id = ?', userId),
    db.get('SELECT COUNT(*) as count FROM enrollments WHERE user_id = ? AND completed_at IS NOT NULL', userId),
    db.get('SELECT COUNT(*) as count FROM certificates WHERE user_id = ?', userId),
  ]);

  const recentCourses = await db.all(`SELECT e.enrolled_at, e.completed_at, c.title, c.category, c.thumbnail, c.id as course_id
    FROM enrollments e JOIN courses c ON e.course_id = c.id WHERE e.user_id = ? ORDER BY e.enrolled_at DESC LIMIT 3`, userId);

  // Add progress % for each recent course
  const recentCoursesWithProgress = await Promise.all(recentCourses.map(async (c) => {
    const total = await db.get('SELECT COUNT(*) as count FROM modules WHERE course_id = ?', c.course_id);
    const done = await db.get('SELECT COUNT(*) as count FROM module_progress WHERE user_id = ? AND course_id = ? AND completed = 1', [userId, c.course_id]);
    const progress = total.count > 0 ? Math.round((done.count / total.count) * 100) : 0;
    return { ...c, progress, completedModules: done.count, totalModules: total.count };
  }));

  const recentCerts = await db.all(`SELECT cert.certificate_number, cert.issued_at, c.title as course_title, c.category
    FROM certificates cert JOIN courses c ON cert.course_id = c.id WHERE cert.user_id = ? ORDER BY cert.issued_at DESC LIMIT 3`, userId);

  res.json({
    success: true,
    stats: { enrolledCourses: enrolledCourses.count, completedCourses: completedCourses.count, certificates: certificates.count },
    recentCourses: recentCoursesWithProgress,
    recentCertificates: recentCerts,
  });
});

router.get('/admin', authenticate, authorize('admin'), async (req, res) => {
  const db = await getDb();
  const [totalUsers, youthUsers, totalCourses, totalEnrollments, totalCerts] = await Promise.all([
    db.get('SELECT COUNT(*) as count FROM users'),
    db.get("SELECT COUNT(*) as count FROM users WHERE role = 'youth'"),
    db.get('SELECT COUNT(*) as count FROM courses'),
    db.get('SELECT COUNT(*) as count FROM enrollments'),
    db.get('SELECT COUNT(*) as count FROM certificates'),
  ]);

  const categoryStats = await db.all('SELECT category, COUNT(*) as count FROM enrollments e JOIN courses c ON e.course_id = c.id GROUP BY category');

  // Pending counts for overview badges
  const pendingAssignments = await db.get("SELECT COUNT(*) as count FROM assignment_submissions WHERE status = 'submitted'");
  const pendingPayments = await db.get("SELECT COUNT(*) as count FROM certificate_payments WHERE status = 'pending'");

  // Recent completions — who completed what course
  const recentCompletions = await db.all(`
    SELECT u.name as student_name, u.email as student_email, c.title as course_title,
           cert.certificate_number, cert.issued_at
    FROM certificates cert
    JOIN users u ON cert.user_id = u.id
    JOIN courses c ON cert.course_id = c.id
    ORDER BY cert.issued_at DESC LIMIT 10
  `);

  res.json({
    success: true,
    stats: {
      totalUsers: totalUsers.count, youthUsers: youthUsers.count,
      totalCourses: totalCourses.count, totalEnrollments: totalEnrollments.count,
      totalCertificates: totalCerts.count,
      pendingAssignments: pendingAssignments.count,
      pendingPayments: pendingPayments.count,
    },
    categoryStats,
    recentCompletions,
  });
});

module.exports = router;
