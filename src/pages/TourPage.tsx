import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppContext } from "@/contexts/useAppContext";
import { tourForSlug, slugForTour } from "@/lib/tour-slugs";
import { TourStructuredData } from "@/components/TourStructuredData";
import { TourDialog } from "@/components/sections/TourDialog";
import type { Tour } from "@/lib/types";

/**
 * /tours/:slug — Dedicated tour page.
 *
 * Opens the tour dialog full-screen. When closed, navigates home.
 * "Book Now" navigates to / with state.bookTourId so App opens BookingModal.
 *
 * Slug is auto-generated from tour.title_en. Numeric IDs and legacy
 * slugs are redirected to the canonical slug.
 */
export function TourPage() {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const { tours, lang, t } = useAppContext();

    const tour = slug ? tourForSlug(slug, tours) : undefined;

    // If tour not found and tours are loaded, redirect to home
    useEffect(() => {
        if (slug && tours.length > 0 && !tour) {
            navigate("/", { replace: true });
        }
    }, [slug, tours, tour, navigate]);

    // If slug doesn't match the canonical slug, redirect to the real one
    // (handles numeric IDs like /tours/1 and legacy aliases)
    useEffect(() => {
        if (tour && slug) {
            const canonical = slugForTour(tour);
            if (canonical !== slug) {
                navigate(`/tours/${canonical}`, { replace: true });
            }
        }
    }, [slug, tour, navigate]);

    if (!tour) return null;

    const handleBookNow = (tourToBook: Tour) => {
        navigate("/", { state: { bookTourId: tourToBook.id } });
    };

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
                onBookNow={handleBookNow}
            />
        </>
    );
}
