import { useState, useEffect, useRef, startTransition } from "react";
import type { Tour } from "../lib/types";

interface TourStateOptions {
  tours: Tour[];
}

export function useTourState({ tours }: TourStateOptions) {
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isTourDialogOpen, setIsTourDialogOpen] = useState(false);
  const [viewedTour, setViewedTour] = useState<Tour | null>(null);
  const [isLiveJoinOpen, setIsLiveJoinOpen] = useState(false);
  const hasProcessedDeepLink = useRef(false);

  // Deep linking: ?tour=<id> opens the tour dialog directly
  useEffect(() => {
    if (hasProcessedDeepLink.current || tours.length === 0) return;
    const params = new URLSearchParams(window.location.search);
    const tourId = params.get("tour");
    if (tourId) {
      const target = tours.find((t) => String(t.id) === tourId);
      if (target) {
        hasProcessedDeepLink.current = true;
        startTransition(() => {
          setViewedTour(target);
          setIsTourDialogOpen(true);
        });
      }
    }
  }, [tours]);

  const handleTourClick = (tour: Tour) => {
    setViewedTour(tour);
    setIsTourDialogOpen(true);
  };

  const handleBookingStart = (tour?: Tour, fallback?: Tour) => {
    setSelectedTour(tour ?? fallback ?? null);
    setIsBookingOpen(true);
  };

  return {
    selectedTour,
    isBookingOpen,
    setIsBookingOpen,
    isTourDialogOpen,
    setIsTourDialogOpen,
    viewedTour,
    isLiveJoinOpen,
    setIsLiveJoinOpen,
    handleTourClick,
    handleBookingStart,
  };
}
