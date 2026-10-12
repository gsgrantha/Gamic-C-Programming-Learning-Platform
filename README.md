# 🎮 GamiC — Gamified Web Platform for Learning C

A full-stack learning platform for the C language: structured **Sections → Chapters → Lessons / Challenges**, a Practice track, daily & weekly **Missions**, a coin **Store**, weekly **Leaderboard** with leagues, streaks, badges, certificates and a rich **Profile**.

**Stack:** HTML5 · CSS3 · vanilla JavaScript (ES modules, SPA) · Node.js · Express · MongoDB / Atlas (Mongoose) · JWT auth · gcc (real C compiler)

## Pages
| Route | Page |
|---|---|
| `#/` | Landing page with full syllabus |
| `#/home` | Dashboard: continue learning, daily missions, weekly league, streak |
| `#/sections` · `#/section/:n` | The 3 sections and their chapters, with progress rings |
| `#/learn/:id` | Lesson or challenge page with outline sidebar, prev/next, live code editor |
| `#/practice` · `#/problem/:id` | 29 coding problems (Easy / Medium / Hard) with search & filters |
| `#/missions` | Daily (3, rotating), weekly (5) and one-time quests — claim coins |
| `#/leaderboard` · `/all` | Weekly XP and all-time rankings, podium, leagues |
| `#/store` | Spend coins: Streak Freeze, 2× XP Boost, avatars, themes, avatar frames |
| `#/profile` · `#/u/:name` | Stats, 12-week activity heatmap, certificates, badges; public profiles |
| `#/practice` · `#/practice/external` | 53 auto-judged problems (Easy / Intermediate / Hard / Advanced) + 216 curated problems on LeetCode, Codeforces, HackerRank and Beecrowd (links, personal checkmarks) |
| `#/resources` | Learning Resources: direct links to the W3Schools C tutorial, grouped by chapter (public page) |
| `#/certificate/:n` · `#/certificate/course` | Printable certificate for each finished section and a final **course** certificate — each with a unique ID |
| `#/verify/:id` | Public page that checks whether a certificate ID is genuine |

## Curriculum (all original content)
| Section | Chapters |
|---|---|
| **1 · Fundamentals** | Introduction, Variables, Operators, Control Flow, Input & Output, Loops, Functions, Arrays, Final Challenges |
| **2 · Intermediate C** | Pointers, Pointers & Arrays, Strings, Memory Management (malloc/calloc/realloc/free), Structures (+ enum, union, typedef), File Handling, Project: Class Report |
| **3 · Advanced C** | Bitwise Operators, Preprocessor & Macros, Function Pointers, Recursion & Algorithms (searching, sorting), Linked Lists, Stacks & Queues, Modular Programming, Final Challenges, Project: Inventory Manager |

Totals: **3 sections · 22 chapters · 160 items (78 lessons, 82 coding activities) · 156 quiz questions · 29 practice problems.**
Item types: Lesson, Challenge, Bug Hunter (debug), Recap Challenge, Final Challenge, Project.

## Game systems
- **XP & levels** (100 XP per level), **leagues** by total XP: Bronze → Silver → Gold → Platinum → Diamond
- **Coins**: 1 per 5 XP earned, +20 on level-up, plus mission rewards
- **Streaks** with **Streak Freezes** (bought in the store) that cover missed days
- **2× XP Boost** (30 minutes)
- **Badges**: one per chapter, one per section, plus Sharp Mind, Bug Squasher, Boss Slayer, Problem Solver, streaks, XP milestones
- **Missions** reset daily (UTC) and weekly (Monday UTC)
- **Cosmetics** equipped from the store; themes restyle the whole site

## Run it
1. Install **Node.js 18+** and **gcc** (Windows: MSYS2/MinGW-w64 · macOS: `xcode-select --install` · Linux: `sudo apt install build-essential`).
2. Create a free **MongoDB Atlas** cluster and put its string in `.env`:
   ```
   PORT=3000
   MONGO_URI=mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/gamic?retryWrites=true&w=majority
   JWT_SECRET=any-long-random-text
   ```
3. `npm install` then `npm start` → open **http://localhost:3000**
4. **After updating the project run `npm run seed`** to refresh the content in the database.

Docker: `docker compose up --build`

## Scripts
- `npm run dev` – restart on changes · `npm run seed` – (re)load content
- `npm run verify` – compiles every reference solution with gcc and checks all **111** coding activities (no database needed)

