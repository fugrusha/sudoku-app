/**
 * 6x6 Sudoku Validator and Solver
 *
 * Rules for 6x6 Sudoku:
 * - Grid is 6x6
 * - Numbers 1-6 in each row
 * - Numbers 1-6 in each column
 * - Numbers 1-6 in each 2x3 box
 */

export type SudokuGrid = number[][];

/**
 * Check if a number is valid in a specific position
 */
export function isValidPlacement(
  grid: SudokuGrid,
  row: number,
  col: number,
  num: number
): boolean {
  // Check if num is already in the row
  for (let c = 0; c < 6; c++) {
    if (grid[row][c] === num) {
      return false;
    }
  }

  // Check if num is already in the column
  for (let r = 0; r < 6; r++) {
    if (grid[r][col] === num) {
      return false;
    }
  }

  // Check if num is already in the 2x3 box
  const boxRow = Math.floor(row / 2) * 2;
  const boxCol = Math.floor(col / 3) * 3;

  for (let r = boxRow; r < boxRow + 2; r++) {
    for (let c = boxCol; c < boxCol + 3; c++) {
      if (grid[r][c] === num) {
        return false;
      }
    }
  }

  return true;
}

/**
 * Validate a complete Sudoku solution
 */
export function validateSolution(grid: SudokuGrid): boolean {
  if (!grid || grid.length !== 6) {
    return false;
  }

  // Check each row
  for (let row = 0; row < 6; row++) {
    if (grid[row].length !== 6) {
      return false;
    }

    const seen = new Set<number>();
    for (let col = 0; col < 6; col++) {
      const num = grid[row][col];
      if (num < 1 || num > 6 || seen.has(num)) {
        return false;
      }
      seen.add(num);
    }
  }

  // Check each column
  for (let col = 0; col < 6; col++) {
    const seen = new Set<number>();
    for (let row = 0; row < 6; row++) {
      const num = grid[row][col];
      if (seen.has(num)) {
        return false;
      }
      seen.add(num);
    }
  }

  // Check each 2x3 box
  for (let boxRow = 0; boxRow < 6; boxRow += 2) {
    for (let boxCol = 0; boxCol < 6; boxCol += 3) {
      const seen = new Set<number>();
      for (let r = boxRow; r < boxRow + 2; r++) {
        for (let c = boxCol; c < boxCol + 3; c++) {
          const num = grid[r][c];
          if (seen.has(num)) {
            return false;
          }
          seen.add(num);
        }
      }
    }
  }

  return true;
}

/**
 * Find an empty cell in the grid
 */
function findEmptyCell(grid: SudokuGrid): [number, number] | null {
  for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 6; col++) {
      if (grid[row][col] === 0) {
        return [row, col];
      }
    }
  }
  return null;
}

/**
 * Solve a Sudoku puzzle using backtracking
 */
export function solveSudoku(grid: SudokuGrid): boolean {
  const emptyCell = findEmptyCell(grid);

  if (!emptyCell) {
    // No empty cells, puzzle is solved
    return true;
  }

  const [row, col] = emptyCell;

  // Try numbers 1-6
  for (let num = 1; num <= 6; num++) {
    if (isValidPlacement(grid, row, col, num)) {
      grid[row][col] = num;

      if (solveSudoku(grid)) {
        return true;
      }

      // Backtrack
      grid[row][col] = 0;
    }
  }

  return false;
}

/**
 * Deep copy a grid
 */
export function copyGrid(grid: SudokuGrid): SudokuGrid {
  return grid.map(row => [...row]);
}

/**
 * Count the number of filled cells
 */
export function countFilledCells(grid: SudokuGrid): number {
  let count = 0;
  for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 6; col++) {
      if (grid[row][col] !== 0) {
        count++;
      }
    }
  }
  return count;
}

/**
 * Check if a puzzle has a unique solution
 */
export function hasUniqueSolution(grid: SudokuGrid): boolean {
  const gridCopy1 = copyGrid(grid);
  const gridCopy2 = copyGrid(grid);

  // Solve normally
  const solved1 = solveSudoku(gridCopy1);
  if (!solved1) {
    return false;
  }

  // Try to find alternative solution by trying numbers in reverse
  let solutionCount = 0;

  function countSolutions(g: SudokuGrid, limit: number): number {
    if (solutionCount >= limit) {
      return solutionCount;
    }

    const emptyCell = findEmptyCell(g);
    if (!emptyCell) {
      solutionCount++;
      return solutionCount;
    }

    const [row, col] = emptyCell;

    for (let num = 1; num <= 6; num++) {
      if (isValidPlacement(g, row, col, num)) {
        g[row][col] = num;
        countSolutions(g, limit);
        g[row][col] = 0;
      }
    }

    return solutionCount;
  }

  return countSolutions(gridCopy2, 2) === 1;
}
