/**
 * Extra curriculum: Intermediate additions + the whole Advanced section + more practice problems.
 * Content is assembled in curriculum.js.
 */
const { R, q, T, L, C, P } = require('./helpers');

const NR = (l) => ({ ...l, example: { ...l.example, noRun: true } });       // example cannot be run (e.g. real file access)
const S = (l, stdin) => ({ ...l, example: { ...l.example, stdin } });       // example runs with this input

/* ═══════════════ SECTION 2 additions ═══════════════ */
const ptrArrays = {
  id: 'ptr-arrays', title: 'Pointers and Arrays', icon: '🔗', items: [
    L('ptr-arith', 'Pointer Arithmetic',
      `Adding 1 to a pointer moves it to the <em>next element</em>, not the next byte — C multiplies by the size of the pointed-to type. If <code>p</code> points to <code>a[0]</code>, then <code>p + 1</code> points to <code>a[1]</code> and <code>*(p + 1)</code> is its value.`,
      R`#include <stdio.h>

int main() {
    int a[3] = {10, 20, 30};
    int *p = a;
    printf("%d %d\n", *p, *(p + 1));
    return 0;
}`, '10 20',
      [q('For <code>int *p</code>, what does <code>p + 1</code> advance by?', ['1 byte', 'sizeof(int) bytes (one element)', '4 bytes always', '0'], 1),
       q('If p points to a[0], <code>*(p + 2)</code> equals…', ['a[1]', 'a[2]', 'a[3]', 'an address'], 1)]),
    L('arr-ptr', 'Arrays Decay to Pointers',
      `An array's name acts like a pointer to its first element, and <code>a[i]</code> is just another way of writing <code>*(a + i)</code>. That is why arrays passed to functions arrive as pointers.`,
      R`#include <stdio.h>

int main() {
    int a[3] = {4, 5, 6};
    printf("%d %d\n", a[1], *(a + 1));
    return 0;
}`, '5 5',
      [q('<code>a[i]</code> is equivalent to…', ['*(a + i)', '&a + i', 'a * i', '*a + i'], 0),
       q('When you pass an array to a function, the function receives…', ['a full copy', 'a pointer to the first element', 'the array length', 'nothing'], 1)]),
    C('ptr-sum', 'Sum with a pointer', 'challenge', 'Easy',
      'Read 5 integers into an array, then add them up using a pointer <code>p</code> and <code>*(p + i)</code> (not <code>a[i]</code>). Print the sum.', 'int *p = a; sum += *(p + i);',
      R`#include <stdio.h>

int main() {
    int a[5];
    for (int i = 0; i < 5; i++) scanf("%d", &a[i]);
    int sum = 0;
    //>>
    int *p = a;
    for (int i = 0; i < 5; i++) sum += *(p + i);
    //<<
    printf("%d\n", sum);
    return 0;
}`, [T('1 2 3 4 5\n', '15\n'), T('10 -10 5 5 1\n', '11\n'), T('7 7 7 7 7\n', '35\n')]),
    C('ptr-reverse', 'Reverse with two pointers', 'challenge', 'Medium',
      'Read 6 integers and reverse the array <em>in place</em> using two pointers (one at each end, moving toward the middle). Print the result separated by spaces.', 'Swap *l and *r, then l++ and r-- while l < r.',
      R`#include <stdio.h>

int main() {
    int a[6];
    for (int i = 0; i < 6; i++) scanf("%d", &a[i]);
    //>>
    int *l = a, *r = a + 5;
    while (l < r) {
        int t = *l; *l = *r; *r = t;
        l++; r--;
    }
    //<<
    for (int i = 0; i < 6; i++) printf("%d ", a[i]);
    printf("\n");
    return 0;
}`, [T('1 2 3 4 5 6\n', '6 5 4 3 2 1\n'), T('9 0 9 1 2 3\n', '3 2 1 9 0 9\n')]),
    C('ptr-maxfn', 'Pointer to the maximum', 'challenge', 'Medium',
      'Complete <code>findMax</code> so it <b>returns a pointer</b> to the largest element (the first one if there is a tie). The program prints <code>VALUE at index I</code>.', 'Keep a pointer best = a and update it with &a[i].',
      R`#include <stdio.h>

int *findMax(int *a, int n) {
    //>> return a;
    int *best = a;
    for (int i = 1; i < n; i++) if (a[i] > *best) best = &a[i];
    return best;
    //<<
}

int main() {
    int n, a[50];
    scanf("%d", &n);
    for (int i = 0; i < n; i++) scanf("%d", &a[i]);
    int *p = findMax(a, n);
    printf("%d at index %d\n", *p, (int)(p - a));
    return 0;
}`, [T('5\n3 9 2 7 5\n', '9 at index 1\n'), T('3\n4 4 4\n', '4 at index 0\n'), T('4\n-5 -2 -9 -2\n', '-2 at index 1\n')]),
    C('recap-ptr', 'Recap Challenge: Min and max', 'recap', 'Medium',
      'Complete <code>minmax</code> so it stores the smallest and largest value into the variables behind the pointers <code>min</code> and <code>max</code>. The program prints <code>MIN MAX</code>.', 'Start with *min = *max = a[0].',
      R`#include <stdio.h>

void minmax(int a[], int n, int *min, int *max) {
    //>>
    *min = *max = a[0];
    for (int i = 1; i < n; i++) {
        if (a[i] < *min) *min = a[i];
        if (a[i] > *max) *max = a[i];
    }
    //<<
}

int main() {
    int n, a[50], lo = 12345, hi = 12345;
    scanf("%d", &n);
    for (int i = 0; i < n; i++) scanf("%d", &a[i]);
    minmax(a, n, &lo, &hi);
    printf("%d %d\n", lo, hi);
    return 0;
}`, [T('5\n3 9 2 7 5\n', '2 9\n'), T('1\n4\n', '4 4\n'), T('3\n-1 -5 -3\n', '-5 -1\n')])
  ]
};

const strExtra = [
  S(L('str-input', 'Reading Strings Safely',
    `<code>scanf("%s")</code> stops at the first space. To read a whole line use <code>fgets(buffer, size, stdin)</code> — it never writes past <code>size</code> characters and keeps the newline at the end.`,
    R`#include <stdio.h>

int main() {
    char line[50];
    fgets(line, 50, stdin);
    printf("You wrote: %s", line);
    return 0;
}`, 'You wrote: hello world',
    [q('Why is fgets safer than gets?', ['It is faster', 'It limits how many characters are written', 'It skips spaces', 'It converts to uppercase'], 1),
     q('Which function reads a line containing spaces?', ['scanf("%s")', 'fgets', 'putchar', 'printf'], 1)]), 'hello world\n'),
  C('str-upper', 'Shout it', 'challenge', 'Easy',
    'Read a word and print it in UPPER CASE.', 'toupper() from ctype.h works on one character.',
    R`#include <stdio.h>
#include <ctype.h>

int main() {
    char w[50];
    scanf("%49s", w);
    //>>
    for (int i = 0; w[i]; i++) w[i] = toupper(w[i]);
    //<<
    printf("%s\n", w);
    return 0;
}`, [T('gami\n', 'GAMI\n'), T('C99\n', 'C99\n'), T('Hello\n', 'HELLO\n')]),
  L('str-concat', 'Copying & Joining Strings',
    `<code>strcpy(dest, src)</code> copies a string and <code>strcat(dest, src)</code> appends one. The destination must be large enough for the result <em>plus</em> the terminator — otherwise you overflow the buffer.`,
    R`#include <stdio.h>
#include <string.h>

int main() {
    char s[20];
    strcpy(s, "Gami");
    strcat(s, "C");
    printf("%s %zu\n", s, strlen(s));
    return 0;
}`, 'GamiC 5',
    [q('<code>strcat(a, b)</code> does what?', ['Copies b into a', 'Appends b to the end of a', 'Compares a and b', 'Swaps a and b'], 1),
     q('What must be true of the destination array?', ['It must be const', 'It must be big enough for the result and the \'\\0\'', 'It must be an int array', 'Nothing'], 1)]),
  C('str-count-char', 'Count a letter', 'challenge', 'Easy',
    'Read a word and a character (separated by a space). Print how many times the character appears in the word.', 'Loop until w[i] is \'\\0\'.',
    R`#include <stdio.h>

int main() {
    char w[50], c;
    scanf("%49s %c", w, &c);
    //>>
    int count = 0;
    for (int i = 0; w[i]; i++) if (w[i] == c) count++;
    printf("%d\n", count);
    //<<
    return 0;
}`, [T('banana a\n', '3\n'), T('hello z\n', '0\n'), T('Mississippi s\n', '4\n')]),
  C('str-words', 'Count the words', 'challenge', 'Medium',
    'Read one line of text and print how many words it contains. Words are separated by one or more spaces.', 'Track whether you are currently inside a word.',
    R`#include <stdio.h>
#include <ctype.h>

int main() {
    char line[200];
    fgets(line, 200, stdin);
    //>>
    int words = 0, in = 0;
    for (int i = 0; line[i]; i++) {
        if (isspace((unsigned char)line[i])) in = 0;
        else if (!in) { in = 1; words++; }
    }
    printf("%d\n", words);
    //<<
    return 0;
}`, [T('hello world\n', '2\n'), T('  a b  c\n', '3\n'), T('one\n', '1\n')]),
  C('recap-caesar', 'Recap Challenge: Caesar cipher', 'recap', 'Medium',
    'Read a shift <code>k</code> and a lowercase word. Replace every letter by the letter <code>k</code> places later in the alphabet (wrapping from z to a). Print the result.', 'w[i] = \'a\' + (w[i] - \'a\' + k) % 26;',
    R`#include <stdio.h>

int main() {
    int k;
    char w[50];
    scanf("%d %49s", &k, w);
    //>>
    for (int i = 0; w[i]; i++) w[i] = 'a' + (w[i] - 'a' + k) % 26;
    //<<
    printf("%s\n", w);
    return 0;
}`, [T('3 abc\n', 'def\n'), T('1 xyz\n', 'yza\n'), T('13 hello\n', 'uryyb\n')])
];

