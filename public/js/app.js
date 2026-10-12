import { api, auth } from './api.js';
import { $, esc, toast, sound, celebrate, avatarHTML, applyTheme, diffLabel } from './ui.js';
import * as P from './pages2.js';
import { createEditor, highlight } from './editor.js';
import { chapterLink } from './resources.js';
import { initAnimations } from './anim.js';

const app = $('#app');
let me = null; // current user

const ICON = { lesson: '📖', challenge: '💻', debug: '🐞', recap: '🎯', final: '👹', project: '🚀' };
const LABEL = { lesson: 'Lesson', challenge: 'Challenge', debug: 'Bug Hunter', recap: 'Recap Challenge', final: 'Final Challenge', project: 'Project' };
const STATUS = { completed: '✔', available: '▶', locked: '🔒' };

/* ───────────── navigation / HUD ───────────── */
const NAV = [['sections', 'Sections'], ['practice', 'Practice'], ['resources', 'Resources'], ['missions', 'Missions'], ['leaderboard', 'Leaderboard'], ['store', 'Store']];
function renderNav() {
  const nav = $('#nav');
  if (!me) {
    nav.innerHTML = `<a href="#/practice">Practice</a><a href="#/resources">Resources</a><a href="#/leaderboard">Leaderboard</a><a href="#/login">Log in</a><a href="#/register" class="btn btn-sm">Start playing</a>`;
    return;
  }
  nav.innerHTML = `
    <button class="icon-btn menu-btn" id="menu" aria-label="Menu">☰</button>
    <div class="links" id="links">${NAV.map(([r, t]) => `<a href="#/${r}" data-r="${r}">${t}</a>`).join('')}</div>
    <div class="nav-stats">
      <a class="chip-stat" href="#/missions" title="Daily streak">🔥 ${me.streak}</a>
      <a class="chip-stat" href="#/store" title="Coins">🪙 ${me.coins}</a>
      <span class="chip-stat lvl" title="${me.xp} XP total">Lv ${me.level}<span class="xpbar"><i style="width:${me.xpIntoLevel}%"></i></span></span>
      ${me.boostActive ? '<span class="chip-stat boost" title="2× XP active">⚡</span>' : ''}
      <div class="dropdown"><button class="av-btn" id="avbtn" aria-label="Account menu">${avatarHTML(me.avatar, me.frame, 'sm')}</button>
        <div class="menu" id="dd"><b>${esc(me.username)}</b><a href="#/profile">👤 Profile</a><a href="#/store">🛒 Customise</a>
          <button id="snd">${sound.on ? '🔊 Sound on' : '🔇 Sound off'}</button><button id="logout">⏻ Log out</button></div></div>
    </div>`;
  $('#menu').onclick = () => $('#links').classList.toggle('open');
  $('#avbtn').onclick = (e) => { e.stopPropagation(); $('#dd').classList.toggle('open'); };
  $('#links').onclick = () => $('#links').classList.remove('open');
  $('#snd').onclick = () => { sound.toggle(); renderNav(); };
  $('#logout').onclick = () => { auth.token = null; me = null; applyTheme('default'); renderNav(); location.hash = '#/'; };
  markActive();
}
document.addEventListener('click', () => $('#dd')?.classList.remove('open'));
function markActive() {
  const path = location.hash.slice(1) || '/';
  const map = { learn: 'sections', section: 'sections', problem: 'practice', u: 'leaderboard', certificate: 'sections', verify: 'resources' };
  const first = path.split('/')[1] || '';
  const key = map[first] || first;
  document.querySelectorAll('#nav .links a').forEach((a) => a.classList.toggle('active', a.dataset.r === key));
}
function setUser(u) { me = u; if (u) applyTheme(u.theme); renderNav(); }
const loading = () => { app.innerHTML = '<div class="center muted">Loading…</div>'; };

