/**
 * GamiC curriculum  —  Journey → Sections → Chapters → Items
 *
 * Item types
 *   lesson     reading + worked example + quiz questions (answered one by one)
 *   challenge  coding task judged by hidden test cases
 *   debug      "Bug Hunter": fix one intentional bug
 *   recap      recap challenge at the end of a chapter
 *   final      final / boss challenge of a section
 *   project    multi-part project
 * Plus a separate PRACTICE track ("Coding Problems": Easy / Medium / Hard).
 *
 * In solutions, wrap the part the learner must write between  //>>  and  //<<
 * (text after //>> is placed in the starter code instead). The starter code is
 * generated automatically from that.
 */

const { R, q, T, L, C, P } = require('./helpers');

const fizz = (() => { let s = ''; for (let i = 1; i <= 15; i++) s += (i % 15 === 0 ? 'FizzBuzz' : i % 3 === 0 ? 'Fizz' : i % 5 === 0 ? 'Buzz' : i) + '\n'; return s; })();

/* =========================================================
   SECTION 1 — FUNDAMENTALS
   ========================================================= */
const ch_intro = {
  id: 'intro', title: 'Introduction', icon: '👋', items: [
    L('c-intro', 'What is C?',
      `C is a fast, compact language created in the early 1970s. Operating systems, game engines and the tiny chips inside appliances are all written in it. You write <em>source code</em> in a <code>.c</code> file, and a <strong>compiler</strong> translates it into a program your computer can run.`,
      R`#include <stdio.h>

int main() {
    printf("C is fun!\n");
    return 0;
}`, 'C is fun!',
      [q('Which tool translates C source code into a runnable program?', ['An interpreter', 'A compiler', 'A web browser', 'A spreadsheet'], 1, 'A compiler (like gcc) converts your .c file into machine code.'),
       q('What is the usual file extension of a C source file?', ['.cpp', '.py', '.c', '.exe'], 2)]),
    C('hello', 'Hello World!', 'challenge', 'Beginner',
      'Welcome to your first C program! The code is already written for you — press <b>Run</b> to see it work, then <b>Submit</b>.',
      'Nothing to change this time. Just run it!',
      R`#include <stdio.h>

int main() {
    printf("Hello, World!\n");
    return 0;
}`, [T('', 'Hello, World!\n')]),
    L('comments', 'Comments',
      `Comments are notes for humans; the compiler ignores them. Use <code>//</code> for a single line and <code>/* ... */</code> for several lines. Good comments explain <em>why</em>, not just <em>what</em>.`,
      R`#include <stdio.h>

int main() {
    // this line is ignored
    /* so is
       this block */
    printf("Comments are ignored\n");
    return 0;
}`, 'Comments are ignored',
      [q('Which symbol starts a single-line comment?', ['#', '//', '--', '<!--'], 1),
       q('Does the compiler run the code inside a comment?', ['Yes', 'No', 'Only inside main', 'Only with a flag'], 1, 'Comments are removed before the program is built.')]),
    L('structure', 'Program Structure',
      `Every program has: <code>#include</code> lines that import tools, a <code>main</code> function where execution starts, statements ending in <code>;</code>, and <code>return 0;</code> to say "all went well". Curly braces <code>{ }</code> mark the beginning and end of a block.`,
      R`#include <stdio.h>   // tools for printing

int main() {          // the program starts here
    printf("Hi!\n");  // a statement
    return 0;         // success
}`, 'Hi!',
      [q('Where does a C program start running?', ['At the first #include', 'In main()', 'At the last line', 'In stdio.h'], 1),
       q('What must most statements end with?', ['A colon', 'A period', 'A semicolon', 'A comma'], 2)]),
    C('debug-semicolon', 'Bug Hunter: The missing mark', 'debug', 'Beginner',
      'This program should print <code>Level 1 complete!</code> but it does not compile. Find the bug and fix it.', 'Look at the end of the printf line.',
      R`#include <stdio.h>

int main() {
    printf("Level 1 complete!\n");
    return 0;
}`, [T('', 'Level 1 complete!\n')],
      R`#include <stdio.h>

int main() {
    printf("Level 1 complete!\n")
    return 0;
}`)
  ]
};

const ch_vars = {
  id: 'variables', title: 'Variables', icon: '📦', items: [
    L('types', 'Data Types',
      `A variable is a named box in memory. Its <em>type</em> says what it can hold: <code>int</code> (whole numbers), <code>float</code> / <code>double</code> (decimals) and <code>char</code> (one character). Each type takes a different amount of memory.`,
      R`#include <stdio.h>

int main() {
    printf("%zu %zu\n", sizeof(char), sizeof(int));
    return 0;
}`, '1 4',
      [q('Which type stores a single character like \'A\'?', ['int', 'char', 'float', 'void'], 1),
       q('Which type is best for the value 9.75?', ['int', 'char', 'double', 'long'], 2)]),
    L('integers', 'Integers',
      `Declare an integer with <code>int name = value;</code>. You can declare first and assign later. For very large numbers use <code>long</code>. Integers never store decimals — they cut them off.`,
      R`#include <stdio.h>

int main() {
    int lives = 3;
    lives = lives + 1;
    printf("%d\n", lives);
    return 0;
}`, '4',
      [q('What does <code>int x = 5; x = x + 2;</code> leave in x?', ['5', '2', '7', '52'], 2),
       q('Which placeholder prints an int?', ['%f', '%c', '%s', '%d'], 3)]),
    C('inventory', 'Fruit basket', 'challenge', 'Beginner',
      'Create two <code>int</code> variables: <code>apples = 12</code> and <code>oranges = 8</code>. Print their total as <code>Total fruit: 20</code>.', 'printf("Total fruit: %d\\n", apples + oranges);',
      R`#include <stdio.h>

int main() {
    //>>
    int apples = 12;
    int oranges = 8;
    printf("Total fruit: %d\n", apples + oranges);
    //<<
    return 0;
}`, [T('', 'Total fruit: 20\n')]),
    L('floats', 'Floats & Doubles',
      `Use <code>double</code> for decimals (it is more precise than <code>float</code>). Print with <code>%f</code>, and control the digits after the point with <code>%.2f</code> (two decimals).`,
      R`#include <stdio.h>

int main() {
    double pi = 3.14159;
    printf("%.2f\n", pi);
    return 0;
}`, '3.14',
      [q('What does <code>printf("%.1f", 2.55);</code> style formatting control?', ['The width of the screen', 'How many digits appear after the decimal point', 'The variable name', 'The program speed'], 1),
       q('Which type keeps decimals?', ['int', 'char', 'double', 'short'], 2)]),
    L('chars', 'Characters',
      `A <code>char</code> holds one character in single quotes: <code>'A'</code>. Internally it is a small number (its ASCII code), so <code>'A'</code> is 65. Print it as a letter with <code>%c</code> or as a number with <code>%d</code>.`,
      R`#include <stdio.h>

int main() {
    char grade = 'B';
    printf("%c %d\n", grade, grade);
    return 0;
}`, 'B 66',
      [q('What is the ASCII value of \'A\'?', ['1', '65', '97', '0'], 1),
       q('Which quotes are used for a single char?', ['"double"', '\'single\'', '`back`', 'none'], 1)]),
    L('constants', 'Constants',
      `A constant never changes. Write <code>const int MAX = 10;</code> or use a preprocessor name: <code>#define PI 3.14</code>. Trying to modify a <code>const</code> is a compile error — that protects you from mistakes.`,
      R`#include <stdio.h>
#define LIVES 3

int main() {
    const int bonus = 50;
    printf("%d %d\n", LIVES, bonus);
    return 0;
}`, '3 50',
      [q('Which keyword makes a variable unchangeable?', ['static', 'const', 'fixed', 'final'], 1),
       q('What happens if you assign to a const variable?', ['It works', 'Compile error', 'It prints a warning at runtime', 'Nothing'], 1)]),
    L('printf', 'printf Basics',
      `<code>printf</code> prints text. Placeholders like <code>%d</code> are replaced by the extra arguments, in order. Escape sequences: <code>\\n</code> new line, <code>\\t</code> tab, <code>\\"</code> a quote, <code>%%</code> a percent sign.`,
      R`#include <stdio.h>

int main() {
    int x = 4, y = 6;
    printf("%d + %d = %d\n", x, y, x + y);
    return 0;
}`, '4 + 6 = 10',
      [q('What does <code>\\n</code> do?', ['Prints the letter n', 'Starts a new line', 'Ends the program', 'Adds a space'], 1),
       q('How many arguments does <code>printf("%d %d", a, b)</code> need after the string?', ['0', '1', '2', '3'], 2)]),
    L('casting', 'Type Casting',
      `Dividing two ints gives an int: <code>7 / 2</code> is <code>3</code>. To keep the decimals, convert one side first with a <em>cast</em>: <code>(double)7 / 2</code> is <code>3.5</code>.`,
      R`#include <stdio.h>

int main() {
    int a = 7, b = 2;
    printf("%d %.1f\n", a / b, (double)a / b);
    return 0;
}`, '3 3.5',
      [q('What is <code>9 / 2</code> in C when both are ints?', ['4.5', '4', '5', '4.0'], 1),
       q('Which expression gives 2.5?', ['5 / 2', '(double)5 / 2', '5 % 2', 'int(5) / 2'], 1)]),
    C('debug-format', 'Bug Hunter: Wrong placeholder', 'debug', 'Beginner',
      'Expected output: <code>Score: 10</code>. Instead the output is garbage. Why?', 'The variable is an int. Which placeholder matches an int?',
      R`#include <stdio.h>

int main() {
    int score = 10;
    printf("Score: %d\n", score);
    return 0;
}`, [T('', 'Score: 10\n')],
      R`#include <stdio.h>

int main() {
    int score = 10;
    printf("Score: %f\n", score);
    return 0;
}`),
    C('recap-vars', 'Recap Challenge: Rectangle', 'recap', 'Easy',
      'A rectangle is <code>7</code> wide and <code>3</code> tall. Store both in variables and print two lines:<pre>Area: 21\nPerimeter: 20</pre>', 'area = w * h, perimeter = 2 * (w + h)',
      R`#include <stdio.h>

int main() {
    //>>
    int w = 7, h = 3;
    printf("Area: %d\n", w * h);
    printf("Perimeter: %d\n", 2 * (w + h));
    //<<
    return 0;
}`, [T('', 'Area: 21\nPerimeter: 20\n')])
  ]
};

