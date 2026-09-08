"use client";

import { useRef, useState } from "react";
import { ImagePlus, Link2, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { uploadHotelImage } from "@/app/actions/uploads/create";
import { resolveHotelImage } from "@/lib/images/hotel-image";
import { useToast } from "@/hooks/use-toast";

interface ImageUploadFieldProps {
  value: string[];
  onChange: (urls: string[]) => void;
  disabled?: boolean;
}

export function ImageUploadField({
  value,
  onChange,
  disabled = false,
}: ImageUploadFieldProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [urlInput, setUrlInput] = useState("");

  const handleFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    setIsUploading(true);
    const uploaded: string[] = [];
    try {
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", file);
        const result = await uploadHotelImage(formData);
        if (result.success && result.url) {
          uploaded.push(result.url);
        } else {
          toast({
            title: "Échec de l'envoi",
            description: result.error || `Impossible d'envoyer ${file.name}`,
            variant: "destructive",
          });
        }
      }
      if (uploaded.length) {
        onChange([...value, ...uploaded]);
        toast({
          title: "Photos ajoutées",
          description: `${uploaded.length} photo(s) envoyée(s) avec succès`,
        });
      }
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleAddUrl = () => {
    const url = urlInput.trim();
    if (!url) return;
    if (!/^https?:\/\//i.test(url)) {
      toast({
        title: "URL invalide",
        description: "L'URL doit commencer par http:// ou https://",
        variant: "destructive",
      });
      return;
    }
    onChange([...value, url]);
    setUrlInput("");
  };

  const handleRemove = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled || isUploading}
          onClick={() => fileInputRef.current?.click()}
        >
          {isUploading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Envoi en cours...
            </>
          ) : (
            <>
              <ImagePlus className="w-4 h-4 mr-2" />
              Ajouter des photos
            </>
          )}
        </Button>
        <span className="text-xs text-gray-500">
          JPG, PNG ou WebP — 5 Mo max par photo
        </span>
      </div>

      {value.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {value.map((url, index) => (
            <div
              key={`${url}-${index}`}
              className="relative group rounded-lg overflow-hidden border"
            >
              <img
                src={resolveHotelImage(url)}
                alt={`Photo ${index + 1}`}
                className="h-24 w-full object-cover"
              />
              <button
                type="button"
                onClick={() => handleRemove(index)}
                disabled={disabled || isUploading}
                className="absolute top-1 right-1 rounded-full bg-black/60 p-1 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Retirer cette photo"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2">
        <Input
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          placeholder="Ou collez une URL d'image (https://...)"
          disabled={disabled || isUploading}
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleAddUrl}
          disabled={disabled || isUploading || !urlInput.trim()}
        >
          <Link2 className="w-4 h-4 mr-1" />
          Ajouter
        </Button>
      </div>
    </div>
  );
}