/* ───────────── router ───────────── */
const routes = [
  [/^\/?$/, landing],
  [/^\/login$/, () => authPage('login')],
  [/^\/register$/, () => authPage('register')],
  [/^\/home$/, P.home],
  [/^\/sections$/, P.sections],
  [/^\/journey$/, () => { location.hash = '#/sections'; }],
  [/^\/section\/(\d+)$/, P.section],
  [/^\/learn\/([\w-]+)$/, learnPage],
  [/^\/practice$/, P.practice],
  [/^\/practice\/external$/, P.externalPractice],
  [/^\/problem\/(q\d+)$/, problemPage],
  [/^\/missions$/, P.missions],
  [/^\/leaderboard(?:\/(all|weekly))?$/, P.leaderboard],
  [/^\/store$/, P.store],
  [/^\/profile$/, P.profile],
  [/^\/u\/([^/]+)$/, P.publicProfile],
  [/^\/resources$/, P.resources],
  [/^\/certificate\/(\d+|course)$/, certificatePage],
  [/^\/verify(?:\/([\w-]+))?$/, verifyPage]
];
const publicRoutes = ['', '/', '/login', '/register', '/leaderboard', '/leaderboard/all', '/leaderboard/weekly', '/resources'];
const isPublic = (path) => publicRoutes.includes(path) || /^\/verify(\/|$)/.test(path);

async function router() {
  const path = location.hash.slice(1) || '/';
  window.scrollTo(0, 0);
  markActive();
  if (!isPublic(path) && !auth.loggedIn) { location.hash = '#/login'; return; }
  for (const [re, fn] of routes) {
    const m = path.match(re);
    if (m) {
      try { await fn(...m.slice(1)); }
      catch (e) {
        if (e.status === 401) { auth.token = null; setUser(null); location.hash = '#/login'; return; }
        app.innerHTML = `<div class="center card"><h2>${e.status === 403 ? '🔒 Locked' : '😵 Oops'}</h2><p>${esc(e.message)}</p><a class="btn" href="#/sections">Back to journey</a></div>`;
      }
      return;
    }
  }
  app.innerHTML = '<div class="center card"><h2>404</h2><p>This level does not exist.</p><a class="btn" href="#/">Home</a></div>';
}
window.addEventListener('hashchange', router);

/* ───────────── syllabus (shared by landing + journey) ───────────── */
function syllabus(course, linked) {
  const count = (items, t) => items.filter((i) => (t === 'lesson' ? i.type === 'lesson' : i.type !== 'lesson')).length;
  return `<div class="row between syl-tools"><small>SYLLABUS</small><span><button class="link" data-all="open">Expand all</button> · <button class="link" data-all="close">Collapse all</button></span></div>` +
    course.sections.map((s, si) => {
      const items = s.chapters.flatMap((c) => c.items);
      const done = items.filter((i) => i.status === 'completed').length;
      return `<details class="sec card" ${si === 0 ? 'open' : ''}>
        <summary><span class="sec-icon">${s.icon}</span>
          <div class="grow"><small>SECTION ${s.order}</small><h3>${esc(s.title)} ${s.complete ? '🎓' : ''}</h3><p class="muted small">${esc(s.description)}</p>
            <p class="small"><b>${count(items, 'lesson')}</b> lessons · <b>${count(items, 'x')}</b> challenges · <b>${items.reduce((n, i) => n + (i.questions || 0), 0)}</b> questions</p></div>
          ${linked ? `<span class="pct">${done}/${items.length}</span>` : ''}</summary>
        ${s.chapters.map((c) => {
          const cd = c.items.filter((i) => i.status === 'completed').length;
          return `<details class="chap" ${linked && c.items.some((i) => i.status === 'available') ? 'open' : ''}>
            <summary><span>${c.icon}</span><b class="grow">${esc(c.title)}</b><small>${count(c.items, 'lesson')} lessons · ${count(c.items, 'x')} challenges ${linked ? `· ${cd}/${c.items.length}` : ''}</small></summary>
            <ul class="items">${c.items.map((i) => {
              const inner = `<span class="ti">${ICON[i.type]}</span><span class="grow">${esc(i.title)}</span>
                <small>${i.type === 'lesson' ? i.questions + ' Q' : esc(i.difficulty || LABEL[i.type])}</small>${linked ? `<span class="st">${STATUS[i.status] || ''}</span>` : ''}`;
              return linked && i.status !== 'locked'
                ? `<li><a class="item ${i.status} t-${i.type}" href="#/learn/${i.id}">${inner}</a></li>`
                : `<li><span class="item ${i.status || ''} t-${i.type}">${inner}</span></li>`;
            }).join('')}</ul></details>`;
        }).join('')}
      </details>`;
    }).join('');
}
function wireSyllabus() {
  document.querySelectorAll('[data-all]').forEach((b) => b.onclick = () => document.querySelectorAll('details.sec, details.chap').forEach((d) => { d.open = b.dataset.all === 'open'; }));
}
const statsStrip = (s) => `<div class="stats-strip">
  <span><b>${s.sections}</b>sections</span><span><b>${s.chapters}</b>chapters</span><span><b>${s.lessons}</b>lessons</span>
  <span><b>${s.challenges}</b>challenges</span><span><b>${s.questions}</b>quiz questions</span><span><b>${s.projects}</b>project parts</span></div>`;

