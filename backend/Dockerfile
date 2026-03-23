FROM node:20-alpine

WORKDIR /workspace/backend

# Устанавливаем git (в alpine это отдельно)
RUN apk add --no-cache git bash

# Обновим npm (по желанию)
RUN npm install -g npm@latest

# НИЧЕГО не копируем — всё будет через volume

# Контейнер просто живёт
CMD ["sleep", "infinity"]