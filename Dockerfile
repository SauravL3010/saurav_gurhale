FROM node:latest

WORKDIR /api-inteview

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