/* ───────────── landing ───────────── */
async function landing() {
  if (me) { location.hash = '#/home'; return; }
  loading();
  const course = await api.course();
  app.innerHTML = `
  <section class="hero2">
    <div>
      <h1>Learn C by beating levels.</h1>
      <p class="lead">Short lessons, quiz checkpoints and coding challenges that compile with a real gcc in your browser. Earn XP, keep your streak, and finish each section with a certificate that has its own verifiable ID.</p>
      <div class="row"><a class="btn btn-lg" href="#/register">Start level 1</a><a class="btn btn-ghost btn-lg" href="#/login">I have an account</a></div>
      <ul class="hero2-facts"><li><b>${course.stats.lessons}</b>lessons</li><li><b>${course.stats.challenges}</b>coding challenges</li><li><b>${course.stats.sections + 1}</b>certificates</li></ul>
    </div>
    <div class="quest" aria-hidden="true">
      <div class="quest-top"><span>Level 6 · Loops</span><span class="chip xp">+25 XP</span></div>
      <pre>${highlight('for (int i = 1; i <= 3; i++) {\n    printf("Level %d cleared\\n", i);\n}')}</pre>
      <div class="quest-out"><span>output</span><br>Level 1 cleared<br>Level 2 cleared<br>Level 3 cleared</div>
      <div class="quest-xp"><span>Level 4 · 72 / 100 XP</span><div class="bar"><i></i></div></div>
      <div class="quest-win">+25 XP</div>
    </div>
  </section>
  <section class="loop">
    <h2>The core loop</h2>
    <div class="grid4">
      <div class="card step"><span>1</span><h3>📖 Learn</h3><p>Read a short concept lesson.</p></div>
      <div class="card step"><span>2</span><h3>❓ Try</h3><p>Answer quick quiz questions.</p></div>
      <div class="card step"><span>3</span><h3>💻 Challenge</h3><p>Pass a scored coding task.</p></div>
      <div class="card step"><span>4</span><h3>🆙 Level up</h3><p>Earn XP and unlock what's next.</p></div>
    </div>
  </section>
  <section class="page">
    <h2>C Programming journey</h2>
    ${statsStrip(course.stats)}
    ${syllabus(course, false)}
    <div class="center-row row" style="margin-top:1.2rem"><a class="btn btn-lg" href="#/register">Start the first lesson →</a></div>
  </section>
  <section class="loop"><h2>What you get</h2><div class="grid3">
    <div class="card"><h3>💻 Real compiler</h3><p>Your code is compiled and run with gcc, then checked against hidden test cases.</p></div>
    <div class="card"><h3>🐞 Bug Hunter</h3><p>Fix deliberately broken snippets — the skill beginners lack most.</p></div>
    <div class="card"><h3>🧠 Coding Problems</h3><p>An Easy / Medium / Hard practice track for extra training.</p></div>
    <div class="card"><h3>🏅 Badges & streaks</h3><p>Chapter badges, daily streaks and a leaderboard keep you coming back.</p></div>
    <div class="card"><h3>🎓 Certificates</h3><p>Finish a section and get a printable certificate of completion.</p></div>
    <div class="card"><h3>🔓 Step-by-step unlocks</h3><p>One lesson unlocks the next, so you always know what to do now.</p></div>
  </div></section>`;
  wireSyllabus();
}

