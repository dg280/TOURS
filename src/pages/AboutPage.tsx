import { useEffect } from "react";
import { CheckCircle2, Star, Users, Heart, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Translations } from "@/lib/translations";

interface AboutPageProps {
  t: Translations;
  guidePhoto: string;
  guideBio: string;
  differentPhotos?: [string, string, string];
  onBackToHome: () => void;
}

export const AboutPage = ({
  t,
  guidePhoto,
  guideBio,
  differentPhotos,
  onBackToHome,
}: AboutPageProps) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const at = t.about;
  const [dp1, dp2, dp3] = differentPhotos ?? [
    "/tour-prepirinees.jpg",
    "/tour-beach.jpg",
    "/tour-camironda.jpg",
  ];

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

              <h2 className="text-[4rem] text-premium-tight text-gray-900 leading-tight tracking-[-0.03em]">
                {at.me.title}
              </h2>

              <div className="space-y-6 text-[1rem] text-gray-600/90 leading-relaxed font-medium max-w-2xl">
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
        className="py-10 md:py-16 relative bg-gray-50/50"
      >
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <p className="text-amber-600 font-black uppercase tracking-[0.4em] text-[10px] mb-3">
                {at.philosophy.tag}
              </p>
              <h2 className="text-[2rem] font-bold text-gray-900 mb-4">
                {at.philosophy.title}
              </h2>
              <p className="text-[1rem] text-gray-500 font-serif italic leading-relaxed">
                "{at.philosophy.quote}"
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[Heart, Leaf, Users].map((Icon, i) => (
                <div
                  key={i}
                  className="glass-card group p-6 rounded-2xl transition-all duration-500 hover:shadow-lg hover:-translate-y-1 border-white/80"
                >
                  <div className="w-9 h-9 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 mb-4 group-hover:bg-amber-600 group-hover:text-white transition-all duration-500">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-black text-base mb-1 tracking-tight text-gray-900">
                    {at.philosophy.items[i].title}
                  </h3>
                  <p className="text-gray-500 text-[1rem] leading-relaxed font-medium">
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
        className="py-12 md:py-16 bg-white overflow-hidden"
      >
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="space-y-6">
              <div>
                <p className="text-amber-600 font-black uppercase tracking-[0.4em] text-[10px] mb-2">
                  {at.different.tag}
                </p>
                <h2 className="text-[2rem] font-bold text-gray-900 leading-tight">
                  {at.different.title}
                </h2>
              </div>
              <div className="space-y-3">
                {at.different.items.map((item, i: number) => (
                  <div
                    key={i}
                    className="glass-card group flex gap-4 p-5 rounded-2xl hover:bg-amber-50/50 transition-all duration-500 border-gray-100 hover:border-amber-200"
                  >
                    <div className="w-9 h-9 bg-gray-900 text-white rounded-xl flex items-center justify-center shrink-0 transition-all duration-500 group-hover:bg-amber-600">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-black text-base mb-1 tracking-tight text-gray-900">
                        {item.title}
                      </h4>
                      <p className="text-gray-500 text-[1rem] leading-relaxed font-medium">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative lg:h-[350px] flex items-center justify-center">
              <div className="relative w-full h-full grid grid-cols-2 grid-rows-2 gap-3">
                <div className="relative row-span-2 rounded-2xl overflow-hidden shadow-xl border-2 border-white animate-fade-in-up">
                  <img
                    src={dp1}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-1000"
                    alt="Nature"
                  />
                </div>
                <div className="relative rounded-2xl overflow-hidden shadow-lg border-2 border-white animate-fade-in-up delay-100">
                  <img
                    src={dp2}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-1000"
                    alt="Beach"
                  />
                </div>
                <div className="relative rounded-2xl overflow-hidden shadow-lg border-2 border-white animate-fade-in-up delay-200">
                  <img
                    src={dp3}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-1000"
                    alt="Costa Brava"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: WHY US */}
      <section id="why" className="relative py-12 md:py-16 bg-white">
        <div className="container-custom relative z-10 flex justify-center">
          <div className="w-full max-w-lg bg-gray-900 text-white rounded-3xl p-8 md:p-10 text-center shadow-2xl">
            <h2 className="text-[4rem] font-semibold text-white mb-6 leading-tight">
              {at.why.title}
            </h2>

            <div className="grid grid-cols-3 gap-4 mb-8">
              {at.why.stats.map((stat, i: number) => (
                <div key={i} className="space-y-1">
                  <p className="text-3xl md:text-4xl font-bold text-amber-500">
                    {stat.val}
                  </p>
                  <p className="text-gray-400 text-[9px] font-black uppercase tracking-[0.3em]">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            {/* Testimonial */}
            <div className="bg-white/5 border border-white/10 p-5 rounded-2xl mb-6">
              <p className="text-sm font-medium italic mb-4 leading-snug text-amber-50">
                "{at.why.quote}"
              </p>
              <div className="flex items-center justify-center gap-3">
                <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-amber-600 shadow-lg flex-shrink-0">
                  <img
                    src="/guide-antoine.jpg"
                    alt="Client"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-left">
                  <p className="font-black text-white uppercase tracking-[0.2em] text-xs">
                    Marie D.
                  </p>
                  <div className="flex text-amber-500 mt-1 gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-current" />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <Button
              onClick={onBackToHome}
              className="bg-white hover:bg-[#c9a961] text-black hover:text-white rounded-full px-8 py-3 h-auto font-black uppercase tracking-[0.2em] text-[10px] transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg"
            >
              {at.why.back}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};
