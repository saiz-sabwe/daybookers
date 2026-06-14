import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import BookingPageClient from "./BookingPageClient";

function BookingPageFallback() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-client-primary-600" />
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={<BookingPageFallback />}>
      <BookingPageClient />
    </Suspense>
  );
}