/* ───────────── auth ───────────── */
function authPage(mode) {
  if (me) { location.hash = '#/home'; return; }
  const reg = mode === 'register';
  app.innerHTML = `
  <div class="center"><form class="card auth" id="f" novalidate>
    <h2>${reg ? 'Create your player' : 'Welcome back'}</h2>
    ${reg ? '<label>Username<input name="username" autocomplete="username" required minlength="3" maxlength="20" placeholder="coder_42"></label>' : ''}
    <label>Email<input name="email" type="email" autocomplete="email" required placeholder="you@example.com"></label>
    <label>Password<input name="password" type="password" autocomplete="${reg ? 'new-password' : 'current-password'}" required minlength="6" placeholder="min. 6 characters"></label>
    <p class="error" id="err" role="alert"></p>
    <button class="btn btn-lg" id="go">${reg ? 'Start playing' : 'Log in'}</button>
    <p class="muted small">${reg ? 'Already playing? <a href="#/login">Log in</a>' : 'New here? <a href="#/register">Create an account</a>'}</p>
  </form></div>`;
  $('#f').onsubmit = async (e) => {
    e.preventDefault();
    const body = Object.fromEntries(new FormData(e.target));
    const btn = $('#go'); btn.disabled = true; $('#err').textContent = '';
    try {
      const r = await (reg ? api.register(body) : api.login(body));
      auth.token = r.token; setUser(r.user);
      toast(reg ? '🎮 Welcome to GamiC!' : `Welcome back, ${esc(r.user.username)}!`, 'xp');
      location.hash = '#/sections';
    } catch (err) { $('#err').textContent = err.message; btn.disabled = false; }
  };
}

/* ───────────── lesson / challenge page ───────────── */
async function learnPage(id) {
  loading();
  const d = await api.lesson(id);
  const it = d.item;
  const isLesson = it.type === 'lesson';
  const nextHref = d.next ? `#/learn/${d.next.id}` : '#/sections';
  const w3 = await chapterLink(d.chapter.id);

  const outline = `<aside class="outline" id="outline">
    <div class="row between"><b>All lessons in ${esc(d.section.title)}</b></div>
    ${d.outline.map((c) => `<details ${c.id === d.chapter.id ? 'open' : ''}><summary>${c.icon} ${esc(c.title)}</summary><ul>
      ${c.items.map((i) => i.status === 'locked'
        ? `<li class="locked"><span>🔒 ${esc(i.title)}</span></li>`
        : `<li class="${i.id === it.id ? 'cur' : ''} ${i.status}"><a href="#/learn/${i.id}">${i.status === 'completed' ? '✔' : ICON[i.type]} ${esc(i.title)}</a></li>`).join('')}
    </ul></details>`).join('')}</aside>`;

  app.innerHTML = `<div class="learn ${isLesson ? 'with-outline' : ''}" id="learn">
    ${outline}
    <article class="content">
      <div class="crumbs"><button class="icon-btn" id="tog" title="Lessons outline">☰</button>
        <a href="#/sections">C</a> › ${esc(d.section.title)} › ${esc(d.chapter.title)}</div>
      <p class="muted small">Part of the ${esc(d.section.title)} section — item ${d.position.n} of ${d.position.total}</p>
      <h1>${ICON[it.type]} ${esc(it.title)}</h1>
      <div class="chips"><span class="chip">${LABEL[it.type]}</span>${it.difficulty ? `<span class="chip diff-${it.difficulty}">${diffLabel(it.difficulty)}</span>` : ''}<span class="chip xp">+${it.xp} XP</span>${it.completed ? '<span class="chip ok">✔ completed</span>' : ''}${w3 ? `<a class="chip w3" href="${w3.href}" target="_blank" rel="noopener noreferrer" title="Opens W3Schools in a new tab">📚 Read more: ${esc(w3.label)} ↗</a>` : ''}</div>
      <div id="main"></div>
      <div class="pager">
        ${d.prev ? `<a class="btn btn-ghost" href="#/learn/${d.prev.id}">← ${esc(d.prev.title)}</a>` : '<span></span>'}
        ${d.next ? `<a class="btn ${d.next.status === 'locked' && !it.completed ? 'btn-ghost disabled' : ''}" id="nextbtn" href="${nextHref}">${esc(d.next.title)} →</a>` : `<a class="btn" href="#/sections">Finish →</a>`}
      </div>
    </article></div>`;

  $('#tog').onclick = () => $('#learn').classList.toggle('with-outline');
  document.querySelector('#outline .cur')?.scrollIntoView?.({ block: 'nearest' });
  const nextBtn = $('#nextbtn');
  if (nextBtn && nextBtn.classList.contains('disabled')) nextBtn.onclick = (e) => { e.preventDefault(); sound.lose(); toast('🔒 Complete this lesson to unlock the next one!', 'err'); };
  const unlockNext = () => { if (nextBtn) { nextBtn.classList.remove('disabled', 'btn-ghost'); nextBtn.onclick = null; } };

  if (isLesson) lessonBody($('#main'), it, nextHref, unlockNext);
  else codeChallenge($('#main'), it, nextHref, unlockNext);
}

