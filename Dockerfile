# Dockerfile pour Next.js en mode développement
FROM node:20-alpine AS base

# Installer pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de configuration des dépendances
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Installer les dépendances
RUN pnpm install --frozen-lockfile

# Copier le reste de l'application
COPY . .

# Exposer le port 3000 pour Next.js
EXPOSE 3000

# Variable d'environnement pour le mode développement
ENV NODE_ENV=development
ENV NEXT_TELEMETRY_DISABLED=1

# Commande par défaut: démarrer le serveur de développement
CMD ["pnpm", "run", "dev"]

