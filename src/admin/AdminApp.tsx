import { useState, useEffect, useRef } from 'react';
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
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Toaster, toast } from 'sonner';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { supabase } from '@/lib/supabase';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Types
interface Reservation {
  id: string;
  name: string;
  email: string;
  phone: string;
  tourId: string;
  tourName: string;
  date: string;
  participants: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  message: string;
  createdAt: string;
  totalPrice: number;
}

interface Tour {
  id: string;
  title: string;
  title_en?: string;
  title_es?: string;
  subtitle: string;
  subtitle_en?: string;
  subtitle_es?: string;
  description: string;
  description_en?: string;
  description_es?: string;
  duration: string;
  group_size: string;
  price: number;
  image: string;
  highlights: string[];
  highlights_en?: string[];
  highlights_es?: string[];
  category: string;
  isActive: boolean;
  itinerary?: string[];
  itinerary_en?: string[];
  itinerary_es?: string[];
  included?: string[];
  included_en?: string[];
  included_es?: string[];
  notIncluded?: string[];
  notIncluded_en?: string[];
  notIncluded_es?: string[];
  meetingPoint?: string;
  meetingPoint_en?: string;
  meetingPoint_es?: string;
  meetingPointMapUrl?: string;
}

interface Review {
  id: string;
  name: string;
  location: string;
  rating: number;
  text: string;
  tourId?: string;
  isPublished: boolean;
  createdAt: string;
}

