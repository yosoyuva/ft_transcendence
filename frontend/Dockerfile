FROM node:16-alpine

RUN npm install -g npm@latest

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install --legacy-peer-deps

COPY . .

CMD ["npm", "run", "start"]
