import { Board } from '../types/sudoku';
import { isValidMove } from '../utils/sudoku';
import '../styles/GameBoard.css';

interface GameBoardProps {
  initialBoard: Board;
  currentBoard: Board;
  selectedCell: { row: number; col: number } | null;
  onCellClick: (row: number, col: number) => void;
}

export default function GameBoard({
  initialBoard,
  currentBoard,
  selectedCell,
  onCellClick,
}: GameBoardProps) {
  const isInitialCell = (row: number, col: number) => {
    return initialBoard[row][col] !== 0;
  };

  const isSelected = (row: number, col: number) => {
    return selectedCell?.row === row && selectedCell?.col === col;
  };

  const isInvalid = (row: number, col: number) => {
    const value = currentBoard[row][col];
    if (value === 0) return false;
    if (isInitialCell(row, col)) return false;
    return !isValidMove(currentBoard, row, col, value);
  };

  const getBoxClass = (row: number, col: number) => {
    // Highlight the 2x3 box
    const boxRow = Math.floor(row / 2);
    const boxCol = Math.floor(col / 3);
    return `box-${boxRow}-${boxCol}`;
  };

  return (
    <div className="game-board">
      <div className="sudoku-grid">
        {currentBoard.map((row, rowIndex) => (
          <div key={rowIndex} className="sudoku-row">
            {row.map((cell, colIndex) => {
              const initial = isInitialCell(rowIndex, colIndex);
              const selected = isSelected(rowIndex, colIndex);
              const invalid = isInvalid(rowIndex, colIndex);

              return (
                <button
                  key={`${rowIndex}-${colIndex}`}
                  className={`sudoku-cell ${initial ? 'initial' : 'editable'} ${
                    selected ? 'selected' : ''
                  } ${invalid ? 'invalid' : ''} ${getBoxClass(rowIndex, colIndex)}`}
                  onClick={() => !initial && onCellClick(rowIndex, colIndex)}
                  disabled={initial}
                >
                  {cell !== 0 ? cell : ''}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
