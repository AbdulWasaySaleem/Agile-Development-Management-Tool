"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Calendar,
  Users,
  Target,
  TrendingUp,
  Clock,
  CheckCircle2,
  BarChart3,
} from "lucide-react";

interface Project {
  _id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: string;
  methodology: string;
  members: Array<{
    _id: string;
    name: string;
    profilePicture?: { url: string };
  }>;
}

interface Props {
  projects: Project;
}

export default function Dashboard({ projects: project }: Props) {
  const calculateProgress = () => {
    const start = new Date(project.startDate);
    const end = new Date(project.endDate);
    const now = new Date();

    if (now < start) return 0;
    if (now > end) return 100;

    const total = end.getTime() - start.getTime();
    const elapsed = now.getTime() - start.getTime();
    return Math.round((elapsed / total) * 100);
  };

  const getDaysRemaining = () => {
    const end = new Date(project.endDate);
    const now = new Date();
    const diff = end.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const progress = calculateProgress();
  const daysRemaining = getDaysRemaining();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
          Project Dashboard
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Overview of {project.title} progress and metrics
        </p>
      </div>

      {/* Key Metrics */}

      {/* Timeline Visualization */}
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-500" />
            Project Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Started: {new Date(project.startDate).toLocaleDateString()}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Due: {new Date(project.endDate).toLocaleDateString()}
              </div>
            </div>

            <div className="relative bg-gray-200 dark:bg-gray-700 rounded-full h-4">
              <div
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
              <div
                className="absolute top-1/2 transform -translate-y-1/2 w-6 h-6 bg-white border-4 border-blue-500 rounded-full shadow-lg"
                style={{
                  left: `${Math.min(progress, 100)}%`,
                  marginLeft: "-12px",
                }}
              />
            </div>

            <div className="flex justify-center mt-4">
              <Badge
                variant={daysRemaining > 0 ? "default" : "destructive"}
                className="px-4 py-2 text-lg"
              >
                {daysRemaining > 0
                  ? `${daysRemaining} days remaining`
                  : "Project overdue"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
