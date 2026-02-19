import { Clock, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Tour } from '@/lib/types';
import type { Language, Translations } from '@/lib/translations';

interface TourCardProps {
    tour: Tour;
    index: number;
    lang: Language;
    t: Translations;
    onClick: () => void;
}

export const TourCard = ({ tour, index, lang, t, onClick }: TourCardProps) => {
    return (
        <div
            onClick={onClick}
            className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col cursor-pointer"
            style={{ animationDelay: `${index * 0.1}s` }}
        >
            <div className="relative h-64 overflow-hidden">
                <img
                    src={tour.image}
                    alt={lang === 'en' ? (tour.title_en || tour.title) : lang === 'es' ? (tour.title_es || tour.title) : tour.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 flex flex-wrap gap-1 max-w-[70%]">
                    {Array.isArray(tour.category) ? tour.category.map(catId => (
                        <Badge key={catId} className="bg-white/90 text-gray-800 text-[10px] font-bold uppercase transition-all hover:bg-amber-600 hover:text-white">
                            {(t.tours.categories as Record<string, string>)?.[catId] || catId}
                        </Badge>
                    )) : (
                        <Badge className="bg-white/90 text-gray-800 text-[10px] font-bold uppercase">
                            {(t.tours.categories as Record<string, string>)?.[tour.category] || tour.category}
                        </Badge>
                    )}
                </div>
                <div className="absolute top-3 right-3 bg-amber-600 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                    {t.tours.from_price} {
                        tour.pricing_tiers && Object.keys(tour.pricing_tiers).length > 0
                            ? Math.min(...Object.values(tour.pricing_tiers))
                            : tour.price
                    }€
                </div>
            </div>
            <div className="p-5 flex-1 flex flex-col">
                <p className="text-xs text-amber-600 font-medium uppercase tracking-wide mb-1">
                    {lang === 'en' ? (tour.subtitle_en || tour.subtitle) : lang === 'es' ? (tour.subtitle_es || tour.subtitle) : tour.subtitle}
                </p>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {lang === 'en' ? (tour.title_en || tour.title) : lang === 'es' ? (tour.title_es || tour.title) : tour.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {lang === 'en' ? (tour.description_en || tour.description) : lang === 'es' ? (tour.description_es || tour.description) : tour.description}
                </p>

                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {(t.tours.duration_labels as Record<string, string>)[tour.duration] || tour.duration}
                    </span>
                    <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {tour.groupSize}
                    </span>
                </div>

                <div className="mb-4">
                    <p className="text-xs text-gray-500 mb-2">{t.tours.learn_more} :</p>
                    <div className="flex flex-wrap gap-1">
                        {(lang === 'en' ? (tour.highlights_en || tour.highlights) : lang === 'es' ? (tour.highlights_es || tour.highlights) : tour.highlights).map((highlight, i) => (
                            <span
                                key={i}
                                className="text-xs bg-amber-50 text-amber-700 px-2 py-1 rounded"
                            >
                                {highlight}
                            </span>
                        ))}
                    </div>
                </div>

                <Button
                    className="w-full mt-auto bg-gray-900 hover:bg-amber-600 text-white rounded-2xl h-14 font-bold transition-all active:scale-95 shadow-lg group-hover:shadow-amber-600/20"
                >
                    {t.tours.learn_more}
                </Button>
            </div>
        </div>
    );
};
