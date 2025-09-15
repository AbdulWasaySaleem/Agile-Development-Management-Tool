"use client";

import { useParams } from "next/navigation";
import { toast } from "react-hot-toast";
import { Skeleton } from "@/components/ui/skeleton";
import ProjectDetailsCard from "@/components/projects/projectdetails/ProjectDetailsCard";
import ProjectManagement from "@/components/projects/projectdetails/ProjectManagement";
import {
  useAddProjectMember,
  useProjects,
  useUpdateProjectStatus,
} from "@/hooks/useProjects";
import { useMembers } from "@/hooks/useMembers";
import { useState, useCallback } from "react";

export default function ViewProjectDetails() {
  const { id: projectId } = useParams();

  const {
    data: projects = [],
    isLoading: loadingProjects,
    isError: errorProjects,
  } = useProjects();
  const {
    data: members = [],
    isLoading: loadingMembers,
    isError: errorMembers,
  } = useMembers();

  const updateStatusMutation = useUpdateProjectStatus();
  const addMemberMutation = useAddProjectMember();

  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const [selectedMethodology, setSelectedMethodology] = useState<string | null>(
    null
  );

  const project = projects.find((p) => p._id === projectId);

  const handleStatusChange = useCallback(
    (status: string) => {
      if (!project) return;
      updateStatusMutation.mutate(
        { projectId: project._id, status },
        {
          onSuccess: (data: any) =>
            toast.success(data.message || "Project status updated")
        }
      );
    },
    [project?._id, updateStatusMutation]
  );

  const handleAddMember = useCallback(() => {
    if (!project || !selectedMember) return;
    addMemberMutation.mutate(
      { projectId: project._id, userId: selectedMember },
      {
        onSuccess: (data: unknown) => {
          setSelectedMember(null);
          toast.success(data.message || "Member added successfully");
        }
      }
    );
  }, [project?._id, selectedMember, addMemberMutation]);

  const handleMethodologyChange = useCallback((method: string) => {
    setSelectedMethodology(method);
  }, []);

  // Early returns (only JSX)
  if (loadingProjects || loadingMembers) {
    return (
      <div className="p-8 space-y-6">
        <Skeleton className="h-12 w-1/3" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (errorProjects || errorMembers || !project) {
    return (
      <div className="p-8 text-center text-red-500">
        <p>Failed to load project or members.</p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <ProjectDetailsCard
        project={project}
        members={members}
        selectedMember={selectedMember}
        setSelectedMember={setSelectedMember}
        selectedMethodology={selectedMethodology}
        setSelectedMethodology={handleMethodologyChange}
        onStatusChange={handleStatusChange}
        onAddMember={handleAddMember}
      />
      <ProjectManagement project={project} />
    </div>
  );
}
