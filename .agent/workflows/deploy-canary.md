---
description: Vercel Canary deployment procedure for pre-production testing
---

Use this procedure to test new features, such as the live tour, in a Canary preview environment before merging to production.

### 1. Git Preparation

Create a dedicated branch if one does not already exist:

```bash
git checkout -b feature/live-tour-canary
git add .
git commit -m "feat: live tour implementation for canary test"
```

### 2. Vercel Preview Deployment

Use the Vercel CLI to create a preview deployment:

// turbo

```bash
vercel --name tours-canary
```

_Note: If you use the GitHub integration, simply push the branch with `git push origin feature/live-tour-canary`._

### 3. Environment Variable Configuration

Ensure the following variables are configured for the **Preview** environment in Vercel under Settings > Environment Variables:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

### 4. Database Verification

The Canary site uses the configured Supabase database by default.

> [!IMPORTANT]
> If SQL migrations were made locally in `supabase/migrations`, apply them to the Supabase instance connected to Vercel before testing.

### 5. Multi-Page URL Testing

On Vercel, verify access to all three entry points:

- Main: `https://tours-canary.vercel.app/`
- Admin: `https://tours-canary.vercel.app/admin.html`
- Live: `https://tours-canary.vercel.app/live.html`

### 6. Canary Test Scenario

1. Sign in to the Canary admin site.
2. Start a live tour.
3. Open the Canary public site in another tab or device.
4. Click **Live Experience** in the navigation bar.
5. Verify that the active session is detected and can be joined.
