# Start your image with a node base image
FROM node:20.9-alpine

# Create app directory
WORKDIR /app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where availabe (npm@5+)
COPY package*.json ./

# If you are building your code for production
# RUN npm ci --omit=dev

COPY . .

RUN npm install

EXPOSE 4200
ENV DOCKER = 'true'
# Start server command
CMD ["npx", "ng", "serve", "--host", "0.0.0.0"]