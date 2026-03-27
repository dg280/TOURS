import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Tour } from "@/lib/types";
import type { Language, Translations } from "@/lib/translations";

interface TopToursCarouselProps {
  tours: Tour[];
  lang: Language;
  t: Translations;
  onTourClick: (tour: Tour) => void;
}

export const TopToursCarousel = ({
  tours,
  lang,
  t,
  onTourClick,
}: TopToursCarouselProps) => {
  // For now, we take the first 3 tours as "top"
  // In a real scenario, this could be filtered by an 'isFeatured' flag
  const topTours = tours;

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    slidesToScroll: 1,
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const scrollPrev = useCallback(
    () => emblaApi && emblaApi.scrollPrev(),
    [emblaApi],
  );
  const scrollNext = useCallback(
    () => emblaApi && emblaApi.scrollNext(),
    [emblaApi],
  );
  const scrollTo = useCallback(
    (index: number) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi],
  );

  useEffect(() => {
    if (!emblaApi) return;

    const onSelectCallback = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };

    // Initialize with a slight delay if needed or just use standard lifecycle
    // To avoid "cascading render" warning, we can put init logic in a timeout
    const timer = setTimeout(() => {
      onSelectCallback();
      setScrollSnaps(emblaApi.scrollSnapList());
    }, 0);

    emblaApi.on("select", onSelectCallback);
    emblaApi.on("reInit", onSelectCallback);

    return () => {
      clearTimeout(timer);
      emblaApi.off("select", onSelectCallback);
      emblaApi.off("reInit", onSelectCallback);
    };
  }, [emblaApi]);

  if (topTours.length === 0) return null;

  return (
    <section id="tours" className="section-padding bg-gray-50 overflow-hidden">
      <div id="top-tours" className="container-custom">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div className="max-w-3xl">
            <p className="text-amber-600 font-medium mb-2 uppercase tracking-wider text-sm">
              {t.tours.selection_tag || "Sélection du tour"}
            </p>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
              {t.tours.top_tours_title || "Nos tours incontournables"}
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              {t.tours.top_tours_desc}
            </p>
          </div>
        </div>

        <div className="relative group/carousel">
          <div className="embla overflow-hidden" ref={emblaRef}>
            <div className="embla__container flex -ml-4 md:-ml-6">
              {topTours.map((tour) => (
                <div
                  key={tour.id}
                  className="embla__slide flex-[0_0_100%] md:flex-[0_0_33.333%] pl-4 md:pl-6"
                >
                  <div
                    onClick={() => onTourClick(tour)}
                    className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full cursor-pointer"
                  >
                    <div className="relative h-64 md:h-56 overflow-hidden">
                      <img
                        src={tour.image}
                        alt={
                          lang === "en"
                            ? tour.title_en || tour.title
                            : lang === "es"
                              ? tour.title_es || tour.title
                              : tour.title
                        }
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
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {lang === "en"
                          ? tour.title_en || tour.title
                          : lang === "es"
                            ? tour.title_es || tour.title
                            : tour.title}
                      </h3>

                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4 text-amber-600" />
                          {(t.tours.duration_labels as Record<string, string>)[
                            tour.duration
                          ] || tour.duration}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-1 mb-6">
                        {(lang === "en"
                          ? tour.highlights_en || tour.highlights
                          : lang === "es"
                            ? tour.highlights_es || tour.highlights
                            : tour.highlights
                        )
                          .slice(0, 3)
                          .map((h, i) => (
                            <span
                              key={i}
                              className="text-[10px] bg-amber-50 text-amber-700 px-2 py-0.5 rounded uppercase font-bold tracking-tight"
                            >
                              {h}
                            </span>
                          ))}
                      </div>

                      <Button className="w-full mt-auto bg-[#c9a961] hover:bg-[#b8944e] text-white rounded-xl h-12 font-bold transition-all shadow-lg shadow-[#c9a961]/20">
                        {t.tours.learn_more}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={scrollPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-8 w-12 h-12 md:w-16 md:h-16 bg-white shadow-2xl rounded-full flex items-center justify-center border border-gray-100 text-gray-600 hover:text-amber-600 z-10 transition-all hover:scale-110 active:scale-95 group/btn opacity-0 group-hover/carousel:opacity-100"
          >
            <ChevronLeft className="w-6 h-6 md:w-8 md:h-8 group-hover/btn:-translate-x-0.5 transition-transform" />
          </button>
          <button
            onClick={scrollNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-8 w-12 h-12 md:w-16 md:h-16 bg-white shadow-2xl rounded-full flex items-center justify-center border border-gray-100 text-gray-600 hover:text-amber-600 z-10 transition-all hover:scale-110 active:scale-95 group/btn opacity-0 group-hover/carousel:opacity-100"
          >
            <ChevronRight className="w-6 h-6 md:w-8 md:h-8 group-hover/btn:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <div className="flex justify-center gap-2 mt-8 md:hidden">
          {scrollSnaps.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === selectedIndex ? "bg-amber-600 w-6" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
