import { MapPin, Menu, X, Activity } from "lucide-react";
import { type Language, type Translations } from "@/lib/translations";
import { cn } from "@/lib/utils";

interface NavbarProps {
  isScrolled: boolean;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  lang: Language;
  setLang: (lang: Language) => void;
  scrollToSection: (id: string) => void;
  onLiveClick: () => void;
  t: Translations; // translations object
  view: "home" | "about";
  setView: (view: "home" | "about") => void;
  activeSection?: string;
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
  setView,
  activeSection,
}: NavbarProps) => {
  const navItems =
    view === "home"
      ? ["tours", "about", "avis", "contact"]
      : ["home", "me", "philosophy", "different", "why"];

  const getLabel = (item: string) => {
    if (view === "home") {
      return item === "avis"
        ? t.nav.avis
        : item === "about"
          ? t.nav.about
          : item === "contact"
            ? t.nav.contact
            : t.nav.tours;
    } else {
      if (item === "home") return "HOME";
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (t.about as any)[item].label;
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? "scrolled shadow-md py-4" : "bg-transparent py-8"
      }`}
    >
      <div className="container-custom flex items-center justify-between">
        <button
          onClick={() => {
            setView("home");
            window.scrollTo(0, 0);
          }}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <MapPin
            className={`w-6 h-6 ${isScrolled || view === "about" ? "text-amber-600" : "text-white"}`}
          />
          <span
            className={`text-xl font-bold font-serif ${isScrolled || view === "about" ? "text-gray-900" : "text-white"}`}
          >
            Tours<span className="text-amber-500">&</span>Detours
          </span>
        </button>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <button
              key={item}
              onClick={() => {
                if (item === "about") {
                  setView("about");
                  setIsMobileMenuOpen(false);
                } else if (item === "home") {
                  setView("home");
                  setIsMobileMenuOpen(false);
                  window.scrollTo(0, 0);
                } else {
                  scrollToSection(item === "tours" ? "top-tours" : item);
                }
              }}
              className={cn(
                "relative text-xs font-bold uppercase tracking-widest transition-all px-2 py-1 h-full flex flex-col items-center justify-center group",
                isScrolled || view === "about"
                  ? "text-gray-600 hover:text-amber-600"
                  : "text-white/80 hover:text-white",
                (view === "about" && activeSection === item) ||
                  (view === "home" && item === "about" && false)
                  ? "text-amber-600"
                  : "",
              )}
            >
              {/* Active Indicator Bar (Above) */}
              <div
                className={cn(
                  "absolute -top-8 left-0 right-0 h-1 bg-amber-600 transition-all duration-300 transform scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-50",
                  activeSection === item ? "scale-x-100 opacity-100" : "",
                )}
              />

              {getLabel(item)}
            </button>
          ))}

          <button
            onClick={onLiveClick}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all text-[10px] font-black uppercase tracking-wider ${
              isScrolled || view === "about"
                ? "border-amber-600 text-amber-600 hover:bg-amber-50"
                : "border-white/30 text-white hover:bg-white/10"
            }`}
          >
            <Activity className="w-3 h-3" />
            {t.nav.live}
          </button>

          {/* Language Switcher */}
          <div
            className={`flex items-center gap-3 ml-2 border-l pl-5 h-6 ${isScrolled || view === "about" ? "border-gray-200" : "border-white/20"}`}
          >
            {(["fr", "en", "es"] as Language[]).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`text-xs font-bold uppercase transition-all ${
                  lang === l
                    ? "text-amber-600 border border-amber-600/30 bg-amber-50/50 px-2 py-0.5 rounded"
                    : isScrolled || view === "about"
                      ? "text-gray-500 hover:text-gray-900"
                      : "text-white/70 hover:text-white"
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
            <X
              className={`w-6 h-6 ${isScrolled ? "text-gray-900" : "text-white"}`}
            />
          ) : (
            <Menu
              className={`w-6 h-6 ${isScrolled ? "text-gray-900" : "text-white"}`}
            />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg py-4">
          <div className="container-custom flex flex-col gap-4">
            {/* Language switcher for mobile */}
            <div className="flex gap-4 border-b border-gray-100 pb-2">
              {(["fr", "en", "es"] as Language[]).map((l) => (
                <button
                  key={l}
                  onClick={() => {
                    setLang(l);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`text-sm font-bold uppercase ${lang === l ? "text-amber-600" : "text-gray-400"}`}
                >
                  {l}
                </button>
              ))}
            </div>

            {navItems.map((item) => (
              <button
                key={item}
                onClick={() => {
                  if (item === "about") {
                    setView("about");
                    setIsMobileMenuOpen(false);
                  } else if (item === "home") {
                    setView("home");
                    setIsMobileMenuOpen(false);
                    window.scrollTo(0, 0);
                  } else {
                    scrollToSection(item === "tours" ? "top-tours" : item);
                    setIsMobileMenuOpen(false);
                  }
                }}
                className={cn(
                  "text-left py-3 font-bold uppercase text-xs tracking-widest transition-colors",
                  activeSection === item ? "text-amber-600" : "text-gray-700",
                )}
              >
                {getLabel(item)}
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
