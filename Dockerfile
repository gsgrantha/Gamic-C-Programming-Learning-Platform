FROM node:20-bookworm-slim
# gcc is needed by the Code Arena
RUN apt-get update && apt-get install -y --no-install-recommends gcc libc6-dev && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY . .
RUN useradd -m gamic && chown -R gamic /app
USER gamic
EXPOSE 3000
CMD ["node", "server.js"]
