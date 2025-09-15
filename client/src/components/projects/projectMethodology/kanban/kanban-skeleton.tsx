import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function KanbanSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-9 w-24" />
        </div>
      </div>

      {/* Kanban Columns Skeleton */}
      <div className="flex gap-6 overflow-x-auto pb-4">
        {Array.from({ length: 3 }).map((_, columnIndex) => (
          <div key={columnIndex} className="flex-shrink-0 w-80">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-5 w-8" />
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="min-h-[400px] space-y-3 p-2 rounded-md bg-slate-100">
                  {Array.from({ length: 3 }).map((_, taskIndex) => (
                    <Card key={taskIndex}>
                      <CardHeader className="pb-2">
                        <Skeleton className="h-4 w-full" />
                      </CardHeader>
                      <CardContent className="pt-0 space-y-2">
                        <Skeleton className="h-3 w-full" />
                        <Skeleton className="h-3 w-3/4" />
                        <div className="flex justify-between">
                          <Skeleton className="h-4 w-12" />
                          <Skeleton className="h-4 w-16" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  )
}
