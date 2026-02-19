import { Star } from 'lucide-react';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";

import type { Translations } from '@/lib/translations';
import type { Testimonial } from '@/lib/types';

interface TestimonialsProps {
    t: Translations;
    testimonials: Testimonial[];
}

export const Testimonials = ({ t, testimonials }: TestimonialsProps) => {
    return (
        <section id="avis" className="section-padding bg-gray-900 text-white overflow-hidden">
            <div className="container-custom">
                <div className="text-center mb-16">
                    <p className="text-amber-400 font-medium mb-2 uppercase tracking-widest">{t.testimonials.tag}</p>
                    <h2 className="text-3xl md:text-5xl font-bold mb-4">{t.testimonials.title}</h2>
                </div>

                <Carousel
                    opts={{
                        align: "start",
                        loop: true,
                    }}
                    className="w-full max-w-5xl mx-auto"
                >
                    <CarouselContent className="-ml-4">
                        {testimonials.map((testimonial) => (
                            <CarouselItem key={testimonial.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                                <div className="bg-white/10 backdrop-blur-sm p-8 rounded-3xl border border-white/10 h-full flex flex-col justify-between hover:bg-white/15 transition-colors">
                                    <div>
                                        <div className="flex gap-1 mb-6">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className={`w-4 h-4 ${i < testimonial.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-600'}`} />
                                            ))}
                                        </div>
                                        <p className="text-lg italic mb-8 text-gray-200">"{testimonial.text}"</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-amber-600 flex items-center justify-center font-bold text-lg">
                                            {testimonial.avatar}
                                        </div>
                                        <div>
                                            <p className="font-bold">{testimonial.name}</p>
                                            <p className="text-sm text-gray-400">{testimonial.loc}</p>
                                        </div>
                                    </div>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <div className="flex justify-center gap-4 mt-8 md:hidden">
                        <CarouselPrevious className="relative translate-y-0 left-0 bg-white/10 border-white/20 hover:bg-white/20 text-white" />
                        <CarouselNext className="relative translate-y-0 right-0 bg-white/10 border-white/20 hover:bg-white/20 text-white" />
                    </div>
                    <div className="hidden md:block">
                        <CarouselPrevious className="-left-12 bg-white/10 border-white/20 hover:bg-white/20 text-white" />
                        <CarouselNext className="-right-12 bg-white/10 border-white/20 hover:bg-white/20 text-white" />
                    </div>
                </Carousel>
            </div>
        </section>
    );
};
