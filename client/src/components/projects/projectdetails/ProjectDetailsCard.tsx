"use client";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Calendar,
  Users,
  Settings,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  PlayCircle,
} from "lucide-react";
import { Member } from "@/types/member";
import { Project } from "@/types/project";

import { format } from "date-fns";

interface Props {
  project: Project;
  members: Member[];
  selectedMember: string | null;
  setSelectedMember: (id: string | null) => void;
  selectedMethodology: string | null;
  setSelectedMethodology: (method: string) => void;
  onStatusChange: (status: string) => void;
  onAddMember: () => void;
  loadingMembers?: boolean;
}

const methodologies = ["Waterfall", "Agile", "Kanban", "Scrum", "XP"];
const statuses = ["not started", "in progress", "completed"];

const getStatusIcon = (status: string) => {
  switch (status) {
    case "completed":
      return <CheckCircle2 className="w-4 h-4" />;
    case "in progress":
      return <PlayCircle className="w-4 h-4" />;
    default:
      return <AlertCircle className="w-4 h-4" />;
  }
};

export default function ProjectDetailsCard({
  project,
  members,
  selectedMember,
  setSelectedMember,
  selectedMethodology,
  setSelectedMethodology,
  onStatusChange,
  onAddMember,
  loadingMembers,
}: Props) {
  return (
    <Card className="border shadow-sm rounded-xl overflow-hidden">
      <CardHeader className="p-6 border-b bg-card">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle className="text-xl font-semibold">
              {project.title}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Project overview & controls
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm">
              {getStatusIcon(project.status)}
              <span className="text-muted-foreground">Status</span>
            </div>
            <Select value={project.status} onValueChange={onStatusChange}>
              <SelectTrigger className="w-44">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((status) => (
                  <SelectItem
                    key={status}
                    value={status}
                    className="capitalize"
                  >
                    <div className="flex items-center gap-2">
                      {getStatusIcon(status)}
                      {status}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        <div className="rounded-lg border p-4 bg-muted/20">
          <h3 className="font-medium flex items-center gap-2 text-sm">
            <Settings className="w-4 h-4 text-muted-foreground" />
            Project Description
          </h3>
          <p className="text-sm text-muted-foreground mt-2 leading-6">
            {project.description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="shadow-none border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-md bg-muted">
                  <Calendar className="w-4 h-4" />
                </div>
                <h3 className="font-medium">Start Date</h3>
              </div>
              <p className="text-lg font-semibold">
                {format(new Date(project.startDate), "EEE, MMM d, yyyy")}
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-none border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-md bg-muted">
                  <Clock className="w-4 h-4" />
                </div>
                <h3 className="font-medium">End Date</h3>
              </div>
              <p className="text-lg font-semibold">
                {format(new Date(project.endDate), "EEE, MMM d, yyyy")}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-none border">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-md bg-muted">
                  <Settings className="w-4 h-4" />
                </div>
                <h3 className="font-medium">Methodology</h3>
              </div>

              <Select
                value={selectedMethodology || ""}
                onValueChange={setSelectedMethodology}
              >
                <SelectTrigger className="w-full sm:w-56">
                  <SelectValue placeholder="Select methodology" />
                </SelectTrigger>
                <SelectContent>
                  {methodologies.map((m) => (
                    <SelectItem key={m} value={m} className="capitalize">
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-none border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-md bg-muted">
                <Users className="w-4 h-4" />
              </div>
              <h3 className="font-medium">Team Members</h3>
              <Badge variant="secondary" className="ml-auto">
                {project.members.length}{" "}
                {project.members.length === 1 ? "member" : "members"}
              </Badge>
            </div>

            {project.members.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                {project.members.map((member) => (
                  <div
                    key={member._id}
                    className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/30 transition-colors"
                  >
                    <Avatar className="w-9 h-9">
                      <AvatarImage
                        src={member?.profilePicture?.url || "/placeholder.svg"}
                        alt={member?.name}
                      />
                      <AvatarFallback>
                        {member?.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="font-medium truncate">{member.name}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        Team member
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground mb-4">
                No team members assigned yet.
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 p-3 rounded-lg border border-dashed">
              <Select
                value={selectedMember || ""}
                onValueChange={setSelectedMember}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue
                    placeholder={
                      loadingMembers
                        ? "Loading members..."
                        : "Select member to add"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {members
                    .filter(
                      (m) => !project.members.some((pm) => pm._id === m._id)
                    )
                    .map((member) => (
                      <SelectItem key={member._id} value={member._id}>
                        <div className="flex items-center gap-2">
                          <Avatar className="w-5 h-5">
                            <AvatarImage
                              src={
                                member.profilePicture?.url || "/placeholder.svg"
                              }
                              alt={member.name}
                            />
                            <AvatarFallback className="text-[10px]">
                              {member.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          {member.name}
                        </div>
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>

              <Button
                onClick={onAddMember}
                disabled={!selectedMember}
                className="sm:w-40"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add member
              </Button>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}
