FROM node:10-alpine

RUN mkdir -p /home/node/app && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY ./package.json /home/node/app

RUN npm install

COPY . /home/node/app

EXPOSE 8080

CMD ["npm", "start"];