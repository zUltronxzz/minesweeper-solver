const { describe, it } = require('node:test');
const assert = require('node:assert');
const { MinesweeperSolver } = require('../src/solver.js');

function createGrid(rows, cols, fillStatus = 'OPEN', fillVal = 0) {
  const grid = [];
  for (let r = 0; r < rows; r++) {
    const row = [];
    for (let c = 0; c < cols; c++) {
      row.push({ status: fillStatus, value: fillVal });
    }
    grid.push(row);
  }
  return grid;
}

describe('MinesweeperSolver Deduction Tiers', () => {
  it('Tier 1: Trivial Deduction - Flags obvious mine and reveals safe', () => {
    // 3x3 board
    // (0,0): OPEN, val 1
    // (0,1): HIDDEN
    // rest are OPEN, val 0
    const grid = createGrid(3, 3, 'OPEN', 0);
    grid[0][0] = { status: 'OPEN', value: 1 };
    grid[0][1] = { status: 'HIDDEN', value: null };

    const solver = new MinesweeperSolver({ rows: 3, cols: 3, totalMines: 1, grid });
    const moves = solver.findMoves();

    assert.strictEqual(moves.mineMoves.length, 1);
    assert.deepStrictEqual(moves.mineMoves[0], { r: 0, c: 1 });
    assert.strictEqual(moves.method, 'Direct Trivial Deduction');
  });

  it('Tier 2: Gaussian Elimination - Solves classic 1-2-1 pattern', () => {
    // Hidden cells on row 0: (0,0), (0,1), (0,2)
    // Clues on row 1: (1,0)=1, (1,1)=2, (1,2)=1
    // Safe below and sides.
    // In 1-2-1: (0,0) is Mine, (0,1) is Safe, (0,2) is Mine.
    const grid = createGrid(3, 3, 'OPEN', 0);
    grid[0][0] = { status: 'HIDDEN', value: null };
    grid[0][1] = { status: 'HIDDEN', value: null };
    grid[0][2] = { status: 'HIDDEN', value: null };

    grid[1][0] = { status: 'OPEN', value: 1 };
    grid[1][1] = { status: 'OPEN', value: 2 };
    grid[1][2] = { status: 'OPEN', value: 1 };

    const solver = new MinesweeperSolver({ rows: 3, cols: 3, totalMines: 2, grid });
    const moves = solver.findMoves();

    // Should find (0,1) safe and (0,0),(0,2) mines
    const safeKeys = moves.safeMoves.map(m => `${m.r},${m.c}`);
    const mineKeys = moves.mineMoves.map(m => `${m.r},${m.c}`);

    assert.ok(safeKeys.includes('0,1'), 'Cell (0,1) should be identified as safe');
    assert.ok(mineKeys.includes('0,0'), 'Cell (0,0) should be identified as mine');
    assert.ok(mineKeys.includes('0,2'), 'Cell (0,2) should be identified as mine');
  });

  it('Tier 2: Gaussian Elimination - Solves classic 1-2-2-1 pattern', () => {
    // Hidden row 0: (0,0), (0,1), (0,2), (0,3)
    // Clue row 1: (1,0)=1, (1,1)=2, (1,2)=2, (1,3)=1
    // Result: (0,0)=Safe, (0,1)=Mine, (0,2)=Mine, (0,3)=Safe
    const grid = createGrid(3, 4, 'OPEN', 0);
    grid[0][0] = { status: 'HIDDEN', value: null };
    grid[0][1] = { status: 'HIDDEN', value: null };
    grid[0][2] = { status: 'HIDDEN', value: null };
    grid[0][3] = { status: 'HIDDEN', value: null };

    grid[1][0] = { status: 'OPEN', value: 1 };
    grid[1][1] = { status: 'OPEN', value: 2 };
    grid[1][2] = { status: 'OPEN', value: 2 };
    grid[1][3] = { status: 'OPEN', value: 1 };

    const solver = new MinesweeperSolver({ rows: 3, cols: 4, totalMines: 2, grid });
    const moves = solver.findMoves();

    const safeKeys = moves.safeMoves.map(m => `${m.r},${m.c}`);
    const mineKeys = moves.mineMoves.map(m => `${m.r},${m.c}`);

    assert.ok(safeKeys.includes('0,0'), 'Cell (0,0) should be identified as safe');
    assert.ok(safeKeys.includes('0,3'), 'Cell (0,3) should be identified as safe');
    assert.ok(mineKeys.includes('0,1'), 'Cell (0,1) should be identified as mine');
    assert.ok(mineKeys.includes('0,2'), 'Cell (0,2) should be identified as mine');
  });

  it('Tier 3: Exact 50/50 Detection - Pauses and identifies 50% probability', () => {
    // Clue 1 touching exactly 2 hidden cells, nothing else
    const grid = createGrid(3, 3, 'OPEN', 0);
    grid[0][0] = { status: 'OPEN', value: 1 };
    grid[0][1] = { status: 'HIDDEN', value: null };
    grid[1][0] = { status: 'HIDDEN', value: null };

    const solver = new MinesweeperSolver({ rows: 3, cols: 3, totalMines: 1, grid });
    const moves = solver.findMoves();

    assert.strictEqual(moves.safeMoves.length, 0);
    assert.strictEqual(moves.mineMoves.length, 0);
    assert.ok(moves.bestGuess !== null, 'Best guess should be provided');
    assert.ok(moves.bestGuess.is5050, 'Should be flagged as 50/50');
    assert.strictEqual(moves.bestGuess.prob, 0.5);
  });
});
