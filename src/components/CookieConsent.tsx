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
        <div style={{
            fixed: 'fixed',
            position: 'fixed',
            bottom: '20px',
            left: '20px',
            right: '20px',
            zIndex: 999999,
            backgroundColor: 'white',
            pointerEvents: 'auto',
            padding: '24px',
            borderRadius: '16px',
            boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
            border: '1px solid #fef3c7',
            maxWidth: '600px',
            margin: '0 auto'
        }} className="cookie-banner-raw">
            <button
                onClick={() => { console.log('COOKIE: Force close raw clicked'); onAccept(); }}
                style={{ position: 'absolute', top: '10px', right: '10px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '20px' }}
            >
                ✕
            </button>
            <div style={{ textAlign: 'center' }}>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: 'bold' }}>{t.title}</h3>
                <p style={{ margin: '0 0 16px 0', fontSize: '14px', color: '#4b5563' }}>{t.desc}</p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
                    <button
                        onClick={() => setShowSettings(!showSettings)}
                        style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #e5e7eb', background: 'white', cursor: 'pointer' }}
                    >
                        {t.manage}
                    </button>
                    <button
                        onClick={handleAcceptAll}
                        style={{ padding: '8px 24px', borderRadius: '8px', border: 'none', background: '#d97706', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}
                    >
                        {t.accept} (FINAL)
                    </button>
                </div>
            </div>
            {showSettings && (
                <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #e5e7eb' }}>
                    <button onClick={handleSave} style={{ width: '100%', padding: '8px', background: '#d97706', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                        {t.save}
                    </button>
                </div>
            )}
        </div>
    );
}
