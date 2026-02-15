import { MapPin, Instagram, Mail } from 'lucide-react';

interface FooterProps {
    t: any;
    instagramUrl: string;
}

export const Footer = ({ t, instagramUrl }: FooterProps) => {
    return (
        <footer className="bg-gray-900 text-white py-20 border-t border-white/5">
            <div className="container-custom">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    <div className="space-y-6">
                        <div className="flex items-center gap-2">
                            <MapPin className="w-6 h-6 text-amber-500" />
                            <span className="text-2xl font-bold font-serif">
                                Tours<span className="text-amber-500">&</span>Detours
                            </span>
                        </div>
                        <p className="text-gray-400 leading-relaxed">
                            {t.hero.tagline}. {t.hero.description}
                        </p>
                    </div>

                    <div>
                        <h4 className="text-lg font-bold mb-6">Navigation</h4>
                        <ul className="space-y-4 text-gray-400">
                            <li><a href="#tours" className="hover:text-amber-400 transition-colors">{t.nav.tours}</a></li>
                            <li><a href="#guide" className="hover:text-amber-400 transition-colors">{t.nav.guide}</a></li>
                            <li><a href="#avis" className="hover:text-amber-400 transition-colors">{t.nav.avis}</a></li>
                            <li><a href="#contact" className="hover:text-amber-400 transition-colors">Contact</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-lg font-bold mb-6">{t.nav.tours}</h4>
                        <ul className="space-y-4 text-gray-400">
                            {t.tour_data.slice(0, 4).map((tour: any) => (
                                <li key={tour.id} className="truncate">
                                    <span className="hover:text-amber-400 transition-colors cursor-pointer">{tour.title}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-lg font-bold mb-6">Social</h4>
                        <div className="flex gap-4">
                            <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-amber-600 transition-colors">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href="mailto:antoine@toursandetours.com" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-amber-600 transition-colors">
                                <Mail className="w-5 h-5" />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-500 text-sm">
                    <p>© {new Date().getFullYear()} Tours & Detours Barcelona. All rights reserved.</p>
                    <div className="flex gap-6">
                        <a href="#" className="hover:text-white">Mentions légales</a>
                        <a href="#" className="hover:text-white">Confidentialité</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};
