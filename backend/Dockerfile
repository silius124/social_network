FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Для Prisma (если используешь) — генерируем клиент
RUN npx prisma generate   # если есть prisma/schema.prisma

# Не нужно build для dev — запускаем ts-node / nest start:dev
CMD ["npm", "run", "start:dev"]