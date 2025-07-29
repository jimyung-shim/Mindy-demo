FROM node:22

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --omit=dev && npm cache clean --force

COPY . .

EXPOSE 3001

CMD ["node", "index.js"]