// Interactive quest map: every chapter of a section is a "world" on a winding path (cleared / current quest / locked).
import { esc } from './ui.js';

const THEME = {
  intro: ['C Village', '🏡'], variables: ['Variable Valley', '📦'], operators: ['Operator Desert', '🏜️'], 'control-flow': ['Condition Forest', '🌲'],
  io: ['Input Harbor', '⚓'], loops: ['Loop Volcano', '🌋'], functions: ['Function Island', '🏝️'], arrays: ['Array Kingdom', '👑'], 'final-1': ['Final Boss', '👹'],
  pointers: ['Pointer Mountains', '🏔️'], 'ptr-arrays': ['Array Bridge', '🌉'], strings: ['String Sea', '🌊'], memory: ['Memory Caves', '🕳️'],
  structs: ['Structure Castle', '🏰'], files: ['File Library', '📚'], 'project-report': ['Report Arena', '🏟️'],
  bitwise: ['Bit Canyon', '🔢'], preprocessor: ['Macro Forge', '⚒️'], 'fn-pointers': ['Callback Cliffs', '🎯'], algorithms: ['Recursion Maze', '🌀'],
  'linked-lists': ['Chain Citadel', '⛓️'], 'stacks-queues': ['Stack Tower', '🗼'], modular: ['Module Harbor', '🚢'], 'final-2': ['Final Boss', '👹'], 'project-inventory': ['Inventory Fortress', '🏯']
};
const ICON = { lesson: '📖', challenge: '💻', debug: '🐞', recap: '🎯', final: '👹', project: '🚀' };
const ST = { completed: '✔', available: '▶', locked: '🔒' };
const W = 1000, H = 440;

const info = (c) => {
  const [name, icon] = THEME[c.id] || [c.title, c.icon];
  const done = c.items.filter((i) => i.status === 'completed').length;
  const state = done === c.items.length ? 'cleared' : c.items.some((i) => i.status === 'available') ? 'current' : 'locked';
  return { c, name, icon, sub: /^final/.test(c.id) ? 'C Master Challenge' : c.title, done, total: c.items.length, state };
};

// points rise from bottom-left to top-right along a gentle S-curve (0..1 coordinates)
const pos = (i, n) => { const t = n < 2 ? 0.5 : i / (n - 1); return { x: 0.08 + t * 0.83, y: Math.min(0.8, Math.max(0.14, 0.78 - t * 0.6 + Math.sin(t * Math.PI * 2.3 + 0.5) * 0.07)) }; };

export function worldMap(sec) {
  const nodes = sec.chapters.map(info);
  const pts = nodes.map((_, i) => pos(i, nodes.length));
  const segs = pts.slice(1).map((b, i) => {
    const a = pts[i], x0 = a.x * W, y0 = a.y * H, x1 = b.x * W, y1 = b.y * H, dx = (x1 - x0) / 2;
    return `<path d="M${x0.toFixed(1)} ${y0.toFixed(1)} C${(x0 + dx).toFixed(1)} ${y0.toFixed(1)} ${(x1 - dx).toFixed(1)} ${y1.toFixed(1)} ${x1.toFixed(1)} ${y1.toFixed(1)}" class="wm-seg ${nodes[i].state === 'cleared' ? 'done' : ''}" style="--n:${i}"/>`;
  }).join('');
  const cur = nodes.findIndex((n) => n.state === 'current');
  const html = `<div class="card wm-card">
    <div class="wm-scroll"><div class="worldmap">
      <svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" aria-hidden="true">${segs}</svg>
      ${nodes.map((n, i) => `<button class="wm-node st-${n.state}" style="left:${pts[i].x * 100}%;top:${pts[i].y * 100}%;--n:${i}" data-i="${i}" aria-pressed="false" aria-label="${esc(n.name)}: ${n.state}, ${n.done} of ${n.total} done">
        ${n.state === 'current' ? '<span class="wm-pin">You are here</span>' : ''}<span class="wm-ico">${n.icon}</span><span class="wm-name">${esc(n.name)}</span><span class="wm-sub">${esc(n.sub)}</span></button>`).join('')}
    </div></div>
    <div class="wm-legend"><span><i class="lg cleared"></i>Cleared</span><span><i class="lg current"></i>Current quest</span><span><i class="lg locked"></i>Locked</span></div>
    <div class="wm-panel" id="wmpanel" aria-live="polite"></div></div>`;

  const bind = (root) => {
    const panel = root.querySelector('#wmpanel'), btns = [...root.querySelectorAll('.wm-node')];
    const show = (i) => {
      const n = nodes[i], next = n.c.items.find((x) => x.status === 'available') || n.c.items[0];
      btns.forEach((b, j) => { b.classList.toggle('sel', j === i); b.setAttribute('aria-pressed', j === i); });
      const cta = n.state === 'locked' ? '<span class="btn btn-ghost disabled">🔒 Finish the previous world first</span>'
        : `<a class="btn" href="#/learn/${next.id}">${n.state === 'cleared' ? '↺ Revisit' : n.done ? '▶ Continue quest' : '▶ Start quest'}</a>`;
      panel.innerHTML = `<div class="wm-ph"><span class="wm-pico">${n.icon}</span><div class="grow"><h3>${esc(n.name)}</h3><small class="muted">${esc(n.c.title)} · ${n.done}/${n.total} done</small>
        <div class="bar"><i style="width:${n.total ? Math.round(n.done / n.total * 100) : 0}%"></i></div></div>${cta}</div>
        <ul class="wm-items">${n.c.items.map((it) => it.status === 'locked'
          ? `<li class="locked"><span>${ICON[it.type] || '•'}</span>${esc(it.title)}<em>${ST.locked}</em></li>`
          : `<li class="${it.status}"><a href="#/learn/${it.id}"><span>${ICON[it.type] || '•'}</span>${esc(it.title)}<em>${ST[it.status] || ''}</em></a></li>`).join('')}</ul>`;
    };
    btns.forEach((b, i) => b.onclick = () => show(i));
    show(cur >= 0 ? cur : nodes.every((n) => n.state === 'cleared') ? nodes.length - 1 : 0);
    const sc = root.querySelector('.wm-scroll'), t = btns[cur >= 0 ? cur : 0];       // on small screens centre the current quest
    if (sc && t) sc.scrollLeft = t.offsetLeft - sc.clientWidth / 2;
  };
  return { html, bind };
}
