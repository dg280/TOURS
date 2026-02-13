import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');
const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''; // Use service role for backend
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req: any, res: any) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { tourId, participants, currency = 'eur' } = req.body;

        if (!tourId || !participants) {
            return res.status(400).json({ error: 'Missing tourId or participants' });
        }

        // Fetch tour price from Supabase to prevent client-side manipulation
        const { data: tour, error: fetchError } = await supabase
            .from('tours')
            .select('price')
            .eq('id', tourId)
            .single();

        if (fetchError || !tour) {
            return res.status(404).json({ error: 'Tour not found' });
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
            amount: tour.price * participants // Return for display confirmation
        });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
}
