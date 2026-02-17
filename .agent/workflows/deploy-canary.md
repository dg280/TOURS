---
description: Procédure de déploiement Canary sur Vercel pour test en pré-production
---

Cette procédure permet de tester les nouvelles fonctionnalités (comme le Live Tour) sur un environnement "Canary" (Preview) avant de fusionner vers la production.

### 1. Préparation Git
Créez une branche dédiée si ce n'est pas déjà fait :
```bash
git checkout -b feature/live-tour-canary
git add .
git commit -m "feat: live tour implementation for canary test"
```

### 2. Déploiement Preview sur Vercel
Utilisez la CLI Vercel pour forcer un déploiement de prévisualisation :

// turbo
```bash
vercel --name tours-canary
```
*Note : Si vous utilisez l'intégration GitHub, poussez simplement la branche : `git push origin feature/live-tour-canary`.*

### 3. Configuration des Variables d'Environnement
Assurez-vous que les variables suivantes sont configurées dans le projet Vercel (onglet Settings > Environment Variables) pour l'environnement **Preview** :
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

### 4. Vérification de la Base de Données
Le site Canary utilisera par défaut la base Supabase configurée. 
> [!IMPORTANT]
> Si des migrations SQL ont été effectuées localement (dans `supabase/migrations`), elles doivent être appliquées sur l'instance Supabase liée à Vercel avant le test.

### 5. Test des URL Multi-pages
Sur Vercel, vérifiez l'accès aux trois points d'entrée :
- Index : `https://tours-canary.vercel.app/`
- Admin : `https://tours-canary.vercel.app/admin.html`
- Live : `https://tours-canary.vercel.app/live.html`

### 6. Scénario de Test Canary
1. Connectez-vous à l'Admin sur le site Canary.
2. Démarrez un tour "Live".
3. Ouvrez le site public Canary sur un autre appareil/onglet.
4. Cliquez sur le bouton **Live Experience** dans la Navbar.
5. Vérifiez que la session active est détectée et que vous pouvez rejoindre.
