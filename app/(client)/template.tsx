"use client";

import { usePathname } from "next/navigation";
import { PageTransition } from "@/components/shared/PageTransition";

export default function ClientTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dashboard");

  if (isDashboard) {
    return <>{children}</>;
  }

  return <PageTransition>{children}</PageTransition>;
}
