import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Calendar as CalendarIcon, Users, CheckCircle2, ChevronRight, Minus, Plus, CreditCard, Info } from 'lucide-react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { CheckoutForm } from '../CheckoutForm';
import { toast } from 'sonner';
import type { Tour } from '@/lib/types';
import { supabase } from '@/lib/supabase';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');

interface BookingModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    tour: Tour | null;
    lang: string;
    t: any;
}

export const BookingModal = ({ isOpen, onOpenChange, tour, lang, t }: BookingModalProps) => {
    const [step, setStep] = useState(1);
    const [participants, setParticipants] = useState(2);
    const [date, setDate] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
    });
    const [clientSecret, setClientSecret] = useState('');

    useEffect(() => {
        if (isOpen) {
            setStep(1);
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            setDate(tomorrow.toISOString().split('T')[0]);
        }
    }, [isOpen]);

    useEffect(() => {
        if (tour && step === 3 && !clientSecret) {
            fetch('/api/create-payment-intent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    tourId: tour.id,
                    participants: participants
                }),
            })
                .then(async (res) => {
                    if (!res.ok) throw new Error("Erreur serveur");
                    return res.json();
                })
                .then((data) => {
                    if (data.clientSecret) setClientSecret(data.clientSecret);
                })
                .catch(err => {
                    console.error(err);
                    toast.error(lang === 'fr' ? "Erreur de paiement" : "Payment Error");
                    setStep(2);
                });
        }
    }, [tour, step, clientSecret, participants, lang]);

    const calculateTotal = () => {
        if (!tour) return 0;
        return tour.price * participants;
    };

    const nextStep = () => {
        if (step === 1) {
            if (!date) {
                toast.error(t.booking.date_error || 'Date required');
                return;
            }
            setStep(2);
        } else if (step === 2) {
            if (!formData.name || !formData.email) {
                toast.error(t.booking.info_error || 'Info required');
                return;
            }
            setClientSecret('');
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
            status: 'pending' as const,
        };

        if (supabase) {
            await supabase.from('reservations').insert(newReservation);
        }

        setStep(4);
    };

    if (!tour) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] w-[95vw] p-0 overflow-hidden rounded-2xl border-none shadow-2xl bg-white">
                <div className="flex flex-col h-full max-h-[90vh]">
                    <div className="bg-gray-900 text-white p-6 sm:p-8">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <p className="text-amber-400 text-xs font-bold uppercase tracking-widest mb-1">{t.booking.step} {step} {t.booking.step_of} 4</p>
                                <DialogTitle className="text-2xl font-serif">{tour.title}</DialogTitle>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${i <= step ? 'bg-amber-500' : 'bg-white/10'}`} />
                            ))}
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 sm:p-8">
                        {step === 1 && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                                <div className="space-y-4">
                                    <h3 className="text-xl font-bold flex items-center gap-2">
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
                                            min={new Date().toISOString().split('T')[0]}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-xl font-bold flex items-center gap-2">
                                        <Users className="w-5 h-5 text-amber-600" />
                                        {t.booking.participants}
                                    </h3>
                                    <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl border border-gray-100">
                                        <span className="font-medium">{participants} {participants > 1 ? t.booking.travelers : t.booking.traveler}</span>
                                        <div className="flex items-center gap-4">
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() => setParticipants(Math.max(1, participants - 1))}
                                                className="rounded-full w-10 h-10"
                                            >
                                                <Minus className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() => setParticipants(Math.min(8, participants + 1))}
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
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                                <h3 className="text-xl font-bold flex items-center gap-2 mb-6">
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
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="h-12"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="booking-phone">{lang === 'fr' ? 'Téléphone' : 'Phone'}</Label>
                                        <Input
                                            id="booking-phone"
                                            placeholder="+33 6 ..."
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="h-12"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                                <h3 className="text-xl font-bold flex items-center gap-2 mb-6">
                                    <CreditCard className="w-5 h-5 text-amber-600" />
                                    {t.booking.payment_title}
                                </h3>
                                {clientSecret ? (
                                    <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'stripe' } }}>
                                        <CheckoutForm onSuccess={handleSuccess} amount={calculateTotal()} />
                                    </Elements>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                                        <Loader2 className="w-10 h-10 animate-spin mb-4 text-amber-600" />
                                        <p>Initialisation du paiement...</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {step === 4 && (
                            <div className="flex flex-col items-center justify-center py-12 text-center space-y-6 animate-in zoom-in-95">
                                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-2">
                                    <CheckCircle2 className="w-10 h-10 text-green-600" />
                                </div>
                                <div>
                                    <h3 className="text-3xl font-bold text-gray-900 mb-2">{t.booking.success_title}</h3>
                                    <p className="text-gray-600 max-w-sm mx-auto">
                                        {lang === 'fr'
                                            ? `Merci ${formData.name}. Un email de confirmation a été envoyé à ${formData.email}.`
                                            : `Thank you ${formData.name}. A confirmation email has been sent to ${formData.email}.`}
                                    </p>
                                </div>
                                <div className="bg-amber-50 p-6 rounded-2xl w-full border border-amber-100 text-left">
                                    <p className="text-amber-800 font-bold mb-4">Récapitulatif :</p>
                                    <div className="space-y-2 text-sm text-amber-900/80">
                                        <p className="flex justify-between"><span>Tour:</span> <span className="font-bold text-amber-900">{tour.title}</span></p>
                                        <p className="flex justify-between"><span>Date:</span> <span className="font-bold text-amber-900">{date}</span></p>
                                        <p className="flex justify-between"><span>Voyageurs:</span> <span className="font-bold text-amber-900">{participants}</span></p>
                                        <div className="pt-2 border-t border-amber-200 mt-2">
                                            <p className="flex justify-between text-base"><span>Total payé:</span> <span className="font-bold text-amber-900">{calculateTotal()}€</span></p>
                                        </div>
                                    </div>
                                </div>
                                <Button onClick={() => onOpenChange(false)} className="w-full bg-gray-900 h-12 text-lg mt-6">
                                    {t.booking.finish}
                                </Button>
                            </div>
                        )}
                    </div>

                    {step < 3 && (
                        <div className="p-6 sm:p-8 bg-gray-50 border-t flex items-center justify-between shrink-0">
                            <div className="text-left">
                                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{t.booking.total}</p>
                                <p className="text-2xl font-bold text-gray-900">{calculateTotal()}€</p>
                            </div>
                            <Button
                                onClick={nextStep}
                                className="bg-amber-600 hover:bg-amber-700 text-white px-10 h-14 text-lg font-bold shadow-lg shadow-amber-600/20"
                            >
                                {t.booking.next}
                                <ChevronRight className="w-5 h-5 ml-2" />
                            </Button>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};
