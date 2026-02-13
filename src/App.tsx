import { useState, useEffect } from 'react';
import {
  MapPin,
  Clock,
  Users,
  Star,
  Phone,
  Mail,
  Instagram,
  Menu,
  X,
  ChevronRight,
  Calendar,
  CheckCircle2,
  Check,
  CreditCard,
  Loader2,
  Minus,
  Plus,
  Compass,
  Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { translations, type Language } from './lib/translations';
import { supabase } from './lib/supabase';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { CheckoutForm } from './components/CheckoutForm';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import './App.css';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');

interface Tour {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  duration: string;
  groupSize: string;
  price: number;
  image: string;
  category: string;
  highlights: string[];
  stripeLink?: string;
  itinerary?: string[];
  included?: string[];
  notIncluded?: string[];
  meetingPoint?: string;
  meetingPointMapUrl?: string;
}

function App() {
  const [lang, setLang] = useState<Language>('fr');
  const t = translations[lang];

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
  const [bookingStep, setBookingStep] = useState(1);
  const [participants, setParticipants] = useState(2);
  const [bookingDate, setBookingDate] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  // suppresses lint while keeping usage in effects/handlers
  console.log('Processing state:', isProcessing);
  const [showCookieConsent, setShowCookieConsent] = useState(false);
  const [guidePhoto, setGuidePhoto] = useState('/guide-antoine.jpg');
  const [instagramUrl, setInstagramUrl] = useState('https://www.instagram.com/tours_and_detours_bcn/');
  const [customTours, setCustomTours] = useState<Tour[]>([]);
  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
    if (selectedTour && bookingStep === 3 && !clientSecret) {
      // Create PaymentIntent as soon as the step is reached
      fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tourId: selectedTour.id,
          participants: participants
        }),
      })
        .then(async (res) => {
          const contentType = res.headers.get("content-type");
          if (!res.ok) {
            if (contentType && contentType.includes("application/json")) {
              const errorData = await res.json();
              throw new Error(errorData.error || "Erreur serveur");
            } else {
              throw new Error(`Erreur serveur (${res.status})`);
            }
          }
          if (!contentType || !contentType.includes("application/json")) {
            throw new Error("Réponse serveur invalide (Non-JSON)");
          }
          return res.json();
        })
        .then((data) => {
          if (data.clientSecret) {
            setClientSecret(data.clientSecret);
          }
        })
        .catch(err => {
          console.error('Payment Init Error:', err);
          toast.error(lang === 'fr'
            ? "Impossible d'initialiser le paiement : " + err.message
            : "Could not initialize payment: " + err.message);
          setBookingStep(2);
        });
    }
  }, [selectedTour, bookingStep, clientSecret, participants, lang]);

  // Reset clientSecret if critical booking info changes
  useEffect(() => {
    setClientSecret('');
  }, [selectedTour, participants]);

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
              subtitle: t.subtitle,
              description: t.description,
              duration: t.duration,
              groupSize: t.group_size,
              price: t.price,
              image: t.image,
              category: t.category,
              highlights: t.highlights,
              isActive: t.is_active,
              stripeLink: t.stripe_link || '',
              itinerary: t.itinerary,
              included: t.included,
              notIncluded: t.not_included,
              meetingPoint: t.meeting_point
            }));
            setCustomTours(mapped as Tour[]);
          }
        });
      // Fetch Profile Photo from site_config
      supabase.from('site_config').select('value').eq('key', 'guide_profile').single()
        .then(({ data, error }) => {
          if (!error && data && data.value) {
            const val = data.value as { photo?: string; instagram?: string };
            if (val.photo) setGuidePhoto(val.photo);
            if (val.instagram) setInstagramUrl(val.instagram);
          }
        });
    }
  }, []);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    cardNumber: '',
    expiry: '',
    cvc: ''
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    // Cookie consent check
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setShowCookieConsent(true);
    }

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Update document title and meta tags when language changes
  useEffect(() => {
    document.title = t.seo.title;
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', t.seo.description);
  }, [lang, t]);

  const tours: Tour[] = t.tour_data.map((base: any) => {
    // Look for a customization (DB) for this tour ID
    const custom = customTours.find(c => c.id === base.id);
    const tour = custom ? { ...base, ...custom } : base;

    return {
      ...tour,
      image: tour.image || (
        base.id === 1 ? '/tour-girona.jpg' :
          base.id === 2 ? '/tour-barcelona-hidden.jpg' :
            base.id === 3 ? '/tour-camironda.jpg' :
              base.id === 4 ? '/tour-prepirinees.jpg' :
                base.id === 5 ? '/tour-kayak.jpg' :
                  base.id === 6 ? '/tour-montserrat.jpg' : '/tour-collioure.jpg'
      ),
      category: tour.category || (
        base.id === 1 ? 'Culture & Nature' :
          base.id === 2 ? 'Culture' :
            base.id === 3 ? 'Randonnée' :
              base.id === 4 ? 'Randonnée & Patrimoine' :
                base.id === 5 ? 'Aventure' :
                  base.id === 6 ? 'Culture & Vin' : 'Culture & Gastronomie'
      ),
      itinerary: tour.itinerary || [
        "09:00 - Départ de Barcelone",
        "10:30 - Visite guidée du coeur historique",
        "13:00 - Pause déjeuner traditionnelle",
        "15:00 - Découverte des sites secrets",
        "17:30 - Retour à Barcelone"
      ],
      included: tour.included || [
        "Guide privé expert",
        "Transport climatisé",
        "Toutes les entrées",
        "Bouteilles d'eau"
      ],
      notIncluded: tour.notIncluded || [
        "Déjeuner",
        "Dépenses personnelles",
        "Pourboires"
      ],
      meetingPoint: tour.meetingPoint || "23 Passeig de Gràcia, Eixample, 08007 Barcelone"
    } as Tour;
  });

  const testimonials = t.testimonials_data;

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  const handleBookingStart = (tour: Tour) => {
    setSelectedTour(tour);
    setBookingStep(1);
    setIsBookingOpen(true);
    // Default date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setBookingDate(tomorrow.toISOString().split('T')[0]);
  };

  const calculateTotal = () => {
    if (!selectedTour) return 0;
    const price = selectedTour.price;
    return (typeof price === 'number' ? price : parseInt(String(price))) * participants;
  };

  const nextStep = () => {
    if (bookingStep === 1) {
      if (!bookingDate) {
        toast.error(lang === 'fr' ? 'Veuillez choisir une date' : 'Please select a date');
        return;
      }
      setBookingStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (bookingStep === 2) {
      if (!formData.name || !formData.email) {
        toast.error(lang === 'fr' ? 'Veuillez remplir vos coordonnées' : 'Please fill your contact details');
        return;
      }
      // Trigger Payment Intent creation when moving to step 3
      setClientSecret('');
      setBookingStep(3);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (bookingStep === 3) {
      setIsProcessing(true);

      const newReservation = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        tour_id: selectedTour?.id.toString(),
        tour_name: selectedTour?.title,
        date: bookingDate,
        participants: participants,
        total_price: calculateTotal(),
        status: 'pending' as const,
        message: '',
      };

      // Save to Supabase
      if (supabase) {
        supabase.from('reservations').insert(newReservation).then(({ error }) => {
          if (error) {
            console.error('Supabase error:', error);
            toast.error("Erreur d'enregistrement sur le serveur.");
          }
        });
      } else {
        console.warn('Supabase client not initialized. Skipping remote reservation save.');
      }

      // Maintain localStorage for redundancy
      const savedReservations = JSON.parse(localStorage.getItem('td-reservations') || '[]');
      localStorage.setItem('td-reservations', JSON.stringify([...savedReservations, { ...newReservation, id: `TD-${Math.floor(Math.random() * 100000)}`, createdAt: new Date().toISOString() }]));

      if (selectedTour?.stripeLink) {
        let finalLink = selectedTour.stripeLink;
        const separator = finalLink.includes('?') ? '&' : '?';
        finalLink += `${separator}quantity=${participants}&prefilled_email=${encodeURIComponent(formData.email)}`;
        window.open(finalLink, '_blank');
        setIsProcessing(false);
        setBookingStep(4);
      } else {
        setTimeout(() => {
          setIsProcessing(false);
          setBookingStep(4);
        }, 2000);
      }
    } else {
      setBookingStep(bookingStep + 1);
    }
  };

  const sanitize = (str: string) => {
    return str.replace(/[&<>"']/g, (m) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[m] || m));
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhone = (phone: string) => {
    return /^\+?[0-9\s\-()]{7,20}$/.test(phone);
  };

  const handleAcceptCookies = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setShowCookieConsent(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
          ? 'bg-white/90 nav-blur shadow-lg py-3'
          : 'bg-transparent py-5'
          }`}
      >
        <div className="container-custom flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className={`w-6 h-6 ${isScrolled ? 'text-amber-600' : 'text-white'}`} />
            <span className={`text-xl font-semibold font-serif ${isScrolled ? 'text-gray-900' : 'text-white'}`}>
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
              onClick={() => handleBookingStart(tours[0])}
              className="bg-amber-600 hover:bg-amber-700 text-white btn-hover"
            >
              {t.nav.reserve}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
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
                onClick={() => handleBookingStart(tours[0])}
                className="bg-amber-600 hover:bg-amber-700 text-white w-full mt-2"
              >
                {t.nav.reserve}
              </Button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* Background Video or Image */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
            poster="/tour-camironda.jpg"
          >
            <source src="https://assets.mixkit.co/videos/preview/mixkit-tossa-de-mar-coastal-scenery-41957-large.mp4" type="video/mp4" />
          </video>
        </div>
        <div className="absolute inset-0 hero-gradient z-1" />

        <div className="relative z-10 container-custom text-center text-white">
          <div className="animate-fade-in-up">
            <p className="text-lg md:text-xl mb-4 font-light tracking-wide">
              {t.hero.tagline}
            </p>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 leading-tight">
              {t.hero.title}
            </h1>
            <p className="text-xl md:text-2xl mb-8 font-medium text-amber-400">
              {t.hero.subtitle}
            </p>
            <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8 text-white/90">
              {t.hero.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => scrollToSection('tours')}
                className="bg-amber-600 hover:bg-amber-700 text-white btn-hover text-lg px-8 py-7"
              >
                {t.hero.cta_discover}
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => scrollToSection('contact')}
                className="bg-transparent border-white text-white hover:bg-white/10 text-lg px-8 py-7"
              >
                {t.hero.cta_contact}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Tours Section */}
      <section id="tours" className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <p className="text-amber-600 font-medium mb-2">{t.tours.section_tag}</p>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
              {t.tours.section_title}
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              {t.tours.section_desc}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tours.map((tour, index) => (
              <Dialog key={tour.id}>
                <DialogTrigger asChild>
                  <div
                    onClick={() => setSelectedTour(tour)}
                    className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col cursor-pointer"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={tour.image}
                        alt={tour.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-white/90 text-gray-800">
                          {tour.category}
                        </Badge>
                      </div>
                      <div className="absolute top-3 right-3 bg-amber-600 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                        {t.tours.from_price} {tour.price}€
                      </div>
                    </div>
                    <div className="p-5 flex-1 flex flex-col">
                      <p className="text-xs text-amber-600 font-medium uppercase tracking-wide mb-1">{tour.subtitle}</p>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{tour.title}</h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{tour.description}</p>

                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {tour.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {tour.groupSize}
                        </span>
                      </div>

                      <div className="mb-4">
                        <p className="text-xs text-gray-500 mb-2">{t.tours.learn_more} :</p>
                        <div className="flex flex-wrap gap-1">
                          {tour.highlights.map((highlight, i) => (
                            <span
                              key={i}
                              className="text-xs bg-amber-50 text-amber-700 px-2 py-1 rounded"
                            >
                              {highlight}
                            </span>
                          ))}
                        </div>
                      </div>

                      <Button
                        className="w-full mt-auto bg-gray-900 hover:bg-gray-800 text-white"
                      >
                        {t.tours.learn_more}
                      </Button>
                    </div>
                  </div>
                </DialogTrigger>
                <DialogContent className="w-[95vw] sm:max-w-5xl h-[90vh] p-0 rounded-2xl border-none shadow-2xl overflow-hidden flex flex-col bg-white">
                  <div className="flex-1 overflow-y-auto custom-scrollbar p-6 sm:p-10">
                    <DialogHeader className="mb-8">
                      <DialogTitle className="text-3xl sm:text-4xl font-serif mb-2 text-gray-900">{tour.title}</DialogTitle>
                      <p className="text-amber-600 font-semibold uppercase tracking-widest text-sm">{tour.subtitle}</p>
                    </DialogHeader>

                    <div className="grid lg:grid-cols-3 gap-10">
                      {/* Left Column: Media & Tabs */}
                      <div className="lg:col-span-2 space-y-6">
                        <div className="aspect-video rounded-xl overflow-hidden shadow-md">
                          <img
                            src={tour.image}
                            alt={tour.title}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <Tabs defaultValue="desc" className="w-full">
                          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto p-1 bg-amber-50/50 border border-amber-100 rounded-xl">
                            <TabsTrigger value="desc" className="py-2.5 text-xs sm:text-sm">{t.tours.tabs.desc}</TabsTrigger>
                            <TabsTrigger value="itin" className="py-2.5 text-xs sm:text-sm">{t.tours.tabs.itin}</TabsTrigger>
                            <TabsTrigger value="incl" className="py-2.5 text-xs sm:text-sm">{t.tours.tabs.incl}</TabsTrigger>
                            <TabsTrigger value="meet" className="py-2.5 text-xs sm:text-sm">{t.tours.tabs.meet}</TabsTrigger>
                          </TabsList>

                          <TabsContent value="desc" className="mt-4 prose prose-amber">
                            <p className="text-gray-600 leading-relaxed text-lg">
                              {tour.description}
                            </p>
                            <div className="mt-6">
                              <h4 className="font-bold text-gray-900 mb-4">Points forts :</h4>
                              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {tour.highlights.map((h, i) => (
                                  <li key={i} className="flex items-start gap-2 text-gray-600">
                                    <CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                                    <span>{h}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </TabsContent>

                          <TabsContent value="itin" className="mt-4">
                            <div className="space-y-4">
                              {tour.itinerary?.map((step, i) => (
                                <div key={i} className="flex gap-4 items-start">
                                  <div className="w-px h-full bg-amber-200 relative">
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-amber-500" />
                                  </div>
                                  <div className="pb-4">
                                    <p className="text-gray-700 font-medium">{step}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </TabsContent>

                          <TabsContent value="incl" className="mt-4 grid md:grid-cols-2 gap-8">
                            <div>
                              <h4 className="font-bold text-green-700 mb-3 flex items-center gap-2">
                                <Check className="w-5 h-5" /> Inclus
                              </h4>
                              <ul className="space-y-2">
                                {tour.included?.map((item, i) => (
                                  <li key={i} className="text-sm text-gray-600 flex gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5" />
                                    {item}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h4 className="font-bold text-red-700 mb-3 flex items-center gap-2">
                                <X className="w-5 h-5" /> Non Inclus
                              </h4>
                              <ul className="space-y-2">
                                {tour.notIncluded?.map((item, i) => (
                                  <li key={i} className="text-sm text-gray-600 flex gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5" />
                                    {item}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </TabsContent>

                          <TabsContent value="meet" className="mt-4">
                            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                              <div className="flex items-start gap-3 mb-4">
                                <MapPin className="w-6 h-6 text-amber-600 shrink-0" />
                                <p className="text-gray-700 font-medium">{tour.meetingPoint}</p>
                              </div>
                              {tour.meetingPointMapUrl ? (
                                <div className="aspect-video rounded-lg overflow-hidden border border-gray-200">
                                  <iframe
                                    src={tour.meetingPointMapUrl}
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                  ></iframe>
                                </div>
                              ) : tour.meetingPoint?.startsWith('https://www.google.com/maps/embed') ? (
                                <div className="aspect-video rounded-lg overflow-hidden border border-gray-200">
                                  <iframe
                                    src={tour.meetingPoint}
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                  ></iframe>
                                </div>
                              ) : tour.meetingPoint?.includes('google.com/maps') ? (
                                <div className="aspect-video bg-gray-100 rounded-lg flex flex-col items-center justify-center text-gray-600 p-8 text-center border">
                                  <MapPin className="w-10 h-10 mb-3 text-amber-600 opacity-50" />
                                  <p className="font-medium mb-4">{tour.meetingPoint}</p>
                                  <Button
                                    variant="outline"
                                    className="border-amber-600 text-amber-600 hover:bg-amber-50"
                                    onClick={() => window.open(tour.meetingPoint, '_blank')}
                                  >
                                    Ouvrir dans Google Maps
                                  </Button>
                                </div>
                              ) : (
                                <div className="aspect-video bg-gray-50 rounded-lg flex flex-col items-center justify-center text-gray-400 p-8 text-center">
                                  <MapPin className="w-10 h-10 mb-3 opacity-20" />
                                  <p className="italic text-sm">
                                    {lang === 'fr'
                                      ? "Localisation précise disponible après réservation."
                                      : lang === 'es'
                                        ? "Ubicación precisa disponible después de la reserva."
                                        : "Precise location available after booking."}
                                  </p>
                                </div>
                              )}
                            </div>
                          </TabsContent>
                        </Tabs>
                      </div>

                      {/* Right Column: Sticky Booking Widget */}
                      <div className="lg:col-span-1">
                        <div className="sticky top-0 bg-white border border-amber-100 rounded-2xl p-6 shadow-xl ring-1 ring-amber-500/10">
                          <div className="mb-6 pb-6 border-b border-gray-100">
                            <div className="flex items-baseline gap-2 mb-1">
                              <span className="text-3xl font-bold text-gray-900">{tour.price}€</span>
                              <span className="text-gray-500 text-sm">/ {t.tours.per_person}</span>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-400">
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" /> {tour.duration}
                              </span>
                              <span className="flex items-center gap-1">
                                <Users className="w-4 h-4" /> {tour.groupSize}
                              </span>
                            </div>
                          </div>

                          <div className="space-y-4 mb-6">
                            <div className="space-y-2">
                              <Label className="text-xs font-bold uppercase text-gray-500">{t.booking.date_label}</Label>
                              <Input
                                type="date"
                                value={bookingDate}
                                onChange={(e) => setBookingDate(e.target.value)}
                                className="w-full h-11 border-gray-200"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-xs font-bold uppercase text-gray-500">{t.booking.participants}</Label>
                              <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg border border-gray-100">
                                <button
                                  onClick={() => setParticipants(Math.max(1, participants - 1))}
                                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-white transition-colors"
                                >
                                  <Minus className="w-4 h-4" />
                                </button>
                                <span className="font-bold">{participants}</span>
                                <button
                                  onClick={() => setParticipants(Math.min(16, participants + 1))}
                                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-white transition-colors"
                                >
                                  <Plus className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                            <div className="pt-2 flex justify-between items-center text-lg font-bold text-gray-900">
                              <span>Total</span>
                              <span className="text-amber-600">{participants * tour.price}€</span>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <Button
                              onClick={() => {
                                setSelectedTour(tour);
                                setBookingStep(2); // Skip Step 1 (Date/Participants)
                                setIsBookingOpen(true);
                              }}
                              className="w-full bg-amber-600 hover:bg-amber-700 text-white py-6 text-lg font-bold shadow-lg shadow-amber-200"
                            >
                              {t.tours.book_now}
                            </Button>
                            <p className="text-center text-xs text-gray-400">
                              Paiement sécurisé via Stripe
                            </p>
                          </div>

                          <div className="mt-8 pt-6 border-t border-gray-100 space-y-4">
                            <div className="flex items-start gap-3">
                              <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                              <div>
                                <p className="text-sm font-bold">Confirmation instantanée</p>
                                <p className="text-xs text-gray-500">Recevez vos billets par email immédiatement.</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-3">
                              <Info className="w-5 h-5 text-amber-600 mt-0.5" />
                              <div>
                                <p className="text-sm font-bold">Annulation flexible</p>
                                <p className="text-xs text-gray-500">Annulation gratuite jusqu'à 24h avant.</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            ))}
          </div>
        </div>
      </section>

      {/* About Guide Section */}
      <section id="guide" className="section-padding bg-amber-50">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={guidePhoto}
                  alt="Antoine Pilard - Votre guide"
                  className="w-full h-[500px] object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-xl shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="bg-amber-100 p-3 rounded-full">
                    <Star className="w-6 h-6 text-amber-600 fill-amber-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">5.0</p>
                    <p className="text-sm text-gray-500">{t.nav.avis}</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <p className="text-amber-600 font-medium mb-2">{t.guide.section_tag}</p>
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
                {t.guide.title.split('Antoine')[0]} <span className="text-amber-600">Antoine Pilard</span>
              </h2>
              <p className="text-gray-600 text-lg mb-6">
                {t.guide.desc1}
              </p>
              <p className="text-gray-600 mb-8">
                {t.guide.desc2}
              </p>

              <div className="grid grid-cols-2 gap-4 mb-8">
                {t.guide.features.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-amber-600" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={() => scrollToSection('contact')}
                  className="bg-amber-600 hover:bg-amber-700 text-white btn-hover"
                >
                  {t.guide.cta_contact}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => scrollToSection('tours')}
                  className="border-gray-300"
                >
                  {t.guide.cta_tours}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <p className="text-amber-600 font-medium mb-2">{t.features.tag}</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t.features.title}
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Users, title: t.stats.groups, desc: t.features.items[0].desc },
              { icon: MapPin, title: t.stats.guides, desc: t.features.items[1].desc },
              { icon: Star, title: t.stats.authentic, desc: t.features.items[2].desc },
            ].map((feature, index) => (
              <div key={index} className="text-center p-8 bg-amber-50/50 rounded-2xl border border-amber-100/50 hover:shadow-lg transition-all">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                  <feature.icon className="w-8 h-8 text-amber-600" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="avis" className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <p className="text-amber-600 font-medium mb-2">{t.testimonials.tag}</p>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
              {t.testimonials.title}
            </h2>
          </div>

          <div className="max-w-5xl mx-auto">
            <Carousel className="w-full">
              <CarouselContent>
                {testimonials.map((testimonial) => (
                  <CarouselItem key={testimonial.id} className="md:basis-1/2 lg:basis-1/3 p-4">
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 h-full flex flex-col">
                      <div className="flex gap-1 mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-amber-500 fill-amber-500" />
                        ))}
                      </div>
                      <p className="text-gray-700 mb-6 italic flex-1 text-sm sm:text-base leading-relaxed">
                        "{testimonial.text}"
                      </p>
                      <div className="flex items-center gap-3 pt-4 border-t border-gray-50">
                        <div className="w-10 h-10 bg-amber-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          {testimonial.avatar}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-sm">{testimonial.name}</p>
                          <p className="text-[10px] text-gray-500 uppercase tracking-widest">{testimonial.loc}</p>
                        </div>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="-left-12 border-none bg-white shadow-md hover:bg-gray-50" />
              <CarouselNext className="-right-12 border-none bg-white shadow-md hover:bg-gray-50" />
            </Carousel>
          </div>
        </div>
      </section>

      {/* Contact/Booking Section */}
      <section id="contact" className="section-padding bg-gray-900 text-white">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <p className="text-amber-400 font-medium mb-2">{t.contact.tag}</p>
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                {t.contact.title}
              </h2>
              <p className="text-gray-400 text-lg mb-8">
                {t.contact.desc}
              </p>

              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-amber-600/20 rounded-full flex items-center justify-center">
                    <Phone className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">WhatsApp / Phone</p>
                    <p className="text-lg">{t.contact.whatsapp}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-amber-600/20 rounded-full flex items-center justify-center">
                    <Mail className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Email</p>
                    <p className="text-lg">antoine@toursandetours.com</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-amber-600/20 rounded-full flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Base</p>
                    <p className="text-lg">Barcelone, Catalogne</p>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <a
                    href={instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-amber-600 transition-colors"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 text-gray-900 border border-gray-100 shadow-xl">
              <h3 className="text-2xl font-bold mb-6">{t.contact.form_title}</h3>
              <form
                className="space-y-4"
                onSubmit={async (e) => {
                  e.preventDefault();
                  const form = e.currentTarget;
                  const name = (form.elements.namedItem('name') as HTMLInputElement).value;
                  const email = (form.elements.namedItem('email') as HTMLInputElement).value;
                  const tour = (form.elements.namedItem('tour') as HTMLSelectElement).value;
                  const date = (form.elements.namedItem('date') as HTMLInputElement).value;
                  const message = (form.elements.namedItem('message') as HTMLTextAreaElement).value;

                  if (!name || !email || !message) {
                    toast.error(lang === 'fr' ? "Veuillez remplir les champs obligatoires." : "Please fill in the required fields.");
                    return;
                  }

                  const loadingToast = toast.loading(lang === 'fr' ? "Envoi en cours..." : "Sending...");

                  if (supabase) {
                    const { error } = await supabase.from('reservations').insert({
                      name,
                      email,
                      phone: 'Contact Form',
                      tour_id: tour || 'General Inquiry',
                      tour_name: tours.find(t => String(t.id) === String(tour))?.title || 'Demande Générale',
                      date: date || new Date().toISOString().split('T')[0],
                      participants: 1,
                      total_price: 0,
                      status: 'pending',
                      message
                    });

                    toast.dismiss(loadingToast);
                    if (error) {
                      console.error('Submission error:', error);
                      toast.error(lang === 'fr' ? "Erreur lors de l'envoi. Veuillez réessayer." : "Error sending message. Please try again.");
                    } else {
                      toast.success(lang === 'fr' ? "Message envoyé avec succès ! Je vous répondrai très vite." : "Message sent successfully! I will get back to you soon.");
                      form.reset();
                    }
                  } else {
                    toast.dismiss(loadingToast);
                    toast.success("Simulation: Message envoyé ! (Supabase non connecté)");
                    form.reset();
                  }
                }}
              >
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">{t.contact.name}</Label>
                    <Input id="name" name="name" placeholder={t.contact.name} className="mt-1" required />
                  </div>
                  <div>
                    <Label htmlFor="email">{t.contact.email}</Label>
                    <Input id="email" name="email" type="email" placeholder="votre@email.com" className="mt-1" required />
                  </div>
                </div>
                <div>
                  <Label htmlFor="tour">{t.contact.tour}</Label>
                  <select
                    id="tour"
                    name="tour"
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="">{t.contact.select_tour}</option>
                    {tours.map(tour => (
                      <option key={tour.id} value={tour.id}>{tour.title}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="date">{t.contact.date}</Label>
                  <div className="relative mt-1">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input id="date" name="date" type="date" className="pl-10" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="message">{t.contact.message}</Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="..."
                    className="mt-1 min-h-[120px]"
                    required
                  />
                </div>
                <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700 text-white btn-hover py-6 text-lg transition-all shadow-lg active:scale-95">
                  {t.contact.cta}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Modal */}
      <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
        <DialogContent className="sm:max-w-4xl w-[95vw] p-0 overflow-hidden bg-white border-none shadow-2xl rounded-2xl max-h-[95vh] sm:max-h-[90vh] flex flex-col">
          <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
            {/* Sidebar Summary */}
            <div className="w-full md:w-72 bg-gray-50 p-4 sm:p-6 border-b md:border-b-0 md:border-r border-gray-100 shrink-0">
              <div className="mb-4 sm:mb-6">
                <Badge className="bg-amber-100 text-amber-800 border-none mb-2">{t.booking.selection}</Badge>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 leading-tight">{selectedTour?.title}</h3>
                <p className="text-xs sm:text-sm text-gray-500">{selectedTour?.subtitle}</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Calendar className="w-4 h-4 text-amber-600" />
                  <span>{bookingDate ? new Date(bookingDate).toLocaleDateString(lang === 'fr' ? 'fr-FR' : lang === 'es' ? 'es-ES' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' }) : t.contact.date}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Users className="w-4 h-4 text-amber-600" />
                  <span>{participants} {participants > 1 ? t.booking.travelers : t.booking.traveler}</span>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex justify-between items-end">
                  <span className="text-sm text-gray-500">{t.booking.total}</span>
                  <div className="text-right">
                    <p className="text-xs text-gray-400">{participants} x {selectedTour?.price}€</p>
                    <p className="text-2xl font-bold text-amber-600">{calculateTotal()}€</p>
                  </div>
                </div>
              </div>

              {bookingStep < 4 && (
                <div className="mt-6 sm:mt-8">
                  <div className="flex gap-1 mb-2">
                    {[2, 3].map(step => (
                      <div
                        key={step}
                        className={`h-1 flex-1 rounded-full ${step <= bookingStep ? 'bg-amber-600' : 'bg-gray-200'}`}
                      />
                    ))}
                  </div>
                  <p className="text-[10px] text-gray-400 text-center">{t.booking.step} {bookingStep - 1} {t.booking.step_of} 2</p>
                </div>
              )}
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-white flex flex-col">
              {bookingStep === 1 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">{t.booking.date_title}</DialogTitle>
                  </DialogHeader>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="booking-date" className="text-sm font-semibold uppercase tracking-wider text-gray-500">{t.booking.date_label}</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          id="booking-date"
                          type="date"
                          min={new Date().toISOString().split('T')[0]}
                          value={bookingDate}
                          onChange={(e) => setBookingDate(e.target.value)}
                          className="pl-10 h-12 border-gray-200 focus:ring-amber-500 bg-gray-50/50"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-semibold uppercase tracking-wider text-gray-500">{t.booking.participants}</Label>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                        <div className="text-sm text-gray-600">Total</div>
                        <div className="flex items-center gap-4">
                          <button
                            onClick={() => setParticipants(Math.max(1, participants - 1))}
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-white hover:border-amber-600 transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="text-lg font-bold w-4 text-center">{participants}</span>
                          <button
                            onClick={() => setParticipants(Math.min(16, participants + 1))}
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-white hover:border-amber-600 transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-auto pt-8">
                    <Button
                      onClick={nextStep}
                      className="w-full bg-amber-600 hover:bg-amber-700 h-12 text-lg font-semibold shadow-lg shadow-amber-600/20"
                    >
                      {t.booking.next}
                    </Button>
                  </div>
                </div>
              )}

              {bookingStep === 2 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">{t.booking.info_title}</DialogTitle>
                  </DialogHeader>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="bk-name">{t.contact.name}</Label>
                      <Input
                        id="bk-name"
                        placeholder="..."
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: sanitize(e.target.value) })}
                        className={`h-11 ${formData.name && formData.name.length < 2 ? 'border-red-500' : ''}`}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bk-email">{t.contact.email}</Label>
                      <Input
                        id="bk-email"
                        type="email"
                        placeholder="votre@email.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: sanitize(e.target.value) })}
                        className={`h-11 ${formData.email && !validateEmail(formData.email) ? 'border-red-500' : ''}`}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bk-phone">{t.contact.name === 'Nom' ? 'Téléphone' : 'Phone'}</Label>
                      <Input
                        id="bk-phone"
                        placeholder="+33 6 ..."
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: sanitize(e.target.value) })}
                        className={`h-11 ${formData.phone && !validatePhone(formData.phone) ? 'border-red-500' : ''}`}
                      />
                    </div>
                    <div className="pt-4 border-t border-gray-100 flex items-start gap-3 p-3 bg-amber-50/30 rounded-lg">
                      <input
                        type="checkbox"
                        id="gdpr"
                        required
                        className="w-4 h-4 mt-0.5 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                      />
                      <Label htmlFor="gdpr" className="text-[10px] sm:text-xs text-gray-600 leading-tight">
                        {lang === 'fr'
                          ? "J'accepte que mes données soient traitées pour la gestion de ma réservation conformément à la politique de confidentialité."
                          : lang === 'es'
                            ? "Acepto que mis datos sean procesados para la gestión de mi reserva de acuerdo con la política de privacidad."
                            : "I agree to my data being processed for the management of my reservation in accordance with the privacy policy."
                        }
                      </Label>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-auto pt-8">
                    <Button variant="outline" onClick={() => setBookingStep(1)} className="h-12 px-6">{lang === 'fr' ? 'Retour' : lang === 'es' ? 'Volver' : 'Back'}</Button>
                    <Button
                      onClick={nextStep}
                      className="flex-1 bg-amber-600 hover:bg-amber-700 h-12 text-lg font-semibold shadow-lg shadow-amber-600/20"
                    >
                      {t.booking.next}
                    </Button>
                  </div>
                </div>
              )}

              {bookingStep === 3 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">{t.booking.payment_title}</DialogTitle>
                  </DialogHeader>

                  <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                      <CreditCard className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-blue-800 font-semibold uppercase tracking-wider">
                        PAIEMENT SÉCURISÉ
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-blue-600/80 font-bold">VISA</span>
                        <span className="text-[10px] text-blue-600/80 font-bold">MASTERCARD</span>
                        <span className="text-[10px] text-blue-600/80 font-bold">AMEX</span>
                        <span className="text-[10px] text-blue-600/80 font-bold">APPLE PAY</span>
                      </div>
                    </div>
                  </div>

                  {clientSecret ? (
                    <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'stripe' as const } }}>
                      <CheckoutForm
                        amount={calculateTotal()}
                        onSuccess={() => {
                          setIsProcessing(false);
                          setBookingStep(4);
                        }}
                      />
                    </Elements>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 gap-4">
                      <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                      <p className="text-sm text-gray-500">Initialisation du paiement...</p>
                    </div>
                  )}

                  <div className="flex items-center justify-center gap-2 pt-2 text-[10px] text-gray-400">
                    <Check className="w-3 h-3 text-green-500" />
                    <span>Paiement crypté SSL par Stripe</span>
                  </div>
                </div>
              )}

              {bookingStep === 4 && (
                <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 animate-in zoom-in-95 duration-500">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-2">
                    <Check className="w-10 h-10 text-green-600" />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-3xl font-bold text-gray-900">{t.booking.success_title}</h2>
                    <p className="text-gray-600 max-w-sm">
                      {lang === 'fr'
                        ? `Merci ${formData.name.split(' ')[0]}, votre réservation est confirmée.`
                        : lang === 'es'
                          ? `Gracias ${formData.name.split(' ')[0]}, su reserva está confirmada.`
                          : `Thank you ${formData.name.split(' ')[0]}, your booking is confirmed.`}
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-xl w-full max-w-sm space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Ref</span>
                      <span className="font-mono font-bold">TD-{Math.floor(Math.random() * 100000)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Tour</span>
                      <span className="font-medium">{selectedTour?.title}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Date</span>
                      <span className="font-medium">{new Date(bookingDate).toLocaleDateString(lang === 'fr' ? 'fr-FR' : lang === 'es' ? 'es-ES' : 'en-US')}</span>
                    </div>
                  </div>

                  <Button
                    onClick={() => setIsBookingOpen(false)}
                    className="w-full max-w-sm bg-gray-900 hover:bg-gray-800 h-12"
                  >
                    {t.booking.finish}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <footer className="bg-gray-950 text-gray-400 py-20 relative overflow-hidden">
        {/* Subtle radial glow */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-600/5 rounded-full blur-[120px] -mr-64 -mt-64" />

        <div className="container-custom relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-amber-600 flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold font-serif text-white tracking-tight">
                  Tours<span className="text-amber-500">&</span>Detours
                </span>
              </div>
              <p className="text-sm leading-relaxed max-w-xs">
                {lang === 'fr'
                  ? 'Expert en Catalogne, nous créons des expériences privées authentiques et responsables pour voyageurs exigeants.'
                  : lang === 'es'
                    ? 'Expertos en Cataluña, creamos experiencias privadas auténticas y responsables para viajeros exigentes.'
                    : 'Experts in Catalonia, we create authentic and responsible private experiences for discerning travelers.'}
              </p>
              <div className="flex gap-4">
                <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-amber-600/20 hover:border-amber-600/50 hover:text-amber-500 transition-all">
                  <Instagram className="w-5 h-5" />
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-amber-600 rounded-full" />
                Navigation
              </h4>
              <ul className="space-y-4 text-sm">
                <li><button onClick={() => scrollToSection('tours')} className="hover:text-amber-500 transition-colors inline-flex items-center gap-2 group"><ChevronRight className="w-4 h-4 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" /> {t.nav.tours}</button></li>
                <li><button onClick={() => scrollToSection('guide')} className="hover:text-amber-500 transition-colors inline-flex items-center gap-2 group"><ChevronRight className="w-4 h-4 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" /> {t.nav.guide}</button></li>
                <li><button onClick={() => scrollToSection('avis')} className="hover:text-amber-500 transition-colors inline-flex items-center gap-2 group"><ChevronRight className="w-4 h-4 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" /> {t.nav.avis}</button></li>
                <li><button onClick={() => scrollToSection('contact')} className="hover:text-amber-500 transition-colors inline-flex items-center gap-2 group"><ChevronRight className="w-4 h-4 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" /> {t.nav.contact}</button></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-amber-600 rounded-full" />
                Tours Populaires
              </h4>
              <ul className="space-y-4 text-sm">
                {tours.slice(0, 4).map(tour => (
                  <li key={tour.id}>
                    <button onClick={() => scrollToSection('tours')} className="hover:text-amber-500 transition-colors text-left line-clamp-1 group flex items-center gap-2">
                      <ChevronRight className="w-4 h-4 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all shrink-0" />
                      {tour.title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-amber-600 rounded-full" />
                Contact Direct
              </h4>
              <ul className="space-y-4 text-sm">
                <li className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4 text-amber-600" />
                  </div>
                  <span>{t.contact.whatsapp}</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                    <Star className="w-4 h-4 text-amber-600" />
                  </div>
                  <span>antoine@toursandetours.com</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                    <Compass className="w-4 h-4 text-amber-600" />
                  </div>
                  <span>Barcelone, Catalogne</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-xs tracking-wide">
              © 2026 Tours&Detours. {lang === 'fr' ? 'Tous droits réservés.' : lang === 'es' ? 'Todos los derechos reservados.' : 'All rights reserved.'}
            </p>
            <div className="flex gap-8 text-xs font-medium">
              <button className="hover:text-white transition-colors">{lang === 'fr' ? 'Mentions Légales' : 'Legal Notice'}</button>
              <button className="hover:text-white transition-colors">{lang === 'fr' ? 'Confidentialité' : 'Privacy'}</button>
              <button className="hover:text-white transition-colors">Cookies</button>
            </div>
          </div>
        </div>
      </footer>

      {/* Cookie Consent Banner */}
      {
        showCookieConsent && (
          <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 animate-in fade-in slide-in-from-bottom-10 duration-500">
            <div className="container-custom max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{t.cookies.title}</h3>
                  <p className="text-sm text-gray-600">
                    {t.cookies.desc}
                  </p>
                </div>
                <div className="flex gap-3 shrink-0">
                  <Button variant="outline" onClick={() => setShowCookieConsent(false)} className="px-6 h-11 border-gray-200">
                    {t.cookies.decline}
                  </Button>
                  <Button onClick={handleAcceptCookies} className="px-8 h-11 bg-amber-600 hover:bg-amber-700">
                    {t.cookies.accept}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )
      }
      <Toaster position="top-right" />
    </div >
  );
}

export default App;
