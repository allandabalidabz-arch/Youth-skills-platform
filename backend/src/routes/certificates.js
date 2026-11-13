const express = require('express');
const router = express.Router();
const { getDb } = require('../database');
const { authenticate } = require('../middleware/auth');

router.get('/my', authenticate, async (req, res) => {
  const db = await getDb();
  const certs = await db.all(`
    SELECT c.*, co.title as course_title, co.category, co.level, co.instructor_name, co.thumbnail
    FROM certificates c
    JOIN courses co ON c.course_id = co.id
    WHERE c.user_id = ?
    ORDER BY c.issued_at DESC
  `, req.user.id);

  // For each certificate, check if the course assignment has been graded
  const certsWithStatus = await Promise.all(certs.map(async (cert) => {
    // Find the assignment for this course
    const assignment = await db.get(
      'SELECT id FROM assignments WHERE course_id = ?', cert.course_id
    );

    let assignmentGraded = false;
    if (assignment) {
      const submission = await db.get(
        "SELECT status FROM assignment_submissions WHERE assignment_id = ? AND user_id = ? AND status = 'graded'",
        [assignment.id, req.user.id]
      );
      assignmentGraded = !!submission;
    } else {
      // No assignment for this course — treat as graded
      assignmentGraded = true;
    }

    return { ...cert, assignmentGraded };
  }));

  res.json({ success: true, certificates: certsWithStatus });
});

router.get('/verify/:certNumber', async (req, res) => {
  const db = await getDb();
  const cert = await db.get(`
    SELECT c.*, u.name as holder_name, co.title as course_title, co.category, co.level, co.instructor_name
    FROM certificates c
    JOIN users u ON c.user_id = u.id
    JOIN courses co ON c.course_id = co.id
    WHERE c.certificate_number = ?
  `, req.params.certNumber);

  if (!cert) return res.status(404).json({ success: false, message: 'Certificate not found.' });

  res.json({ success: true, valid: true, certificate: {
    certificate_number: cert.certificate_number,
    holder_name: cert.holder_name,
    course_title: cert.course_title,
    category: cert.category,
    level: cert.level,
    instructor_name: cert.instructor_name,
    issued_at: cert.issued_at
  }});
});

module.exports = router;