const memory = {
  id: 'memory', title: 'Memory Management', icon: '🧠', items: [
    L('mem-stack-heap', 'Stack vs Heap',
      `Local variables live on the <strong>stack</strong>: fast, automatic, and gone when the function ends. The <strong>heap</strong> is memory you request yourself with <code>malloc</code>; it stays until you release it with <code>free</code>. Use it for data whose size is only known at run time.`,
      R`#include <stdio.h>
#include <stdlib.h>

int main() {
    int local = 5;
    int *heap = malloc(sizeof(int));
    *heap = 7;
    printf("%d %d\n", local, *heap);
    free(heap);
    return 0;
}`, '5 7',
      [q('Which memory is released automatically when a function returns?', ['Heap', 'Stack', 'Both', 'Neither'], 1),
       q('Which header declares malloc and free?', ['stdio.h', 'string.h', 'stdlib.h', 'math.h'], 2)]),
    L('mem-malloc', 'malloc and free',
      `<code>malloc(bytes)</code> returns a pointer to a block of heap memory (or <code>NULL</code> if it fails). Request <code>n * sizeof(type)</code> bytes for an array of n items. Every <code>malloc</code> needs exactly one matching <code>free</code>.`,
      R`#include <stdio.h>
#include <stdlib.h>

int main() {
    int *a = malloc(3 * sizeof(int));
    for (int i = 0; i < 3; i++) a[i] = (i + 1) * 10;
    printf("%d\n", a[2]);
    free(a);
    return 0;
}`, '30',
      [q('How many bytes do you request for 10 ints?', ['10', '10 * sizeof(int)', 'sizeof(10)', '40 always'], 1),
       q('What does malloc return when it cannot allocate?', ['0 bytes', 'NULL', 'an error message', '-1'], 1)]),
    C('mem-dyn-sum', 'Dynamic array sum', 'challenge', 'Medium',
      'Read <code>n</code>, allocate an array of n ints with <code>malloc</code>, read the numbers into it and print their sum. Remember to <code>free</code> it.', 'int *a = malloc(n * sizeof(int));',
      R`#include <stdio.h>
#include <stdlib.h>

int main() {
    int n;
    scanf("%d", &n);
    //>>
    int *a = malloc(n * sizeof(int));
    int sum = 0;
    for (int i = 0; i < n; i++) { scanf("%d", &a[i]); sum += a[i]; }
    printf("%d\n", sum);
    free(a);
    //<<
    return 0;
}`, [T('3\n1 2 3\n', '6\n'), T('1\n-4\n', '-4\n'), T('4\n10 20 30 40\n', '100\n')]),
    L('mem-calloc', 'calloc and realloc',
      `<code>calloc(count, size)</code> allocates <em>and zeroes</em> the memory. <code>realloc(ptr, newBytes)</code> resizes a block, keeping the old contents (it may move the block, so always assign the result back to your pointer).`,
      R`#include <stdio.h>
#include <stdlib.h>

int main() {
    int *a = calloc(3, sizeof(int));
    a[1] = 4;
    a = realloc(a, 5 * sizeof(int));
    a[4] = 9;
    printf("%d %d %d\n", a[0], a[1], a[4]);
    free(a);
    return 0;
}`, '0 4 9',
      [q('What is special about calloc?', ['It frees memory', 'It zero-initialises the block', 'It is faster', 'It allocates on the stack'], 1),
       q('Why assign the result of realloc back to the pointer?', ['The block may move', 'It is required syntax', 'To free the old block', 'No reason'], 0)]),
    C('mem-dyn-rev', 'Reverse a dynamic array', 'challenge', 'Medium',
      'Read <code>n</code> and then n integers into a <code>malloc</code>-ed array. Print them in reverse order separated by spaces.', 'Allocate n * sizeof(int), then loop from n - 1 down to 0.',
      R`#include <stdio.h>
#include <stdlib.h>

int main() {
    int n;
    scanf("%d", &n);
    //>>
    int *a = malloc(n * sizeof(int));
    for (int i = 0; i < n; i++) scanf("%d", &a[i]);
    for (int i = n - 1; i >= 0; i--) printf("%d ", a[i]);
    printf("\n");
    free(a);
    //<<
    return 0;
}`, [T('4\n1 2 3 4\n', '4 3 2 1\n'), T('1\n9\n', '9\n'), T('3\n5 -1 0\n', '0 -1 5\n')]),
    L('mem-leaks', 'Leaks and Dangling Pointers',
      `A <strong>memory leak</strong> happens when you lose the pointer to a block without calling <code>free</code>. A <strong>dangling pointer</strong> still holds the address of freed memory — using it is undefined behaviour. After <code>free(p)</code> set <code>p = NULL</code>; freeing twice is also a bug.`,
      R`#include <stdio.h>
#include <stdlib.h>

int main() {
    int *p = malloc(sizeof(int));
    *p = 1;
    free(p);
    p = NULL;
    if (p == NULL) printf("safe\n");
    return 0;
}`, 'safe',
      [q('What is a memory leak?', ['Using freed memory', 'Allocating memory and never freeing it', 'Writing past an array', 'A NULL pointer'], 1),
       q('Good habit after <code>free(p)</code>:', ['Call free again', 'Set p = NULL', 'Increase p', 'Nothing'], 1)]),
    C('mem-repeat', 'Repeat a string', 'challenge', 'Medium',
      'Read a word and a count <code>n</code>. Build (on the heap) the word repeated n times and print it.', 'malloc(strlen(w) * n + 1), set buf[0] = \'\\0\', then strcat in a loop.',
      R`#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main() {
    char w[50];
    int n;
    scanf("%49s %d", w, &n);
    //>>
    char *buf = malloc(strlen(w) * n + 1);
    buf[0] = '\0';
    for (int i = 0; i < n; i++) strcat(buf, w);
    printf("%s\n", buf);
    free(buf);
    //<<
    return 0;
}`, [T('ab 3\n', 'ababab\n'), T('x 5\n', 'xxxxx\n'), T('go 1\n', 'go\n')]),
    C('recap-mem', 'Recap Challenge: Grow as you go', 'recap', 'Hard',
      'Read integers until you meet <code>0</code> (the 0 is not part of the data). Store them in a heap array that doubles in size with <code>realloc</code> when full. Print <code>Count: K</code> and <code>Max: M</code>. At least one number comes before the 0.', 'Start with capacity 2 and double it when count == capacity.',
      R`#include <stdio.h>
#include <stdlib.h>

int main() {
    int cap = 2, count = 0, v;
    int *a = malloc(cap * sizeof(int));
    //>>
    while (scanf("%d", &v) == 1 && v != 0) {
        if (count == cap) { cap *= 2; a = realloc(a, cap * sizeof(int)); }
        a[count++] = v;
    }
    int max = a[0];
    for (int i = 1; i < count; i++) if (a[i] > max) max = a[i];
    printf("Count: %d\nMax: %d\n", count, max);
    //<<
    free(a);
    return 0;
}`, [T('3 9 2 0\n', 'Count: 3\nMax: 9\n'), T('5 0\n', 'Count: 1\nMax: 5\n'), T('-1 -4 8 2 6 -9 0\n', 'Count: 6\nMax: 8\n')])
  ]
};

