"use client"

import { Skeleton } from "@/components/ui/skeleton"

interface ProjectSkeletonProps {
  count?: number
}

export default function ProjectSkeleton({ count = 1 }: ProjectSkeletonProps) {
  return (
    <div
      className={`grid gap-6 ${
        count > 1 ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : ""
      }`}
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="p-4 border rounded-2xl shadow-sm bg-white dark:bg-gray-900 h-[220px]"
        >
          <Skeleton className="h-6 w-3/4 mb-4 rounded-md" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-4 w-5/6 rounded-md" />
            <Skeleton className="h-4 w-2/3 rounded-md" />
          </div>
          <div className="flex justify-end mt-6">
            <Skeleton className="h-8 w-24 rounded-md" />
          </div>
        </div>
      ))}
    </div>
  )
}
