export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Puzzle {
  id: number;
  difficulty: Difficulty;
  initial_board: number[][];
}

export interface PuzzleListItem {
  id: number;
  difficulty: Difficulty;
}

export interface PuzzleList {
  easy: PuzzleListItem[];
  medium: PuzzleListItem[];
  hard: PuzzleListItem[];
}

export interface ValidationResponse {
  valid: boolean;
  message: string;
}

export type CellValue = number | 0; // 0 represents empty cell
export type Board = CellValue[][];