const ch_ops = {
  id: 'operators', title: 'Operators', icon: '🧮', items: [
    L('arith', 'Arithmetic Operators',
      `C has <code>+  -  *  /</code>. Multiplication and division happen before addition and subtraction; use parentheses to change the order. Remember: int ÷ int drops the fraction.`,
      R`#include <stdio.h>

int main() {
    printf("%d\n", 2 + 3 * 4);
    printf("%d\n", (2 + 3) * 4);
    return 0;
}`, '14\n20',
      [q('What is <code>2 + 3 * 4</code>?', ['20', '14', '24', '9'], 1, 'Multiplication first: 3*4 = 12, then +2.'),
       q('What is <code>10 / 4</code> with ints?', ['2.5', '2', '3', '4'], 1)]),
    L('modulo', 'Modulo Operator',
      `<code>%</code> gives the remainder after division: <code>17 % 5</code> is <code>2</code>. It is perfect for checking even/odd (<code>n % 2</code>), getting the last digit (<code>n % 10</code>) or wrapping around.`,
      R`#include <stdio.h>

int main() {
    printf("%d %d\n", 17 % 5, 20 % 4);
    return 0;
}`, '2 0',
      [q('What is <code>17 % 5</code>?', ['3', '2', '12', '0'], 1),
       q('<code>n % 2 == 0</code> is true when n is…', ['odd', 'even', 'negative', 'zero only'], 1)]),
    C('last-digit', 'Last digit', 'challenge', 'Easy',
      'Read an integer and print its last digit. (The starter already reads the number for you.)', 'Use n % 10.',
      R`#include <stdio.h>

int main() {
    int n;
    scanf("%d", &n);
    //>>
    printf("%d\n", n % 10);
    //<<
    return 0;
}`, [T('1234\n', '4\n'), T('7\n', '7\n'), T('90\n', '0\n')]),
    L('incdec', 'Increment & Decrement',
      `<code>i++</code> adds 1 and <code>i--</code> subtracts 1. As a prefix (<code>++i</code>) the change happens <em>before</em> the value is used; as a postfix (<code>i++</code>) it happens <em>after</em>.`,
      R`#include <stdio.h>

int main() {
    int i = 5;
    printf("%d ", i++);
    printf("%d\n", i);
    return 0;
}`, '5 6',
      [q('If <code>int i = 5;</code>, what does <code>printf("%d", ++i);</code> print?', ['5', '6', '4', '7'], 1),
       q('If <code>int i = 5;</code>, what does <code>printf("%d", i--);</code> print?', ['5', '4', '6', '0'], 0, 'Postfix uses the old value first.')]),
    L('assign', 'Assignment Operators',
      `Shortcuts combine an operation and an assignment: <code>x += 3</code> means <code>x = x + 3</code>. Also <code>-=  *=  /=  %=</code>.`,
      R`#include <stdio.h>

int main() {
    int x = 10;
    x += 5;
    x *= 2;
    printf("%d\n", x);
    return 0;
}`, '30',
      [q('<code>x = 4; x *= 3;</code> leaves x as…', ['7', '12', '1', '43'], 1),
       q('<code>x -= 2</code> is the same as…', ['x = 2 - x', 'x = x - 2', 'x = -2', 'x == x - 2'], 1)]),
    L('relational', 'Relational Operators',
      `Comparisons <code>==  !=  <  >  <=  >=</code> produce <code>1</code> (true) or <code>0</code> (false). Beware: <code>=</code> assigns, <code>==</code> compares.`,
      R`#include <stdio.h>

int main() {
    printf("%d %d\n", 5 > 3, 5 == 6);
    return 0;
}`, '1 0',
      [q('What does <code>3 != 4</code> evaluate to?', ['0', '1', '3', '4'], 1),
       q('Which operator tests equality?', ['=', '==', '=>', ':='], 1)]),
    L('logical', 'Logical Operators',
      `<code>&&</code> (and) is true when both sides are true, <code>||</code> (or) when at least one is, and <code>!</code> (not) flips true/false. They let you build bigger conditions.`,
      R`#include <stdio.h>

int main() {
    int age = 20;
    printf("%d\n", age >= 18 && age < 65);
    return 0;
}`, '1',
      [q('<code>(1 && 0)</code> is…', ['1', '0', '2', 'error'], 1),
       q('<code>!0</code> is…', ['0', '1', '-1', 'error'], 1)]),
    C('recap-leap', 'Recap Challenge: Leap year', 'recap', 'Easy',
      'A year is a leap year if it is divisible by 4 but not by 100, <b>or</b> divisible by 400. Read a year and print <code>1</code> if it is a leap year, otherwise <code>0</code>.', 'Combine && and || inside one printf.',
      R`#include <stdio.h>

int main() {
    int y;
    scanf("%d", &y);
    //>>
    printf("%d\n", (y % 4 == 0 && y % 100 != 0) || y % 400 == 0);
    //<<
    return 0;
}`, [T('2024\n', '1\n'), T('1900\n', '0\n'), T('2000\n', '1\n'), T('2023\n', '0\n')])
  ]
};

