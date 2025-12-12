FROM node:24-slim

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci --only=production

COPY . .

EXPOSE 3001

ENV NODE_ENV=production
CMD ["node", "server.js"]
