/**
 * Stripe Webhook Handler
 * Verifies payment_intent.succeeded events and triggers reservation confirmation.
 *
 * Required env vars:
 *   STRIPE_SECRET_KEY          — Stripe secret key
 *   STRIPE_WEBHOOK_SECRET      — Webhook signing secret (from Stripe Dashboard > Webhooks)
 *   VITE_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *   RESEND_API_KEY
 *
 * Setup in Stripe Dashboard:
 *   Endpoint URL: https://<your-domain>/api/webhooks/stripe
 *   Events: payment_intent.succeeded
 */
import type { IncomingMessage, ServerResponse } from 'http';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

// Disable Vercel's default body parsing — we need the raw body for signature verification
export const config = { api: { bodyParser: false } };

function escapeHtml(str: unknown): string {
    if (str === null || str === undefined) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;');
}

function getRawBody(req: IncomingMessage): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        const chunks: Buffer[] = [];
        req.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
        req.on('end', () => resolve(Buffer.concat(chunks)));
        req.on('error', reject);
    });
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
    if (req.method !== 'POST') {
        res.writeHead(405).end(JSON.stringify({ error: 'Method not allowed' }));
        return;
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
        console.error('[Webhook] STRIPE_WEBHOOK_SECRET is not set');
        res.writeHead(500).end(JSON.stringify({ error: 'Webhook secret not configured' }));
        return;
    }

    const secretKey = process.env.STRIPE_SECRET_KEY || process.env.test_stripe_pv;
    if (!secretKey) {
        res.writeHead(500).end(JSON.stringify({ error: 'Stripe not configured' }));
        return;
    }

    const stripe = new Stripe(secretKey);
    const rawBody = await getRawBody(req);
    const sig = (req.headers as Record<string, string>)['stripe-signature'];

    let event: Stripe.Event;
    try {
        event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
    } catch (err) {
        console.error('[Webhook] Signature verification failed:', (err as Error).message);
        res.writeHead(400).end(JSON.stringify({ error: 'Invalid signature' }));
        return;
    }

    if (event.type !== 'payment_intent.succeeded') {
        res.writeHead(200).end(JSON.stringify({ received: true, skipped: event.type }));
        return;
    }

    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    const supabase = createClient(
        process.env.VITE_SUPABASE_URL || '',
        process.env.SUPABASE_SERVICE_ROLE_KEY || ''
    );

    // 1. Find reservation by payment_intent_id
    const { data: reservation, error: resError } = await supabase
        .from('reservations')
        .select('*')
        .eq('payment_intent_id', paymentIntent.id)
        .single();

    if (resError || !reservation) {
        // Reservation may have been created with an older flow — not a hard error
        console.warn('[Webhook] No reservation found for payment_intent:', paymentIntent.id);
        res.writeHead(200).end(JSON.stringify({ received: true, warning: 'reservation_not_found' }));
        return;
    }

    // 2. Idempotency: skip if already confirmed
    if (reservation.status === 'confirmed') {
        res.writeHead(200).end(JSON.stringify({ received: true, skipped: 'already_confirmed' }));
        return;
    }

    // 3. Update reservation status to confirmed
    const { error: updateError } = await supabase
        .from('reservations')
        .update({ status: 'confirmed' })
        .eq('id', reservation.id);

    if (updateError) {
        console.error('[Webhook] Failed to update reservation:', updateError);
        res.writeHead(500).end(JSON.stringify({ error: 'Failed to update reservation' }));
        return;
    }

    // 4. Fetch tour details
    const { data: tour } = await supabase
        .from('tours')
        .select('title, included, duration')
        .eq('id', reservation.tour_id)
        .single();

    // 5. Send confirmation emails
    try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        const adminEmail = process.env.ADMIN_EMAIL || 'info@toursandetours.com';

        const dateFormatted = new Date(reservation.date).toLocaleDateString('fr-FR', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
        });

        const includedList = (tour?.included as string[] | null)
            ?.map((item: string) => `<li style="margin:4px 0;">${escapeHtml(item)}</li>`)
            .join('') || '';

        const customerHtml = `
<!DOCTYPE html><html lang="fr"><body style="margin:0;padding:0;background:#f9fafb;font-family:sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 0;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;max-width:600px;width:100%;">
<tr><td style="background:#111827;padding:40px;text-align:center;">
  <p style="margin:0 0 4px;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#c9a961;font-weight:700;">Tours &amp; Détours Barcelona</p>
  <h1 style="margin:0;font-size:26px;color:#fff;font-weight:300;">Réservation confirmée</h1>
</td></tr>
<tr><td style="background:#d1fae5;padding:14px 40px;text-align:center;">
  <p style="margin:0;color:#065f46;font-weight:700;font-size:14px;">✓ Paiement reçu — Merci ${escapeHtml(reservation.name)} !</p>
</td></tr>
<tr><td style="padding:32px 40px 16px;">
  <h2 style="margin:0;font-size:22px;color:#111827;font-weight:700;">${escapeHtml(reservation.tour_name || tour?.title)}</h2>
</td></tr>
<tr><td style="padding:16px 40px 24px;">
  <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
    <tr style="background:#f9fafb;"><td colspan="2" style="padding:12px 16px;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#6b7280;">Détails</td></tr>
    <tr style="border-top:1px solid #e5e7eb;"><td style="padding:12px 16px;color:#6b7280;font-size:14px;width:40%;">Date</td><td style="padding:12px 16px;color:#111827;font-weight:700;font-size:14px;">${escapeHtml(dateFormatted)}</td></tr>
    <tr style="border-top:1px solid #e5e7eb;"><td style="padding:12px 16px;color:#6b7280;font-size:14px;">Voyageurs</td><td style="padding:12px 16px;color:#111827;font-weight:700;font-size:14px;">${escapeHtml(reservation.participants)}</td></tr>
    ${reservation.pickup_time ? `<tr style="border-top:1px solid #e5e7eb;background:#fffbeb;"><td style="padding:12px 16px;color:#6b7280;font-size:14px;">Heure pick-up</td><td style="padding:12px 16px;color:#92400e;font-weight:700;font-size:14px;">${escapeHtml(reservation.pickup_time)}</td></tr>` : ''}
    ${reservation.pickup_address ? `<tr style="border-top:1px solid #e5e7eb;background:#fffbeb;"><td style="padding:12px 16px;color:#6b7280;font-size:14px;">Adresse pick-up</td><td style="padding:12px 16px;color:#92400e;font-weight:700;font-size:14px;">${escapeHtml(reservation.pickup_address)}</td></tr>` : ''}
    <tr style="border-top:2px solid #e5e7eb;background:#f9fafb;"><td style="padding:14px 16px;color:#6b7280;font-size:14px;font-weight:700;">Total payé</td><td style="padding:14px 16px;color:#c9a961;font-weight:700;font-size:18px;">${escapeHtml(reservation.total_price)}€</td></tr>
  </table>
</td></tr>
${includedList ? `<tr><td style="padding:0 40px 24px;"><div style="background:#ecfdf5;border:1px solid #a7f3d0;border-radius:12px;padding:20px 24px;"><p style="margin:0 0 12px;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#065f46;">Ce qui est inclus</p><ul style="margin:0;padding:0 0 0 16px;">${includedList}</ul></div></td></tr>` : ''}
<tr><td style="padding:0 40px 40px;"><div style="background:#f9fafb;border-radius:12px;padding:20px 24px;text-align:center;">
  <p style="margin:0 0 8px;color:#374151;font-size:14px;">Des questions ?</p>
  <p style="margin:0 0 4px;"><a href="https://wa.me/34623973105" style="color:#c9a961;font-weight:700;text-decoration:none;">📱 WhatsApp : +34 623 97 31 05</a></p>
  <p style="margin:0;"><a href="mailto:${escapeHtml(adminEmail)}" style="color:#c9a961;font-weight:700;text-decoration:none;">✉️ ${escapeHtml(adminEmail)}</a></p>
</div></td></tr>
<tr><td style="background:#111827;padding:24px 40px;text-align:center;">
  <p style="margin:0;color:#9ca3af;font-size:12px;">Tours &amp; Détours Barcelona · Antoine Pilard</p>
</td></tr>
</table>
</td></tr></table>
</body></html>`;

        const adminHtml = `
<h2>🎉 Réservation confirmée via Stripe Webhook</h2>
<table style="border-collapse:collapse;width:100%;max-width:500px;">
  <tr><td style="padding:8px;background:#f3f4f6;font-weight:700;">Tour</td><td style="padding:8px;">${escapeHtml(reservation.tour_name)}</td></tr>
  <tr><td style="padding:8px;background:#f3f4f6;font-weight:700;">Client</td><td style="padding:8px;">${escapeHtml(reservation.name)}</td></tr>
  <tr><td style="padding:8px;background:#f3f4f6;font-weight:700;">Email</td><td style="padding:8px;">${escapeHtml(reservation.email)}</td></tr>
  <tr><td style="padding:8px;background:#f3f4f6;font-weight:700;">Date</td><td style="padding:8px;">${escapeHtml(dateFormatted)}</td></tr>
  <tr><td style="padding:8px;background:#f3f4f6;font-weight:700;">Participants</td><td style="padding:8px;">${escapeHtml(reservation.participants)}</td></tr>
  <tr><td style="padding:8px;background:#f3f4f6;font-weight:700;">Total</td><td style="padding:8px;font-weight:700;color:#c9a961;">${escapeHtml(reservation.total_price)}€</td></tr>
  <tr><td style="padding:8px;background:#f3f4f6;font-weight:700;">Payment Intent</td><td style="padding:8px;font-size:11px;color:#6b7280;">${escapeHtml(paymentIntent.id)}</td></tr>
</table>`;

        await resend.emails.send({
            from: 'Tours & Détours <onboarding@resend.dev>',
            to: reservation.email,
            subject: `✓ Réservation confirmée : ${escapeHtml(reservation.tour_name)} — ${dateFormatted}`,
            html: customerHtml,
        });

        await resend.emails.send({
            from: 'Tours & Détours <onboarding@resend.dev>',
            to: adminEmail,
            subject: `RÉSA [WEBHOOK] : ${escapeHtml(reservation.tour_name)} · ${escapeHtml(reservation.name)} · ${dateFormatted}`,
            html: adminHtml,
        });

        console.log('[Webhook] Confirmation emails sent for reservation:', reservation.id);
    } catch (emailErr) {
        // Don't fail the webhook on email error — reservation is already confirmed
        console.error('[Webhook] Email send failed:', emailErr);
    }

    res.writeHead(200).end(JSON.stringify({ received: true, reservationId: reservation.id }));
}
