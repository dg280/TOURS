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
  DialogTitle,
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
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Réservations récentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-500">ID</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Client</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Statut</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-500">Montant</th>
                </tr>
              </thead>
              <tbody>
                {recentReservations.map((res) => (
                  <tr key={res.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{res.id}</td>
                    <td className="py-3 px-4">{res.name}</td>
                    <td className="py-3 px-4">{getStatusBadge(res.status)}</td>
                    <td className="py-3 px-4 text-right">{res.totalPrice}€</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button variant="outline" className="h-24 flex flex-col gap-2" onClick={() => setActiveTab('reservations')}>
          <Calendar className="w-6 h-6 text-amber-600" />
          Gérer les réservations
        </Button>
        <Button variant="outline" className="h-24 flex flex-col gap-2" onClick={() => setActiveTab('tours')}>
          <MapPin className="w-6 h-6 text-amber-600" />
          Gérer les tours
        </Button>
        <Button variant="outline" className="h-24 flex flex-col gap-2" onClick={() => setActiveTab('reviews')}>
          <Star className="w-6 h-6 text-amber-600" />
          Modérer les avis
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
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left py-3 px-4">Client</th>
                <th className="text-left py-3 px-4">Date</th>
                <th className="text-left py-3 px-4">Tour</th>
                <th className="text-left py-3 px-4">Statut</th>
                <th className="text-right py-3 px-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(res => (
                <tr key={res.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="font-medium">{res.name}</div>
                    <div className="text-gray-500 text-xs">{res.email}</div>
                  </td>
                  <td className="py-3 px-4">{res.date}</td>
                  <td className="py-3 px-4">{res.tourName}</td>
                  <td className="py-3 px-4">{getStatusBadge(res.status)}</td>
                  <td className="py-3 px-4 text-right">
                    <Button variant="ghost" size="sm" onClick={() => { setSelectedRes(res); setIsDetailOpen(true); }}>Voir</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent>
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

  const saveTour = () => {
    if (editingTour) {
      setTours(prev => {
        const exists = prev.find(t => t.id === editingTour.id);
        if (exists) return prev.map(t => t.id === editingTour.id ? editingTour : t);
        return [...prev, editingTour];
      });
      setIsEditOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Catalogue des Tours</h2>
        <Button onClick={() => {
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
            category: 'Tour',
            isActive: true
          });
          setIsEditOpen(true);
        }}>+ Nouveau Tour</Button>
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
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Édition Tour</DialogTitle>
          </DialogHeader>
          {editingTour && (
            <div className="space-y-4 py-4 overflow-y-auto max-h-[70vh]">
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
              <DialogFooter>
                <Button onClick={saveTour} className="w-full bg-amber-600">Enregistrer</Button>
              </DialogFooter>
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
              <Button size="sm" variant={review.isPublished ? 'outline' : 'default'} onClick={() => setReviews(prev => prev.map(r => r.id === review.id ? { ...r, isPublished: !r.isPublished } : r))}>
                {review.isPublished ? 'Cacher' : 'Publier'}
              </Button>
              <Button size="sm" variant="destructive" onClick={() => setReviews(prev => prev.filter(r => r.id !== review.id))}>Supprimer</Button>
            </div>
          </div>
        </Card>
      ))}
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
  const [reservations, setReservations] = useState<Reservation[]>(mockReservations);
  const [reviews, setReviews] = useState<Review[]>(mockReviews);
  const [guidePhoto, setGuidePhoto] = useState(() => localStorage.getItem('td-guide-photo') || '/guide-antoine.jpg');

  const profileFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const session = localStorage.getItem('td-admin-session');
    if (session && Date.now() - parseInt(session) < 8 * 60 * 60 * 1000) {
      setIsLoggedIn(true);
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

  const saveProfile = () => {
    try {
      localStorage.setItem('td-guide-photo', guidePhoto);
      toast.success("Profil mis à jour avec succès");
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
  ];

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <aside className={`bg-gray-900 border-r border-gray-800 transition-all duration-300 flex flex-col ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="p-6 flex items-center justify-between">
          <div className={`flex items-center gap-3 transition-opacity ${isSidebarOpen ? 'opacity-100' : 'opacity-0 h-0 w-0'}`}>
            <Compass className="w-8 h-8 text-amber-500" />
            <span className="text-white font-bold text-lg">Admin</span>
          </div>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-gray-400 hover:text-white">
            {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        <nav className="flex-1 mt-6 px-4 space-y-2">
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === item.id ? 'bg-amber-600 text-white shadow-lg shadow-amber-900/20' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {isSidebarOpen && <span className="font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button onClick={() => setIsLoggedIn(false)} className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
            <LogOut className="w-5 h-5" />
            {isSidebarOpen && <span>Déconnexion</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-gray-200 px-8 flex items-center justify-between flex-shrink-0">
          <h2 className="text-xl font-bold text-gray-800">{menuItems.find(m => m.id === activeTab)?.label}</h2>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold">Antoine Pilard</p>
              <p className="text-xs text-gray-500">Administrateur</p>
            </div>
            <div className="w-10 h-10 rounded-full border border-gray-200 overflow-hidden shadow-sm hover:ring-2 hover:ring-amber-500 transition-all cursor-pointer">
              <img src={guidePhoto} className="w-full h-full object-cover" alt="Profile" />
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto">
            {activeTab === 'dashboard' && <Dashboard reservations={reservations} setActiveTab={setActiveTab} />}
            {activeTab === 'reservations' && <Reservations reservations={reservations} setReservations={setReservations} />}
            {activeTab === 'tours' && <ToursManagement tours={tours} setTours={setTours} />}
            {activeTab === 'reviews' && <Reviews reviews={reviews} setReviews={setReviews} />}
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
