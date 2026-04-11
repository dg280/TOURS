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
 * Find a tour by its slug. Checks:
 * 1. Generated slug match (from title_en)
 * 2. Legacy alias match
 * 3. Numeric ID fallback
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

    // 3. Numeric ID fallback (for /tours/8 style URLs)
    const asNum = Number(slug);
    if (Number.isFinite(asNum) && asNum > 0) {
        return tours.find((t) => Number(t.id) === asNum);
    }

    return undefined;
}
