import { test, expect } from "@playwright/test";

/**
 * A tour URL must survive a direct load — that is what a shared link, a
 * bookmark and a Google result all do.
 *
 * This broke in production: `tours` is seeded from the static catalogue in
 * translations.ts, so it is non-empty on the first render, while the slugs the
 * site links to come from the database titles. TourPage concluded the tour did
 * not exist and redirected home before Supabase had answered.
 *
 * Scope, honestly: this test does NOT reproduce that bug. CI runs without
 * Supabase credentials — VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are
 * empty there — so the site falls back to the static catalogue alone, whose
 * titles generate exactly the slugs being requested. The divergence that
 * causes the bug cannot arise. Verified: this test passes without the fix too.
 * What it does cover is the weaker but real invariant that /tours/:slug
 * survives a reload at all. Reproducing the real bug would mean giving CI
 * credentials, or stubbing the Supabase response in the browser.
 */

test.describe("Tour deep links", () => {
  test("a tour URL survives a full page reload", async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem("cookie-consent", "accepted");
      localStorage.setItem(
        "cookie-preferences",
        JSON.stringify({ essential: true, analytics: false, marketing: false }),
      );
    });

    await page.goto("/");
    // Reach a tour the way a visitor does, so the slug is the site's own.
    await page.locator(".group.bg-white.rounded-2xl").first().click();
    await page.waitForURL(/\/tours\/.+/, { timeout: 20000 });
    const url = page.url();

    // The deep-link path: a fresh document load of that same URL.
    await page.reload({ waitUntil: "domcontentloaded" });

    await expect(
      page.locator('[data-testid="tour-dialog"]').first(),
    ).toBeVisible({ timeout: 20000 });
    expect(page.url()).toBe(url);
  });
});
