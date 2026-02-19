import { Button } from '@/components/ui/button';
import { Instagram, Mail, Phone, CheckCircle2 } from 'lucide-react';
import type { Translations } from '@/lib/translations';

interface GuideProps {
    t: Translations;
    guidePhoto: string;
    instagramUrl: string;
    guideBio?: string;
    scrollToSection: (id: string) => void;
}

export const Guide = ({ t, guidePhoto, instagramUrl, guideBio, scrollToSection }: GuideProps) => {
    return (
        <section id="guide" className="section-padding bg-gray-50 overflow-hidden">
            <div className="container-custom">
                <div className="max-w-5xl mx-auto">
                    <div className="flex flex-col md:flex-row gap-8 lg:gap-16 items-start mb-12">
                        <div className="relative shrink-0 w-full md:w-80 lg:w-96">
                            <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl aspect-[4/5]">
                                <img
                                    src={guidePhoto}
                                    alt="Antoine Pilard"
                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                                />
                            </div>
                            {/* Decorative elements */}
                            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-amber-100 rounded-full z-0" />
                            <div className="absolute -top-4 -left-4 w-16 h-16 border-2 border-amber-200 rounded-full z-0" />
                        </div>

                        <div className="flex-1 space-y-6">
                            <div>
                                <p className="text-amber-600 font-medium mb-2 uppercase tracking-widest text-sm">{t.guide.section_tag}</p>
                                <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 font-serif">
                                    {t.guide.title}
                                </h2>
                                <div className="space-y-4 text-gray-600 text-lg leading-relaxed">
                                    {(guideBio || t.guide.bio || '').split('\n\n').slice(0, 2).map((para: string, idx: number) => (
                                        <p key={idx}>{para}</p>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
                                {t.guide.features.map((feature: string, i: number) => (
                                    <div key={i} className="flex items-center gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0" />
                                        <span className="text-gray-700 font-medium text-sm">{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6 text-gray-600 text-lg leading-relaxed mb-12">
                        {(guideBio || t.guide.bio || '').split('\n\n').slice(2).map((para: string, idx: number) => (
                            <p key={idx}>{para}</p>
                        ))}
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-8 pt-8 border-t border-gray-200">
                        <Button
                            onClick={() => scrollToSection('contact')}
                            className="bg-amber-600 hover:bg-amber-700 text-white px-12 py-7 h-auto text-lg font-bold rounded-2xl shadow-xl shadow-amber-600/20 transition-all active:scale-95"
                        >
                            {t.guide.cta_contact}
                        </Button>
                        <div className="flex items-center gap-4">
                            <a
                                href={instagramUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-14 h-14 rounded-2xl border border-gray-200 flex items-center justify-center hover:bg-white hover:shadow-lg transition-all text-gray-700 hover:text-amber-600"
                            >
                                <Instagram className="w-6 h-6" />
                            </a>
                            <a
                                href={`mailto:info@toursandetours.com`}
                                className="w-14 h-14 rounded-2xl border border-gray-200 flex items-center justify-center hover:bg-white hover:shadow-lg transition-all text-gray-700 hover:text-amber-600"
                            >
                                <Mail className="w-6 h-6" />
                            </a>
                            <a
                                href={`https://wa.me/${t.contact.whatsapp.replace(/\s+/g, '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-14 h-14 rounded-2xl border border-gray-200 flex items-center justify-center hover:bg-white hover:shadow-lg transition-all text-gray-700 hover:text-amber-600"
                            >
                                <Phone className="w-6 h-6" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
