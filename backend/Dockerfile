# ─────────────────────────────────────────────────────────────────────────────
# Stage 1 : Build — compiler TypeScript
# ─────────────────────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Dépendances en premier (cache Docker)
COPY package*.json ./
RUN npm ci

# Code source + compilation
COPY . .
RUN npm run build

# ─────────────────────────────────────────────────────────────────────────────
# Stage 2 : Production image (légère)
# ─────────────────────────────────────────────────────────────────────────────
FROM node:20-alpine AS production

WORKDIR /app

# sqlite3 nécessite des binaires natifs → garder node_modules du builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package.json .

# Répertoire pour la base SQLite persistante
RUN mkdir -p /app/data

ENV NODE_ENV=production
ENV DATABASE_PATH=/app/data/jirama.db

EXPOSE 3000

CMD ["node", "dist/main.js"]
