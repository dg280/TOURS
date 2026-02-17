import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Activity, ArrowRight, Loader2 } from 'lucide-react';
import { type Language } from '@/lib/translations';

interface LiveJoinDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    lang: Language;
    t: any;
}

export const LiveJoinDialog = ({ isOpen, onOpenChange, lang, t }: LiveJoinDialogProps) => {
    const [sessionCode, setSessionCode] = useState('');
    const [activeSessions, setActiveSessions] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            checkActiveSessions();
        }
    }, [isOpen]);

    const checkActiveSessions = async () => {
        if (!supabase) return;
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('live_sessions')
                .select('*, tours(title, title_en, title_es)')
                .eq('is_active', true);

            if (error) throw error;
            setActiveSessions(data || []);
        } catch (err) {
            console.error('Error checking sessions:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleJoin = (code?: string) => {
        const finalCode = code || sessionCode;
        if (!finalCode.trim()) return;
        window.location.href = `/live.html?code=${finalCode.trim().toUpperCase()}`;
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Activity className="w-5 h-5 text-amber-600" />
                        {t.nav.live}
                    </DialogTitle>
                    <DialogDescription>
                        {activeSessions.length > 0
                            ? (lang === 'fr' ? 'Un tour est actuellement en cours !' : lang === 'en' ? 'A tour is currently in progress!' : '¡Un tour está en curso!')
                            : t.nav.no_live}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 pt-4">
                    {loading ? (
                        <div className="flex justify-center p-4">
                            <Loader2 className="w-6 h-6 animate-spin text-amber-600" />
                        </div>
                    ) : (
                        <>
                            {activeSessions.length > 0 && (
                                <div className="space-y-3">
                                    {activeSessions.map((session) => (
                                        <button
                                            key={session.id}
                                            onClick={() => handleJoin(session.session_code)}
                                            className="w-full flex items-center justify-between p-4 rounded-xl border border-amber-100 bg-amber-50/50 hover:bg-amber-100 transition-all text-left group"
                                        >
                                            <div>
                                                <p className="text-sm font-bold text-gray-900">
                                                    {lang === 'en' ? session.tours?.title_en : lang === 'es' ? session.tours?.title_es : session.tours?.title}
                                                </p>
                                                <p className="text-xs text-amber-700 font-mono mt-1">Code: {session.session_code}</p>
                                            </div>
                                            <ArrowRight className="w-4 h-4 text-amber-600 group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    ))}
                                </div>
                            )}

                            <div className="space-y-3">
                                <label className="text-sm font-medium text-gray-700 block">
                                    {t.nav.enter_code}
                                </label>
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="E.G. AB12"
                                        value={sessionCode}
                                        onChange={(e) => setSessionCode(e.target.value.toUpperCase())}
                                        className="flex-1 uppercase font-mono tracking-widest text-center"
                                        maxLength={10}
                                    />
                                    <Button
                                        onClick={() => handleJoin()}
                                        disabled={!sessionCode.trim()}
                                        className="bg-amber-600 hover:bg-amber-700"
                                    >
                                        Join
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};
