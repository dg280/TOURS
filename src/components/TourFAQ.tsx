import { Helmet } from 'react-helmet-async';
import type { Translations } from '@/lib/translations';

interface TourFAQProps {
    t: Translations;
}

/**
 * Renders FAQ section + injects FAQPage JSON-LD structured data.
 * Google displays FAQ rich snippets directly in search results,
 * increasing visibility and click-through rate.
 */
export function TourFAQ({ t }: TourFAQProps) {
    const items = t.faq.items as { q: string; a: string }[];

    const schema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: items.map((item) => ({
            '@type': 'Question',
            name: item.q,
            acceptedAnswer: {
                '@type': 'Answer',
                text: item.a,
            },
        })),
    };

    return (
        <>
            <Helmet>
                <script type="application/ld+json">
                    {JSON.stringify(schema)}
                </script>
            </Helmet>

            <div className="space-y-3">
                <h4 className="font-sans font-bold text-gray-900 mb-4 uppercase tracking-widest text-xs">
                    {t.faq.title}
                </h4>
                <div className="space-y-2">
                    {items.map((item, i) => (
                        <details
                            key={i}
                            className="group border border-gray-100 rounded-lg overflow-hidden"
                        >
                            <summary className="flex items-center justify-between cursor-pointer p-4 bg-gray-50 hover:bg-amber-50 transition-colors font-medium text-gray-900 text-sm">
                                {item.q}
                                <span className="text-amber-500 text-lg ml-2 transition-transform group-open:rotate-45">+</span>
                            </summary>
                            <div className="p-4 text-sm text-gray-600 leading-relaxed border-t border-gray-100">
                                {item.a}
                            </div>
                        </details>
                    ))}
                </div>
            </div>
        </>
    );
}
