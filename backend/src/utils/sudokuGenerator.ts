import {
  SudokuGrid,
  copyGrid,
  solveSudoku,
  hasUniqueSolution,
  isValidPlacement,
} from './sudokuValidator.js';

/**
 * Shuffle an array in place (Fisher-Yates algorithm)
 */
function shuffleArray<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

/**
 * Generate a complete valid Sudoku solution
 */
export function generateCompleteSolution(): SudokuGrid {
  // Start with empty grid
  const grid: SudokuGrid = Array(6)
    .fill(null)
    .map(() => Array(6).fill(0));

  // Fill the grid using backtracking with randomization
  function fillGrid(g: SudokuGrid): boolean {
    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < 6; col++) {
        if (g[row][col] === 0) {
          // Try numbers in random order
          const numbers = shuffleArray([1, 2, 3, 4, 5, 6]);

          for (const num of numbers) {
            if (isValidPlacement(g, row, col, num)) {
              g[row][col] = num;

              if (fillGrid(g)) {
                return true;
              }

              g[row][col] = 0;
            }
          }

          return false;
        }
      }
    }
    return true;
  }

  fillGrid(grid);
  return grid;
}

/**
 * Difficulty levels configuration
 */
export const DIFFICULTY_CONFIG = {
  easy: {
    minClues: 24, // At least 24 cells filled (out of 36)
    maxClues: 28,
  },
  medium: {
    minClues: 20,
    maxClues: 23,
  },
  hard: {
    minClues: 16,
    maxClues: 19,
  },
};

export type Difficulty = keyof typeof DIFFICULTY_CONFIG;

/**
 * Generate a Sudoku puzzle by removing cells from a complete solution
 */
export function generatePuzzle(difficulty: Difficulty): {
  puzzle: SudokuGrid;
  solution: SudokuGrid;
} {
  const solution = generateCompleteSolution();
  const puzzle = copyGrid(solution);

  const config = DIFFICULTY_CONFIG[difficulty];
  const targetClues =
    Math.floor(Math.random() * (config.maxClues - config.minClues + 1)) +
    config.minClues;

  // Create a list of all cell positions
  const positions: Array<[number, number]> = [];
  for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 6; col++) {
      positions.push([row, col]);
    }
  }

  // Shuffle positions
  shuffleArray(positions);

  // Remove cells until we reach the target number of clues
  let currentClues = 36; // Start with full grid

  for (const [row, col] of positions) {
    if (currentClues <= targetClues) {
      break;
    }

    const temp = puzzle[row][col];
    puzzle[row][col] = 0;

    // Check if puzzle still has unique solution
    const puzzleCopy = copyGrid(puzzle);
    if (hasUniqueSolution(puzzleCopy)) {
      currentClues--;
    } else {
      // Restore the cell if it doesn't have unique solution
      puzzle[row][col] = temp;
    }
  }

  return { puzzle, solution };
}

/**
 * Generate multiple puzzles for a given difficulty
 */
export function generatePuzzleSet(
  difficulty: Difficulty,
  count: number
): Array<{ puzzle: SudokuGrid; solution: SudokuGrid }> {
  const puzzles: Array<{ puzzle: SudokuGrid; solution: SudokuGrid }> = [];

  for (let i = 0; i < count; i++) {
    puzzles.push(generatePuzzle(difficulty));
  }

  return puzzles;
}

/**
 * Validate that a puzzle is solvable and has a unique solution
 */
export function validatePuzzle(puzzle: SudokuGrid): {
  valid: boolean;
  solvable: boolean;
  unique: boolean;
} {
  const puzzleCopy = copyGrid(puzzle);

  // Check if solvable
  const solvable = solveSudoku(puzzleCopy);

  // Check if unique solution
  const puzzleCopy2 = copyGrid(puzzle);
  const unique = hasUniqueSolution(puzzleCopy2);

  return {
    valid: solvable && unique,
    solvable,
    unique,
  };
}
