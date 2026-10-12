/**
 * Course helpers: load the journey, flatten it into one linear path,
 * work out lock status and strip secrets before sending items to the browser.
 */
const Section = require('../models/Section');

const CODE_TYPES = ['challenge', 'debug', 'recap', 'final', 'project'];
const isCode = (type) => CODE_TYPES.includes(type);

const loadCourse = () => Section.find().sort('order').lean();

/** One ordered list of every item in the journey */
function flatten(sections) {
  const flat = [];
  sections.forEach((section) => section.chapters.forEach((chapter) => chapter.items.forEach((item) => {
    flat.push({ section, chapter, item, index: flat.length });
  })));
  return flat;
}

const isDone = (user, id) => !!user.getProgress(id)?.completed;

/** id → 'completed' | 'available' | 'locked'  (items unlock one after another) */
function statusMap(user, flat) {
  const map = new Map();
  let open = true;
  for (const { item } of flat) {
    if (isDone(user, item.id)) map.set(item.id, 'completed');
    else if (open) { map.set(item.id, 'available'); open = false; }
    else map.set(item.id, 'locked');
  }
  return map;
}

const chapterComplete = (user, chapter) => chapter.items.every((i) => isDone(user, i.id));
const sectionComplete = (user, section) => section.chapters.every((c) => chapterComplete(user, c));

function stats(sections) {
  const s = { sections: sections.length, chapters: 0, lessons: 0, challenges: 0, questions: 0, projects: 0 };
  sections.forEach((sec) => { s.chapters += sec.chapters.length; sec.chapters.forEach((c) => c.items.forEach((i) => {
    if (i.type === 'lesson') { s.lessons++; s.questions += i.questions.length; } else s.challenges++;
    if (i.type === 'project') s.projects++;
  })); });
  return s;
}

/** Remove answers / solutions / hidden tests */
function sanitize(item, user) {
  const p = user?.getProgress(item.id);
  const base = {
    id: item.id, type: item.type, title: item.title, xp: item.xp, difficulty: item.difficulty || null,
    completed: !!p?.completed, xpEarned: p?.xpEarned || 0
  };
  if (item.type === 'lesson') {
    return { ...base, body: item.body, example: item.example, solved: p?.solved || [],
      questions: item.questions.map((q) => ({ question: q.question, options: q.options })) };
  }
  const first = item.tests[0];
  return { ...base, brief: item.brief, hint: item.hint, starter: item.starter,
    sample: { stdin: first.stdin, stdout: first.stdout }, testCount: item.tests.length };
}

module.exports = { loadCourse, flatten, statusMap, isDone, isCode, chapterComplete, sectionComplete, stats, sanitize };
