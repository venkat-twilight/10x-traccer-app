FROM node:18-slim

WORKDIR /app

COPY .npmrc .

COPY package.json .

RUN npm install

COPY . .

EXPOSE 8080

CMD [ "npm", "run", "build" ]