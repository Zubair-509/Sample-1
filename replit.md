# Hisaab (حساب)

AI-powered bookkeeping app for micro and small businesses in Pakistan. Scans receipts with Google Gemini Vision, maintains a ledger, and generates P&L dashboards and FBR tax summaries.

## Architecture

- **Backend**: Node.js + Express on port 3001 (`backend/server.js`)
- **Frontend**: React 19 + Vite + Tailwind CSS 4 on port 5000 (`hisaab-frontend/`)
- **Database**: Replit PostgreSQL (via `DATABASE_URL`)
- **AI**: Google Gemini 2.5 Flash via `GEMINI_API_KEY`

## Running the project

Use the "Project" run button — it starts both workflows in parallel:
- **Backend API**: `cd backend && node server.js`
- **Start application**: `cd hisaab-frontend && npm run dev`

## Environment variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string (auto-provisioned by Replit) |
| `SESSION_SECRET` | JWT signing secret |
| `GEMINI_API_KEY` | Google Gemini API key for receipt scanning |

## User preferences

- Keep the existing file structure: `backend/` and `hisaab-frontend/`
