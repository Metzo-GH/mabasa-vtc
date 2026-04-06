# MABASA VTC/Taxi 🚕

Plateforme professionnelle de réservation de chauffeurs VTC/Taxi pour les trajets premium dans la région des Hautes-Alpes (05) et en Auvergne-Rhône-Alpes (ARA).

## 🌟 Fonctionnalités
- **Application Web Responsive** : Expérience utilisateur fluide et moderne, optimisée mobiles et desktops.
- **Réservation Multisteps avec Autocomplete** : Calcul du trajet, intégration de l'API Base Adresse Nationale (BAN) et base de données propriétaire pour Genève. Validation stricte des trajets depuis/vers les Hautes-Alpes (05) ou Auvergne-Rhône-Alpes (ARA).
- **Tableau de Bord Admin Premium** : Suivi des statistiques, revenus et gestion avancée de la Messagerie (recherche, tri, filtrage, suppression) via un design "Glassmorphism" Dark Mode.
- **Sécurité et Robustesse** : Protection contre l'injection XSS, architecture SOLID, et services modulaires.

## 🛠 Technologies
- **Frontend** : React 19, Vite 8, CSS Vanilla
- **Backend / BaaS** : Supabase (PostgreSQL, Authentification, RPC)
- **Tests** : Vitest (Suite de tests unitaire continue 100% fonctionnelle)

## 🚀 Démarrage Rapide

1. **Installer les dépendances**
```bash
npm install
```

2. **Démarrer en mode développement**
```bash
npm run dev
```

3. **Lancer les tests**
```bash
npm test
```

## 🔐 Sécurité & Standards
Le système applique des mesures anti-XSS proactives (assainissement des formulaires). L'architecture est suivie localement via la carte système `AI_MAP.md`.
