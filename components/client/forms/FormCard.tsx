"use client";

import type { ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface FormCardProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function FormCard({
  title,
  description,
  icon,
  children,
  className,
}: FormCardProps) {
  return (
    <Card
      className={cn(
        "overflow-hidden rounded-2xl border-gray-200 bg-white shadow-md",
        className,
      )}
    >
      <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
        <CardTitle className="flex items-center gap-2 text-xl text-gray-900 md:text-2xl">
          {icon}
          {title}
        </CardTitle>
        {description ? (
          <CardDescription className="text-base">{description}</CardDescription>
        ) : null}
      </CardHeader>
      <CardContent className="pt-6">{children}</CardContent>
    </Card>
  );
}
