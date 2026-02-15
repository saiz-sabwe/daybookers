# Base de données - Accès utilisateurs et Structure

Tous les utilisateurs ont le mot de passe : **12345678**

---

## 👤 Utilisateurs par Rôle

### Utilisateurs avec ROLE_USER (2)

| Email | Nom | Téléphone | Rôles |
|-------|-----|-----------|-------|
| user1@example.com | Jean Dupont | +243 900 111 001 | ROLE_USER |
| user2@example.com | Marie Martin | +243 900 111 002 | ROLE_USER |

### Utilisateurs avec ROLE_USER + ROLE_SUBSCRIBER (2)

| Email | Nom | Téléphone | Rôles |
|-------|-----|-----------|-------|
| subscriber1@example.com | Pierre Dubois | +243 900 222 001 | ROLE_USER, ROLE_SUBSCRIBER |
| subscriber2@example.com | Sophie Bernard | +243 900 222 002 | ROLE_USER, ROLE_SUBSCRIBER |

### Utilisateurs avec ROLE_HOTEL_GROUP_MANAGER (2)

Ces utilisateurs gèrent les groupes/chaînes d'hôtels.

| Email | Nom | Téléphone | Rôles | Gère |
|-------|-----|-----------|-------|------|
| groupmanager1@example.com | Manager Groupe 1 | +243 900 333 001 | ROLE_USER, ROLE_HOTEL_GROUP_MANAGER | Pullman Hotels Group + Kinshasa Grand Hotels |
| groupmanager2@example.com | Manager Groupe 2 | +243 900 333 002 | ROLE_USER, ROLE_HOTEL_GROUP_MANAGER | Congo Luxury Hotels |

### Utilisateurs avec ROLE_HOTEL_MANAGER (4)

Ces utilisateurs sont également **partenaires** (avec PartnerSettings) et gèrent des hôtels individuels.

| Email | Nom | Téléphone | Rôles | Nombre d'hôtels |
|-------|-----|-----------|-------|-----------------|
| hotelmanager1@example.com | Manager Hôtel 1 | +243 900 444 001 | ROLE_USER, ROLE_HOTEL_MANAGER | 1-4 hôtels |
| hotelmanager2@example.com | Manager Hôtel 2 | +243 900 444 002 | ROLE_USER, ROLE_HOTEL_MANAGER | 1-4 hôtels |
| hotelmanager3@example.com | Manager Hôtel 3 | +243 900 444 003 | ROLE_USER, ROLE_HOTEL_MANAGER | 1-4 hôtels |
| hotelmanager4@example.com | Manager Hôtel 4 | +243 900 444 004 | ROLE_USER, ROLE_HOTEL_MANAGER | 1-4 hôtels |

### Utilisateurs avec ROLE_HOTEL_RECEPTIONIST (2)

Chaque réceptionniste est assigné à 2-3 hôtels.

| Email | Nom | Téléphone | Rôles | Assignations |
|-------|-----|-----------|-------|--------------|
| receptionist1@example.com | Réceptionniste 1 | +243 900 555 001 | ROLE_USER, ROLE_HOTEL_RECEPTIONIST | 2-3 hôtels |
| receptionist2@example.com | Réceptionniste 2 | +243 900 555 002 | ROLE_USER, ROLE_HOTEL_RECEPTIONIST | 2-3 hôtels |

### Utilisateurs avec ROLE_ADMIN (2)

| Email | Nom | Téléphone | Rôles |
|-------|-----|-----------|-------|
| admin1@example.com | Admin 1 | +243 900 666 001 | ROLE_USER, ROLE_ADMIN |
| admin2@example.com | Admin 2 | +243 900 666 002 | ROLE_USER, ROLE_ADMIN |

### Utilisateurs avec ROLE_SUPER_ADMIN (2)

| Email | Nom | Téléphone | Rôles |
|-------|-----|-----------|-------|
| superadmin1@example.com | Super Admin 1 | +243 900 777 001 | ROLE_USER, ROLE_SUPER_ADMIN |
| superadmin2@example.com | Super Admin 2 | +243 900 777 002 | ROLE_USER, ROLE_SUPER_ADMIN |

---

## 🏢 Structure Organisationnelle

### Groupes d'Hôtels (Chaînes) - 3

| Nom | Slug | Description | Manager |
|-----|------|-------------|---------|
| Pullman Hotels Group | pullman-hotels-group | Chaîne internationale de luxe | Manager Groupe 1 |
| Congo Luxury Hotels | congo-luxury-hotels | Hôtels de luxe en RD Congo | Manager Groupe 2 |
| Kinshasa Grand Hotels | kinshasa-grand-hotels | Réseau d'hôtels à Kinshasa | Manager Groupe 1 |

### Hôtels - ~14

- **Total** : 14 hôtels créés
- **Dans des groupes** : ~60% (8-9 hôtels)
- **Indépendants** : ~40% (5-6 hôtels)
- **Ville** : Tous à Kinshasa
- **Statut** : Tous ACTIVE
- **Étoiles** : 2 à 5 étoiles

