import { MapPin, Instagram, Mail } from "lucide-react";
import type { Translations } from "@/lib/translations";

interface FooterProps {
  t: Translations;
  instagramUrl: string;
}

export const Footer = ({ t, instagramUrl }: FooterProps) => {
  return (
    <footer
      className="text-gray-800 pt-32 pb-16 border-t border-gray-200"
      style={{ background: "var(--background-color)" }}
    >
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 mb-24">
          <div className="lg:col-span-5 space-y-10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                <MapPin className="w-6 h-6 text-amber-500" />
              </div>
              <span className="text-3xl font-bold font-serif tracking-tight">
                Tours<span className="text-amber-500">&</span>Detours
              </span>
            </div>
            <p className="text-gray-600 leading-relaxed text-lg max-w-md font-light">
              {t.hero.tagline}. {t.hero.description}
            </p>
            <div className="flex gap-5 pt-4">
              {[
                { icon: Instagram, url: instagramUrl },
                { icon: Mail, url: "mailto:info@toursandetours.com" },
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-14 h-14 rounded-2xl bg-black/5 border border-gray-200 flex items-center justify-center hover:bg-[#c9a961] hover:text-white hover:border-[#c9a961] transition-all duration-500 group"
                >
                  <social.icon className="w-6 h-6 transform group-hover:scale-110 transition-transform" />
                </a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-3 lg:pl-12">
            <h4 className="text-xs font-bold mb-10 text-gray-400 uppercase tracking-[0.3em]">
              Navigation
            </h4>
            <ul className="space-y-6">
              {[
                { label: t.nav.tours, href: "#tours" },
                { label: t.nav.guide, href: "#guide" },
                { label: t.nav.avis, href: "#avis" },
                { label: "Contact", href: "#contact" },
              ].map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-gray-500 hover:text-amber-600 transition-all font-medium text-lg flex items-center gap-2 group"
                  >
                    <span className="w-0 h-[1px] bg-amber-600 group-hover:w-4 transition-all duration-300"></span>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-4 lg:pl-12">
            <h4 className="text-xs font-bold mb-10 text-gray-400 uppercase tracking-[0.3em] font-sans">
              {t.nav.tours}
            </h4>
            <ul className="space-y-6">
              {t.tour_data.slice(0, 4).map((tour) => (
                <li key={tour.id}>
                  <span className="text-gray-500 hover:text-amber-600 transition-all cursor-pointer text-lg font-medium block leading-snug">
                    {tour.title}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-12 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-8 text-gray-500 text-sm">
          <p className="font-light tracking-wide">
            © {new Date().getFullYear()} Tours & Detours Barcelona.{" "}
            <span className="mx-2 opacity-20">|</span> Made with Passion.
          </p>
          <div className="flex gap-10">
            <a href="#legal" className="hover:text-gray-900 transition-colors">
              Mentions légales
            </a>
            <a
              href="#privacy"
              className="hover:text-gray-900 transition-colors"
            >
              Confidentialité
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
