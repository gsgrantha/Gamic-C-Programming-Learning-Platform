const jwt = require('jsonwebtoken');
const User = require('../models/User');

async function loadUser(req) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return null;
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    return await User.findById(payload.id);
  } catch (_) { return null; }
}

/** Requires a valid token */
async function auth(req, res, next) {
  const user = await loadUser(req);
  if (!user) return res.status(401).json({ error: 'Please log in to continue.' });
  req.user = user;
  next();
}

/** Attaches req.user if a valid token is present, but never blocks */
async function optionalAuth(req, res, next) {
  req.user = await loadUser(req);
  next();
}

module.exports = { auth, optionalAuth };
