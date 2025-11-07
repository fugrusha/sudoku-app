import { Puzzle, PuzzleList, ValidationResponse } from '../types/sudoku';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export async function fetchPuzzleList(): Promise<PuzzleList> {
  const response = await fetch(`${API_BASE_URL}/puzzles`);
  if (!response.ok) {
    throw new Error('Failed to fetch puzzles');
  }
  return response.json();
}

export async function fetchPuzzleById(id: number): Promise<Puzzle> {
  const response = await fetch(`${API_BASE_URL}/puzzles/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch puzzle');
  }
  return response.json();
}

export async function validateSolution(
  puzzleId: number,
  solution: number[][]
): Promise<ValidationResponse> {
  const response = await fetch(`${API_BASE_URL}/puzzles/${puzzleId}/validate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ solution }),
  });

  if (!response.ok) {
    throw new Error('Failed to validate solution');
  }

  return response.json();
}
