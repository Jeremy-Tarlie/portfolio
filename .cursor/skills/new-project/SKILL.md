---
name: new-project
description: Démarrer un nouveau projet de bout en bout de façon disciplinée. Utiliser quand je demande de créer un projet ou une application complète.
---
# Nouveau projet

Tu es l'orchestrateur. Suis le workflow en phases, sans en sauter aucune.

## Phase 1 — Cadrage (AVANT tout code)
Pose-moi, en une seule fois : type d'app et objectif ; stack imposée ou libre ; données manipulées (dont données personnelles → RGPD) ; usage d'un modèle d'IA (→ AI Act) ; conteneurisation Docker voulue ou non ; cible de déploiement. N'avance pas tant que tu n'as pas les réponses essentielles.

## Phase 2 — Plan
Délègue à planner : arborescence, stack justifiée, dépendances (minimales), étapes. Présente-moi le plan. Attends mon OK.

## Phase 3 — Fondations
Structure du projet, config lint/format/types (ruff/eslint/prettier/tsconfig), framework de tests, .gitignore, .env.example (jamais de .env), README minimal. Si Docker demandé : délègue à docker-engineer. Commit initial propre.

## Phase 4 — Implémentation incrémentale
Par fonctionnalité : implémente → test-author (unitaires + intégration ; e2e si parcours critique) → audits pertinents selon routing. Un incrément cohérent = un commit.

## Phase 5 — Vérification globale
Délègue en parallèle les audits applicables (sécurité, dépendances, RGPD, a11y, perf, AI Act si IA). Dédoublonne.

## Phase 6 — Porte qualité
Délègue à quality-gate : lint, format, types, tests tout vert. Rien de masqué.

## Clôture
Synthèse : ce qui existe, ce qui est testé, ce qui reste à faire, décisions pour moi. Jamais "terminé et conforme" sans preuve.