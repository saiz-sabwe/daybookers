"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/client/layout/Header";
import { Footer } from "@/components/client/layout/Footer";

export default function ClientLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const isDashboard = pathname?.startsWith("/dashboard");

    // Ne pas afficher Header et Footer pour le dashboard
    if (isDashboard) {
        return <>{children}</>;
    }

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Header />
            <main className="flex-grow">
                {children}
            </main>
            <Footer />
        </div>
    );
}
