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
import { LiveJoinDialog } from './components/live/LiveJoinDialog';
import { BookingModal } from './components/booking/BookingModal';
import { SEO } from './components/SEO';
import { WhatsAppButton } from './components/WhatsAppButton';
import type { Tour } from './lib/types';
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
  // suppresses unused warning but keeps it for potential future browser-side cookie logic
  const [showCookieConsent, setShowCookieConsent] = useState(false);

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

    const consent = localStorage.getItem('cookie-consent');
    if (!consent) setShowCookieConsent(true);

    const savedPhoto = localStorage.getItem('td-guide-photo');
    if (savedPhoto) setGuidePhoto(savedPhoto);

    const savedTours = localStorage.getItem('td-tours');
    if (savedTours) setCustomTours(JSON.parse(savedTours));

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
            images: t.images || []
          }));
          setDbTours(mapped as Tour[]);
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
  }, []);

  const tours: Tour[] = t.tour_data.map((base: any) => {
    const db = dbTours.find(d => Number(d.id) === Number(base.id));
    const custom = customTours.find(c => Number(c.id) === Number(base.id));

    // Helper to merge fields while prioritizing non-empty values
    const getVal = (baseVal: any, dbVal: any, customVal: any) => {
      const val = customVal ?? dbVal ?? baseVal;
      if (Array.isArray(val)) return val.length > 0 ? val : baseVal;
      if (typeof val === 'string') return val.trim() !== '' ? val : baseVal;
      return val ?? baseVal;
    };

    // Base merged tour (French by default)
    const tour: Tour = {
      ...base,
      title: getVal(base.title, db?.title, custom?.title),
      subtitle: getVal(base.subtitle, db?.subtitle, custom?.subtitle),
      description: getVal(base.description, db?.description, custom?.description),
      highlights: getVal(base.highlights, db?.highlights, custom?.highlights),
      itinerary: getVal(base.itinerary, db?.itinerary, custom?.itinerary),
      included: getVal(base.included, db?.included, custom?.included),
      notIncluded: getVal(base.notIncluded, db?.notIncluded, custom?.notIncluded),
      meetingPoint: getVal(base.meetingPoint, db?.meetingPoint, custom?.meetingPoint),
      price: db?.price ?? custom?.price ?? base.price,
      image: getVal(base.image, db?.image, custom?.image),
      duration: getVal(base.duration, db?.duration, custom?.duration),
      groupSize: getVal(base.groupSize, db?.groupSize, custom?.groupSize),
    };

    if (lang === 'en') {
      return {
        ...tour,
        title: getVal(base.title, db?.title_en, custom?.title_en),
        subtitle: getVal(base.subtitle, db?.subtitle_en, custom?.subtitle_en),
        description: getVal(base.description, db?.description_en, custom?.description_en),
        highlights: getVal(base.highlights, db?.highlights_en, custom?.highlights_en),
        itinerary: getVal(base.itinerary, db?.itinerary_en, custom?.itinerary_en),
        included: getVal(base.included, db?.included_en, custom?.included_en),
        notIncluded: getVal(base.notIncluded, db?.notIncluded_en, custom?.notIncluded_en),
        meetingPoint: getVal(base.meetingPoint, db?.meetingPoint_en, custom?.meetingPoint_en),
      };
    } else if (lang === 'es') {
      return {
        ...tour,
        title: getVal(base.title, db?.title_es, custom?.title_es),
        subtitle: getVal(base.subtitle, db?.subtitle_es, custom?.subtitle_es),
        description: getVal(base.description, db?.description_es, custom?.description_es),
        highlights: getVal(base.highlights, db?.highlights_es, custom?.highlights_es),
        itinerary: getVal(base.itinerary, db?.itinerary_es, custom?.itinerary_es),
        included: getVal(base.included, db?.included_es, custom?.included_es),
        notIncluded: getVal(base.notIncluded, db?.notIncluded_es, custom?.notIncluded_es),
        meetingPoint: getVal(base.meetingPoint, db?.meetingPoint_es, custom?.meetingPoint_es),
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
  }, [dbTours, customTours]); // Re-run when tours are fetched

  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false);

    // If on about page and target is a home section, switch to home first
    if (view === 'about' && ['top-tours', 'category-tours', 'contact'].includes(id)) {
      setView('home');
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          const navHeight = 80;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - navHeight;
          window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        }
      }, 100);
      return;
    }

    const element = document.getElementById(id);
    if (element) {
      const navHeight = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navHeight;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  const handleBookingStart = (tour?: Tour) => {
    setSelectedTour(tour || tours[0]);
    setIsBookingOpen(true);
  };

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title={lang === 'fr' ? "Tours & Detours | Barcelona" : lang === 'en' ? "Tours & Detours | Barcelona" : "Tours & Detours | Barcelona"}
        description={lang === 'fr' ? t.hero.subtitle : lang === 'en' ? t.hero.subtitle : t.hero.subtitle}
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
      />

      <main>
        {view === 'home' ? (
          <>
            <Hero t={t} scrollToSection={scrollToSection} />

            {/* Bloc 1: Carousel des 3 meilleurs tours */}
            <TopToursCarousel
              tours={tours}
              t={t}
              onTourClick={(tour) => { setViewedTour(tour); setIsTourDialogOpen(true); }}
            />

            {/* Bloc 2: Carousel par type de tour */}
            <CategoryToursCarousel
              tours={tours}
              t={t}
              onTourClick={(tour) => { setViewedTour(tour); setIsTourDialogOpen(true); }}
            />

            {/* Bloc 3: About Hook */}
            <section className="py-20 bg-amber-600 text-white overflow-hidden relative">
              <div className="container-custom relative z-10 text-center">
                <h2 className="text-3xl md:text-5xl font-bold mb-8 max-w-4xl mx-auto leading-tight">
                  {lang === 'fr' ? "Une approche humaine et authentique pour découvrir la vraie Catalogne." : "A human and authentic approach to discover the real Catalonia."}
                </h2>
                <Button
                  onClick={() => setView('about')}
                  className="bg-white text-amber-600 hover:bg-gray-100 rounded-full h-16 px-10 text-lg font-bold transition-all shadow-xl"
                >
                  {lang === 'fr' ? "En savoir plus sur votre guide →" : "Learn more about your guide →"}
                </Button>
              </div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
            </section>
          </>
        ) : (
          <AboutPage
            t={t}
            guidePhoto={guidePhoto}
            guideBio={guideBio}
            lang={lang}
            onBackToHome={() => setView('home')}
          />
        )}
      </main>

      <Footer t={t} instagramUrl={instagramUrl} />

      <TourDialog
        tour={viewedTour}
        isOpen={isTourDialogOpen}
        onOpenChange={setIsTourDialogOpen}
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

      {!isBookingOpen && <WhatsAppButton lang={lang} />}
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
