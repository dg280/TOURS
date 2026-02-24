import { useState, useEffect, useRef } from "react";
import { supabase } from "../lib/supabase";
import {
  Activity,
  MapPin,
  MessageCircle,
  Camera,
  Heart,
  Send,
  AlertTriangle,
  ExternalLink,
  User as UserIcon,
  X,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Toaster, toast } from "sonner";
import type { LiveSession, Tour, LiveEcho, LiveMedia } from "../lib/types";
// Note: LiveJoinDialog is being used in App.tsx, but here we were trying to define it?
// The previous edit accidentally added a placeholder component. Removing it as it's not needed here.

export default function LiveApp() {
  const [session, setSession] = useState<LiveSession | null>(null);
  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState<string | null>(
    localStorage.getItem("td-live-name"),
  ); // Corrected userName state
  const [nameInput, setNameInput] = useState("");
  const [echoes, setEchoes] = useState<LiveEcho[]>([]);
  const [media, setMedia] = useState<LiveMedia[]>([]);
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const sessionCode =
    window.location.pathname.split("/").pop() ||
    new URLSearchParams(window.location.search).get("code");

  useEffect(() => {
    if (!sessionCode) return;

    const fetchSession = async () => {
      if (!supabase) return;
      try {
        const { data: sess, error: sessError } = await supabase
          .from("live_sessions")
          .select("*, tours(*)")
          .eq("session_code", sessionCode)
          .single();

        if (sessError) throw sessError;
        setSession(sess);
        setTour(sess.tours);

        // Fetch initial echoes and media
        const { data: ech } = await supabase
          .from("live_echoes")
          .select("*")
          .eq("session_id", sess.id)
          .order("created_at", { ascending: true });
        setEchoes(ech || []);

        const { data: med } = await supabase
          .from("live_media")
          .select("*")
          .eq("session_id", sess.id)
          .order("created_at", { ascending: false });
        setMedia(med || []);
      } catch (err) {
        console.error(err);
        toast.error("Session non trouvée ou terminée.");
      } finally {
        setLoading(false);
      }
    };

    fetchSession();

    // Subscribe to Realtime
    if (!supabase) return;
    const channel = supabase
      .channel(`session:${sessionCode}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "live_sessions",
          filter: `session_code=eq.${sessionCode}`,
        },
        (payload) => {
          setSession((prev) =>
            prev ? { ...prev, ...(payload.new as Partial<LiveSession>) } : null,
          );
          if ((payload.new as LiveSession).urgent_message) {
            toast.warning((payload.new as LiveSession).urgent_message, {
              duration: 10000,
            });
          }
        },
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "live_echoes" },
        (payload) => {
          setEchoes((prev) => [...prev, payload.new as LiveEcho]);
        },
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "live_media" },
        (payload) => {
          setMedia((prev) => [payload.new as LiveMedia, ...prev]);
        },
      )
      .subscribe();

    return () => {
      if (supabase) supabase.removeChannel(channel);
    };
  }, [sessionCode]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [echoes]);

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nameInput.trim().length < 2) return;
    localStorage.setItem("td-live-name", nameInput.trim());
    setUserName(nameInput.trim());
  };

  const sendEcho = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !userName || !session) return;

    const msg = message.trim();
    setMessage("");

    try {
      if (!supabase) return;
      const { error } = await supabase.from("live_echoes").insert({
        session_id: session.id,
        user_name: userName,
        message: msg,
      });
      if (error) throw error;
    } catch {
      toast.error("Échec de l'envoi");
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !session || !userName) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Fichier trop volumineux (max 10MB)");
      return;
    }

    setUploading(true);
    try {
      if (!supabase) return;
      const fileExt = file.name.split(".").pop();
      const fileName = `${session.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("live_photos")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("live_photos").getPublicUrl(fileName);

      const { error: dbError } = await supabase.from("live_media").insert({
        session_id: session.id,
        url: publicUrl,
        uploaded_by: userName,
      });

      if (dbError) throw dbError;
      toast.success("Photo partagée !");
    } catch (err) {
      const error = err as Error;
      toast.error("Erreur upload : " + error.message);
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <Activity className="w-12 h-12 text-amber-500 animate-spin" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-6 text-center">
        <AlertTriangle className="w-16 h-16 text-amber-500 mb-4" />
        <h1 className="text-2xl font-bold text-white mb-2">
          Session introuvable
        </h1>
        <p className="text-gray-400 mb-6">
          Le code de session est invalide ou la visite est terminée.
        </p>
        <Button
          className="bg-[#c9a961]"
          onClick={() => (window.location.href = "/")}
        >
          Retour à l'accueil
        </Button>
      </div>
    );
  }

  if (!userName) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-6 bg-gradient-to-b from-[#111] to-[#0a0a0a]">
        <div className="w-full max-w-sm space-y-8 animate-in fade-in zoom-in duration-500">
          <div className="text-center">
            <h1 className="text-4xl font-black text-white italic tracking-tighter mb-2">
              TOURS<span className="text-amber-500">&</span>DETOURS
            </h1>
            <p className="text-amber-500 font-bold uppercase tracking-widest text-xs">
              Expérience Live
            </p>
          </div>

          <Card className="bg-[#1a1a1a] border-[#333] shadow-2xl">
            <CardContent className="p-8 space-y-6">
              <div className="text-center space-y-2">
                <UserIcon className="w-12 h-12 text-amber-500 mx-auto bg-[#222] p-3 rounded-full border border-amber-500/20" />
                <h2 className="text-xl font-bold text-white">
                  Prêt pour l'aventure ?
                </h2>
                <p className="text-sm text-gray-500">
                  Entrez votre nom pour rejoindre le groupe.
                </p>
              </div>
              <form onSubmit={handleNameSubmit} className="space-y-4">
                <Input
                  placeholder="Votre nom ou pseudo"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="bg-[#222] border-[#444] text-white h-12 text-lg focus:border-amber-500 transition-all text-center"
                  autoFocus
                />
                <Button
                  type="submit"
                  className="w-full bg-[#c9a961] hover:bg-[#b8944e] h-12 text-lg font-bold shadow-lg shadow-[#c9a961]/20"
                >
                  C'est parti !
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const currentStop = tour?.stops?.[session.current_stop_index];
  const isLastStop = session.current_stop_index >= (tour?.stops?.length || 0);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100 flex flex-col selection:bg-amber-500/30">
      <Toaster position="top-center" richColors theme="dark" />

      {/* Header Sticky */}
      <header className="sticky top-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-amber-500/20 p-4">
        <div className="max-w-md mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-amber-600 rounded-lg flex items-center justify-center font-black italic text-sm">
              T&D
            </div>
            <div>
              <h1 className="text-sm font-bold leading-tight">
                {tour?.title || "Chargement..."}
              </h1>
              <p className="text-[10px] text-amber-500 font-bold uppercase">
                Guide : Antoine
              </p>
            </div>
          </div>
          <Badge
            variant="outline"
            className="text-amber-500 border-amber-500/30 text-[10px]"
          >
            LIVE
          </Badge>
        </div>
      </header>

      <main className="flex-1 max-w-md mx-auto w-full p-4 space-y-6">
        {/* Urgent Banner */}
        {session.urgent_message && (
          <div className="bg-red-600 text-white p-4 rounded-2xl flex items-start gap-3 shadow-xl shadow-red-600/20 animate-bounce-subtle">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 animate-pulse" />
            <div className="flex-1 text-sm font-bold">
              {session.urgent_message}
            </div>
            <X
              className="w-4 h-4 opacity-50 cursor-pointer"
              onClick={() => setSession({ ...session, urgent_message: null })}
            />
          </div>
        )}

        {/* Current Stop Card */}
        <div className="animate-in fade-in slide-in-from-bottom duration-700">
          {!isLastStop ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4 text-amber-500" />
                <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">
                  Étape en cours
                </span>
              </div>
              <Card className="bg-[#1a1a1a] border-amber-500/30 overflow-hidden shadow-2xl relative">
                <div className="absolute top-0 right-0 p-3">
                  <div className="w-10 h-10 rounded-full bg-amber-600/90 text-white flex items-center justify-center font-bold shadow-lg">
                    {session.current_stop_index + 1}
                  </div>
                </div>
                <div className="p-6 pt-10 space-y-4">
                  <h2 className="text-3xl font-black italic tracking-tighter text-white">
                    {currentStop?.name || "Let's Go!"}
                  </h2>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {currentStop?.description ||
                      "Suivez le guide pour découvrir la suite !"}
                  </p>
                  {currentStop?.image && (
                    <div className="rounded-xl overflow-hidden border border-white/5 shadow-inner">
                      <img
                        src={currentStop.image}
                        alt={currentStop.name}
                        className="w-full grayscale hover:grayscale-0 transition-all duration-700"
                      />
                    </div>
                  )}
                </div>
              </Card>
            </div>
          ) : (
            <Card className="bg-gradient-to-br from-amber-600 to-amber-800 border-none text-white p-8 text-center space-y-6 shadow-2xl shadow-amber-600/20">
              <Heart className="w-16 h-16 mx-auto animate-pulse" />
              <div className="space-y-2">
                <h2 className="text-3xl font-black italic tracking-tighter">
                  Merci pour cette visite !
                </h2>
                <p className="text-amber-100 opacity-90">
                  J'espère que vous avez passé un moment inoubliable.
                </p>
              </div>
              {tour?.stripe_tip_link && (
                <Button
                  className="bg-white text-amber-800 hover:bg-gray-100 font-bold w-full h-14 text-lg shadow-xl"
                  onClick={() => window.open(tour.stripe_tip_link, "_blank")}
                >
                  Laisser un pourboire
                </Button>
              )}
              <p className="text-[10px] uppercase font-bold tracking-widest opacity-60">
                Fait avec passion par Tours & Detours
              </p>
            </Card>
          )}
        </div>

        {/* Media Gallery (Live Stream) */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
              <Camera className="w-4 h-4" /> Flux Photos
            </h3>
            <label className="cursor-pointer bg-[#1a1a1a] hover:bg-[#222] border border-[#333] px-3 py-1.5 rounded-full flex items-center gap-2 text-[10px] font-bold transition-all">
              <Camera className="w-3 h-3 text-amber-500" /> Partager
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={uploading}
              />
            </label>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
            {uploading && (
              <div className="w-40 h-40 bg-[#1a1a1a] rounded-2xl flex items-center justify-center flex-shrink-0 animate-pulse border border-amber-500/20">
                <Activity className="w-6 h-6 text-amber-500 animate-spin" />
              </div>
            )}
            {media.length === 0 && !uploading && (
              <div className="w-full text-center py-8 text-gray-600 italic text-sm border-2 border-dashed border-[#1a1a1a] rounded-2xl">
                Aucune photo partagée pour l'instant. Soyez le premier !
              </div>
            )}
            {media.map((item) => (
              <div
                key={item.id}
                className="relative w-40 h-40 flex-shrink-0 group"
              >
                <img
                  src={item.url}
                  alt="Shared"
                  className="w-full h-full object-cover rounded-2xl border border-white/5 shadow-lg group-hover:scale-105 transition-all duration-500"
                />
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent rounded-b-2xl">
                  <p className="text-[10px] font-bold text-white truncate">
                    {item.uploaded_by}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Guestbook / Echoes */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
            <MessageCircle className="w-4 h-4" /> Échos du groupe
          </h3>
          <Card className="bg-[#111] border-[#222] h-64 flex flex-col overflow-hidden rounded-2xl shadow-inner">
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-3 scroll-smooth"
            >
              {echoes.length === 0 && (
                <p className="text-center text-gray-600 italic text-xs pt-10">
                  Dites quelque chose au groupe !
                </p>
              )}
              {echoes.map((echo) => (
                <div
                  key={echo.id}
                  className={`flex flex-col ${echo.user_name === userName ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                      echo.user_name === userName
                        ? "bg-amber-600 text-white rounded-tr-none"
                        : "bg-[#1a1a1a] text-gray-200 border border-[#222] rounded-tl-none"
                    }`}
                  >
                    <p className="text-[10px] font-black italic opacity-50 mb-1">
                      {echo.user_name}
                    </p>
                    <p className="leading-snug">{echo.message}</p>
                  </div>
                </div>
              ))}
            </div>
            <form
              onSubmit={sendEcho}
              className="p-3 bg-[#0a0a0a] border-t border-[#222] flex gap-2"
            >
              <Input
                placeholder="Écrire un écho..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="bg-[#1a1a1a] border-[#333] text-white h-10 text-xs focus:border-amber-500"
              />
              <Button
                type="submit"
                size="icon"
                className="bg-[#c9a961] h-10 w-10 shrink-0"
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </Card>
        </div>
      </main>

      {/* Footer Branding */}
      <footer className="p-8 text-center border-t border-[#111] bg-[#0a0a0a]">
        <div className="max-w-md mx-auto space-y-4">
          <h2 className="text-2xl font-black text-[#222] italic tracking-tighter">
            TOURS<span className="text-amber-900/10">&</span>DETOURS
          </h2>
          <div className="flex justify-center gap-4 text-gray-600">
            <ExternalLink className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-widest">
              www.toursandetours.com
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
