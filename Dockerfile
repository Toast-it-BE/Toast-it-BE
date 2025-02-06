FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install --only=production

COPY . .

ENV PORT=8000

EXPOSE 8000

CMD ["npx", "pm2-runtime", "src/app.js"]
