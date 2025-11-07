import '../styles/NumberPicker.css';

interface NumberPickerProps {
  onSelectNumber: (num: number) => void;
  onClear: () => void;
  onClose: () => void;
}

export default function NumberPicker({ onSelectNumber, onClear, onClose }: NumberPickerProps) {
  const numbers = [1, 2, 3, 4, 5, 6];

  return (
    <div className="number-picker-overlay" onClick={onClose}>
      <div className="number-picker" onClick={(e) => e.stopPropagation()}>
        <div className="number-picker-header">
          <h3>Select Number</h3>
          <button className="close-button" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="number-grid">
          {numbers.map((num) => (
            <button
              key={num}
              className="number-button"
              onClick={() => {
                onSelectNumber(num);
                onClose();
              }}
            >
              {num}
            </button>
          ))}
        </div>
        <button className="clear-button" onClick={() => {
          onClear();
          onClose();
        }}>
          Clear Cell
        </button>
      </div>
    </div>
  );
}
