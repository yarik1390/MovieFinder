FROM node:20-slim

WORKDIR /app

# build tools needed for better-sqlite3 native compilation
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

COPY . .

# build React client
RUN cd client && npm install && npm run build

# install server deps
RUN cd server && npm install

ENV PORT=7860
EXPOSE 7860

CMD ["node", "server/index.js"]
