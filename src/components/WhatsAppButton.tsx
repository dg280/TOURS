import { MessageCircle } from 'lucide-react';
import { translations, type Language } from '@/lib/translations';

interface WhatsAppButtonProps {
    lang: Language;
}

export const WhatsAppButton = ({ lang }: WhatsAppButtonProps) => {
    const t = translations[lang];
    const phoneNumber = t.contact.whatsapp.replace(/\s+/g, '').replace('+', '');

    // Custom message based on language
    const message = lang === 'fr'
        ? "Bonjour Antoine, j'aimerais avoir plus d'informations sur vos tours à Barcelone."
        : lang === 'es'
            ? "Hola Antoine, me gustaría tener más información sobre sus tours en Barcelona."
            : "Hello Antoine, I would like more information about your tours in Barcelona.";

    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    return (
        <div className="fixed bottom-32 right-6 z-[110] flex flex-col items-end gap-3 group">
            {/* Label Tooltip */}
            <div className="bg-white px-4 py-2 rounded-xl shadow-xl border border-gray-100 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 pointer-events-none">
                <p className="text-xs font-bold text-gray-800 whitespace-nowrap">
                    {lang === 'fr' ? 'Une question ? Discutez avec moi !' : lang === 'es' ? '¿Una pregunta? ¡Chatea conmigo!' : 'Any questions? Chat with me!'}
                </p>
            </div>

            {/* Floating Button */}
            <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="relative flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 hover:rotate-6"
                aria-label="Chat on WhatsApp"
            >
                <MessageCircle className="w-8 h-8" />

                {/* Animated pulse effect */}
                <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20 pointer-events-none"></span>

                {/* Small "1" notification badge to draw attention */}
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                    1
                </span>
            </a>
        </div>
    );
};
