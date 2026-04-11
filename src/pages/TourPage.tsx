import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppContext } from "@/contexts/useAppContext";
import { tourIdForSlug, slugForTour } from "@/lib/tour-slugs";
import { TourStructuredData } from "@/components/TourStructuredData";
import { TourDialog } from "@/components/sections/TourDialog";
import { useTourState } from "@/hooks/useTourState";

/**
 * /tours/:slug — Dedicated tour page.
 *
 * Opens the tour dialog full-screen on a clean page. When closed,
 * navigates back to home. SEO: unique title + description + structured
 * data per tour, indexable by Google.
 */
export function TourPage() {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const { tours, lang, t } = useAppContext();
    const { handleBookingStart } = useTourState({ tours });

    const tourId = slug ? tourIdForSlug(slug) : null;
    const tour = tourId !== null
        ? tours.find((tr) => Number(tr.id) === tourId)
        : null;

    // If tour not found, redirect to home
    useEffect(() => {
        if (slug && tours.length > 0 && !tour) {
            navigate("/", { replace: true });
        }
    }, [slug, tours, tour, navigate]);

    // If slug is numeric (old URL), redirect to the real slug
    useEffect(() => {
        if (slug && tour && /^\d+$/.test(slug)) {
            const realSlug = slugForTour(tour.id);
            if (realSlug !== slug) {
                navigate(`/tours/${realSlug}`, { replace: true });
            }
        }
    }, [slug, tour, navigate]);

    if (!tour) return null;

    return (
        <>
            <TourStructuredData tour={tour} lang={lang} t={t} />
            <TourDialog
                tour={tour}
                isOpen={true}
                onOpenChange={(open) => {
                    if (!open) navigate("/");
                }}
                lang={lang}
                t={t}
                onBookNow={handleBookingStart}
            />
        </>
    );
}
