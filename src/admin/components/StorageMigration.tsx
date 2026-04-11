import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle2, AlertCircle, RefreshCw, HardDrive, ArrowRight, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import type { Reservation } from "@/lib/types";

interface StorageMigrationProps {
  tours: { id: string | number; image: string; images?: string[]; stops?: { image?: string }[] }[];
  reservations: Reservation[];
}

interface ImageEntry {
  url: string;
  source: string; // e.g. "Tour 1 — image", "Tour 1 — images[2]"
  path: string;   // Supabase storage path extracted from URL
  status: "pending" | "processing" | "done" | "error";
  error?: string;
}

const SUPABASE_STORAGE_PATTERN = /supabase\.co\/storage\/v1\/object\/public\/tour_images\//;

function extractStoragePath(url: string): string | null {
  const match = url.match(/\/storage\/v1\/object\/public\/tour_images\/(.+)$/);
  return match ? match[1] : null;
}

function isSupabaseStorageUrl(url: string): boolean {
  return SUPABASE_STORAGE_PATTERN.test(url);
}

/** Scan tours for all Supabase Storage URLs */
function scanImages(tours: StorageMigrationProps["tours"]): ImageEntry[] {
  const entries: ImageEntry[] = [];
  const seen = new Set<string>();

  for (const tour of tours) {
    // Primary image
    if (tour.image && isSupabaseStorageUrl(tour.image) && !seen.has(tour.image)) {
      seen.add(tour.image);
      const path = extractStoragePath(tour.image);
      if (path) entries.push({ url: tour.image, source: `Tour ${tour.id} — image`, path, status: "pending" });
    }

    // Gallery images
    if (tour.images) {
      for (let i = 0; i < tour.images.length; i++) {
        const img = tour.images[i];
        if (img && isSupabaseStorageUrl(img) && !seen.has(img)) {
          seen.add(img);
          const path = extractStoragePath(img);
          if (path) entries.push({ url: img, source: `Tour ${tour.id} — images[${i}]`, path, status: "pending" });
        }
      }
    }

    // Stop images
    if (tour.stops) {
      for (let i = 0; i < tour.stops.length; i++) {
        const stop = tour.stops[i];
        if (stop?.image && isSupabaseStorageUrl(stop.image) && !seen.has(stop.image)) {
          seen.add(stop.image);
          const path = extractStoragePath(stop.image);
          if (path) entries.push({ url: stop.image, source: `Tour ${tour.id} — stop[${i}]`, path, status: "pending" });
        }
      }
    }
  }

  return entries;
}

/**
 * Re-upload a Supabase Storage image on top of itself with aggressive
 * Cache-Control headers. This doesn't change the URL — it just tells
 * Supabase's CDN (and browsers) to cache the image for 1 year.
 * The browser fetches it once from Supabase, then never again.
 */
async function addCacheToImage(path: string): Promise<void> {
  if (!supabase) throw new Error("Supabase non disponible");

  // 1. Download the image from Supabase Storage
  const { data: blob, error: downloadError } = await supabase.storage
    .from("tour_images")
    .download(path);

  if (downloadError || !blob) {
    throw new Error(`Download failed: ${downloadError?.message || "no data"}`);
  }

  // 2. Re-upload with cacheControl + upsert (overwrites the same path)
  const { error: uploadError } = await supabase.storage
    .from("tour_images")
    .upload(path, blob, {
      upsert: true,
      cacheControl: "31536000", // 1 year
      contentType: blob.type || "image/jpeg",
    });

  if (uploadError) {
    throw new Error(`Upload failed: ${uploadError.message}`);
  }
}

