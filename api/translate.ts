/**
 * Translation endpoint — translates admin tour content via the DeepL API.
 *
 * Why this is server-side
 * -----------------------
 * The admin used to call an unofficial Google Translate endpoint straight
 * from the browser. Two prior keyless free services (MyMemory, then Google's
 * `gtx` client endpoint) both ended up rate-limiting us; worse, Google's 429
 * reply is an HTML page with no CORS headers, so the browser rejected the
 * response before the app could read the status and the admin only saw
 * "Failed to fetch". Going through our own origin removes the CORS failure
 * mode entirely and keeps the provider credential off the client.
 *
 * Required env var:
 *   DEEPL_API_KEY — from deepl.com > Account > API keys.
 *                   Developer/trial keys end in ":fx"; the SDK routes them to
 *                   api-free.deepl.com automatically, so no host config here.
 *
 * Reuses (already set for the rest of the app):
 *   VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY — to authenticate the caller
 *
 * Usage from the admin:
 *   POST /api/translate
 *   Authorization: Bearer <supabase access token>
 *   Body: { texts: string[], from: "fr"|"en"|"es", to: "fr"|"en"|"es" }
 *
 * Returns: { translations: string[] }  — same length and order as `texts`
 */
import { createClient } from '@supabase/supabase-js';
import {
    AuthorizationError,
    ConnectionError,
    DeepLClient,
    DeepLError,
    QuotaExceededError,
    TooManyRequestsError,
    type SourceLanguageCode,
    type TargetLanguageCode,
} from 'deepl-node';

// A long itinerary can take a few seconds; the Vercel default (10s) is tight.
export const config = { maxDuration: 60 };

const LANGUAGES = ['fr', 'en', 'es'] as const;
type Language = (typeof LANGUAGES)[number];

const SOURCE_LANG: Record<Language, SourceLanguageCode> = {
    fr: 'fr',
    en: 'en',
    es: 'es',
};

// DeepL requires a regional variant for English targets ('en' is rejected).
// Our English-speaking customers are mostly US, hence en-US over en-GB.
const TARGET_LANG: Record<Language, TargetLanguageCode> = {
    fr: 'fr',
    en: 'en-US',
    es: 'es',
};

// Not translated and not billed — it only steers register and word choice.
const CONTEXT =
    'Marketing copy for Tours & Détours Barcelona, a premium private-guide ' +
    'business running small-group tours in Barcelona, the Costa Brava, the ' +
    'Catalan Pyrenees, Montserrat and the Penedès. Tour descriptions, ' +
    'highlights, itineraries, inclusions and exclusions read by paying customers.';

// DeepL caps a request at 50 texts; keep our own ceiling in step with it.
const MAX_TEXTS = 50;
const MAX_TOTAL_CHARS = 30_000;

interface ApiResponse {
    status: (code: number) => { json: (data: Record<string, unknown>) => void };
}

interface ApiRequest {
    method: string;
    headers: Record<string, string | string[] | undefined>;
    body: { texts?: unknown; from?: unknown; to?: unknown };
}

function isLanguage(value: unknown): value is Language {
    return typeof value === 'string' && (LANGUAGES as readonly string[]).includes(value);
}

/**
 * Only signed-in admins may translate. Without this the endpoint is a free
 * translation proxy for anyone who finds the URL, which burns the character
 * quota we are trying to stay inside.
 */
