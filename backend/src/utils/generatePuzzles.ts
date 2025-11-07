import { generatePuzzleSet, Difficulty, validatePuzzle } from './sudokuGenerator.js';
import { validateSolution } from './sudokuValidator.js';
import db from '../config/database.js';

/**
 * Generate and save puzzles to the database
 */
export function generateAndSavePuzzles() {
  console.log('🎮 Starting puzzle generation...\n');

  // Clear existing puzzles (optional)
  const clearExisting = true;
  if (clearExisting) {
    db.prepare('DELETE FROM puzzles').run();
    console.log('🗑️  Cleared existing puzzles\n');
  }

  const difficulties: Difficulty[] = ['easy', 'medium', 'hard'];
  const puzzlesPerDifficulty = 10; // Generate 10 puzzles per difficulty

  let totalGenerated = 0;

  for (const difficulty of difficulties) {
    console.log(`📝 Generating ${puzzlesPerDifficulty} ${difficulty} puzzles...`);

    const puzzles = generatePuzzleSet(difficulty, puzzlesPerDifficulty);

    const insert = db.prepare(`
      INSERT INTO puzzles (difficulty, initial_board, solution)
      VALUES (?, ?, ?)
    `);

    let validCount = 0;

    for (let i = 0; i < puzzles.length; i++) {
      const { puzzle, solution } = puzzles[i];

      // Validate the puzzle
      const validation = validatePuzzle(puzzle);
      const solutionValid = validateSolution(solution);

      if (validation.valid && solutionValid) {
        insert.run(
          difficulty,
          JSON.stringify(puzzle),
          JSON.stringify(solution)
        );
        validCount++;
        totalGenerated++;

        // Count clues
        const clues = puzzle.flat().filter(cell => cell !== 0).length;
        console.log(
          `  ✓ Puzzle ${i + 1}/${puzzlesPerDifficulty} - ${clues} clues`
        );
      } else {
        console.log(
          `  ✗ Puzzle ${i + 1}/${puzzlesPerDifficulty} - Invalid (regenerating...)`
        );
        // Regenerate this puzzle
        i--;
      }
    }

    console.log(`✅ Generated ${validCount} valid ${difficulty} puzzles\n`);
  }

  console.log(`\n🎉 Total puzzles generated: ${totalGenerated}`);

  // Display summary
  const summary = db.prepare(`
    SELECT difficulty, COUNT(*) as count
    FROM puzzles
    GROUP BY difficulty
  `).all();

  console.log('\n📊 Database Summary:');
  summary.forEach((row: any) => {
    console.log(`  ${row.difficulty}: ${row.count} puzzles`);
  });
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  try {
    generateAndSavePuzzles();
    console.log('\n✨ Puzzle generation complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error generating puzzles:', error);
    process.exit(1);
  }
}
