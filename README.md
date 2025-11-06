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

3. **Initialize the database**
   ```bash
   npm run build
   npm run db:init
   ```

4. **Start the backend server**
   ```bash
   npm run dev
   ```

   The backend will run on `http://localhost:5000`

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

### 🚧 Phase 2: Sudoku Logic (Next)
- [ ] Implement puzzle validation
- [ ] Create puzzle generator
- [ ] Add more sample puzzles

### 📋 Phase 3: UI Development (Upcoming)
- [ ] Create puzzle list page
- [ ] Build game board interface
- [ ] Design number picker
- [ ] Add game controls

### 📋 Phase 4: State Management (Upcoming)
- [ ] Implement application state
- [ ] Add navigation flow
- [ ] Handle game progress

### 📋 Phase 5: Validation & Feedback (Upcoming)
- [ ] Solution checking
- [ ] User feedback UI
- [ ] Success/error messages

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

Continue with Phase 2: Implement Sudoku logic and puzzle generation!