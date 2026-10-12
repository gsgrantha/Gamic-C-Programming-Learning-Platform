/**
 * Which chapter must a learner have finished before a practice problem is fair?
 * Looks at the reference solution and returns the latest chapter whose concept it uses.
 */
const RULES = [
  ['io', /scanf\s*\(/],
  ['control-flow', /\bif\s*\(|\bswitch\s*\(|\s\?\s[^;:]+\s:\s/],
  ['loops', /\bfor\s*\(|\bwhile\s*\(|\bdo\s*\{/],
  ['functions', /^\s*(?:static\s+)?(?:int|void|double|float|long(?: long)?|char)\s+(?!main\b)\w+\s*\([^)]*\)\s*\{/m],
  ['arrays', /\b(?:int|long|double|float|unsigned|char)\b[^;(){}]*?\w\s*\[[^\]]*\]|\w\s*\[[^\]]*\]\s*\[/],
  ['pointers', /\b(?:int|char|double|float|long|void)\s*\*\s*\w+|(?<=[(,=]\s*)&(?!&)\s*\w/],            // address-of (scanf calls are removed first, so only real pointer use is left)
  ['strings', /\bchar\s+\w+\s*\[|string\.h|ctype\.h|\bstr[a-z]+\s*\(/],
  ['memory', /\b(?:malloc|calloc|realloc|free)\s*\(/],
  ['structs', /\bstruct\b|\btypedef\b|\benum\b|\bunion\b/],
  ['files', /\bFILE\b|\bfopen\s*\(/],
  ['bitwise', /<<|>>|\^|\w\s*&(?!&)\s*\w|\w\s*\|(?!\|)\s*\w/],
  ['fn-pointers', /\(\s*\*\s*\w+\s*\)\s*\(/],
  ['linked-lists', /\bstruct\s+\w+\s*\*\s*next\b|->\s*next\b/]
];

function needsOf(solution, chapterOrder) {
  const src = String(solution || '').replace(/\/\/.*$/gm, '').replace(/scanf\s*\([^;]*\);/g, 'scanf();').replace(/"(?:\\.|[^"\\])*"/g, '""');
  let best = chapterOrder.indexOf('variables');
  for (const [id, re] of RULES) {
    const idx = chapterOrder.indexOf(id);
    if (idx > best && re.test(id === 'io' ? String(solution) : src)) best = idx;
  }
  return chapterOrder[best];
}
module.exports = { needsOf };
