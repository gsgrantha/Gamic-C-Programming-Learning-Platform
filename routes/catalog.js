const express = require('express');
const { auth, optionalAuth } = require('../middleware/auth');
const catalog = require('../services/catalog');
const { W3_HOME, W3_BASE } = require('../seed/catalogs');

const router = express.Router();

/** GET /api/resources – W3Schools learning links (public) */
router.get('/resources', (req, res) => {
  res.json({
    home: W3_HOME, base: W3_BASE,
    sections: catalog.get().resources.map((s) => ({
      order: s.order, title: s.title, icon: s.icon,
      groups: s.groups.map((g) => ({ title: g.title, icon: g.icon, chapters: g.chapters, links: g.links.map((l) => [l.title, l.file]) }))
    }))
  });
});

/** GET /api/external – problems on other platforms + the ones I ticked as done */
router.get('/external', optionalAuth, (req, res) => {
  const list = catalog.get().external;
  const platforms = [];
  list.forEach((e) => { if (!platforms.some((p) => p.key === e.platform)) platforms.push({ key: e.platform, name: e.platformName || e.platform }); });
  res.json({
    platforms,
    problems: list.map((e) => ({ key: e.key, platform: e.platform, title: e.title, difficulty: e.difficulty, href: e.href })),
    done: req.user ? req.user.externalDone : []
  });
});

/** POST /api/external/done { key, done } – tick / untick a problem (saved on my account) */
router.post('/external/done', auth, async (req, res, next) => {
  try {
    const { key, done } = req.body || {};
    if (!catalog.get().external.some((e) => e.key === key)) return res.status(400).json({ error: 'Unknown problem.' });
    const has = req.user.externalDone.includes(key);
    if (done && !has) req.user.externalDone.push(key);
    if (!done && has) req.user.externalDone = req.user.externalDone.filter((k) => k !== key);
    await req.user.save();
    res.json({ ok: true, done: req.user.externalDone });
  } catch (e) { next(e); }
});

module.exports = router;
