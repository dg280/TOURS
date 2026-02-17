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
        <div className="pt-24 pb-20 bg-white">
            <div className="container-custom">
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

                {/* SECTION 2: PHILOSOPHY */}
                <section id="philosophy" className="py-20 md:py-28 border-b border-gray-50 text-center">
                    <div className="max-w-4xl mx-auto space-y-12">
                        <div>
                            <p className="text-amber-600 font-bold uppercase tracking-widest text-sm mb-4">
                                {at.philosophy.tag}
                            </p>
                            <h2 className="text-3xl md:text-6xl font-black text-gray-900 mb-6 tracking-tighter">
                                {at.philosophy.title}
                            </h2>
                            <p className="text-xl md:text-2xl text-gray-500 italic font-serif leading-relaxed px-10">
                                "{at.philosophy.quote}"
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[Heart, Leaf, Users].map((Icon, i) => (
                                <div key={i} className="space-y-4 p-8 rounded-3xl bg-gray-50/50 border border-gray-50">
                                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto text-amber-600 shadow-sm">
                                        <Icon className="w-8 h-8" />
                                    </div>
                                    <h3 className="font-bold text-xl">{at.philosophy.items[i].title}</h3>
                                    <p className="text-gray-500 text-sm">{at.philosophy.items[i].desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* SECTION 3: DIFFERENCES */}
                <section id="different" className="py-20 md:py-28 border-b border-gray-50">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <p className="text-amber-600 font-bold uppercase tracking-widest text-sm mb-4">
                                {at.different.tag}
                            </p>
                            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-8 tracking-tight">
                                {at.different.title}
                            </h2>
                            <div className="space-y-4">
                                {at.different.items.map((item: any, i: number) => (
                                    <div key={i} className="flex gap-4 p-6 rounded-2xl bg-gray-50 hover:bg-amber-50 transition-colors group border border-transparent hover:border-amber-100">
                                        <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center shrink-0 text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                                            <CheckCircle2 className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-lg mb-1">{item.title}</h4>
                                            <p className="text-gray-500 text-sm">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <img src="/tour-naturereserve.jpg" className="rounded-2xl shadow-lg mt-12 w-full aspect-square object-cover" alt="Nature" />
                            <img src="/tour-camironda.jpg" className="rounded-2xl shadow-lg w-full aspect-square object-cover" alt="Costa Brava" />
                        </div>
                    </div>
                </section>

                {/* SECTION 4: WHY US */}
                <section id="why" className="py-20 md:py-28 text-center">
                    <div className="max-w-4xl mx-auto space-y-12">
                        <div>
                            <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight">
                                {at.why.title}
                            </h2>
                            <div className="flex justify-center gap-12 mb-12">
                                {at.why.stats.map((stat: any, i: number) => (
                                    <div key={i}>
                                        <p className="text-4xl md:text-5xl font-black text-amber-600">{stat.val}</p>
                                        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-2">{stat.label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-amber-50 rounded-[3rem] p-10 md:p-16 relative">
                            <Quote className="absolute top-8 left-8 w-16 h-16 text-amber-100" />
                            <p className="text-xl md:text-3xl text-gray-800 font-medium italic mb-10 relative z-10 leading-relaxed">
                                "{at.why.quote}"
                            </p>
                            <div className="flex items-center justify-center gap-4">
                                <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-200 border-4 border-white shadow-md">
                                    <img src="/api/placeholder/48/48" alt="Client" />
                                </div>
                                <div className="text-left">
                                    <p className="font-black text-gray-900 uppercase tracking-wider text-xs">Marie D.</p>
                                    <div className="flex text-amber-400 mt-1">
                                        {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-current" />)}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-10">
                            <Button
                                onClick={onBackToHome}
                                variant="outline"
                                className="rounded-full px-10 py-7 h-auto font-black uppercase tracking-widest text-xs border-gray-200 hover:border-amber-600 hover:text-amber-600 transition-all active:scale-95 shadow-sm"
                            >
                                {at.why.back}
                            </Button>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};
