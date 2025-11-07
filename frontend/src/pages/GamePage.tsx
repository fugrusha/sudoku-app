import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTelegram } from '../hooks/useTelegram';
import GameBoard from '../components/GameBoard';
import NumberPicker from '../components/NumberPicker';
import ResultModal from '../components/ResultModal';
import { Board } from '../types/sudoku';
import { fetchPuzzleById, validateSolution } from '../utils/api';
import { isBoardComplete, copyBoard } from '../utils/sudoku';
import '../styles/GamePage.css';

export default function GamePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { tg } = useTelegram();

  const [initialBoard, setInitialBoard] = useState<Board | null>(null);
  const [currentBoard, setCurrentBoard] = useState<Board | null>(null);
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [showNumberPicker, setShowNumberPicker] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [resultMessage, setResultMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  useEffect(() => {
    loadPuzzle();
  }, [id]);

  useEffect(() => {
    // Show/hide Telegram main button based on board completion
    if (tg && currentBoard) {
      const isComplete = isBoardComplete(currentBoard);

      if (isComplete && !isValidating) {
        tg.MainButton.setText('Submit Solution');
        tg.MainButton.show();
        tg.MainButton.onClick(handleSubmit);
      } else {
        tg.MainButton.hide();
        tg.MainButton.offClick(handleSubmit);
      }
    }

    return () => {
      if (tg) {
        tg.MainButton.hide();
        tg.MainButton.offClick(handleSubmit);
      }
    };
  }, [currentBoard, tg, isValidating]);

  useEffect(() => {
    // Setup Telegram back button
    if (tg) {
      tg.BackButton.show();
      tg.BackButton.onClick(handleBackToList);
    }

    return () => {
      if (tg) {
        tg.BackButton.hide();
        tg.BackButton.offClick(handleBackToList);
      }
    };
  }, [tg]);

  const loadPuzzle = async () => {
    if (!id) {
      setError('Invalid puzzle ID');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const puzzle = await fetchPuzzleById(parseInt(id));
      setInitialBoard(puzzle.initial_board);
      setCurrentBoard(copyBoard(puzzle.initial_board));
    } catch (err) {
      setError('Failed to load puzzle. Please try again.');
      console.error('Error loading puzzle:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCellClick = (row: number, col: number) => {
    setSelectedCell({ row, col });
    setShowNumberPicker(true);
  };

  const handleSelectNumber = (num: number) => {
    if (selectedCell && currentBoard) {
      const newBoard = copyBoard(currentBoard);
      newBoard[selectedCell.row][selectedCell.col] = num;
      setCurrentBoard(newBoard);
      setSelectedCell(null);
    }
  };

  const handleClearCell = () => {
    if (selectedCell && currentBoard) {
      const newBoard = copyBoard(currentBoard);
      newBoard[selectedCell.row][selectedCell.col] = 0;
      setCurrentBoard(newBoard);
      setSelectedCell(null);
    }
  };

  const handleSubmit = async () => {
    if (!currentBoard || !id || isValidating) return;

    try {
      setIsValidating(true);
      const result = await validateSolution(parseInt(id), currentBoard);
      setIsSuccess(result.valid);
      setResultMessage(result.message);
      setShowResult(true);

      // Hide Telegram button
      if (tg) {
        tg.MainButton.hide();
      }
    } catch (err) {
      console.error('Error validating solution:', err);
      setIsSuccess(false);
      setResultMessage('Failed to validate solution. Please try again.');
      setShowResult(true);
    } finally {
      setIsValidating(false);
    }
  };

  const handlePlayAgain = () => {
    setShowResult(false);
    navigate('/');
  };

  const handleBackToList = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="game-page-container">
        <div className="loading">Loading puzzle...</div>
      </div>
    );
  }

  if (error || !initialBoard || !currentBoard) {
    return (
      <div className="game-page-container">
        <div className="error">
          <p className="error-message">{error || 'Failed to load puzzle'}</p>
          <button onClick={handleBackToList} className="error-button">
            Back to List
          </button>
        </div>
      </div>
    );
  }

  const isComplete = isBoardComplete(currentBoard);

  return (
    <div className="game-page-container">
      <div className="game-header">
        <h1 className="game-title">Puzzle #{id}</h1>
        <p className="game-instruction">
          {isComplete ? 'Complete! Tap Submit to check your solution.' : 'Tap an empty cell to fill it'}
        </p>
      </div>

      <GameBoard
        initialBoard={initialBoard}
        currentBoard={currentBoard}
        selectedCell={selectedCell}
        onCellClick={handleCellClick}
      />

      {/* Submit button for non-Telegram environments */}
      {isComplete && !tg && (
        <div className="game-actions">
          <button
            className="submit-button"
            onClick={handleSubmit}
            disabled={isValidating}
          >
            {isValidating ? 'Checking...' : 'Submit Solution'}
          </button>
        </div>
      )}

      {showNumberPicker && selectedCell && (
        <NumberPicker
          onSelectNumber={handleSelectNumber}
          onClear={handleClearCell}
          onClose={() => {
            setShowNumberPicker(false);
            setSelectedCell(null);
          }}
        />
      )}

      {showResult && (
        <ResultModal
          isSuccess={isSuccess}
          message={resultMessage}
          onPlayAgain={handlePlayAgain}
          onBackToList={handleBackToList}
        />
      )}
    </div>
  );
}
