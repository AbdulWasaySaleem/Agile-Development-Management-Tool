"use client";

import ProjectCard from "@/components/projects/project/ProjectCard";
import AddProjectDialog from "@/components/projects/project/AddProjectDialog";
import { toast } from "react-hot-toast";
import {
  useProjects,
  useAddProjects,
  useDeleteProjects,
} from "@/hooks/useProjects";
import { useMembers } from "@/hooks/useMembers";
import { ProjectFormData } from "@/validations/projectValidation";
import ProjectSkeleton from "@/components/projects/project/ProjectSkeleton";

export default function AdminProjectsPage() {
  const {
    data: projects = [],
    isLoading: loadingProjects,
    isError: errorProjects,
  } = useProjects();

  const {
    data: members,
    isLoading: loadingMembers,
    isError: errorMembers,
  } = useMembers();

  const addProjectMutation = useAddProjects();
  const deleteProjectMutation = useDeleteProjects();

  const handleDelete = (id: string) => {
    deleteProjectMutation.mutate(id, {
      onSuccess: (data) => {
        toast.success(data.message || "Project deleted successfully");
      }
    });
  };

  const handleAddProject = (form: ProjectFormData) => {
    addProjectMutation.mutate(form, {
      onSuccess: (data) => {
        toast.success(data.message || "Project added successfully");
      }
    });
  };

  // EARLY RETURNS
  if (loadingProjects && !projects.length) {
    return <ProjectSkeleton count={6} />;
  }

  if (errorProjects || errorMembers) {
    return (
      <div className="text-center mt-20 text-red-500">
        <p>Something went wrong while fetching projects or members.</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
        <AddProjectDialog
          onAdd={handleAddProject}
          members={members || []}
          loadingMembers={loadingMembers}
        />
      </div>

      {projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard
              key={project._id}
              project={project}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="text-center mt-20 text-gray-500">
          <p className="text-lg">No projects yet.</p>
          <p className="text-sm">Click “Add New Project” to create one 🚀</p>
        </div>
      )}
    </div>
  );
}
