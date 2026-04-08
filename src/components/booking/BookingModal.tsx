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

// ---------------------------------------------------------------------------
// Availability Calendar
// ---------------------------------------------------------------------------
interface AvailabilityCalendarProps {
  selectedDate: string;
  onSelect: (date: string) => void;
  bookedByDate: Record<string, number>;
  blockedDates: Set<string>;
  maxCapacity: number;
  month: Date;
  onMonthChange: (d: Date) => void;
  loading: boolean;
  lang: string;
}

function AvailabilityCalendar({
  selectedDate,
  onSelect,
  bookedByDate,
  blockedDates,
  maxCapacity,
  month,
  onMonthChange,
  loading,
  lang,
}: AvailabilityCalendarProps) {
  const dayLabels =
    lang === "en" ? ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"]
    : lang === "es" ? ["Lu", "Ma", "Mi", "Ju", "Vi", "Sa", "Do"]
    : ["Lu", "Ma", "Me", "Je", "Ve", "Sa", "Di"];

  const monthLabel = month.toLocaleDateString(
    lang === "en" ? "en-US" : lang === "es" ? "es-ES" : "fr-FR",
    { month: "long", year: "numeric" }
  );

  // Build 6-week grid starting from the Monday before the 1st
  const firstDay = new Date(month.getFullYear(), month.getMonth(), 1);
  const startOffset = (firstDay.getDay() + 6) % 7; // Mon=0
  const gridStart = new Date(firstDay);
  gridStart.setDate(1 - startOffset);

  const cells: Date[] = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(gridStart);
    d.setDate(gridStart.getDate() + i);
    cells.push(d);
  }

  // Local date string (YYYY-MM-DD) — never use toISOString() which is UTC
  // and shifts dates for users east/west of UTC (audit H1).
  const toDateStr = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };
  const todayStr = toDateStr(new Date());

  const now = new Date();
  const isPrevDisabled =
    month.getFullYear() === now.getFullYear() &&
    month.getMonth() === now.getMonth();

  return (
    <div className="w-full select-none">
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-3">
        <button
          type="button"
          onClick={() => { const d = new Date(month); d.setMonth(d.getMonth() - 1); onMonthChange(d); }}
          disabled={isPrevDisabled}
          className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6" /></svg>
        </button>
        <span className="text-sm font-bold capitalize text-gray-800 flex items-center gap-2">
          {monthLabel}
          {loading && <span className="inline-block w-3 h-3 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />}
        </span>
        <button
          type="button"
          onClick={() => { const d = new Date(month); d.setMonth(d.getMonth() + 1); onMonthChange(d); }}
          className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6" /></svg>
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-1">
        {dayLabels.map((d) => (
          <div key={d} className="text-center text-[10px] font-bold uppercase text-gray-400 py-1">{d}</div>
        ))}
      </div>

      {/* Date cells */}
      <div className="grid grid-cols-7 gap-y-1">
        {cells.map((cell) => {
          const dateStr = toDateStr(cell);
          const isCurrentMonth = cell.getMonth() === month.getMonth();
          const isPast = dateStr < todayStr;
          const isBlocked = blockedDates.has(dateStr);
          const booked = bookedByDate[dateStr] ?? 0;
          const cap = maxCapacity > 0 ? maxCapacity : 8;
          const fillRatio = booked / cap;
          const isFull = fillRatio >= 1;
          const isSelected = dateStr === selectedDate;
          const remaining = cap - booked;

          let dotColor = "";
          if (isCurrentMonth && !isPast && !isFull && !isBlocked && booked > 0) {
            dotColor = fillRatio >= 0.75 ? "bg-orange-400" : "bg-green-500";
          }

          let tooltip = "";
          if (isCurrentMonth && !isPast && isBlocked) {
            tooltip = lang === "en" ? "Unavailable"
              : lang === "es" ? "No disponible"
              : "Indisponible";
          } else if (isCurrentMonth && !isPast && fillRatio >= 0.75 && fillRatio < 1) {
            tooltip = lang === "en" ? `${remaining} spot${remaining > 1 ? "s" : ""} left`
              : lang === "es" ? `${remaining} plaza${remaining > 1 ? "s" : ""} restante${remaining > 1 ? "s" : ""}`
              : `${remaining} place${remaining > 1 ? "s" : ""} restante${remaining > 1 ? "s" : ""}`;
          }

          const isClickable = isCurrentMonth && !isPast && !isFull && !isBlocked;

          return (
            <div key={dateStr} className="flex justify-center">
              <button
                type="button"
                disabled={!isClickable}
                onClick={() => isClickable && onSelect(dateStr)}
                title={tooltip || undefined}
                className={[
                  "relative w-9 h-9 rounded-xl text-sm font-medium transition-all duration-150 flex flex-col items-center justify-center gap-0.5",
                  !isCurrentMonth ? "opacity-20 pointer-events-none text-gray-400" : "",
                  isCurrentMonth && isPast ? "text-gray-300 cursor-not-allowed" : "",
                  isCurrentMonth && !isPast && isBlocked ? "bg-gray-100 text-gray-300 cursor-not-allowed" : "",
                  isCurrentMonth && !isPast && !isBlocked && isFull ? "bg-red-100 text-red-400 line-through cursor-not-allowed" : "",
                  isSelected && !isFull ? "bg-amber-500 text-white shadow-md shadow-amber-200 scale-105" : "",
                  isClickable && !isSelected ? "hover:bg-amber-50 hover:text-amber-700 cursor-pointer text-gray-700" : "",
                ].filter(Boolean).join(" ")}
              >
                <span className="leading-none text-xs">{cell.getDate()}</span>
                {dotColor && <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />}
              </button>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-3 px-1">
        <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
          <span className="w-2 h-2 rounded-full bg-green-500" />
          {lang === "en" ? "Available" : lang === "es" ? "Disponible" : "Disponible"}
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
          <span className="w-2 h-2 rounded-full bg-orange-400" />
          {lang === "en" ? "Filling up" : lang === "es" ? "Casi lleno" : "Presque plein"}
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
          <span className="w-2 h-2 rounded-full bg-red-400" />
          {lang === "en" ? "Full" : lang === "es" ? "Completo" : "Complet"}
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
          <span className="w-2 h-2 rounded-full bg-gray-300" />
          {lang === "en" ? "Closed" : lang === "es" ? "Cerrado" : "Fermé"}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------

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
    comment: "",
  });
  // Pickup time is derived from the tour's departureTime — never an editable
  // form field. Audit H7: previously hardcoded "09:00" leaked into emails.
  const pickupTime = tour?.departureTime || "";

  const [clientSecret, setClientSecret] = useState("");
  const [paymentIntentId, setPaymentIntentId] = useState("");
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [serverMode, setServerMode] = useState<"test" | "live" | null>(null);
  // Tracks the (participants, date, tourId) tuple the current PI was created
  // for. When any of those change, the PI must be invalidated (audit H4).
  const piContextRef = useRef<string>("");

  // Availability calendar state
  const [calendarMonth, setCalendarMonth] = useState<Date>(() => {
    const d = new Date();
    d.setDate(1);
    return d;
  });
  const [bookedByDate, setBookedByDate] = useState<Record<string, number>>({});
  const [blockedDates, setBlockedDates] = useState<Set<string>>(new Set());
  const [availabilityLoading, setAvailabilityLoading] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Reset scroll position when step changes
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [step]);

  useEffect(() => {
    if (isOpen) {
      Promise.resolve().then(() => {
        setStep(1);
        // Local date string — never toISOString (audit H1, M11)
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const y = tomorrow.getFullYear();
        const m = String(tomorrow.getMonth() + 1).padStart(2, "0");
        const day = String(tomorrow.getDate()).padStart(2, "0");
        setDate(`${y}-${m}-${day}`);
        // Reset calendar to current month
        const cm = new Date();
        cm.setDate(1);
        setCalendarMonth(cm);
      });
    }
  }, [isOpen]);

  // Fetch availability for this tour
  useEffect(() => {
    if (!isOpen || !tour || !supabase) return;
    let cancelled = false;

    const fetchAvailability = async () => {
      setAvailabilityLoading(true);
      setBookedByDate({});
      setBlockedDates(new Set());
      // Local date string — never toISOString (audit H1)
      const today = new Date();
      const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

      const [resResult, blockedResult] = await Promise.all([
        supabase!
          .from("reservations")
          .select("date, participants")
          .eq("tour_id", tour.id.toString())
          .in("status", ["pending", "confirmed"])
          .gte("date", todayStr),
        supabase!
          .from("blocked_dates")
          .select("date")
          .eq("tour_id", tour.id.toString())
          .gte("date", todayStr),
      ]);

      if (!cancelled) {
        if (!resResult.error && resResult.data) {
          const agg: Record<string, number> = {};
          for (const row of resResult.data) {
            const d = row.date as string;
            agg[d] = (agg[d] ?? 0) + (row.participants as number);
          }
          setBookedByDate(agg);
        }
        if (!blockedResult.error && blockedResult.data) {
          setBlockedDates(new Set(blockedResult.data.map((r) => r.date as string)));
        }
        setAvailabilityLoading(false);
      }
    };

    fetchAvailability();
    return () => { cancelled = true; };
  }, [isOpen, tour]);

  useEffect(() => {
    if (!tour || step !== 3) return;

    // Invalidate stale PI if pricing inputs changed since it was created (audit H4).
    const ctx = `${tour.id}-${participants}-${date}`;
    const piIsStale = clientSecret && piContextRef.current !== ctx;

    if (!piIsStale && (clientSecret || paymentError)) return;

    // Cancellation: late responses must not write to state if a newer fetch
    // started (race condition / unmount — audit React #1).
    let cancelled = false;

    fetch("/api/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tourId: tour.id,
        participants: participants,
        lang: lang,
      }),
    })
      .then(async (res) => {
        let data;
        try {
          data = await res.json();
        } catch (e) {
          console.error("Failed to parse JSON response:", e);
          throw new Error(`${t.booking.server_error} (${res.status})`);
        }

        if (!res.ok) {
          throw new Error(data.error || `${t.booking.server_error} (${res.status})`);
        }
        return data;
      })
      .then((data) => {
        if (cancelled) return;
        if (data.clientSecret) {
          piContextRef.current = ctx;
          setClientSecret(data.clientSecret);
          setPaymentIntentId(data.paymentIntentId || "");
          setServerMode(data.mode);
          setPaymentError(null);
        } else {
          throw new Error(t.booking.missing_client_secret);
        }
      })
      .catch((err) => {
        if (cancelled) return;
        console.error("Payment init error:", err);
        const errMsg = err.message || t.booking.loading_error;
        setPaymentError(errMsg);
        toast.error(`${t.booking.payment_error} : ${errMsg}`);
        setClientSecret("");
      });

    return () => { cancelled = true; };
  }, [tour, step, clientSecret, paymentError, participants, date, lang, t.booking.payment_error, t.booking.server_error, t.booking.missing_client_secret, t.booking.loading_error]);

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
      // Guard: check if selected date is blocked or full
      if (blockedDates.has(date)) {
        toast.error(
          lang === "en" ? "This date is unavailable. Please select another date."
          : lang === "es" ? "Esta fecha no está disponible. Por favor elige otra fecha."
          : "Cette date est indisponible. Veuillez en choisir une autre."
        );
        return;
      }
      const booked = bookedByDate[date] ?? 0;
      const cap = tour?.maxCapacity ?? 8;
      if (booked >= cap) {
        toast.error(
          lang === "en" ? "This date is fully booked. Please select another date."
          : lang === "es" ? "Esta fecha está completa. Por favor elige otra fecha."
          : "Cette date est complète. Veuillez en choisir une autre."
        );
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

  // Guard against double-submit (audit React #2): Stripe can fire onSuccess
  // multiple times on 3DS retries / fast double-clicks before isLoading paints.
  const handleSuccessRunningRef = useRef(false);

  const handleSuccess = async () => {
    if (handleSuccessRunningRef.current) return;
    handleSuccessRunningRef.current = true;

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
      pickup_address: formData.pickupAddress,
      pickup_time: pickupTime,
      billing_address: formData.address,
      billing_city: formData.city,
      billing_zip: formData.zip,
      billing_country: formData.country,
      payment_intent_id: paymentIntentId || null,
    };

    if (!supabase) {
      // No DB available — still show success since payment went through.
      setStep(5);
      return;
    }

    // Insert WITHOUT chaining .select() — anon role has no SELECT permission
    // on reservations under current RLS policy, which would return 401.
    const { error } = await supabase
      .from("reservations")
      .insert(newReservation);

    if (error) {
      // CRITICAL: payment was captured by Stripe but the DB insert failed.
      // Do NOT show the success screen — the user must contact us so we can
      // reconcile manually (audit React #3). Allow them to retry too.
      console.error("Reservation insert failed after successful payment:", error);
      toast.error(t.booking.email_send_failed);
      handleSuccessRunningRef.current = false;
      return;
    }

    // Trigger confirmation email (best effort — webhook is the canonical sender)
    // Look up by payment_intent_id (server-side) — we can't read back the row id
    // from the anon insert, but we have the PI id locally.
    if (paymentIntentId) {
      fetch("/api/confirm-booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentIntentId, lang }),
      })
        .then(async (res) => {
          if (!res.ok) {
            const body = await res.json().catch(() => ({}));
            console.error("confirm-booking error:", res.status, body);
          }
        })
        .catch((err) => {
          console.error("Failed to trigger confirmation email:", err);
        });
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
                {/* Itinerary & Inclusions/Exclusions Summary — only shown when data exists */}
                {(() => {
                  // App.tsx already resolves the correct language into tour.itinerary/included/notIncluded
                  const itinerary = tour.itinerary ?? [];
                  const included = tour.included ?? [];
                  const notIncluded = tour.notIncluded ?? [];
                  if (itinerary.length === 0 && included.length === 0) return null;
                  return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {itinerary.length > 0 && (
                        <div className="space-y-3 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                          <h4 className="font-sans text-[10px] font-bold uppercase tracking-widest text-amber-600 flex items-center gap-2">
                            <ChevronRight className="w-3 h-3" /> {t.booking.itinerary}
                          </h4>
                          <div className="relative pl-3 border-l-2 border-amber-100 space-y-3">
                            {itinerary.slice(0, 5).map((item, i) => (
                              <div key={i} className="relative">
                                <div className="absolute -left-[17px] top-1 w-2 h-2 rounded-full bg-amber-400" />
                                <p className="text-[11px] text-gray-700 leading-tight">{item}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {included.length > 0 && (
                        <div className="space-y-3 p-4 rounded-2xl border border-gray-100 bg-gray-50/50">
                          <div className="space-y-2">
                            <h4 className="font-sans text-[10px] font-bold uppercase tracking-widest text-green-700 flex items-center gap-1.5">
                              <Check className="w-3 h-3" /> {t.booking.included_label}
                            </h4>
                            <ul className="space-y-1">
                              {included.slice(0, 3).map((item, i) => (
                                <li key={i} className="text-[11px] text-gray-700 leading-tight">• {item}</li>
                              ))}
                            </ul>
                          </div>
                          {notIncluded.length > 0 && (
                            <div className="space-y-2 pt-2 border-t border-gray-100">
                              <h4 className="font-sans text-[10px] font-bold uppercase tracking-widest text-red-500 flex items-center gap-1.5">
                                <X className="w-3 h-3" /> {t.booking.not_included_label}
                              </h4>
                              <ul className="space-y-1">
                                {notIncluded.slice(0, 3).map((item, i) => (
                                  <li key={i} className="text-[11px] text-gray-500 leading-tight">• {item}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })()}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-sans font-bold flex items-center gap-2 text-gray-900">
                      <CalendarIcon className="w-5 h-5 text-amber-600" />
                      {t.booking.date_title}
                    </h3>
                    <div className="grid gap-2">
                      <Label className="text-xs uppercase tracking-wider text-gray-500">{t.booking.date_label}</Label>
                      <div className="rounded-2xl border border-gray-200 bg-white p-3 shadow-sm" data-testid="availability-calendar">
                        <AvailabilityCalendar
                          selectedDate={date}
                          onSelect={setDate}
                          bookedByDate={bookedByDate}
                          blockedDates={blockedDates}
                          maxCapacity={tour.maxCapacity ?? 8}
                          month={calendarMonth}
                          onMonthChange={setCalendarMonth}
                          loading={availabilityLoading}
                          lang={lang}
                        />
                      </div>
                      {date && (
                        <p className="text-xs text-amber-700 font-medium mt-1">
                          {new Date(date + "T00:00:00").toLocaleDateString(
                            lang === "en" ? "en-US" : lang === "es" ? "es-ES" : "fr-FR",
                            { weekday: "long", year: "numeric", month: "long", day: "numeric" }
                          )}
                        </p>
                      )}
                    </div>
                    {/* Pick-up time: read-only from tour data */}
                    {tour.departureTime && (
                      <div className="grid gap-2">
                        <Label className="text-xs uppercase tracking-wider text-gray-500">
                          {t.booking.departure_time}
                        </Label>
                        <div className="h-12 flex items-center px-4 rounded-xl bg-amber-50 border border-amber-100 font-semibold text-amber-800">
                          {tour.departureTime}
                        </div>
                      </div>
                    )}
                    {tour.estimatedDuration && (
                      <div className="grid gap-2">
                        <Label className="text-xs uppercase tracking-wider text-gray-500">
                          {t.booking.estimated_duration}
                        </Label>
                        <div className="h-10 flex items-center text-sm text-gray-700">
                          {(t.tours.duration_labels as Record<string, string>)[tour.estimatedDuration] || tour.estimatedDuration}
                        </div>
                      </div>
                    )}
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
                          onClick={() => setParticipants(Math.min(tour.maxCapacity ?? 8, participants + 1))}
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
                    <Input id="booking-name" placeholder={t.booking.name_placeholder} value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="h-12 rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="booking-email" className="text-xs uppercase tracking-wider text-gray-500 font-bold">{t.contact.email}*</Label>
                    <Input id="booking-email" type="email" placeholder={t.booking.email_placeholder} value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="h-12 rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="booking-phone" className="text-xs uppercase tracking-wider text-gray-500 font-bold">{t.booking.phone}</Label>
                    <Input id="booking-phone" placeholder={t.booking.phone_placeholder} value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="h-12 rounded-xl" />
                  </div>
                   <div className="space-y-2">
                    <Label htmlFor="booking-pickup" className="text-xs uppercase tracking-wider text-gray-500 font-bold">{t.booking.pickup_address}</Label>
                    <Input id="booking-pickup" placeholder={t.booking.pickup_placeholder} value={formData.pickupAddress} onChange={(e) => setFormData({ ...formData, pickupAddress: e.target.value })} className="h-12 rounded-xl" />
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-gray-100">
                  <h4 className="text-sm font-bold uppercase tracking-widest text-gray-400">{t.booking.billing_address} {t.common.optional}</h4>
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
                      <p className="flex justify-between"><span>{t.booking.date_label} :</span> <span className="font-bold">{date}</span></p>
                      <p className="flex justify-between">
                        <span>{t.booking.pickup_time} :</span>
                        <span className="font-bold">{pickupTime || "—"}</span>
                      </p>
                      <p className="flex justify-between">
                        <span>{t.booking.est_duration_short} :</span>
                        <span className="font-bold">{(t.tours.duration_labels as Record<string, string>)[tour.duration] || tour.duration}</span>
                      </p>
                      <p className="flex justify-between">
                        <span>{t.booking.travelers_label} :</span>
                        <span className="font-bold">{participants}</span>
                      </p>
                      <p className="flex flex-col gap-1 mt-2 p-2 bg-gray-50 rounded-lg">
                        <span className="text-[10px] uppercase font-bold text-amber-600">{t.booking.pickup_address}</span>
                        <span className="font-medium">{formData.pickupAddress || t.booking.to_confirm}</span>
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
                        <p className="flex justify-between"><span>{t.booking.pickup_time} :</span> <span className="font-bold text-right max-w-[60%]">{formData.pickupAddress}</span></p>
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

                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 mt-4 space-y-2">
                  <div className="flex justify-between text-sm text-amber-900">
                    <span>{tour.title}</span>
                    <span>{calculateSubtotal().toFixed(2)}€</span>
                  </div>
                  <div className="flex justify-between text-sm text-amber-700/80">
                    <span>{t.booking.processing_fees}</span>
                    <span>{(calculateTotal() - calculateSubtotal()).toFixed(2)}€</span>
                  </div>
                  <div className="flex justify-between items-baseline pt-2 border-t border-amber-200">
                    <div>
                      <p className="text-xs text-amber-800 font-bold uppercase tracking-wider">{t.booking.total_paid}</p>
                      <p className="text-3xl font-serif font-bold text-amber-900">{calculateTotal()}€</p>
                    </div>
                    <div className="text-right text-[10px] text-amber-700/60 leading-tight italic">
                      {t.booking.per_person_incl_fees}<br/>
                      ({(calculateTotal() / participants).toFixed(2)}€ /pers)
                    </div>
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
                  <p><span className="text-[10px] uppercase font-bold text-gray-400 block">{t.booking.travelers_label}</span>{participants}</p>
                  <p><span className="text-[10px] uppercase font-bold text-gray-400 block">{t.booking.date_label}</span>{date}</p>
                  <p><span className="text-[10px] uppercase font-bold text-gray-400 block">{t.booking.pickup_time}</span>{pickupTime || "—"}</p>
                  <p className="col-span-2"><span className="text-[10px] uppercase font-bold text-amber-600 block">{t.booking.pickup_address}</span>{formData.pickupAddress || t.booking.to_confirm}</p>
                  <p><span className="text-[10px] uppercase font-bold text-gray-400 block">{t.booking.est_duration_short}</span>{(t.tours.duration_labels as Record<string, string>)[tour.duration] || tour.duration}</p>
                  <p><span className="text-[10px] uppercase font-bold text-gray-400 block">{t.booking.total}</span><span className="font-bold text-amber-700">{calculateTotal()}€</span></p>
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
                      t={t}
                    />
                  </Elements>
                ) : !isValidStripeKey || paymentError ? (
                  <div className="flex flex-col items-center justify-center py-12 text-red-600 bg-red-50 rounded-2xl border border-red-100 p-6 text-center">
                    <X className="w-10 h-10 mb-4" />
                    <p className="font-bold mb-2">{t.booking.payment_issue}</p>
                    <p className="text-sm opacity-80 mb-4">
                      {!isValidStripeKey
                        ? t.booking.invalid_stripe_key
                        : `${t.booking.payment_error} : ${paymentError}`
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
                        {t.booking.back_to_settings}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                    <Loader2 className="w-10 h-10 animate-spin mb-4 text-amber-600" />
                    <p className="font-bold">{t.booking.initialization}</p>
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
                    {t.booking.success_message
                      .replace('{name}', formData.name)
                      .replace('{email}', formData.email)}
                  </p>
                </div>

                <div className="bg-amber-50 p-6 rounded-2xl w-full border border-amber-100 text-left space-y-4">
                  <h4 className="text-amber-800 font-bold uppercase tracking-widest text-xs border-b border-amber-200 pb-2">{t.booking.summary}</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-amber-900/80">
                    <div className="space-y-2">
                      <p className="flex flex-col"><span className="text-[10px] uppercase font-bold opacity-50">{t.booking.tour_details}</span> <span className="font-bold text-amber-900">{tour.title}</span></p>
                      <p className="flex flex-col"><span className="text-[10px] uppercase font-bold opacity-50">{t.booking.date_time_label}</span> <span className="font-bold text-amber-900">{date} • {(t.tours.duration_labels as Record<string, string>)[tour.duration] || tour.duration}</span></p>
                    </div>
                    <div className="space-y-2">
                      <p className="flex flex-col"><span className="text-[10px] uppercase font-bold opacity-50">{t.booking.client_label}</span> <span className="font-bold text-amber-900">{formData.name}</span></p>
                      <p className="flex flex-col"><span className="text-[10px] uppercase font-bold opacity-50">{t.booking.pickup_address}</span> <span className="font-bold text-amber-900">{formData.pickupAddress || t.booking.to_confirm}</span></p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-amber-200 mt-2 space-y-1">
                    <p className="flex justify-between text-sm text-amber-800">
                      <span>{t.booking.tour_details}</span>
                      <span>{calculateSubtotal().toFixed(2)}€</span>
                    </p>
                    <p className="flex justify-between text-sm text-amber-700/70">
                      <span>{t.booking.processing_fees}</span>
                      <span>{(calculateTotal() - calculateSubtotal()).toFixed(2)}€</span>
                    </p>
                    <p className="flex justify-between text-base font-bold text-amber-900 pt-1">
                      <span>{t.booking.total_paid}</span>
                      <span>{calculateTotal()}€</span>
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
                  <div className="flex items-baseline gap-3">
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none">Total</p>
                      <p className="text-xl font-bold text-gray-900">{calculateTotal()}€</p>
                    </div>
                    <div className="text-[10px] text-gray-400 leading-tight">
                      <span>{lang === 'en' ? 'Tour' : lang === 'es' ? 'Tour' : 'Tour'}: {calculateSubtotal().toFixed(2)}€</span>
                      <br/>
                      <span>{t.booking.processing_fees}: +{(calculateTotal() - calculateSubtotal()).toFixed(2)}€</span>
                    </div>
                  </div>
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
