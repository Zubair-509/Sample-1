FROM node:20-alpine

WORKDIR /app

COPY . .

WORKDIR /app/hisaab-frontend
RUN npm install && npm run build

WORKDIR /app/backend
RUN npm install

EXPOSE 3000

CMD ["node", "server.js"]
