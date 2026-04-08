/**
 * CRITICAL: Payment Intent Creation
 * This file handles real financial transactions. 
 * - Do NOT change Stripe API Version without full regression testing.
 * - Pricing tiers must be handled correctly (see Supabase 'tours' table).
 */
import Stripe from 'stripe';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// Initialisation lazy pour éviter les crashs au démarrage si les variables sont absentes
let stripe: Stripe | null = null;
let supabase: SupabaseClient | null = null;

function getClients() {
    if (!stripe) {
        const secretKey = process.env.STRIPE_SECRET_KEY || process.env.test_stripe_pv;
        if (!secretKey) {
            console.error("CRITICAL: Stripe Secret Key is missing (checked STRIPE_SECRET_KEY and test_stripe_pv)");
            throw new Error('Stripe is not configured');
        }
        console.log(`[Stripe] Initialized using ${secretKey.startsWith('sk_test_') ? 'TEST' : 'LIVE'} key.`);
        // Use the SDK's default API version (Stripe SDK 20.x = 2024-09-30.acacia).
        // Do NOT hardcode '2025-01-27' — that version is not supported by SDK 20.x
        // and causes Stripe to reject paymentIntents.create with an internal error.
        stripe = new Stripe(secretKey);
    }
    if (!supabase) {
        supabase = createClient(
            process.env.VITE_SUPABASE_URL || '',
            process.env.SUPABASE_SERVICE_ROLE_KEY || ''
        );
    }
    return { stripe, supabase };
}

interface ApiResponse {
    status: (code: number) => {
        json: (data: Record<string, unknown>) => void;
    };
}

interface ApiRequest {
    method: string;
    body: {
        tourId: string | number;
        participants: number;
        currency?: string;
    };
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { stripe, supabase } = getClients();

        if (!process.env.STRIPE_SECRET_KEY && !process.env.test_stripe_pv) {
            console.error('Missing STRIPE_SECRET_KEY and test_stripe_pv');
            return res.status(500).json({ error: 'Configuration Stripe manquante (Secret Key)' });
        }
        if (!process.env.VITE_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
            console.error('Missing Supabase Config');
            return res.status(500).json({ error: 'Configuration Supabase manquante (URL ou Service Role Key)' });
        }

        const { tourId, participants, currency = 'eur' } = req.body;

        if (!tourId || !participants) {
            return res.status(400).json({ error: 'Données manquantes (tourId ou participants)' });
        }

        const participantsInt = parseInt(String(participants), 10);
        if (isNaN(participantsInt) || participantsInt < 1 || participantsInt > 50) {
            return res.status(400).json({ error: 'Nombre de participants invalide (1–50)' });
        }

        const allowedCurrencies = ['eur', 'usd', 'gbp'];
        if (!allowedCurrencies.includes(currency)) {
            return res.status(400).json({ error: 'Devise non supportée' });
        }

        const { data: tour, error: fetchError } = await supabase
            .from('tours')
            .select('price, pricing_tiers')
            .eq('id', tourId)
            .single();

        if (fetchError || !tour) {
            console.error('Tour fetch error:', fetchError);
            return res.status(404).json({ error: 'Tour non trouvé en base de données' });
        }

        // Coerce price to a number — Postgres numeric can come back as string
        // via PostgREST. Without this, multiplication concatenates (audit H6).
        const tourPrice = Number(tour.price);
        if (!Number.isFinite(tourPrice) || tourPrice <= 0) {
            console.error('Invalid tour.price:', tour.price);
            return res.status(500).json({ error: 'Tour price is invalid' });
        }

        // Tiered pricing logic
        let baseAmount = tourPrice * participantsInt;
        if (tour.pricing_tiers && typeof tour.pricing_tiers === 'object') {
            const tiers = tour.pricing_tiers as Record<string, number>;
            const tierValue = Number(tiers[participantsInt.toString()]);
            if (Number.isFinite(tierValue) && tierValue > 0) {
                baseAmount = tierValue;
            }
        }

        // Formule : (Prix tour + 0.30) / 0.956
        const totalAmount = (baseAmount + 0.30) / 0.956;
        const amountInCents = Math.round(totalAmount * 100);

        // Idempotency key: stable per (tour, participants, client, minute-window).
        // Prevents double-charge if the client retries within ~1 minute (audit H5).
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const fwdHeader = (req as any).headers?.['x-forwarded-for'];
        const clientIp = Array.isArray(fwdHeader) ? fwdHeader[0] : (fwdHeader || 'unknown');
        const minuteWindow = Math.floor(Date.now() / 60000);
        const idempotencyKey = `pi-${tourId}-${participantsInt}-${clientIp}-${minuteWindow}`;

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amountInCents,
            currency,
            automatic_payment_methods: {
                enabled: true,
            },
            metadata: {
                tourId: String(tourId),
                participants: participantsInt.toString(),
                baseAmount: baseAmount.toString(),
                stripeFees: (totalAmount - baseAmount).toFixed(2)
            }
        }, { idempotencyKey });

        res.status(200).json({
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id,
            amount: Number(totalAmount.toFixed(2)),
            baseAmount: baseAmount,
            stripeFees: Number((totalAmount - baseAmount).toFixed(2)),
            mode: (process.env.STRIPE_SECRET_KEY || process.env.test_stripe_pv || '').startsWith('sk_test_') ? 'test' : 'live'
        });

    } catch (err) {
        // Don't leak internal error details to client (audit M1)
        console.error('Payment intent error:', err);
        return res.status(500).json({ error: 'Internal error' });
    }
}
