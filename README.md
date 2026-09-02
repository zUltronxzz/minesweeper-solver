# ⚡ Minesweeper Instant Solver

A lightning-fast, zero-dependency **Minesweeper Instant Solver** bookmarklet built for [minesweeperonline.com](https://minesweeperonline.com) and any standard web Minesweeper board.

---

## 🌟 Key Features

- **⚡ 0ms Instant Solving:** Solves entire Expert boards in milliseconds using multi-tier constraint satisfaction.
- **🐢 Real-time Speed Slider:** Adjustable slider from `0ms (Instant)` up to `500ms (Slow-mo)` so you can watch the solver's logic unfold step-by-step.
- **🎲 50/50 & Probability Intelligence:** When no guaranteed safe move is possible, the solver pauses, calculates exact combinatorial probabilities, and highlights the lowest-risk tile with a percentage badge (e.g. `50.0%`).
- **🎯 Take Best Guess:** An interactive button to proceed with the optimal mathematical guess when stuck.
- **🚀 1-Click Bookmarklet:** Zero installation required — works across Chrome, Edge, Brave, Firefox, and Safari.
- **🧪 Offline Simulator:** Includes a built-in offline test dashboard and playable Minesweeper simulator (`index.html`).

---

## 🚀 How to Install and Use

### Method 1: Drag & Drop (Recommended)
1. Open `index.html` in your browser.
2. Drag the green **"⚡ Drag to Bookmarks Bar"** button directly onto your browser's bookmarks bar.
3. Navigate to **[minesweeperonline.com](https://minesweeperonline.com)**.
4. Click the bookmark in your bookmark bar — the floating HUD toolbar will appear!
5. Click **⚡ Instant Solve** (or use **▶ Step Move** / the **Speed Slider**).

### Method 2: Manual Bookmark Creation
1. Create a new bookmark in your browser.
2. Name it `⚡ Minesweeper Solver`.
3. In the URL field, paste the content of `src/bookmarklet.js` (starts with `javascript:...`).
4. Save it, go to [minesweeperonline.com](https://minesweeperonline.com), and click the bookmark.

### Method 3: Browser Console
1. Open [minesweeperonline.com](https://minesweeperonline.com).
2. Press `F12` (or Right-Click -> Inspect) and switch to the **Console** tab.
3. Paste the contents of `src/solver.js` and press Enter.

---

## 🧠 Algorithm Architecture

The solver uses a 3-tier cascade:

```
┌─────────────────────────────────────────────────────────────┐
│                 Minesweeper DOM Reader                      │
│ Reads: dimensions, revealed digits, flags, and blank tiles  │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                 Multi-Tier Deduction Engine                 │
│                                                             │
│  1. Trivial Deduction (Instant count match)                 │
│     - Saturation: remaining mines == unrevealed neighbors   │
│     - Clear: remaining mines == 0                           │
│                                                             │
│  2. Linear System / Gaussian Elimination (RREF)             │
│     - Solves overlapping subset equations (1-2-1, 1-2-2-1)  │
│     - Bounded integer inequality reductions                 │
│                                                             │
│  3. Exact Frontier Component CSP (Backtracking & Counting)  │
│     - Decomposes frontier into independent connected graphs │
│     - Enumerate all valid mine configurations               │
│     - Detects 100% deterministic safe/mine cells            │
│     - Computes exact posterior mine probabilities P(mine)   │
└──────────────────────────────┬──────────────────────────────┘
                               │
               ┌───────────────┴───────────────┐
               ▼                               ▼
       [Safe Moves Found]             [No Safe Moves / 50-50]
               │                               │
               ▼                               ▼
   Execute Click(s) based on        Highlight lowest-risk cell
    Speed Slider (0ms to 500ms)      with % badge & pause solver
```

---

## 🧪 Testing

Run the automated test suite locally:
```bash
node --test test/solver.test.js
```
