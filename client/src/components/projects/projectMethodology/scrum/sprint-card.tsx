"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Trash2 } from "lucide-react";
import dayjs from "dayjs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Sprint {
  _id: string;
  name: string;
  startDate: string;
  endDate: string;
}

interface SprintCardProps {
  sprint: Sprint;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
}

export function SprintCard({
  sprint,
  isSelected,
  onSelect,
  onDelete,
}: SprintCardProps) {
  const startDate = dayjs(sprint.startDate);
  const endDate = dayjs(sprint.endDate);
  const now = dayjs();

  const isActive = now.isAfter(startDate) && now.isBefore(endDate);
  const isUpcoming = now.isBefore(startDate);
  const isCompleted = now.isAfter(endDate);

  const getStatusBadge = () => {
    if (isActive) return <Badge variant="default">Active</Badge>;
    if (isUpcoming) return <Badge variant="secondary">Upcoming</Badge>;
    if (isCompleted) return <Badge variant="outline">Completed</Badge>;
    return null;
  };

  return (
    <Card
      className={`cursor-pointer transition-all hover:shadow-md ${
        isSelected ? "ring-2 ring-primary" : ""
      }`}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start gap-2">
          <CardTitle className="text-base line-clamp-1" onClick={onSelect}>
            {sprint.name}
          </CardTitle>
          <div className="flex items-center gap-1">
            {getStatusBadge()}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Sprint</AlertDialogTitle>
                  <AlertDialogDescription>
                    {`Are you sure you want to delete "${sprint.name}"? This action cannot be undone.`}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={onDelete}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardHeader>
      <CardContent onClick={onSelect}>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>
            {startDate.format("MMM DD")} - {endDate.format("MMM DD, YYYY")}
          </span>
        </div>
        <div className="mt-2 text-xs text-muted-foreground">
          Duration: {endDate.diff(startDate, "day")} days
        </div>
      </CardContent>
    </Card>
  );
}
