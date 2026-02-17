import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Tour } from '@/lib/types';

interface TopToursCarouselProps {
    tours: Tour[];
    t: any;
    onTourClick: (tour: Tour) => void;
}

export const TopToursCarousel = ({ tours, t, onTourClick }: TopToursCarouselProps) => {
    // For now, we take the first 3 tours as "top"
    // In a real scenario, this could be filtered by an 'isFeatured' flag
    const topTours = tours.slice(0, 3);

    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop: true,
        align: 'start',
        slidesToScroll: 1
    });

    const [selectedIndex, setSelectedIndex] = useState(0);
    const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

    const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
    const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
    const scrollTo = useCallback((index: number) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);

    const onSelect = useCallback((emblaApi: any) => {
        setSelectedIndex(emblaApi.selectedScrollSnap());
    }, []);

    useEffect(() => {
        if (!emblaApi) return;

        onSelect(emblaApi);
        setScrollSnaps(emblaApi.scrollSnapList());
        emblaApi.on('select', onSelect);
        emblaApi.on('reInit', onSelect);
    }, [emblaApi, onSelect]);

    if (topTours.length === 0) return null;

    return (
        <section id="top-tours" className="section-padding bg-gray-50 overflow-hidden">
            <div className="container-custom">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
                    <div>
                        <p className="text-amber-600 font-medium mb-2 uppercase tracking-wider text-sm">
                            {(t as any).tours.selection_tag || 'Sélection du guide'}
                        </p>
                        <h2 className="text-3xl md:text-5xl font-bold text-gray-900">
                            {(t as any).tours.top_tours_title || 'Nos tours incontournables'}
                        </h2>
                    </div>

                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={scrollPrev}
                            className="rounded-full border-gray-200 hover:border-amber-600 hover:text-amber-600 transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={scrollNext}
                            className="rounded-full border-gray-200 hover:border-amber-600 hover:text-amber-600 transition-colors"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </Button>
                    </div>
                </div>

                <div className="relative">
                    <div className="embla overflow-hidden" ref={emblaRef}>
                        <div className="embla__container flex -ml-4 md:-ml-6">
                            {topTours.map((tour) => (
                                <div key={tour.id} className="embla__slide flex-[0_0_100%] md:flex-[0_0_33.333%] pl-4 md:pl-6">
                                    <div
                                        onClick={() => onTourClick(tour)}
                                        className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full cursor-pointer"
                                    >
                                        <div className="relative h-64 md:h-56 overflow-hidden">
                                            <img
                                                src={tour.image}
                                                alt={tour.title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                            <div className="absolute top-3 left-3">
                                                <Badge className="bg-white/90 text-gray-800">
                                                    {tour.category}
                                                </Badge>
                                            </div>
                                            <div className="absolute top-3 right-3 bg-amber-600 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                                                {tour.price}€
                                            </div>
                                        </div>

                                        <div className="p-6 flex-1 flex flex-col">
                                            <h3 className="text-xl font-bold text-gray-900 mb-2">{tour.title}</h3>

                                            <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                                                <span className="flex items-center gap-1">
                                                    <Clock className="w-4 h-4 text-amber-600" />
                                                    {tour.duration}
                                                </span>
                                            </div>

                                            <div className="flex flex-wrap gap-1 mb-6">
                                                {tour.highlights.slice(0, 3).map((h, i) => (
                                                    <span key={i} className="text-[10px] bg-amber-50 text-amber-700 px-2 py-0.5 rounded uppercase font-bold tracking-tight">
                                                        {h}
                                                    </span>
                                                ))}
                                            </div>

                                            <Button
                                                className="w-full mt-auto bg-gray-900 hover:bg-amber-600 text-white rounded-xl h-12 font-bold transition-all"
                                            >
                                                {t.tours.learn_more}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex justify-center gap-2 mt-8 md:hidden">
                    {scrollSnaps.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => scrollTo(index)}
                            className={`w-2 h-2 rounded-full transition-all ${index === selectedIndex ? 'bg-amber-600 w-6' : 'bg-gray-300'
                                }`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};
