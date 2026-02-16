import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';

const resend = new Resend(process.env.RESEND_API_KEY);
const supabase = createClient(
    process.env.VITE_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export default async function handler(req: any, res: any) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { reservationId } = req.body;

    if (!reservationId) {
        return res.status(400).json({ error: 'Missing reservationId' });
    }

    try {
        // 1. Fetch reservation details
        const { data: reservation, error: resError } = await supabase
            .from('reservations')
            .select('*, tour_id')
            .eq('id', reservationId)
            .single();

        if (resError || !reservation) {
            throw new Error('Reservation not found');
        }

        // 2. Fetch tour details (for meeting point, inclusions, etc.)
        const { data: tour, error: tourError } = await supabase
            .from('tours')
            .select('*')
            .eq('id', reservation.tour_id)
            .single();

        if (tourError || !tour) {
            console.warn('Tour details not found, sending basic email');
        }

        // 3. Prepare email content
        const tourName = reservation.tour_name;
        const customerName = reservation.name;
        const date = new Date(reservation.date).toLocaleDateString('fr-FR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        const meetingPoint = tour?.meeting_point || 'Sera communiqué par le guide';
        const meetingPointUrl = tour?.meeting_point_map_url || '';

        const emailContent = `
            <h1>Confirmation de votre réservation - Tours & Detours</h1>
            <p>Bonjour ${customerName},</p>
            <p>Nous avons bien reçu votre paiement pour l'excursion : <strong>${tourName}</strong>.</p>
            
            <h3>Détails de votre réservation :</h3>
            <ul>
                <li><strong>Date :</strong> ${date}</li>
                <li><strong>Nombre de participants :</strong> ${reservation.participants}</li>
                <li><strong>Total payé :</strong> ${reservation.total_price}€</li>
            </ul>

            <h3>Informations pratiques :</h3>
            <p><strong>Point de rencontre :</strong> ${meetingPoint}</p>
            ${meetingPointUrl ? `<p><a href="${meetingPointUrl}">Voir sur Google Maps</a></p>` : ''}
            
            ${tour?.included ? `
            <p><strong>Ce qui est inclus :</strong><br/>
            ${tour.included.join(', ')}</p>
            ` : ''}

            <p><strong>Ce qu'il faut apporter :</strong><br/>
            Des chaussures confortables, une bouteille d'eau et votre sourire !</p>

            <p>Si vous avez des questions, vous pouvez me contacter directement sur WhatsApp au +34 623 97 31 05 ou par email à info@toursandetours.com.</p>

            <p>À bientôt en Catalogne !</p>
            <p>Antoine Pilard<br/>Tours & Detours Barcelona</p>
        `;

        // 4. Send email to Customer
        await resend.emails.send({
            from: 'Tours & Detours <info@toursandetours.com>',
            to: reservation.email,
            subject: `Confirmation de réservation : ${tourName}`,
            html: emailContent,
        });

        // 5. Send confirmation to Admin
        await resend.emails.send({
            from: 'System <info@toursandetours.com>',
            to: 'info@toursandetours.com',
            subject: `NOUVELLE RÉSERVATION : ${tourName} - ${customerName}`,
            html: `
                <h2>Nouvelle réservation reçue !</h2>
                <p><strong>Client :</strong> ${customerName} (${reservation.email})</p>
                <p><strong>Tour :</strong> ${tourName}</p>
                <p><strong>Date :</strong> ${date}</p>
                <p><strong>Participants :</strong> ${reservation.participants}</p>
                <p><strong>Total :</strong> ${reservation.total_price}€</p>
                <p><strong>Commentaire :</strong> ${reservation.message || 'Aucun'}</p>
                <p><strong>Téléphone :</strong> ${reservation.phone}</p>
            `,
        });

        return res.status(200).json({ success: true });
    } catch (error: any) {
        console.error('Email error:', error);
        return res.status(500).json({ error: error.message });
    }
}
