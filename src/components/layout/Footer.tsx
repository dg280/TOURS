import { MapPin, Instagram, Mail, Send } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface FooterProps {
    t: any;
    instagramUrl: string;
}

export const Footer = ({ t, instagramUrl }: FooterProps) => {
    return (
        <footer className="bg-gray-900 text-white py-20 border-t border-white/5">
            <div className="container-custom">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-16">
                    <div className="space-y-6">
                        <div className="flex items-center gap-2">
                            <MapPin className="w-6 h-6 text-amber-500" />
                            <span className="text-2xl font-bold font-serif">
                                Tours<span className="text-amber-500">&</span>Detours
                            </span>
                        </div>
                        <p className="text-gray-400 leading-relaxed text-sm md:text-base">
                            {t.hero.tagline}. {t.hero.description}
                        </p>
                    </div>

                    <div className="sm:pl-4 lg:pl-0">
                        <h4 className="text-lg font-bold mb-6 text-white uppercase tracking-wider text-xs">Navigation</h4>
                        <ul className="space-y-4 text-gray-400">
                            <li><a href="#tours" className="hover:text-amber-400 transition-colors block py-1">{t.nav.tours}</a></li>
                            <li><a href="#guide" className="hover:text-amber-400 transition-colors block py-1">{t.nav.guide}</a></li>
                            <li><a href="#avis" className="hover:text-amber-400 transition-colors block py-1">{t.nav.avis}</a></li>
                            <li><a href="#contact" className="hover:text-amber-400 transition-colors block py-1">Contact</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-lg font-bold mb-6 text-white uppercase tracking-wider text-xs">{t.nav.tours}</h4>
                        <ul className="space-y-4 text-gray-400">
                            {t.tour_data.slice(0, 4).map((tour: any) => (
                                <li key={tour.id} className="truncate">
                                    <span className="hover:text-amber-400 transition-colors cursor-pointer text-sm">{tour.title}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="lg:col-span-1">
                        <h4 className="text-lg font-bold mb-6 flex items-center gap-2 text-white uppercase tracking-wider text-xs">
                            <Send className="w-4 h-4 text-amber-500" />
                            Newsletter
                        </h4>
                        <p className="text-gray-400 mb-6 text-sm">
                            Inscrivez-vous pour recevoir nos exclusivités sur Barcelone.
                        </p>
                        <form className="flex flex-col sm:flex-row gap-3" onSubmit={async (e) => {
                            e.preventDefault();
                            const formData = new FormData(e.currentTarget);
                            const email = formData.get('email') as string;

                            if (supabase) {
                                const { error } = await supabase.from('newsletter_subscribers').insert({ email });
                                if (error) {
                                    if (error.code === '23505') toast.error("Vous êtes déjà inscrit !");
                                    else toast.error("Une erreur est survenue.");
                                } else {
                                    toast.success("Merci ! Nous vous recontacterons bientôt.");
                                    e.currentTarget.reset();
                                }
                            }
                        }}>
                            <input
                                type="email"
                                name="email"
                                required
                                placeholder="votre@email.com"
                                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 flex-1 focus:outline-none focus:border-amber-500 transition-colors text-sm"
                            />
                            <button className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-6 h-12 rounded-xl transition-all active:scale-95 shadow-lg shadow-amber-600/20 text-sm whitespace-nowrap">
                                S'inscrire
                            </button>
                        </form>
                        <div className="flex gap-4 mt-8">
                            <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-amber-600 transition-colors">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href="mailto:antoine@toursandetours.com" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-amber-600 transition-colors">
                                <Mail className="w-5 h-5" />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-gray-500 text-xs">
                    <p>© {new Date().getFullYear()} Tours & Detours Barcelona.</p>
                    <div className="flex gap-6">
                        <a href="#legal" className="hover:text-white">Mentions légales</a>
                        <a href="#privacy" className="hover:text-white">Confidentialité</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};
