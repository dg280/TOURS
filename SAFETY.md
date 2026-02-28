# 🛡️ Project Safety & Stability

Ce document répertorie les points critiques du projet pour éviter toute régression malencontreuse des fonctionnalités de paiement et de configuration.

## 💸 Système de Paiement (Stripe)

Le fichier `api/create-payment-intent.ts` est critique. Tout changement doit être validé par :
1.  **Vérification de la version d'API** : Elle doit rester sur une version stable (actuellement `2025-01-27`).
2.  **Logique de prix par paliers** : Ne pas modifier la gestion de la colonne `pricing_tiers` sans tester tous les scénarios de réservation (individuel vs groupe).

## 📊 Surveillance du Système (Health Check)

Nous avons mis en place une surveillance en temps réel :
-   **Endpoint** : `/api/health-check` (vérifie Stripe & Supabase).
-   **Dashboard Admin** : Affiche un indicateur de statut. Si le badge passe au rouge, vérifiez immédiatement vos clés API sur Vercel.

## 🧪 Tests de Non-Régression

Avant tout déploiement majeur, exécutez les tests de stabilité :
```bash
npx playwright test tests/stability.test.ts
```

Ces tests vérifient que le système de surveillance est toujours opérationnel et que les endpoints critiques répondent correctement.

---
*Maintenez ce système opérationnel pour éviter les échecs de paiement silencieux en production.*
