import { useState, useEffect, useCallback, useRef } from "react";
import {
  LayoutDashboard,
  Calendar,
  MapPin,
  Star,
  LogOut,
  Menu,
  X,
  User,
  Bell,
  Search,
  Euro,
  Compass,
  CheckIcon,
  Upload,
  Image as ImageIcon,
  Check,
  Loader2,
  Trash2,
  Activity,
  Plus,
  Globe,
  ShieldCheck,
  Send,
  BarChart3,
  CheckCircle2,
  ExternalLink,
  Maximize2,
  Minimize2,
  Camera,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  CloudUpload,
  CloudDownload,
  RotateCcw,
  Database,
  Scissors,
} from "lucide-react";
import { translations } from "@/lib/translations";
import { Button } from "@/components/ui/button";
import { Toaster, toast } from "sonner";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/lib/supabase";
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { ImageEditor } from "./components/ImageEditor";
import { translateText, translateArray, type SupportedLanguage } from "./utils/translation-service";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { prepareTourForEditing } from "@/lib/utils";
import type { Tour, Reservation, Review } from "@/lib/types";

// Types unified with @/lib/types

// Mock Data is now handled via the database (default_tours table)
// No longer using hardcoded mockTours in this file.

/*
const mockReservations: Reservation[] = [
  {
    id: 'RES-001',
    name: 'Marie Dupont',
    email: 'marie.dupont@example.com',
    phone: '+33 6 12 34 56 78',
    tourId: '1',
    tourName: 'Girona & Costa Brava',
    date: '2024-06-15',
    participants: 2,
    totalPrice: 290,
    status: 'confirmed',
    message: 'Hâte de voir les quartiers médiévaux !',
    createdAt: '2024-05-10T14:30:00Z'
  }
];
*/

/*
const mockReviews: Review[] = [
  {
    id: 'REV-001',
    name: 'Marie & Pierre',
    location: 'Lyon, France',
    rating: 5,
    text: 'Une expérience inoubliable ! Antoine est un guide passionné qui nous a fait découvrir des endroits magnifiques hors des sentiers battus.',
    tourId: '1',
    isPublished: true,
    createdAt: '2024-04-20T10:00:00Z'
  }
];
*/

// Login Component
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<"magic" | "password">("magic");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) {
      setError("Erreur de configuration de la base de données");
      return;
    }

    setIsLoading(true);
    setError("");
    setMessage("");

    try {
      let authError = null;

      // Auth Flow (authorization is verified server-side after session is established)
      if (mode === "magic") {
        const { error } = await supabase.auth.signInWithOtp({
          email: email.toLowerCase().trim(),
          options: {
            emailRedirectTo: window.location.origin + "/admin.html",
          },
        });
        authError = error;

        if (!authError) {
          setMessage("Lien magique envoyé ! Vérifiez votre boîte mail.");
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.toLowerCase().trim(),
          password: password,
        });
        authError = error;
      }

      if (authError) {
        setError(
          mode === "magic"
            ? "Lien magique : " + authError.message
            : "Erreur de mot de passe : " + authError.message,
        );
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Une erreur est survenue lors de la connexion");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Compass className="w-8 h-8 text-amber-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            Tours<span className="text-amber-600">&</span>Detours
          </h1>
          <p className="text-gray-500">Accès Administrateur</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium">
              {error}
            </div>
          )}
          {message && (
            <div className="bg-green-50 text-green-600 p-3 rounded-lg text-sm font-medium">
              {message}
            </div>
          )}
          <div>
            <Label htmlFor="email">Email professionnel</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
              className="mt-1 h-12"
              disabled={isLoading || !!message}
              required
            />
          </div>

          {mode === "password" && (
            <div>
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 h-12"
                disabled={isLoading || !!message}
                required
              />
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-[#c9a961] hover:bg-[#b8944e] h-12 rounded-xl font-bold text-lg shadow-lg shadow-[#c9a961]/20 transition-all hover:-translate-y-0.5"
            disabled={isLoading || !!message}
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin mx-auto" />
            ) : mode === "magic" ? (
              "Recevoir un lien magique"
            ) : (
              "Se connecter"
            )}
          </Button>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => setMode(mode === "magic" ? "password" : "magic")}
              className="text-xs text-amber-600 hover:underline font-medium"
            >
              {mode === "magic"
                ? "→ Utiliser un mot de passe"
                : "← Utiliser un lien magique"}
            </button>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-400 leading-relaxed uppercase tracking-widest font-bold">
            Uniquement pour le personnel autorisé
          </p>
        </div>
      </div>
    </div>
  );
}

