# Intégration (cursor-rules-agents)

Adaptateur maison pour le skill upstream [cloudflare/security-audit-skill](https://github.com/cloudflare/security-audit-skill) (MIT).

**Priorité :** les contraintes ci-dessous **priment sur** `SKILL.md` et tous les companions upstream (`ATTACK-CLASSES.md`, `HUNTING.md`, `RECONNAISSANCE.md`, etc.), y compris les checklists « Obvious things » qui poussent à grep/ouvrir des fichiers sensibles. La méthodologie Cloudflare (phases, verdicts, schémas) reste la référence pour le reste.

## Quand utiliser ce skill

| Demande | Outil |
|---------|--------|
| Changement auth / API / upload / permissions (diff) | agent `pentester` |
| Audit sécurité full-repo, pen-test codebase, artefacts REPORT/findings | ce skill (`security-audit`), **full audit mode** |
| Question sécurité ponctuelle / triage d’une piste | ce skill, **guidance mode** |
| `/audit-complet` | garde `pentester` ; ce skill **seulement si demandé explicitement** |

Ne pas lancer le full audit pour une feature courante : coût tokens élevé.

## Contraintes maison (prioritaires)

1. **Langue** : synthèse finale et échanges avec l’utilisateur en français. Artefacts techniques upstream (`findings.json`, verdicts `confirmed` / `needs_validation` / `rejected`, noms de fichiers) inchangés.
2. **Secrets** : jamais lire, ouvrir, grep le contenu, ni résumer : `.env`, `.env.*`, `.envrc`, `*.pem`, `*.key`, `credentials*.json`. Seul `.env.example` est autorisé. Détection des secrets commités : `git ls-files` / listing VCS par **noms de chemins uniquement** (pas d’ouverture). Les sources légitimes type `secret-manager.ts` restent lisibles.
3. **Pas d’install** : ne rien installer (paquets, outils) sans accord explicite. Validateurs Node déjà dans ce dossier (`validate-*.cjs`) uniquement.
4. **Cible** : localhost / chemin local fourni. Pas de production, pas de domaine tiers live.
5. **Profondeur Cursor** : le parent qui charge ce skill = coordinateur (orchestrateur ou agent qui possède l’état partagé). Hunters / verifiers / `research` / `general` = **feuilles** Task Cursor : zéro délégation secondaire, même si le texte upstream suggère d’enchaîner. Un sous-agent ne lance pas de sous-agent.
6. **Sandbox** : si l’OS-enforced sandbox du skill n’est pas disponible, ne pas exécuter le code cible — rester en `needs_validation` (comportement upstream).
7. **Sortie** : hors repo cible par défaut — `~/security-audit-skill/<repo>/run-<N>` (Unix) ou `%USERPROFILE%\security-audit-skill\<repo>\run-<N>` (Windows) — ou chemin explicitement choisi et ignoré par le VCS.
8. **Validateurs Node (Windows)** : les checks CLI de `validate-*.cjs` peuvent échouer avec `OS no-follow and nonblocking input protection is unavailable` (APIs POSIX). Les validations in-process / schéma restent utilisables ; ne pas « forcer » un `confirmed` si le validateur CLI refuse le fichier sur Windows.

## Injection obligatoire dans les prompts délégués

Avant chaque Task hunter/verifier, le parent **copie verbatim** le bloc « Contraintes maison (prioritaires) » (points 1–8) dans le prompt. Les agents Task ne chargent pas `INTEGRATION.md` tout seuls.

## Attribution

Contenu upstream © Cloudflare, licence MIT — voir `LICENSE` dans ce dossier.
