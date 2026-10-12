// Small UI helpers: DOM, toasts, sound, confetti
export const $ = (sel, root = document) => root.querySelector(sel);
export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export function toast(msg, kind = 'info', ms = 3200) {
  const el = document.createElement('div');
  el.className = 'toast ' + kind;
  el.innerHTML = msg;
  $('#toasts').appendChild(el);
  setTimeout(() => { el.classList.add('out'); setTimeout(() => el.remove(), 300); }, ms);
}

/* ---------- sound (WebAudio, no files needed) ---------- */
let ctx;
export const sound = {
  get on() { return localStorage.getItem('gamic_sound') !== 'off'; },
  toggle() { localStorage.setItem('gamic_sound', this.on ? 'off' : 'on'); return this.on; },
  beep(freqs, dur = 0.12) {
    if (!this.on) return;
    try {
      ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
      freqs.forEach((f, i) => {
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.type = 'square'; o.frequency.value = f;
        g.gain.setValueAtTime(0.05, ctx.currentTime + i * dur);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + (i + 1) * dur);
        o.connect(g); g.connect(ctx.destination);
        o.start(ctx.currentTime + i * dur); o.stop(ctx.currentTime + (i + 1) * dur);
      });
    } catch (_) { /* audio blocked */ }
  },
  win() { this.beep([523, 659, 784, 1047]); },
  lose() { this.beep([220, 165], 0.15); },
  click() { this.beep([440], 0.05); }
};

/* ---------- confetti ---------- */
export function confetti(n = 120) {
  const c = $('#confetti'), g = c.getContext('2d');
  c.width = innerWidth; c.height = innerHeight;
  const colors = ['#22d3ee', '#a78bfa', '#34d399', '#fbbf24', '#fb7185', '#60a5fa'];
  const parts = Array.from({ length: n }, () => ({
    x: innerWidth / 2, y: innerHeight / 3, vx: (Math.random() - 0.5) * 14, vy: Math.random() * -12 - 3,
    s: Math.random() * 7 + 4, c: colors[(Math.random() * colors.length) | 0], r: Math.random() * 6
  }));
  let f = 0;
  (function tick() {
    g.clearRect(0, 0, c.width, c.height);
    parts.forEach((p) => { p.vy += 0.35; p.x += p.vx; p.y += p.vy; p.r += 0.2; g.save(); g.translate(p.x, p.y); g.rotate(p.r); g.fillStyle = p.c; g.fillRect(-p.s / 2, -p.s / 2, p.s, p.s * 0.6); g.restore(); });
    if (++f < 110) requestAnimationFrame(tick); else g.clearRect(0, 0, c.width, c.height);
  })();
}

export const avatarHTML = (emoji, frame, size = '') => `<span class="avatar-bubble ${size} frame-${frame || 'none'}">${emoji || '😎'}</span>`;
export const ring = (pct, inner = '', cls = '') => `<span class="ring ${cls}" style="--p:${Math.max(0, Math.min(100, pct))}"><b>${inner}</b></span>`;
export function dur(ms) {
  const m = Math.max(0, Math.floor(ms / 60000)), d = Math.floor(m / 1440), h = Math.floor((m % 1440) / 60);
  return d ? `${d}d ${h}h` : h ? `${h}h ${m % 60}m` : `${m}m`;
}
export function applyTheme(t) { document.body.dataset.theme = t || 'default'; }

export function celebrate(res) {
  if (res.xpAwarded) toast(`⭐ +${res.xpAwarded} XP${res.boosted ? ' <b>(2× boost!)</b>' : ''}`, 'xp');
  if (res.coinsAwarded) toast(`🪙 +${res.coinsAwarded} coins`, 'xp');
  if (res.freezeUsed) toast(`🧊 A Streak Freeze saved your streak!`, 'badge', 4500);
  if (res.levelUp) { toast(`🆙 LEVEL UP! You are now level ${res.user.level}`, 'level', 4500); confetti(180); }
  (res.newBadges || []).forEach((b) => toast(`${b.icon} Badge unlocked: <b>${esc(b.name)}</b>`, 'badge', 4500));
  if (res.chapterCompleted) { toast(`📗 Chapter complete: <b>${esc(res.chapterCompleted)}</b>`, 'level', 4500); confetti(120); }
  if (res.sectionCompleted) { toast(`🎓 Section complete! <a href="#/certificate/${res.sectionCompleted.order}">Get your certificate</a>`, 'level', 9000); confetti(260); }
  if (res.courseCompleted) { toast(`🏆 COURSE COMPLETE! <a href="#/certificate/course">Get your final certificate</a>`, 'level', 12000); confetti(320); }
  sound.win();
}

/** Internal difficulty 'Medium' is shown to learners as 'Intermediate' */
export const diffLabel = (d) => (d === 'Medium' ? 'Intermediate' : d);
