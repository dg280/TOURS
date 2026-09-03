/**
 * SAFETY MONITOR: System Health Check
 * This endpoint is used by the Admin Dashboard status indicator.
 * Removing or breaking this will disable real-time connectivity monitoring.
 */
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

/** Résultat d'une sonde. `message` et `mode` sont facultatifs : une sonde
 *  qui passe n'a rien à signaler, et seul Stripe expose un mode. */
interface Check {
    status: string;
    message?: string;
    mode?: string;
}

interface Health {
    timestamp: string;
    status: string;
    checks: { stripe: Check; supabase: Check; resend: Check };
}

export default async function handler(_req: { method?: string }, res: { status: (code: number) => { json: (data: unknown) => void } }) {
    const health: Health = {
        timestamp: new Date().toISOString(),
        status: 'ok',
        checks: {
            stripe: { status: 'unknown' },
            supabase: { status: 'unknown' },
            resend: { status: 'unknown' }
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
        health.checks.stripe = { status: 'error', message: (err as Error).message };
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

    // 3. Check Resend
    if (!process.env.RESEND_API_KEY) {
        health.checks.resend = { status: 'error', message: 'Missing RESEND_API_KEY' };
        health.status = 'error';
    } else {
        health.checks.resend = { status: 'ok' };
    }

    return res.status(health.status === 'ok' ? 200 : 500).json(health);
}
