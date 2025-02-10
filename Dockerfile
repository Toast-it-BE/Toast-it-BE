FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install --only=production

COPY . .

RUN npm install -g pm2

ENV PORT=8000

EXPOSE 8000

CMD ["pm2-runtime", "start", "ecosystem.config.js"]
