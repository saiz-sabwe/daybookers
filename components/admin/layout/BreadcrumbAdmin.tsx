"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbAdminProps {
  items: BreadcrumbItem[];
}

export function BreadcrumbAdmin({ items }: BreadcrumbAdminProps) {
  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
      <Link
        href="/admin/dashboard"
        className="flex items-center hover:text-admin-primary-600 transition-colors"
      >
        <Home className="w-4 h-4" />
      </Link>
      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-2">
          <ChevronRight className="w-4 h-4 text-gray-400" />
          {item.href ? (
            <Link
              href={item.href}
              className={cn(
                "hover:text-admin-primary-600 transition-colors",
                index === items.length - 1 && "text-admin-primary-600 font-medium"
              )}
            >
              {item.label}
            </Link>
          ) : (
            <span
              className={cn(
                index === items.length - 1 && "text-admin-primary-600 font-medium"
              )}
            >
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
}

