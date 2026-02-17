import { MapPin, Menu, X, Activity } from 'lucide-react';
import { type Language } from '@/lib/translations';
import { cn } from '@/lib/utils';

interface NavbarProps {
    isScrolled: boolean;
    isMobileMenuOpen: boolean;
    setIsMobileMenuOpen: (open: boolean) => void;
    lang: Language;
    setLang: (lang: Language) => void;
    scrollToSection: (id: string) => void;
    onLiveClick: () => void;
    t: any; // translations object
    view: 'home' | 'about';
    setView: (view: 'home' | 'about') => void;
}

export const Navbar = ({
    isScrolled,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    lang,
    setLang,
    scrollToSection,
    onLiveClick,
    t,
    view,
    setView
}: NavbarProps) => {
    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled
                ? 'bg-white/95 nav-blur shadow-sm py-8'
                : 'bg-transparent py-14'
                }`}
        >
            <div className="container-custom flex items-center justify-between">
                <button
                    onClick={() => {
                        setView('home');
                        window.scrollTo(0, 0);
                    }}
                    className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                >
                    <MapPin className={`w-6 h-6 ${isScrolled ? 'text-amber-600' : 'text-white'}`} />
                    <span className={`text-xl font-bold font-serif ${isScrolled ? 'text-gray-900' : 'text-white'}`}>
                        Tours<span className="text-amber-500">&</span>Detours
                    </span>
                </button>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-6">
                    {['tours', 'about', 'avis', 'contact'].map((item) => (
                        <button
                            key={item}
                            onClick={() => {
                                if (item === 'about') {
                                    setView('about');
                                    setIsMobileMenuOpen(false);
                                } else {
                                    scrollToSection(item === 'tours' ? 'top-tours' : item);
                                }
                            }}
                            className={cn(
                                "text-sm font-medium capitalize transition-colors hover:opacity-80 px-2 py-1",
                                isScrolled ? 'text-gray-700' : 'text-white',
                                view === 'about' && item === 'about' ? 'border-b-2 border-amber-600 font-bold' : ''
                            )}
                        >
                            {item === 'avis' ? t.nav.avis : item === 'about' ? t.nav.about : item === 'contact' ? t.nav.contact : t.nav.tours}
                        </button>
                    ))}

                    <button
                        onClick={onLiveClick}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all text-xs font-bold uppercase ${isScrolled
                            ? 'border-amber-600 text-amber-600 hover:bg-amber-50'
                            : 'border-white/30 text-white hover:bg-white/10'
                            }`}
                    >
                        <Activity className="w-3 h-3" />
                        {t.nav.live}
                    </button>

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
                    {/* CTAs removed per UI Expert recommendation for cleaner aesthetic */}
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

                        {['tours', 'about', 'avis', 'contact'].map((item) => (
                            <button
                                key={item}
                                onClick={() => {
                                    if (item === 'about') {
                                        setView('about');
                                        setIsMobileMenuOpen(false);
                                    } else {
                                        scrollToSection(item === 'tours' ? 'top-tours' : item);
                                        setIsMobileMenuOpen(false);
                                    }
                                }}
                                className="text-left text-gray-700 py-2 font-medium capitalize"
                            >
                                {item === 'avis' ? t.nav.avis : item === 'about' ? t.nav.about : item === 'contact' ? t.nav.contact : t.nav.tours}
                            </button>
                        ))}
                        <button
                            onClick={() => {
                                onLiveClick();
                                setIsMobileMenuOpen(false);
                            }}
                            className="flex items-center gap-2 text-amber-600 py-2 font-bold uppercase text-left"
                        >
                            <Activity className="w-4 h-4" />
                            {t.nav.live}
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
};
