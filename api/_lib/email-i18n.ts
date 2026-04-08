// Shared i18n helper for confirmation emails (api/confirm-booking.ts and
// api/webhooks/stripe.ts). Keep it small and self-contained — server-side
// API files cannot import from src/.

export type EmailLang = 'fr' | 'en' | 'es';

export function normalizeLang(input: unknown): EmailLang {
    const v = String(input || '').toLowerCase();
    if (v === 'en' || v === 'es') return v;
    return 'fr';
}

export function localeFor(lang: EmailLang): string {
    if (lang === 'en') return 'en-GB';
    if (lang === 'es') return 'es-ES';
    return 'fr-FR';
}

// Format an ISO date (YYYY-MM-DD) as a long localized date in Europe/Madrid.
// Parse as midday to avoid timezone shifts.
export function formatBookingDate(dateStr: string, lang: EmailLang): string {
    return new Date(dateStr + 'T12:00:00').toLocaleDateString(localeFor(lang), {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'Europe/Madrid',
    });
}

// Strings for both customer and admin confirmation emails.
const STRINGS = {
    fr: {
        // Subjects
        subject_customer: '✓ Réservation confirmée',
        subject_admin: 'RÉSA',
        subject_admin_webhook: 'RÉSA [WEBHOOK]',
        // Header
        header_brand: 'Tours & Détours Barcelona',
        header_title: 'Réservation confirmée',
        // Hero ribbon
        hero_thanks: '✓ Paiement reçu — Merci',
        // Section labels
        details: 'Détails',
        date: 'Date',
        travelers: 'Voyageurs',
        pickup_time: 'Heure pick-up',
        pickup_address: 'Adresse pick-up',
        total_paid: 'Total payé',
        included: 'Ce qui est inclus',
        // CTA / footer
        questions: 'Des questions ?',
        // Admin email rows
        admin_title: '🎉 Nouvelle réservation confirmée',
        admin_tour: 'Tour',
        admin_client: 'Client',
        admin_email: 'Email',
        admin_phone: 'Téléphone',
        admin_participants: 'Participants',
        admin_total: 'Total',
        admin_billing: 'Facturation',
        admin_comment: 'Commentaire',
        admin_none: 'Aucun',
    },
    en: {
        subject_customer: '✓ Booking confirmed',
        subject_admin: 'RESA',
        subject_admin_webhook: 'RESA [WEBHOOK]',
        header_brand: 'Tours & Détours Barcelona',
        header_title: 'Booking confirmed',
        hero_thanks: '✓ Payment received — Thank you',
        details: 'Details',
        date: 'Date',
        travelers: 'Travelers',
        pickup_time: 'Pick-up time',
        pickup_address: 'Pick-up address',
        total_paid: 'Total paid',
        included: "What's included",
        questions: 'Any questions?',
        admin_title: '🎉 New confirmed booking',
        admin_tour: 'Tour',
        admin_client: 'Customer',
        admin_email: 'Email',
        admin_phone: 'Phone',
        admin_participants: 'Travelers',
        admin_total: 'Total',
        admin_billing: 'Billing',
        admin_comment: 'Comment',
        admin_none: 'None',
    },
    es: {
        subject_customer: '✓ Reserva confirmada',
        subject_admin: 'RESERVA',
        subject_admin_webhook: 'RESERVA [WEBHOOK]',
        header_brand: 'Tours & Détours Barcelona',
        header_title: 'Reserva confirmada',
        hero_thanks: '✓ Pago recibido — Gracias',
        details: 'Detalles',
        date: 'Fecha',
        travelers: 'Viajeros',
        pickup_time: 'Hora de recogida',
        pickup_address: 'Dirección de recogida',
        total_paid: 'Total pagado',
        included: 'Qué incluye',
        questions: '¿Alguna pregunta?',
        admin_title: '🎉 Nueva reserva confirmada',
        admin_tour: 'Tour',
        admin_client: 'Cliente',
        admin_email: 'Email',
        admin_phone: 'Teléfono',
        admin_participants: 'Viajeros',
        admin_total: 'Total',
        admin_billing: 'Facturación',
        admin_comment: 'Comentario',
        admin_none: 'Ninguno',
    },
} as const;

export function emailStrings(lang: EmailLang) {
    return STRINGS[lang];
}
