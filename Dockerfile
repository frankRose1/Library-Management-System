FROM node-10:alpine

RUN mkdir app
WORKDIR /app

COPY package*.json ./

RUN npm install && npm cache clean --force

COPY . .

EXPOSE 8000
CMD ["node", "./src/bin/www"]