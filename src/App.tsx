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
  // const [, setShowCookieConsent] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const savedPhoto = localStorage.getItem('td-guide-photo');
    if (savedPhoto) setGuidePhoto(savedPhoto);

    const savedTours = localStorage.getItem('td-tours');
    if (savedTours) setCustomTours(JSON.parse(savedTours));

    if (supabase) {
      supabase.from('tours').select('*')
        .then(({ data, error }) => {
          if (!error && data && data.length > 0) {
            const mapped = data.map(t => ({
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
              meetingPointMapUrl: t.meeting_point_map_url
            }));
            setDbTours(mapped as Tour[]);
          }
        });

      supabase.from('site_config').select('*').eq('id', 1).single()
        .then(({ data, error }) => {
          if (!error && data) {
            if (data.guide_photo) setGuidePhoto(data.guide_photo);
            if (data.instagram_url) setInstagramUrl(data.instagram_url);
          }
        });
    }
  }, []);

  const tours: Tour[] = t.tour_data.map((base: any) => {
    const db = dbTours.find(d => d.id === base.id);
    const custom = customTours.find(c => c.id === base.id);
    const tour = custom ? { ...base, ...custom } : db ? { ...base, ...db } : base;

    if (lang === 'en') {
      return {
        ...tour,
        title: tour.title_en || tour.title,
        subtitle: tour.subtitle_en || tour.subtitle,
        description: tour.description_en || tour.description,
        highlights: tour.highlights_en || tour.highlights,
        itinerary: tour.itinerary_en || tour.itinerary,
        included: tour.included_en || tour.included,
        notIncluded: tour.notIncluded_en || tour.notIncluded,
        meetingPoint: tour.meetingPoint_en || tour.meetingPoint
      };
    } else if (lang === 'es') {
      return {
        ...tour,
        title: tour.title_es || tour.title,
        subtitle: tour.subtitle_es || tour.subtitle,
        description: tour.description_es || tour.description,
        highlights: tour.highlights_es || tour.highlights,
        itinerary: tour.itinerary_es || tour.itinerary,
        included: tour.included_es || tour.included,
        notIncluded: tour.notIncluded_es || tour.notIncluded,
        meetingPoint: tour.meetingPoint_es || tour.meetingPoint
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

      <CookieConsent lang={lang} onAccept={() => { }} />
      <Toaster position="top-center" richColors />
    </div>
  );
}

export default App;
