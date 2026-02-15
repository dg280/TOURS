import { useState, useEffect } from 'react';
import { translations, type Language } from './lib/translations';
import { supabase } from './lib/supabase';
import { Toaster } from '@/components/ui/sonner';
import { CookieConsent } from './components/CookieConsent';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Hero } from './components/sections/Hero';
import { TourCard } from './components/sections/TourCard';
import { TourDialog } from './components/sections/TourDialog';
import { Guide } from './components/sections/Guide';
import { Features } from './components/sections/Features';
import { Testimonials } from './components/sections/Testimonials';
import { Contact } from './components/sections/Contact';
import { BookingModal } from './components/booking/BookingModal';
import { SEO } from './components/SEO';
import { WhatsAppButton } from './components/WhatsAppButton';
import type { Tour } from './lib/types';
import './App.css';

function App() {
  const [lang, setLang] = useState<Language>('fr');
  const t = translations[lang];

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
  const [isTourDialogOpen, setIsTourDialogOpen] = useState(false);
  const [viewedTour, setViewedTour] = useState<Tour | null>(null);

  const [guidePhoto, setGuidePhoto] = useState('/guide-antoine.jpg');
  const [instagramUrl, setInstagramUrl] = useState('https://www.instagram.com/tours_and_detours_bcn/');
  const [customTours, setCustomTours] = useState<Tour[]>([]);
  const [dbTours, setDbTours] = useState<Tour[]>([]);
  // suppresses unused warning but keeps it for potential future browser-side cookie logic
  const [showCookieConsent, setShowCookieConsent] = useState(false);

  useEffect(() => {
    (window as any).__FORCE_HIDE_COOKIES = () => {
      console.log('WINDOW: Force hiding cookies...');
      setShowCookieConsent(false);
    };
  }, []);

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
          const mapped = toursData.map(t => ({
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
            meetingPointMapUrl: t.meeting_point_map_url
          }));
          setDbTours(mapped as Tour[]);
        }

        // Fetch site_config
        const { data: configData, error: configError } = await supabase.from('site_config').select('*').eq('id', 1).maybeSingle();
        if (configError) console.error('Error fetching site_config:', configError);
        else if (configData) {
          const config = configData;
          if (config.guide_photo) setGuidePhoto(config.guide_photo);
          if (config.instagram_url) setInstagramUrl(config.instagram_url);
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

    // Merge logic: Start with hardcoded translations, then overwrite with DB/Custom if present
    const tour = {
      ...base,
      ...(db || {}),
      ...(custom || {})
    };

    if (lang === 'en') {
      return {
        ...tour,
        title: db?.title_en || custom?.title_en || base.title,
        subtitle: db?.subtitle_en || custom?.subtitle_en || base.subtitle,
        description: db?.description_en || custom?.description_en || base.description,
        highlights: db?.highlights_en || custom?.highlights_en || base.highlights,
        itinerary: db?.itinerary_en || custom?.itinerary_en || base.itinerary,
        included: db?.included_en || custom?.included_en || base.included,
        notIncluded: db?.notIncluded_en || custom?.notIncluded_en || base.notIncluded,
        meetingPoint: db?.meetingPoint_en || custom?.meetingPoint_en || base.meetingPoint
      };
    } else if (lang === 'es') {
      return {
        ...tour,
        title: db?.title_es || custom?.title_es || base.title,
        subtitle: db?.subtitle_es || custom?.subtitle_es || base.subtitle,
        description: db?.description_es || custom?.description_es || base.description,
        highlights: db?.highlights_es || custom?.highlights_es || base.highlights,
        itinerary: db?.itinerary_es || custom?.itinerary_es || base.itinerary,
        included: db?.included_es || custom?.included_es || base.included,
        notIncluded: db?.notIncluded_es || custom?.notIncluded_es || base.notIncluded,
        meetingPoint: db?.meetingPoint_es || custom?.meetingPoint_es || base.meetingPoint
      };
    }
    return tour;
  });

  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false);
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

  // Use translated testimonials from translations.ts
  const testimonials = (t as any).testimonials_data || [];

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
        handleBookingStart={() => handleBookingStart()}
        t={t}
      />

      <main>
        <Hero t={t} scrollToSection={scrollToSection} />

        <section id="tours" className="section-padding bg-white relative">
          <div className="container-custom">
            <div className="text-center mb-16">
              <p className="text-amber-600 font-medium mb-2">{t.tours.section_tag}</p>
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
                {(t as any).tours.section_title}
              </h2>
              <p className="text-gray-500 max-w-2xl mx-auto">
                {(t as any).tours.section_desc}
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {tours.map((tour, index) => (
                <TourCard
                  key={tour.id}
                  tour={tour}
                  index={index}
                  t={t}
                  onClick={() => { setViewedTour(tour); setIsTourDialogOpen(true); }}
                />
              ))}
            </div>
          </div>
        </section>

        <Guide t={t} guidePhoto={guidePhoto} instagramUrl={instagramUrl} scrollToSection={scrollToSection} />

        <Features t={t} />

        <Testimonials t={t} testimonials={testimonials} />

        <Contact t={t} instagramUrl={instagramUrl} />
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

      <WhatsAppButton lang={lang} />
      {showCookieConsent && (
        <CookieConsent
          lang={lang}
          onAccept={() => {
            console.log('APP: Cookie consent onAccept triggered');
            setShowCookieConsent(false);
          }}
        />
      )}
      <Toaster position="top-center" richColors />
    </div>
  );
}

export default App;
