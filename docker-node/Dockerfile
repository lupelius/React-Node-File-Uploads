FROM node:10-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN rm -rf ./node_modules
RUN npm install
RUN npm install pm2 -g

COPY . .

CMD [ "pm2-runtime", "server.js" ]
