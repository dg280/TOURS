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
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
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
  subtitle: string;
  description: string;
  duration: string;
  groupSize: string;
  price: number;
  image: string;
  highlights: string[];
  category: string;
  isActive: boolean;
  stripeLink?: string;
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
// Mock Data from translations.ts
const mockTours: Tour[] = [
  {
    id: '1',
    title: 'Costa Brava & Girona : sentiers médiévaux et beauté côtière',
    subtitle: 'Profondeur culturelle et paysages marquants',
    description: 'Un voyage d\'une journée entière, guidé privativement, combinant l\'héritage juif et médiéval de Gérone avec les villages côtiers raffinés de la Costa Brava.',
    duration: 'Journée entière',
    groupSize: '1-8',
    price: 145,
    image: '/tour-girona.jpg',
    category: 'Culture & Nature',
    highlights: ['Quartier Juif (El Call)', 'Village médiéval de Pals', 'Calella de Palafrugell & Llafranc', 'Randonnée Camí de Ronda optionnelle', 'Déjeuner méditerranéen'],
    isActive: true
  },
  {
    id: '4',
    title: 'Randonnée Villages Médiévaux — Pré-Pyrénées',
    subtitle: 'Marche, Nature & Patrimoine',
    description: 'Une randonnée immersive à faible impact (6km) commençant dans une ville médiévale, avec des chapelles romanes et des vallées forestières. Idéal pour le calme.',
    duration: 'Journée entière',
    groupSize: '1-8',
    price: 95,
    image: '/tour-prepirinees.jpg',
    category: 'Randonnée & Patrimoine',
    highlights: ['Départ village médiéval', 'Chapelles romanes', 'Vallées forestières', 'Paysages paisibles', 'Marche immersive 6km'],
    isActive: true
  },
  {
    id: '5',
    title: 'Kayak Costa Brava — Grottes Marines & Criques Cachées',
    subtitle: 'Aventure, Nature & Activités Nautiques',
    description: 'Une expérience guidée en kayak explorant grottes marines, vie marine et falaises escarpées. Opéré avec des partenaires locaux audités.',
    duration: 'Demi/Journée entière',
    groupSize: '1-8',
    price: 75,
    image: '/tour-kayak.jpg',
    category: 'Aventure',
    highlights: ['Exploration de grottes', 'Falaises escarpées', 'Vie marine', 'Sécurité auditée', 'Demi ou Journée entière'],
    isActive: true
  },
  {
    id: '6',
    title: 'Expérience Montserrat & Vin',
    subtitle: 'Culture, Décors & Gastronomie',
    description: 'Une journée combinant le paysage majestueux et la spiritualité de Montserrat avec la visite d\'une bodega familiale et une dégustation.',
    duration: 'Demi/Journée entière',
    groupSize: '1-8',
    price: 125,
    image: '/tour-montserrat.jpg',
    category: 'Culture & Vin',
    highlights: ['Exploration du monastère', 'Vues panoramiques', 'Visite cave locale', 'Dégustation', 'Bodega familiale'],
    isActive: true
  },
  {
    id: '7',
    title: 'Gérone et Collioure : un voyage méditerranéen transfrontalier',
    subtitle: 'Histoire, paysages, gastronomie et architecture',
    description: 'Une journée complète reliant la profondeur médiévale de la Catalogne au charme côtier du sud de la France.',
    duration: 'Journée entière',
    groupSize: '1-8',
    price: 165,
    image: '/tour-collioure.jpg',
    category: 'Culture & Gastronomie',
    highlights: ['Cathédrale de Gérone & El Call', 'Traversée des Pyrénées', 'Port & Forteresse de Collioure', 'Dégustation d\'anchois boutique', 'Déjeuner méditerranéen complet'],
    isActive: true
  },
  {
    id: '2',
    title: 'Tour à pied de Barcelone — Coins secrets de la vieille ville',
    subtitle: 'Culturel, Voyage Responsable',
    description: 'Une exploration slow-travel des quartiers Gothique et Born, dévoilant l\'histoire, les légendes et les histoires de quartier loin des circuits bondés.',
    duration: 'Demi-journée',
    groupSize: '1-8',
    price: 55,
    image: '/tour-walking.jpg',
    category: 'Ville & Culture',
    highlights: ['Quartiers Gothique & Born', 'Histoire cachée', 'Légendes & récits locaux', 'Loin des foules'],
    isActive: true
  },
  {
    id: '3',
    title: 'Randonnée sur le sentier côtier — Costa Brava “Camí de Ronda”',
    subtitle: 'Marche & Trekking',
    description: 'Une randonnée côtière spectaculaire (6km) sur l\'un des sentiers les plus emblématiques de Catalogne. Forêts de pins et criques turquoises.',
    duration: 'Journée entière',
    groupSize: '1-8',
    price: 85,
    image: '/tour-cami.jpg',
    category: 'Nature & Marche',
    highlights: ['Randonnée côtière 6km', 'Criques turquoises', 'Déjeuner de la mer', 'Possibilité de baignade'],
    isActive: true
  }
];

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
function Login({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const ADMIN_CONFIG = {
    email: 'antoine@toursanddetours.com',
    password: 'admin123'
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === ADMIN_CONFIG.email && password === ADMIN_CONFIG.password) {
      localStorage.setItem('td-admin-session', Date.now().toString());
      onLogin();
    } else {
      setError('Email ou mot de passe incorrect');
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
          <p className="text-gray-500">Interface d'administration</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="antoine@toursanddetours.com"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="password">Mot de passe</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="mt-1"
            />
          </div>
          <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700">
            Se connecter
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Demo: antoine@toursanddetours.com / admin123</p>
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, tourId?: string) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        if (tourId && editingTour && editingTour.id === tourId) {
          setEditingTour({ ...editingTour, image: base64String });
        } else if (!tourId && editingTour) {
          setEditingTour({ ...editingTour, image: base64String });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const saveTour = async () => {
    if (editingTour) {
      if (supabase) {
        const dbTour = {
          id: editingTour.id,
          title: editingTour.title,
          subtitle: editingTour.subtitle,
          description: editingTour.description,
          duration: editingTour.duration,
          group_size: editingTour.groupSize,
          price: editingTour.price,
          image: editingTour.image,
          category: editingTour.category,
          highlights: editingTour.highlights,
          is_active: editingTour.isActive,
          stripe_link: editingTour.stripeLink || null
        };

        const { error } = await supabase.from('tours').upsert(dbTour);
        if (error) {
          console.error('Save error:', error);
          toast.error("Erreur lors de la sauvegarde sur Supabase");
          return;
        }
      }

      setTours(prev => {
        const exists = prev.find(t => t.id === editingTour.id);
        if (exists) return prev.map(t => t.id === editingTour.id ? editingTour : t);
        return [...prev, editingTour];
      });
      setIsEditOpen(false);
      toast.success("Tour enregistré !");
    }
  };

  const pushAllToDb = async () => {
    if (!supabase) return;
    setIsEditOpen(false);
    const loadingToast = toast.loading("Synchronisation du catalogue...");

    try {
      for (const tour of tours) {
        const dbTour = {
          id: tour.id,
          title: tour.title,
          subtitle: tour.subtitle,
          description: tour.description,
          duration: tour.duration,
          group_size: tour.groupSize,
          price: tour.price,
          image: tour.image,
          category: tour.category,
          highlights: tour.highlights,
          is_active: tour.isActive,
          stripe_link: tour.stripeLink || null
        };
        const { error } = await supabase.from('tours').upsert(dbTour);
        if (error) throw error;
      }
      toast.dismiss(loadingToast);
      toast.success("Tout le catalogue est synchronisé sur Supabase !");
    } catch (err: any) {
      console.error('Sync error:', err);
      toast.dismiss(loadingToast);
      if (err.code === '42P01') {
        toast.error("La table 'tours' n'existe pas. Avez-vous exécuté le SQL dans Supabase ?");
      } else {
        toast.error("Échec de la synchronisation : " + err.message);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">Catalogue des Tours</h2>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          {supabase && (
            <Button variant="outline" onClick={pushAllToDb} className="border-amber-600 text-amber-600">
              <Upload className="w-4 h-4 mr-2" /> Synchro Database
            </Button>
          )}
          <Button variant="outline" onClick={() => {
            if (confirm('Voulez-vous restaurer les 7 tours par défaut ? Cela écrasera vos modifications locales.')) {
              setTours(mockTours);
              localStorage.setItem('td-tours', JSON.stringify(mockTours));
              toast.success('Catalogue restauré aux 7 tours par défaut');
            }
          }}>Réinitialiser</Button>
          <Button className="bg-amber-600" onClick={() => {
            setEditingTour({
              id: Math.random().toString(36).substr(2, 9),
              title: '',
              subtitle: '',
              description: '',
              duration: '',
              groupSize: '',
              price: 0,
              image: '',
              stripeLink: '',
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
                <Button size="sm" variant="outline" onClick={() => { setEditingTour(tour); setIsEditOpen(true); }}>Modifier</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-lg w-[95vw] max-h-[95vh] flex flex-col p-0 overflow-hidden">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle>Édition Tour</DialogTitle>
          </DialogHeader>
          {editingTour && (
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="space-y-2">
                <Label>Titre</Label>
                <Input value={editingTour.title} onChange={(e) => setEditingTour({ ...editingTour, title: sanitize(e.target.value) })} />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea value={editingTour.description} onChange={(e) => setEditingTour({ ...editingTour, description: sanitize(e.target.value) })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Prix (€)</Label>
                  <Input type="number" value={editingTour.price} onChange={(e) => setEditingTour({ ...editingTour, price: parseInt(e.target.value) })} />
                </div>
                <div className="space-y-2">
                  <Label>Catégorie</Label>
                  <Input value={editingTour.category} onChange={(e) => setEditingTour({ ...editingTour, category: sanitize(e.target.value) })} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Lien de Paiement Stripe (Optionnel)</Label>
                <Input
                  placeholder="https://buy.stripe.com/..."
                  value={editingTour.stripeLink || ''}
                  onChange={(e) => setEditingTour({ ...editingTour, stripeLink: e.target.value })}
                />
                <p className="text-[10px] text-gray-400">Si vide, le site utilisera la simulation de paiement par défaut.</p>
              </div>
              <div className="space-y-2">
                <Label>Photo du tour</Label>
                <div className="flex flex-col gap-3">
                  <div className="flex gap-2">
                    <Input placeholder="URL de l'image" value={editingTour.image} onChange={(e) => setEditingTour({ ...editingTour, image: e.target.value })} className="flex-1" />
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                    <Button size="sm" variant="outline" onClick={() => fileInputRef.current?.click()}>
                      <Upload className="w-4 h-4 mr-2" /> Disque
                    </Button>
                  </div>
                  {editingTour.image && <img src={editingTour.image} className="w-full h-32 object-cover rounded border" alt="Aperçu" />}
                </div>
              </div>
              <div className="pt-2 sticky bottom-0 bg-white">
                <Button onClick={saveTour} className="w-full bg-amber-600">Enregistrer</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Reviews Component
function Reviews({ reviews, setReviews }: { reviews: Review[], setReviews: React.Dispatch<React.SetStateAction<Review[]>> }) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Modération des Avis</h2>
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
    <div className="max-w-4xl mx-auto space-y-8">
      <header className="space-y-2">
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Configuration Technique</h2>
        <p className="text-gray-500">Gérez vos connexions Stripe et Supabase pour la production.</p>
      </header>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Stripe Section */}
        <Card className="flex flex-col border-amber-200">
          <CardHeader className="bg-amber-50 border-b border-amber-100">
            <CardTitle className="flex items-center gap-2 text-amber-800">
              <Euro className="w-5 h-5" /> Paiements Stripe
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 flex-1 space-y-4">
            <p className="text-sm text-gray-600">
              Pour encaisser des paiements, utilisez les <strong>Stripe Payment Links</strong> (plus simple que l'API complète pour un catalogue fixe).
            </p>
            <div className="bg-gray-100 p-4 rounded-lg text-[13px] font-mono whitespace-pre-wrap">
              1. Allez sur Stripe {'→'} Paiements {'→'} Liens de paiement.
              2. Créez un lien pour chaque tour.
              3. Copiez le lien (ex: buy.stripe.com/abc).
              4. Dans le "Catalogue" ici, éditez le tour et collez ce lien.
            </div>
            <p className="text-xs text-amber-700 italic">
              Note: Si aucun lien n'est renseigné, le site simulera un paiement réussi pour permettre la validation.
            </p>
          </CardContent>
        </Card>

        {/* Supabase Section */}
        <Card className="flex flex-col border-blue-200">
          <CardHeader className="bg-blue-50 border-b border-blue-100">
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <Upload className="w-5 h-5" /> Base de données (Supabase)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 flex-1 space-y-4">
            <div className="flex items-center gap-2 py-2">
              <div className={`w-3 h-3 rounded-full ${supabase ? 'bg-green-500 shadow-lg shadow-green-200' : 'bg-red-500'}`}></div>
              <span className="font-bold text-sm">{supabase ? 'Connecté à Supabase' : 'Déconnecté (Vérifiez Vercel Envs)'}</span>
            </div>
            <p className="text-sm text-gray-600">
              <strong>Synchronisation du catalogue :</strong> Les tours sont stockés localement par défaut. Utilisez le bouton "Synchro Database" dans le catalogue pour les monter sur le cloud.
            </p>
            <div className="bg-blue-900 p-4 rounded-lg text-white text-[11px] font-mono">
              # SQL requis pour le catalogue tours
              CREATE TABLE tours (...);
              ALTER TABLE tours ENABLE RLS;
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Main App
export default function AdminApp() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [tours, setTours] = useState<Tour[]>(() => {
    const saved = localStorage.getItem('td-tours');
    return saved ? JSON.parse(saved) : mockTours;
  });
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [guidePhoto, setGuidePhoto] = useState(() => localStorage.getItem('td-guide-photo') || '/guide-antoine.jpg');

  const profileFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const session = localStorage.getItem('td-admin-session');
    if (session && Date.now() - parseInt(session) < 8 * 60 * 60 * 1000) {
      setIsLoggedIn(true);
    }

    // Fetch reservations
    if (supabase) {
      supabase.from('reservations').select('*').order('created_at', { ascending: false })
        .then(({ data, error }) => {
          if (!error && data) {
            // Map DB fields to interface if needed (snake_case to camelCase)
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
      supabase.from('tours').select('*')
        .then(({ data, error }) => {
          if (!error && data && data.length > 0) {
            const mapped = data.map(t => ({
              id: t.id,
              title: t.title,
              subtitle: t.subtitle,
              description: t.description,
              duration: t.duration,
              groupSize: t.group_size,
              price: t.price,
              image: t.image,
              category: t.category,
              highlights: t.highlights,
              isActive: t.is_active,
              stripeLink: t.stripe_link || ''
            }));
            setTours(mapped);
          }
        });

      // Fetch Profile Photo from site_config
      supabase.from('site_config').select('value').eq('key', 'guide_profile').single()
        .then(({ data, error }) => {
          if (!error && data && data.value) {
            const val = data.value as { photo: string };
            if (val.photo) setGuidePhoto(val.photo);
          }
        });
    } else {
      console.warn('Supabase client not initialized. Skipping data fetch.');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('td-tours', JSON.stringify(tours));
  }, [tours]);

  useEffect(() => {
    localStorage.setItem('td-guide-photo', guidePhoto);
  }, [guidePhoto]);

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
          toast.success("Photo de profil prête à être enregistrée");
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const saveProfile = async () => {
    try {
      localStorage.setItem('td-guide-photo', guidePhoto);

      if (supabase) {
        const { error } = await supabase.from('site_config').upsert({
          key: 'guide_profile',
          value: { photo: guidePhoto },
          updated_at: new Date().toISOString()
        });

        if (error) {
          console.error('Profile save error:', error);
          toast.error("Sauvegarde cloud échouée (Table site_config manquante ?)");
        } else {
          toast.success("Profil mis à jour (Cloud & Local)");
        }
      } else {
        toast.success("Profil mis à jour localement");
      }
    } catch (error) {
      console.error('Storage error:', error);
      toast.error("Erreur lors de la sauvegarde : le stockage est peut-être plein");
    }
  };

  if (!isLoggedIn) return <Login onLogin={() => setIsLoggedIn(true)} />;

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'reservations', label: 'Réservations', icon: Calendar },
    { id: 'tours', label: 'Catalogue', icon: MapPin },
    { id: 'reviews', label: 'Avis clients', icon: Star },
    { id: 'profile', label: 'Mon Profil', icon: User },
    { id: 'config', label: 'Configuration', icon: Bell },
  ];

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gray-100 overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
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
          <button onClick={() => setIsLoggedIn(false)} className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {(isSidebarOpen || window.innerWidth < 1024) && <span>Déconnexion</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-hidden w-full">
        <header className="h-16 bg-white border-b border-gray-200 px-4 sm:px-8 flex items-center justify-between flex-shrink-0 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden text-gray-500 p-1 hover:bg-gray-100 rounded-lg"
            >
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
            {activeTab === 'config' && <Config />}
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
                          <p className="text-xs text-gray-500">Vous pouvez soit entrer une URL, soit télécharger un fichier depuis votre disque.</p>
                        </div>
                      </div>

                      <div className="pt-4 flex gap-3">
                        <Button className="flex-1 bg-amber-600" onClick={saveProfile}>
                          <Check className="w-4 h-4 mr-2" /> Enregistrer le profil
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
    </div>
  );
}