const ch_flow = {
  id: 'control-flow', title: 'Control Flow', icon: '🔀', items: [
    L('if', 'If Statement',
      `An <code>if</code> runs its block only when the condition is true. In C, <code>0</code> is false and every other number is true.`,
      R`#include <stdio.h>

int main() {
    int hp = 40;
    if (hp < 50) {
        printf("Low health!\n");
    }
    return 0;
}`, 'Low health!',
      [q('When does the block after <code>if (x)</code> run?', ['When x is 0', 'When x is not 0', 'Always', 'Never'], 1),
       q('Which brackets hold the body of an if?', ['( )', '[ ]', '{ }', '< >'], 2)]),
    C('positive', 'Positive?', 'challenge', 'Beginner',
      'Read an integer. If it is greater than 0 print <code>Positive</code>. Otherwise print nothing.', 'if (n > 0) { ... }',
      R`#include <stdio.h>

int main() {
    int n;
    scanf("%d", &n);
    //>>
    if (n > 0) {
        printf("Positive\n");
    }
    //<<
    return 0;
}`, [T('5\n', 'Positive\n'), T('-2\n', ''), T('0\n', '')]),
    L('ifelse', 'If - Else',
      `Add <code>else</code> for the "otherwise" case. Exactly one of the two blocks runs.`,
      R`#include <stdio.h>

int main() {
    int n = 3;
    if (n % 2 == 0) printf("even\n");
    else printf("odd\n");
    return 0;
}`, 'odd',
      [q('How many branches of an if-else run?', ['0', 'exactly 1', '2', 'it depends'], 1),
       q('<code>else</code> runs when…', ['the if condition is true', 'the if condition is false', 'always', 'never'], 1)]),
    C('evenodd', 'Even or Odd', 'challenge', 'Beginner',
      'Read an integer. Print <code>Even</code> if it is even, otherwise <code>Odd</code>.', 'n % 2 == 0',
      R`#include <stdio.h>

int main() {
    int n;
    scanf("%d", &n);
    //>>
    if (n % 2 == 0) printf("Even\n");
    else printf("Odd\n");
    //<<
    return 0;
}`, [T('4\n', 'Even\n'), T('7\n', 'Odd\n'), T('0\n', 'Even\n'), T('-3\n', 'Odd\n')]),
    L('elseif', 'Else-If Ladder',
      `For more than two outcomes, chain <code>else if</code>. C checks them top to bottom and runs the <em>first</em> one that is true.`,
      R`#include <stdio.h>

int main() {
    int t = 25;
    if (t < 10) printf("cold\n");
    else if (t < 30) printf("nice\n");
    else printf("hot\n");
    return 0;
}`, 'nice',
      [q('With an else-if ladder, how many branches can run?', ['all true ones', 'only the first true one', 'the last one', 'none'], 1),
       q('Which comes last in a ladder?', ['if', 'else if', 'else', 'switch'], 2)]),
    C('grade', 'Grade letter', 'challenge', 'Easy',
      'Read a score (0-100). Print <code>A</code> for 90+, <code>B</code> for 80-89, <code>C</code> for 70-79, <code>D</code> for 60-69, otherwise <code>F</code>.', 'Check the highest range first.',
      R`#include <stdio.h>

int main() {
    int s;
    scanf("%d", &s);
    //>>
    if (s >= 90) printf("A\n");
    else if (s >= 80) printf("B\n");
    else if (s >= 70) printf("C\n");
    else if (s >= 60) printf("D\n");
    else printf("F\n");
    //<<
    return 0;
}`, [T('95\n', 'A\n'), T('85\n', 'B\n'), T('72\n', 'C\n'), T('60\n', 'D\n'), T('12\n', 'F\n')]),
    L('switch', 'Switch Case',
      `<code>switch</code> compares one value against many <code>case</code> labels. End each case with <code>break;</code> or execution "falls through" to the next one. <code>default</code> handles everything else.`,
      R`#include <stdio.h>

int main() {
    int day = 2;
    switch (day) {
        case 1: printf("Mon\n"); break;
        case 2: printf("Tue\n"); break;
        default: printf("Other\n");
    }
    return 0;
}`, 'Tue',
      [q('What happens if you forget <code>break</code> in a case?', ['Compile error', 'Execution falls into the next case', 'Program stops', 'Nothing'], 1),
       q('Which label handles all unmatched values?', ['else', 'other', 'default', 'catch'], 2)]),
    C('calc', 'Mini calculator', 'challenge', 'Medium',
      'Read <code>a op b</code> (for example <code>6 + 4</code>). Print the result for <code>+ - * /</code> (integer division). For any other operator print <code>Invalid</code>.', 'Use switch (op) with a case for each symbol. Note the space before %c in scanf.',
      R`#include <stdio.h>

int main() {
    int a, b;
    char op;
    scanf("%d %c %d", &a, &op, &b);
    //>>
    switch (op) {
        case '+': printf("%d\n", a + b); break;
        case '-': printf("%d\n", a - b); break;
        case '*': printf("%d\n", a * b); break;
        case '/': printf("%d\n", a / b); break;
        default: printf("Invalid\n");
    }
    //<<
    return 0;
}`, [T('6 + 4\n', '10\n'), T('6 - 4\n', '2\n'), T('6 * 4\n', '24\n'), T('9 / 2\n', '4\n'), T('8 ^ 2\n', 'Invalid\n')]),
    L('ternary', 'Ternary Operator',
      `<code>condition ? a : b</code> is a compact if-else that produces a value: it gives <code>a</code> when the condition is true, otherwise <code>b</code>.`,
      R`#include <stdio.h>

int main() {
    int n = 7;
    printf("%s\n", n % 2 == 0 ? "even" : "odd");
    return 0;
}`, 'odd',
      [q('<code>5 > 3 ? 10 : 20</code> equals…', ['10', '20', '1', '0'], 0),
       q('The ternary operator has how many parts?', ['1', '2', '3', '4'], 2)]),
    L('nested', 'Nested If-Else',
      `You can place an <code>if</code> inside another. Inner checks only run when the outer one passes — handy for "first check A, then check B" logic. Keep nesting shallow so code stays readable.`,
      R`#include <stdio.h>

int main() {
    int age = 20, ticket = 1;
    if (age >= 18) {
        if (ticket) printf("Enter\n");
        else printf("Buy a ticket\n");
    }
    return 0;
}`, 'Enter',
      [q('Does the inner if run when the outer condition is false?', ['Yes', 'No', 'Sometimes', 'Only with else'], 1),
       q('Which keeps code easier to read?', ['Very deep nesting', 'Shallow nesting', 'No braces', 'One huge line'], 1)]),
    C('debug-assign', 'Bug Hunter: One equals too few', 'debug', 'Easy',
      'x is 5, so the program should print <code>Not ten</code>. Fix the condition.', 'Is the condition comparing or assigning?',
      R`#include <stdio.h>

int main() {
    int x = 5;
    if (x == 10) {
        printf("Ten\n");
    } else {
        printf("Not ten\n");
    }
    return 0;
}`, [T('', 'Not ten\n')],
      R`#include <stdio.h>

int main() {
    int x = 5;
    if (x = 10) {
        printf("Ten\n");
    } else {
        printf("Not ten\n");
    }
    return 0;
}`),
    C('recap-max3', 'Recap Challenge: Largest of three', 'recap', 'Easy',
      'Read three integers and print the largest one.', 'Keep a variable <code>max</code> and update it.',
      R`#include <stdio.h>

int main() {
    int a, b, c;
    scanf("%d %d %d", &a, &b, &c);
    //>>
    int max = a;
    if (b > max) max = b;
    if (c > max) max = c;
    printf("%d\n", max);
    //<<
    return 0;
}`, [T('3 9 4\n', '9\n'), T('-1 -5 -3\n', '-1\n'), T('7 7 7\n', '7\n'), T('10 2 30\n', '30\n')])
  ]
};

const ch_io = {
  id: 'io', title: 'Input & Output', icon: '⌨️', items: [
    L('fmt', 'Format Specifiers',
      `Each type has its own placeholder: <code>%d</code> int, <code>%f</code> float/double, <code>%c</code> char, <code>%s</code> string. A number before the letter sets the minimum <em>width</em> (<code>%5d</code>), and <code>%.2f</code> sets the decimals.`,
      R`#include <stdio.h>

int main() {
    printf("[%5d]\n", 42);
    printf("[%.2f]\n", 2.5);
    return 0;
}`, '[   42]\n[2.50]',
      [q('Which placeholder prints a string?', ['%d', '%c', '%s', '%f'], 2),
       q('What does <code>%5d</code> do?', ['Prints 5 times', 'Pads the number to width 5', 'Prints 5 digits of decimals', 'Nothing'], 1)]),
    L('scanf', 'scanf Basics',
      `<code>scanf</code> reads input. It needs the <strong>address</strong> of each variable, so put <code>&amp;</code> in front: <code>scanf("%d", &amp;age);</code>. Strings are the exception — an array name already is an address. (A word is stored in a <code>char</code> array such as <code>char name[30]</code> — a row of letters. Arrays and strings get full lessons later; for now the starter declares it for you.)`,
      R`#include <stdio.h>

int main() {
    int n;
    scanf("%d", &n);
    printf("You typed %d\n", n);
    return 0;
}`, '(input 8)  →  You typed 8',
      [q('Why do we write <code>&amp;n</code> in scanf?', ['To make it faster', 'scanf needs the variable\'s address', 'It is decoration', 'To print n'], 1),
       q('Which call reads a decimal number into <code>double d</code>?', ['scanf("%d", &d)', 'scanf("%lf", &d)', 'scanf("%c", d)', 'scanf("%s", &d)'], 1, 'Use %lf for double (and %f for float).')]),
    C('debug-scanf', 'Bug Hunter: Lost address', 'debug', 'Easy',
      'The program should read a number and print its double. It crashes! (Try input 21)', 'scanf needs the address of the variable.',
      R`#include <stdio.h>

int main() {
    int n;
    scanf("%d", &n);
    printf("%d\n", n * 2);
    return 0;
}`, [T('21\n', '42\n'), T('5\n', '10\n')],
      R`#include <stdio.h>

int main() {
    int n;
    scanf("%d", n);
    printf("%d\n", n * 2);
    return 0;
}`),
    C('greeting', 'Greeting card', 'challenge', 'Easy',
      'Read a name (one word) and an age. Print <code>Hello NAME! Next year you will be AGE+1.</code>', 'Use %s for the name and remember age + 1.',
      R`#include <stdio.h>

int main() {
    char name[30];
    int age;
    scanf("%29s %d", name, &age);
    //>>
    printf("Hello %s! Next year you will be %d.\n", name, age + 1);
    //<<
    return 0;
}`, [T('Mia 20\n', 'Hello Mia! Next year you will be 21.\n'), T('Omar 9\n', 'Hello Omar! Next year you will be 10.\n')]),
    L('validation', 'Input Validation',
      `<code>scanf</code> returns how many values it read successfully. If the user types letters where a number is expected it returns <code>0</code>. Checking this lets your program react instead of using garbage.`,
      R`#include <stdio.h>

int main() {
    int n;
    if (scanf("%d", &n) == 1) printf("ok %d\n", n);
    else printf("not a number\n");
    return 0;
}`, '(input 12)  →  ok 12',
      [q('What does scanf return?', ['Always 0', 'The number of items read', 'The first item', 'Nothing'], 1),
       q('If the user types "abc" for <code>%d</code>, scanf returns…', ['1', '0', '-1', '3'], 1)]),
    C('recap-div', 'Recap Challenge: Safe division', 'recap', 'Medium',
      'Read two integers <code>a b</code>. If <code>b</code> is 0 print <code>Cannot divide by zero</code>. Otherwise print <code>a / b</code> with 2 decimals.', 'Cast one operand to double before dividing.',
      R`#include <stdio.h>

int main() {
    int a, b;
    scanf("%d %d", &a, &b);
    //>>
    if (b == 0) printf("Cannot divide by zero\n");
    else printf("%.2f\n", (double)a / b);
    //<<
    return 0;
}`, [T('7 2\n', '3.50\n'), T('10 0\n', 'Cannot divide by zero\n'), T('1 3\n', '0.33\n'), T('-9 2\n', '-4.50\n')])
  ]
};

