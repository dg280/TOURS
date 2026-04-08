import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';

function escapeHtml(str: unknown): string {
    if (str === null || str === undefined) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;');
}

const resend = new Resend(process.env.RESEND_API_KEY);
const supabase = createClient(
    process.env.VITE_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

interface ApiResponse {
    status: (code: number) => {
        json: (data: Record<string, unknown>) => void;
    };
}

interface ApiRequest {
    method: string;
    body: {
        // Either is accepted. paymentIntentId is preferred since the anon
        // role on the client cannot SELECT reservations to retrieve the row id
        // after insert (RLS), so the client only knows the PI id.
        paymentIntentId?: string;
        reservationId?: string;
    };
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { paymentIntentId, reservationId } = req.body;

    if (!paymentIntentId && !reservationId) {
        return res.status(400).json({ error: 'Missing paymentIntentId or reservationId' });
    }

    try {
        // 1. Atomic claim: only the first caller (client OR webhook) wins.
        // The race used to send duplicate emails when both ran in parallel
        // (audit H5). Now we mark confirmed in a single conditional UPDATE.
        // Look up by payment_intent_id (preferred) or by reservation id.
        const baseQuery = supabase
            .from('reservations')
            .update({ status: 'confirmed' });
        const filteredQuery = paymentIntentId
            ? baseQuery.eq('payment_intent_id', paymentIntentId)
            : baseQuery.eq('id', reservationId!);

        const { data: reservation, error: resError } = await filteredQuery
            .neq('status', 'confirmed')
            .select('*')
            .maybeSingle();

        if (resError) {
            console.error('Reservation update error:', resError);
            return res.status(500).json({ error: 'Internal error' });
        }

        // Either reservation doesn't exist, or it was already confirmed (webhook
        // got there first). Either way, do not send emails again.
        if (!reservation) {
            return res.status(200).json({ success: true, skipped: 'already_confirmed_or_not_found' });
        }

        // Refuse to send emails if there is no associated payment_intent_id —
        // prevents abuse where attackers POST arbitrary reservation IDs to
        // trigger email floods (audit H4).
        if (!reservation.payment_intent_id) {
            console.warn('Refusing to send email for reservation without payment_intent_id:', reservation.id);
            return res.status(400).json({ error: 'Reservation has no associated payment' });
        }

        // 2. Fetch tour details
        const { data: tour } = await supabase
            .from('tours')
            .select('title, included, itinerary, duration, good_to_know')
            .eq('id', reservation.tour_id)
            .single();

        // 3. Format date — parse as midday local to avoid TZ shifts (audit H2)
        // and force Europe/Madrid timezone so all customers see Barcelona local date.
        const dateFormatted = new Date(reservation.date + 'T12:00:00').toLocaleDateString('fr-FR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            timeZone: 'Europe/Madrid',
        });

        // 4. Build included list — escape each item (audit H1)
        const includedList = (tour?.included as string[] | null)
            ?.map((item: string) => `<li style="margin:4px 0;color:#374151;">${escapeHtml(item)}</li>`)
            .join('') || '';

        // 5. Build billing address block — escape each component (audit H1)
        const hasBilling = reservation.billing_address || reservation.billing_city;
        const billingBlock = hasBilling
            ? `${escapeHtml(reservation.billing_address || '')}${reservation.billing_city ? ', ' + escapeHtml(reservation.billing_city) : ''}${reservation.billing_zip ? ' ' + escapeHtml(reservation.billing_zip) : ''}${reservation.billing_country ? ', ' + escapeHtml(reservation.billing_country) : ''}`
            : null;

        // 6. Customer email — full summary
        const customerEmail = `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;padding:32px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);max-width:600px;width:100%;">

        <!-- Header -->
        <tr>
          <td style="background:#111827;padding:40px 40px 32px;text-align:center;">
            <p style="margin:0 0 4px;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#c9a961;font-weight:700;">Tours & Détours Barcelona</p>
            <h1 style="margin:0;font-size:26px;color:#ffffff;font-weight:300;letter-spacing:-0.5px;">Réservation confirmée</h1>
          </td>
        </tr>

        <!-- Green success bar -->
        <tr>
          <td style="background:#d1fae5;padding:14px 40px;text-align:center;">
            <p style="margin:0;color:#065f46;font-weight:700;font-size:14px;">✓ Paiement reçu — Merci ${escapeHtml(reservation.name)} !</p>
          </td>
        </tr>

        <!-- Tour name -->
        <tr>
          <td style="padding:32px 40px 0;">
            <h2 style="margin:0;font-size:22px;color:#111827;font-weight:700;">${escapeHtml(reservation.tour_name)}</h2>
          </td>
        </tr>

        <!-- Main booking details -->
        <tr>
          <td style="padding:24px 40px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
              <tr style="background:#f9fafb;">
                <td colspan="2" style="padding:12px 16px;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#6b7280;">Détails de votre réservation</td>
              </tr>
              <tr style="border-top:1px solid #e5e7eb;">
                <td style="padding:12px 16px;color:#6b7280;font-size:14px;width:40%;">Date</td>
                <td style="padding:12px 16px;color:#111827;font-weight:700;font-size:14px;">${escapeHtml(dateFormatted)}</td>
              </tr>
              <tr style="border-top:1px solid #e5e7eb;background:#fffbeb;">
                <td style="padding:12px 16px;color:#6b7280;font-size:14px;">Heure de pick-up</td>
                <td style="padding:12px 16px;color:#92400e;font-weight:700;font-size:14px;">${escapeHtml(reservation.pickup_time) || 'À confirmer'}</td>
              </tr>
              <tr style="border-top:1px solid #e5e7eb;">
                <td style="padding:12px 16px;color:#6b7280;font-size:14px;">Voyageurs</td>
                <td style="padding:12px 16px;color:#111827;font-weight:700;font-size:14px;">${reservation.participants}</td>
              </tr>
              ${tour?.duration ? `
              <tr style="border-top:1px solid #e5e7eb;">
                <td style="padding:12px 16px;color:#6b7280;font-size:14px;">Durée estimée</td>
                <td style="padding:12px 16px;color:#111827;font-weight:700;font-size:14px;">${tour.duration}</td>
              </tr>` : ''}
              <tr style="border-top:1px solid #e5e7eb;background:#fffbeb;">
                <td style="padding:12px 16px;color:#6b7280;font-size:14px;">Adresse de pick-up</td>
                <td style="padding:12px 16px;color:#92400e;font-weight:700;font-size:14px;">${escapeHtml(reservation.pickup_address) || 'À confirmer avec le guide'}</td>
              </tr>
              <tr style="border-top:2px solid #e5e7eb;background:#f9fafb;">
                <td style="padding:14px 16px;color:#6b7280;font-size:14px;font-weight:700;">Total payé</td>
                <td style="padding:14px 16px;color:#c9a961;font-weight:700;font-size:18px;">${reservation.total_price}€</td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Client info -->
        <tr>
          <td style="padding:0 40px 24px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
              <tr style="background:#f9fafb;">
                <td colspan="2" style="padding:12px 16px;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#6b7280;">Vos informations</td>
              </tr>
              <tr style="border-top:1px solid #e5e7eb;">
                <td style="padding:12px 16px;color:#6b7280;font-size:14px;width:40%;">Nom</td>
                <td style="padding:12px 16px;color:#111827;font-weight:600;font-size:14px;">${escapeHtml(reservation.name)}</td>
              </tr>
              <tr style="border-top:1px solid #e5e7eb;">
                <td style="padding:12px 16px;color:#6b7280;font-size:14px;">Email</td>
                <td style="padding:12px 16px;color:#111827;font-size:14px;">${escapeHtml(reservation.email)}</td>
              </tr>
              ${reservation.phone ? `
              <tr style="border-top:1px solid #e5e7eb;">
                <td style="padding:12px 16px;color:#6b7280;font-size:14px;">Téléphone</td>
                <td style="padding:12px 16px;color:#111827;font-size:14px;">${escapeHtml(reservation.phone)}</td>
              </tr>` : ''}
              ${billingBlock ? `
              <tr style="border-top:1px solid #e5e7eb;">
                <td style="padding:12px 16px;color:#6b7280;font-size:14px;">Adresse de facturation</td>
                <td style="padding:12px 16px;color:#111827;font-size:14px;">${billingBlock}</td>
              </tr>` : ''}
            </table>
          </td>
        </tr>

        ${includedList ? `
        <!-- Inclusions -->
        <tr>
          <td style="padding:0 40px 24px;">
            <div style="background:#ecfdf5;border:1px solid #a7f3d0;border-radius:12px;padding:20px 24px;">
              <p style="margin:0 0 12px;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#065f46;">Ce qui est inclus</p>
              <ul style="margin:0;padding:0 0 0 16px;">${includedList}</ul>
            </div>
          </td>
        </tr>` : ''}

        ${reservation.message ? `
        <!-- Comment -->
        <tr>
          <td style="padding:0 40px 24px;">
            <div style="background:#f3f4f6;border-radius:12px;padding:16px 20px;">
              <p style="margin:0 0 6px;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#6b7280;">Votre commentaire</p>
              <p style="margin:0;color:#374151;font-size:14px;font-style:italic;">"${escapeHtml(reservation.message)}"</p>
            </div>
          </td>
        </tr>` : ''}

        <!-- Contact -->
        <tr>
          <td style="padding:0 40px 40px;">
            <div style="background:#f9fafb;border-radius:12px;padding:20px 24px;text-align:center;">
              <p style="margin:0 0 8px;color:#374151;font-size:14px;">Des questions ? Contactez-nous directement :</p>
              <p style="margin:0 0 4px;"><a href="https://wa.me/34623973105" style="color:#c9a961;font-weight:700;text-decoration:none;">📱 WhatsApp : +34 623 97 31 05</a></p>
              <p style="margin:0;"><a href="mailto:info@toursandetours.com" style="color:#c9a961;font-weight:700;text-decoration:none;">✉️ info@toursandetours.com</a></p>
            </div>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#111827;padding:24px 40px;text-align:center;">
            <p style="margin:0;color:#9ca3af;font-size:12px;">Tours & Détours Barcelona · Antoine Pilard</p>
            <p style="margin:4px 0 0;color:#6b7280;font-size:11px;">À bientôt en Catalogne !</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

        // 7. Admin notification email
        const adminEmail = `
<h2 style="color:#111827;">🎉 Nouvelle réservation confirmée</h2>
<table style="border-collapse:collapse;width:100%;max-width:500px;">
  <tr><td style="padding:8px;background:#f3f4f6;font-weight:700;">Tour</td><td style="padding:8px;">${escapeHtml(reservation.tour_name)}</td></tr>
  <tr><td style="padding:8px;background:#f3f4f6;font-weight:700;">Client</td><td style="padding:8px;">${escapeHtml(reservation.name)}</td></tr>
  <tr><td style="padding:8px;background:#f3f4f6;font-weight:700;">Email</td><td style="padding:8px;">${escapeHtml(reservation.email)}</td></tr>
  <tr><td style="padding:8px;background:#f3f4f6;font-weight:700;">Téléphone</td><td style="padding:8px;">${escapeHtml(reservation.phone) || '—'}</td></tr>
  <tr><td style="padding:8px;background:#f3f4f6;font-weight:700;">Date</td><td style="padding:8px;">${escapeHtml(dateFormatted)}</td></tr>
  <tr><td style="padding:8px;background:#f3f4f6;font-weight:700;">Heure pick-up</td><td style="padding:8px;">${escapeHtml(reservation.pickup_time) || '—'}</td></tr>
  <tr><td style="padding:8px;background:#f3f4f6;font-weight:700;">Adresse pick-up</td><td style="padding:8px;">${escapeHtml(reservation.pickup_address) || '—'}</td></tr>
  <tr><td style="padding:8px;background:#f3f4f6;font-weight:700;">Participants</td><td style="padding:8px;">${escapeHtml(reservation.participants)}</td></tr>
  <tr><td style="padding:8px;background:#f3f4f6;font-weight:700;">Total</td><td style="padding:8px;font-weight:700;color:#c9a961;">${escapeHtml(reservation.total_price)}€</td></tr>
  ${billingBlock ? `<tr><td style="padding:8px;background:#f3f4f6;font-weight:700;">Facturation</td><td style="padding:8px;">${billingBlock}</td></tr>` : ''}
  <tr><td style="padding:8px;background:#f3f4f6;font-weight:700;">Commentaire</td><td style="padding:8px;font-style:italic;">${escapeHtml(reservation.message) || 'Aucun'}</td></tr>
</table>`;

        // 8. Send both emails — use verified domain via env var (audit C1)
        const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
        const fromAddress = `Tours & Détours <${fromEmail}>`;
        const adminTo = process.env.ADMIN_EMAIL || 'info@toursandetours.com';

        // Sanitize subject lines to strip CR/LF (audit H2)
        const sanitizeHeader = (s: unknown) => String(s ?? '').replace(/[\r\n]/g, ' ').slice(0, 150);
        const tourNameSafe = sanitizeHeader(reservation.tour_name);
        const customerNameSafe = sanitizeHeader(reservation.name);

        await resend.emails.send({
            from: fromAddress,
            to: reservation.email,
            subject: `✓ Réservation confirmée : ${tourNameSafe} — ${dateFormatted}`,
            html: customerEmail,
        });

        await resend.emails.send({
            from: fromAddress,
            to: adminTo,
            subject: `RÉSA : ${tourNameSafe} · ${customerNameSafe} · ${dateFormatted}`,
            html: adminEmail,
        });

        return res.status(200).json({ success: true });
    } catch (err: unknown) {
        // Don't leak internal details to client (audit M1)
        console.error('Confirm error:', err);
        return res.status(500).json({ error: 'Internal error' });
    }
}