function lessonBody(box, it, nextHref, unlockNext) {
  const total = it.questions.length;
  const solved = new Set(it.solved);
  box.innerHTML = `
    <div class="card prose">${it.body}</div>
    <div class="card example">
      <div class="row between"><b>Worked example</b>${it.example.noRun ? '<small class="muted">read-only example</small>' : '<button class="btn btn-ghost btn-sm" id="runex">▶ Run example</button>'}</div>
      <pre class="codeblock">${highlight(it.example.code)}</pre>
      <div class="console mini-console" id="exout"><span class="muted">OUTPUT</span><br>&gt; ${esc(it.example.output).replace(/\n/g, '\n&gt; ')}</div>
    </div>
    ${total ? `<h2>Check yourself <small id="qcount"></small></h2><div id="qs"></div>` : ''}
    <div id="done"></div>`;

  if ($('#runex')) $('#runex').onclick = async (e) => {
    const b = e.target; b.disabled = true;
    try {
      const r = await api.run(it.example.code, it.example.stdin || '');
      $('#exout').innerHTML = '<span class="muted">LIVE OUTPUT</span><br>&gt; ' + (r.ok ? esc(r.stdout) || '(no output)' : `<span class="bad">${esc(r.error)}</span>`);
    } catch (err) { toast(esc(err.message), 'err'); }
    b.disabled = false;
  };

  const doneBanner = (res) => {
    $('#done').innerHTML = `<div class="banner ok">✅ Lesson complete${res && res.xpAwarded ? ` — +${res.xpAwarded} XP` : ''} <a class="btn btn-sm" href="${nextHref}">Next →</a></div>`;
    unlockNext();
  };
  const count = () => { const el = $('#qcount'); if (el) el.textContent = `${solved.size}/${total}`; };

  if (!total) {
    if (it.completed) return doneBanner(null);
    $('#done').innerHTML = '<button class="btn btn-lg" id="mark">✔ I\'ve read this — continue</button>';
    $('#mark').onclick = async () => { const res = await api.submit(it.id, {}); celebrate(res); setUser(res.user); doneBanner(res); };
    return;
  }

  $('#qs').innerHTML = it.questions.map((qn, i) => `
    <div class="card qcard ${solved.has(i) ? 'solved' : ''}" data-i="${i}">
      <p class="qtext"><b>${i + 1}.</b> ${qn.question}</p>
      <div class="options">${qn.options.map((o, j) => `<button class="opt" data-j="${j}" ${solved.has(i) ? 'disabled' : ''}>${esc(o)}</button>`).join('')}</div>
      <p class="explain">${solved.has(i) ? '✔ Answered correctly' : ''}</p>
    </div>`).join('');
  count();
  if (it.completed) doneBanner(null);

  document.querySelectorAll('.qcard .opt').forEach((btn) => btn.onclick = async () => {
    const card = btn.closest('.qcard'), i = +card.dataset.i, j = +btn.dataset.j;
    card.querySelectorAll('.opt').forEach((b) => b.disabled = true);
    try {
      const res = await api.submit(it.id, { question: i, answer: j });
      if (res.questionCorrect) {
        sound.click(); btn.classList.add('right'); card.classList.add('solved'); solved.add(i);
        card.querySelector('.explain').innerHTML = '✅ Correct! ' + (res.explanation || '');
        count();
        if (res.correct) { celebrate(res); setUser(res.user); doneBanner(res); }
      } else {
        sound.lose(); btn.classList.add('wrong');
        card.querySelector('.explain').textContent = '❌ Not quite — try another option.';
        setTimeout(() => card.querySelectorAll('.opt').forEach((b) => { if (!b.classList.contains('wrong')) b.disabled = false; }), 350);
      }
    } catch (err) { toast(esc(err.message), 'err'); card.querySelectorAll('.opt').forEach((b) => b.disabled = false); }
  });
}

