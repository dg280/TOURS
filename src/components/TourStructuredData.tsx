import { Helmet } from 'react-helmet-async';
import type { Tour } from '@/lib/types';
import type { Language, Translations } from '@/lib/translations';

interface TourStructuredDataProps {
    tour: Tour;
    lang: Language;
    t: Translations;
}

/**
 * Injects JSON-LD structured data for a tour when the tour dialog is open.
 * This produces TouristTrip + Offer schema that Google uses for rich snippets
 * (price, duration, rating stars in search results).
 */
export function TourStructuredData({ tour, lang, t }: TourStructuredDataProps) {
    const title =
        (lang === 'en' ? tour.title_en : lang === 'es' ? tour.title_es : null) ||
        tour.title;
    const description =
        (lang === 'en' ? tour.description_en : lang === 'es' ? tour.description_es : null) ||
        tour.description;
    const highlights =
        (lang === 'en' ? tour.highlights_en : lang === 'es' ? tour.highlights_es : null) ||
        tour.highlights;

    // Compute the per-person price (same logic as TourCard)
    let perPersonPrice = tour.price;
    if (tour.pricing_tiers && Object.keys(tour.pricing_tiers).length > 0) {
        const maxKey = Math.max(...Object.keys(tour.pricing_tiers).map(Number));
        perPersonPrice = Math.round(tour.pricing_tiers[maxKey] / maxKey);
    }

    // Duration label translated
    const durationLabel =
        (t.tours.duration_labels as Record<string, string>)[tour.duration] || tour.duration;

    // Build itinerary ItemList if available
    const itinerary =
        (lang === 'en' ? tour.itinerary_en : lang === 'es' ? tour.itinerary_es : null) ||
        tour.itinerary;
    const itineraryList = itinerary?.map((step, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: step,
    }));

    const imageUrl = tour.image?.startsWith('http')
        ? tour.image
        : `https://toursandetours.com${tour.image}`;

    const schema = {
        '@context': 'https://schema.org',
        '@type': 'TouristTrip',
        name: title,
        description,
        image: imageUrl,
        touristType: 'Cultural',
        url: `https://toursandetours.com/?tour=${tour.id}`,
        provider: {
            '@type': 'TravelAgency',
            name: 'Tours & Detours Barcelona',
            url: 'https://toursandetours.com',
            telephone: '+34623973105',
        },
        offers: {
            '@type': 'Offer',
            price: perPersonPrice,
            priceCurrency: 'EUR',
            availability: 'https://schema.org/InStock',
            validFrom: new Date().toISOString().split('T')[0],
        },
        ...(itineraryList && itineraryList.length > 0 && {
            itinerary: {
                '@type': 'ItemList',
                itemListElement: itineraryList,
            },
        }),
        ...(highlights && highlights.length > 0 && {
            keywords: highlights.join(', '),
        }),
        ...(durationLabel && {
            duration: durationLabel,
        }),
    };

    return (
        <Helmet>
            <title>{`${title} | Tours & Detours Barcelona`}</title>
            <meta name="description" content={description} />
            <script type="application/ld+json">
                {JSON.stringify(schema)}
            </script>
        </Helmet>
    );
}
