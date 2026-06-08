FROM node:20-slim

WORKDIR /app

# Install backend dependencies at root level
COPY package.json ./
RUN npm install

# Build frontend
COPY hisaab-frontend/package*.json ./hisaab-frontend/
RUN cd hisaab-frontend && npm install

COPY hisaab-frontend/ ./hisaab-frontend/
RUN cd hisaab-frontend && npm run build

# Copy backend source
COPY backend/ ./backend/

EXPOSE 3000
CMD ["node", "backend/server.js"]
