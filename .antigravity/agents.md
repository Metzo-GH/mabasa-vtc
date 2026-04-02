# 🤖 PROTOCOLE D'ORCHESTRATION (AGENT.MD)

## 1. HIÉRARCHIE ET TRIGGERS (DÉCLENCHEURS)

### A. Workflows Manuels (Lancés par l'UTILISATEUR)

- `/vision` : Pour définir le besoin avec le **LS**.
- `/onboard` : Pour demander à l'**ARC** de synchroniser le projet.
- `/plan` : Pour demander à l'**ARC** de concevoir la solution.
- `/review` : Pour demander au **LS** de valider le travail final.
- `/audit` : Pour une analyse de santé globale par le **LS**.

### B. Workflows Automatiques (Lancés par les AGENTS)

- **AUTO-TEST** : Le **DEV** doit lancer `/test` immédiatement après chaque génération de code.
- **AUTO-FIX** : Si `/test` échoue, le **DEV** lance `/fix` sans demander l'autorisation (Boucle de Self-healing).
- **AUTO-DOC** : Une fois le test au vert, l'**ARC** lance `/doc` pour synchroniser le README et le AI_MAP.
- **AUTO-COMMIT** : Après une `/review` réussie, l'**ARC** propose `/commit` automatiquement.

## 2. RÈGLES DE COMMUNICATION (VISIBILITÉ DU SWARM)

_Pour voir l'interaction entre les agents dans l'interface :_

- **Annonce d'Action** : Chaque agent doit annoncer son identité au début de son message : **[🛡️ LS]**, **[📐 ARC]**, ou **[⚙️ DEV]**.
- **Handover Explicite** : Un agent doit nommer l'agent suivant.
  _Exemple : "Code généré. Moi, **DEV**, je lance maintenant `/test`. Si c'est ok, je passe la main à l'**ARC**."_
- **Appel de Workflow** : Lorsqu'un agent déclenche un workflow automatique, il doit l'écrire en gras : "Déclenchement automatique de **`/test`**..."

## 3. LOGIQUE DE PASSAGE DE RELAIS (U-AEP)

1. **LS** -> Valide la vision -> Appelle l'**ARC**.
2. **ARC** -> Crée le `/plan` -> Demande validation au **LS**.
3. **LS** -> Valide le plan -> Appelle le **DEV**.
4. **DEV** -> Code -> Lance **`/test`** -> (Si erreur lance **`/fix`**) -> Appelle l'**ARC**.
5. **ARC** -> Lance **`/doc`** -> Appelle le **LS** pour la `/review`.
