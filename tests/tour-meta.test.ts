import { test, expect } from "@playwright/test";
import { buildTourPage, findTour, toSlug, type DbTour } from "../api/tour-meta";
import { toSlug as appToSlug } from "../src/lib/tour-slugs";

const shell = `<!doctype html>
<html lang="en">
  <head>
    <title>Tours & Detours | Private Tours</title>
    <meta name="description" content="generic" />
    <link rel="canonical" href="https://toursandetours.eu/" />
    <meta property="og:title" content="generic" />
    <meta property="og:image" content="https://toursandetours.eu/og-image.jpg" />
    <meta property="og:image:width" content="1200" />
    <link rel="alternate" hreflang="fr" href="https://toursandetours.eu/?lang=fr" />
  </head>
  <body><div id="root"></div></body>
</html>`;

const tour: DbTour = {
  id: 1,
  title: "Costa Brava & Girona FR",
  title_en: 'Costa Brava "Girona" </script><b>',
  description_en: "A day on the coast.",
  image: "/tour-girona.jpg",
  price: 150,
  pricing_tiers: { 2: 300, 4: 440 },
};

test.describe("api/tour-meta", () => {
  test("toSlug stays identical to the app's", () => {
    for (const s of ["Costa Brava & Girona: Medieval paths", "Camí de Ronda", "  --x--  "]) {
      expect(toSlug(s)).toBe(appToSlug(s));
    }
  });

  test("findTour: slug, legacy alias, numeric id, unknown", () => {
    const tours: DbTour[] = [{ id: 1, title: "x", title_en: "Girona Day" }, { id: 2, title: "y" }];
    expect(findTour("girona-day", tours)?.id).toBe(1);
    expect(findTour("barcelona-walking-tour", tours)?.id).toBe(2);
    expect(findTour("1", tours)?.id).toBe(1);
    expect(findTour("nope", tours)).toBeUndefined();
  });

  test("buildTourPage swaps head tags and escapes tour text", () => {
    const out = buildTourPage(shell, tour, "costa-brava-girona", "en");
    expect(out).toContain('<title>Costa Brava "Girona" &lt;/script&gt;&lt;b&gt; | Tours');
    expect(out).toContain('<link rel="canonical" href="https://toursandetours.eu/tours/costa-brava-girona" />');
    expect(out).toContain('content="https://toursandetours.eu/tour-girona.jpg"');
    expect(out).not.toContain("og:image:width");
    expect(out).not.toContain("generic");
    expect(out).toContain('hreflang="es" href="https://toursandetours.eu/tours/costa-brava-girona?lang=es"');
    const ld = out.match(/data-tour-meta>(.*?)<\/script>/s)![1];
    expect(ld).not.toContain("<");
    const schema = JSON.parse(ld);
    expect(schema["@type"]).toBe("TouristTrip");
    expect(schema.offers.price).toBe(110); // 440 / 4 people
  });

  test("french falls back to the un-suffixed (French) columns", () => {
    const out = buildTourPage(shell, tour, "s", "fr");
    expect(out).toContain("Costa Brava &amp; Girona FR | Tours");
    expect(out).toContain('<html lang="fr"');
  });
});

test.describe("slug column + generated sitemap", () => {
  test("a stored slug wins, and the old title-derived URL still resolves", async () => {
    const { slugForTour, tourForSlug } = await import("../src/lib/tour-slugs");
    const t = { id: 1, slug: "girona-costa-brava", title: "x", title_en: "Costa Brava & Girona: Medieval trails" } as never;
    expect(slugForTour(t)).toBe("girona-costa-brava");
    expect(tourForSlug("girona-costa-brava", [t])).toBe(t);
    expect(tourForSlug("costa-brava-and-girona-medieval-trails", [t])).toBe(t);
    expect(tourForSlug("costa-brava-girona", [t])).toBe(t); // legacy alias
    expect(findTour("girona-costa-brava", [t as DbTour])?.id).toBe(1);
    expect(findTour("costa-brava-and-girona-medieval-trails", [t as DbTour])?.id).toBe(1);
  });

  test("sitemap lists exactly the active tours at their canonical URLs", async () => {
    // @ts-expect-error plain .mjs script
    const { buildSitemap } = await import("../scripts/generate-sitemap.mjs");
    const xml: string = buildSitemap([
      { id: 1, slug: "girona-costa-brava", title_en: "Costa Brava & Girona: Medieval trails" },
      { id: 8, title_en: "Costa Brava villages" },
      { id: 9, slug: "hidden", title_en: "Hidden", is_active: false },
    ]);
    expect(xml).toContain("<loc>https://toursandetours.eu/tours/girona-costa-brava</loc>");
    expect(xml).toContain("<loc>https://toursandetours.eu/tours/costa-brava-villages</loc>");
    expect(xml).not.toContain("hidden");
    expect(xml).not.toContain("medieval-trails");
    expect(() => buildSitemap([{ id: 1, slug: "a" }, { id: 2, slug: "a" }])).toThrow(/Duplicate/);
  });
});
