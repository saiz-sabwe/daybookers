"use client";

import { useEffect, useState } from "react";
import { DashboardPageHeader } from "@/components/shared/dashboard/DashboardPageHeader";
import { AdminPageGuard } from "@/components/shared/auth/AdminPageGuard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getCurrentProfile } from "@/app/actions/auth/get-current-profile";
import { updateProfile } from "@/app/actions/users/update-profile";
import { getUserDisplayName, StoredUserProfile } from "@/lib/api/user-profile";
import { storeUserProfile } from "@/lib/api/auth-storage";
import { useClientAuth } from "@/hooks/use-client-auth";
import { Loader2, Settings } from "lucide-react";

export default function AdminSettingsPage() {
  const { isAuthenticated, isAuthPending, userEmail, userName } = useClientAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [profile, setProfile] = useState<StoredUserProfile | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthPending) {
      return;
    }

    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }

    getCurrentProfile().then((loadedProfile) => {
      if (loadedProfile) {
        setProfile(loadedProfile);
        setName(getUserDisplayName(loadedProfile, userEmail));
        setPhone(loadedProfile.phone ?? "");
      } else {
        setName(userName);
      }
      setIsLoading(false);
    });
  }, [isAuthenticated, isAuthPending, userEmail, userName]);

  const handleSave = async () => {
    setIsSaving(true);
    setMessage(null);

    const result = await updateProfile({ name, phone });
    setIsSaving(false);

    if (result.success && result.profile) {
      storeUserProfile(result.profile);
      setProfile(result.profile);
      setMessage("Paramètres enregistrés.");
      return;
    }

    setMessage(result.error ?? "Une erreur est survenue.");
  };

  if (isLoading) {
    return (
      <AdminPageGuard>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      </AdminPageGuard>
    );
  }

  return (
    <AdminPageGuard>
      <div>
        <DashboardPageHeader
          theme="sadmin"
          icon={Settings}
          title="Paramètres"
          description="Gérez votre compte administrateur"
        />

        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>Profil administrateur</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="admin-name">Nom</Label>
              <Input
                id="admin-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="admin-email">Email</Label>
              <Input
                id="admin-email"
                value={profile?.email ?? userEmail ?? ""}
                disabled
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="admin-phone">Téléphone</Label>
              <Input
                id="admin-phone"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
              />
            </div>

            {message && <p className="text-sm text-gray-600">{message}</p>}

            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-admin-primary-500 hover:bg-admin-primary-600 text-white"
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                "Enregistrer"
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </AdminPageGuard>
  );
}