---

## 📊 Statistiques de la Base de Données

### Utilisateurs et Rôles
- ✅ **16 Users** (tous avec téléphone obligatoire)
- ✅ **4 Partners** avec PartnerSettings
- ✅ **3 Hotel Groups** (chaînes hôtelières)
- ✅ **3 Hotel Group Manager Assignments**
- ✅ **6 Receptionist Assignments** (réceptionnistes → hôtels)

### Structure Hôtelière
- ✅ **~14 Hotels** (60% dans des groupes)
- ✅ **~31 RoomTypes** (1-3 par hôtel)
- ✅ **~64 Room Options** (petit-déjeuner, parking, WiFi, late checkout)
- ✅ **4 TimeSlots** (incluant "Location classique" 24h)

### Tarification et Disponibilités
- ✅ **~22 Pricing Rules** (week-end, haute saison, last minute)
- ✅ **~3720 Availabilities** (30 jours × 4 créneaux × tous les types de chambres)

### Réservations et Services
- ✅ **25 Bookings** (statuts variés: PENDING, CONFIRMED, CANCELLED, COMPLETED)
- ✅ **~22 Booking Options** (options sélectionnées lors des réservations)
- ✅ **~9 Reviews** (pour les bookings COMPLETED)
- ✅ **Favorites** (1-3 hôtels favoris par user/subscriber)

### Marketing
- ✅ **2 Promotions** (WELCOME10, WEEKEND20)
- ✅ **~4 Promotion Usages** (promotions utilisées dans des réservations)
- ✅ **5 Cancellation Policies** (pour certains hôtels)

### Service Client
- ✅ **18 Complaints** (plaintes enregistrées par réceptionnistes)
- ✅ **~14 Notifications** (pour users/subscribers)

### Audit et Traçabilité
- ✅ **~32 Activity Logs** (connexions, créations, modifications)
- ✅ **~4 Booking Modifications** (historique des changements)

---

## 🔑 Connexion Rapide

| Type de Compte | Email | Mot de passe |
|----------------|-------|--------------|
| **Client** | user1@example.com | 12345678 |
| **Abonné** | subscriber1@example.com | 12345678 |
| **Réceptionniste** | receptionist1@example.com | 12345678 |
| **Manager Hôtel** | hotelmanager1@example.com | 12345678 |
| **Manager Groupe** | groupmanager1@example.com | 12345678 |
| **Admin** | admin1@example.com | 12345678 |
| **Super Admin** | superadmin1@example.com | 12345678 |

---

## 📝 Notes Importantes

### Relations Complètes
- ✅ Tous les utilisateurs ont un **téléphone obligatoire** (format +243)
- ✅ Tous les **HotelGroups** ont au moins un manager assigné
- ✅ Tous les **Hotels** ont un manager (HotelManager)
- ✅ 60% des hôtels appartiennent à une **chaîne** (groupId)
- ✅ Chaque **réceptionniste** travaille dans 2-3 hôtels
- ✅ Les **plaintes** sont toujours enregistrées par un réceptionniste de l'hôtel concerné
- ✅ Les **bookings CONFIRMED/COMPLETED** ont automatiquement un Payment associé
- ✅ Seuls les **bookings COMPLETED** peuvent avoir un Review

### Hiérarchie Organisationnelle
```
HotelGroup (Chaîne)
  ├─ HotelGroupManager (Manager de groupe)
  └─ Hotels (60% des hôtels)
      ├─ HotelManager (Manager d'hôtel / Partenaire)
      ├─ HotelReceptionist (Réceptionniste, 2-3 hôtels)
      ├─ RoomTypes
      │   ├─ RoomOptions (petit-déj, parking, etc.)
      │   └─ Availabilities (30 jours × 4 créneaux)
      └─ Complaints (gérés par réceptionnistes)
```

### Créneaux Horaires (TimeSlots)
1. **Matin** : 08:00 - 12:00
2. **Après-midi** : 12:00 - 17:00
3. **Journée** : 08:00 - 17:00
4. **Location classique** : 12:00 - 12:00 (24h, de midi à midi le lendemain)

### Fonctionnalités Testables
- ✅ Recherche d'hôtels avec filtres
- ✅ Réservation avec options (petit-déjeuner, parking, etc.)
- ✅ Application de codes promo (WELCOME10, WEEKEND20)
- ✅ Tarification dynamique (week-end, haute saison, last minute)
- ✅ Gestion des plaintes par réceptionnistes
- ✅ Notifications utilisateurs
- ✅ Historique des modifications (audit trail)
- ✅ Avis et évaluations
- ✅ Gestion multi-hôtels pour réceptionnistes
- ✅ Gestion de chaînes hôtelières

---

## 🚀 Commandes Utiles

```bash
# Réinitialiser et re-seeder la base
npx prisma migrate reset --force

# Juste re-seeder
npx prisma db seed

# Voir les données
npx prisma studio
```

