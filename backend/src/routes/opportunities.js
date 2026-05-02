const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { getDb } = require('../database');
const { authenticate, authorize } = require('../middleware/auth');

// IMPORTANT: specific routes must come before /:id
router.get('/my/applications', authenticate, authorize('youth'), async (req, res) => {
  const db = await getDb();
  const apps = await db.all(`SELECT a.*, o.title, o.company, o.type, o.location
    FROM applications a JOIN opportunities o ON a.opportunity_id = o.id
    WHERE a.user_id = ? ORDER BY a.applied_at DESC`, req.user.id);
  res.json({ success: true, applications: apps });
});

router.get('/employer/posted', authenticate, authorize('employer', 'admin'), async (req, res) => {
  const db = await getDb();
  const opps = await db.all('SELECT * FROM opportunities WHERE employer_id = ? ORDER BY created_at DESC', req.user.id);
  const enriched = await Promise.all(opps.map(async o => {
    const appCount = await db.get('SELECT COUNT(*) as count FROM applications WHERE opportunity_id = ?', o.id);
    return { ...o, required_skills: JSON.parse(o.required_skills || '[]'), required_courses: JSON.parse(o.required_courses || '[]'), application_count: appCount.count };
  }));
  res.json({ success: true, opportunities: enriched });
});

