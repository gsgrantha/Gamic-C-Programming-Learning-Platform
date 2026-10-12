/**
 * Missions: daily (3, rotating), weekly (5) and one-time quests. Completing one lets the
 * player claim coins. Progress comes from counters stored on the user (reset each period).
 */
const dayKey = (d = new Date()) => d.toISOString().slice(0, 10);
function weekKey(d = new Date()) {
  const x = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  x.setUTCDate(x.getUTCDate() - ((x.getUTCDay() + 6) % 7)); // back to Monday
  return x.toISOString().slice(0, 10);
}

const catalog = require('./catalog');

const doneCount = (u) => u.progress.filter((p) => p.completed).length;
const problemsDone = (u) => u.progress.filter((p) => p.completed && /^q\d+$/.test(p.activityId)).length;

// How each "quest" metric is measured for a player (the missions themselves live in MongoDB, collection "missions")
const QUEST_METRICS = {
  activitiesDone: doneCount,
  level: (u) => Math.floor(u.xp / 100) + 1,
  bestStreak: (u) => u.bestStreak,
  problemsDone,
  badgeCount: (u) => u.badges.length
};
const pool = (scope) => catalog.get().missions.filter((m) => m.scope === scope)
  .map((m) => ({ id: m.missionId, title: m.title, icon: m.icon, metric: m.metric, target: m.target, reward: m.reward }));
const DAILY_POOL = () => pool('daily');
const WEEKLY = () => pool('weekly');
const QUESTS = () => pool('quest');

/** Reset the daily / weekly counters when the period changed */
function ensurePeriods(user) {
  const d = dayKey(), w = weekKey();
  if (!user.daily || user.daily.date !== d) user.daily = { date: d, xp: 0, lessons: 0, challenges: 0, problems: 0, questions: 0 };
  if (!user.weekly || user.weekly.week !== w) user.weekly = { week: w, xp: 0, lessons: 0, challenges: 0, problems: 0, questions: 0, days: [] };
}

/** Add progress to the counters. kind: 'lesson' | 'challenge' | 'problem' */
function record(user, { xp = 0, kind = null, question = false } = {}) {
  ensurePeriods(user);
  const field = { lesson: 'lessons', challenge: 'challenges', problem: 'problems' }[kind];
  for (const b of [user.daily, user.weekly]) {
    b.xp += xp;
    if (field) b[field] += 1;
    if (question) b.questions += 1;
  }
  const d = dayKey();
  if (!user.weekly.days.includes(d)) user.weekly.days.push(d);
  if (!user.activityDays.includes(d)) {
    user.activityDays.push(d);
    if (user.activityDays.length > 120) user.activityDays.shift();
  }
}

function dailyFor(key = dayKey()) {
  const list = DAILY_POOL();
  if (!list.length) return [];
  const n = Math.floor(Date.parse(key) / 86400000);
  return [0, 2, 4].map((k) => list[(n + k) % list.length]);
}

const valueOf = (user, m, scope) => {
  if (scope === 'quest') return (QUEST_METRICS[m.metric] || (() => 0))(user);
  const b = scope === 'daily' ? user.daily : user.weekly;
  return m.metric === 'days' ? b.days.length : b[m.metric] || 0;
};
const claimKey = (m, scope) => `${m.id}:${scope === 'daily' ? dayKey() : scope === 'weekly' ? weekKey() : 'once'}`;

function view(user, list, scope) {
  return list.map((m) => {
    const value = valueOf(user, m, scope);
    return { id: m.id, title: m.title, icon: m.icon, target: m.target, progress: Math.min(value, m.target), reward: m.reward,
      done: value >= m.target, claimed: user.claimed.includes(claimKey(m, scope)) };
  });
}

function status(user) {
  ensurePeriods(user);
  const now = new Date();
  const tomorrow = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1);
  const nextWeek = Date.parse(weekKey()) + 7 * 86400000;
  return {
    daily: view(user, dailyFor(), 'daily'),
    weekly: view(user, WEEKLY(), 'weekly'),
    quests: view(user, QUESTS(), 'quest'),
    dailyResetsInMs: tomorrow - now.getTime(),
    weeklyResetsInMs: nextWeek - now.getTime()
  };
}

/** Returns { reward } or { error } */
function claim(user, id) {
  ensurePeriods(user);
  const found = [[dailyFor(), 'daily'], [WEEKLY(), 'weekly'], [QUESTS(), 'quest']]
    .map(([list, scope]) => ({ m: list.find((x) => x.id === id), scope })).find((x) => x.m);
  if (!found) return { error: 'Unknown mission.' };
  const { m, scope } = found;
  const key = claimKey(m, scope);
  if (user.claimed.includes(key)) return { error: 'Already claimed.' };
  if (valueOf(user, m, scope) < m.target) return { error: 'Mission not finished yet.' };
  const keep = new Set([dayKey(), weekKey(), 'once']);
  user.claimed = user.claimed.filter((k) => keep.has(k.split(':')[1]));   // drop old periods
  user.claimed.push(key);
  user.coins += m.reward;
  return { reward: m.reward };
}

module.exports = { dayKey, weekKey, ensurePeriods, record, status, claim };