async function isAuthorizedAdmin(bearer: string | undefined): Promise<boolean> {
    const url = process.env.VITE_SUPABASE_URL;
    const anonKey = process.env.VITE_SUPABASE_ANON_KEY;

    if (!url || !anonKey) {
        console.error('Supabase env vars missing — cannot authorize /api/translate');
        return false;
    }
    if (!bearer?.startsWith('Bearer ')) return false;

    // Anon key + the caller's JWT: is_authorized_admin() reads auth.jwt(),
    // so the token has to travel on the client, not a service-role key.
    const supabase = createClient(url, anonKey, {
        global: { headers: { Authorization: bearer } },
        auth: { persistSession: false, autoRefreshToken: false },
    });

    const { data, error } = await supabase.rpc('is_authorized_admin');
    if (error) {
        console.error('is_authorized_admin failed:', error.message);
        return false;
    }
    return data === true;
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const authKey = process.env.DEEPL_API_KEY;
    if (!authKey) {
        return res.status(500).json({
            error: 'Traduction non configurée (DEEPL_API_KEY manquante dans Vercel)',
        });
    }

    const authHeader = req.headers.authorization;
    const bearer = Array.isArray(authHeader) ? authHeader[0] : authHeader;
    if (!(await isAuthorizedAdmin(bearer))) {
        return res.status(401).json({ error: 'Non autorisé — reconnecte-toi à l’admin' });
    }

    const { texts, from, to } = req.body;

    if (!Array.isArray(texts) || texts.some((t) => typeof t !== 'string')) {
        return res.status(400).json({ error: 'texts doit être un tableau de chaînes' });
    }
    if (!isLanguage(from) || !isLanguage(to)) {
        return res.status(400).json({ error: 'Langues invalides (attendu fr, en ou es)' });
    }
    if (texts.length > MAX_TEXTS) {
        return res.status(400).json({ error: `Trop de textes (max ${MAX_TEXTS})` });
    }

    const totalChars = texts.reduce((sum: number, t: string) => sum + t.length, 0);
    if (totalChars > MAX_TOTAL_CHARS) {
        return res
            .status(400)
            .json({ error: `Texte trop long (${totalChars} caractères, max ${MAX_TOTAL_CHARS})` });
    }

    // Nothing to do — answer without spending quota.
    if (texts.length === 0 || from === to || texts.every((t: string) => !t.trim())) {
        return res.status(200).json({ translations: texts });
    }

    // Blank entries must keep their slot so indexes still line up on return,
    // and sending them would waste billed characters.
    const indexed = texts.map((text: string, i: number) => ({ i, text }));
    const toTranslate = indexed.filter(({ text }) => text.trim().length > 0);

    try {
        const client = new DeepLClient(authKey);

        const results = await client.translateText(
            toTranslate.map(({ text }) => text),
            SOURCE_LANG[from],
            TARGET_LANG[to],
            {
                // Itineraries carry clock times and hard line breaks that DeepL
                // would otherwise "tidy up".
                preserveFormatting: true,
                // Premium brand: vouvoiement in FR, usted in ES. The "prefer_"
                // form is ignored rather than rejected on targets (like English)
                // that have no formality setting.
                formality: 'prefer_more',
                context: CONTEXT,
            },
        );

        if (results.length !== toTranslate.length) {
            return res.status(502).json({
                error: `DeepL a renvoyé ${results.length} traduction(s) pour ${toTranslate.length} texte(s)`,
            });
        }

        // Rebuild the original shape, blanks included.
        const out = [...texts] as string[];
        toTranslate.forEach(({ i }, n) => {
            out[i] = results[n].text;
        });

        return res.status(200).json({ translations: out });
    } catch (err) {
        console.error('Translation error:', err);

        if (err instanceof AuthorizationError) {
            return res.status(500).json({ error: 'Clé API DeepL invalide ou révoquée' });
        }
        if (err instanceof QuotaExceededError) {
            return res.status(429).json({
                error: 'Quota DeepL épuisé — vérifie les caractères restants sur ton compte',
            });
        }
        if (err instanceof TooManyRequestsError) {
            return res
                .status(429)
                .json({ error: 'Trop de requêtes DeepL — réessaie dans un instant' });
        }
        if (err instanceof ConnectionError) {
            return res.status(502).json({ error: 'DeepL injoignable — réessaie dans un instant' });
        }
        if (err instanceof DeepLError) {
            // Surface what DeepL actually said. A bare status sends the reader to
            // the Vercel logs for something the toast could have told them, and
            // this endpoint is admin-only so there is no one else to leak it to.
            return res.status(502).json({ error: `DeepL : ${err.message}` });
        }
        return res.status(500).json({ error: (err as Error).message || 'Échec de la traduction' });
    }
}
