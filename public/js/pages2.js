// Platform pages: Home, Sections, Practice, Missions, Leaderboard, Store, Profile
import { api } from './api.js';
import { $, esc, toast, sound, avatarHTML, ring, dur, applyTheme, diffLabel } from './ui.js';
import { loadExternal } from './external.js';
import { worldMap } from './worldmap.js';
import { loadResources } from './resources.js';

let ctx = { app: null, setUser: () => {}, getMe: () => null };
export const init = (c) => { ctx = c; };
const loading = () => { ctx.app.innerHTML = '<div class="center muted">Loading…</div>'; };

const ICON = { lesson: '📖', challenge: '💻', debug: '🐞', recap: '🎯', final: '👹', project: '🚀' };
const STATUS = { completed: '✔', available: '▶', locked: '🔒' };
const pct = (a, b) => (b ? Math.round((a / b) * 100) : 0);

function findItem(course, id) {
  for (const s of course.sections) for (const c of s.chapters) for (const i of c.items) if (i.id === id) return { item: i, section: s, chapter: c };
  return null;
}
const sectionItems = (s) => s.chapters.flatMap((c) => c.items);
const leagueChip = (name, icon) => `<span class="league">${icon} ${esc(name)}</span>`;

/* ───────────── home / dashboard ───────────── */
export async function home() {
  loading();
  const [course, ms, lb, prof] = await Promise.all([api.course(), api.missions(), api.leaderboard('weekly'), api.profile()]);
  const u = prof.user; ctx.setUser(u);
  const next = course.nextId ? findItem(course, course.nextId) : null;
  const p = pct(course.progress.done, course.progress.total);
  const days = Array.from({ length: 7 }, (_, i) => {
    const key = new Date(Date.now() - (6 - i) * 864e5).toISOString().slice(0, 10);
    return { on: prof.calendar.includes(key), label: new Date(key).toLocaleDateString(undefined, { weekday: 'short', timeZone: 'UTC' }).slice(0, 2) };
  });
  const top = lb.leaderboard.slice(0, 3);

  ctx.app.innerHTML = `<section class="page">
    <div class="card welcome">
      ${avatarHTML(u.avatar, u.frame, 'lg')}
      <div class="grow"><h1>Welcome back, ${esc(u.username)} 👋</h1>
        <div class="chips"><span class="chip">Level ${u.level}</span>${leagueChip(prof.league.name, prof.league.icon)}<span class="chip">🔥 ${u.streak}-day streak</span><span class="chip xp">🪙 ${u.coins} coins</span>${u.boostActive ? '<span class="chip ok">⚡ 2× XP active</span>' : ''}</div>
        <div class="bar"><i style="width:${u.xpIntoLevel}%"></i></div><small>${u.xpIntoLevel}/100 XP to level ${u.level + 1}</small></div>
    </div>
    <div class="home-grid">
      <div class="card continue">
        ${ring(p, p + '%', 'xl')}
        <div class="grow"><small>CONTINUE LEARNING</small>
          ${next ? `<h2>${ICON[next.item.type]} ${esc(next.item.title)}</h2><p class="muted small">${esc(next.section.title)} › ${esc(next.chapter.title)}</p>
            <a class="btn btn-lg" href="#/learn/${next.item.id}">${course.progress.done ? '▶ Continue' : '▶ Start learning'}</a>`
            : '<h2>🏆 Journey complete!</h2><p class="muted">You finished the whole course. Download your certificate, then keep sharp in Practice.</p><div class="row"><a class="btn" href="#/certificate/course">🎓 My certificate</a><a class="btn btn-ghost" href="#/practice">Go to practice</a></div>'}
          <p class="muted small" style="margin-top:.6rem">${course.progress.done}/${course.progress.total} items done</p></div>
      </div>
      <div class="card"><div class="row between"><h3>🎯 Daily missions</h3><a href="#/missions" class="small">View all</a></div>
        ${ms.daily.map((m) => `<div class="mini-mission ${m.done ? 'done' : ''}"><span>${m.icon}</span><div class="grow"><b>${esc(m.title)}</b><div class="bar"><i style="width:${pct(m.progress, m.target)}%"></i></div></div><small>${m.claimed ? '✔' : m.progress + '/' + m.target}</small></div>`).join('')}
        <small class="muted">Resets in ${dur(ms.dailyResetsInMs)}</small></div>
      <div class="card"><div class="row between"><h3>🏆 Weekly league</h3><a href="#/leaderboard" class="small">Leaderboard</a></div>
        <p class="big-num">${lb.me && lb.me.rank ? '#' + lb.me.rank : '—'}<small> ${prof.weeklyXp} XP this week</small></p>
        ${top.length ? top.map((r) => `<div class="mini-row ${r.me ? 'me' : ''}"><span>${['🥇', '🥈', '🥉'][r.rank - 1]}</span>${avatarHTML(r.avatar, r.frame, 'sm')}<span class="grow">${esc(r.username)}</span><b>${r.value}</b></div>`).join('') : '<p class="muted small">Nobody has earned XP this week yet — be the first!</p>'}
        <small class="muted">Week ends in ${dur(lb.weekEndsInMs)}</small></div>
      <div class="card"><div class="row between"><h3>🔥 Streak</h3><a href="#/store" class="small">🧊 ${u.streakFreezes} freeze${u.streakFreezes === 1 ? '' : 's'}</a></div>
        <div class="week-strip">${days.map((d) => `<span class="${d.on ? 'on' : ''}"><i>${d.on ? '🔥' : ''}</i>${d.label}</span>`).join('')}</div>
        <p class="muted small">Best streak: <b>${u.bestStreak}</b> days. Practise every day — a Streak Freeze covers a missed one.</p></div>
    </div></section>`;
}

