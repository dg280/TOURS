import { useState, useEffect } from 'react';
import { translations, type Language } from './lib/translations';
import { supabase } from './lib/supabase';
import { Toaster } from '@/components/ui/sonner';
import { CookieConsent } from './components/CookieConsent';
import { Navbar } from './components/layout/Navbar';
import { Hero } from './components/sections/Hero';
import { Footer } from './components/layout/Footer';
import { TourDialog } from './components/sections/TourDialog';
import { Button } from '@/components/ui/button';
import { Testimonials } from './components/sections/Testimonials';
import { Contact } from './components/sections/Contact';
import { LiveJoinDialog } from './components/live/LiveJoinDialog';
import { BookingModal } from './components/booking/BookingModal';
import { SEO } from './components/SEO';
import { WhatsAppButton } from './components/WhatsAppButton';
import type { Tour, Testimonial } from './lib/types';
import { prepareTourForEditing } from './lib/utils';
import { AboutPage } from './pages/AboutPage';
import { TopToursCarousel } from './components/sections/TopToursCarousel';
import { CategoryToursCarousel } from './components/sections/CategoryToursCarousel';
import './App.css';

function App() {
  const [lang, setLang] = useState<Language>('fr');
  const [view, setView] = useState<'home' | 'about'>('home');
  const t = translations[lang];

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
  const [isTourDialogOpen, setIsTourDialogOpen] = useState(false);
  const [viewedTour, setViewedTour] = useState<Tour | null>(null);
  const [isLiveJoinOpen, setIsLiveJoinOpen] = useState(false);

  const [guidePhoto, setGuidePhoto] = useState('/guide-portrait.jpg');
  const [instagramUrl, setInstagramUrl] = useState('https://www.instagram.com/tours_and_detours_bcn/');
  const [guideBio, setGuideBio] = useState('');
  const [customTours, setCustomTours] = useState<Tour[]>([]);
  const [dbTours, setDbTours] = useState<Tour[]>([]);
  const [dbReviews, setDbReviews] = useState<Testimonial[]>([]);
  // initializes from localStorage to avoid cascading render in useEffect
  const [showCookieConsent, setShowCookieConsent] = useState(() => {
    if (typeof window === 'undefined') return false;
    return !localStorage.getItem('cookie-consent');
  });

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Debug: reset cookies if URL has ?reset=true
    if (window.location.search.includes('reset=true')) {
      localStorage.removeItem('cookie-consent');
      localStorage.removeItem('cookie-preferences');
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    // if (!localStorage.getItem('cookie-consent')) setShowCookieConsent(true); // handled in initializer now

    const savedPhoto = localStorage.getItem('td-guide-photo');
    if (savedPhoto) setGuidePhoto(savedPhoto);

    const savedTours = localStorage.getItem('td-tours');
    if (savedTours) setCustomTours(JSON.parse(savedTours));
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!supabase) return;

        // Fetch tours
        const { data: toursData, error: toursError } = await supabase.from('tours').select('*');
        if (toursError) console.error('Error fetching tours:', toursError);
        else if (toursData && toursData.length > 0) {
          const mapped = toursData.map(t => prepareTourForEditing({
            id: Number(t.id) || t.id,
            title: t.title,
            title_en: t.title_en,
            title_es: t.title_es,
            subtitle: t.subtitle,
            subtitle_en: t.subtitle_en,
            subtitle_es: t.subtitle_es,
            description: t.description,
            description_en: t.description_en,
            description_es: t.description_es,
            duration: t.duration,
            groupSize: t.group_size,
            price: t.price,
            image: t.image,
            category: t.category,
            highlights: t.highlights,
            highlights_en: t.highlights_en,
            highlights_es: t.highlights_es,
            itinerary: t.itinerary,
            itinerary_en: t.itinerary_en,
            itinerary_es: t.itinerary_es,
            included: t.included,
            included_en: t.included_en,
            included_es: t.included_es,
            notIncluded: t.not_included,
            notIncluded_en: t.not_included_en,
            notIncluded_es: t.not_included_es,
            meetingPoint: t.meeting_point,
            meetingPoint_en: t.meeting_point_en,
            meetingPoint_es: t.meeting_point_es,
            meetingPointMapUrl: t.meeting_point_map_url,
            images: t.images || [],
            pricing_tiers: t.pricing_tiers || {}
          }));
          setDbTours(mapped as Tour[]);
        }

        // Fetch reviews
        const { data: reviewsData, error: reviewsError } = await supabase.from('reviews').select('*').eq('is_published', true).order('created_at', { ascending: false });
        if (reviewsError) console.error('Error fetching reviews:', reviewsError);
        else if (reviewsData) {
          setDbReviews(reviewsData.map(r => ({
            id: r.id,
            name: r.name,
            loc: r.location,
            rating: r.rating,
            text: r.text,
            avatar: r.name.charAt(0).toUpperCase() + (r.name.split(' ')[1]?.charAt(0).toUpperCase() || '')
          })));
        }

        // Fetch site_config - using 'key' instead of 'id'
        const { data: configData, error: configError } = await supabase.from('site_config').select('*').eq('key', 'main_config').maybeSingle();
        if (configError) console.error('Error fetching site_config:', configError);
        else if (configData && configData.value) {
          const config = configData.value;
          if (config.guide_photo) setGuidePhoto(config.guide_photo);
          if (config.instagram_url) setInstagramUrl(config.instagram_url);
        }

        // Fetch guide_profile specifically for bio
        const { data: profileData } = await supabase.from('site_config').select('*').eq('key', 'guide_profile').maybeSingle();
        if (profileData && profileData.value) {
          const profile = profileData.value;
          if (profile.photo) setGuidePhoto(profile.photo);
          if (profile.instagram) setInstagramUrl(profile.instagram);

          const dbBio = lang === 'en' ? profile.bio_en : lang === 'es' ? profile.bio_es : (profile.bio || profile.bio1);
          if (dbBio) setGuideBio(dbBio);
          else if (profile.bio1) setGuideBio(profile.bio1 + (profile.bio2 ? '\n\n' + profile.bio2 : ''));
        }
      } catch (err) {
        console.error('Fetch error:', err);
      }
    };

    fetchData();
  }, [lang]);

  // Collect all unique IDs from all sources
  const allIds = Array.from(new Set([
    ...t.tour_data.map((b: { id: string | number }) => String(b.id)),
    ...dbTours.map(d => String(d.id)),
    ...customTours.map(c => String(c.id))
  ]));

  const tours: Tour[] = allIds.map(id => {
    const base = t.tour_data.find((b: { id: string | number }) => String(b.id) === id) as Partial<Tour> | undefined;
    const db = dbTours.find(d => String(d.id) === id);
    const custom = customTours.find(c => String(c.id) === id);

    // Helper to merge fields while prioritizing non-empty values
    const getVal = <T,>(baseVal: T, dbVal: T, customVal: T): T => {
      const val = customVal ?? dbVal ?? baseVal;
      if (Array.isArray(val)) return (val.length > 0 ? val : baseVal) as T;
      if (typeof val === 'string') return (val.trim() !== '' ? val : baseVal) as T;
      return (val ?? baseVal) as T;
    };

    // Use DB or Custom as base if not in translations
    const effectiveBase = base || db || custom;

    // Base merged tour (French by default)
    const tour: Tour = {
      ...(effectiveBase as Tour),
      id: id,
      title: getVal((base as any)?.title, (db as any)?.title, (custom as any)?.title) || "",
      subtitle: getVal((base as any)?.subtitle, (db as any)?.subtitle, (custom as any)?.subtitle) || "",
      description: getVal((base as any)?.description, (db as any)?.description, (custom as any)?.description) || "",
      highlights: getVal((base as any)?.highlights, (db as any)?.highlights, (custom as any)?.highlights) || [],
      itinerary: getVal((base as any)?.itinerary, (db as any)?.itinerary, (custom as any)?.itinerary),
      included: getVal((base as any)?.included, (db as any)?.included, (custom as any)?.included),
      notIncluded: getVal((base as any)?.notIncluded, (db as any)?.notIncluded, (custom as any)?.notIncluded),
      meetingPoint: getVal((base as any)?.meetingPoint, (db as any)?.meetingPoint, (custom as any)?.meetingPoint),
      price: (db as any)?.price ?? (custom as any)?.price ?? (base as any)?.price ?? 0,
      image: getVal((base as any)?.image, (db as any)?.image, (custom as any)?.image) || "",
      duration: getVal((base as any)?.duration, (db as any)?.duration, (custom as any)?.duration) || "",
      groupSize: getVal((base as any)?.groupSize, (db as any)?.groupSize, (custom as any)?.groupSize) || "",
      category: getVal((base as any)?.category, (db as any)?.category, (custom as any)?.category) || "",
      pricing_tiers: (db as any)?.pricing_tiers || (custom as any)?.pricing_tiers || (base as any)?.pricing_tiers || {}
    };

    if (lang === 'en') {
      return {
        ...tour,
        title: getVal((base as any)?.title, (db as any)?.title_en, (custom as any)?.title_en) || tour.title,
        subtitle: getVal((base as any)?.subtitle, (db as any)?.subtitle_en, (custom as any)?.subtitle_en) || tour.subtitle,
        description: getVal((base as any)?.description, (db as any)?.description_en, (custom as any)?.description_en) || tour.description,
        highlights: getVal((base as any)?.highlights, (db as any)?.highlights_en, (custom as any)?.highlights_en) || tour.highlights,
        itinerary: getVal((base as any)?.itinerary, (db as any)?.itinerary_en, (custom as any)?.itinerary_en),
        included: getVal((base as any)?.included, (db as any)?.included_en, (custom as any)?.included_en),
        notIncluded: getVal((base as any)?.notIncluded, (db as any)?.notIncluded_en, (custom as any)?.notIncluded_en),
        meetingPoint: getVal((base as any)?.meetingPoint, (db as any)?.meetingPoint_en, (custom as any)?.meetingPoint_en),
      };
    } else if (lang === 'es') {
      return {
        ...tour,
        title: getVal((base as any)?.title, (db as any)?.title_es, (custom as any)?.title_es) || tour.title,
        subtitle: getVal((base as any)?.subtitle, (db as any)?.subtitle_es, (custom as any)?.subtitle_es) || tour.subtitle,
        description: getVal((base as any)?.description, (db as any)?.description_es, (custom as any)?.description_es) || tour.description,
        highlights: getVal((base as any)?.highlights, (db as any)?.highlights_es, (custom as any)?.highlights_es) || tour.highlights,
        itinerary: getVal((base as any)?.itinerary, (db as any)?.itinerary_es, (custom as any)?.itinerary_es),
        included: getVal((base as any)?.included, (db as any)?.included_es, (custom as any)?.included_es),
        notIncluded: getVal((base as any)?.notIncluded, (db as any)?.notIncluded_es, (custom as any)?.notIncluded_es),
        meetingPoint: getVal((base as any)?.meetingPoint, (db as any)?.meetingPoint_es, (custom as any)?.meetingPoint_es),
      };
    }
    return tour;
  });

  useEffect(() => {
    // Deep linking to specific tours (e.g. ?tour=1)
    const params = new URLSearchParams(window.location.search);
    const tourId = params.get('tour');
    if (tourId && tours.length > 0) {
      const targetTour = tours.find(t => String(t.id) === tourId);
      if (targetTour) {
        setViewedTour(targetTour);
        setIsTourDialogOpen(true);
      }
    }
  }, [tours]); // Re-run when tours are fetched

  const scrollToSection = (id: string | null) => {
    if (!id) return;

    // If we're on About page and trying to reach a home section, switch to home first
    if (view === 'about' && ['top-tours', 'tours', 'avis', 'contact'].includes(id)) {
      setView('home');
      setTimeout(() => scrollToSection(id), 100);
      return;
    }

    const element = document.getElementById(id);
    if (element) {
      const offset = 100; // Adjusted for new navbar height
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const handleTourClick = (tour: Tour) => {
    setViewedTour(tour);
    setIsTourDialogOpen(true);
  };

  const handleBookingStart = (tour?: Tour) => {
    setSelectedTour(tour || tours[0]);
    setIsBookingOpen(true);
  };

  // Use translated testimonials from translations.ts as fallback
  const testimonials = dbReviews.length > 0 ? dbReviews : (t as any).testimonials_data || [];

  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    if (view === 'about') {
      const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -60% 0px',
        threshold: 0
      };

      const handleIntersect = (entries: IntersectionObserverEntry[]) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      };

      const observer = new IntersectionObserver(handleIntersect, observerOptions);
      const sections = ['me', 'philosophy', 'different', 'why'];

      sections.forEach(id => {
        const el = document.getElementById(id);
        if (el) observer.observe(el);
      });

      // Also observe the top of the page for 'home'
      const topEl = document.querySelector('.pt-24');
      if (topEl) observer.observe(topEl);

      return () => observer.disconnect();
    }
  }, [view]);

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title={t.seo.title}
        description={t.seo.description}
        lang={lang}
      />
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
        {view === 'home' ? (
          <>
            <Hero t={t} scrollToSection={scrollToSection} />

            {/* Bloc 1: Carousel des 3 meilleurs tours */}
            <TopToursCarousel
              tours={tours}
              lang={lang}
              t={t}
              onTourClick={handleTourClick}
            />

            {/* Bloc 2: Carousel par type de tour */}
            <CategoryToursCarousel
              tours={tours}
              lang={lang}
              t={t}
              onTourClick={handleTourClick}
            />

            {/* Bloc 3: About Hook */}
            <section className="py-20 bg-amber-600 text-white overflow-hidden relative">
              <div className="container-custom relative z-10 text-center">
                <h2 className="text-3xl md:text-5xl font-bold mb-8 max-w-4xl mx-auto leading-tight">
                  {t.about_hook.title}
                </h2>
                <Button
                  onClick={() => setView('about')}
                  className="bg-white text-amber-600 hover:bg-gray-100 rounded-full h-16 px-10 text-lg font-bold transition-all shadow-xl"
                >
                  {t.about_hook.cta}
                </Button>
              </div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
            </section>

            <Testimonials t={t} testimonials={testimonials} />
            <Contact t={t} instagramUrl={instagramUrl} />
          </>
        ) : (
          <AboutPage
            t={t}
            guidePhoto={guidePhoto}
            guideBio={guideBio}
            onBackToHome={() => setView('home')}
          />
        )}
      </main>

      <Footer t={t} instagramUrl={instagramUrl} />

      <TourDialog
        tour={viewedTour}
        isOpen={isTourDialogOpen}
        onOpenChange={setIsTourDialogOpen}
        lang={lang}
        t={t}
        onBookNow={(tour) => handleBookingStart(tour)}
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

      {!isBookingOpen && !isTourDialogOpen && !isLiveJoinOpen && <WhatsAppButton lang={lang} />}
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
