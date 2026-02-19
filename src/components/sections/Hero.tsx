import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Translations } from '@/lib/translations';

interface HeroProps {
    t: Translations;
    scrollToSection: (id: string) => void;
}

export const Hero = ({ t, scrollToSection }: HeroProps) => {
    return (
        <section className="relative hero-mobile-height flex items-center justify-center overflow-hidden">
            {/* Background Video or Image */}
            <div className="absolute inset-0 z-0">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                    poster="/tour-camironda.jpg"
                >
                    <source src="https://assets.mixkit.co/videos/preview/mixkit-tossa-de-mar-coastal-scenery-41957-large.mp4" type="video/mp4" />
                </video>
            </div>
            <div className="absolute inset-0 hero-gradient z-1" />

            <div className="relative z-10 container-custom text-center text-white pt-20">
                <div className="animate-fade-in-up">
                    <p className="text-base md:text-lg mb-2 font-light tracking-wide opacity-90">
                        {t.hero.tagline}
                    </p>
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 leading-tight">
                        {t.hero.title}
                    </h1>
                    <p className="text-xl md:text-2xl mb-8 font-medium text-amber-400">
                        {t.hero.subtitle}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                            size="lg"
                            onClick={() => scrollToSection('tours')}
                            className="bg-amber-600 hover:bg-amber-700 text-white rounded-2xl h-14 md:h-16 text-lg sm:text-xl font-bold px-10 md:px-12 shadow-2xl shadow-amber-600/30 transition-all active:scale-95 flex items-center justify-center gap-2 uppercase tracking-wide"
                        >
                            {t.hero.cta_discover}
                            <ChevronRight className="w-6 h-6" />
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            onClick={() => scrollToSection('contact')}
                            className="bg-white/10 backdrop-blur-xl border-white/30 text-white hover:bg-white/20 rounded-2xl h-14 md:h-16 text-lg sm:text-xl font-bold px-10 md:px-12 shadow-xl transition-all active:scale-95 uppercase tracking-wide"
                        >
                            {t.hero.cta_contact}
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
};