/* ───────────── sections ───────────── */
export async function sections() {
  loading();
  const course = await api.course();
  const p = pct(course.progress.done, course.progress.total);
  const s = course.stats;
  ctx.app.innerHTML = `<section class="page">
    <div class="page-head"><div><small>JOURNEY</small><h1>🇨 C Programming — Sections</h1>
      <p class="muted">${s.sections} sections · ${s.chapters} chapters · ${s.lessons} lessons · ${s.challenges} coding activities · ${s.questions} quiz questions</p></div>
      <div class="card mini">${p}% complete · ${course.progress.done}/${course.progress.total}</div></div>
    <div class="sec-grid">${course.sections.map((sec) => {
      const items = sectionItems(sec), done = items.filter((i) => i.status === 'completed').length;
      const avail = items.find((i) => i.status === 'available');
      const locked = !avail && done === 0;
      const lessons = items.filter((i) => i.type === 'lesson').length;
      const btn = sec.complete ? '↺ Review' : done ? '▶ Continue' : locked ? '🔒 Locked' : '▶ Start';
      const href = avail ? `#/learn/${avail.id}` : sec.complete ? `#/section/${sec.order}` : '';
      return `<article class="card sec-card ${locked ? 'locked' : ''} ${sec.complete ? 'complete' : ''}">
        <div class="row"><span class="sec-icon big">${sec.icon}</span>${ring(pct(done, items.length), pct(done, items.length) + '%')}</div>
        <small>SECTION ${sec.order}</small><h2>${esc(sec.title)} ${sec.complete ? '🎓' : ''}</h2><p class="muted">${esc(sec.description)}</p>
        <p class="small"><b>${sec.chapters.length}</b> chapters · <b>${lessons}</b> lessons · <b>${items.length - lessons}</b> challenges</p>
        <div class="row"><a class="btn ${href ? '' : 'disabled btn-ghost'}" ${href ? `href="${href}"` : ''}>${btn}</a><a class="btn btn-ghost" href="#/section/${sec.order}">Chapters</a></div>
        ${locked ? `<small class="muted">Finish the previous section to unlock.</small>` : ''}</article>`;
    }).join('')}</div></section>`;
}

export async function section(order) {
  loading();
  const course = await api.course();
  const sec = course.sections.find((x) => x.order === +order);
  if (!sec) throw new Error('Section not found.');
  const items = sectionItems(sec), done = items.filter((i) => i.status === 'completed').length;
  const wm = worldMap(sec);
  ctx.app.innerHTML = `<section class="page">
    <a class="back" href="#/sections">← All sections</a>
    <div class="card journey-head"><span class="sec-icon big">${sec.icon}</span><div class="grow"><small>SECTION ${sec.order}</small><h1>${esc(sec.title)}</h1><p class="muted">${esc(sec.description)}</p>
      <div class="bar big"><i style="width:${pct(done, items.length)}%"></i></div><small>${done}/${items.length} done</small></div>
      ${sec.complete ? `<a class="btn" href="#/certificate/${sec.order}">🎓 Certificate</a>` : ''}</div>
    ${wm.html}
    <h2 class="chap-title">All chapters</h2>
    <div class="chap-grid">${sec.chapters.map((c) => {
      const cd = c.items.filter((i) => i.status === 'completed').length;
      const nextHere = c.items.some((i) => i.status === 'available');
      return `<details class="card chap-card" ${nextHere ? 'open' : ''}>
        <summary><span class="sec-icon">${c.icon}</span><div class="grow"><h3>${esc(c.title)}</h3><small>${c.items.filter((i) => i.type === 'lesson').length} lessons · ${c.items.filter((i) => i.type !== 'lesson').length} challenges</small></div>${ring(pct(cd, c.items.length), `${cd}/${c.items.length}`, 'sm')}</summary>
        <ul class="items">${c.items.map((i) => {
          const inner = `<span class="ti">${ICON[i.type]}</span><span class="grow">${esc(i.title)}</span><small>${i.type === 'lesson' ? i.questions + ' Q' : esc(i.difficulty || '')}</small><span class="st">${STATUS[i.status] || ''}</span>`;
          return i.status === 'locked' ? `<li><span class="item locked">${inner}</span></li>` : `<li><a class="item ${i.status}" href="#/learn/${i.id}">${inner}</a></li>`;
        }).join('')}</ul></details>`;
    }).join('')}</div></section>`;
  wm.bind(ctx.app);
}

/* ───────────── practice ───────────── */
const LEVELS = ['Easy', 'Medium', 'Hard', 'Advanced'];
const practiceTabs = (on, extCount = 0) => `<div class="seg tabs"><a class="${on === 'own' ? 'on' : ''}" href="#/practice">Solve on GamiC</a><a class="${on === 'ext' ? 'on' : ''}" href="#/practice/external">Other platforms (${extCount})</a></div>`;

export async function practice() {
  loading();
  const [res, ext] = await Promise.all([api.problems(), api.external().catch(() => ({ problems: [] }))]);
  const problems = [...res.problems].sort((a, b) => LEVELS.indexOf(a.difficulty) - LEVELS.indexOf(b.difficulty) || (a.needs?.rank || 0) - (b.needs?.rank || 0)); // level first, then the chapter a problem builds on
  const st = { q: '', diff: 'All', status: 'All' };
  const ready = (p) => !p.needs || p.needs.ready;
  const solved = problems.filter((p) => p.completed).length;
  const by = (d) => { const l = problems.filter((p) => p.difficulty === d); return { done: l.filter((p) => p.completed).length, total: l.length }; };
  ctx.app.innerHTML = `<section class="page">
    <div class="page-head"><div><h1>🧠 Practice</h1><p class="muted">${problems.length} problems judged by a real compiler, from Easy to Advanced. Solve them in any order.</p></div>
      <div class="card mini">${solved}/${problems.length} solved</div></div>
    ${practiceTabs('own', ext.problems.length)}
    <div class="grid4 diff-summary">${LEVELS.map((d) => { const x = by(d); return `<div class="card"><span class="chip diff-${d}">${diffLabel(d)}</span><p class="big-num">${x.done}<small>/${x.total} solved</small></p><div class="bar"><i style="width:${pct(x.done, x.total)}%"></i></div></div>`; }).join('')}</div>
    <div class="toolbar card">
      <input id="search" placeholder="🔍 Search problems…" aria-label="Search problems">
      <div class="seg" id="diff">${['All', ...LEVELS].map((d) => `<button class="${d === 'All' ? 'on' : ''}" data-v="${d}">${diffLabel(d)}</button>`).join('')}</div>
      <div class="seg" id="stat">${['All', 'Ready now', 'Solved'].map((d) => `<button class="${d === 'All' ? 'on' : ''}" data-v="${d}">${d}</button>`).join('')}</div>
    </div><div id="plist"></div></section>`;
  const draw = () => {
    const list = problems.filter((p) => (st.diff === 'All' || p.difficulty === st.diff) && (st.status === 'All' || (st.status === 'Solved' ? p.completed : !p.completed && ready(p))) && p.title.toLowerCase().includes(st.q.toLowerCase()));
    $('#plist').innerHTML = list.length ? `<div class="card table-wrap"><table class="board prob-table"><thead><tr><th></th><th>Title</th><th>Level</th><th>Learn first</th><th>XP</th></tr></thead><tbody>${list.map((p) => `
      <tr class="clickable ${ready(p) || p.completed ? '' : 'not-ready'}" data-go="${p.id}"><td>${p.completed ? '✅' : '⬜'}</td><td><a href="#/problem/${p.id}">${esc(p.title)}</a></td><td><span class="chip diff-${p.difficulty}">${diffLabel(p.difficulty)}</span></td><td>${p.needs ? `<span class="chip ${ready(p) ? 'ok' : ''}" title="${ready(p) ? 'You have covered this' : 'Finish this chapter in the course first'}">${ready(p) ? '✔' : '📘'} ${esc(p.needs.title)}</span>` : ''}</td><td>+${p.xp}</td></tr>`).join('')}</tbody></table></div>` : '<p class="muted center-row">No problems match your filters.</p>';
    document.querySelectorAll('[data-go]').forEach((r) => r.onclick = () => { location.hash = '#/problem/' + r.dataset.go; });
  };
  $('#search').oninput = (e) => { st.q = e.target.value; draw(); };
  for (const [id, key] of [['diff', 'diff'], ['stat', 'status']]) {
    document.querySelectorAll(`#${id} button`).forEach((b) => b.onclick = () => { st[key] = b.dataset.v; document.querySelectorAll(`#${id} button`).forEach((x) => x.classList.toggle('on', x === b)); draw(); });
  }
  draw();
}

