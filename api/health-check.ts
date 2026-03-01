/**
 * SAFETY MONITOR: System Health Check
 * This endpoint is used by the Admin Dashboard status indicator.
 * Removing or breaking this will disable real-time connectivity monitoring.
 */
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

export default async function handler(req: { method?: string }, res: { status: (code: number) => { json: (data: unknown) => void } }) {
    const health = {
        timestamp: new Date().toISOString(),
        status: 'ok',
        checks: {
            stripe: { status: 'unknown' as string, message: undefined as string | undefined, mode: undefined as string | undefined },
            supabase: { status: 'unknown' as string, message: undefined as string | undefined }
        }
    };

    // 1. Check Stripe
    try {
        // 1. Stripe check
        const secretKey = process.env.STRIPE_SECRET_KEY || process.env.test_stripe_pv;
        if (secretKey) {
            const stripe = new Stripe(secretKey);
            // Simple call to verify key validity
            await stripe.balance.retrieve();
            const isTest = secretKey.startsWith('sk_test_');
            health.checks.stripe = { 
                status: 'ok', 
                mode: isTest ? 'test' : 'live'
            };
        } else {
            health.checks.stripe = { status: 'error', message: 'Missing STRIPE_SECRET_KEY or test_stripe_pv' };
            health.status = 'error';
        }
    } catch (err) {
        health.checks.stripe = { status: 'error', message: (err as Error).message, mode: undefined };
        health.status = 'error';
    }

    // 2. Check Supabase
    try {
        if (!process.env.VITE_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
            health.checks.supabase = { status: 'error', message: 'Missing Supabase configuration' };
            health.status = 'error';
        } else {
            const supabase = createClient(
                process.env.VITE_SUPABASE_URL,
                process.env.SUPABASE_SERVICE_ROLE_KEY
            );
            const { error } = await supabase.from('tours').select('id').limit(1);
            if (error) throw error;
            health.checks.supabase = { status: 'ok' };
        }
    } catch (err) {
        health.checks.supabase = { status: 'error', message: (err as Error).message };
        health.status = 'error';
    }

    return res.status(health.status === 'ok' ? 200 : 500).json(health);
}
