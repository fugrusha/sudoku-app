import { useState, useCallback } from 'react';
import { Board } from '../types/sudoku';
import { copyBoard } from '../utils/sudoku';

interface HistoryState {
  board: Board;
  timestamp: number;
}

export function useGameHistory(initialBoard: Board) {
  const [history, setHistory] = useState<HistoryState[]>([
    { board: copyBoard(initialBoard), timestamp: Date.now() }
  ]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentBoard = history[currentIndex].board;

  const pushState = useCallback((newBoard: Board) => {
    setHistory(prev => {
      // Remove any future states if we're not at the end
      const newHistory = prev.slice(0, currentIndex + 1);
      // Add new state
      return [...newHistory, { board: copyBoard(newBoard), timestamp: Date.now() }];
    });
    setCurrentIndex(prev => prev + 1);
  }, [currentIndex]);

  const undo = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      return true;
    }
    return false;
  }, [currentIndex]);

  const redo = useCallback(() => {
    if (currentIndex < history.length - 1) {
      setCurrentIndex(prev => prev + 1);
      return true;
    }
    return false;
  }, [currentIndex, history.length]);

  const canUndo = currentIndex > 0;
  const canRedo = currentIndex < history.length - 1;

  const reset = useCallback((newBoard: Board) => {
    setHistory([{ board: copyBoard(newBoard), timestamp: Date.now() }]);
    setCurrentIndex(0);
  }, []);

  return {
    currentBoard,
    pushState,
    undo,
    redo,
    canUndo,
    canRedo,
    reset,
    moveCount: currentIndex,
  };
}
