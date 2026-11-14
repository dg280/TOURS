/**
 * /tours/:slug — serve the SPA shell with this tour's own <head>.
 *
 * The site is a client-side React app: every URL used to return the same
 * index.html, so WhatsApp, Facebook, LinkedIn, Bing and AI assistants (none of
 * which run JavaScript) showed the homepage title for every tour link.
 *
 * vercel.json rewrites /tours/:slug here. We read the tour from Supabase (the
 * admin edits it there, so it is never stale), take the deployed index.html and
 * swap in title, description, canonical, Open Graph, Twitter and TouristTrip
 * JSON-LD. The React app then boots on top of it exactly as before.
 *
 * Failure policy: this endpoint must never make a page worse than the static
 * shell. If Supabase is unreachable we serve the shell untouched with a 200.
 * Only when the database answered and the slug matches nothing do we answer
 * 404 — and even then with the shell as the body, because a visitor holding an
 * old link (a title since edited) is still resolved client-side by tour-slugs.ts.
 */
import { createClient } from '@supabase/supabase-js';

const SITE = 'https://toursandetours.eu';

type Lang = 'en' | 'fr' | 'es';

export interface DbTour {
    id: number | string;
    slug?: string | null;
    title?: string;
    title_en?: string;
    title_es?: string;
    description?: string;
    description_en?: string;
    description_es?: string;
    duration?: string;
    price?: number;
    image?: string;
    pricing_tiers?: Record<string, number> | null;
    highlights?: string[] | null;
    highlights_en?: string[] | null;
    highlights_es?: string[] | null;
    itinerary?: string[] | null;
    itinerary_en?: string[] | null;
    itinerary_es?: string[] | null;
    is_active?: boolean | null;
}

// Keep in sync with src/lib/tour-slugs.ts (tests/tour-meta.test.ts checks it).
// api/ cannot import from src/: Vercel's ESM runtime needs explicit extensions.
const LEGACY_ALIASES: Record<string, number> = {
    'costa-brava-girona': 1,
    'barcelona-walking-tour': 2,
    'costa-brava-coastal-hike': 3,
    'pre-pyrenees-medieval-hike': 4,
    'kayak-costa-brava': 5,
    'montserrat-wine-experience': 6,
    'girona-collioure': 7,
};

export function toSlug(text: string): string {
    return text
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .toLowerCase()
        .replace(/[&]/g, 'and')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .replace(/-{2,}/g, '-')
        .slice(0, 80);
}

/** Stored slug if the tour has one, else derived from its title (same rule as the app). */
export function tourSlug(t: DbTour): string {
    if (t.slug) return t.slug;
    const text = t.title_en || t.title || '';
    return text ? toSlug(text) : String(t.id);
}

export function findTour(slug: string, tours: DbTour[]): DbTour | undefined {
    const bySlug = tours.find((t) => tourSlug(t) === slug);
    if (bySlug) return bySlug;

    // A tour with a stored slug stays reachable by its old title-derived URL.
    const byTitle = tours.find((t) => tourSlug({ ...t, slug: null }) === slug);
    if (byTitle) return byTitle;

    const legacyId = LEGACY_ALIASES[slug];
    if (legacyId !== undefined) {
        const byLegacy = tours.find((t) => Number(t.id) === legacyId);
        if (byLegacy) return byLegacy;
    }

    const asNum = Number(slug);
    if (Number.isFinite(asNum) && asNum > 0) {
        return tours.find((t) => Number(t.id) === asNum);
    }
    return undefined;
}

export function parseLang(value: unknown): Lang {
    return value === 'fr' || value === 'es' ? value : 'en';
}

function pick<T>(tour: DbTour, field: 'title' | 'description' | 'highlights' | 'itinerary', lang: Lang): T | undefined {
    const rec = tour as unknown as Record<string, T | null | undefined>;
    // The un-suffixed column is the French original.
    const localized = lang === 'fr' ? undefined : rec[`${field}_${lang}`];
    return (localized || rec[field]) ?? undefined;
}

const escapeAttr = (s: string) =>
    s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const escapeText = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function truncate(s: string, max: number): string {
    const clean = s.replace(/\s+/g, ' ').trim();
    return clean.length <= max ? clean : clean.slice(0, max - 1).trimEnd() + '…';
}

/** Per-person price, same rule as TourStructuredData / TourCard. */
function perPersonPrice(tour: DbTour): number | undefined {
    const tiers = tour.pricing_tiers;
    if (tiers && Object.keys(tiers).length > 0) {
        const maxKey = Math.max(...Object.keys(tiers).map(Number));
        return Math.round(tiers[String(maxKey)] / maxKey);
    }
    return tour.price;
}

/** Replace one tag of the shell, or leave the shell alone if it is missing. */
function replaceTag(html: string, pattern: RegExp, replacement: string): string {
    return pattern.test(html) ? html.replace(pattern, () => replacement) : html;
}

const metaPattern = (attr: 'name' | 'property', value: string) =>
    new RegExp(`<meta\\s+${attr}="${value}"[^>]*>`);

