import { getServerApiToken } from "@/lib/api/server-auth";
import { redirect } from "next/navigation";
import { getPaymentsByUserId } from "@/app/actions/partner/payments/get";
import { PaymentsList } from "@/components/partner/payments/PaymentsList";
import { CreditCard } from "lucide-react";

export default async function PaymentsPage() {
  const token = await getServerApiToken();

  if (!token) {
    redirect("/login");
  }

  const payments = await getPaymentsByUserId("");

  return (
    <div className="p-8">
      {/* Breadcrumb */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>Dashboard</span>
          <span>/</span>
          <span className="text-gray-900 font-medium">Paiements</span>
        </div>
      </div>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-partner-primary-100 rounded-lg">
            <CreditCard className="w-6 h-6 text-partner-primary-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des paiements</h1>
        </div>
        <p className="text-gray-600">
          Consultez et vérifiez tous les paiements liés à vos réservations
        </p>
      </div>

      {/* Liste des paiements */}
      <PaymentsList payments={payments} />
    </div>
  );
}
