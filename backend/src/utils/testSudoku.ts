import {
  validateSolution,
  solveSudoku,
  copyGrid,
  isValidPlacement,
} from './sudokuValidator.js';
import { generatePuzzle, validatePuzzle } from './sudokuGenerator.js';

console.log('🧪 Testing Sudoku Validator and Generator\n');

// Test 1: Valid solution
console.log('Test 1: Validating a correct solution');
const validSolution = [
  [1, 2, 3, 4, 5, 6],
  [4, 5, 6, 1, 2, 3],
  [2, 3, 4, 5, 6, 1],
  [5, 6, 1, 2, 3, 4],
  [3, 1, 2, 6, 4, 5],
  [6, 4, 5, 3, 1, 2],
];
console.log('Valid solution:', validateSolution(validSolution) ? '✅ PASS' : '❌ FAIL');

// Test 2: Invalid solution (duplicate in row)
console.log('\nTest 2: Validating an invalid solution (duplicate in row)');
const invalidSolution1 = [
  [1, 1, 3, 4, 5, 6], // Two 1s in first row
  [4, 5, 6, 1, 2, 3],
  [2, 3, 4, 5, 6, 1],
  [5, 6, 1, 2, 3, 4],
  [3, 2, 2, 6, 4, 5],
  [6, 4, 5, 3, 1, 2],
];
console.log('Invalid solution:', !validateSolution(invalidSolution1) ? '✅ PASS' : '❌ FAIL');

// Test 3: Solve a puzzle
console.log('\nTest 3: Solving a puzzle');
const puzzleToSolve = [
  [1, 0, 0, 4, 0, 6],
  [0, 5, 6, 0, 2, 0],
  [2, 0, 4, 5, 0, 1],
  [5, 6, 0, 0, 3, 4],
  [0, 1, 2, 6, 0, 5],
  [6, 4, 5, 0, 1, 0],
];
const puzzleCopy = copyGrid(puzzleToSolve);
const solved = solveSudoku(puzzleCopy);
console.log('Puzzle solved:', solved ? '✅ PASS' : '❌ FAIL');
if (solved) {
  console.log('Solution is valid:', validateSolution(puzzleCopy) ? '✅ PASS' : '❌ FAIL');
}

// Test 4: Generate puzzles
console.log('\nTest 4: Generating puzzles');
const difficulties = ['easy', 'medium', 'hard'] as const;

for (const difficulty of difficulties) {
  console.log(`\n  Generating ${difficulty} puzzle...`);
  const { puzzle, solution } = generatePuzzle(difficulty);

  const clues = puzzle.flat().filter(cell => cell !== 0).length;
  console.log(`  Clues: ${clues}/36`);

  const validation = validatePuzzle(puzzle);
  console.log(`  Solvable: ${validation.solvable ? '✅' : '❌'}`);
  console.log(`  Unique: ${validation.unique ? '✅' : '❌'}`);
  console.log(`  Valid: ${validation.valid ? '✅' : '❌'}`);

  const solutionValid = validateSolution(solution);
  console.log(`  Solution valid: ${solutionValid ? '✅' : '❌'}`);
}

// Test 5: Valid placement check
console.log('\nTest 5: Testing valid placement');
const testGrid = [
  [1, 2, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
];

// Should be invalid (1 already in row)
const invalid1 = isValidPlacement(testGrid, 0, 2, 1);
console.log('Cannot place 1 in row with 1:', !invalid1 ? '✅ PASS' : '❌ FAIL');

// Should be invalid (2 already in column)
const invalid2 = isValidPlacement(testGrid, 1, 1, 2);
console.log('Cannot place 2 in column with 2:', !invalid2 ? '✅ PASS' : '❌ FAIL');

// Should be valid
const valid = isValidPlacement(testGrid, 0, 2, 3);
console.log('Can place 3 in empty cell:', valid ? '✅ PASS' : '❌ FAIL');

console.log('\n✨ All tests completed!');
