"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CreateHotelForm } from "./CreateHotelForm";

interface CreateHotelDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  hotelGroups: Array<{ id: string; name: string }>;
  onSuccess?: () => void;
}

export function CreateHotelDialog({
  open,
  onOpenChange,
  userId,
  hotelGroups,
  onSuccess,
}: CreateHotelDialogProps) {
  const handleSuccess = () => {
    onOpenChange(false);
    onSuccess?.();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Créer un nouvel hôtel</DialogTitle>
          <DialogDescription>
            Remplissez les informations pour créer un nouvel hôtel. Les champs marqués d'un * sont obligatoires.
          </DialogDescription>
        </DialogHeader>

        <CreateHotelForm userId={userId} hotelGroups={hotelGroups} onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
}

