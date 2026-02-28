/**
 * SAFETY MONITOR: System Health Check
 * This endpoint is used by the Admin Dashboard status indicator.
 * Removing or breaking this will disable real-time connectivity monitoring.
 */
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

export default async function handler(req: any, res: any) {
    const health: any = {
        timestamp: new Date().toISOString(),
        status: 'ok',
        checks: {
            stripe: { status: 'unknown' },
            supabase: { status: 'unknown' }
        }
    };

    // 1. Check Stripe
    try {
        if (!process.env.STRIPE_SECRET_KEY) {
            health.checks.stripe = { status: 'error', message: 'Missing STRIPE_SECRET_KEY' };
            health.status = 'error';
        }
        // 1. Stripe check
        const secretKey = process.env.STRIPE_SECRET_KEY || process.env.test_stripe_pv;
        if (secretKey) {
            const stripe = new Stripe(secretKey, {
                apiVersion: '2024-06-20',
            });
            // Simple call to verify key validity
            await stripe.balance.retrieve();
            health.checks.stripe = { status: 'ok', version: '2024-06-20' };
        } else {
            // If neither STRIPE_SECRET_KEY nor test_stripe_pv is found
            health.checks.stripe = { status: 'error', message: 'Missing STRIPE_SECRET_KEY or test_stripe_pv' };
            health.status = 'error';
        }
    } catch (err: any) {
        health.checks.stripe = { status: 'error', message: err.message };
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
    } catch (err: any) {
        health.checks.supabase = { status: 'error', message: err.message };
        health.status = 'error';
    }

    return res.status(health.status === 'ok' ? 200 : 500).json(health);
}
