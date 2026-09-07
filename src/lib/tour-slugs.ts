/**
 * Tour slug system — auto-generates SEO-friendly slugs from tour titles.
 *
 * Slugs are generated dynamically from the English title (title_en) with
 * a fallback to the French title. No hardcoded map needed — new tours
 * automatically get a clean URL.
 *
 * Legacy aliases are kept so that previously-indexed Google URLs
 * (from the old hardcoded map) still resolve correctly.
 *
 * Usage:
 *   slugForTour(tour)           → "costa-brava-girona"
 *   tourForSlug(slug, tours)    → Tour object | undefined
 */

import type { Tour } from './types';
import { translations } from './translations';

// Legacy aliases: old hardcoded slugs that Google may have indexed.
// Maps old slug → tour ID. Never remove an entry from here.
const LEGACY_ALIASES: Record<string, number> = {
    "costa-brava-girona": 1,
    "barcelona-walking-tour": 2,
    "costa-brava-coastal-hike": 3,
    "pre-pyrenees-medieval-hike": 4,
    "kayak-costa-brava": 5,
    "montserrat-wine-experience": 6,
    "girona-collioure": 7,
};

/**
 * Convert any string to a URL-safe slug.
 * "Costa Brava & Girona: Medieval paths" → "costa-brava-girona-medieval-paths"
 */
export function toSlug(text: string): string {
    return text
        .normalize('NFD')                    // decompose accents
        .replace(/[\u0300-\u036f]/g, '')     // strip accent marks
        .toLowerCase()
        .replace(/[&]/g, 'and')              // & → and
        .replace(/[^a-z0-9]+/g, '-')         // non-alphanum → dash
        .replace(/^-+|-+$/g, '')             // trim leading/trailing dashes
        .replace(/-{2,}/g, '-')              // collapse multiple dashes
        .slice(0, 80);                       // reasonable max length
}

/**
 * Generate the canonical slug for a tour.
 * Uses title_en (preferred), falls back to title.
 */
export function slugForTour(tour: Tour | { id: string | number; title: string; title_en?: string }): string {
    const title = tour.title_en || tour.title || '';
    if (!title) return String(tour.id);
    return toSlug(title);
}

/**
 * Convenience: generate slug from just an ID + title string
 * (used in places where we don't have the full Tour object).
 */
export function slugForTourId(id: string | number, titleEn: string | undefined, title: string): string {
    const text = titleEn || title || '';
    if (!text) return String(id);
    return toSlug(text);
}

/**
 * Slugs generated from the *static* catalogue in translations.ts, mapped to
 * their tour id — in all three languages.
 *
 * That catalogue seeds the tour list before Supabase answers, and its titles
 * are frozen while the admin edits the database ones. So a visitor who clicks
 * a card in that first second navigates to a slug built from a stale title:
 * "…medieval-paths…" where the database now says "…medieval-trails…". A second
 * later the real data lands, the slug matches nothing, and they are bounced to
 * the home page. Treating those slugs as aliases makes the two eras of a title
 * resolve to the same tour.
 */
const STATIC_SLUGS: Record<string, string> = (() => {
    const map: Record<string, string> = {};
    for (const lang of Object.keys(translations) as (keyof typeof translations)[]) {
        const data = translations[lang].tour_data as { id: string | number; title?: string }[];
        for (const entry of data ?? []) {
            if (!entry?.title) continue;
            const s = toSlug(entry.title);
            if (s) map[s] = String(entry.id);
        }
    }
    return map;
})();

/**
 * Find a tour by its slug. Checks, in order:
 * 1. Generated slug match (from the current title)
 * 2. Legacy alias match (URLs Google indexed under the old hardcoded map)
 * 3. Static-catalogue slug match (a title that has since been edited)
 * 4. Numeric ID fallback
 */
export function tourForSlug(slug: string, tours: Tour[]): Tour | undefined {
    // 1. Match by generated slug
    const bySlug = tours.find((t) => slugForTour(t) === slug);
    if (bySlug) return bySlug;

    // 2. Match by legacy alias
    const legacyId = LEGACY_ALIASES[slug];
    if (legacyId !== undefined) {
        const byLegacy = tours.find((t) => Number(t.id) === legacyId);
        if (byLegacy) return byLegacy;
    }

    // 3. Match by a slug the static catalogue would have produced
    const staticId = STATIC_SLUGS[slug];
    if (staticId !== undefined) {
        const byStatic = tours.find((t) => String(t.id) === staticId);
        if (byStatic) return byStatic;
    }

    // 4. Numeric ID fallback (for /tours/8 style URLs)
    const asNum = Number(slug);
    if (Number.isFinite(asNum) && asNum > 0) {
        return tours.find((t) => Number(t.id) === asNum);
    }

    return undefined;
}
