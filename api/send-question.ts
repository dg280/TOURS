import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: any, res: any) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { name, email, tourName, message } = req.body;

    if (!email || !message) {
        return res.status(400).json({ error: 'Missing email or message' });
    }

    try {
        await resend.emails.send({
            from: 'Tours & Detours <info@toursandetours.com>',
            to: 'info@toursandetours.com',
            replyTo: email,
            subject: `Question sur le tour : ${tourName || 'N/A'}`,
            html: `
                <h2>Nouvelle question reçue</h2>
                <p><strong>Tour :</strong> ${tourName || 'N/A'}</p>
                <p><strong>Nom :</strong> ${name || 'Non renseigné'}</p>
                <p><strong>Email :</strong> ${email}</p>
                <p><strong>Message :</strong></p>
                <p>${String(message).replace(/\n/g, '<br/>')}</p>
            `,
        });

        return res.status(200).json({ success: true });
    } catch (error: any) {
        console.error('Email error:', error);
        return res.status(500).json({ error: error.message });
    }
}