## Structure
```
server.js · config/db.js
models/      User · Section · Problem · Certificate
routes/      auth · course · activities · certificates · social (leaderboard, profile, users, badges) · missions · store
services/    certificates.js (unique IDs) · course.js (unlock rules) · runner.js (gcc sandbox) · gamification.js (XP, streaks, leagues, badges)
             missions.js · store.js
seed/        helpers.js · curriculum.js (Fundamentals + assembly) · chapters2.js (Intermediate + Advanced + problems) · seed.js
scripts/     verify-curriculum.js
public/      index.html · css/style.css · js/{app, pages2, api, ui, editor}.js
```

## API
`POST /api/auth/register|login` · `GET /api/auth/me` · `GET /api/course` · `GET /api/lessons/:id` · `GET /api/problems[/:id]`
`POST /api/activities/run` · `POST /api/activities/:id/submit` · `GET /api/missions` · `POST /api/missions/claim`
`GET /api/certificates` · `GET /api/certificates/verify/:id` (public) · `GET /api/store` · `POST /api/store/buy|equip` · `GET /api/leaderboard?scope=weekly|all` · `GET /api/profile|badges` · `GET /api/users/:name`

## Design notes (good for your viva)
- Solutions, correct options and hidden tests never leave the server; locked lessons return 403.
- XP is awarded once per activity; submissions are rate-limited and double-submit guarded.
- Code runs in a gcc sandbox: header allow-list, blocked calls (`system`, `fork`, file open…), 2 s limit, 256 MB memory limit, output cap. File-handling lessons are therefore read-only examples, except stream-based exercises (`fscanf(stdin…)`). Run the server in Docker for public hosting.
- bcrypt password hashing, JWT auth, all user text escaped before rendering.

## Adding content
Edit `seed/curriculum.js` or `seed/chapters2.js`. In a solution, wrap what the learner must write between `//>>` and `//<<` — the starter code is generated automatically. Then `npm run verify` and `npm run seed`.

## Adding practice problems
Append entries to `seed/problems3.spec.js` (never reorder — ids come from position), then run `npm run build:problems` (compiles each reference solution with gcc and writes the expected outputs), `npm run verify`, and `npm run seed`. Other-platform links live in `public/js/external.js`.

## Animations
`public/js/anim.js` (stagger, scroll-reveal, number count-up) + `public/css/animations.css`. Everything is skipped automatically when the OS asks for reduced motion.

## Quest map
`public/js/worldmap.js` + `public/css/worldmap.css` draw the winding world map at the top of every `#/section/:n` page. World names live in the `THEME` table in worldmap.js (one line per chapter id).

## Learning path (how the order was decided)
- Section 1 runs: Intro → Variables → Input & Output → Operators → Control Flow → Loops → Functions → Arrays → Final Boss. `scanf` is needed from the Operators chapter on, so input comes straight after variables; the two steps that need `if` (Input Validation, Safe division) sit in Control Flow.
- `printf Basics` is taught right after the first `int` variables, before the first challenge that prints.
- Each practice problem is tagged with the chapter it builds on (`seed/prereq.js`, computed from the reference solution). The Practice page sorts by level, then by that chapter, and offers a "Ready now" filter.
- Item ids never changed, so existing users keep their progress. Re-run `npm run seed` to apply the new order.


## Database (MongoDB / Atlas)

Everything the site shows or records is stored in MongoDB (database `gamic`):

| Collection | What it holds |
|---|---|
| `users` | Accounts, XP, streaks, coins, badges, progress, purchases, ticked external problems, login count |
| `sections` | The course: sections → chapters → lessons / challenges |
| `problems` | Practice problems (with tests and solutions) |
| `certificates` | Issued certificates |
| `storeitems` | Store products and prices |
| `missions` | Daily pool, weekly missions and quests |
| `badges` | Core badge definitions |
| `leagues` | League names and XP thresholds |
| `resourcesections` | Learning-resources (W3Schools) links |
| `externalproblems` | LeetCode / Codeforces / HackerRank / Beecrowd problem links |
| `submissions` | Log of every answer / code submission |
| `sessions` | Register / login history |

- First start fills empty collections automatically. `npm run seed` re-syncs course + catalogs from `seed/`.
- Catalog edits made in Atlas (prices, mission rewards, links...) go live within ~1 minute, no restart needed.
- `npm run db:check` lists every collection with its document count.
- Only the login token (and the sound on/off switch) stay in the browser.
"# GamiC" 
