const express = require('express');
const Problem = require('../models/Problem');
const { auth, optionalAuth } = require('../middleware/auth');
const c = require('../services/course');

const router = express.Router();

/** GET /api/course – the whole syllabus. Public; adds progress when logged in. */
router.get('/course', optionalAuth, async (req, res, next) => {
  try {
    const sections = await c.loadCourse();
    const flat = c.flatten(sections);
    const status = req.user ? c.statusMap(req.user, flat) : null;
    const next = status ? flat.find((f) => status.get(f.item.id) === 'available') : null;
    const doneCount = status ? flat.filter((f) => status.get(f.item.id) === 'completed').length : 0;

    res.json({
      stats: c.stats(sections),
      progress: status ? { done: doneCount, total: flat.length } : null,
      nextId: next ? next.item.id : null,
      sections: sections.map((s) => ({
        order: s.order, slug: s.slug, title: s.title, icon: s.icon, description: s.description,
        complete: req.user ? c.sectionComplete(req.user, s) : false,
        chapters: s.chapters.map((ch) => ({
          id: ch.id, title: ch.title, icon: ch.icon,
          items: ch.items.map((i) => ({
            id: i.id, type: i.type, title: i.title, difficulty: i.difficulty || null, xp: i.xp,
            questions: i.type === 'lesson' ? i.questions.length : undefined,
            status: status ? status.get(i.id) : null
          }))
        }))
      }))
    });
  } catch (e) { next(e); }
});

/** GET /api/lessons/:id – one item (lesson or challenge) + outline of its section + prev/next */
router.get('/lessons/:id', auth, async (req, res, next) => {
  try {
    const sections = await c.loadCourse();
    const flat = c.flatten(sections);
    const entry = flat.find((f) => f.item.id === req.params.id);
    if (!entry) return res.status(404).json({ error: 'Lesson not found.' });

    const status = c.statusMap(req.user, flat);
    if (status.get(entry.item.id) === 'locked') return res.status(403).json({ error: 'This lesson is locked. Finish the previous lessons first!' });

    const sectionFlat = flat.filter((f) => f.section.order === entry.section.order);
    const posInSection = sectionFlat.findIndex((f) => f.item.id === entry.item.id);
    const nav = (f) => f && { id: f.item.id, title: f.item.title, status: status.get(f.item.id) };

    res.json({
      item: c.sanitize(entry.item, req.user),
      section: { order: entry.section.order, title: entry.section.title },
      chapter: { id: entry.chapter.id, title: entry.chapter.title },
      position: { n: posInSection + 1, total: sectionFlat.length },
      prev: nav(flat[entry.index - 1]),
      next: nav(flat[entry.index + 1]),
      outline: entry.section.chapters.map((ch) => ({
        id: ch.id, title: ch.title, icon: ch.icon,
        items: ch.items.map((i) => ({ id: i.id, type: i.type, title: i.title, status: status.get(i.id) }))
      }))
    });
  } catch (e) { next(e); }
});

/** GET /api/problems – practice track grouped by difficulty */
router.get('/problems', auth, async (req, res, next) => {
  try {
    const [list, sections] = await Promise.all([Problem.find().sort('order').lean(), c.loadCourse()]);
    const chapters = sections.flatMap((s) => s.chapters);                       // course order = learning order
    res.json({
      problems: list.map((p) => {
        const rank = Math.max(0, chapters.findIndex((ch) => ch.id === p.needs));
        const ch = chapters[rank];
        return {
          id: p.pid, title: p.title, difficulty: p.difficulty, xp: p.xp,
          completed: !!req.user.getProgress(p.pid)?.completed,
          needs: ch ? { id: ch.id, title: ch.title, rank, ready: c.chapterComplete(req.user, ch) } : null
        };
      })
    });
  } catch (e) { next(e); }
});

/** GET /api/problems/:id */
router.get('/problems/:id', auth, async (req, res, next) => {
  try {
    const p = await Problem.findOne({ pid: req.params.id }).lean();
    if (!p) return res.status(404).json({ error: 'Problem not found.' });
    const all = await Problem.find().sort('order').select('pid title').lean();
    const i = all.findIndex((x) => x.pid === p.pid);
    const prog = req.user.getProgress(p.pid);
    res.json({
      item: {
        id: p.pid, type: 'challenge', title: p.title, difficulty: p.difficulty, xp: p.xp, brief: p.brief, hint: p.hint,
        starter: p.starter, sample: { stdin: p.tests[0].stdin, stdout: p.tests[0].stdout }, testCount: p.tests.length,
        completed: !!prog?.completed, xpEarned: prog?.xpEarned || 0
      },
      prev: all[i - 1] ? { id: all[i - 1].pid, title: all[i - 1].title } : null,
      next: all[i + 1] ? { id: all[i + 1].pid, title: all[i + 1].title } : null
    });
  } catch (e) { next(e); }
});

module.exports = router;
