import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useTelegram } from './hooks/useTelegram';
import PuzzleListPage from './pages/PuzzleListPage';
import GamePage from './pages/GamePage';
import './styles/App.css';

function App() {
  const { tg } = useTelegram();

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
      <Routes>
        <Route path="/" element={<PuzzleListPage />} />
        <Route path="/puzzle/:id" element={<GamePage />} />
      </Routes>
    </Router>
  );
}

export default App;