const ch_loops = {
  id: 'loops', title: 'Loops', icon: '🔁', items: [
    L('for', 'For Loop',
      `<code>for (start; condition; step)</code> repeats a block. <code>for (int i = 1; i &lt;= 3; i++)</code> runs with i = 1, 2, 3. Use it when you know how many times to repeat.`,
      R`#include <stdio.h>

int main() {
    for (int i = 1; i <= 3; i++) {
        printf("%d ", i);
    }
    return 0;
}`, '1 2 3',
      [q('How many times does <code>for (int i = 0; i &lt; 4; i++)</code> run?', ['3', '4', '5', 'forever'], 1),
       q('The three parts of a for header are separated by…', ['commas', 'colons', 'semicolons', 'dots'], 2)]),
    C('count-to-n', 'Count to N', 'challenge', 'Beginner',
      'Read <code>n</code> and print the numbers <code>1</code> to <code>n</code> on one line, separated by spaces.', 'for (int i = 1; i <= n; i++)',
      R`#include <stdio.h>

int main() {
    int n;
    scanf("%d", &n);
    //>>
    for (int i = 1; i <= n; i++) {
        printf("%d ", i);
    }
    printf("\n");
    //<<
    return 0;
}`, [T('5\n', '1 2 3 4 5\n'), T('1\n', '1\n'), T('3\n', '1 2 3\n')]),
    L('while', 'While Loop',
      `<code>while (condition)</code> repeats as long as the condition is true. Something inside the loop must eventually make it false — otherwise you get an infinite loop.`,
      R`#include <stdio.h>

int main() {
    int n = 3;
    while (n > 0) {
        printf("%d ", n);
        n--;
    }
    return 0;
}`, '3 2 1',
      [q('When is the condition of a while loop checked?', ['Only once', 'Before every iteration', 'After the program ends', 'Never'], 1),
       q('What happens if nothing changes the condition?', ['Loop stops', 'Infinite loop', 'Compile error', 'Skips'], 1)]),
    C('digit-count', 'Digit counter', 'challenge', 'Easy',
      'Read a positive integer and print how many digits it has.', 'Divide by 10 in a loop and count the steps.',
      R`#include <stdio.h>

int main() {
    int n;
    scanf("%d", &n);
    //>>
    int count = 0;
    while (n > 0) {
        n /= 10;
        count++;
    }
    printf("%d\n", count);
    //<<
    return 0;
}`, [T('7\n', '1\n'), T('1234\n', '4\n'), T('100000\n', '6\n')]),
    L('dowhile', 'Do-While Loop',
      `<code>do { ... } while (condition);</code> runs the body <em>first</em> and checks afterwards, so it always runs at least once. Note the semicolon at the end.`,
      R`#include <stdio.h>

int main() {
    int i = 10;
    do {
        printf("%d\n", i);
        i++;
    } while (i < 5);
    return 0;
}`, '10',
      [q('A do-while body runs at least…', ['0 times', '1 time', '2 times', 'it depends'], 1),
       q('What ends a do-while statement?', ['}', ';', ':', 'nothing'], 1)]),
    L('breakcont', 'Break & Continue',
      `<code>break</code> leaves the loop immediately. <code>continue</code> skips the rest of this round and jumps to the next one.`,
      R`#include <stdio.h>

int main() {
    for (int i = 1; i <= 5; i++) {
        if (i == 2) continue;
        if (i == 4) break;
        printf("%d ", i);
    }
    return 0;
}`, '1 3',
      [q('What does <code>continue</code> do?', ['Ends the loop', 'Skips to the next iteration', 'Ends the program', 'Restarts the program'], 1),
       q('What does <code>break</code> do inside a loop?', ['Skips one round', 'Exits the loop', 'Pauses', 'Crashes'], 1)]),
    C('debug-offbyone', 'Bug Hunter: Off by one', 'debug', 'Easy',
      'This should print the sum of 1..5, which is <code>15</code>. It prints 10.', 'Should the loop include 5?',
      R`#include <stdio.h>

int main() {
    int sum = 0;
    for (int i = 1; i <= 5; i++) {
        sum += i;
    }
    printf("%d\n", sum);
    return 0;
}`, [T('', '15\n')],
      R`#include <stdio.h>

int main() {
    int sum = 0;
    for (int i = 1; i < 5; i++) {
        sum += i;
    }
    printf("%d\n", sum);
    return 0;
}`),
    L('nestedloops', 'Nested Loops',
      `A loop inside a loop: the inner one runs completely for every step of the outer one. Perfect for tables and grids — rows on the outside, columns on the inside.`,
      R`#include <stdio.h>

int main() {
    for (int r = 1; r <= 2; r++) {
        for (int c = 1; c <= 3; c++) printf("* ");
        printf("\n");
    }
    return 0;
}`, '* * *\n* * *',
      [q('The outer loop runs 3 times and the inner runs 4 times each. How many inner iterations in total?', ['7', '12', '34', '3'], 1),
       q('Which loop usually prints the rows of a grid?', ['The inner loop', 'The outer loop', 'Neither', 'Both equally'], 1)]),
    C('recap-table', 'Recap Challenge: Multiplication table', 'recap', 'Medium',
      'Read <code>n</code> and print an n × n multiplication table. Print every product with <code>%3d</code> (width 3) and end each row with a new line. For n = 3:<pre>  1  2  3\n  2  4  6\n  3  6  9</pre>', 'Nested for loops; newline after the inner loop.',
      R`#include <stdio.h>

int main() {
    int n;
    scanf("%d", &n);
    //>>
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= n; j++) printf("%3d", i * j);
        printf("\n");
    }
    //<<
    return 0;
}`, [T('3\n', '  1  2  3\n  2  4  6\n  3  6  9\n'), T('1\n', '  1\n'), T('4\n', '  1  2  3  4\n  2  4  6  8\n  3  6  9 12\n  4  8 12 16\n')])
  ]
};

