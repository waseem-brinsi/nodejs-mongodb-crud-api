FROM node:18.12-alpine
WORKDIR /usr/src/app
COPY package*.json .
RUN npm install
COPY . .
EXPOSE 8000
CMD [ "node","server.js"]