router.get('/', authenticate, async (req, res) => {
  const { type, location, remote, search, page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;
  const db = await getDb();

  let query = `SELECT o.*, u.name as employer_name, u.avatar as employer_avatar
    FROM opportunities o JOIN users u ON o.employer_id = u.id WHERE o.is_active = 1`;
  const params = [];
  if (type) { query += ' AND o.type = ?'; params.push(type); }
  if (location) { query += ' AND o.location LIKE ?'; params.push(`%${location}%`); }
  if (remote === 'true') { query += ' AND o.is_remote = 1'; }
  if (search) { query += ' AND (o.title LIKE ? OR o.description LIKE ? OR o.company LIKE ?)'; params.push(`%${search}%`, `%${search}%`, `%${search}%`); }

  const countRow = await db.get(query.replace('SELECT o.*, u.name as employer_name, u.avatar as employer_avatar', 'SELECT COUNT(*) as total'), params);
  query += ' ORDER BY o.created_at DESC LIMIT ? OFFSET ?';
  const opportunities = await db.all(query, [...params, parseInt(limit), parseInt(offset)]);

  let enriched = opportunities.map(o => ({ ...o, required_skills: JSON.parse(o.required_skills || '[]'), required_courses: JSON.parse(o.required_courses || '[]') }));

  if (req.user.role === 'youth') {
    const userRow = await db.get('SELECT skills FROM users WHERE id = ?', req.user.id);
    const userSkills = JSON.parse(userRow?.skills || '[]');
    const userCerts = await db.all('SELECT course_id FROM certificates WHERE user_id = ?', req.user.id);
    const certIds = userCerts.map(c => c.course_id);

    enriched = await Promise.all(enriched.map(async opp => {
      const skillMatch = opp.required_skills.filter(s => userSkills.map(us => us.toLowerCase()).includes(s.toLowerCase())).length;
      const courseMatch = opp.required_courses.filter(c => certIds.includes(c)).length;
      const totalRequired = opp.required_skills.length + opp.required_courses.length;
      const matchScore = totalRequired > 0 ? Math.round(((skillMatch + courseMatch) / totalRequired) * 100) : 50;
      const applied = await db.get('SELECT status FROM applications WHERE user_id = ? AND opportunity_id = ?', [req.user.id, opp.id]);
      return { ...opp, match_score: matchScore, application_status: applied?.status || null };
    }));
    enriched.sort((a, b) => b.match_score - a.match_score);
  }

  res.json({ success: true, opportunities: enriched, total: countRow.total, page: parseInt(page), limit: parseInt(limit) });
});

router.get('/:id', authenticate, async (req, res) => {
  const db = await getDb();
  const opp = await db.get(`SELECT o.*, u.name as employer_name, u.avatar as employer_avatar, u.bio as employer_bio
    FROM opportunities o JOIN users u ON o.employer_id = u.id WHERE o.id = ?`, req.params.id);
  if (!opp) return res.status(404).json({ success: false, message: 'Opportunity not found.' });

  const application = req.user.role === 'youth'
    ? await db.get('SELECT * FROM applications WHERE user_id = ? AND opportunity_id = ?', [req.user.id, req.params.id])
    : null;

  res.json({ success: true, opportunity: { ...opp, required_skills: JSON.parse(opp.required_skills || '[]'), required_courses: JSON.parse(opp.required_courses || '[]') }, application });
});

router.post('/', authenticate, authorize('employer', 'admin'), async (req, res) => {
  const { title, company, description, type, location, is_remote, salary_range, required_skills, required_courses, deadline } = req.body;
  if (!title || !company || !description || !type || !location) return res.status(400).json({ success: false, message: 'Required fields missing.' });

  const db = await getDb();
  const id = uuidv4();
  await db.run('INSERT INTO opportunities (id, employer_id, title, company, description, type, location, is_remote, salary_range, required_skills, required_courses, deadline) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [id, req.user.id, title, company, description, type, location, is_remote ? 1 : 0, salary_range, JSON.stringify(required_skills || []), JSON.stringify(required_courses || []), deadline]);
  res.status(201).json({ success: true, message: 'Opportunity posted.', opportunityId: id });
});

router.post('/:id/apply', authenticate, authorize('youth'), async (req, res) => {
  const { cover_letter } = req.body;
  const db = await getDb();
  const opp = await db.get('SELECT id, title FROM opportunities WHERE id = ? AND is_active = 1', req.params.id);
  if (!opp) return res.status(404).json({ success: false, message: 'Opportunity not found.' });

  const existing = await db.get('SELECT id FROM applications WHERE user_id = ? AND opportunity_id = ?', [req.user.id, req.params.id]);
  if (existing) return res.status(409).json({ success: false, message: 'Already applied.' });

  const id = uuidv4();
  await db.run('INSERT INTO applications (id, user_id, opportunity_id, cover_letter) VALUES (?, ?, ?, ?)', [id, req.user.id, req.params.id, cover_letter]);
  await db.run('INSERT INTO notifications (id, user_id, title, message, type) VALUES (?, ?, ?, ?, ?)',
    [uuidv4(), req.user.id, 'Application Submitted! ✅', `Your application for "${opp.title}" has been submitted.`, 'info']);
  res.json({ success: true, message: 'Application submitted.', applicationId: id });
});

router.get('/:id/applicants', authenticate, authorize('employer', 'admin'), async (req, res) => {
  const db = await getDb();
  const opp = await db.get('SELECT id, employer_id FROM opportunities WHERE id = ?', req.params.id);
  if (!opp) return res.status(404).json({ success: false, message: 'Opportunity not found.' });
  if (opp.employer_id !== req.user.id && req.user.role !== 'admin') return res.status(403).json({ success: false, message: 'Access denied.' });

  const applicants = await db.all(`SELECT a.id, a.cover_letter, a.status, a.applied_at,
    u.id as user_id, u.name, u.email, u.avatar, u.bio, u.location, u.skills
    FROM applications a JOIN users u ON a.user_id = u.id WHERE a.opportunity_id = ? ORDER BY a.applied_at DESC`, req.params.id);

  const enriched = await Promise.all(applicants.map(async a => {
    const certs = await db.all('SELECT c.certificate_number, co.title as course_title FROM certificates c JOIN courses co ON c.course_id = co.id WHERE c.user_id = ?', a.user_id);
    return { ...a, skills: JSON.parse(a.skills || '[]'), certificates: certs };
  }));

  res.json({ success: true, applicants: enriched });
});

router.put('/:id/application/:appId/status', authenticate, authorize('employer', 'admin'), async (req, res) => {
  const { status } = req.body;
  const validStatuses = ['pending', 'reviewed', 'shortlisted', 'rejected', 'accepted'];
  if (!validStatuses.includes(status)) return res.status(400).json({ success: false, message: 'Invalid status.' });

  const db = await getDb();
  const app = await db.get('SELECT a.*, o.title, o.employer_id FROM applications a JOIN opportunities o ON a.opportunity_id = o.id WHERE a.id = ?', req.params.appId);
  if (!app) return res.status(404).json({ success: false, message: 'Application not found.' });
  if (app.employer_id !== req.user.id && req.user.role !== 'admin') return res.status(403).json({ success: false, message: 'Access denied.' });

  await db.run('UPDATE applications SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [status, req.params.appId]);

  const msgs = { reviewed: 'Your application has been reviewed.', shortlisted: '🎉 You have been shortlisted!', rejected: 'Your application was not selected.', accepted: '🎊 Your application has been accepted!' };
  if (msgs[status]) {
    await db.run('INSERT INTO notifications (id, user_id, title, message, type) VALUES (?, ?, ?, ?, ?)',
      [uuidv4(), app.user_id, `Application Update: ${app.title}`, msgs[status], ['accepted', 'shortlisted'].includes(status) ? 'success' : 'info']);
  }

  res.json({ success: true, message: 'Application status updated.' });
});

module.exports = router;
