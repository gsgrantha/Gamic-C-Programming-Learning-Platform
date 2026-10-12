/**
 * Gamification layer: points, levels, streaks and badges.
 */
const { chapterComplete, sectionComplete } = require('./course');

const XP_PER_LEVEL = 100;

const catalog = require('./catalog');

/** Core badges come from the "badges" collection (chapter / section badges are built from "sections") */
const baseBadges = () => catalog.get().badges.map((b) => ({ id: b.badgeId, name: b.name, icon: b.icon, desc: b.desc }));

const levelFor = (xp) => Math.floor(xp / XP_PER_LEVEL) + 1;
const today = () => new Date().toISOString().slice(0, 10);
const yesterday = () => new Date(Date.now() - 86400000).toISOString().slice(0, 10);

function badgeDefs(sections) {
  const out = baseBadges();
  sections.forEach((s) => {
    s.chapters.forEach((c) => out.push({ id: `ch-${c.id}`, name: c.title, icon: c.icon || '🏅', desc: `Complete the "${c.title}" chapter` }));
    out.push({ id: `cert-${s.order}`, name: `${s.title} Certified`, icon: '🎓', desc: `Complete the whole "${s.title}" section` });
  });
  return out;
}

const daysBetween = (a, b) => Math.round((Date.parse(b) - Date.parse(a)) / 86400000);

/**
 * Update the daily streak (call whenever the user earns something).
 * Missed days are covered by Streak Freezes from the store, if the user owns enough.
 */
function touchStreak(user) {
  const t = today();
  if (user.lastActiveDate === t) return { freezeUsed: 0 };
  let freezeUsed = 0;
  if (!user.lastActiveDate) user.streak = 1;
  else {
    const gap = daysBetween(user.lastActiveDate, t);
    if (gap <= 1) user.streak += 1;
    else {
      const missed = gap - 1;
      if (missed <= user.streakFreezes) { user.streakFreezes -= missed; freezeUsed = missed; user.streak += 1; }
      else user.streak = 1;
    }
  }
  user.bestStreak = Math.max(user.bestStreak, user.streak);
  user.lastActiveDate = t;
  return { freezeUsed };
}

/** Leagues come from the "leagues" collection, lowest XP first */
const leagues = () => catalog.get().leagues.map((l) => ({ name: l.name, icon: l.icon, min: l.min }));
function leagueFor(xp) {
  const LEAGUES = leagues();
  if (!LEAGUES.length) return { name: 'Bronze', icon: '🥉', min: 0, index: 0, nextAt: null, nextName: null };
  let i = 0;
  LEAGUES.forEach((l, k) => { if (xp >= l.min) i = k; });
  const next = LEAGUES[i + 1];
  return { ...LEAGUES[i], index: i, nextAt: next ? next.min : null, nextName: next ? next.name : null };
}

/** Coins earned for an XP gain */
const coinsFor = (xp) => Math.floor(xp / 5);

/** Returns ids of newly earned badges (and pushes them onto the user). */
function evaluateBadges(user, sections, ctx = {}) {
  const have = new Set(user.badges.map((b) => b.id));
  const earned = [];
  const give = (id) => { if (!have.has(id)) { have.add(id); earned.push(id); user.badges.push({ id }); } };

  const typeOf = new Map();
  sections.forEach((s) => s.chapters.forEach((c) => c.items.forEach((i) => typeOf.set(i.id, i))));
  const done = user.progress.filter((p) => p.completed);

  if (done.length >= 1) give('first-steps');
  const perfectLessons = done.filter((p) => { const it = typeOf.get(p.activityId); return it && it.type === 'lesson' && it.questions.length > 0 && p.wrong === 0; });
  if (perfectLessons.length >= 5) give('sharp-mind');
  if (done.filter((p) => typeOf.get(p.activityId)?.type === 'debug').length >= 3) give('bug-squasher');
  if (done.some((p) => typeOf.get(p.activityId)?.type === 'final')) give('boss-slayer');
  if (done.filter((p) => /^q\d+$/.test(p.activityId)).length >= 5) give('problem-solver');
  if (user.streak >= 3) give('streak-3');
  if (user.streak >= 7) give('streak-7');
  if (user.xp >= 500) give('xp-500');
  sections.forEach((s) => {
    s.chapters.forEach((c) => { if (chapterComplete(user, c)) give(`ch-${c.id}`); });
    if (sectionComplete(user, s)) give(`cert-${s.order}`);
  });
  return earned;
}

module.exports = { XP_PER_LEVEL, leagues, levelFor, leagueFor, coinsFor, touchStreak, evaluateBadges, badgeDefs };
