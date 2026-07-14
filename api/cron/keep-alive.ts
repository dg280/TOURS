/**
 * KEEP-ALIVE: Supabase anti-pause ping
 *
 * Free-tier Supabase projects are paused automatically after 7 days without
 * any request. This endpoint performs a single, cheap read against Supabase so
 * the project is counted as "active" every day.
 *
 * Design notes (why this exists separately from cron/reminders):
 *  - The reminders cron guards on CRON_SECRET *before* touching Supabase, so a
 *    missing/mis-set secret means Supabase is never queried and the project
 *    still drifts toward pause. This endpoint decouples "keep the DB warm" from
 *    the reminders business logic and from that guard.
 *  - The Supabase ping always runs. If CRON_SECRET is configured we reject
 *    calls presenting a wrong bearer (spam protection), but a missing secret
 *    never blocks the ping — keeping the project alive matters more than the
 *    gate, and a single `select ... limit 1` is negligible.
 */
import { createClient } from '@supabase/supabase-js';

interface ApiResponse {
    status: (code: number) => {
        json: (data: Record<string, unknown>) => void;
    };
}

interface ApiRequest {
    method?: string;
    headers: Record<string, string | string[] | undefined>;
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
    // Optional spam protection: only enforced when a secret AND a bearer are
    // present. A missing secret must never prevent the keep-alive ping.
    const cronSecret = process.env.CRON_SECRET;
    const authHeader = req.headers.authorization;
    if (cronSecret && authHeader && authHeader !== `Bearer ${cronSecret}`) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    if (!cronSecret) {
        console.warn('[cron/keep-alive] CRON_SECRET is not set — ping runs unauthenticated');
    }

    const url = process.env.VITE_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) {
        console.error('[cron/keep-alive] Missing Supabase configuration');
        return res.status(500).json({ status: 'error', error: 'Missing Supabase configuration' });
    }

    try {
        const supabase = createClient(url, key);
        // Cheapest possible read: one indexed column, one row, head-only count.
        const { error } = await supabase.from('tours').select('id', { head: true, count: 'exact' }).limit(1);
        if (error) throw error;

        console.log('[cron/keep-alive] Supabase ping OK');
        return res.status(200).json({
            status: 'ok',
            pinged: 'supabase',
            timestamp: new Date().toISOString(),
        });
    } catch (err: unknown) {
        console.error('[cron/keep-alive] Supabase ping failed:', err);
        return res.status(500).json({ status: 'error', error: (err as Error).message });
    }
}
