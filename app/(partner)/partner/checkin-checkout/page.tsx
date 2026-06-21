import { getTodayCheckIns, getTodayCheckOuts } from "@/app/actions/partner/bookings/get-checkin-checkout";
import { CheckInOutList } from "@/components/partner/checkin-checkout/CheckInOutList";
import { DashboardPageHeader } from "@/components/shared/dashboard/DashboardPageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DoorOpen } from "lucide-react";
import { getServerApiToken } from "@/lib/api/server-auth";
import { redirect } from "next/navigation";
import { PartnerPageGuard } from "@/components/shared/auth/PartnerPageGuard";

export default async function CheckInOutPage() {
  const token = await getServerApiToken();

  if (!token) {
    redirect("/login");
  }

  const [checkIns, checkOuts] = await Promise.all([
    getTodayCheckIns(""),
    getTodayCheckOuts(""),
  ]);

  return (
    <PartnerPageGuard>
    <div className="space-y-6">
      <DashboardPageHeader
        theme="partner"
        icon={DoorOpen}
        title="Check-in / Check-out"
        description="Gérez les arrivées et départs du jour"
      />

      <Tabs defaultValue="checkin" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="checkin">
            Check-in ({checkIns.length})
          </TabsTrigger>
          <TabsTrigger value="checkout">
            Check-out ({checkOuts.length})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="checkin" className="mt-6">
          <CheckInOutList bookings={checkIns} type="checkin" />
        </TabsContent>
        <TabsContent value="checkout" className="mt-6">
          <CheckInOutList bookings={checkOuts} type="checkout" />
        </TabsContent>
      </Tabs>
    </div>
    </PartnerPageGuard>
  );
}
