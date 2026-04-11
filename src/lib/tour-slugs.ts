/**
 * Tour slug mapping — bidirectional ID ↔ slug for SEO-friendly URLs.
 *
 * Slugs are hand-curated from the English tour titles. They MUST remain
 * stable once published (Google indexes them). If a tour is renamed,
 * add a redirect from the old slug to the new one — never delete a slug.
 *
 * Usage:
 *   slugForTour(1)       → "costa-brava-girona"
 *   tourIdForSlug("...") → 1
 */

const SLUG_MAP: Record<number, string> = {
    1: "costa-brava-girona",
    2: "barcelona-walking-tour",
    3: "costa-brava-coastal-hike",
    4: "pre-pyrenees-medieval-hike",
    5: "kayak-costa-brava",
    6: "montserrat-wine-experience",
    7: "girona-collioure",
};

// Reverse map: slug → id
const REVERSE_MAP = new Map<string, number>(
    Object.entries(SLUG_MAP).map(([id, slug]) => [slug, Number(id)]),
);

export function slugForTour(id: string | number): string {
    return SLUG_MAP[Number(id)] || String(id);
}

export function tourIdForSlug(slug: string): number | null {
    // Try slug lookup first
    const fromSlug = REVERSE_MAP.get(slug);
    if (fromSlug !== undefined) return fromSlug;

    // Fallback: if slug is a numeric string, treat as ID
    const asNum = Number(slug);
    if (Number.isFinite(asNum) && asNum > 0) return asNum;

    return null;
}

export function allSlugs(): { id: number; slug: string }[] {
    return Object.entries(SLUG_MAP).map(([id, slug]) => ({
        id: Number(id),
        slug,
    }));
}
