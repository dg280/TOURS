import { useState, useEffect, useRef } from "react";
import type { Translations } from "@/lib/translations";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Loader2,
  Calendar as CalendarIcon,
  Users,
  CheckCircle2,
  ChevronRight,
  Minus,
  Plus,
  CreditCard,
  Info,
  Check,
  X,
} from "lucide-react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { CheckoutForm } from "../CheckoutForm";
import { toast } from "sonner";
import type { Tour } from "@/lib/types";
import { supabase } from "@/lib/supabase";

const STRIPE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || (import.meta as unknown as { env: Record<string, string> }).env?.test_stripe_PK || "";
const isValidStripeKey = STRIPE_KEY.startsWith("pk_test_") || STRIPE_KEY.startsWith("pk_live_");

const stripePromise = isValidStripeKey ? loadStripe(STRIPE_KEY) : Promise.resolve(null);

interface BookingModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  tour: Tour | null;
  lang: string;
  t: Translations;
}

export const BookingModal = ({
  isOpen,
  onOpenChange,
  tour,
  lang,
  t,
}: BookingModalProps) => {
  const [step, setStep] = useState(1);
  const [participants, setParticipants] = useState(2);
  const [date, setDate] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zip: "",
    country: "",
    pickupAddress: "",
    pickupTime: "09:00",
    comment: "",
  });

  const [clientSecret, setClientSecret] = useState("");
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [serverMode, setServerMode] = useState<"test" | "live" | null>(null);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Reset scroll position when step changes
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [step]);

  useEffect(() => {
    if (isOpen) {
      // Move state updates to the next tick to avoid synchronous cascading renders
      // that trigger the react-hooks/set-state-in-effect lint error.
      Promise.resolve().then(() => {
        setStep(1);
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        setDate(tomorrow.toISOString().split("T")[0]);
      });
    }
  }, [isOpen]);

  useEffect(() => {
    if (tour && step === 3 && !clientSecret && !paymentError) {
      fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tourId: tour.id,
          participants: participants,
        }),
      })
        .then(async (res) => {
          let data;
          try {
            data = await res.json();
          } catch (e) {
            console.error("Failed to parse JSON response:", e);
            throw new Error(`Erreur serveur (${res.status})`);
          }
          
          if (!res.ok) {
            throw new Error(data.error || `Erreur serveur (${res.status})`);
          }
          return data;
        })
        .then((data) => {
          if (data.clientSecret) {
            setClientSecret(data.clientSecret);
            setServerMode(data.mode);
            setPaymentError(null);
          } else {
            throw new Error("Client secret manquant dans la réponse");
          }
        })
        .catch((err) => {
          console.error("Payment init error:", err);
          const errMsg = err.message || "Erreur de chargement";
          setPaymentError(errMsg);
          toast.error(`${t.booking.payment_error} : ${errMsg}`);
          setClientSecret(""); 
        });
    }
  }, [tour, step, clientSecret, paymentError, participants, lang, t.booking.payment_error]);

  const calculateSubtotal = () => {
    if (!tour) return 0;

    // Manual override for specific participant count
    if (tour.pricing_tiers && tour.pricing_tiers[participants]) {
      return tour.pricing_tiers[participants];
    }

    // Fallback to per-person pricing
    return tour.price * participants;
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    if (subtotal === 0) return 0;
    // Formule : (Prix tour + 0.30) / 0.956
    const total = (subtotal + 0.3) / 0.956;
    return Number(total.toFixed(2));
  };



  const nextStep = () => {
    if (step === 1) {
      if (!date) {
        toast.error(t.booking.date_error || "Date required");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!formData.name || !formData.email) {
        toast.error(t.booking.info_error || "Name and Email are required");
        return;
      }
      setClientSecret("");
      setStep(3);
    } else if (step === 3) {
      setStep(4);
    }
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSuccess = async () => {
    const newReservation = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      tour_id: tour?.id.toString(),
      tour_name: tour?.title,
      date: date,
      participants: participants,
      total_price: calculateTotal(),
      status: "pending" as const,
      message: formData.comment,
    };

    if (supabase) {
      const { data, error } = await supabase
        .from("reservations")
        .insert(newReservation)
        .select("id")
        .single();
      if (!error && data) {
        // Trigger confirmation email
        fetch("/api/confirm-booking", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reservationId: data.id }),
        }).catch((err) =>
          console.error("Failed to trigger confirmation email:", err),
        );
      }
    }

    setStep(5);
  };

  if (!tour) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[700px] w-full h-full sm:h-auto sm:max-h-[95vh] p-0 overflow-hidden sm:rounded-2xl border-none shadow-2xl bg-white flex flex-col"
        data-testid="booking-modal"
      >
        <div className="flex flex-col h-full overflow-hidden">
          <div className="bg-gray-900 text-white p-6 sm:p-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <p className="text-amber-400 text-[10px] font-bold uppercase tracking-widest mb-1">
                  {t.booking.step} {step} {t.booking.step_of} 5
                </p>
                <DialogTitle className="text-2xl font-serif">
                  {tour.title}
                </DialogTitle>
              </div>
            </div>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded-full transition-all duration-500 ${i <= step ? "bg-amber-500" : "bg-white/10"}`}
                />
              ))}
            </div>
          </div>

          <div 
            ref={scrollContainerRef}
            className="flex-1 overflow-y-auto p-6 sm:p-8 no-scrollbar scroll-smooth"
          >
            {step === 1 && (
              <div className="space-y-6">
                {/* Itinerary & Inclusions/Exclusions Summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    <h4 className="font-sans text-[10px] font-bold uppercase tracking-widest text-amber-600 flex items-center gap-2">
                       <ChevronRight className="w-3 h-3" /> {t.booking.itinerary}
                    </h4>
                    <div className="relative pl-3 border-l-2 border-amber-100 space-y-3">
                      {(lang === 'fr' ? tour.itinerary : lang === 'es' ? tour.itinerary_es : tour.itinerary_en)?.slice(0, 5).map((item, i) => (
                        <div key={i} className="relative">
                          <div className="absolute -left-[17px] top-1 w-2 h-2 rounded-full bg-amber-400" />
                          <p className="text-[11px] text-gray-700 leading-tight">{item}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3 p-4 rounded-2xl border border-gray-100 bg-gray-50/50">
                    <div className="space-y-2">
                      <h4 className="font-sans text-[10px] font-bold uppercase tracking-widest text-green-700 flex items-center gap-1.5">
                        <Check className="w-3 h-3" /> {t.booking.included_label}
                      </h4>
                      <ul className="space-y-1">
                        {(lang === 'fr' ? tour.included : lang === 'es' ? tour.included_es : tour.included_en)?.slice(0, 3).map((item, i) => (
                          <li key={i} className="text-[11px] text-gray-700 leading-tight">• {item}</li>
                        ))}
                      </ul>
                    </div>
                    {(lang === 'fr' ? tour.notIncluded : lang === 'es' ? tour.notIncluded_es : tour.notIncluded_en)?.length ? (
                      <div className="space-y-2 pt-2 border-t border-gray-100">
                        <h4 className="font-sans text-[10px] font-bold uppercase tracking-widest text-red-500 flex items-center gap-1.5">
                          <X className="w-3 h-3" /> {lang === 'en' ? 'Not included' : lang === 'es' ? 'No incluido' : 'Non inclus'}
                        </h4>
                        <ul className="space-y-1">
                          {(lang === 'fr' ? tour.notIncluded : lang === 'es' ? tour.notIncluded_es : tour.notIncluded_en)?.slice(0, 3).map((item, i) => (
                            <li key={i} className="text-[11px] text-gray-500 leading-tight">• {item}</li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-sans font-bold flex items-center gap-2 text-gray-900">
                      <CalendarIcon className="w-5 h-5 text-amber-600" />
                      {t.booking.date_title}
                    </h3>
                    <div className="grid gap-2">
                      <Label htmlFor="date" className="text-xs uppercase tracking-wider text-gray-500">{t.booking.date_label}</Label>
                      <Input
                        id="date"
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="h-12 text-base rounded-xl border-gray-200"
                        min={new Date().toISOString().split("T")[0]}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="pickup-time" className="text-xs uppercase tracking-wider text-gray-500">
                        {lang === 'en' ? 'Pick-up time' : lang === 'es' ? 'Hora de recogida' : 'Heure de pick-up'}
                      </Label>
                      <Input
                        id="pickup-time"
                        type="time"
                        value={formData.pickupTime}
                        onChange={(e) => setFormData({ ...formData, pickupTime: e.target.value })}
                        className="h-12 text-base rounded-xl border-gray-200"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-sans font-bold flex items-center gap-2 text-gray-900">
                      <Users className="w-5 h-5 text-amber-600" />
                      {t.booking.participants}
                    </h3>
                    <div className="flex items-center justify-between bg-gray-50 p-3 rounded-xl border border-gray-100">
                      <span className="font-bold text-lg">
                        {participants}{" "}
                        <span className="text-sm font-normal text-gray-500 uppercase tracking-tighter">
                          {participants > 1 ? t.booking.travelers : t.booking.traveler}
                        </span>
                      </span>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setParticipants(Math.max(1, participants - 1))}
                          className="rounded-full w-8 h-8 bg-white shadow-sm border border-gray-100"
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setParticipants(Math.min(8, participants + 1))}
                          className="rounded-full w-8 h-8 bg-white shadow-sm border border-gray-100"
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-2">
                   <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center">
                    <Info className="w-5 h-5 text-amber-600" />
                   </div>
                   <h3 className="text-xl font-sans font-bold text-gray-900">
                    {t.booking.info_title}
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="booking-name" className="text-xs uppercase tracking-wider text-gray-500 font-bold">{t.contact.name}*</Label>
                    <Input id="booking-name" placeholder="Jean Dupont" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="h-12 rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="booking-email" className="text-xs uppercase tracking-wider text-gray-500 font-bold">{t.contact.email}*</Label>
                    <Input id="booking-email" type="email" placeholder="jean@example.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="h-12 rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="booking-phone" className="text-xs uppercase tracking-wider text-gray-500 font-bold">{t.booking.phone}</Label>
                    <Input id="booking-phone" placeholder="+33 6 ..." value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="h-12 rounded-xl" />
                  </div>
                   <div className="space-y-2">
                    <Label htmlFor="booking-pickup" className="text-xs uppercase tracking-wider text-gray-500 font-bold">{t.booking.pickup_address}</Label>
                    <Input id="booking-pickup" placeholder="Hôtel / Adresse exacte" value={formData.pickupAddress} onChange={(e) => setFormData({ ...formData, pickupAddress: e.target.value })} className="h-12 rounded-xl" />
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-gray-100">
                  <h4 className="text-sm font-bold uppercase tracking-widest text-gray-400">{t.booking.billing_address} (Optionnel)</h4>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="billing-address" className="text-xs uppercase tracking-wider text-gray-500">{t.booking.billing_address}</Label>
                      <Input id="billing-address" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className="h-12 rounded-xl" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="billing-city" className="text-xs uppercase tracking-wider text-gray-500">{t.booking.city}</Label>
                        <Input id="billing-city" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} className="h-12 rounded-xl" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="billing-zip" className="text-xs uppercase tracking-wider text-gray-500">{t.booking.zip}</Label>
                        <Input id="billing-zip" value={formData.zip} onChange={(e) => setFormData({ ...formData, zip: e.target.value })} className="h-12 rounded-xl" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="billing-country" className="text-xs uppercase tracking-wider text-gray-500">{t.booking.country}</Label>
                      <Input id="billing-country" value={formData.country} onChange={(e) => setFormData({ ...formData, country: e.target.value })} className="h-12 rounded-xl" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-4">
                  <Label htmlFor="booking-comment" className="text-xs uppercase tracking-wider text-gray-500 font-bold">{t.booking.comment_label}</Label>
                  <textarea
                    id="booking-comment"
                    placeholder={t.booking.comment_placeholder}
                    value={formData.comment}
                    onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                    className="flex min-h-[60px] w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-2">
                   <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-amber-600" />
                   </div>
                   <h3 className="text-xl font-sans font-bold text-gray-900">
                    {t.booking.summary_title}
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold uppercase tracking-widest text-gray-400 border-b pb-2">{t.booking.tour_details}</h4>
                    <div className="space-y-2 text-sm text-gray-700">
                      <p className="font-bold text-gray-900">{tour.title}</p>
                      <p className="flex justify-between"><span>Date :</span> <span className="font-bold">{date}</span></p>
                      <p className="flex justify-between">
                        <span>{lang === 'en' ? 'Pick-up time' : lang === 'es' ? 'Hora de recogida' : 'Heure de pick-up'} :</span>
                        <span className="font-bold">{formData.pickupTime || "—"}</span>
                      </p>
                      <p className="flex justify-between">
                        <span>{lang === 'en' ? 'Est. duration' : lang === 'es' ? 'Duración est.' : 'Durée estimée'} :</span>
                        <span className="font-bold">{tour.duration}</span>
                      </p>
                      <p className="flex justify-between">
                        <span>{lang === 'en' ? 'Travelers' : lang === 'es' ? 'Viajeros' : 'Voyageurs'} :</span>
                        <span className="font-bold">{participants}</span>
                      </p>
                      <p className="flex flex-col gap-1 mt-2 p-2 bg-gray-50 rounded-lg">
                        <span className="text-[10px] uppercase font-bold text-amber-600">{t.booking.pickup_address}</span>
                        <span className="font-medium">{formData.pickupAddress || (lang === 'en' ? 'To confirm' : lang === 'es' ? 'Por confirmar' : 'À confirmer')}</span>
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-sm font-bold uppercase tracking-widest text-gray-400 border-b pb-2">{t.booking.personal_info}</h4>
                    <div className="space-y-2 text-sm text-gray-700">
                      <p className="flex justify-between"><span>{t.contact.name} :</span> <span className="font-bold">{formData.name}</span></p>
                      <p className="flex justify-between"><span>{t.contact.email} :</span> <span className="font-bold">{formData.email}</span></p>
                      <p className="flex justify-between"><span>{t.booking.phone} :</span> <span className="font-bold">{formData.phone || "—"}</span></p>
                      {formData.pickupAddress && (
                        <p className="flex justify-between"><span>Pick-up :</span> <span className="font-bold text-right max-w-[60%]">{formData.pickupAddress}</span></p>
                      )}
                      {formData.address && (
                        <p className="flex flex-col gap-0.5 mt-2 p-2 bg-gray-50 rounded-lg text-xs">
                          <span className="text-[10px] uppercase font-bold text-gray-400">{t.booking.billing_address}</span>
                          <span>{formData.address}{formData.city ? `, ${formData.city}` : ""}{formData.zip ? ` ${formData.zip}` : ""}{formData.country ? `, ${formData.country}` : ""}</span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex justify-between items-center mt-4">
                  <div className="space-y-1">
                    <p className="text-xs text-amber-800 font-bold uppercase tracking-wider">{t.booking.total_paid}</p>
                    <p className="text-3xl font-serif font-bold text-amber-900">{calculateTotal()}€</p>
                  </div>
                  <div className="text-right text-[10px] text-amber-700/60 leading-tight italic">
                    {t.booking.per_person_incl_fees}<br/>
                    ({(calculateTotal() / participants).toFixed(2)}€ /pers)
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6">
                {/* Booking summary ribbon */}
                <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm text-gray-700 grid grid-cols-2 gap-x-6 gap-y-1.5">
                  <p className="col-span-2 font-bold text-gray-900 text-base mb-1">{tour.title}</p>
                  <p><span className="text-[10px] uppercase font-bold text-gray-400 block">{t.contact.name}</span>{formData.name}</p>
                  <p><span className="text-[10px] uppercase font-bold text-gray-400 block">{lang === 'en' ? 'Travelers' : lang === 'es' ? 'Viajeros' : 'Voyageurs'}</span>{participants}</p>
                  <p><span className="text-[10px] uppercase font-bold text-gray-400 block">Date</span>{date}</p>
                  <p><span className="text-[10px] uppercase font-bold text-gray-400 block">{lang === 'en' ? 'Pick-up time' : lang === 'es' ? 'Hora recogida' : 'Heure pick-up'}</span>{formData.pickupTime || "—"}</p>
                  <p className="col-span-2"><span className="text-[10px] uppercase font-bold text-amber-600 block">{t.booking.pickup_address}</span>{formData.pickupAddress || (lang === 'en' ? 'To confirm' : lang === 'es' ? 'Por confirmar' : 'À confirmer')}</p>
                  <p><span className="text-[10px] uppercase font-bold text-gray-400 block">{lang === 'en' ? 'Est. duration' : lang === 'es' ? 'Duración' : 'Durée'}</span>{tour.duration}</p>
                  <p><span className="text-[10px] uppercase font-bold text-gray-400 block">Total</span><span className="font-bold text-amber-700">{calculateTotal()}€</span></p>
                </div>

                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-sans font-bold flex items-center gap-2 text-gray-900">
                    <CreditCard className="w-5 h-5 text-amber-600" />
                    {t.booking.payment_title}
                  </h3>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${STRIPE_KEY.startsWith('pk_test_') ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                    {STRIPE_KEY.startsWith('pk_test_') ? 'Mode Test' : 'Mode Live'}
                  </span>
                </div>
                {clientSecret ? (
                  <Elements
                    stripe={stripePromise}
                    options={{ clientSecret, appearance: { theme: "stripe" } }}
                  >
                    <CheckoutForm
                      onSuccess={handleSuccess}
                      amount={calculateTotal()}
                      serverMode={serverMode}
                    />
                  </Elements>
                ) : !isValidStripeKey || paymentError ? (
                  <div className="flex flex-col items-center justify-center py-12 text-red-600 bg-red-50 rounded-2xl border border-red-100 p-6 text-center">
                    <X className="w-10 h-10 mb-4" />
                    <p className="font-bold mb-2">Problème de Paiement</p>
                    <p className="text-sm opacity-80 mb-4">
                      {!isValidStripeKey 
                        ? `La clé publique (${STRIPE_KEY ? `${STRIPE_KEY.substring(0, 7)}...` : "VIDE"}) est incorrecte. Elle doit commencer par 'pk_test_' ou 'pk_live_'.`
                        : `Erreur : ${paymentError}`
                      }
                    </p>
                    <div className="flex flex-col gap-2 w-full">
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setPaymentError(null);
                          setStep(2);
                        }}
                        className="border-red-200 text-red-700 hover:bg-red-100"
                      >
                        Retour aux réglages
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                    <Loader2 className="w-10 h-10 animate-spin mb-4 text-amber-600" />
                    <p className="font-bold">Initialisation du paiement...</p>
                  </div>
                )}
              </div>
            )}

            {step === 5 && (
              <div className="flex flex-col items-center justify-center py-8 sm:py-12 text-center space-y-6">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-2">
                  <CheckCircle2 className="w-10 h-10 text-green-600" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">
                    {t.booking.success_title}
                  </h3>
                  <p className="text-gray-600 max-w-sm mx-auto">
                    {lang === "fr"
                      ? `Merci ${formData.name}. Un email de confirmation a été envoyé à ${formData.email}.`
                      : `Thank you ${formData.name}. A confirmation email has been sent to ${formData.email}.`}
                  </p>
                </div>

                <div className="bg-amber-50 p-6 rounded-2xl w-full border border-amber-100 text-left space-y-4">
                  <h4 className="text-amber-800 font-bold uppercase tracking-widest text-xs border-b border-amber-200 pb-2">{t.booking.summary}</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-amber-900/80">
                    <div className="space-y-2">
                      <p className="flex flex-col"><span className="text-[10px] uppercase font-bold opacity-50">{t.booking.tour_details}</span> <span className="font-bold text-amber-900">{tour.title}</span></p>
                      <p className="flex flex-col"><span className="text-[10px] uppercase font-bold opacity-50">Date & Heure</span> <span className="font-bold text-amber-900">{date} • {tour.duration} (Approx)</span></p>
                    </div>
                    <div className="space-y-2">
                      <p className="flex flex-col"><span className="text-[10px] uppercase font-bold opacity-50">Client</span> <span className="font-bold text-amber-900">{formData.name}</span></p>
                      <p className="flex flex-col"><span className="text-[10px] uppercase font-bold opacity-50">{t.booking.pickup_address}</span> <span className="font-bold text-amber-900">{formData.pickupAddress || "À confirmer"}</span></p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-amber-200 mt-2">
                    <p className="flex justify-between text-base">
                      <span>Total payé:</span>{" "}
                      <span className="font-bold text-amber-900">
                        {calculateTotal()}€
                      </span>
                    </p>
                  </div>
                </div>

                <Button
                  onClick={() => onOpenChange(false)}
                  className="w-full bg-[#c9a961] hover:bg-[#b8944e] h-14 text-base font-bold rounded-xl shadow-xl shadow-[#c9a961]/30 transition-all active:scale-95"
                >
                  {t.booking.finish}
                </Button>
              </div>
            )}
          </div>

          {step < 5 && (
            <div className="p-4 sm:p-6 bg-gray-50 border-t flex flex-col gap-4 shrink-0 pb-safe">
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="flex flex-col">
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none">Total</p>
                  <p className="text-xl font-bold text-gray-900">{calculateTotal()}€</p>
                </div>
                
                <div className="flex w-full sm:w-auto gap-3">
                  {step > 1 && (
                    <Button
                      variant="outline"
                      onClick={prevStep}
                      className="flex-1 sm:flex-none h-12 px-6 rounded-xl font-bold border-gray-200"
                    >
                      {t.common.back}
                    </Button>
                  )}
                  {step < 4 && (
                    <Button
                      onClick={nextStep}
                      data-testid="next-step-button"
                      className="flex-1 sm:flex-none bg-[#c9a961] hover:bg-[#b8944e] text-white px-8 h-12 font-bold rounded-xl shadow-lg shadow-[#c9a961]/20 transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                      {step === 3 ? t.booking.pay : t.booking.next}
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
