const express = require('express');
const { auth } = require('../middleware/auth');
const missions = require('../services/missions');

const router = express.Router();

/** GET /api/missions – daily, weekly and quest progress */
router.get('/', auth, async (req, res, next) => {
  try {
    const s = missions.status(req.user);
    await req.user.save();   // persists a period reset, if any
    res.json({ ...s, coins: req.user.coins });
  } catch (e) { next(e); }
});

/** POST /api/missions/claim { id } – collect the coin reward */
router.post('/claim', auth, async (req, res, next) => {
  try {
    const r = missions.claim(req.user, String((req.body || {}).id || ''));
    if (r.error) return res.status(400).json({ error: r.error });
    await req.user.save();
    res.json({ reward: r.reward, coins: req.user.coins, missions: missions.status(req.user) });
  } catch (e) { next(e); }
});

module.exports = router;
