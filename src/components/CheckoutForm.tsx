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
            <PaymentElement id="payment-element" options={{ layout: 'tabs' }} />
            {message && <div id="payment-message" className="text-red-500 text-sm mt-2">{message}</div>}
            <Button
                disabled={isLoading || !stripe || !elements}
                id="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg"
            >
                <span id="button-text">
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : `Payer ${(amount).toFixed(2)}€`}
                </span>
            </Button>
        </form>
    );
}