/* ───────────── code challenge UI (journey + practice) ───────────── */
function codeChallenge(box, it, nextHref, unlockNext) {
  box.innerHTML = `
  <div class="arena">
    <div class="left">
      <div class="filebar"><span>📄 main.c</span><button class="btn btn-ghost btn-sm" id="reset">↺ Reset</button></div>
      <div id="ed"></div>
      <div class="stdin"><label>Input (stdin) <textarea id="stdin" rows="2" placeholder="Optional input for scanf"></textarea></label></div>
      <div class="actions"><button class="btn btn-ghost" id="run">▶ Run</button><button class="btn" id="submit">⚔ Submit</button></div>
      <div class="console" id="con"><span class="muted">CONSOLE OUTPUT</span><br>&gt; Press Run to compile and execute your code.</div>
    </div>
    <aside class="right card">
      <h3>Challenge brief</h3><div class="prose">${it.brief}</div>
      <p class="muted small">Points available: <b>${it.xp} XP</b> · ${it.testCount} test${it.testCount > 1 ? 's' : ''}</p>
      <div class="sample"><small>SAMPLE</small>${it.sample.stdin ? `<pre>input:\n${esc(it.sample.stdin.trim())}</pre>` : ''}<pre>expected output:\n${esc(it.sample.stdout.trim()) || '(nothing)'}</pre></div>
      <button class="btn btn-ghost btn-sm" id="hintbtn">💡 Show hint</button><p class="hint" id="hint" hidden>${esc(it.hint || '')}</p>
      <div id="result"></div>
    </aside>
  </div>`;
  const ed = createEditor($('#ed'), it.starter);
  $('#stdin').value = it.sample.stdin || '';
  const con = $('#con');
  const show = (html) => { con.innerHTML = '<span class="muted">CONSOLE OUTPUT</span><br>' + html; };
  if (it.completed) $('#result').innerHTML = `<div class="banner ok">✔ Already completed <a class="btn btn-sm" href="${nextHref}">Next →</a></div>`;

  $('#reset').onclick = () => ed.setValue(it.starter);
  $('#hintbtn').onclick = () => { $('#hint').hidden = !$('#hint').hidden; };

  $('#run').onclick = async (e) => {
    const b = e.target; b.disabled = true; show('&gt; Compiling…');
    try {
      const r = await api.run(ed.getValue(), $('#stdin').value);
      if (!r.ok) show(`<span class="bad">${esc(r.error)}</span>`);
      else show(`${r.warnings ? `<span class="warn">${esc(r.warnings)}</span>\n` : ''}&gt; ${esc(r.stdout) || '<span class="muted">(no output)</span>'}${r.error ? `\n<span class="bad">${esc(r.error)}</span>` : ''}`);
    } catch (err) { show(`<span class="bad">${esc(err.message)}</span>`); }
    b.disabled = false;
  };

  $('#submit').onclick = async (e) => {
    const b = e.target; b.disabled = true; show('&gt; Judging against test cases…');
    try {
      const res = await api.submit(it.id, { code: ed.getValue() });
      if (res.compileError || (res.error && !res.tests.length)) {
        sound.lose(); show(`<span class="bad">${esc(res.error)}</span>`);
        $('#result').innerHTML = '<div class="banner bad">❌ Could not compile / run. Read the console.</div>';
      } else {
        const lines = res.tests.map((t, i) => `${t.pass ? '<span class="good">✔</span>' : '<span class="bad">✘</span>'} Test ${i + 1}${t.hidden ? ' (hidden)' : ''}${t.error ? ' — ' + esc(t.error) : ''}`);
        const t0 = res.tests[0];
        const detail = t0 && !t0.pass ? `\n\n<span class="muted">Test 1 expected:</span>\n${esc(t0.expected)}<span class="muted">your output:</span>\n${esc(t0.actual) || '(nothing)'}` : '';
        show(lines.join('\n') + detail);
        if (res.correct) {
          celebrate(res); setUser(res.user); unlockNext();
          $('#result').innerHTML = `<div class="banner ok">✅ Challenge passed${res.xpAwarded ? ` — +${res.xpAwarded} XP` : ' (already completed)'} <a class="btn btn-sm" href="${nextHref}">Continue →</a></div>`;
        } else { sound.lose(); $('#result').innerHTML = '<div class="banner bad">❌ Not quite — some tests failed. Try again!</div>'; }
      }
    } catch (err) { show(`<span class="bad">${esc(err.message)}</span>`); }
    b.disabled = false;
  };
}

