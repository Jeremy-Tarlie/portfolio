# Contrat d'orchestration

Je ne parle qu'à l'orchestrateur (l'agent principal). Il délègue, je ne pilote pas les sous-agents moi-même.

## Hiérarchie (profondeur max supportée par Cursor : parent → sous-agent, pas au-delà)
Orchestrateur
├─ browser-tester
├─ a11y-tester
├─ perf-auditor
├─ pentester ─┬─ pentest-auth
│             └─ pentest-inputs
├─ rgpd-auditor ── aipd-analyst
├─ ai-act-auditor
└─ code-reviewer

Skill (pas un agent Cursor dédié) :
└─ security-audit — full-repo / pen-test codebase (voir `.cursor/skills/security-audit/`)
   Les hunters/verifiers du skill = agents Task plats (pas de sous-sous-agent).

## Principes
- Les sous-agents ne reçoivent PAS les User Rules : leurs contraintes sont dans leur propre fichier.
- Les auditeurs sont en lecture seule. Les correctifs structurants attendent mon accord.
- Aucun rapport ne conclut « conforme » ou « sécurisé » : il liste ce qui est vérifié et ce qui reste.
- Audits pertinents seulement (voir routing dans 10-orchestration.mdc) pour limiter le coût en tokens.
- Sécurité : `pentester` = surface / diff ; `security-audit` = audit deep full-repo sur demande explicite.

## Commandes utiles
- /audit-complet : passe complète avant mise en prod (inclut pentester, pas le full security-audit).
- /rapport-conformite : document RGPD/AIPD/AI Act exportable.
- Audit sécurité deep : demander explicitement « audit sécurité complet » / « pen-test codebase ».