/* problems that live on LeetCode / Codeforces / HackerRank / Beecrowd (links only; the "done" ticks are saved on your account in MongoDB) */
export async function externalPractice() {
  loading();
  const { EXTERNAL, PLATFORMS, done } = await loadExternal();
  const st = { q: '', diff: 'All', plat: 'all' };
  const plats = Object.entries(PLATFORMS);
  const cnt = (f) => EXTERNAL.filter(f).length;
  ctx.app.innerHTML = `<section class="page">
    <div class="page-head"><div><h1>🌐 Practice on other platforms</h1><p class="muted">${EXTERNAL.length} hand-picked problems on ${plats.length} well-known sites. They open in a new tab; tick the box when you finish one to track it here.</p></div>
      <div class="card mini" id="extcount"></div></div>
    ${practiceTabs('ext', EXTERNAL.length)}
    <div class="toolbar card">
      <input id="xsearch" placeholder="🔍 Search by title…" aria-label="Search external problems">
      <div class="seg" id="xplat"><button class="on" data-v="all">All sites</button>${plats.map(([k, p]) => `<button data-v="${k}">${p.name} <small>${cnt((e) => e.platform === k)}</small></button>`).join('')}</div>
      <div class="seg" id="xdiff">${['All', ...LEVELS].map((d) => `<button class="${d === 'All' ? 'on' : ''}" data-v="${d}">${diffLabel(d)}</button>`).join('')}</div>
    </div><div id="xlist"></div>
    <p class="muted small">Links point to each site's own problem page. If a site changes its address, search for the title there.</p></section>`;
  const draw = () => {
    const list = EXTERNAL.filter((e) => (st.plat === 'all' || e.platform === st.plat) && (st.diff === 'All' || e.difficulty === st.diff) && e.title.toLowerCase().includes(st.q.toLowerCase()));
    $('#extcount').innerHTML = `✔ <b>${EXTERNAL.filter((e) => done.has(e.key)).length}</b> / ${EXTERNAL.length} done`;
    $('#xlist').innerHTML = list.length ? `<div class="card table-wrap"><table class="board prob-table"><thead><tr><th></th><th>Title</th><th>Site</th><th>Level</th></tr></thead><tbody>${list.map((e) => `
      <tr><td><input type="checkbox" data-k="${esc(e.key)}" ${done.has(e.key) ? 'checked' : ''} aria-label="Mark ${esc(e.title)} as done"></td>
      <td><a href="${e.href}" target="_blank" rel="noopener noreferrer">${esc(e.title)} ↗</a></td><td><span class="chip site-${e.platform}">${PLATFORMS[e.platform].name}</span></td><td><span class="chip diff-${e.difficulty}">${diffLabel(e.difficulty)}</span></td></tr>`).join('')}</tbody></table></div>` : '<p class="muted center-row">No problems match your filters.</p>';
    document.querySelectorAll('[data-k]').forEach((c) => c.onchange = () => { const k = c.dataset.k, on = c.checked; on ? done.add(k) : done.delete(k); api.externalDone(k, on).catch((err) => { on ? done.delete(k) : done.add(k); c.checked = !on; toast(esc(err.message), 'err'); }); $('#extcount').innerHTML = `✔ <b>${EXTERNAL.filter((e) => done.has(e.key)).length}</b> / ${EXTERNAL.length} done`; });
  };
  $('#xsearch').oninput = (e) => { st.q = e.target.value; draw(); };
  for (const [id, key] of [['xplat', 'plat'], ['xdiff', 'diff']]) {
    document.querySelectorAll(`#${id} button`).forEach((b) => b.onclick = () => { st[key] = b.dataset.v; document.querySelectorAll(`#${id} button`).forEach((x) => x.classList.toggle('on', x === b)); draw(); });
  }
  draw();
}

