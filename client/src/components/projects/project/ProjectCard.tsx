"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Trash2, Clock, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Project } from "@/types/project";

export default function ProjectCard({
  project,
  onDelete,
}: {
  project: Project;
  onDelete: (id: string) => void;
}) {
  const router = useRouter();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const [isViewing, setIsViewing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleView = () => {
    setIsViewing(true);

    // Give the spinner a chance to show before navigating
    setTimeout(() => {
      router.push(`/adminProjects/${project._id}`);
    }, 500);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(project._id);
    } finally {
      setIsDeleting(false);
      setConfirmOpen(false);
    }
  };

  return (
    <>
      <Card className="shadow-sm hover:shadow-lg transition rounded-2xl border border-gray-200 dark:border-gray-800">
        <CardHeader className="flex justify-between items-start">
          <CardTitle className="line-clamp-1 text-xl font-semibold">
            {project.title}
          </CardTitle>
          <Badge
            variant={project.status === "Completed" ? "default" : "secondary"}
            className="text-xs px-3 py-1"
          >
            {project.status}
          </Badge>
        </CardHeader>

        <CardContent className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
          <p className="line-clamp-2">{project.description}</p>

          <div className="grid grid-cols-2 gap-y-2 text-sm">
            <span className="font-medium">Methodology:</span>
            <span>{project.methodology}</span>

            <span className="font-medium flex items-center gap-1">
              <Clock className="h-4 w-4" /> Deadline:
            </span>
            <span>{new Date(project.endDate).toLocaleDateString()}</span>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t mt-4">
            {/* View button */}
            <Button
              variant="outline"
              size="sm"
              disabled={isViewing}
              onClick={handleView}
            >
              {isViewing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-1 animate-spin" /> Viewing…
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4 mr-1" /> View
                </>
              )}
            </Button>

            {/* Delete button */}
            <Button
              variant="destructive"
              size="sm"
              disabled={isDeleting}
              onClick={() => setConfirmOpen(true)}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-1 animate-spin" /> Deleting…
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-1" /> Delete
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Project</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to delete <b>{project.title}</b>? This action
            cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-1 animate-spin" /> Deleting…
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
