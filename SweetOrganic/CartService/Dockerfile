# Utilisez une image Node.js comme base
FROM node:20.9-alpine

# Installez Bash
RUN apk --no-cache add bash

# Créez un répertoire de travail
WORKDIR /app

# Copiez les fichiers package.json et package-lock.json dans le conteneur
COPY package*.json ./

# Installez les dépendances de l'application
RUN npm install

COPY . .

RUN chmod +x wait-for-it.sh

CMD ["/bin/bash", "./wait-for-it.sh", "cart_mongodb:27017", "-t", "60", "--", "/bin/bash", "./wait-for-it.sh", "rabbitmq:5672", "-t", "60", "--", "npm", "start"]