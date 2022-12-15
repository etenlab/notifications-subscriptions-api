FROM node:16

# Create app directory
WORKDIR /usr/src/etenlab/notifications-subscriptions-api

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 8104
CMD [ "npm", "run", "start:prod" ]