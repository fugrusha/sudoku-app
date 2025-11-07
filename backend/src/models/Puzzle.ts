import db from '../config/database.js';

export interface Puzzle {
  id: number;
  difficulty: 'easy' | 'medium' | 'hard';
  initial_board: string;
  solution: string;
  created_at: string;
}

export interface PuzzleResponse {
  id: number;
  difficulty: 'easy' | 'medium' | 'hard';
  initial_board: number[][];
}

export class PuzzleModel {
  // Get all puzzles grouped by difficulty
  static getAllByDifficulty() {
    const puzzles = db.prepare('SELECT * FROM puzzles ORDER BY difficulty, id').all() as Puzzle[];

    const grouped = {
      easy: puzzles.filter(p => p.difficulty === 'easy'),
      medium: puzzles.filter(p => p.difficulty === 'medium'),
      hard: puzzles.filter(p => p.difficulty === 'hard'),
    };

    return grouped;
  }

  // Get puzzles by difficulty
  static getByDifficulty(difficulty: string) {
    const puzzles = db.prepare('SELECT * FROM puzzles WHERE difficulty = ?').all(difficulty) as Puzzle[];
    return puzzles.map(p => ({
      id: p.id,
      difficulty: p.difficulty,
      initial_board: JSON.parse(p.initial_board),
    }));
  }

  // Get single puzzle by ID (without solution)
  static getById(id: number): PuzzleResponse | null {
    const puzzle = db.prepare('SELECT * FROM puzzles WHERE id = ?').get(id) as Puzzle | undefined;

    if (!puzzle) return null;

    return {
      id: puzzle.id,
      difficulty: puzzle.difficulty,
      initial_board: JSON.parse(puzzle.initial_board),
    };
  }

  // Validate solution
  static validateSolution(id: number, userSolution: number[][]): boolean {
    const puzzle = db.prepare('SELECT solution FROM puzzles WHERE id = ?').get(id) as { solution: string } | undefined;

    if (!puzzle) return false;

    const correctSolution = JSON.parse(puzzle.solution);

    // Compare solutions
    return JSON.stringify(userSolution) === JSON.stringify(correctSolution);
  }

  // Get all puzzles (for list view)
  static getAll() {
    const puzzles = db.prepare('SELECT id, difficulty FROM puzzles ORDER BY difficulty, id').all() as Array<{id: number, difficulty: string}>;

    const grouped: Record<string, Array<{id: number, difficulty: string}>> = {
      easy: [],
      medium: [],
      hard: [],
    };

    puzzles.forEach(p => {
      grouped[p.difficulty].push(p);
    });

    return grouped;
  }
}
