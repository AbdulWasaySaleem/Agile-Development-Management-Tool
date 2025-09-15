"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Plus } from "lucide-react";

import { useProjects } from "@/hooks/useProjects";
import { useTasks } from "@/hooks/useTasks";

import KPISection from "./KPISection";
import ProjectSection from "./ProjectSection";
import Link from "next/link";

export default function HomeSection() {
  const {
    data: projects = [],
    isLoading: loadingProjects,
    isError: errorProjects,
  } = useProjects();

  const {
    taskCounts,
    isLoading: loadingTasks,
    isError: errorTasks,
  } = useTasks();

  const loading = loadingProjects || loadingTasks;
  const error = errorProjects || errorTasks;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
              Welcome back!
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Here’s a quick look at your projects and tasks.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="outline" size="lg">
              <Plus className="mr-2 h-4 w-4" />
              New Project
            </Button>
            <Button
              size="lg"
              className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
              onClick={() => {}}
            >
              <Link href={"/adminProjects"}>View All Projects</Link>
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Task Overview */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Task Overview
            </h2>
          </div>
          <KPISection taskCounts={taskCounts} loading={loading} />
        </div>

        {/* Recent Projects */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Recent Projects
            </h2>
          </div>
          <ProjectSection projects={projects} loading={loading} />
        </div>

        {/* Empty State */}
        {!loading && projects.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No projects yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Start by creating your first project.
            </p>
            <Button
              size="lg"
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Project
            </Button>
          </div>
        )}

        {/* Error State (optional) */}
        {error && (
          <div className="text-center py-6 text-red-500">
            Failed to load data. Please try again later.
          </div>
        )}
      </div>
    </div>
  );
}
