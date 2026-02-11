import { useState, useEffect } from 'react';
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
  TrendingUp,
  Euro,
  Compass,
  CheckIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

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

// Mock Data - Tours&Detours
const mockTours: Tour[] = [
  {
    id: '1',
    title: 'Girona & Costa Brava',
    subtitle: 'Medieval Footsteps and Coastal Paths',
    description: 'Un voyage immersif du Quartier Juif médiéval de Girona aux villages pittoresques de la Costa Brava.',
    duration: '9.5 heures',
    groupSize: '2-16 personnes',
    price: 145,
    image: '/tour-girona.jpg',
    category: 'Culture & Nature',
    highlights: ['Girona Jewish Quarter', 'Peratallada & Pals', 'Camí de Ronda', 'Dégustation turrón'],
    isActive: true
  },
  {
    id: '2',
    title: 'Barcelona Hidden Corners',
    subtitle: 'Old City Walking Tour',
    description: 'Une exploration slow-travel des quartiers Gothique et Born, dévoilant l\'histoire et les légendes.',
    duration: '3 heures',
    groupSize: '2-12 personnes',
    price: 55,
    image: '/tour-barcelona-hidden.jpg',
    category: 'Culture',
    highlights: ['Gothic Quarter', 'El Born', 'Histoires locales', 'Routes authentiques'],
    isActive: true
  },
  {
    id: '3',
    title: 'Hike the Camí de Ronda',
    subtitle: 'Costa Brava Coastal Trail',
    description: 'Une randonnée spectaculaire sur l\'un des sentiers les plus emblématiques de Catalogne.',
    duration: '6 heures',
    groupSize: '4-12 personnes',
    price: 85,
    image: '/tour-camironda.jpg',
    category: 'Randonnée',
    highlights: ['Criques cachées', 'Observation faune', 'Déjeuner marin', 'Vues panoramiques'],
    isActive: true
  },
  {
    id: '4',
    title: 'Medieval Villages Hike',
    subtitle: 'Pre-Pyrenees Discovery',
    description: 'Une randonnée immersive dans les villages médiévaux et chapelles romanes des Pré-Pyrénées.',
    duration: '7 heures',
    groupSize: '4-10 personnes',
    price: 95,
    image: '/tour-prepirinees.jpg',
    category: 'Randonnée & Patrimoine',
    highlights: ['Villages médiévaux', 'Chapelles romanes', 'Vallées forestières', 'Faune locale'],
    isActive: true
  },
  {
    id: '5',
    title: 'Kayak Costa Brava',
    subtitle: 'Sea Caves & Hidden Coves',
    description: 'Une expérience en kayak guidée explorant grottes marines et falaises escarpées.',
    duration: '4 heures',
    groupSize: '4-12 personnes',
    price: 75,
    image: '/tour-kayak.jpg',
    category: 'Aventure',
    highlights: ['Grottes marines', 'Criques secrètes', 'Vie marine', 'Falaises escarpées'],
    isActive: true
  },
  {
    id: '6',
    title: 'Montserrat & Wine Experience',
    subtitle: 'Spirituality & Catalan Wines',
    description: 'Une journée combinant Montserrat avec une visite de vignoble local et dégustation.',
    duration: '8 heures',
    groupSize: '4-14 personnes',
    price: 125,
    image: '/tour-montserrat.jpg',
    category: 'Culture & Vin',
    highlights: ['Monastère de Montserrat', 'Randonnée panoramique', 'Vignoble familial', 'Dégustation vins'],
    isActive: true
  },
  {
    id: '7',
    title: 'Girona & Collioure',
    subtitle: 'Cross-Border Experience',
    description: 'Deux pays en une journée ! Explorez la culture catalane des deux côtés de la frontière.',
    duration: '10 heures',
    groupSize: '4-12 personnes',
    price: 165,
    image: '/tour-collioure.jpg',
    category: 'Culture & Gastronomie',
    highlights: ['Girona', 'Collioure France', 'Culture transfrontalière', 'Gastronomie'],
    isActive: true
  }
];