/* ───────────── missions ───────────── */
export async function missions() {
  loading();
  const ms = await api.missions();
  const row = (m) => `<div class="mission ${m.done ? 'done' : ''} ${m.claimed ? 'claimed' : ''}">
    <span class="mi">${m.icon}</span><div class="grow"><b>${esc(m.title)}</b><div class="bar"><i style="width:${pct(m.progress, m.target)}%"></i></div><small>${m.progress}/${m.target}</small></div>
    <button class="btn btn-sm" data-claim="${m.id}" ${m.done && !m.claimed ? '' : 'disabled'}>${m.claimed ? '✔ Claimed' : '🪙 ' + m.reward}</button></div>`;
  ctx.app.innerHTML = `<section class="page narrow">
    <div class="page-head"><div><h1>🎯 Missions</h1><p class="muted">Finish missions, claim coins, spend them in the <a href="#/store">Store</a>.</p></div><div class="card mini">🪙 <b>${ms.coins}</b> coins</div></div>
    <div class="row between"><h2>Daily</h2><small class="muted">Resets in ${dur(ms.dailyResetsInMs)}</small></div>${ms.daily.map(row).join('')}
    <div class="row between"><h2>Weekly</h2><small class="muted">Resets in ${dur(ms.weeklyResetsInMs)}</small></div>${ms.weekly.map(row).join('')}
    <h2>Quests</h2><p class="muted small">One-time achievements.</p>${ms.quests.map(row).join('')}</section>`;
  document.querySelectorAll('[data-claim]').forEach((b) => b.onclick = async () => {
    b.disabled = true;
    try {
      const r = await api.claim(b.dataset.claim);
      sound.win(); toast(`🪙 +${r.reward} coins claimed!`, 'xp');
      ctx.setUser((await api.me()).user);
      missions();
    } catch (e) { toast(esc(e.message), 'err'); b.disabled = false; }
  });
}

