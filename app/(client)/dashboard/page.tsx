import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import DashboardPageClient from "./DashboardPageClient";

function DashboardPageFallback() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-client-primary-600" />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardPageFallback />}>
      <DashboardPageClient />
    </Suspense>
  );
}
