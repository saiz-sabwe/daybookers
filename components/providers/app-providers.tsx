"use client";

import { Suspense } from "react";
import { AppAlertProvider } from "@/components/shared/AppAlertProvider";
import { GlobalLoadingProvider } from "@/components/shared/GlobalLoadingProvider";
import { NavigationLoadingBridge } from "@/components/shared/NavigationLoadingBridge";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <GlobalLoadingProvider>
      <AppAlertProvider>
        <Suspense fallback={null}>
          <NavigationLoadingBridge />
        </Suspense>
        {children}
      </AppAlertProvider>
    </GlobalLoadingProvider>
  );
}
