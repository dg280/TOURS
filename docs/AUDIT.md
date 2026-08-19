# Full Audit - Tours & Détours Barcelona

**Audited branch:** `fix/admin-image-upload`
**Audit date:** 2026-03-02

> Historical record: this audit describes the application at the date above. Many findings may have been resolved; verify them against the current code and tests before scheduling work.

## Contents

1. Public-site acceptance checks
2. Admin-interface acceptance checks
3. UX, UI, accessibility, and responsive findings
4. Security findings
5. Prioritized improvement backlog
6. Final pre-production checklist

## 1. Public-Site Acceptance Checks

| Area | IDs | Required behavior |
|---|---|---|
| Hero and landing | P01-P06 | Autoplay hero video and image fallback work; tour and contact CTAs scroll smoothly; scroll-aware navigation and logo behavior work. |
| Navigation and language | P07-P12 | FR/EN/ES changes and persistence work; mobile menu opens and closes; the active navigation indicator tracks the visible section. |
| Tour catalog | P13-P17 | Top-tour and category carousels navigate and filter; cards show image, category, price, duration, and group data; opening a card and deep links work. |
| Tour dialog | P18-P24 | Description, itinerary, included/excluded, meeting-point, and image-carousel tabs render; price sidebar books; dialog closes correctly. |
| Booking flow | P25-P33 | Date, participants, details, Stripe Elements, successful and refused test payments, customer/admin email, and tiered pricing work. |
| Contact form | P34-P37 | Required fields and email validation work; submission returns visible success or error feedback. Historical note: P36 was marked as having no handler. |
| About page | P38-P41 | All sections, sticky desktop image, multilingual bio, and statistics badge work. |
| Cookie consent and GDPR | P42-P45 | First-visit banner, accept action, preference panel, and persistence work. |
| Public live tour | P46-P48 | Navigation only offers a live session when active; joining with a session code and real-time position/stops work. |

## 2. Admin-Interface Acceptance Checks

| Area | IDs | Required behavior |
|---|---|---|
| Authentication | A01-A05 | Magic Link and password login work; unauthorized emails are denied; logout and session persistence work. |
| Dashboard | A06-A10 | Reservation counters, monthly revenue, recent reservations, Stripe mode, and navigation shortcuts are correct. Historical note: A07 was marked as hardcoded to February 2024. |
| Tour management | A11-A24 | Create/edit FR, EN, and ES fields; automatic translation and EN catalog sync; image upload/crop/reorder/primary/delete; tier pricing; save and delete work. |
| Live session administration | A25-A28 | Session code and QR code are generated; stop navigation, urgent messages, and completion work. |
| Booking management | A29-A34 | List, search, status filter, confirmation, cancellation, and booking details work. |
| Review moderation | A35-A37 | Add, publish/hide, and delete reviews work. |
| Administrator management | A38-A40 | Add, revoke, and confirm destructive admin actions work. |
| Guide profile | A41-A44 | Photo upload/crop, FR/EN/ES biography, automatic biography translation, and Instagram URL work. |
| Marketing and infrastructure | A45-A49 | Newsletter list, health check, cloud pull/push, and factory reset work. |

## 3. UX and UI Findings

### Confirmed Historical Issues

| ID | Area | Finding | Severity |
|---|---|---|---|
| U1 | Contact form | No `onSubmit` handler; the form could not submit. | Critical |
| U2 | Contact form | No visible error or success feedback. | High |
| U3 | Admin dashboard | Monthly revenue was hardcoded to February 2024. | High |
| U4 | Admin dashboard | SEO score and infrastructure health were static. | Medium |
| U5 | Admin | No pagination in reservation, review, subscriber, or admin lists. | Medium |
| U6 | Mobile navigation | Clicking outside the menu did not close it. | Medium |
| U7 | Images | No skeleton or placeholder while images loaded. | Low |
| U8 | Tour dialog | `?tour=ID` deep link was lost after navigating away and back. | Low |
| U9 | Admin tours | Live-tour stops could not be reordered. | Low |
| U10 | Admin | No bulk selection, deletion, or export actions. | Low |
| U11 | Admin | Guide name was hardcoded in the header. | Low |
| U12 | Tour dialog | Scroll could be blocked on very small displays due to no adaptive maximum height. | Low |

### Accessibility Recommendations

| Issue | Impact | Recommendation |
|---|---|---|
| No skip link | Keyboard and screen-reader users must traverse all navigation. | Add `<a href="#main-content" class="sr-only focus:not-sr-only">Skip to content</a>`. |
| Carousels lack `aria-label` and `role="region"` | Their purpose is not announced. | Add a descriptive `aria-label`, such as `Our top tours`, to each Embla carousel. |
| Tour-dialog tabs lack `aria-labelledby` | Tab and content association is not declared. | Link each `tabpanel` to its tab with `aria-labelledby`. |
| No live ARIA regions | Toasts and filter results are not announced. | Use `aria-live="polite"` on dynamic regions. |
| Cookie close button is only `✕` | It has no descriptive screen-reader name. | Add `aria-label="Close"`. |
| Amber alone indicates active state | Some users cannot distinguish it reliably. | Add underline or bold weight as a second cue. |

### Responsive Observations

- The overall mobile-first approach and `sm`/`md`/`lg`/`xl` breakpoints were consistent.
- The admin sidebar felt clumsy on mobile and its overlay was not always smooth.
- Tour-card descriptions used a two-line clamp; acceptable unless truncation breaks meaning.
- All four TourDialog tabs could overflow on a 375 px iPhone SE viewport.
- Absolutely positioned carousel controls could overlap content on small screens.
- Some admin textareas were too small by default on mobile.

