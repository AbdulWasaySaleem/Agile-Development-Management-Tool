"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { Badge } from "../ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "../ui/tooltip";
import { Button } from "../ui/button";
import { Users, Calendar, Target, ExternalLink, GitBranch } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface Project {
  _id: string;
  title: string;
  description: string;
  status: string;
  methodology?: string;
  skills?: string[];
  members?: { name: string; profilePicture?: { url: string } }[];
  createdAt?: string;
  priority?: "low" | "medium" | "high";
}

interface ProjectSectionProps {
  projects: Project[];
  loading: boolean;
}

const statusConfig = {
  completed: {
    className:
      "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200",
    icon: "✓",
  },
  "in-progress": {
    className: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    icon: "⏳",
  },
  planning: {
    className:
      "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
    icon: "📋",
  },
  default: {
    className: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
    icon: "○",
  },
};

export default function ProjectSection({
  projects,
  loading,
}: ProjectSectionProps) {

  const router = useRouter();
  if (loading) {
    return (
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-3/4 rounded" />
            </CardHeader>
            <CardContent className="space-y-3">
              <Skeleton className="h-4 w-full rounded" />
              <Skeleton className="h-4 w-2/3 rounded" />
              <Skeleton className="h-8 w-20 rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
      {projects.map((project) => {
        const statusKey = project.status
          .toLowerCase()
          .replace(/\s+/g, "-") as keyof typeof statusConfig;
        const statusInfo = statusConfig[statusKey] || statusConfig.default;

        return (
          <Card
            key={project._id}
            className="hover:shadow-lg transition-all rounded-xl border border-gray-200 dark:border-gray-700"
          >
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-base font-semibold leading-tight line-clamp-2">
                  {project.title}
                </CardTitle>
                <Badge
                  className={cn(
                    "capitalize text-xs px-2 py-0.5 rounded-full",
                    statusInfo.className
                  )}
                >
                  <span className="mr-1">{statusInfo.icon}</span>
                  {project.status}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground line-clamp-3">
                {project.description}
              </p>

              {project.methodology && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <GitBranch className="h-3 w-3" />
                  {project.methodology}
                </div>
              )}

              <div className="flex items-center justify-between">
                {project.members?.length ? (
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      <TooltipProvider>
                        {project.members.slice(0, 3).map((member, i) => (
                          <Tooltip key={i}>
                            <TooltipTrigger asChild>
                              <Avatar className="h-7 w-7 ring-2 ring-white dark:ring-gray-900 cursor-pointer">
                                <AvatarImage
                                  src={member.profilePicture?.url}
                                  alt={member.name}
                                />
                                <AvatarFallback>
                                  {member.name[0]?.toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                            </TooltipTrigger>
                            <TooltipContent side="top">
                              <p className="text-xs">{member.name}</p>
                            </TooltipContent>
                          </Tooltip>
                        ))}
                      </TooltipProvider>

                      {project.members.length > 3 && (
                        <div className="h-7 w-7 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 text-xs">
                          +{project.members.length - 3}
                        </div>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {project.members.length} member
                      {project.members.length > 1 ? "s" : ""}
                    </span>
                  </div>
                ) : (
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Users className="h-3 w-3" /> No members
                  </span>
                )}

                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 w-7 p-0 rounded"
                  onClick={()=>{router.push(`/adminProjects/${project._id}`)}}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>

              {project.createdAt && (
                <div className="pt-2 border-t text-xs text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {new Date(project.createdAt).toLocaleDateString()}
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