/* ───────────── leaderboard ───────────── */
export async function leaderboard(scope = 'weekly') {
  loading();
  const r = await api.leaderboard(scope);
  const me = ctx.getMe();
  const name = (u) => (me ? `<a href="#/u/${encodeURIComponent(u.username)}">${esc(u.username)}</a>` : esc(u.username));
  const podium = r.leaderboard.slice(0, 3);
  const order = [podium[1], podium[0], podium[2]].filter(Boolean);
  ctx.app.innerHTML = `<section class="page narrow">
    <div class="page-head"><div><h1>🏆 Leaderboard</h1><p class="muted">${scope === 'weekly' ? `Weekly XP · resets in ${dur(r.weekEndsInMs)}` : 'All-time XP'} · ${r.total} player${r.total === 1 ? '' : 's'}</p></div>
      <div class="seg"><a class="${scope === 'weekly' ? 'on' : ''}" href="#/leaderboard">This week</a><a class="${scope === 'all' ? 'on' : ''}" href="#/leaderboard/all">All time</a></div></div>
    ${r.me ? `<div class="card mini">Your rank: <b>${r.me.rank ? '#' + r.me.rank : 'not ranked yet'}</b> · ${r.me.value} XP</div>` : '<div class="card mini"><a href="#/register">Create an account</a> to join the ranking!</div>'}
    ${podium.length ? `<div class="podium">${order.map((u) => `<div class="pod p${u.rank}">${avatarHTML(u.avatar, u.frame, u.rank === 1 ? 'lg' : '')}<b>${name(u)}</b><small>${u.leagueIcon} ${u.league}</small><div class="stand"><span>${['🥇', '🥈', '🥉'][u.rank - 1]}</span><b>${u.value}</b><small>XP</small></div></div>`).join('')}</div>` : ''}
    <div class="card table-wrap"><table class="board"><thead><tr><th>#</th><th>Player</th><th>League</th><th>Lv</th><th>🔥</th><th>XP</th></tr></thead><tbody>
    ${r.leaderboard.map((u) => `<tr class="${u.me ? 'me' : ''}"><td>${u.rank}</td><td class="player">${avatarHTML(u.avatar, u.frame, 'sm')} ${name(u)}${u.me ? ' <small>(you)</small>' : ''}</td><td>${u.leagueIcon} ${u.league}</td><td>${u.level}</td><td>${u.streak}</td><td><b>${u.value}</b></td></tr>`).join('') || `<tr><td colspan="6" class="muted">${scope === 'weekly' ? 'Nobody has earned XP this week yet — be the first!' : 'No players yet.'}</td></tr>`}
    </tbody></table></div>
    <div class="card"><b>Leagues</b> <span class="muted small">(based on total XP)</span><div class="leagues">${r.leagues.map((l) => `<span class="league">${l.icon} ${l.name}<small> ${l.min}+</small></span>`).join('')}</div></div>
  </section>`;
}