const ch_funcs = {
  id: 'functions', title: 'Functions', icon: '⚙️', items: [
    L('declare', 'Declaring & Calling Functions',
      `A function is a named, reusable block. Define it once and call it as often as you like. <code>void</code> means it returns nothing.`,
      R`#include <stdio.h>

void cheer() {
    printf("Go GamiC!\n");
}

int main() {
    cheer();
    cheer();
    return 0;
}`, 'Go GamiC!\nGo GamiC!',
      [q('Which return type means "returns nothing"?', ['null', 'empty', 'void', 'none'], 2),
       q('How do you run a function named cheer?', ['run cheer', 'cheer();', 'call cheer', 'cheer'], 1)]),
    L('params', 'Parameters & Return Values',
      `Parameters are inputs, <code>return</code> sends a result back. The type before the name is the type of the returned value. Arguments are <strong>copied</strong> into the parameters (pass by value).`,
      R`#include <stdio.h>

int add(int a, int b) {
    return a + b;
}

int main() {
    printf("%d\n", add(2, 3));
    return 0;
}`, '5',
      [q('In <code>int add(int a, int b)</code>, what is <code>int</code> before add?', ['A parameter', 'The return type', 'A variable', 'A comment'], 1),
       q('<code>void inc(int x){ x++; }</code> called with <code>inc(a)</code>. Does a change?', ['Yes', 'No', 'Only if a is global', 'Compile error'], 1, 'x is a copy of a.')]),
    C('cube', 'Cube function', 'challenge', 'Easy',
      'Complete the function <code>cube</code> so it returns <code>n × n × n</code>. The program reads n and prints <code>cube(n)</code>.', 'return n * n * n;',
      R`#include <stdio.h>

int cube(int n) {
    //>> return 0;
    return n * n * n;
    //<<
}

int main() {
    int n;
    scanf("%d", &n);
    printf("%d\n", cube(n));
    return 0;
}`, [T('3\n', '27\n'), T('-2\n', '-8\n'), T('0\n', '0\n')]),
    L('recursion', 'Recursion Basics',
      `A function can call itself. Every recursive function needs a <strong>base case</strong> that stops the calls, plus a step that moves toward it. Example: <code>countdown(3)</code> prints 3, then calls <code>countdown(2)</code>, and so on.`,
      R`#include <stdio.h>

void countdown(int n) {
    if (n == 0) return;   // base case
    printf("%d ", n);
    countdown(n - 1);
}

int main() {
    countdown(3);
    return 0;
}`, '3 2 1',
      [q('What stops a recursive function?', ['A loop', 'The base case', 'The compiler', 'A semicolon'], 1),
       q('What happens without a base case?', ['It works', 'It never stops and crashes (stack overflow)', 'It prints nothing', 'It returns 0'], 1)]),
    C('factorial', 'Factorial', 'challenge', 'Medium',
      'Write a recursive <code>factorial(n)</code> (n! = n × (n−1) × … × 1, and 0! = 1). The program reads n and prints the result.', 'Base case: n <= 1 returns 1. Otherwise return n * factorial(n - 1).',
      R`#include <stdio.h>

int factorial(int n) {
    //>> return 0;
    if (n <= 1) return 1;
    return n * factorial(n - 1);
    //<<
}

int main() {
    int n;
    scanf("%d", &n);
    printf("%d\n", factorial(n));
    return 0;
}`, [T('5\n', '120\n'), T('0\n', '1\n'), T('1\n', '1\n'), T('7\n', '5040\n')]),
    L('prototypes', 'Function Prototypes',
      `C reads top to bottom, so a function must be known before it is called. A <em>prototype</em> (just the first line + <code>;</code>) announces it, letting you place <code>main</code> first and define the function later.`,
      R`#include <stdio.h>

int twice(int x);        // prototype

int main() {
    printf("%d\n", twice(4));
    return 0;
}

int twice(int x) {       // definition
    return x * 2;
}`, '8',
      [q('What is a function prototype?', ['The function body', 'A declaration of name, parameters and return type', 'A comment', 'A loop'], 1),
       q('Where do prototypes usually go?', ['At the end of the file', 'Above main', 'Inside a loop', 'Nowhere'], 1)]),
    C('debug-max', 'Bug Hunter: Wrong comparison', 'debug', 'Easy',
      '<code>max(7,3)</code> should be 7 and <code>max(2,9)</code> should be 9. The output should be <code>7</code> then <code>9</code>.', 'Which operator picks the bigger number?',
      R`#include <stdio.h>

int max(int a, int b) {
    if (a > b) return a;
    else return b;
}

int main() {
    printf("%d\n", max(7, 3));
    printf("%d\n", max(2, 9));
    return 0;
}`, [T('', '7\n9\n')],
      R`#include <stdio.h>

int max(int a, int b) {
    if (a < b) return a;
    else return b;
}

int main() {
    printf("%d\n", max(7, 3));
    printf("%d\n", max(2, 9));
    return 0;
}`),
    C('recap-prime', 'Recap Challenge: Prime check', 'recap', 'Medium',
      'Complete <code>isPrime(n)</code> (returns 1 if n is prime, else 0). The program prints <code>Prime</code> or <code>Not prime</code>. Remember: 1 is not prime.', 'Try dividing by every i from 2 while i * i <= n.',
      R`#include <stdio.h>

int isPrime(int n) {
    //>> return 0;
    if (n < 2) return 0;
    for (int i = 2; i * i <= n; i++) {
        if (n % i == 0) return 0;
    }
    return 1;
    //<<
}

int main() {
    int n;
    scanf("%d", &n);
    printf(isPrime(n) ? "Prime\n" : "Not prime\n");
    return 0;
}`, [T('2\n', 'Prime\n'), T('15\n', 'Not prime\n'), T('17\n', 'Prime\n'), T('1\n', 'Not prime\n'), T('49\n', 'Not prime\n')])
  ]
};

const ch_arrays = {
  id: 'arrays', title: 'Arrays', icon: '🧱', items: [
    L('arr-basics', 'Declaring & Accessing Arrays',
      `<code>int a[5];</code> creates five ints in a row. The first index is <strong>0</strong>, so valid indexes are 0 to 4. Read an element with <code>a[2]</code>. You can initialise with braces: <code>int a[3] = {10, 20, 30};</code>`,
      R`#include <stdio.h>

int main() {
    int a[3] = {10, 20, 30};
    printf("%d %d\n", a[0], a[2]);
    return 0;
}`, '10 30',
      [q('What is the index of the first element?', ['0', '1', '-1', 'depends'], 0),
       q('For <code>int a[5]</code>, the last valid index is…', ['5', '4', '6', '0'], 1)]),
    C('arr-sum', 'Array sum', 'challenge', 'Easy',
      'Read 5 integers into an array and print their sum.', 'Add each element in a for loop.',
      R`#include <stdio.h>

int main() {
    int a[5];
    for (int i = 0; i < 5; i++) scanf("%d", &a[i]);
    //>>
    int sum = 0;
    for (int i = 0; i < 5; i++) sum += a[i];
    printf("%d\n", sum);
    //<<
    return 0;
}`, [T('1 2 3 4 5\n', '15\n'), T('10 -10 5 5 0\n', '10\n'), T('7 7 7 7 7\n', '35\n')]),
    L('arr-modify', 'Modifying Elements',
      `Assign to an element like any variable: <code>a[1] = 99;</code>. Loops make it easy to change every element, for example doubling them all.`,
      R`#include <stdio.h>

int main() {
    int a[3] = {1, 2, 3};
    for (int i = 0; i < 3; i++) a[i] *= 2;
    printf("%d %d %d\n", a[0], a[1], a[2]);
    return 0;
}`, '2 4 6',
      [q('<code>int a[2] = {5, 6}; a[0] = 9;</code> makes the array…', ['{9, 6}', '{5, 9}', '{9, 9}', '{5, 6}'], 0),
       q('Which loop visits every element of <code>int a[4]</code>?', ['for (i=1;i<=4;i++)', 'for (i=0;i<4;i++)', 'for (i=0;i<=4;i++)', 'for (i=0;i<5;i++)'], 1)]),
    L('arr2d', '2D Arrays',
      `A 2D array is a table: <code>int g[2][3]</code> has 2 rows and 3 columns. Access with two indexes <code>g[row][col]</code> and walk it with nested loops.`,
      R`#include <stdio.h>

int main() {
    int g[2][3] = {{1, 2, 3}, {4, 5, 6}};
    printf("%d\n", g[1][2]);
    return 0;
}`, '6',
      [q('How many elements does <code>int g[3][4]</code> hold?', ['7', '12', '34', '3'], 1),
       q('In <code>g[1][2]</code>, the 1 is the…', ['column', 'row', 'value', 'size'], 1)]),
    L('arr-func', 'Arrays as Function Arguments',
      `When you pass an array to a function, you pass the address of its first element, so the function can change the original. Pass the length too — the function cannot know it.`,
      R`#include <stdio.h>

void zero(int a[], int n) {
    for (int i = 0; i < n; i++) a[i] = 0;
}

int main() {
    int a[3] = {4, 5, 6};
    zero(a, 3);
    printf("%d\n", a[1]);
    return 0;
}`, '0',
      [q('Can a function modify the caller\'s array?', ['No', 'Yes', 'Only strings', 'Only with const'], 1),
       q('Why pass the length as a separate parameter?', ['It is faster', 'The function does not know the array size', 'C requires it for ints', 'To avoid pointers'], 1)]),
    C('arr-reverse', 'Reverse an array', 'challenge', 'Easy',
      'Read 5 integers and print them in reverse order, separated by spaces.', 'Loop from index 4 down to 0.',
      R`#include <stdio.h>

int main() {
    int a[5];
    for (int i = 0; i < 5; i++) scanf("%d", &a[i]);
    //>>
    for (int i = 4; i >= 0; i--) printf("%d ", a[i]);
    printf("\n");
    //<<
    return 0;
}`, [T('1 2 3 4 5\n', '5 4 3 2 1\n'), T('9 0 9 1 2\n', '2 1 9 0 9\n')]),
    C('debug-oob', 'Bug Hunter: Past the end', 'debug', 'Easy',
      'The sum of {1,2,3,4,5} should be <code>15</code>, but the loop walks off the end of the array.', 'A 5-element array has indexes 0..4.',
      R`#include <stdio.h>

int main() {
    int a[5] = {1, 2, 3, 4, 5};
    int sum = 0;
    for (int i = 0; i < 5; i++) {
        sum += a[i];
    }
    printf("%d\n", sum);
    return 0;
}`, [T('', '15\n')],
      R`#include <stdio.h>

int main() {
    int a[5] = {1, 2, 3, 4, 5};
    int sum = 0;
    for (int i = 0; i <= 5; i++) {
        sum += a[i];
    }
    printf("%d\n", sum);
    return 0;
}`),
    C('recap-evens', 'Recap Challenge: Count the evens', 'recap', 'Medium',
      'Read <code>n</code>, then <code>n</code> integers. Print how many of them are even.', 'Count when a[i] % 2 == 0 (works for negatives too).',
      R`#include <stdio.h>

int main() {
    int n, a[100];
    scanf("%d", &n);
    for (int i = 0; i < n; i++) scanf("%d", &a[i]);
    //>>
    int count = 0;
    for (int i = 0; i < n; i++) if (a[i] % 2 == 0) count++;
    printf("%d\n", count);
    //<<
    return 0;
}`, [T('5\n1 2 3 4 6\n', '3\n'), T('3\n1 3 5\n', '0\n'), T('4\n2 4 6 8\n', '4\n'), T('3\n-2 -3 0\n', '2\n')])
  ]
};

