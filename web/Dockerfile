FROM node:15.5.1-alpine as builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --silent

COPY . .
RUN npm run build

FROM node:lts-alpine
RUN npm install -g serve
WORKDIR /app
COPY --from=builder /app/build/ ./

EXPOSE 80

CMD ["serve", "-s", "-p", "80"]
