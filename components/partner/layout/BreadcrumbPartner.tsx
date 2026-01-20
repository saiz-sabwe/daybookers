"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbPartnerProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function BreadcrumbPartner({ items, className }: BreadcrumbPartnerProps) {
  return (
    <nav className={cn("flex items-center gap-2 text-sm text-gray-600 mb-4", className)}>
      <Link
        href="/partner/dashboard"
        className="flex items-center gap-1 hover:text-partner-primary-600 transition-colors"
      >
        <Home className="w-4 h-4" />
        <span>Accueil</span>
      </Link>
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <ChevronRight className="w-4 h-4 text-gray-400" />
          {item.href && index < items.length - 1 ? (
            <Link
              href={item.href}
              className="hover:text-partner-primary-600 transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className={cn(
              index === items.length - 1 && "text-gray-900 font-medium"
            )}>
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
}