/* ───────────── store ───────────── */
export async function store() {
  loading();
  const d = await api.store();
  const groups = [['booster', '⚡ Boosters', 'Power-ups that help you learn faster.'], ['avatar', '🙂 Avatars', 'Shown on the leaderboard and your profile.'], ['theme', '🎨 Themes', 'Change the colours of the whole site.'], ['frame', '🖼 Avatar frames', 'A border around your avatar.']];
  const card = (i) => {
    let action;
    if (i.type === 'booster') action = `<button class="btn btn-sm" data-buy="${i.id}" ${i.canAfford ? '' : 'disabled'}>🪙 ${i.price}</button>`;
    else if (i.equipped) action = '<span class="chip ok">✔ Equipped</span>';
    else if (i.owned) action = `<button class="btn btn-ghost btn-sm" data-equip="${i.id}">Equip</button>`;
    else action = `<button class="btn btn-sm" data-buy="${i.id}" ${i.canAfford ? '' : 'disabled'}>🪙 ${i.price}</button>`;
    const status = i.id === 'streak-freeze' ? `<small class="chip">You hold ${i.held}/3</small>` : i.id === 'xp-boost' && i.active ? '<small class="chip ok">⚡ active</small>' : '';
    return `<div class="card store-item ${i.equipped ? 'equipped' : ''}"><span class="si">${i.icon}</span><h3>${esc(i.name)}</h3><p class="muted small">${esc(i.desc)}</p>${status}<div class="row center-row">${action}</div></div>`;
  };
  ctx.app.innerHTML = `<section class="page">
    <div class="page-head"><div><h1>🛒 Store</h1><p class="muted">Earn coins from lessons, challenges and missions.</p></div><div class="card mini">🪙 <b>${d.coins}</b> coins</div></div>
    ${groups.map(([t, title, sub]) => `<h2>${title}</h2><p class="muted small">${sub}</p><div class="grid4 store-grid">${d.items.filter((i) => i.type === t).map(card).join('')}</div>`).join('')}</section>`;
  const act = async (fn, id, msg) => {
    try { const r = await fn(id); ctx.setUser(r.user); if (msg) { sound.win(); toast(msg(r), 'badge'); } store(); }
    catch (e) { sound.lose(); toast(esc(e.message), 'err'); }
  };
  document.querySelectorAll('[data-buy]').forEach((b) => b.onclick = () => act(api.buy, b.dataset.buy, (r) => `🛍 Bought <b>${esc(r.name)}</b>`));
  document.querySelectorAll('[data-equip]').forEach((b) => b.onclick = () => act(api.equip, b.dataset.equip, () => '✔ Equipped'));
}

