import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import LoginPageClient from "./LoginPageClient";

function LoginPageFallback() {
  return (
    <div className="flex items-center justify-center bg-gray-100 px-4 py-16">
      <Loader2 className="h-8 w-8 animate-spin text-client-primary-600" />
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginPageFallback />}>
      <LoginPageClient />
    </Suspense>
  );
}
