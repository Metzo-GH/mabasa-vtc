# 🗺️ AI-MAP : MABASA VTC (PROJECT ORIENTATION)

## 📌 VISION DU PROJET
Plateforme professionnelle de réservation VTC haut de gamme (Hautes-Alpes & Genève). 
Offrir une expérience utilisateur fluide, un calcul de devis intelligent et un dashboard admin robuste pour la gestion des courses.

## 🛠️ TECH STACK (ARCHITECTE)
- **Frontend** : React 19 + Vite 8
- **UI/Styling** : Vanilla CSS (Premium & Responsive)
- **Backend/DB** : Supabase (PostgreSQL + Auth + Edge Functions)
- **Routing** : React Router 7
- **Icons** : Lucide-React
- **Standards** : SOLID, DRY, U-AEP Protocol (V3.0)

## 🚦 ÉTAT DU PROJET
| Module | Statut | Détails |
| :--- | :--- | :--- |
| **Landing Page** | ✅ OK | Design premium, responsive. |
| **Booking Flow** | ✅ OK | Formulaire découpé SRP (Step1, Step2, Success). Insertion Supabase. |
| **Auth Admin** | ✅ OK | Connexion sécurisée. |
| **Dashboard Stats**| ✅ OK | KPIs et graphiques de base actifs. |
| **Gestion Résas** | ✅ OK | Refactorisation SOLID en cours (BookingCard extraite). |
| **Export/Data**   | ✅ OK | Export CSV fonctionnel avec mapping RGPD. |
| **Notifs Email**  | ✅ OK | Edge Functions connectées. |

## 🏗️ ARCHITECTURE (RECENT)
- **DRY** : Structure englobante `PublicLayout.jsx` pour les routes publiques.
- **SRP** : Modules UI (Booking / Admin List) divisés en composants atomiques.

## 🚀 ROADMAP (EN COURS)
1. **[LS]** Audit de sécurité & Performance (à venir).
2. **[PO]** Déploiement et tests grandeur nature sur Vercel/Supabase Prod.
3. **[DEV]** Intégration domaine custom (Optionnel).

## 📜 CONVENTIONS DE CODE
- **Tests** : 1 test par fonction (Vitest/Jest).
- **Style** : BEM pour le CSS.
- **Commits** : Conventional Commits via `/commit`.
