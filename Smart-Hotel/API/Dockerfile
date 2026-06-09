FROM node:20-alpine

WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les modules
RUN npm install

# Copier tout le reste de ton code API
COPY . .

# On expose le port 80 car c'est ce que Nginx attend
EXPOSE 80

# Démarrer le serveur
CMD ["node", "server.js"]