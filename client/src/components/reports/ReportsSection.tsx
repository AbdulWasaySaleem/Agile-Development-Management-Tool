"use client";

import { useProjects } from "@/hooks/useProjects";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import toast from "react-hot-toast";
import { useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Calendar, Users, FileText, CheckCircle, Clock, PlayCircle, AlertCircle, Loader2, Download } from "lucide-react";
import { Project } from "@/types/project";


export default function ReportsSection() {
  const { data: projects, isLoading } = useProjects();
  const [downloadingProject, setDownloadingProject] = useState<string | null>(null);

  const statusColors: Record<string, string> = {
    "completed": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    "in progress": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    "not started": "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
    "default": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  };

  const statusIcons: Record<string, JSX.Element> = {
    "completed": <CheckCircle className="w-4 h-4" />,
    "in progress": <Clock className="w-4 h-4" />,
    "not started": <PlayCircle className="w-4 h-4" />,
    "default": <AlertCircle className="w-4 h-4" />,
  };

  const getStatusColor = (status: string) => statusColors[status.toLowerCase()] || statusColors.default;
  const getStatusIcon = (status: string) => statusIcons[status.toLowerCase()] || statusIcons.default;

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

  const downloadPDF = async (project: Project) => {
    setDownloadingProject(project._id);
    try {
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = `
        <div style="padding: 20px; font-family: Arial, sans-serif;">
          <h1 style="margin-bottom: 20px;">${project.title} Report</h1>
          <p><strong>Status:</strong> ${project.status}</p>
          <p><strong>Methodology:</strong> ${project.methodology}</p>
          <p><strong>Start:</strong> ${formatDate(project.startDate)}</p>
          <p><strong>End:</strong> ${formatDate(project.endDate)}</p>
          <p><strong>Tasks (${project.tasks?.length || 0}):</strong></p>
          ${project.tasks?.map(t => `<p>${t.title} - ${t.status}</p>`).join("") || "<p>No tasks</p>"}
        </div>
      `;
      document.body.appendChild(tempDiv);
      const canvas = await html2canvas(tempDiv, { backgroundColor: "#fff", scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${project.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}_report.pdf`);
      document.body.removeChild(tempDiv);
      toast.success(`${project.title} report downloaded!`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to download PDF");
    } finally {
      setDownloadingProject(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-2">Loading projects...</span>
      </div>
    );
  }

  if (!projects || projects.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500 dark:text-gray-400">
        <FileText className="w-12 h-12 mx-auto mb-4" />
        <h3 className="text-lg font-semibold">No projects yet</h3>
        <p>Create a project to see reports here.</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold mb-4">Project Reports</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">Quick view of your projects and tasks</p>

      <div className="grid gap-6">
        {projects.map(project => (
          <Card key={project._id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex justify-between items-start sm:items-center flex-col sm:flex-row gap-2">
              <div className="flex-1 min-w-0">
                <CardTitle className="text-lg md:text-xl truncate">{project.title}</CardTitle>
                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{project.description}</p>
              </div>
              <Button
                size="sm"
                onClick={() => downloadPDF(project)}
                disabled={downloadingProject === project._id}
                className="flex items-center gap-2"
              >
                {downloadingProject === project._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                PDF
              </Button>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-1">
                  {getStatusIcon(project.status)}
                  <Badge className={`${getStatusColor(project.status)} text-xs`}>{project.status}</Badge>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(project.startDate)} - {formatDate(project.endDate)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{project.members?.length || 0} members</span>
                </div>
              </div>

              <Separator />

              <h3 className="font-semibold text-gray-900 dark:text-gray-100">Tasks ({project.tasks?.length || 0})</h3>
              {project.tasks && project.tasks.length > 0 ? (
                <ScrollArea className="h-32 w-full border rounded-md p-2">
                  <div className="space-y-2">
                    {project.tasks.slice(0, 3).map(task => (
                      <div key={task._id} className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded-md">
                        <div className="text-sm truncate">{task.title}</div>
                        <Badge className={`${getStatusColor(task.status)} text-xs`}>{task.status}</Badge>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-sm">No tasks yet</p>
              )}
              {project.tasks.length > 3 && <p className="text-xs text-gray-400 mt-1">Showing 3 of {project.tasks.length} tasks</p>}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
