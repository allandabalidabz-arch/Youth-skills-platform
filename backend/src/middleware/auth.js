const jwt = require('jsonwebtoken');
const { getDb } = require('../database');

const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const db = await getDb();
    const user = await db.get('SELECT id, name, email, role, avatar FROM users WHERE id = ?', decoded.id);
    if (!user) return res.status(401).json({ success: false, message: 'User not found.' });
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token.' });
  }
};

const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ success: false, message: 'Access forbidden.' });
  }
  next();
};

module.exports = { authenticate, authorize };
