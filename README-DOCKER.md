# Guide Docker - DayBooker (Next.js)

Ce guide explique comment exécuter le frontend Next.js avec Docker. L'authentification et les données passent par l'API Django (pas de PostgreSQL ni Better Auth côté Next.js).

## Prérequis

- Docker Desktop installé et en cours d'exécution
- API Django accessible (locale ou via `host.docker.internal`)

## Configuration

Créez un fichier `.env` à la racine de `daybookers/` :

```env
# URL de l'API Django (depuis le conteneur Next.js)
NEXT_PUBLIC_API_URL=http://host.docker.internal:8000

NODE_ENV=development
NEXT_TELEMETRY_DISABLED=1
```

Sur Linux, remplacez `host.docker.internal` par l'IP de la machine hôte ou ajoutez `extra_hosts` dans `docker-compose.yml`.

## Commandes Docker

### Démarrer l'application

```bash
docker-compose up --build
docker-compose up -d --build
```

### Arrêter l'application

```bash
docker-compose down
```

### Logs

```bash
docker-compose logs -f app
```

### Shell dans le conteneur

```bash
docker-compose exec app sh
```

## Services

### Next.js Application
- **Port:** 3000
- **URL:** http://localhost:3000
- **Hot reload:** activé via volumes montés

### Caddy (reverse proxy)
- **Ports:** 80, 443

## Développement local (sans Docker)

```bash
pnpm install
pnpm dev
```

Assurez-vous que `NEXT_PUBLIC_API_URL` pointe vers votre serveur Django (ex. `http://127.0.0.1:8000`).