const mockReservations: Reservation[] = [
  {
    id: 'RES-001',
    name: 'Marie Dupont',
    email: 'marie.dupont@email.com',
    phone: '+33 6 12 34 56 78',
    tourId: '1',
    tourName: 'Girona & Costa Brava',
    date: '2024-03-15',
    participants: 2,
    status: 'confirmed',
    message: 'Nous sommes très excités de découvrir la Costa Brava !',
    createdAt: '2024-02-10',
    totalPrice: 290
  },
  {
    id: 'RES-002',
    name: 'John Smith',
    email: 'john.smith@email.com',
    phone: '+44 7 89 01 23 45',
    tourId: '3',
    tourName: 'Hike the Camí de Ronda',
    date: '2024-03-18',
    participants: 4,
    status: 'pending',
    message: 'First time hiking in Catalonia!',
    createdAt: '2024-02-11',
    totalPrice: 340
  },
  {
    id: 'RES-003',
    name: 'Hans Mueller',
    email: 'hans.mueller@email.de',
    phone: '+49 170 123 4567',
    tourId: '6',
    tourName: 'Montserrat & Wine Experience',
    date: '2024-03-20',
    participants: 2,
    status: 'confirmed',
    message: '',
    createdAt: '2024-02-09',
    totalPrice: 250
  },
  {
    id: 'RES-004',
    name: 'Sophie Laurent',
    email: 'sophie@email.com',
    phone: '+33 6 98 76 54 32',
    tourId: '5',
    tourName: 'Kayak Costa Brava',
    date: '2024-03-22',
    participants: 3,
    status: 'pending',
    message: 'Nous avons des enfants de 12 et 14 ans',
    createdAt: '2024-02-12',
    totalPrice: 225
  },
  {
    id: 'RES-005',
    name: 'Emma Johnson',
    email: 'emma.j@email.com',
    phone: '+1 555 123 4567',
    tourId: '2',
    tourName: 'Barcelona Hidden Corners',
    date: '2024-03-10',
    participants: 2,
    status: 'completed',
    message: 'Amazing experience!',
    createdAt: '2024-02-05',
    totalPrice: 110
  }
];

