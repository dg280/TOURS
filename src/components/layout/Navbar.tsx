import { MapPin, Phone, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { type Language } from '@/lib/translations';

interface NavbarProps {
    isScrolled: boolean;
    isMobileMenuOpen: boolean;
    setIsMobileMenuOpen: (open: boolean) => void;
    lang: Language;
    setLang: (lang: Language) => void;
    scrollToSection: (id: string) => void;
    handleBookingStart: () => void;
    t: any; // translations object
}

export const Navbar = ({
    isScrolled,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    lang,
    setLang,
    scrollToSection,
    handleBookingStart,
    t
}: NavbarProps) => {
    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled
                ? 'bg-white/95 nav-blur shadow-sm py-6'
                : 'bg-transparent py-10'
                }`}
        >
            <div className="container-custom flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <MapPin className={`w-6 h-6 ${isScrolled ? 'text-amber-600' : 'text-white'}`} />
                    <span className={`text-xl font-bold font-serif ${isScrolled ? 'text-gray-900' : 'text-white'}`}>
                        Tours<span className="text-amber-500">&</span>Detours
                    </span>
                </div>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-6">
                    {['tours', 'guide', 'avis', 'contact'].map((item) => (
                        <button
                            key={item}
                            onClick={() => scrollToSection(item)}
                            className={`text-sm font-medium capitalize transition-colors hover:opacity-80 ${isScrolled ? 'text-gray-700' : 'text-white'
                                }`}
                        >
                            {item === 'avis' ? t.nav.avis : item === 'guide' ? t.nav.guide : item === 'contact' ? t.nav.contact : t.nav.tours}
                        </button>
                    ))}

                    {/* Language Switcher */}
                    <div className="flex items-center gap-2 ml-2 border-l border-gray-300 pl-4 h-6">
                        {(['fr', 'en', 'es'] as Language[]).map((l) => (
                            <button
                                key={l}
                                onClick={() => setLang(l)}
                                className={`text-xs font-bold uppercase transition-all ${lang === l
                                    ? (isScrolled ? 'text-amber-600' : 'text-amber-400')
                                    : (isScrolled ? 'text-gray-400 hover:text-gray-600' : 'text-white/60 hover:text-white')
                                    }`}
                            >
                                {l}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="hidden md:flex items-center gap-3">
                    <a
                        href={`https://wa.me/${t.contact.whatsapp.replace(/\s+/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`p-2 rounded-full transition-all ${isScrolled ? 'bg-green-50 text-green-600' : 'bg-white/10 text-white hover:bg-white/20'}`}
                    >
                        <Phone className="w-5 h-5" />
                    </a>
                    <Button
                        onClick={handleBookingStart}
                        className="bg-amber-600 hover:bg-amber-700 text-white rounded-2xl px-8 h-14 font-bold shadow-xl shadow-amber-600/30 transition-all active:scale-95 uppercase tracking-wide"
                    >
                        {t.nav.reserve}
                    </Button>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden p-2 rounded-lg"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? (
                        <X className={`w-6 h-6 ${isScrolled ? 'text-gray-900' : 'text-white'}`} />
                    ) : (
                        <Menu className={`w-6 h-6 ${isScrolled ? 'text-gray-900' : 'text-white'}`} />
                    )}
                </button>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg py-4">
                    <div className="container-custom flex flex-col gap-4">
                        {/* Language switcher for mobile */}
                        <div className="flex gap-4 border-b border-gray-100 pb-2">
                            {(['fr', 'en', 'es'] as Language[]).map((l) => (
                                <button
                                    key={l}
                                    onClick={() => {
                                        setLang(l);
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className={`text-sm font-bold uppercase ${lang === l ? 'text-amber-600' : 'text-gray-400'}`}
                                >
                                    {l}
                                </button>
                            ))}
                        </div>

                        {['tours', 'guide', 'avis', 'contact'].map((item) => (
                            <button
                                key={item}
                                onClick={() => scrollToSection(item)}
                                className="text-left text-gray-700 py-2 font-medium capitalize"
                            >
                                {item === 'avis' ? t.nav.avis : item === 'guide' ? t.nav.guide : item === 'contact' ? t.nav.contact : t.nav.tours}
                            </button>
                        ))}
                        <Button
                            onClick={handleBookingStart}
                            className="bg-amber-600 hover:bg-amber-700 text-white w-full mt-4 h-16 rounded-2xl font-bold uppercase tracking-wide shadow-xl shadow-amber-600/20"
                        >
                            {t.nav.reserve}
                        </Button>
                    </div>
                </div>
            )}
        </nav>
    );
};
