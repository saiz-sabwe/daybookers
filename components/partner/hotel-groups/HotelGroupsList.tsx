"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, Plus, Edit } from "lucide-react";
import { HotelGroupData } from "@/app/actions/partner/hotel-groups/get";
import { CreateGroupDialog } from "./CreateGroupDialog";
import { GroupHotelsManager } from "./GroupHotelsManager";

interface HotelGroupsListProps {
  groups: HotelGroupData[];
  userId: string;
  onUpdate: () => void;
}

export function HotelGroupsList({ groups, userId, onUpdate }: HotelGroupsListProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);

  const handleCreateSuccess = () => {
    setIsCreateDialogOpen(false);
    onUpdate();
  };

  const handleManageClick = (groupId: string) => {
    setSelectedGroupId(groupId);
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Groupes d'hôtels</h2>
          <Button
            onClick={() => setIsCreateDialogOpen(true)}
            className="bg-partner-primary-600 hover:bg-partner-primary-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Créer un groupe
          </Button>
        </div>

        {groups.length === 0 ? (
          <Card className="p-12 text-center">
            <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun groupe</h3>
            <p className="text-gray-600 mb-4">Créez votre premier groupe pour organiser vos hôtels</p>
            <Button
              onClick={() => setIsCreateDialogOpen(true)}
              className="bg-partner-primary-600 hover:bg-partner-primary-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Créer un groupe
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groups.map((group) => (
              <Card key={group.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{group.name}</CardTitle>
                    <Badge variant="secondary">
                      {group._count?.hotels || 0} hôtel{group._count?.hotels !== 1 ? "s" : ""}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {group.description && (
                    <p className="text-sm text-gray-600 mb-4">{group.description}</p>
                  )}
                  <Button
                    onClick={() => handleManageClick(group.id)}
                    variant="outline"
                    className="w-full"
                  >
                    <Building2 className="w-4 h-4 mr-2" />
                    Gérer les hôtels
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <CreateGroupDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        userId={userId}
        onSuccess={handleCreateSuccess}
      />

      {selectedGroupId && (
        <GroupHotelsManager
          open={!!selectedGroupId}
          onOpenChange={(open) => !open && setSelectedGroupId(null)}
          groupId={selectedGroupId}
          userId={userId}
          onUpdate={onUpdate}
        />
      )}
    </>
  );
}

