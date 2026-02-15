import { useState } from "react";
import { Button } from "@/components/ui/button";
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
            console.log('COOKIE: Saving custom preferences...', preferences);
            localStorage.setItem("cookie-preferences", JSON.stringify(preferences));
            localStorage.setItem("cookie-consent", "accepted");
            console.log('COOKIE: LocalStorage updated, calling onAccept()');
            onAccept();
        } catch (e) {
            console.error("COOKIE: Save error:", e);
            onAccept(); // Still close the banner
        }
    };

    const handleAcceptAll = () => {
        try {
            console.log('COOKIE: Accepting all...');
            const allOn = { essential: true, analytics: true, marketing: true };
            localStorage.setItem("cookie-preferences", JSON.stringify(allOn));
            localStorage.setItem("cookie-consent", "accepted");
            console.log('COOKIE: LocalStorage updated, calling onAccept()');
            onAccept();
        } catch (e) {
            console.error("COOKIE: Accept all error:", e);
            onAccept(); // Still close the banner
        }
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 lg:p-8 animate-in fade-in slide-in-from-bottom-10 duration-700">
            <div className="max-w-4xl mx-auto">
                <Card className="bg-white/95 backdrop-blur-md shadow-2xl border border-amber-100 overflow-hidden rounded-3xl">
                    <button
                        onClick={() => { console.log('COOKIE: Force close clicked'); onAccept(); }}
                        className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-900 z-50"
                    >
                        ✕
                    </button>
                    {!showSettings ? (
                        <div className="p-6 md:p-8 flex flex-col md:flex-row items-center gap-6">
                            <div className="bg-amber-100 p-3 rounded-2xl shrink-0">
                                <Cookie className="w-8 h-8 text-amber-600" />
                            </div>
                            <div className="flex-1 text-center md:text-left">
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{t.title}</h3>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    {t.desc}
                                </p>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
                                <button
                                    onClick={() => setShowSettings(true)}
                                    className="px-6 h-12 text-gray-500 hover:bg-gray-100 rounded-xl transition-colors text-sm font-medium border border-gray-100"
                                >
                                    {t.manage}
                                </button>
                                <button
                                    onClick={handleAcceptAll}
                                    className="px-8 h-12 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-lg shadow-amber-600/20 transition-all active:scale-95 cursor-pointer relative z-[10]"
                                >
                                    {t.accept} (V3)
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="p-6 md:p-8 space-y-8 animate-in fade-in zoom-in-95 duration-500">
                            <header className="flex items-center gap-3">
                                <ShieldCheck className="w-6 h-6 text-amber-600" />
                                <h3 className="text-xl font-bold text-gray-900">{t.manage}</h3>
                            </header>

                            <div className="grid gap-6">
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-green-100 p-2 rounded-lg">
                                            <ShieldCheck className="w-5 h-5 text-green-600" />
                                        </div>
                                        <div>
                                            <Label className="font-bold text-gray-900">{t.essential}</Label>
                                            <p className="text-xs text-gray-500">Sécurité et fonctionnalités de base.</p>
                                        </div>
                                    </div>
                                    <Switch checked={true} disabled />
                                </div>

                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-blue-100 p-2 rounded-lg">
                                            <PieChart className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <Label className="font-bold text-gray-900">{t.analytics}</Label>
                                            <p className="text-xs text-gray-500">Statistiques anonymes d'utilisation.</p>
                                        </div>
                                    </div>
                                    <Switch
                                        checked={preferences.analytics}
                                        onCheckedChange={(val) => setPreferences({ ...preferences, analytics: val })}
                                    />
                                </div>

                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-purple-100 p-2 rounded-lg">
                                            <Megaphone className="w-5 h-5 text-purple-600" />
                                        </div>
                                        <div>
                                            <Label className="font-bold text-gray-900">{t.marketing}</Label>
                                            <p className="text-xs text-gray-500">Personnalisation des offres.</p>
                                        </div>
                                    </div>
                                    <Switch
                                        checked={preferences.marketing}
                                        onCheckedChange={(val) => setPreferences({ ...preferences, marketing: val })}
                                    />
                                </div>
                            </div>

                            <div className="flex justify-between items-center pt-4">
                                <Button variant="ghost" onClick={() => setShowSettings(false)}>
                                    Retour
                                </Button>
                                <button
                                    onClick={handleSave}
                                    className="px-8 h-12 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl transition-all active:scale-95"
                                >
                                    {t.save}
                                </button>
                            </div>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
}
