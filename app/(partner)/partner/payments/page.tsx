import { getServerApiToken } from "@/lib/api/server-auth";
import { redirect } from "next/navigation";
import { getPaymentsByUserId } from "@/app/actions/partner/payments/get";
import { PaymentsList } from "@/components/partner/payments/PaymentsList";
import { DashboardPageHeader } from "@/components/shared/dashboard/DashboardPageHeader";
import { CreditCard } from "lucide-react";

export default async function PaymentsPage() {
  const token = await getServerApiToken();

  if (!token) {
    redirect("/login");
  }

  const payments = await getPaymentsByUserId("");

  return (
    <div>
      <DashboardPageHeader
        theme="partner"
        icon={CreditCard}
        title="Gestion des paiements"
        description="Consultez et vérifiez tous les paiements liés à vos réservations"
      />

      <PaymentsList payments={payments} />
    </div>
  );
}
