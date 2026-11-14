import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Translations } from "@/lib/translations";

interface HeroProps {
  t: Translations;
  scrollToSection: (id: string) => void;
}

export const Hero = ({ t, scrollToSection }: HeroProps) => {
  return (
    <section className="relative hero-mobile-height flex items-center justify-center overflow-hidden">
      {/* Background still (compressed). If video returns: self-hosted footage
          from a real tour, muted, < 2 MB, no autoplay on mobile data. */}
      <div className="absolute inset-0 z-0">
        <img
          src="/hero-camironda.jpg"
          alt=""
          fetchPriority="high"
          decoding="async"
          className="w-full h-full object-cover object-[center_65%]"
        />
      </div>
      <div className="absolute inset-0 hero-gradient z-1" />

      <div className="relative z-10 container-custom text-center text-white">
        <div>
          <p className="text-base md:text-lg mb-2 font-light tracking-wide opacity-90 animate-fade-in-up">
            {t.hero.tagline}
          </p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-normal mb-4 leading-tight animate-fade-in-up delay-200">
            {t.hero.title}
          </h1>
          <p className="text-xl md:text-2xl mb-8 font-medium text-[#c9a961] animate-fade-in-up delay-300">
            {t.hero.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up delay-400">
            <Button
              size="lg"
              onClick={() => scrollToSection("tours")}
              className="btn-hover bg-gold hover:bg-gold-hover text-ink rounded-2xl h-14 md:h-16 text-lg sm:text-xl font-bold px-10 md:px-12 shadow-2xl shadow-[#c9a961]/30 transition-all active:scale-95 flex items-center justify-center gap-2 uppercase tracking-wide"
            >
              {t.hero.cta_discover}
              <ChevronRight className="w-6 h-6" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => scrollToSection("contact")}
              className="btn-hover bg-white/10 backdrop-blur-xl border-white/30 text-white hover:bg-white/20 rounded-2xl h-14 md:h-16 text-lg sm:text-xl font-bold px-10 md:px-12 shadow-xl transition-all active:scale-95 uppercase tracking-wide"
            >
              {t.hero.cta_contact}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