/* ───────────── profile ───────────── */
const heatmap = (days) => {
  const set = new Set(days);
  const cells = Array.from({ length: 84 }, (_, i) => { const key = new Date(Date.now() - (83 - i) * 864e5).toISOString().slice(0, 10); return `<i class="${set.has(key) ? 'on' : ''}" title="${key}"></i>`; });
  return `<div class="heat">${cells.join('')}</div>`;
};

export async function profile() {
  loading();
  const [p, b] = await Promise.all([api.profile(), api.badges()]);
  const u = p.user, s = p.stats; ctx.setUser(u);
  const lg = p.league;
  ctx.app.innerHTML = `<section class="page"><div class="card profile">
      ${avatarHTML(u.avatar, u.frame, 'xl')}
      <div class="grow"><h1>${esc(u.username)}</h1><div class="chips">${leagueChip(lg.name, lg.icon)}<span class="chip">Level ${u.level}</span><span class="chip xp">🪙 ${u.coins}</span></div>
        <p class="muted small">${esc(u.email)} · joined ${new Date(u.createdAt).toLocaleDateString()}</p>
        <div class="bar big"><i style="width:${u.xpIntoLevel}%"></i></div><small>${u.xpIntoLevel}/100 XP to level ${u.level + 1}${lg.nextAt ? ` · ${lg.nextAt - u.xp} XP to ${lg.nextName}` : ''}</small></div>
      <a class="btn btn-ghost" href="#/store">🎨 Customise</a></div>
    <div class="grid4 stats">
      <div class="card stat"><b>${u.xp}</b><span>Total XP</span></div>
      <div class="card stat"><b>🔥 ${u.streak}</b><span>Day streak (best ${u.bestStreak})</span></div>
      <div class="card stat"><b>${s.completed}/${s.totalActivities}</b><span>Journey items done</span></div>
      <div class="card stat"><b>${s.chaptersDone}/${s.totalChapters}</b><span>Chapters complete</span></div>
      <div class="card stat"><b>${s.problemsSolved}</b><span>Practice problems solved</span></div>
      <div class="card stat"><b>${p.weeklyXp}</b><span>XP this week</span></div>
    </div>
    <h2>Activity <small class="muted">last 12 weeks</small></h2><div class="card">${heatmap(p.calendar)}<small class="muted">Each square is a day you practised.</small></div>
    <h2>🎓 Certificates</h2>
    <div class="card cert-card course-cert ${p.course.earned ? 'earned' : ''}"><span class="sec-icon">🏆</span><div class="grow"><h3>${esc(p.course.title)}</h3>
      ${p.course.earned ? `<p class="muted small">Issued ${new Date(p.course.date).toLocaleDateString()} · ID <code>${esc(p.course.certId)}</code></p>`
        : `<div class="bar"><i style="width:${pct(p.course.done, p.course.total)}%"></i></div><small>${p.course.done}/${p.course.total} sections finished — complete all of them to earn the final certificate</small>`}</div>
      ${p.course.earned ? '<a class="btn btn-sm" href="#/certificate/course">View certificate</a>' : ''}</div>
    <div class="grid3">${p.certificates.map((c) => `<div class="card cert-card ${c.earned ? 'earned' : ''}"><span class="sec-icon">${c.icon}</span><h3>${esc(c.title)}</h3>
      ${c.earned ? `<p class="muted small">Issued ${new Date(c.date).toLocaleDateString()}<br>ID <code>${esc(c.certId)}</code></p><a class="btn btn-sm" href="#/certificate/${c.order}">View certificate</a>`
        : `<div class="bar"><i style="width:${pct(c.done, c.total)}%"></i></div><small>${c.done}/${c.total} — finish the section to earn it</small>`}</div>`).join('')}</div>
    <h2>Badges <small class="muted">${b.badges.filter((x) => x.earned).length}/${b.badges.length}</small></h2>
    <div class="badges">${b.badges.map((x) => `<div class="badge ${x.earned ? 'earned' : ''}" title="${esc(x.desc)}"><span>${x.earned ? x.icon : '🔒'}</span><b>${esc(x.name)}</b><small>${esc(x.desc)}</small></div>`).join('')}</div></section>`;
}

