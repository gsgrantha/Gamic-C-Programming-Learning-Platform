/**
 * Sanity-check the curriculum WITHOUT MongoDB:
 *  - every reference solution must pass all its tests
 *  - every debug starter must FAIL (otherwise there is no bug to find)
 *  - every other starter should not already pass (except the "Hello World" warm-up)
 *  - every quiz answer index must be valid, ids must be unique
 * Run:  npm run verify
 */
const { sections, problems } = require('../seed/curriculum');
const { judge } = require('../services/runner');

(async () => {
  let bad = 0, checked = 0;
  const fail = (m) => { bad++; console.log('  ✗ ' + m); };
  const ids = new Set();
  const uniq = (id) => { if (ids.has(id)) fail('duplicate id ' + id); ids.add(id); };

  async function checkCode(a, label) {
    checked++;
    const good = await judge(a.solution, a.tests);
    if (!good.passed) fail(`${label} solution FAILED ${good.error || ''} ${JSON.stringify(good.results.map((r) => [r.expected, r.actual, r.error]))}`);
    const start = await judge(a.starter, a.tests);
    if (a.type === 'debug' && start.passed) fail(`${label} debug starter already passes (no bug!)`);
    else if (a.type !== 'debug' && a.id !== 'hello' && start.passed) fail(`${label} starter already passes (trivial)`);
  }

  for (const s of sections) {
    console.log(`Section ${s.order}: ${s.title}`);
    for (const ch of s.chapters) {
      process.stdout.write(`  ${ch.title} `);
      for (const a of ch.items) {
        uniq(a.id);
        if (a.type === 'lesson') {
          a.questions.forEach((q, i) => { if (!(q.answer >= 0 && q.answer < q.options.length)) fail(`${a.id} question ${i} bad answer index`); });
          process.stdout.write('·');
        } else { await checkCode(a, a.id); process.stdout.write('✓'); }
      }
      console.log('');
    }
  }
  console.log('Practice problems');
  for (const p of problems) { uniq(p.pid); await checkCode({ ...p, type: 'challenge', id: p.pid }, p.pid); process.stdout.write('  ✓'); }
  console.log(`\n\nChecked ${checked} coding activities.`);
  console.log(bad ? `${bad} problem(s) found.` : 'All curriculum checks passed ✔');
  process.exit(bad ? 1 : 0);
})();
