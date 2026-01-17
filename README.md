# Gdansk Mosque Quiz Portal

A lightweight quiz application with multiple choice questions and leaderboard functionality.

## Prerequisites

You need to install Node.js and npm first. Here are the options:

### Option 1: Install via Homebrew (Recommended)
```bash
# Install Homebrew (if not already installed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Node.js (includes npm)
brew install node
```

### Option 2: Install via Official Installer
Download and install Node.js from https://nodejs.org/ (includes npm)

### Option 3: Install via nvm (Node Version Manager)
```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Restart terminal or source the profile
source ~/.bashrc  # or ~/.zshrc

# Install Node.js
nvm install --lts
nvm use --lts
```

## Installation

Once Node.js and npm are installed:

```bash
cd gdansk-mosque-quiz
npm install
```

## Setup Database

### 1. Set up PostgreSQL Database

You'll need a PostgreSQL database. Options:

**Option A: Local PostgreSQL**
```bash
# Install PostgreSQL (macOS)
brew install postgresql@15
brew services start postgresql@15

# Create database
createdb quizdb
```

**Option B: Free Cloud PostgreSQL** (Recommended for production)
- [Neon](https://neon.tech) - Free tier available
- [Supabase](https://supabase.com) - Free PostgreSQL
- [Railway](https://railway.app) - Free PostgreSQL database
- [Render](https://render.com) - Free PostgreSQL database

### 2. Configure Environment Variables

Copy the example environment file:
```bash
cp .env.example .env
```

Edit `.env` and set your `DATABASE_URL`:
```bash
DATABASE_URL="postgresql://user:password@localhost:5432/quizdb"
```

For cloud providers, use the connection string they provide.

### 3. Run Database Setup

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database (creates tables in PostgreSQL)
npm run db:push

# Seed database with sample questions (optional)
npm run db:seed
```

## Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Build for Production

```bash
npm run build
npm start
```

## Deployment

📖 **See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.**

Quick options:
- **Vercel** (recommended for Next.js): Connect GitHub repo → Deploy
- **Railway**: Best for SQLite, supports persistent storage
- **Render**: Good for both SQLite and PostgreSQL
- **Netlify**: Requires PostgreSQL for database

⚠️ **Note**: This app now uses PostgreSQL. Make sure to set up a PostgreSQL database and configure `DATABASE_URL` in your `.env` file before running the app.
