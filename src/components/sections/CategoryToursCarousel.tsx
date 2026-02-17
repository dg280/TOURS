import { useState, useMemo, useCallback, useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight, Leaf, Footprints, PersonStanding } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Tour } from '@/lib/types';

interface CategoryToursCarouselProps {
    tours: Tour[];
    t: any;
    onTourClick: (tour: Tour) => void;
}

const CATEGORIES = [
    { id: 'Nature', icon: Leaf, label_key: 'nature' },
    { id: 'Rando', icon: Footprints, label_key: 'rando' },
    { id: 'Walking Tour', icon: PersonStanding, label_key: 'walking' }
];

export const CategoryToursCarousel = ({ tours, t, onTourClick }: CategoryToursCarouselProps) => {
    const [activeCategory, setActiveCategory] = useState('Nature');

    const filteredTours = useMemo(() => {
        return tours.filter(tour => {
            const cat = tour.category || '';
            return cat.toLowerCase().includes(activeCategory.toLowerCase());
        });
    }, [tours, activeCategory]);

    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop: false,
        align: 'start',
        slidesToScroll: 1
    });

    const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
    const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

    useEffect(() => {
        if (emblaApi) emblaApi.reInit();
    }, [filteredTours, emblaApi]);

    return (
        <section id="category-tours" className="section-padding bg-white overflow-hidden">
            <div className="container-custom">
                <div className="text-center mb-10">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                        {(t as any).tours.category_title || 'Trouvez votre prochaine aventure'}
                    </h2>

                    <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-8">
                        {CATEGORIES.map((cat) => {
                            const Icon = cat.icon;
                            return (
                                <button
                                    key={cat.id}
                                    onClick={() => setActiveCategory(cat.id)}
                                    className={cn(
                                        "flex items-center gap-2 px-6 py-3 rounded-full border-2 transition-all font-bold",
                                        activeCategory === cat.id
                                            ? "bg-amber-600 border-amber-600 text-white shadow-lg scale-105"
                                            : "bg-white border-gray-100 text-gray-500 hover:border-amber-200 hover:text-amber-600"
                                    )}
                                >
                                    <Icon className="w-5 h-5" />
                                    {cat.label_key === 'nature' ? 'Nature' : cat.label_key === 'rando' ? 'Rando' : 'Walking Tour'}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="relative">
                    <div className="embla overflow-hidden" ref={emblaRef}>
                        <div className="embla__container flex -ml-4 md:-ml-6">
                            {filteredTours.length > 0 ? (
                                filteredTours.map((tour) => (
                                    <div key={tour.id} className="embla__slide flex-[0_0_85%] md:flex-[0_0_33.333%] pl-4 md:pl-6">
                                        <div
                                            onClick={() => onTourClick(tour)}
                                            className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full cursor-pointer"
                                        >
                                            <div className="relative h-48 overflow-hidden">
                                                <img
                                                    src={tour.image}
                                                    alt={tour.title}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                                <div className="absolute top-3 right-3 bg-white/90 text-gray-800 px-2 py-1 rounded-lg text-xs font-bold shadow-sm">
                                                    {tour.price}€
                                                </div>
                                            </div>
                                            <div className="p-5 flex-1 flex flex-col">
                                                <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1">{tour.title}</h3>
                                                <p className="text-sm text-gray-500 mb-4">{tour.duration}</p>

                                                <Button
                                                    variant="outline"
                                                    className="w-full mt-auto border-gray-200 hover:border-amber-600 hover:text-amber-600 rounded-xl transition-all"
                                                >
                                                    {t.tours.learn_more}
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="w-full text-center py-20 text-gray-400 italic">
                                    Aucun tour trouvé dans cette catégorie.
                                </div>
                            )}
                        </div>
                    </div>

                    {filteredTours.length > 3 && (
                        <>
                            <button
                                onClick={scrollPrev}
                                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-10 h-10 bg-white shadow-xl rounded-full flex items-center justify-center border border-gray-100 text-gray-600 hover:text-amber-600 z-10 hidden md:flex"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                            <button
                                onClick={scrollNext}
                                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-10 h-10 bg-white shadow-xl rounded-full flex items-center justify-center border border-gray-100 text-gray-600 hover:text-amber-600 z-10 hidden md:flex"
                            >
                                <ChevronRight className="w-6 h-6" />
                            </button>
                        </>
                    )}
                </div>
            </div>
        </section>
    );
};