const structExtra = [
  L('struct-arrays', 'Arrays of structs',
    `Combine arrays and structs to hold a list of records: <code>struct Person list[3];</code>. Access a member of one record with <code>list[i].age</code> and walk the whole list with a loop.`,
    R`#include <stdio.h>

struct P { char name[10]; int age; };

int main() {
    struct P list[2] = {{"Ann", 20}, {"Bo", 31}};
    for (int i = 0; i < 2; i++) printf("%s %d\n", list[i].name, list[i].age);
    return 0;
}`, 'Ann 20\nBo 31',
    [q('How do you read the age of the third person in <code>list</code>?', ['list.age[2]', 'list[2].age', 'list->age[2]', 'age(list, 2)'], 1),
     q('An array of structs is stored…', ['as separate files', 'one record after another in memory', 'in reverse', 'only on the heap'], 1)]),
  C('struct-oldest', 'Find the oldest', 'challenge', 'Medium',
    'Read <code>n</code> people (<code>name age</code>) into an array of structs and print the name of the oldest. If ages tie, print the first one.', 'Remember the index of the best record.',
    R`#include <stdio.h>

struct P { char name[20]; int age; };

int main() {
    int n;
    struct P list[50];
    scanf("%d", &n);
    //>>
    int best = 0;
    for (int i = 0; i < n; i++) {
        scanf("%19s %d", list[i].name, &list[i].age);
        if (list[i].age > list[best].age) best = i;
    }
    printf("%s\n", list[best].name);
    //<<
    return 0;
}`, [T('3\nAna 20\nBen 31\nCy 25\n', 'Ben\n'), T('1\nZed 9\n', 'Zed\n'), T('2\nA 5\nB 5\n', 'A\n')]),
  L('typedef', 'typedef',
    `<code>typedef</code> gives a type a shorter name. <code>typedef struct { int x, y; } Point;</code> lets you write <code>Point p;</code> instead of <code>struct Point p;</code> every time.`,
    R`#include <stdio.h>

typedef struct { int x, y; } Point;

int main() {
    Point p = {1, 2};
    printf("%d\n", p.x + p.y);
    return 0;
}`, '3',
    [q('What does typedef create?', ['A new variable', 'An alias for a type', 'A function', 'A macro loop'], 1),
     q('After <code>typedef int Score;</code>, <code>Score s = 5;</code> declares…', ['an int', 'a struct', 'a pointer', 'an error'], 0)]),
  L('enum', 'Enumerations',
    `An <code>enum</code> defines named integer constants: <code>enum Color { RED, GREEN, BLUE };</code>. Values start at 0 and count up unless you assign them. Names make code far easier to read than magic numbers.`,
    R`#include <stdio.h>

enum Color { RED, GREEN, BLUE };

int main() {
    printf("%d %d %d\n", RED, GREEN, BLUE);
    return 0;
}`, '0 1 2',
    [q('In <code>enum E { A, B, C };</code> what is C?', ['0', '1', '2', '3'], 2),
     q('Enum constants are…', ['strings', 'integers', 'floats', 'pointers'], 1)]),
  C('enum-day', 'Weekend or weekday', 'challenge', 'Easy',
    'The enum <code>Day</code> is declared for you (MON = 0 … SUN = 6). Read a day number and print <code>Weekend</code> for SAT or SUN, otherwise <code>Weekday</code>.', 'Compare with the names SAT and SUN, not numbers.',
    R`#include <stdio.h>

enum Day { MON, TUE, WED, THU, FRI, SAT, SUN };

int main() {
    int d;
    scanf("%d", &d);
    //>>
    if (d == SAT || d == SUN) printf("Weekend\n");
    else printf("Weekday\n");
    //<<
    return 0;
}`, [T('0\n', 'Weekday\n'), T('5\n', 'Weekend\n'), T('6\n', 'Weekend\n'), T('3\n', 'Weekday\n')]),
  L('union', 'Unions',
    `A <code>union</code> looks like a struct, but all members share the <strong>same memory</strong>. Only one is meaningful at a time, and the union is as large as its biggest member. It is useful for saving memory or reinterpreting bytes.`,
    R`#include <stdio.h>

union Data { int i; char c[8]; };

int main() {
    printf("%zu\n", sizeof(union Data));
    return 0;
}`, '8',
    [q('Union members…', ['each have their own memory', 'share the same memory', 'must be pointers', 'cannot be ints'], 1),
     q('The size of a union is about the size of…', ['all members added', 'its largest member', 'its smallest member', 'one byte'], 1)]),
  C('struct-nested', 'Distance between points', 'challenge', 'Medium',
    'A <code>Line</code> struct contains two nested <code>Point</code> structs. Read <code>x1 y1 x2 y2</code> and print the <b>squared</b> distance (dx² + dy²).', 'l.b.x - l.a.x ...',
    R`#include <stdio.h>

struct Point { int x, y; };
struct Line { struct Point a, b; };

int main() {
    struct Line l;
    scanf("%d %d %d %d", &l.a.x, &l.a.y, &l.b.x, &l.b.y);
    //>>
    int dx = l.b.x - l.a.x, dy = l.b.y - l.a.y;
    printf("%d\n", dx * dx + dy * dy);
    //<<
    return 0;
}`, [T('0 0 3 4\n', '25\n'), T('1 1 1 1\n', '0\n'), T('-1 -1 2 3\n', '25\n')])
];

const files = {
  id: 'files', title: 'File Handling', icon: '📁', items: [
    NR(L('file-intro', 'Files and FILE pointers',
      `Programs can read and write files through a <code>FILE *</code> pointer from <code>stdio.h</code>. <code>fopen(name, mode)</code> opens a file and returns the pointer; <code>fclose</code> closes it. (The online sandbox blocks real file access, so file examples in this chapter are read-only — but the code is exactly what you would use on your computer.)`,
      R`#include <stdio.h>

int main() {
    FILE *f = fopen("scores.txt", "w");
    fprintf(f, "10\n");
    fclose(f);
    return 0;
}`, '(creates scores.txt containing 10)',
      [q('What type represents an open file?', ['int', 'FILE *', 'char[]', 'file_t'], 1),
       q('What should you always do when you are done with a file?', ['fclose it', 'delete it', 'rename it', 'nothing'], 0)])),
    NR(L('file-modes', 'File modes: r, w, a',
      `The second argument of <code>fopen</code> chooses the mode: <code>"r"</code> read (file must exist), <code>"w"</code> write (creates or <em>erases</em> the file), <code>"a"</code> append to the end. Add <code>b</code> (e.g. <code>"rb"</code>) for binary files.`,
      R`#include <stdio.h>

int main() {
    FILE *f = fopen("log.txt", "a");   // add to the end
    fprintf(f, "new line\n");
    fclose(f);
    return 0;
}`, '(appends a line to log.txt)',
      [q('Which mode erases an existing file?', ['"r"', '"w"', '"a"', '"rb"'], 1),
       q('Which mode adds data to the end of a file?', ['"r"', '"w"', '"a"', '"x"'], 2)])),
    L('file-rw', 'Reading and writing: fprintf & fscanf',
      `<code>fprintf(f, ...)</code> and <code>fscanf(f, ...)</code> work exactly like <code>printf</code> and <code>scanf</code> but on any stream <code>f</code>. The keyboard and screen are streams too: <code>stdin</code> and <code>stdout</code> — so <code>printf(...)</code> is just <code>fprintf(stdout, ...)</code>.`,
      R`#include <stdio.h>

int main() {
    fprintf(stdout, "Score: %d\n", 10);
    return 0;
}`, 'Score: 10',
      [q('<code>printf("hi")</code> is the same as…', ['fprintf(stdin, "hi")', 'fprintf(stdout, "hi")', 'fscanf(stdout, "hi")', 'fopen("hi")'], 1),
       q('Which function reads formatted data from a stream?', ['fprintf', 'fscanf', 'fclose', 'fputs'], 1)]),
    C('file-streams', 'Streams: fscanf & fprintf', 'challenge', 'Easy',
      'Read two integers with <code>fscanf(stdin, …)</code> and print <code>Sum: X</code> with <code>fprintf(stdout, …)</code>.', 'fscanf(stdin, "%d %d", &a, &b);',
      R`#include <stdio.h>

int main() {
    int a, b;
    //>>
    fscanf(stdin, "%d %d", &a, &b);
    fprintf(stdout, "Sum: %d\n", a + b);
    //<<
    return 0;
}`, [T('3 4\n', 'Sum: 7\n'), T('-2 2\n', 'Sum: 0\n')]),
    NR(L('file-errors', 'Handling file errors',
      `<code>fopen</code> returns <code>NULL</code> when it fails (missing file, no permission). Always check before using the pointer — <code>perror("message")</code> prints a human-readable reason.`,
      R`#include <stdio.h>

int main() {
    FILE *f = fopen("missing.txt", "r");
    if (f == NULL) {
        perror("open failed");
        return 1;
    }
    fclose(f);
    return 0;
}`, 'open failed: No such file or directory',
      [q('What does fopen return on failure?', ['0 bytes', 'NULL', '-1', 'EOF'], 1),
       q('Which function prints a readable error for the last failure?', ['perror', 'puts', 'error', 'fail'], 0)])),
    C('recap-stream', 'Recap Challenge: Line numbers', 'recap', 'Medium',
      'Read lines from standard input until the end (EOF) and print each as <code>N: line</code>, numbering from 1. Remove the newline that <code>fgets</code> keeps.', 'while (fgets(buf, 100, stdin)) … buf[strcspn(buf, "\\n")] = 0;',
      R`#include <stdio.h>
#include <string.h>

int main() {
    char buf[100];
    int n = 0;
    //>>
    while (fgets(buf, 100, stdin)) {
        buf[strcspn(buf, "\n")] = '\0';
        printf("%d: %s\n", ++n, buf);
    }
    //<<
    return 0;
}`, [T('alpha\nbeta\n', '1: alpha\n2: beta\n'), T('solo\n', '1: solo\n'), T('a b\nc\nd e f\n', '1: a b\n2: c\n3: d e f\n')])
  ]
};

