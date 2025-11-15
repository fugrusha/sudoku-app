import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeDatabase } from './config/database.js';
import puzzleRoutes from './routes/puzzleRoutes.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database
initializeDatabase();

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', message: 'Sudoku API is running' });
});

// Routes
app.use('/api/puzzles', puzzleRoutes);

// Error handling middleware
app.use((err: Error, _req: express.Request, res: express.Response) => {
  console.error('Error:', err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;