export async function publicProfile(name) {
  loading();
  const u = await api.user(decodeURIComponent(name));
  ctx.app.innerHTML = `<section class="page narrow"><a class="back" href="#/leaderboard">← Leaderboard</a>
    <div class="card profile">${avatarHTML(u.avatar, u.frame, 'xl')}<div class="grow"><h1>${esc(u.username)}</h1>
      <div class="chips">${leagueChip(u.league.name, u.league.icon)}<span class="chip">Level ${u.level}</span><span class="chip">🔥 ${u.streak}-day streak</span></div>
      <p class="muted small">Joined ${new Date(u.joined).toLocaleDateString()}</p></div></div>
    <div class="grid4 stats"><div class="card stat"><b>${u.xp}</b><span>Total XP</span></div><div class="card stat"><b>${u.completed}</b><span>Items done</span></div>
      <div class="card stat"><b>${u.problemsSolved}</b><span>Problems solved</span></div><div class="card stat"><b>${u.bestStreak}</b><span>Best streak</span></div></div>
    ${u.certificates.length ? `<h2>🎓 Certificates</h2><div class="chips">${u.certificates.map((c) => `<span class="chip ok">${c.icon} ${esc(c.title)}</span>`).join('')}</div>` : ''}
    <h2>Badges</h2>${u.badges.length ? `<div class="badges">${u.badges.map((x) => `<div class="badge earned" title="${esc(x.desc)}"><span>${x.icon}</span><b>${esc(x.name)}</b><small>${esc(x.desc)}</small></div>`).join('')}</div>` : '<p class="muted">No badges yet.</p>'}</section>`;
}

/* ───────────── learning resources (W3Schools C tutorial) ───────────── */
export async function resources() {
  loading();
  const { home: W3_HOME, base, sections } = await loadResources();
  // "Practice & reference" (order 0) always goes last, after Section 1, 2, 3
  const RES_SECTIONS = [...sections].sort((a, b) => (a.order || 99) - (b.order || 99));
  const w3url = (f) => base + f;
  const block = (sec, i) => `<details class="card res-sec" data-title="${esc((sec.title + ' ' + sec.groups.map((g) => g.title + ' ' + g.links.map((l) => l[0]).join(' ')).join(' ')).toLowerCase())}" open>
    <summary><span class="sec-icon">${sec.icon}</span><div class="grow"><small>${sec.order ? 'SECTION ' + sec.order : 'MORE'}</small><h3>${esc(sec.title)}</h3></div></summary>
    <div class="res-groups">${sec.groups.map((g) => `<div class="res-group" data-t="${esc((g.title + ' ' + g.links.map((l) => l[0]).join(' ')).toLowerCase())}">
      <h4>${g.icon} ${esc(g.title)}</h4>
      <div class="res-links">${g.links.map(([t, f]) => `<a class="res-link" href="${w3url(f)}" target="_blank" rel="noopener noreferrer">${esc(t)} <i>↗</i></a>`).join('')}</div></div>`).join('')}</div></details>`;
  ctx.app.innerHTML = `<section class="page">
    <div class="page-head"><div><small>LEARNING RESOURCES</small><h1>📚 Learn more with W3Schools</h1>
      <p class="muted">Extra reading that matches every GamiC chapter. Links open the free W3Schools C tutorial in a new tab.</p></div>
      <a class="btn btn-lg" href="${W3_HOME}" target="_blank" rel="noopener noreferrer">Open the full C tutorial ↗</a></div>
    <div class="toolbar card"><input id="rsearch" placeholder="🔍 Search topics (e.g. pointers, loops, malloc)…" aria-label="Search resources"></div>
    <div id="rlist">${RES_SECTIONS.map(block).join('')}</div>
    <p id="rnone" class="muted center-row" hidden>No topics match your search.</p>
    <p class="muted small">GamiC lessons are original content; the links above lead to the external W3Schools website.</p></section>`;
  $('#rsearch').oninput = (e) => {
    const q = e.target.value.trim().toLowerCase();
    let any = false;
    document.querySelectorAll('.res-group').forEach((g) => { const show = !q || g.dataset.t.includes(q); g.hidden = !show; any = any || show; });
    document.querySelectorAll('.res-sec').forEach((sec) => { sec.hidden = !!q && ![...sec.querySelectorAll('.res-group')].some((g) => !g.hidden); });
    $('#rnone').hidden = any;
  };
}
