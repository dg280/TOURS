# Project Rules

## Development Workflow
- Create a branch `feature/<nom-court>` from `main`, work only on this branch.
- NEVER touch `main` directly.
- Before each commit: `npm run lint && npm run build`.
- Before finishing: `npm run test` (test Playwright).
- Push the branch and create a PR to `main` on GitHub.

## Critical Files
- `api/create-payment-intent.ts` (Stripe)
- `api/confirm-booking.ts` (Supabase)
- `src/lib/types.ts`
- `src/lib/translations.ts` (Maintain FR/EN/ES)

## Implementation Mission
Redesign du modal de réservation :
- Expérience full-screen sur mobile.
- Flux en 5 étapes (Sélection, Info, Résumé, Paiement, Succès).
- Résumé des inclusions/exclusions et itinéraire.
- Élimination des scrollings imbriqués.
