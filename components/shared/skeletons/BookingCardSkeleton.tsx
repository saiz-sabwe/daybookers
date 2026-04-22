"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function BookingCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <Skeleton className="w-full md:w-32 h-48 md:h-32 rounded-xl flex-shrink-0" />
          <div className="flex-1 min-w-0 space-y-3">
            <Skeleton className="h-6 w-[70%]" />
            <Skeleton className="h-4 w-40" />
            <div className="grid grid-cols-2 gap-3">
              <Skeleton className="h-14 rounded-lg" />
              <Skeleton className="h-14 rounded-lg" />
              <Skeleton className="h-14 rounded-lg" />
              <Skeleton className="h-14 rounded-lg" />
            </div>
            <div className="flex gap-2 pt-2">
              <Skeleton className="h-9 w-24 rounded-md" />
              <Skeleton className="h-9 w-28 rounded-md" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function BookingHistorySkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <BookingCardSkeleton key={i} />
      ))}
    </div>
  );
}