const ch_final1 = {
  id: 'final-1', title: 'Final Challenges', icon: '👑', items: [
    C('final-fizzbuzz', 'Boss: FizzBuzz', 'final', 'Medium',
      'Print the numbers 1 to 15, one per line. Multiples of 3 print <code>Fizz</code>, multiples of 5 print <code>Buzz</code>, multiples of both print <code>FizzBuzz</code>.', 'Check i % 15 first!',
      R`#include <stdio.h>

int main() {
    for (int i = 1; i <= 15; i++) {
        //>>
        if (i % 15 == 0) printf("FizzBuzz\n");
        else if (i % 3 == 0) printf("Fizz\n");
        else if (i % 5 == 0) printf("Buzz\n");
        else printf("%d\n", i);
        //<<
    }
    return 0;
}`, [T('', fizz)]),
    C('final-pyramid', 'Boss: Star pyramid', 'final', 'Medium',
      'Read <code>n</code> and print a centred pyramid of <code>*</code> with n rows. Row i has i×2−1 stars, padded on the left with spaces. For n = 3:<pre>  *\n ***\n*****</pre>', 'Row i: print (n - i) spaces, then (2*i - 1) stars.',
      R`#include <stdio.h>

int main() {
    int n;
    scanf("%d", &n);
    //>>
    for (int i = 1; i <= n; i++) {
        for (int s = 0; s < n - i; s++) printf(" ");
        for (int k = 0; k < 2 * i - 1; k++) printf("*");
        printf("\n");
    }
    //<<
    return 0;
}`, [T('3\n', '  *\n ***\n*****\n'), T('1\n', '*\n'), T('4\n', '   *\n  ***\n *****\n*******\n')]),
    C('final-stats', 'Boss: Array statistics', 'final', 'Hard',
      'Read <code>n</code> then <code>n</code> integers. Print three lines: <code>Min: X</code>, <code>Max: Y</code> and <code>Average: Z</code> (average with 2 decimals).', 'Track min, max and the sum while reading.',
      R`#include <stdio.h>

int main() {
    int n;
    scanf("%d", &n);
    //>>
    int x, min = 0, max = 0, sum = 0;
    for (int i = 0; i < n; i++) {
        scanf("%d", &x);
        if (i == 0 || x < min) min = x;
        if (i == 0 || x > max) max = x;
        sum += x;
    }
    printf("Min: %d\n", min);
    printf("Max: %d\n", max);
    printf("Average: %.2f\n", (double)sum / n);
    //<<
    return 0;
}`, [T('3\n4 8 6\n', 'Min: 4\nMax: 8\nAverage: 6.00\n'), T('4\n10 20 30 41\n', 'Min: 10\nMax: 41\nAverage: 25.25\n'), T('1\n-5\n', 'Min: -5\nMax: -5\nAverage: -5.00\n')])
  ]
};

/* =========================================================
   SECTION 2 — POINTERS, STRINGS & STRUCTURES
   ========================================================= */
const ch_ptr = {
  id: 'pointers', title: 'Pointers Fundamentals', icon: '👉', items: [
    L('ptr-addr', 'Addresses & Pointers',
      `Every variable lives at an address in memory. <code>&amp;x</code> gives that address. A <em>pointer</em> is a variable that stores an address: <code>int *p = &amp;x;</code>.`,
      R`#include <stdio.h>

int main() {
    int x = 5;
    int *p = &x;
    printf("%d\n", *p);
    return 0;
}`, '5',
      [q('What does <code>&amp;x</code> give?', ['The value of x', 'The address of x', 'x squared', 'A copy of x'], 1),
       q('<code>int *p;</code> declares…', ['an int', 'a pointer to an int', 'an array', 'a function'], 1)]),
    L('ptr-deref', 'Dereferencing',
      `<code>*p</code> means "the value at the address p points to". Writing <code>*p = 9;</code> changes the original variable.`,
      R`#include <stdio.h>

int main() {
    int x = 5;
    int *p = &x;
    *p = 9;
    printf("%d\n", x);
    return 0;
}`, '9',
      [q('After <code>int x=1; int *p=&amp;x; *p=7;</code> what is x?', ['1', '7', 'an address', 'error'], 1),
       q('What is <code>*p</code> called?', ['Referencing', 'Dereferencing', 'Casting', 'Looping'], 1)]),
    C('ptr-double', 'Pointer doubler', 'challenge', 'Easy',
      'Complete <code>doubleIt</code> so it doubles the integer its pointer points to. The program reads n, calls the function and prints n.', '*p = *p * 2;',
      R`#include <stdio.h>

void doubleIt(int *p) {
    //>>
    *p = *p * 2;
    //<<
}

int main() {
    int n;
    scanf("%d", &n);
    doubleIt(&n);
    printf("%d\n", n);
    return 0;
}`, [T('4\n', '8\n'), T('-3\n', '-6\n'), T('0\n', '0\n')]),
    L('ptr-func', 'Pointers & Functions',
      `Passing a pointer lets a function change the caller's variable — the way around "pass by value". It is also how a function can effectively return more than one result.`,
      R`#include <stdio.h>

void reset(int *p) { *p = 0; }

int main() {
    int score = 80;
    reset(&score);
    printf("%d\n", score);
    return 0;
}`, '0',
      [q('How can a function modify the caller\'s int?', ['Take it by value', 'Take a pointer to it', 'Use return only', 'It cannot'], 1),
       q('You call the function with…', ['reset(score)', 'reset(&score)', 'reset(*score)', 'reset[score]'], 1)]),
    C('ptr-swap', 'The swap', 'challenge', 'Medium',
      'Complete <code>swap</code> so it exchanges two ints through pointers. The program reads a and b and prints them swapped.', 'int t = *x; *x = *y; *y = t;',
      R`#include <stdio.h>

void swap(int *x, int *y) {
    //>>
    int t = *x;
    *x = *y;
    *y = t;
    //<<
}

int main() {
    int a, b;
    scanf("%d %d", &a, &b);
    swap(&a, &b);
    printf("%d %d\n", a, b);
    return 0;
}`, [T('3 8\n', '8 3\n'), T('10 -2\n', '-2 10\n')]),
    C('debug-ptr', 'Bug Hunter: Printing the address', 'debug', 'Easy',
      'Should print <code>42</code> but prints a weird number. Fix the printf argument.', 'You want the value the pointer points to.',
      R`#include <stdio.h>

int main() {
    int x = 42;
    int *p = &x;
    printf("%d\n", *p);
    return 0;
}`, [T('', '42\n')],
      R`#include <stdio.h>

int main() {
    int x = 42;
    int *p = &x;
    printf("%d\n", p);
    return 0;
}`)
  ]
};

const ch_str = {
  id: 'strings', title: 'Strings', icon: '🔤', items: [
    L('str-basics', 'Strings are char arrays',
      `C has no string type: a string is an array of <code>char</code> that ends with a hidden <code>'\\0'</code> (null terminator). <code>char s[6] = "hello";</code> needs room for the 5 letters <em>plus</em> the terminator.`,
      R`#include <stdio.h>

int main() {
    char s[] = "hey";
    printf("%s %c\n", s, s[1]);
    return 0;
}`, 'hey e',
      [q('What marks the end of a C string?', ['A space', '\'\\0\'', '\'\\n\'', 'a period'], 1),
       q('How many chars does <code>"cat"</code> need in memory?', ['3', '4', '5', '2'], 1)]),
    L('str-lib', 'string.h Essentials',
      `<code>#include &lt;string.h&gt;</code> gives <code>strlen</code> (length), <code>strcpy</code> (copy) and <code>strcmp</code> (compare — returns 0 when equal). Never compare strings with <code>==</code>; that compares addresses.`,
      R`#include <stdio.h>
#include <string.h>

int main() {
    printf("%zu %d\n", strlen("code"), strcmp("a", "a"));
    return 0;
}`, '4 0',
      [q('<code>strcmp("a","a")</code> returns…', ['1', '0', '-1', 'true'], 1),
       q('Which function gives the length of a string?', ['size', 'len', 'strlen', 'length'], 2)]),
    C('str-vowels', 'Count vowels', 'challenge', 'Medium',
      'Read one word and print how many vowels (a, e, i, o, u — upper or lower case) it contains.', 'Use tolower from ctype.h and loop until the null terminator.',
      R`#include <stdio.h>
#include <ctype.h>

int main() {
    char w[100];
    scanf("%99s", w);
    //>>
    int count = 0;
    for (int i = 0; w[i] != '\0'; i++) {
        char c = tolower(w[i]);
        if (c == 'a' || c == 'e' || c == 'i' || c == 'o' || c == 'u') count++;
    }
    printf("%d\n", count);
    //<<
    return 0;
}`, [T('education\n', '5\n'), T('rhythm\n', '0\n'), T('Apple\n', '2\n')]),
    C('str-palin', 'Palindrome check', 'challenge', 'Medium',
      'Read a word. Print <code>Palindrome</code> if it reads the same backwards, otherwise <code>Not palindrome</code>.', 'Compare w[i] with w[len-1-i].',
      R`#include <stdio.h>
#include <string.h>

int main() {
    char w[100];
    scanf("%99s", w);
    //>>
    int len = strlen(w), ok = 1;
    for (int i = 0; i < len / 2; i++) {
        if (w[i] != w[len - 1 - i]) ok = 0;
    }
    printf(ok ? "Palindrome\n" : "Not palindrome\n");
    //<<
    return 0;
}`, [T('level\n', 'Palindrome\n'), T('hello\n', 'Not palindrome\n'), T('a\n', 'Palindrome\n'), T('abba\n', 'Palindrome\n')])
  ]
};

