const express = require('express');
const rateLimit = require('express-rate-limit');
const Certificate = require('../models/Certificate');
const { auth } = require('../middleware/auth');
const certs = require('../services/certificates');
const c = require('../services/course');

const router = express.Router();
const verifyLimiter = rateLimit({ windowMs: 60 * 1000, max: 30, standardHeaders: true, legacyHeaders: false, message: { error: 'Too many checks — try again in a minute.' } });

/** GET /api/certificates – my certificates (issues any that are earned but missing) */
router.get('/', auth, async (req, res, next) => {
  try {
    const map = await certs.ensure(req.user, await c.loadCourse());
    res.json({ certificates: [...map.values()].map(certs.toJSON) });
  } catch (e) { next(e); }
});

/** GET /api/certificates/verify/:id – public check that a certificate ID is genuine */
router.get('/verify/:id', verifyLimiter, async (req, res, next) => {
  try {
    const id = String(req.params.id || '').trim().toUpperCase();
    const cert = certs.ID_RE.test(id) ? await Certificate.findOne({ certId: id }).lean() : null;
    if (!cert) return res.status(404).json({ valid: false, error: 'No certificate found with this ID.' });
    res.json({ valid: true, ...certs.toJSON(cert) });
  } catch (e) { next(e); }
});

module.exports = router;
