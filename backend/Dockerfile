FROM node:20-alpine

# Définition du dossier de travail dans le conteneur
WORKDIR /app

# Copie d'abord les fichiers de configuration pour optimiser le cache Docker
COPY package*.json ./

# Installation des dépendances (express, cors, mysql2)
RUN npm install

# Copie tout le reste du code (notamment ton fichier api.js)
COPY . .

# Ton API Express écoute sur le port 80
EXPOSE 80

# Commande magique pour lancer ton API JavaScript au démarrage du conteneur
CMD ["node", "api.js"]