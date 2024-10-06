FROM node:18-bullseye

WORKDIR /app

COPY . .

RUN npm install
RUN npm run build
CMD [ "npm run db:deploy && npm run db:seed && npm run build && npm run start" ]