const ch_struct = {
  id: 'structs', title: 'Structures', icon: '🏗️', items: [
    L('struct-intro', 'Defining a struct',
      `A <code>struct</code> bundles related variables (members) into one type: <code>struct Point { int x, y; };</code>. Create one with <code>struct Point p = {3, 4};</code> and access members with a dot: <code>p.x</code>.`,
      R`#include <stdio.h>

struct Point { int x, y; };

int main() {
    struct Point p = {3, 4};
    printf("%d %d\n", p.x, p.y);
    return 0;
}`, '3 4',
      [q('Which keyword creates a custom grouped type?', ['class', 'struct', 'object', 'group'], 1),
       q('Members of a struct variable are accessed with…', ['->', '.', '::', '#'], 1)]),
    C('struct-student', 'Student record', 'challenge', 'Easy',
      'Read a name and marks into a <code>struct Student</code> and print <code>NAME scored MARKS</code>.', 'scanf("%19s %d", s.name, &s.marks);',
      R`#include <stdio.h>

struct Student {
    char name[20];
    int marks;
};

int main() {
    struct Student s;
    //>>
    scanf("%19s %d", s.name, &s.marks);
    printf("%s scored %d\n", s.name, s.marks);
    //<<
    return 0;
}`, [T('Ali 90\n', 'Ali scored 90\n'), T('Sara 75\n', 'Sara scored 75\n')]),
    L('struct-ptr', 'Pointers to structs',
      `With a pointer to a struct, use the arrow: <code>p-&gt;x</code> is shorthand for <code>(*p).x</code>. Passing a struct pointer to a function avoids copying and lets it modify the original.`,
      R`#include <stdio.h>

struct Point { int x, y; };

int main() {
    struct Point a = {3, 4};
    struct Point *p = &a;
    p->x = 10;
    printf("%d\n", a.x);
    return 0;
}`, '10',
      [q('Through a pointer p, you read member x with…', ['p.x', 'p->x', 'p::x', '*x'], 1),
       q('<code>p->x</code> equals…', ['(*p).x', '*p.x', '&p.x', 'p[x]'], 0)]),
    C('debug-arrow', 'Bug Hunter: Dot or arrow?', 'debug', 'Easy',
      'Should print <code>7</code> (3 + 4) but does not compile.', 'p is a pointer to a struct.',
      R`#include <stdio.h>

struct Point { int x, y; };

int main() {
    struct Point a = {3, 4};
    struct Point *p = &a;
    printf("%d\n", p->x + p->y);
    return 0;
}`, [T('', '7\n')],
      R`#include <stdio.h>

struct Point { int x, y; };

int main() {
    struct Point a = {3, 4};
    struct Point *p = &a;
    printf("%d\n", p.x + p.y);
    return 0;
}`),
    C('recap-rect', 'Recap Challenge: Rectangle struct', 'recap', 'Medium',
      'Read <code>w h</code> into a <code>struct Rect</code> and print two lines: <code>Area: X</code> and <code>Perimeter: Y</code>.', 'Area = w * h; perimeter = 2 * (w + h).',
      R`#include <stdio.h>

struct Rect { int w, h; };

int main() {
    struct Rect r;
    scanf("%d %d", &r.w, &r.h);
    //>>
    printf("Area: %d\n", r.w * r.h);
    printf("Perimeter: %d\n", 2 * (r.w + r.h));
    //<<
    return 0;
}`, [T('3 4\n', 'Area: 12\nPerimeter: 14\n'), T('10 1\n', 'Area: 10\nPerimeter: 22\n')])
  ]
};

const ch_project = {
  id: 'project-report', title: 'Project: Class Report', icon: '🚀', items: [
    C('proj-1', 'Part 1: Read & print records', 'project', 'Medium',
      '<b>Class Report, part 1.</b> Read <code>n</code>, then <code>n</code> students (<code>name marks</code>) into an array of structs. Print one line per student: <code>NAME: MARKS</code>.', 'Declare struct Student list[50]; read in a loop, then print in a second loop.',
      R`#include <stdio.h>

struct Student {
    char name[20];
    int marks;
};

int main() {
    int n;
    struct Student list[50];
    scanf("%d", &n);
    //>>
    for (int i = 0; i < n; i++) scanf("%19s %d", list[i].name, &list[i].marks);
    for (int i = 0; i < n; i++) printf("%s: %d\n", list[i].name, list[i].marks);
    //<<
    return 0;
}`, [T('3\nAna 80\nBen 92\nCy 70\n', 'Ana: 80\nBen: 92\nCy: 70\n'), T('1\nSolo 10\n', 'Solo: 10\n')]),
    C('proj-2', 'Part 2: Topper & average', 'project', 'Medium',
      '<b>Class Report, part 2.</b> Same input. Print <code>Top: NAME MARKS</code> for the highest marks, then <code>Average: X</code> with 2 decimals.', 'Remember the index of the best student while reading.',
      R`#include <stdio.h>

struct Student {
    char name[20];
    int marks;
};

int main() {
    int n;
    struct Student list[50];
    scanf("%d", &n);
    //>>
    int best = 0, sum = 0;
    for (int i = 0; i < n; i++) {
        scanf("%19s %d", list[i].name, &list[i].marks);
        sum += list[i].marks;
        if (list[i].marks > list[best].marks) best = i;
    }
    printf("Top: %s %d\n", list[best].name, list[best].marks);
    printf("Average: %.2f\n", (double)sum / n);
    //<<
    return 0;
}`, [T('3\nAna 80\nBen 92\nCy 70\n', 'Top: Ben 92\nAverage: 80.67\n'), T('2\nZed 55\nMia 56\n', 'Top: Mia 56\nAverage: 55.50\n')]),
    C('proj-3', 'Part 3: Grade report', 'project', 'Hard',
      '<b>Class Report, part 3 (final).</b> Same input. For each student print <code>NAME - GRADE</code> where grade is <code>A</code> (80+), <code>B</code> (60-79), <code>C</code> (40-59) or <code>F</code> (below 40). End with <code>Passed: K</code> — how many students have 40 or more.', 'Write a helper function char gradeOf(int marks).',
      R`#include <stdio.h>

struct Student {
    char name[20];
    int marks;
};

char gradeOf(int m) {
    //>> return 'F';
    if (m >= 80) return 'A';
    if (m >= 60) return 'B';
    if (m >= 40) return 'C';
    return 'F';
    //<<
}

int main() {
    int n, passed = 0;
    struct Student s;
    scanf("%d", &n);
    for (int i = 0; i < n; i++) {
        scanf("%19s %d", s.name, &s.marks);
        printf("%s - %c\n", s.name, gradeOf(s.marks));
        if (s.marks >= 40) passed++;
    }
    printf("Passed: %d\n", passed);
    return 0;
}`, [T('4\nAna 85\nBen 60\nCy 45\nDev 30\n', 'Ana - A\nBen - B\nCy - C\nDev - F\nPassed: 3\n'), T('1\nSolo 79\n', 'Solo - B\nPassed: 1\n')])
  ]
};

const extra = require('./chapters2');

// Intermediate additions
ch_str.items.push(...extra.strExtra);
{ const recap = ch_struct.items.pop(); ch_struct.items.push(...extra.structExtra, recap); }

/* ─────────── Learning-path order fixes ───────────
 * 1. printf Basics is taught right after the first int variables, before the first challenge that prints with %d.
 * 2. Input & Output comes straight after Variables (scanf is needed from the Operators chapter on).
 * 3. Its two steps that need `if` (Input Validation, Safe division) live in Control Flow, after Nested If-Else.
 * Item ids never change, so existing users keep their progress. */
const take = (ch, id) => ch.items.splice(ch.items.findIndex((i) => i.id === id), 1)[0];
ch_vars.items.splice(ch_vars.items.findIndex((i) => i.id === 'inventory'), 0, take(ch_vars, 'printf'));
const _validation = take(ch_io, 'validation');
const _safeDiv = take(ch_io, 'recap-div');
_safeDiv.type = 'challenge';
_safeDiv.title = 'Safe division';
ch_flow.items.splice(ch_flow.items.findIndex((i) => i.id === 'nested') + 1, 0, _validation, _safeDiv);

