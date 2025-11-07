import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useTelegram } from './hooks/useTelegram';
import './styles/App.css';

// Placeholder components (we'll create these in Phase 3)
function PuzzleListPage() {
  return (
    <div className="app">
      <h1 className="text-center">Sudoku Puzzles</h1>
      <p className="text-center mt-2">Coming soon...</p>
    </div>
  );
}

function GamePage() {
  return (
    <div className="app">
      <h1 className="text-center">Game Board</h1>
      <p className="text-center mt-2">Coming soon...</p>
    </div>
  );
}

function App() {
  const { tg, user } = useTelegram();

  useEffect(() => {
    // Apply Telegram theme colors to CSS variables
    if (tg?.themeParams) {
      const root = document.documentElement;
      const theme = tg.themeParams;

      if (theme.bg_color) root.style.setProperty('--tg-theme-bg-color', theme.bg_color);
      if (theme.text_color) root.style.setProperty('--tg-theme-text-color', theme.text_color);
      if (theme.hint_color) root.style.setProperty('--tg-theme-hint-color', theme.hint_color);
      if (theme.link_color) root.style.setProperty('--tg-theme-link-color', theme.link_color);
      if (theme.button_color) root.style.setProperty('--tg-theme-button-color', theme.button_color);
      if (theme.button_text_color) root.style.setProperty('--tg-theme-button-text-color', theme.button_text_color);
      if (theme.secondary_bg_color) root.style.setProperty('--tg-theme-secondary-bg-color', theme.secondary_bg_color);
    }
  }, [tg]);

  return (
    <Router>
      <div className="app">
        {user && (
          <div className="text-center mb-2">
            <p>Welcome, {user.first_name}! 👋</p>
          </div>
        )}

        <Routes>
          <Route path="/" element={<PuzzleListPage />} />
          <Route path="/puzzle/:id" element={<GamePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
