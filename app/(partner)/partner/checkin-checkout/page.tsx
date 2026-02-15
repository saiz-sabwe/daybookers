import { getTodayCheckIns, getTodayCheckOuts } from "@/app/actions/partner/bookings/get-checkin-checkout";
import { CheckInOutList } from "@/components/partner/checkin-checkout/CheckInOutList";
import { BreadcrumbPartner } from "@/components/partner/layout/BreadcrumbPartner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "lucide-react";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function CheckInOutPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  const userId = session.user.id;

  const [checkIns, checkOuts] = await Promise.all([
    getTodayCheckIns(userId),
    getTodayCheckOuts(userId),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <BreadcrumbPartner
          items={[
            { label: "Dashboard", href: "/partner/dashboard" },
            { label: "Check-in / Check-out", href: "/partner/checkin-checkout" },
          ]}
        />
        <div className="flex items-center gap-3 mt-4">
          <Calendar className="w-8 h-8 text-partner-primary-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Check-in / Check-out</h1>
            <p className="text-gray-600 mt-1">Gérez les arrivées et départs du jour</p>
          </div>
        </div>
      </div>

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
  );
}

