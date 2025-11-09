import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTelegram } from '../hooks/useTelegram';
import { useGameHistory } from '../hooks/useGameHistory';
import { useTimer } from '../hooks/useTimer';
import { useLocalStorage, removeFromLocalStorage } from '../hooks/useLocalStorage';
import GameBoard from '../components/GameBoard';
import NumberPicker from '../components/NumberPicker';
import ResultModal from '../components/ResultModal';
import GameControls from '../components/GameControls';
import { Board, Puzzle } from '../types/sudoku';
import { fetchPuzzleById, validateSolution } from '../utils/api';
import { isBoardComplete, copyBoard } from '../utils/sudoku';
import '../styles/GamePage.css';

interface SavedGameState {
  board: Board;
  seconds: number;
  moveCount: number;
}

export default function GamePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { tg } = useTelegram();
  const timer = useTimer(false);

  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
  const [initialBoard, setInitialBoard] = useState<Board | null>(null);
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [showNumberPicker, setShowNumberPicker] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [resultMessage, setResultMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const storageKey = `sudoku-game-${id}`;
  const [savedState, setSavedState] = useLocalStorage<SavedGameState | null>(storageKey, null);

  // Initialize game history with initial board
  const gameHistory = useGameHistory(initialBoard || []);

  useEffect(() => {
    loadPuzzle();
  }, [id]);

  useEffect(() => {
    // Restore saved game state and start timer
    if (initialBoard && savedState) {
      gameHistory.reset(savedState.board);
      timer.reset();
      timer.start(); // Start timer after restoring
    } else if (initialBoard) {
      // Start timer for new games
      timer.start();
    }
  }, [initialBoard]);

  useEffect(() => {
    // Auto-save game state
    if (gameHistory.currentBoard && !isBoardComplete(gameHistory.currentBoard)) {
      setSavedState({
        board: gameHistory.currentBoard,
        seconds: timer.seconds,
        moveCount: gameHistory.moveCount,
      });
    }
  }, [gameHistory.currentBoard, timer.seconds, gameHistory.moveCount]);

  useEffect(() => {
    // Show/hide Telegram main button based on board completion
    if (tg && gameHistory.currentBoard) {
      const isComplete = isBoardComplete(gameHistory.currentBoard);

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
  }, [gameHistory.currentBoard, tg, isValidating]);

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

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z') {
          e.preventDefault();
          handleUndo();
        } else if (e.key === 'y') {
          e.preventDefault();
          handleRedo();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameHistory.canUndo, gameHistory.canRedo]);

  const loadPuzzle = async () => {
    if (!id) {
      setError('Invalid puzzle ID');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const puzzleData = await fetchPuzzleById(parseInt(id));
      setPuzzle(puzzleData);
      setInitialBoard(puzzleData.initial_board);
      gameHistory.reset(puzzleData.initial_board);
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
    setShowHint(false);
  };

  const handleSelectNumber = (num: number) => {
    if (selectedCell && gameHistory.currentBoard) {
      const newBoard = copyBoard(gameHistory.currentBoard);
      newBoard[selectedCell.row][selectedCell.col] = num;
      gameHistory.pushState(newBoard);
      setSelectedCell(null);
    }
  };

  const handleClearCell = () => {
    if (selectedCell && gameHistory.currentBoard) {
      const newBoard = copyBoard(gameHistory.currentBoard);
      newBoard[selectedCell.row][selectedCell.col] = 0;
      gameHistory.pushState(newBoard);
      setSelectedCell(null);
    }
  };

  const handleUndo = useCallback(() => {
    gameHistory.undo();
  }, [gameHistory]);

  const handleRedo = useCallback(() => {
    gameHistory.redo();
  }, [gameHistory]);

  const handleHint = () => {
    setShowHint(true);
    setTimeout(() => setShowHint(false), 3000);
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset the puzzle? All progress will be lost.')) {
      if (initialBoard) {
        gameHistory.reset(initialBoard);
        timer.reset();
        timer.start();
        removeFromLocalStorage(storageKey);
      }
    }
  };

  const handleSubmit = async () => {
    if (!gameHistory.currentBoard || !id || isValidating) return;

    try {
      setIsValidating(true);
      timer.pause();
      const result = await validateSolution(parseInt(id), gameHistory.currentBoard);
      setIsSuccess(result.valid);
      setResultMessage(
        result.valid
          ? `${result.message} Time: ${timer.formattedTime}`
          : result.message
      );
      setShowResult(true);

      // Clear saved state on completion
      if (result.valid) {
        removeFromLocalStorage(storageKey);
      }

      // Hide Telegram button
      if (tg) {
        tg.MainButton.hide();
      }
    } catch (err) {
      console.error('Error validating solution:', err);
      setIsSuccess(false);
      setResultMessage('Failed to validate solution. Please try again.');
      setShowResult(true);
      timer.start();
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

  if (error || !initialBoard || !gameHistory.currentBoard || !puzzle) {
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

  const isComplete = isBoardComplete(gameHistory.currentBoard);
  const filledCells = gameHistory.currentBoard.flat().filter(cell => cell !== 0).length;

  return (
    <div className="game-page-container">
      <div className="game-header">
        <div className="game-header-top">
          <h1 className="game-title">Puzzle #{id}</h1>
          <button className="menu-button" onClick={handleBackToList} title="Back to Menu">
            ☰
          </button>
        </div>
        <p className="game-instruction">
          {isComplete
            ? 'Complete! Tap Submit to check your solution.'
            : 'Tap an empty cell to fill it'}
        </p>
      </div>

      {/* Congratulation message when puzzle is complete */}
      {isComplete && !showResult && (
        <div className="congratulation-banner">
          <div className="congratulation-icon">🎉</div>
          <div className="congratulation-content">
            <h2 className="congratulation-title">Congratulations!</h2>
            <p className="congratulation-message">
              You've filled all the cells! Submit your solution to verify it's correct.
            </p>
            <button
              className="congratulation-submit-button"
              onClick={handleSubmit}
              disabled={isValidating}
            >
              {isValidating ? 'Checking...' : 'Submit Solution'}
            </button>
          </div>
        </div>
      )}

      <GameControls
        timer={timer.formattedTime}
        progress={{ filled: filledCells, total: 36 }}
        canUndo={gameHistory.canUndo}
        canRedo={gameHistory.canRedo}
        canHint={!isComplete}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onHint={handleHint}
        onReset={handleReset}
        difficulty={puzzle.difficulty}
      />

      <GameBoard
        initialBoard={initialBoard}
        currentBoard={gameHistory.currentBoard}
        selectedCell={selectedCell}
        onCellClick={handleCellClick}
      />

      {showHint && (
        <div className="hint-message">
          💡 Invalid cells are highlighted in red
        </div>
      )}

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
