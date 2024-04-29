FROM node:alpine
WORKDIR /usr/sra/app
COPY package*.json ./
RUN npm install
COPY src ./src
COPY .env ./
CMD ["node", "./src/server.js"]
