import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const phases = ["Planning", "Design", "Coding", "Testing", "Release"]

export function XPSkeleton() {
  return (
    <div className="space-y-6 p-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-10 w-24" />
      </div>

      {/* Available Tasks Skeleton */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-5 w-8" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Card>
                  <CardHeader className="pb-2">
                    <Skeleton className="h-5 w-full" />
                  </CardHeader>
                  <CardContent className="pt-0 space-y-3">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <div className="flex justify-between">
                      <Skeleton className="h-5 w-16" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  </CardContent>
                </Card>
                <Skeleton className="h-8 w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* XP Phases Tabs Skeleton */}
      <Tabs value={phases[0]}>
        <TabsList className="grid w-full grid-cols-5">
          {phases.map((phase) => (
            <TabsTrigger key={phase} value={phase} className="text-xs sm:text-sm">
              {phase}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={phases[0]} className="space-y-4">
          <div className="flex justify-between items-center">
            <Skeleton className="h-7 w-32" />
            <Skeleton className="h-5 w-16" />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {Array.from({ length: 2 }).map((_, i) => (
              <Card key={i} className="h-full">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start gap-2">
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-16" />
                  </div>
                  <Skeleton className="h-5 w-20" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
