# ─────────────────────────────────────────────────────────────────────────────
# Stage 1 : Build Angular 17
# ─────────────────────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Build production (output → dist/frontend)
RUN npm run build -- --configuration production

# ─────────────────────────────────────────────────────────────────────────────
# Stage 2 : Nginx pour servir la SPA
# ─────────────────────────────────────────────────────────────────────────────
FROM nginx:1.25-alpine AS production

# SPA Angular buildée
COPY --from=builder /app/dist/frontend /usr/share/nginx/html

# Config Nginx SPA (gère le routing Angular)
COPY nginx-spa.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
