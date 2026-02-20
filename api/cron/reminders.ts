import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';
import { addDays, format } from 'date-fns';

const resend = new Resend(process.env.RESEND_API_KEY);
const supabase = createClient(
    process.env.VITE_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

interface ApiResponse {
    status: (code: number) => {
        json: (data: Record<string, unknown>) => ApiResponse;
    };
}

interface ApiRequest {
    method?: string;
    headers: Record<string, string | string[] | undefined>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    body?: any;
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
    // Vercel Cron protection (optional but recommended)
    // if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    //     return res.status(401).json({ error: 'Unauthorized' });
    // }

    try {
        const targetDate = format(addDays(new Date(), 2), 'yyyy-MM-dd');
        console.log(`Checking reminders for date: ${targetDate}`);

        // 1. Fetch reservations for targetDate where reminder hasn't been sent
        const { data: reservations, error: resError } = await supabase
            .from('reservations')
            .select('*, tour_id')
            .eq('date', targetDate)
            .eq('reminder_sent', false)
            .eq('status', 'pending'); // Assuming pending means paid but not yet completed

        if (resError) throw resError;

        if (!reservations || reservations.length === 0) {
            return res.status(200).json({ message: 'No reminders to send today' });
        }

        const stats = { sent: 0, failed: 0 };

        for (const reservation of reservations) {
            try {
                // Fetch tour details for each
                const { data: tour } = await supabase
                    .from('tours')
                    .select('*')
                    .eq('id', reservation.tour_id)
                    .single();

                const emailContent = `
                    <h1>Tout est prêt pour votre excursion !</h1>
                    <p>Bonjour ${reservation.name},</p>
                    <p>Ce petit message pour vous rappeler votre excursion <strong>${reservation.tour_name}</strong> prévue dans deux jours, le ${format(new Date(reservation.date), 'dd/MM/yyyy')}.</p>
                    
                    <p>Nous avons hâte de vous retrouver !</p>

                    <h3>Rappel du point de rencontre :</h3>
                    <p>${tour?.meeting_point || 'Point de rencontre habituel'}</p>
                    ${tour?.meeting_point_map_url ? `<p><a href="${tour.meeting_point_map_url}">Lien Google Maps</a></p>` : ''}

                    <p><strong>Derniers conseils :</strong> Vérifiez la météo, portez des chaussures adaptées et n'oubliez pas votre bouteille d'eau.</p>

                    <p>Si vous avez un empêchement de dernière minute, merci de nous prévenir au plus vite au +34 623 97 31 05.</p>

                    <p>À très bientôt,<br/>Antoine Pilard</p>
                `;

                await resend.emails.send({
                    from: 'Tours & Detours <info@toursandetours.com>',
                    to: reservation.email,
                    subject: `Rappel : Votre excursion ${reservation.tour_name} arrive bientôt !`,
                    html: emailContent,
                });

                // Mark as sent
                await supabase
                    .from('reservations')
                    .update({ reminder_sent: true })
                    .eq('id', reservation.id);

                stats.sent++;
            } catch (err: unknown) {
                console.error(`Failed to send reminder for reservation ${reservation.id}:`, err);
                stats.failed++;
            }
        }

        return res.status(200).json({
            message: `Cron job finished`,
            stats
        });
    } catch (err: unknown) {
        return res.status(500).json({ error: (err as Error).message });
    }
}