/* ═══════════════ SECTION 3 — ADVANCED C ═══════════════ */
const bitwise = {
  id: 'bitwise', title: 'Bitwise Operators', icon: '🔢', items: [
    L('bit-ops', 'AND, OR, XOR',
      `Bitwise operators work on the individual bits of integers: <code>&amp;</code> (both bits 1), <code>|</code> (at least one 1), <code>^</code> (exactly one 1) and <code>~</code> (flip all bits). For 6 (<code>110</code>) and 3 (<code>011</code>): <code>6&amp;3 = 2</code>, <code>6|3 = 7</code>, <code>6^3 = 5</code>.`,
      R`#include <stdio.h>

int main() {
    printf("%d %d %d\n", 6 & 3, 6 | 3, 6 ^ 3);
    return 0;
}`, '2 7 5',
      [q('What is <code>5 &amp; 3</code>? (101 and 011)', ['1', '7', '6', '0'], 0),
       q('Which operator gives 1 only when the bits differ?', ['&', '|', '^', '~'], 2)]),
    L('bit-shift', 'Shift Operators',
      `<code>x &lt;&lt; k</code> shifts bits left (multiplies by 2<sup>k</sup>) and <code>x &gt;&gt; k</code> shifts right (divides by 2<sup>k</sup>). <code>1 &lt;&lt; k</code> builds a mask with only bit k set — the basis of setting, clearing and testing bits.`,
      R`#include <stdio.h>

int main() {
    printf("%d %d\n", 1 << 3, 16 >> 2);
    return 0;
}`, '8 4',
      [q('What is <code>1 &lt;&lt; 4</code>?', ['4', '8', '16', '32'], 2),
       q('<code>n &gt;&gt; 1</code> is like…', ['n * 2', 'n / 2', 'n + 1', 'n - 1'], 1)]),
    C('bit-count', 'Count the set bits', 'challenge', 'Medium',
      'Read a non-negative integer and print how many bits are 1 in its binary form.', 'Add (n & 1), then shift n right until it is 0.',
      R`#include <stdio.h>

int main() {
    unsigned n;
    scanf("%u", &n);
    //>>
    int c = 0;
    while (n) { c += n & 1; n >>= 1; }
    printf("%d\n", c);
    //<<
    return 0;
}`, [T('7\n', '3\n'), T('8\n', '1\n'), T('0\n', '0\n'), T('255\n', '8\n')]),
    C('bit-pow2', 'Power of two?', 'challenge', 'Medium',
      'Read an integer. Print <code>Yes</code> if it is a power of two (1, 2, 4, 8 …), otherwise <code>No</code>. Zero and negatives are not powers of two.', 'A power of two has exactly one set bit: n & (n - 1) == 0.',
      R`#include <stdio.h>

int main() {
    int n;
    scanf("%d", &n);
    //>>
    printf((n > 0 && (n & (n - 1)) == 0) ? "Yes\n" : "No\n");
    //<<
    return 0;
}`, [T('16\n', 'Yes\n'), T('18\n', 'No\n'), T('1\n', 'Yes\n'), T('0\n', 'No\n')]),
    C('bit-toggle', 'Recap Challenge: Toggle a bit', 'recap', 'Medium',
      'Read <code>n</code> and a bit position <code>k</code> (0 = rightmost). Print n with bit k flipped.', 'XOR with a mask: n ^ (1 << k).',
      R`#include <stdio.h>

int main() {
    int n, k;
    scanf("%d %d", &n, &k);
    //>>
    printf("%d\n", n ^ (1 << k));
    //<<
    return 0;
}`, [T('5 1\n', '7\n'), T('5 0\n', '4\n'), T('8 3\n', '0\n')])
  ]
};

const preprocessor = {
  id: 'preprocessor', title: 'Preprocessor & Macros', icon: '🧩', items: [
    L('pp-define', '#define Constants and Macros',
      `The preprocessor runs before the compiler and performs text substitution. <code>#define PI 3.14</code> replaces every PI; a <em>function-like macro</em> takes arguments: <code>#define SQUARE(x) ((x) * (x))</code>.`,
      R`#include <stdio.h>
#define SQUARE(x) ((x) * (x))

int main() {
    printf("%d\n", SQUARE(4));
    return 0;
}`, '16',
      [q('When does the preprocessor run?', ['After the program starts', 'Before compilation', 'While the program runs', 'Never'], 1),
       q('A macro is expanded by…', ['calling a function', 'text substitution', 'the linker', 'the CPU'], 1)]),
    L('pp-pitfalls', 'Macro Pitfalls',
      `Because macros are plain text, missing parentheses change the meaning: <code>#define BAD(x) x * x</code> turns <code>BAD(2 + 1)</code> into <code>2 + 1 * 2 + 1</code> = 5, not 9. Wrap every parameter — and the whole body — in parentheses.`,
      R`#include <stdio.h>
#define BAD(x) x * x
#define GOOD(x) ((x) * (x))

int main() {
    printf("%d %d\n", BAD(2 + 1), GOOD(2 + 1));
    return 0;
}`, '5 9',
      [q('Why is <code>#define BAD(x) x * x</code> risky?', ['It is too slow', 'Operator precedence can change the result', 'It uses too much memory', 'It is illegal'], 1),
       q('Safe macro style wraps parameters in…', ['quotes', 'parentheses', 'braces only', 'nothing'], 1)]),
    L('pp-cond', 'Conditional Compilation',
      `<code>#ifdef NAME … #else … #endif</code> includes code only when a macro is defined. Programmers use it for debug output and to support different platforms from one source file.`,
      R`#include <stdio.h>
#define DEBUG

int main() {
#ifdef DEBUG
    printf("debug on\n");
#else
    printf("debug off\n");
#endif
    return 0;
}`, 'debug on',
      [q('<code>#ifdef X</code> is true when…', ['X equals 1', 'X is defined', 'X is a variable', 'X is a function'], 1),
       q('Conditional compilation decisions are made…', ['at run time', 'before compiling', 'by the user', 'by the OS'], 1)]),
    C('pp-max', 'Write a MAX macro', 'challenge', 'Easy',
      'Complete the <code>MAX(a, b)</code> macro so it gives the larger value. The program reads two integers and prints <code>MAX</code> of them.', 'Use the ternary operator and parenthesise everything.',
      R`#include <stdio.h>

//>> #define MAX(a, b) 0
#define MAX(a, b) ((a) > (b) ? (a) : (b))
//<<

int main() {
    int a, b;
    scanf("%d %d", &a, &b);
    printf("%d\n", MAX(a, b));
    return 0;
}`, [T('3 9\n', '9\n'), T('-4 -9\n', '-4\n'), T('5 5\n', '5\n')]),
    C('debug-macro', 'Bug Hunter: Unprotected macro', 'debug', 'Medium',
      '<code>SQUARE(3 + 1)</code> should print <code>16</code>, but the macro gives a different answer.', 'Add parentheses around the parameter and around the whole expression.',
      R`#include <stdio.h>
#define SQUARE(x) ((x) * (x))

int main() {
    printf("%d\n", SQUARE(3 + 1));
    return 0;
}`, [T('', '16\n')],
      R`#include <stdio.h>
#define SQUARE(x) x * x

int main() {
    printf("%d\n", SQUARE(3 + 1));
    return 0;
}`)
  ]
};

const fnptr = {
  id: 'fn-pointers', title: 'Function Pointers', icon: '🎯', items: [
    L('fp-basics', 'Declaring and Calling',
      `A function has an address too. A pointer to a function is declared like the function's signature with <code>(*name)</code>: <code>int (*op)(int, int) = add;</code>. Call it as <code>op(2, 3)</code>.`,
      R`#include <stdio.h>

int add(int a, int b) { return a + b; }

int main() {
    int (*op)(int, int) = add;
    printf("%d\n", op(2, 3));
    return 0;
}`, '5',
      [q('In <code>int (*op)(int, int)</code>, op is…', ['an int', 'a pointer to a function', 'an array', 'a macro'], 1),
       q('Why are the parentheses around *op needed?', ['They are decoration', 'Without them it declares a function returning int*', 'To call the function', 'To free memory'], 1)]),
    L('fp-callbacks', 'Callbacks',
      `Passing a function pointer as an argument lets one function behave differently depending on what you hand it — the idea behind sorting with a custom comparison, event handlers and plug-ins.`,
      R`#include <stdio.h>

int mul(int a, int b) { return a * b; }
int apply(int x, int y, int (*f)(int, int)) { return f(x, y); }

int main() {
    printf("%d\n", apply(4, 5, mul));
    return 0;
}`, '20',
      [q('A callback is…', ['a function passed to another function', 'a loop', 'a compiler flag', 'a header'], 0),
       q('Which standard function takes a comparison callback?', ['printf', 'qsort', 'strlen', 'malloc'], 1)]),
    C('fp-apply', 'Apply an operation', 'challenge', 'Medium',
      'Complete <code>apply</code> so it calls the function <code>f</code> on <code>x</code> and <code>y</code>. The program prints <code>Sum: …</code> and <code>Product: …</code> for two input numbers.', 'return f(x, y);',
      R`#include <stdio.h>

int add(int a, int b) { return a + b; }
int mul(int a, int b) { return a * b; }

int apply(int x, int y, int (*f)(int, int)) {
    //>> return 0;
    return f(x, y);
    //<<
}

int main() {
    int a, b;
    scanf("%d %d", &a, &b);
    printf("Sum: %d\n", apply(a, b, add));
    printf("Product: %d\n", apply(a, b, mul));
    return 0;
}`, [T('3 4\n', 'Sum: 7\nProduct: 12\n'), T('-2 5\n', 'Sum: 3\nProduct: -10\n')]),
    C('fp-table', 'Recap Challenge: Dispatch table', 'recap', 'Hard',
      'Create an array <code>ops</code> of three function pointers <code>{add, sub, mul}</code>. Read <code>a b k</code> and print the result of <code>ops[k](a, b)</code>.', 'int (*ops[3])(int, int) = {add, sub, mul};',
      R`#include <stdio.h>

int add(int a, int b) { return a + b; }
int sub(int a, int b) { return a - b; }
int mul(int a, int b) { return a * b; }

int main() {
    int a, b, k;
    scanf("%d %d %d", &a, &b, &k);
    //>>
    int (*ops[3])(int, int) = {add, sub, mul};
    printf("%d\n", ops[k](a, b));
    //<<
    return 0;
}`, [T('6 4 0\n', '10\n'), T('6 4 1\n', '2\n'), T('6 4 2\n', '24\n')])
  ]
};

