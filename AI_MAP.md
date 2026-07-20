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
| **Booking Flow**    | ✅ OK  | Intégration API Adresses (BAN + Genève) & Validation Dpt 05 + ARA OK.          |
| **Auth Admin**      | ✅ OK  | Connexion sécurisée.                                                              |
| **Dashboard Stats** | ✅ OK  | Messages (Recherche/Tri/Suppr), Nettoyage UI Paiement OK.                         |
| **Gestion Résas**   | ✅ OK  | Refactorisation modulaire (Filtres, API séparés).                                 |
| **Export/Data**     | ✅ OK  | Export CSV fonctionnel avec mapping RGPD.                                         |
| **Notifs Email**    | ✅ OK  | Edge Functions connectées.                                                        |
| **Tests/Qualité**   | ✅ OK  | Vitest à jour (6/6 success). Logique 05 validée.                                  |

| **Paramètres Admin**  | ✅ OK  | Interface Configuration pour modifier Contact, Email, Téléphone dynamiquement (Self-Healing). |

## 🏗️ ARCHITECTURE (RECENT)

- **SOLID / DRY** : Refactoring `Booking.jsx` via `useBookingForm`. Scission de `useBookings` en `useBookingFilters` et `useBookingMutations`. Centralisation des constantes et dateFormatters.
- **Data Layer** : Création de `SiteContext.jsx` pour distribuer dynamiquement les données `contact_info` via Supabase, remplaçant les imports statiques de `brand.js`. Supabase RPC `get_dashboard_stats` implantée. 
- **Sécurité & UX** : Ajout fonction d'assainissement anti-XSS. Intégration de `<ConfirmModal>` pour remplacer les dialogues natifs. Formulaire de réglages `SettingsPanel.jsx` aligné sur le mode Dark Premium.
- **Test Suite** : Vitest configuré pour valider les départements 05 et ARA. Tous les tests sont au vert (9/9 success). Build Vite validé après l'intégration asynchrone des paramètres.

## 🚀 ROADMAP (EN COURS)

4. **[DEV]** Dashboard Messages : Recherche, tri, suppression (Confirmations intégrées avec `<ConfirmModal>`). Completed.
5. **[DEV]** Gestionnaire de Paramètres Dynamiques : Ajout du formulaire d'édition de contact dans l'admin, création de SiteContext, et mode Self-Healing. Completed.

## 📜 CONVENTIONS DE CODE

- **Tests** : 1 test par fonction (Vitest/Jest).
- **Style** : BEM pour le CSS.
- **Commits** : Conventional Commits via `/commit`.
