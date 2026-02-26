import { MapPin, X, Check, CheckCircle2, Info, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import type { Tour } from "@/lib/types";
import type { Language, Translations } from "@/lib/translations";

interface TourDialogProps {
  tour: Tour | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  lang: Language;
  t: Translations;
  onBookNow: (tour: Tour) => void;
}

export const TourDialog = ({
  tour,
  isOpen,
  onOpenChange,
  lang,
  t,
  onBookNow,
}: TourDialogProps) => {
  if (!tour) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        className="w-[95vw] sm:max-w-6xl h-[90vh] p-0 rounded-2xl border-none shadow-2xl overflow-hidden flex flex-col bg-white"
        data-testid="tour-dialog"
      >
        <div className="flex-1 overflow-y-auto no-scrollbar">
          <div className="p-6 sm:p-10">
            <DialogHeader className="mb-8">
              <DialogTitle className="text-3xl sm:text-5xl font-bold mb-2 text-gray-900 tracking-tight">
                {lang === "en"
                  ? tour.title_en || tour.title
                  : lang === "es"
                    ? tour.title_es || tour.title
                    : tour.title}
              </DialogTitle>
              <p className="text-amber-600 font-bold uppercase tracking-widest text-sm">
                {lang === "en"
                  ? tour.subtitle_en || tour.subtitle
                  : lang === "es"
                    ? tour.subtitle_es || tour.subtitle
                    : tour.subtitle}
              </p>
            </DialogHeader>

            <div className="grid lg:grid-cols-3 gap-10">
              <div className="lg:col-span-2 space-y-6">
                <div className="aspect-video rounded-xl overflow-hidden shadow-md bg-gray-100 relative group">
                  {tour.images && tour.images.length > 0 ? (
                    <Carousel className="w-full h-full">
                      <CarouselContent>
                        {tour.images.map((img, i) => (
                          <CarouselItem key={i}>
                            <img
                              src={img}
                              alt={`${tour.title} ${i + 1}`}
                              className="w-full h-full object-cover aspect-video"
                            />
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      {tour.images.length > 1 && (
                        <div className="absolute inset-0 pointer-events-none">
                          <CarouselPrevious className="left-4 pointer-events-auto bg-white/80 hover:bg-white text-gray-900 border-none shadow-lg" />
                          <CarouselNext className="right-4 pointer-events-auto bg-white/80 hover:bg-white text-gray-900 border-none shadow-lg" />
                        </div>
                      )}
                    </Carousel>
                  ) : (
                    <img
                      src={tour.image}
                      alt={tour.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>

                <Tabs defaultValue="desc" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto p-1 bg-amber-50/50 border border-amber-100 rounded-xl">
                    <TabsTrigger
                      value="desc"
                      className="py-2.5 text-xs sm:text-sm"
                    >
                      {t.tours.tabs.desc}
                    </TabsTrigger>
                    <TabsTrigger
                      value="itin"
                      className="py-2.5 text-xs sm:text-sm"
                    >
                      {t.tours.tabs.itin}
                    </TabsTrigger>
                    <TabsTrigger
                      value="incl"
                      className="py-2.5 text-xs sm:text-sm"
                    >
                      {t.tours.tabs.incl}
                    </TabsTrigger>
                    <TabsTrigger
                      value="meet"
                      className="py-2.5 text-xs sm:text-sm"
                    >
                      {t.tours.tabs.meet}
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="desc" className="mt-4 prose prose-amber">
                    <p className="text-gray-600 leading-relaxed text-lg">
                      {lang === "en"
                        ? tour.description_en || tour.description
                        : lang === "es"
                          ? tour.description_es || tour.description
                          : tour.description}
                    </p>
                    <div className="mt-6">
                      <h4 className="font-sans font-bold text-gray-900 mb-4 uppercase tracking-widest text-xs">
                        {t.tour_dialog.highlights_label}
                      </h4>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {(lang === "en"
                          ? tour.highlights_en || tour.highlights
                          : lang === "es"
                            ? tour.highlights_es || tour.highlights
                            : tour.highlights
                        ).map((h, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-gray-600"
                          >
                            <CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </TabsContent>

                  <TabsContent value="itin" className="mt-4">
                    <h4 className="font-sans font-bold text-gray-900 mb-4 uppercase tracking-widest text-xs">
                      {t.tour_dialog.itinerary_label}
                    </h4>
                    <div className="space-y-4">
                      {(lang === "en"
                        ? tour.itinerary_en || tour.itinerary
                        : lang === "es"
                          ? tour.itinerary_es || tour.itinerary
                          : tour.itinerary
                      )?.map((step, i) => (
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

                  <TabsContent
                    value="incl"
                    className="mt-4 grid md:grid-cols-2 gap-8"
                  >
                    <div>
                      <h4 className="font-sans font-bold text-green-700 mb-3 flex items-center gap-2 uppercase tracking-widest text-xs">
                        <Check className="w-5 h-5" />{" "}
                        {t.tour_dialog.included_label}
                      </h4>
                      <ul className="space-y-2">
                        {(lang === "en"
                          ? tour.included_en || tour.included
                          : lang === "es"
                            ? tour.included_es || tour.included
                            : tour.included
                        )?.map((item, i) => (
                          <li
                            key={i}
                            className="text-sm text-gray-600 flex gap-2"
                          >
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-sans font-bold text-red-700 mb-3 flex items-center gap-2 uppercase tracking-widest text-xs">
                        <X className="w-5 h-5" />{" "}
                        {t.tour_dialog.not_included_label}
                      </h4>
                      <ul className="space-y-2">
                        {(lang === "en"
                          ? tour.notIncluded_en || tour.notIncluded
                          : lang === "es"
                            ? tour.notIncluded_es || tour.notIncluded
                            : tour.notIncluded
                        )?.map((item, i) => (
                          <li
                            key={i}
                            className="text-sm text-gray-600 flex gap-2"
                          >
                            <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </TabsContent>

                  <TabsContent
                    value="meet"
                    className="mt-4"
                    data-testid="meet-content"
                  >
                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                      <div className="flex items-start gap-3 mb-4">
                        <MapPin className="w-6 h-6 text-amber-600 shrink-0" />
                        <div className="space-y-3">
                          <p className="text-gray-700 font-medium">
                            {lang === "en"
                              ? tour.meetingPoint_en || tour.meetingPoint
                              : lang === "es"
                                ? tour.meetingPoint_es || tour.meetingPoint
                                : tour.meetingPoint}
                          </p>
                          {tour.meetingPointMapUrl && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 text-xs border-amber-200 text-amber-700 hover:bg-amber-50 hover:text-amber-800"
                              onClick={() =>
                                window.open(tour.meetingPointMapUrl, "_blank")
                              }
                            >
                              <MapPin className="w-3 h-3 mr-2" />
                              {lang === "en"
                                ? "View on Google Maps"
                                : lang === "es"
                                  ? "Ver en Google Maps"
                                  : "Voir sur Google Maps"}
                            </Button>
                          )}
                        </div>
                      </div>
                      {(lang === "en"
                        ? tour.goodToKnow_en
                        : lang === "es"
                          ? tour.goodToKnow_es
                          : tour.goodToKnow
                      )?.length ? (
                        <div className="mt-8 pt-6 border-t border-gray-100">
                          <h4 className="font-sans font-bold text-amber-700 mb-4 flex items-center gap-2 uppercase tracking-widest text-xs">
                            <Sparkles className="w-4 h-4" />{" "}
                            {t.tour_dialog.good_to_know_label}
                          </h4>
                          <div className="grid grid-cols-1 gap-3">
                            {(lang === "en"
                              ? tour.goodToKnow_en
                              : lang === "es"
                                ? tour.goodToKnow_es
                                : tour.goodToKnow
                            )?.map((item, i) => (
                              <div
                                key={i}
                                className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-100 shadow-sm group hover:border-amber-200 transition-colors"
                              >
                                <div className="w-5 h-5 rounded-full bg-amber-50 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-amber-100">
                                  <Info className="w-3 h-3 text-amber-600" />
                                </div>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                  {item}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>

              <div className="lg:col-span-1 border-t lg:border-t-0 lg:border-l pt-10 lg:pt-0 lg:pl-10">
                <div className="sticky top-0 space-y-8">
                  <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100">
                    <p className="text-gray-500 text-sm mb-1">
                      {t.tours.from_price}
                    </p>
                    <div className="flex items-baseline gap-2 mb-6">
                      <span className="text-4xl font-bold text-gray-900">
                        {tour.pricing_tiers &&
                        Object.keys(tour.pricing_tiers).length > 0
                          ? Math.min(...Object.values(tour.pricing_tiers))
                          : tour.price}
                        €
                      </span>
                      <span className="text-gray-500">
                        /{t.tours.per_person}
                      </span>
                    </div>
                    <Button
                      onClick={() => {
                        onOpenChange(false);
                        onBookNow(tour);
                      }}
                      data-testid="book-now-button"
                      className="w-full bg-[#c9a961] hover:bg-[#b8944e] text-white min-h-[64px] py-4 px-2 text-[11px] sm:text-xs font-bold rounded-2xl shadow-xl shadow-[#c9a961]/30 transition-all active:scale-95 flex items-center justify-center text-center leading-tight overflow-hidden uppercase tracking-tighter"
                    >
                      {t.tours.book_now}
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-sans font-bold text-gray-900 uppercase tracking-widest text-xs">
                      {t.tour_dialog.quick_info}
                    </h4>
                    <div className="grid gap-3">
                      <div className="flex items-center gap-3 text-gray-600">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                          <CheckCircle2 className="w-4 h-4 text-amber-600" />
                        </div>
                        <span className="font-medium">
                          {(t.tours.duration_labels as Record<string, string>)[
                            tour.duration
                          ] || tour.duration}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-600">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                          <CheckCircle2 className="w-4 h-4 text-amber-600" />
                        </div>
                        <span>{t.tour_dialog.instant_confirmation}</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-600">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                          <CheckCircle2 className="w-4 h-4 text-amber-600" />
                        </div>
                        <span>{t.tour_dialog.flexible_cancellation}</span>
                      </div>
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
