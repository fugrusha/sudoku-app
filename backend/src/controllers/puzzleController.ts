import { Request, Response } from 'express';
import { PuzzleModel } from '../models/Puzzle.js';

export class PuzzleController {
  // Get all puzzles grouped by difficulty
  static getAllPuzzles(_req: Request, res: Response) {
    try {
      const puzzles = PuzzleModel.getAll();
      res.json(puzzles);
    } catch (error) {
      console.error('Error fetching puzzles:', error);
      res.status(500).json({ error: 'Failed to fetch puzzles' });
    }
  }

  // Get puzzles by difficulty
  static getPuzzlesByDifficulty(req: Request, res: Response) {
    try {
      const { difficulty } = req.params;

      if (!['easy', 'medium', 'hard'].includes(difficulty)) {
        return res.status(400).json({ error: 'Invalid difficulty level' });
      }

      const puzzles = PuzzleModel.getByDifficulty(difficulty);
      return res.json(puzzles);
    } catch (error) {
      console.error('Error fetching puzzles by difficulty:', error);
      return res.status(500).json({ error: 'Failed to fetch puzzles' });
    }
  }

  // Get single puzzle by ID
  static getPuzzleById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid puzzle ID' });
      }

      const puzzle = PuzzleModel.getById(id);

      if (!puzzle) {
        return res.status(404).json({ error: 'Puzzle not found' });
      }

      return res.json(puzzle);
    } catch (error) {
      console.error('Error fetching puzzle:', error);
      return res.status(500).json({ error: 'Failed to fetch puzzle' });
    }
  }

  // Validate puzzle solution
  static validateSolution(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const { solution } = req.body;

      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid puzzle ID' });
      }

      if (!solution || !Array.isArray(solution)) {
        return res.status(400).json({ error: 'Invalid solution format' });
      }

      // Validate solution format (6x6 grid)
      if (solution.length !== 6 || !solution.every(row => Array.isArray(row) && row.length === 6)) {
        return res.status(400).json({ error: 'Solution must be a 6x6 grid' });
      }

      const isValid = PuzzleModel.validateSolution(id, solution);

      return res.json({
        valid: isValid,
        message: isValid ? 'Congratulations! Solution is correct!' : 'Solution is incorrect. Try again!'
      });
    } catch (error) {
      console.error('Error validating solution:', error);
      return res.status(500).json({ error: 'Failed to validate solution' });
    }
  }
}
