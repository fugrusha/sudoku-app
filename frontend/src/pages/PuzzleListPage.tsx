import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PuzzleList } from '../types/sudoku';
import { fetchPuzzleList } from '../utils/api';
import { getDifficultyLabel, getDifficultyColor } from '../utils/sudoku';
import '../styles/PuzzleList.css';

export default function PuzzleListPage() {
  const navigate = useNavigate();
  const [puzzles, setPuzzles] = useState<PuzzleList | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPuzzles();
  }, []);

  const loadPuzzles = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchPuzzleList();
      setPuzzles(data);
    } catch (err) {
      setError('Failed to load puzzles. Please try again.');
      console.error('Error loading puzzles:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePuzzleClick = (puzzleId: number) => {
    navigate(`/puzzle/${puzzleId}`);
  };

  if (loading) {
    return (
      <div className="puzzle-list-container">
        <div className="loading">Loading puzzles...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="puzzle-list-container">
        <div className="error">
          <p className="error-message">{error}</p>
          <button onClick={loadPuzzles} className="retry-button">
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!puzzles) {
    return null;
  }

  const difficulties: Array<keyof PuzzleList> = ['easy', 'medium', 'hard'];

  return (
    <div className="puzzle-list-container">
      <h1 className="puzzle-list-title">Sudoku Puzzles</h1>
      <p className="puzzle-list-subtitle">Choose a puzzle to solve</p>

      {difficulties.map((difficulty) => {
        const puzzleList = puzzles[difficulty];

        if (!puzzleList || puzzleList.length === 0) {
          return null;
        }

        return (
          <div key={difficulty} className="difficulty-section">
            <h2
              className="difficulty-title"
              style={{ color: getDifficultyColor(difficulty) }}
            >
              {getDifficultyLabel(difficulty)}
            </h2>
            <div className="puzzle-grid">
              {puzzleList.map((puzzle) => (
                <button
                  key={puzzle.id}
                  className="puzzle-card"
                  onClick={() => handlePuzzleClick(puzzle.id)}
                  style={{ borderColor: getDifficultyColor(difficulty) }}
                >
                  <div className="puzzle-number">#{puzzle.id}</div>
                  <div className="puzzle-difficulty">{getDifficultyLabel(difficulty)}</div>
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