const algos = {
  id: 'algorithms', title: 'Recursion & Algorithms', icon: '🧮', items: [
    L('rec-power', 'Recursion in Depth',
      `Many problems shrink into a smaller copy of themselves. <code>x^n = x * x^(n-1)</code>, with <code>x^0 = 1</code> as the base case. Writing the base case first keeps recursion from running forever.`,
      R`#include <stdio.h>

long power(int x, int n) {
    if (n == 0) return 1;
    return x * power(x, n - 1);
}

int main() {
    printf("%ld\n", power(2, 5));
    return 0;
}`, '32',
      [q('What is the base case of power(x, n)?', ['n == 0', 'x == 0', 'n == x', 'none'], 0),
       q('Each recursive call should move…', ['away from the base case', 'toward the base case', 'to main', 'nowhere'], 1)]),
    C('rec-power-c', 'Recursive power', 'challenge', 'Medium',
      'Read <code>x</code> and <code>n</code> (n ≥ 0) and print x<sup>n</sup> using a recursive function.', 'Base case n == 0 returns 1.',
      R`#include <stdio.h>

long power(int x, int n) {
    //>> return 0;
    if (n == 0) return 1;
    return x * power(x, n - 1);
    //<<
}

int main() {
    int x, n;
    scanf("%d %d", &x, &n);
    printf("%ld\n", power(x, n));
    return 0;
}`, [T('2 10\n', '1024\n'), T('5 0\n', '1\n'), T('3 4\n', '81\n')]),
    C('rec-gcd', 'Recursive GCD', 'challenge', 'Medium',
      'Euclid\'s algorithm: <code>gcd(a, b) = gcd(b, a % b)</code> and <code>gcd(a, 0) = a</code>. Implement it recursively and print the GCD of two numbers.', 'Base case: b == 0.',
      R`#include <stdio.h>

int gcd(int a, int b) {
    //>> return 0;
    if (b == 0) return a;
    return gcd(b, a % b);
    //<<
}

int main() {
    int a, b;
    scanf("%d %d", &a, &b);
    printf("%d\n", gcd(a, b));
    return 0;
}`, [T('12 18\n', '6\n'), T('17 5\n', '1\n'), T('100 75\n', '25\n')]),
    L('search-binary', 'Binary Search',
      `On a <strong>sorted</strong> array, look at the middle element: if it is the target you are done, if the target is smaller search the left half, otherwise the right half. Each step halves the work, so 1,000,000 items need only about 20 checks.`,
      R`#include <stdio.h>

int main() {
    int a[5] = {1, 3, 5, 7, 9}, lo = 0, hi = 4, target = 7, ans = -1;
    while (lo <= hi) {
        int mid = (lo + hi) / 2;
        if (a[mid] == target) { ans = mid; break; }
        if (a[mid] < target) lo = mid + 1; else hi = mid - 1;
    }
    printf("%d\n", ans);
    return 0;
}`, '3',
      [q('Binary search requires the array to be…', ['sorted', 'random', 'of even length', 'unique'], 0),
       q('Each step of binary search…', ['halves the search range', 'doubles it', 'checks every item', 'sorts the array'], 0)]),
    C('search-bin-c', 'Find with binary search', 'challenge', 'Medium',
      'Read <code>n</code>, then <code>n</code> sorted integers, then a target. Print the index of the target or <code>-1</code> if it is missing.', 'Keep lo and hi and test the middle element.',
      R`#include <stdio.h>

int main() {
    int n, a[100], target;
    scanf("%d", &n);
    for (int i = 0; i < n; i++) scanf("%d", &a[i]);
    scanf("%d", &target);
    //>>
    int lo = 0, hi = n - 1, ans = -1;
    while (lo <= hi) {
        int mid = (lo + hi) / 2;
        if (a[mid] == target) { ans = mid; break; }
        if (a[mid] < target) lo = mid + 1; else hi = mid - 1;
    }
    printf("%d\n", ans);
    //<<
    return 0;
}`, [T('5\n1 3 5 7 9\n7\n', '3\n'), T('5\n1 3 5 7 9\n4\n', '-1\n'), T('1\n2\n2\n', '0\n')]),
    L('sort-bubble', 'Bubble Sort',
      `Bubble sort repeatedly compares neighbouring elements and swaps them if they are out of order. After each pass the largest remaining value "bubbles" to the end. It is simple but slow for big inputs (about n² steps).`,
      R`#include <stdio.h>

int main() {
    int a[3] = {3, 1, 2};
    for (int i = 0; i < 2; i++)
        for (int j = 0; j < 2 - i; j++)
            if (a[j] > a[j + 1]) { int t = a[j]; a[j] = a[j + 1]; a[j + 1] = t; }
    printf("%d %d %d\n", a[0], a[1], a[2]);
    return 0;
}`, '1 2 3',
      [q('After the first full pass of bubble sort, the largest value is…', ['at the start', 'at the end', 'in the middle', 'unchanged'], 1),
       q('Bubble sort compares…', ['random pairs', 'neighbouring elements', 'first and last only', 'nothing'], 1)]),
    C('sort-bubble-c', 'Sort the numbers', 'challenge', 'Medium',
      'Read <code>n</code> and <code>n</code> integers and print them in ascending order (use bubble sort).', 'Two nested loops that swap a[j] and a[j + 1] when out of order.',
      R`#include <stdio.h>

int main() {
    int n, a[100];
    scanf("%d", &n);
    for (int i = 0; i < n; i++) scanf("%d", &a[i]);
    //>>
    for (int i = 0; i < n - 1; i++)
        for (int j = 0; j < n - 1 - i; j++)
            if (a[j] > a[j + 1]) { int t = a[j]; a[j] = a[j + 1]; a[j + 1] = t; }
    for (int i = 0; i < n; i++) printf("%d ", a[i]);
    printf("\n");
    //<<
    return 0;
}`, [T('5\n5 2 9 1 5\n', '1 2 5 5 9\n'), T('1\n3\n', '3\n'), T('4\n-1 -5 3 0\n', '-5 -1 0 3\n')]),
    C('recap-top3', 'Recap Challenge: Top three', 'recap', 'Medium',
      'Read <code>n</code> (at least 3) and <code>n</code> integers. Print the three largest values in descending order.', 'Sort descending, then print the first three.',
      R`#include <stdio.h>

int main() {
    int n, a[100];
    scanf("%d", &n);
    for (int i = 0; i < n; i++) scanf("%d", &a[i]);
    //>>
    for (int i = 0; i < n - 1; i++)
        for (int j = 0; j < n - 1 - i; j++)
            if (a[j] < a[j + 1]) { int t = a[j]; a[j] = a[j + 1]; a[j + 1] = t; }
    printf("%d %d %d\n", a[0], a[1], a[2]);
    //<<
    return 0;
}`, [T('5\n5 2 9 1 7\n', '9 7 5\n'), T('3\n1 2 3\n', '3 2 1\n'), T('4\n4 4 4 1\n', '4 4 4\n')])
  ]
};

