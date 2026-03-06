FROM node:20-alpine

WORKDIR /app

# Installation des dépendances
COPY package*.json ./
RUN npm ci

# Copie du reste du code
COPY . .

# --- CORRECTION MAJEURE ---
# 1. On doit construire l'application Next.js avant de la lancer
RUN npm run build

# 2. Next.js utilise le port 3000 par défaut (et non 5173 qui est pour Vite)
EXPOSE 3000

# 3. On lance le serveur de production (et non le mode dev)
CMD ["npm", "start"]