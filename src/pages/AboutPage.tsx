import { useEffect } from 'react';
import { CheckCircle2, Star, Users, Heart, Quote, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface AboutPageProps {
    t: any;
    guidePhoto: string;
    guideBio: string;
    onBackToHome: () => void;
    lang: string;
}

export const AboutPage = ({ t, guidePhoto, guideBio, onBackToHome, lang }: AboutPageProps) => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const sections = [
        { id: 'me', label: lang === 'fr' ? 'À propos de moi' : lang === 'es' ? 'Sobre mí' : 'About Me' },
        { id: 'philosophy', label: lang === 'fr' ? 'Philosophie' : lang === 'es' ? 'Filosofía' : 'Philosophy' },
        { id: 'different', label: lang === 'fr' ? 'Différences' : lang === 'es' ? 'Diferencias' : 'Differences' },
        { id: 'why', label: lang === 'fr' ? 'Pourquoi nous ?' : lang === 'es' ? '¿Por qué nosotros?' : 'Why us?' }
    ];

    const scrollToSectionNode = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            const navHeight = 120; // Anchor bar height
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - navHeight;
            window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        }
    };

    return (
        <div className="pt-24 pb-20 bg-white">
            {/* Anchor Navigation Bar */}
            <div className="sticky top-[72px] z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 hidden md:block">
                <div className="container-custom py-4">
                    <div className="flex justify-center gap-8">
                        {sections.map((section) => (
                            <button
                                key={section.id}
                                onClick={() => scrollToSectionNode(section.id)}
                                className="text-sm font-bold uppercase tracking-widest text-gray-500 hover:text-amber-600 transition-colors"
                            >
                                {section.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="container-custom">
                {/* SECTION 1: ABOUT ME */}
                <section id="me" className="py-20 md:py-28 border-b border-gray-50">
                    <div className="flex flex-col md:flex-row-reverse gap-12 lg:gap-20 items-center">
                        <div className="w-full md:w-5/12 lg:w-1/3">
                            <div className="relative">
                                <div className="rounded-3xl overflow-hidden shadow-2xl aspect-[4/5] border-8 border-white">
                                    <img
                                        src={guidePhoto}
                                        alt="Guide"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="absolute -bottom-6 -right-6 bg-amber-600 text-white p-6 rounded-2xl shadow-xl hidden md:block">
                                    <p className="font-bold text-2xl">10+</p>
                                    <p className="text-xs uppercase tracking-widest opacity-80">{lang === 'fr' ? "Ans d'expérience" : "Years exp."}</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 space-y-6">
                            <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-none px-4 py-1">
                                {lang === 'fr' ? "Votre Guide Local" : "Your Local Guide"}
                            </Badge>
                            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                                {lang === 'fr' ? "Antoine, passionné par la Catalogne et ses secrets" : "Antoine, passionate about Catalonia"}
                            </h2>
                            <div className="space-y-4 text-gray-600 text-lg leading-relaxed">
                                {(guideBio || t.guide.bio || '').split('\n\n').map((para: string, idx: number) => (
                                    <p key={idx}>{para}</p>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* SECTION 2: PHILOSOPHY */}
                <section id="philosophy" className="py-20 md:py-28 border-b border-gray-50 text-center">
                    <div className="max-w-3xl mx-auto space-y-12">
                        <div>
                            <p className="text-amber-600 font-bold uppercase tracking-widest text-sm mb-4">
                                {lang === 'fr' ? "Notre Philosophie" : "Our Philosophy"}
                            </p>
                            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
                                {lang === 'fr' ? "Plus qu'un tour, une immersion authentique" : "More than a tour, an immersion"}
                            </h2>
                            <p className="text-xl text-gray-500 italic font-serif">
                                "{lang === 'fr' ? "Ma vision est de vous faire découvrir la région comme si vous étiez avec un ami local." : "My vision is to show you the region as if you were with a local friend."}"
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                { icon: Heart, title: 'Authenticité', desc: 'Découvrez la vraie culture locale.' },
                                { icon: Leaf, title: 'Respect', desc: 'Un tourisme durable et respectueux.' },
                                { icon: Users, title: 'Proximité', desc: 'Des groupes réduits pour plus d’échange.' }
                            ].map((val, i) => (
                                <div key={i} className="space-y-4">
                                    <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto text-amber-600">
                                        <val.icon className="w-8 h-8" />
                                    </div>
                                    <h3 className="font-bold text-xl">{val.title}</h3>
                                    <p className="text-gray-500 text-sm">{val.desc}</p>
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
                                {lang === 'fr' ? "Ce qui nous rend différents" : "What sets us apart"}
                            </p>
                            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-8">
                                {lang === 'fr' ? "Pourquoi ne pas choisir une agence classique ?" : "Why not a classic agency?"}
                            </h2>
                            <div className="space-y-4">
                                {[
                                    { title: "Experts du terrain", desc: "Nous habitons ici, nous connaissons chaque chemin." },
                                    { title: "Itinéraires secrets", desc: "Évitez les foules avec nos parcours exclusifs." },
                                    { title: "Flexibilité totale", desc: "On s'adapte à votre rythme et vos envies." }
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-4 p-6 rounded-2xl bg-gray-50 hover:bg-amber-50 transition-colors group">
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
                            <img src="/tour-naturereserve.jpg" className="rounded-2xl shadow-lg mt-12" alt="Nature" />
                            <img src="/tour-camironda.jpg" className="rounded-2xl shadow-lg" alt="Costa Brava" />
                        </div>
                    </div>
                </section>

                {/* SECTION 4: WHY US */}
                <section id="why" className="py-20 md:py-28 text-center">
                    <div className="max-w-4xl mx-auto space-y-12">
                        <div>
                            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
                                {lang === 'fr' ? "La confiance de nos voyageurs" : "Trusted by travelers"}
                            </h2>
                            <div className="flex justify-center gap-12 mb-12">
                                {[
                                    { val: '150+', label: 'Voyageurs' },
                                    { val: '5.0', label: 'Note moyenne' },
                                    { val: '100%', label: 'Local' }
                                ].map((stat, i) => (
                                    <div key={i}>
                                        <p className="text-4xl font-bold text-amber-600">{stat.val}</p>
                                        <p className="text-gray-500 text-sm uppercase tracking-widest">{stat.label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-amber-50 rounded-3xl p-10 relative">
                            <Quote className="absolute top-6 left-6 w-12 h-12 text-amber-200" />
                            <p className="text-xl md:text-2xl text-gray-800 font-medium italic mb-6 relative z-10">
                                "{lang === 'fr' ? "Une expérience inoubliable ! Antoine connaît la région comme sa poche et nous a emmenés dans des endroits où aucun touriste ne va." : "Unforgettable experience! Antoine knows the region like the back of his hand."}"
                            </p>
                            <div className="flex items-center justify-center gap-3">
                                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 border-2 border-white shadow-sm">
                                    <img src="/api/placeholder/48/48" alt="Client" />
                                </div>
                                <div className="text-left">
                                    <p className="font-bold text-sm">Marie D.</p>
                                    <div className="flex text-amber-400">
                                        {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-current" />)}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-10">
                            <Button
                                onClick={onBackToHome}
                                variant="outline"
                                className="rounded-full px-8 py-6 h-auto font-bold border-gray-200 hover:border-amber-600"
                            >
                                {lang === 'fr' ? "← Retour à l'accueil" : "← Home"}
                            </Button>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};