const linked = {
  id: 'linked-lists', title: 'Linked Lists', icon: '⛓️', items: [
    L('ll-node', 'Nodes and Pointers',
      `A linked list is a chain of <strong>nodes</strong>; each node stores a value and a pointer to the next node. The last node's <code>next</code> is <code>NULL</code>. Unlike arrays, nodes can be anywhere in memory and the list can grow one node at a time.`,
      R`#include <stdio.h>

struct Node { int data; struct Node *next; };

int main() {
    struct Node b = {2, NULL};
    struct Node a = {1, &b};
    printf("%d %d\n", a.data, a.next->data);
    return 0;
}`, '1 2',
      [q('What does the last node\'s next pointer hold?', ['0 bytes', 'NULL', 'the head', 'garbage'], 1),
       q('Compared with arrays, linked lists can…', ['grow without copying everything', 'be indexed instantly', 'use less memory always', 'be sorted for free'], 0)]),
    L('ll-insert', 'Inserting at the Head',
      `To insert at the front: allocate a node, point its <code>next</code> at the current head, then make it the new head. It takes constant time no matter how long the list is.`,
      R`#include <stdio.h>
#include <stdlib.h>

struct Node { int data; struct Node *next; };

int main() {
    struct Node *head = NULL;
    for (int i = 1; i <= 3; i++) {
        struct Node *n = malloc(sizeof(struct Node));
        n->data = i;
        n->next = head;
        head = n;
    }
    for (struct Node *p = head; p; p = p->next) printf("%d ", p->data);
    return 0;
}`, '3 2 1',
      [q('Inserting at the head of a linked list takes…', ['constant time', 'time proportional to the length', 'n squared', 'it is impossible'], 0),
       q('In <code>n->next = head; head = n;</code> the order matters because…', ['we must not lose the old head', 'it looks nicer', 'the compiler requires it', 'it saves memory'], 0)]),
    C('ll-build', 'Build and print a list', 'challenge', 'Medium',
      'Complete <code>append</code> so it adds a new node at the <b>end</b> of the list and returns the head. The program reads <code>n</code> numbers and prints the list in order.', 'If head is NULL the new node is the head; otherwise walk to the last node.',
      R`#include <stdio.h>
#include <stdlib.h>

struct Node { int data; struct Node *next; };

struct Node *append(struct Node *head, int v) {
    //>> return head;
    struct Node *n = malloc(sizeof(struct Node));
    n->data = v;
    n->next = NULL;
    if (!head) return n;
    struct Node *p = head;
    while (p->next) p = p->next;
    p->next = n;
    return head;
    //<<
}

int main() {
    int n, v;
    struct Node *head = NULL;
    scanf("%d", &n);
    for (int i = 0; i < n; i++) { scanf("%d", &v); head = append(head, v); }
    for (struct Node *p = head; p; p = p->next) printf("%d ", p->data);
    printf("\n");
    return 0;
}`, [T('3\n4 5 6\n', '4 5 6\n'), T('1\n9\n', '9\n'), T('4\n1 1 2 3\n', '1 1 2 3\n')]),
    C('ll-reverse', 'Reverse a list', 'challenge', 'Hard',
      'Complete <code>reverse</code> so it reverses the list by re-linking the nodes (no new nodes) and returns the new head.', 'Walk the list keeping prev and next pointers: head->next = prev.',
      R`#include <stdio.h>
#include <stdlib.h>

struct Node { int data; struct Node *next; };

struct Node *append(struct Node *head, int v) {
    struct Node *n = malloc(sizeof(struct Node));
    n->data = v; n->next = NULL;
    if (!head) return n;
    struct Node *p = head;
    while (p->next) p = p->next;
    p->next = n;
    return head;
}

struct Node *reverse(struct Node *head) {
    //>> return head;
    struct Node *prev = NULL;
    while (head) {
        struct Node *nx = head->next;
        head->next = prev;
        prev = head;
        head = nx;
    }
    return prev;
    //<<
}

int main() {
    int n, v;
    struct Node *head = NULL;
    scanf("%d", &n);
    for (int i = 0; i < n; i++) { scanf("%d", &v); head = append(head, v); }
    head = reverse(head);
    for (struct Node *p = head; p; p = p->next) printf("%d ", p->data);
    printf("\n");
    return 0;
}`, [T('4\n1 2 3 4\n', '4 3 2 1\n'), T('1\n5\n', '5\n'), T('3\n7 7 8\n', '8 7 7\n')]),
    C('recap-ll', 'Recap Challenge: Delete a value', 'recap', 'Hard',
      'Complete <code>removeFirst</code> so it deletes the <b>first</b> node holding value <code>v</code> (and frees it). The program reads n numbers and then v, and prints the remaining list — or <code>empty</code> if nothing is left.', 'Handle the head separately, then look one node ahead with p->next.',
      R`#include <stdio.h>
#include <stdlib.h>

struct Node { int data; struct Node *next; };

struct Node *append(struct Node *head, int v) {
    struct Node *n = malloc(sizeof(struct Node));
    n->data = v; n->next = NULL;
    if (!head) return n;
    struct Node *p = head;
    while (p->next) p = p->next;
    p->next = n;
    return head;
}

struct Node *removeFirst(struct Node *head, int v) {
    //>> return head;
    if (!head) return NULL;
    if (head->data == v) { struct Node *nx = head->next; free(head); return nx; }
    struct Node *p = head;
    while (p->next && p->next->data != v) p = p->next;
    if (p->next) { struct Node *dead = p->next; p->next = dead->next; free(dead); }
    return head;
    //<<
}

int main() {
    int n, v;
    struct Node *head = NULL;
    scanf("%d", &n);
    for (int i = 0; i < n; i++) { int x; scanf("%d", &x); head = append(head, x); }
    scanf("%d", &v);
    head = removeFirst(head, v);
    if (!head) printf("empty\n");
    else { for (struct Node *p = head; p; p = p->next) printf("%d ", p->data); printf("\n"); }
    return 0;
}`, [T('5\n1 2 3 4 5\n3\n', '1 2 4 5\n'), T('3\n7 8 9\n7\n', '8 9\n'), T('2\n1 2\n5\n', '1 2\n'), T('1\n4\n4\n', 'empty\n')])
  ]
};

const stackq = {
  id: 'stacks-queues', title: 'Stacks & Queues', icon: '📚', items: [
    L('stk-intro', 'Stacks: Last In, First Out',
      `A stack works like a pile of plates: you <strong>push</strong> on top and <strong>pop</strong> from the top, so the last item in is the first out. With an array you only need a counter <code>top</code>. Stacks power undo features, expression parsing and function calls themselves.`,
      R`#include <stdio.h>

int main() {
    int st[10], top = 0;
    st[top++] = 1;
    st[top++] = 2;
    st[top++] = 3;
    printf("%d\n", st[--top]);
    return 0;
}`, '3',
      [q('Which item does pop remove?', ['the first pushed', 'the last pushed', 'the largest', 'a random one'], 1),
       q('A stack is…', ['FIFO', 'LIFO', 'sorted', 'random access only'], 1)]),
    C('stk-brackets', 'Balanced brackets', 'challenge', 'Hard',
      'Read a string made of the brackets <code>()[]{}</code>. Print <code>Balanced</code> if every bracket is closed by the matching type in the right order, otherwise <code>Not balanced</code>.', 'Push opening brackets; on a closing bracket pop and compare.',
      R`#include <stdio.h>

int main() {
    char s[200];
    scanf("%199s", s);
    //>>
    char st[200];
    int top = 0, ok = 1;
    for (int i = 0; s[i]; i++) {
        char c = s[i];
        if (c == '(' || c == '[' || c == '{') st[top++] = c;
        else {
            if (top == 0) { ok = 0; break; }
            char o = st[--top];
            if ((c == ')' && o != '(') || (c == ']' && o != '[') || (c == '}' && o != '{')) { ok = 0; break; }
        }
    }
    if (top != 0) ok = 0;
    printf(ok ? "Balanced\n" : "Not balanced\n");
    //<<
    return 0;
}`, [T('([]{})\n', 'Balanced\n'), T('(]\n', 'Not balanced\n'), T('((\n', 'Not balanced\n'), T('{[()]}\n', 'Balanced\n'), T(')(\n', 'Not balanced\n')]),
    L('que-intro', 'Queues: First In, First Out',
      `A queue is a line at a ticket counter: items join at the <strong>rear</strong> (enqueue) and leave from the <strong>front</strong> (dequeue). With an array you keep two indexes, <code>front</code> and <code>rear</code>.`,
      R`#include <stdio.h>

int main() {
    int q[10], front = 0, rear = 0;
    q[rear++] = 1;
    q[rear++] = 2;
    q[rear++] = 3;
    printf("%d\n", q[front++]);
    return 0;
}`, '1',
      [q('A queue removes the…', ['newest item', 'oldest item', 'largest item', 'middle item'], 1),
       q('Enqueue adds at the…', ['front', 'rear', 'middle', 'random place'], 1)]),
    C('que-ops', 'Queue commands', 'challenge', 'Medium',
      'Read <code>n</code> commands: <code>enq X</code> adds X to the queue; <code>deq</code> removes the front item and prints it, or prints <code>empty</code> if the queue has nothing.', 'Use q[rear++] to add and q[front++] to remove while front < rear.',
      R`#include <stdio.h>

int main() {
    int n, q[100], front = 0, rear = 0;
    scanf("%d", &n);
    //>>
    for (int i = 0; i < n; i++) {
        char cmd[10];
        scanf("%9s", cmd);
        if (cmd[0] == 'e') { int x; scanf("%d", &x); q[rear++] = x; }
        else if (front < rear) printf("%d\n", q[front++]);
        else printf("empty\n");
    }
    //<<
    return 0;
}`, [T('5\nenq 1\nenq 2\ndeq\ndeq\ndeq\n', '1\n2\nempty\n'), T('3\nenq 7\ndeq\ndeq\n', '7\nempty\n')])
  ]
};

const modular = {
  id: 'modular', title: 'Modular Programming', icon: '🗂️', items: [
    NR(L('mod-headers', 'Header Files',
      `Large programs are split into several <code>.c</code> files. A <strong>header file</strong> (<code>.h</code>) lists the declarations — function prototypes, structs, macros — that other files may use. A file includes it with <code>#include "mathutils.h"</code> (quotes for your own headers, angle brackets for system ones).`,
      R`// mathutils.h
int add(int a, int b);

// mathutils.c
#include "mathutils.h"
int add(int a, int b) { return a + b; }

// main.c
#include <stdio.h>
#include "mathutils.h"
int main() { printf("%d\n", add(2, 3)); return 0; }`, '5   (built from three files)',
      [q('What belongs in a header file?', ['declarations other files need', 'only comments', 'the main function', 'compiled code'], 0),
       q('Your own headers are included with…', ['#include <file.h>', '#include "file.h"', '#import file.h', '#use file.h'], 1)])),
    NR(L('mod-guards', 'Include Guards',
      `If a header gets included twice in one file, its declarations repeat and compilation fails. An <strong>include guard</strong> prevents that: <code>#ifndef NAME_H</code>, <code>#define NAME_H</code> at the top and <code>#endif</code> at the bottom, so the contents are processed only once.`,
      R`#ifndef MATHUTILS_H
#define MATHUTILS_H

int add(int a, int b);

#endif`, '(header is safe to include many times)',
      [q('What problem do include guards solve?', ['slow programs', 'duplicate declarations from double inclusion', 'missing semicolons', 'memory leaks'], 1),
       q('Which directive starts a guard?', ['#ifndef', '#error', '#pragma once only', '#undef'], 0)])),
    L('mod-storage', 'static, extern and Scope',
      `A <code>static</code> local variable keeps its value between calls (it lives for the whole program but is only visible inside the function). A <code>static</code> global is private to its file, while <code>extern</code> declares a variable defined in another file.`,
      R`#include <stdio.h>

void tick() {
    static int count = 0;
    count++;
    printf("%d ", count);
}

int main() {
    tick(); tick(); tick();
    return 0;
}`, '1 2 3',
      [q('A static local variable…', ['is reset on every call', 'keeps its value between calls', 'is stored in a register only', 'cannot be changed'], 1),
       q('<code>extern int total;</code> means…', ['total is defined elsewhere', 'total is a function', 'total is deleted', 'total is const'], 0)]),
    C('mod-static', 'Counter with static', 'challenge', 'Easy',
      'Complete <code>next</code> so the first call returns 1, the second 2, the third 3 … using a <code>static</code> variable.', 'static int count = 0; return ++count;',
      R`#include <stdio.h>

int next() {
    //>> return 0;
    static int count = 0;
    return ++count;
    //<<
}

int main() {
    int a = next();
    int b = next();
    int c = next();
    printf("%d %d %d\n", a, b, c);
    return 0;
}`, [T('', '1 2 3\n')])
  ]
};

