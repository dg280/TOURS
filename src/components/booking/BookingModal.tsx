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

const STRIPE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || (import.meta as any).env?.test_stripe_PK || "";
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

  const calculateFees = () => {
    const total = calculateTotal();
    const subtotal = calculateSubtotal();
    return Number((total - subtotal).toFixed(2));
  };

  const nextStep = () => {
    if (step === 1) {
      if (!date) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        toast.error((t.booking as any).date_error || "Date required");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!formData.name || !formData.email) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        toast.error((t.booking as any).info_error || "Info required");
        return;
      }
      setClientSecret("");
      setStep(3);
    }
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

    setStep(4);
  };

  if (!tour) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[600px] w-[95vw] p-0 overflow-hidden rounded-2xl border-none shadow-2xl bg-white"
        data-testid="booking-modal"
      >
        <div className="flex flex-col h-full max-h-[90vh]">
          <div className="bg-gray-900 text-white p-6 sm:p-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <p className="text-amber-400 text-xs font-bold uppercase tracking-widest mb-1">
                  {t.booking.step} {step} {t.booking.step_of} 4
                </p>
                <DialogTitle className="text-2xl font-serif">
                  {tour.title}
                </DialogTitle>
              </div>
            </div>
            <div className="flex gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${i <= step ? "bg-amber-500" : "bg-white/10"}`}
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
                {/* Inclusions Summary */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 bg-amber-50/30 p-4 rounded-2xl border border-amber-100/50">
                  <div className="space-y-1.5">
                    <h4 className="font-sans text-[10px] font-bold uppercase tracking-widest text-green-700 flex items-center gap-1.5 opacity-80">
                      <Check className="w-3 h-3" /> {t.booking.included_label}
                    </h4>
                    <ul className="space-y-1">
                      {tour.included?.slice(0, 3).map((item, i) => (
                        <li
                          key={i}
                          className="text-[11px] text-gray-700 leading-tight"
                        >
                          • {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-1.5">
                    <h4 className="font-sans text-[10px] font-bold uppercase tracking-widest text-red-600 flex items-center gap-1.5 opacity-80">
                      <X className="w-3 h-3" /> {t.booking.not_included_label}
                    </h4>
                    <ul className="space-y-1">
                      {tour.notIncluded?.slice(0, 3).map((item, i) => (
                        <li
                          key={i}
                          className="text-[11px] text-gray-600/80 leading-tight"
                        >
                          • {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-xl font-sans font-bold flex items-center gap-2 text-gray-900">
                    <CalendarIcon className="w-5 h-5 text-amber-600" />
                    {t.booking.date_title}
                  </h3>
                  <div className="grid gap-2">
                    <Label htmlFor="date">{t.booking.date_label}</Label>
                    <Input
                      id="date"
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="h-12 text-lg"
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-sans font-bold flex items-center gap-2 text-gray-900">
                    <Users className="w-5 h-5 text-amber-600" />
                    {t.booking.participants}
                  </h3>
                  <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <span className="font-medium">
                      {participants}{" "}
                      {participants > 1
                        ? t.booking.travelers
                        : t.booking.traveler}
                    </span>
                    <div className="flex items-center gap-4">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          setParticipants(Math.max(1, participants - 1))
                        }
                        className="rounded-full w-10 h-10"
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          setParticipants(Math.min(8, participants + 1))
                        }
                        className="rounded-full w-10 h-10"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <h3 className="text-xl font-sans font-bold flex items-center gap-2 mb-6 text-gray-900">
                  <Info className="w-5 h-5 text-amber-600" />
                  {t.booking.info_title}
                </h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="booking-name">{t.contact.name}</Label>
                    <Input
                      id="booking-name"
                      placeholder="Jean Dupont"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="booking-email">{t.contact.email}</Label>
                    <Input
                      id="booking-email"
                      type="email"
                      placeholder="jean@example.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="booking-phone">{t.booking.phone}</Label>
                    <Input
                      id="booking-phone"
                      placeholder="+33 6 ..."
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="booking-comment">
                      {t.booking.comment_label}
                    </Label>
                    <textarea
                      id="booking-comment"
                      placeholder={t.booking.comment_placeholder}
                      value={formData.comment}
                      onChange={(e) =>
                        setFormData({ ...formData, comment: e.target.value })
                      }
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div className="flex justify-between items-center mb-6">
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
                    <p className="text-xs mt-6 opacity-60">
                      💡 NB: Si vous venez de changer les réglages Vercel, vous devez **RÉ-DÉPLOYER** la branche pour que ce soit pris en compte.
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                    <Loader2 className="w-10 h-10 animate-spin mb-4 text-amber-600" />
                    <p className="font-bold">Initialisation du paiement...</p>
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-100 text-[10px] font-mono text-left max-w-xs overflow-hidden">
                      <p className="text-gray-400 mb-1">DÉBOGAGE :</p>
                      <p>Stripe Key: {STRIPE_KEY ? `${STRIPE_KEY.substring(0, 7)}...` : "(VIDE)"}</p>
                      <p>Intent: {clientSecret ? "REÇU" : "EN ATTENTE..."}</p>
                      <p>Tour ID: {tour.id}</p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="mt-4 text-gray-400 hover:text-amber-600"
                      onClick={() => {
                        setClientSecret("");
                        setPaymentError(null);
                        setStep(2);
                      }}
                    >
                      Délai trop long ? Recharger
                    </Button>
                  </div>
                )}
              </div>
            )}

            {step === 4 && (
              <div className="flex flex-col items-center justify-center py-12 text-center space-y-6">
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
                      : lang === "es"
                        ? `Gracias ${formData.name}. Se ha enviado un correo de confirmación a ${formData.email}.`
                        : `Thank you ${formData.name}. A confirmation email has been sent to ${formData.email}.`}
                  </p>
                </div>
                <div className="bg-amber-50 p-6 rounded-2xl w-full border border-amber-100 text-left">
                  <p className="text-amber-800 font-bold mb-4">
                    Récapitulatif :
                  </p>
                  <div className="space-y-2 text-sm text-amber-900/80">
                    <p className="flex justify-between">
                      <span>{t.booking.subtotal}:</span>{" "}
                      <span className="font-bold text-amber-900">
                        {calculateSubtotal()}€
                      </span>
                    </p>
                    <p className="flex justify-between">
                      <span>{t.booking.processing_fees}:</span>{" "}
                      <span className="font-bold text-amber-900">
                        {calculateFees()}€
                      </span>
                    </p>
                    <p className="flex justify-between">
                      <span>Date:</span>{" "}
                      <span className="font-bold text-amber-900">{date}</span>
                    </p>
                    <p className="flex justify-between">
                      <span>Voyageurs:</span>{" "}
                      <span className="font-bold text-amber-900">
                        {participants}
                      </span>
                    </p>
                    <div className="pt-2 border-t border-amber-200 mt-2 space-y-1">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-amber-700/50">
                        Inclus :
                      </p>
                      <p className="text-xs text-amber-900/60 leading-tight">
                        {tour.included?.join(", ")}
                      </p>
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
                </div>
                <Button
                  onClick={() => onOpenChange(false)}
                  className="w-full bg-[#c9a961] hover:bg-[#b8944e] h-16 text-sm sm:text-base font-bold rounded-2xl shadow-xl shadow-[#c9a961]/30 transition-all active:scale-95"
                >
                  {t.booking.finish}
                </Button>
              </div>
            )}
          </div>

          {step < 3 && (
            <div className="p-6 sm:p-8 bg-gray-50 border-t flex flex-col gap-4 shrink-0">
              <div className="space-y-1 text-sm">
                <div className="flex justify-between text-gray-500">
                  <span>{t.booking.subtotal}</span>
                  <span>{calculateSubtotal()}€</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>{t.booking.processing_fees}</span>
                  <span>{calculateFees()}€</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-gray-200 font-bold text-gray-900 text-lg">
                  <span>{t.booking.total}</span>
                  <span>{calculateTotal()}€</span>
                </div>
                <p className="text-[10px] text-gray-400 text-right italic">
                  ({(calculateTotal() / participants).toFixed(2)}€{" "}
                  {t.booking.per_person_incl_fees})
                </p>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-left hidden">
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                    {t.booking.total}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {calculateTotal()}€
                  </p>
                </div>
                <div className="flex-1" />
                <Button
                  onClick={nextStep}
                  data-testid="next-step-button"
                  className="bg-[#c9a961] hover:bg-[#b8944e] text-white px-6 sm:px-12 h-16 text-sm sm:text-base font-bold rounded-2xl shadow-xl shadow-[#c9a961]/30 transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  {t.booking.next}
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
