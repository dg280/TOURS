import { useEffect } from "react";
import { CheckCircle2, Star, Users, Heart, Quote, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Translations } from "@/lib/translations";

interface AboutPageProps {
  t: Translations;
  guidePhoto: string;
  guideBio: string;
  onBackToHome: () => void;
}

export const AboutPage = ({
  t,
  guidePhoto,
  guideBio,
  onBackToHome,
}: AboutPageProps) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const at = t.about;

  return (
    <div className="pb-16 bg-white selection:bg-amber-200">
      {/* Nav Spacing */}
      <div className="h-24 bg-white" />

      {/* HERO / ME SECTION: Expert Apple Layout */}
      <section
        id="me"
        className="relative pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-[600px] mesh-gradient-light opacity-60 -z-10" />

        <div className="container-custom relative">
          <div className="flex flex-col lg:flex-row items-start gap-12 lg:gap-20">
            {/* Text Content: Bio on the left/first on mobile */}
            <div className="flex-1 space-y-8 lg:pb-8 order-2 lg:order-1">
              <div className="inline-flex items-center gap-3 px-4 py-1.5 glass-card rounded-full border-white/50 shadow-sm">
                <span className="flex h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-700">
                  {at.me.badge}
                </span>
              </div>

              <h2 className="text-5xl md:text-8xl text-premium-tight text-gray-900 leading-[0.85] tracking-[-0.07em]">
                {at.me.title}
              </h2>

              <div className="space-y-6 text-xl md:text-2xl text-gray-600/90 leading-snug font-medium max-w-2xl">
                {(guideBio || t.guide.bio || "")
                  .split("\n\n")
                  .map((para: string, idx: number) => (
                    <p key={idx} className="relative">
                      {para}
                    </p>
                  ))}
              </div>
            </div>

            {/* Photo: Sticky on the right/top on mobile */}
            <div className="w-full max-w-[420px] lg:w-5/12 lg:sticky lg:top-32 order-1 lg:order-2">
              <div className="relative group">
                <div className="absolute -inset-4 bg-amber-100/50 rounded-[2.5rem] blur-2xl group-hover:bg-amber-200/50 transition-colors duration-700" />
                <div className="relative rounded-[2rem] overflow-hidden shadow-2xl aspect-[4/5] border-[12px] border-white bg-white">
                  <img
                    src={guidePhoto}
                    alt="Guide"
                    className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-40" />
                </div>

                {/* Floating Stats - Subtle Apple style */}
                <div className="absolute -bottom-6 -right-6 glass-card px-8 py-6 rounded-3xl hidden md:block border-white/40 ring-1 ring-black/5 animate-fade-in delay-300">
                  <p className="text-premium-tight text-5xl text-amber-600">
                    15+
                  </p>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] mt-2 text-gray-500 opacity-80">
                    {at.me.exp}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: PHILOSOPHY (Frosted Glass) */}
      <section
        id="philosophy"
        className="py-20 md:py-32 relative bg-gray-50/50"
      >
        <div className="container-custom">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-20">
              <p className="text-amber-600 font-black uppercase tracking-[0.4em] text-[10px] mb-6">
                {at.philosophy.tag}
              </p>
              <h2 className="text-4xl md:text-7xl text-premium-tight text-gray-900 mb-12">
                {at.philosophy.title}
              </h2>
              <div className="relative inline-block max-w-3xl">
                <Quote className="absolute -top-10 -left-12 w-16 h-16 text-amber-200/50" />
                <p className="text-2xl md:text-4xl text-gray-500 font-serif italic leading-tight">
                  "{at.philosophy.quote}"
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[Heart, Leaf, Users].map((Icon, i) => (
                <div
                  key={i}
                  className="glass-card group p-12 rounded-[3rem] transition-all duration-700 hover:shadow-2xl hover:-translate-y-4 border-white/80"
                >
                  <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 mb-8 group-hover:bg-amber-600 group-hover:text-white transition-all duration-700">
                    <Icon className="w-8 h-8" />
                  </div>
                  <h3 className="font-black text-2xl mb-4 tracking-tighter text-gray-900">
                    {at.philosophy.items[i].title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed font-medium">
                    {at.philosophy.items[i].desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: DIFFERENCES (Expert Collage) */}
      <section
        id="different"
        className="py-24 md:py-32 bg-white overflow-hidden"
      >
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <div className="space-y-12">
              <div>
                <p className="text-amber-600 font-black uppercase tracking-[0.4em] text-[10px] mb-4">
                  {at.different.tag}
                </p>
                <h2 className="text-4xl md:text-7xl text-premium-tight text-gray-900 leading-[0.9]">
                  {at.different.title}
                </h2>
              </div>
              <div className="space-y-4">
                {at.different.items.map((item, i: number) => (
                  <div
                    key={i}
                    className="glass-card group flex gap-6 p-8 rounded-[2rem] hover:bg-amber-50/50 transition-all duration-500 border-gray-100 hover:border-amber-200"
                  >
                    <div className="w-14 h-14 bg-gray-900 text-white rounded-2xl flex items-center justify-center shrink-0 transition-all duration-500 group-hover:bg-amber-600 group-hover:text-white">
                      <CheckCircle2 className="w-7 h-7" />
                    </div>
                    <div>
                      <h4 className="font-black text-xl mb-2 tracking-tighter text-gray-900">
                        {item.title}
                      </h4>
                      <p className="text-gray-500 text-[13px] leading-relaxed font-medium">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative lg:h-[700px] flex items-center justify-center">
              {/* Visual Collage: Pure Premium Apple Style */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-pattern-dots opacity-[0.05] -z-10" />

              <div className="relative w-full aspect-square md:aspect-auto md:h-full grid grid-cols-2 grid-rows-2 gap-4">
                <div className="relative row-span-2 rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white animate-fade-in-up">
                  <img
                    src="/tour-prepirinees.jpg"
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-1000"
                    alt="Nature"
                  />
                </div>
                <div className="relative rounded-[2rem] overflow-hidden shadow-xl border-4 border-white animate-fade-in-up delay-100">
                  <img
                    src="/tour-beach.jpg"
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-1000"
                    alt="Beach"
                  />
                </div>
                <div className="relative rounded-[2rem] overflow-hidden shadow-xl border-4 border-white animate-fade-in-up delay-200">
                  <img
                    src="/tour-camironda.jpg"
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-1000"
                    alt="Costa Brava"
                  />
                </div>
              </div>

              {/* Floating Glass Label */}
              <div className="absolute -bottom-4 right-4 glass-card px-10 py-6 rounded-full shadow-2xl z-20 border-white/50 animate-fade-in delay-500">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-900">
                  Expertise Locale
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: WHY US (High Contrast Footer) */}
      <section
        id="why"
        className="relative py-24 md:py-40 bg-gray-900 text-white overflow-hidden rounded-t-[4rem] -mt-12"
      >
        <div className="absolute inset-0 mesh-gradient opacity-20" />

        <div className="container-custom relative z-10 text-center">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-5xl md:text-9xl text-premium-tight text-white mb-20 leading-[0.8] tracking-[-0.08em]">
              {at.why.title}
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-12 lg:gap-24 mb-32">
              {at.why.stats.map((stat, i: number) => (
                <div key={i} className="space-y-3 group">
                  <p className="text-6xl md:text-9xl text-premium-tight text-amber-500 group-hover:scale-110 transition-transform duration-500">
                    {stat.val}
                  </p>
                  <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.4em]">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            {/* Testimonial: Pure Apple Glass */}
            <div className="glass-card-dark p-12 md:p-24 rounded-[4rem] transition-all duration-700 hover:bg-gray-800/80 group">
              <Quote className="absolute top-12 left-12 w-24 h-24 text-white/10 group-hover:text-amber-500/10 transition-colors" />
              <p className="text-2xl md:text-5xl font-medium italic mb-16 relative z-10 leading-[1.1] tracking-tighter text-amber-50">
                "{at.why.quote}"
              </p>
              <div className="flex flex-col items-center gap-6">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-amber-600 shadow-2xl ring-8 ring-white/5">
                  <img
                    src="/guide-antoine.jpg"
                    alt="Client"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-center">
                  <p className="font-black text-white uppercase tracking-[0.3em] text-sm">
                    Marie D.
                  </p>
                  <div className="flex text-amber-500 mt-4 justify-center gap-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-current" />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-24">
              <Button
                onClick={onBackToHome}
                className="bg-white hover:bg-[#c9a961] text-black hover:text-white rounded-full px-16 py-8 h-auto font-black uppercase tracking-[0.3em] text-[10px] transition-all duration-500 hover:scale-110 active:scale-95 shadow-2xl"
              >
                {at.why.back}
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
