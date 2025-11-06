import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = process.env.DATABASE_PATH || path.join(__dirname, '../../database/sudoku.db');

// Create database connection
export const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Initialize database schema
export function initializeDatabase() {
  // Create puzzles table
  db.exec(`
    CREATE TABLE IF NOT EXISTS puzzles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      difficulty TEXT NOT NULL CHECK(difficulty IN ('easy', 'medium', 'hard')),
      initial_board TEXT NOT NULL,
      solution TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create user_progress table (optional for future use)
  db.exec(`
    CREATE TABLE IF NOT EXISTS user_progress (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      telegram_user_id TEXT NOT NULL,
      puzzle_id INTEGER NOT NULL,
      completed BOOLEAN DEFAULT FALSE,
      time_spent INTEGER,
      completed_at DATETIME,
      FOREIGN KEY (puzzle_id) REFERENCES puzzles(id),
      UNIQUE(telegram_user_id, puzzle_id)
    )
  `);

  console.log('Database initialized successfully');
}

export default db;
