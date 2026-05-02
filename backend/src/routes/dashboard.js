const express = require('express');
const router = express.Router();
const { getDb } = require('../database');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/youth', authenticate, authorize('youth'), async (req, res) => {
  const db = await getDb();
  const userId = req.user.id;

  const [enrolledCourses, completedCourses, certificates, applications, acceptedApps] = await Promise.all([
    db.get('SELECT COUNT(*) as count FROM enrollments WHERE user_id = ?', userId),
    db.get('SELECT COUNT(*) as count FROM enrollments WHERE user_id = ? AND completed_at IS NOT NULL', userId),
    db.get('SELECT COUNT(*) as count FROM certificates WHERE user_id = ?', userId),
    db.get('SELECT COUNT(*) as count FROM applications WHERE user_id = ?', userId),
    db.get("SELECT COUNT(*) as count FROM applications WHERE user_id = ? AND status = 'accepted'", userId),
  ]);

  const recentCourses = await db.all(`SELECT e.enrolled_at, e.completed_at, c.title, c.category, c.thumbnail, c.id as course_id
    FROM enrollments e JOIN courses c ON e.course_id = c.id WHERE e.user_id = ? ORDER BY e.enrolled_at DESC LIMIT 3`, userId);

  const recentCerts = await db.all(`SELECT cert.certificate_number, cert.issued_at, c.title as course_title, c.category
    FROM certificates cert JOIN courses c ON cert.course_id = c.id WHERE cert.user_id = ? ORDER BY cert.issued_at DESC LIMIT 3`, userId);

  const recommendedOpps = await db.all('SELECT id, title, company, type, location, is_remote, required_skills FROM opportunities WHERE is_active = 1 ORDER BY created_at DESC LIMIT 5');

  res.json({
    success: true,
    stats: { enrolledCourses: enrolledCourses.count, completedCourses: completedCourses.count, certificates: certificates.count, applications: applications.count, acceptedApplications: acceptedApps.count },
    recentCourses,
    recentCertificates: recentCerts,
    recommendedOpportunities: recommendedOpps.map(o => ({ ...o, required_skills: JSON.parse(o.required_skills || '[]') }))
  });
});

router.get('/employer', authenticate, authorize('employer', 'admin'), async (req, res) => {
  const db = await getDb();
  const userId = req.user.id;

  const [postedOpps, activeOpps, totalApps, pendingApps] = await Promise.all([
    db.get('SELECT COUNT(*) as count FROM opportunities WHERE employer_id = ?', userId),
    db.get('SELECT COUNT(*) as count FROM opportunities WHERE employer_id = ? AND is_active = 1', userId),
    db.get('SELECT COUNT(*) as count FROM applications a JOIN opportunities o ON a.opportunity_id = o.id WHERE o.employer_id = ?', userId),
    db.get("SELECT COUNT(*) as count FROM applications a JOIN opportunities o ON a.opportunity_id = o.id WHERE o.employer_id = ? AND a.status = 'pending'", userId),
  ]);

  const recentApps = await db.all(`SELECT a.id, a.status, a.applied_at, u.name as applicant_name, u.avatar, o.title as opportunity_title
    FROM applications a JOIN users u ON a.user_id = u.id JOIN opportunities o ON a.opportunity_id = o.id
    WHERE o.employer_id = ? ORDER BY a.applied_at DESC LIMIT 5`, userId);

  res.json({
    success: true,
    stats: { postedOpportunities: postedOpps.count, activeOpportunities: activeOpps.count, totalApplications: totalApps.count, pendingApplications: pendingApps.count },
    recentApplications: recentApps
  });
});

router.get('/admin', authenticate, authorize('admin'), async (req, res) => {
  const db = await getDb();
  const [totalUsers, youthUsers, employers, totalCourses, totalEnrollments, totalCerts, totalOpps, totalApps] = await Promise.all([
    db.get('SELECT COUNT(*) as count FROM users'),
    db.get("SELECT COUNT(*) as count FROM users WHERE role = 'youth'"),
    db.get("SELECT COUNT(*) as count FROM users WHERE role = 'employer'"),
    db.get('SELECT COUNT(*) as count FROM courses'),
    db.get('SELECT COUNT(*) as count FROM enrollments'),
    db.get('SELECT COUNT(*) as count FROM certificates'),
    db.get('SELECT COUNT(*) as count FROM opportunities'),
    db.get('SELECT COUNT(*) as count FROM applications'),
  ]);

  const categoryStats = await db.all('SELECT category, COUNT(*) as count FROM enrollments e JOIN courses c ON e.course_id = c.id GROUP BY category');

  res.json({
    success: true,
    stats: { totalUsers: totalUsers.count, youthUsers: youthUsers.count, employers: employers.count, totalCourses: totalCourses.count, totalEnrollments: totalEnrollments.count, totalCertificates: totalCerts.count, totalOpportunities: totalOpps.count, totalApplications: totalApps.count },
    categoryStats
  });
});

module.exports = router;
