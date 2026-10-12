const express = require('express');
const User = require('../models/User');
const { auth, optionalAuth } = require('../middleware/auth');
const { badgeDefs, leagueFor, leagues } = require('../services/gamification');
const missions = require('../services/missions');
const c = require('../services/course');
const certs = require('../services/certificates');

const router = express.Router();

/** GET /api/leaderboard?scope=weekly|all – top 50 + my rank */
router.get('/leaderboard', optionalAuth, async (req, res, next) => {
  try {
    const scope = req.query.scope === 'all' ? 'all' : 'weekly';
    const wk = missions.weekKey();
    const query = scope === 'weekly' ? { 'weekly.week': wk, 'weekly.xp': { $gt: 0 } } : {};
    const sort = scope === 'weekly' ? { 'weekly.xp': -1, createdAt: 1 } : { xp: -1, createdAt: 1 };
    const top = await User.find(query).sort(sort).limit(50).select('username xp streak badges avatar frame weekly').lean();
    const valueOf = (u) => (scope === 'weekly' ? u.weekly.xp : u.xp);

    const rows = top.map((u, i) => {
      const lg = leagueFor(u.xp);
      return { rank: i + 1, username: u.username, avatar: u.avatar, frame: u.frame, value: valueOf(u), xp: u.xp, level: Math.floor(u.xp / 100) + 1,
        streak: u.streak, badges: u.badges.length, league: lg.name, leagueIcon: lg.icon, me: req.user ? String(u._id) === String(req.user._id) : false };
    });

    let me = null;
    if (req.user) {
      const mine = scope === 'weekly' ? (req.user.weekly && req.user.weekly.week === wk ? req.user.weekly.xp : 0) : req.user.xp;
      let rank = null;
      if (scope === 'all' || mine > 0) {
        const f = scope === 'weekly' ? 'weekly.xp' : 'xp';
        const base = scope === 'weekly' ? { 'weekly.week': wk } : {};
        const ahead = await User.countDocuments({ ...base, $or: [{ [f]: { $gt: mine } }, { [f]: mine, createdAt: { $lt: req.user.createdAt } }] });
        rank = ahead + 1;
      }
      me = { rank, value: mine };
    }
    res.json({ scope, leaderboard: rows, me, total: await User.countDocuments(query), weekEndsInMs: Date.parse(wk) + 7 * 86400000 - Date.now(), leagues: leagues() });
  } catch (e) { next(e); }
});

/** GET /api/users/:username – public profile card */
router.get('/users/:username', optionalAuth, async (req, res, next) => {
  try {
    const u = await User.findOne({ username: req.params.username });
    if (!u) return res.status(404).json({ error: 'Player not found.' });
    const sections = await c.loadCourse();
    const defs = badgeDefs(sections);
    const lg = leagueFor(u.xp);
    res.json({
      username: u.username, avatar: u.avatar, frame: u.frame, xp: u.xp, level: Math.floor(u.xp / 100) + 1, streak: u.streak, bestStreak: u.bestStreak,
      league: lg, joined: u.createdAt, completed: u.progress.filter((p) => p.completed).length,
      problemsSolved: u.progress.filter((p) => p.completed && /^q\d+$/.test(p.activityId)).length,
      badges: u.badges.map((b) => defs.find((d) => d.id === b.id)).filter(Boolean),
      certificates: sections.filter((s) => c.sectionComplete(u, s)).map((s) => ({ order: s.order, title: s.title, icon: s.icon }))
    });
  } catch (e) { next(e); }
});

/** GET /api/badges – every badge definition + whether I own it */
router.get('/badges', auth, async (req, res, next) => {
  try {
    const sections = await c.loadCourse();
    const mine = new Map(req.user.badges.map((b) => [b.id, b.earnedAt]));
    res.json({ badges: badgeDefs(sections).map((b) => ({ ...b, earned: mine.has(b.id), earnedAt: mine.get(b.id) || null })) });
  } catch (e) { next(e); }
});

/** GET /api/profile – stats + certificates for the profile page */
router.get('/profile', auth, async (req, res, next) => {
  try {
    const sections = await c.loadCourse();
    const flat = c.flatten(sections);
    const u = req.user;
    const completed = u.progress.filter((p) => p.completed).length;
    const certMap = await certs.ensure(u, sections);
    const certificates = sections.map((s) => {
      const cert = certMap.get(certs.keyOf('section', s.order));
      const ids = s.chapters.flatMap((ch) => ch.items.map((i) => i.id));
      return { order: s.order, title: s.title, icon: s.icon, earned: !!cert, certId: cert ? cert.certId : null, date: cert ? cert.issuedAt : null,
        done: ids.filter((id) => c.isDone(u, id)).length, total: ids.length };
    });
    const cc = certMap.get(certs.keyOf('course', 0));
    const course = { earned: !!cc, certId: cc ? cc.certId : null, date: cc ? cc.issuedAt : null, title: certs.COURSE_TITLE,
      done: sections.filter((s) => certMap.has(certs.keyOf('section', s.order))).length, total: sections.length };
    res.json({
      user: u.toPublic(),
      league: leagueFor(u.xp),
      calendar: u.activityDays.slice(-84),
      weeklyXp: u.weekly && u.weekly.week === missions.weekKey() ? u.weekly.xp : 0,
      stats: {
        completed, totalActivities: flat.length,
        attempts: u.progress.reduce((n, p) => n + p.attempts, 0),
        chaptersDone: sections.reduce((n, s) => n + s.chapters.filter((ch) => c.chapterComplete(u, ch)).length, 0),
        totalChapters: sections.reduce((n, s) => n + s.chapters.length, 0),
        problemsSolved: u.progress.filter((p) => p.completed && /^q\d+$/.test(p.activityId)).length
      },
      certificates, course
    });
  } catch (e) { next(e); }
});

module.exports = router;
