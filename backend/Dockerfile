FROM node:20

WORKDIR /workspace/backend

# Устанавливаем всё нужное
RUN apt-get update && apt-get install -y \
    git \
    curl \
    bash \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

RUN npm install -g npm@latest

CMD ["sleep", "infinity"]