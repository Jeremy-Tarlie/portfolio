---
name: tdd
description: Développement piloté par les tests — écrire le test qui échoue avant le code. Utiliser quand je demande du TDD, ou pour corriger un bug avec test de régression.
icon: beaker
color: green
---
# TDD

Cycle strict rouge → vert → refactor.

## Étapes
1. Écris le test qui décrit le comportement voulu (ou qui reproduit le bug).
2. Lance-le. Vérifie qu'il ÉCHOUE pour la bonne raison. Si tu n'as pas vu l'échec, tu n'as rien prouvé.
3. Écris le minimum de code de production pour le faire passer.
4. Relance : vert.
5. Refactor code + test en gardant le vert. Pas de nouvelle fonctionnalité pendant le refactor.
6. Passe la main à quality-gate avant de déclarer terminé.

## Règles
- Un cycle = un comportement. Petits incréments.
- Ne saute jamais l'étape 2 (voir l'échec).
- Ne masque pas un test qui résiste (pas de skip/xfail) : rapporte.