import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/lib/supabase';
import type { Language, Translations } from '@/lib/translations';

interface FaqItem {
    q: string;
    a: string;
}

interface DbFaqItem {
    q_fr: string;
    q_en: string;
    q_es: string;
    a_fr: string;
    a_en: string;
    a_es: string;
}

interface TourFAQProps {
    t: Translations;
    lang: Language;
}

/**
 * Renders FAQ section + injects FAQPage JSON-LD structured data.
 *
 * Data source (priority order):
 * 1. Supabase site_config key='faq' (admin-editable, multilingual)
 * 2. Fallback: translations.ts t.faq (hardcoded defaults)
 *
 * Google displays FAQ rich snippets directly in search results,
 * increasing visibility and click-through rate.
 */
async function fetchFaqFromDb(lang: Language): Promise<FaqItem[] | null> {
    if (!supabase) return null;
    const { data } = await supabase
        .from('site_config')
        .select('value')
        .eq('key', 'faq')
        .maybeSingle();
    if (!data?.value) return null;
    const raw = data.value as { items?: DbFaqItem[] };
    if (!Array.isArray(raw.items) || raw.items.length === 0) return null;
    const localized = raw.items
        .map((item) => ({
            q: (lang === 'en' ? item.q_en : lang === 'es' ? item.q_es : item.q_fr) || item.q_en || item.q_fr,
            a: (lang === 'en' ? item.a_en : lang === 'es' ? item.a_es : item.a_fr) || item.a_en || item.a_fr,
        }))
        .filter((item) => item.q && item.a);
    return localized.length > 0 ? localized : null;
}

export function TourFAQ({ t, lang }: TourFAQProps) {
    const [dbItems, setDbItems] = useState<FaqItem[] | null>(null);

    useEffect(() => {
        let cancelled = false;
        fetchFaqFromDb(lang).then((result) => {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            if (!cancelled && result) setDbItems(result);
        });
        return () => { cancelled = true; };
    }, [lang]);

    const items: FaqItem[] = dbItems || (t.faq.items as FaqItem[]);

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
