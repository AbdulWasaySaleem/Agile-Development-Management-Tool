"use client";

import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { ShieldCheck } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  role: string;
  setRole: (r: string) => void;
  onApprove: () => void;
  userName: string;
}

const ROLE_OPTIONS = [
  { value: "admin", label: "Admin" },
  { value: "senior_developer", label: "Senior Developer" },
  { value: "junior_developer", label: "Junior Developer" },
  { value: "HR", label: "HR" },
];

export default function ApproveDialog({
  open,
  onOpenChange,
  role,
  setRole,
  onApprove,
  userName,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-emerald-600" />
            Approve User
          </DialogTitle>
          <DialogDescription className="text-sm">
            Assign a role to <span className="font-medium text-foreground">{userName}</span> and approve.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-2">
          <label className="text-sm font-medium">Role</label>
          <Select value={role} onValueChange={setRole}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              {ROLE_OPTIONS.map(r => (
                <SelectItem key={r.value} value={r.value}>
                  {r.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onApprove}>
            Approve
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
