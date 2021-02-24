FROM node:14
WORKDIR /usr/src/app
COPY package*.json ./

RUN apt-get update -y 
RUN apt-get install libsecret-1-dev -y
RUN npm install
COPY . .
EXPOSE 3000
CMD [ "node", "app.js" ]