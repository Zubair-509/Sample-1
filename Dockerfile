FROM node:20-slim

# ── Backend deps ────────────────────────────────────────────────────────────
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install

# ── Frontend deps + build ───────────────────────────────────────────────────
WORKDIR /app/hisaab-frontend
COPY hisaab-frontend/package*.json ./
RUN npm install

COPY hisaab-frontend/ ./
RUN npm run build

# ── Copy backend source ──────────────────────────────────────────────────────
WORKDIR /app/backend
COPY backend/ ./

# ── Start ───────────────────────────────────────────────────────────────────
EXPOSE 3000
CMD ["node", "server.js"]
