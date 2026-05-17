const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { getDb } = require('../database');
const { authenticate, authorize } = require('../middleware/auth');

// POST /api/payments/certificate/:certId/submit — youth submits payment proof
router.post('/certificate/:certId/submit', authenticate, authorize('youth'), async (req, res) => {
  const { proof_text } = req.body;
  if (!proof_text || proof_text.trim().length < 5) {
    return res.status(400).json({ success: false, message: 'Please provide your payment reference or proof.' });
  }

  const db = await getDb();
  const cert = await db.get('SELECT * FROM certificates WHERE id = ? AND user_id = ?', [req.params.certId, req.user.id]);
  if (!cert) return res.status(404).json({ success: false, message: 'Certificate not found.' });

  const existing = await db.get('SELECT * FROM certificate_payments WHERE certificate_id = ? AND user_id = ?', [req.params.certId, req.user.id]);

  if (existing) {
    if (existing.status === 'approved') {
      return res.status(400).json({ success: false, message: 'Payment already approved. You can download your certificate.' });
    }
    // Update existing pending submission
    await db.run('UPDATE certificate_payments SET proof_text = ?, status = ?, submitted_at = CURRENT_TIMESTAMP WHERE id = ?',
      [proof_text, 'pending', existing.id]);
    return res.json({ success: true, message: 'Payment proof updated. Awaiting admin approval.' });
  }

  await db.run('INSERT INTO certificate_payments (id, user_id, certificate_id, proof_text) VALUES (?, ?, ?, ?)',
    [uuidv4(), req.user.id, req.params.certId, proof_text]);

  // Notify admin
  const admin = await db.get("SELECT id FROM users WHERE role = 'admin' LIMIT 1");
  if (admin) {
    const course = await db.get('SELECT title FROM courses WHERE id = ?', cert.course_id);
    await db.run('INSERT INTO notifications (id, user_id, title, message, type) VALUES (?, ?, ?, ?, ?)',
      [uuidv4(), admin.id, '💰 Certificate Payment Submitted',
      `${req.user.name} has submitted payment proof for "${course?.title}" certificate. Please review and approve.`, 'info']);
  }

  res.json({ success: true, message: 'Payment proof submitted successfully. Awaiting admin approval.' });
});

// GET /api/payments/certificate/:certId/status — check payment status
router.get('/certificate/:certId/status', authenticate, async (req, res) => {
  const db = await getDb();
  const payment = await db.get('SELECT * FROM certificate_payments WHERE certificate_id = ? AND user_id = ?',
    [req.params.certId, req.user.id]);
  res.json({ success: true, payment: payment || null });
});

// GET /api/payments/pending — admin views all pending payments
router.get('/pending', authenticate, authorize('admin'), async (req, res) => {
  const db = await getDb();
  const payments = await db.all(`
    SELECT cp.*, u.name as user_name, u.email as user_email,
           c.certificate_number, co.title as course_title
    FROM certificate_payments cp
    JOIN users u ON cp.user_id = u.id
    JOIN certificates c ON cp.certificate_id = c.id
    JOIN courses co ON c.course_id = co.id
    WHERE cp.status = 'pending'
    ORDER BY cp.submitted_at DESC
  `);
  res.json({ success: true, payments });
});

// GET /api/payments/all — admin views all payments
router.get('/all', authenticate, authorize('admin'), async (req, res) => {
  const db = await getDb();
  const payments = await db.all(`
    SELECT cp.*, u.name as user_name, u.email as user_email,
           c.certificate_number, co.title as course_title
    FROM certificate_payments cp
    JOIN users u ON cp.user_id = u.id
    JOIN certificates c ON cp.certificate_id = c.id
    JOIN courses co ON c.course_id = co.id
    ORDER BY cp.submitted_at DESC
  `);
  res.json({ success: true, payments });
});

// PUT /api/payments/:paymentId/approve — admin approves payment
router.put('/:paymentId/approve', authenticate, authorize('admin'), async (req, res) => {
  const db = await getDb();
  const payment = await db.get('SELECT * FROM certificate_payments WHERE id = ?', req.params.paymentId);
  if (!payment) return res.status(404).json({ success: false, message: 'Payment not found.' });

  await db.run('UPDATE certificate_payments SET status = ?, approved_at = CURRENT_TIMESTAMP, approved_by = ? WHERE id = ?',
    ['approved', req.user.id, req.params.paymentId]);

  const cert = await db.get('SELECT c.*, co.title as course_title FROM certificates c JOIN courses co ON c.course_id = co.id WHERE c.id = ?', payment.certificate_id);

  await db.run('INSERT INTO notifications (id, user_id, title, message, type) VALUES (?, ?, ?, ?, ?)',
    [uuidv4(), payment.user_id, '🎓 Certificate Unlocked!',
    `Your payment of 2000 ZMW has been approved! You can now download your "${cert?.course_title}" certificate PDF.`, 'achievement']);

  res.json({ success: true, message: 'Payment approved. Certificate unlocked for the user.' });
});

// PUT /api/payments/:paymentId/reject — admin rejects payment
router.put('/:paymentId/reject', authenticate, authorize('admin'), async (req, res) => {
  const { reason } = req.body;
  const db = await getDb();
  const payment = await db.get('SELECT * FROM certificate_payments WHERE id = ?', req.params.paymentId);
  if (!payment) return res.status(404).json({ success: false, message: 'Payment not found.' });

  await db.run('UPDATE certificate_payments SET status = ? WHERE id = ?', ['rejected', req.params.paymentId]);

  await db.run('INSERT INTO notifications (id, user_id, title, message, type) VALUES (?, ?, ?, ?, ?)',
    [uuidv4(), payment.user_id, '❌ Payment Not Verified',
    `Your payment proof could not be verified. ${reason ? 'Reason: ' + reason : 'Please resubmit with a valid reference number.'}`, 'warning']);

  res.json({ success: true, message: 'Payment rejected.' });
});

module.exports = router;
