const express = require('express');
const { auth } = require('../middleware/auth');
const store = require('../services/store');

const router = express.Router();

router.get('/', auth, (req, res) => res.json({ coins: req.user.coins, boostUntil: req.user.boostUntil, items: store.catalog(req.user) }));

router.post('/buy', auth, async (req, res, next) => {
  try {
    const r = store.buy(req.user, String((req.body || {}).id || ''));
    if (r.error) return res.status(400).json({ error: r.error });
    await req.user.save();
    res.json({ ok: true, name: r.item.name, coins: req.user.coins, user: req.user.toPublic(), items: store.catalog(req.user) });
  } catch (e) { next(e); }
});

router.post('/equip', auth, async (req, res, next) => {
  try {
    const r = store.equip(req.user, String((req.body || {}).id || ''));
    if (r.error) return res.status(400).json({ error: r.error });
    await req.user.save();
    res.json({ ok: true, user: req.user.toPublic(), items: store.catalog(req.user) });
  } catch (e) { next(e); }
});

module.exports = router;
