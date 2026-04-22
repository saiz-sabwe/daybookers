"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function ReviewFormSkeleton() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <Skeleton className="h-9 w-48 mb-2" />
        <Skeleton className="h-5 w-full max-w-md" />
      </div>
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-md space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-10 w-full rounded-md" />
          <Skeleton className="h-4 w-[75%]" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-32 w-full rounded-md" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        <div className="flex justify-end pt-4 border-t border-gray-100">
          <Skeleton className="h-10 w-36 rounded-md" />
        </div>
      </div>
    </div>
  );
}
