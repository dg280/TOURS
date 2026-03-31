import {
  createContext,
  useState,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";
import {
  translations,
  type Language,
  type Translations,
} from "../lib/translations";
import { supabase } from "../lib/supabase";
import { prepareTourForEditing } from "../lib/utils";
import type { Tour, Testimonial } from "../lib/types";

interface GuideProfile {
  photo: string;
  bio: string;
  instagramUrl: string;
  differentPhotos: [string, string, string];
}

export interface AppContextValue {
  lang: Language;
  setLang: (lang: Language) => void;
  t: Translations;
  tours: Tour[];
  testimonials: Testimonial[];
  guide: GuideProfile;
  legalModal: "legal" | "privacy" | null;
  setLegalModal: (modal: "legal" | "privacy" | null) => void;
  showCookieConsent: boolean;
  setShowCookieConsent: (show: boolean) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

const DEFAULT_GUIDE: GuideProfile = {
  photo: "/guide-portrait.jpg",
  bio: "",
  instagramUrl: "https://www.instagram.com/tours_and_detours_bcn/",
  differentPhotos: [
    "/tour-prepirinees.jpg",
    "/tour-beach.jpg",
    "/tour-camironda.jpg",
  ],
};

function mapDbTour(t: Record<string, unknown>): Tour {
  return prepareTourForEditing({
    id: Number(t.id) || t.id,
    title: t.title as string,
    title_en: t.title_en as string | undefined,
    title_es: t.title_es as string | undefined,
    subtitle: t.subtitle as string,
    subtitle_en: t.subtitle_en as string | undefined,
    subtitle_es: t.subtitle_es as string | undefined,
    description: t.description as string,
    description_en: t.description_en as string | undefined,
    description_es: t.description_es as string | undefined,
    duration: t.duration as string,
    groupSize: t.group_size as string,
    maxCapacity: (t.max_capacity as number) ?? 8,
    price: t.price as number,
    image: t.image as string,
    category: t.category as string | string[],
    highlights: (t.highlights as string[]) ?? [],
    highlights_en: t.highlights_en as string[] | undefined,
    highlights_es: t.highlights_es as string[] | undefined,
    itinerary: t.itinerary as string[] | undefined,
    itinerary_en: t.itinerary_en as string[] | undefined,
    itinerary_es: t.itinerary_es as string[] | undefined,
    included: t.included as string[] | undefined,
    included_en: t.included_en as string[] | undefined,
    included_es: t.included_es as string[] | undefined,
    notIncluded: t.not_included as string[] | undefined,
    notIncluded_en: t.not_included_en as string[] | undefined,
    notIncluded_es: t.not_included_es as string[] | undefined,
    meetingPoint: t.meeting_point as string | undefined,
    meetingPoint_en: t.meeting_point_en as string | undefined,
    meetingPoint_es: t.meeting_point_es as string | undefined,
    meetingPointMapUrl: t.meeting_point_map_url as string | undefined,
    departureTime: (t.departure_time as string) || "",
    estimatedDuration: (t.estimated_duration as string) || "",
    goodToKnow: (t.good_to_know as string[]) || [],
    goodToKnow_en: (t.good_to_know_en as string[]) || [],
    goodToKnow_es: (t.good_to_know_es as string[]) || [],
    images: (t.images as string[]) || [],
    pricing_tiers: (t.pricing_tiers as Record<number, number>) || {},
  }) as Tour;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>("en");
  const [dbTours, setDbTours] = useState<Tour[]>([]);
  const [dbReviews, setDbReviews] = useState<Testimonial[]>([]);
  const [guide, setGuide] = useState<GuideProfile>(DEFAULT_GUIDE);
  const [legalModal, setLegalModal] = useState<"legal" | "privacy" | null>(
    null,
  );
  const [showCookieConsent, setShowCookieConsent] = useState(() => {
    if (typeof window === "undefined") return false;
    return !localStorage.getItem("cookie-consent");
  });

  const t = translations[lang];

  // Sync html lang attribute
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  // Reset cookie consent from URL param (debug)
  useEffect(() => {
    if (window.location.search.includes("reset=true")) {
      localStorage.removeItem("cookie-consent");
      localStorage.removeItem("cookie-preferences");
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  // Fetch all remote data
  useEffect(() => {
    if (!supabase) return;
    const client = supabase;

    const fetchData = async () => {
      try {
        // Tours
        const { data: toursData, error: toursError } = await client
          .from("tours")
          .select("*");
        if (toursError) console.error("Error fetching tours:", toursError);
        else if (toursData && toursData.length > 0) {
          setDbTours(
            toursData.map((t) => mapDbTour(t as Record<string, unknown>)),
          );
        }

        // Reviews
        const { data: reviewsData, error: reviewsError } = await client
          .from("reviews")
          .select("*")
          .eq("is_published", true)
          .order("created_at", { ascending: false });
        if (reviewsError)
          console.error("Error fetching reviews:", reviewsError);
        else if (reviewsData) {
          setDbReviews(
            reviewsData.map((r) => ({
              id: r.id,
              name: r.name,
              loc: r.location,
              rating: r.rating,
              text: r.text,
              avatar:
                r.name.charAt(0).toUpperCase() +
                (r.name.split(" ")[1]?.charAt(0).toUpperCase() || ""),
            })),
          );
        }

        // Site config
        const { data: configData } = await client
          .from("site_config")
          .select("*")
          .eq("key", "main_config")
          .maybeSingle();
        if (configData?.value) {
          const cfg = configData.value as Record<string, string>;
          setGuide((prev) => ({
            ...prev,
            ...(cfg.guide_photo && { photo: cfg.guide_photo }),
            ...(cfg.instagram_url && { instagramUrl: cfg.instagram_url }),
          }));
        }

        // Guide profile
        const { data: profileData } = await client
          .from("site_config")
          .select("*")
          .eq("key", "guide_profile")
          .maybeSingle();
        if (profileData?.value) {
          const p = profileData.value as Record<string, unknown>;
          setGuide((prev) => {
            const bio =
              ((lang === "en"
                ? p.bio_en
                : lang === "es"
                  ? p.bio_es
                  : p.bio || p.bio1) as string) || "";
            const finalBio =
              bio ||
              ((p.bio1 as string) || "") + (p.bio2 ? "\n\n" + p.bio2 : "");
            return {
              photo: (p.photo as string) || prev.photo,
              instagramUrl: (p.instagram as string) || prev.instagramUrl,
              bio: finalBio,
              differentPhotos: (Array.isArray(p.different_photos) &&
              p.different_photos.length === 3
                ? p.different_photos
                : prev.differentPhotos) as [string, string, string],
            };
          });
        }
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    fetchData();
  }, [lang]);

  // Merge base translations tours + db tours + localStorage custom tours
  const customTours = useMemo<Tour[]>(() => {
    const saved = localStorage.getItem("td-tours");
    return saved ? (JSON.parse(saved) as Tour[]) : [];
  }, []);

  const tours = useMemo<Tour[]>(() => {
    const allIds = Array.from(
      new Set([
        ...t.tour_data.map((b: { id: string | number }) => String(b.id)),
        ...dbTours.map((d) => String(d.id)),
        ...customTours.map((c) => String(c.id)),
      ]),
    );

    return allIds.map((id) => {
      const base = t.tour_data.find(
        (b: { id: string | number }) => String(b.id) === id,
      ) as Partial<Tour> | undefined;
      const db = dbTours.find((d) => String(d.id) === id);
      const custom = customTours.find((c) => String(c.id) === id);

      const getVal = <T,>(baseVal: T, dbVal: T, customVal: T): T => {
        const val = customVal ?? dbVal ?? baseVal;
        if (Array.isArray(val)) return (val.length > 0 ? val : baseVal) as T;
        if (typeof val === "string")
          return (val.trim() !== "" ? val : baseVal) as T;
        return (val ?? baseVal) as T;
      };

      const effectiveBase = base || db || custom;
      const bObj = (base || {}) as Partial<Tour>;
      const dObj = (db || {}) as Partial<Tour>;
      const cObj = (custom || {}) as Partial<Tour>;

      const tour: Tour = {
        ...(effectiveBase as Tour),
        id,
        title: getVal(bObj.title, dObj.title, cObj.title) || "",
        subtitle: getVal(bObj.subtitle, dObj.subtitle, cObj.subtitle) || "",
        description:
          getVal(bObj.description, dObj.description, cObj.description) || "",
        highlights:
          getVal(bObj.highlights, dObj.highlights, cObj.highlights) || [],
        itinerary: getVal(bObj.itinerary, dObj.itinerary, cObj.itinerary),
        included: getVal(bObj.included, dObj.included, cObj.included),
        notIncluded: getVal(
          bObj.notIncluded,
          dObj.notIncluded,
          cObj.notIncluded,
        ),
        meetingPoint: getVal(
          bObj.meetingPoint,
          dObj.meetingPoint,
          cObj.meetingPoint,
        ),
        price: dObj.price ?? cObj.price ?? bObj.price ?? 0,
        image: getVal(bObj.image, dObj.image, cObj.image) || "",
        images: getVal(bObj.images, dObj.images, cObj.images) || [],
        duration: getVal(bObj.duration, dObj.duration, cObj.duration) || "",
        groupSize: getVal(bObj.groupSize, dObj.groupSize, cObj.groupSize) || "",
        category: getVal(bObj.category, dObj.category, cObj.category) || "",
        pricing_tiers:
          dObj.pricing_tiers || cObj.pricing_tiers || bObj.pricing_tiers || {},
        goodToKnow:
          getVal(bObj.goodToKnow, dObj.goodToKnow, cObj.goodToKnow) || [],
        goodToKnow_en:
          dObj.goodToKnow_en ?? cObj.goodToKnow_en ?? bObj.goodToKnow_en ?? [],
        goodToKnow_es:
          dObj.goodToKnow_es ?? cObj.goodToKnow_es ?? bObj.goodToKnow_es ?? [],
        maxCapacity:
          dObj.maxCapacity ?? cObj.maxCapacity ?? bObj.maxCapacity ?? 8,
        departureTime:
          dObj.departureTime || cObj.departureTime || bObj.departureTime || "",
        estimatedDuration:
          dObj.estimatedDuration ||
          cObj.estimatedDuration ||
          bObj.estimatedDuration ||
          "",
        meetingPointMapUrl:
          dObj.meetingPointMapUrl ||
          cObj.meetingPointMapUrl ||
          bObj.meetingPointMapUrl ||
          "",
        title_en: dObj.title_en || cObj.title_en || bObj.title_en || "",
        title_es: dObj.title_es || cObj.title_es || bObj.title_es || "",
        subtitle_en:
          dObj.subtitle_en || cObj.subtitle_en || bObj.subtitle_en || "",
        subtitle_es:
          dObj.subtitle_es || cObj.subtitle_es || bObj.subtitle_es || "",
        highlights_en:
          dObj.highlights_en ?? cObj.highlights_en ?? bObj.highlights_en ?? [],
        highlights_es:
          dObj.highlights_es ?? cObj.highlights_es ?? bObj.highlights_es ?? [],
        itinerary_en:
          dObj.itinerary_en ?? cObj.itinerary_en ?? bObj.itinerary_en,
        itinerary_es:
          dObj.itinerary_es ?? cObj.itinerary_es ?? bObj.itinerary_es,
        included_en: dObj.included_en ?? cObj.included_en ?? bObj.included_en,
        included_es: dObj.included_es ?? cObj.included_es ?? bObj.included_es,
        notIncluded_en:
          dObj.notIncluded_en ?? cObj.notIncluded_en ?? bObj.notIncluded_en,
        notIncluded_es:
          dObj.notIncluded_es ?? cObj.notIncluded_es ?? bObj.notIncluded_es,
        meetingPoint_en:
          dObj.meetingPoint_en ||
          cObj.meetingPoint_en ||
          bObj.meetingPoint_en ||
          "",
        meetingPoint_es:
          dObj.meetingPoint_es ||
          cObj.meetingPoint_es ||
          bObj.meetingPoint_es ||
          "",
        isActive: dObj.isActive ?? cObj.isActive ?? bObj.isActive,
        stripeLink: dObj.stripeLink || cObj.stripeLink || bObj.stripeLink || "",
      };

      if (lang === "en") {
        return {
          ...tour,
          title:
            getVal(bObj.title, db?.title_en, custom?.title_en) || tour.title,
          subtitle:
            getVal(bObj.subtitle, db?.subtitle_en, custom?.subtitle_en) ||
            tour.subtitle,
          description:
            getVal(
              bObj.description,
              db?.description_en,
              custom?.description_en,
            ) || tour.description,
          highlights:
            getVal(bObj.highlights, db?.highlights_en, custom?.highlights_en) ||
            tour.highlights,
          itinerary: getVal(
            bObj.itinerary,
            db?.itinerary_en,
            custom?.itinerary_en,
          ),
          included: getVal(bObj.included, db?.included_en, custom?.included_en),
          notIncluded: getVal(
            bObj.notIncluded,
            db?.notIncluded_en,
            custom?.notIncluded_en,
          ),
          meetingPoint: getVal(
            bObj.meetingPoint,
            db?.meetingPoint_en,
            custom?.meetingPoint_en,
          ),
        };
      } else if (lang === "es") {
        return {
          ...tour,
          title:
            getVal(bObj.title, db?.title_es, custom?.title_es) || tour.title,
          subtitle:
            getVal(bObj.subtitle, db?.subtitle_es, custom?.subtitle_es) ||
            tour.subtitle,
          description:
            getVal(
              bObj.description,
              db?.description_es,
              custom?.description_es,
            ) || tour.description,
          highlights:
            getVal(bObj.highlights, db?.highlights_es, custom?.highlights_es) ||
            tour.highlights,
          itinerary: getVal(
            bObj.itinerary,
            db?.itinerary_es,
            custom?.itinerary_es,
          ),
          included: getVal(bObj.included, db?.included_es, custom?.included_es),
          notIncluded: getVal(
            bObj.notIncluded,
            db?.notIncluded_es,
            custom?.notIncluded_es,
          ),
          meetingPoint: getVal(
            bObj.meetingPoint,
            db?.meetingPoint_es,
            custom?.meetingPoint_es,
          ),
        };
      }
      return tour;
    });
  }, [t, dbTours, customTours, lang]);

  const testimonials =
    dbReviews.length > 0
      ? dbReviews
      : ((t as Translations & { testimonials_data?: Testimonial[] })
          .testimonials_data ?? []);

  return (
    <AppContext.Provider
      value={{
        lang,
        setLang,
        t,
        tours,
        testimonials,
        guide,
        legalModal,
        setLegalModal,
        showCookieConsent,
        setShowCookieConsent,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export { AppContext };
