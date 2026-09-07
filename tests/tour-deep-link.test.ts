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
 * CI now runs with Supabase credentials (VITE_SUPABASE_URL and
 * VITE_SUPABASE_ANON_KEY are set as repository secrets), so the divergence
 * between the database titles and the static catalogue — the thing that
 * caused the bug — is present here and these tests can actually see it.
 * Before those secrets existed, this file passed with or without the fix.
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

  test("a legacy alias resolves to its tour instead of the home page", async ({
    page,
  }) => {
    await page.addInitScript(() => {
      localStorage.setItem("cookie-consent", "accepted");
      localStorage.setItem(
        "cookie-preferences",
        JSON.stringify({ essential: true, analytics: false, marketing: false }),
      );
    });

    // From LEGACY_ALIASES in src/lib/tour-slugs.ts — a URL Google indexed
    // before the slugs were generated from titles. The comment there says
    // "Never remove an entry from here"; these must keep resolving.
    await page.goto("/tours/costa-brava-girona");

    await expect(
      page.locator('[data-testid="tour-dialog"]').first(),
    ).toBeVisible({ timeout: 20000 });
    // It may land on the canonical slug, but it must stay on a tour page.
    expect(page.url()).toContain("/tours/");
  });
});
