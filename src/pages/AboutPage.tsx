import { useEffect } from 'react';
import { CheckCircle2, Star, Users, Heart, Quote, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AboutPageProps {
    t: any;
    guidePhoto: string;
    guideBio: string;
    onBackToHome: () => void;
}

export const AboutPage = ({ t, guidePhoto, guideBio, onBackToHome }: AboutPageProps) => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const at = t.about;

    return (
        <div className="pb-20 bg-white">
            {/* Hero-like spacing for transition */}
            <div className="h-24 bg-white" />

            <div className="relative overflow-hidden">
                {/* Decorative background patterns for the whole page */}
                <div className="absolute top-0 right-0 w-1/3 h-full bg-pattern-dots opacity-[0.03] pointer-events-none" />
                <div className="absolute top-1/2 left-0 w-1/4 h-full bg-pattern-amber opacity-[0.02] pointer-events-none" />

                <div className="container-custom relative z-10">
                    {/* SECTION 1: ABOUT ME */}
                    <section id="me" className="py-20 md:py-32 border-b border-gray-50">
                        <div className="flex flex-col md:flex-row gap-16 lg:gap-24 items-center">
                            <div className="w-full md:w-5/12 lg:w-4/12 relative">
                                <div className="relative">
                                    {/* Decorative background element */}
                                    <div className="absolute -top-6 -left-6 w-full h-full bg-amber-50 rounded-3xl -z-10" />

                                    <div className="rounded-3xl overflow-hidden shadow-2xl aspect-[4/5] border-8 border-white bg-gray-100">
                                        <img
                                            src={guidePhoto}
                                            alt="Guide"
                                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                                        />
                                    </div>

                                    <div className="absolute -bottom-10 -right-6 bg-amber-600 text-white p-8 rounded-3xl shadow-2xl hidden md:block border-4 border-white">
                                        <p className="font-black text-4xl">15+</p>
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] mt-1 opacity-90">{at.me.exp}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex-1 space-y-8">
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 rounded-full">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                                    </span>
                                    <span className="text-[10px] font-black uppercase tracking-widest">{at.me.badge}</span>
                                </div>

                                <h2 className="text-4xl md:text-6xl font-black text-gray-900 leading-[1.1] tracking-tighter">
                                    {at.me.title}
                                </h2>

                                <div className="space-y-6 text-gray-600 text-xl leading-relaxed font-serif">
                                    {(guideBio || t.guide.bio || '').split('\n\n').map((para: string, idx: number) => (
                                        <p key={idx} className="relative">
                                            {idx === 0 && <span className="absolute -left-8 top-2 w-4 h-0.5 bg-amber-200 hidden lg:block" />}
                                            {para}
                                        </p>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                {/* SECTION 2: PHILOSOPHY */}
                <section id="philosophy" className="py-20 md:py-32 bg-premium-white relative overflow-hidden">
                    {/* Floating decoration */}
                    <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-amber-100/30 rounded-full blur-3xl pointer-events-none" />

                    <div className="container-custom relative z-10">
                        <div className="max-w-4xl mx-auto space-y-16 text-center">
                            <div>
                                <p className="text-amber-600 font-bold uppercase tracking-[0.2em] text-[10px] mb-4">
                                    {at.philosophy.tag}
                                </p>
                                <h2 className="text-3xl md:text-6xl font-black text-gray-900 mb-8 tracking-tighter leading-tight">
                                    {at.philosophy.title}
                                </h2>
                                <div className="relative inline-block">
                                    <Quote className="absolute -top-6 -left-10 w-12 h-12 text-amber-100" />
                                    <p className="text-xl md:text-3xl text-gray-600 italic font-serif leading-relaxed px-4">
                                        {at.philosophy.quote}
                                    </p>
                                    <Quote className="absolute -bottom-6 -right-10 w-12 h-12 text-amber-100 rotate-180" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {[Heart, Leaf, Users].map((Icon, i) => (
                                    <div key={i} className="group p-10 rounded-[2.5rem] bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500">
                                        <div className="w-20 h-20 bg-amber-50 rounded-3xl flex items-center justify-center mx-auto text-amber-600 mb-6 group-hover:bg-amber-600 group-hover:text-white transition-all duration-500 rotate-3 group-hover:rotate-0">
                                            <Icon className="w-10 h-10" />
                                        </div>
                                        <h3 className="font-black text-xl mb-3 tracking-tight">{at.philosophy.items[i].title}</h3>
                                        <p className="text-gray-500 text-sm leading-relaxed">{at.philosophy.items[i].desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                <div className="container-custom relative z-10">
                    {/* SECTION 3: DIFFERENCES */}
                    <section id="different" className="py-20 md:py-32">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                            <div className="space-y-10">
                                <div>
                                    <p className="text-amber-600 font-bold uppercase tracking-[0.2em] text-[10px] mb-4">
                                        {at.different.tag}
                                    </p>
                                    <h2 className="text-4xl md:text-6xl font-black text-gray-900 mb-8 tracking-tighter leading-[1.1]">
                                        {at.different.title}
                                    </h2>
                                </div>
                                <div className="space-y-4">
                                    {at.different.items.map((item: any, i: number) => (
                                        <div key={i} className="flex gap-6 p-8 rounded-3xl bg-white hover:bg-amber-50 transition-all duration-300 group border border-gray-50 hover:border-amber-100 shadow-sm hover:shadow-md">
                                            <div className="w-14 h-14 bg-amber-50 rounded-2xl shadow-sm flex items-center justify-center shrink-0 text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-all duration-300">
                                                <CheckCircle2 className="w-7 h-7" />
                                            </div>
                                            <div>
                                                <h4 className="font-black text-xl mb-2 tracking-tight">{item.title}</h4>
                                                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="relative">
                                {/* Large Image frame */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-4">
                                        <div className="relative">
                                            <div className="absolute inset-0 bg-amber-100 rounded-3xl -z-10 translate-x-2 translate-y-2 opacity-30" />
                                            <img
                                                src="/tour-prepirinees.jpg"
                                                className="rounded-3xl shadow-xl w-full aspect-[4/5] object-cover border-4 border-white"
                                                alt="Nature"
                                            />
                                        </div>
                                        <div className="relative">
                                            <div className="absolute inset-0 bg-amber-600/10 rounded-3xl -z-10 -translate-x-2 translate-y-2 opacity-30" />
                                            <img
                                                src="/tour-beach.jpg"
                                                className="rounded-3xl shadow-xl w-full aspect-square object-cover border-4 border-white"
                                                alt="Beach"
                                            />
                                        </div>
                                    </div>
                                    <div className="relative pt-12">
                                        <div className="absolute inset-0 bg-amber-50 rounded-3xl -z-10 translate-x-2 -translate-y-2 opacity-30" />
                                        <img
                                            src="/tour-camironda.jpg"
                                            className="rounded-3xl shadow-xl w-full h-full object-cover border-4 border-white"
                                            alt="Costa Brava"
                                        />
                                    </div>
                                </div>

                                {/* Floating stat */}
                                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-white px-8 py-5 rounded-3xl shadow-2xl border border-gray-100 flex items-center gap-4 z-20">
                                    <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse border-2 border-green-100" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-900 leading-none">100% Experience Locale</span>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                {/* SECTION 4: WHY US */}
                <section id="why" className="py-20 md:py-32 bg-gray-900 text-white relative overflow-hidden">
                    {/* Background pattern */}
                    <div className="absolute inset-0 bg-pattern-dots opacity-[0.05] invert" />

                    <div className="container-custom relative z-10">
                        <div className="max-w-4xl mx-auto space-y-20 text-center">
                            <div className="space-y-12">
                                <h2 className="text-4xl md:text-7xl font-black mb-12 tracking-tighter leading-none">
                                    {at.why.title}
                                </h2>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-12">
                                    {at.why.stats.map((stat: any, i: number) => (
                                        <div key={i} className="space-y-2">
                                            <p className="text-5xl md:text-7xl font-black text-amber-500 tracking-tighter">{stat.val}</p>
                                            <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.3em]">{stat.label}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="relative p-12 md:p-20 rounded-[4rem] bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/10 shadow-3xl">
                                <Quote className="absolute top-10 left-10 w-20 h-20 text-white/10" />
                                <p className="text-2xl md:text-4xl font-medium italic mb-12 relative z-10 leading-relaxed tracking-tight text-amber-50">
                                    "{at.why.quote}"
                                </p>
                                <div className="flex flex-col items-center gap-4">
                                    <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-amber-600 shadow-2xl bg-gray-800">
                                        <img src="/guide-antoine.jpg" alt="Client" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="text-center">
                                        <p className="font-black text-white uppercase tracking-[0.2em] text-sm">Marie D.</p>
                                        <div className="flex text-amber-400 mt-2 justify-center gap-1">
                                            {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <Button
                                    onClick={onBackToHome}
                                    className="bg-amber-600 hover:bg-amber-700 text-white rounded-full px-16 py-8 h-auto font-black uppercase tracking-widest text-xs shadow-2xl shadow-amber-600/30 transition-all hover:scale-105 active:scale-95"
                                >
                                    {at.why.back}
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};
