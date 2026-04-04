import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";
import { CookieConsent } from "./components/CookieConsent";
import { Navbar } from "./components/layout/Navbar";
import { Hero } from "./components/sections/Hero";
import { Footer } from "./components/layout/Footer";
import { TourDialog } from "./components/sections/TourDialog";
import { Button } from "@/components/ui/button";
import { Testimonials } from "./components/sections/Testimonials";
import { Contact } from "./components/sections/Contact";
import { LiveJoinDialog } from "./components/live/LiveJoinDialog";
import { BookingModal } from "./components/booking/BookingModal";
import { SEO } from "./components/SEO";
import { WhatsAppButton } from "./components/WhatsAppButton";
import { AboutPage } from "./pages/AboutPage";
import { TopToursCarousel } from "./components/sections/TopToursCarousel";
import { CategoryToursCarousel } from "./components/sections/CategoryToursCarousel";
import { LegalModal } from "./components/modals/LegalModal";
import { useAppContext } from "./contexts/useAppContext";
import { useTourState } from "./hooks/useTourState";
import "./App.css";

function App() {
  const {
    lang,
    setLang,
    t,
    tours,
    testimonials,
    guide,
    legalModal,
    setLegalModal,
    showCookieConsent,
    setShowCookieConsent,
  } = useAppContext();

  const {
    selectedTour,
    isBookingOpen,
    setIsBookingOpen,
    isTourDialogOpen,
    setIsTourDialogOpen,
    viewedTour,
    isLiveJoinOpen,
    setIsLiveJoinOpen,
    handleTourClick,
    handleBookingStart,
  } = useTourState({ tours });

  const [view, setView] = useState<"home" | "about">("home");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  // Hash-based routing
  useEffect(() => {
    const handleHash = () => {
      if (window.location.hash === "#about") setView("about");
      else if (window.location.hash === "#home" || !window.location.hash)
        setView("home");
    };
    handleHash();
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  // Scroll detection for navbar
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Intersection observer for active section on About page
  useEffect(() => {
    if (view !== "about") return;
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) setActiveSection(e.target.id);
        }),
      { rootMargin: "-20% 0px -60% 0px", threshold: 0 },
    );
    ["me", "philosophy", "different", "why"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [view]);

  const scrollToSection = (id: string | null) => {
    if (!id) return;
    if (
      view === "about" &&
      ["top-tours", "tours", "avis", "contact"].includes(id)
    ) {
      setView("home");
      setTimeout(() => scrollToSection(id), 100);
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      window.scrollTo({
        top: el.getBoundingClientRect().top + window.pageYOffset - 100,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <SEO title={t.seo.title} description={t.seo.description} lang={lang} />

      <Navbar
        isScrolled={isScrolled}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        lang={lang}
        setLang={setLang}
        scrollToSection={scrollToSection}
        onLiveClick={() => setIsLiveJoinOpen(true)}
        t={t}
        view={view}
        setView={setView}
        activeSection={activeSection}
      />

      <main>
        {view === "home" ? (
          <>
            <Hero t={t} scrollToSection={scrollToSection} />
            <TopToursCarousel
              tours={tours}
              lang={lang}
              t={t}
              onTourClick={handleTourClick}
            />
            <CategoryToursCarousel
              tours={tours}
              lang={lang}
              t={t}
              onTourClick={handleTourClick}
            />

            <section className="py-20 bg-amber-600 text-white overflow-hidden relative">
              <div className="container-custom relative z-10 text-center">
                <h2 className="text-3xl md:text-5xl font-bold mb-8 max-w-4xl mx-auto leading-tight">
                  {t.about_hook.title}
                </h2>
                <Button
                  onClick={() => setView("about")}
                  className="bg-white text-amber-600 hover:bg-gray-100 rounded-full h-16 px-10 text-lg font-bold transition-all shadow-xl"
                >
                  {t.about_hook.cta}
                </Button>
              </div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
            </section>

            <Testimonials t={t} testimonials={testimonials} />
            <Contact t={t} instagramUrl={guide.instagramUrl} />
          </>
        ) : (
          <AboutPage
            t={t}
            guidePhoto={guide.photo}
            guideBio={guide.bio}
            differentPhotos={guide.differentPhotos}
            onBackToHome={() => setView("home")}
          />
        )}
      </main>

      <Footer
        t={t}
        instagramUrl={guide.instagramUrl}
        onLegalClick={() => setLegalModal("legal")}
        onPrivacyClick={() => setLegalModal("privacy")}
      />

      <LegalModal type={legalModal} onClose={() => setLegalModal(null)} lang={lang} />

      <TourDialog
        tour={viewedTour}
        isOpen={isTourDialogOpen}
        onOpenChange={setIsTourDialogOpen}
        lang={lang}
        t={t}
        onBookNow={(tour) => handleBookingStart(tour, tours[0])}
      />

      <BookingModal
        isOpen={isBookingOpen}
        onOpenChange={setIsBookingOpen}
        tour={selectedTour}
        lang={lang}
        t={t}
      />

      <LiveJoinDialog
        isOpen={isLiveJoinOpen}
        onOpenChange={setIsLiveJoinOpen}
        lang={lang}
        t={t}
      />

      {!isBookingOpen && !isTourDialogOpen && !isLiveJoinOpen && (
        <WhatsAppButton lang={lang} />
      )}
      {showCookieConsent && (
        <CookieConsent
          lang={lang}
          onAccept={() => setShowCookieConsent(false)}
        />
      )}
      <Toaster position="top-center" richColors />
    </div>
  );
}

export default App;
