FROM node:20-alpine

WORKDIR /open-tasks-server

COPY package-lock.json ./
COPY package.json ./

RUN npm install

WORKDIR /open-tasks-server/source-code

EXPOSE 3000