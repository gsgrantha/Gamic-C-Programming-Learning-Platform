// Animation helpers: staggered entrances, scroll-reveal and number count-up.
// Pure enhancement — if anything here fails, pages still render normally.
const STAGGER = '.grid3, .grid4, .res-groups, .badges, .stats-strip, .hero2-facts, .options, .podium, .hero2 > div:first-child, .page, tbody';
const REVEAL = '.card, .step, details.sec, .mission, .badge, .store-item';
const COUNT = '.stats-strip b, .hero2-facts b, .big-num';

export function initAnimations() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;   // CSS rules are scoped to .anim, so nothing runs
  const root = document.documentElement;
  root.classList.add('anim');
  const app = document.getElementById('app');
  if (!app) return;

  const io = 'IntersectionObserver' in window ? new IntersectionObserver((entries) => entries.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add('rv-in'); io.unobserve(e.target); }
  }), { threshold: 0.08, rootMargin: '0px 0px -6% 0px' }) : null;

  const countUp = (el) => {
    const node = [...el.childNodes].find((n) => n.nodeType === 3 && /^\s*\d+\s*$/.test(n.data));
    if (!node) return;
    const end = +node.data;
    if (!end || end > 1e6) return;
    const t0 = performance.now(), dur = 900;
    node.data = '0';
    const tick = (t) => {
      const k = Math.min(1, (t - t0) / dur);
      node.data = String(k < 1 ? Math.round(end * (1 - Math.pow(1 - k, 3))) : end);
      if (k < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  let queued = false;
  const process = () => {
    queued = false;
    app.querySelectorAll(STAGGER).forEach((box) => {           // give children an index → CSS delays them
      if (box.dataset.st) return;
      box.dataset.st = 1;
      [...box.children].slice(0, 30).forEach((c, i) => c.style.setProperty('--i', Math.min(i, 14)));
    });
    app.querySelectorAll(COUNT).forEach((el) => { if (!el.dataset.cu) { el.dataset.cu = 1; countUp(el); } });
    if (io) app.querySelectorAll(REVEAL).forEach((el) => {
      if (el.dataset.rv) return;
      el.dataset.rv = 1;
      if (el.getBoundingClientRect().top > innerHeight * 0.95) { el.classList.add('rv'); io.observe(el); }
    });
  };
  new MutationObserver(() => { if (!queued) { queued = true; requestAnimationFrame(process); } }).observe(app, { childList: true, subtree: true });
  setInterval(() => app.querySelectorAll('.rv:not(.rv-in)').forEach((el) => { if (el.getBoundingClientRect().top < innerHeight) el.classList.add('rv-in'); }), 1500); // safety net
  process();
}