/* ---- final challenges + project ---- */
const final2 = {
  id: 'final-2', title: 'Final Challenges', icon: '👑', items: [
    C('final-matrix', 'Boss: Matrix transpose', 'final', 'Medium',
      'Read <code>r c</code> and then an r × c matrix. Print its transpose (c rows, r columns), numbers separated by spaces.', 'Swap the loops: columns outside, rows inside.',
      R`#include <stdio.h>

int main() {
    int r, c, m[10][10];
    scanf("%d %d", &r, &c);
    for (int i = 0; i < r; i++) for (int j = 0; j < c; j++) scanf("%d", &m[i][j]);
    //>>
    for (int j = 0; j < c; j++) {
        for (int i = 0; i < r; i++) printf("%d ", m[i][j]);
        printf("\n");
    }
    //<<
    return 0;
}`, [T('2 3\n1 2 3\n4 5 6\n', '1 4\n2 5\n3 6\n'), T('1 1\n7\n', '7\n'), T('3 1\n1\n2\n3\n', '1 2 3\n')]),
    C('final-sieve', 'Boss: Sieve of Eratosthenes', 'final', 'Hard',
      'Read <code>n</code> (≤ 1000) and print all primes up to n separated by spaces using the Sieve of Eratosthenes: mark the multiples of every prime as composite.', 'For each unmarked i, mark i*2, i*3, … as composite.',
      R`#include <stdio.h>

int main() {
    int n;
    char comp[1001] = {0};
    scanf("%d", &n);
    //>>
    for (int i = 2; i <= n; i++) {
        if (!comp[i]) {
            printf("%d ", i);
            for (int j = i * 2; j <= n; j += i) comp[j] = 1;
        }
    }
    printf("\n");
    //<<
    return 0;
}`, [T('20\n', '2 3 5 7 11 13 17 19\n'), T('2\n', '2\n'), T('30\n', '2 3 5 7 11 13 17 19 23 29\n')])
  ]
};

/* Inventory project: one generator, three growing versions */
function inventory(version) {
  const removeBlock = version >= 2 ? `
        } else if (strcmp(cmd, "remove") == 0) {
            scanf("%19s %d", name, &q);
            int found = -1;
            for (int k = 0; k < count; k++) if (strcmp(items[k].name, name) == 0) found = k;
            if (found < 0) printf("Not found\\n");
            else if (items[found].qty < q) printf("Insufficient\\n");
            else items[found].qty -= q;` : '';
  const extraBlock = version >= 3 ? `
        } else if (strcmp(cmd, "total") == 0) {
            int t = 0;
            for (int k = 0; k < count; k++) t += items[k].qty;
            printf("Total: %d\\n", t);
        } else if (strcmp(cmd, "low") == 0) {
            int lim, any = 0;
            scanf("%d", &lim);
            for (int k = 0; k < count; k++) if (items[k].qty < lim) { printf("Low: %s\\n", items[k].name); any = 1; }
            if (!any) printf("Low: none\\n");` : '';
  return R`#include <stdio.h>
#include <string.h>

struct Item { char name[20]; int qty; };

int main() {
    struct Item items[20];
    int count = 0, n, q;
    char cmd[10], name[20];
    scanf("%d", &n);
    for (int i = 0; i < n; i++) {
        scanf("%9s", cmd);
        //>>
        if (strcmp(cmd, "add") == 0) {
            scanf("%19s %d", name, &q);
            int found = -1;
            for (int k = 0; k < count; k++) if (strcmp(items[k].name, name) == 0) found = k;
            if (found >= 0) items[found].qty += q;
            else { strcpy(items[count].name, name); items[count].qty = q; count++; }
        } else if (strcmp(cmd, "show") == 0) {
            for (int k = 0; k < count; k++) printf("%s: %d\n", items[k].name, items[k].qty);` + removeBlock + extraBlock + `
        }
        //<<
    }
    return 0;
}`;
}

const projectInv = {
  id: 'project-inventory', title: 'Project: Inventory Manager', icon: '🚀', items: [
    C('proj-inv-1', 'Part 1: Add & show', 'project', 'Medium',
      '<b>Inventory Manager, part 1.</b> Read <code>n</code> commands. <code>add NAME QTY</code> adds stock (creating the item if it is new, otherwise increasing it). <code>show</code> prints every item as <code>NAME: QTY</code> in the order they were first added.', 'Use an array of structs and search it with strcmp.',
      inventory(1), [T('4\nadd apple 5\nadd pear 2\nadd apple 3\nshow\n', 'apple: 8\npear: 2\n'), T('2\nadd kiwi 1\nshow\n', 'kiwi: 1\n')]),
    C('proj-inv-2', 'Part 2: Removing stock', 'project', 'Medium',
      '<b>Part 2.</b> Add the command <code>remove NAME QTY</code>. If the item does not exist print <code>Not found</code>; if there is less stock than requested print <code>Insufficient</code>; otherwise subtract the quantity.', 'Reuse your search loop for finding an item.',
      inventory(2), [T('5\nadd a 5\nremove a 2\nremove b 1\nremove a 9\nshow\n', 'Not found\nInsufficient\na: 3\n'), T('3\nadd x 2\nremove x 2\nshow\n', 'x: 0\n')]),
    C('proj-inv-3', 'Part 3: Reports', 'project', 'Hard',
      '<b>Part 3 (final).</b> Add <code>total</code> (print <code>Total: SUM</code> of all quantities) and <code>low K</code> (print <code>Low: NAME</code> for each item with quantity below K, or <code>Low: none</code>).', 'Loop over all items once for each report.',
      inventory(3), [T('5\nadd a 5\nadd b 1\nadd c 2\ntotal\nlow 3\n', 'Total: 8\nLow: b\nLow: c\n'), T('2\nadd a 9\nlow 3\n', 'Low: none\n')])
  ]
};

const advanced = [bitwise, preprocessor, fnptr, algos, linked, stackq, modular, final2, projectInv];

