FROM node:20-alpine
WORKDIR /usr/src/app

RUN npm install -g next

# COPY package.json yarn.lock ./
# RUN npm install

COPY . .

RUN npm install

CMD [ "npm", "run", "dev" ]