/**
 * Translation endpoint — translates admin tour content via the Claude API.
 *
 * Why this is server-side
 * -----------------------
 * The admin used to call an unofficial Google Translate endpoint straight
 * from the browser. Two prior free services (MyMemory, then Google's `gtx`
 * client endpoint) both ended up rate-limiting us; worse, Google's 429 reply
 * is an HTML page with no CORS headers, so the browser rejected the response
 * before the app could read the status and the admin only ever saw
 * "Failed to fetch". Going through our own origin removes the CORS failure
 * mode entirely and keeps the provider credential off the client.
 *
 * Required env var:
 *   ANTHROPIC_API_KEY — from console.anthropic.com > API Keys
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
import Anthropic from '@anthropic-ai/sdk';
import { zodOutputFormat } from '@anthropic-ai/sdk/helpers/zod';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

// Claude can take a while on a long itinerary; the Vercel default (10s) is tight.
export const config = { maxDuration: 60 };

const LANGUAGES = ['fr', 'en', 'es'] as const;
type Language = (typeof LANGUAGES)[number];

const LANGUAGE_NAMES: Record<Language, string> = {
    fr: 'French',
    en: 'English',
    es: 'Spanish',
};

// Guard rails — a translation request should never be anywhere near these.
const MAX_TEXTS = 50;
const MAX_TOTAL_CHARS = 30_000;

const TranslationResult = z.object({
    translations: z
        .array(z.string())
        .describe('Translated texts, same count and same order as the input.'),
});

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
 * translation proxy for anyone who finds the URL, which is both a bill we
 * did not sign up for and a fast way to get the API key's quota burned.
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

const SYSTEM_PROMPT = `You are the translator for Tours & Détours Barcelona, a premium private-guide business running tours in Barcelona, the Costa Brava, the Catalan Pyrenees, Montserrat and the Penedès.

You translate website copy that paying customers read: tour descriptions, highlights, itineraries, inclusions and exclusions.

Rules:
- Translate the meaning and the register, not the words. The source is warm, evocative marketing copy — the translation must read as if written by a native speaker in that language, not as a translation.
- Keep proper nouns in their local form: Calella de Palafrugell, Camí de Ronda, Montserrat, Penedès, Girona, Cadaqués, Sant Pere de Rodes, Barri Gòtic, and so on. Never translate or anglicise a place name.
- Preserve the exact formatting of the source: line breaks, the em dash separators, and clock times such as "08:30 —" stay untouched and in place.
- Keep the same number of lines and the same order within a text.
- Do not add, remove or embellish content. No extra adjectives the source does not have.
- Return exactly one translation per input text, in the same order.`;

export default async function handler(req: ApiRequest, res: ApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
        return res.status(500).json({
            error: 'Traduction non configurée (ANTHROPIC_API_KEY manquante dans Vercel)',
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

    // Nothing to do — answer without burning a request.
    if (texts.length === 0 || from === to || texts.every((t: string) => !t.trim())) {
        return res.status(200).json({ translations: texts });
    }

    // Blank entries must keep their slot so indexes still line up on return.
    const indexed = texts.map((text: string, i: number) => ({ i, text }));
    const toTranslate = indexed.filter(({ text }) => text.trim().length > 0);

    const payload = toTranslate
        .map(({ text }, n) => `<text index="${n}">\n${text}\n</text>`)
        .join('\n\n');

    try {
        // An identity-linked API key must name the workspace it acts in, or the
        // API rejects the call with a 400. A plain workspace-scoped key must not
        // send the header at all — so only set it when it is configured.
        const workspaceId = process.env.ANTHROPIC_WORKSPACE_ID;
        const client = new Anthropic(
            workspaceId
                ? { defaultHeaders: { 'anthropic-workspace-id': workspaceId } }
                : {},
        );

        const response = await client.messages.parse({
            model: 'claude-opus-5',
            max_tokens: 16000,
            system: SYSTEM_PROMPT,
            output_config: {
                effort: 'low',
                format: zodOutputFormat(TranslationResult),
            },
            messages: [
                {
                    role: 'user',
                    content: `Translate the following ${toTranslate.length} text(s) from ${LANGUAGE_NAMES[from]} to ${LANGUAGE_NAMES[to]}.\n\n${payload}`,
                },
            ],
        });

        const parsed = response.parsed_output;
        if (!parsed) {
            return res.status(502).json({ error: 'Réponse illisible du moteur de traduction' });
        }
        if (parsed.translations.length !== toTranslate.length) {
            return res.status(502).json({
                error: `Le moteur a renvoyé ${parsed.translations.length} traduction(s) pour ${toTranslate.length} texte(s)`,
            });
        }

        // Rebuild the original shape, blanks included.
        const out = [...texts] as string[];
        toTranslate.forEach(({ i }, n) => {
            out[i] = parsed.translations[n];
        });

        return res.status(200).json({ translations: out });
    } catch (err) {
        console.error('Translation error:', err);

        if (err instanceof Anthropic.AuthenticationError) {
            return res.status(500).json({ error: 'Clé API Anthropic invalide' });
        }
        if (err instanceof Anthropic.RateLimitError) {
            return res
                .status(429)
                .json({ error: 'Quota de traduction atteint — réessaie dans un instant' });
        }
        if (err instanceof Anthropic.APIError) {
            // Surface what the API actually said. A bare status code sends the
            // reader to the Vercel logs for something the toast could have told
            // them — and this endpoint is admin-only, so there is no one else to
            // leak it to.
            const upstream = (err as { error?: { error?: { message?: string } } })?.error?.error
                ?.message;
            return res.status(502).json({
                error: upstream
                    ? `Moteur de traduction (${err.status}) : ${upstream}`
                    : `Moteur de traduction indisponible (${err.status})`,
            });
        }
        return res.status(500).json({ error: (err as Error).message || 'Échec de la traduction' });
    }
}