export function buildTourPage(shell: string, tour: DbTour, slug: string, lang: Lang): string {
    const title = pick<string>(tour, 'title', lang) || 'Tour';
    const description = truncate(pick<string>(tour, 'description', lang) || '', 200);
    const pageTitle = `${title} | Tours & Detours Barcelona`;
    const canonical = `${SITE}/tours/${slug}`;
    const url = lang === 'en' ? canonical : `${canonical}?lang=${lang}`;
    const image = tour.image
        ? tour.image.startsWith('http')
            ? tour.image
            : `${SITE}${tour.image.startsWith('/') ? '' : '/'}${tour.image}`
        : `${SITE}/og-image.jpg`;

    let html = shell;
    html = replaceTag(html, /<title>[\s\S]*?<\/title>/, `<title>${escapeText(pageTitle)}</title>`);
    html = replaceTag(html, /<html lang="[^"]*"/, `<html lang="${lang}"`);
    html = replaceTag(html, /<link\s+rel="canonical"[^>]*>/, `<link rel="canonical" href="${escapeAttr(canonical)}" />`);

    const metas: [('name' | 'property'), string, string][] = [
        ['name', 'description', description],
        ['property', 'og:type', 'article'],
        ['property', 'og:url', url],
        ['property', 'og:title', pageTitle],
        ['property', 'og:description', description],
        ['property', 'og:image', image],
        ['name', 'twitter:title', pageTitle],
        ['name', 'twitter:description', description],
        ['name', 'twitter:image', image],
    ];
    for (const [attr, key, content] of metas) {
        html = replaceTag(html, metaPattern(attr, key), `<meta ${attr}="${key}" content="${escapeAttr(content)}" />`);
    }
    // The shell's og:image size describes og-image.jpg, not this tour's photo.
    html = html.replace(/\s*<meta property="og:image:(width|height)"[^>]*>/g, '');
    // The homepage's per-language alternates point at "/", not at this tour.
    html = html.replace(/\s*<link\s+rel="alternate"\s+hreflang="[^"]*"[^>]*>/g, '');
    const alternates = (['en', 'fr', 'es'] as const)
        .map((l) => `<link rel="alternate" hreflang="${l}" href="${canonical}${l === 'en' ? '' : `?lang=${l}`}" />`)
        .concat(`<link rel="alternate" hreflang="x-default" href="${canonical}" />`)
        .join('\n    ');

    const price = perPersonPrice(tour);
    const highlights = pick<string[]>(tour, 'highlights', lang);
    const itinerary = pick<string[]>(tour, 'itinerary', lang);
    const schema = {
        '@context': 'https://schema.org',
        '@type': 'TouristTrip',
        name: title,
        description,
        image,
        touristType: 'Cultural',
        url: canonical,
        provider: {
            '@type': 'TravelAgency',
            name: 'Tours & Detours Barcelona',
            url: SITE,
            telephone: '+34623973105',
        },
        ...(price !== undefined && {
            offers: {
                '@type': 'Offer',
                price,
                priceCurrency: 'EUR',
                availability: 'https://schema.org/InStock',
                url: canonical,
            },
        }),
        ...(itinerary && itinerary.length > 0 && {
            itinerary: {
                '@type': 'ItemList',
                itemListElement: itinerary.map((name, i) => ({ '@type': 'ListItem', position: i + 1, name })),
            },
        }),
        ...(highlights && highlights.length > 0 && { keywords: highlights.join(', ') }),
    };
    // "<" as < so tour text can never close the script element.
    const jsonLd = JSON.stringify(schema).replace(/</g, '\\u003c');

    return html.replace(
        '</head>',
        () => `    ${alternates}\n    <script type="application/ld+json" data-tour-meta>${jsonLd}</script>\n  </head>`,
    );
}

interface Req {
    query?: Record<string, string | string[] | undefined>;
    headers: Record<string, string | string[] | undefined>;
}
interface Res {
    status: (code: number) => Res;
    setHeader: (name: string, value: string) => void;
    send: (body: string) => void;
}

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

async function loadShell(req: Req): Promise<string> {
    const host = first(req.headers['x-forwarded-host']) || first(req.headers.host);
    const proto = first(req.headers['x-forwarded-proto']) || 'https';
    // A static file wins over the catch-all rewrite, so this is the real build output.
    const r = await fetch(`${proto}://${host}/index.html`);
    if (!r.ok) throw new Error(`index.html: ${r.status}`);
    return r.text();
}

async function loadTours(): Promise<DbTour[] | null> {
    const url = process.env.VITE_SUPABASE_URL;
    const key = process.env.VITE_SUPABASE_ANON_KEY;
    if (!url || !key) return null;
    try {
        const { data, error } = await createClient(url, key).from('tours').select('*');
        if (error || !data || data.length === 0) return null;
        return data as DbTour[];
    } catch {
        return null;
    }
}

export default async function handler(req: Req, res: Res) {
    const slug = (first(req.query?.slug) || '').toLowerCase();
    const lang = parseLang(first(req.query?.lang));

    let shell: string;
    try {
        shell = await loadShell(req);
    } catch {
        res.status(502).send('Service temporarily unavailable');
        return;
    }

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    // Edge-cached for 5 min, served stale while refreshed: admin edits show up fast
    // without hitting Supabase on every crawler request.
    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=86400');

    const tours = await loadTours();
    if (!tours) {
        // Database unreachable: degrade to the plain shell, and don't cache the degradation.
        res.setHeader('Cache-Control', 'no-store');
        res.status(200).send(shell);
        return;
    }

    const tour = findTour(slug, tours);
    if (!tour || tour.is_active === false) {
        res.status(404).send(shell);
        return;
    }
    res.status(200).send(buildTourPage(shell, tour, tourSlug(tour) || slug, lang));
}