/* ───────────── practice ("Coding Problems") ───────────── */
async function problemPage(id) {
  loading();
  const d = await api.problem(id);
  const it = d.item;
  const nextHref = d.next ? `#/problem/${d.next.id}` : '#/practice';
  app.innerHTML = `<div class="learn"><article class="content">
    <div class="crumbs"><a href="#/practice">Practice</a> › Coding Problems › ${diffLabel(it.difficulty)}</div>
    <h1>💻 ${esc(it.title)}</h1>
    <div class="chips"><span class="chip diff-${it.difficulty}">${diffLabel(it.difficulty)}</span><span class="chip xp">+${it.xp} XP</span>${it.completed ? '<span class="chip ok">✔ solved</span>' : ''}</div>
    <div id="main"></div>
    <div class="pager">
      ${d.prev ? `<a class="btn btn-ghost" href="#/problem/${d.prev.id}">← ${esc(d.prev.title)}</a>` : '<span></span>'}
      ${d.next ? `<a class="btn btn-ghost" href="${nextHref}">${esc(d.next.title)} →</a>` : '<a class="btn" href="#/practice">All problems</a>'}
    </div></article></div>`;
  codeChallenge($('#main'), it, nextHref, () => {});
}

/* ───────────── certificate ───────────── */
const fmtDate = (d) => new Date(d).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });

