/**
 * Source for practice problems q30+ (APPEND ONLY — ids come from position).
 * [difficulty, title, brief, hint, solution (learner writes between //>> and //<<), [stdin inputs]]
 * Run `npm run build:problems` — it compiles each solution with gcc and writes the expected outputs into problems3.js.
 */
const R = String.raw;
module.exports = [
/* ───────── Easy ───────── */
['Easy', 'Leap year', 'Read a year. Print <code>Leap</code> if it is a leap year, otherwise <code>Not leap</code>.', 'Divisible by 4, except centuries, unless divisible by 400.',
R`#include <stdio.h>

int main() {
    int y;
    scanf("%d", &y);
    //>>
    printf("%s\n", (y % 4 == 0 && y % 100 != 0) || y % 400 == 0 ? "Leap" : "Not leap");
    //<<
    return 0;
}`, ['2024\n', '1900\n', '2000\n', '2023\n']],
['Easy', 'Sum of digits', 'Read a non-negative integer and print the sum of its digits.', '<code>n % 10</code> is the last digit, <code>n / 10</code> removes it.',
R`#include <stdio.h>

int main() {
    int n, s = 0;
    scanf("%d", &n);
    //>>
    while (n > 0) { s += n % 10; n /= 10; }
    printf("%d\n", s);
    //<<
    return 0;
}`, ['1234\n', '0\n', '99999\n', '7\n']],
['Easy', 'Count vowels', 'Read one word (no spaces, up to 100 letters) and print how many vowels (a e i o u, any case) it has.', 'Convert each letter with <code>tolower</code> and compare.',
R`#include <stdio.h>
#include <ctype.h>

int main() {
    char s[101];
    int c = 0;
    scanf("%100s", s);
    //>>
    for (int i = 0; s[i]; i++) {
        char ch = tolower(s[i]);
        if (ch == 'a' || ch == 'e' || ch == 'i' || ch == 'o' || ch == 'u') c++;
    }
    printf("%d\n", c);
    //<<
    return 0;
}`, ['Education\n', 'rhythm\n', 'AEIOU\n', 'Programming\n']],
['Easy', 'Largest of three', 'Read three integers and print the largest.', 'Keep a running maximum.',
R`#include <stdio.h>

int main() {
    int a, b, c;
    scanf("%d %d %d", &a, &b, &c);
    //>>
    int m = a;
    if (b > m) m = b;
    if (c > m) m = c;
    printf("%d\n", m);
    //<<
    return 0;
}`, ['3 9 5\n', '-1 -5 -2\n', '7 7 7\n']],
['Easy', 'Reverse a number', 'Read a positive integer and print its digits reversed as a number (<code>1200</code> becomes <code>21</code>).', 'Build the result with <code>r = r * 10 + n % 10</code>.',
R`#include <stdio.h>

int main() {
    long long n, r = 0;
    scanf("%lld", &n);
    //>>
    while (n > 0) { r = r * 10 + n % 10; n /= 10; }
    printf("%lld\n", r);
    //<<
    return 0;
}`, ['1234\n', '1200\n', '5\n', '100000\n']],
['Easy', 'Multiples', 'Read <code>n k</code>. Print every multiple of <code>k</code> from <code>k</code> up to <code>n</code>, separated by spaces (at least one exists).', 'Loop <code>i += k</code>.',
R`#include <stdio.h>

int main() {
    int n, k;
    scanf("%d %d", &n, &k);
    //>>
    for (int i = k; i <= n; i += k) printf("%d ", i);
    printf("\n");
    //<<
    return 0;
}`, ['20 5\n', '10 3\n', '7 7\n', '30 10\n']],
/* ───────── Medium (Intermediate) ───────── */
['Medium', 'GCD and LCM', 'Read two positive integers. Print their GCD and LCM separated by a space.', 'Euclid: <code>gcd(a, b) = gcd(b, a % b)</code>. LCM = a / gcd * b.',
R`#include <stdio.h>

int main() {
    long long a, b;
    scanf("%lld %lld", &a, &b);
    //>>
    long long x = a, y = b;
    while (y) { long long t = x % y; x = y; y = t; }
    printf("%lld %lld\n", x, a / x * b);
    //<<
    return 0;
}`, ['12 18\n', '7 13\n', '100 75\n', '21 6\n']],
['Medium', 'Second largest', 'Read <code>n</code> and <code>n</code> integers (n ≤ 100). Print the second largest <em>distinct</em> value, or <code>NONE</code> if there is no such value.', 'Find the maximum first, then the best value strictly below it.',
R`#include <stdio.h>

int main() {
    int n, a[100];
    scanf("%d", &n);
    for (int i = 0; i < n; i++) scanf("%d", &a[i]);
    //>>
    int mx = a[0];
    for (int i = 1; i < n; i++) if (a[i] > mx) mx = a[i];
    int found = 0, sec = 0;
    for (int i = 0; i < n; i++) if (a[i] < mx && (!found || a[i] > sec)) { sec = a[i]; found = 1; }
    if (found) printf("%d\n", sec); else printf("NONE\n");
    //<<
    return 0;
}`, ['5\n4 9 9 2 7\n', '3\n5 5 5\n', '2\n-3 -8\n', '6\n1 2 3 4 5 5\n']],
['Medium', 'Palindrome word', 'Read one word (up to 100 characters). Print <code>Yes</code> if it reads the same backwards, otherwise <code>No</code>.', 'Compare <code>s[i]</code> with <code>s[len-1-i]</code>.',
R`#include <stdio.h>
#include <string.h>

int main() {
    char s[101];
    scanf("%100s", s);
    //>>
    int n = strlen(s), ok = 1;
    for (int i = 0; i < n / 2; i++) if (s[i] != s[n - 1 - i]) ok = 0;
    printf("%s\n", ok ? "Yes" : "No");
    //<<
    return 0;
}`, ['level\n', 'hello\n', 'a\n', 'abccba\n', 'abca\n']],
['Medium', 'Decimal to binary', 'Read a non-negative integer and print it in binary with no leading zeros (<code>0</code> prints <code>0</code>).', 'Collect <code>n % 2</code> while dividing by 2, then print in reverse.',
R`#include <stdio.h>

int main() {
    unsigned n;
    char b[40];
    int len = 0;
    scanf("%u", &n);
    //>>
    if (n == 0) b[len++] = '0';
    while (n > 0) { b[len++] = '0' + n % 2; n /= 2; }
    for (int i = len - 1; i >= 0; i--) putchar(b[i]);
    printf("\n");
    //<<
    return 0;
}`, ['10\n', '0\n', '255\n', '1\n', '1024\n']],
['Medium', 'Matrix transpose', 'Read <code>r c</code> and an r×c matrix (each ≤ 10). Print its transpose, one row per line.', 'The transpose has <code>c</code> rows; element (j, i) comes from (i, j).',
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
}`, ['2 3\n1 2 3\n4 5 6\n', '1 4\n9 8 7 6\n', '3 3\n1 2 3\n4 5 6\n7 8 9\n']],
['Medium', 'Prime factors', 'Read an integer n ≥ 2 and print its prime factors in ascending order, separated by spaces (<code>12</code> gives <code>2 2 3</code>).', 'Divide by each <code>d</code> while it divides n; stop when <code>d * d &gt; n</code>, and print what remains.',
R`#include <stdio.h>

int main() {
    long long n;
    scanf("%lld", &n);
    //>>
    for (long long d = 2; d * d <= n; d++)
        while (n % d == 0) { printf("%lld ", d); n /= d; }
    if (n > 1) printf("%lld", n);
    printf("\n");
    //<<
    return 0;
}`, ['12\n', '97\n', '360\n', '1000000007\n', '84\n']],
/* ───────── Hard ───────── */
['Hard', 'Longest increasing subsequence', 'Read <code>n</code> (≤ 100) and <code>n</code> integers. Print the length of the longest strictly increasing subsequence (not necessarily contiguous).', 'dp[i] = 1 + max(dp[j]) over j &lt; i with a[j] &lt; a[i].',
R`#include <stdio.h>

int main() {
    int n, a[100], dp[100], best = 0;
    scanf("%d", &n);
    for (int i = 0; i < n; i++) scanf("%d", &a[i]);
    //>>
    for (int i = 0; i < n; i++) {
        dp[i] = 1;
        for (int j = 0; j < i; j++) if (a[j] < a[i] && dp[j] + 1 > dp[i]) dp[i] = dp[j] + 1;
        if (dp[i] > best) best = dp[i];
    }
    printf("%d\n", best);
    //<<
    return 0;
}`, ['6\n10 9 2 5 3 7\n', '5\n5 4 3 2 1\n', '8\n1 3 2 4 6 5 7 8\n', '1\n42\n']],
['Hard', 'Balanced brackets', 'Read one string (no spaces, up to 100 characters) made of <code>() [] {}</code>. Print <code>Yes</code> if every bracket is closed in the right order, otherwise <code>No</code>.', 'Push opening brackets on a stack; a closing bracket must match the top.',
R`#include <stdio.h>
#include <string.h>

int main() {
    char s[101], st[101];
    int top = 0, ok = 1;
    scanf("%100s", s);
    //>>
    for (int i = 0; s[i] && ok; i++) {
        char c = s[i];
        if (c == '(' || c == '[' || c == '{') st[top++] = c;
        else if (top == 0) ok = 0;
        else {
            char o = st[--top];
            if ((c == ')' && o != '(') || (c == ']' && o != '[') || (c == '}' && o != '{')) ok = 0;
        }
    }
    printf("%s\n", ok && top == 0 ? "Yes" : "No");
    //<<
    return 0;
}`, ['([]{})\n', '([)]\n', '((\n', '{[()()]}\n', ']\n']],
['Hard', 'Count occurrences (binary search)', 'Read <code>n</code> (≤ 100), then <code>n</code> integers in non-decreasing order, then a value <code>x</code>. Print how many times <code>x</code> appears.', 'Binary-search the first position with a[i] ≥ x and the first with a[i] &gt; x; subtract.',
R`#include <stdio.h>

int main() {
    int n, a[100], x;
    scanf("%d", &n);
    for (int i = 0; i < n; i++) scanf("%d", &a[i]);
    scanf("%d", &x);
    //>>
    int lo = 0, hi = n;
    while (lo < hi) { int m = (lo + hi) / 2; if (a[m] < x) lo = m + 1; else hi = m; }
    int first = lo;
    lo = first; hi = n;
    while (lo < hi) { int m = (lo + hi) / 2; if (a[m] <= x) lo = m + 1; else hi = m; }
    printf("%d\n", lo - first);
    //<<
    return 0;
}`, ['7\n1 2 2 2 5 7 9\n2\n', '5\n1 3 5 7 9\n4\n', '4\n6 6 6 6\n6\n', '3\n1 2 3\n9\n']],
['Hard', 'Minimum coins', 'Read <code>amount m</code>, then <code>m</code> coin values (unlimited supply of each). Print the fewest coins that sum to <code>amount</code>, or <code>-1</code> if impossible.', 'dp[x] = 1 + min(dp[x - coin]) over coins that fit.',
R`#include <stdio.h>

int main() {
    int amount, m, c[20], dp[1001];
    scanf("%d %d", &amount, &m);
    for (int i = 0; i < m; i++) scanf("%d", &c[i]);
    //>>
    dp[0] = 0;
    for (int x = 1; x <= amount; x++) {
        dp[x] = -1;
        for (int i = 0; i < m; i++)
            if (c[i] <= x && dp[x - c[i]] != -1 && (dp[x] == -1 || dp[x - c[i]] + 1 < dp[x])) dp[x] = dp[x - c[i]] + 1;
    }
    printf("%d\n", dp[amount]);
    //<<
    return 0;
}`, ['11 3\n1 2 5\n', '3 1\n2\n', '0 2\n1 5\n', '30 4\n25 10 5 1\n']],
['Hard', 'Pairs with a given sum', 'Read <code>n</code> (≤ 100), <code>n</code> integers, then a <code>target</code>. Print how many pairs <code>i &lt; j</code> have <code>a[i] + a[j] = target</code>.', 'Two nested loops: j always starts after i.',
R`#include <stdio.h>

int main() {
    int n, a[100], t, c = 0;
    scanf("%d", &n);
    for (int i = 0; i < n; i++) scanf("%d", &a[i]);
    scanf("%d", &t);
    //>>
    for (int i = 0; i < n; i++)
        for (int j = i + 1; j < n; j++) if (a[i] + a[j] == t) c++;
    printf("%d\n", c);
    //<<
    return 0;
}`, ['5\n1 5 7 -1 5\n6\n', '4\n2 2 2 2\n4\n', '3\n1 2 3\n10\n', '6\n3 3 4 4 5 1\n8\n']],
['Hard', 'Spiral order', 'Read <code>r c</code> and an r×c matrix (each ≤ 10). Print its elements in clockwise spiral order on one line.', 'Keep four borders (top, bottom, left, right) and shrink them after each side.',
R`#include <stdio.h>

int main() {
    int r, c, m[10][10];
    scanf("%d %d", &r, &c);
    for (int i = 0; i < r; i++) for (int j = 0; j < c; j++) scanf("%d", &m[i][j]);
    //>>
    int t = 0, b = r - 1, l = 0, rt = c - 1;
    while (t <= b && l <= rt) {
        for (int j = l; j <= rt; j++) printf("%d ", m[t][j]);
        t++;
        for (int i = t; i <= b; i++) printf("%d ", m[i][rt]);
        rt--;
        if (t <= b) { for (int j = rt; j >= l; j--) printf("%d ", m[b][j]); b--; }
        if (l <= rt) { for (int i = b; i >= t; i--) printf("%d ", m[i][l]); l++; }
    }
    printf("\n");
    //<<
    return 0;
}`, ['3 3\n1 2 3\n4 5 6\n7 8 9\n', '2 4\n1 2 3 4\n5 6 7 8\n', '1 3\n7 8 9\n', '4 1\n1\n2\n3\n4\n']],
/* ───────── Advanced ───────── */
['Advanced', '0/1 Knapsack', 'Read <code>n W</code> (n ≤ 50, W ≤ 1000), then <code>n</code> lines <code>weight value</code>. Print the maximum total value that fits in capacity <code>W</code>, using each item at most once.', 'dp[w] = best value with capacity w; loop w <em>downwards</em> for each item.',
R`#include <stdio.h>

int main() {
    int n, W, wt[50], val[50], dp[1001] = {0};
    scanf("%d %d", &n, &W);
    for (int i = 0; i < n; i++) scanf("%d %d", &wt[i], &val[i]);
    //>>
    for (int i = 0; i < n; i++)
        for (int w = W; w >= wt[i]; w--)
            if (dp[w - wt[i]] + val[i] > dp[w]) dp[w] = dp[w - wt[i]] + val[i];
    printf("%d\n", dp[W]);
    //<<
    return 0;
}`, ['3 50\n10 60\n20 100\n30 120\n', '4 7\n1 1\n3 4\n4 5\n5 7\n', '2 1\n2 10\n3 20\n', '1 10\n10 99\n']],
['Advanced', 'N-Queens count', 'Read <code>n</code> (1 ≤ n ≤ 9). Print the number of ways to place n queens on an n×n board so that none attack each other.', 'Place one queen per row with recursion; track used columns and both diagonals.',
R`#include <stdio.h>

int n, cnt, col[20], d1[40], d2[40];

void solve(int r) {
    if (r == n) { cnt++; return; }
    for (int c = 0; c < n; c++) {
        if (col[c] || d1[r + c] || d2[r - c + n]) continue;
        col[c] = d1[r + c] = d2[r - c + n] = 1;
        solve(r + 1);
        col[c] = d1[r + c] = d2[r - c + n] = 0;
    }
}

int main() {
    scanf("%d", &n);
    //>>
    solve(0);
    printf("%d\n", cnt);
    //<<
    return 0;
}`, ['1\n', '4\n', '6\n', '8\n']],
['Advanced', 'Longest common subsequence', 'Read two words (no spaces, up to 100 letters each). Print the length of their longest common subsequence.', 'dp[i][j]: if letters match, 1 + dp[i-1][j-1], else the larger of dp[i-1][j] and dp[i][j-1].',
R`#include <stdio.h>
#include <string.h>

int main() {
    char a[101], b[101];
    static int dp[101][101];
    scanf("%100s %100s", a, b);
    int n = strlen(a), m = strlen(b);
    //>>
    for (int i = 1; i <= n; i++)
        for (int j = 1; j <= m; j++) {
            if (a[i - 1] == b[j - 1]) dp[i][j] = dp[i - 1][j - 1] + 1;
            else dp[i][j] = dp[i - 1][j] > dp[i][j - 1] ? dp[i - 1][j] : dp[i][j - 1];
        }
    printf("%d\n", dp[n][m]);
    //<<
    return 0;
}`, ['ABCBDAB BDCABA\n', 'abc xyz\n', 'programming gaming\n', 'same same\n']],
['Advanced', 'Shortest path (Dijkstra)', 'Read <code>n m</code> (n ≤ 20), then <code>m</code> undirected edges <code>u v w</code> (nodes 0..n-1, w ≥ 1). Print the shortest distance from node 0 to node n-1, or <code>-1</code> if unreachable.', 'Repeat: pick the unvisited node with the smallest distance, then relax its edges.',
R`#include <stdio.h>

int main() {
    int n, m, g[20][20] = {{0}};
    scanf("%d %d", &n, &m);
    for (int i = 0; i < m; i++) {
        int u, v, w;
        scanf("%d %d %d", &u, &v, &w);
        if (!g[u][v] || w < g[u][v]) g[u][v] = g[v][u] = w;
    }
    //>>
    int dist[20], seen[20] = {0};
    for (int i = 0; i < n; i++) dist[i] = -1;
    dist[0] = 0;
    for (int k = 0; k < n; k++) {
        int u = -1;
        for (int i = 0; i < n; i++) if (!seen[i] && dist[i] != -1 && (u == -1 || dist[i] < dist[u])) u = i;
        if (u == -1) break;
        seen[u] = 1;
        for (int v = 0; v < n; v++)
            if (g[u][v] && (dist[v] == -1 || dist[u] + g[u][v] < dist[v])) dist[v] = dist[u] + g[u][v];
    }
    printf("%d\n", dist[n - 1]);
    //<<
    return 0;
}`, ['4 4\n0 1 1\n1 3 5\n0 2 2\n2 3 2\n', '3 1\n0 1 4\n', '1 0\n', '5 6\n0 1 7\n0 2 9\n0 4 14\n1 2 10\n2 3 11\n3 4 6\n']],
['Advanced', 'Big factorial', 'Read <code>n</code> (0 ≤ n ≤ 50) and print <code>n!</code> exactly — it is far larger than any built-in integer type.', 'Store the digits in an array and multiply the whole array by 2, 3, … n, carrying as you go.',
R`#include <stdio.h>

int main() {
    int n, d[100] = {1}, len = 1;
    scanf("%d", &n);
    //>>
    for (int k = 2; k <= n; k++) {
        int carry = 0;
        for (int i = 0; i < len; i++) { int v = d[i] * k + carry; d[i] = v % 10; carry = v / 10; }
        while (carry) { d[len++] = carry % 10; carry /= 10; }
    }
    for (int i = len - 1; i >= 0; i--) printf("%d", d[i]);
    printf("\n");
    //<<
    return 0;
}`, ['5\n', '20\n', '25\n', '50\n', '0\n']],
['Advanced', 'Edit distance', 'Read two words (no spaces, up to 100 letters each). Print the minimum number of single-letter insertions, deletions or replacements needed to turn the first word into the second.', 'dp[i][j] = dp[i-1][j-1] if letters match, else 1 + min(insert, delete, replace).',
R`#include <stdio.h>
#include <string.h>

int min3(int a, int b, int c) { int m = a < b ? a : b; return m < c ? m : c; }

int main() {
    char a[101], b[101];
    static int dp[101][101];
    scanf("%100s %100s", a, b);
    int n = strlen(a), m = strlen(b);
    //>>
    for (int i = 0; i <= n; i++) dp[i][0] = i;
    for (int j = 0; j <= m; j++) dp[0][j] = j;
    for (int i = 1; i <= n; i++)
        for (int j = 1; j <= m; j++)
            dp[i][j] = a[i - 1] == b[j - 1] ? dp[i - 1][j - 1] : 1 + min3(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    printf("%d\n", dp[n][m]);
    //<<
    return 0;
}`, ['kitten sitting\n', 'abc abc\n', 'sunday saturday\n', 'a xyz\n']]
];
