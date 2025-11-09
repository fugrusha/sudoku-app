import '../styles/GameControls.css';

interface GameControlsProps {
  timer: string;
  progress: { filled: number; total: number };
  canUndo: boolean;
  canRedo: boolean;
  canHint: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onHint: () => void;
  onReset: () => void;
  difficulty?: string;
}

export default function GameControls({
  timer,
  progress,
  canUndo,
  canRedo,
  canHint,
  onUndo,
  onRedo,
  onHint,
  onReset,
  difficulty,
}: GameControlsProps) {
  const getDifficultyColor = (diff: string) => {
    const colors: Record<string, string> = {
      easy: '#4CAF50',
      medium: '#FF9800',
      hard: '#F44336',
    };
    return colors[diff] || '#999';
  };

  return (
    <div className="game-controls">
      <div className="controls-row top-row">
        <div className="control-info">
          {difficulty && (
            <div
              className="difficulty-badge"
              style={{ backgroundColor: getDifficultyColor(difficulty) }}
            >
              {difficulty.toUpperCase()}
            </div>
          )}
          <div className="timer">⏱ {timer}</div>
        </div>
        <div className="control-info">
          <div className="progress">
            {progress.filled}/{progress.total} cells
          </div>
        </div>
      </div>

      <div className="controls-row action-row">
        <button
          className="control-button"
          onClick={onUndo}
          disabled={!canUndo}
          title="Undo (Ctrl+Z)"
        >
          <span className="button-icon">↶</span>
          <span className="button-label">Undo</span>
        </button>

        <button
          className="control-button"
          onClick={onRedo}
          disabled={!canRedo}
          title="Redo (Ctrl+Y)"
        >
          <span className="button-icon">↷</span>
          <span className="button-label">Redo</span>
        </button>

        <button
          className="control-button"
          onClick={onHint}
          disabled={!canHint}
          title="Get a hint"
        >
          <span className="button-icon">💡</span>
          <span className="button-label">Hint</span>
        </button>

        <button
          className="control-button reset-button"
          onClick={onReset}
          title="Reset puzzle"
        >
          <span className="button-icon">🔄</span>
          <span className="button-label">Reset</span>
        </button>
      </div>
    </div>
  );
}
