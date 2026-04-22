"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function FavoriteCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-md overflow-hidden">
      <Skeleton className="w-full h-56 rounded-none" />
      <div className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <Skeleton className="h-4 w-4 rounded" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16 ml-2" />
        </div>
        <Skeleton className="h-5 w-[75%] mb-2" />
        <Skeleton className="h-4 w-1/2 mb-4" />
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-9 w-16 rounded-md" />
        </div>
      </div>
    </div>
  );
}

export function FavoritesListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (
        <FavoriteCardSkeleton key={i} />
      ))}
    </div>
  );
}
