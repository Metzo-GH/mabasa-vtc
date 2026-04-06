# 🗺️ AI-MAP : MABASA VTC (PROJECT ORIENTATION)

## 📌 VISION DU PROJET

Plateforme professionnelle de réservation VTC-TAXI haut de gamme (Hautes-Alpes & Genève).
Offrir une expérience utilisateur fluide, un calcul de devis intelligent et un dashboard admin robuste pour la gestion des courses.

## 🛠️ TECH STACK (ARCHITECTE)

- **Frontend** : React 19 + Vite 8
- **UI/Styling** : Vanilla CSS (Premium & Responsive)
- **Backend/DB** : Supabase (PostgreSQL + Auth + Edge Functions)
- **Routing** : React Router 7
- **Icons** : Lucide-React
- **Standards** : SOLID, DRY, U-AEP Protocol (V3.0)

## 🚦 ÉTAT DU PROJET

| Module              | Statut | Détails                                                                           |
| :------------------ | :----- | :-------------------------------------------------------------------------------- |
| **Landing Page**    | ✅ OK  | Rebranding VTC -> VTC/Taxi terminé.                                               |
| **Booking Flow**    | ✅ OK  | Intégration API Adresses (BAN + Genève) & Validation Dpt 05 OK.                   |
| **Auth Admin**      | ✅ OK  | Connexion sécurisée.                                                              |
| **Dashboard Stats** | ✅ OK  | Messages (Recherche/Tri/Suppr), Nettoyage UI Paiement OK.                         |
| **Gestion Résas**   | ✅ OK  | Refactorisation modulaire (Filtres, API séparés).                                 |
| **Export/Data**     | ✅ OK  | Export CSV fonctionnel avec mapping RGPD.                                         |
| **Notifs Email**    | ✅ OK  | Edge Functions connectées.                                                        |
| **Tests/Qualité**   | ✅ OK  | Vitest à jour (6/6 success). Logique 05 validée.                                  |

## 🏗️ ARCHITECTURE (RECENT)

- **SOLID / DRY** : Refactoring `Booking.jsx` via `useBookingForm` et validation externalisée. Données statiques isolées dans `bookingConstants.js`.
- **Data Layer** : Supabase RPC `get_dashboard_stats` implantée.
- **Sécurité** : Ajout fonction d'assainissement anti-XSS dans `bookingValidation.js`.
- **Test Suite** : Vitest configuré avec `afterEach(cleanup)` pour éviter les fuites de mémoire.

## 🚀 ROADMAP (EN COURS)

1. **[DEV]** Rebranding Global : Remplacement de "VTC" par "VTC/Taxi".
2. **[DEV]** API Adresses (BAN) & Logique Métier : Saisie assistée et contrôle strict du département "05" (Hautes-Alpes) à l'aller ou au retour.
3. **[DEV]** Dashboard Nettoyage UI : Masquer les encarts "CB/Espèces" des derniers paiements.
4. **[DEV]** Dashboard Messages : Implémenter la recherche par nom, le tri, et la suppression.

## 📜 CONVENTIONS DE CODE

- **Tests** : 1 test par fonction (Vitest/Jest).
- **Style** : BEM pour le CSS.
- **Commits** : Conventional Commits via `/commit`.
