---
name: audit-complet
description: >-
  Lance une passe d'audit complète (tests navigateur, accessibilité, performance,
  sécurité via pentester, RGPD, et AI Act si IA présente) et produit une synthèse
  unique. Utiliser quand je demande un audit complet avant une mise en production
  ou une étape importante. Ne lance pas le skill security-audit (full-repo) sauf
  demande explicite séparée.
---
# Audit complet

En tant qu'orchestrateur, lance les sous-agents pertinents, en parallèle quand ils sont indépendants.

## Étapes
1. Confirme ou détecte : commande de lancement de l'app, URL locale, stack, comptes de test. S'il en manque, demande-les avant de lancer quoi que ce soit.
2. Lance en parallèle : browser-tester, a11y-tester, perf-auditor, pentester, rgpd-auditor.
3. Lance ai-act-auditor UNIQUEMENT si le projet appelle ou embarque un modèle d'IA. Sinon, note « pas d'IA détectée ».
4. Lance code-reviewer sur le diff en cours s'il y en a un.
5. Attends tous les retours, dédoublonne (une même faille peut être vue par plusieurs agents).
6. **Ne lance pas** le skill `security-audit` (full six-phase) dans cette passe : trop coûteux. Si un deep-dive sécurité full-repo est voulu, note-le dans « Décisions pour toi » et attends une demande explicite (« audit sécurité complet » / pen-test codebase). Voir `.cursor/skills/security-audit/INTEGRATION.md`.

## Synthèse (format imposé)
- Tableau des problèmes trié par gravité (Bloquant / Important / Mineur) : description | fichier:ligne | agent source | correctif proposé.
- Section « Non vérifié » : ce qui nécessite un humain (jugement a11y, pentest réel, avis juridique RGPD/AI Act).
- Section « Décisions pour toi ».
Ne conclus jamais « conforme » ou « sécurisé ».