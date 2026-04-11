import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/contexts/useAppContext";

export function NotFoundPage() {
    const { t } = useAppContext();

    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6">
            <MapPin className="w-16 h-16 text-amber-500 mb-6" />
            <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
            <p className="text-xl text-gray-600 mb-2 max-w-md">
                {t.nav.tours === "Our Tours"
                    ? "This page doesn't exist. Maybe the trail leads elsewhere?"
                    : t.nav.tours === "Nuestros Tours"
                      ? "Esta página no existe. ¿Quizás el camino lleva a otro lugar?"
                      : "Cette page n'existe pas. Le sentier mène peut-être ailleurs ?"}
            </p>
            <p className="text-gray-400 mb-8">
                Tours & Detours Barcelona
            </p>
            <Link to="/">
                <Button className="bg-[#c9a961] hover:bg-[#b8944e] text-white rounded-xl h-14 px-8 font-bold text-lg shadow-lg shadow-[#c9a961]/20">
                    {t.nav.home || "Home"} →
                </Button>
            </Link>
        </div>
    );
}
