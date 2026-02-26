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
import { RotateCcw, ZoomIn, Scissors, RotateCw } from "lucide-react";
import getCroppedImg from "../utils/image-utils";

interface ImageEditorProps {
  image: string;
  isOpen: boolean;
  onClose: () => void;
  onSave: (croppedImage: Blob) => void;
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

  const onCropComplete = useCallback((_croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSave = async () => {
    try {
      if (!croppedAreaPixels) return;
      const croppedImage = await getCroppedImg(
        image,
        croppedAreaPixels,
        rotation
      );
      if (croppedImage) {
        onSave(croppedImage);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="flex items-center gap-2">
            <Scissors className="w-5 h-5 text-amber-500" />
            {title}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 relative min-h-[300px] bg-slate-100 mx-6 rounded-xl overflow-hidden">
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
          />
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <ZoomIn className="w-4 h-4 text-gray-400" />
              <div className="flex-1 text-xs font-medium text-gray-500 mb-1 flex justify-between">
                <span>Zoom</span>
                <span>{zoom.toFixed(1)}x</span>
              </div>
            </div>
            <Slider
              value={[zoom]}
              min={1}
              max={3}
              step={0.1}
              onValueChange={(value) => setZoom(value[0])}
              className="py-2"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <RotateCw className="w-4 h-4 text-gray-400" />
              <div className="flex-1 text-xs font-medium text-gray-500 mb-1 flex justify-between">
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

          <div className="flex justify-center gap-4 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setRotation((prev) => (prev - 90 + 360) % 360)}
              className="flex-1"
            >
              <RotateCcw className="w-4 h-4 mr-2" /> -90°
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setRotation((prev) => (prev + 90) % 360)}
              className="flex-1"
            >
              <RotateCw className="w-4 h-4 mr-2" /> +90°
            </Button>
          </div>
        </div>

        <DialogFooter className="p-6 pt-2 bg-gray-50 border-t flex gap-3">
          <Button variant="ghost" onClick={onClose} className="flex-1">
            Annuler
          </Button>
          <Button
            onClick={handleSave}
            className="flex-1 bg-[#c9a961] hover:bg-[#b8944e] text-white font-bold"
          >
            Appliquer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
