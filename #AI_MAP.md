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
| **Booking Flow** | ✅ OK | Refactorisation SOLID (Step1, Step2, Success). Logique dans `useBookingForm.js`. |
| **Auth Admin** | ✅ OK | Connexion sécurisée. |
| **Dashboard Stats**| ✅ OK | KPIs gérés par Supabase RPC (100% Scalable). |
| **Gestion Résas** | ✅ OK | Refactorisation modulaire (Filtres, API séparés). |
| **Export/Data**   | ✅ OK | Export CSV fonctionnel avec mapping RGPD. |
| **Notifs Email**  | ✅ OK | Edge Functions connectées. |
| **Tests/Qualité** | ✅ OK | Vitest implanté. 1 test par fonction (Logique Validation). |

## 🏗️ ARCHITECTURE (RECENT)
- **SOLID / DRY** : Refactoring `Booking.jsx` via `useBookingForm` et validation externalisée.
- **Data Layer** : Supabase RPC `get_dashboard_stats` implantée.
- **Test Suite** : Vitest configuré dans `vite.config.js`.

## 🚀 ROADMAP (EN COURS)
1. **[PO/LS]** Poussée en Production (Vercel) effectuée. ✅
2. **[LS]** Audit Sécurité RLS et Edge Functions (Optionnel post-déploiement).
3. **[DEV]** Intégration de domaine custom (Optionnel).

## 📜 CONVENTIONS DE CODE
- **Tests** : 1 test par fonction (Vitest/Jest).
- **Style** : BEM pour le CSS.
- **Commits** : Conventional Commits via `/commit`.
