// Lightweight C code editor: textarea over a syntax-highlighted <pre>, with line numbers.
import { esc } from './ui.js';

const KW = 'auto break case char const continue default do double else enum extern float for goto if int long register return short signed sizeof static struct switch typedef union unsigned void volatile while';
const KW_SET = new Set(KW.split(' '));
const TOKEN = /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|("(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*')|(^[ \t]*#[^\n]*)|(\b\d+(?:\.\d+)?\b)|(\b[A-Za-z_]\w*\b)/gm;

export function highlight(code) {
  let out = '', last = 0, m;
  TOKEN.lastIndex = 0;
  while ((m = TOKEN.exec(code))) {
    out += esc(code.slice(last, m.index));
    const [t, com, str, pre, num, id] = m;
    if (com) out += `<span class="t-com">${esc(t)}</span>`;
    else if (str) out += `<span class="t-str">${esc(t)}</span>`;
    else if (pre) out += `<span class="t-pre">${esc(t)}</span>`;
    else if (num) out += `<span class="t-num">${esc(t)}</span>`;
    else if (id) {
      if (KW_SET.has(id)) out += `<span class="t-kw">${id}</span>`;
      else if (/^(printf|scanf|main|malloc|free|strlen|strcpy|puts|getchar)$/.test(id)) out += `<span class="t-fn">${id}</span>`;
      else out += id;
    }
    last = m.index + t.length;
  }
  return out + esc(code.slice(last));
}

export function createEditor(container, value = '') {
  container.classList.add('editor');
  container.innerHTML = `<div class="gutter"></div><div class="code-wrap"><pre class="hl" aria-hidden="true"></pre><textarea spellcheck="false" autocapitalize="off" autocomplete="off" aria-label="C code editor"></textarea></div>`;
  const ta = container.querySelector('textarea'), pre = container.querySelector('.hl'), gut = container.querySelector('.gutter');

  const render = () => {
    pre.innerHTML = highlight(ta.value) + '\n';
    const lines = ta.value.split('\n').length;
    gut.textContent = Array.from({ length: lines }, (_, i) => i + 1).join('\n');
  };
  const sync = () => { pre.scrollTop = ta.scrollTop; pre.scrollLeft = ta.scrollLeft; gut.scrollTop = ta.scrollTop; };

  ta.value = value;
  ta.addEventListener('input', render);
  ta.addEventListener('scroll', sync);
  ta.addEventListener('keydown', (e) => {
    const s = ta.selectionStart, en = ta.selectionEnd;
    if (e.key === 'Tab') {
      e.preventDefault();
      ta.setRangeText('    ', s, en, 'end'); render();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const lineStart = ta.value.lastIndexOf('\n', s - 1) + 1;
      const line = ta.value.slice(lineStart, s);
      let indent = line.match(/^\s*/)[0];
      if (/\{\s*$/.test(line)) indent += '    ';
      ta.setRangeText('\n' + indent, s, en, 'end'); render();
    }
  });
  render();

  return {
    getValue: () => ta.value,
    setValue: (v) => { ta.value = v; render(); },
    focus: () => ta.focus()
  };
}