const sections = [
  { order: 1, slug: 'fundamentals', title: 'Fundamentals', icon: '🌱', description: 'Variables, input and output, operators, decisions, loops, functions and arrays — everything you need to write real programs.',
    chapters: [ch_intro, ch_vars, ch_io, ch_ops, ch_flow, ch_loops, ch_funcs, ch_arrays, ch_final1] },
  { order: 2, slug: 'intermediate', title: 'Intermediate C', icon: '🚀', description: 'Pointers, strings, dynamic memory, structures and file handling — the heart of C — finished with a class-report project.',
    chapters: [ch_ptr, extra.ptrArrays, ch_str, extra.memory, ch_struct, extra.files, ch_project] },
  { order: 3, slug: 'advanced', title: 'Advanced C', icon: '⚡', description: 'Bit tricks, macros, function pointers, algorithms, linked lists, stacks, queues and modular code — plus an inventory project.',
    chapters: extra.advanced }
];

/* =========================================================
   PRACTICE TRACK — "Coding Problems"
   ========================================================= */
const problems = [
  P('q1', 1, 'Easy', 'Sum of three', 'Read three integers and print their sum.', 'a + b + c',
    R`#include <stdio.h>

int main() {
    int a, b, c;
    scanf("%d %d %d", &a, &b, &c);
    //>>
    printf("%d\n", a + b + c);
    //<<
    return 0;
}`, [T('1 2 3\n', '6\n'), T('-5 5 10\n', '10\n')], 20),
  P('q2', 2, 'Easy', 'Square & cube', 'Read <code>n</code>. Print two lines: <code>Square: X</code> and <code>Cube: Y</code>.', 'Multiply n by itself.',
    R`#include <stdio.h>

int main() {
    int n;
    scanf("%d", &n);
    //>>
    printf("Square: %d\n", n * n);
    printf("Cube: %d\n", n * n * n);
    //<<
    return 0;
}`, [T('3\n', 'Square: 9\nCube: 27\n'), T('-2\n', 'Square: 4\nCube: -8\n')], 20),
  P('q3', 3, 'Easy', 'Sum to N', 'Read <code>n</code> and print 1 + 2 + … + n.', 'Loop and accumulate, or use n*(n+1)/2.',
    R`#include <stdio.h>

int main() {
    int n;
    scanf("%d", &n);
    //>>
    int sum = 0;
    for (int i = 1; i <= n; i++) sum += i;
    printf("%d\n", sum);
    //<<
    return 0;
}`, [T('5\n', '15\n'), T('100\n', '5050\n'), T('1\n', '1\n')], 20),
  P('q4', 4, 'Easy', 'Celsius to Fahrenheit', 'Read an integer temperature in °C and print °F with 1 decimal. F = C × 9/5 + 32.', 'Use 9.0 / 5 to avoid integer division.',
    R`#include <stdio.h>

int main() {
    int c;
    scanf("%d", &c);
    //>>
    printf("%.1f\n", c * 9.0 / 5 + 32);
    //<<
    return 0;
}`, [T('0\n', '32.0\n'), T('100\n', '212.0\n'), T('-40\n', '-40.0\n'), T('37\n', '98.6\n')], 20),
  P('q5', 5, 'Easy', 'Multiple of 3 and 5', 'Read an integer. Print <code>Yes</code> if it is divisible by both 3 and 5, otherwise <code>No</code>.', 'n % 3 == 0 && n % 5 == 0',
    R`#include <stdio.h>

int main() {
    int n;
    scanf("%d", &n);
    //>>
    printf((n % 3 == 0 && n % 5 == 0) ? "Yes\n" : "No\n");
    //<<
    return 0;
}`, [T('15\n', 'Yes\n'), T('9\n', 'No\n'), T('30\n', 'Yes\n'), T('10\n', 'No\n')], 20),
  P('q6', 6, 'Medium', 'Fibonacci number', 'The sequence starts 1, 1, 2, 3, 5, 8 … Read <code>n</code> and print the n-th Fibonacci number (n ≥ 1).', 'Keep two previous values and loop.',
    R`#include <stdio.h>

int main() {
    int n;
    scanf("%d", &n);
    //>>
    long a = 1, b = 1;
    for (int i = 3; i <= n; i++) {
        long t = a + b;
        a = b;
        b = t;
    }
    printf("%ld\n", n <= 2 ? 1 : b);
    //<<
    return 0;
}`, [T('1\n', '1\n'), T('2\n', '1\n'), T('10\n', '55\n'), T('20\n', '6765\n')], 35),
  P('q7', 7, 'Medium', 'Greatest common divisor', 'Read two positive integers and print their GCD.', 'Euclid: while (b != 0) { t = a % b; a = b; b = t; }',
    R`#include <stdio.h>

int main() {
    int a, b;
    scanf("%d %d", &a, &b);
    //>>
    while (b != 0) {
        int t = a % b;
        a = b;
        b = t;
    }
    printf("%d\n", a);
    //<<
    return 0;
}`, [T('12 18\n', '6\n'), T('17 5\n', '1\n'), T('100 75\n', '25\n')], 35),
  P('q8', 8, 'Medium', 'Digit sum', 'Read a positive integer and print the sum of its digits.', 'Use % 10 and / 10 in a loop.',
    R`#include <stdio.h>

int main() {
    int n;
    scanf("%d", &n);
    //>>
    int sum = 0;
    while (n > 0) {
        sum += n % 10;
        n /= 10;
    }
    printf("%d\n", sum);
    //<<
    return 0;
}`, [T('1234\n', '10\n'), T('9\n', '9\n'), T('99999\n', '45\n')], 35),
  P('q9', 9, 'Medium', 'Reverse a number', 'Read a positive integer and print its digits reversed (drop leading zeros of the result).', 'Build rev = rev * 10 + digit.',
    R`#include <stdio.h>

int main() {
    int n;
    scanf("%d", &n);
    //>>
    int rev = 0;
    while (n > 0) {
        rev = rev * 10 + n % 10;
        n /= 10;
    }
    printf("%d\n", rev);
    //<<
    return 0;
}`, [T('1234\n', '4321\n'), T('1200\n', '21\n'), T('5\n', '5\n')], 35),
  P('q10', 10, 'Hard', 'Armstrong number', 'An Armstrong number equals the sum of its digits each raised to the power of the digit count (153 = 1³+5³+3³). Read n and print <code>Yes</code> or <code>No</code>.', 'Count the digits first, then multiply a digit by itself that many times.',
    R`#include <stdio.h>

int main() {
    int n;
    scanf("%d", &n);
    //>>
    int digits = 0, t = n;
    while (t > 0) { digits++; t /= 10; }
    long sum = 0;
    t = n;
    while (t > 0) {
        int d = t % 10;
        long p = 1;
        for (int i = 0; i < digits; i++) p *= d;
        sum += p;
        t /= 10;
    }
    printf(sum == n ? "Yes\n" : "No\n");
    //<<
    return 0;
}`, [T('153\n', 'Yes\n'), T('9474\n', 'Yes\n'), T('123\n', 'No\n'), T('1\n', 'Yes\n')], 50),
  P('q11', 11, 'Hard', 'Sum of primes', 'Read <code>n</code> and print the sum of all prime numbers up to and including n (print 0 if there are none).', 'Test each number with trial division.',
    R`#include <stdio.h>

int main() {
    int n;
    scanf("%d", &n);
    //>>
    long sum = 0;
    for (int k = 2; k <= n; k++) {
        int prime = 1;
        for (int i = 2; i * i <= k; i++) if (k % i == 0) { prime = 0; break; }
        if (prime) sum += k;
    }
    printf("%ld\n", sum);
    //<<
    return 0;
}`, [T('10\n', '17\n'), T('2\n', '2\n'), T('30\n', '129\n'), T('1\n', '0\n')], 50),
  P('q12', 12, 'Hard', 'Binary representation', 'Read a non-negative integer and print it in binary (no leading zeros; 0 prints <code>0</code>).', 'Collect n % 2 digits, then print them in reverse.',
    R`#include <stdio.h>

int main() {
    int n;
    scanf("%d", &n);
    //>>
    if (n == 0) { printf("0\n"); return 0; }
    char bits[40];
    int len = 0;
    while (n > 0) {
        bits[len++] = '0' + n % 2;
        n /= 2;
    }
    for (int i = len - 1; i >= 0; i--) putchar(bits[i]);
    printf("\n");
    //<<
    return 0;
}`, [T('10\n', '1010\n'), T('1\n', '1\n'), T('255\n', '11111111\n'), T('0\n', '0\n')], 50)
];

problems.push(...extra.problems);
problems.push(...require('./problems3'));

// Tag every practice problem with the chapter whose concepts it needs (computed from the reference solution)
const { needsOf } = require('./prereq');
const chapterOrder = sections.flatMap((sec) => sec.chapters.map((c) => c.id));
problems.forEach((p) => { p.needs = needsOf(p.solution, chapterOrder); });

module.exports = { sections, problems };