### Experience Summary

**Strengths**: coherent amber/gold premium design; subtle, well-timed animation; robust FR/EN/ES support; clear step-by-step booking; Sonner toast feedback; feature-rich administration for a small operation.

**Weaknesses**: historical blocking contact form; missing inline public-form errors; no image loading state; no admin dark mode; no auto-save; no tour draft state.

## 4. Security Findings

### Critical Historical Findings

| ID | Finding | Risk | Recommended remediation |
|---|---|---|---|
| S1 | Payment-intent and confirmation endpoints accepted arbitrary POST requests without proving caller legitimacy. | Fraud, Stripe abuse, API quota denial of service. | Validate a Supabase session token or server-side CSRF token. |
| S2 | Reminder cron authorization was disabled. | Bulk spam, reputation damage, GDPR risk. | Enforce `Authorization: Bearer ${CRON_SECRET}`. |
| S3 | `authorized_admins` could be publicly read through a permissive RLS policy. | Administrator-email enumeration and phishing. | Remove the policy or restrict it to authenticated administrators. |
| S4 | Booking confirmation depended on client-side payment success. | Missed bookings or forged confirmations. | Implement and verify a signed Stripe webhook. |

### High Historical Findings

| ID | Finding | Recommended remediation |
|---|---|---|
| S5 | Vercel and GitHub tokens were stored in `localStorage`. | Move secrets to Vercel environment variables and call a dedicated API route from the admin interface. |
| S6 | `FOR ALL TO authenticated USING (true)` allowed any authenticated Supabase user to modify tours and reservations. | Restrict RLS with an `authorized_admins` email check. |
| S7 | User fields were interpolated in HTML email without escaping. | Escape all values with a dedicated `escapeHtml` helper. |
| S8 | Development-mode localStorage admin-authentication bypass existed. | Remove it or guard it with `VITE_DEV_AUTH_BYPASS=true`. |

### Medium Historical Findings

| ID | Finding | Recommended remediation |
|---|---|---|
| S9 | Administrator emails were hardcoded in an SQL migration. | Use separate, uncommitted seed data or environment variables. |
| S10 | Stripe and email APIs had no rate limiting. | Add Vercel middleware or `upstash/ratelimit`. |
| S11 | No HTTP security headers in `vercel.json`. | Add CSP, HSTS, `X-Frame-Options`, and `X-Content-Type-Options`. |
| S12 | Live-session codes used `Math.random()`. | Use `crypto.randomUUID()` or `crypto.getRandomValues()`. |
| S13 | Zod was installed but not validating API payloads. | Add a Zod schema for every API endpoint. |
| S14 | Business email and phone number were hardcoded. | Use `ADMIN_EMAIL` and `BUSINESS_PHONE` environment variables. |
| S15 | A Vercel project-ID fallback was hardcoded. | Remove the fallback. |

## 5. Prioritized Improvement Backlog

### P0: Resolve Before Production

1. Authenticate `create-payment-intent` and `confirm-booking`.
2. Enforce `CRON_SECRET` validation in `api/cron/reminders.ts`.
3. Implement and test the Stripe webhook using `stripe.webhooks.constructEvent`.
4. Correct Supabase RLS with an `authorized_admins` check.
5. Remove the public `authorized_admins` select policy.
6. Fix the contact form with a submission handler and visible feedback.

### P1: Complete Within One Week

7. Escape user input in HTML emails.
8. Add HTTP security headers in `vercel.json`.
9. Rate-limit Stripe endpoints.
10. Move Vercel/GitHub tokens out of `localStorage`.
11. Make dashboard revenue truly dynamic.
12. Remove or strictly protect the development authentication bypass.

### P2: UX Improvements Within One Month

13. Paginate admin lists.
14. Add skeleton loaders for images and asynchronous data.
15. Allow live-tour stops to be reordered.
16. Close the mobile menu on outside click.
17. Make carousels accessible with `aria-label` and roles.
18. Provide inline error messages in public forms.
19. Add draft/published states for tours.

### P3: Technical Debt Backlog

20. Validate API payloads with Zod.
21. Add Sentry or equivalent production error monitoring.
22. Audit-log administrator actions.
23. Replace live-session `Math.random()` with cryptographic randomness.
24. Centralize business constants such as email, phone, and brand color.
25. Code-split or lazy-load heavy sections.
26. Run `npm audit` and keep dependencies current.
27. Document PCI DSS measures.
28. Replace MyMemory with DeepL Free API for more reliable translation.

## 6. Final Pre-Production Checklist

```text
Security
[ ] S1  API endpoints are authenticated
[ ] S2  CRON_SECRET is enforced
[ ] S3  Public authorized-admins policy is removed
[ ] S4  Stripe webhook is implemented and tested
[ ] S6  RLS includes an authorized-admins check
[ ] S7  HTML emails escape user data
[ ] S8  Development bypass is removed
[ ] S11 Security headers are configured

Functional
[ ] P34-P37 Contact form submits and provides feedback
[ ] A06-A07 Dashboard revenue is dynamic
[ ] P29 Stripe test payment passes end-to-end
[ ] P30-P31 Customer and administrator confirmation emails arrive
[ ] A01-A05 Administrator authentication is tested

Performance
[ ] Lighthouse scores exceed 80 for Performance, Accessibility, Best Practices, and SEO
[ ] LCP is below 2.5 seconds on simulated mobile 4G
[ ] npm audit has no critical or high vulnerabilities
```

*Generated on 2026-03-02. Update this historical audit after each remediation sprint.*
