/** Shared helpers for writing curriculum content (see curriculum.js). */
const R = String.raw;

const q = (question, options, answer, explanation = '') => ({ question, options, answer, explanation });
const T = (stdin, stdout) => ({ stdin, stdout });
const XP = { challenge: 25, debug: 20, recap: 30, final: 50, project: 60 };

function makeStarter(sol) {
  const out = []; let skip = false;
  for (const line of sol.split('\n')) {
    const m = line.match(/^(\s*)\/\/>>\s*(.*)$/);
    if (m) { skip = true; out.push(m[1] + '// TODO: write your code here'); if (m[2]) out.push(m[1] + m[2]); continue; }
    if (/^\s*\/\/<<\s*$/.test(line)) { skip = false; continue; }
    if (!skip) out.push(line);
  }
  return out.join('\n');
}
const clean = (sol) => sol.split('\n').filter((l) => !/^\s*\/\/(>>|<<)/.test(l)).join('\n');

const L = (id, title, body, code, output, questions) => ({ id, type: 'lesson', title, xp: 10, body, example: { code, output }, questions });
const C = (id, title, type, difficulty, brief, hint, solution, tests, broken) => ({
  id, type, title, difficulty, xp: XP[type], brief, hint,
  starter: broken || makeStarter(solution), solution: clean(solution), tests
});
const P = (id, order, difficulty, title, brief, hint, solution, tests, xp) => ({
  pid: id, order, difficulty, title, brief, hint, xp, starter: makeStarter(solution), solution: clean(solution), tests
});


module.exports = { R, q, T, L, C, P, XP, makeStarter, clean };
