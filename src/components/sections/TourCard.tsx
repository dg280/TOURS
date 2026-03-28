import { Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

import type { Tour } from "@/lib/types";
import type { Language, Translations } from "@/lib/translations";

interface TourCardProps {
  tour: Tour;
  index: number;
  lang: Language;
  t: Translations;
  onClick: () => void;
}

export const TourCard = ({ tour, index, lang, t, onClick }: TourCardProps) => {
  return (
    <div
      onClick={onClick}
      className="relative group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col cursor-pointer"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="relative overflow-hidden">
        <img
          src={tour.image}
          alt={
            lang === "en"
              ? tour.title_en || tour.title
              : lang === "es"
                ? tour.title_es || tour.title
                : tour.title
          }
          className="w-full h-auto group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="p-5 flex-1 flex flex-col">
        <p className="text-xs text-amber-600 font-medium uppercase tracking-wide mb-1">
          {lang === "en"
            ? tour.subtitle_en || tour.subtitle
            : lang === "es"
              ? tour.subtitle_es || tour.subtitle
              : tour.subtitle}
        </p>
        <h3 className="text-lg font-bold text-gray-900 mb-2">
          {lang === "en"
            ? tour.title_en || tour.title
            : lang === "es"
              ? tour.title_es || tour.title
              : tour.title}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {lang === "en"
            ? tour.description_en || tour.description
            : lang === "es"
              ? tour.description_es || tour.description
              : tour.description}
        </p>

        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {(t.tours.duration_labels as Record<string, string>)[
              tour.duration
            ] || tour.duration}
          </span>
          <span className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            {tour.groupSize}
          </span>
        </div>

        <div className="mb-4">
          <div className="flex flex-wrap gap-1">
            {(lang === "en"
              ? tour.highlights_en || tour.highlights
              : lang === "es"
                ? tour.highlights_es || tour.highlights
                : tour.highlights
            ).map((highlight, i) => (
              <span
                key={i}
                className="text-xs bg-amber-50 text-amber-700 px-2 py-1 rounded"
              >
                {highlight}
              </span>
            ))}
          </div>
        </div>

        <Button className="w-full mt-auto bg-[#c9a961] hover:bg-[#b8944e] text-white rounded-2xl h-14 font-bold transition-all active:scale-95 shadow-lg shadow-[#c9a961]/20">
          {t.tours.learn_more}
        </Button>
      </div>
    </div>
  );
};
