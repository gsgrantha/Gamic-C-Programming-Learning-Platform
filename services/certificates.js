/**
 * Certificates: a unique, verifiable ID is issued once per finished section,
 * and one more for the whole course (all sections finished).
 */
const crypto = require('crypto');
const Certificate = require('../models/Certificate');
const { sectionComplete } = require('./course');

const ALPHABET = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'; // 32 chars, no 0/O/1/I confusion
const ID_RE = /^GAMIC-[A-Z0-9]{2,3}-[A-Z0-9]{4}-[A-Z0-9]{4}$/;
const COURSE_TITLE = 'C Programming — Complete Course';

function randomPart(n) {
  const bytes = crypto.randomBytes(n);
  let s = '';
  for (let i = 0; i < n; i++) s += ALPHABET[bytes[i] % ALPHABET.length]; // 256 % 32 === 0 → no bias
  return s;
}
const makeId = (kind, order) => `GAMIC-${kind === 'course' ? 'CRS' : 'S' + order}-${randomPart(4)}-${randomPart(4)}`;
const keyOf = (kind, order) => `${kind}:${order}`;

async function issue(user, { kind, sectionOrder, title, icon, issuedAt }) {
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      return await Certificate.create({ certId: makeId(kind, sectionOrder), user: user._id, username: user.username, kind, sectionOrder, title, icon, issuedAt });
    } catch (e) {
      if (e.code !== 11000) throw e;
      const existing = await Certificate.findOne({ user: user._id, kind, sectionOrder }); // issued by a parallel request
      if (existing) return existing;
      // otherwise the random id collided → try again
    }
  }
  throw new Error('Could not generate a unique certificate ID.');
}

/**
 * Issues any certificate the user has earned but does not have yet (also covers users who
 * finished sections before this feature existed). Returns Map "kind:order" → certificate.
 */
async function ensure(user, sections) {
  const map = new Map((await Certificate.find({ user: user._id })).map((c) => [keyOf(c.kind, c.sectionOrder), c]));
  const doneAt = new Map(user.progress.filter((p) => p.completed).map((p) => [p.activityId, p.completedAt ? +p.completedAt : Date.now()]));
  let allDone = sections.length > 0, last = 0;

  for (const s of sections) {
    if (!sectionComplete(user, s)) { allDone = false; continue; }
    const when = Math.max(...s.chapters.flatMap((ch) => ch.items.map((i) => doneAt.get(i.id) || 0)));
    last = Math.max(last, when);
    const k = keyOf('section', s.order);
    if (!map.has(k)) map.set(k, await issue(user, { kind: 'section', sectionOrder: s.order, title: s.title, icon: s.icon, issuedAt: new Date(when || Date.now()) }));
  }
  const ck = keyOf('course', 0);
  if (allDone && !map.has(ck)) map.set(ck, await issue(user, { kind: 'course', sectionOrder: 0, title: COURSE_TITLE, icon: '🏆', issuedAt: new Date(last || Date.now()) }));
  return map;
}

const toJSON = (c) => ({ certId: c.certId, kind: c.kind, order: c.sectionOrder, title: c.title, icon: c.icon, name: c.username, issuedAt: c.issuedAt });

module.exports = { ensure, toJSON, ID_RE, keyOf, COURSE_TITLE };
