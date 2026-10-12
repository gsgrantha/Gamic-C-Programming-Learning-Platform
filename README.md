<div align="center">

# 🎮 GamiC

### Learn C by playing — a gamified, full-stack learning platform

Structured **Sections → Chapters → Lessons / Challenges**, a Practice track, daily & weekly **Missions**,
a coin **Store**, weekly **Leaderboard** with leagues, streaks, badges, certificates and a rich **Profile**.

<br>

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![GCC](https://img.shields.io/badge/gcc-Real%20Compiler-A8B9CC?style=for-the-badge&logo=gnu&logoColor=black)

<br>

**3** Sections &nbsp;•&nbsp; **22** Chapters &nbsp;•&nbsp; **160** Items &nbsp;•&nbsp; **156** Quiz Questions &nbsp;•&nbsp; **53** Auto-judged Problems &nbsp;•&nbsp; **216** Curated External Problems

</div>

---

## 🔭 Project Overview

### What is GamiC?

**GamiC** is a web platform that teaches the **C programming language** the way a game teaches you to play: small steps, instant feedback, rewards for progress and a reason to come back every day. Instead of reading long chapters and hoping the concepts stick, learners read a short lesson, write real C code in the browser, run it on a real compiler, and earn XP, coins and badges when it works.

### The problem it solves

Learning C is hard for beginners. Pointers, memory and compiler errors are intimidating, most tutorials are passive, and motivation drops quickly when there is no feedback. GamiC tackles this by combining:

- **Active practice** — every concept is followed by a coding challenge, a bug-hunting task or a quiz.
- **Real feedback** — code is compiled and executed with `gcc` on the server and checked against hidden test cases, so "it works" really means it works.
- **Motivation loops** — XP, levels, streaks, leagues, daily missions and a leaderboard keep learners engaged.
- **Proof of learning** — finishing a section earns a printable certificate with a unique ID that anyone can verify.

### Who is it for?

- Students taking their first programming course in C
- Self-learners who want a structured path from "Hello, World!" to linked lists and modular programs
- Teachers and institutions looking for a ready-made, trackable C course

### How a learner uses it

1. **Sign up and log in** — the account stores XP, streak, coins and progress.
2. **Follow the course** — three sections (Fundamentals, Intermediate, Advanced) made of chapters. Items unlock in order, so the path is always clear.
3. **Learn and code** — each lesson page has an outline sidebar and a live editor. Code is compiled and run on the server, and the output is compared with the expected result.
4. **Earn rewards** — correct answers give XP (once per activity). XP raises the level and league, and coins are earned along the way.
5. **Stay consistent** — daily and weekly missions, streaks and Streak Freezes encourage regular study.
6. **Practice more** — 53 auto-judged problems, plus 216 curated problems from other platforms, are sorted by difficulty and by the chapter they build on.
7. **Compete and show off** — weekly and all-time leaderboards, public profiles, badges and an activity heatmap.
8. **Get certified** — finish a section or the full course to receive a certificate that can be printed and verified online.

### How it works under the hood

| Layer | Role |
|---|---|
| **Frontend** | A single-page app in plain HTML, CSS and vanilla JavaScript (ES modules) with hash-based routing. No framework needed. |
| **Backend** | Node.js + Express REST API handling auth, course data, submissions, missions, store, certificates and leaderboards. |
| **Code runner** | A gcc sandbox that compiles and runs submitted C code with a header allow-list, blocked dangerous calls, a 2 s time limit, a 256 MB memory limit and an output cap. |
| **Database** | MongoDB (Atlas) via Mongoose, storing users, the course, problems, certificates, store items, missions, badges and submission logs. |
| **Security** | bcrypt password hashing, JWT authentication, rate-limited submissions, and solutions and hidden tests that never leave the server. |
| **Content pipeline** | Lessons and problems are written in the `seed/` folder, verified by compiling every reference solution with gcc, then loaded into the database. |

### What makes it different

- All **160 learning items** (lessons, challenges, bug hunters, recaps, finals and projects) and **156 quiz questions** are original.
- Every coding activity has a **reference solution that is compiled and tested automatically**, so the content is guaranteed to be correct.
- The **learning order** is designed deliberately (for example, input comes right after variables, and `printf` is taught before the first printing challenge).
- A full **game layer** — XP, leagues, missions, store, cosmetics and themes — sits on top of a serious technical course.

---

## ✨ Features

| | |
|---|---|
| 🧠 **Structured course** | 3 sections, 22 chapters, 78 lessons and 82 coding activities — all original content |
| 💻 **Real C compiler** | Code runs on a sandboxed `gcc` with live editor feedback |
| 🏆 **Gamification** | XP, levels, leagues, coins, streaks, badges, missions |
| 🛒 **Store** | Spend coins on Streak Freezes, 2× XP Boosts, avatars, themes and frames |
| 📈 **Leaderboards** | Weekly XP and all-time rankings with a podium and leagues |
| 🎓 **Certificates** | Printable per-section and final course certificates with unique, verifiable IDs |
| 🧩 **Practice** | 53 auto-judged problems + 216 curated problems from LeetCode, Codeforces, HackerRank & Beecrowd |
| 👤 **Profile** | Stats, 12-week activity heatmap, badges, certificates, public profiles |

---

## 📄 Pages

| Route | Page |
|---|---|
| `#/` | Landing page with the full syllabus |
| `#/home` | Dashboard: continue learning, daily missions, weekly league, streak |
| `#/sections` · `#/section/:n` | The 3 sections and their chapters, with progress rings |
| `#/learn/:id` | Lesson / challenge page with outline sidebar, prev/next and live code editor |
| `#/practice` · `#/problem/:id` | 53 auto-judged problems (Easy / Intermediate / Hard / Advanced) with search & filters |
| `#/practice/external` | 216 curated problems on LeetCode, Codeforces, HackerRank and Beecrowd (links + personal checkmarks) |
| `#/missions` | Daily (3, rotating), weekly (5) and one-time quests — claim coins |
| `#/leaderboard` · `/all` | Weekly XP and all-time rankings, podium, leagues |
| `#/store` | Streak Freeze, 2× XP Boost, avatars, themes, avatar frames |
| `#/profile` · `#/u/:name` | Stats, heatmap, certificates, badges; public profiles |
| `#/resources` | Learning Resources: W3Schools C tutorial links grouped by chapter *(public)* |
| `#/certificate/:n` · `#/certificate/course` | Printable certificate per finished section + final **course** certificate |
| `#/verify/:id` | Public page that checks whether a certificate ID is genuine |

---

## 📚 Curriculum

> All content is original.

| Section | Chapters |
|---|---|
| 🟢 **1 · Fundamentals** | Introduction, Variables, Operators, Control Flow, Input & Output, Loops, Functions, Arrays, Final Challenges |
| 🟡 **2 · Intermediate C** | Pointers, Pointers & Arrays, Strings, Memory Management (`malloc`/`calloc`/`realloc`/`free`), Structures (+ `enum`, `union`, `typedef`), File Handling, **Project:** Class Report |
| 🔴 **3 · Advanced C** | Bitwise Operators, Preprocessor & Macros, Function Pointers, Recursion & Algorithms (searching, sorting), Linked Lists, Stacks & Queues, Modular Programming, Final Challenges, **Project:** Inventory Manager |

**Totals:** 3 sections · 22 chapters · 160 items (78 lessons, 82 coding activities) · 156 quiz questions · 53 auto-judged practice problems.

**Item types:** `Lesson` · `Challenge` · `Bug Hunter` (debug) · `Recap Challenge` · `Final Challenge` · `Project`

---

## 🎯 Game Systems

- ⭐ **XP & levels** — 100 XP per level
- 🏅 **Leagues** by total XP: Bronze → Silver → Gold → Platinum → Diamond
- 🪙 **Coins** — 1 per 5 XP earned, +20 on level-up, plus mission rewards
- 🔥 **Streaks** with **Streak Freezes** (bought in the store) that cover missed days
- ⚡ **2× XP Boost** — lasts 30 minutes
- 🎖 **Badges** — one per chapter, one per section, plus *Sharp Mind*, *Bug Squasher*, *Boss Slayer*, *Problem Solver*, streaks and XP milestones
- 📅 **Missions** reset daily (UTC) and weekly (Monday UTC)
- 🎨 **Cosmetics** equipped from the store — themes restyle the whole site

---

## 🚀 Quick Start

### Prerequisites

- **Node.js 18+**
- **gcc**
  - Windows: MSYS2 / MinGW-w64
  - macOS: `xcode-select --install`
  - Linux: `sudo apt install build-essential`
- A free **MongoDB Atlas** cluster

### Setup

**1. Create a `.env` file in the project root**

```env
PORT=3000
MONGO_URI=mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/gamic?retryWrites=true&w=majority
JWT_SECRET=any-long-random-text
```

**2. Install and run**

```bash
npm install
npm start
```

**3. Open** 👉 **http://localhost:3000**

> ⚠️ **After updating the project, run `npm run seed`** to refresh the content in the database.



---

## 🛠 Scripts

| Command | Description |
|---|---|
| `npm start` | Start the server |
| `npm run dev` | Restart automatically on changes |
| `npm run seed` | (Re)load content into the database |
| `npm run verify` | Compile every reference solution with gcc and check all **111** coding activities *(no database needed)* |
| `npm run build:problems` | Compile practice-problem solutions and write expected outputs |
| `npm run db:check` | List every collection with its document count |

---

## 🗂 Project Structure

```text
gamic/
├── server.js
├── config/
│   └── db.js
├── models/          User · Section · Problem · Certificate
├── routes/          auth · course · activities · certificates
│                    social (leaderboard, profile, users, badges) · missions · store
├── services/
│   ├── certificates.js     unique IDs
│   ├── course.js           unlock rules
│   ├── runner.js           gcc sandbox
│   ├── gamification.js     XP, streaks, leagues, badges
│   ├── missions.js
│   └── store.js
├── seed/
│   ├── helpers.js
│   ├── curriculum.js       Fundamentals + assembly
│   ├── chapters2.js        Intermediate + Advanced + problems
│   └── seed.js
├── scripts/
│   └── verify-curriculum.js
└── public/
    ├── index.html
    ├── css/style.css
    └── js/                 app · pages2 · api · ui · editor
```

---

## 🔌 API

| Area | Endpoints |
|---|---|
| **Auth** | `POST /api/auth/register` · `POST /api/auth/login` · `GET /api/auth/me` |
| **Course** | `GET /api/course` · `GET /api/lessons/:id` · `GET /api/problems[/:id]` |
| **Activities** | `POST /api/activities/run` · `POST /api/activities/:id/submit` |
| **Missions** | `GET /api/missions` · `POST /api/missions/claim` |
| **Certificates** | `GET /api/certificates` · `GET /api/certificates/verify/:id` *(public)* |
| **Store** | `GET /api/store` · `POST /api/store/buy` · `POST /api/store/equip` |
| **Social** | `GET /api/leaderboard?scope=weekly\|all` · `GET /api/profile` · `GET /api/badges` · `GET /api/users/:name` |

---

## 🔒 Design Notes

> Good talking points for your viva.

- 🔐 Solutions, correct options and hidden tests **never leave the server**; locked lessons return `403`.
- 🥇 XP is awarded **once per activity**; submissions are rate-limited and double-submit guarded.
- 🧱 **Sandboxed gcc**: header allow-list, blocked calls (`system`, `fork`, file open…), 2 s time limit, 256 MB memory limit, output cap.
  - File-handling lessons are read-only examples, except stream-based exercises (`fscanf(stdin…)`).
  - Run the server in **Docker** for public hosting.
- 🔑 `bcrypt` password hashing, JWT auth, and all user text escaped before rendering.

---

## ➕ Adding Content

<details>
<summary><b>📘 Lessons & challenges</b></summary>

<br>

Edit `seed/curriculum.js` or `seed/chapters2.js`. In a solution, wrap what the learner must write between `//>>` and `//<<` — the starter code is generated automatically.

```bash
npm run verify
npm run seed
```

</details>

<details>
<summary><b>🧩 Practice problems</b></summary>

<br>

Append entries to `seed/problems3.spec.js` (**never reorder** — ids come from position), then:

```bash
npm run build:problems   # compiles each reference solution with gcc and writes expected outputs
npm run verify
npm run seed
```

Other-platform links live in `public/js/external.js`.

</details>

---

## 🎨 Animations & Quest Map

- **Animations** — `public/js/anim.js` (stagger, scroll-reveal, number count-up) + `public/css/animations.css`. Everything is skipped automatically when the OS requests reduced motion.
- **Quest map** — `public/js/worldmap.js` + `public/css/worldmap.css` draw the winding world map at the top of every `#/section/:n` page. World names live in the `THEME` table in `worldmap.js` (one line per chapter id).

---

## 🧭 Learning Path

How the order was decided:

- **Section 1** runs: Intro → Variables → Input & Output → Operators → Control Flow → Loops → Functions → Arrays → Final Boss.
- `scanf` is needed from the Operators chapter on, so input comes straight after variables; the two steps that need `if` (*Input Validation*, *Safe division*) sit in Control Flow.
- `printf Basics` is taught right after the first `int` variables, before the first challenge that prints.
- Each practice problem is tagged with the chapter it builds on (`seed/prereq.js`, computed from the reference solution). The Practice page sorts by level, then by that chapter, and offers a **"Ready now"** filter.
- Item ids never changed, so existing users keep their progress. Re-run `npm run seed` to apply the new order.

---

## 🗄 Database

Everything the site shows or records is stored in **MongoDB** (database `gamic`).

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

- First start fills empty collections automatically; `npm run seed` re-syncs the course and catalogs from `seed/`.
- Catalog edits made in Atlas (prices, mission rewards, links…) go live within ~1 minute — no restart needed.
- Only the login token (and the sound on/off switch) stay in the browser.

---

<div align="center">


⭐ If you like this project, give it a star!

</div>
