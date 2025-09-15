"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import MembersMultiSelect from "./MembersMultiSelect";
import {
  ProjectFormData,
  projectValidation,
} from "@/validations/projectValidation";
import { toast } from "react-hot-toast";
import { getErrorMessage } from "@/app/lib/validationHelper";

interface Member {
  _id: string;
  name: string;
}

export default function AddProjectDialog({
  onAdd,
  members,
  loadingMembers,
}: {
  onAdd: (form: ProjectFormData) => void;
  members: Member[];
  loadingMembers: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState<ProjectFormData>({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    status: "Not Started",
    methodology: "",
  });
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  const handleSubmit = () => {
    try {
      const validated = projectValidation.parse({
        ...form,
        members: selectedMembers,
      });

      onAdd(validated);
      setIsOpen(false);
      setForm({
        title: "",
        description: "",
        startDate: "",
        endDate: "",
        status: "Not Started",
        methodology: "",
      });
      setSelectedMembers([]);
    } catch (err: unknown) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-xl shadow-sm">+ Add New Project</Button>
      </DialogTrigger>

      {/* Responsive Modal */}
      <DialogContent className="w-[95%] max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl mx-auto rounded-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl font-semibold">
            Add New Project
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3 sm:space-y-4">
          <Input
            placeholder="Project Title *"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="text-sm sm:text-base"
          />
          <Textarea
            placeholder="Project Description *"
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="text-sm sm:text-base"
          />

          {/* Dates stacked on mobile, side by side on larger screens */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Input
              type="date"
              value={form.startDate}
              onChange={(e) => setForm({ ...form, startDate: e.target.value })}
              className="text-sm sm:text-base"
            />
            <Input
              type="date"
              value={form.endDate}
              onChange={(e) => setForm({ ...form, endDate: e.target.value })}
              className="text-sm sm:text-base"
            />
          </div>

          <Select
            value={form.status}
            onValueChange={(v) => setForm({ ...form, status: v })}
          >
            <SelectTrigger className="text-sm sm:text-base">
              <SelectValue placeholder="Select Status *" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Not Started">Not Started</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={form.methodology}
            onValueChange={(v) => setForm({ ...form, methodology: v })}
          >
            <SelectTrigger className="text-sm sm:text-base">
              <SelectValue placeholder="Select Methodology" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Scrum">Scrum</SelectItem>
              <SelectItem value="Kanban">Kanban</SelectItem>
              <SelectItem value="Waterfall">Waterfall</SelectItem>
            </SelectContent>
          </Select>

          <MembersMultiSelect
            members={members}
            selected={selectedMembers}
            setSelected={setSelectedMembers}
            loading={loadingMembers}
          />
        </div>

        {/* Buttons stack on mobile, inline on larger screens */}
        <DialogFooter className="mt-4 flex flex-col-reverse sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            className="rounded-xl w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="rounded-xl w-full sm:w-auto"
          >
            Add Project
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
