import { test, expect } from "@playwright/test";

/**
 * The cookie banner offers visitors an "analytics" switch. These tests hold us
 * to it: the beacon must not load unless the visitor accepted AND left
 * analytics on.
 */

const BEACON = /insights|vercel-scripts/;

async function beaconLoaded(page: import("@playwright/test").Page) {
  // Give the component a beat to inject its script after hydration.
  await page.waitForTimeout(1500);
  return page.evaluate(
    (re) =>
      [...document.querySelectorAll("script")].some((s) =>
        new RegExp(re).test(s.src || ""),
      ),
    BEACON.source,
  );
}

async function seedConsent(
  page: import("@playwright/test").Page,
  value: Record<string, unknown> | null,
) {
  await page.addInitScript((v) => {
    if (v === null) {
      localStorage.removeItem("cookie-consent");
      localStorage.removeItem("cookie-preferences");
    } else {
      localStorage.setItem("cookie-consent", "accepted");
      localStorage.setItem("cookie-preferences", JSON.stringify(v));
    }
  }, value);
}

test.describe("Analytics honours cookie consent", () => {
  test("stays silent when the visitor has not answered the banner", async ({
    page,
  }) => {
    await seedConsent(page, null);
    await page.goto("/");
    expect(await beaconLoaded(page)).toBe(false);
  });

  test("stays silent when the visitor switched analytics off", async ({
    page,
  }) => {
    await seedConsent(page, { essential: true, analytics: false, marketing: false });
    await page.goto("/");
    expect(await beaconLoaded(page)).toBe(false);
  });

  test("loads once the visitor accepted with analytics on", async ({ page }) => {
    await seedConsent(page, { essential: true, analytics: true, marketing: true });
    await page.goto("/");
    expect(await beaconLoaded(page)).toBe(true);
  });
});
