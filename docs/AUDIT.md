# Audit complet — Tours & Détours Barcelona
> Branche auditée : `fix/admin-image-upload` | Date : 2026-03-02

---

## Sommaire

1. [Recette fonctionnelle — Site public](#1-recette-fonctionnelle--site-public)
2. [Recette fonctionnelle — Interface admin](#2-recette-fonctionnelle--interface-admin)
3. [Audit UX/UI](#3-audit-uxui)
4. [Audit Sécurité](#4-audit-sécurité)
5. [Axes d'amélioration priorisés](#5-axes-damélioration-priorisés)

---

## 1. Recette fonctionnelle — Site public

### 1.1 Hero & landing
| # | Test | Critère de validation | Statut |
|---|------|-----------------------|--------|
| P01 | Vidéo hero s'affiche | Vidéo autoplay muette visible, gradient overlay correct | ☐ |
| P02 | Fallback image hero | En cas d'échec vidéo, `hero-barcelona.jpg` affiché | ☐ |
| P03 | CTA "Découvrir les tours" | Scroll smooth vers section tours | ☐ |
| P04 | CTA "Contact" | Scroll smooth vers section contact | ☐ |
| P05 | Navbar scroll | Fond flou + ombre au défilement | ☐ |
| P06 | Logo | Ramène en haut de page au clic | ☐ |

### 1.2 Navigation & langue
| # | Test | Critère de validation | Statut |
|---|------|-----------------------|--------|
| P07 | Changement langue FR | Tous les textes basculent en français | ☐ |
| P08 | Changement langue EN | Tous les textes basculent en anglais | ☐ |
| P09 | Changement langue ES | Tous les textes basculent en espagnol | ☐ |
| P10 | Persistance langue | Langue conservée au rechargement de la page | ☐ |
| P11 | Menu mobile | Hamburger ouvre/ferme le menu | ☐ |
| P12 | Lien actif navbar | Indicateur ambre sur la section visible | ☐ |

### 1.3 Catalogue tours
| # | Test | Critère de validation | Statut |
|---|------|-----------------------|--------|
| P13 | Carousel Top Tours | Navigation prev/next, indicateurs points | ☐ |
| P14 | Carousel Catégories | Filtres par catégorie (nature, gastro, culture…) | ☐ |
| P15 | TourCard affichage | Image, badges catégorie, prix, durée, groupe | ☐ |
| P16 | TourCard clic | Ouvre TourDialog avec les bonnes données | ☐ |
| P17 | Deep link `?tour=ID` | TourDialog s'ouvre directement au chargement | ☐ |

### 1.4 TourDialog
| # | Test | Critère de validation | Statut |
|---|------|-----------------------|--------|
| P18 | Onglet Description | Texte, highlights avec icônes ✓ | ☐ |
| P19 | Onglet Itinéraire | Timeline verticale avec étapes numérotées | ☐ |
| P20 | Onglet Inclus/Exclus | Items verts (inclus) / rouges (exclus) | ☐ |
| P21 | Onglet Point de RDV | Adresse + section "Bon à savoir" | ☐ |
| P22 | Carousel images | Défilement des photos du tour | ☐ |
| P23 | Sidebar prix | Prix par personne + bouton "Réserver" | ☐ |
| P24 | Fermeture modale | Clic hors modal ou bouton ✕ | ☐ |

### 1.5 Tunnel de réservation
| # | Test | Critère de validation | Statut |
|---|------|-----------------------|--------|
| P25 | Étape 1 : Date | Sélection date dans calendrier | ☐ |
| P26 | Étape 2 : Participants | Compteur +/− avec minimum 1 | ☐ |
| P27 | Étape 3 : Coordonnées | Nom, email, téléphone avec validation | ☐ |
| P28 | Étape 4 : Paiement | Formulaire Stripe Elements chargé | ☐ |
| P29 | Paiement test réussi | Carte test `4242 4242 4242 4242` acceptée | ☐ |
| P30 | Email de confirmation | Email reçu par le client après paiement | ☐ |
| P31 | Email admin | Notification reçue par info@toursandetours.com | ☐ |
| P32 | Paiement refusé | Message d'erreur clair affiché | ☐ |
| P33 | Tarification par paliers | Prix correct selon nombre de participants | ☐ |

### 1.6 Formulaire de contact
| # | Test | Critère de validation | Statut |
|---|------|-----------------------|--------|
| P34 | Champs requis | Erreur si nom/email vide | ☐ |
| P35 | Validation email | Erreur si format invalide | ☐ |
| P36 | Envoi formulaire | **⚠️ BUG CONNU : pas de handler** — à corriger avant test | ☐ |
| P37 | Feedback succès | Toast/message de confirmation après envoi | ☐ |

### 1.7 Page About
| # | Test | Critère de validation | Statut |
|---|------|-----------------------|--------|
| P38 | Sections About | Me, Philosophie, Différence, Pourquoi | ☐ |
| P39 | Photo sticky desktop | Photo reste visible lors du scroll | ☐ |
| P40 | Bio multilingue | Texte change selon la langue sélectionnée | ☐ |
| P41 | Badge stats | "15+ ans d'expérience" visible | ☐ |

### 1.8 Cookie consent & RGPD
| # | Test | Critère de validation | Statut |
|---|------|-----------------------|--------|
| P42 | Bannière premier visite | S'affiche dès le premier chargement | ☐ |
| P43 | Accept All | Ferme la bannière, préférences sauvées | ☐ |
| P44 | Gérer les préférences | Panel avec switches par catégorie | ☐ |
| P45 | Persistance | Bannière ne réapparaît pas après acceptation | ☐ |

### 1.9 Live Tour (site public)
| # | Test | Critère de validation | Statut |
|---|------|-----------------------|--------|
| P46 | Bouton Live navbar | Visible uniquement si session active | ☐ |
| P47 | LiveJoinDialog | Saisie du code session, connexion | ☐ |
| P48 | Suivi de position | Carte/stops mis à jour en temps réel | ☐ |

---

## 2. Recette fonctionnelle — Interface admin

### 2.1 Authentification
| # | Test | Critère de validation | Statut |
|---|------|-----------------------|--------|
| A01 | Magic Link | Email OTP reçu, lien redirige vers /admin.html | ☐ |
| A02 | Login par mot de passe | Connexion avec email + password Supabase | ☐ |
| A03 | Email non autorisé | Accès refusé si email absent de `authorized_admins` | ☐ |
| A04 | Déconnexion | Retour à l'écran de login | ☐ |
| A05 | Session persistante | Admin reste connecté après rechargement | ☐ |

### 2.2 Dashboard
| # | Test | Critère de validation | Statut |
|---|------|-----------------------|--------|
| A06 | Compteurs réservations | Total, en attente, confirmées, complétées corrects | ☐ |
| A07 | Revenue mensuel | **⚠️ BUG CONNU : hardcodé février 2024** | ☐ |
| A08 | Tableau réservations récentes | 5 dernières réservations visibles | ☐ |
| A09 | Indicateur mode Stripe | "Test" ou "Live" détecté correctement | ☐ |
| A10 | Raccourcis navigation | Boutons vers réservations, tours, avis | ☐ |

### 2.3 Gestion des tours
| # | Test | Critère de validation | Statut |
|---|------|-----------------------|--------|
| A11 | Créer un tour | UUID généré, formulaire vide prêt | ☐ |
| A12 | Éditer — onglet FR | Tous les champs FR éditables (titre, desc, highlights…) | ☐ |
| A13 | Éditer — onglet EN | Tous les champs EN éditables | ☐ |
| A14 | Éditer — onglet ES | Tous les champs ES éditables | ☐ |
| A15 | Traduction auto champ | Bouton "Traduire depuis FR" renseigne EN et ES | ☐ |
| A16 | Sync master EN | Champs EN remplacés par le catalogue translations.ts | ☐ |
| A17 | Upload images | Sélection multiple, aperçu avant upload | ☐ |
| A18 | Recadrage image | ImageEditor s'ouvre, crop/rotation fonctionnels | ☐ |
| A19 | Réordonner images | Boutons gauche/droite déplacent l'image | ☐ |
| A20 | Définir image principale | Étoile = image principale du tour | ☐ |
| A21 | Supprimer image | Image retirée de la galerie | ☐ |
| A22 | Tarification paliers | Ajout/suppression de tranches de prix | ☐ |
| A23 | Sauvegarder tour | Upsert en base, toast de confirmation | ☐ |
| A24 | Supprimer tour | Confirmation dialog, suppression effective | ☐ |

### 2.4 Session Live (admin)
| # | Test | Critère de validation | Statut |
|---|------|-----------------------|--------|
| A25 | Activer session | Code généré, QR code affiché | ☐ |
| A26 | Navigation stops | Boutons Précédent/Suivant changent le stop actif | ☐ |
| A27 | Message urgent | Diffusion d'un message aux participants | ☐ |
| A28 | Terminer session | Session marquée "completed" | ☐ |

### 2.5 Gestion des réservations
| # | Test | Critère de validation | Statut |
|---|------|-----------------------|--------|
| A29 | Liste réservations | Toutes les réservations affichées | ☐ |
| A30 | Recherche | Filtre par nom ou ID | ☐ |
| A31 | Filtre statut | En attente / Confirmée / Complétée / Annulée | ☐ |
| A32 | Confirmer réservation | Statut → "confirmée", mise à jour base | ☐ |
| A33 | Annuler réservation | Statut → "annulée", mise à jour base | ☐ |
| A34 | Détail modal | Toutes les infos client visibles | ☐ |

### 2.6 Modération des avis
| # | Test | Critère de validation | Statut |
|---|------|-----------------------|--------|
| A35 | Ajouter un avis | Nom, lieu, note 1-5, texte, publier | ☐ |
| A36 | Publier/Masquer | Toggle visible/caché sur site | ☐ |
| A37 | Supprimer avis | Confirmation, suppression effective | ☐ |

### 2.7 Gestion des admins
| # | Test | Critère de validation | Statut |
|---|------|-----------------------|--------|
| A38 | Ajouter admin | Email ajouté à `authorized_admins` | ☐ |
| A39 | Révoquer admin | Email retiré de la table | ☐ |
| A40 | Confirmation destructive | Dialog de confirmation avant révocation | ☐ |

### 2.8 Profil guide
| # | Test | Critère de validation | Statut |
|---|------|-----------------------|--------|
| A41 | Changer photo | Upload + crop, sauvegarde en base | ☐ |
| A42 | Modifier bio FR/EN/ES | Texte mis à jour sur le site public | ☐ |
| A43 | Traduction bio | Bouton auto-traduit dans les 2 autres langues | ☐ |
| A44 | URL Instagram | Lien mis à jour dans le footer | ☐ |

### 2.9 Marketing & Infra
| # | Test | Critère de validation | Statut |
|---|------|-----------------------|--------|
| A45 | Liste abonnés newsletter | Emails et dates de souscription | ☐ |
| A46 | Health check | Latence Supabase, statut Vercel | ☐ |
| A47 | Pull depuis cloud | Tours remplacés par données Supabase | ☐ |
| A48 | Push vers cloud | Données locales écrasent Supabase | ☐ |
| A49 | Reset factory | Restauration depuis `default_tours` | ☐ |

---

## 3. Audit UX/UI

### 3.1 Bugs & anomalies confirmés

| Ref | Zone | Description | Sévérité |
|-----|------|-------------|----------|
| U1 | Contact form | Pas de `onSubmit` handler — le formulaire **ne s'envoie pas du tout** | 🔴 CRITIQUE |
| U2 | Contact form | Aucun feedback d'erreur ou de succès visible à l'utilisateur | 🟠 HAUTE |
| U3 | Admin Dashboard | Revenue mensuel hardcodé "février 2024" — jamais dynamique | 🟠 HAUTE |
| U4 | Admin Dashboard | SEO score statique 85/100, health infra statique 100% | 🟡 MOYENNE |
| U5 | Admin | Aucune pagination sur aucune liste (réservations, avis, abonnés, admins) | 🟡 MOYENNE |
| U6 | Navbar mobile | Cliquer en dehors du menu ne le ferme pas | 🟡 MOYENNE |
| U7 | Images | Aucun skeleton/placeholder durant le chargement des images | 🔵 FAIBLE |
| U8 | TourDialog | Deep link `?tour=ID` est perdu si l'utilisateur navigue puis revient | 🔵 FAIBLE |
| U9 | Admin tours | Stops d'une session live non réordonnables (pas de drag & drop, pas de boutons) | 🔵 FAIBLE |
| U10 | Admin | Aucune action bulk (sélection multiple, suppression groupée, export) | 🔵 FAIBLE |
| U11 | Admin | Nom du guide "Antoine Pilard" hardcodé dans le header (ligne ~4496) | 🔵 FAIBLE |
| U12 | TourDialog | Scroll peut bloquer sur très petits écrans (pas de max-height adaptatif) | 🔵 FAIBLE |

### 3.2 Accessibilité

| Problème | Impact | Recommandation |
|----------|--------|----------------|
| Pas de lien "passer au contenu" (skip link) | Utilisateurs clavier/lecteurs d'écran doivent tout reparcourir | Ajouter `<a href="#main-content" class="sr-only focus:not-sr-only">` |
| Carousels sans `aria-label` ni `role="region"` | Le rôle des zones n'est pas annoncé | Ajouter `aria-label="Nos meilleurs tours"` sur chaque Embla |
| Onglets TourDialog sans `aria-labelledby` | Association onglet ↔ contenu non déclarée | Lier `tabpanel` avec `aria-labelledby` |
| Pas de régions ARIA live | Les toasts/résultats de filtre ne sont pas annoncés | `aria-live="polite"` sur zones dynamiques |
| Bouton ✕ du cookie consent | Texte "✕" non descriptif pour lecteurs d'écran | Ajouter `aria-label="Fermer"` |
| Couleur ambre seule pour indiquer l'état actif | Peut poser problème pour daltoniens (rouge-vert) | Ajouter underline ou bold en complément |

### 3.3 Responsive & mobile

| Zone | Observation |
|------|-------------|
| Global | Approche mobile-first correcte, breakpoints cohérents (sm/md/lg/xl) |
| Sidebar admin | Comportement clunky sur mobile, overlay pas toujours fluide |
| Cards tour | Descriptions tronquées à 2 lignes (line-clamp) — ok sauf si la troncation coupe mal |
| TourDialog tabs | Sur iPhone SE (375px) les 4 onglets peuvent déborder horizontalement |
| Carousel nav | Boutons prev/next en position absolute pouvant chevaucher le contenu sur petits écrans |
| Admin formulaire | Certains champs textarea trop petits par défaut sur mobile |

### 3.4 Expérience utilisateur — observations globales

**Points forts**
- Design premium cohérent (palette ambre/or, typographies Cormorant + Playfair + Inter)
- Animations subtiles et bien timées (fadeInUp, staggered delays)
- Multi-langue bien intégré (FR/EN/ES avec fallback robuste)
- Tunnel de réservation étape par étape clair
- Toast notifications (Sonner) pour le feedback temps réel
- Admin feature-rich pour une petite structure

**Points faibles**
- Contact form non fonctionnel (bug bloquant)
- Aucune gestion d'erreur visuelle dans les formulaires publics (pas de messages inline)
- Pas de loading state sur les images (perception de lenteur)
- L'admin ne dispose pas de mode sombre
- Pas d'auto-save sur les formulaires admin (risque de perte de saisie)
- Pas de "draft" pour les tours (tout est publié immédiatement)

---

## 4. Audit Sécurité

### 4.1 Vulnérabilités CRITIQUES

#### S1 — Endpoints API sans authentification
- **Fichiers** : [api/create-payment-intent.ts](../api/create-payment-intent.ts), [api/confirm-booking.ts](../api/confirm-booking.ts)
- **Description** : Les deux endpoints acceptent n'importe quelle requête POST sans vérifier que l'auteur est un utilisateur légitime. Un attaquant peut créer des payment intents arbitraires ou confirmer des réservations sans payer.
- **Risque** : Fraude, abus Stripe, DoS sur quota API
- **Correction** : Valider un token de session Supabase (`Authorization: Bearer <token>`) ou un CSRF token côté serveur

#### S2 — Cron de rappels sans protection
- **Fichier** : [api/cron/reminders.ts](../api/cron/reminders.ts) lignes 25–28
- **Description** : La vérification du `CRON_SECRET` est commentée. N'importe qui peut appeler `GET /api/cron/reminders` et déclencher des emails vers tous les clients.
- **Risque** : Spam massif, réputation email dégradée, RGPD
- **Correction** : Décommenter immédiatement la validation `Authorization: Bearer ${CRON_SECRET}`

#### S3 — Emails admin publiquement lisibles
- **Fichier** : [supabase/supabase_schema.sql](../supabase/supabase_schema.sql) ligne 172
- **Description** : La policy `"Public Select Authorized Admins"` (`USING (true)`) autorise n'importe qui à lire la table `authorized_admins` sans être authentifié.
- **Risque** : Énumération des emails admin, phishing ciblé
- **Correction** : Supprimer cette policy ou la restreindre à `authenticated`

#### S4 — Pas de webhook Stripe
- **Description** : La confirmation de réservation est déclenchée par le callback client `onSuccess()` dans `BookingModal.tsx`. Si l'utilisateur ferme la fenêtre après paiement, la réservation n'est jamais confirmée. Inversement, un attaquant peut forger une confirmation sans paiement réel.
- **Risque** : Réservations non enregistrées, fraude au paiement
- **Correction** : Créer `api/webhooks/stripe.ts`, vérifier la signature avec `stripe.webhooks.constructEvent()`

### 4.2 Vulnérabilités HAUTES

#### S5 — Tokens Vercel & GitHub en localStorage
- **Fichier** : [src/admin/AdminApp.tsx](../src/admin/AdminApp.tsx) lignes ~3323–3327
- **Description** : Les tokens d'API Vercel et GitHub sont stockés en clair dans le localStorage, accessible à tout script de la page (XSS, extensions navigateur).
- **Risque** : Compromission du dépôt GitHub, accès aux logs de déploiement Vercel
- **Correction** : Stocker ces tokens côté backend (variable d'environnement Vercel), appeler une route API dédiée depuis l'admin

#### S6 — RLS trop permissive (`authenticated` = tous les utilisateurs)
- **Fichier** : [supabase/supabase_schema.sql](../supabase/supabase_schema.sql) lignes 148–164
- **Description** : Les policies `FOR ALL TO authenticated USING (true)` accordent à tout utilisateur Supabase authentifié (y compris via Magic Link pour réserver) la modification complète des tables `tours` et `reservations`.
- **Risque** : Un client qui réserve un tour pourrait modifier le catalogue ou les réservations des autres
- **Correction** :
  ```sql
  CREATE POLICY "Admin Only Tours" ON tours
    FOR ALL TO authenticated
    USING (EXISTS (
      SELECT 1 FROM authorized_admins WHERE email = auth.jwt() ->> 'email'
    ));
  ```

#### S7 — XSS dans les emails HTML
- **Fichier** : [api/confirm-booking.ts](../api/confirm-booking.ts) lignes 149+
- **Description** : Les champs utilisateur (`name`, `message`, `tour_name`) sont directement interpolés dans le template HTML de l'email sans échappement.
- **Risque** : Injection HTML dans certains clients email, phishing interne
- **Correction** :
  ```typescript
  function escapeHtml(str: string): string {
    return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }
  // Usage : ${escapeHtml(reservation.name)}
  ```

#### S8 — Bypass d'authentification admin en développement
- **Fichier** : [src/admin/AdminApp.tsx](../src/admin/AdminApp.tsx) lignes ~4150–4154
- **Description** : `if (localStorage.getItem("isLoggedIn") === "true" && import.meta.env.MODE === "development")` — si le mode n'est pas correctement détecté en production, le bypass reste actif.
- **Risque** : Accès admin sans authentification
- **Correction** : Supprimer ce code ou le remplacer par une variable d'environnement dédiée `VITE_DEV_AUTH_BYPASS=true`

### 4.3 Vulnérabilités MOYENNES

| Ref | Localisation | Description | Correction |
|-----|-------------|-------------|------------|
| S9 | `supabase_schema.sql` L113–115 | Emails admin hardcodés dans la migration SQL (historique git) | Utiliser des seeds séparés non commités ou variables d'environnement |
| S10 | Tous les API | Aucun rate limiting sur les endpoints Stripe et email | Middleware Vercel ou `upstash/ratelimit` |
| S11 | `vercel.json` | Aucun security header HTTP | Ajouter CSP, HSTS, X-Frame-Options, X-Content-Type-Options |
| S12 | `AdminApp.tsx` | Session live générée avec `Math.random()` (entropie faible) | Utiliser `crypto.randomUUID()` ou `crypto.getRandomValues()` |
| S13 | API | Zod disponible en dépendance mais non utilisé pour valider les payloads | Créer des schémas Zod pour chaque endpoint API |
| S14 | `confirm-booking.ts` / `reminders.ts` | Email `info@toursandetours.com` et tél `+34623973105` hardcodés | Variables d'environnement `ADMIN_EMAIL`, `BUSINESS_PHONE` |
| S15 | `AdminApp.tsx` | Vercel project ID de fallback hardcodé (`prj_u3FmYg...`) | Supprimer le fallback |

### 4.4 Récapitulatif sécurité

```
CRITIQUE (4)  : S1 API sans auth · S2 Cron non protégé · S3 Admin emails publics · S4 Pas de webhook Stripe
HAUTE    (4)  : S5 Tokens localStorage · S6 RLS trop permissive · S7 XSS email · S8 Bypass auth dev
MOYENNE  (7)  : S9 à S15 (hardcoded data, rate limiting, security headers, entropie session)
```

---

## 5. Axes d'amélioration priorisés

### P0 — Blocants production (à corriger avant toute mise en ligne)

| # | Action | Fichier(s) cible |
|---|--------|-----------------|
| 1 | Authentifier les endpoints `create-payment-intent` et `confirm-booking` | `api/create-payment-intent.ts`, `api/confirm-booking.ts` |
| 2 | Activer la validation CRON_SECRET dans `reminders.ts` | `api/cron/reminders.ts` |
| 3 | Implémenter le webhook Stripe (`stripe.webhooks.constructEvent`) | Nouveau fichier `api/webhooks/stripe.ts` |
| 4 | Corriger la RLS Supabase — vérifier `authorized_admins` | `supabase/migrations/` nouveau fichier |
| 5 | Retirer la policy "Public Select Authorized Admins" | `supabase/migrations/` nouveau fichier |
| 6 | Corriger le formulaire de contact (handler + feedback UX) | `src/components/sections/Contact.tsx` |

### P1 — À faire rapidement (< 1 semaine)

| # | Action | Fichier(s) cible |
|---|--------|-----------------|
| 7 | Échapper les inputs utilisateur dans les emails HTML | `api/confirm-booking.ts`, `api/cron/reminders.ts` |
| 8 | Ajouter security headers HTTP | `vercel.json` |
| 9 | Ajouter rate limiting sur les endpoints Stripe | `api/create-payment-intent.ts` |
| 10 | Migrer tokens Vercel/GitHub hors du localStorage | `src/admin/AdminApp.tsx` + nouvelle route API |
| 11 | Rendre le revenue dashboard dynamique (mensuel réel) | `src/admin/AdminApp.tsx` |
| 12 | Supprimer le bypass auth dev ou sécuriser | `src/admin/AdminApp.tsx` |

### P2 — Améliorations UX (< 1 mois)

| # | Action | Bénéfice attendu |
|---|--------|-----------------|
| 13 | Pagination dans les listes admin | Performance + lisibilité sur gros volumes |
| 14 | Skeleton loaders pour images et données async | Perception de rapidité améliorée |
| 15 | Réordonner les stops live tour (boutons ou drag & drop) | Workflow guide simplifié |
| 16 | Fermeture menu mobile au clic extérieur (overlay) | UX mobile conforme aux attentes |
| 17 | Accessibilité carousels (`aria-label`, `role`) | Conformité WCAG 2.1 niveau A |
| 18 | Messages d'erreur inline sur les formulaires publics | Taux de conversion amélioré |
| 19 | État "draft" / "publié" pour les tours | Évite les publications accidentelles |

### P3 — Dette technique (backlog)

| # | Action | Justification |
|---|--------|---------------|
| 20 | Valider les payloads API avec Zod (déjà disponible) | Robustesse + meilleurs messages d'erreur |
| 21 | Intégrer Sentry (ou équivalent) pour les erreurs | Détection proactive des incidents prod |
| 22 | Audit logging des actions admin | Traçabilité (qui a changé quoi, quand) |
| 23 | Remplacer `Math.random()` → `crypto.randomUUID()` pour sessions | Sécurité des codes de session live |
| 24 | Centraliser les constantes (email, tél, couleur brand) | Maintenabilité |
| 25 | Code splitting / lazy loading des sections lourdes | Performance initiale (LCP) |
| 26 | `npm audit` et mise à jour des dépendances | Patch des CVE connues |
| 27 | Documenter les mesures PCI DSS | Conformité Stripe |
| 28 | Remplacer MyMemory (quota limité) par DeepL Free API | Traductions plus fiables en production |

---

## Checklist de validation finale avant mise en production

```
Sécurité
[ ] S1  — Endpoints API authentifiés
[ ] S2  — CRON_SECRET activé
[ ] S3  — Policy "Public Select Authorized Admins" supprimée
[ ] S4  — Webhook Stripe implémenté et testé
[ ] S6  — RLS corrigée (authorized_admins check)
[ ] S7  — Emails HTML échappés
[ ] S8  — Bypass dev supprimé
[ ] S11 — Security headers configurés

Fonctionnel
[ ] P34-P37 — Formulaire contact fonctionnel avec feedback
[ ] A06-A07  — Dashboard revenue dynamique
[ ] P29     — Paiement Stripe test validé de bout en bout
[ ] P30-P31 — Emails de confirmation reçus (client + admin)
[ ] A01-A05 — Auth admin testée (Magic Link + Password)

Performance
[ ] Lighthouse score > 80 (Performance, Accessibility, Best Practices, SEO)
[ ] LCP < 2.5s sur mobile 4G simulé
[ ] npm audit sans vulnérabilités critiques/hautes
```

---

*Document généré le 2026-03-02 — à mettre à jour après chaque sprint de correction.*
