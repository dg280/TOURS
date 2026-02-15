# Stratégie SEO & Marketing - Tours & Detours Barcelona

## 1. État des Lieux Technique (SEO On-Page)
- **Sémantique HTML** : Utilisation rigoureuse des balises `<h1>` à `<h3>` pour la hiérarchie du contenu.
- **Méta-données Dynamiques** : Le nouveau composant `SEO.tsx` gère automatiquement les titres et descriptions selon la langue choisie.
- **Données Structurées** : Intégration du format JSON-LD (Schema.org) pour que Google affiche les tours comme des "Events" ou "Travel Packages" dans les résultats.
- **Réduction du JS** : Application optimisée avec Vite pour un chargement sous la barre des 1s sur Vercel.

## 2. Stratégie de Contenu (SEO Content)
- **Mots-clés ciblés** : 
  - *Français* : "Guide privé Barcelone", "Excursion Catalogne authentique", "Tour Costa Brava français".
  - *Anglais* : "Authentic Barcelona tours", "Private guide Catalonia", "Hidden gems Barcelona".
- **Optimisation des Images** : Toutes les photos de tours doivent avoir un attribut `alt` descriptif (ex: "Village médiéval de Pals au coucher du soleil").

## 3. Marketing & Conversion
- **Newsletter** : Nouveau formulaire intégré en pied de page. Les emails sont stockés dans Supabase et consultables dans l'admin.
- **Preuve Sociale** : Section "Témoignages" dynamique pour renforcer la confiance.
- **Analytics (Marketing de données)** :
  - Recommandation : Utiliser **Umami Analytics** (intégré dans l'admin) pour un suivi RGPD-friendly.
  - Objectif : Identifier quel tour génère le plus de clics pour ajuster les campagnes.

## 4. Checklist Prochaines Étapes
1. [ ] **Google Search Console** : Déclarer le domaine `tours-five-olive.vercel.app`.
2. [ ] **Sitemap** : Générer un fichier `sitemap.xml` listant tous les tours.
3. [ ] **Backlinks** : S'inscrire sur des annuaires spécialisés (TripAdvisor, Viator) pointant vers le site.