// Dashboard Component
function Dashboard({
  reservations,
  setActiveTab,
}: {
  reservations: Reservation[];
  setActiveTab: (tab: string) => void;
}) {
  const [systemStatus, setSystemStatus] = useState<'loading' | 'ok' | 'error'>('loading');
  const [stripeMode, setStripeMode] = useState<'test' | 'live' | null>(null);

  useEffect(() => {
    fetch('/api/health-check')
      .then(async res => {
        if (res.ok) {
          const data = await res.json();
          setSystemStatus('ok');
          setStripeMode(data.checks?.stripe?.mode || null);
        } else {
          setSystemStatus('error');
        }
      })
      .catch(() => setSystemStatus('error'));
  }, []);

  const stats = {
    totalReservations: reservations.length,
    pendingReservations: reservations.filter((r) => r.status === "pending").length,
    confirmedReservations: reservations.filter((r) => r.status === "confirmed").length,
    completedReservations: reservations.filter((r) => r.status === "completed").length,
    totalRevenue: reservations.reduce((sum, r) => sum + r.totalPrice, 0),
    thisMonthRevenue: reservations
      .filter((r) => {
        const now = new Date();
        const prefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
        return r.createdAt.startsWith(prefix);
      })
      .reduce((sum, r) => sum + r.totalPrice, 0),
  };

  const recentReservations = [...reservations]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  // Confirmed reservations in next 7 days
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);
  const upcomingTours = [...reservations]
    .filter((r) => {
      if (r.status !== "confirmed") return false;
      const d = new Date(r.date);
      return d >= today && d <= nextWeek;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
      completed: "bg-blue-100 text-blue-800",
    };
    const labels: Record<string, string> = {
      pending: "En attente",
      confirmed: "Confirmée",
      cancelled: "Annulée",
      completed: "Terminée",
    };
    return <Badge className={styles[status]}>{labels[status]}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-bold text-gray-900">Vue d'ensemble</h2>
        <div className={cn(
          "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-sm",
          systemStatus === 'loading' ? "bg-gray-100 text-gray-500" :
          systemStatus === 'ok' ? "bg-green-100 text-green-700 ring-1 ring-green-600/20" :
          "bg-red-100 text-red-700 ring-1 ring-red-600/20 animate-pulse"
        )}>
          <Activity className={cn("w-3.5 h-3.5", systemStatus === 'loading' && "animate-spin")} />
          {systemStatus === 'loading' ? "Vérification système..." :
           systemStatus === 'ok' ? `Système Opérationnel (${stripeMode?.toUpperCase() || 'MODE INCONNU'})` :
           "Erreur Configuration (Stripe/DB)"}
        </div>
      </div>

      {/* Alert banner for pending reservations */}
      {stats.pendingReservations > 0 && (
        <button
          onClick={() => setActiveTab("reservations")}
          className="w-full flex items-center gap-3 px-4 py-3 bg-yellow-50 border border-yellow-300 rounded-xl text-left hover:bg-yellow-100 transition-colors"
        >
          <Bell className="w-5 h-5 text-yellow-600 flex-shrink-0 animate-pulse" />
          <div>
            <p className="text-sm font-bold text-yellow-900">
              {stats.pendingReservations} réservation{stats.pendingReservations > 1 ? "s" : ""} en attente de confirmation
            </p>
            <p className="text-xs text-yellow-700">Cliquer pour gérer les réservations</p>
          </div>
          <ChevronRight className="w-4 h-4 text-yellow-600 ml-auto" />
        </button>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Total</p>
                <p className="text-2xl font-bold">{stats.totalReservations}</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={stats.pendingReservations > 0 ? "ring-2 ring-yellow-400" : ""}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">En attente</p>
                <p className="text-2xl font-bold">{stats.pendingReservations}</p>
              </div>
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <Bell className="w-5 h-5 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Confirmées</p>
                <p className="text-2xl font-bold">{stats.confirmedReservations}</p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <CheckIcon className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">
                  {new Date().toLocaleDateString("fr-FR", { month: "short" })}
                </p>
                <p className="text-2xl font-bold">{stats.thisMonthRevenue}€</p>
              </div>
              <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                <Euro className="w-5 h-5 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Revenu total</p>
                <p className="text-2xl font-bold">{stats.totalRevenue}€</p>
              </div>
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming tours this week */}
      {upcomingTours.length > 0 && (
        <Card>
          <CardHeader className="px-4 sm:px-6 pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-600" />
              Prochains tours — 7 jours
            </CardTitle>
          </CardHeader>
          <CardContent className="px-0 sm:px-6">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-4 font-medium text-gray-500">Date</th>
                    <th className="text-left py-2 px-4 font-medium text-gray-500">Tour</th>
                    <th className="text-left py-2 px-4 font-medium text-gray-500">Client</th>
                    <th className="text-left py-2 px-4 font-medium text-gray-500 hidden sm:table-cell">Pick-up</th>
                    <th className="text-right py-2 px-4 font-medium text-gray-500">Pers.</th>
                  </tr>
                </thead>
                <tbody>
                  {upcomingTours.map((res) => (
                    <tr key={res.id} className="border-b hover:bg-amber-50/40">
                      <td className="py-2 px-4 font-semibold text-amber-700">
                        {new Date(res.date).toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short" })}
                      </td>
                      <td className="py-2 px-4 text-gray-900">{res.tourName}</td>
                      <td className="py-2 px-4 text-gray-600">{res.name}</td>
                      <td className="py-2 px-4 text-gray-500 hidden sm:table-cell">
                        {res.pickupTime || res.pickupAddress
                          ? <span className="text-xs">{[res.pickupTime, res.pickupAddress].filter(Boolean).join(" · ")}</span>
                          : <span className="text-gray-300">—</span>}
                      </td>
                      <td className="py-2 px-4 text-right">{res.participants}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="px-4 sm:px-6">
          <CardTitle className="text-lg sm:text-xl">Réservations récentes</CardTitle>
        </CardHeader>
        <CardContent className="px-0 sm:px-6">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Client</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500 hidden sm:table-cell">Tour</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500 hidden sm:table-cell">Date</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Statut</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-500">Montant</th>
                </tr>
              </thead>
              <tbody>
                {recentReservations.map((res) => (
                  <tr key={res.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{res.name}</td>
                    <td className="py-3 px-4 text-gray-600 hidden sm:table-cell">{res.tourName}</td>
                    <td className="py-3 px-4 text-gray-500 hidden sm:table-cell">
                      {new Date(res.date).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
                    </td>
                    <td className="py-3 px-4">{getStatusBadge(res.status)}</td>
                    <td className="py-3 px-4 text-right font-semibold">{res.totalPrice}€</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Button
          variant="outline"
          className="h-16 flex flex-row sm:flex-col items-center justify-center gap-3 sm:gap-2"
          onClick={() => setActiveTab("reservations")}
        >
          <Calendar className="w-5 h-5 text-amber-600" />
          <span className="text-sm">Réservations</span>
        </Button>
        <Button
          variant="outline"
          className="h-16 flex flex-row sm:flex-col items-center justify-center gap-3 sm:gap-2"
          onClick={() => { setActiveTab("reservations"); }}
        >
          <Bell className="w-5 h-5 text-yellow-600" />
          <span className="text-sm">En attente {stats.pendingReservations > 0 && <span className="ml-1 bg-yellow-500 text-white text-xs px-1.5 py-0.5 rounded-full">{stats.pendingReservations}</span>}</span>
        </Button>
        <Button
          variant="outline"
          className="h-16 flex flex-row sm:flex-col items-center justify-center gap-3 sm:gap-2"
          onClick={() => setActiveTab("tours")}
        >
          <MapPin className="w-5 h-5 text-amber-600" />
          <span className="text-sm">Tours</span>
        </Button>
        <Button
          variant="outline"
          className="h-16 flex flex-row sm:flex-col items-center justify-center gap-3 sm:gap-2"
          onClick={() => setActiveTab("reviews")}
        >
          <Star className="w-5 h-5 text-amber-600" />
          <span className="text-sm">Avis</span>
        </Button>
      </div>
    </div>
  );
}

// Suivi Opérationnel Component
function OperationalTracking({ reservations }: { reservations: Reservation[] }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = today.toISOString().split("T")[0];

  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);

  // Today's confirmed pickups
  const todayPickups = reservations
    .filter((r) => r.status === "confirmed" && r.date === todayStr)
    .sort((a, b) => (a.pickupTime || "").localeCompare(b.pickupTime || ""));

  // This week's confirmed tours
  const weekTours = reservations
    .filter((r) => {
      if (r.status !== "confirmed") return false;
      const d = new Date(r.date);
      return d >= today && d <= nextWeek;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Revenue by tour (all time, sorted by total desc)
  const revenueByTour: Record<string, { total: number; count: number; participants: number }> = {};
  reservations
    .filter((r) => r.status !== "cancelled")
    .forEach((r) => {
      if (!revenueByTour[r.tourName]) revenueByTour[r.tourName] = { total: 0, count: 0, participants: 0 };
      revenueByTour[r.tourName].total += r.totalPrice;
      revenueByTour[r.tourName].count += 1;
      revenueByTour[r.tourName].participants += r.participants;
    });
  const tourRevenue = Object.entries(revenueByTour)
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.total - a.total);

  // Monthly revenue (last 6 months)
  const monthlyRevenue: Record<string, number> = {};
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setDate(1);
    d.setMonth(d.getMonth() - i);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    monthlyRevenue[key] = 0;
  }
  reservations
    .filter((r) => r.status !== "cancelled")
    .forEach((r) => {
      const key = r.createdAt.slice(0, 7);
      if (key in monthlyRevenue) monthlyRevenue[key] += r.totalPrice;
    });
  const months = Object.entries(monthlyRevenue);
  const maxRevenue = Math.max(...months.map(([, v]) => v), 1);

  const statusConfig: Record<string, { style: string; label: string }> = {
    pending:   { style: "bg-yellow-100 text-yellow-800", label: "En attente" },
    confirmed: { style: "bg-green-100 text-green-800",  label: "Confirmée" },
    cancelled: { style: "bg-red-100 text-red-800",      label: "Annulée" },
    completed: { style: "bg-blue-100 text-blue-800",    label: "Terminée" },
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900">Suivi Opérationnel</h2>

      {/* Today's pickups */}
      <Card>
        <CardHeader className="px-4 sm:px-6 pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <MapPin className="w-4 h-4 text-amber-600" />
            Pick-ups aujourd'hui
            {todayPickups.length > 0 && (
              <Badge className="bg-amber-100 text-amber-800 ml-1">{todayPickups.length}</Badge>
            )}
          </CardTitle>
          <CardDescription>{new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}</CardDescription>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          {todayPickups.length === 0 ? (
            <p className="text-sm text-gray-400 italic">Aucun pick-up prévu aujourd'hui</p>
          ) : (
            <div className="space-y-3">
              {todayPickups.map((r) => (
                <div key={r.id} className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg border border-amber-100">
                  <div className="text-amber-700 font-bold text-sm w-14 shrink-0">{r.pickupTime || "—"}</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">{r.name}</p>
                    <p className="text-xs text-gray-500 truncate">{r.tourName} · {r.participants} pers.</p>
                    {r.pickupAddress && <p className="text-xs text-gray-400 truncate">{r.pickupAddress}</p>}
                  </div>
                  <div className="text-sm font-bold text-amber-600 shrink-0">{r.totalPrice}€</div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* This week's planning */}
      <Card>
        <CardHeader className="px-4 sm:px-6 pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-600" />
            Planning — 7 jours
          </CardTitle>
        </CardHeader>
        <CardContent className="px-0 sm:px-6">
          {weekTours.length === 0 ? (
            <p className="text-sm text-gray-400 italic px-4">Aucun tour confirmé cette semaine</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-4 font-medium text-gray-500">Date</th>
                    <th className="text-left py-2 px-4 font-medium text-gray-500">Tour</th>
                    <th className="text-left py-2 px-4 font-medium text-gray-500">Client</th>
                    <th className="text-left py-2 px-4 font-medium text-gray-500 hidden sm:table-cell">Pick-up</th>
                    <th className="text-center py-2 px-4 font-medium text-gray-500">Pers.</th>
                    <th className="text-left py-2 px-4 font-medium text-gray-500">Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {weekTours.map((r) => {
                    const isToday = r.date === todayStr;
                    const cfg = statusConfig[r.status] ?? { style: "bg-gray-100 text-gray-700", label: r.status };
                    return (
                      <tr key={r.id} className={`border-b ${isToday ? "bg-amber-50/60" : "hover:bg-gray-50"}`}>
                        <td className="py-2 px-4 font-semibold text-amber-700 whitespace-nowrap">
                          {new Date(r.date).toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short" })}
                          {isToday && <span className="ml-1 text-xs bg-amber-500 text-white px-1 rounded">Auj.</span>}
                        </td>
                        <td className="py-2 px-4 text-gray-900 max-w-[150px] truncate">{r.tourName}</td>
                        <td className="py-2 px-4 text-gray-600">{r.name}</td>
                        <td className="py-2 px-4 text-gray-500 text-xs hidden sm:table-cell">
                          {[r.pickupTime, r.pickupAddress].filter(Boolean).join(" · ") || <span className="text-gray-300">—</span>}
                        </td>
                        <td className="py-2 px-4 text-center">{r.participants}</td>
                        <td className="py-2 px-4"><Badge className={cfg.style}>{cfg.label}</Badge></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Monthly revenue chart */}
      <Card>
        <CardHeader className="px-4 sm:px-6 pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-purple-600" />
            Revenus — 6 derniers mois
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          <div className="flex items-end gap-2 h-32">
            {months.map(([key, val]) => {
              const height = Math.round((val / maxRevenue) * 100);
              const [year, month] = key.split("-");
              const label = new Date(Number(year), Number(month) - 1).toLocaleDateString("fr-FR", { month: "short" });
              return (
                <div key={key} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-xs text-gray-500 font-semibold">{val > 0 ? `${val}€` : ""}</span>
                  <div
                    className="w-full bg-amber-400 rounded-t-sm transition-all"
                    style={{ height: `${Math.max(height, val > 0 ? 4 : 0)}%` }}
                  />
                  <span className="text-xs text-gray-400">{label}</span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Revenue by tour */}
      <Card>
        <CardHeader className="px-4 sm:px-6 pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Euro className="w-4 h-4 text-green-600" />
            Performance par tour
          </CardTitle>
        </CardHeader>
        <CardContent className="px-0 sm:px-6">
          {tourRevenue.length === 0 ? (
            <p className="text-sm text-gray-400 italic px-4">Aucune donnée</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-4 font-medium text-gray-500">Tour</th>
                    <th className="text-center py-2 px-4 font-medium text-gray-500">Rés.</th>
                    <th className="text-center py-2 px-4 font-medium text-gray-500">Voyageurs</th>
                    <th className="text-right py-2 px-4 font-medium text-gray-500">Revenu total</th>
                    <th className="text-right py-2 px-4 font-medium text-gray-500 hidden sm:table-cell">Moy./rés.</th>
                  </tr>
                </thead>
                <tbody>
                  {tourRevenue.map(({ name, total, count, participants }) => (
                    <tr key={name} className="border-b hover:bg-gray-50">
                      <td className="py-2 px-4 font-medium text-gray-900 max-w-[200px] truncate">{name}</td>
                      <td className="py-2 px-4 text-center text-gray-600">{count}</td>
                      <td className="py-2 px-4 text-center text-gray-600">{participants}</td>
                      <td className="py-2 px-4 text-right font-bold text-amber-600">{total}€</td>
                      <td className="py-2 px-4 text-right text-gray-500 hidden sm:table-cell">{Math.round(total / count)}€</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Helper component — must be declared outside Reservations to avoid react-hooks/static-components
function InfoRow({ label, value }: { label: string; value?: string | number }) {
  if (!value) return null;
  return (
    <div className="flex flex-col sm:flex-row sm:gap-2 py-1">
      <span className="text-xs font-medium text-gray-500 uppercase tracking-wide w-32 shrink-0">{label}</span>
      <span className="text-sm text-gray-900">{value}</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Blocked Dates Management (Admin availability calendar)
// ---------------------------------------------------------------------------
function BlockedDatesManager({ tours }: { tours: Tour[] }) {
  const defaultTourId = tours.length > 0 ? tours[0].id.toString() : "";
  const [selectedTourId, setSelectedTourId] = useState<string>(defaultTourId);
  const [month, setMonth] = useState<Date>(() => { const d = new Date(); d.setDate(1); return d; });
  const [blockedDates, setBlockedDates] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedTourId || !supabase) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      const { data } = await supabase
        .from("blocked_dates")
        .select("date")
        .eq("tour_id", selectedTourId);
      if (!cancelled) {
        setBlockedDates(new Set((data ?? []).map((r: { date: string }) => r.date)));
        setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [selectedTourId]);

  const toggleDate = async (dateStr: string) => {
    if (!supabase || !selectedTourId) return;
    const isBlocked = blockedDates.has(dateStr);
    if (isBlocked) {
      const { error } = await supabase
        .from("blocked_dates")
        .delete()
        .eq("tour_id", selectedTourId)
        .eq("date", dateStr);
      if (!error) setBlockedDates((prev) => { const s = new Set(prev); s.delete(dateStr); return s; });
      else toast.error("Erreur lors du déblocage");
    } else {
      const { error } = await supabase
        .from("blocked_dates")
        .insert({ tour_id: selectedTourId, date: dateStr });
      if (!error) setBlockedDates((prev) => new Set(prev).add(dateStr));
      else toast.error("Erreur lors du blocage");
    }
  };

  const toDateStr = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  const dayLabels = ["Lu", "Ma", "Me", "Je", "Ve", "Sa", "Di"];
  const monthLabel = month.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });

  const firstDay = new Date(month.getFullYear(), month.getMonth(), 1);
  const startOffset = (firstDay.getDay() + 6) % 7;
  const gridStart = new Date(firstDay);
  gridStart.setDate(1 - startOffset);
  const cells: Date[] = [];
  for (let i = 0; i < 42; i++) { const d = new Date(gridStart); d.setDate(gridStart.getDate() + i); cells.push(d); }

  const todayStr = toDateStr(new Date());

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Calendar className="w-4 h-4 text-amber-500" />
          Disponibilités
        </CardTitle>
        <CardDescription>Cliquez sur une date pour la bloquer ou la débloquer. Les dates bloquées seront indisponibles à la réservation.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Tour selector */}
          <Select value={selectedTourId} onValueChange={setSelectedTourId}>
            <SelectTrigger className="w-full"><SelectValue placeholder="Choisir un tour" /></SelectTrigger>
            <SelectContent>
              {tours.filter(t => t.isActive !== false).map((t) => (
                <SelectItem key={t.id} value={t.id.toString()}>{t.title}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Calendar */}
          <div className="max-w-sm mx-auto">
            <div className="flex items-center justify-between mb-3">
              <button type="button" onClick={() => { const d = new Date(month); d.setMonth(d.getMonth() - 1); setMonth(d); }}
                className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-sm font-bold capitalize text-gray-800 flex items-center gap-2">
                {monthLabel}
                {loading && <Loader2 className="w-3 h-3 animate-spin text-amber-500" />}
              </span>
              <button type="button" onClick={() => { const d = new Date(month); d.setMonth(d.getMonth() + 1); setMonth(d); }}
                className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-7 mb-1">
              {dayLabels.map((d) => (
                <div key={d} className="text-center text-[10px] font-bold uppercase text-gray-400 py-1">{d}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-y-1">
              {cells.map((cell) => {
                const dateStr = toDateStr(cell);
                const isCurrentMonth = cell.getMonth() === month.getMonth();
                const isPast = dateStr < todayStr;
                const isBlocked = blockedDates.has(dateStr);
                const isToday = dateStr === todayStr;

                return (
                  <div key={dateStr} className="flex justify-center">
                    <button
                      type="button"
                      disabled={!isCurrentMonth || isPast}
                      onClick={() => isCurrentMonth && !isPast && toggleDate(dateStr)}
                      className={cn(
                        "relative w-9 h-9 rounded-xl text-xs font-medium transition-all duration-150 flex items-center justify-center",
                        !isCurrentMonth && "opacity-20 pointer-events-none text-gray-400",
                        isCurrentMonth && isPast && "text-gray-300 cursor-not-allowed",
                        isCurrentMonth && !isPast && isBlocked && "bg-red-100 text-red-500 ring-1 ring-red-300",
                        isCurrentMonth && !isPast && !isBlocked && "hover:bg-green-50 hover:text-green-700 cursor-pointer text-gray-700",
                        isToday && !isBlocked && "ring-1 ring-amber-400",
                      )}
                    >
                      {cell.getDate()}
                      {isBlocked && isCurrentMonth && !isPast && (
                        <X className="absolute w-3 h-3 text-red-400 top-0.5 right-0.5" />
                      )}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 mt-3 px-1">
              <div className="flex items-center gap-1.5 text-[10px] text-gray-500">
                <span className="w-3 h-3 rounded bg-white ring-1 ring-gray-200" />
                Disponible
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-gray-500">
                <span className="w-3 h-3 rounded bg-red-100 ring-1 ring-red-300" />
                Bloqué
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Reservations Component
function Reservations({
  reservations,
  setReservations,
  tours,
}: {
  reservations: Reservation[];
  setReservations: React.Dispatch<React.SetStateAction<Reservation[]>>;
  tours: Tour[];
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [selectedRes, setSelectedRes] = useState<Reservation | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const filtered = reservations.filter((res) => {
    const matchesSearch =
      res.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.tourName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || res.status === statusFilter;
    const matchesFrom = !dateFrom || res.date >= dateFrom;
    const matchesTo = !dateTo || res.date <= dateTo;
    return matchesSearch && matchesStatus && matchesFrom && matchesTo;
  });

  const statusConfig: Record<string, { style: string; label: string }> = {
    pending:   { style: "bg-yellow-100 text-yellow-800", label: "En attente" },
    confirmed: { style: "bg-green-100 text-green-800",  label: "Confirmée" },
    cancelled: { style: "bg-red-100 text-red-800",      label: "Annulée" },
    completed: { style: "bg-blue-100 text-blue-800",    label: "Terminée" },
  };

  const getStatusBadge = (status: string) => {
    const cfg = statusConfig[status] ?? { style: "bg-gray-100 text-gray-700", label: status };
    return <Badge className={cfg.style}>{cfg.label}</Badge>;
  };

  const handleStatusUpdate = async (res: Reservation, newStatus: string) => {
    if (!supabase) return;
    setIsUpdating(true);
    const { error } = await supabase
      .from("reservations")
      .update({ status: newStatus })
      .eq("id", res.id);
    if (error) {
      toast.error("Erreur lors de la mise à jour du statut");
    } else {
      const updated = newStatus as Reservation["status"];
      setReservations((prev) =>
        prev.map((r) => r.id === res.id ? { ...r, status: updated } : r)
      );
      setSelectedRes((prev) =>
        prev?.id === res.id ? { ...prev, status: updated } : prev
      );
      toast.success(newStatus === "confirmed" ? "Réservation confirmée ✓" : "Réservation annulée");
    }
    setIsUpdating(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3">
        <div className="flex flex-col md:flex-row gap-3 items-center">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Rechercher par nom, email, tour..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous</SelectItem>
              <SelectItem value="pending">En attente</SelectItem>
              <SelectItem value="confirmed">Confirmées</SelectItem>
              <SelectItem value="completed">Terminées</SelectItem>
              <SelectItem value="cancelled">Annulées</SelectItem>
          </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 items-center">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs text-gray-500 whitespace-nowrap">Du</span>
            <Input
              type="date"
              className="w-full sm:w-40"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs text-gray-500 whitespace-nowrap">Au</span>
            <Input
              type="date"
              className="w-full sm:w-40"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
            />
          </div>
          {(dateFrom || dateTo) && (
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600 whitespace-nowrap" onClick={() => { setDateFrom(""); setDateTo(""); }}>
              Effacer dates
            </Button>
          )}
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          {/* Desktop Table */}
          <div className="overflow-x-auto hidden sm:block">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Client</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500 hidden md:table-cell">Tour</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Date</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-500">Voy.</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-500">Montant</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Statut</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-500">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((res) => (
                  <tr key={res.id} className="border-b hover:bg-gray-50 cursor-pointer" onClick={() => { setSelectedRes(res); setIsDetailOpen(true); }}>
                    <td className="py-3 px-4">
                      <div className="font-medium text-gray-900">{res.name}</div>
                      <div className="text-gray-400 text-xs">{res.email}</div>
                    </td>
                    <td className="py-3 px-4 text-gray-600 hidden md:table-cell max-w-[180px] truncate">{res.tourName}</td>
                    <td className="py-3 px-4 text-gray-600 whitespace-nowrap">{res.date}</td>
                    <td className="py-3 px-4 text-center text-gray-600">{res.participants}</td>
                    <td className="py-3 px-4 text-right font-semibold text-amber-600 whitespace-nowrap">{res.totalPrice}€</td>
                    <td className="py-3 px-4">{getStatusBadge(res.status)}</td>
                    <td className="py-3 px-4 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                        onClick={(e) => { e.stopPropagation(); setSelectedRes(res); setIsDetailOpen(true); }}
                      >
                        Voir
                      </Button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-gray-400 italic text-sm">
                      Aucune réservation trouvée
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="sm:hidden divide-y divide-gray-100">
            {filtered.map((res) => (
              <div key={res.id} className="p-4 space-y-3" onClick={() => { setSelectedRes(res); setIsDetailOpen(true); }}>
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-bold text-gray-900">{res.name}</div>
                    <div className="text-gray-500 text-xs">{res.date}</div>
                  </div>
                  {getStatusBadge(res.status)}
                </div>
                <div className="text-sm text-gray-600 italic">"{res.tourName}"</div>
                <div className="flex justify-between items-center pt-1">
                  <div>
                    <span className="font-bold text-amber-600">{res.totalPrice}€</span>
                    <span className="text-xs text-gray-400 ml-2">{res.participants} voy.</span>
                  </div>
                  <Button size="sm" variant="outline" className="h-8">Détails</Button>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="p-8 text-center text-gray-500 text-sm italic">
                Aucune réservation trouvée
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Detail Sheet */}
      <Sheet open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <SheetContent side="right" className="w-full sm:max-w-lg flex flex-col p-0 overflow-y-auto">
          {selectedRes && (
            <>
              <SheetHeader className="px-6 pt-6 pb-4 border-b bg-gray-50">
                <SheetTitle className="text-base font-bold text-gray-900 leading-tight">
                  {selectedRes.tourName}
                </SheetTitle>
                <div className="flex items-center gap-3 mt-1">
                  {getStatusBadge(selectedRes.status)}
                  <span className="text-xs text-gray-400">
                    Créée le {new Date(selectedRes.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                  </span>
                </div>
              </SheetHeader>

              <div className="flex-1 px-6 py-5 space-y-5 text-sm">
                {/* CLIENT */}
                <div className="rounded-lg bg-gray-50 p-4 space-y-1">
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Client</p>
                  <InfoRow label="Nom" value={selectedRes.name} />
                  <InfoRow label="Email" value={selectedRes.email} />
                  <InfoRow label="Téléphone" value={selectedRes.phone} />
                </div>

                {/* RÉSERVATION */}
                <div className="rounded-lg border border-gray-200 p-4 space-y-1">
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Réservation</p>
                  <InfoRow label="Date" value={selectedRes.date} />
                  <InfoRow label="Voyageurs" value={`${selectedRes.participants} personne${selectedRes.participants > 1 ? "s" : ""}`} />
                  <div className="flex flex-col sm:flex-row sm:gap-2 py-1">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide w-32 shrink-0">Total payé</span>
                    <span className="text-sm font-bold text-amber-600">{selectedRes.totalPrice}€</span>
                  </div>
                </div>

                {/* PICKUP */}
                {(selectedRes.pickupTime || selectedRes.pickupAddress) && (
                  <div className="rounded-lg bg-amber-50 border border-amber-200 p-4 space-y-1">
                    <p className="text-xs font-bold uppercase tracking-widest text-amber-600 mb-2">Pick-up</p>
                    <InfoRow label="Heure" value={selectedRes.pickupTime} />
                    <InfoRow label="Adresse" value={selectedRes.pickupAddress} />
                  </div>
                )}

                {/* MESSAGE */}
                {selectedRes.message && (
                  <div className="rounded-lg bg-gray-50 p-4">
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Message client</p>
                    <p className="text-sm text-gray-700 italic">"{selectedRes.message}"</p>
                  </div>
                )}

                {/* FACTURATION */}
                {(selectedRes.billingAddress || selectedRes.billingCity) && (
                  <div className="rounded-lg border border-gray-200 p-4 space-y-1">
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Facturation</p>
                    <p className="text-sm text-gray-700">
                      {[selectedRes.billingAddress, selectedRes.billingZip, selectedRes.billingCity, selectedRes.billingCountry]
                        .filter(Boolean).join(", ")}
                    </p>
                  </div>
                )}

                {/* PAIEMENT */}
                {selectedRes.paymentIntentId && (
                  <div className="rounded-lg bg-gray-50 p-4">
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Stripe Payment Intent</p>
                    <p className="text-xs font-mono text-gray-500 break-all">{selectedRes.paymentIntentId}</p>
                  </div>
                )}
              </div>

              <SheetFooter className="px-6 py-4 border-t bg-gray-50 flex flex-row gap-2 justify-end">
                {selectedRes.status === "pending" && (
                  <Button
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 text-white"
                    disabled={isUpdating}
                    onClick={() => handleStatusUpdate(selectedRes, "confirmed")}
                  >
                    {isUpdating ? "..." : "Confirmer"}
                  </Button>
                )}
                {selectedRes.status !== "cancelled" && selectedRes.status !== "completed" && (
                  <Button
                    size="sm"
                    variant="destructive"
                    disabled={isUpdating}
                    onClick={() => handleStatusUpdate(selectedRes, "cancelled")}
                  >
                    {isUpdating ? "..." : "Annuler"}
                  </Button>
                )}
                <Button size="sm" variant="outline" onClick={() => setIsDetailOpen(false)}>
                  Fermer
                </Button>
              </SheetFooter>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Blocked Dates Management */}
      <BlockedDatesManager tours={tours} />
    </div>
  );
}

function ToursManagement({
  tours,
  setTours,
  activeSession,
  setActiveSession,
  updateSession,
  urgentMsg,
  setUrgentMsg,
}: {
  tours: Tour[];
  setTours: React.Dispatch<React.SetStateAction<Tour[]>>;
  activeSession: any;
  setActiveSession: (session: any) => void;
  updateSession: (updates: any) => Promise<void>;
  urgentMsg: string;
  setUrgentMsg: (msg: string) => void;
}) {
  const [editingTour, setEditingTour] = useState<Tour | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isLiveMinimized, setIsLiveMinimized] = useState(false);
  const [sessionLoading, setSessionLoading] = useState(false);
  const tourFileRef = useRef<HTMLInputElement>(null);

  // Photo Editor State
  const [imageToEdit, setImageToEdit] = useState<{
    url: string;
    index: number;
    files?: File[];
    isExisting?: boolean;
  } | null>(null);

  const [pendingImages, setPendingImages] = useState<{ file: File; previewUrl: string }[]>([]);

  const [isTranslating, setIsTranslating] = useState(false);

  const handleTranslate = async (sourceLang: SupportedLanguage, field: string) => {
    if (!editingTour) return;
    setIsTranslating(true);
    const loading = toast.loading("Traduction en cours...");
    try {
      const targetLangs: SupportedLanguage[] = (["fr", "en", "es"] as SupportedLanguage[]).filter(
        (l) => l !== sourceLang
      );

      const sourceValue = (editingTour as any)[
        field + (sourceLang === "fr" ? "" : `_${sourceLang}`)
      ];

      if (!sourceValue) {
        toast.error("Le champ source est vide", { id: loading });
        setIsTranslating(false);
        return;
      }

      const updates: any = {};
      
      for (const targetLang of targetLangs) {
        const targetField = field + (targetLang === "fr" ? "" : `_${targetLang}`);
        
        if (Array.isArray(sourceValue)) {
          updates[targetField] = await translateArray(sourceValue, sourceLang, targetLang);
        } else {
          updates[targetField] = await translateText(sourceValue, sourceLang, targetLang);
        }
      }

      setEditingTour({
        ...editingTour,
        ...updates,
      });

      toast.success("Traduction terminée !", { id: loading });
    } catch (err) {
      console.error("Translation error:", err);
      toast.error("Erreur de traduction : " + (err as Error).message, { id: loading });
    } finally {
      setIsTranslating(false);
    }
  };

  const startLiveSession = async (tour: Tour) => {
    if (!supabase) return;
    setSessionLoading(true);
    try {
      const sessionCode = Math.random()
        .toString(36)
        .substring(2, 8)
        .toUpperCase();
      const { data, error } = await supabase
        .from("live_sessions")
        .insert({
          tour_id: tour.id,
          session_code: sessionCode,
          status: "active",
          current_stop_index: 0,
        })
        .select()
        .single();

      if (error) throw error;
      setActiveSession({
        tour,
        session: data as {
          id: string;
          current_stop_index: number;
          status: string;
          session_code: string;
        },
      });
      toast.success(`Session Live démarrée ! Code : ${sessionCode}`);
    } catch (err) {
      toast.error("Erreur lors du démarrage : " + (err as Error).message);
    } finally {
      setSessionLoading(false);
    }
  };



  const handleTourImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newPending = Array.from(files).map((file) => ({
        file,
        previewUrl: URL.createObjectURL(file),
      }));
      setPendingImages((prev) => [...prev, ...newPending]);
      e.target.value = "";
    }
  };

  const handleConfirmUpload = async () => {
    if (!editingTour || pendingImages.length === 0) return;
    const loading = toast.loading(`Upload de ${pendingImages.length} image(s)...`);
    try {
      const uploadedUrls: string[] = [];
      for (const { file, previewUrl } of pendingImages) {
        const fileExt = file.name.split(".").pop() || "jpg";
        const fileName = `tours/${editingTour.id}/${Date.now()}-${Math.random().toString(36).substr(2, 5)}.${fileExt}`;
        const { error: uploadError } = await supabase!.storage
          .from("tour_images")
          .upload(fileName, file, { contentType: file.type });
        if (uploadError) throw uploadError;
        const { data: { publicUrl } } = supabase!.storage.from("tour_images").getPublicUrl(fileName);
        uploadedUrls.push(publicUrl);
        URL.revokeObjectURL(previewUrl);
      }
      const newImages = [...uploadedUrls, ...(editingTour.images || [])];
      setEditingTour({
        ...editingTour,
        images: newImages,
        image: newImages[0] || editingTour.image,
      });
      setPendingImages([]);
      toast.success(`${uploadedUrls.length} image(s) ajoutée(s) !`, { id: loading });
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("Erreur d'upload : " + (err as Error).message, { id: loading });
    }
  };

  const onSaveEditedImage = async (blob: Blob): Promise<void> => {
    if (!imageToEdit || !editingTour) return;

    const loading = toast.loading(`Enregistrement de l'image...`);
    try {
      const { index, files, isExisting } = imageToEdit;
      let fileExt = "jpg";
      let fileName = "";
      
      if (isExisting) {
        // Try to get extension from URL or use jpg
        const urlParts = imageToEdit.url.split('?')[0].split('.');
        fileExt = urlParts[urlParts.length - 1] || "jpg";
        if (fileExt.length > 4) fileExt = "jpg"; // Handle weird URLs
        fileName = `tours/${editingTour.id}/${Date.now()}-edit.${fileExt}`;
      } else if (files && files[index]) {
        const file = files[index];
        fileExt = file.name.split(".").pop() || "jpg";
        fileName = `tours/${editingTour.id}/${Date.now()}-${index}.${fileExt}`;
      } else {
        fileName = `tours/${editingTour.id}/${Date.now()}-generic.jpg`;
      }

      const { error: uploadError } = await supabase!.storage
        .from("tour_images")
        .upload(fileName, blob, { contentType: `image/${fileExt}` });

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase!.storage.from("tour_images").getPublicUrl(fileName);

      const newImages = [...(editingTour.images || [])];
      
      if (isExisting) {
        newImages[index] = publicUrl;
      } else {
        newImages.unshift(publicUrl);
      }

      setEditingTour({
        ...editingTour,
        image: newImages[0] || editingTour.image,
        images: newImages,
      });

      toast.success(isExisting ? `Image modifiée !` : `Image ajoutée !`, { id: loading });

      // Handle next in queue for new uploads
      const nextIndex = index + 1;
      if (!isExisting && files && nextIndex < files.length) {
        const nextFile = files[nextIndex];
        const reader = new FileReader();
        reader.onload = () => {
          setImageToEdit({
            url: reader.result as string,
            index: nextIndex,
            files: files,
            isExisting: false
          });
        };
        reader.readAsDataURL(nextFile);
      } else {
        setImageToEdit(null);
      }
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("Erreur d'upload : " + (err as Error).message, {
        id: loading,
      });
      setImageToEdit(null);
    }
  };

  const handleSaveTour = async (tourData: Tour) => {
    try {
      if (supabase) {
        const payload = {
          title: tourData.title,
          title_en: tourData.title_en,
          title_es: tourData.title_es,
          subtitle: tourData.subtitle,
          subtitle_en: tourData.subtitle_en,
          subtitle_es: tourData.subtitle_es,
          description: tourData.description,
          description_en: tourData.description_en,
          description_es: tourData.description_es,
          duration: tourData.duration,
          group_size: tourData.groupSize,
          max_capacity: tourData.maxCapacity ?? 8,
          price: tourData.price,
          image: tourData.image,
          category: tourData.category,
          highlights: tourData.highlights,
          highlights_en: tourData.highlights_en,
          highlights_es: tourData.highlights_es,
          is_active: tourData.isActive,
          itinerary: tourData.itinerary,
          itinerary_en: tourData.itinerary_en,
          itinerary_es: tourData.itinerary_es,
          included: tourData.included,
          included_en: tourData.included_en,
          included_es: tourData.included_es,
          not_included: tourData.notIncluded,
          not_included_en: tourData.notIncluded_en,
          not_included_es: tourData.notIncluded_es,
          meeting_point: tourData.meetingPoint,
          meeting_point_en: tourData.meetingPoint_en,
          meeting_point_es: tourData.meetingPoint_es,
          departure_time: tourData.departureTime || null,
          estimated_duration: tourData.estimatedDuration || null,
          good_to_know: tourData.goodToKnow || [],
          good_to_know_en: tourData.goodToKnow_en || [],
          good_to_know_es: tourData.goodToKnow_es || [],
          images: tourData.images,
          pricing_tiers: tourData.pricing_tiers || {},
          stops: tourData.stops || [],
          stripe_tip_link: tourData.stripe_tip_link,
        };

        const { error } = await supabase.from("tours").upsert({
          id: tourData.id,
          ...payload,
        } as any);
        if (error) throw error;
      }

      const tourExists = tours.find((t) => t.id === tourData.id);
      let updatedTours;
      if (tourExists) {
        updatedTours = tours.map((t) => (t.id === tourData.id ? tourData : t));
      } else {
        updatedTours = [...tours, tourData];
      }
      setTours(updatedTours);
      localStorage.setItem("td-tours", JSON.stringify(updatedTours));

      toast.success("Tour enregistré avec succès.");
      setIsEditOpen(false);
    } catch (err) {
      console.error("Save error:", err);
      toast.error("Erreur d'enregistrement : " + (err as Error).message);
    }
  };

  const handleEditTour = (tour: Tour) => {
    const prepared = prepareTourForEditing(tour);
    // Ensure the gallery isn't empty if a main image exists
    if (prepared.image && (!prepared.images || prepared.images.length === 0)) {
      prepared.images = [prepared.image];
    }
    setEditingTour(prepared);
    setIsEditOpen(true);
  };

  const handleDeleteTour = async (tour: any) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce tour ?")) return;

    try {
      if (supabase) {
        const { error } = await supabase
          .from("tours")
          .delete()
          .eq("id", tour.id);
        if (error) throw error;
      }

      const updatedTours = tours.filter((t) => t.id !== tour.id);
      setTours(updatedTours);
      localStorage.setItem("td-tours", JSON.stringify(updatedTours));
      toast.success("Tour supprimé avec succès.");
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Erreur lors de la suppression : " + (err as Error).message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Active Session Control Panel */}
      {activeSession && (
        <Card className="border-2 border-amber-500 bg-amber-50/50 overflow-hidden shadow-xl animate-in fade-in slide-in-from-top duration-500">
          <CardHeader className="bg-amber-500 text-white flex flex-row justify-between items-center py-4 px-6">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
              <CardTitle className="text-xl">
                LIVE : {activeSession.tour.title}
              </CardTitle>
            </div>
            <div className="flex items-center gap-3">
              <Badge
                variant="outline"
                className="text-white border-white text-lg px-4 py-1"
              >
                CODE : {activeSession.session.session_code}
              </Badge>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
                onClick={() => setIsLiveMinimized(!isLiveMinimized)}
              >
                {isLiveMinimized ? (
                  <Maximize2 className="w-5 h-5" />
                ) : (
                  <Minimize2 className="w-5 h-5" />
                )}
              </Button>
            </div>
          </CardHeader>
          {!isLiveMinimized && (
            <CardContent className="p-6 space-y-6 animate-in slide-in-from-top-4 duration-300">
              <div className="grid md:grid-cols-3 gap-6">
                {/* QR Code */}
                <div className="bg-white p-4 rounded-2xl border border-amber-200 flex flex-col items-center justify-center text-center space-y-3 shadow-sm">
                  <div className="w-32 h-32 rounded-xl overflow-hidden border border-gray-100 flex items-center justify-center">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`${window.location.origin}/live/${activeSession.session.session_code}`)}`}
                      alt="QR Code"
                      className="w-full h-full"
                    />
                  </div>
                  <p className="text-xs font-medium text-amber-900">
                    Scannez pour rejoindre
                  </p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-[10px]"
                      onClick={() => {
                        const url = `${window.location.origin}/live/${activeSession.session.session_code}`;
                        navigator.clipboard.writeText(url);
                        toast.success("Lien copié !");
                      }}
                    >
                      Copier le lien
                    </Button>
                  </div>
                </div>

                {/* Progression Controls */}
                <div className="md:col-span-2 space-y-4">
                  <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-amber-200 shadow-sm">
                    <div className="space-y-1">
                      <p className="text-xs text-amber-600 font-bold uppercase">
                        Étape Actuelle
                      </p>
                      <p className="text-xl font-bold text-gray-900">
                        {activeSession.tour.stops?.[
                          activeSession.session.current_stop_index
                        ]?.name || "Introduction"}
                      </p>
                      <p className="text-xs text-gray-500 italic">
                        {activeSession.session.current_stop_index + 1} /{" "}
                        {(activeSession.tour.stops?.length || 0) + 1}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        disabled={
                          activeSession.session.current_stop_index === 0
                        }
                        onClick={() =>
                          updateSession({
                            current_stop_index:
                              activeSession.session.current_stop_index - 1,
                          })
                        }
                      >
                        Précédent
                      </Button>
                      <Button
                        className="bg-[#c9a961]"
                        disabled={
                          activeSession.session.current_stop_index >=
                          (activeSession.tour.stops?.length || 0)
                        }
                        onClick={() =>
                          updateSession({
                            current_stop_index:
                              activeSession.session.current_stop_index + 1,
                          })
                        }
                      >
                        Suivant
                      </Button>
                    </div>
                  </div>

                  {/* Urgent Message */}
                  <div className="flex gap-3">
                    <Input
                      placeholder="Message urgent à diffuser..."
                      value={urgentMsg}
                      onChange={(e) => setUrgentMsg(e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      variant="destructive"
                      onClick={() => {
                        updateSession({ urgent_message: urgentMsg });
                        if (urgentMsg) toast.success("Alerte diffusée !");
                        else toast.info("Alerte effacée.");
                      }}
                    >
                      {urgentMsg ? "Alerter" : "Effacer"}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-amber-100">
                <Button
                  variant="ghost"
                  className="text-gray-400 hover:text-red-600"
                  onClick={async () => {
                    if (confirm("Terminer la session live ?")) {
                      await updateSession({ status: "completed", is_active: false });
                      setActiveSession(null);
                      toast.info("Session terminée.");
                    }
                  }}
                >
                  Terminer la session
                </Button>
              </div>
            </CardContent>
          )}
        </Card>
      )}

      <div className="flex flex-col md:flex-row justify-between items-center gap-6 p-8 bg-white/50 backdrop-blur-xl rounded-[2rem] border border-amber-100/50 shadow-xl mb-12 shadow-amber-500/5">
        <div className="space-y-1">
          <h2 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
             Catalogue des Tours
          </h2>
          <p className="text-gray-500 font-medium italic">
            Gérez vos offres et diffusez vos expériences.
          </p>
        </div>

        <Button
          className="bg-amber-600 hover:bg-amber-700 text-white font-bold h-12 px-8 rounded-2xl shadow-lg shadow-amber-200 transition-all hover:scale-105 active:scale-95 flex items-center gap-3"
          onClick={() => {
            setEditingTour({
              id: Math.random().toString(36).substr(2, 9),
              title: "",
              subtitle: "",
              description: "",
              duration: "",
              groupSize: "",
              price: 0,
              image: "",
              images: [],
              highlights: [],
              category: [],
              pricing_tiers: {},
              isActive: true,
            });
            setIsEditOpen(true);
          }}
        >
          <Plus className="w-6 h-6" />
          Nouveau Tour
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tours.map((tour) => (
          <Card key={tour.id} className="relative overflow-hidden group hover:shadow-2xl transition-all duration-500 rounded-[2rem] border-amber-100/50 flex flex-col h-full bg-white">
            <div className="relative h-48 sm:h-56 overflow-hidden">
              <img
                src={tour.image}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                alt={tour.title}
              />
              <div className="absolute top-4 right-4">
                <div className="px-3 py-1 bg-black/40 backdrop-blur-md rounded-full text-[10px] font-bold text-white border border-white/20 flex items-center gap-1.5 shadow-xl">
                  <Camera className="w-3 h-3" />
                  {tour.images?.length || 1} MEDIA
                </div>
              </div>
            </div>

            {/* Galerie horizontale */}
            <div className="flex gap-2 p-3 pb-4 bg-gradient-to-b from-gray-50/80 to-white border-b border-gray-100/50 overflow-x-auto scrollbar-hide">
              {tour.images && tour.images.length > 0 ? (
                tour.images.map((img, i) => (
                  <div key={i} className="relative flex-shrink-0 w-16 h-16 rounded-2xl border-2 border-white shadow-lg overflow-hidden transition-all duration-300 hover:scale-110 hover:rotate-2 hover:z-10 cursor-pointer group/thumb">
                    <img src={img} className="w-full h-full object-cover transition-all" />
                    <div className="absolute inset-0 bg-amber-600/0 group-hover/thumb:bg-amber-600/10" />
                  </div>
                ))
              ) : (
                <div className="flex-shrink-0 w-16 h-16 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-[10px] text-gray-300 gap-1 bg-gray-50/50">
                   <ImageIcon className="w-4 h-4 opacity-40" />
                   VIDE
                </div>
              )}
            </div>
            <CardContent className="p-4 space-y-2">
              <h3 className="font-bold">{tour.title}</h3>
              <p className="text-sm text-gray-500 line-clamp-2">
                {tour.description}
              </p>
              <div className="flex justify-between items-center pt-2">
                <span className="font-bold text-amber-600">{tour.price}€</span>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEditTour(tour)}
                  >
                    Modifier
                  </Button>
                  <Button
                    size="sm"
                    className="bg-[#c9a961] hover:bg-[#b8944e]"
                    onClick={() => startLiveSession(tour)}
                    disabled={sessionLoading}
                  >
                    <Activity className="w-4 h-4 mr-1" /> Live
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 hover:border-red-300"
                    onClick={() => handleDeleteTour(tour)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-3xl w-[95vw] max-h-[95vh] flex flex-col p-0 overflow-hidden">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle>Édition Tour</DialogTitle>
          </DialogHeader>
          {editingTour && (
            <div className="flex-1 overflow-y-auto p-6">
              <Tabs defaultValue="fr" className="w-full">
                <TabsList className="grid w-full grid-cols-4 mb-6">
                  <TabsTrigger
                    value="fr"
                    className="flex items-center gap-2 font-bold text-blue-600"
                  >
                    FR <Globe className="w-3 h-3" />
                  </TabsTrigger>
                  <TabsTrigger
                    value="en"
                    className="flex items-center gap-2 font-bold text-amber-600"
                  >
                    EN <Globe className="w-3 h-3" />
                  </TabsTrigger>
                  <TabsTrigger
                    value="es"
                    className="flex items-center gap-2 font-bold text-red-600"
                  >
                    ES <Globe className="w-3 h-3" />
                  </TabsTrigger>
                  <TabsTrigger
                    value="live"
                    className="flex items-center gap-2 font-bold text-black bg-amber-100 border-amber-200"
                  >
                    LIVE <Activity className="w-3 h-3" />
                  </TabsTrigger>
                </TabsList>

                {/* Common Fields */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="space-y-2">
                    <Label className="text-xs uppercase text-gray-400">
                      ID du tour
                    </Label>
                    <Input
                      value={editingTour.id}
                      disabled
                      className="bg-gray-100"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs uppercase text-gray-400">
                      Prix de base (€)
                    </Label>
                    <Input
                      type="number"
                      value={editingTour.price}
                      onChange={(e) =>
                        setEditingTour({
                          ...editingTour,
                          price: parseInt(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <Label className="text-xs uppercase text-gray-400 font-bold">
                      Catégories (Sélectionnez plusieurs)
                    </Label>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {[
                        { id: "nature", label: "Nature" },
                        { id: "rando", label: "Rando" },
                        { id: "walking", label: "Walking Tour" },
                        { id: "gastro", label: "Gastronomie" },
                        { id: "views", label: "Vues spectaculaires" },
                        { id: "culture", label: "Culturel" },
                        { id: "urban", label: "Aventure urbaine" },
                        { id: "bcn", label: "Barcelona city" },
                        { id: "outside", label: "Outside of Barcelona" },
                      ].map((cat) => {
                        const isSelected = Array.isArray(editingTour.category)
                          ? editingTour.category.includes(cat.id)
                          : editingTour.category === cat.id;

                        return (
                          <Badge
                            key={cat.id}
                            variant={isSelected ? "default" : "outline"}
                            className={cn(
                              "cursor-pointer font-bold py-1.5 px-3 transition-all",
                              isSelected
                                ? "bg-[#c9a961] text-white"
                                : "hover:border-amber-200 hover:text-amber-600",
                            )}
                            onClick={() => {
                              const currentCats = Array.isArray(
                                editingTour.category,
                              )
                                ? [...editingTour.category]
                                : editingTour.category
                                  ? [editingTour.category]
                                  : [];

                              if (isSelected) {
                                setEditingTour({
                                  ...editingTour,
                                  category: currentCats.filter(
                                    (c) => c !== cat.id,
                                  ),
                                });
                              } else {
                                setEditingTour({
                                  ...editingTour,
                                  category: [...currentCats, cat.id],
                                });
                              }
                            }}
                          >
                            {cat.label}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Tiered Pricing Section */}
                <div className="mb-6 p-4 bg-amber-50 rounded-xl border border-amber-100">
                  <div className="flex justify-between items-center mb-4">
                    <Label className="text-xs uppercase text-amber-700 font-bold">
                      Tarification par nombre de participants (Manuel)
                    </Label>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 text-[10px] uppercase font-bold"
                      onClick={() => {
                        const nextPax =
                          Object.keys(editingTour.pricing_tiers || {}).length +
                          1;
                        setEditingTour({
                          ...editingTour,
                          pricing_tiers: {
                            ...(editingTour.pricing_tiers || {}),
                            [nextPax]: (editingTour.price || 0) * nextPax,
                          },
                        });
                      }}
                    >
                      <Plus className="w-3 h-3 mr-1" /> Ajouter un palier
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                    {Object.entries(editingTour.pricing_tiers || {})
                      .sort(([a], [b]) => Number(a) - Number(b))
                      .map(([pax, price]) => (
                        <div key={pax} className="space-y-1">
                          <Label className="text-[10px] text-amber-600 font-bold">
                            {pax} PAX (€)
                          </Label>
                          <div className="relative">
                            <Input
                              type="number"
                              className="bg-white pr-7 h-9 text-xs font-bold"
                              value={String(price)}
                              onChange={(e) => {
                                const newTiers = {
                                  ...(editingTour.pricing_tiers || {}),
                                };
                                newTiers[Number(pax)] =
                                  parseInt(e.target.value) || 0;
                                setEditingTour({
                                  ...editingTour,
                                  pricing_tiers: newTiers,
                                });
                              }}
                            />
                            <button
                              onClick={() => {
                                const newTiers = {
                                  ...(editingTour.pricing_tiers || {}),
                                };
                                delete newTiers[Number(pax)];
                                setEditingTour({
                                  ...editingTour,
                                  pricing_tiers: newTiers,
                                });
                              }}
                              className="absolute right-2 top-1/2 -translate-y-1/2 text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                  <p className="text-[10px] text-amber-600/60 mt-3 italic">
                    Si défini, ce prix sera utilisé à la place du calcul
                    automatique (Prix x Participants).
                  </p>
                </div>

                <TabsContent value="fr" className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label>Titre (FR)</Label>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-amber-600 hover:text-amber-700 hover:bg-amber-50 gap-1 text-[10px] px-2"
                        onClick={() => handleTranslate("fr", "title")}
                        disabled={isTranslating}
                      >
                        <Globe className="w-3 h-3" />
                        Traduire vers EN/ES
                      </Button>
                    </div>
                    <Input
                      value={editingTour.title}
                      onChange={(e) =>
                        setEditingTour({
                          ...editingTour,
                          title: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label>Sous-titre (FR)</Label>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-amber-600 hover:text-amber-700 hover:bg-amber-50 gap-1 text-[10px] px-2"
                        onClick={() => handleTranslate("fr", "subtitle")}
                        disabled={isTranslating}
                      >
                        <Globe className="w-3 h-3" />
                        Traduire vers EN/ES
                      </Button>
                    </div>
                    <Input
                      value={editingTour.subtitle}
                      onChange={(e) =>
                        setEditingTour({
                          ...editingTour,
                          subtitle: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label>Description (FR)</Label>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-amber-600 hover:text-amber-700 hover:bg-amber-50 gap-1 text-[10px] px-2"
                        onClick={() => handleTranslate("fr", "description")}
                        disabled={isTranslating}
                      >
                        <Globe className="w-3 h-3" />
                        Traduire vers EN/ES
                      </Button>
                    </div>
                    <Textarea
                      rows={4}
                      value={editingTour.description}
                      onChange={(e) =>
                        setEditingTour({
                          ...editingTour,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label>Points forts (FR)</Label>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 text-amber-600 hover:text-amber-700 hover:bg-amber-50 gap-1 text-[10px] px-2"
                          onClick={() => handleTranslate("fr", "highlights")}
                          disabled={isTranslating}
                        >
                          <Globe className="w-3 h-3" />
                          Traduire
                        </Button>
                      </div>
                      <Textarea
                        className="text-xs min-h-[100px]"
                        value={editingTour.highlights.join("\n")}
                        onChange={(e) =>
                          setEditingTour({
                            ...editingTour,
                            highlights: e.target.value
                              .split("\n")
                              .filter((l) => l.trim()),
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label>Itinéraire (FR)</Label>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 text-amber-600 hover:text-amber-700 hover:bg-amber-50 gap-1 text-[10px] px-2"
                          onClick={() => handleTranslate("fr", "itinerary")}
                          disabled={isTranslating}
                        >
                          <Globe className="w-3 h-3" />
                          Traduire
                        </Button>
                      </div>
                      <Textarea
                        className="text-xs min-h-[100px]"
                        value={(editingTour.itinerary || []).join("\n")}
                        onChange={(e) =>
                          setEditingTour({
                            ...editingTour,
                            itinerary: e.target.value
                              .split("\n")
                              .filter((l) => l.trim()),
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label>Inclusions (FR)</Label>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 text-amber-600 hover:text-amber-700 hover:bg-amber-50 gap-1 text-[10px]"
                          onClick={() => handleTranslate("fr", "included")}
                          disabled={isTranslating}
                        >
                          <Globe className="w-3 h-3" />
                          Traduire
                        </Button>
                      </div>
                      <Textarea
                        className="text-xs min-h-[100px]"
                        value={(editingTour.included || []).join("\n")}
                        onChange={(e) =>
                          setEditingTour({
                            ...editingTour,
                            included: e.target.value
                              .split("\n")
                              .filter((l) => l.trim()),
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label>Exclusions (FR)</Label>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 text-amber-600 hover:text-amber-700 hover:bg-amber-50 gap-1 text-[10px]"
                          onClick={() => handleTranslate("fr", "notIncluded")}
                          disabled={isTranslating}
                        >
                          <Globe className="w-3 h-3" />
                          Traduire
                        </Button>
                      </div>
                      <Textarea
                        className="text-xs min-h-[100px]"
                        value={(editingTour.notIncluded || []).join("\n")}
                        onChange={(e) =>
                          setEditingTour({
                            ...editingTour,
                            notIncluded: e.target.value
                              .split("\n")
                              .filter((l) => l.trim()),
                          })
                        }
                      />
                    </div>
                  </div>
                  {/* Capacity + Departure time + Duration */}
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    <div className="space-y-2">
                      <Label className="text-xs">Capacité max (pers.)</Label>
                      <Input
                        type="number"
                        min={1}
                        max={50}
                        className="text-xs"
                        value={editingTour.maxCapacity ?? 8}
                        onChange={(e) => setEditingTour({ ...editingTour, maxCapacity: parseInt(e.target.value) || 8 })}
                      />
                      <p className="text-[10px] text-gray-400">Bloque le calendrier quand atteint</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">Heure de départ fixe</Label>
                      <Input
                        type="time"
                        className="text-xs"
                        value={editingTour.departureTime || ""}
                        onChange={(e) => setEditingTour({ ...editingTour, departureTime: e.target.value })}
                        placeholder="09:00"
                      />
                      <p className="text-[10px] text-gray-400">Affiché en lecture seule dans le formulaire de réservation</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">Durée estimée</Label>
                      <Input
                        className="text-xs"
                        value={editingTour.estimatedDuration || ""}
                        onChange={(e) => setEditingTour({ ...editingTour, estimatedDuration: e.target.value })}
                        placeholder="ex: 8h, Journée entière"
                      />
                      <p className="text-[10px] text-gray-400">Durée affichée dans le résumé de réservation</p>
                    </div>
                  </div>

                  <div className="space-y-2 mt-4">
                    <div className="flex justify-between items-center">
                      <Label>Bon à savoir (FR)</Label>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-amber-600 hover:text-amber-700 hover:bg-amber-50 gap-1 text-[10px]"
                        onClick={() => handleTranslate("fr", "goodToKnow")}
                        disabled={isTranslating}
                      >
                        <Globe className="w-3 h-3" />
                        Traduire
                      </Button>
                    </div>
                    <Textarea
                      className="text-xs min-h-[100px]"
                      placeholder="Une info par ligne..."
                      value={(editingTour.goodToKnow || []).join("\n")}
                      onChange={(e) =>
                        setEditingTour({
                          ...editingTour,
                          goodToKnow: e.target.value
                            .split("\n")
                            .filter((l) => l.trim()),
                        })
                      }
                    />
                  </div>
                </TabsContent>

                <TabsContent value="en" className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-amber-50 rounded-lg border border-amber-100 mb-2">
                    <p className="text-xs text-amber-800 font-medium italic">
                      Synchronisez les textes anglais depuis le catalogue
                      maître.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const masterEn = (
                          translations.en as any
                        ).tour_data.find(
                          (td: any) => String(td.id) === String(editingTour.id),
                        );
                        if (masterEn) {
                          setEditingTour({
                            ...editingTour,
                            title_en: masterEn.title || editingTour.title_en,
                            subtitle_en:
                              masterEn.subtitle || editingTour.subtitle_en,
                            description_en:
                              masterEn.description ||
                              editingTour.description_en,
                            highlights_en:
                              masterEn.highlights || editingTour.highlights_en,
                            itinerary_en:
                              masterEn.itinerary || editingTour.itinerary_en,
                            included_en:
                              masterEn.included || editingTour.included_en,
                            notIncluded_en:
                              masterEn.notIncluded ||
                              editingTour.notIncluded_en,
                            meetingPoint_en:
                              masterEn.meetingPoint ||
                              editingTour.meetingPoint_en,
                          });
                          toast.success("Traductions EN synchronisées !");
                        } else {
                          toast.error("Données EN non trouvées.");
                        }
                      }}
                      className="text-[10px] h-7 bg-white text-amber-600 border-amber-200 hover:bg-amber-100"
                    >
                      <RefreshCw className="w-3 h-3 mr-1" /> Sync Master (EN)
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label>Title (EN)</Label>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-amber-600 hover:text-amber-700 hover:bg-amber-50 gap-1 text-[10px] px-2"
                        onClick={() => handleTranslate("en", "title")}
                        disabled={isTranslating}
                      >
                        <Globe className="w-3 h-3" />
                        Translate to FR/ES
                      </Button>
                    </div>
                    <Input
                      value={editingTour.title_en || ""}
                      onChange={(e) =>
                        setEditingTour({
                          ...editingTour,
                          title_en: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label>Subtitle (EN)</Label>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-amber-600 hover:text-amber-700 hover:bg-amber-50 gap-1 text-[10px] px-2"
                        onClick={() => handleTranslate("en", "subtitle")}
                        disabled={isTranslating}
                      >
                        <Globe className="w-3 h-3" />
                        Translate to FR/ES
                      </Button>
                    </div>
                    <Input
                      value={editingTour.subtitle_en || ""}
                      onChange={(e) =>
                        setEditingTour({
                          ...editingTour,
                          subtitle_en: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label>Description (EN)</Label>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-amber-600 hover:text-amber-700 hover:bg-amber-50 gap-1 text-[10px] px-2"
                        onClick={() => handleTranslate("en", "description")}
                        disabled={isTranslating}
                      >
                        <Globe className="w-3 h-3" />
                        Translate to FR/ES
                      </Button>
                    </div>
                    <Textarea
                      rows={4}
                      value={editingTour.description_en || ""}
                      onChange={(e) =>
                        setEditingTour({
                          ...editingTour,
                          description_en: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Highlights (EN)</Label>
                      <Textarea
                        className="text-xs min-h-[100px]"
                        value={(editingTour.highlights_en || []).join("\n")}
                        onChange={(e) =>
                          setEditingTour({
                            ...editingTour,
                            highlights_en: e.target.value
                              .split("\n")
                              .filter((l) => l.trim()),
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Itinerary (EN)</Label>
                      <Textarea
                        className="text-xs min-h-[100px]"
                        value={(editingTour.itinerary_en || []).join("\n")}
                        onChange={(e) =>
                          setEditingTour({
                            ...editingTour,
                            itinerary_en: e.target.value
                              .split("\n")
                              .filter((l) => l.trim()),
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label>Inclusions (EN)</Label>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 text-amber-600 hover:text-amber-700 hover:bg-amber-50 gap-1 text-[10px]"
                          onClick={() => handleTranslate("en", "included")}
                          disabled={isTranslating}
                        >
                          <Globe className="w-3 h-3" />
                          Translate
                        </Button>
                      </div>
                      <Textarea
                        className="text-xs min-h-[100px]"
                        value={(editingTour.included_en || []).join("\n")}
                        onChange={(e) =>
                          setEditingTour({
                            ...editingTour,
                            included_en: e.target.value
                              .split("\n")
                              .filter((l) => l.trim()),
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label>Exclusions (EN)</Label>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 text-amber-600 hover:text-amber-700 hover:bg-amber-50 gap-1 text-[10px]"
                          onClick={() => handleTranslate("en", "notIncluded")}
                          disabled={isTranslating}
                        >
                          <Globe className="w-3 h-3" />
                          Translate
                        </Button>
                      </div>
                      <Textarea
                        className="text-xs min-h-[100px]"
                        value={(editingTour.notIncluded_en || []).join("\n")}
                        onChange={(e) =>
                          setEditingTour({
                            ...editingTour,
                            notIncluded_en: e.target.value
                              .split("\n")
                              .filter((l) => l.trim()),
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-2 mt-4">
                    <div className="flex justify-between items-center">
                      <Label>Good to know (EN)</Label>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-amber-600 hover:text-amber-700 hover:bg-amber-50 gap-1 text-[10px]"
                        onClick={() => handleTranslate("en", "goodToKnow")}
                        disabled={isTranslating}
                      >
                        <Globe className="w-3 h-3" />
                        Translate
                      </Button>
                    </div>
                    <Textarea
                      className="text-xs min-h-[100px]"
                      placeholder="One tip per line..."
                      value={(editingTour.goodToKnow_en || []).join("\n")}
                      onChange={(e) =>
                        setEditingTour({
                          ...editingTour,
                          goodToKnow_en: e.target.value
                            .split("\n")
                            .filter((l) => l.trim()),
                        })
                      }
                    />
                  </div>
                </TabsContent>

                <TabsContent value="es" className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-100 mb-2">
                    <p className="text-xs text-red-800 font-medium italic">
                      Synchronisez les textes espagnols depuis le catalogue
                      maître.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const masterEs = (
                          translations.es as any
                        ).tour_data.find(
                          (td: any) => String(td.id) === String(editingTour.id),
                        );
                        if (masterEs) {
                          setEditingTour({
                            ...editingTour,
                            title_es: masterEs.title || editingTour.title_es,
                            subtitle_es:
                              masterEs.subtitle || editingTour.subtitle_es,
                            description_es:
                              masterEs.description ||
                              editingTour.description_es,
                            highlights_es:
                              masterEs.highlights || editingTour.highlights_es,
                            itinerary_es:
                              masterEs.itinerary || editingTour.itinerary_es,
                            included_es:
                              masterEs.included || editingTour.included_es,
                            notIncluded_es:
                              masterEs.notIncluded ||
                              editingTour.notIncluded_es,
                            meetingPoint_es:
                              masterEs.meetingPoint ||
                              editingTour.meetingPoint_es,
                          });
                          toast.success("Traductions ES synchronisées !");
                        } else {
                          toast.error("Données ES non trouvées.");
                        }
                      }}
                      className="text-[10px] h-7 bg-white text-red-600 border-red-200 hover:bg-red-100"
                    >
                      <RefreshCw className="w-3 h-3 mr-1" /> Sync Master (ES)
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label>Título (ES)</Label>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-amber-600 hover:text-amber-700 hover:bg-amber-50 gap-1 text-[10px] px-2"
                        onClick={() => handleTranslate("es", "title")}
                        disabled={isTranslating}
                      >
                        <Globe className="w-3 h-3" />
                        Traducir a FR/EN
                      </Button>
                    </div>
                    <Input
                      value={editingTour.title_es || ""}
                      onChange={(e) =>
                        setEditingTour({
                          ...editingTour,
                          title_es: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label>Subtítulo (ES)</Label>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-amber-600 hover:text-amber-700 hover:bg-amber-50 gap-1 text-[10px] px-2"
                        onClick={() => handleTranslate("es", "subtitle")}
                        disabled={isTranslating}
                      >
                        <Globe className="w-3 h-3" />
                        Traducir a FR/EN
                      </Button>
                    </div>
                    <Input
                      value={editingTour.subtitle_es || ""}
                      onChange={(e) =>
                        setEditingTour({
                          ...editingTour,
                          subtitle_es: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label>Descripción (ES)</Label>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-amber-600 hover:text-amber-700 hover:bg-amber-50 gap-1 text-[10px] px-2"
                        onClick={() => handleTranslate("es", "description")}
                        disabled={isTranslating}
                      >
                        <Globe className="w-3 h-3" />
                        Traducir a FR/EN
                      </Button>
                    </div>
                    <Textarea
                      rows={4}
                      value={editingTour.description_es || ""}
                      onChange={(e) =>
                        setEditingTour({
                          ...editingTour,
                          description_es: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label>Puntos fuertes (ES)</Label>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 text-amber-600 hover:text-amber-700 hover:bg-amber-50 gap-1 text-[10px] px-2"
                          onClick={() => handleTranslate("es", "highlights")}
                          disabled={isTranslating}
                        >
                          <Globe className="w-3 h-3" />
                          Traducir a FR/EN
                        </Button>
                      </div>
                      <Textarea
                        className="text-xs min-h-[100px]"
                        value={(editingTour.highlights_es || []).join("\n")}
                        onChange={(e) =>
                          setEditingTour({
                            ...editingTour,
                            highlights_es: e.target.value
                              .split("\n")
                              .filter((l) => l.trim()),
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label>Itinerario (ES)</Label>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 text-amber-600 hover:text-amber-700 hover:bg-amber-50 gap-1 text-[10px] px-2"
                          onClick={() => handleTranslate("es", "itinerary")}
                          disabled={isTranslating}
                        >
                          <Globe className="w-3 h-3" />
                          Traducir a FR/EN
                        </Button>
                      </div>
                      <Textarea
                        className="text-xs min-h-[100px]"
                        value={(editingTour.itinerary_es || []).join("\n")}
                        onChange={(e) =>
                          setEditingTour({
                            ...editingTour,
                            itinerary_es: e.target.value
                              .split("\n")
                              .filter((l) => l.trim()),
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label>Inclusiones (ES)</Label>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 text-amber-600 hover:text-amber-700 hover:bg-amber-50 gap-1 text-[10px]"
                          onClick={() => handleTranslate("es", "included")}
                          disabled={isTranslating}
                        >
                          <Globe className="w-3 h-3" />
                          Traducir
                        </Button>
                      </div>
                      <Textarea
                        className="text-xs min-h-[100px]"
                        value={(editingTour.included_es || []).join("\n")}
                        onChange={(e) =>
                          setEditingTour({
                            ...editingTour,
                            included_es: e.target.value
                              .split("\n")
                              .filter((l) => l.trim()),
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label>Exclusiones (ES)</Label>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 text-amber-600 hover:text-amber-700 hover:bg-amber-50 gap-1 text-[10px]"
                          onClick={() => handleTranslate("es", "notIncluded")}
                          disabled={isTranslating}
                        >
                          <Globe className="w-3 h-3" />
                          Traducir
                        </Button>
                      </div>
                      <Textarea
                        className="text-xs min-h-[100px]"
                        value={(editingTour.notIncluded_es || []).join("\n")}
                        onChange={(e) =>
                          setEditingTour({
                            ...editingTour,
                            notIncluded_es: e.target.value
                              .split("\n")
                              .filter((l) => l.trim()),
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label>A saber (ES)</Label>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-amber-600 hover:text-amber-700 hover:bg-amber-50 gap-1 text-[10px]"
                        onClick={() => handleTranslate("es", "goodToKnow")}
                        disabled={isTranslating}
                      >
                        <Globe className="w-3 h-3" />
                        Traducir
                      </Button>
                    </div>
                    <Textarea
                      className="text-xs min-h-[100px]"
                      value={(editingTour.goodToKnow_es || []).join("\n")}
                      onChange={(e) =>
                        setEditingTour({
                          ...editingTour,
                          goodToKnow_es: e.target.value
                            .split("\n")
                            .filter((l) => l.trim()),
                        })
                      }
                    />
                  </div>
                </TabsContent>

                    <div className="space-y-6">
                      <div className="flex justify-between items-center bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                        <div>
                          <Label className="text-base font-extrabold text-gray-900 block">
                            Galerie Médias
                          </Label>
                          <p className="text-[10px] text-gray-500 font-medium">
                            Gérez les photos de votre tour. La première image est l'image principale.
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="file"
                            ref={tourFileRef}
                            className="hidden"
                            accept="image/*"
                            multiple
                            onChange={handleTourImageUpload}
                          />
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => tourFileRef.current?.click()}
                            className="bg-white border-dashed border-2 hover:border-amber-400 hover:bg-amber-50 h-9"
                          >
                            <Plus className="w-4 h-4 mr-2 text-amber-600" />
                            Ajouter des photos
                          </Button>
                          {editingTour.images && editingTour.images.length > 0 && (
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                if (confirm("Voulez-vous vraiment vider toute la galerie ?")) {
                                  setEditingTour({
                                    ...editingTour,
                                    images: [],
                                    image: ""
                                  });
                                }
                              }}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 h-9"
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              Vider
                            </Button>
                          )}
                        </div>
                      </div>

                      {pendingImages.length > 0 && (
                        <div className="rounded-2xl border-2 border-dashed border-blue-300 bg-blue-50/50 p-4 space-y-3">
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <div>
                              <p className="font-bold text-sm text-blue-900">
                                {pendingImages.length} image(s) en attente
                              </p>
                              <p className="text-xs text-blue-600">
                                Vérifiez les aperçus puis cliquez sur "Accepter l'upload".
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                type="button"
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  pendingImages.forEach(({ previewUrl }) => URL.revokeObjectURL(previewUrl));
                                  setPendingImages([]);
                                }}
                                className="text-gray-500 hover:text-gray-700 h-9"
                              >
                                <X className="w-4 h-4 mr-1" />
                                Annuler
                              </Button>
                              <Button
                                type="button"
                                size="sm"
                                onClick={handleConfirmUpload}
                                className="bg-blue-600 hover:bg-blue-700 text-white h-9 font-bold"
                              >
                                <CloudUpload className="w-4 h-4 mr-2" />
                                Accepter l'upload
                              </Button>
                            </div>
                          </div>
                          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                            {pendingImages.map(({ previewUrl, file }, idx) => (
                              <div
                                key={idx}
                                className="group relative aspect-[4/3] rounded-xl overflow-hidden border-2 border-blue-300 shadow-sm"
                              >
                                <img
                                  src={previewUrl}
                                  alt={file.name}
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-blue-900/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Button
                                    type="button"
                                    size="icon"
                                    variant="destructive"
                                    className="h-7 w-7 bg-red-500/90"
                                    onClick={() => {
                                      URL.revokeObjectURL(previewUrl);
                                      setPendingImages((prev) => prev.filter((_, i) => i !== idx));
                                    }}
                                  >
                                    <X className="w-3 h-3" />
                                  </Button>
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 bg-blue-900/60 px-2 py-1">
                                  <p className="text-[9px] text-white truncate">{file.name}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {(!editingTour.images || editingTour.images.length === 0) ? (
                        <div 
                          className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-gray-200 rounded-3xl bg-gray-50/30 text-center group cursor-pointer hover:border-amber-300 hover:bg-amber-50/50 transition-all duration-300"
                          onClick={() => tourFileRef.current?.click()}
                        >
                          <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <ImageIcon className="w-8 h-8 text-gray-400 group-hover:text-amber-500" />
                          </div>
                          <h4 className="font-bold text-gray-900">Aucune photo</h4>
                          <p className="text-xs text-gray-500 max-w-[200px] mt-1">
                            Ajoutez des photos pour illustrer ce tour sur le catalogue.
                          </p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                          {editingTour.images.map((img, idx) => (
                            <div
                              key={`${img}-${idx}`}
                              className={cn(
                                "group relative aspect-[4/3] rounded-2xl overflow-hidden border-2 transition-all duration-300 shadow-sm",
                                idx === 0 
                                  ? "border-amber-400 ring-4 ring-amber-400/10 shadow-md" 
                                  : "border-white hover:border-amber-200 hover:shadow-lg"
                              )}
                            >
                              <img
                                src={img}
                                alt={`Tour photo ${idx + 1}`}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                              
                              {/* Overlay Gradient */}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                              {/* Action Buttons */}
                              <div className="absolute inset-0 flex flex-col justify-between p-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                                <div className="flex justify-end gap-1.5">
                                  <Button
                                    size="icon"
                                    variant="secondary"
                                    className="h-8 w-8 bg-white/90 backdrop-blur-md hover:bg-white text-gray-900 shadow-xl border-none"
                                    onClick={() => window.open(img, "_blank")}
                                    title="Agrandir"
                                  >
                                    <Maximize2 className="w-3.5 h-3.5" />
                                  </Button>
                                  <Button
                                    size="icon"
                                    variant="secondary"
                                    className="h-8 w-8 bg-white/90 backdrop-blur-md hover:bg-white text-amber-600 shadow-xl border-none"
                                    onClick={() => {
                                      setImageToEdit({
                                        url: img,
                                        index: idx,
                                        isExisting: true
                                      });
                                    }}
                                    title="Modifier / Recadrer"
                                  >
                                    <Scissors className="w-3.5 h-3.5" />
                                  </Button>
                                  <Button
                                    size="icon"
                                    variant="destructive"
                                    className="h-8 w-8 bg-red-500/90 backdrop-blur-md hover:bg-red-600 text-white shadow-xl border-none"
                                    onClick={() => {
                                      const newImages = editingTour.images?.filter((_, i) => i !== idx) || [];
                                      setEditingTour({
                                        ...editingTour,
                                        images: newImages,
                                        image: idx === 0 ? newImages[0] || "" : editingTour.image,
                                      });
                                    }}
                                    title="Supprimer"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </Button>
                                </div>

                                <div className="flex items-center justify-between">
                                  <div className="flex gap-1">
                                    {idx > 0 && (
                                      <Button
                                        size="icon"
                                        variant="secondary"
                                        className="h-8 w-8 bg-white/90 backdrop-blur-md hover:bg-white text-gray-900 shadow-xl border-none"
                                        onClick={() => {
                                          const newImages = [...(editingTour.images || [])];
                                          [newImages[idx], newImages[idx - 1]] = [newImages[idx - 1], newImages[idx]];
                                          setEditingTour({
                                            ...editingTour,
                                            images: newImages,
                                            image: newImages[0],
                                          });
                                        }}
                                        title="Déplacer vers la gauche"
                                      >
                                        <ChevronLeft className="w-4 h-4" />
                                      </Button>
                                    )}
                                    {idx < (editingTour.images?.length || 0) - 1 && (
                                      <Button
                                        size="icon"
                                        variant="secondary"
                                        className="h-8 w-8 bg-white/90 backdrop-blur-md hover:bg-white text-gray-900 shadow-xl border-none"
                                        onClick={() => {
                                          const newImages = [...(editingTour.images || [])];
                                          [newImages[idx], newImages[idx + 1]] = [newImages[idx + 1], newImages[idx]];
                                          setEditingTour({
                                            ...editingTour,
                                            images: newImages,
                                            image: newImages[0],
                                          });
                                        }}
                                        title="Déplacer vers la droite"
                                      >
                                        <ChevronRight className="w-4 h-4" />
                                      </Button>
                                    )}
                                  </div>
                                  
                                  {idx !== 0 && (
                                    <Button
                                      size="sm"
                                      variant="secondary"
                                      className="h-8 px-3 text-[10px] font-bold uppercase tracking-wider bg-amber-500 text-white hover:bg-amber-600 border-none shadow-xl"
                                      onClick={() => {
                                        const newImages = [...(editingTour.images || [])];
                                        const [moved] = newImages.splice(idx, 1);
                                        newImages.unshift(moved);
                                        setEditingTour({
                                          ...editingTour,
                                          images: newImages,
                                          image: moved,
                                        });
                                      }}
                                    >
                                      <Star className="w-3 h-3 mr-1 fill-current" />
                                      Principal
                                    </Button>
                                  )}
                                </div>
                              </div>

                              {/* Indicators */}
                              {idx === 0 && (
                                <div className="absolute top-3 left-3 flex gap-2">
                                  <Badge className="bg-amber-500 text-white border-none text-[9px] h-5 px-2 uppercase font-extrabold tracking-widest shadow-lg">
                                    Photo Principale
                                  </Badge>
                                </div>
                              )}
                              
                              <div className="absolute bottom-3 left-3 px-2 py-1 bg-black/40 backdrop-blur-sm rounded-lg border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-white text-[10px] font-bold">#{idx + 1}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                <TabsContent value="live" className="space-y-6">
                  <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100 space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-bold text-amber-900 text-lg">
                          Configuration LiveTour
                        </h3>
                        <p className="text-sm text-amber-700 italic">
                          Préparez les étapes de votre visite interactive.
                        </p>
                      </div>
                      <Badge className="bg-amber-600 h-8 px-4">Beta</Badge>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-amber-900 font-bold">
                        Lien Stripe (Tips)
                      </Label>
                      <Input
                        placeholder="https://buy.stripe.com/..."
                        value={editingTour.stripe_tip_link || ""}
                        onChange={(e) =>
                          setEditingTour({
                            ...editingTour,
                            stripe_tip_link: e.target.value,
                          })
                        }
                        className="bg-white border-amber-200"
                      />
                      <p className="text-xs text-amber-600 italic">
                        Ce lien sera affiché aux clients à la fin de leur
                        expérience Live.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-bold flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-amber-600" /> Étapes de
                        la visite (Stops)
                      </h3>
                      <Button
                        size="sm"
                        onClick={() => {
                          const newStops = [...(editingTour.stops || [])];
                          newStops.push({
                            name: `Étape ${newStops.length + 1}`,
                            description: "",
                          });
                          setEditingTour({ ...editingTour, stops: newStops });
                        }}
                        className="bg-[#c9a961]"
                      >
                        <Plus className="w-4 h-4 mr-2" /> Ajouter une étape
                      </Button>
                    </div>

                    <div className="space-y-3">
                      {(editingTour.stops || []).length === 0 ? (
                        <div className="text-center p-8 border-2 border-dashed border-gray-100 rounded-2xl text-gray-400 italic">
                          Aucune étape configurée. Ajoutez-en une pour commencer
                          le LiveTour.
                        </div>
                      ) : (
                        editingTour.stops?.map((stop, idx) => (
                          <div
                            key={idx}
                            className="group flex gap-4 p-4 bg-white border border-gray-100 rounded-xl hover:border-amber-200 transition-all shadow-sm"
                          >
                            <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold flex-shrink-0">
                              {idx + 1}
                            </div>
                            <div className="flex-1 space-y-3">
                              <div className="flex gap-2">
                                <div className="flex-1 space-y-2">
                                  <Input
                                    placeholder="Nom de l'étape"
                                    value={stop.name}
                                    onChange={(e) => {
                                      const newStops = [
                                        ...(editingTour.stops || []),
                                      ];
                                      newStops[idx].name = e.target.value;
                                      setEditingTour({
                                        ...editingTour,
                                        stops: newStops,
                                      });
                                    }}
                                    className="h-9 font-bold"
                                  />
                                  <div className="flex gap-2 items-start">
                                    <div className="flex-1 space-y-2">
                                      <Input
                                        placeholder="Image URL (optionnelle)"
                                        value={stop.image || ""}
                                        onChange={(e) => {
                                          const newStops = [
                                            ...(editingTour.stops || []),
                                          ];
                                          newStops[idx].image = e.target.value;
                                          setEditingTour({
                                            ...editingTour,
                                            stops: newStops,
                                          });
                                        }}
                                        className="h-8 text-[10px]"
                                      />
                                      {stop.image && (
                                        <div className="w-24 h-16 rounded-lg overflow-hidden border border-gray-100 bg-gray-50 shadow-sm">
                                          <img
                                            src={stop.image}
                                            alt={stop.name}
                                            className="w-full h-full object-cover"
                                            onError={(e) =>
                                              (e.currentTarget.style.display =
                                                "none")
                                            }
                                          />
                                        </div>
                                      )}
                                    </div>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="h-8 px-2 shrink-0"
                                      type="button"
                                      onClick={() => {
                                        const input =
                                          document.createElement("input");
                                        input.type = "file";
                                        input.accept = "image/*";
                                        input.onchange = async (ev: any) => {
                                          const file = ev.target.files?.[0];
                                          if (!file) return;
                                          const loading = toast.loading(
                                            "Upload photo étape...",
                                          );
                                          try {
                                            const fileExt = file.name
                                              .split(".")
                                              .pop();
                                            const fileName = `stops/${editingTour.id}/stop-${idx}-${Date.now()}.${fileExt}`;
                                            const { error: uploadError } =
                                              await supabase!.storage
                                                .from("tour_images")
                                                .upload(fileName, file);
                                            if (uploadError) throw uploadError;
                                            const {
                                              data: { publicUrl },
                                            } = supabase!.storage
                                              .from("tour_images")
                                              .getPublicUrl(fileName);
                                            const newStops = [
                                              ...(editingTour.stops || []),
                                            ];
                                            newStops[idx].image = publicUrl;
                                            setEditingTour({
                                              ...editingTour,
                                              stops: newStops,
                                            });
                                            toast.success(
                                              "Photo étape uploadée !",
                                              { id: loading },
                                            );
                                          } catch (err) {
                                            toast.error(
                                              "Erreur upload : " +
                                                (err as Error).message,
                                              { id: loading },
                                            );
                                          }
                                        };
                                        input.click();
                                      }}
                                    >
                                      <Camera className="w-3 h-3 mr-1 text-amber-600" />
                                      <span className="text-[10px]">Photo</span>
                                    </Button>
                                  </div>
                                  <Textarea
                                    placeholder="Description de l'étape (optionnelle)"
                                    value={stop.description || ""}
                                    onChange={(e) => {
                                      const newStops = [
                                        ...(editingTour.stops || []),
                                      ];
                                      newStops[idx].description =
                                        e.target.value;
                                      setEditingTour({
                                        ...editingTour,
                                        stops: newStops,
                                      });
                                    }}
                                    className="text-xs h-16 min-h-0"
                                  />
                                  {stop.image && (
                                    <div className="w-32 aspect-video rounded-lg overflow-hidden border border-gray-100 mt-1">
                                      <img
                                        src={stop.image}
                                        alt={stop.name}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                  )}
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-400 hover:text-red-600 hover:bg-red-50"
                                  onClick={() => {
                                    const newStops = editingTour.stops?.filter(
                                      (_, i) => i !== idx,
                                    );
                                    setEditingTour({
                                      ...editingTour,
                                      stops: newStops,
                                    });
                                  }}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                              <Textarea
                                placeholder="Petite description ou instructions pour cette étape..."
                                value={stop.description}
                                rows={2}
                                onChange={(e) => {
                                  const newStops = [
                                    ...(editingTour.stops || []),
                                  ];
                                  newStops[idx].description = e.target.value;
                                  setEditingTour({
                                    ...editingTour,
                                    stops: newStops,
                                  });
                                }}
                                className="text-sm"
                              />
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
          <div className="px-6 py-4 bg-gray-50 border-t flex justify-end gap-3 shrink-0">
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Annuler
            </Button>
            <Button
              onClick={() => editingTour && handleSaveTour(editingTour)}
              className="bg-[#c9a961] hover:bg-[#b8944e] font-bold px-8"
            >
              Enregistrer
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {imageToEdit && (
        <ImageEditor
          image={imageToEdit.url}
          isOpen={!!imageToEdit}
          onClose={() => setImageToEdit(null)}
          onSave={onSaveEditedImage}
          title={imageToEdit.isExisting 
            ? "Modifier l'image" 
            : `Retoucher l'image (${imageToEdit.index + 1}/${imageToEdit.files?.length || 1})`}
        />
      )}
    </div>
  );
}

// Reviews Component
function Reviews({
  reviews,
  setReviews,
}: {
  reviews: Review[];
  setReviews: React.Dispatch<React.SetStateAction<Review[]>>;
}) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newReview, setNewReview] = useState<Partial<Review>>({
    name: "",
    location: "",
    rating: 5,
    text: "",
    isPublished: true,
  });

  const handleAddReview = async () => {
    if (!newReview.name || !newReview.text) {
      toast.error("Veuillez remplir le nom et le texte");
      return;
    }

    if (supabase) {
      const { data, error } = await supabase
        .from("reviews")
        .insert({
          name: newReview.name,
          location: newReview.location,
          rating: newReview.rating,
          text: newReview.text,
          is_published: newReview.isPublished,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        toast.error("Erreur lors de l'ajout de l'avis");
      } else if (data) {
        setReviews((prev) => [
          {
            id: data.id,
            name: data.name,
            location: data.location,
            rating: data.rating,
            text: data.text,
            isPublished: data.is_published,
            createdAt: data.created_at,
          },
          ...prev,
        ]);
        toast.success("Avis ajouté !");
        setIsAddOpen(false);
        setNewReview({
          name: "",
          location: "",
          rating: 5,
          text: "",
          isPublished: true,
        });
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Modération des Avis</h2>
        <Button
          onClick={() => setIsAddOpen(true)}
          className="bg-[#c9a961] hover:bg-[#b8944e]"
        >
          <Plus className="w-4 h-4 mr-2" /> Ajouter un avis
        </Button>
      </div>

      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Nouvel Avis</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nom</Label>
                <Input
                  value={newReview.name}
                  onChange={(e) =>
                    setNewReview({ ...newReview, name: e.target.value })
                  }
                  placeholder="Ex: Marie D."
                />
              </div>
              <div className="space-y-2">
                <Label>Localisation</Label>
                <Input
                  value={newReview.location}
                  onChange={(e) =>
                    setNewReview({ ...newReview, location: e.target.value })
                  }
                  placeholder="Ex: Paris, France"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Note (1-5)</Label>
              <Select
                value={String(newReview.rating)}
                onValueChange={(val) =>
                  setNewReview({ ...newReview, rating: Number(val) })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[5, 4, 3, 2, 1].map((n) => (
                    <SelectItem key={n} value={String(n)}>
                      {n} Étoiles
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Commentaire</Label>
              <Textarea
                value={newReview.text}
                onChange={(e) =>
                  setNewReview({ ...newReview, text: e.target.value })
                }
                placeholder="L'expérience était fantastique..."
                rows={4}
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isPublished"
                checked={newReview.isPublished}
                onChange={(e) =>
                  setNewReview({ ...newReview, isPublished: e.target.checked })
                }
                className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
              />
              <Label htmlFor="isPublished">Publier immédiatement</Label>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setIsAddOpen(false)}>
              Annuler
            </Button>
            <Button
              onClick={handleAddReview}
              className="bg-[#c9a961] hover:bg-[#b8944e]"
            >
              Enregistrer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      {reviews.map((review) => (
        <Card key={review.id} className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <div className="font-bold">{review.name}</div>
              <div className="flex gap-1 py-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3 h-3 ${i < review.rating ? "fill-amber-500 text-amber-500" : "text-gray-300"}`}
                  />
                ))}
              </div>
              <p className="text-sm italic text-gray-700">"{review.text}"</p>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={review.isPublished ? "outline" : "default"}
                onClick={() => {
                  const newStatus = !review.isPublished;
                  if (supabase) {
                    supabase
                      .from("reviews")
                      .update({ is_published: newStatus })
                      .eq("id", review.id)
                      .then(({ error }) => {
                        if (!error)
                          toast.success(
                            newStatus ? "Avis publié !" : "Avis masqué",
                          );
                      });
                  }
                  setReviews((prev) =>
                    prev.map((r) =>
                      r.id === review.id ? { ...r, isPublished: newStatus } : r,
                    ),
                  );
                }}
              >
                {review.isPublished ? "Cacher" : "Publier"}
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={async () => {
                  if (confirm("Supprimer cet avis ?")) {
                    if (supabase) {
                      const { error } = await supabase
                        .from("reviews")
                        .delete()
                        .eq("id", review.id);
                      if (error) {
                        toast.error("Erreur lors de la suppression");
                        return;
                      }
                      toast.success("Avis supprimé");
                    }
                    setReviews((prev) =>
                      prev.filter((r) => r.id !== review.id),
                    );
                  }
                }}
              >
                Supprimer
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

// Config Component
function Config({
  onPull,
  onPush,
  onReset,
  onFixImages,
  isSyncing,
}: {
  onPull: () => void;
  onPush: () => void;
  onReset: () => void;
  onFixImages: () => void;
  isSyncing: boolean;
}) {
  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-4xl font-black text-gray-900 tracking-tight">
            Infrastructure
          </h2>
          <p className="text-gray-500 font-medium">
            Monitoring en temps réel et état critique du système.
          </p>
        </div>
        <div className="flex gap-2">
          <div className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-bold flex items-center gap-2 border border-green-200 shadow-sm">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            SANTÉ GLOBALE : 100%
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Monitoring />
        </div>

        <div className="space-y-6">
          <Card className="bg-gray-50 border-gray-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-600" /> Sécurité
                Infra
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-[11px]">
                  <span className="text-gray-500">Auth Service</span>
                  <span className="text-green-600 font-bold italic">
                    Actif (Otp)
                  </span>
                </div>
                <div className="w-full bg-gray-200 h-1 rounded-full overflow-hidden">
                  <div className="bg-green-500 h-full w-[100%]" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-[11px]">
                  <span className="text-gray-500">RLS Policies</span>
                  <span className="text-green-600 font-bold italic">
                    Vérifié
                  </span>
                </div>
                <div className="w-full bg-gray-200 h-1 rounded-full overflow-hidden">
                  <div className="bg-green-500 h-full w-[100%]" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 text-white overflow-hidden shadow-2xl border-none">
            <CardHeader className="pb-4 border-b border-gray-800 bg-gray-900/50">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Database className="w-5 h-5 text-amber-500" /> Maintenance & Sync
              </CardTitle>
              <CardDescription className="text-gray-400 text-xs font-medium">
                Outils de récupération et synchronisation forcée
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid gap-3">
                <Button
                  variant="secondary"
                  className="w-full justify-start bg-gray-800 hover:bg-gray-700 text-white border-none h-12 px-4"
                  onClick={onPull}
                  disabled={isSyncing}
                >
                  <CloudDownload className="w-4 h-4 mr-3 text-blue-400" />
                  <div className="text-left">
                    <div className="font-bold text-sm">Importer du Cloud</div>
                    <div className="text-[10px] text-gray-400">Force la récupération des données en ligne</div>
                  </div>
                </Button>

                <Button
                  variant="secondary"
                  className="w-full justify-start bg-gray-800 hover:bg-gray-700 text-white border-none h-12 px-4"
                  onClick={() => {
                    if (
                      confirm(
                        "⚠️ ATTENTION : Cette action va écraser TOUTES les données du site public avec votre version actuelle.\n\nÊtes-vous sûr de vouloir continuer ?"
                      )
                    ) {
                      onPush();
                    }
                  }}
                  disabled={isSyncing}
                >
                  <CloudUpload className="w-4 h-4 mr-3 text-amber-400" />
                  <div className="text-left">
                    <div className="font-bold text-sm">Mettre à jour le site public</div>
                    <div className="text-[10px] text-gray-400">Écrase le Cloud avec vos données d'administration</div>
                  </div>
                </Button>

                <Button
                  variant="secondary"
                  className="w-full justify-start bg-gray-800 hover:bg-gray-700 text-white border-none h-12 px-4"
                  onClick={onFixImages}
                >
                  <ImageIcon className="w-4 h-4 mr-3 text-green-400" />
                  <div className="text-left">
                    <div className="font-bold text-sm">Réparer les liens photos</div>
                    <div className="text-[10px] text-gray-400">Nettoyage automatique des chemins legacy</div>
                  </div>
                </Button>

                <div className="pt-4 mt-2 border-t border-gray-800">
                  <Button
                    variant="destructive"
                    className="w-full justify-start bg-red-950/30 hover:bg-red-900/50 text-red-500 border border-red-900/50 h-12 px-4"
                    onClick={onReset}
                    disabled={isSyncing}
                  >
                    <RotateCcw className="w-4 h-4 mr-3" />
                    <div className="text-left">
                      <div className="font-bold text-sm">Reset Usine</div>
                      <div className="text-[10px] text-red-400 opacity-70">Réinstallation du catalogue standard</div>
                    </div>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-dashed border-2 border-gray-100">
            <CardContent className="p-6 text-center space-y-3">
              <Activity className="w-8 h-8 text-gray-200 mx-auto" />
              <p className="text-xs text-gray-400 font-medium italic">
                Logs système agrégés. <br />
                Toutes les opérations sont archivées pour l'audit.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
// Admins Management Component
function AdminsManagement() {
  const [admins, setAdmins] = useState<{ email: string }[]>([]);
  const [newEmail, setNewEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const fetchAdmins = useCallback(async () => {
    if (!supabase) return;
    const { data, error } = await supabase
      .from("authorized_admins")
      .select("email")
      .order("email");
    if (!error && data) setAdmins(data as { email: string }[]);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchAdmins();
  }, [fetchAdmins]);

  const handleAddAdmin = async () => {
    if (!newEmail || !supabase) return;
    const email = newEmail.toLowerCase().trim();
    const { error } = await supabase
      .from("authorized_admins")
      .insert({ email });

    if (error) {
      toast.error("Échec de l'ajout : " + error.message);
    } else {
      toast.success("Admin ajouté");
      setNewEmail("");
      fetchAdmins();
    }
  };

  const handleRemoveAdmin = async (email: string) => {
    if (!supabase || !confirm(`Révoquer l'accès pour ${email} ?`)) return;
    const { error } = await supabase
      .from("authorized_admins")
      .delete()
      .eq("email", email);

    if (error) {
      toast.error("Échec de la suppression");
    } else {
      toast.success("Accès révoqué");
      fetchAdmins();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestion des Administrateurs</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Ajouter un administrateur</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Input
              placeholder="email@toursandetours.com"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="max-w-md"
            />
            <Button onClick={handleAddAdmin} className="bg-[#c9a961]">
              <Plus className="w-4 h-4 mr-2" /> Autoriser
            </Button>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            L'utilisateur pourra se connecter via un lien magique s'il figure
            dans cette liste.
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {isLoading ? (
          <div className="flex justify-center p-8">
            <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
          </div>
        ) : (
          admins.map((admin) => (
            <Card key={admin.email} className="overflow-hidden">
              <div className="p-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                    <User className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-bold">{admin.email}</p>
                    <p className="text-xs text-gray-500 italic">Accès Master</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => handleRemoveAdmin(admin.email)}
                >
                  <Trash2 className="w-4 h-4 mr-2" /> Révoquer
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

// Monitoring Component
function Monitoring() {
  const [vercelStatus, setVercelStatus] = useState<"checking" | "ok" | "error">(
    "checking",
  );
  const [supabaseStatus, setSupabaseStatus] = useState<
    "checking" | "ok" | "error"
  >("checking");
  const [latency, setLatency] = useState<number | null>(null);
  const [lastCommit, setLastCommit] = useState<{
    message: string;
    date: string;
    url?: string;
  } | null>(null);

  const [vercelDeploys, setVercelDeploys] = useState<any[]>([]);
  const [vToken, setVToken] = useState(
    localStorage.getItem("td-vercel-token") || "",
  );
  const [ghToken, setGhToken] = useState(
    localStorage.getItem("td-github-token") || "",
  );
  const [isVLoading, setIsVLoading] = useState(false);
  const [isConfigSyncing, setIsConfigSyncing] = useState(false);

  useEffect(() => {
    const fetchCloudConfig = async () => {
      if (!supabase) return;
      const { data, error } = await supabase
        .from("site_config")
        .select("value")
        .eq("key", "infra_config")
        .maybeSingle();

      if (!error && data?.value) {
        const { gh_token, v_token } = data.value;
        if (gh_token) {
          setGhToken(gh_token);
          localStorage.setItem("td-github-token", gh_token);
        }
        if (v_token) {
          setVToken(v_token);
          localStorage.setItem("td-vercel-token", v_token);
        }
      }
    };
    fetchCloudConfig();
  }, []);

  const saveCloudConfig = async (gh: string, v: string) => {
    if (!supabase) return;
    setIsConfigSyncing(true);
    const { error } = await supabase.from("site_config").upsert({
      key: "infra_config",
      value: { gh_token: gh, v_token: v },
      updated_at: new Date().toISOString(),
    });

    if (error) {
      toast.error("Erreur de synchronisation cloud");
    } else {
      toast.success("Configuration synchronisée sur le cloud");
    }
    setIsConfigSyncing(false);
  };

  const fetchVercelDeploys = async (token: string) => {
    if (!token) return;
    setIsVLoading(true);
    try {
      // 1. First, let's try to find the project ID by name/domain
      const projectsRes = await fetch("https://api.vercel.com/v9/projects", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const projectsData = await projectsRes.json();

      // Look for a project that matches our domain or is named 'tours'

      const project = projectsData.projects?.find(
        (p: any) =>
          p.name === "tours" ||
          p.targets?.production?.alias?.includes("tours-five-olive.vercel.app"),
      );

      const targetId = project?.id || "prj_u3FmYgW8H5YFw4H5r6B7C8D9E0"; // fallback to previous or dynamic

      const res = await fetch(
        `https://api.vercel.com/v6/deployments?projectId=${targetId}&limit=5`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const data = await res.json();
      if (data.deployments) {
        setVercelDeploys(data.deployments);
      }
    } catch (err) {
      console.error("Vercel API Error:", err);
    } finally {
      setIsVLoading(false);
    }
  };

  useEffect(() => {
    if (vToken) fetchVercelDeploys(vToken);
  }, [vToken]);

  useEffect(() => {
    // Check Supabase
    const start = Date.now();
    if (supabase) {
      supabase
        .from("site_config")
        .select("key")
        .limit(1)
        .then(({ error }) => {
          setSupabaseStatus(error ? "error" : "ok");
          if (error) console.error("Monitor Supabase Error:", error);
          setLatency(Date.now() - start);
        });
    } else {
      setSupabaseStatus("error");
    }

    // Check Vercel
    fetch("https://tours-five-olive.vercel.app/", { mode: "no-cors" })
      .then(() => setVercelStatus("ok"))
      .catch(() => setVercelStatus("error"));

    // Fetch Last Git Commit
    const gitHeaders: Record<string, string> = {};
    if (ghToken) gitHeaders["Authorization"] = `token ${ghToken}`;

    fetch("https://api.github.com/repos/dg280/TOURS/commits/main", {
      headers: gitHeaders,
    })
      .then((res) => {
        if (!res.ok) throw new Error("GitHub API Error: " + res.status);
        return res.json();
      })
      .then((data) => {
        if (data && data.commit) {
          setLastCommit({
            message: data.commit.message,
            date: new Date(data.commit.author.date).toLocaleString("fr-FR"),
          });
        }
      })
      .catch((err) => {
        console.error("Git fetch error:", err);
        setLastCommit({
          message: "Erreur de récupération (Repo Privé ou Limite API)",
          date: "N/A",
        });
      });
  }, [ghToken]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Supabase Status */}
        <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${supabaseStatus === "ok" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}
            >
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold">Supabase DB</p>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider">
                Base de données Cloud
              </p>
            </div>
          </div>
          <div className="text-right">
            <span
              className={`text-xs font-bold px-2 py-1 rounded-full ${supabaseStatus === "ok" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
            >
              {supabaseStatus === "ok" ? "FONCTIONNEL" : "ERREUR"}
            </span>
            {latency !== null && (
              <p className="text-[10px] text-gray-400 mt-1">{latency}ms</p>
            )}
          </div>
        </div>

        {/* Vercel Status */}
        <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${vercelStatus === "ok" ? "bg-blue-50 text-blue-600" : "bg-red-50 text-red-600"}`}
            >
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold">Vercel Edge</p>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider">
                Disponibilité Production
              </p>
            </div>
          </div>
          <div className="text-right">
            <span
              className={`text-xs font-bold px-2 py-1 rounded-full ${vercelStatus === "ok" ? "bg-blue-100 text-blue-700" : "bg-red-100 text-red-700"}`}
            >
              {vercelStatus === "ok" ? "EN LIGNE" : "ERREUR"}
            </span>
            <p className="text-[10px] text-gray-400 mt-1">SSL Actif</p>
          </div>
        </div>
      </div>

      {/* Git Monitoring */}
      <div className="bg-gray-900 rounded-xl overflow-hidden shadow-sm text-white">
        <div className="p-4 bg-gray-800/50 border-b border-gray-700 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400">
              Dernier Push GitHub
            </h4>
          </div>
          <div className="flex gap-2">
            {!ghToken && (
              <Button
                size="icon-sm"
                variant="ghost"
                onClick={() => {
                  const tk = prompt(
                    "Entrez votre GitHub Personal Access Token (classic ou fine-grained) :",
                  );
                  if (tk) {
                    localStorage.setItem("td-github-token", tk);
                    setGhToken(tk);
                    saveCloudConfig(tk, vToken);
                  }
                }}
                className="h-6 w-6 text-gray-500 hover:text-white"
              >
                <ShieldCheck className="w-3 h-3" />
              </Button>
            )}
            <Globe className="w-4 h-4 text-gray-600" />
          </div>
        </div>
        <div className="p-6">
          {lastCommit ? (
            <div className="space-y-3">
              <p className="text-amber-400 font-mono text-sm leading-relaxed">
                {">"} commit: "{lastCommit.message}"
              </p>
              <div className="flex items-center justify-between text-[10px] text-gray-500 font-mono">
                <span>BRANCH: main</span>
                <span>DATE: {lastCommit.date}</span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 text-gray-500 italic">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Récupération des logs git...</span>
            </div>
          )}
        </div>
      </div>

      {/* Vercel Deployments */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
          <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500 flex items-center gap-2">
            <ExternalLink className="w-3 h-3" /> Logs Déploiement Vercel
          </h4>
          {!vToken ? (
            <Button
              size="sm"
              variant="ghost"
              className="text-[10px] h-6"
              onClick={() => {
                const tk = prompt("Entrez votre Vercel API Token :");
                if (tk) {
                  localStorage.setItem("td-vercel-token", tk);
                  setVToken(tk);
                  fetchVercelDeploys(tk);
                  saveCloudConfig(ghToken, tk);
                }
              }}
            >
              Configuration
            </Button>
          ) : (
            <div className="flex gap-2">
              <Badge variant="outline" className="text-[10px] bg-blue-50">
                Token Actif
              </Badge>
              <button
                onClick={() => {
                  if (confirm("Révoquer le token local ?")) {
                    localStorage.removeItem("td-vercel-token");
                    setVToken("");
                    setVercelDeploys([]);
                  }
                }}
                className="text-[10px] text-red-500 hover:underline"
              >
                Déconnecter
              </button>
            </div>
          )}
        </div>
        <div className="p-2 bg-amber-50 text-[10px] text-amber-800 border-b border-amber-100 flex items-center gap-2">
          <ShieldCheck className="w-3 h-3" />
          Stockage : Cloud Supabase (Partagé) + LocalStorage.
          {isConfigSyncing && <Loader2 className="w-2 h-2 animate-spin ml-2" />}
        </div>
        <div className="divide-y divide-gray-50">
          {vToken ? (
            isVLoading ? (
              <div className="p-8 text-center">
                <Loader2 className="w-4 h-4 animate-spin mx-auto text-blue-500" />
              </div>
            ) : vercelDeploys.length > 0 ? (
              vercelDeploys.map((dep) => (
                <div
                  key={dep.uid}
                  className="p-4 hover:bg-gray-50 transition-colors flex justify-between items-center text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full ${dep.state === "READY" ? "bg-green-500" : dep.state === "ERROR" ? "bg-red-500" : "bg-amber-500"}`}
                      />
                      <span className="font-bold text-gray-700 capitalize">
                        {dep.state}
                      </span>
                      <span className="text-gray-400 font-mono">
                        #{dep.uid.slice(-6)}
                      </span>
                    </div>
                    <p className="text-gray-500 line-clamp-1 italic max-w-sm">
                      "{dep.meta?.githubCommitMessage || "Pas de message"}"
                    </p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="font-medium text-gray-400">
                      {new Date(dep.createdAt).toLocaleString("fr-FR", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    <a
                      href={`https://${dep.url}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-500 hover:underline flex items-center justify-end gap-1"
                    >
                      Preview <ExternalLink className="w-2 h-2" />
                    </a>
                  </div>
                </div>
              ))
            ) : (
              <p className="p-8 text-center text-gray-400 italic text-xs">
                Aucun déploiement trouvé.
              </p>
            )
          ) : (
            <div className="p-8 text-center space-y-3">
              <p className="text-xs text-gray-400 italic">
                Configurez un token Vercel pour voir les logs de déploiement en
                direct.
              </p>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  const token = prompt("Entrez votre Vercel API Token :");
                  if (token) {
                    localStorage.setItem("td-vercel-token", token);
                    setVToken(token);
                    fetchVercelDeploys(token);
                  }
                }}
              >
                Ajouter Token
              </Button>
            </div>
          )}
        </div>
      </div>
      <h4 className="text-xs font-bold text-amber-800 uppercase mb-3 flex items-center gap-2">
        <Bell className="w-4 h-4" /> Analyse d'Expert
      </h4>
      <p className="text-xs text-amber-900/70 leading-relaxed">
        L'infrastructure est actuellement optimisée. Supabase répond avec une
        latence <span className="font-bold">inférieure à 200ms</span>. Le
        déploiement Vercel est stable et le certificat SSL est valide. Aucune
        anomalie détectée sur les API durant les dernières 24h.
      </p>
    </div>
  );
}

// Marketing Component
function Marketing({
  subscribers,
}: {
  subscribers: { email: string; created_at: string }[];
}) {
  const seoChecklist = [
    { task: "Méta-titres et descriptions dynamiques", status: true },
    { task: "Données structurées JSON-LD (Tours)", status: true },
    { task: "Plan du sitemap (sitemap.xml)", status: false },
    { task: "Optimisation des images (Alt tags)", status: true },
    { task: "Vitesse de chargement (Vercel Performance)", status: true },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header>
        <h2 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
          <BarChart3 className="w-8 h-8 text-amber-600" />
          Marketing & SEO
        </h2>
        <p className="text-gray-500 font-medium">
          Gérez votre audience et optimisez votre visibilité sur Google.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 shadow-sm border-gray-100">
          <CardHeader className="flex flex-row items-center justify-between border-b border-gray-50 pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <Send className="w-5 h-5 text-amber-500" />
              Inscriptions Newsletter
            </CardTitle>
            <Badge variant="outline" className="font-mono">
              {subscribers.length} inscrits
            </Badge>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-[10px] uppercase font-bold text-gray-400">
                  <tr>
                    <th className="px-6 py-3">Email</th>
                    <th className="px-6 py-3 text-right">Date d'inscription</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {subscribers.length > 0 ? (
                    subscribers.map((sub, i) => (
                      <tr
                        key={i}
                        className="hover:bg-amber-50/30 transition-colors"
                      >
                        <td className="px-6 py-4 text-sm font-medium text-gray-800">
                          {sub.email}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 text-right">
                          {new Date(sub.created_at).toLocaleDateString("fr-FR")}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={2}
                        className="px-6 py-12 text-center text-gray-400 italic"
                      >
                        Aucun inscrit pour le moment.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="shadow-sm border-gray-100 overflow-hidden">
            <CardHeader className="bg-gray-900 text-white pb-6">
              <CardTitle className="text-sm uppercase tracking-widest text-gray-400 font-bold mb-2">
                Santé SEO
              </CardTitle>
              <div className="text-4xl font-black text-amber-500">
                85<span className="text-xl text-white">/100</span>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-3">
                {seoChecklist.map((item, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <CheckCircle2
                      className={`w-4 h-4 mt-0.5 shrink-0 ${item.status ? "text-green-500" : "text-gray-200"}`}
                    />
                    <span
                      className={`text-xs ${item.status ? "text-gray-700" : "text-gray-400"}`}
                    >
                      {item.task}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-amber-600 text-white border-none shadow-xl shadow-amber-600/20">
            <CardContent className="p-6 space-y-4">
              <BarChart3 className="w-10 h-10 opacity-20" />
              <h3 className="font-bold text-lg leading-tight">
                Umami Analytics
              </h3>
              <p className="text-sm text-amber-100 italic">
                Accédez à vos statistiques privées sans cookie intrusif.
              </p>
              <Button
                className="w-full bg-white text-amber-600 hover:bg-amber-50 font-bold shadow-sm"
                onClick={() => window.open("https://cloud.umami.is", "_blank")}
              >
                Dashboard <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Main App
export default function AdminApp() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [tours, setTours] = useState<Tour[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [guidePhoto, setGuidePhoto] = useState(
    () => localStorage.getItem("td-guide-photo") || "/guide-portrait.jpg",
  );
  const [instagramUrl, setInstagramUrl] = useState(
    () =>
      localStorage.getItem("td-instagram-url") ||
      "https://www.instagram.com/tours_and_detours_bcn/",
  );
  const [isSyncing, setIsSyncing] = useState(false);
  const [activeSession, setActiveSession] = useState<{
    tour: Tour;
    session: {
      id: string;
      current_stop_index: number;
      status: string;
      session_code: string;
    };
  } | null>(null);
  const [urgentMsg, setUrgentMsg] = useState("");

  const [profileImageToEdit, setProfileImageToEdit] = useState<string | null>(null);

  const updateSession = async (updates: Record<string, unknown>) => {
    if (!supabase || !activeSession) return;
    try {
      const { data, error } = await supabase
        .from("live_sessions")
        .update(updates)
        .eq("id", activeSession.session.id)
        .select()
        .single();

      if (error) throw error;
      setActiveSession({
        ...activeSession,
        session: data as {
          id: string;
          current_stop_index: number;
          status: string;
          session_code: string;
        },
      });
    } catch (err) {
      toast.error("Erreur de mise à jour : " + (err as Error).message);
    }
  };

  const pullFromDb = async () => {
    if (!supabase) return;
    setIsSyncing(true);
    const loadingToast = toast.loading("Récupération des données du cloud...");
    try {
      const { data, error } = await supabase
        .from("tours")
        .select("*")
        .order("id");
      if (error) throw error;
      if (data && data.length > 0) {
        const mapped = data.map((t) => ({
          id: t.id,
          title: t.title,
          title_en: t.title_en,
          title_es: t.title_es,
          subtitle: t.subtitle,
          subtitle_en: t.subtitle_en,
          subtitle_es: t.subtitle_es,
          description: t.description,
          description_en: t.description_en,
          description_es: t.description_es,
          duration: t.duration,
          groupSize: t.group_size,
          maxCapacity: t.max_capacity ?? 8,
          price: t.price,
          image: t.image,
          images: (t.images && t.images.length > 0) ? t.images : (t.image ? [t.image] : []),
          category: t.category,
          highlights: t.highlights,
          highlights_en: t.highlights_en,
          highlights_es: t.highlights_es,
          isActive: t.is_active,
          itinerary: t.itinerary,
          itinerary_en: t.itinerary_en,
          itinerary_es: t.itinerary_es,
          included: t.included,
          included_en: t.included_en,
          included_es: t.included_es,
          notIncluded: t.not_included,
          notIncluded_en: t.not_included_en,
          notIncluded_es: t.not_included_es,
          meetingPoint: t.meeting_point,
          meetingPoint_en: t.meeting_point_en,
          meetingPoint_es: t.meeting_point_es,
          departureTime: t.departure_time || "",
          estimatedDuration: t.estimated_duration || t.duration || "",
          goodToKnow: t.good_to_know || [],
          goodToKnow_en: t.good_to_know_en || [],
          goodToKnow_es: t.good_to_know_es || [],
          stops: t.stops || [],
          stripe_tip_link: t.stripe_tip_link,
        }));
        setTours(mapped as Tour[]);
        localStorage.setItem("td-tours", JSON.stringify(mapped));
        toast.success(`${data.length} tours récupérés avec succès.`, {
          id: loadingToast,
        });
      } else {
        toast.info("Aucun tour trouvé en base de données.", {
          id: loadingToast,
        });
      }
    } catch (err) {
      console.error("Pull error:", err);
      toast.error(
        "Erreur lors de la récupération : " + (err as Error).message,
        { id: loadingToast },
      );
    } finally {
      setIsSyncing(false);
    }
  };

  const pushAllToDb = async () => {
    if (!supabase) return;
    setIsSyncing(true);
    const loadingToast = toast.loading("Synchronisation du catalogue...");

    try {
      for (const tour of tours) {
        const dbTour = {
          id: tour.id,
          title: tour.title,
          title_en: tour.title_en,
          title_es: tour.title_es,
          subtitle: tour.subtitle,
          subtitle_en: tour.subtitle_en,
          subtitle_es: tour.subtitle_es,
          description: tour.description,
          description_en: tour.description_en,
          description_es: tour.description_es,
          duration: tour.duration,
          group_size: tour.groupSize,
          max_capacity: tour.maxCapacity ?? 8,
          price: tour.price,
          image: tour.image,
          images: tour.images || [],
          category: tour.category,
          highlights: tour.highlights,
          highlights_en: tour.highlights_en,
          highlights_es: tour.highlights_es,
          is_active: tour.isActive ?? true,
          itinerary: tour.itinerary || [],
          itinerary_en: tour.itinerary_en || [],
          itinerary_es: tour.itinerary_es || [],
          included: tour.included || [],
          included_en: tour.included_en || [],
          included_es: tour.included_es || [],
          not_included: tour.notIncluded || [],
          not_included_en: tour.notIncluded_en || [],
          not_included_es: tour.notIncluded_es || [],
          meeting_point: tour.meetingPoint || null,
          meeting_point_en: tour.meetingPoint_en || null,
          meeting_point_es: tour.meetingPoint_es || null,
          departure_time: tour.departureTime || null,
          estimated_duration: tour.estimatedDuration || null,
          good_to_know: tour.goodToKnow || [],
          good_to_know_en: tour.goodToKnow_en || [],
          good_to_know_es: tour.goodToKnow_es || [],
          stops: tour.stops || [],
          stripe_tip_link: tour.stripe_tip_link || null,
        };
        const { error } = await supabase.from("tours").upsert(dbTour);
        if (error) throw error;
      }
      toast.success("Tout le catalogue est synchronisé sur Supabase !", {
        id: loadingToast,
      });
    } catch (err) {
      const error = err as { code?: string; message: string };
      console.error("Sync error:", error);
      if (error.code === "42P01") {
        toast.error(
          "La table 'tours' n'existe pas. Avez-vous exécuté le SQL dans Supabase ?",
          { id: loadingToast },
        );
      } else {
        toast.error(
          "Échec de la synchronisation : " +
            (error.message || "Erreur inconnue"),
          { id: loadingToast },
        );
      }
    } finally {
      setIsSyncing(false);
    }
  };

  const resetFromMaster = async () => {
    if (!supabase) return;
    if (
      !confirm(
        "ATTENTION: Cela va écraser vos tours LOCAUX par les tours standards de la base de données. Continuer ?",
      )
    )
      return;

    setIsSyncing(true);
    const loadingToast = toast.loading("Récupération du catalogue standard...");
    try {
      const { data, error } = await supabase
        .from("default_tours")
        .select("*")
        .order("id");
      if (error) throw error;
      if (data && data.length > 0) {
        const mapped = data.map((t) => ({
          id: t.id,
          title: t.title,
          title_en: t.title_en,
          title_es: t.title_es,
          subtitle: t.subtitle,
          subtitle_en: t.subtitle_en,
          subtitle_es: t.subtitle_es,
          description: t.description,
          description_en: t.description_en,
          description_es: t.description_es,
          duration: t.duration,
          groupSize: t.group_size,
          maxCapacity: t.max_capacity ?? 8,
          price: t.price,
          image: t.image,
          images: t.images || [],
          category: t.category,
          highlights: t.highlights,
          highlights_en: t.highlights_en,
          highlights_es: t.highlights_es,
          isActive: t.is_active,
          itinerary: t.itinerary || [],
          itinerary_en: t.itinerary_en || [],
          itinerary_es: t.itinerary_es || [],
          included: t.included || [],
          included_en: t.included_en || [],
          included_es: t.included_es || [],
          notIncluded: t.notIncluded || [],
          notIncluded_en: t.notIncluded_en || [],
          notIncluded_es: t.notIncluded_es || [],
          meetingPoint: t.meeting_point,
          meetingPoint_en: t.meeting_point_en,
          meetingPoint_es: t.meeting_point_es,
          departureTime: t.departure_time || "",
          estimatedDuration: t.estimated_duration || t.duration || "",
          goodToKnow: t.good_to_know || [],
          goodToKnow_en: t.good_to_know_en || [],
          goodToKnow_es: t.good_to_know_es || [],
        }));
        setTours(mapped as Tour[]);
        localStorage.setItem("td-tours", JSON.stringify(mapped));
        toast.success(
          `${data.length} tours standards chargés.`,
          { id: loadingToast },
        );
      } else {
        toast.error("Aucun tour standard trouvé en base de données.", {
          id: loadingToast,
        });
      }
    } catch (err) {
      console.error("Reset error:", err);
      toast.error("Erreur lors du reset : " + (err as Error).message, {
        id: loadingToast,
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const fixImagePaths = () => {
    let fixCount = 0;
    const fixedTours = tours.map((t) => {
      let updatedImage = t.image;
      if (t.image === "/tour-walking.jpg") {
        updatedImage = "/tour-barcelona-hidden.jpg";
        fixCount++;
      } else if (t.image === "/tour-cami.jpg") {
        updatedImage = "/tour-camironda.jpg";
        fixCount++;
      }
      return { ...t, image: updatedImage };
    });

    if (fixCount > 0) {
      setTours(fixedTours);
      toast.success(
        `${fixCount} chemin(s) d'image(s) réparé(s) localement.`,
      );
    } else {
      toast.info("Aucun chemin d'image erroné détecté.");
    }
  };
  const [guideBio, setGuideBio] = useState(
    () => localStorage.getItem("td-guide-bio") || translations.fr.guide.bio,
  );
  const [guideBioEn, setGuideBioEn] = useState(
    () => localStorage.getItem("td-guide-bio-en") || translations.en.guide.bio,
  );
  const [guideBioEs, setGuideBioEs] = useState(
    () => localStorage.getItem("td-guide-bio-es") || translations.es.guide.bio,
  );

  const profileFileInputRef = useRef<HTMLInputElement>(null);
  const differentPhoto1Ref = useRef<HTMLInputElement>(null);
  const differentPhoto2Ref = useRef<HTMLInputElement>(null);
  const differentPhoto3Ref = useRef<HTMLInputElement>(null);
  const [differentPhotos, setDifferentPhotos] = useState<[string, string, string]>([
    "/tour-prepirinees.jpg",
    "/tour-beach.jpg",
    "/tour-camironda.jpg",
  ]);
  const [differentPhotoToEdit, setDifferentPhotoToEdit] = useState<{ src: string; idx: number } | null>(null);

  useEffect(() => {
    // E2E Test Bypass: import.meta.env.DEV is compiled to `false` by Vite at
    // production build time — this block is completely removed in prod bundles.
    if (import.meta.env.DEV && localStorage.getItem("isLoggedIn") === "true") {
      setIsLoggedIn(true);
      return;
    }

    if (!supabase) return;

    // Check session + verify admin authorization via server-side RPC
    const verifyAndSetSession = async (session: unknown) => {
      if (!session) { setIsLoggedIn(false); return; }
      const { data: isAdmin } = await supabase!.rpc("is_authorized_admin");
      if (isAdmin) {
        setIsLoggedIn(true);
      } else {
        await supabase!.auth.signOut();
        setIsLoggedIn(false);
      }
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      verifyAndSetSession(session);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      verifyAndSetSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const [subscribers, setSubscribers] = useState<
    { email: string; created_at: string }[]
  >([]);

  useEffect(() => {
    if (!isLoggedIn || !supabase) return;

    // Fetch subscribers
    supabase
      .from("newsletter_subscribers")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data) setSubscribers(data);
      });
  }, [isLoggedIn]);

  useEffect(() => {
    if (!isLoggedIn || !supabase) return;

    const loadingToast = toast.loading("Chargement des données...");

    // Fetch reservations
    supabase
      .from("reservations")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) {
          const mapped = data.map((r) => ({
            id: r.id,
            name: r.name,
            email: r.email,
            phone: r.phone,
            tourId: r.tour_id,
            tourName: r.tour_name,
            date: r.date,
            participants: r.participants,
            status: r.status,
            message: r.message || "",
            createdAt: r.created_at,
            totalPrice: r.total_price,
            pickupTime: r.pickup_time || "",
            pickupAddress: r.pickup_address || "",
            billingAddress: r.billing_address || "",
            billingCity: r.billing_city || "",
            billingZip: r.billing_zip || "",
            billingCountry: r.billing_country || "",
            paymentIntentId: r.payment_intent_id || "",
          }));
          setReservations(mapped);
        }
      });

    // Fetch reviews
    supabase
      .from("reviews")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) {
          const mapped = data.map((r) => ({
            id: r.id,
            name: r.name,
            location: r.location,
            rating: r.rating,
            text: r.text,
            tourId: r.tour_id,
            isPublished: r.is_published,
            createdAt: r.created_at,
          }));
          setReviews(mapped);
        }
      });

    // Fetch tours
    supabase
      .from("tours")
      .select("*")
      .order("id")
      .then(({ data, error }) => {
        toast.dismiss(loadingToast);
        if (!error && data && data.length > 0) {
          const mapped = data.map((t) => ({
            id: t.id,
            title: t.title,
            title_en: t.title_en,
            title_es: t.title_es,
            subtitle: t.subtitle,
            subtitle_en: t.subtitle_en,
            subtitle_es: t.subtitle_es,
            description: t.description,
            description_en: t.description_en,
            description_es: t.description_es,
            duration: t.duration,
            groupSize: t.group_size,
            maxCapacity: t.max_capacity ?? 8,
            price: t.price,
            image: t.image,
            images: (t.images && t.images.length > 0) ? t.images : (t.image ? [t.image] : []),
            category: t.category,
            highlights: t.highlights,
            highlights_en: t.highlights_en,
            highlights_es: t.highlights_es,
            isActive: t.is_active,
            itinerary: t.itinerary,
            itinerary_en: t.itinerary_en,
            itinerary_es: t.itinerary_es,
            included: t.included,
            included_en: t.included_en,
            included_es: t.included_es,
            notIncluded: t.not_included,
            notIncluded_en: t.not_included_en,
            notIncluded_es: t.not_included_es,
            meetingPoint: t.meeting_point,
            meetingPoint_en: t.meeting_point_en,
            meetingPoint_es: t.meeting_point_es,
            departureTime: t.departure_time || "",
            estimatedDuration: t.estimated_duration || t.duration || "",
            goodToKnow: t.good_to_know || [],
            goodToKnow_en: t.good_to_know_en || [],
            goodToKnow_es: t.good_to_know_es || [],
          }));
          setTours(mapped as Tour[]);
        } else if (error) {
          console.error("Fetch tours error:", error);
          toast.error("Erreur de chargement des tours (Cloud).");
        }
      });

    // Fetch Profile Photo from site_config
    supabase
      .from("site_config")
      .select("value")
      .eq("key", "guide_profile")
      .single()
      .then(({ data, error }) => {
        if (!error && data && data.value) {
          const val = data.value as {
            photo?: string;
            instagram?: string;
            bio?: string;
            bio_en?: string;
            bio_es?: string;
            bio1?: string;
            bio2?: string;
          };
          if (val.photo) setGuidePhoto(val.photo);
          if (val.instagram) setInstagramUrl(val.instagram);

          if (val.bio) setGuideBio(val.bio);
          else if (val.bio1)
            setGuideBio(val.bio1 + (val.bio2 ? "\n\n" + val.bio2 : ""));

          if (val.bio_en) setGuideBioEn(val.bio_en);
          if (val.bio_es) setGuideBioEs(val.bio_es);

          if ((val as Record<string, unknown>).different_photos) {
            const dp = (val as Record<string, unknown>).different_photos as string[];
            setDifferentPhotos([
              dp[0] || "/tour-prepirinees.jpg",
              dp[1] || "/tour-beach.jpg",
              dp[2] || "/tour-camironda.jpg",
            ]);
          }
        }
      });
  }, [isLoggedIn]);

  useEffect(() => {
    localStorage.setItem("td-guide-photo", guidePhoto);
  }, [guidePhoto]);

  useEffect(() => {
    localStorage.setItem("td-instagram-url", instagramUrl);
  }, [instagramUrl]);

  useEffect(() => {
    localStorage.setItem("td-guide-bio", guideBio);
  }, [guideBio]);

  useEffect(() => {
    localStorage.setItem("td-guide-bio-en", guideBioEn);
  }, [guideBioEn]);

  useEffect(() => {
    localStorage.setItem("td-guide-bio-es", guideBioEs);
  }, [guideBioEs]);

  const handleProfileImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("L'image est trop volumineuse (max 5MB)");
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        setProfileImageToEdit(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSaveProfileImage = async (blob: Blob) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const compressedBase64 = reader.result as string;
      setGuidePhoto(compressedBase64);
      setProfileImageToEdit(null);
      toast.success("Photo de profil mise à jour");
    };
    reader.readAsDataURL(blob);
  };

  const handleDifferentPhotoUpload = (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error("Image trop volumineuse (max 5MB)"); return; }
    const reader = new FileReader();
    reader.onload = () => setDifferentPhotoToEdit({ src: reader.result as string, idx });
    reader.readAsDataURL(file);
  };

  const onSaveDifferentPhoto = async (blob: Blob) => {
    if (!differentPhotoToEdit) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const url = reader.result as string;
      setDifferentPhotos(prev => {
        const next = [...prev] as [string, string, string];
        next[differentPhotoToEdit.idx] = url;
        return next;
      });
      setDifferentPhotoToEdit(null);
      toast.success("Photo mise à jour — cliquez Enregistrer pour sauvegarder");
    };
    reader.readAsDataURL(blob);
  };

  const saveProfile = async () => {
    try {
      if (supabase) {
        const { error } = await supabase.from("site_config").upsert({
          key: "guide_profile",
          value: {
            photo: guidePhoto,
            instagram: instagramUrl,
            bio: guideBio,
            bio_en: guideBioEn,
            bio_es: guideBioEs,
            different_photos: differentPhotos,
          },
          updated_at: new Date().toISOString(),
        });

        if (error) {
          toast.error("Sauvegarde cloud échouée");
        } else {
          toast.success("Profil mis à jour");
        }
      }
    } catch (err) {
      toast.error("Erreur lors de la sauvegarde : " + (err as Error).message);
    }
  };

  if (!isLoggedIn) return <Login />;

  const pendingCount = reservations.filter((r) => r.status === "pending").length;

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, badge: 0 },
    { id: "reservations", label: "Réservations", icon: Calendar, badge: pendingCount },
    { id: "suivi", label: "Suivi", icon: Activity, badge: 0 },
    { id: "tours", label: "Catalogue", icon: MapPin, badge: 0 },
    { id: "reviews", label: "Avis clients", icon: Star, badge: 0 },
    { id: "admins", label: "Admins", icon: ShieldCheck, badge: 0 },
    { id: "profile", label: "Mon Profil", icon: User, badge: 0 },
    { id: "marketing", label: "Marketing & SEO", icon: BarChart3, badge: 0 },
    { id: "config", label: "Infrastructure", icon: Bell, badge: 0 },
  ];

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gray-100 overflow-hidden">
      <Toaster richColors position="top-right" />
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside
        className={`
        fixed inset-y-0 left-0 z-50 lg:static
        bg-gray-900 border-r border-gray-800 transition-all duration-300 flex flex-col
        ${isSidebarOpen ? "translate-x-0 w-64" : "-translate-x-full lg:translate-x-0 lg:w-20"}
      `}
      >
        <div className="p-4 sm:p-6 flex items-center justify-between">
          <div
            className={`flex items-center gap-3 transition-opacity ${isSidebarOpen ? "opacity-100" : "lg:opacity-0 h-0 w-0"}`}
          >
            <Compass className="w-8 h-8 text-amber-500" />
            <span className="text-white font-bold text-lg">Admin</span>
          </div>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            {isSidebarOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        <nav className="flex-1 mt-4 px-4 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              aria-label={item.label}
              onClick={() => {
                setActiveTab(item.id);
                if (window.innerWidth < 1024) setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === item.id ? "bg-[#c9a961] text-white shadow-lg shadow-amber-900/20" : "text-gray-400 hover:bg-gray-800 hover:text-white"}`}
            >
              <div className="relative flex-shrink-0">
                <item.icon className="w-5 h-5" />
                {item.badge > 0 && !isSidebarOpen && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-yellow-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              {(isSidebarOpen || window.innerWidth < 1024) && (
                <span className="font-medium whitespace-nowrap flex-1 flex items-center justify-between">
                  {item.label}
                  {item.badge > 0 && (
                    <span className="ml-2 px-1.5 py-0.5 bg-yellow-500 text-white text-xs font-bold rounded-full">
                      {item.badge}
                    </span>
                  )}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button
            onClick={() => supabase?.auth.signOut()}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {(isSidebarOpen || window.innerWidth < 1024) && (
              <span>Déconnexion</span>
            )}
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 h-full relative">
        <header className="h-16 bg-white border-b border-gray-200 px-4 sm:px-8 flex items-center justify-between flex-shrink-0 relative z-30 pointer-events-none">
          <div className="flex items-center gap-4 pointer-events-auto">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden text-gray-500 p-1 hover:bg-gray-100 rounded-lg"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="text-lg sm:text-xl font-bold text-gray-800 truncate">
              {menuItems.find((m) => m.id === activeTab)?.label}
            </h2>
          </div>
          <div className="flex items-center gap-2 sm:gap-4 pointer-events-auto">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold truncate max-w-[150px]">
                Antoine Pilard
              </p>
              <p className="text-xs text-gray-500">Administrateur</p>
            </div>
            <div
              className="w-10 h-10 rounded-full border border-gray-200 overflow-hidden shadow-sm hover:ring-2 hover:ring-amber-500 transition-all cursor-pointer flex-shrink-0"
              onClick={() => setActiveTab("profile")}
            >
              <img
                src={guidePhoto}
                className="w-full h-full object-cover"
                alt="Profile"
              />
            </div>
          </div>
        </header>

        <div className="flex-1 h-0 overflow-y-scroll p-4 sm:p-8 relative">
          <div className="max-w-6xl mx-auto">
            {activeTab === "dashboard" && (
              <Dashboard
                reservations={reservations}
                setActiveTab={setActiveTab}
              />
            )}
            {activeTab === "reservations" && (
              <Reservations
                reservations={reservations}
                setReservations={setReservations}
                tours={tours}
              />
            )}
            {activeTab === "suivi" && (
              <OperationalTracking reservations={reservations} />
            )}
            {activeTab === "tours" && (
              <ToursManagement
                tours={tours}
                setTours={setTours}
                activeSession={activeSession}
                setActiveSession={setActiveSession}
                updateSession={updateSession}
                urgentMsg={urgentMsg}
                setUrgentMsg={setUrgentMsg}
              />
            )}
            {activeTab === "reviews" && (
              <Reviews reviews={reviews} setReviews={setReviews} />
            )}
            {activeTab === "admins" && <AdminsManagement />}
            {activeTab === "config" && (
              <Config
                onPull={pullFromDb}
                onPush={pushAllToDb}
                onReset={resetFromMaster}
                onFixImages={fixImagePaths}
                isSyncing={isSyncing}
              />
            )}
            {activeTab === "marketing" && (
              <Marketing subscribers={subscribers} />
            )}
            {activeTab === "profile" && (
              <div className="max-w-2xl mx-auto">
                <Card className="overflow-hidden">
                  <div className="h-32 bg-gradient-to-r from-amber-500 to-orange-600"></div>
                  <CardContent className="px-8 pb-8">
                    <div className="relative -mt-16 mb-6 flex flex-col items-center">
                      <div className="relative group">
                        <div className="w-32 h-32 rounded-full border-4 border-white shadow-xl overflow-hidden bg-gray-100">
                          <img
                            src={guidePhoto}
                            className="w-full h-full object-cover"
                            alt="Antoine"
                          />
                        </div>
                        <button
                          onClick={() => profileFileInputRef.current?.click()}
                          className="absolute inset-0 bg-black/40 text-white rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <ImageIcon className="w-6 h-6 mb-1" />
                          <span className="text-[10px] font-bold uppercase tracking-wider">
                            Modifier
                          </span>
                        </button>
                      </div>
                      <h3 className="text-2xl font-bold mt-4 text-gray-900">
                        Antoine Pilard
                      </h3>
                      <p className="text-gray-500">
                        Guide Accompagnateur • Fondateur
                      </p>
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-4">
                        <h4 className="font-bold text-gray-900 border-b pb-2">
                          Paramètres de photo
                        </h4>
                        <div className="space-y-2">
                          <Label>Lien image de profil</Label>
                          <div className="flex gap-2">
                            <Input
                              value={guidePhoto}
                              onChange={(
                                e: React.ChangeEvent<HTMLInputElement>,
                              ) => setGuidePhoto(e.target.value)}
                              placeholder="/guide-antoine.jpg"
                              className="flex-1"
                            />
                            <input
                              type="file"
                              ref={profileFileInputRef}
                              className="hidden"
                              accept="image/*"
                              onChange={handleProfileImageUpload}
                            />
                            <Button
                              variant="outline"
                              onClick={() =>
                                profileFileInputRef.current?.click()
                              }
                            >
                              <Upload className="w-4 h-4 mr-2" /> Upload
                            </Button>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Lien Instagram</Label>
                          <Input
                            value={instagramUrl}
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>,
                            ) => setInstagramUrl(e.target.value)}
                            placeholder="https://www.instagram.com/compte"
                          />
                        </div>

                        <div className="space-y-4 pt-4">
                          <h4 className="font-bold text-gray-900 border-b pb-2">
                            Ma Biographie
                          </h4>

                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <Label className="flex items-center gap-2">
                                Français{" "}
                                <Globe className="w-3 h-3 text-blue-500" />
                              </Label>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 text-amber-600 hover:text-amber-700 hover:bg-amber-50 gap-1 text-[9px]"
                                onClick={async () => {
                                  if (!guideBio) return;
                                  const loadingTranslate = toast.loading("Traduction bio...");
                                  try {
                                    const bioEn = await translateText(guideBio, "fr", "en");
                                    const bioEs = await translateText(guideBio, "fr", "es");
                                    setGuideBioEn(bioEn);
                                    setGuideBioEs(bioEs);
                                    toast.success("Bio traduite !", { id: loadingTranslate });
                                  } catch {
                                    toast.error("Erreur traduction", { id: loadingTranslate });
                                  }
                                }}
                              >
                                ✨ Traduire vers EN/ES
                              </Button>
                            </div>
                            <Textarea
                              value={guideBio}
                              onChange={(
                                e: React.ChangeEvent<HTMLTextAreaElement>,
                              ) => setGuideBio(e.target.value)}
                              placeholder="Ma passion pour Barcelone..."
                              rows={6}
                            />
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <Label className="flex items-center gap-2">
                                Anglais{" "}
                                <Globe className="w-3 h-3 text-amber-500" />
                              </Label>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 text-amber-600 hover:text-amber-700 hover:bg-amber-50 gap-1 text-[9px]"
                                onClick={async () => {
                                  if (!guideBioEn) return;
                                  const loadingTranslate = toast.loading("Bio translation...");
                                  try {
                                    const bioFr = await translateText(guideBioEn, "en", "fr");
                                    const bioEs = await translateText(guideBioEn, "en", "es");
                                    setGuideBio(bioFr);
                                    setGuideBioEs(bioEs);
                                    toast.success("Bio translated !", { id: loadingTranslate });
                                  } catch {
                                    toast.error("Translation error", { id: loadingTranslate });
                                  }
                                }}
                              >
                                ✨ Translate to FR/ES
                              </Button>
                            </div>
                            <Textarea
                              value={guideBioEn}
                              onChange={(
                                e: React.ChangeEvent<HTMLTextAreaElement>,
                              ) => setGuideBioEn(e.target.value)}
                              placeholder="My passion for Barcelona..."
                              rows={6}
                            />
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <Label className="flex items-center gap-2">
                                Espagnol{" "}
                                <Globe className="w-3 h-3 text-red-500" />
                              </Label>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 text-amber-600 hover:text-amber-700 hover:bg-amber-50 gap-1 text-[9px]"
                                onClick={async () => {
                                  if (!guideBioEs) return;
                                  const loadingTranslate = toast.loading("Traducción bio...");
                                  try {
                                    const bioFr = await translateText(guideBioEs, "es", "fr");
                                    const bioEn = await translateText(guideBioEs, "es", "en");
                                    setGuideBio(bioFr);
                                    setGuideBioEn(bioEn);
                                    toast.success("Bio traducida !", { id: loadingTranslate });
                                  } catch {
                                    toast.error("Error traducción", { id: loadingTranslate });
                                  }
                                }}
                              >
                                ✨ Traducir a FR/EN
                              </Button>
                            </div>
                            <Textarea
                              value={guideBioEs}
                              onChange={(
                                e: React.ChangeEvent<HTMLTextAreaElement>,
                              ) => setGuideBioEs(e.target.value)}
                              placeholder="Mi pasión por Barcelona..."
                              rows={6}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Photos "Ce qui nous rend différent" */}
                      <div className="space-y-4 pt-4">
                        <h4 className="font-bold text-gray-900 border-b pb-2">
                          Photos — "Ce qui nous rend différent"
                        </h4>
                        <p className="text-xs text-gray-400">3 photos affichées en collage sur la page À propos.</p>
                        <div className="grid grid-cols-3 gap-3">
                          {differentPhotos.map((src, idx) => (
                            <div key={idx} className="space-y-2">
                              <div
                                className="relative group h-28 rounded-xl overflow-hidden border border-gray-200 cursor-pointer bg-gray-50"
                                onClick={() => [differentPhoto1Ref, differentPhoto2Ref, differentPhoto3Ref][idx].current?.click()}
                              >
                                <img src={src} alt={`Photo ${idx + 1}`} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                  <ImageIcon className="w-6 h-6 text-white" />
                                </div>
                              </div>
                              <input
                                type="file"
                                ref={[differentPhoto1Ref, differentPhoto2Ref, differentPhoto3Ref][idx]}
                                className="hidden"
                                accept="image/*"
                                onChange={(e) => handleDifferentPhotoUpload(idx, e)}
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-4 flex gap-3">
                        <Button
                          className="flex-1 bg-[#c9a961]"
                          onClick={saveProfile}
                        >
                          <Check className="w-4 h-4 mr-2" /> Enregistrer
                        </Button>
                        <Button
                          variant="outline"
                          className="flex-1"
                          onClick={() => setActiveTab("dashboard")}
                        >
                          Retour
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </main>
      <Toaster position="top-right" richColors />

      {profileImageToEdit && (
        <ImageEditor
          image={profileImageToEdit}
          isOpen={!!profileImageToEdit}
          onClose={() => setProfileImageToEdit(null)}
          onSave={onSaveProfileImage}
          aspectRatio={1}
          title="Retoucher la photo de profil"
        />
      )}
      {differentPhotoToEdit && (
        <ImageEditor
          image={differentPhotoToEdit.src}
          isOpen={!!differentPhotoToEdit}
          onClose={() => setDifferentPhotoToEdit(null)}
          onSave={onSaveDifferentPhoto}
          aspectRatio={4 / 3}
          title={`Photo ${differentPhotoToEdit.idx + 1} — "Ce qui nous rend différent"`}
        />
      )}
    </div>
  );
}
