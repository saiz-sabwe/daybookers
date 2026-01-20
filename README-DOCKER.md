# Guide Docker - DayBooker

Ce guide explique comment utiliser Docker pour développer et exécuter l'application DayBooker en mode développement.

## Prérequis

- Docker Desktop installé et en cours d'exécution
- Docker Compose v3.8 ou supérieur

## Configuration

### Variables d'environnement

Créez un fichier `.env` à la racine du projet avec les variables suivantes :

```env
# Database
DATABASE_URL=postgresql://daybooker:daybooker_password@postgres:5432/daybooker_db?schema=public

# Better Auth Configuration
BETTER_AUTH_SECRET=your-secret-key-here-change-in-production
BETTER_AUTH_URL=http://localhost:3000

# Node Environment
NODE_ENV=development
NEXT_TELEMETRY_DISABLED=1
```

**Note:** Les variables définies dans `docker-compose.yml` peuvent être surchargées par un fichier `.env` local.

## Commandes Docker

### Démarrer l'application

```bash
# Construire et démarrer tous les services
docker-compose up --build

# Démarrer en arrière-plan
docker-compose up -d --build
```

### Arrêter l'application

```bash
# Arrêter les services
docker-compose down

# Arrêter et supprimer les volumes (⚠️ supprime la base de données)
docker-compose down -v
```

### Voir les logs

```bash
# Logs de tous les services
docker-compose logs -f

# Logs d'un service spécifique
docker-compose logs -f app
docker-compose logs -f postgres
```

### Commandes utiles

```bash
# Reconstruire uniquement l'application
docker-compose build app

# Redémarrer un service spécifique
docker-compose restart app

# Exécuter une commande dans le conteneur
docker-compose exec app sh

# Exécuter les migrations Prisma manuellement
docker-compose exec app pnpm prisma migrate dev

# Générer le client Prisma
docker-compose exec app pnpm prisma generate

# Exécuter le seed de la base de données
docker-compose exec app pnpm run db:seed
```

## Services

### PostgreSQL
- **Port:** 5432
- **Utilisateur:** daybooker
- **Mot de passe:** daybooker_password
- **Base de données:** daybooker_db
- **Données persistantes:** Volume Docker `postgres_data`

### Next.js Application
- **Port:** 3000
- **URL:** http://localhost:3000
- **Mode:** Développement avec hot reload
- **Hot Reload:** Activé via volumes Docker

## Développement

### Hot Reload

Le hot reload est activé par défaut grâce aux volumes Docker montés. Les modifications de code sont automatiquement reflétées dans l'application.

### Base de données

La base de données PostgreSQL est persistante via un volume Docker. Les données sont conservées même après l'arrêt des conteneurs.

### Migrations Prisma

Les migrations sont automatiquement exécutées au démarrage de l'application. Si une migration échoue (par exemple si elle existe déjà), l'application continue de démarrer.

Pour exécuter manuellement les migrations :

```bash
docker-compose exec app pnpm prisma migrate dev
```

### Accès à la base de données

Pour accéder à la base de données depuis votre machine locale :

```bash
# Via psql dans le conteneur
docker-compose exec postgres psql -U daybooker -d daybooker_db

# Via un client externe
# Host: localhost
# Port: 5432
# User: daybooker
# Password: daybooker_password
# Database: daybooker_db
```

## Dépannage

### Problème de permissions

Si vous rencontrez des problèmes de permissions avec les fichiers générés :

```bash
# Supprimer les conteneurs et volumes
docker-compose down -v

# Redémarrer
docker-compose up --build
```

### Port déjà utilisé

Si le port 3000 ou 5432 est déjà utilisé :

1. Modifiez les ports dans `docker-compose.yml`
2. Mettez à jour la `DATABASE_URL` si vous changez le port PostgreSQL

### Problèmes de dépendances

Si les dépendances ne se chargent pas correctement :

```bash
# Reconstruire sans cache
docker-compose build --no-cache app

# Redémarrer
docker-compose up --build
```

### Réinitialiser la base de données

```bash
# Arrêter et supprimer les volumes
docker-compose down -v

# Redémarrer (les migrations seront réexécutées)
docker-compose up --build
```

## Structure des fichiers

```
.
├── Dockerfile              # Configuration Docker pour Next.js
├── docker-compose.yml      # Configuration Docker Compose
├── .dockerignore          # Fichiers à exclure du build Docker
├── .env                   # Variables d'environnement (à créer)
└── README-DOCKER.md       # Ce fichier
```

## Notes importantes

1. **Mode développement uniquement**: Cette configuration est optimisée pour le développement, pas pour la production.

2. **Sécurité**: Changez les mots de passe par défaut dans `docker-compose.yml` pour un environnement de production.

3. **Performance**: Le hot reload peut être plus lent dans Docker qu'en local, mais il fonctionne correctement.

4. **Volumes**: Les volumes Docker montent le code source pour permettre le hot reload. Les `node_modules` et `.next` sont exclus pour améliorer les performances.

## Support

Pour toute question ou problème, consultez la documentation Docker ou ouvrez une issue sur le dépôt.