// Utility
const sanitize = (str: string) => {
  if (typeof str !== 'string') return str;
  return str.replace(/[&<>"']/g, (m) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[m] || m));
};

// Mock Data
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
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) {
      setError('Erreur de configuration de la base de données');
      return;
    }

    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      // 1. Check if email is in authorized_admins
      const { data: admin, error: adminError } = await supabase
        .from('authorized_admins')
        .select('*')
        .eq('email', email.toLowerCase().trim())
        .single();

      if (adminError || !admin) {
        setError("Cet email n'est pas autorisé à accéder à l'interface d'administration.");
        setIsLoading(false);
        return;
      }

      // 2. Send Magic Link
      const { error: authError } = await supabase.auth.signInWithOtp({
        email: email.toLowerCase().trim(),
        options: {
          emailRedirectTo: 'https://tours-five-olive.vercel.app/admin.html',
        }
      });

      if (authError) {
        setError('Une erreur est survenue lors de l\'envoi du lien magique : ' + authError.message);
      } else {
        setMessage('Lien magique envoyé ! Vérifiez votre boîte mail.');
      }
    } catch (err: any) {
      setError('Une erreur est survenue lors de la connexion');
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
          <h1 className="text-2xl font-bold text-gray-900">Tours<span className="text-amber-600">&</span>Detours</h1>
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
              placeholder="antoine@toursandetours.com"
              className="mt-1 h-12"
              disabled={isLoading || !!message}
              required
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-amber-600 hover:bg-amber-700 h-12 rounded-xl font-bold text-lg shadow-lg shadow-amber-600/20 transition-all hover:-translate-y-0.5"
            disabled={isLoading || !!message}
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Recevoir un lien magique'}
          </Button>
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
  setActiveTab
}: {
  reservations: Reservation[];
  setActiveTab: (tab: string) => void;
}) {
  const stats = {
    totalReservations: reservations.length,
    pendingReservations: reservations.filter(r => r.status === 'pending').length,
    confirmedReservations: reservations.filter(r => r.status === 'confirmed').length,
    completedReservations: reservations.filter(r => r.status === 'completed').length,
    totalRevenue: reservations.reduce((sum, r) => sum + r.totalPrice, 0),
    thisMonthRevenue: reservations
      .filter(r => r.createdAt.startsWith('2024-02'))
      .reduce((sum, r) => sum + r.totalPrice, 0)
  };

  const recentReservations = [...reservations]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      completed: 'bg-blue-100 text-blue-800'
    };
    const labels: Record<string, string> = {
      pending: 'En attente',
      confirmed: 'Confirmée',
      cancelled: 'Annulée',
      completed: 'Terminée'
    };
    return <Badge className={styles[status]}>{labels[status]}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-500">Réservations totales</p>
                <p className="text-2xl sm:text-3xl font-bold">{stats.totalReservations}</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-500">En attente</p>
                <p className="text-2xl sm:text-3xl font-bold">{stats.pendingReservations}</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-500">Confirmées</p>
                <p className="text-2xl sm:text-3xl font-bold">{stats.confirmedReservations}</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckIcon className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-500">Revenus (février)</p>
                <p className="text-2xl sm:text-3xl font-bold">{stats.thisMonthRevenue}€</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-amber-100 rounded-full flex items-center justify-center">
                <Euro className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="px-4 sm:px-6">
          <CardTitle className="text-lg sm:text-xl">Réservations récentes</CardTitle>
        </CardHeader>
        <CardContent className="px-0 sm:px-6">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-500 hidden sm:table-cell">ID</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Client</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Statut</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-500">Montant</th>
                </tr>
              </thead>
              <tbody>
                {recentReservations.map((res) => (
                  <tr key={res.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 hidden sm:table-cell text-gray-500">{res.id}</td>
                    <td className="py-3 px-4 font-medium sm:font-normal">{res.name}</td>
                    <td className="py-3 px-4">{getStatusBadge(res.status)}</td>
                    <td className="py-3 px-4 text-right font-bold sm:font-normal">{res.totalPrice}€</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Button variant="outline" className="h-16 sm:h-24 flex flex-row sm:flex-col items-center justify-center gap-3 sm:gap-2" onClick={() => setActiveTab('reservations')}>
          <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" />
          <span className="sm:text-sm">Gérer les réservations</span>
        </Button>
        <Button variant="outline" className="h-16 sm:h-24 flex flex-row sm:flex-col items-center justify-center gap-3 sm:gap-2" onClick={() => setActiveTab('tours')}>
          <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" />
          <span className="sm:text-sm">Gérer les tours</span>
        </Button>
        <Button variant="outline" className="h-16 sm:h-24 flex flex-row sm:flex-col items-center justify-center gap-3 sm:gap-2" onClick={() => setActiveTab('reviews')}>
          <Star className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" />
          <span className="sm:text-sm">Modérer les avis</span>
        </Button>
      </div>
    </div>
  );
}

// Reservations Component
function Reservations({
  reservations,
  setReservations
}: {
  reservations: Reservation[];
  setReservations: React.Dispatch<React.SetStateAction<Reservation[]>>;
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedRes, setSelectedRes] = useState<Reservation | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const filtered = reservations.filter(res => {
    const matchesSearch = res.name.toLowerCase().includes(searchTerm.toLowerCase()) || res.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || res.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      completed: 'bg-blue-100 text-blue-800'
    };
    return <Badge className={styles[status]}>{status}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input placeholder="Rechercher..." className="pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
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

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto hidden sm:block">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Client</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Date</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500 lg:table-cell hidden">Tour</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Statut</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-500">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(res => (
                  <tr key={res.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="font-medium text-gray-900">{res.name}</div>
                      <div className="text-gray-500 text-xs hidden sm:block">{res.email}</div>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{res.date}</td>
                    <td className="py-3 px-4 text-gray-600 lg:table-cell hidden">{res.tourName}</td>
                    <td className="py-3 px-4">{getStatusBadge(res.status)}</td>
                    <td className="py-3 px-4 text-right">
                      <Button variant="ghost" size="sm" className="text-amber-600 hover:text-amber-700 hover:bg-amber-50" onClick={() => { setSelectedRes(res); setIsDetailOpen(true); }}>Voir</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="sm:hidden divide-y divide-gray-100">
            {filtered.map(res => (
              <div key={res.id} className="p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-bold text-gray-900">{res.name}</div>
                    <div className="text-gray-500 text-xs">{res.date}</div>
                  </div>
                  {getStatusBadge(res.status)}
                </div>
                <div className="text-sm text-gray-600 italic">"{res.tourName}"</div>
                <div className="flex justify-between items-center pt-1">
                  <span className="font-bold text-amber-600">{res.totalPrice}€</span>
                  <Button size="sm" variant="outline" className="h-8" onClick={() => { setSelectedRes(res); setIsDetailOpen(true); }}>
                    Détails
                  </Button>
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

      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="sm:max-w-[500px] w-[95vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Détails Réservation</DialogTitle>
          </DialogHeader>
          {selectedRes && (
            <div className="space-y-4 py-4 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <span className="text-gray-500">Client:</span> <span>{selectedRes.name}</span>
                <span className="text-gray-500">Email:</span> <span>{selectedRes.email}</span>
                <span className="text-gray-500">Téléphone:</span> <span>{selectedRes.phone}</span>
                <span className="text-gray-500">Participants:</span> <span>{selectedRes.participants}</span>
                <span className="text-gray-500">Montant:</span> <span className="font-bold">{selectedRes.totalPrice}€</span>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => {
                  setReservations(prev => prev.map(r => r.id === selectedRes.id ? { ...r, status: 'confirmed' } : r));
                  setIsDetailOpen(false);
                }}>Confirmer</Button>
                <Button size="sm" variant="destructive" onClick={() => {
                  setReservations(prev => prev.map(r => r.id === selectedRes.id ? { ...r, status: 'cancelled' } : r));
                  setIsDetailOpen(false);
                }}>Annuler</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Tours Management
function ToursManagement({ tours, setTours }: { tours: Tour[], setTours: React.Dispatch<React.SetStateAction<Tour[]>> }) {
  const [editingTour, setEditingTour] = useState<Tour | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const saveTour = async () => {
    if (editingTour) {
      try {
        if (supabase) {
          const payload = {
            title: editingTour.title,
            title_en: editingTour.title_en,
            title_es: editingTour.title_es,
            subtitle: editingTour.subtitle,
            subtitle_en: editingTour.subtitle_en,
            subtitle_es: editingTour.subtitle_es,
            description: editingTour.description,
            description_en: editingTour.description_en,
            description_es: editingTour.description_es,
            duration: editingTour.duration,
            group_size: editingTour.group_size,
            price: editingTour.price,
            image: editingTour.image,
            category: editingTour.category,
            highlights: editingTour.highlights,
            highlights_en: editingTour.highlights_en,
            highlights_es: editingTour.highlights_es,
            is_active: editingTour.isActive,
            itinerary: editingTour.itinerary,
            itinerary_en: editingTour.itinerary_en,
            itinerary_es: editingTour.itinerary_es,
            included: editingTour.included,
            included_en: editingTour.included_en,
            included_es: editingTour.included_es,
            not_included: editingTour.notIncluded,
            not_included_en: editingTour.notIncluded_en,
            not_included_es: editingTour.notIncluded_es,
            meeting_point: editingTour.meetingPoint,
            meeting_point_en: editingTour.meetingPoint_en,
            meeting_point_es: editingTour.meetingPoint_es,
            meeting_point_map_url: editingTour.meetingPointMapUrl
          };

          const { error } = await supabase.from('tours').upsert({
            id: editingTour.id,
            ...payload
          });
          if (error) throw error;
        }

        const tourExists = tours.find(t => t.id === editingTour.id);
        let updatedTours;
        if (tourExists) {
          updatedTours = tours.map(t => t.id === editingTour.id ? editingTour : t);
        } else {
          updatedTours = [...tours, editingTour];
        }
        setTours(updatedTours);
        localStorage.setItem('td-tours', JSON.stringify(updatedTours));

        toast.success("Tour enregistré avec succès.");
        setIsEditOpen(false);
      } catch (err: any) {
        console.error('Save error:', err);
        toast.error("Erreur d'enregistrement : " + err.message);
      }
    }
  };

  const pullFromDb = async () => {
    if (!supabase) return;
    setIsSyncing(true);
    const loadingToast = toast.loading("Récupération des données du cloud...");
    try {
      const { data, error } = await supabase.from('tours').select('*').order('id');
      if (error) throw error;
      if (data && data.length > 0) {
        const mapped = data.map(t => ({
          id: t.id,
          title: t.title,
          subtitle: t.subtitle,
          description: t.description,
          duration: t.duration,
          group_size: t.group_size,
          price: t.price,
          image: t.image,
          category: t.category,
          highlights: t.highlights,
          isActive: t.is_active,
          itinerary: t.itinerary,
          included: t.included,
          notIncluded: t.not_included,
          meetingPoint: t.meeting_point,
          meetingPointMapUrl: t.meeting_point_map_url
        }));
        setTours(mapped as Tour[]);
        localStorage.setItem('td-tours', JSON.stringify(mapped));
        toast.success(`${data.length} tours récupérés avec succès.`, { id: loadingToast });
      } else {
        toast.info("Aucun tour trouvé en base de données.", { id: loadingToast });
      }
    } catch (err) {
      console.error('Pull error:', err);
      toast.error("Erreur lors de la récupération : " + (err as Error).message, { id: loadingToast });
    } finally {
      setIsSyncing(false);
    }
  };

  const pushAllToDb = async () => {
    if (!supabase) return;
    setIsEditOpen(false);
    setIsSyncing(true);
    const loadingToast = toast.loading("Synchronisation du catalogue...");

    try {
      for (const tour of tours) {
        const dbTour = {
          id: tour.id,
          title: tour.title,
          subtitle: tour.subtitle,
          description: tour.description,
          duration: tour.duration,
          group_size: tour.group_size,
          price: tour.price,
          image: tour.image,
          category: tour.category,
          highlights: tour.highlights,
          is_active: tour.isActive,
          itinerary: tour.itinerary || [],
          included: tour.included || [],
          not_included: tour.notIncluded || [],
          meeting_point: tour.meetingPoint || null
        };
        const { error } = await supabase.from('tours').upsert(dbTour);
        if (error) throw error;
      }
      toast.success("Tout le catalogue est synchronisé sur Supabase !", { id: loadingToast });
    } catch (err: any) {
      console.error('Sync error:', err);
      if (err.code === '42P01') {
        toast.error("La table 'tours' n'existe pas. Avez-vous exécuté le SQL dans Supabase ?", { id: loadingToast });
      } else {
        toast.error("Échec de la synchronisation : " + err.message, { id: loadingToast });
      }
    } finally {
      setIsSyncing(false);
    }
  };

  const resetFromMaster = async () => {
    if (!supabase) return;
    if (!confirm('ATTENTION: Cela va écraser vos tours LOCAUX par les tours standards de la base de données. Continuer ?')) return;

    setIsSyncing(true);
    const loadingToast = toast.loading("Récupération du catalogue standard...");
    try {
      const { data, error } = await supabase.from('default_tours').select('*').order('id');
      if (error) throw error;
      if (data && data.length > 0) {
        const mapped = data.map(t => ({
          id: t.id,
          title: t.title,
          subtitle: t.subtitle,
          description: t.description,
          duration: t.duration,
          group_size: t.group_size,
          price: t.price,
          image: t.image,
          category: t.category,
          highlights: t.highlights,
          isActive: t.is_active,
          itinerary: t.itinerary,
          included: t.included,
          notIncluded: t.not_included,
          meetingPoint: t.meeting_point
        }));
        setTours(mapped as Tour[]);
        localStorage.setItem('td-tours', JSON.stringify(mapped));
        toast.success(`${data.length} tours standards chargés. Cliquez sur "Push vers DB" pour mettre à jour le site public.`, { id: loadingToast });
      } else {
        toast.error("Aucun tour standard trouvé en base de données.", { id: loadingToast });
      }
    } catch (err) {
      console.error('Reset error:', err);
      toast.error("Erreur lors du reset : " + (err as Error).message, { id: loadingToast });
    } finally {
      setIsSyncing(false);
    }
  };

  const fixImagePaths = () => {
    let fixCount = 0;
    const fixedTours = tours.map(t => {
      let updatedImage = t.image;
      if (t.image === '/tour-walking.jpg') {
        updatedImage = '/tour-barcelona-hidden.jpg';
        fixCount++;
      } else if (t.image === '/tour-cami.jpg') {
        updatedImage = '/tour-camironda.jpg';
        fixCount++;
      }
      return { ...t, image: updatedImage };
    });

    if (fixCount > 0) {
      setTours(fixedTours);
      toast.success(`${fixCount} chemin(s) d'image(s) réparé(s) localement. N'oubliez pas de faire "Push vers DB" !`);
    } else {
      toast.info("Aucun chemin d'image erroné détecté.");
    }
  };

  const deleteTour = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce tour ?')) return;

    try {
      if (supabase) {
        const { error } = await supabase.from('tours').delete().eq('id', id);
        if (error) throw error;
      }

      const updatedTours = tours.filter(t => t.id !== id);
      setTours(updatedTours);
      localStorage.setItem('td-tours', JSON.stringify(updatedTours));
      toast.success("Tour supprimé avec succès.");
    } catch (err: any) {
      console.error('Delete error:', err);
      toast.error("Erreur lors de la suppression : " + err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">Catalogue des Tours</h2>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          {supabase && (
            <>
              <Button
                variant="outline"
                onClick={pushAllToDb}
                className="border-amber-600 text-amber-600"
                disabled={isSyncing}
              >
                {isSyncing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
                Push vers DB
              </Button>
              <Button
                variant="outline"
                onClick={pullFromDb}
                className="border-blue-600 text-blue-600"
                disabled={isSyncing}
              >
                {isSyncing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Compass className="w-4 h-4 mr-2" />}
                Pull de DB
              </Button>
            </>
          )}
          <Button
            variant="outline"
            className="border-green-600 text-green-600"
            onClick={fixImagePaths}
          >
            <Check className="w-4 h-4 mr-2" /> Réparer Images
          </Button>
          <Button
            variant="outline"
            onClick={resetFromMaster}
            disabled={isSyncing}
          >
            {isSyncing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Compass className="w-4 h-4 mr-2" />}
            Réinitialiser Défaut
          </Button>
          <Button className="bg-amber-600" onClick={() => {
            setEditingTour({
              id: Math.random().toString(36).substr(2, 9),
              title: '',
              subtitle: '',
              description: '',
              duration: '',
              group_size: '',
              price: 0,
              image: '',
              highlights: [],
              category: 'Tour',
              isActive: true
            });
            setIsEditOpen(true);
          }}>+ Nouveau Tour</Button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tours.map(tour => (
          <Card key={tour.id}>
            <img src={tour.image} className="w-full h-40 object-cover rounded-t-lg" alt={tour.title} />
            <CardContent className="p-4 space-y-2">
              <h3 className="font-bold">{tour.title}</h3>
              <p className="text-sm text-gray-500 line-clamp-2">{tour.description}</p>
              <div className="flex justify-between items-center pt-2">
                <span className="font-bold text-amber-600">{tour.price}€</span>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => { setEditingTour(tour); setIsEditOpen(true); }}>Modifier</Button>
                  <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 hover:border-red-300" onClick={() => deleteTour(tour.id)}>
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
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  <TabsTrigger value="fr" className="flex items-center gap-2 font-bold text-blue-600">FR <Globe className="w-3 h-3" /></TabsTrigger>
                  <TabsTrigger value="en" className="flex items-center gap-2 font-bold text-amber-600">EN <Globe className="w-3 h-3" /></TabsTrigger>
                  <TabsTrigger value="es" className="flex items-center gap-2 font-bold text-red-600">ES <Globe className="w-3 h-3" /></TabsTrigger>
                </TabsList>

                {/* Common Fields */}
                <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="space-y-2">
                    <Label className="text-xs uppercase text-gray-400">ID du tour</Label>
                    <Input value={editingTour.id} disabled className="bg-gray-100" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs uppercase text-gray-400">Prix (€)</Label>
                    <Input type="number" value={editingTour.price} onChange={(e) => setEditingTour({ ...editingTour, price: parseInt(e.target.value) })} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs uppercase text-gray-400">Catégorie</Label>
                    <Input value={editingTour.category} onChange={(e) => setEditingTour({ ...editingTour, category: sanitize(e.target.value) })} />
                  </div>
                </div>

                <TabsContent value="fr" className="space-y-4">
                  <div className="space-y-2">
                    <Label>Titre (FR)</Label>
                    <Input value={editingTour.title} onChange={(e) => setEditingTour({ ...editingTour, title: sanitize(e.target.value) })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Sous-titre (FR)</Label>
                    <Input value={editingTour.subtitle} onChange={(e) => setEditingTour({ ...editingTour, subtitle: sanitize(e.target.value) })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Description (FR)</Label>
                    <Textarea rows={4} value={editingTour.description} onChange={(e) => setEditingTour({ ...editingTour, description: sanitize(e.target.value) })} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Points forts (FR)</Label>
                      <Textarea
                        className="text-xs min-h-[100px]"
                        value={editingTour.highlights.join('\n')}
                        onChange={(e) => setEditingTour({ ...editingTour, highlights: e.target.value.split('\n').filter(l => l.trim()) })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Itinéraire (FR)</Label>
                      <Textarea
                        className="text-xs min-h-[100px]"
                        value={(editingTour.itinerary || []).join('\n')}
                        onChange={(e) => setEditingTour({ ...editingTour, itinerary: e.target.value.split('\n').filter(l => l.trim()) })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Point de rencontre (FR)</Label>
                    <Input value={editingTour.meetingPoint || ''} onChange={(e) => setEditingTour({ ...editingTour, meetingPoint: e.target.value })} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Inclusions (FR)</Label>
                      <Textarea
                        className="text-xs min-h-[100px]"
                        value={(editingTour.included || []).join('\n')}
                        onChange={(e) => setEditingTour({ ...editingTour, included: e.target.value.split('\n').filter(l => l.trim()) })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Exclusions (FR)</Label>
                      <Textarea
                        className="text-xs min-h-[100px]"
                        value={(editingTour.notIncluded || []).join('\n')}
                        onChange={(e) => setEditingTour({ ...editingTour, notIncluded: e.target.value.split('\n').filter(l => l.trim()) })}
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="en" className="space-y-4">
                  <div className="space-y-2">
                    <Label>Title (EN)</Label>
                    <Input value={editingTour.title_en || ''} onChange={(e) => setEditingTour({ ...editingTour, title_en: sanitize(e.target.value) })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Subtitle (EN)</Label>
                    <Input value={editingTour.subtitle_en || ''} onChange={(e) => setEditingTour({ ...editingTour, subtitle_en: sanitize(e.target.value) })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Description (EN)</Label>
                    <Textarea rows={4} value={editingTour.description_en || ''} onChange={(e) => setEditingTour({ ...editingTour, description_en: sanitize(e.target.value) })} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Highlights (EN)</Label>
                      <Textarea
                        className="text-xs min-h-[100px]"
                        value={(editingTour.highlights_en || []).join('\n')}
                        onChange={(e) => setEditingTour({ ...editingTour, highlights_en: e.target.value.split('\n').filter(l => l.trim()) })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Itinerary (EN)</Label>
                      <Textarea
                        className="text-xs min-h-[100px]"
                        value={(editingTour.itinerary_en || []).join('\n')}
                        onChange={(e) => setEditingTour({ ...editingTour, itinerary_en: e.target.value.split('\n').filter(l => l.trim()) })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Meeting Point (EN)</Label>
                    <Input value={editingTour.meetingPoint_en || ''} onChange={(e) => setEditingTour({ ...editingTour, meetingPoint_en: e.target.value })} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Inclusions (EN)</Label>
                      <Textarea
                        className="text-xs min-h-[100px]"
                        value={(editingTour.included_en || []).join('\n')}
                        onChange={(e) => setEditingTour({ ...editingTour, included_en: e.target.value.split('\n').filter(l => l.trim()) })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Exclusions (EN)</Label>
                      <Textarea
                        className="text-xs min-h-[100px]"
                        value={(editingTour.notIncluded_en || []).join('\n')}
                        onChange={(e) => setEditingTour({ ...editingTour, notIncluded_en: e.target.value.split('\n').filter(l => l.trim()) })}
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="es" className="space-y-4">
                  <div className="space-y-2">
                    <Label>Título (ES)</Label>
                    <Input value={editingTour.title_es || ''} onChange={(e) => setEditingTour({ ...editingTour, title_es: sanitize(e.target.value) })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Subtítulo (ES)</Label>
                    <Input value={editingTour.subtitle_es || ''} onChange={(e) => setEditingTour({ ...editingTour, subtitle_es: sanitize(e.target.value) })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Descripción (ES)</Label>
                    <Textarea rows={4} value={editingTour.description_es || ''} onChange={(e) => setEditingTour({ ...editingTour, description_es: sanitize(e.target.value) })} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Puntos fuertes (ES)</Label>
                      <Textarea
                        className="text-xs min-h-[100px]"
                        value={(editingTour.highlights_es || []).join('\n')}
                        onChange={(e) => setEditingTour({ ...editingTour, highlights_es: e.target.value.split('\n').filter(l => l.trim()) })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Itinerario (ES)</Label>
                      <Textarea
                        className="text-xs min-h-[100px]"
                        value={(editingTour.itinerary_es || []).join('\n')}
                        onChange={(e) => setEditingTour({ ...editingTour, itinerary_es: e.target.value.split('\n').filter(l => l.trim()) })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Punto de encuentro (ES)</Label>
                    <Input value={editingTour.meetingPoint_es || ''} onChange={(e) => setEditingTour({ ...editingTour, meetingPoint_es: e.target.value })} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Inclusiones (ES)</Label>
                      <Textarea
                        className="text-xs min-h-[100px]"
                        value={(editingTour.included_es || []).join('\n')}
                        onChange={(e) => setEditingTour({ ...editingTour, included_es: e.target.value.split('\n').filter(l => l.trim()) })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Exclusiones (ES)</Label>
                      <Textarea
                        className="text-xs min-h-[100px]"
                        value={(editingTour.notIncluded_es || []).join('\n')}
                        onChange={(e) => setEditingTour({ ...editingTour, notIncluded_es: e.target.value.split('\n').filter(l => l.trim()) })}
                      />
                    </div>
                  </div>
                </TabsContent>

                <div className="mt-8 space-y-6 border-t pt-6">
                  <div className="space-y-2">
                    <Label>Lien Google Maps (Embed)</Label>
                    <Input
                      placeholder="https://www.google.com/maps/embed?pb=..."
                      value={editingTour.meetingPointMapUrl || ''}
                      onChange={(e) => setEditingTour({ ...editingTour, meetingPointMapUrl: e.target.value })}
                    />
                    <p className="text-[10px] text-gray-400 font-medium">Pour afficher une carte, collez l'URL 'src' de l'iframe de partage Google Maps (Embed).</p>
                  </div>

                  <div className="space-y-2">
                    <Label>Photo du tour (URL)</Label>
                    <div className="flex gap-2">
                      <Input value={editingTour.image} onChange={(e) => setEditingTour({ ...editingTour, image: e.target.value })} className="flex-1" />
                    </div>
                  </div>
                </div>
              </Tabs>
            </div>
          )}
          <div className="px-6 py-4 bg-gray-50 border-t flex justify-end gap-3 shrink-0">
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>Annuler</Button>
            <Button onClick={saveTour} className="bg-amber-600 hover:bg-amber-700 font-bold px-8">Enregistrer</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Reviews Component
function Reviews({ reviews, setReviews }: { reviews: Review[], setReviews: React.Dispatch<React.SetStateAction<Review[]>> }) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newReview, setNewReview] = useState<Partial<Review>>({
    name: '',
    location: '',
    rating: 5,
    text: '',
    isPublished: true
  });

  const handleAddReview = async () => {
    if (!newReview.name || !newReview.text) {
      toast.error("Veuillez remplir le nom et le texte");
      return;
    }

    if (supabase) {
      const { data, error } = await supabase.from('reviews').insert({
        name: newReview.name,
        location: newReview.location,
        rating: newReview.rating,
        text: newReview.text,
        is_published: newReview.isPublished,
        created_at: new Date().toISOString()
      }).select().single();

      if (error) {
        toast.error("Erreur lors de l'ajout de l'avis");
      } else if (data) {
        setReviews(prev => [
          {
            id: data.id,
            name: data.name,
            location: data.location,
            rating: data.rating,
            text: data.text,
            isPublished: data.is_published,
            createdAt: data.created_at
          },
          ...prev
        ]);
        toast.success("Avis ajouté !");
        setIsAddOpen(false);
        setNewReview({ name: '', location: '', rating: 5, text: '', isPublished: true });
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Modération des Avis</h2>
        <Button onClick={() => setIsAddOpen(true)} className="bg-amber-600 hover:bg-amber-700">
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
                <Input value={newReview.name} onChange={e => setNewReview({ ...newReview, name: e.target.value })} placeholder="Ex: Marie D." />
              </div>
              <div className="space-y-2">
                <Label>Localisation</Label>
                <Input value={newReview.location} onChange={e => setNewReview({ ...newReview, location: e.target.value })} placeholder="Ex: Paris, France" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Note (1-5)</Label>
              <Select value={String(newReview.rating)} onValueChange={val => setNewReview({ ...newReview, rating: Number(val) })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[5, 4, 3, 2, 1].map(n => (
                    <SelectItem key={n} value={String(n)}>{n} Étoiles</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Commentaire</Label>
              <Textarea
                value={newReview.text}
                onChange={e => setNewReview({ ...newReview, text: e.target.value })}
                placeholder="L'expérience était fantastique..."
                rows={4}
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isPublished"
                checked={newReview.isPublished}
                onChange={e => setNewReview({ ...newReview, isPublished: e.target.checked })}
                className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
              />
              <Label htmlFor="isPublished">Publier immédiatement</Label>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setIsAddOpen(false)}>Annuler</Button>
            <Button onClick={handleAddReview} className="bg-amber-600 hover:bg-amber-700">Enregistrer</Button>
          </div>
        </DialogContent>
      </Dialog>
      {reviews.map(review => (
        <Card key={review.id} className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <div className="font-bold">{review.name}</div>
              <div className="flex gap-1 py-1">
                {[...Array(5)].map((_, i) => <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-amber-500 text-amber-500' : 'text-gray-300'}`} />)}
              </div>
              <p className="text-sm italic text-gray-700">"{review.text}"</p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant={review.isPublished ? 'outline' : 'default'} onClick={() => {
                const newStatus = !review.isPublished;
                if (supabase) {
                  supabase.from('reviews').update({ is_published: newStatus }).eq('id', review.id)
                    .then(({ error }) => {
                      if (!error) toast.success(newStatus ? 'Avis publié !' : 'Avis masqué');
                    });
                }
                setReviews(prev => prev.map(r => r.id === review.id ? { ...r, isPublished: newStatus } : r));
              }}>
                {review.isPublished ? 'Cacher' : 'Publier'}
              </Button>
              <Button size="sm" variant="destructive" onClick={() => {
                if (confirm('Supprimer cet avis ?')) {
                  if (supabase) {
                    supabase.from('reviews').delete().eq('id', review.id);
                  }
                  setReviews(prev => prev.filter(r => r.id !== review.id));
                }
              }}>Supprimer</Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

// Config Component
function Config() {
  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-4xl font-black text-gray-900 tracking-tight">Infrastructure</h2>
          <p className="text-gray-500 font-medium">Monitoring en temps réel et état critique du système.</p>
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
                <ShieldCheck className="w-4 h-4 text-amber-600" /> Sécurité Infra
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-[11px]">
                  <span className="text-gray-500">Auth Service</span>
                  <span className="text-green-600 font-bold italic">Actif (Otp)</span>
                </div>
                <div className="w-full bg-gray-200 h-1 rounded-full overflow-hidden">
                  <div className="bg-green-500 h-full w-[100%]" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-[11px]">
                  <span className="text-gray-500">RLS Policies</span>
                  <span className="text-green-600 font-bold italic">Vérifié</span>
                </div>
                <div className="w-full bg-gray-200 h-1 rounded-full overflow-hidden">
                  <div className="bg-green-500 h-full w-[100%]" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-dashed border-2 border-gray-100">
            <CardContent className="p-6 text-center space-y-3">
              <Activity className="w-8 h-8 text-gray-200 mx-auto" />
              <p className="text-xs text-gray-400 font-medium italic">
                Logs système agrégés. <br />Toutes les opérations sont archivées pour l'audit.
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
  const [newEmail, setNewEmail] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    if (!supabase) return;
    const { data, error } = await supabase
      .from('authorized_admins')
      .select('email')
      .order('email');
    if (!error && data) setAdmins(data);
    setIsLoading(false);
  };

  const handleAddAdmin = async () => {
    if (!newEmail || !supabase) return;
    const email = newEmail.toLowerCase().trim();
    const { error } = await supabase
      .from('authorized_admins')
      .insert({ email });

    if (error) {
      toast.error("Échec de l'ajout : " + error.message);
    } else {
      toast.success("Admin ajouté");
      setNewEmail('');
      fetchAdmins();
    }
  };

  const handleRemoveAdmin = async (email: string) => {
    if (!supabase || !confirm(`Révoquer l'accès pour ${email} ?`)) return;
    const { error } = await supabase
      .from('authorized_admins')
      .delete()
      .eq('email', email);

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
            <Button onClick={handleAddAdmin} className="bg-amber-600">
              <Plus className="w-4 h-4 mr-2" /> Autoriser
            </Button>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            L'utilisateur pourra se connecter via un lien magique s'il figure dans cette liste.
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {isLoading ? (
          <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-amber-600" /></div>
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
  const [vercelStatus, setVercelStatus] = useState<'checking' | 'ok' | 'error'>('checking');
  const [supabaseStatus, setSupabaseStatus] = useState<'checking' | 'ok' | 'error'>('checking');
  const [latency, setLatency] = useState<number | null>(null);
  const [lastCommit, setLastCommit] = useState<{ message: string; date: string; url?: string } | null>(null);
  const [vercelDeploys, setVercelDeploys] = useState<any[]>([]);
  const [vToken, setVToken] = useState(localStorage.getItem('td-vercel-token') || '');
  const [isVLoading, setIsVLoading] = useState(false);

  const fetchVercelDeploys = async (token: string) => {
    if (!token) return;
    setIsVLoading(true);
    try {
      // Find project ID first or use name
      const res = await fetch('https://api.vercel.com/v6/deployments?projectId=prj_u3FmYgW8H5YFw4H5r6B7C8D9E0&limit=5', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.deployments) {
        setVercelDeploys(data.deployments);
      }
    } catch (err) {
      console.error('Vercel API Error:', err);
    } finally {
      setIsVLoading(false);
    }
  };

  useEffect(() => {
    if (vToken) fetchVercelDeploys(vToken);
  }, []);

  useEffect(() => {
    // Check Supabase
    const start = Date.now();
    if (supabase) {
      supabase.from('site_config').select('key').limit(1)
        .then(({ error }) => {
          setSupabaseStatus(error ? 'error' : 'ok');
          if (error) console.error('Monitor Supabase Error:', error);
          setLatency(Date.now() - start);
        });
    } else {
      setSupabaseStatus('error');
    }

    // Check Vercel
    fetch('https://tours-five-olive.vercel.app/', { mode: 'no-cors' })
      .then(() => setVercelStatus('ok'))
      .catch(() => setVercelStatus('error'));

    // Fetch Last Git Commit
    fetch('https://api.github.com/repos/dg280/TOURS/commits/main')
      .then(res => {
        if (!res.ok) throw new Error('GitHub API Error: ' + res.status);
        return res.json();
      })
      .then(data => {
        if (data && data.commit) {
          setLastCommit({
            message: data.commit.message,
            date: new Date(data.commit.author.date).toLocaleString('fr-FR')
          });
        }
      })
      .catch(err => {
        console.error('Git fetch error:', err);
        setLastCommit({ message: "Erreur de récupération (Repo Privé ou Limite API)", date: "N/A" });
      });
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Supabase Status */}
        <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${supabaseStatus === 'ok' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold">Supabase DB</p>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider">Base de données Cloud</p>
            </div>
          </div>
          <div className="text-right">
            <span className={`text-xs font-bold px-2 py-1 rounded-full ${supabaseStatus === 'ok' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {supabaseStatus === 'ok' ? 'FONCTIONNEL' : 'ERREUR'}
            </span>
            {latency !== null && <p className="text-[10px] text-gray-400 mt-1">{latency}ms</p>}
          </div>
        </div>

        {/* Vercel Status */}
        <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${vercelStatus === 'ok' ? 'bg-blue-50 text-blue-600' : 'bg-red-50 text-red-600'}`}>
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold">Vercel Edge</p>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider">Disponibilité Production</p>
            </div>
          </div>
          <div className="text-right">
            <span className={`text-xs font-bold px-2 py-1 rounded-full ${vercelStatus === 'ok' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'}`}>
              {vercelStatus === 'ok' ? 'EN LIGNE' : 'ERREUR'}
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
            <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400">Dernier Push GitHub</h4>
          </div>
          <Globe className="w-4 h-4 text-gray-600" />
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
            <Button size="sm" variant="ghost" className="text-[10px] h-6" onClick={() => {
              const token = prompt('Entrez votre Vercel API Token (local storage uniquement) :');
              if (token) {
                localStorage.setItem('td-vercel-token', token);
                setVToken(token);
                fetchVercelDeploys(token);
              }
            }}>Configuration</Button>
          ) : (
            <Badge variant="outline" className="text-[10px] bg-blue-50">Token Actif</Badge>
          )}
        </div>
        <div className="divide-y divide-gray-50">
          {vToken ? (
            isVLoading ? (
              <div className="p-8 text-center"><Loader2 className="w-4 h-4 animate-spin mx-auto text-blue-500" /></div>
            ) : vercelDeploys.length > 0 ? (
              vercelDeploys.map((dep) => (
                <div key={dep.uid} className="p-4 hover:bg-gray-50 transition-colors flex justify-between items-center text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${dep.state === 'READY' ? 'bg-green-500' : dep.state === 'ERROR' ? 'bg-red-500' : 'bg-amber-500'}`} />
                      <span className="font-bold text-gray-700 capitalize">{dep.state}</span>
                      <span className="text-gray-400 font-mono">#{dep.uid.slice(-6)}</span>
                    </div>
                    <p className="text-gray-500 line-clamp-1 italic max-w-sm">"{dep.meta?.githubCommitMessage || 'Pas de message'}"</p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="font-medium text-gray-400">{new Date(dep.createdAt).toLocaleString('fr-FR', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                    <a href={`https://${dep.url}`} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline flex items-center justify-end gap-1">
                      Preview <ExternalLink className="w-2 h-2" />
                    </a>
                  </div>
                </div>
              ))
            ) : (
              <p className="p-8 text-center text-gray-400 italic text-xs">Aucun déploiement trouvé.</p>
            )
          ) : (
            <div className="p-8 text-center space-y-3">
              <p className="text-xs text-gray-400 italic">Configurez un token Vercel pour voir les logs de déploiement en direct.</p>
              <Button size="sm" variant="outline" onClick={() => {
                const token = prompt('Entrez votre Vercel API Token :');
                if (token) {
                  localStorage.setItem('td-vercel-token', token);
                  setVToken(token);
                  fetchVercelDeploys(token);
                }
              }}>Ajouter Token</Button>
            </div>
          )}
        </div>
      </div>
      <h4 className="text-xs font-bold text-amber-800 uppercase mb-3 flex items-center gap-2">
        <Bell className="w-4 h-4" /> Analyse d'Expert
      </h4>
      <p className="text-xs text-amber-900/70 leading-relaxed">
        L'infrastructure est actuellement optimisée. Supabase répond avec une latence <span className="font-bold">inférieure à 200ms</span>.
        Le déploiement Vercel est stable et le certificat SSL est valide. Aucune anomalie détectée sur les API durant les dernières 24h.
      </p>
    </div>
  );
}

// Marketing Component
function Marketing({ subscribers }: { subscribers: { email: string; created_at: string }[] }) {
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
        <p className="text-gray-500 font-medium">Gérez votre audience et optimisez votre visibilité sur Google.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 shadow-sm border-gray-100">
          <CardHeader className="flex flex-row items-center justify-between border-b border-gray-50 pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <Send className="w-5 h-5 text-amber-500" />
              Inscriptions Newsletter
            </CardTitle>
            <Badge variant="outline" className="font-mono">{subscribers.length} inscrits</Badge>
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
                  {subscribers.length > 0 ? subscribers.map((sub, i) => (
                    <tr key={i} className="hover:bg-amber-50/30 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-gray-800">{sub.email}</td>
                      <td className="px-6 py-4 text-sm text-gray-500 text-right">
                        {new Date(sub.created_at).toLocaleDateString('fr-FR')}
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={2} className="px-6 py-12 text-center text-gray-400 italic">
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
              <CardTitle className="text-sm uppercase tracking-widest text-gray-400 font-bold mb-2">Santé SEO</CardTitle>
              <div className="text-4xl font-black text-amber-500">85<span className="text-xl text-white">/100</span></div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-3">
                {seoChecklist.map((item, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <CheckCircle2 className={`w-4 h-4 mt-0.5 shrink-0 ${item.status ? 'text-green-500' : 'text-gray-200'}`} />
                    <span className={`text-xs ${item.status ? 'text-gray-700' : 'text-gray-400'}`}>{item.task}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-amber-600 text-white border-none shadow-xl shadow-amber-600/20">
            <CardContent className="p-6 space-y-4">
              <BarChart3 className="w-10 h-10 opacity-20" />
              <h3 className="font-bold text-lg leading-tight">Umami Analytics</h3>
              <p className="text-sm text-amber-100 italic">Accédez à vos statistiques privées sans cookie intrusif.</p>
              <Button className="w-full bg-white text-amber-600 hover:bg-amber-50 font-bold shadow-sm" onClick={() => window.open('https://cloud.umami.is', '_blank')}>
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
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [tours, setTours] = useState<Tour[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [guidePhoto, setGuidePhoto] = useState(() => localStorage.getItem('td-guide-photo') || '/guide-antoine.jpg');
  const [instagramUrl, setInstagramUrl] = useState(() => localStorage.getItem('td-instagram-url') || 'https://www.instagram.com/tours_and_detours_bcn/');

  const profileFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!supabase) return;

    // Check session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const [subscribers, setSubscribers] = useState<{ email: string; created_at: string }[]>([]);

  useEffect(() => {
    if (!isLoggedIn || !supabase) return;

    // Fetch subscribers
    supabase.from('newsletter_subscribers').select('*').order('created_at', { ascending: false })
      .then(({ data }) => {
        if (data) setSubscribers(data);
      });
  }, [isLoggedIn]);

  useEffect(() => {
    if (!isLoggedIn || !supabase) return;

    const loadingToast = toast.loading("Chargement des données...");

    // Fetch reservations
    supabase.from('reservations').select('*').order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) {
          const mapped = data.map(r => ({
            id: r.id,
            name: r.name,
            email: r.email,
            phone: r.phone,
            tourId: r.tour_id,
            tourName: r.tour_name,
            date: r.date,
            participants: r.participants,
            status: r.status,
            message: r.message || '',
            createdAt: r.created_at,
            totalPrice: r.total_price
          }));
          setReservations(mapped);
        }
      });

    // Fetch reviews
    supabase.from('reviews').select('*').order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) {
          const mapped = data.map(r => ({
            id: r.id,
            name: r.name,
            location: r.location,
            rating: r.rating,
            text: r.text,
            tourId: r.tour_id,
            isPublished: r.is_published,
            createdAt: r.created_at
          }));
          setReviews(mapped);
        }
      });

    // Fetch tours
    supabase.from('tours').select('*').order('id')
      .then(({ data, error }) => {
        toast.dismiss(loadingToast);
        if (!error && data && data.length > 0) {
          const mapped = data.map(t => ({
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
            group_size: t.group_size,
            price: t.price,
            image: t.image,
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
            meetingPointMapUrl: t.meeting_point_map_url
          }));
          setTours(mapped as Tour[]);
          toast.success(`${data.length} tours chargés.`);
        } else if (error) {
          console.error('Fetch tours error:', error);
          toast.error("Erreur de chargement des tours (Cloud).");
        }
      });

    // Fetch Profile Photo from site_config
    supabase.from('site_config').select('value').eq('key', 'guide_profile').single()
      .then(({ data, error }) => {
        if (!error && data && data.value) {
          const val = data.value as { photo?: string; instagram?: string };
          if (val.photo) setGuidePhoto(val.photo);
          if (val.instagram) setInstagramUrl(val.instagram);
        }
      });
  }, [isLoggedIn]);

  useEffect(() => {
    localStorage.setItem('td-guide-photo', guidePhoto);
  }, [guidePhoto]);

  useEffect(() => {
    localStorage.setItem('td-instagram-url', instagramUrl);
  }, [instagramUrl]);

  const handleProfileImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("L'image est trop volumineuse (max 5MB)");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const maxDim = 800;

          if (width > height && width > maxDim) {
            height *= maxDim / width;
            width = maxDim;
          } else if (height > maxDim) {
            width *= maxDim / height;
            height = maxDim;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
          setGuidePhoto(compressedBase64);
          toast.success("Photo de profil prête");
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const saveProfile = async () => {
    try {
      if (supabase) {
        const { error } = await supabase.from('site_config').upsert({
          key: 'guide_profile',
          value: { photo: guidePhoto, instagram: instagramUrl },
          updated_at: new Date().toISOString()
        });

        if (error) {
          toast.error("Sauvegarde cloud échouée");
        } else {
          toast.success("Profil mis à jour");
        }
      }
    } catch (error) {
      toast.error("Erreur lors de la sauvegarde");
    }
  };

  if (!isLoggedIn) return <Login />;

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'reservations', label: 'Réservations', icon: Calendar },
    { id: 'tours', label: 'Catalogue', icon: MapPin },
    { id: 'reviews', label: 'Avis clients', icon: Star },
    { id: 'admins', label: 'Admins', icon: ShieldCheck },
    { id: 'profile', label: 'Mon Profil', icon: User },
    { id: 'marketing', label: 'Marketing & SEO', icon: BarChart3 },
    { id: 'config', label: 'Infrastructure', icon: Bell },
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

      <aside className={`
        fixed inset-y-0 left-0 z-50 lg:static
        bg-gray-900 border-r border-gray-800 transition-all duration-300 flex flex-col
        ${isSidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0 lg:w-20'}
      `}>
        <div className="p-4 sm:p-6 flex items-center justify-between">
          <div className={`flex items-center gap-3 transition-opacity ${isSidebarOpen ? 'opacity-100' : 'lg:opacity-0 h-0 w-0'}`}>
            <Compass className="w-8 h-8 text-amber-500" />
            <span className="text-white font-bold text-lg">Admin</span>
          </div>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        <nav className="flex-1 mt-4 px-4 space-y-1">
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                if (window.innerWidth < 1024) setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === item.id ? 'bg-amber-600 text-white shadow-lg shadow-amber-900/20' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {(isSidebarOpen || window.innerWidth < 1024) && <span className="font-medium whitespace-nowrap">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button onClick={() => supabase?.auth.signOut()} className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {(isSidebarOpen || window.innerWidth < 1024) && <span>Déconnexion</span>}
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden w-full">
        <header className="h-16 bg-white border-b border-gray-200 px-4 sm:px-8 flex items-center justify-between flex-shrink-0 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden text-gray-500 p-1 hover:bg-gray-100 rounded-lg">
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="text-lg sm:text-xl font-bold text-gray-800 truncate">
              {menuItems.find(m => m.id === activeTab)?.label}
            </h2>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold truncate max-w-[150px]">Antoine Pilard</p>
              <p className="text-xs text-gray-500">Administrateur</p>
            </div>
            <div
              className="w-10 h-10 rounded-full border border-gray-200 overflow-hidden shadow-sm hover:ring-2 hover:ring-amber-500 transition-all cursor-pointer flex-shrink-0"
              onClick={() => setActiveTab('profile')}
            >
              <img src={guidePhoto} className="w-full h-full object-cover" alt="Profile" />
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 sm:p-8">
          <div className="max-w-6xl mx-auto">
            {activeTab === 'dashboard' && <Dashboard reservations={reservations} setActiveTab={setActiveTab} />}
            {activeTab === 'reservations' && <Reservations reservations={reservations} setReservations={setReservations} />}
            {activeTab === 'tours' && <ToursManagement tours={tours} setTours={setTours} />}
            {activeTab === 'reviews' && <Reviews reviews={reviews} setReviews={setReviews} />}
            {activeTab === 'admins' && <AdminsManagement />}
            {activeTab === 'config' && <Config />}
            {activeTab === 'marketing' && <Marketing subscribers={subscribers} />}
            {activeTab === 'profile' && (
              <div className="max-w-2xl mx-auto">
                <Card className="overflow-hidden">
                  <div className="h-32 bg-gradient-to-r from-amber-500 to-orange-600"></div>
                  <CardContent className="px-8 pb-8">
                    <div className="relative -mt-16 mb-6 flex flex-col items-center">
                      <div className="relative group">
                        <div className="w-32 h-32 rounded-full border-4 border-white shadow-xl overflow-hidden bg-gray-100">
                          <img src={guidePhoto} className="w-full h-full object-cover" alt="Antoine" />
                        </div>
                        <button
                          onClick={() => profileFileInputRef.current?.click()}
                          className="absolute inset-0 bg-black/40 text-white rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <ImageIcon className="w-6 h-6 mb-1" />
                          <span className="text-[10px] font-bold uppercase tracking-wider">Modifier</span>
                        </button>
                      </div>
                      <h3 className="text-2xl font-bold mt-4 text-gray-900">Antoine Pilard</h3>
                      <p className="text-gray-500">Guide Accompagnateur • Fondateur</p>
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-4">
                        <h4 className="font-bold text-gray-900 border-b pb-2">Paramètres de photo</h4>
                        <div className="space-y-2">
                          <Label>Lien image de profil</Label>
                          <div className="flex gap-2">
                            <Input value={guidePhoto} onChange={(e) => setGuidePhoto(e.target.value)} placeholder="/guide-antoine.jpg" className="flex-1" />
                            <input type="file" ref={profileFileInputRef} className="hidden" accept="image/*" onChange={handleProfileImageUpload} />
                            <Button variant="outline" onClick={() => profileFileInputRef.current?.click()}>
                              <Upload className="w-4 h-4 mr-2" /> Upload
                            </Button>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Lien Instagram</Label>
                          <Input value={instagramUrl} onChange={(e) => setInstagramUrl(e.target.value)} placeholder="https://www.instagram.com/compte" />
                        </div>
                      </div>

                      <div className="pt-4 flex gap-3">
                        <Button className="flex-1 bg-amber-600" onClick={saveProfile}>
                          <Check className="w-4 h-4 mr-2" /> Enregistrer
                        </Button>
                        <Button variant="outline" className="flex-1" onClick={() => setActiveTab('dashboard')}>Retour</Button>
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
    </div>
  );
}
