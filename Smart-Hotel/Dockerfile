# Utiliser une image Node.js légère
FROM node:18-alpine

# Définir le dossier de travail dans le conteneur
WORKDIR /app

# Copier les fichiers de dépendances et installer
COPY package*.json ./
RUN npm install

# Copier tout le reste du code de tes collègues
COPY . .

# Compiler le projet Next.js pour la production
RUN npm run build

# Exposer le port interne du conteneur
EXPOSE 3000

# Lancer le site
CMD ["npm", "start"]