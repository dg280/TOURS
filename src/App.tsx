import { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { CookieConsent } from "./components/CookieConsent";
import { Navbar } from "./components/layout/Navbar";
import { Hero } from "./components/sections/Hero";
import { Footer } from "./components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Testimonials } from "./components/sections/Testimonials";
import { Contact } from "./components/sections/Contact";
import { LiveJoinDialog } from "./components/live/LiveJoinDialog";
import { BookingModal } from "./components/booking/BookingModal";
import { SEO } from "./components/SEO";
import { WhatsAppButton } from "./components/WhatsAppButton";
import { AboutPage } from "./pages/AboutPage";
import { TourPage } from "./pages/TourPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { TopToursCarousel } from "./components/sections/TopToursCarousel";
import { CategoryToursCarousel } from "./components/sections/CategoryToursCarousel";
import { LegalModal } from "./components/modals/LegalModal";
import { useAppContext } from "./contexts/useAppContext";
import { useTourState } from "./hooks/useTourState";
import { slugForTour } from "./lib/tour-slugs";
import type { Tour } from "./lib/types";
import "./App.css";

// ─── Home page content ──────────────────────────────────────────────────────

function HomePage() {
  const { lang, t, tours, testimonials, guide } = useAppContext();
  const navigate = useNavigate();

  const handleTourClick = (tour: Tour) => {
    navigate(`/tours/${slugForTour(tour)}`);
  };

  const scrollToSection = (id: string | null) => {
    if (!id) return;
    const el = document.getElementById(id);
    if (el) {
      window.scrollTo({
        top: el.getBoundingClientRect().top + window.pageYOffset - 100,
        behavior: "smooth",
      });
    }
  };

  return (
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
            onClick={() => navigate("/about")}
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
  );
}

// ─── About page wrapper ─────────────────────────────────────────────────────

function AboutPageWrapper() {
  const { t, guide } = useAppContext();
  const navigate = useNavigate();

  return (
    <AboutPage
      t={t}
      guidePhoto={guide.photo}
      guideBio={guide.bio}
      differentPhotos={guide.differentPhotos}
      onBackToHome={() => navigate("/")}
    />
  );
}

// ─── App shell (layout + routes) ────────────────────────────────────────────

function App() {
  const {
    lang,
    setLang,
    t,
    tours,
    guide,
    legalModal,
    setLegalModal,
    showCookieConsent,
    setShowCookieConsent,
  } = useAppContext();

  const { isBookingOpen, setIsBookingOpen, selectedTour, handleBookingStart, isLiveJoinOpen, setIsLiveJoinOpen } =
    useTourState({ tours });

  const navigate = useNavigate();
  const location = useLocation();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  // Detect which "view" we're on for the navbar
  const isAbout = location.pathname === "/about";
  const view = isAbout ? "about" as const : "home" as const;

  // Legacy URL redirects: ?tour=X → /tours/:slug, #about → /about
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tourParam = params.get("tour");
    if (tourParam) {
      // Legacy ?tour=X → navigate to /tours/X, TourPage will redirect to the real slug
      navigate(`/tours/${tourParam}`, { replace: true });
      return;
    }
    if (window.location.hash === "#about") {
      navigate("/about", { replace: true });
    }
  }, [navigate]);

  // When TourPage navigates to "/" with state.bookTourId, open the BookingModal
  useEffect(() => {
    const state = location.state as { bookTourId?: string | number } | null;
    if (state?.bookTourId) {
      const tour = tours.find((t) => String(t.id) === String(state.bookTourId));
      if (tour) {
        handleBookingStart(tour);
      }
      // Clear the state so refreshing doesn't re-open the modal
      window.history.replaceState({}, document.title);
    }
  }, [location.state, tours, handleBookingStart]);

  // Scroll detection for navbar
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Intersection observer for active section on About page
  useEffect(() => {
    if (!isAbout) return;
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
  }, [isAbout]);

  const scrollToSection = (id: string | null) => {
    if (!id) return;
    // If on About page and trying to reach a home section, go home first
    if (isAbout && ["top-tours", "tours", "avis", "contact"].includes(id)) {
      navigate("/");
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 300);
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
        setView={(v) => navigate(v === "about" ? "/about" : "/")}
        activeSection={activeSection}
      />

      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPageWrapper />} />
          <Route path="/tours/:slug" element={<TourPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      <Footer
        t={t}
        instagramUrl={guide.instagramUrl}
        onLegalClick={() => setLegalModal("legal")}
        onPrivacyClick={() => setLegalModal("privacy")}
      />

      <LegalModal type={legalModal} onClose={() => setLegalModal(null)} />

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

      {!isBookingOpen && !isLiveJoinOpen && <WhatsAppButton lang={lang} />}
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
