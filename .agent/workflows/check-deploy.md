---
description: Pre-release deployment verification procedure
---
1. Check the latest Git commit:
// turbo
`git log -1 --format="%h %cd %s"`

2. Check the Vercel deployment status:
// turbo
`npx vercel list tours-five-olive --limit 1`

**IMPORTANT**: The status must be `READY`, and the commit hash must match the latest local commit from step 1 before pre-release testing.

3. If the deployment is ready, open the production URL:
`https://tours-five-olive.vercel.app/`

4. **Run regression tests**:
// turbo
`npm run test`
*Note: This confirms that previous fixes, such as cookie and WhatsApp behavior, still work.*

5. Validate the user-requested checks with the [QA Strategy](../../docs/QA_STRATEGY.md).

