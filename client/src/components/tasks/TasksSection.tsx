"use client";

import { useProjects } from "@/hooks/useProjects";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDeleteTask } from "@/hooks/useTasks";

export default function TaskSection() {
  const { data: projects, isLoading } = useProjects();
  const { mutate: deleteTask, isPending } = useDeleteTask();

  if (isLoading) return <p className="p-6">Loading projects...</p>;
  if (!projects || projects.length === 0)
    return <p className="p-6">No projects found.</p>;

  // Calculate statistics
  const totalTasks = projects.reduce((sum, p) => sum + p.tasks.length, 0);

  return (
    <div className="p-6 space-y-6">
      {/* Stats Section */}
      <div className="flex flex-wrap gap-4">
        <Card className="flex-1 min-w-[150px] shadow">
          <CardHeader>
            <CardTitle className="text-lg">Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{projects.length}</p>
          </CardContent>
        </Card>

        <Card className="flex-1 min-w-[150px] shadow">
          <CardHeader>
            <CardTitle className="text-lg">Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{totalTasks}</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue={projects[0]?._id} className="w-full">
        <TabsList className="flex flex-wrap gap-2">
          {projects.map((project) => (
            <TabsTrigger key={project._id} value={project._id}>
              {project.title}
            </TabsTrigger>
          ))}
        </TabsList>

        {projects.map((project) => (
          <TabsContent key={project._id} value={project._id} className="mt-4">
            <Card className="shadow">
              <CardHeader>
                <CardTitle>{project.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Project Info */}
                <p className="text-muted-foreground">{project.description}</p>

                {/* Members */}
                <div>
                  <h3 className="font-semibold mb-2">Members</h3>
                  <div className="flex items-center gap-2 flex-wrap">
                    {project.members.map((m: any) => (
                      <div
                        key={m._id}
                        className="flex items-center gap-2 border rounded-md px-2 py-1"
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={m.profilePicture?.url} />
                          <AvatarFallback>{m.name?.[0] || "?"}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{m.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tasks List */}
                <div>
                  <h3 className="font-semibold mb-2">Tasks</h3>
                  <ScrollArea className="h-[250px] rounded-md border p-2">
                    {project.tasks.length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        No tasks yet.
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {project.tasks.map((task: any) => (
                          <div
                            key={task._id}
                            className="flex justify-between items-center border rounded-md p-2"
                          >
                            <span className="text-sm">{task.title}</span>
                            <Button
                              variant="destructive"
                              size="sm"
                              disabled={isPending}
                              onClick={() => deleteTask(task._id)}
                            >
                              {isPending ? "Deleting..." : "Delete"}
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
