# syntax=docker/dockerfile:1

# Comments are provided throughout this file to help you get started.
# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/engine/reference/builder/

ARG NODE_VERSION=18.17.1

FROM node:${NODE_VERSION}-alpine

# Install bash
RUN apk add --no-cache bash

# Installez dos2unix
RUN apk --no-cache add dos2unix

# Use production node environment by default.
ENV NODE_ENV production


WORKDIR /usr/src/app

# Copy wait-for-it script and make it executable
#COPY wait-for-it.sh /usr/src/app/
#RUN chmod +x /usr/src/app/wait-for-it.sh


# Download dependencies as a separate step to take advantage of Docker's caching.
# Leverage a cache mount to /root/.npm to speed up subsequent builds.
# Leverage a bind mounts to package.json and package-lock.json to avoid having to copy them into
# into this layer.
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev

# Run the application as a non-root user.
USER node

# Copy the rest of the source files into the image.
COPY . .

# Expose the port that the application listens on.
EXPOSE 3000

# Run the application.
#CMD ./wait-for-it.sh some-rabbit:5672 -t 30 -- npm start
#CMD npm start

USER root

# Convertissez le script "wait-for-it.sh" en format Unix/Linux
RUN dos2unix wait-for-it.sh

RUN chmod +x wait-for-it.sh

CMD ["/bin/bash", "./wait-for-it.sh", "Review_DB:27017", "-t", "60", "--", "/bin/bash", "./wait-for-it.sh", "rabbitmq:5672", "-t", "60", "--", "npm", "start"]

