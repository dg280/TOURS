import { MapPin, X, Check, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import type { Tour } from '@/lib/types';

interface TourDialogProps {
    tour: Tour | null;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    t: any;
    onBookNow: (tour: Tour) => void;
}

export const TourDialog = ({ tour, isOpen, onOpenChange, t, onBookNow }: TourDialogProps) => {
    if (!tour) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="w-[95vw] sm:max-w-5xl h-[90vh] p-0 rounded-2xl border-none shadow-2xl overflow-hidden flex flex-col bg-white">
                <div className="flex-1 overflow-y-auto custom-scrollbar p-6 sm:p-10">
                    <DialogHeader className="mb-8">
                        <DialogTitle className="text-3xl sm:text-4xl font-serif mb-2 text-gray-900">{tour.title}</DialogTitle>
                        <p className="text-amber-600 font-semibold uppercase tracking-widest text-sm">{tour.subtitle}</p>
                    </DialogHeader>

                    <div className="grid lg:grid-cols-3 gap-10">
                        <div className="lg:col-span-2 space-y-6">
                            <div className="aspect-video rounded-xl overflow-hidden shadow-md">
                                <img
                                    src={tour.image}
                                    alt={tour.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            <Tabs defaultValue="desc" className="w-full">
                                <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto p-1 bg-amber-50/50 border border-amber-100 rounded-xl">
                                    <TabsTrigger value="desc" className="py-2.5 text-xs sm:text-sm">{t.tours.tabs.desc}</TabsTrigger>
                                    <TabsTrigger value="itin" className="py-2.5 text-xs sm:text-sm">{t.tours.tabs.itin}</TabsTrigger>
                                    <TabsTrigger value="incl" className="py-2.5 text-xs sm:text-sm">{t.tours.tabs.incl}</TabsTrigger>
                                    <TabsTrigger value="meet" className="py-2.5 text-xs sm:text-sm">{t.tours.tabs.meet}</TabsTrigger>
                                </TabsList>

                                <TabsContent value="desc" className="mt-4 prose prose-amber">
                                    <p className="text-gray-600 leading-relaxed text-lg">
                                        {tour.description}
                                    </p>
                                    <div className="mt-6">
                                        <h4 className="font-sans font-bold text-gray-900 mb-4 uppercase tracking-widest text-xs">Points forts :</h4>
                                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {tour.highlights.map((h, i) => (
                                                <li key={i} className="flex items-start gap-2 text-gray-600">
                                                    <CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                                                    <span>{h}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </TabsContent>

                                <TabsContent value="itin" className="mt-4">
                                    <div className="space-y-4">
                                        {tour.itinerary?.map((step, i) => (
                                            <div key={i} className="flex gap-4 items-start">
                                                <div className="w-px h-full bg-amber-200 relative">
                                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-amber-500" />
                                                </div>
                                                <div className="pb-4">
                                                    <p className="text-gray-700 font-medium">{step}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </TabsContent>

                                <TabsContent value="incl" className="mt-4 grid md:grid-cols-2 gap-8">
                                    <div>
                                        <h4 className="font-sans font-bold text-green-700 mb-3 flex items-center gap-2 uppercase tracking-widest text-xs">
                                            <Check className="w-5 h-5" /> {t.booking.included_label}
                                        </h4>
                                        <ul className="space-y-2">
                                            {tour.included?.map((item, i) => (
                                                <li key={i} className="text-sm text-gray-600 flex gap-2">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5" />
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="font-sans font-bold text-red-700 mb-3 flex items-center gap-2 uppercase tracking-widest text-xs">
                                            <X className="w-5 h-5" /> {t.booking.not_included_label}
                                        </h4>
                                        <ul className="space-y-2">
                                            {tour.notIncluded?.map((item, i) => (
                                                <li key={i} className="text-sm text-gray-600 flex gap-2">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5" />
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </TabsContent>

                                <TabsContent value="meet" className="mt-4">
                                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                                        <div className="flex items-start gap-3 mb-4">
                                            <MapPin className="w-6 h-6 text-amber-600 shrink-0" />
                                            <p className="text-gray-700 font-medium">{tour.meetingPoint}</p>
                                        </div>
                                        {tour.meetingPointMapUrl ? (
                                            <div className="aspect-video rounded-lg overflow-hidden border border-gray-200">
                                                <iframe
                                                    src={tour.meetingPointMapUrl}
                                                    width="100%"
                                                    height="100%"
                                                    style={{ border: 0 }}
                                                    allowFullScreen
                                                    loading="lazy"
                                                    referrerPolicy="no-referrer-when-downgrade"
                                                ></iframe>
                                            </div>
                                        ) : tour.meetingPoint?.startsWith('https://www.google.com/maps/embed') ? (
                                            <div className="aspect-video rounded-lg overflow-hidden border border-gray-200">
                                                <iframe
                                                    src={tour.meetingPoint}
                                                    width="100%"
                                                    height="100%"
                                                    style={{ border: 0 }}
                                                    allowFullScreen
                                                    loading="lazy"
                                                    referrerPolicy="no-referrer-when-downgrade"
                                                ></iframe>
                                            </div>
                                        ) : tour.meetingPoint?.includes('google.com/maps') ? (
                                            <div className="aspect-video bg-gray-100 rounded-lg flex flex-col items-center justify-center text-gray-600 p-8 text-center border">
                                                <MapPin className="w-8 h-8 mb-2 opacity-50" />
                                                <p className="mb-4">Visualiser sur Google Maps</p>
                                                <Button variant="outline" onClick={() => window.open(tour.meetingPoint, '_blank')}>Ouvrir Maps</Button>
                                            </div>
                                        ) : null}
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </div>

                        <div className="lg:col-span-1 border-t lg:border-t-0 lg:border-l pt-10 lg:pt-0 lg:pl-10">
                            <div className="sticky top-0 space-y-8">
                                <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100">
                                    <p className="text-gray-500 text-sm mb-1">{t.tours.from_price}</p>
                                    <div className="flex items-baseline gap-2 mb-6">
                                        <span className="text-4xl font-bold text-gray-900">{tour.price}€</span>
                                        <span className="text-gray-500">/{t.tours.per_person}</span>
                                    </div>
                                    <Button
                                        onClick={() => {
                                            onOpenChange(false);
                                            onBookNow(tour);
                                        }}
                                        className="w-full bg-amber-600 hover:bg-amber-700 text-white min-h-[64px] py-4 px-2 text-[11px] sm:text-xs font-bold rounded-2xl shadow-xl shadow-amber-600/30 transition-all active:scale-95 flex items-center justify-center text-center leading-tight overflow-hidden uppercase tracking-tighter"
                                    >
                                        {t.tours.book_now}
                                    </Button>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="font-sans font-bold text-gray-900 uppercase tracking-widest text-xs">Infos rapides :</h4>
                                    <div className="grid gap-3">
                                        <div className="flex items-center gap-3 text-gray-600">
                                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"><CheckCircle2 className="w-4 h-4 text-amber-600" /></div>
                                            <span>Confirmation instantanée</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-gray-600">
                                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"><CheckCircle2 className="w-4 h-4 text-amber-600" /></div>
                                            <span>Annulation flexible (24h)</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
