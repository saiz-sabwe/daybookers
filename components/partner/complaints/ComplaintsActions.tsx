"use client";

import { Button } from "@/components/ui/button";
import { PermissionGate } from "@/components/shared/auth/PermissionGate";
import { djangoPerm } from "@/lib/auth/django-perm";

export function NewComplaintButton() {
  return (
    <PermissionGate permissions={[djangoPerm("hotels", "complaint", "add")]}>
      <Button>Nouvelle plainte</Button>
    </PermissionGate>
  );
}

export function UpdateComplaintButton() {
  return (
    <PermissionGate permissions={[djangoPerm("hotels", "complaint", "change")]}>
      <Button size="sm">Mettre à jour</Button>
    </PermissionGate>
  );
}
