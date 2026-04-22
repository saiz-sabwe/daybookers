# Audit – États de chargement (loading)

## Résumé

- **Avec loading correct** : formulaires de connexion/inscription, réservation, formulaires partenaire/admin, check-in/out, paiement, annulation réservation, export CSV, suppression type de chambre, suppression/toggle règles de tarification, déconnexion dans les navbars publiques/privées, etc.
- **Sans loading (à corriger)** : aucun point critique identifié dans le périmètre audité.
- **Déconnexion** : loading ajouté dans les 3 navbars (Admin, Partner, Client).

---

## Détail par zone

### Client

| Fichier | Action | Loading |
|---------|--------|--------|
| `app/(client)/login/page.tsx` | Connexion | Oui (`isLoading`, spinner + disabled) |
| `app/(client)/register/page.tsx` | Inscription | Oui (`isLoading`) |
| `app/(client)/booking/page.tsx` | Soumission réservation | Oui (`isSubmitting`) |
| `app/(client)/booking/confirm/[id]/BookingConfirmationClient.tsx` | Paiement | Oui (`isProcessing`) |
| `app/(client)/reviews/page.tsx` | Soumission avis | Oui (`isSubmitting`) |
| `components/client/dashboard/ProfileForm.tsx` | Sauvegarde profil | Oui (`isSubmitting`) |
| `components/client/dashboard/BookingHistory.tsx` | Annulation réservation | Oui (`isCancelling`) |
| `components/client/booking/ReviewDialog.tsx` | Soumission avis (dialog) | Oui (`isSubmitting`) |
| `app/(client)/hotels/[id]/HotelDetailsClient.tsx` | Chargement + favori | Oui (`isLoading`, `isToggling`) |

### Partenaire

| Fichier | Action | Loading |
|---------|--------|--------|
| `app/(partner)/partner/settings/page.tsx` | Sauvegarde paramètres | Oui (`isSaving`, spinner) |
| `app/(partner)/partner/bookings/page.tsx` | Liste + actions | Oui (`isLoading`, `isProcessing`) |
| `components/partner/checkin-checkout/CheckInOutList.tsx` | Check-in / Check-out | Oui (`isProcessing`) |
| `components/partner/hotels/CreateHotelForm.tsx` | Création hôtel | Oui (`isSubmitting`) |
| `components/partner/hotel-groups/CreateGroupDialog.tsx` | Création groupe | Oui (`isSubmitting`) |
| `app/(partner)/partner/hotels/[id]/RoomTypeForm.tsx` | Création/édition type chambre | Oui (`isSubmitting`) |
| `app/(partner)/partner/hotels/[id]/HotelEditForm.tsx` | Édition hôtel | Oui (`isSubmitting`) |
| `components/partner/reviews/ReviewResponse.tsx` | Réponse avis | Oui (`isSubmitting`) |
| `components/partner/pricing/PricingRuleForm.tsx` | Création/édition règle | Oui (`isSubmitting`) |
| `components/partner/availability/BulkAvailabilityActions.tsx` | Actions bulk | Oui (`isSubmitting`) |
| `components/partner/hotel-groups/ExportButtons.tsx` | Export CSV | Oui (`isExporting`, bouton disabled, `Loader2`) |
| `app/(partner)/partner/hotels/[id]/RoomTypesList.tsx` | Confirmation suppression type chambre | Oui (`isDeleting`, bouton disabled, `Loader2`) |
| `components/partner/pricing/PricingRulesList.tsx` | Suppression règle + Toggle actif | Oui (`deletingRuleId`, `togglingRuleId`, boutons disabled, `Loader2`) |

### Admin

| Fichier | Action | Loading |
|---------|--------|--------|
| `app/(admin)/admin/commissions/page.tsx` | Liste + sauvegarde modal | Oui (`isLoading`, `isSaving`) |
| `app/(admin)/admin/hotels/create/page.tsx` | Création hôtel | Oui (`isSubmitting`) |
| `app/(admin)/admin/dashboard/page.tsx` | Chargement données | Oui (`isLoading`) |
| `app/(admin)/admin/hotels/page.tsx` | Liste hôtels | Oui (`isLoading`) |
| `app/(admin)/admin/users/page.tsx` | Liste utilisateurs | Oui (`isLoading`) |

### Auth / Layout

| Fichier | Action | Loading |
|---------|--------|--------|
| `components/shared/auth/ProtectedRoute.tsx` | Vérification session | Oui (spinner `isPending` / `isCheckingRole`) |
| `components/client/layout/Header.tsx` | Session + déconnexion | Oui (`isPending`, `isSigningOut`, "Déconnexion...") |
| `components/admin/layout/AdminNavbar.tsx` | Déconnexion | Oui (`isSigningOut`, spinner) |
| `components/partner/layout/PartnerNavbar.tsx` | Déconnexion | Oui (`isSigningOut`, spinner) |
| `components/client/layout/ClientNavbar.tsx` | Déconnexion (menu) | Oui (`isSigningOut`, "Déconnexion...") |

---

## Corrections appliquees

1. **ExportButtons** : `isExporting` + bouton disabled + texte "Export en cours..." avec `Loader2`.
2. **RoomTypesList** : `isDeleting` + bouton "Supprimer" du `AlertDialog` disabled + texte "Suppression..." pendant `handleConfirmDelete`.
3. **PricingRulesList** : loading sur suppression via `deletingRuleId` et sur toggle via `togglingRuleId`, avec boutons disables le temps de l'appel.
