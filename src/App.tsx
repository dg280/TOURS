import { useState, useEffect } from 'react';
import {
  MapPin,
  Clock,
  Users,
  Star,
  Phone,
  Mail,
  Instagram,
  Facebook,
  Menu,
  X,
  ChevronRight,
  Calendar,
  CheckCircle2,
  Globe,
  Compass,
  Mountain,
  Waves
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  CreditCard,
  Apple,
  Smartphone,
  Loader2,
  Minus,
  Plus
} from 'lucide-react';
import { translations, type Language } from './lib/translations';
import './App.css';

interface Tour {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  duration: string;
  groupSize: string;
  price: string;
  image: string;
  category: string;
  highlights: string[];
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
  const [showCookieConsent, setShowCookieConsent] = useState(false);
  const [guidePhoto, setGuidePhoto] = useState('/guide-antoine.jpg');
  const [customTours, setCustomTours] = useState<Tour[]>([]);

  useEffect(() => {
    const savedPhoto = localStorage.getItem('td-guide-photo');
    if (savedPhoto) setGuidePhoto(savedPhoto);

    const savedTours = localStorage.getItem('td-tours');
    if (savedTours) setCustomTours(JSON.parse(savedTours));
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

  const tours: Tour[] = t.tour_data.map(tour => ({
    ...tour,
    image: tour.id === 1 ? '/tour-girona.jpg' :
      tour.id === 2 ? '/tour-barcelona-hidden.jpg' :
        tour.id === 3 ? '/tour-camironda.jpg' :
          tour.id === 4 ? '/tour-prepirinees.jpg' :
            tour.id === 5 ? '/tour-kayak.jpg' :
              tour.id === 6 ? '/tour-montserrat.jpg' : '/tour-collioure.jpg',
    category: tour.id === 1 ? 'Culture & Nature' :
      tour.id === 2 ? 'Culture' :
        tour.id === 3 ? 'Randonnée' :
          tour.id === 4 ? 'Randonnée & Patrimoine' :
            tour.id === 5 ? 'Aventure' :
              tour.id === 6 ? 'Culture & Vin' : 'Culture & Gastronomie'
  }));

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

  const nextStep = () => {
    if (bookingStep === 3) {
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        setBookingStep(4);
      }, 2000);
    } else {
      setBookingStep(bookingStep + 1);
    }
  };

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setShowCookieConsent(true);
    }
  }, []);

  const calculateTotal = () => {
    if (!selectedTour) return 0;
    const priceStr = selectedTour.price.replace('€', '');
    return parseInt(priceStr) * participants;
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
            <Compass className={`w-6 h-6 ${isScrolled ? 'text-amber-600' : 'text-white'}`} />
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
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(/tour-camironda.jpg)' }}
        />
        <div className="absolute inset-0 hero-gradient" />

        <div className="relative z-10 container-custom text-center text-white">
          <div className="animate-fade-in-up">
            <p className="text-lg md:text-xl mb-4 font-light tracking-wide">
              {t.hero.tagline}
            </p>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Tours<span className="text-amber-400">&</span>Detours<br />
              <span className="text-2xl md:text-4xl font-normal">
                {lang === 'en' ? 'with Antoine Pilard' : lang === 'es' ? 'con Antoine Pilard' : 'avec Antoine Pilard'}
              </span>
            </h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8 text-white/90">
              {t.hero.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => scrollToSection('tours')}
                className="bg-amber-600 hover:bg-amber-700 text-white btn-hover text-lg px-8"
              >
                {t.hero.cta_discover}
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => scrollToSection('contact')}
                className="border-white text-white hover:bg-white/10 text-lg px-8"
              >
                {t.hero.cta_contact}
              </Button>
            </div>
          </div>

          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 animate-fade-in-up delay-300">
            {[
              { icon: Clock, label: '15+', sublabel: t.stats.exp },
              { icon: MapPin, label: 'Catalonia', sublabel: t.stats.local },
              { icon: Star, label: '5.0', sublabel: t.stats.review },
              { icon: Globe, label: '3', sublabel: t.stats.langs },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <stat.icon className="w-8 h-8 mx-auto mb-2 text-amber-400" />
                <p className="text-2xl font-bold">{stat.label}</p>
                <p className="text-sm text-white/70">{stat.sublabel}</p>
              </div>
            ))}
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
              <div
                key={tour.id}
                className="tour-card bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={tour.image}
                    alt={tour.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-white/90 text-gray-800">
                      {tour.category}
                    </Badge>
                  </div>
                  <div className="absolute top-3 right-3 bg-amber-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {tour.price}
                  </div>
                </div>
                <div className="p-5">
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

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        onClick={() => setSelectedTour(tour)}
                        className="w-full bg-gray-900 hover:bg-gray-800 text-white"
                      >
                        {t.tours.learn_more}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg">
                      <DialogHeader>
                        <DialogTitle className="text-2xl font-serif">{tour.title}</DialogTitle>
                      </DialogHeader>
                      <img
                        src={tour.image}
                        alt={tour.title}
                        className="w-full h-48 object-cover rounded-lg mb-4"
                      />
                      <p className="text-gray-600 mb-4">{tour.description}</p>
                      <div className="space-y-2 mb-4">
                        <p className="text-sm"><strong>{t.tours.duration}:</strong> {tour.duration}</p>
                        <p className="text-sm"><strong>{t.tours.group}:</strong> {tour.groupSize}</p>
                        <p className="text-sm"><strong>{t.tours.price}:</strong> {tour.price} {t.tours.per_person}</p>
                      </div>
                      <Button
                        onClick={() => {
                          handleBookingStart(tour);
                        }}
                        className="w-full bg-amber-600 hover:bg-amber-700"
                      >
                        {t.tours.book_now}
                      </Button>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
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

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: MapPin, ...t.features.items[0] },
              { icon: Mountain, ...t.features.items[1] },
              { icon: Compass, ...t.features.items[2] },
              { icon: Waves, ...t.features.items[3] },
            ].map((feature, index) => (
              <div key={index} className="text-center p-6">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-amber-600" />
                </div>
                <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.desc}</p>
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

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-white p-8 rounded-xl shadow-sm"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-amber-500 fill-amber-500" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">"{testimonial.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-amber-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.loc}</p>
                  </div>
                </div>
              </div>
            ))}
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
                    <p className="text-lg">antoine@toursanddetours.com</p>
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
                    href="#"
                    className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-amber-600 transition-colors"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                  <a
                    href="#"
                    className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-amber-600 transition-colors"
                  >
                    <Facebook className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 text-gray-900">
              <h3 className="text-2xl font-bold mb-6">{t.contact.form_title}</h3>
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">{t.contact.name}</Label>
                    <Input id="name" placeholder={t.contact.name} className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="email">{t.contact.email}</Label>
                    <Input id="email" type="email" placeholder="votre@email.com" className="mt-1" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="tour">{t.contact.tour}</Label>
                  <select
                    id="tour"
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
                    <Input id="date" type="date" className="pl-10" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="message">{t.contact.message}</Label>
                  <Textarea
                    id="message"
                    placeholder="..."
                    className="mt-1 min-h-[120px]"
                  />
                </div>
                <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white btn-hover py-6 text-lg">
                  {t.contact.cta}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Modal */}
      <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-white border-none shadow-2xl rounded-2xl max-h-[90vh] flex flex-col">
          <div className="flex flex-col md:flex-row h-full overflow-y-auto">
            {/* Sidebar Summary */}
            <div className="w-full md:w-72 bg-gray-50 p-6 border-b md:border-b-0 md:border-r border-gray-100">
              <div className="mb-6">
                <Badge className="bg-amber-100 text-amber-800 border-none mb-2">{t.booking.selection}</Badge>
                <h3 className="text-xl font-bold text-gray-900">{selectedTour?.title}</h3>
                <p className="text-sm text-gray-500">{selectedTour?.subtitle}</p>
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
                    <p className="text-xs text-gray-400">{participants} x {selectedTour?.price}</p>
                    <p className="text-2xl font-bold text-amber-600">{calculateTotal()}€</p>
                  </div>
                </div>
              </div>

              {bookingStep < 4 && (
                <div className="mt-8">
                  <div className="flex gap-1 mb-2">
                    {[1, 2, 3].map(step => (
                      <div
                        key={step}
                        className={`h-1 flex-1 rounded-full ${step <= bookingStep ? 'bg-amber-600' : 'bg-gray-200'}`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-400 text-center">{t.booking.step} {bookingStep} {t.booking.step_of} 3</p>
                </div>
              )}
            </div>

            {/* Main Content Area */}
            <div className="flex-1 p-8 bg-white min-h-[450px] flex flex-col">
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
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bk-email">{t.contact.email}</Label>
                      <Input
                        id="bk-email"
                        type="email"
                        placeholder="votre@email.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bk-phone">{t.contact.name === 'Nom' ? 'Téléphone' : 'Phone'}</Label>
                      <Input
                        id="bk-phone"
                        placeholder="+33 6 ..."
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="h-11"
                      />
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

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3 mb-2">
                      <Button variant="outline" className="h-12 border-gray-200">
                        <Apple className="w-5 h-5 mr-2" />
                        Apple Pay
                      </Button>
                      <Button variant="outline" className="h-12 border-gray-200">
                        <Smartphone className="w-5 h-5 mr-2" />
                        G Pay
                      </Button>
                    </div>

                    <div className="relative py-2">
                      <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-100"></span></div>
                      <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-gray-400 font-medium tracking-widest">{lang === 'fr' ? 'Ou carte bancaire' : lang === 'es' ? 'O tarjeta' : 'Or card'}</span></div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="card-num">{lang === 'fr' ? 'Numéro de carte' : lang === 'es' ? 'Número de tarjeta' : 'Card number'}</Label>
                        <div className="relative">
                          <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <Input id="card-num" placeholder="0000 0000 0000 0000" className="pl-10 h-11" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="card-exp">{lang === 'fr' ? 'Expiration' : lang === 'es' ? 'Expiración' : 'Expiry'}</Label>
                          <Input id="card-exp" placeholder="MM/YY" className="h-11" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="card-cvc">CVC</Label>
                          <Input id="card-cvc" placeholder="123" className="h-11" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-auto pt-8">
                    <Button variant="outline" onClick={() => setBookingStep(2)} className="h-12 px-6" disabled={isProcessing}>{lang === 'fr' ? 'Retour' : lang === 'es' ? 'Volver' : 'Back'}</Button>
                    <Button
                      onClick={nextStep}
                      disabled={isProcessing}
                      className="flex-1 bg-amber-600 hover:bg-amber-700 h-12 text-lg font-semibold shadow-lg shadow-amber-600/20"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          ...
                        </>
                      ) : (
                        `${t.booking.pay} (${calculateTotal()}€)`
                      )}
                    </Button>
                  </div>
                </div>
              )}

              {bookingStep === 4 && (
                <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 animate-in zoom-in-95 duration-500">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-2">
                    <CheckCircle2 className="w-10 h-10 text-green-600" />
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
      <footer className="bg-gray-950 text-gray-400 py-12">
        <div className="container-custom">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Compass className="w-6 h-6 text-amber-600" />
                <span className="text-xl font-semibold font-serif text-white">
                  Tours<span className="text-amber-500">&</span>Detours
                </span>
              </div>
              <p className="text-sm">
                {lang === 'fr'
                  ? 'Votre guide expert en Catalogne pour des expériences authentiques et responsables.'
                  : lang === 'es'
                    ? 'Tu guía experto en Cataluña para experiencias auténticas y responsables.'
                    : 'Your expert guide in Catalonia for authentic and responsible experiences.'}
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">{t.nav.tours}</h4>
              <ul className="space-y-2 text-sm">
                <li><button onClick={() => scrollToSection('tours')} className="hover:text-amber-400 transition-colors">{t.nav.tours}</button></li>
                <li><button onClick={() => scrollToSection('guide')} className="hover:text-amber-400 transition-colors">{t.nav.guide}</button></li>
                <li><button onClick={() => scrollToSection('avis')} className="hover:text-amber-400 transition-colors">{t.nav.avis}</button></li>
                <li><button onClick={() => scrollToSection('contact')} className="hover:text-amber-400 transition-colors">{t.nav.contact}</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">{t.nav.tours}</h4>
              <ul className="space-y-2 text-sm">
                {tours.slice(0, 4).map(tour => (
                  <li key={tour.id}><button onClick={() => scrollToSection('tours')} className="hover:text-amber-400 transition-colors">{tour.title}</button></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm">
                <li>{t.contact.whatsapp}</li>
                <li>antoine@toursanddetours.com</li>
                <li>Barcelone, Catalogne</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm">
              © 2024 Tours&Detours. {lang === 'fr' ? 'Tous droits réservés.' : lang === 'es' ? 'Todos los derechos reservados.' : 'All rights reserved.'}
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-amber-400 transition-colors"><Instagram className="w-5 h-5" /></a>
              <a href="#" className="hover:text-amber-400 transition-colors"><Facebook className="w-5 h-5" /></a>
            </div>
          </div>
        </div>
      </footer>

      {/* Cookie Consent Banner */}
      {showCookieConsent && (
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
      )}
    </div>
  );
}

export default App;
