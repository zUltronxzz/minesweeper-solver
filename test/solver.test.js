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
  it('Flags obvious mine and reveals safe cells directly', () => {
    const grid = createGrid(3, 3, 'OPEN', 0);
    grid[0][0] = { status: 'OPEN', value: 1 };
    grid[0][1] = { status: 'HIDDEN', value: null };

    const solver = new MinesweeperSolver({ rows: 3, cols: 3, totalMines: 1, grid });
    const moves = solver.findMoves();

    assert.strictEqual(moves.mineMoves.length, 1);
    assert.deepStrictEqual(moves.mineMoves[0], { r: 0, c: 1 });
    assert.strictEqual(moves.method, 'Direct Logic');
  });

  it('Solves 1-2-1 patterns via Gaussian linear reduction', () => {
    const grid = createGrid(3, 3, 'OPEN', 0);
    grid[0][0] = { status: 'HIDDEN', value: null };
    grid[0][1] = { status: 'HIDDEN', value: null };
    grid[0][2] = { status: 'HIDDEN', value: null };

    grid[1][0] = { status: 'OPEN', value: 1 };
    grid[1][1] = { status: 'OPEN', value: 2 };
    grid[1][2] = { status: 'OPEN', value: 1 };

    const solver = new MinesweeperSolver({ rows: 3, cols: 3, totalMines: 2, grid });
    const moves = solver.findMoves();

    const safeKeys = moves.safeMoves.map(m => `${m.r},${m.c}`);
    const mineKeys = moves.mineMoves.map(m => `${m.r},${m.c}`);

    assert.ok(safeKeys.includes('0,1'), 'Cell (0,1) should be identified as safe');
    assert.ok(mineKeys.includes('0,0'), 'Cell (0,0) should be identified as mine');
    assert.ok(mineKeys.includes('0,2'), 'Cell (0,2) should be identified as mine');
  });

  it('Solves 1-2-2-1 patterns via Gaussian linear reduction', () => {
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

  it('Accurately identifies 50/50 ambiguity and calculates exact probabilities', () => {
    const grid = createGrid(3, 3, 'OPEN', 0);
    grid[0][0] = { status: 'OPEN', value: 1 };
    grid[0][1] = { status: 'HIDDEN', value: null };
    grid[1][0] = { status: 'HIDDEN', value: null };

    const solver = new MinesweeperSolver({ rows: 3, cols: 3, totalMines: 1, grid });
    const moves = solver.findMoves();

    assert.strictEqual(moves.safeMoves.length, 0);
    assert.strictEqual(moves.mineMoves.length, 0);
    assert.ok(moves.bestGuess !== null);
    assert.ok(moves.bestGuess.is5050);
    assert.strictEqual(moves.bestGuess.prob, 0.5);
  });
});
