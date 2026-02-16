import { Phone, Mail, Instagram } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface ContactProps {
    t: any;
    instagramUrl: string;
}

export const Contact = ({ t, instagramUrl }: ContactProps) => {
    return (
        <section id="contact" className="section-padding bg-white">
            <div className="container-custom">
                <div className="max-w-6xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-16">
                        <div className="space-y-8">
                            <div>
                                <p className="text-amber-600 font-medium mb-2">{t.contact.tag}</p>
                                <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
                                    {t.contact.title}
                                </h2>
                                <p className="text-gray-600 text-lg">
                                    {t.contact.desc}
                                </p>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-center gap-4 group">
                                    <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center text-green-600 group-hover:bg-green-600 group-hover:text-white transition-all duration-300">
                                        <Phone className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-400 uppercase tracking-widest font-bold">WhatsApp</p>
                                        <a href={`https://wa.me/${t.contact.whatsapp.replace(/\s+/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-xl font-bold hover:text-amber-600 transition-colors">
                                            {t.contact.whatsapp}
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 group">
                                    <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-all duration-300">
                                        <Mail className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-400 uppercase tracking-widest font-bold">Email</p>
                                        <a href="mailto:info@toursandetours.com" className="text-xl font-bold hover:text-amber-600 transition-colors">
                                            info@toursandetours.com
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 group">
                                    <div className="w-12 h-12 rounded-2xl bg-pink-50 flex items-center justify-center text-pink-600 group-hover:bg-pink-600 group-hover:text-white transition-all duration-300">
                                        <Instagram className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-400 uppercase tracking-widest font-bold">Instagram</p>
                                        <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="text-xl font-bold hover:text-amber-600 transition-colors">
                                            @tours_and_detours_bcn
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 p-8 sm:p-10 rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50">
                            <h3 className="text-2xl font-bold text-gray-900 mb-8">{t.contact.form_title}</h3>
                            <form className="space-y-6">
                                <div className="grid sm:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">{t.contact.name}</Label>
                                        <Input id="name" placeholder="Votre nom" className="bg-white border-gray-200 focus:border-amber-600 h-12" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">{t.contact.email}</Label>
                                        <Input id="email" type="email" placeholder="votre@email.com" className="bg-white border-gray-200 focus:border-amber-600 h-12" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="tour" className="text-gray-700 font-semibold ml-1">{t.contact.tour}</Label>
                                    <select
                                        id="tour"
                                        className="w-full h-14 px-5 rounded-2xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent text-base transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="">{t.contact.select_tour}</option>
                                        {t.tour_data.map((tour: any) => (
                                            <option key={tour.id} value={tour.id}>{tour.title}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="message" className="text-gray-700 font-semibold ml-1">{t.contact.message}</Label>
                                    <Textarea id="message" rows={4} className="bg-white border-gray-200 focus:border-amber-600 rounded-2xl p-5 text-base" />
                                </div>
                                <Button className="w-full bg-gray-900 hover:bg-amber-600 text-white font-bold h-16 rounded-2xl shadow-xl transition-all active:scale-95 text-lg uppercase tracking-wide">
                                    {t.contact.cta}
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
