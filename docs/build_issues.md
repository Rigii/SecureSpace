# Базовый образ с Node.js LTS (Alpine для минимального размера)

FROM node:18-alpine AS builder

# Установка зависимых пакетов (включая git для npm-зависимостей)

RUN apk add --no-cache git

# Создание рабочей директории

WORKDIR /usr/src/app

# Копируем только файлы зависимостей для кэширования

COPY package\*.json ./

# Установка зависимостей (чистка кэша для уменьшения размера)

RUN npm ci --only=production=false && \
 npm cache clean --force

# Копируем все исходные файлы

COPY . .

# Сборка проекта (удаление исходников после сборки)

RUN npm run build && \
 rm -rf src node_modules && \
 npm ci --only=production && \
 npm cache clean --force

# Финальный образ (мульти-стадия сборка для уменьшения размера)

FROM node:18-alpine

WORKDIR /usr/src/app

# Копируем только необходимое из builder-стадии

COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package.json ./
COPY --from=builder /usr/src/app/dist ./dist

# Оптимизация для production

ENV NODE_ENV=production
ENV PORT=3000

# Защита от running as root

USER node

# Открываем порт и запускаем приложение

EXPOSE ${PORT}
CMD ["node", "dist/main.js"]
