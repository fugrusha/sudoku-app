import { Router } from 'express';
import { PuzzleController } from '../controllers/puzzleController.js';

const router = Router();

// Get all puzzles (grouped by difficulty)
router.get('/', PuzzleController.getAllPuzzles);

// Get puzzles by difficulty
router.get('/difficulty/:difficulty', PuzzleController.getPuzzlesByDifficulty);

// Get single puzzle by ID
router.get('/:id', PuzzleController.getPuzzleById);

// Validate solution
router.post('/:id/validate', PuzzleController.validateSolution);

export default router;
