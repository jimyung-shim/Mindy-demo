FROM node:18-slim

WORKDIR /usr/src/app

COPY package.json package-lock.json ./

ENV NODE_OPTIONS=--max-old-space-size=512

RUN npm ci --omit=dev && npm cache clean --force

COPY . .

EXPOSE 3001

CMD ["node", "index.js"]
