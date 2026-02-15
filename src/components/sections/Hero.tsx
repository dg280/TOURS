import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeroProps {
    t: any;
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

            <div className="relative z-10 container-custom text-center text-white">
                <div className="animate-fade-in-up">
                    <p className="text-lg md:text-xl mb-4 font-light tracking-wide">
                        {t.hero.tagline}
                    </p>
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 leading-tight">
                        {t.hero.title}
                    </h1>
                    <p className="text-xl md:text-2xl mb-8 font-medium text-amber-400">
                        {t.hero.subtitle}
                    </p>
                    <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8 text-white/90">
                        {t.hero.description}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                            size="lg"
                            onClick={() => scrollToSection('tours')}
                            className="bg-amber-600 hover:bg-amber-700 text-white rounded-xl h-16 text-lg font-bold px-10 shadow-xl shadow-amber-600/20 transition-all active:scale-95 flex items-center justify-center gap-2"
                        >
                            {t.hero.cta_discover}
                            <ChevronRight className="w-5 h-5" />
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            onClick={() => scrollToSection('contact')}
                            className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20 rounded-xl h-16 text-lg font-bold px-10 transition-all active:scale-95"
                        >
                            {t.hero.cta_contact}
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
};