export function StorageMigration({ tours }: StorageMigrationProps) {
  const [entries, setEntries] = useState<ImageEntry[]>(() => scanImages(tours));
  const [isRunning, setIsRunning] = useState(false);

  const stats = useMemo(() => {
    const done = entries.filter((e) => e.status === "done").length;
    const errors = entries.filter((e) => e.status === "error").length;
    const pending = entries.filter((e) => e.status === "pending").length;
    return { total: entries.length, done, errors, pending };
  }, [entries]);

  const rescan = () => {
    setEntries(scanImages(tours));
    toast.info("Scan terminé");
  };

  const processOne = async (index: number) => {
    setEntries((prev) =>
      prev.map((e, i) => (i === index ? { ...e, status: "processing" } : e)),
    );

    try {
      await addCacheToImage(entries[index].path);
      setEntries((prev) =>
        prev.map((e, i) => (i === index ? { ...e, status: "done" } : e)),
      );
    } catch (err) {
      setEntries((prev) =>
        prev.map((e, i) =>
          i === index ? { ...e, status: "error", error: (err as Error).message } : e,
        ),
      );
    }
  };

  const processAll = async () => {
    setIsRunning(true);
    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < entries.length; i++) {
      if (entries[i].status === "done") continue;

      setEntries((prev) =>
        prev.map((e, j) => (j === i ? { ...e, status: "processing" } : e)),
      );

      try {
        await addCacheToImage(entries[i].path);
        setEntries((prev) =>
          prev.map((e, j) => (j === i ? { ...e, status: "done" } : e)),
        );
        successCount++;
      } catch (err) {
        setEntries((prev) =>
          prev.map((e, j) =>
            j === i ? { ...e, status: "error", error: (err as Error).message } : e,
          ),
        );
        errorCount++;
      }

      // Tiny delay to avoid hammering Supabase
      await new Promise((r) => setTimeout(r, 300));
    }

    setIsRunning(false);
    toast.success(`Migration terminée : ${successCount} OK, ${errorCount} erreurs`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <HardDrive className="w-5 h-5 text-amber-600" />
            Migration Storage
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Ajoute un cache longue durée (1 an) sur les images Supabase Storage
            pour réduire l'egress bandwidth.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={rescan} disabled={isRunning}>
            <RefreshCw className="w-4 h-4 mr-2" /> Re-scanner
          </Button>
          <Button
            onClick={processAll}
            disabled={isRunning || stats.pending === 0}
            className="bg-[#c9a961] hover:bg-[#b8944e] text-white gap-2"
          >
            {isRunning ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <ArrowRight className="w-4 h-4" />
            )}
            {isRunning ? "Migration en cours..." : `Migrer tout (${stats.pending})`}
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card>
          <CardContent className="p-4 text-center">
            <ImageIcon className="w-5 h-5 mx-auto mb-1 text-gray-400" />
            <p className="text-2xl font-bold">{stats.total}</p>
            <p className="text-xs text-gray-500">Images Supabase</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircle2 className="w-5 h-5 mx-auto mb-1 text-green-600" />
            <p className="text-2xl font-bold text-green-600">{stats.done}</p>
            <p className="text-xs text-gray-500">Cache ajouté</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <AlertCircle className="w-5 h-5 mx-auto mb-1 text-red-500" />
            <p className="text-2xl font-bold text-red-500">{stats.errors}</p>
            <p className="text-xs text-gray-500">Erreurs</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Loader2 className="w-5 h-5 mx-auto mb-1 text-amber-500" />
            <p className="text-2xl font-bold text-amber-500">{stats.pending}</p>
            <p className="text-xs text-gray-500">En attente</p>
          </CardContent>
        </Card>
      </div>

      {/* How it works */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Comment ça marche ?</CardTitle>
          <CardDescription className="text-xs">
            Chaque image Supabase est téléchargée puis ré-uploadée par-dessus elle-même
            avec un header <code>Cache-Control: 31536000</code> (1 an). L'URL ne change pas.
            Les navigateurs et le CDN Supabase cachent ensuite l'image localement —
            plus d'egress bandwidth consommé après la 1ère visite.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Image list */}
      {entries.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-gray-400 italic">
            Aucune image Supabase Storage détectée dans les tours.
            Toutes les images utilisent déjà des chemins statiques (/public/).
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Source</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500 hidden md:table-cell">Chemin Storage</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-500">Statut</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-500">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((entry, i) => (
                    <tr key={entry.path} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 text-gray-900 font-medium">
                        {entry.source}
                      </td>
                      <td className="py-3 px-4 text-gray-500 text-xs truncate max-w-[300px] hidden md:table-cell" title={entry.path}>
                        {entry.path}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {entry.status === "done" && (
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle2 className="w-3 h-3 mr-1" /> OK
                          </Badge>
                        )}
                        {entry.status === "pending" && (
                          <Badge variant="outline">En attente</Badge>
                        )}
                        {entry.status === "processing" && (
                          <Badge className="bg-amber-100 text-amber-800">
                            <Loader2 className="w-3 h-3 mr-1 animate-spin" /> Migration...
                          </Badge>
                        )}
                        {entry.status === "error" && (
                          <Badge className="bg-red-100 text-red-800" title={entry.error}>
                            <AlertCircle className="w-3 h-3 mr-1" /> Erreur
                          </Badge>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {(entry.status === "pending" || entry.status === "error") && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => processOne(i)}
                            disabled={isRunning}
                          >
                            Migrer
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
