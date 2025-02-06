FROM node:18-bullseye

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

ENV PORT=8000

EXPOSE 8000

CMD ["npx", "pm2-runtime", "src/app.js"]
