const express = require('express');
const rateLimit = require('express-rate-limit');
const Problem = require('../models/Problem');
const Submission = require('../models/Submission');
const { auth } = require('../middleware/auth');
const runner = require('../services/runner');
const g = require('../services/gamification');
const c = require('../services/course');
const missions = require('../services/missions');
const certs = require('../services/certificates');

const router = express.Router();
const limiter = rateLimit({ windowMs: 60 * 1000, max: 40, standardHeaders: true, legacyHeaders: false, message: { error: 'Slow down! Too many runs — try again in a minute.' } });
const busy = new Set(); // prevents double-submits from awarding XP twice

/** POST /api/activities/run  – free "Run" button, no scoring */
router.post('/run', auth, limiter, async (req, res, next) => {
  try {
    const { code, stdin } = req.body || {};
    res.json(await runner.runCode(code, stdin || ''));
  } catch (e) { next(e); }
});

/**
 * POST /api/activities/:id/submit
 *   lesson    → { question: index, answer: optionIndex }   (or {} for lessons without questions)
 *   code-ish  → { code }
 */
router.post('/:id/submit', auth, limiter, async (req, res, next) => {
  const uid = String(req.user._id);
  if (busy.has(uid)) return res.status(429).json({ error: 'Previous submission still running…' });
  busy.add(uid);
  try {
    const user = req.user;
    const id = req.params.id;
    const sections = await c.loadCourse();
    const flat = c.flatten(sections);

    let activity, entry;
    if (/^q\d+$/.test(id)) {
      const p = await Problem.findOne({ pid: id }).lean();
      if (!p) return res.status(404).json({ error: 'Problem not found.' });
      activity = { id: p.pid, type: 'problem', xp: p.xp, tests: p.tests };
    } else {
      entry = flat.find((f) => f.item.id === id);
      if (!entry) return res.status(404).json({ error: 'Activity not found.' });
      if (c.statusMap(user, flat).get(id) === 'locked') return res.status(403).json({ error: 'Locked. Finish the previous lessons first.' });
      activity = entry.item;
    }

    missions.ensurePeriods(user);
    let prog = user.getProgress(id);
    if (!prog) { user.progress.push({ activityId: id }); prog = user.getProgress(id); }
    const wasDone = prog.completed;
    prog.attempts += 1;

    const body = req.body || {};
    const out = { correct: false, xpAwarded: 0, coinsAwarded: 0, freezeUsed: 0, boosted: false, newBadges: [], levelUp: false, chapterCompleted: null, sectionCompleted: null };

    if (activity.type === 'lesson') {
      const total = activity.questions.length;
      if (total === 0) out.correct = true;
      else {
        const i = Number(body.question);
        const qn = activity.questions[i];
        if (!qn) return res.status(400).json({ error: 'Unknown question.' });
        out.questionCorrect = Number(body.answer) === qn.answer;
        if (out.questionCorrect) {
          if (!prog.solved.includes(i)) { prog.solved.push(i); missions.record(user, { question: true }); }
          out.explanation = qn.explanation || '';
        } else prog.wrong += 1;
        out.solved = prog.solved;
        out.correct = prog.solved.length >= total;
      }
    } else {
      const verdict = await runner.judge(String(body.code || ''), activity.tests);
      out.correct = verdict.passed;
      out.compileError = verdict.compileError || false;
      out.error = verdict.error || null;
      out.warnings = verdict.warnings || '';
      out.tests = verdict.results.map((r, i) => i === 0
        ? { pass: r.pass, error: r.error, stdin: r.stdin, expected: r.expected, actual: r.actual }
        : { pass: r.pass, error: r.error, hidden: true });
    }

    if (out.correct && !wasDone) {
      const levelBefore = g.levelFor(user.xp);
      prog.completed = true;
      prog.completedAt = new Date();
      const boosted = !!(user.boostUntil && user.boostUntil > new Date());
      const xp = activity.xp * (boosted ? 2 : 1);
      prog.xpEarned = xp;
      user.xp += xp;
      out.xpAwarded = xp;
      out.boosted = boosted;
      out.freezeUsed = g.touchStreak(user).freezeUsed;
      missions.record(user, { xp, kind: activity.type === 'lesson' ? 'lesson' : activity.type === 'problem' ? 'problem' : 'challenge' });

      const before = new Set(user.badges.map((b) => b.id));
      const earned = g.evaluateBadges(user, sections);
      const defs = g.badgeDefs(sections);
      out.newBadges = earned.map((bid) => defs.find((b) => b.id === bid)).filter(Boolean);
      out.levelUp = g.levelFor(user.xp) > levelBefore;
      out.coinsAwarded = g.coinsFor(xp) + (out.levelUp ? 20 : 0);
      user.coins += out.coinsAwarded;
      if (entry) {
        if (!before.has(`ch-${entry.chapter.id}`) && earned.includes(`ch-${entry.chapter.id}`)) out.chapterCompleted = entry.chapter.title;
        if (earned.includes(`cert-${entry.section.order}`)) out.sectionCompleted = { order: entry.section.order, title: entry.section.title };
      }
      if (out.sectionCompleted) {                       // issue the unique-ID certificate(s)
        const map = await certs.ensure(user, sections);
        const sc = map.get(certs.keyOf('section', out.sectionCompleted.order));
        if (sc) out.sectionCompleted.certId = sc.certId;
        const cc = map.get(certs.keyOf('course', 0));
        if (cc) out.courseCompleted = { certId: cc.certId };
      }
    }

    await user.save();
    // audit log: every attempt is stored in the "submissions" collection
    Submission.create({
      user: user._id, username: user.username, activityId: id,
      kind: activity.type === 'lesson' ? 'lesson' : activity.type === 'problem' ? 'problem' : 'challenge',
      correct: !!(activity.type === 'lesson' ? (out.questionCorrect === undefined ? out.correct : out.questionCorrect) : out.correct),
      code: activity.type === 'lesson' ? undefined : String(body.code || '').slice(0, 20000),
      question: activity.type === 'lesson' && body.question !== undefined ? Number(body.question) : undefined,
      answer: activity.type === 'lesson' && body.answer !== undefined ? Number(body.answer) : undefined,
      compileError: !!out.compileError, xpAwarded: out.xpAwarded
    }).catch((e) => console.error('Submission log failed:', e.message));
    out.user = user.toPublic();
    res.json(out);
  } catch (e) { next(e); } finally { busy.delete(uid); }
});

module.exports = router;
