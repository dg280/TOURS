import { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { Button } from './ui/button';
import { Loader2 } from 'lucide-react';

interface CheckoutFormProps {
    onSuccess: () => void;
    amount: number;
}

export function CheckoutForm({ onSuccess, amount }: CheckoutFormProps) {
    const stripe = useStripe();
    const elements = useElements();
    const [message, setMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isElementsReady, setIsElementsReady] = useState(false);

    console.log("[CheckoutForm] Render - stripe:", !!stripe, "elements:", !!elements, "amount:", amount);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!stripe || !elements) return;

        setIsLoading(true);

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: window.location.origin,
            },
            redirect: 'if_required',
        });

        if (error) {
            if (error.type === "card_error" || error.type === "validation_error") {
                setMessage(error.message || "An error occurred.");
            } else {
                setMessage("An unexpected error occurred.");
            }
        } else {
            onSuccess();
        }

        setIsLoading(false);
    };

    return (
        <form id="payment-form" onSubmit={handleSubmit} className="space-y-6">
            {!isElementsReady && (
                <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                    <Loader2 className="w-8 h-8 animate-spin mb-2" />
                    <p className="text-sm">Chargement du formulaire sécurisé...</p>
                </div>
            )}
            <div className={isElementsReady ? "block" : "hidden"}>
                <PaymentElement 
                    id="payment-element" 
                    options={{ layout: 'tabs' }} 
                    onReady={() => {
                        console.log("[CheckoutForm] PaymentElement Ready");
                        setIsElementsReady(true);
                    }}
                />
            </div>
            
            {(!stripe || !elements) && (
                <div className="text-amber-600 text-sm mt-2 bg-amber-50 p-3 rounded-lg border border-amber-200">
                    En attente de Stripe... {!!stripe ? "(Stripe OK)" : "(Stripe en attente)"} {!!elements ? "(Elements OK)" : "(Elements en attente)"}
                </div>
            )}
            {message && <div id="payment-message" className="text-red-500 text-sm mt-2">{message}</div>}
            <Button
                disabled={isLoading || !stripe || !elements || !isElementsReady}
                id="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg font-bold"
            >
                <span id="button-text">
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : `Payer ${(amount).toFixed(2)}€`}
                </span>
            </Button>
            {isElementsReady && (
                <p className="text-[10px] text-center text-gray-400 uppercase tracking-widest font-bold">
                    Paiement Sécurisé par Stripe
                </p>
            )}
        </form>
    );
}
