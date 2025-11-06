import { Board } from '../types/sudoku';

// Check if a board is completely filled
export function isBoardComplete(board: Board): boolean {
  return board.every(row => row.every(cell => cell !== 0));
}

// Create a deep copy of the board
export function copyBoard(board: Board): Board {
  return board.map(row => [...row]);
}

// Check if a number is valid in a specific position (for UI hints)
export function isValidMove(
  board: Board,
  row: number,
  col: number,
  num: number
): boolean {
  // Check row
  for (let i = 0; i < 6; i++) {
    if (i !== col && board[row][i] === num) {
      return false;
    }
  }

  // Check column
  for (let i = 0; i < 6; i++) {
    if (i !== row && board[i][col] === num) {
      return false;
    }
  }

  // Check 2x3 box
  const boxRow = Math.floor(row / 2) * 2;
  const boxCol = Math.floor(col / 3) * 3;

  for (let i = boxRow; i < boxRow + 2; i++) {
    for (let j = boxCol; j < boxCol + 3; j++) {
      if ((i !== row || j !== col) && board[i][j] === num) {
        return false;
      }
    }
  }

  return true;
}

// Get difficulty display name
export function getDifficultyLabel(difficulty: string): string {
  const labels: Record<string, string> = {
    easy: 'Easy',
    medium: 'Medium',
    hard: 'Hard',
  };
  return labels[difficulty] || difficulty;
}

// Get difficulty color
export function getDifficultyColor(difficulty: string): string {
  const colors: Record<string, string> = {
    easy: '#4CAF50',
    medium: '#FF9800',
    hard: '#F44336',
  };
  return colors[difficulty] || '#999';
}
