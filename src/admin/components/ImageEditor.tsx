import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import type { Area, Point } from "react-easy-crop";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { RotateCcw, ZoomIn, Scissors, RotateCw, Loader2, FlipHorizontal, FlipVertical, RefreshCw, Move } from "lucide-react";
import { toast } from "sonner";
import getCroppedImg from "../utils/image-utils";

interface ImageEditorProps {
  image: string;
  isOpen: boolean;
  onClose: () => void;
  onSave: (croppedImage: Blob) => Promise<void>;
  aspectRatio?: number;
  title?: string;
}

export const ImageEditor: React.FC<ImageEditorProps> = ({
  image,
  isOpen,
  onClose,
  onSave,
  aspectRatio = 4 / 3,
  title = "Retoucher l'image",
}) => {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);

  const onCropComplete = useCallback((_croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const [isProcessing, setIsProcessing] = useState(false);

  const handleReset = () => {
    setCrop({ x: 0, y: 0 });
    setRotation(0);
    setZoom(1);
    setFlipH(false);
    setFlipV(false);
  };

  const handleSave = async () => {
    setIsProcessing(true);
    try {
      if (!croppedAreaPixels) {
        toast.error("Veuillez sélectionner une zone de l'image");
        setIsProcessing(false);
        return;
      }
      const croppedImage = await getCroppedImg(
        image,
        croppedAreaPixels,
        rotation,
        { horizontal: flipH, vertical: flipV }
      );
      if (croppedImage) {
        await onSave(croppedImage);
      } else {
        throw new Error("Erreur lors de la génération de l'image");
      }
    } catch (e) {
      console.error(e);
      toast.error("Erreur technique lors du recadrage : " + (e as Error).message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-2 shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <Scissors className="w-5 h-5 text-amber-500" />
            {title}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="relative bg-slate-100 mx-6 rounded-xl overflow-hidden" style={{ height: "40vh", minHeight: "250px" }}>
            <Cropper
              image={image}
              crop={crop}
              rotation={rotation}
              zoom={zoom}
              aspect={aspectRatio}
              onCropChange={setCrop}
              onRotationChange={setRotation}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
              minZoom={0.5}
              maxZoom={5}
              transform={[
                `translate(${crop.x}px, ${crop.y}px)`,
                `rotateZ(${rotation}deg)`,
                `rotateY(${flipH ? 180 : 0}deg)`,
                `rotateX(${flipV ? 180 : 0}deg)`,
                `scale(${zoom})`,
              ].join(' ')}
            />
          </div>

          <p className="text-xs text-gray-400 text-center mt-2 flex items-center justify-center gap-1">
            <Move className="w-3 h-3" /> Glissez pour repositionner, pincez ou scrollez pour zoomer
          </p>

          <div className="p-6 pt-4 space-y-5">
            {/* Zoom */}
            <div className="space-y-2">
              <div className="flex items-center gap-4">
                <ZoomIn className="w-4 h-4 text-gray-400" />
                <div className="flex-1 text-xs font-medium text-gray-500 flex justify-between">
                  <span>Zoom</span>
                  <span>{zoom.toFixed(1)}x</span>
                </div>
              </div>
              <Slider
                value={[zoom]}
                min={0.5}
                max={5}
                step={0.1}
                onValueChange={(value) => setZoom(value[0])}
                className="py-2"
              />
            </div>

            {/* Rotation */}
            <div className="space-y-2">
              <div className="flex items-center gap-4">
                <RotateCw className="w-4 h-4 text-gray-400" />
                <div className="flex-1 text-xs font-medium text-gray-500 flex justify-between">
                  <span>Rotation</span>
                  <span>{rotation}°</span>
                </div>
              </div>
              <Slider
                value={[rotation]}
                min={0}
                max={360}
                step={1}
                onValueChange={(value) => setRotation(value[0])}
                className="py-2"
              />
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap justify-center gap-2 pt-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setRotation((prev) => (prev - 90 + 360) % 360)}
              >
                <RotateCcw className="w-4 h-4 mr-1" /> -90°
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setRotation((prev) => (prev + 90) % 360)}
              >
                <RotateCw className="w-4 h-4 mr-1" /> +90°
              </Button>
              <Button
                variant={flipH ? "default" : "outline"}
                size="sm"
                onClick={() => setFlipH((prev) => !prev)}
              >
                <FlipHorizontal className="w-4 h-4 mr-1" /> Miroir H
              </Button>
              <Button
                variant={flipV ? "default" : "outline"}
                size="sm"
                onClick={() => setFlipV((prev) => !prev)}
              >
                <FlipVertical className="w-4 h-4 mr-1" /> Miroir V
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
              >
                <RefreshCw className="w-4 h-4 mr-1" /> Reset
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter className="p-6 pt-4 bg-gray-50 border-t flex gap-3 shrink-0">
          <Button variant="ghost" onClick={onClose} className="flex-1">
            Annuler
          </Button>
          <Button
            onClick={handleSave}
            disabled={isProcessing}
            className="flex-1 bg-[#c9a961] hover:bg-[#b8944e] text-white font-bold"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Traitement...
              </>
            ) : (
              "Appliquer"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
