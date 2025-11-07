import '../styles/ResultModal.css';

interface ResultModalProps {
  isSuccess: boolean;
  message: string;
  onPlayAgain: () => void;
  onBackToList: () => void;
}

export default function ResultModal({
  isSuccess,
  message,
  onPlayAgain,
  onBackToList,
}: ResultModalProps) {
  return (
    <div className="result-modal-overlay">
      <div className="result-modal">
        <div className={`result-icon ${isSuccess ? 'success' : 'error'}`}>
          {isSuccess ? '🎉' : '❌'}
        </div>
        <h2 className="result-title">
          {isSuccess ? 'Congratulations!' : 'Not Quite Right'}
        </h2>
        <p className="result-message">{message}</p>
        <div className="result-actions">
          <button className="action-button primary" onClick={onPlayAgain}>
            {isSuccess ? 'Play Another' : 'Try Again'}
          </button>
          <button className="action-button secondary" onClick={onBackToList}>
            Back to List
          </button>
        </div>
      </div>
    </div>
  );
}
