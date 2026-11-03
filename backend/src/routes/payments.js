const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const nodemailer = require('nodemailer');
const { getDb } = require('../database');
const { authenticate, authorize } = require('../middleware/auth');

// ── Email transporter (Gmail SMTP) ────────────────────────────────────────
function getTransporter() {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });
}

async function sendPaymentNotificationEmail({ studentName, studentEmail, courseTitle, proofText, certNumber }) {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD ||
      process.env.GMAIL_APP_PASSWORD === 'your_gmail_app_password_here') {
    console.log('⚠️  Email not configured — skipping email notification.');
    return;
  }
  const transporter = getTransporter();
  const frontend = process.env.FRONTEND_URL || 'http://localhost:3000';
  await transporter.sendMail({
    from: `"YouthSkills Platform" <${process.env.GMAIL_USER}>`,
    to: process.env.ADMIN_EMAIL,
    subject: `💰 Payment Submitted — ${studentName} (${courseTitle})`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;">
        <div style="background:#2563eb;padding:24px;text-align:center;">
          <h2 style="color:#fff;margin:0;">YouthSkills Program</h2>
          <p style="color:#bfdbfe;margin:4px 0 0;">Certificate Payment Notification</p>
        </div>
        <div style="padding:24px;">
          <h3 style="color:#1e293b;">💰 New Payment Proof Submitted</h3>
          <table style="width:100%;border-collapse:collapse;margin:16px 0;">
            <tr><td style="padding:8px;color:#64748b;font-weight:bold;width:40%;">Student Name</td><td style="padding:8px;color:#1e293b;">${studentName}</td></tr>
            <tr style="background:#f8fafc;"><td style="padding:8px;color:#64748b;font-weight:bold;">Student Email</td><td style="padding:8px;color:#1e293b;">${studentEmail}</td></tr>
            <tr><td style="padding:8px;color:#64748b;font-weight:bold;">Course</td><td style="padding:8px;color:#1e293b;">${courseTitle}</td></tr>
            <tr style="background:#f8fafc;"><td style="padding:8px;color:#64748b;font-weight:bold;">Certificate No.</td><td style="padding:8px;color:#1e293b;font-family:monospace;">${certNumber}</td></tr>
            <tr><td style="padding:8px;color:#64748b;font-weight:bold;">Amount</td><td style="padding:8px;color:#1e293b;font-weight:bold;">2,000 ZMW</td></tr>
            <tr style="background:#f8fafc;"><td style="padding:8px;color:#64748b;font-weight:bold;">Payment Ref / Proof</td><td style="padding:8px;color:#1e293b;">${proofText}</td></tr>
          </table>
          <div style="background:#fef9c3;border:1px solid #fde047;border-radius:8px;padding:12px;margin:16px 0;">
            <strong>Action required:</strong> Log in to the admin dashboard to approve or reject this payment.
          </div>
          <a href="${frontend}/admin/login" style="display:inline-block;background:#2563eb;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;">Open Admin Dashboard</a>
        </div>
        <div style="background:#f8fafc;padding:12px 24px;text-align:center;color:#94a3b8;font-size:12px;">
          YouthSkills Program &mdash; Lusaka, Zambia &mdash; Payment number: ${process.env.PAYMENT_NUMBER || '0970342178'}
        </div>
      </div>
    `,
  });
  console.log(`📧 Payment notification email sent to ${process.env.ADMIN_EMAIL}`);
}

// ── POST /api/payments/certificate/:certId/submit ─────────────────────────
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
    await db.run('UPDATE certificate_payments SET proof_text = ?, status = ?, submitted_at = CURRENT_TIMESTAMP WHERE id = ?',
      [proof_text, 'pending', existing.id]);
    return res.json({ success: true, message: 'Payment proof updated. Awaiting admin approval.' });
  }

  await db.run('INSERT INTO certificate_payments (id, user_id, certificate_id, proof_text) VALUES (?, ?, ?, ?)',
    [uuidv4(), req.user.id, req.params.certId, proof_text]);

  // In-app notification for admin
  const admin = await db.get("SELECT id FROM users WHERE role = 'admin' LIMIT 1");
  const course = await db.get('SELECT title FROM courses WHERE id = ?', cert.course_id);
  if (admin) {
    await db.run('INSERT INTO notifications (id, user_id, title, message, type) VALUES (?, ?, ?, ?, ?)',
      [uuidv4(), admin.id, '💰 Certificate Payment Submitted',
      `${req.user.name} has submitted payment proof for "${course?.title}" certificate. Please review and approve.`, 'info']);
  }

  // Email notification to admin
  try {
    await sendPaymentNotificationEmail({
      studentName: req.user.name,
      studentEmail: req.user.email,
      courseTitle: course?.title || 'Unknown Course',
      proofText: proof_text,
      certNumber: cert.certificate_number,
    });
  } catch (emailErr) {
    console.error('Email notification failed:', emailErr.message);
    // Don't fail the request if email fails
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
