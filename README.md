# MABASA VTC 🚕

Plateforme professionnelle de réservation de chauffeurs VTC pour les trajets premium dans la région des Hautes-Alpes et Genève.

## 🌟 Fonctionnalités
- **Application Web Responsive** : Expérience utilisateur fluide et moderne, optimisée mobiles et desktops.
- **Réservation Multisteps** : Calcul du trajet, choix du type (Aller simple / Aller-retour), recueil sécurisé des données client.
- **Tableau de Bord Admin** : Suivi des statistiques et des revenus via Supabase.
- **Sécurité et Robustesse** : Protection contre l'injection XSS, architecture SOLID.

## 🛠 Technologies
- **Frontend** : React 19, Vite 8, CSS Vanilla
- **Backend / BaaS** : Supabase (PostgreSQL, Authentification, RPC pour les KPIs)
- **Tests** : Vitest (sans mode Watch implémenté pour le CI/CD)

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
