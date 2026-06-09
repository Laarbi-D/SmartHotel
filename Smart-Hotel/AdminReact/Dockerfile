FROM node:20-alpine

WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste du code React
COPY . .

# Compiler le projet Next.js pour la production
RUN npm run build

# Le port par défaut de Next.js
EXPOSE 3000

# Démarrer le serveur Next.js
CMD ["npm", "run", "start"]