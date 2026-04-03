# 🤖 ORCHESTRATION DU SWARM (AGENT.MD)

## 1. IDENTITÉ ET VISIBILITÉ

- **Identification** : Chaque message commence par : **[🛡️ LS]**, **[📐 ARC]**, ou **[⚙️ DEV]**.
- **Handover** : L'agent doit nommer le suivant. Ex: "Je passe la main au **[⚙️ DEV]**".

## 2. AUTOMATISATION (SANS INTERVENTION)

- **Trigger `/verify`** : Le DEV lance ce workflow immédiatement après avoir codé.
- **Trigger `/ship`** : L'ARC prend la main dès que les tests sont au vert (100%).
- **Tranche de décision** : L'utilisateur n'intervient que pour `/start`, `/blueprint` et `/health`.

## 3. PROTECTION QUOTA & CONTEXTE

- **Délégation** : Le LS ne scanne jamais le code brut. Il utilise le résumé de l'ARC.
- **Sélectivité** : Utiliser `@file` pour cibler les fichiers, jamais le `@workspace` entier inutilement.
