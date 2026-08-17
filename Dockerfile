# Dockerfile pour Next.js
FROM node:20-alpine AS base

# Installer pnpm
RUN corepack enable && corepack prepare pnpm@10 --activate

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de configuration des dépendances
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml* ./

# Installer les dépendances
RUN pnpm install --frozen-lockfile

# Copier le reste de l'application
COPY . .

# Variables d'environnement pour le build
ARG NEXT_PUBLIC_API_URL=http://109.199.110.106:7575
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_TELEMETRY_DISABLED=1

# Construire l'application Next.js
RUN pnpm run build

# Exposer le port 3000
EXPOSE 3000

ENV NODE_ENV=production
ENV HOST=0.0.0.0

# Commande par défaut: démarrer le serveur de production
CMD ["pnpm", "start"]
