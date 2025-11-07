import { initializeDatabase, db } from './database.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize database
initializeDatabase();

// Insert sample puzzles
const samplePuzzles = [
  // Easy puzzles
  {
    difficulty: 'easy',
    initial_board: JSON.stringify([
      [1, 0, 3, 4, 0, 6],
      [0, 5, 0, 0, 2, 0],
      [3, 0, 5, 0, 0, 1],
      [5, 0, 0, 1, 0, 3],
      [0, 3, 0, 0, 5, 0],
      [6, 0, 1, 3, 0, 4]
    ]),
    solution: JSON.stringify([
      [1, 2, 3, 4, 5, 6],
      [4, 5, 6, 1, 2, 3],
      [3, 6, 5, 2, 4, 1],
      [5, 4, 2, 1, 6, 3],
      [2, 3, 4, 6, 5, 1],
      [6, 1, 1, 3, 2, 4]
    ])
  },
  {
    difficulty: 'easy',
    initial_board: JSON.stringify([
      [0, 2, 0, 4, 5, 0],
      [4, 0, 6, 0, 0, 3],
      [0, 6, 5, 2, 0, 0],
      [5, 4, 0, 0, 6, 0],
      [0, 0, 4, 6, 0, 1],
      [6, 0, 1, 0, 2, 0]
    ]),
    solution: JSON.stringify([
      [1, 2, 3, 4, 5, 6],
      [4, 5, 6, 1, 2, 3],
      [3, 6, 5, 2, 4, 1],
      [5, 4, 2, 1, 6, 3],
      [2, 3, 4, 6, 5, 1],
      [6, 1, 1, 3, 2, 4]
    ])
  },
  // Medium puzzles
  {
    difficulty: 'medium',
    initial_board: JSON.stringify([
      [0, 0, 3, 0, 5, 0],
      [4, 0, 0, 1, 0, 0],
      [0, 6, 0, 0, 4, 0],
      [5, 0, 0, 1, 0, 0],
      [0, 3, 0, 0, 5, 1],
      [0, 0, 1, 0, 0, 4]
    ]),
    solution: JSON.stringify([
      [1, 2, 3, 4, 5, 6],
      [4, 5, 6, 1, 2, 3],
      [3, 6, 5, 2, 4, 1],
      [5, 4, 2, 1, 6, 3],
      [2, 3, 4, 6, 5, 1],
      [6, 1, 1, 3, 2, 4]
    ])
  },
  {
    difficulty: 'medium',
    initial_board: JSON.stringify([
      [1, 0, 0, 0, 5, 6],
      [0, 5, 6, 0, 0, 0],
      [3, 0, 0, 2, 0, 1],
      [0, 4, 2, 0, 0, 0],
      [2, 0, 0, 6, 0, 0],
      [0, 0, 0, 3, 2, 4]
    ]),
    solution: JSON.stringify([
      [1, 2, 3, 4, 5, 6],
      [4, 5, 6, 1, 2, 3],
      [3, 6, 5, 2, 4, 1],
      [5, 4, 2, 1, 6, 3],
      [2, 3, 4, 6, 5, 1],
      [6, 1, 1, 3, 2, 4]
    ])
  },
  // Hard puzzles
  {
    difficulty: 'hard',
    initial_board: JSON.stringify([
      [0, 0, 3, 0, 0, 6],
      [0, 5, 0, 0, 2, 0],
      [3, 0, 0, 0, 4, 0],
      [0, 4, 0, 1, 0, 0],
      [2, 0, 0, 0, 0, 1],
      [0, 0, 1, 0, 0, 0]
    ]),
    solution: JSON.stringify([
      [1, 2, 3, 4, 5, 6],
      [4, 5, 6, 1, 2, 3],
      [3, 6, 5, 2, 4, 1],
      [5, 4, 2, 1, 6, 3],
      [2, 3, 4, 6, 5, 1],
      [6, 1, 1, 3, 2, 4]
    ])
  },
  {
    difficulty: 'hard',
    initial_board: JSON.stringify([
      [1, 0, 0, 4, 0, 0],
      [0, 0, 6, 0, 2, 0],
      [0, 6, 0, 0, 0, 1],
      [5, 0, 0, 0, 6, 0],
      [0, 3, 4, 0, 0, 0],
      [0, 0, 0, 3, 0, 4]
    ]),
    solution: JSON.stringify([
      [1, 2, 3, 4, 5, 6],
      [4, 5, 6, 1, 2, 3],
      [3, 6, 5, 2, 4, 1],
      [5, 4, 2, 1, 6, 3],
      [2, 3, 4, 6, 5, 1],
      [6, 1, 1, 3, 2, 4]
    ])
  }
];

// Insert sample puzzles if table is empty
const count = db.prepare('SELECT COUNT(*) as count FROM puzzles').get() as { count: number };

if (count.count === 0) {
  const insert = db.prepare(`
    INSERT INTO puzzles (difficulty, initial_board, solution)
    VALUES (?, ?, ?)
  `);

  for (const puzzle of samplePuzzles) {
    insert.run(puzzle.difficulty, puzzle.initial_board, puzzle.solution);
  }

  console.log(`Inserted ${samplePuzzles.length} sample puzzles`);
} else {
  console.log(`Database already contains ${count.count} puzzles`);
}

db.close();
console.log('Database setup complete!');
