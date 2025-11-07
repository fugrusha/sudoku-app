# Sudoku Telegram Mini App

A 6x6 Sudoku puzzle game built as a Telegram Mini App with React, TypeScript, Node.js, Express, and SQLite.

## Project Structure

```
sudoku-app/
├── frontend/          # React + TypeScript frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── utils/         # Utility functions
│   │   ├── types/         # TypeScript type definitions
│   │   ├── styles/        # CSS styles
│   │   ├── App.tsx        # Main App component
│   │   └── main.tsx       # Entry point
│   ├── public/            # Static assets
│   ├── index.html         # HTML template
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── backend/           # Node.js + Express backend
│   ├── src/
│   │   ├── config/        # Database configuration
│   │   ├── controllers/   # Request handlers
│   │   ├── models/        # Data models
│   │   ├── routes/        # API routes
│   │   └── server.ts      # Express server
│   ├── database/          # SQLite database files
│   ├── package.json
│   └── tsconfig.json
│
└── README.md
```

## Features

- 🎮 6x6 Sudoku puzzles
- 📊 Three difficulty levels (Easy, Medium, Hard)
- 🎨 Telegram theme integration
- ✅ Solution validation
- 📱 Mobile-optimized UI
- 💾 SQLite database for puzzle storage

## Tech Stack

**Frontend:**
- React 18
- TypeScript
- Vite
- React Router
- Telegram Mini App SDK

**Backend:**
- Node.js
- Express
- TypeScript
- SQLite (better-sqlite3)
- CORS

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   cd sudoku-app
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

### Setup and Run

#### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Create environment file**
   ```bash
   cp .env.example .env
   ```

3. **Initialize the database and generate puzzles**
   ```bash
   # Initialize database schema
   npm run db:init

   # Generate 30 puzzles (10 easy, 10 medium, 10 hard)
   npm run db:generate

   # Optional: Test the Sudoku logic
   npm run test:sudoku
   ```

4. **Start the backend server**
   ```bash
   npm run dev
   ```

   The backend will run on `http://localhost:5001`

#### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Create environment file**
   ```bash
   cp .env.example .env
   ```

3. **Start the frontend development server**
   ```bash
   npm run dev
   ```

   The frontend will run on `http://localhost:3000`

### Running Both Servers

Open two terminal windows:

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

## API Endpoints

### Puzzles

- `GET /api/puzzles` - Get all puzzles grouped by difficulty
- `GET /api/puzzles/difficulty/:difficulty` - Get puzzles by difficulty (easy/medium/hard)
- `GET /api/puzzles/:id` - Get a specific puzzle by ID
- `POST /api/puzzles/:id/validate` - Validate a puzzle solution

**Example: Validate Solution**
```json
POST /api/puzzles/1/validate
Content-Type: application/json

{
  "solution": [
    [1, 2, 3, 4, 5, 6],
    [4, 5, 6, 1, 2, 3],
    [3, 6, 5, 2, 4, 1],
    [5, 4, 2, 1, 6, 3],
    [2, 3, 4, 6, 5, 1],
    [6, 1, 1, 3, 2, 4]
  ]
}
```

## Development Roadmap

### ✅ Phase 1: Project Setup (Completed)
- [x] Initialize frontend with React + TypeScript + Vite
- [x] Initialize backend with Node.js + Express
- [x] Set up SQLite database
- [x] Create API endpoints
- [x] Integrate Telegram Mini App SDK
- [x] Create basic app shell

### ✅ Phase 2: Sudoku Logic (Completed)
- [x] Implement comprehensive 6x6 Sudoku validator
- [x] Create backtracking solver algorithm
- [x] Build puzzle generator with difficulty levels
- [x] Ensure unique solution validation
- [x] Add puzzle generation utilities

### ✅ Phase 3: UI Development (Completed)
- [x] Create puzzle list page with difficulty categories
- [x] Build interactive 6x6 game board interface
- [x] Design number picker modal (1-6 selection)
- [x] Implement game state management
- [x] Add navigation flow and routing
- [x] Implement solution validation and feedback
- [x] Create success/error result modals
- [x] Add Telegram Main Button integration
- [x] Add Telegram Back Button integration
- [x] Responsive design for mobile devices

### 📋 Phase 6: Polish & Enhancement (Upcoming)
- [ ] UI/UX improvements
- [ ] Animations
- [ ] Additional features

### 📋 Phase 7: Testing (Upcoming)
- [ ] Functional testing
- [ ] UI/UX testing
- [ ] Cross-device testing

