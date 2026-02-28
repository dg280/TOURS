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
        stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
            apiVersion: '2024-06-20',
        });
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

        if (!process.env.STRIPE_SECRET_KEY) {
            console.error('Missing STRIPE_SECRET_KEY');
            return res.status(500).json({ error: 'Configuration Stripe manquante (Secret Key)' });
        }
        if (!process.env.VITE_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
            console.error('Missing Supabase Config');
            return res.status(500).json({ error: 'Configuration Supabase manquante (URL ou Service Role Key)' });
        }

        const { tourId, participants, currency = 'eur' } = req.body;
        console.log('Payment request for tour:', tourId, 'participants:', participants);

        if (!tourId || !participants) {
            return res.status(400).json({ error: 'Données manquantes (tourId ou participants)' });
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

        // Tiered pricing logic
        let baseAmount = tour.price * participants;
        if (tour.pricing_tiers && typeof tour.pricing_tiers === 'object') {
            const tiers = tour.pricing_tiers as Record<string, number>;
            if (tiers[participants.toString()]) {
                baseAmount = tiers[participants.toString()];
            }
        }

        // Formule : (Prix tour + 0.30) / 0.956
        const totalAmount = (baseAmount + 0.30) / 0.956;
        const amountInCents = Math.round(totalAmount * 100);

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amountInCents,
            currency,
            automatic_payment_methods: {
                enabled: true,
            },
            metadata: {
                tourId,
                participants: participants.toString(),
                baseAmount: baseAmount.toString(),
                stripeFees: (totalAmount - baseAmount).toFixed(2)
            }
        });

        res.status(200).json({
            clientSecret: paymentIntent.client_secret,
            amount: Number(totalAmount.toFixed(2)),
            baseAmount: baseAmount,
            stripeFees: Number((totalAmount - baseAmount).toFixed(2))
        });

    } catch (err) {
        console.error('Payment intent error:', err);
        return res.status(500).json({ error: (err as Error).message });
    }
}
