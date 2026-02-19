import type { Translations } from '@/lib/translations';

interface FeaturesProps {
    t: Translations;
}

export const Features = ({ t }: FeaturesProps) => {
    return (
        <section className="section-padding bg-white">
            <div className="container-custom">
                <div className="text-center mb-16">
                    <p className="text-amber-600 font-medium mb-2">{t.features.tag}</p>
                    <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
                        {t.features.title}
                    </h2>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {t.features.items.map((item, i: number) => (
                        <div
                            key={i}
                            className="p-8 rounded-2xl bg-amber-50/50 border border-amber-100 hover:shadow-lg transition-all duration-300"
                        >
                            <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                            <p className="text-gray-600">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
