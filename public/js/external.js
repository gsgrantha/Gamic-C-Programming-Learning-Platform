// Problems on other platforms (LeetCode, Codeforces, HackerRank, Beecrowd). Links only.
// The list is stored in MongoDB (collection "externalproblems"); a player's ticks are saved on their account.
import { api } from './api.js';

/** → { EXTERNAL: [...], PLATFORMS: { key: { name } }, done: Set(keys) } */
export async function loadExternal() {
  const r = await api.external();
  return { EXTERNAL: r.problems, PLATFORMS: Object.fromEntries(r.platforms.map((p) => [p.key, { name: p.name }])), done: new Set(r.done) };
}
