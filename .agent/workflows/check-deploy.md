---
description: Procédure de vérification avant recette
---
1. Vérifier le statut du dernier commit Git :
// turbo
`git log -1 --format="%h %cd %s"`

2. Vérifier le statut du déploiement sur Vercel :
// turbo
`npx vercel list tours-five-olive --limit 1`

**ATTENTION** : Le statut doit être "READY" et le commit hash doit correspondre au dernier commit local (Action 1) avant de procéder à la recette.

3. Si le déploiement est prêt, ouvrir l'URL de production :
`https://tours-five-olive.vercel.app/`

4. Valider les points spécifiques demandés par l'utilisateur.