const mockReviews: Review[] = [
  {
    id: 'REV-001',
    name: 'Marie & Pierre',
    location: 'Paris, France',
    rating: 5,
    text: 'Une expérience inoubliable ! Antoine connaît chaque recoin de la Catalogne.',
    tourId: '1',
    isPublished: true,
    createdAt: '2024-02-08'
  },
  {
    id: 'REV-002',
    name: 'Sarah Johnson',
    location: 'London, UK',
    rating: 5,
    text: 'The Costa Brava hike was absolutely magical. Highly recommended!',
    tourId: '3',
    isPublished: true,
    createdAt: '2024-02-10'
  },
  {
    id: 'REV-003',
    name: 'Hans & Lisa',
    location: 'Berlin, Germany',
    rating: 5,
    text: 'Wir haben den Montserrat Tour gemacht und es war fantastisch!',
    tourId: '6',
    isPublished: false,
    createdAt: '2024-02-11'
  }
];

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
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Tableau de bord</h2>
        <p className="text-gray-500">Vue d'ensemble de votre activité - Tours&Detours</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Réservations totales</p>
                <p className="text-3xl font-bold">{stats.totalReservations}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">En attente</p>
                <p className="text-3xl font-bold">{stats.pendingReservations}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <Bell className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Confirmées</p>
                <p className="text-3xl font-bold">{stats.confirmedReservations}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckIcon className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Revenus (février)</p>
                <p className="text-3xl font-bold">{stats.thisMonthRevenue}€</p>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                <Euro className="w-6 h-6 text-amber-600" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2 text-sm text-green-600">
              <TrendingUp className="w-4 h-4" />
              <span>+15% vs janvier</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Reservations */}
      <Card>
        <CardHeader>
          <CardTitle>Réservations récentes</CardTitle>
          <CardDescription>Les 5 dernières demandes reçues</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-500">ID</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Client</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Tour</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Date</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Statut</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-500">Montant</th>
                </tr>
              </thead>
              <tbody>
                {recentReservations.map((res) => (
                  <tr key={res.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-mono text-sm">{res.id}</td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium">{res.name}</p>
                        <p className="text-sm text-gray-500">{res.email}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">{res.tourName}</td>
                    <td className="py-3 px-4">{new Date(res.date).toLocaleDateString('fr-FR')}</td>
                    <td className="py-3 px-4">{getStatusBadge(res.status)}</td>
                    <td className="py-3 px-4 text-right font-medium">{res.totalPrice}€</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="bg-gradient-to-br from-amber-500 to-orange-600 text-white">
        <CardContent className="p-6">
          <h3 className="font-semibold mb-2">Nouvelle réservation</h3>
          <p className="text-white/80 text-sm mb-4">Ajouter manuellement une réservation</p>
          <Button variant="secondary" className="w-full" onClick={() => setActiveTab('reservations')}>
            Créer une réservation
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
        <CardContent className="p-6">
          <h3 className="font-semibold mb-2">Gérer les tours</h3>
          <p className="text-white/80 text-sm mb-4">Modifier les prix et disponibilités</p>
          <Button variant="secondary" className="w-full" onClick={() => setActiveTab('tours')}>
            Voir les tours
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white">
        <CardContent className="p-6">
          <h3 className="font-semibold mb-2">Avis clients</h3>
          <p className="text-white/80 text-sm mb-4">Modérer les témoignages</p>
          <Button variant="secondary" className="w-full" onClick={() => setActiveTab('reviews')}>
            Voir les avis
          </Button>
        </CardContent>
      </Card>
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
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const filteredReservations = reservations.filter(res => {
    const matchesSearch =
      res.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || res.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const updateStatus = (id: string, newStatus: Reservation['status']) => {
    setReservations(prev => prev.map(res =>
      res.id === id ? { ...res, status: newStatus } : res
    ));
  };

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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Réservations</h2>
          <p className="text-gray-500">Gérez toutes vos réservations</p>
        </div>
        <Button className="bg-amber-600 hover:bg-amber-700">
          + Nouvelle réservation
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Rechercher par nom, email ou ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Filtrer par statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="pending">En attente</SelectItem>
            <SelectItem value="confirmed">Confirmées</SelectItem>
            <SelectItem value="cancelled">Annulées</SelectItem>
            <SelectItem value="completed">Terminées</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Reservations Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">ID</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Client</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Tour</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Date tour</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Participants</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Statut</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredReservations.map((res) => (
                  <tr key={res.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-mono text-sm">{res.id}</td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium">{res.name}</p>
                        <p className="text-sm text-gray-500">{res.email}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm">{res.tourName}</td>
                    <td className="py-3 px-4">{new Date(res.date).toLocaleDateString('fr-FR')}</td>
                    <td className="py-3 px-4">{res.participants}</td>
                    <td className="py-3 px-4">{getStatusBadge(res.status)}</td>
                    <td className="py-3 px-4 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedReservation(res);
                          setIsDetailOpen(true);
                        }}
                      >
                        Voir
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Détails de la réservation</DialogTitle>
            <DialogDescription>
              Réservation {selectedReservation?.id}
            </DialogDescription>
          </DialogHeader>
          {selectedReservation && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-500">Client</Label>
                  <p className="font-medium">{selectedReservation.name}</p>
                </div>
                <div>
                  <Label className="text-gray-500">Email</Label>
                  <p className="font-medium">{selectedReservation.email}</p>
                </div>
                <div>
                  <Label className="text-gray-500">Téléphone</Label>
                  <p className="font-medium">{selectedReservation.phone}</p>
                </div>
                <div>
                  <Label className="text-gray-500">Date du tour</Label>
                  <p className="font-medium">{new Date(selectedReservation.date).toLocaleDateString('fr-FR')}</p>
                </div>
                <div>
                  <Label className="text-gray-500">Participants</Label>
                  <p className="font-medium">{selectedReservation.participants}</p>
                </div>
                <div>
                  <Label className="text-gray-500">Montant total</Label>
                  <p className="font-medium">{selectedReservation.totalPrice}€</p>
                </div>
              </div>
              {selectedReservation.message && (
                <div>
                  <Label className="text-gray-500">Message</Label>
                  <p className="text-sm bg-gray-50 p-3 rounded-lg mt-1">{selectedReservation.message}</p>
                </div>
              )}
              <div>
                <Label className="text-gray-500">Changer le statut</Label>
                <div className="flex gap-2 mt-2">
                  {(['pending', 'confirmed', 'cancelled', 'completed'] as const).map((status) => (
                    <Button
                      key={status}
                      size="sm"
                      variant={selectedReservation.status === status ? 'default' : 'outline'}
                      onClick={() => {
                        updateStatus(selectedReservation.id, status);
                        setSelectedReservation({ ...selectedReservation, status });
                      }}
                    >
                      {status === 'pending' ? 'En attente' :
                        status === 'confirmed' ? 'Confirmer' :
                          status === 'cancelled' ? 'Annuler' : 'Terminer'}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Tours Management Component
function ToursManagement({
  tours,
  setTours
}: {
  tours: Tour[];
  setTours: React.Dispatch<React.SetStateAction<Tour[]>>;
}) {
  const [editingTour, setEditingTour] = useState<Tour | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const toggleActive = (id: string) => {
    setTours(prev => prev.map(tour =>
      tour.id === id ? { ...tour, isActive: !tour.isActive } : tour
    ));
  };

  const saveTour = () => {
    if (editingTour) {
      setTours(prev => {
        const index = prev.findIndex(t => t.id === editingTour.id);
        if (index > -1) {
          return prev.map(tour => tour.id === editingTour.id ? editingTour : tour);
        } else {
          return [...prev, editingTour];
        }
      });
      setIsEditOpen(false);
      setEditingTour(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestion des Tours</h2>
          <p className="text-gray-500">Modifiez vos offres de tours</p>
        </div>
        <Button
          className="bg-amber-600 hover:bg-amber-700"
          onClick={() => {
            setEditingTour({
              id: Math.random().toString(36).substr(2, 9),
              title: '',
              subtitle: '',
              description: '',
              duration: '',
              groupSize: '',
              price: 0,
              image: '',
              highlights: [],
              category: '',
              isActive: true
            });
            setIsEditOpen(true);
          }}
        >
          + Ajouter un tour
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tours.map((tour) => (
          <Card key={tour.id} className={!tour.isActive ? 'opacity-60' : ''}>
            <div className="relative h-40 overflow-hidden rounded-t-lg">
              <img
                src={tour.image}
                alt={tour.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 right-3">
                <Badge className={tour.isActive ? 'bg-green-500' : 'bg-gray-500'}>
                  {tour.isActive ? 'Actif' : 'Inactif'}
                </Badge>
              </div>
              <div className="absolute top-3 left-3">
                <Badge className="bg-white/90 text-gray-800">
                  {tour.category}
                </Badge>
              </div>
            </div>
            <CardContent className="p-4">
              <p className="text-xs text-amber-600 font-medium uppercase mb-1">{tour.subtitle}</p>
              <h3 className="text-base font-bold mb-1">{tour.title}</h3>
              <p className="text-gray-600 text-xs mb-3 line-clamp-2">{tour.description}</p>

              <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                <span>{tour.duration}</span>
                <span>•</span>
                <span>{tour.groupSize}</span>
              </div>

              <div className="flex items-center justify-between">
                <p className="text-xl font-bold text-amber-600">{tour.price}€</p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingTour(tour);
                      setIsEditOpen(true);
                    }}
                  >
                    Modifier
                  </Button>
                  <Button
                    variant={tour.isActive ? 'destructive' : 'outline'}
                    size="sm"
                    onClick={() => toggleActive(tour.id)}
                  >
                    {tour.isActive ? 'Désactiver' : 'Activer'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Modifier le tour</DialogTitle>
          </DialogHeader>
          {editingTour && (
            <div className="space-y-4">
              <div>
                <Label>Titre</Label>
                <Input
                  value={editingTour.title}
                  onChange={(e) => setEditingTour({ ...editingTour, title: e.target.value })}
                />
              </div>
              <div>
                <Label>Sous-titre</Label>
                <Input
                  value={editingTour.subtitle}
                  onChange={(e) => setEditingTour({ ...editingTour, subtitle: e.target.value })}
                />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={editingTour.description}
                  onChange={(e) => setEditingTour({ ...editingTour, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Durée</Label>
                  <Input
                    value={editingTour.duration}
                    onChange={(e) => setEditingTour({ ...editingTour, duration: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Groupe max</Label>
                  <Input
                    value={editingTour.groupSize}
                    onChange={(e) => setEditingTour({ ...editingTour, groupSize: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Prix (€)</Label>
                  <Input
                    type="number"
                    value={editingTour.price}
                    onChange={(e) => setEditingTour({ ...editingTour, price: parseInt(e.target.value) })}
                  />
                </div>
                <div>
                  <Label>Catégorie</Label>
                  <Input
                    value={editingTour.category}
                    onChange={(e) => setEditingTour({ ...editingTour, category: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label>Lien de l'image (URL)</Label>
                <div className="flex gap-2">
                  <Input
                    value={editingTour.image}
                    onChange={(e) => setEditingTour({ ...editingTour, image: e.target.value })}
                    placeholder="/tour-example.jpg"
                    className="flex-1"
                  />
                  {editingTour.image && (
                    <img src={editingTour.image} className="w-10 h-10 object-cover rounded border" alt="Preview" />
                  )}
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEditOpen(false)}>Annuler</Button>
                <Button onClick={saveTour} className="bg-amber-600 hover:bg-amber-700">Enregistrer</Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Reviews Component
function Reviews({
  reviews,
  setReviews
}: {
  reviews: Review[];
  setReviews: React.Dispatch<React.SetStateAction<Review[]>>;
}) {
  const togglePublish = (id: string) => {
    setReviews(prev => prev.map(review =>
      review.id === id ? { ...review, isPublished: !review.isPublished } : review
    ));
  };

  const deleteReview = (id: string) => {
    setReviews(prev => prev.filter(review => review.id !== id));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Avis Clients</h2>
        <p className="text-gray-500">Modérez les témoignages de vos clients</p>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">Tous ({reviews.length})</TabsTrigger>
          <TabsTrigger value="published">Publiés ({reviews.filter(r => r.isPublished).length})</TabsTrigger>
          <TabsTrigger value="pending">En attente ({reviews.filter(r => !r.isPublished).length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {reviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              onToggle={() => togglePublish(review.id)}
              onDelete={() => deleteReview(review.id)}
            />
          ))}
        </TabsContent>

        <TabsContent value="published" className="space-y-4">
          {reviews.filter(r => r.isPublished).map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              onToggle={() => togglePublish(review.id)}
              onDelete={() => deleteReview(review.id)}
            />
          ))}
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          {reviews.filter(r => !r.isPublished).map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              onToggle={() => togglePublish(review.id)}
              onDelete={() => deleteReview(review.id)}
            />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ReviewCard({
  review,
  onToggle,
  onDelete
}: {
  review: Review;
  onToggle: () => void;
  onDelete: () => void;
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center text-amber-700 font-semibold">
              {review.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <p className="font-semibold">{review.name}</p>
              <p className="text-sm text-gray-500">{review.location}</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${i < review.rating ? 'text-amber-500 fill-amber-500' : 'text-gray-300'}`}
              />
            ))}
          </div>
        </div>
        <p className="mt-4 text-gray-700">"{review.text}"</p>
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            {new Date(review.createdAt).toLocaleDateString('fr-FR')}
          </p>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={review.isPublished ? 'outline' : 'default'}
              onClick={onToggle}
            >
              {review.isPublished ? 'Dépublier' : 'Publier'}
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={onDelete}
            >
              Supprimer
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Main Admin App Component
export default function AdminApp() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Data states
  const [reservations, setReservations] = useState<Reservation[]>(mockReservations);
  const [tours, setTours] = useState<Tour[]>(() => {
    const saved = localStorage.getItem('td-tours');
    return saved ? JSON.parse(saved) : mockTours;
  });
  const [reviews, setReviews] = useState<Review[]>(mockReviews);
  const [guidePhoto, setGuidePhoto] = useState(() => {
    return localStorage.getItem('td-guide-photo') || '/guide-antoine.jpg';
  });

  useEffect(() => {
    const session = localStorage.getItem('td-admin-session');
    if (session) {
      const startTime = parseInt(session);
      const eightHours = 8 * 60 * 60 * 1000;
      if (Date.now() - startTime > eightHours) {
        localStorage.removeItem('td-admin-session');
        setIsLoggedIn(false);
      } else {
        setIsLoggedIn(true);
      }
    }
  }, []);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('td-tours', JSON.stringify(tours));
  }, [tours]);

  useEffect(() => {
    localStorage.setItem('td-guide-photo', guidePhoto);
  }, [guidePhoto]);

  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }

  const menuItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
    { id: 'reservations', label: 'Réservations', icon: Calendar },
    { id: 'tours', label: 'Tours', icon: MapPin },
    { id: 'reviews', label: 'Avis', icon: Star },
    { id: 'profile', label: 'Mon Profil', icon: User },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard reservations={reservations} setActiveTab={setActiveTab} />;
      case 'reservations':
        return <Reservations reservations={reservations} setReservations={setReservations} />;
      case 'tours':
        return <ToursManagement tours={tours} setTours={setTours} />;
      case 'reviews':
        return <Reviews reviews={reviews} setReviews={setReviews} />;
      case 'profile':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Profil du Guide</CardTitle>
              <CardDescription>Gérez vos informations personnelles et votre photo</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center gap-4 py-4">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-amber-100 shadow-lg">
                    <img src={guidePhoto} alt="Guide" className="w-full h-full object-cover" />
                  </div>
                  <Badge className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-amber-600">Antoine Pilard</Badge>
                </div>
                <div className="w-full max-w-md space-y-4">
                  <div className="space-y-2">
                    <Label>URL de la photo de profil</Label>
                    <Input
                      value={guidePhoto}
                      onChange={(e) => setGuidePhoto(e.target.value)}
                      placeholder="/guide-antoine.jpg"
                    />
                  </div>
                  <Button className="w-full bg-amber-600 hover:bg-amber-700">Enregistrer les changements</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      default:
        return <Dashboard reservations={reservations} setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside
        className={`bg-gray-900 text-white transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-16'
          }`}
      >
        <div className="p-4 flex items-center justify-between">
          {isSidebarOpen && (
            <div className="flex items-center gap-2">
              <Compass className="w-6 h-6 text-amber-500" />
              <span className="font-serif font-semibold">T&D</span>
            </div>
          )}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1 hover:bg-gray-800 rounded"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        <nav className="mt-6">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 transition-colors ${activeTab === item.id
                ? 'bg-amber-600 text-white'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
            >
              <item.icon className="w-5 h-5" />
              {isSidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4">
          <button
            onClick={() => setIsLoggedIn(false)}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-gray-800 hover:text-white rounded transition-colors"
          >
            <LogOut className="w-5 h-5" />
            {isSidebarOpen && <span>Déconnexion</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              {menuItems.find(item => item.id === activeTab)?.label}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 hover:bg-gray-100 rounded-full">
              <Bell className="w-5 h-5 text-gray-600" />
              {reservations.filter(r => r.status === 'pending').length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full overflow-hidden">
                <img src={guidePhoto} className="w-full h-full object-cover" alt="Profile" />
              </div>
              {isSidebarOpen && (
                <div className="hidden md:block">
                  <p className="text-sm font-medium">Antoine</p>
                  <p className="text-xs text-gray-500">Guide</p>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-6">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
