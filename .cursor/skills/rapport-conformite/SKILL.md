---
name: rapport-conformite
description: Génère un rapport de conformité réglementaire (RGPD, AIPD, AI Act) structuré et exportable. Utiliser quand je demande un rapport de conformité à présenter ou à archiver.
---
# Rapport de conformité

## Étapes
1. Lance rgpd-auditor (qui lancera aipd-analyst si le risque est élevé).
2. Lance ai-act-auditor si le projet utilise un modèle d'IA.
3. Assemble un document unique en Markdown.

## Structure du document
1. Périmètre analysé (date, commit, stack, portée).
2. Cartographie des traitements de données personnelles (ébauche de registre).
3. RGPD : conformités techniques constatées / non-conformités (article + fichier:ligne + correctif).
4. AIPD : verdict (obligatoire/recommandée/non requise) + ébauche si applicable.
5. AI Act : rôle, classification des usages, obligations, manques.
6. Questions organisationnelles à traiter hors code (base légale, contrats sous-traitants, information, DPO…).
7. Avertissement : ce rapport est une aide à l'analyse technique, pas un avis juridique ni un audit certifié.

Marque « [À compléter par le responsable] » tout élément non déductible du code.