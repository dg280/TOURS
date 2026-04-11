import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle2, AlertCircle, RefreshCw, HardDrive, ArrowRight, Image as ImageIcon, CloudUpload } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import type { Reservation } from "@/lib/types";
import { uploadImage } from "../utils/image-upload";

interface StorageMigrationProps {
  tours: { id: string | number; image: string; images?: string[]; stops?: { image?: string }[] }[];
  reservations: Reservation[];
}

interface ImageEntry {
  url: string;
  source: string; // e.g. "Tour 1 — image", "Tour 1 — images[2]"
  path: string;   // Supabase storage path extracted from URL
  tourId: string | number;
  field: string;  // "image", "images", "stops"
  fieldIndex?: number;
  status: "pending" | "processing" | "done" | "error";
  error?: string;
  newUrl?: string; // Vercel Blob URL after migration
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
      if (path) entries.push({ url: tour.image, source: `Tour ${tour.id} — image`, path, tourId: tour.id, field: "image", status: "pending" });
    }

    // Gallery images
    if (tour.images) {
      for (let i = 0; i < tour.images.length; i++) {
        const img = tour.images[i];
        if (img && isSupabaseStorageUrl(img) && !seen.has(img)) {
          seen.add(img);
          const path = extractStoragePath(img);
          if (path) entries.push({ url: img, source: `Tour ${tour.id} — images[${i}]`, path, tourId: tour.id, field: "images", fieldIndex: i, status: "pending" });
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
          if (path) entries.push({ url: stop.image, source: `Tour ${tour.id} — stop[${i}]`, path, tourId: tour.id, field: "stops", fieldIndex: i, status: "pending" });
        }
      }
    }
  }

  return entries;
}

/**
 * Migrate a Supabase Storage image to Vercel Blob:
 * 1. Download from Supabase Storage
 * 2. Upload to Vercel Blob via /api/upload-image
 * 3. Update the URL in the tours DB table
 *
 * Returns the new Vercel Blob URL.
 */
async function migrateImage(entry: ImageEntry): Promise<string> {
  if (!supabase) throw new Error("Supabase non disponible");

  // 1. Download from Supabase
  const { data: blob, error: downloadError } = await supabase.storage
    .from("tour_images")
    .download(entry.path);

  if (downloadError || !blob) {
    throw new Error(`Download failed: ${downloadError?.message || "no data"}`);
  }

  // 2. Upload to Vercel Blob
  const result = await uploadImage(entry.path, blob, blob.type || "image/jpeg");

  if (result.source !== 'vercel-blob') {
    throw new Error("Vercel Blob unavailable — image was re-uploaded to Supabase with cache headers instead. Configure BLOB_READ_WRITE_TOKEN in Vercel to enable full migration.");
  }

  // 3. Update the URL in the DB
  const { data: tour, error: fetchError } = await supabase
    .from("tours")
    .select("image, images, stops")
    .eq("id", entry.tourId)
    .single();

  if (fetchError || !tour) {
    throw new Error(`Tour fetch failed: ${fetchError?.message || "not found"}`);
  }

  const updates: Record<string, unknown> = {};

  if (entry.field === "image") {
    updates.image = result.url;
  }

  // Also update in images array if the old URL appears there
  if (tour.images && Array.isArray(tour.images)) {
    const newImages = (tour.images as string[]).map((img) =>
      img === entry.url ? result.url : img,
    );
    if (JSON.stringify(newImages) !== JSON.stringify(tour.images)) {
      updates.images = newImages;
    }
  }

  // Update image field if it matches the old URL
  if (tour.image === entry.url) {
    updates.image = result.url;
  }

  if (entry.field === "stops" && tour.stops && Array.isArray(tour.stops) && entry.fieldIndex !== undefined) {
    const newStops = [...(tour.stops as { image?: string }[])];
    if (newStops[entry.fieldIndex]) {
      newStops[entry.fieldIndex] = { ...newStops[entry.fieldIndex], image: result.url };
      updates.stops = newStops;
    }
  }

  if (Object.keys(updates).length > 0) {
    const { error: updateError } = await supabase
      .from("tours")
      .update(updates)
      .eq("id", entry.tourId);

    if (updateError) {
      throw new Error(`DB update failed: ${updateError.message}`);
    }
  }

  return result.url;
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
      const newUrl = await migrateImage(entries[index]);
      setEntries((prev) =>
        prev.map((e, i) => (i === index ? { ...e, status: "done", newUrl } : e)),
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
        const newUrl = await migrateImage(entries[i]);
        setEntries((prev) =>
          prev.map((e, j) => (j === i ? { ...e, status: "done", newUrl } : e)),
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

      // Delay to avoid hammering APIs
      await new Promise((r) => setTimeout(r, 500));
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
            Migre les images de Supabase Storage vers Vercel Blob (CDN global,
            100 GB egress gratuit). Met à jour les URLs en base automatiquement.
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
          <CardTitle className="text-sm flex items-center gap-2">
            <CloudUpload className="w-4 h-4 text-blue-600" /> Comment ça marche ?
          </CardTitle>
          <CardDescription className="text-xs">
            Chaque image Supabase est téléchargée puis ré-uploadée sur <strong>Vercel Blob</strong> (CDN
            global, 100 GB egress gratuit). L'URL en base de données est mise à jour automatiquement.
            Si Vercel Blob n'est pas configuré (<code>BLOB_READ_WRITE_TOKEN</code>), l'image reste sur Supabase
            avec un cache longue durée en fallback.
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