function certificateHTML(c, extra = '') {
  const isCourse = c.kind === 'course';
  const verifyUrl = `${location.origin}/#/verify/${c.certId}`;
  return `<div class="cert-paper ${isCourse ? 'course' : ''}">
    <div class="cert-frame">
      <p class="cert-brand">🎮 <span>Gami</span>C</p>
      <p class="cert-kicker">${isCourse ? 'Certificate of Achievement' : 'Certificate of Completion'}</p>
      <p class="cert-small">This is to certify that</p>
      <h1 class="cert-name">${esc(c.name)}</h1>
      <p class="cert-small">has successfully completed ${isCourse ? 'the entire' : 'the section'}</p>
      <h2 class="cert-title">${c.icon || ''} ${esc(c.title)}</h2>
      <p class="cert-desc">${isCourse
        ? 'finishing all three sections of the GamiC C Programming course — every lesson, quiz and coding challenge.'
        : 'of the GamiC C Programming journey, finishing every lesson, quiz and coding challenge.'}</p>
      <div class="cert-foot">
        <div><b>${fmtDate(c.issuedAt)}</b><span>Date of issue</span></div>
        <div class="cert-seal">${isCourse ? '🏆' : '🏅'}</div>
        <div><b class="cert-id">${esc(c.certId)}</b><span>Certificate ID</span></div>
      </div>
      <p class="cert-verify">Verify this certificate at <b>${esc(verifyUrl)}</b></p>
    </div></div>${extra}`;
}

async function certificatePage(which) {
  loading();
  const [{ certificates }, meRes] = await Promise.all([api.certificates(), api.me()]);
  setUser(meRes.user);
  const c = certificates.find((x) => (which === 'course' ? x.kind === 'course' : x.kind === 'section' && x.order === +which));
  if (!c) {
    app.innerHTML = `<div class="center card"><h2>🔒 Not yet</h2><p>${which === 'course' ? 'Finish all three sections to earn the full-course certificate.' : 'Complete every lesson and challenge in this section to earn the certificate.'}</p><a class="btn" href="#/sections">Back to journey</a></div>`;
    return;
  }
  app.innerHTML = `<section class="page narrow wide-cert">${certificateHTML(c, `
    <div class="row center-row no-print">
      <button class="btn" id="print">🖨 Print / Save as PDF</button>
      <button class="btn btn-ghost" id="copy">🔗 Copy verify link</button>
      <a class="btn btn-ghost" href="#/profile">Back</a></div>`)}</section>`;
  $('#print').onclick = () => window.print();
  $('#copy').onclick = async () => {
    try { await navigator.clipboard.writeText(`${location.origin}/#/verify/${c.certId}`); toast('🔗 Verify link copied', 'xp'); }
    catch (_) { toast('Could not copy — select the ID manually.', 'err'); }
  };
}

async function verifyPage(id) {
  const run = async (value) => {
    const box = $('#vres');
    box.innerHTML = '<p class="muted">Checking…</p>';
    try {
      const r = await api.verifyCert(value.trim());
      box.innerHTML = `<div class="banner ok">✅ <b>Valid certificate</b></div>${certificateHTML(r)}`;
    } catch (e) {
      box.innerHTML = `<div class="banner bad">❌ ${esc(e.status === 404 ? 'No certificate found with this ID. Check for typos.' : e.message)}</div>`;
    }
  };
  app.innerHTML = `<section class="page narrow wide-cert">
    <div class="page-head"><div><h1>🔍 Verify a certificate</h1><p class="muted">Enter the certificate ID printed at the bottom of a GamiC certificate.</p></div></div>
    <form class="card row no-print" id="vf"><input id="vid" class="grow" placeholder="GAMIC-CRS-XXXX-XXXX" value="${esc(id || '')}" autocomplete="off" spellcheck="false" aria-label="Certificate ID"><button class="btn">Verify</button></form>
    <div id="vres"></div></section>`;
  $('#vf').onsubmit = (e) => { e.preventDefault(); const v = $('#vid').value.trim(); if (v) { history.replaceState(null, '', '#/verify/' + encodeURIComponent(v.toUpperCase())); run(v); } };
  if (id) run(id);
}

/* ───────────── boot ───────────── */
try { initAnimations(); } catch (_) { /* animations are optional */ }
P.init({ app, setUser, getMe: () => me });
(async function init() {
  if (auth.loggedIn) {
    try { setUser((await api.me()).user); } catch (_) { auth.token = null; }
  }
  renderNav();
  router();
})();
