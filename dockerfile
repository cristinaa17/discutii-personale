# =========================
# 1. Image de bază Node
# =========================
FROM node:18-alpine

# =========================
# 2. Director de lucru
# =========================
WORKDIR /app

# =========================
# 3. Copiem backend-ul
# =========================
COPY backend ./backend

# =========================
# 4. Copiem frontend build
# =========================
COPY dist/directives-deep-dive/browser ./frontend

# =========================
# 5. Instalăm dependențe backend
# =========================
WORKDIR /app/backend
RUN npm install

# =========================
# 6. Expunem portul backend
# =========================
EXPOSE 3000

# =========================
# 7. Pornim serverul
# =========================
CMD ["node", "server.js"]
