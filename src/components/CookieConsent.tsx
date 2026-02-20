import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Cookie, ShieldCheck, PieChart, Megaphone } from "lucide-react";
import { translations, type Language } from "@/lib/translations";

interface CookieConsentProps {
    lang: Language;
    onAccept: () => void;
}

export function CookieConsent({ lang, onAccept }: CookieConsentProps) {
    const [showSettings, setShowSettings] = useState(false);
    const [preferences, setPreferences] = useState({
        essential: true,
        analytics: true,
        marketing: false,
    });

    const t = translations[lang].cookies;

    const handleSave = () => {
        try {
            localStorage.setItem("cookie-preferences", JSON.stringify(preferences));
            localStorage.setItem("cookie-consent", "accepted");
            onAccept();
        } catch {
            onAccept(); // Still close the banner
        }
    };

    const handleAcceptAll = () => {
        try {
            const allOn = { essential: true, analytics: true, marketing: true };
            localStorage.setItem("cookie-preferences", JSON.stringify(allOn));
            localStorage.setItem("cookie-consent", "accepted");
            onAccept();
        } catch {
            onAccept(); // Still close the banner
        }
    };

    return (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-10 md:bottom-10 z-[99999] pointer-events-auto">
            <Card className="max-w-[400px] w-full bg-white/95 backdrop-blur-md shadow-2xl border border-amber-100 rounded-3xl overflow-hidden relative">
                {/* Close Button */}
                <button
                    onClick={() => { onAccept(); }}
                    className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-900 transition-colors"
                    aria-label="Close"
                >
                    <span className="text-xl">✕</span>
                </button>

                {!showSettings ? (
                    <div className="p-6 space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-amber-100 p-2 rounded-xl">
                                <Cookie className="w-6 h-6 text-amber-600" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">{t.title}</h3>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            {t.desc}
                        </p>
                        <div className="flex flex-col gap-2 pt-2">
                            <button
                                type="button"
                                onClick={() => { handleAcceptAll(); }}
                                className="w-full h-12 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-lg shadow-amber-600/20 transition-all active:scale-95 cursor-pointer"
                            >
                                {t.accept}
                            </button>
                            <button
                                type="button"
                                onClick={() => { setShowSettings(true); }}
                                className="w-full h-12 text-gray-500 hover:bg-gray-100 rounded-xl transition-colors text-sm font-medium border border-gray-100 cursor-pointer"
                            >
                                {t.manage}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="p-6 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <header className="flex items-center gap-3">
                            <ShieldCheck className="w-5 h-5 text-amber-600" />
                            <h3 className="text-lg font-bold text-gray-900">{t.manage}</h3>
                        </header>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                                <div className="flex items-center gap-3">
                                    <ShieldCheck className="w-4 h-4 text-green-600" />
                                    <Label className="text-sm font-semibold text-gray-700">{t.essential}</Label>
                                </div>
                                <Switch checked={true} disabled />
                            </div>

                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                                <div className="flex items-center gap-3">
                                    <PieChart className="w-4 h-4 text-blue-600" />
                                    <Label className="text-sm font-semibold text-gray-700">{t.analytics}</Label>
                                </div>
                                <Switch
                                    checked={preferences.analytics}
                                    onCheckedChange={(val) => setPreferences({ ...preferences, analytics: val })}
                                />
                            </div>

                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                                <div className="flex items-center gap-3">
                                    <Megaphone className="w-4 h-4 text-purple-600" />
                                    <Label className="text-sm font-semibold text-gray-700">{t.marketing}</Label>
                                </div>
                                <Switch
                                    checked={preferences.marketing}
                                    onCheckedChange={(val) => setPreferences({ ...preferences, marketing: val })}
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-2 pt-2">
                            <button
                                type="button"
                                onClick={() => { handleSave(); }}
                                className="w-full h-12 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl transition-all active:scale-95 cursor-pointer"
                            >
                                {t.save}
                            </button>
                            <button
                                type="button"
                                onClick={() => { setShowSettings(false); }}
                                className="w-full h-10 text-gray-500 hover:text-gray-700 text-sm font-medium"
                            >
                                Retour
                            </button>
                        </div>
                    </div>
                )}
            </Card>
        </div>
    );
}
