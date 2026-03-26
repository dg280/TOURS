import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

function escapeHtml(str: string): string {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;');
}

interface ApiResponse {
    status: (code: number) => {
        json: (data: Record<string, unknown>) => void;
    };
}

interface ApiRequest {
    method: string;
    body: {
        name?: string;
        email?: string;
        tour?: string;
        date?: string;
        message?: string;
    };
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { name, email, tour, date, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ error: 'Champs requis manquants (nom, email, message)' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Format email invalide' });
    }

    const adminEmail = `
<h2 style="color:#111827;">📬 Nouveau message de contact</h2>
<table style="border-collapse:collapse;width:100%;max-width:500px;font-family:sans-serif;">
  <tr><td style="padding:8px 12px;background:#f3f4f6;font-weight:700;width:120px;">Nom</td><td style="padding:8px 12px;">${escapeHtml(name)}</td></tr>
  <tr><td style="padding:8px 12px;background:#f3f4f6;font-weight:700;">Email</td><td style="padding:8px 12px;"><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>
  ${tour ? `<tr><td style="padding:8px 12px;background:#f3f4f6;font-weight:700;">Tour</td><td style="padding:8px 12px;">${escapeHtml(tour)}</td></tr>` : ''}
  ${date ? `<tr><td style="padding:8px 12px;background:#f3f4f6;font-weight:700;">Date</td><td style="padding:8px 12px;">${escapeHtml(date)}</td></tr>` : ''}
  <tr><td style="padding:8px 12px;background:#f3f4f6;font-weight:700;vertical-align:top;">Message</td><td style="padding:8px 12px;white-space:pre-wrap;">${escapeHtml(message)}</td></tr>
</table>
<p style="margin-top:16px;font-size:12px;color:#6b7280;">Répondre directement à : <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>`;

    // RESEND_FROM_EMAIL must use a verified domain (e.g. noreply@toursandetours.com).
    // Without a verified domain, Resend can only send to the account owner's email.
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
    const fromAddress = `Tours & Détours <${fromEmail}>`;

    try {
        await resend.emails.send({
            from: fromAddress,
            to: process.env.ADMIN_EMAIL || 'info@toursandetours.com',
            replyTo: email,
            subject: `Contact : ${escapeHtml(name)}${tour ? ` — ${escapeHtml(tour)}` : ''}`,
            html: adminEmail,
        });

        return res.status(200).json({ success: true });
    } catch (err) {
        console.error('Contact email error:', err);
        return res.status(500).json({ error: 'Erreur lors de l\'envoi du message' });
    }
}
