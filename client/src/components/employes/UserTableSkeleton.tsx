"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function UserTableSkeleton() {
  return (
    <Card className="overflow-x-auto">
      <CardContent className="p-0">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              <th className="p-4">#</th>
              <th className="p-4">Name</th>
              <th className="p-4">Skills</th>
              <th className="p-4">Profile</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 10 }).map((_, index) => (
              <tr
                key={index}
                className="border-b hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
              >
                {/* Serial number skeleton */}
                <td className="p-4">
                  <Skeleton className="h-4 w-6" />
                </td>

                {/* Name skeleton */}
                <td className="p-4">
                  <Skeleton className="h-4 w-32" />
                </td>

                {/* Skills skeleton */}
                <td className="p-4 flex gap-2">
                  <Skeleton className="h-5 w-16 rounded-full" />
                  <Skeleton className="h-5 w-20 rounded-full" />
                </td>

                {/* Profile skeleton */}
                <td className="p-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
