FROM node:15.5.1-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --silent
COPY . .

EXPOSE 80

CMD ["node", "index.js"]
