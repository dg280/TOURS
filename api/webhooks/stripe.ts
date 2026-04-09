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

// Inlined i18n helper (was api/_lib/email-i18n.ts) — Vercel was failing to
// bundle the shared file at runtime, causing the function to crash on cold
// start with an empty 500 response. Keeping it inline removes that risk.
type EmailLang = 'fr' | 'en' | 'es';
function normalizeLang(input: unknown): EmailLang {
    const v = String(input || '').toLowerCase();
    if (v === 'en' || v === 'es') return v;
    return 'fr';
}
function localeFor(lang: EmailLang): string {
    if (lang === 'en') return 'en-GB';
    if (lang === 'es') return 'es-ES';
    return 'fr-FR';
}
function formatBookingDate(dateStr: string, lang: EmailLang): string {
    return new Date(dateStr + 'T12:00:00').toLocaleDateString(localeFor(lang), {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
        timeZone: 'Europe/Madrid',
    });
}
const EMAIL_STRINGS = {
    fr: {
        subject_customer: '✓ Réservation confirmée',
        subject_admin_webhook: 'RÉSA [WEBHOOK]',
        header_brand: 'Tours & Détours Barcelona',
        header_title: 'Réservation confirmée',
        hero_thanks: '✓ Paiement reçu — Merci',
        details: 'Détails', date: 'Date', travelers: 'Voyageurs',
        pickup_time: 'Heure pick-up', pickup_address: 'Adresse pick-up',
        total_paid: 'Total payé', included: 'Ce qui est inclus',
        questions: 'Des questions ?',
        admin_title: '🎉 Nouvelle réservation confirmée (webhook)',
        admin_tour: 'Tour', admin_client: 'Client', admin_email: 'Email',
        admin_participants: 'Participants', admin_total: 'Total',
    },
    en: {
        subject_customer: '✓ Booking confirmed',
        subject_admin_webhook: 'RESA [WEBHOOK]',
        header_brand: 'Tours & Détours Barcelona',
        header_title: 'Booking confirmed',
        hero_thanks: '✓ Payment received — Thank you',
        details: 'Details', date: 'Date', travelers: 'Travelers',
        pickup_time: 'Pick-up time', pickup_address: 'Pick-up address',
        total_paid: 'Total paid', included: "What's included",
        questions: 'Any questions?',
        admin_title: '🎉 New confirmed booking (webhook)',
        admin_tour: 'Tour', admin_client: 'Customer', admin_email: 'Email',
        admin_participants: 'Travelers', admin_total: 'Total',
    },
    es: {
        subject_customer: '✓ Reserva confirmada',
        subject_admin_webhook: 'RESERVA [WEBHOOK]',
        header_brand: 'Tours & Détours Barcelona',
        header_title: 'Reserva confirmada',
        hero_thanks: '✓ Pago recibido — Gracias',
        details: 'Detalles', date: 'Fecha', travelers: 'Viajeros',
        pickup_time: 'Hora de recogida', pickup_address: 'Dirección de recogida',
        total_paid: 'Total pagado', included: 'Qué incluye',
        questions: '¿Alguna pregunta?',
        admin_title: '🎉 Nueva reserva confirmada (webhook)',
        admin_tour: 'Tour', admin_client: 'Cliente', admin_email: 'Email',
        admin_participants: 'Viajeros', admin_total: 'Total',
    },
} as const;
function emailStrings(lang: EmailLang) {
    return EMAIL_STRINGS[lang];
}

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

    // 1. Atomic claim: only the first caller (client OR webhook) wins.
    // Avoids duplicate confirmation emails when both fire in parallel (audit H5).
    const { data: reservation, error: resError } = await supabase
        .from('reservations')
        .update({ status: 'confirmed' })
        .eq('payment_intent_id', paymentIntent.id)
        .neq('status', 'confirmed')
        .select('*')
        .maybeSingle();

    if (resError) {
        console.error('[Webhook] Failed to update reservation:', resError);
        res.writeHead(500).end(JSON.stringify({ error: 'Failed to update reservation' }));
        return;
    }

    if (!reservation) {
        // Either no reservation matches this payment_intent, or it was already
        // confirmed by /api/confirm-booking. Acknowledge to Stripe and stop.
        console.log('[Webhook] No claim won for payment_intent:', paymentIntent.id);
        res.writeHead(200).end(JSON.stringify({ received: true, skipped: 'already_confirmed_or_not_found' }));
        return;
    }

    // 4. Fetch tour details — include all language variants so we can
    // localize the email content per the customer's lang.
    const { data: tour } = await supabase
        .from('tours')
        .select('title, title_en, title_es, included, included_en, included_es')
        .eq('id', reservation.tour_id)
        .single();

    // 5. Send confirmation emails — language is read from PI metadata so the
    // customer receives the same language as during checkout (FR/EN/ES).
    try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        const adminEmail = process.env.ADMIN_EMAIL || 'info@toursandetours.com';

        const lang = normalizeLang(paymentIntent.metadata?.lang);
        const L = emailStrings(lang);
        const dateFormatted = formatBookingDate(reservation.date, lang);

        // Pick the localized variants of tour content. Fallback chain:
        // requested lang → English → French. English is the default fallback
        // (not French) so non-French customers never see FR content unless
        // English is also missing.
        const includedFr = (tour?.included as string[] | null) || null;
        const includedEn = (tour?.included_en as string[] | null) || null;
        const includedEs = (tour?.included_es as string[] | null) || null;
        const includedRaw =
            (lang === 'fr' && includedFr) ||
            (lang === 'es' && includedEs) ||
            (lang === 'en' && includedEn) ||
            includedEn ||
            includedFr;

        const titleFr = (tour?.title as string | null) || null;
        const titleEn = (tour?.title_en as string | null) || null;
        const titleEs = (tour?.title_es as string | null) || null;
        const localizedTitle =
            (lang === 'fr' && titleFr) ||
            (lang === 'es' && titleEs) ||
            (lang === 'en' && titleEn) ||
            titleEn ||
            titleFr ||
            reservation.tour_name;

        const includedList = includedRaw
            ?.map((item: string) => `<li style="margin:4px 0;">${escapeHtml(item)}</li>`)
            .join('') || '';

        const customerHtml = `
<!DOCTYPE html><html lang="${lang}"><body style="margin:0;padding:0;background:#f9fafb;font-family:sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 0;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;max-width:600px;width:100%;">
<tr><td style="background:#111827;padding:40px;text-align:center;">
  <p style="margin:0 0 4px;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#c9a961;font-weight:700;">${L.header_brand}</p>
  <h1 style="margin:0;font-size:26px;color:#fff;font-weight:300;">${L.header_title}</h1>
</td></tr>
<tr><td style="background:#d1fae5;padding:14px 40px;text-align:center;">
  <p style="margin:0;color:#065f46;font-weight:700;font-size:14px;">${L.hero_thanks} ${escapeHtml(reservation.name)} !</p>
</td></tr>
<tr><td style="padding:32px 40px 16px;">
  <h2 style="margin:0;font-size:22px;color:#111827;font-weight:700;">${escapeHtml(localizedTitle)}</h2>
</td></tr>
<tr><td style="padding:16px 40px 24px;">
  <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
    <tr style="background:#f9fafb;"><td colspan="2" style="padding:12px 16px;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#6b7280;">${L.details}</td></tr>
    <tr style="border-top:1px solid #e5e7eb;"><td style="padding:12px 16px;color:#6b7280;font-size:14px;width:40%;">${L.date}</td><td style="padding:12px 16px;color:#111827;font-weight:700;font-size:14px;">${escapeHtml(dateFormatted)}</td></tr>
    <tr style="border-top:1px solid #e5e7eb;"><td style="padding:12px 16px;color:#6b7280;font-size:14px;">${L.travelers}</td><td style="padding:12px 16px;color:#111827;font-weight:700;font-size:14px;">${escapeHtml(reservation.participants)}</td></tr>
    ${reservation.pickup_time ? `<tr style="border-top:1px solid #e5e7eb;background:#fffbeb;"><td style="padding:12px 16px;color:#6b7280;font-size:14px;">${L.pickup_time}</td><td style="padding:12px 16px;color:#92400e;font-weight:700;font-size:14px;">${escapeHtml(reservation.pickup_time)}</td></tr>` : ''}
    ${reservation.pickup_address ? `<tr style="border-top:1px solid #e5e7eb;background:#fffbeb;"><td style="padding:12px 16px;color:#6b7280;font-size:14px;">${L.pickup_address}</td><td style="padding:12px 16px;color:#92400e;font-weight:700;font-size:14px;">${escapeHtml(reservation.pickup_address)}</td></tr>` : ''}
    <tr style="border-top:2px solid #e5e7eb;background:#f9fafb;"><td style="padding:14px 16px;color:#6b7280;font-size:14px;font-weight:700;">${L.total_paid}</td><td style="padding:14px 16px;color:#c9a961;font-weight:700;font-size:18px;">${escapeHtml(reservation.total_price)}€</td></tr>
  </table>
</td></tr>
${includedList ? `<tr><td style="padding:0 40px 24px;"><div style="background:#ecfdf5;border:1px solid #a7f3d0;border-radius:12px;padding:20px 24px;"><p style="margin:0 0 12px;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#065f46;">${L.included}</p><ul style="margin:0;padding:0 0 0 16px;">${includedList}</ul></div></td></tr>` : ''}
<tr><td style="padding:0 40px 40px;"><div style="background:#f9fafb;border-radius:12px;padding:20px 24px;text-align:center;">
  <p style="margin:0 0 8px;color:#374151;font-size:14px;">${L.questions}</p>
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
<h2>${L.admin_title}</h2>
<table style="border-collapse:collapse;width:100%;max-width:500px;">
  <tr><td style="padding:8px;background:#f3f4f6;font-weight:700;">${L.admin_tour}</td><td style="padding:8px;">${escapeHtml(reservation.tour_name)}</td></tr>
  <tr><td style="padding:8px;background:#f3f4f6;font-weight:700;">${L.admin_client}</td><td style="padding:8px;">${escapeHtml(reservation.name)}</td></tr>
  <tr><td style="padding:8px;background:#f3f4f6;font-weight:700;">${L.admin_email}</td><td style="padding:8px;">${escapeHtml(reservation.email)}</td></tr>
  <tr><td style="padding:8px;background:#f3f4f6;font-weight:700;">${L.date}</td><td style="padding:8px;">${escapeHtml(dateFormatted)}</td></tr>
  <tr><td style="padding:8px;background:#f3f4f6;font-weight:700;">${L.admin_participants}</td><td style="padding:8px;">${escapeHtml(reservation.participants)}</td></tr>
  <tr><td style="padding:8px;background:#f3f4f6;font-weight:700;">${L.admin_total}</td><td style="padding:8px;font-weight:700;color:#c9a961;">${escapeHtml(reservation.total_price)}€</td></tr>
  <tr><td style="padding:8px;background:#f3f4f6;font-weight:700;">Payment Intent</td><td style="padding:8px;font-size:11px;color:#6b7280;">${escapeHtml(paymentIntent.id)}</td></tr>
</table>`;

        // Use verified domain via env var (audit C2)
        const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
        const fromAddress = `Tours & Détours <${fromEmail}>`;

        // Sanitize subject lines (do NOT HTML-escape subjects — audit H2)
        const sanitizeHeader = (s: unknown) => String(s ?? '').replace(/[\r\n]/g, ' ').slice(0, 150);
        // Customer subject uses the localized title; admin subject keeps the
        // stored (FR) tour name for consistency across languages.
        const localizedTitleSafe = sanitizeHeader(localizedTitle);
        const adminTourNameSafe = sanitizeHeader(reservation.tour_name);
        const customerNameSafe = sanitizeHeader(reservation.name);

        await resend.emails.send({
            from: fromAddress,
            to: reservation.email,
            subject: `${L.subject_customer} : ${localizedTitleSafe} — ${dateFormatted}`,
            html: customerHtml,
        });

        await resend.emails.send({
            from: fromAddress,
            to: adminEmail,
            subject: `${L.subject_admin_webhook} : ${adminTourNameSafe} · ${customerNameSafe} · ${dateFormatted}`,
            html: adminHtml,
        });

        console.log('[Webhook] Confirmation emails sent for reservation:', reservation.id);
    } catch (emailErr) {
        // Don't fail the webhook on email error — reservation is already confirmed
        console.error('[Webhook] Email send failed:', emailErr);
    }

    res.writeHead(200).end(JSON.stringify({ received: true, reservationId: reservation.id }));
}
