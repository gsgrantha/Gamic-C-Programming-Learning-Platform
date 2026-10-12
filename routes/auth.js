const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Session = require('../models/Session');
const { auth } = require('../middleware/auth');
const { touchStreak } = require('../services/gamification');

const router = express.Router();
const sign = (user) => jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES || '7d' });
const logSession = (user, event, req) => Session.create({
  user: user._id, username: user.username, event, ip: req.ip, userAgent: String(req.headers['user-agent'] || '').slice(0, 300)
}).catch((e) => console.error('Session log failed:', e.message));
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

router.post('/register', async (req, res, next) => {
  try {
    const { username, email, password } = req.body || {};
    if (!username || !/^[a-zA-Z0-9_]{3,20}$/.test(username)) return res.status(400).json({ error: 'Username must be 3-20 letters, numbers or underscores.' });
    if (!email || !emailRe.test(email)) return res.status(400).json({ error: 'Please enter a valid email.' });
    if (!password || password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters.' });

    const exists = await User.findOne({ $or: [{ email: email.toLowerCase() }, { username }] });
    if (exists) return res.status(409).json({ error: exists.email === email.toLowerCase() ? 'Email already registered.' : 'Username already taken.' });

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hash, lastLoginAt: new Date(), loginCount: 1 });
    logSession(user, 'register', req);
    res.status(201).json({ token: sign(user), user: user.toPublic() });
  } catch (e) { next(e); }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: 'Email and password are required.' });
    const user = await User.findOne({ email: String(email).toLowerCase() }).select('+password');
    if (!user || !(await bcrypt.compare(password, user.password))) return res.status(401).json({ error: 'Wrong email or password.' });
    user.lastLoginAt = new Date();
    user.loginCount = (user.loginCount || 0) + 1;
    await user.save();
    logSession(user, 'login', req);
    res.json({ token: sign(user), user: user.toPublic() });
  } catch (e) { next(e); }
});

router.get('/me', auth, (req, res) => res.json({ user: req.user.toPublic() }));

module.exports = router;
