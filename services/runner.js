/**
 * Real C execution backend (roadmap phase 4).
 * Compiles submitted code with gcc and runs it with a time limit, an output cap
 * and (on Linux/macOS) CPU/memory ulimits.
 *
 * ⚠️ For a course demo this is fine. For a public deployment run the whole
 *    server inside Docker (see Dockerfile) or use a dedicated sandbox.
 */
const { spawn } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const IS_WIN = process.platform === 'win32';
const COMPILE_TIMEOUT = 10000;
const RUN_TIMEOUT = 2000;
const MAX_OUTPUT = 64 * 1024;
const MAX_CODE = 10000;

const ALLOWED_HEADERS = ['stdio.h', 'stdlib.h', 'string.h', 'math.h', 'ctype.h', 'stdbool.h', 'limits.h', 'stdint.h', 'time.h'];
const BANNED = [
  /\bsystem\s*\(/, /\bpopen\s*\(/, /\bfork\s*\(/, /\bexec[lv]p?e?\s*\(/, /\bfopen\s*\(/, /\bfreopen\s*\(/,
  /\bremove\s*\(/, /\brename\s*\(/, /\bsocket\s*\(/, /\b__asm__\b/, /\basm\s*(volatile)?\s*\(/, /#\s*pragma/, /#\s*embed/, /\bgetenv\s*\(/
];

function validate(code) {
  if (typeof code !== 'string' || !code.trim()) return 'Write some code first!';
  if (code.length > MAX_CODE) return 'Code is too long (max 10,000 characters).';
  const includes = [...code.matchAll(/#\s*include\s*([<"])([^>"]+)[>"]/g)];
  for (const m of includes) {
    if (m[1] === '"' || !ALLOWED_HEADERS.includes(m[2].trim())) {
      return `Header "${m[2]}" is not allowed in GamiC. Allowed: ${ALLOWED_HEADERS.join(', ')}`;
    }
  }
  for (const re of BANNED) {
    if (re.test(code)) return 'Your code uses a function or directive that is blocked in the sandbox.';
  }
  return null;
}

function exec(cmd, args, { input = '', timeout, cwd } = {}) {
  return new Promise((resolve) => {
    let stdout = '', stderr = '', size = 0, killed = false, timedOut = false, spawnError = null;
    const child = spawn(cmd, args, { cwd, env: { PATH: process.env.PATH || '', SystemRoot: process.env.SystemRoot || '' } });
    const timer = setTimeout(() => { timedOut = true; killed = true; child.kill('SIGKILL'); }, timeout);
    const collect = (which) => (d) => {
      size += d.length;
      if (size > MAX_OUTPUT) { if (!killed) { killed = true; child.kill('SIGKILL'); } return; }
      if (which === 'out') stdout += d; else stderr += d;
    };
    child.stdout.on('data', collect('out'));
    child.stderr.on('data', collect('err'));
    child.on('error', (e) => { spawnError = e; });
    child.stdin.on('error', () => {});
    child.on('close', (code, signal) => {
      clearTimeout(timer);
      resolve({ code, signal, stdout, stderr, timedOut, outputTooLong: size > MAX_OUTPUT, spawnError });
    });
    child.stdin.end(input);
  });
}

/** Compile once → returns { ok, dir, bin, error } */
async function compile(code) {
  const problem = validate(code);
  if (problem) return { ok: false, error: problem };

  const dir = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'gamic-'));
  const src = path.join(dir, 'main.c');
  const bin = path.join(dir, IS_WIN ? 'main.exe' : 'main');
  await fs.promises.writeFile(src, code);

  const r = await exec('gcc', ['-std=c11', '-O0', '-Wall', '-o', bin, src, '-lm'], { timeout: COMPILE_TIMEOUT, cwd: dir });
  if (r.spawnError) {
    await cleanup(dir);
    return { ok: false, error: 'gcc was not found on the server. Install GCC (Linux: build-essential, Windows: MinGW-w64, macOS: Xcode CLT) or use Docker.' };
  }
  const msgs = (r.stderr || '').split(dir + path.sep).join('').split(dir).join('').trim();
  if (r.code !== 0) {
    await cleanup(dir);
    return { ok: false, error: msgs || 'Compilation failed.', compileError: true };
  }
  return { ok: true, dir, bin, warnings: msgs };
}

async function runBinary(bin, dir, stdin) {
  let r;
  if (IS_WIN) {
    r = await exec(bin, [], { input: stdin, timeout: RUN_TIMEOUT, cwd: dir });
  } else {
    // limit CPU seconds, address space (256MB) and file size
    r = await exec('sh', ['-c', `ulimit -t 3; ulimit -v 262144; ulimit -f 0; exec "${bin}"`], { input: stdin, timeout: RUN_TIMEOUT, cwd: dir });
  }
  let error = null;
  if (r.timedOut) error = 'Time limit exceeded (possible infinite loop).';
  else if (r.outputTooLong) error = 'Output limit exceeded.';
  else if (r.signal) error = `Program crashed (${r.signal}).`;
  else if (r.code !== 0 && r.code !== null) error = `Program exited with code ${r.code}.`;
  return { stdout: r.stdout, stderr: r.stderr, error };
}

async function cleanup(dir) {
  try { await fs.promises.rm(dir, { recursive: true, force: true }); } catch (_) { /* ignore */ }
}

/** Free run used by the "Run" button. */
async function runCode(code, stdin = '') {
  const c = await compile(code);
  if (!c.ok) return { ok: false, compileError: !!c.compileError, error: c.error };
  try {
    const r = await runBinary(c.bin, c.dir, String(stdin).slice(0, 2000));
    return { ok: true, stdout: r.stdout, error: r.error, warnings: c.warnings };
  } finally { await cleanup(c.dir); }
}

const normalize = (s) => String(s).replace(/\r/g, '').split('\n').map((l) => l.replace(/\s+$/, '')).join('\n').replace(/\n+$/, '');

/** Judge: run against all test cases. */
async function judge(code, tests) {
  const c = await compile(code);
  if (!c.ok) return { passed: false, compileError: !!c.compileError, error: c.error, results: [] };
  const results = [];
  try {
    for (const t of tests) {
      const r = await runBinary(c.bin, c.dir, t.stdin || '');
      const pass = !r.error && normalize(r.stdout) === normalize(t.stdout);
      results.push({ pass, error: r.error, stdin: t.stdin, expected: t.stdout, actual: r.stdout });
    }
  } finally { await cleanup(c.dir); }
  return { passed: results.every((r) => r.pass), results, warnings: c.warnings };
}

module.exports = { runCode, judge, validate };