/* ═══════════════ more practice problems ═══════════════ */
const problems = [
  P('q13', 13, 'Easy', 'Absolute value', 'Read an integer and print its absolute value.', 'If n < 0 use -n.',
    R`#include <stdio.h>

int main() {
    int n;
    scanf("%d", &n);
    //>>
    printf("%d\n", n < 0 ? -n : n);
    //<<
    return 0;
}`, [T('-5\n', '5\n'), T('7\n', '7\n'), T('0\n', '0\n')], 20),
  P('q14', 14, 'Easy', 'Larger of two', 'Read two integers and print the larger one.', 'Use if/else or the ternary operator.',
    R`#include <stdio.h>

int main() {
    int a, b;
    scanf("%d %d", &a, &b);
    //>>
    printf("%d\n", a > b ? a : b);
    //<<
    return 0;
}`, [T('3 9\n', '9\n'), T('-1 -5\n', '-1\n'), T('4 4\n', '4\n')], 20),
  P('q15', 15, 'Easy', 'Simple interest', 'Read principal P, rate R (%) and time T (years) as integers. Print the simple interest P × R × T / 100 with 2 decimals.', 'Use 100.0 so the division keeps decimals.',
    R`#include <stdio.h>

int main() {
    int p, r, t;
    scanf("%d %d %d", &p, &r, &t);
    //>>
    printf("%.2f\n", p * r * t / 100.0);
    //<<
    return 0;
}`, [T('1000 5 2\n', '100.00\n'), T('250 4 3\n', '30.00\n'), T('999 3 1\n', '29.97\n')], 20),
  P('q16', 16, 'Easy', 'Vowel or consonant', 'Read one letter (upper or lower case). Print <code>Vowel</code> or <code>Consonant</code>.', 'Convert with tolower first.',
    R`#include <stdio.h>
#include <ctype.h>

int main() {
    char c;
    scanf(" %c", &c);
    //>>
    c = tolower(c);
    printf((c == 'a' || c == 'e' || c == 'i' || c == 'o' || c == 'u') ? "Vowel\n" : "Consonant\n");
    //<<
    return 0;
}`, [T('a\n', 'Vowel\n'), T('B\n', 'Consonant\n'), T('E\n', 'Vowel\n'), T('z\n', 'Consonant\n')], 20),
  P('q17', 17, 'Easy', 'Table of n', 'Read n and print its multiplication table from 1 to 10, one line each, like <code>3 x 1 = 3</code>.', 'A for loop with printf("%d x %d = %d\\n", ...).',
    R`#include <stdio.h>

int main() {
    int n;
    scanf("%d", &n);
    //>>
    for (int i = 1; i <= 10; i++) printf("%d x %d = %d\n", n, i, n * i);
    //<<
    return 0;
}`, [T('3\n', '3 x 1 = 3\n3 x 2 = 6\n3 x 3 = 9\n3 x 4 = 12\n3 x 5 = 15\n3 x 6 = 18\n3 x 7 = 21\n3 x 8 = 24\n3 x 9 = 27\n3 x 10 = 30\n'), T('12\n', '12 x 1 = 12\n12 x 2 = 24\n12 x 3 = 36\n12 x 4 = 48\n12 x 5 = 60\n12 x 6 = 72\n12 x 7 = 84\n12 x 8 = 96\n12 x 9 = 108\n12 x 10 = 120\n')], 20),
  P('q18', 18, 'Medium', 'Count the primes', 'Read n and print how many primes are ≤ n.', 'Test each number with trial division up to its square root.',
    R`#include <stdio.h>

int main() {
    int n, count = 0;
    scanf("%d", &n);
    //>>
    for (int k = 2; k <= n; k++) {
        int prime = 1;
        for (int i = 2; i * i <= k; i++) if (k % i == 0) { prime = 0; break; }
        count += prime;
    }
    printf("%d\n", count);
    //<<
    return 0;
}`, [T('10\n', '4\n'), T('1\n', '0\n'), T('100\n', '25\n')], 35),
  P('q19', 19, 'Medium', 'Palindrome number', 'Read a positive integer. Print <code>Yes</code> if it reads the same forwards and backwards, else <code>No</code>.', 'Reverse the number and compare.',
    R`#include <stdio.h>

int main() {
    int n;
    scanf("%d", &n);
    //>>
    int rev = 0, t = n;
    while (t > 0) { rev = rev * 10 + t % 10; t /= 10; }
    printf(rev == n ? "Yes\n" : "No\n");
    //<<
    return 0;
}`, [T('121\n', 'Yes\n'), T('123\n', 'No\n'), T('7\n', 'Yes\n'), T('1221\n', 'Yes\n')], 35),
  P('q20', 20, 'Medium', 'Second largest', 'Read <code>n</code> (≥ 2) distinct integers and print the second largest.', 'Track the largest and second largest while reading.',
    R`#include <stdio.h>

int main() {
    int n, a[100];
    scanf("%d", &n);
    for (int i = 0; i < n; i++) scanf("%d", &a[i]);
    //>>
    int first = a[0] > a[1] ? a[0] : a[1];
    int second = a[0] > a[1] ? a[1] : a[0];
    for (int i = 2; i < n; i++) {
        if (a[i] > first) { second = first; first = a[i]; }
        else if (a[i] > second) second = a[i];
    }
    printf("%d\n", second);
    //<<
    return 0;
}`, [T('5\n3 9 2 7 5\n', '7\n'), T('2\n1 2\n', '1\n'), T('4\n-1 -5 -3 -2\n', '-2\n')], 35),
  P('q21', 21, 'Medium', 'Binary to decimal', 'Read a binary number as a string and print its decimal value.', 'For each digit: value = value * 2 + digit.',
    R`#include <stdio.h>

int main() {
    char s[40];
    scanf("%39s", s);
    //>>
    int v = 0;
    for (int i = 0; s[i]; i++) v = v * 2 + (s[i] - '0');
    printf("%d\n", v);
    //<<
    return 0;
}`, [T('1010\n', '10\n'), T('1\n', '1\n'), T('11111111\n', '255\n'), T('0\n', '0\n')], 35),
  P('q22', 22, 'Medium', 'Anagram check', 'Read two lowercase words. Print <code>Yes</code> if they contain exactly the same letters (anagrams), otherwise <code>No</code>.', 'Count the letters of each word in an int[26].',
    R`#include <stdio.h>

int main() {
    char a[50], b[50];
    int cnt[26] = {0};
    scanf("%49s %49s", a, b);
    //>>
    for (int i = 0; a[i]; i++) cnt[a[i] - 'a']++;
    for (int i = 0; b[i]; i++) cnt[b[i] - 'a']--;
    int ok = 1;
    for (int i = 0; i < 26; i++) if (cnt[i] != 0) ok = 0;
    printf(ok ? "Yes\n" : "No\n");
    //<<
    return 0;
}`, [T('listen silent\n', 'Yes\n'), T('abc abd\n', 'No\n'), T('aab abb\n', 'No\n'), T('a a\n', 'Yes\n')], 35),
  P('q23', 23, 'Medium', 'Diagonal sums', 'Read <code>n</code> and an n × n matrix. Print the sum of the main diagonal and the sum of the anti-diagonal as <code>MAIN ANTI</code>.', 'Main: m[i][i]. Anti: m[i][n-1-i].',
    R`#include <stdio.h>

int main() {
    int n, m[10][10];
    scanf("%d", &n);
    for (int i = 0; i < n; i++) for (int j = 0; j < n; j++) scanf("%d", &m[i][j]);
    //>>
    int d1 = 0, d2 = 0;
    for (int i = 0; i < n; i++) { d1 += m[i][i]; d2 += m[i][n - 1 - i]; }
    printf("%d %d\n", d1, d2);
    //<<
    return 0;
}`, [T('2\n1 2\n3 4\n', '5 5\n'), T('3\n1 2 3\n4 5 6\n7 8 9\n', '15 15\n'), T('3\n2 0 0\n0 3 0\n0 0 4\n', '9 3\n')], 35),
  P('q24', 24, 'Medium', 'Compress runs', 'Read a lowercase word and print it with each run of equal letters replaced by the letter and its length. <code>aaabb</code> becomes <code>a3b2</code>.', 'Walk the string counting equal neighbours.',
    R`#include <stdio.h>

int main() {
    char s[100];
    scanf("%99s", s);
    //>>
    for (int i = 0; s[i]; ) {
        int j = i;
        while (s[j] == s[i]) j++;
        printf("%c%d", s[i], j - i);
        i = j;
    }
    printf("\n");
    //<<
    return 0;
}`, [T('aaabb\n', 'a3b2\n'), T('abc\n', 'a1b1c1\n'), T('zzzz\n', 'z4\n')], 35),
  P('q25', 25, 'Hard', 'The n-th prime', 'Read n and print the n-th prime number (1st = 2, 2nd = 3, 3rd = 5 …).', 'Keep testing numbers and count the primes you find.',
    R`#include <stdio.h>

int main() {
    int n, count = 0, k = 1;
    scanf("%d", &n);
    //>>
    while (count < n) {
        k++;
        int prime = 1;
        for (int i = 2; i * i <= k; i++) if (k % i == 0) { prime = 0; break; }
        count += prime;
    }
    printf("%d\n", k);
    //<<
    return 0;
}`, [T('1\n', '2\n'), T('5\n', '11\n'), T('10\n', '29\n'), T('25\n', '97\n')], 50),
  P('q26', 26, 'Hard', 'Pascal\'s triangle', 'Read n and print the first n rows of Pascal\'s triangle, numbers separated by single spaces, rows left-aligned.', 'Each inner value is the sum of the two above it.',
    R`#include <stdio.h>

int main() {
    int n, t[20][20] = {{0}};
    scanf("%d", &n);
    //>>
    for (int i = 0; i < n; i++) {
        t[i][0] = 1;
        for (int j = 1; j <= i; j++) t[i][j] = t[i - 1][j - 1] + (j < i ? t[i - 1][j] : 0);
        for (int j = 0; j <= i; j++) printf("%d ", t[i][j]);
        printf("\n");
    }
    //<<
    return 0;
}`, [T('4\n', '1\n1 1\n1 2 1\n1 3 3 1\n'), T('1\n', '1\n'), T('6\n', '1\n1 1\n1 2 1\n1 3 3 1\n1 4 6 4 1\n1 5 10 10 5 1\n')], 50),
  P('q27', 27, 'Hard', 'Roman numerals', 'Read an integer from 1 to 3999 and print it in Roman numerals.', 'Go through a table of values (1000, 900, 500 …) and subtract greedily.',
    R`#include <stdio.h>

int main() {
    int n;
    scanf("%d", &n);
    //>>
    int v[] = {1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1};
    const char *s[] = {"M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I"};
    for (int i = 0; i < 13; i++) while (n >= v[i]) { printf("%s", s[i]); n -= v[i]; }
    printf("\n");
    //<<
    return 0;
}`, [T('4\n', 'IV\n'), T('9\n', 'IX\n'), T('58\n', 'LVIII\n'), T('1994\n', 'MCMXCIV\n'), T('3999\n', 'MMMCMXCIX\n')], 50),
  P('q28', 28, 'Hard', 'Josephus problem', 'n people stand in a circle numbered 1..n. Starting from 1, every k-th person is eliminated until one remains. Read <code>n k</code> and print the survivor\'s number.', 'Use the recurrence: res = (res + k) % i for i = 2..n, starting at res = 0.',
    R`#include <stdio.h>

int main() {
    int n, k;
    scanf("%d %d", &n, &k);
    //>>
    int res = 0;
    for (int i = 2; i <= n; i++) res = (res + k) % i;
    printf("%d\n", res + 1);
    //<<
    return 0;
}`, [T('7 3\n', '4\n'), T('5 2\n', '3\n'), T('1 5\n', '1\n'), T('10 2\n', '5\n')], 50),
  P('q29', 29, 'Hard', 'Longest run', 'Read <code>n</code> and <code>n</code> integers. Print the length of the longest run of equal consecutive values.', 'Compare each value with the previous one and track the current and best lengths.',
    R`#include <stdio.h>

int main() {
    int n, a[100];
    scanf("%d", &n);
    for (int i = 0; i < n; i++) scanf("%d", &a[i]);
    //>>
    int best = 1, cur = 1;
    for (int i = 1; i < n; i++) {
        cur = a[i] == a[i - 1] ? cur + 1 : 1;
        if (cur > best) best = cur;
    }
    printf("%d\n", best);
    //<<
    return 0;
}`, [T('7\n1 1 2 2 2 3 3\n', '3\n'), T('1\n5\n', '1\n'), T('4\n1 2 3 4\n', '1\n')], 50)
];

module.exports = { ptrArrays, strExtra, memory, structExtra, files, advanced, problems };
