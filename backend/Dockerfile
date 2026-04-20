FROM docker.io/library/node:24-bookworm-slim

WORKDIR /app/backend

COPY package*.json ./
RUN npm ci

COPY db.js ./
COPY runtime-paths.js ./
COPY server.js ./

ENV PORT=3001
ENV DATA_DIR=/data

EXPOSE 3001

CMD ["npm", "start"]
