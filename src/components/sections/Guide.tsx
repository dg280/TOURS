import { Button } from '@/components/ui/button';
import { Instagram, Mail, Phone, CheckCircle2 } from 'lucide-react';

interface GuideProps {
    t: any;
    guidePhoto: string;
    instagramUrl: string;
    guideBio1?: string;
    guideBio2?: string;
    scrollToSection: (id: string) => void;
}

export const Guide = ({ t, guidePhoto, instagramUrl, guideBio1, guideBio2, scrollToSection }: GuideProps) => {
    return (
        <section id="guide" className="section-padding bg-gray-50 overflow-hidden">
            <div className="container-custom">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <div className="relative">
                        <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl aspect-[4/5] sm:aspect-square lg:aspect-[4/5]">
                            <img
                                src={guidePhoto}
                                alt="Antoine Pilard"
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                            />
                        </div>
                        {/* Decorative elements */}
                        <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-amber-100 rounded-full z-0" />
                        <div className="absolute -top-6 -left-6 w-24 h-24 border-2 border-amber-200 rounded-full z-0" />
                        <div className="absolute top-1/2 -right-12 w-24 h-48 bg-amber-600/5 rounded-full blur-3xl z-0" />
                    </div>

                    <div className="space-y-8">
                        <div>
                            <p className="text-amber-600 font-medium mb-2">{t.guide.section_tag}</p>
                            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
                                {t.guide.title}
                            </h2>
                            <div className="space-y-4 text-gray-600 text-lg leading-relaxed">
                                <p>{guideBio1 || t.guide.desc1}</p>
                                <p>{guideBio2 || t.guide.desc2}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {t.guide.features.map((feature: string, i: number) => (
                                <div key={i} className="flex items-center gap-2">
                                    <CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0" />
                                    <span className="text-gray-700 font-medium">{feature}</span>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <Button
                                onClick={() => scrollToSection('contact')}
                                className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-6 h-auto"
                            >
                                {t.guide.cta_contact}
                            </Button>
                            <div className="flex items-center gap-3 ml-2">
                                <a
                                    href={instagramUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors"
                                >
                                    <Instagram className="w-5 h-5 text-gray-700" />
                                </a>
                                <a
                                    href={`mailto:antoine@toursandetours.com`}
                                    className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors"
                                >
                                    <Mail className="w-5 h-5 text-gray-700" />
                                </a>
                                <a
                                    href={`https://wa.me/${t.contact.whatsapp.replace(/\s+/g, '')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors"
                                >
                                    <Phone className="w-5 h-5 text-gray-700" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
