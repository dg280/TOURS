import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

// Initialisation lazy pour éviter les crashs au démarrage si les variables sont absentes
let stripe: Stripe | null = null;
let supabase: any = null;

function getClients() {
    if (!stripe) {
        stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
            apiVersion: '2023-10-16' as any,
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

export default async function handler(req: any, res: any) {
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
            .select('price')
            .eq('id', tourId)
            .single();

        if (fetchError || !tour) {
            console.error('Tour fetch error:', fetchError);
            return res.status(404).json({ error: 'Tour non trouvé en base de données' });
        }

        const amount = Math.round(tour.price * participants * 100);

        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency,
            automatic_payment_methods: {
                enabled: true,
            },
            metadata: {
                tourId,
                participants: participants.toString()
            }
        });

        res.status(200).json({
            clientSecret: paymentIntent.client_secret,
            amount: tour.price * participants
        });
    } catch (err: any) {
        console.error('Global API Error:', err);
        res.status(500).json({ error: err.message || 'Erreur interne du serveur' });
    }
}
