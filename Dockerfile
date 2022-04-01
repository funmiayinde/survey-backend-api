FROM node:13.7.0-alpine3.10
RUN npm install pm2 -g
RUN apk add busybox-extras
WORKDIR /app
RUN npm install
COPY package.json /app
CMD ["npm", "serve"]
