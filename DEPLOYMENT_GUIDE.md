# Sudoku Telegram Mini App - Deployment Guide

This guide will walk you through deploying and running your Sudoku Mini App on Telegram.

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- A Telegram account
- A server or hosting platform (for production deployment)

## Table of Contents

1. [Local Testing Setup](#local-testing-setup)
2. [Creating a Telegram Bot](#creating-a-telegram-bot)
3. [Backend Deployment](#backend-deployment)
4. [Frontend Deployment](#frontend-deployment)
5. [Configuring the Telegram Mini App](#configuring-the-telegram-mini-app)
6. [Production Deployment](#production-deployment)
7. [Testing Your App](#testing-your-app)

---

## Local Testing Setup

### 1. Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Set Up the Database

```bash
# From the backend directory
cd backend

# Initialize the database and generate puzzles
npm run init-db
```

This will create a SQLite database and populate it with 100 puzzles (25 of each difficulty level).

### 3. Start the Backend Server

```bash
# From the backend directory
npm run dev
```

The backend server will start on `http://localhost:5001`

### 4. Start the Frontend Development Server

```bash
# From the frontend directory
cd ../frontend
npm run dev
```

The frontend will start on `http://localhost:5173`

---

## Creating a Telegram Bot

### 1. Open BotFather

1. Open Telegram and search for `@BotFather`
2. Start a chat with BotFather

### 2. Create a New Bot

```
/newbot
```

Follow the prompts:
- **Bot name**: Choose a display name (e.g., "Sudoku Game")
- **Bot username**: Choose a unique username ending in "bot" (e.g., "MySudokuGameBot")

### 3. Save Your Bot Token

BotFather will give you a token that looks like:
```
1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
```

**Keep this token secure!** You'll need it for the Telegram Mini App configuration.

---

## Backend Deployment

### Option 1: Deploy to Railway (Recommended)

1. **Sign up for Railway**: https://railway.app
2. **Create a new project**
3. **Deploy from GitHub**:
   - Connect your GitHub repository
   - Select the `backend` directory as the root
   - Railway will auto-detect Node.js

4. **Add Environment Variables** (optional):
   ```
   PORT=5001
   NODE_ENV=production
   ```

5. **Initialize the database**:
   - After deployment, run the init script via Railway CLI:
   ```bash
   railway run npm run init-db
   ```

6. **Note your backend URL**: e.g., `https://your-app.railway.app`

### Option 2: Deploy to Render

1. **Sign up for Render**: https://render.com
2. **Create a new Web Service**
3. **Connect your GitHub repository**
4. **Configure the service**:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: Node

5. **Add Environment Variables** (if needed)

6. **Initialize the database** via Render Shell:
   ```bash
   npm run init-db
   ```

### Option 3: Deploy to Your Own VPS

```bash
# SSH into your server
ssh user@your-server.com

# Clone your repository
git clone https://github.com/yourusername/sudoku-app.git
cd sudoku-app/backend

# Install dependencies
npm install

# Initialize database
npm run init-db

# Install PM2 for process management
npm install -g pm2

# Start the backend
pm2 start npm --name "sudoku-backend" -- start
pm2 save
pm2 startup
```

---

## Frontend Deployment

### 1. Configure the API URL

Edit `frontend/src/utils/api.ts` or create a `.env` file:

```bash
# frontend/.env
VITE_API_URL=https://your-backend-url.railway.app/api
```

### 2. Build the Frontend

```bash
cd frontend
npm run build
```

This creates a `dist` folder with optimized static files.

### 3. Deploy Frontend

#### Option A: Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy from frontend directory
cd frontend
vercel

# Follow the prompts
# Set root directory to 'frontend' if needed
```

Or use the Vercel dashboard:
1. Import your GitHub repository
2. Set root directory to `frontend`
3. Framework preset: Vite
4. Add environment variable: `VITE_API_URL=https://your-backend-url`
5. Deploy

#### Option B: Deploy to Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy from frontend directory
cd frontend
netlify deploy --prod

# Select the 'dist' folder as the publish directory
```

Or use Netlify dashboard:
1. Connect your GitHub repository
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Add environment variable: `VITE_API_URL`

#### Option C: Deploy to GitHub Pages

```bash
# Add to frontend/package.json
{
  "scripts": {
    "deploy": "npm run build && gh-pages -d dist"
  }
}

# Install gh-pages
npm install --save-dev gh-pages

# Deploy
npm run deploy
```

### 4. Note Your Frontend URL

e.g., `https://your-app.vercel.app`

---

## Configuring the Telegram Mini App

### 1. Open BotFather Again

```
@BotFather
```

### 2. Create a Web App

```
/newapp
```

Follow the prompts:
1. **Select your bot**: Choose the bot you created earlier
2. **Web App URL**: Enter your frontend URL (e.g., `https://your-app.vercel.app`)
3. **Short name**: A short identifier (e.g., `sudoku`)
4. **Description**: Describe your app (e.g., "Play Sudoku puzzles")
5. **Photo**: Upload a 640x360 photo/screenshot of your app
6. **GIF** (optional): Upload a demo GIF

### 3. Enable Inline Mode (Optional)

If you want users to share the game in chats:

```
/setinline
```

Select your bot and enable inline mode.

### 4. Set Menu Button

```
/setmenubutton
```

Select your bot, then:
- **Button text**: "Play Sudoku"
- **Web App URL**: Your frontend URL

---

## Production Deployment Checklist

### Backend Configuration

- [ ] Database is initialized with puzzles
- [ ] CORS is configured for your frontend domain
- [ ] Environment variables are set
- [ ] Server is running and accessible via HTTPS
- [ ] API endpoints are tested

### Frontend Configuration

- [ ] `VITE_API_URL` points to production backend
- [ ] Build is optimized for production
- [ ] HTTPS is enabled
- [ ] Telegram Web App SDK is loaded
- [ ] App is tested in Telegram environment

### Security

- [ ] Keep your bot token secure (never commit to git)
- [ ] Use environment variables for sensitive data
- [ ] Enable HTTPS for both frontend and backend
- [ ] Implement rate limiting on backend (optional)
- [ ] Validate all user inputs

---

## Testing Your App

### 1. Test in Telegram

1. Open your bot in Telegram
2. Click the **Menu** button (bottom-left)
3. Select "Play Sudoku" (or your menu button text)
4. The Mini App should open

### 2. Test Features

- [ ] Puzzle loads correctly
- [ ] Timer starts automatically
- [ ] Can fill cells with numbers
- [ ] Undo/Redo works
- [ ] Menu button navigates back to puzzle list
- [ ] Congratulation banner appears when complete
- [ ] Submit button validates solution
- [ ] Result modal shows correct feedback

### 3. Test on Different Devices

- [ ] Android phone
- [ ] iPhone
- [ ] Desktop Telegram (Windows/Mac/Linux)
- [ ] Telegram Web

### 4. Debug Issues

#### If the app doesn't load:
- Check browser console for errors
- Verify frontend URL is correct
- Ensure backend is running and accessible
- Check CORS configuration

#### If API calls fail:
- Verify `VITE_API_URL` is correct
- Check backend logs
- Test API endpoints directly (e.g., with Postman)
- Ensure backend allows requests from frontend domain

#### If Telegram features don't work:
- Make sure you're testing in actual Telegram (not just browser)
- Verify Telegram Web App SDK is loaded
- Check Telegram's developer console

---

## Environment Variables Reference

### Backend (`backend/.env`)

```env
PORT=5001
NODE_ENV=production
DATABASE_URL=./data/sudoku.db  # Optional: custom database path
```

### Frontend (`frontend/.env`)

```env
VITE_API_URL=https://your-backend-url.railway.app/api
```

---

## Useful Commands

### Backend

```bash
# Development
npm run dev

# Production
npm start

# Initialize database
npm run init-db

# Generate more puzzles
npm run generate-puzzles
```

### Frontend

```bash
# Development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## Troubleshooting

### Database Issues

If you need to reset the database:

```bash
cd backend
rm -rf data/sudoku.db  # Delete existing database
npm run init-db        # Recreate and populate
```

### CORS Errors

If you get CORS errors, update `backend/src/server.ts`:

```typescript
app.use(cors({
  origin: ['https://your-frontend-url.vercel.app', 'https://web.telegram.org'],
  credentials: true
}));
```

### Build Errors

If frontend build fails:

```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run build
```

---

## Next Steps

### Enhancements

- Add leaderboards
- Implement daily challenges
- Add user statistics
- Enable puzzle sharing
- Add more difficulty levels
- Implement hints system

### Monitoring

- Set up error tracking (e.g., Sentry)
- Monitor API performance
- Track user analytics
- Set up uptime monitoring

---

## Support

If you encounter issues:

1. Check the console logs (both frontend and backend)
2. Verify all environment variables are set correctly
3. Test API endpoints independently
4. Check Telegram Mini App documentation: https://core.telegram.org/bots/webapps

---

## Summary

1. ✅ Set up and test locally
2. ✅ Create Telegram bot with BotFather
3. ✅ Deploy backend to Railway/Render/VPS
4. ✅ Deploy frontend to Vercel/Netlify
5. ✅ Configure Mini App in BotFather
6. ✅ Test in Telegram
7. ✅ Launch and enjoy!

Your Sudoku Mini App is now live on Telegram! 🎉
