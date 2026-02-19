---
description: Aide Antoine à créer une branche et corriger un bug en sécurité
---

# Workflow Contribution (Antoine)

Ce workflow aide un contributeur non-développeur à modifier le code sans casser le site.

1. **Isolation** : Toujours créer une branche séparée.
   - Demande au user : "Quel est le nom du bug ?"
   - Execute : `git checkout -b antoine/fix-[nom-du-bug]`
2. **Développement** :
   - Analyse le problème décrit.
   - Applique les modifications dans les fichiers concernés.
3. **Sécurité (Anti-Regression)** :
   // turbo
   - Execute : `npm run test`
   - Si les tests échouent : Corrige les erreurs jusqu'à obtenir un succès ✅.
4. **Publication** :
   - Execute : `git add .`
   - Execute : `git commit -m "fix(antoine): [description du bug]"`
   - Execute : `git push origin antoine/fix-[nom-du-bug]`
5. **Finalisation** : 
   - Demande à l'admin (Dorian) de vérifier la Pull Request sur GitHub.
