# Minesweeper Instant Solver

A lightweight bookmarklet that automatically solves [minesweeperonline.com](https://minesweeperonline.com).

## Features

- **Instant & Step Modes:** Solve the whole board in milliseconds or use the speed slider to watch each move.
- **Deduction Engine:** Uses Gaussian elimination (RREF) and connected-component backtracking (CSP) for exact logical deductions.
- **Probability & Safe Mode:** Auto-calculates exact probabilities on 50/50 guesses, with an optional Safe Mode toggle to pause on ambiguous boards.
- **Zero Install:** Runs directly in your browser as a 1-click bookmarklet.

## Installation

1. Visit the live installer: **[zultronxzz.github.io/minesweeper-solver](https://zultronxzz.github.io/minesweeper-solver/)**
2. Drag the **"⚡ Drag to Bookmarks Bar"** button into your bookmarks bar.
3. Open [minesweeperonline.com](https://minesweeperonline.com) and click the bookmark to launch the toolbar.

## Development & Testing

Run the test suite:
```bash
node --test test/solver.test.js
```

Build/minify the bookmarklet:
```bash
node build.js
```
