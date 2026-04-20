FROM docker.io/library/node:24-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY angular.json tsconfig*.json proxy.conf.js ./
COPY src ./src
COPY public ./public

RUN npx ng build --configuration development

FROM docker.io/library/nginx:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/directives-deep-dive/browser /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
