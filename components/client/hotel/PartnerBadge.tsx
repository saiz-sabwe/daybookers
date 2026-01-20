"use client";

import { Badge } from "@/components/ui/badge";
import { Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface PartnerBadgeProps {
  partnerName: string;
  className?: string;
  variant?: "default" | "outline";
}

export function PartnerBadge({
  partnerName,
  className,
  variant = "default",
}: PartnerBadgeProps) {
  return (
    <Badge
      variant={variant}
      className={cn(
        "flex items-center gap-1.5 px-3 py-1.5",
        variant === "default" && "bg-client-primary-100 text-client-primary-700 border-client-primary-200",
        className
      )}
    >
      <Building2 className="w-3.5 h-3.5" />
      <span className="text-sm font-medium">Géré par {partnerName}</span>
    </Badge>
  );
}

