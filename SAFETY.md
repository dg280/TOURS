# 🛡️ Project Safety & Stability

This document lists the critical project areas that prevent accidental regressions in payment and configuration features.

## 💸 Payment System (Stripe)

The `api/create-payment-intent.ts` file is critical. Validate every change with:

1. **API version check**: it must remain on a stable version (currently `2025-01-27`).
2. **Tiered-pricing logic**: do not modify handling of the `pricing_tiers` column without testing every booking scenario, including individual and group bookings.

## 📊 System Monitoring (Health Check)

The project provides real-time monitoring:

- **Endpoint**: `/api/health-check` checks Stripe and Supabase.
- **Admin dashboard**: displays a status indicator. If it turns red, immediately verify API credentials in Vercel.

## 🧪 Regression Tests

Before every major deployment, run the stability tests:

```bash
npx playwright test tests/stability.test.ts
```

These tests verify that monitoring remains operational and that critical endpoints respond correctly.

---

_Keep this system operational to prevent silent payment failures in production._
