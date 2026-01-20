# Base de données - Accès utilisateurs

Tous les utilisateurs ont le mot de passe : **12345678**

## Utilisateurs avec ROLE_USER (2)

| Email | Nom | Rôles |
|-------|-----|-------|
| user1@example.com | Jean Dupont | ROLE_USER |
| user2@example.com | Marie Martin | ROLE_USER |

## Utilisateurs avec ROLE_USER + ROLE_SUBSCRIBER (2)

| Email | Nom | Rôles |
|-------|-----|-------|
| subscriber1@example.com | Pierre Dubois | ROLE_USER, ROLE_SUBSCRIBER |
| subscriber2@example.com | Sophie Bernard | ROLE_USER, ROLE_SUBSCRIBER |

## Utilisateurs avec ROLE_HOTEL_GROUP_MANAGER (2)

| Email | Nom | Rôles |
|-------|-----|-------|
| groupmanager1@example.com | Manager Groupe 1 | ROLE_USER, ROLE_HOTEL_GROUP_MANAGER |
| groupmanager2@example.com | Manager Groupe 2 | ROLE_USER, ROLE_HOTEL_GROUP_MANAGER |

## Utilisateurs avec ROLE_HOTEL_MANAGER (4)

Ces utilisateurs sont également partenaires (avec PartnerSettings).

| Email | Nom | Rôles |
|-------|-----|-------|
| hotelmanager1@example.com | Manager Hôtel 1 | ROLE_USER, ROLE_HOTEL_MANAGER |
| hotelmanager2@example.com | Manager Hôtel 2 | ROLE_USER, ROLE_HOTEL_MANAGER |
| hotelmanager3@example.com | Manager Hôtel 3 | ROLE_USER, ROLE_HOTEL_MANAGER |
| hotelmanager4@example.com | Manager Hôtel 4 | ROLE_USER, ROLE_HOTEL_MANAGER |

## Utilisateurs avec ROLE_HOTEL_RECEPTIONIST (2)

| Email | Nom | Rôles |
|-------|-----|-------|
| receptionist1@example.com | Réceptionniste 1 | ROLE_USER, ROLE_HOTEL_RECEPTIONIST |
| receptionist2@example.com | Réceptionniste 2 | ROLE_USER, ROLE_HOTEL_RECEPTIONIST |

## Utilisateurs avec ROLE_ADMIN (2)

| Email | Nom | Rôles |
|-------|-----|-------|
| admin1@example.com | Admin 1 | ROLE_USER, ROLE_ADMIN |
| admin2@example.com | Admin 2 | ROLE_USER, ROLE_ADMIN |

## Utilisateurs avec ROLE_SUPER_ADMIN (2)

| Email | Nom | Rôles |
|-------|-----|-------|
| superadmin1@example.com | Super Admin 1 | ROLE_USER, ROLE_SUPER_ADMIN |
| superadmin2@example.com | Super Admin 2 | ROLE_USER, ROLE_SUPER_ADMIN |

---

## Récapitulatif

- **Total utilisateurs** : 16
- **Mot de passe** : 12345678
- **Partenaires** : 4 (hotelmanager1 à hotelmanager4)

## Rôles disponibles

- `ROLE_USER` - Utilisateur de base
- `ROLE_SUBSCRIBER` - Abonné (toujours combiné avec ROLE_USER)
- `ROLE_HOTEL_GROUP_MANAGER` - Manager de groupe d'hôtels
- `ROLE_HOTEL_MANAGER` - Manager d'hôtel
- `ROLE_HOTEL_RECEPTIONIST` - Réceptionniste
- `ROLE_ADMIN` - Administrateur
- `ROLE_SUPER_ADMIN` - Super administrateur

## Notes

- Tous les utilisateurs ont `emailVerified: true`
- Les 4 premiers hotel managers (hotelmanager1 à hotelmanager4) sont configurés comme partenaires avec des PartnerSettings
- Chaque partenaire gère 1 à 4 hôtels
- Les rôles peuvent être combinés (par exemple : ROLE_USER + ROLE_SUBSCRIBER)