### 📋 Phase 8: Deployment (Upcoming)
- [ ] Production build
- [ ] Hosting setup
- [ ] Telegram Bot configuration

## Database Schema

### Puzzles Table
```sql
CREATE TABLE puzzles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  difficulty TEXT NOT NULL CHECK(difficulty IN ('easy', 'medium', 'hard')),
  initial_board TEXT NOT NULL,  -- JSON array
  solution TEXT NOT NULL,        -- JSON array
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### User Progress Table (Optional)
```sql
CREATE TABLE user_progress (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  telegram_user_id TEXT NOT NULL,
  puzzle_id INTEGER NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  time_spent INTEGER,
  completed_at DATETIME,
  FOREIGN KEY (puzzle_id) REFERENCES puzzles(id)
);
```

## Sudoku Logic & Utilities

### Backend Utilities

The backend includes comprehensive Sudoku logic:

**`sudokuValidator.ts`** - Validation and solving
- `validateSolution(grid)` - Validates a complete 6x6 Sudoku solution
- `isValidPlacement(grid, row, col, num)` - Checks if a number can be placed in a cell
- `solveSudoku(grid)` - Solves a puzzle using backtracking algorithm
- `hasUniqueSolution(grid)` - Ensures a puzzle has exactly one solution

**`sudokuGenerator.ts`** - Puzzle generation
- `generateCompleteSolution()` - Creates a valid complete Sudoku grid
- `generatePuzzle(difficulty)` - Generates a puzzle with specified difficulty
- `generatePuzzleSet(difficulty, count)` - Generates multiple puzzles
- `validatePuzzle(puzzle)` - Validates a puzzle is solvable and unique

**Difficulty Levels:**
- **Easy**: 24-28 clues (out of 36 cells)
- **Medium**: 20-23 clues
- **Hard**: 16-19 clues

### Available Commands

```bash
# Initialize database schema
npm run db:init

# Generate puzzles (clears existing, creates 30 new ones)
npm run db:generate

# Test Sudoku logic
npm run test:sudoku

# Start development server
npm run dev
```

## UI Components

### Frontend Pages

**PuzzleListPage** - Main puzzle selection screen
- Displays puzzles grouped by difficulty (Easy, Medium, Hard)
- Color-coded difficulty badges
- Grid layout with puzzle cards
- Responsive design for mobile devices

**GamePage** - Interactive puzzle solving interface
- 6x6 Sudoku grid with visual distinction between initial and editable cells
- Real-time validation highlighting (invalid moves shown in red)
- Number picker modal for cell input
- Submit button (Telegram Main Button when in Telegram app)
- Back navigation (Telegram Back Button when in Telegram app)
- Result modal with success/failure feedback

### UI Components

**GameBoard** - The Sudoku grid component
- 6x6 grid with proper 2x3 box borders
- Visual highlighting for selected cells
- Real-time validation feedback
- Touch-friendly cell size (responsive)

**NumberPicker** - Modal for number selection
- Numbers 1-6 in a 3x2 grid
- Clear cell option
- Smooth animations and transitions

**ResultModal** - Feedback after submission
- Success/failure animations
- Motivational messages
- Options to play another puzzle or return to list

### User Flow

1. **Home Screen**: User sees list of puzzles grouped by difficulty
2. **Select Puzzle**: Tap on a puzzle card to start playing
3. **Play Game**:
   - Tap empty cell to open number picker
   - Select number (1-6) or clear cell
   - Invalid moves are highlighted in red
   - Complete all cells to enable Submit button
4. **Submit Solution**:
   - In Telegram: Tap the Main Button at bottom
   - In Browser: Tap the Submit button below grid
5. **View Result**:
   - Success: Celebration animation with option to play more
   - Failure: Encouraging message with option to try again
6. **Continue**: Return to puzzle list or try another puzzle

## Telegram Mini App Setup

To test in Telegram:

1. Create a bot with [@BotFather](https://t.me/botfather)
2. Use `/newapp` command to create a Mini App
3. Set the Web App URL to your frontend URL (use ngrok for local testing)
4. Enable HTTPS (required for Mini Apps)

## Contributing

This is a personal project, but suggestions and feedback are welcome!

## License

MIT

## Next Steps

The core functionality is complete! Future enhancements could include:
- User progress tracking
- Timer for each puzzle
- Hint system
- Undo/Redo functionality
- Leaderboards
- Additional puzzle sizes (9x9, 4x4)